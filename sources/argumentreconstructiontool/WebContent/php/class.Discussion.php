<?php
/**
 * This is the discussion class
 * @since 4 September 2012
 **/
class Discussion extends DbItem{
  
  function __construct($data = false, $db = false){
    parent::__construct($data, $db);
  }


  public function getStorageID(){
    return "ART_discussions";
  }

  /**
   * Save the discussion according to the internal data representation
   * @retval int/boolean The ID of the just-saved element (especially useful 
   * when adding a new document, of which the ID is not known by definition), or 
   * false when the create failed.
   **/
  function create(){
    $arFieldValues = array();
    $arFieldValues['title'] = $this->data["title"];
    $arFieldValues['intro'] = $this->data["intro"];
    //^$db = new Database();
    $discussion_id = $this->db->insert(Discussion::getStorageID(), $arFieldValues);
		if($discussion_id && intval($discussion_id)>0){
			return $discussion_id;
		} else {
      show_error("Creating discussion failed");
    }
  }

  /**
   * Update the discussion according to the internal data representation
   * @retval boolean True if the save succeeded, false otherwise
   **/
  function update(){
    $arFieldValues = array();
    $arFieldValues['title'] = $this->data["title"];
    $arFieldValues['intro'] = $this->data["intro"];
    $arConditions = array('id'=>$this->getID());
    //^$db = new Database();
    $success = $this->db->update(Discussion::getStorageID(), $arFieldValues, $arConditions);
    if($success){
      return $success;
    } else {
      show_error("Failed to update discussion");
    }
  }

  /**
   * This function is made for the export to the SCT. It fetches the 
   * discussions that has the specified issueID (these issueID's should be the 
   * ones that actually represent a green paper question). It returns an 
   * associative array representing the issues in a way that is coherent with 
   * the specification of TR2.3a.
   * @param {string} $issueID ID of the issue that has to be fetched.
   **/
  public function fetchIssue($issueID){
    $result = array();
    //^$db = new Database();
    //^$issueID = mysqli_real_escape_string($this->resource, $issueID);
    /*$query = "SELECT *
                FROM ART_discussions
               WHERE issue_id = $issueID";
    $resource = mysqli_query($this->resource, $query) or trigger_error(mysqli_error($this->resource));
    $discussion = mysqli_fetch_assoc($resource); //should be only one.
     */ 
    $discussion = $this->db->select("ART_discussions", array('issue_id' => $issueID));
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
   * Fetch the relations belonging to the discussion with the given ID. 
   * Non-recursive function: only fetches the directly underlying elements. (see 
   * fetchRelationDetails for recursive relation retrieval). Does not fetch 
   * relation objects, but the associative array representation.
   * Todo: The discussion ID should not be a parameter, but be taken from the 
   * object (thereby making the function non-static).
   * @param integer $discussionID
	 **/
  public function fetchRelations($discussionID){
    //^$db = new Database();
    if(!$discussionID || intval($discussionID) == 0)	return false;
      $result = array();
        $arConditions = array("discussion"    =>$discussionID);
        $relations_discussions = $this->db->select('ART_relations_discussions', $arConditions);

        foreach($relations_discussions as $relation_discussion){
          $relationType = $relation_discussion['relation_sort'];
          $arConditions = array($relationType."_id" => $relation_discussion['relation_id']);
          $arRelation = $this->db->select($relationType, $arConditions);
          if(count($arRelation) != 1){
            show_error("The number of relations is not 1, type was $relationType, ID was ".$relation_discussion['relation_id']);
          }
          $row = array();
          $row['tsc_id'] = $arRelation[0]['tsc_id'];
          $row['type'] = $relationType;
          $row['id'] = $arRelation[0][$relationType."_id"];
          if($arRelation[0]['tsc_id']) {
            $textSectionCombination = new textSectionCombination(null, $this->db);
            $textSectionCombination->load($arRelation[0]['tsc_id']);
            $row['text_sections'] = $textSectionCombination->getData();
          }
          $result[] = $row;
        }
      return $result;
    return false;
  }
}
