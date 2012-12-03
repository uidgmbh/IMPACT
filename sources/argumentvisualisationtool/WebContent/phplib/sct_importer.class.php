<?php
/**
 * Importer for data from Structured Consultation Tool in IMPACT project
 *
 * This class holds the behaviour for importing survey-results data from the
 * SCT in the IMPACT project.
 *
 * @author Neil Benn
 * @todo XXX This is a temporary hack for IMPACT. Remove from core Cohere.
 */
class SctImporter {

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

    // Create temp DB tables for storing SCT ID to Cohere ID mappings
    $dbhost = $CFG->databaseaddress;
    $dbname = $CFG->databasename;
    $dbuser = $CFG->databaseuser;
    $dbpass = $CFG->databasepass;
    $dsn = "mysql:host={$dbhost};dbname={$dbname}";

    $this->pdo = new PDO($dsn, $dbuser, $dbpass);
    $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $this->pdo->exec('CREATE TABLE IF NOT EXISTS IMPACT_SCT_Votes (' .
               '  cohere_id VARCHAR(255) NOT NULL PRIMARY KEY,' .
               '  agree_votes INTEGER,' .
               '  disagree_votes INTEGER)');

  }

  public function __destruct() {
    $this->pdo = null;
  }

  /**
   * Method to import given JSON string of SCT results
   *
   * The SCT results represent the number of agree-votes and disagree-votes for
   * each statement in a given argument.
   *
   * @param string $json_string JSON string of argument data
   * @return Result
   * @throws Exception
   */
  public function import($json_string) {

    $json_object = json_decode($json_string);
    $id = $json_object->id;
    $cohere_id = $this->_findCohereIdByArtId('practical_reasoning_as-'.$id);

    if (empty($cohere_id)) {
      return new Result('sctimport', false);
    }

    $result = new stdClass();
    $result->argument_id = $cohere_id;
    $result->premises = array();

    $premises = $json_object->premises;

    foreach ($premises as $premise) {
      $id = $premise->statement->id;
      $cohere_id = $this->_findCohereIdByArtId('proposition-'.$id);

      if($cohere_id) {
        $agree_votes = $premise->statement->agree_votes;
        $disagree_votes = $premise->statement->disagree_votes;
        $this->_storeStatementVotes($cohere_id, $agree_votes, $disagree_votes);

        $result_premise = new stdClass();
        $result_premise->id = $cohere_id;
        $result_premise->agree_votes = $agree_votes;
        $result_premise->disagree_votes = $disagree_votes;
        $result->premises[] = $result_premise;
      }
    }

    return new Result('sctimport', $result);
  }

  public function getVotesByStatement($cohere_id) {
    $row = $this->_findVotesByStatement($cohere_id);

    if (empty($row)) {
      return new stdClass();
    }

    $votes = new stdClass();
    $votes->agree_votes = $row['agree_votes'];
    $votes->disagree_votes = $row['disagree_votes'];
    return $votes;
  }

  private function _storeStatementVotes(
    $cohere_id, $agree_votes, $disagree_votes) {
    
    $stmnt = $this->pdo->prepare('REPLACE INTO IMPACT_SCT_Votes' .
                           '  (cohere_id, agree_votes, disagree_votes)' .
                           '  VALUES' .
                           '  (:cohere_id, :agree_votes, :disagree_votes)');

    $stmnt->bindParam(':cohere_id', $cohere_id, PDO::PARAM_STR);
    $stmnt->bindParam(':agree_votes', $agree_votes, PDO::PARAM_INT);
    $stmnt->bindParam(':disagree_votes', $disagree_votes, PDO::PARAM_INT);
    $stmnt->execute();
  }

  private function _findCohereIdByArtId($art_id) {
    $stmnt = $this->pdo->prepare('SELECT DISTINCT cohere_id FROM Mappings' .
                                 '  WHERE art_id=:art_id');
    $stmnt->bindParam(':art_id', $art_id, PDO::PARAM_STR);
    $stmnt->execute();

    return ($row = $stmnt->fetch()) ? $row['cohere_id'] : null;
  }

  private function _findVotesByStatement($cohere_id) {
    $stmnt = $this->pdo->prepare('SELECT agree_votes, disagree_votes FROM IMPACT_SCT_Votes' .
                                 '  WHERE cohere_id=:cohere_id');
    $stmnt->bindParam(':cohere_id', $cohere_id, PDO::PARAM_STR);
    $stmnt->execute();

    return ($row = $stmnt->fetch()) ? $row : null;
  }
}

?>