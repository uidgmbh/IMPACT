<?php
/**
 * Importer for data from Argument Reconstruction Tool (ART) in IMPACT project
 *
 * This class holds the behaviour for importing argumentation data from the
 * Argument Reconstruction Tool (ART) in the IMPACT project.
 *
 * @author Neil Benn
 * @todo XXX This is a temporary hack for IMPACT. Remove from core Cohere.
 */
class ArtImporter {

	private $issue_node_type;
	private $statement_node_type;
	private $argument_node_type;
  private $agent_link_type;
  private $circumstance_link_type;
  private $consequence_link_type;
  private $value_link_type;
	private $premise_link_type;
	private $conclusion_link_type;
  private $privatedata;
  private $connectionset;
  private $pdo;


  public function __construct() {
    global $USER, $CFG, $DB;

    // Add new node-types (i.e. roles) if they don't exist
    $this->issue_node_type = addRole('Issue');
    $this->statement_node_type = addRole('Statement');
    $this->argument_node_type = addRole('Argument');

    // Add new link-types if they don't exist
    $this->addresses_link_type = addLinkType('addresses', 'Neutral');
    $this->circumstance_link_type = addLinkType('circumstance', 'Neutral');
    $this->consequence_link_type = addLinkType('consequence', 'Neutral');
    $this->value_link_type = addLinkType('value', 'Neutral');
    $this->premise_link_type = addLinkType('has_premise', 'Neutral');
    $this->conclusion_link_type = addLinkType('has_conclusion', 'Neutral');

    $this->privatedata = $USER->privatedata;

    // Create temp DB tables for storing ART ID to Cohere ID mappings
    $dbhost = $CFG->databaseaddress;
    $dbname = $CFG->databasename;
    $dbuser = $CFG->databaseuser;
    $dbpass = $CFG->databasepass;
    $dsn = "mysql:host={$dbhost};dbname={$dbname}";

    $this->pdo = new PDO($dsn, $dbuser, $dbpass);
    $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $this->pdo->exec('CREATE TABLE IF NOT EXISTS Mappings (' .
               '  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,' .
               '  art_id TEXT,' .
               '  cohere_id TEXT)');

    $this->pdo->exec('CREATE TABLE IF NOT EXISTS Arguments_Statements (' .
               '  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,' .
               '  argument_id TEXT,' .
               '  statement_id TEXT)');

    $this->pdo->exec('CREATE TABLE IF NOT EXISTS Issues_Arguments (' .
               '  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,' .
               '  issue_id TEXT,' .
               '  argument_id TEXT)');

    $this->pdo->exec('CREATE TABLE IF NOT EXISTS IMPACT_Arguments_Contributors (' .
               '  cohere_id VARCHAR(255) NOT NULL PRIMARY KEY,' .
               '  contributor_name TEXT)');

  }

  public function __destruct() {
    $this->pdo = null;
  }

  /**
   * Method to import given JSON string of argument data
   *
   * The argumentation data represents the arguments that respond to a single
   * issue. This issue should already be stored in the Cohere database,
   * otherwise an Exception is thrown.
   *
   * @param string $json_string JSON string of argument data
   * @return ConnectionSet A ConnectionSet object of imported connections
   * @throws Exception
   */
  public function import($json_string) {

    $connections = array();
    $json_object = json_decode($json_string);


    $issue = $json_object->issue;

    if (! getNode($issue->id) instanceof CNode) {
      $this->connectionset = new ConnectionSet($connections);
      $this->connectionset->num_imported = 0;
      return $this->connectionset;
    }

    // First get a list of previously stored ART argument IDs so we can
    // compare to argument IDs currently be imported to determine if any
    // arguments have been removed from ART since last import.
    $previous_argument_ids = $this->findArtArgumentIdsByIssueId($issue->id);
    $current_argument_ids = array();

    $responses = $json_object->responses;
    $num_imported = 0;

    foreach ($responses as $response) {
      if ($response->argument->scheme === 'practical_reasoning_as' ||
          $response->argument->scheme === 'Practical Reasoning') {
        $connections = array_merge(
          $connections, $this->importArgument($response->argument, $issue));
        $num_imported += 1;
        $current_argument_ids[] = $response->argument->id;
      }
    }

    // If arguments have been removed from ART then remove them from here as
    // well
    $deleted_argument_ids = array_diff(
      $previous_argument_ids, $current_argument_ids);

    foreach ($deleted_argument_ids as $argument_id) {
      $this->deleteArtArgument($argument_id);
      $this->deleteArtIssueArgumentRelation($issue->id, $argument_id);
    }


    // Return imported data as Cohere ConnectionSet object
    $this->connectionset = new ConnectionSet($connections);

    // XXX Add new attribute to ConnectionSet that gives count of arguments
    // imported
    $this->connectionset->num_imported = $num_imported;

    return $this->connectionset;
  }

  private function importArgument($argument, $issue) {
    $conclusion = $argument->conclusion;
    $statement = $conclusion->statement;
    $connections = array();

    // If we have already imported this argument then erase Cohere data and
    // reimport
    $cohere_id = $this->findCohereIdByArtId($argument->id);
    if ($cohere_id) {
      deleteNode($cohere_id);
      $this->deleteIdMapping($argument->id, $cohere_id);
    }

    $argument_node = addNode(
      $statement->text, $statement->quote, $this->privatedata,
      $this->argument_node_type->roleid);

    $connections[] = addConnection(
      $argument_node->nodeid, $this->argument_node_type->roleid,
      $this->addresses_link_type->linktypeid, $issue->id,
      $this->issue_node_type->roleid);

    $this->storeIdMapping($argument->id, $argument_node->nodeid);
    $this->storeArtIssueArgumentRelation($issue->id, $argument->id);
    $this->storeArgumentContributor($argument_node->nodeid, $statement->contributor);

    foreach ($argument->premises as $premise) {
      if (! empty($premise->statement->text)) {

        $new_connection = $this->importPremise($premise, $argument_node);
        if ($new_connection) {
          $connections[] = $new_connection;
        }

        $this->storeArtArgumentStatementRelation($argument->id, $premise->statement->id);
      }
    }

    return $connections;
  }

  private function importPremise($premise, $argument_node) {
    $statement = $premise->statement;

    // If we have already imported this argument then erase Cohere data and
    // reimport
    $cohere_id = $this->findCohereIdByArtId($statement->id);
    if ($cohere_id) {
      deleteNode($cohere_id);
      $this->deleteIdMapping($statement->id, $cohere_id);
    }

    $node = addNode(
      $statement->text, $statement->quote, $this->privatedata,
      $this->statement_node_type->roleid);

    $this->storeIdMapping($statement->id, $node->nodeid);

    $premise_role = $statement->scheme_role;

    $link_type = $this->getLinkTypeFromPremiseRole($premise_role);

    return (empty($link_type)) ? false : addConnection(
      $argument_node->nodeid, $this->argument_node_type->roleid,
      $link_type->linktypeid, $node->nodeid,
      $this->statement_node_type->roleid);
  }

  /**
   * Method to retrieve Cohere link-type for given premise-role label
   *
   * Method looks up hard-coded mapping (in assocative array) of premise-roles
   * such as 'circumstance' and 'consequence' and returns corresponding Cohere
   * link-type object. If premise-role isn't mapped then it returns null
   *
   * @private
   * @param string $premise_role Name of the premise role e.g. 'circumstance'
   * @return LinkType|null Cohere link-type for the given premise role label or
   *     null
   */
  private function getLinkTypeFromPremiseRole($premise_role) {
    $premise_role = strtolower($premise_role);

    $premise_role_to_link_type_id = array(
      'circumstance'=>$this->circumstance_link_type,
      'circumstances'=>$this->circumstance_link_type,
      'consequence'=>$this->consequence_link_type,
      'consequences'=>$this->consequence_link_type,
      'value'=>$this->value_link_type,
      'values'=>$this->value_link_type);

    return (isset($premise_role_to_link_type_id[$premise_role])) ?
      $premise_role_to_link_type_id[$premise_role] :
      null;
  }


  /**
   * Method to persistently store mapping between ART ID and Cohere ID
   *
   * @private
   * @param string $art_id ART ID, which is stored as TEXT
   * @param string $cohere_id Cohere ID, which is stored as TEXT
   */
  private function storeIdMapping($art_id, $cohere_id) {

    $stmnt = $this->pdo->prepare('INSERT INTO Mappings' .
                           '  (art_id, cohere_id)' .
                           '  VALUES' .
                           '  (:art_id, :cohere_id)');

    $stmnt->bindParam(':art_id', $art_id, PDO::PARAM_STR);
    $stmnt->bindParam(':cohere_id', $cohere_id, PDO::PARAM_STR);
    $stmnt->execute();
  }

  /**
   * Method to delete a given ART-to-Cohere mapping from DB table
   *
   * @access private
   * @param string $art_id ART ID
   * @param string $cohere_id Cohere ID
   */
  private function deleteIdMapping($art_id, $cohere_id) {

    $stmnt = $this->pdo->prepare('DELETE FROM Mappings' .
                                 '  WHERE art_id=:art_id' .
                                 '  AND cohere_id=:cohere_id');
    $stmnt->bindParam(':art_id', $art_id, PDO::PARAM_STR);
    $stmnt->bindParam(':cohere_id', $cohere_id, PDO::PARAM_STR);
    $stmnt->execute();
  }

  /**
   * Method to store ART statement ID related to an ART argument ID
   *
   * @access private
   * @param string $argument_id ART argument ID
   * @param string $statement_id Related ART statement ID
   */
  private function storeArtArgumentStatementRelation(
    $argument_id, $statement_id) {

    $stmnt = $this->pdo->prepare('INSERT INTO Arguments_Statements' .
                           '  (argument_id, statement_id)' .
                           '  VALUES' .
                           '  (:argument_id, :statement_id)');

    $stmnt->bindParam(':argument_id', $argument_id, PDO::PARAM_STR);
    $stmnt->bindParam(':statement_id', $statement_id, PDO::PARAM_STR);
    $stmnt->execute();
  }

  /**
   * Method to delete a given ART argument-to-statement ID relationship
   *
   * @access private
   * @param string $argument_id ART argument ID
   * @param string $statement_id Related ART statement ID
   */
  private function deleteArtArgumentStatementRelation(
    $argument_id, $statement_id) {

    $stmnt = $this->pdo->prepare('DELETE FROM Arguments_Statements' .
                                 '  WHERE argument_id=:argument_id' .
                                 '  AND statement_id=:statement_id');
    $stmnt->bindParam(':argument_id', $argument_id, PDO::PARAM_STR);
    $stmnt->bindParam(':statement_id', $statement_id, PDO::PARAM_STR);
    $stmnt->execute();
  }

  /**
   * Method to store ART argument ID related to an issue ID
   *
   * @access private
   * @param string $issue_id Issue ID
   * @param string $argument_id Related ART argument ID
   */
  private function storeArtIssueArgumentRelation($issue_id, $argument_id) {

    $stmnt = $this->pdo->prepare('INSERT INTO Issues_Arguments' .
                           '  (issue_id, argument_id)' .
                           '  VALUES' .
                           '  (:issue_id, :argument_id)');

    $stmnt->bindParam(':issue_id', $issue_id, PDO::PARAM_STR);
    $stmnt->bindParam(':argument_id', $argument_id, PDO::PARAM_STR);
    $stmnt->execute();
  }

  /**
   * Method to delete a given ART issue-to-argument ID relationship
   *
   * @access private
   * @param string $issue_id Issue ID
   * @param string $argument_id Related ART argument ID
   */
  private function deleteArtIssueArgumentRelation(
    $issue_id, $argument_id) {

    $stmnt = $this->pdo->prepare('DELETE FROM Issues_Arguments' .
                                 '  WHERE issue_id=:issue_id' .
                                 '  AND argument_id=:argument_id');
    $stmnt->bindParam(':issue_id', $issue_id, PDO::PARAM_STR);
    $stmnt->bindParam(':argument_id', $argument_id, PDO::PARAM_STR);
    $stmnt->execute();
  }

  private function findCohereIdByArtId($art_id) {
    $stmnt = $this->pdo->prepare('SELECT DISTINCT cohere_id FROM Mappings' .
                                 '  WHERE art_id=:art_id');
    $stmnt->bindParam(':art_id', $art_id, PDO::PARAM_STR);
    $stmnt->execute();

    return ($row = $stmnt->fetch()) ? $row['cohere_id'] : null;
  }

  private function findArtArgumentIdsByIssueId($issue_id) {
    $stmnt = $this->pdo->prepare('SELECT DISTINCT argument_id FROM Issues_Arguments' .
                                 '  WHERE issue_id=:issue_id');
    $stmnt->bindParam(':issue_id', $issue_id, PDO::PARAM_STR);
    $stmnt->execute();
    $records = $stmnt->fetchAll();

    $argument_ids = array();
    foreach ($records as $row) {
      $argument_ids[] = $row['argument_id'];
    }

    return $argument_ids;
  }

  private function findArtStatementIdsByArgumentId($argument_id) {
    $stmnt = $this->pdo->prepare('SELECT DISTINCT statement_id FROM Arguments_Statements' .
                                 '  WHERE argument_id=:argument_id');
    $stmnt->bindParam(':argument_id', $argument_id, PDO::PARAM_STR);
    $stmnt->execute();
    $records = $stmnt->fetchAll();

    $statement_ids = array();
    foreach ($records as $row) {
      $statement_ids[] = $row['statement_id'];
    }

    return $statement_ids;
  }

  /**
   * Method to delete ART argument and Corresponding Cohere argument data
   *
   * Method for deleting argument data if it has been removed from ART
   * tool. Method also deletes all statements of argument.
   *
   * @param string $art_id ID of argument in ART
   * @todo TODO Need to delete all statements of argument.
   */
  private function deleteArtArgument($art_argument_id) {
    $cohere_id = $this->findCohereIdByArtId($art_argument_id);
    deleteNode($cohere_id);
    $this->deleteIdMapping($art_argument_id, $cohere_id);

    $statement_ids = $this->findArtStatementIdsByArgumentId($art_argument_id);

    foreach ($statement_ids as $statement_id) {
      $cohere_id = $this->findCohereIdByArtId($statement_id);
      deleteNode($cohere_id);
      $this->deleteIdMapping($statement_id, $cohere_id);
      $this->deleteArtArgumentStatementRelation($art_argument_id, $statement_id);
    }
  }

  /**
   * Method to store ART contributor name related to a Cohere argument ID
   *
   * @access private
   * @param string $cohere_id Cohere argument ID
   * @param string $contributor_name Related contributor name
   */
  private function storeArgumentContributor($cohere_id, $contributor_name) {

    $stmnt = $this->pdo->prepare('REPLACE INTO IMPACT_Arguments_Contributors' .
                           '  (cohere_id, contributor_name)' .
                           '  VALUES' .
                           '  (:cohere_id, :contributor_name)');

    $stmnt->bindParam(':cohere_id', $cohere_id, PDO::PARAM_STR);
    $stmnt->bindParam(':contributor_name', $contributor_name, PDO::PARAM_STR);
    $stmnt->execute();
  }

  public function getArgumentContributor($cohere_id) {
    $stmnt = $this->pdo->prepare('SELECT contributor_name FROM IMPACT_Arguments_Contributors' .
                                 '  WHERE cohere_id=:cohere_id');
    $stmnt->bindParam(':cohere_id', $cohere_id, PDO::PARAM_STR);
    $stmnt->execute();

    return ($row = $stmnt->fetch()) ? $row['contributor_name'] : null;
  }
}

?>