<?php

// Giovanni: 17/08/2012

// all mysql functions (deprecated) to mysqli
// put explicit in procedural form

// added default values on the sql tables: this is not good. It means that the logic before recording is not the clearest.
//  * ART_text_section_combinations -- combination_id -- NULL as default value 
//  * agent -- relation_id -- NULL as default value 
//  * action -- relation_id -- NULL as default value 
//  * proposition -- relation_id -- NULL as default value 
//  * credible_source_as -- datetime -- NULL as default value
//  * credible_source_as -- relation_id -- NULL as default value
//  * conjuction -- datetime -- NULL as default value
//  * conjuction -- relation_id -- NULL as default value
//  * domain -- datetime -- NULL as default value
//  * domain -- relation_id -- NULL as default value
//  * domain_source -- datetime -- NULL as default value
//  * domain_source -- relation_id -- NULL as default value
//  * domain_proposition - datetime -- NULL as default value
//  * domain_proposition -- relation_id -- NULL as default value
//  * prop_occurrence -- datetime -- NULL as default value
//  * prop_occurrence -- relation_id -- NULL as default value
//  * value -- relation_id -- NULL as default value 
//  * value_occurrence -- datetime -- NULL as default value
//  * value_occurrence -- relation_id -- NULL as default value
//  * value_recognition_as -- datetime -- NULL as default value
//  * value_recognition_as -- relation_id -- NULL as default value
//  * practical_reasoning_as -- relation_id -- NULL as default value
//  * source -- datetime -- NULL as default value
//  * source -- relation_id -- NULL as default value
//  * source_proposition -- datetime -- NULL as default value
//  * source_proposition -- relation_id -- NULL as default value
// added default values here before the insert 
//  * datetime in storeRelation inserted as NOW

// to do: check all mysqli_real_escape, why sometimes yes, and sometimes not?

// define("STORAGE_LOG_FILE", "storage.log");
define("STORAGE_LOG_FILE", "");

log_message(STORAGE_LOG_FILE, "included class.storage.php");
		
/**
The Storage class servers as a layer on top of a storage mechanism, in this case a MySQL database. When using a different database (structure), only this file should be modified. As long as all functions remain having the same functionality (name, paramters, output), no other part of the application has to be changed.

All functions that have parameters that have to be copied into a MySQL query are escaped with the mysqli_real_escape_string($this->resource, ) function, as a security measure against malicious MySQL statements.

This class consists of these parts, in this order:
- Basic class definitions
- Fetch functions
- Store functions
- Update functions
*/
class Storage {

	/***************************
	 * Basic class definitions *
	 ***************************/

	/**
		Resource for the database connection
	*/
	private $resource;
	private $relationReader;
	
	/**
		The constructor connects to the database and uses the parameters for that. It also instantiates the private global relationReader object so that the argument schemes are available in every function of this class.
		@param string $host The host of the database
		@param string $db The database
		@param string $user The username
		@param string $password The password
	*/
	public function __construct($host,$db,$user,$password){
		log_message(STORAGE_LOG_FILE, "building Storage object.");
		$this->connect($host, $db, $user, $password);
		$this->relationReader = new relationReader();
		log_message(STORAGE_LOG_FILE, "Storage object built.");
	}
	
	/**
		Private function that catually establishes a connection
	*/
	private function connect($host, $db, $user, $password){
    log_message(STORAGE_LOG_FILE, "starting connection with $db");
		$this->resource = mysqli_connect($host, $user, $password);
		log_message(STORAGE_LOG_FILE, "connection successful");
		log_message(STORAGE_LOG_FILE, "selecting charset utf8..");
		mysqli_set_charset($this->resource, 'utf8');
		log_message(STORAGE_LOG_FILE, "selecting database $db..");
		mysqli_select_db($this->resource, $db);
		log_message(STORAGE_LOG_FILE, "database $db selected.");
	}

	/**
		This function closes the MySQL connection.
	*/
	public function destroy(){
		mysqli_close($this->resource);
	}

	/*******************
	 * Fetch functions *
	 *******************/
	
	/**
		Fetch all discussions
	*/
	public function fetchDiscussions(){
		if(mysqli_ping($this->resource)){
			$result = array();
			$r = mysqli_query(
				$this->resource,
				"SELECT * FROM ART_discussions" 
			) or trigger_error(mysqli_error($this->resource));
			while($row = mysqli_fetch_assoc($r)){
				$result[] = $row;
			}
			return $result;
		}
		return false;
	}
	/**
		Fetch the relations belonging to the discussion with the given ID. Non-recursive function: only fetches the directly underlying elements. (see fetchRelationDetails for recursive relation retrieval). Does not fetch relation objects, but the associative array representation.
		@param integer $discussionID
	*/
		public function fetchRelationsDEPRECATED($discussionID){
		if(!$discussionID || intval($discussionID) == 0)	return false;
		$discussionID = mysqli_real_escape_string($this->resource, $discussionID);
		if(mysqli_ping($this->resource)){
			$relationAttrs = $this->relationReader->getRelations(true);
			$result = array();
			
			foreach($relationAttrs as $relationAttr){
				$relationType = mysqli_real_escape_string($this->resource, $relationAttr['attributes']['type']);
				//select all relations that belong to the given discussion
				
				/* $query = "SELECT relation_id ".
					       "FROM ART_relations_discussions ".					     
					       "WHERE discussion = ".$discussionID." ".				     
					       "AND relation_sort = '".$relationType."'";
				log_message(STORAGE_LOG_FILE, "Query: $query");
				$res = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));
				while($row = mysqli_fetch_assoc($res)) {
				   log_message(STORAGE_LOG_FILE, "Dui dui ".print_r($row, true));
				} */
				
                                $query = "SELECT $relationType.".$relationType."_id , tsc_id ".
					     "FROM `".$relationType."`, ".
					       "(SELECT relation_id ".
					       "FROM ART_relations_discussions ".					     
					       "WHERE discussion = ".$discussionID." ".				     
					       "AND relation_sort = '".$relationType."') AS relations_discussions ".
					     "WHERE ".$relationType."_id = relations_discussions.relation_id";
				log_message(STORAGE_LOG_FILE, "Query: $query");
				$r = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));
				while($row = mysqli_fetch_assoc($r)){
				  $row['type'] = $relationType;
				  $row['id'] = $row[$relationType."_id"];
				  if($row['tsc_id']) {
					$row['text_sections'] = $this->fetchTextSectionCombination($row['tsc_id']);
				  }
				  $result[] = $row;
 				  log_message(STORAGE_LOG_FILE, "Row: ".print_r($row, true));
				}
			}
			return $result;
		}
		return false;
	}

  /**
   * This function is made for the export to the SCT. It fetches the 
   * discussions that has the specified issueID (these issueID's should be the 
   * ones that actually represent a green paper question). It returns an 
   * associative array representing the issues in a way that is coherent with 
   * the specification of TR2.3a.
   * @param {string} $issueID ID of the issue that has to be fetched.
   **/
  public function fetchIssueDEPRECATED($issueID){
    $result = array();
    $db = new Database();
    $issueID = mysqli_real_escape_string($this->resource, $issueID);
    /*$query = "SELECT *
                FROM ART_discussions
               WHERE issue_id = $issueID";
    $resource = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));
    $discussion = mysqli_fetch_assoc($resource); //should be only one.
     */ 
    $discussion = $db->select("ART_discussions", array('issue_id' => $issueID));
    if(count($discussion) == 1){
      //everything went well, the discussion was found
      $discussion = $discussion[0];
    } else {
      show_error("This issue was not found");
    }

    //Fill the first index, ['issue']
    $issueData = array(
        'id' => $discussion['issue_id'],
        'text' => $discussion['title']." ".$discussion['intro'],
        'creator' => 'Bernd Groeninger--Policy Analyst',
        'source' => '<Not yet implemented>'
        );
    $result['issue'] = $issueData;
    
    //Fill the second index, ['responses']
    $responsesData = array();
    $relations = $this->fetchRelations($discussion['id']);
    foreach($relations as $relation){
      $argument = array();
      //if this is an actual argument scheme...
      if(substr($relation['type'], -2) == 'as'){
        //^$rel = new Relation($this);
        //^$relDetails = $rel->interpret($relation['type'], $relation['id']);
        $rel = new Relation(null, $this->db);
        $argument['id'] = $relation['type']."-".$relation['id'];
        $rel->load($argument['id']);
        $relDetails = $rel->getData();
        $relDetails = $relDetails['relation']; //strip off the root 'relation' index
        $argument['scheme'] = $relation['type'];//todo: a more descriptive value here?
        $argument['conclusion'] = array();
        //$elements = $this->relationReader->getRelationElements($relation['type'], true);
        $premises = array();
        foreach($relDetails['elements'] as $element){
          $statement = array();
          if(!isset($element['conjuncts'])){
            $statement['id'] = $element['type']."-".$element['id'];
            $statement['scheme_role'] = $element['type'];
            if(isset($element['text_sections'][0])){
              $statement['text'] = $element['text_sections'][0]['text'];
              if(isset($element['text_sections'][0]['quote'])){
                $statement['quote'] = $element['text_sections'][0]['quote'];
              }
            }
          } else {
            //code copied from above and altered (not elegant). Also todo: support for several conjuncts.
            $statement['id'] = $element['conjuncts'][0]['type']."-".$element['conjuncts'][0]['id'];
            $statement['scheme_role'] = $element['type'];
            if(isset($element['conjuncts'][0]['text_sections'][0])){
              $statement['text'] = $element['conjuncts'][0]['text_sections'][0]['text'];
              if(isset($element['conjuncts'][0]['text_sections'][0]['quote'])){
                $statement['quote'] = $element['conjuncts'][0]['text_sections'][0]['quote'];
              }
            }
          }
          $statement['contributor'] = "The Software & Information Industry Association";
          $statement['creator'] = 'Bernd Groeninger--Policy Analyst';
          //todo this is ugly hard-coding: ALTER!!!
          if($statement['scheme_role'] == 'action' || $statement['scheme_role'] == 'proposition'){
            $conclusion = array("statement" => $statement);
          } else {
            $premises[] = array("statement" => $statement);
          }
        }
        $argument['premises'] = $premises;
        $argument['conclusion'] = $conclusion;
        $argument['contributor'] = "The Software & Information Industry Association";
        $argument['creator'] = 'Bernd Groeninger--Policy Analyst';
        $argument['source'] = '';
      }
      if(count($argument) != 0){
        $responsesData[] = array("argument" => $argument);
      }
    }
    $result['responses'] = $responsesData;
    return $result;
  }
	
	/**
		Fetch all text sections associated to a text_section_combination.
		@param integer $tscID ID of the text section combination
		@since 21 June 2012
	*/
	public function fetchTextSectionCombinationDEPRECATED($tscID){
		$result = array();
		$query = "SELECT ts.* 
								FROM ART_text_sections AS ts, 
										 ART_text_section_combinations AS tsc
							 WHERE tsc.combination_id = ".$tscID."
								 AND ts.id = tsc.text_section_id" or trigger_error(mysqli_error($this->resource));
    //echo $query;//debug
		$resource = mysqli_query($this->resource, $query);
		while ($row = mysqli_fetch_assoc($resource)){
      //print_r($row);//debug
      if($row['document_id']){
        $query2 = "SELECT text
                     FROM ART_documents
                    WHERE id=".$row['document_id'];
        $resource2 = mysqli_query($this->resource, $query2) or trigger_error(mysqli_error($this->resource));
        $row2 = mysqli_fetch_array($resource2);
        $row['quote'] = substr($row2['text'], $row['start_offset'], ($row['end_offset']-$row['start_offset']));
      }
			$result[] = $row;
		}
		return $result;
	}

	/**
		Fetch all text sections
	*/
	public function fetchTextSections(){
		if(mysqli_ping($this->resource)){
			$result = array();
			$r = mysqli_query(
				$this->resource,
				"SELECT * FROM ART_text_sections"
			) or trigger_error(mysqli_error($this->resource));
			while($row = mysqli_fetch_assoc($r)){
				$result[] = $row;
			}
			return $result;
		}
		return false;
	}

	/**
		Fetch the details of the discussion with the given ID.
		@param int $discussionID
	*/
	public function fetchDiscussionDetails($discussionID){
		if(!$discussionID || intval($discussionID) == 0)
			return false;
		$query = "SELECT * FROM ART_discussions WHERE id = %d";
		$r = mysqli_query(
			$this->resource,
			sprintf($query, mysqli_real_escape_string($this->resource, $discussionID))
		) or trigger_error(mysqli_error($this->resource));
		return mysqli_fetch_assoc($r);
	}

	/**
		Fetch relation details of the relation with the given ID and type. Returns the structure of the relation as it is stored in a database in an associative array. Rercursive function. Returns false when (one of the) the arguments is not given, or when the relation can not be found in the database.
		@param string $relationType Type of the relation (so NOT the type of the conjuncts of this relation, if any)
		@param string $relationID ID of the relation (so NOT of the conjuncts of this relation, if any)
    @param array $localDBStructures When this option is not given, the general DB structures, as specified in the XML file, are taken into account. Otherwise, this structure is taken as DB structure.
	*/
	public function fetchRelationDetails($relationType, $relationID, $localDBStructure = null){
    //echo "START fetchRelationDetails with type ".$relationType.": \n"; //debug
    //print_r($localDBStructure);
    //initialise variables and perform checks on arguments
    $result = array();
		if(!$relationID || !$relationType) return false;
		foreach(array('relationID', 'relationType') as $field){
			${$field} = mysqli_real_escape_string($this->resource, ${$field});
		}
    //Get the structure of the elements of the relation as they are stored in the DB, if none is given yet as a parameter (in which case this is a recursion call).
    if($localDBStructure == null){
      $DBStructure = $this->relationReader->getRelation($relationType, false);//was: getRelationElements
    } else {
      $DBStructure = $localDBStructure;
    }
    //echo "\$DBStructure:\n";//debug
    //print_r($DBStructure);//debug

    //Get the type a bunch of information from the DB for this relation, and store them in the result.
    //echo " Set result[type] to $relationType\n"; //debug
    $result['type'] = $relationType;//$DBStructures['attributes']['type'];
    //Get the data out of the right table, thereby retrieving all relation details except the elements
    $result = array_merge($result, $this->_fetchRelationTableDetails($relationType, $relationID));

    if(isset($DBStructure['value']) && $DBStructure['value'] != ""){
      //apparently there are elements, so iterate over them.
      foreach($DBStructure['value'] as $DBElement){
        //recursion step: retrieve the full details for this element by calling this function again
        $elementType = $DBElement['attributes']['type'];
        if(isset($DBElement['attributes']['arity'])){
          $arity = $DBElement['attributes']['arity'];
        } else {
          $arity = 1;
        }
        if($arity == 1){
          //Arity is 1, so recursion step is not very complicated
          //if the stop condition is not met, execute the recursion step.
          $elementID = $result[$elementType];
              //echo " arity 1 recursion step:\n"; //debug
          $element = $this->fetchRelationDetails($elementType, $elementID, $DBElement);
        } else if($arity == 'n'){
          //$elementType = $DBStructure['attributes']['elementType'];
          //retrieve names of conjunction table names from the XML structure
          $conjunctiontable = $DBElement['attributes']['conjunctiontable'];
          $occurrencetable = $DBElement['attributes']['occurrencetable'];
          $conjunctType = $DBElement['attributes']['conjuncttype'];
 
          $query = "SELECT $conjunctType.*, $relationType.{$elementType} FROM $relationType, $conjunctiontable, $occurrencetable, $conjunctType
            WHERE $relationType.{$relationType}_id = $relationID
            AND $relationType.{$elementType} = $conjunctiontable.${conjunctiontable}_id
            AND $occurrencetable.{$conjunctiontable} = $conjunctiontable.${conjunctiontable}_id
            AND $occurrencetable.$conjunctType = $conjunctType.${conjunctType}_id";

          $resource = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));

      //retrieve conjunction
      //$conjunctionquery = "SELECT * FROM $conjunctiontable WHERE {$conjunctiontable}_id = ".$result[$type];
      //$conjunctionresource = mysqli_query($conjunctionquery) or trigger_error(mysqli_error());
      //$conjunctionrow = mysqli_fetch_assoc($conjunctionresource);
      //$conjunction_id = $conjunctionrow['conjunction_id'];
      //retrieve conjunct
      //$occurrencequery = "SELECT * FROM $occurrencetable WHERE ".$occurrencetable."_id = ".$conjunction_id;
      //$occurrenceresource = mysqli_query($occurrencequery) or trigger_error(mysqli_error());
      //iterate over the conjuncts

          //for every found conjunct...
          while($occurrencerow = mysqli_fetch_assoc($resource)){
            //...perform the recursive procedure.
            $conjunctID = $occurrencerow[$conjunctType."_id"];
            //echo "\$occurrencerow:\n"; //debug
            //print_r($occurrencerow); //debug
            if(isset($DBStructure['value'])){ //if the stop condition is not met, execute the recursion step for this conjunct.
              //echo " arity n recursion step:\n"; //debug
              $conjunct = $this->fetchRelationDetails($conjunctType, $conjunctID, $DBStructure['value']);
            }
            //$conjunct['reftype'] = $type; //removed in favor of simly "type" on the toplevel of the relation.
            $conjunction[] = $conjunct;
          }
          $element['conjuncts'] = $conjunction;

          //$conjunctType = $DBStructure['attributes']['conjuncttype'];
        } else {//there is no correct arity
          trigger_error("Arity error");
        }
        $element['type'] = $DBElement['attributes']['type'];
        $element[$elementType.'_id'] = $relationID;
        if(isset($DBElement['attributes']['name'])){
          $element['name'] = $DBElement['attributes']['name'];
        }
        //store the new element in the elements of the result
        $result['elements'][] = $element;
        //clear the $elements and $conjunction arrays in order not to interfere with the next loop.
        $element = array();
        $conjunction = array();
      }
    }
    //echo "END fetchRelationDetails (type ".$relationType.")\n"; //debug
    return $result;
	}

  /** Gets the details of a relation directly out of the table. Presumes the relation is stored in the database table with name $type.
    @param string $type Type of the relation
    @param string $id ID of the relation
  */
  private function _fetchRelationTableDetails($relationType, $relationID){
    $result = array();
    $query = "SELECT * FROM $relationType
              WHERE ".$relationType."_id = '$relationID'";
    $r = mysqli_query($this->resource, $query) or trigger_error(mysqli_error()."; Query was: $query\n");
    $result = array_merge($result, mysqli_fetch_assoc($r));
    if(!$result) return false; //relation not found.
    $result['id'] = $result[$relationType."_id"];
    if($result['tsc_id']){
      $result['text_sections'] = $this->fetchTextSectionCombination($result['tsc_id']);
    } elseif(isset($result[$relationType."_name"])){
      $result['text_sections'][0]['text'] = $result[$relationType."_name"];
    } elseif(isset($result[$relationType."_string"])){
      $result['text_sections'][0]['text'] = $result[$relationType."_string"];
    }
    return $result;
  }

	/**
		Fetch an element of a relation by it's type.
		@param int $relationID
		@param int $type
	*/
	public function fetchRelationElementByType($relationID, $type){
		if(!$relationID || intval($relationID) == 0)
			return false;
		if(!$type || strlen($type) > 255 || $type = "")
			return false;

		if(mysqli_ping($this->resource)){
			$query = "SELECT * FROM RelationElement WHERE relation = %d AND type  = '%s'";
			$r = mysqli_query(
				$this->resource, 
				sprintf(
					$query, 
					mysqli_real_escape_string($this->resource, $relationID),
					mysqli_real_escape_string($this->resource, $type)
				)
			) or trigger_error(mysqli_error($this->resource));
			return mysqli_fetch_assoc($r);
		}
		return false;
	}

	/**
		Fetch all elements of the relation with the given ID
		@param int $relationID
	*/
	private function fetchRelationElements($relationID){
		if(!$relationID || intval($relationID) == 0)
			return false;
		if(mysqli_ping($this->resource)){
			$result = array();
			$query = "SELECT * FROM RelationElement WHERE relation = %d";
			$r = mysqli_query(
			  $this->resource,
			  sprintf($query, mysqli_real_escape_string($this->resource, $relationID))
			) or trigger_error(mysqli_error($this->resource));
			while($row = mysqli_fetch_assoc($r)){
				$row['text_element'] = $this->fetchTextSection($row['text_element']);
				$result[$row['type']] = $row;
			}
			return $result;
		}
		return false;
	}

	/**
		Fetch the text section with the given ID
		@param int $textSectionID
	*/
	private function fetchTextSection($textSectionID){
		if(!$textSectionID || intval($textSectionID) == 0)
			return false;
		if(mysqli_ping($this->resource)){
			$query = "SELECT * FROM ART_text_sections WHERE id = %d";
			$r = mysqli_query(
			  $this->resource,
			  sprintf($query, mysqli_real_escape_string($this->resource, $textSectionID))
			) or trigger_error(mysqli_error($this->resource));
			return mysqli_fetch_assoc($r);
		}
		return false;
	}

	/**
		Fetch a list of all newest versions of documents. There is a subquery that looks for the maximal version of every first_id group (first_id is the ID of the first version of the document, to which all later versions are linked). This subquery is combined with a normal Documents table by comparing the first_id and version fields.
	*/
	public function fetchDocuments(){
		$query = "SELECT id, ".
		             "ART_documents.first_id, ". // Doesn't matter from which table first_id is taken
			     "ART_documents.version, ".
			     "_documents.title, ". // title from the first occurrence; the rest of the titles should be NULL							
			     "text, ". 
			     "url ".
			     "FROM ART_documents, ".
			     "(SELECT title, first_id, MAX(version) as version FROM ART_documents GROUP BY first_id) AS _documents ".
			     "WHERE ART_documents.first_id = _documents.first_id ".
			     "AND ART_documents.version = _documents.version; ";
		log_message(STORAGE_LOG_FILE, "Query: $query");
		$resource = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));
		while($results = mysqli_fetch_assoc($resource)){
		  $result[] = $results;
		}
		log_message(STORAGE_LOG_FILE, "Results: ".print_r($results, true));
		return $result;
	}

	/**
		Fetch document with given ID. Adds property 'annotated' for indication of whether there is any text section associated to this document.
		@param integer $id ID of the document
	*/
	public function fetchDocumentByID($id){
		//The title of the document is stored only at the first version of the document, the rest of the title-fields should be NULL. That's why this query is a bit complicated. See also the (comments to the) query at fetchDocuments().
		$query = "SELECT id,
										 ART_documents.first_id,
										 ART_documents.version,
										 _documents.title,
										 text,
										 url
								FROM ART_documents,
										 (SELECT first_id, title FROM ART_documents GROUP BY first_id) AS _documents 
							 WHERE ART_documents.first_id = _documents.first_id
							 	 AND `id` = $id";
		$r = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));
		//this should be the only row as the ID is unique
		$only_row = mysqli_fetch_assoc($r);
		//check whether document is annotated
		$annotationQuery = "SELECT * FROM ART_text_sections WHERE `document_id` = ".$only_row['id'];
		$annotationR = mysqli_query($this->resource, $annotationQuery) or trigger_error(mysqli_error($this->resource));
		$only_row['annotated'] = (mysqli_num_rows($annotationR) > 0); //0 for not annotated, >= 1 for annotated
		//check whether this is the newest version of the document
		$newestVersionQuery = "SELECT * FROM ART_documents WHERE first_id = ".$only_row['first_id']." ORDER BY version DESC";
		$newestVersionR = mysqli_query($this->resource, $newestVersionQuery) or trigger_error(mysqli_error($this->resource));
		$firstRow = mysqli_fetch_assoc($newestVersionR);
		$only_row['newest_version'] = ($firstRow['version'] == $only_row['version']);
		return $only_row;
	}
  
	/**
		Fetch all versions of the specified document ID. This function works by first looking up the first_id of the document with the given ID, and then fecthes all versions.
		@param int $id ID of the document for which the versions have to be displayed
		@since 28 February 2012
	*/
	public function fetchVersionsByDocID($id){
		$query1 = "SELECT first_id FROM ART_documents WHERE id = ".$id;
		$resource1 = mysqli_query($this->resource, $query1) or trigger_error(mysqli_error($this->resource));
		$document = mysqli_fetch_assoc($resource1);
		$first_id = $document['first_id'];
		$query = "SELECT * FROM ART_documents WHERE first_id = ".$first_id." ORDER BY version ASC";
		$resource = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));
		while($rij = mysqli_fetch_assoc($resource)){
			$result[] = $rij;
		}
		return $result;
	}
	
	
	/*******************
	 * Store functions *
	 *******************/

	/**
		Store a new discussion with the given title and introduction
		@param string $title The title of the discussion
		@param string $intro The introduction of the discussion
	*/
	public function storeDiscussion($title, $intro){
		// Validate input
		if(!$title || strlen($title) > 255)
			return false;
		
		$query = "INSERT INTO ART_discussions SET 
					title = '%s',
					intro = '%s'";
		mysqli_query(	
			$this->resource, 
			sprintf(
				$query,
				mysqli_real_escape_string($this->resource, $title),
				mysqli_real_escape_string($this->resource, $intro)
			)
		) or trigger_error(mysqli_error($this->resource));
		return mysqli_insert_id($this->resource);
	}

	/**
		Store a relation with the given type and data. Returns the insertion id, so the relation can be linked to another entity. 
		@param string $type The type of the relation
		@param {associative array} $data The data that need to be stored.
		*/
	public function storeRelation($type, $data){
		// Validatation of input still needs to be done properly!
    
    log_message(STORAGE_LOG_FILE, "store relation data: ". print_r($data, true));
 
    $query = "INSERT INTO $type SET ";
    //print_r($data); //debug
    
    $hasdatetime = false; // MOD: flag to show if there is the datetime field
    foreach($data as $key => $dataItem){
      if($key == "text"){
        foreach(array("_name", "_string") as $extension){
          $checkQuery = "SHOW COLUMNS FROM `".$type."` LIKE '".$type.$extension."'";
          $result = mysqli_query($this->resource, $checkQuery) or trigger_error(mysqli_error($this->resource));
          $nameExists = mysqli_num_rows($result);
          if($nameExists){
            $query .= $type.$extension." = '".mysqli_real_escape_string($this->resource, $dataItem)."', ";
          }
        }
      } else if(!in_array($key, array("datetime", "user", "id", "relation_id", "text", $type."_id", "name", "arity", "conclusion"))){
        if ($key == "datetime")  // MOD: I've found the datetime field
          $hasdatetime = true;
        $query .= "`".$key."` = '".mysqli_real_escape_string($this->resource, $dataItem)."', ";
      }
    }
    
    // MOD: had the datetime field if not present
    if (!$hasdatetime)
      $query .= "`datetime` = NOW(), ";

    //remove last comma.
    $query = substr($query, 0, strlen($query)-2);
    log_message(STORAGE_LOG_FILE, "store relation query: ". $query);

		mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource)." # Query = $query ");
		return mysqli_insert_id($this->resource);	
	}

  /**
    Store the "trail" from a conjunction to it's conjuncts. Return the ID of the saved conjunct.
    @param {associative array} $conjunct The conjunct for which a conjunction has to be made
    @param {string} $occurrenceTable Name of the occurrence table
    @param {string} $conjunctionTable Name of the conjunction table
    @since 2 August 2012
  */
  public function saveConjunctionTrailDEPRECATED($conjuncts, $occurrenceTable, $conjunctionTable){
    //save conjunction
    $query = "INSERT INTO $conjunctionTable SET ${conjunctionTable}_name='added by ART'";
    mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource)." # Query = $query ");
    //with id of conjunction, save occurrence
    $conjunctionID = mysqli_insert_id($this->resource);
    $query2 = "INSERT INTO $occurrenceTable SET
              ".$conjuncts[0]['type']." = ".$conjuncts[0][$conjuncts[0]['type']."_id"].",
              ".$conjunctionTable." = ".$conjunctionID;
    mysqli_query($this->resource, $query2) or trigger_error(mysqli_error($this->resource)." # Query = $query2 ");
    return $conjunctionID;
  }

	/**
		DEPRECATED. Connect a text element to a relation, and give this connection a type.
		@param string $type The type of the relation (e.g. for the source out of the argument from credible source, the abbreviation acs-source is used)
		@param integer $relationID ID of the relation to which the text section has to be coupled.
		@param integer $textElementID ID of the text section that has to be coupled to the relation
		@param boolean $is_conclusion indicates whether this is the conclusion of an argument or not.
		@param integer $user The user that performs this mutation (user support to be added later)
	*/
	public function storeRelationTextElementDEPRECATED(
		$type,
		$relationID,
		$textElementID,
		$is_conclusion,
		$user
	){
		if ( !$textElementID || $textElementID == 0 ) return false;
		if ( !$relationID || intval($relationID) == 0 ) return false;
		if ( !is_bool($is_conclusion) ) return false;
		if ( !$user || intval($user) == 0 ) return false;
			
		$query = "INSERT INTO RelationElement SET
					type = '%s',
					relation = %d,
					conclusion = %d,
					text_element = '%s',
					timestamp_added = %d,
					added_by = %d";

		mysqli_query(
			sprintf(
				$query,
				mysqli_real_escape_string($this->resource, $type),
				mysqli_real_escape_string($this->resource, intval($relationID)),
				($is_conclusion?1:0),
				$textElementID,
				time(),
				mysqli_real_escape_string($this->resource, intval($user))
			),
			$this->resource
		) or trigger_error(mysqli_error($this->resource));;
		return mysqli_insert_id($this->resource);
	}

	/**
		Store a text element that is (or is not) linked to a document with pointers to the starting and ending offset of the citation from the document. The text can deviate from the literal citation, but the original citation can always be retrieved with the document ID and starting and ending offsets.
		@param string $text Content of the TextItem that has to be stored. Max 255 characters at this time (has to be improved).
		@param integer $documentID ID of the document associated to the text item that has to be created.
		@param integer $startOffset
		@param integer $endOffset
	*/
	public function storeTextSection($text, $documentID, $startOffset, $endOffset){
		//if (!$uri || strlen($uri) == 0 || strlen($uri) > 255) return false;//this doesn't belong here I think (-JD 20120313)
		//text may be of length 0, $uri (above) may not.
		if (strlen($text) > 255) return false;
		if ($documentID == ""){
			$escapedDocumentID = "NULL"; //to prevent foreign key error
		} elseif(intval($documentID) != 0) {
			$escapedDocumentID = "'".mysqli_real_escape_string($this->resource, intval($documentID))."'";
		} else {
			return false;
		}
		$query = "INSERT INTO ART_text_sections SET 
			text = '%s',
			document_id = ".$escapedDocumentID.",
			start_offset = '%d',
			end_offset = '%d'";
		mysqli_query(
			$this->resource,
			sprintf(
				$query,
				mysqli_real_escape_string($this->resource, $text),
				mysqli_real_escape_string($this->resource, $startOffset),
				mysqli_real_escape_string($this->resource, $endOffset)
			)
		) or trigger_error(mysqli_error($this->resource));
		return mysqli_insert_id($this->resource);
	}
	
	/**
		Stores a document with the specified parameters. Returns false when something went wrong, and the ID of the new document when everything went well.
		@param string $title
		@param string $url
		@param string $text
		@param bool|string $first_id - When a new version of a document has to be made, this parameter indicates the id of the first version.
		@since 7 March 2012
	*/
  public function storeDocument($title, $url, $text, $first_id){
		// Validate input
		if(!$title || $title == "")
			return false;
		if(!$url || $url == "")
			$url = null;
		
		if($first_id != false){
			$versionQuery = "SELECT * FROM ART_documents WHERE first_id = $first_id ORDER BY version DESC";
			$versionQueryR = mysqli_query($this->resource, $versionQuery) or log_error(mysql_error()."\n");
			$newestVersion = mysqli_fetch_assoc($versionQueryR);
			$version = $newestVersion['version'] + 1;
		} else {//this is the first version
			$version = 1;
		}
		
    $query = "INSERT INTO ART_documents SET 
					title = '%s',
					url = %s,
					text = '%s',
          version = %s";
		if($first_id != false){
			$query .= ", first_id = ".mysqli_real_escape_string($this->resource, $first_id);	
		}
		$urlForQuery = $url != null ? "'".mysqli_real_escape_string($this->resource, $url)."'" : "NULL";
		mysqli_query(
			$this->resource, 
			sprintf(
				$query,
				mysqli_real_escape_string($this->resource, $title),
				$urlForQuery,
				mysqli_real_escape_string($this->resource, $text),
				$version
			)			
		);
		if(mysqli_error($this->resource) == ''){
			$id = mysqli_insert_id($this->resource);
			if($first_id == false){
				//we need to link the new document to itself, as it is the first version of itself (another solution would be to let the reference be null, but other queries would have to be adapted to that and probably become more complex, so that's why this redundant info is stored)
				$query = "UPDATE ART_documents SET first_id = $id where id = $id";
				$resource = mysqli_query($this->resource, $query);
				if(mysqli_error($this->resource) != ''){
					return false;
				}
			}
		} else {
  		  trigger_error(mysqli_error($this->resource));
		  return false;
		}
		//return false when the query was no success (above) , otherwise return the insert ID.
		return $id;
	}

  /**
    This function stores a textSectionCombination, currently simply making a tsc out of one textSection. Todo: expand this.
    @param int $textSectionID
    @since 26 July 2012
  */
  
/// ERROR: I put combination_id NULL as default value
  public function storeTextSectionCombination($textSectionID){
    //todo: perform some sort of argument check, escape things, etc.
    $query = "INSERT INTO ART_text_section_combinations
    SET text_section_id = '$textSectionID'";
    mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));
    $error = mysqli_error($this->resource);
    $id = mysqli_insert_id($this->resource);
    $query2 = "UPDATE ART_text_section_combinations
    SET combination_id = $id
    WHERE id = $id";
    mysqli_query($this->resource, $query2) or trigger_error(mysqli_error($this->resource));
    return $id;
  }
  
  /**
    This function saves a link between a relation and a discussion. Returns the ID of the newly made link.
    @param {int} $relationType
    @param {int} $relationID
    @param {int} $discussionID
    @since 27 July 2012
  */
  public function storeRelationDiscussionLink($relationType, $relationID, $discussionID){
    $query = "INSERT INTO ART_relations_discussions
              SET relation_id = $relationID,
                  relation_sort = '$relationType',
                  discussion = $discussionID";
    mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource)." query was: ".$query);
    $id = mysqli_insert_id($this->resource);
    return $id;
  }
	
	/********************
	 * Update functions *
	 ********************/

	/**
		Update a text element (standardly called from within the textSection save method).
		@param integer $id ID of the text element that has to be adapted
		@param string $text Text of the text element
		@param integer $documentID Optional - ID of the document to which this text item is associated
		@param integer $startOffset Optional - Start offset in the document of the text element
		@param integer $endOffset Optional - End offset in the document of the text element
	*/
	public function updateTextSection($id, $text, $documentID, $startOffset, $endOffset){
    //echo "start updateTextSection with documentID $documentID";
    if (!$id || intval($id) == 0) return false;
		if (strlen($text) > 255) return false;
		if (!$documentID){
			$escapedDocumentID = "NULL"; //to prevent foreign key error
		} elseif(intval($documentID) != 0) {
			$escapedDocumentID = "'".mysqli_real_escape_string($this->resource, intval($documentID))."'";
		} else {
			return false;
		}
		$query = "UPDATE ART_text_sections SET 
			text = '%s',
			document_id = ".$escapedDocumentID.",
			start_offset = '%d',
			end_offset = '%d'
			WHERE id = %d";
		$formattedQuery = sprintf(
			$query,
			mysqli_real_escape_string($this->resource, $text),
			mysqli_real_escape_string($this->resource, $startOffset),
			mysqli_real_escape_string($this->resource, $endOffset),
			mysqli_real_escape_string($this->resource, $id)
		);
		mysqli_query(
			$this->resource,
			$formattedQuery
		) or trigger_error(mysqli_error($this->resource)." query was: ".$formattedQuery, E_USER_ERROR);
		return (mysqli_error($this->resource) == 0);
	}
	
  /**
    Function NOT FINISHED. Update a conjunct. At this time, only the first conjunct is being saved (todo: make this work for every conjunct. Heavily depends on updateRelation() for it's actual storage; this is mainly a lookup function
    @param string $type The type of the relation (not of it's conjuncts)
    @param {associative array} data The data that need to be stored.
  */
  public function updateRelationConjunct($relationType, $data){
    //get the conjuncttype etc.
    $DBStructure = $this->relationReader->getRelation($relationType);
    $this->updateRelation($conjuncttype, $conjunctID, $text, $tsc_id);
  }

	/**
		Update a relation
    At this time only updates the text (in the {type}_string or {type}_name fields. TODO: change this, make it work like storeRelation (same arguments).
    @param {int} $relationID
    @param {string} $type
    @param {string} $text Optional
    @param {int} $tsc_id Optional
	*/
  public function updateRelation($type, $relationID, $text = null, $tsc_id = null){
    foreach(array('relationID', 'type', 'text') as $var){
      ${$var} = mysqli_real_escape_string($this->resource, ${$var});
    }
		// Validate input
		if(!$relationID || intval($relationID) == 0)
			return false;
		if(!$type || strlen($type) > 50)
			return false;
		if(!$text) //old text should not remain.
			$text = "";
    $query = "UPDATE $type SET ";
    //Check whether a field with {type}_string or {type}_name exists, and if so, update it.
    foreach(array("_name", "_string") as $extension){
      $checkQuery = "SHOW COLUMNS FROM `".$type."` LIKE '".$type.$extension."'";
      $result = mysqli_query($this->resource, $checkQuery) or trigger_error(mysqli_error($this->resource));
      $nameExists = mysqli_num_rows($result);
      if($nameExists){
              $query .= $type.$extension." = '$text',";
      }
    }
    if($tsc_id){
      $query .= "tsc_id = $tsc_id,";
    }
    //remove last comma.
    $query = substr($query, 0, strlen($query)-1)."\n";
    $query .= "WHERE ".$type."_id = $relationID";
    if($text || $tsc_id){
      $result = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource)." query was: ".$query);
      return ( mysqli_error($this->resource) == 0 );
    }
    return true; //if the text field was not present, the update succeeded as well (because it didn't have to be done.
	}
	
	/**
		Update a document with the given parameters
		@param integer $id ID of the document
		@param string $title Title of the document
		@param string $url URL of the document (optional)
		@param string $text Text of the document
	*/
	
	public function updateDocument($id, $title, $url, $text){
		// Validate input
		if(!$id || intval($id) == 0)
			return false;
		if(!$title || $title == "")
			return false;
		if(!$url || $url == "")
			$url = null;
	
		$query = "UPDATE ART_documents SET
					url = %s,
					text = '%s' 
					WHERE id = %d";
		$urlForQuery = $url != null ? "'".mysqli_real_escape_string($this->resource, $url)."'" : "NULL";
		mysqli_query(
			$this->resource, 
			sprintf(
				$query,
				$urlForQuery,
				mysqli_real_escape_string($this->resource, $text),
				$id
			)
		) or trigger_error(mysqli_error($this->resource));

		//Title is changed for all versions (so for the first version)
		$query2 = "SELECT first_id FROM ART_documents WHERE id = ".$id;
		$mysqli_resource = mysqli_query($this->resource, $query2) or die(mysqli_error($this->resource));
		$row = mysqli_fetch_assoc($mysqli_resource);
		$first_id = $row['first_id'];
		$query3 = "UPDATE ART_documents SET title = '%s'
							 WHERE id = ".$first_id;
		mysqli_query(
			$this->resource, 
			sprintf(
				$query3,
				mysqli_real_escape_string($this->resource, $title)
			)
		) or trigger_error(mysqli_error($this->resource));
		return ( mysqli_error($this->resource) == 0 );
	}
	
	/**
		Update a discussion
		@param integer $id
		@param string $title
		@param string $intro
	*/
	public function updateDiscussion($id, $title, $intro){
		// Validate input
		if(!$id || intval($id) == 0)
			return false;
		if(!$title || $title == "")
			return false;
	
		//$id = ($id != null ? "'".mysqli_real_escape_string($this->resource, $id)."'" : "NULL");
		$query = "UPDATE ART_discussions SET 
					title = '%s',
					intro = '%s'
					WHERE id = %d";
		mysqli_query(
			$this->resource,
			sprintf(
				$query,
				mysqli_real_escape_string($this->resource, $title),
				mysqli_real_escape_string($this->resource, $intro),
				$id
			)
		) or trigger_error(mysqli_error($this->resource));
		return ( mysqli_error($this->resource) == 0 );
	}
}
