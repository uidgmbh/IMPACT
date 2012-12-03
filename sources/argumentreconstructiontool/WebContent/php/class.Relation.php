<?php
/**
  The relation class represents a relation. It forms the link between the 
  Database class that takes care of information retrieval from the DB, and the 
  api.php file that contains scripts for the interpretation of the URL and the 
  calling of the correct relation management functions in this class.

  The internal data representation is as follows, in quasi-BNR form:
  Syntax: X => Y where X = index (key) of array or a placeholder name, Y is 
  either:

  1. a comma-separated list of the keys of the elements of an associative array 
     (surrounded by single quotes) or
  2. a placeholder name (without quotes) for a non-associative array, prepended 
     by the words 'non-associative array with elements' or
  3. the keyword 'string' or 'boolean' or 'integer' when the contents are one 
     of those respective types.

  Whenever (a part of) Y is between brackets, it's not present in any case, but 
  it's presence depends on the situation.
  <pre>
  'relation'       => 'elements', 'type', 'discussion_ids', ('id')
  'elements'       => non-associative array with elements element
  element          => 'type', 'name', 'arity', 'conclusion', 'text_sections', 
                      ('id')
  'type'           => string
  'name'           => string
  'conclusion'     => boolean
  'text_sections'  => non-associative array with elements text_section
  text_section     => 'text', 'document_id', 'start_offset', 'end_offset'
  'text'           => string
  'name'           => string
  'document_id'    => integer
  'start_offset'   => integer
  'end_offset'     => integer
  'id'             => integer
  'discussion_ids' => non-associative array with elements discussion_id
  discussion_id    => integer
  </pre>
  @since 3 July 2012
*/
class Relation extends DbItem{

  //private $storage;
  //private $data; ///< This array is the internal data representation
  //private $loaded; ///< Indicates whether the discussion is loaded from the DB or not
  //private $table_name; //< Name of the database table associated with Discussions
  protected $relationReader;
  protected $IDName;
  protected $uninterpretedData; //< Holds the data in the structure of the storage.

  /**
   * The constructor
   * @param array $data Data to put in this text section
   * @since 3 July 2012
   **/
  function __construct($data = false, $db = false){
    parent::__construct($data, $db);
    $this->relationReader = new RelationReader();
    if($this->data){
      $this->IDName = $this->getStorageID()."_id";
    }
  }

  /**
   * Returns the unique identifier with which entities of this type are being 
   * stored in the storage mechanism. In the case of relations, this depends on 
   * the type of the relation
   */
  function getStorageID(){
    return $this->data['relation']['type'];
  }

  /**
   * Gets the uninterpreted data of the object. Returns an error if that data 
   * is not loaded yet.
   * @retval array The uninterpreted data
   * @since 1 October 2012
   */
  public function getUninterpretedData(){
    if(isset($this->uninterpretedData)){
      return $this->uninterpretedData;
    } else {
      show_error("Uninterpreted data not present");
    }
  }

  /**
   * Load the data from the storage and interpret it. The interpreted data can 
   * be retrieved by calling getData(). The uninterpreted data, with the 
   * structure as it is in the storage, can be retrieved with 
   * getUninterpretedData().
   * @param string $completeID The ID made up of the type of the relation, a 
   * dash and the integer ID of the relation that uniquely identifies it within 
   * it's type.
   * @since 1 October 2012
   **/
  public function load($completeID){
    $this->loadUninterpretedData($completeID);
    $this->interpret();
  }

  /**
   * Loads the representation of the data as stored in the storage system.  
   * Internal data that might be already present, will be lost.
   * @param string $completeID The ID made up of the type of the relation, a 
   * dash and the integer ID of the relation that uniquely identifies it within 
   * it's type.
   * @param array $localDBStructures When this option is not given, the general 
   * DB structures, as specified in the XML file, are used.  Otherwise, this 
   * structure is taken as DB structure.
   * $since 27 September 2012
   **/
  private function loadUninterpretedData($completeID, $localDBStructure = null){
    //reset internal uninterpretedData, initialize id's, set initial values for 
    //uninterpretedData, initialize db
    //^$this->uninterpretedData = array();
    $completeIDParts = explode("-", $completeID);
    $relationType = $completeIDParts[0];
    $this->uninterpretedData['relation']['type'] = $completeIDParts[0];
    $relationID   = $completeIDParts[1];
    $this->IDName = $relationType."_id";
    //todo: make this ugly solution (providing ID in two ways) to an elegant one.
    $this->uninterpretedData['relation'][$this->IDName] = $relationID;
    $this->uninterpretedData['relation']['id'] = $relationID;
    $this->uninterpretedData['relation']['type'] = $relationType;
    //^$db = new Database();

    //Get raw data from the DB
    $rawData = $this->db->select($relationType, array($this->IDName => $relationID));
    if(count($rawData) !== 1){
      show_warning("Loading ID yielded ".count($rawData)." results in stead of 1.");
    }
    $rawData = $rawData[0];

    //Get the structure of the elements of the relation as they are stored in 
    //the DB from our interpretation file, if none is given yet as a parameter 
    //(in which case this is a recursion call).
    if($localDBStructure == null){
      $DBStructure = $this->relationReader->getRelation($relationType, false);
    } else {
      $DBStructure = $localDBStructure;
    }

    //Get the associated text section(s), if any.
    if($tsc = $this->getTextSectionCombination($completeID, $this->db)){
      $this->uninterpretedData['relation']['text_sections'] = $tsc['text_sections'];
    }
    //$elementArr['discussion_ids'] = Relation::getRelatedDiscussionIDs($completeID); //todo: retrieve relations!
    
    //Get the associated label (if any)
    if(isset($DBStructure['attributes']['label'])){
      //echo "set label to ".$DBStructure['attributes']['label']."\n"; //debug
      $this->uninterpretedData['relation']['label'] = $DBStructure['attributes']['label'];
    } else {
      //see if there is a label available for this type of relation
      $labelRel = $this->relationReader->getRelation($this->uninterpretedData['relation']['type'], true);
      if(isset($labelRel['attributes']['label'])){
        //echo "set label to ".$labelRel['attributes']['label']."\n"; //debug
        $this->uninterpretedData['relation']['label'] = $labelRel['attributes']['label'];
      }
    }


    //check whether there are elements ('value' indicates there are contents of the DBStructure in the XML file), and if so, iterate over them.
    if($DBStructure['value']){
      foreach($DBStructure['value'] as $DBElement){
        //recursion step: retrieve the full details for this DBelement by calling this function again
        $elementType = $DBElement['attributes']['type'];
        if(isset($DBElement['attributes']['arity'])){
          $arity = $DBElement['attributes']['arity'];
        } else { //if no arity is given, we should be at the top level, so artiy is always 1.
          $arity = 1;
        }
        if($arity == 1){ //Arity is 1, so recursion step is not very complicated
          //prepare and execute the recursion step.
          $elementID = $rawData[$elementType];
          $completeElementID = $elementType."-".$elementID;
          $elementObj = new Relation(null, $this->db);
          $elementObj->loadUninterpretedData($completeElementID, $DBElement);
          //get the array representation of the uninterpreted data to be able to eventually put it in the internal data representation in this object
          $elementArr = $elementObj->getUninterpretedData();
          $elementArr = $elementArr['relation'];//relation index only used at highest level, not for elements in a relation
          $elementArr['arity'] = $arity; //Client-side depends on this value
        } else if($arity == 'n'){
          //retrieve names of conjunction table names from the XML structure
          $conjunctiontable = $DBElement['attributes']['conjunctiontable'];
          $occurrencetable = $DBElement['attributes']['occurrencetable'];
          $conjunctType = $DBElement['attributes']['conjuncttype'];

          $rawConjuncts = $this->db->selectConjuncts($relationType, $relationID, $elementType, $conjunctiontable, $occurrencetable, $conjunctType);
          //print_r($rawConjuncts); //debug

          //for every found conjunct...
          foreach($rawConjuncts as $rawConjunct){
            //...perform the recursive procedure.
            $conjunctID = $rawConjunct[$conjunctType."_id"];
            $conjunctObj = new Relation(null, $this->db);
            $conjunctObj->loadUninterpretedData($conjunctType."-".$conjunctID);
            $conjunctArr =  $conjunctObj->getUninterpretedData($conjunctType."-".$conjunctID, $DBStructure['value'], $DBElement);
            $conjunction[] = $conjunctArr['relation'];//relation index only used at highest level, not for elements in a relation
          }
          //echo "Conjunction:\n"; //debug
          //print_r($conjunction); //debug
          $elementArr['arity'] = $arity; //Client-side depends on this value
          $elementArr['type'] = $elementType;
          $elementArr['label'] = $DBElement['attributes']['label'];
          $elementArr['conjunctiontable'] = $conjunctiontable;
          $elementArr['occurrencetable'] = $occurrencetable;
          $elementArr['conjuncts'] = $conjunction;

          //$conjunctType = $DBStructure['attributes']['conjuncttype'];
        } else {//there is no correct arity
          show_error("Arity not correct (1 or n) in load relation: ".$arity."\n");
        }

        //Set a number of values in the elementArr array, and add it to the 
        //elements index of $uninterpretedData
//        $elementArr['type'] = $elementType;
//        $elementArr['id'] = $elementID;
        if(isset($DBElement['attributes']['name'])){ //(index name not present for top-level element, should be present for all other elements)
          $elementArr['name'] = $DBElement['attributes']['name'];
        }

        //add the new element to the elements of the result
        $this->uninterpretedData['relation']['elements'][] = $elementArr;

        //clear the $elements and $conjunction arrays in order not to interfere with the next loop.
        $elementArr = array();
        $conjunction = array();
      }
    }
    $this->loaded = true;
  }

  /** 
   * Gets the text sections that are related to this relation.
   * @param string $completeID ID of the relation
   * @param Database $db Database preferably given because of dependency injection
   * @since 1 October 2012
   **/
  private static function getTextSectionCombination($completeID, $db = null){
    if(!$db){
      $db = new Database();
    }
    $completeIDParts = explode("-", $completeID);
    $relationType = $completeIDParts[0];
    $relationID   = $completeIDParts[1];

    $textSection = new TextSection(null, $db);

    $arConditions = array($relationType."_id" => $relationID);
    $result = $db->select($relationType, $arConditions);
    if(count($result) == 0){
      show_error("This relation does not exist");
    }
    $result = $result[0]; //get the one and only row

    $result['id'] = $result[$relationType."_id"];
    if($result['tsc_id'] != null && $result['tsc_id'] != 0){
      $textSectionCombination = new TextSectionCombination(null, $db);
      $textSectionCombination->load($result['tsc_id']);
      $result['text_sections']  = $textSectionCombination->getData();
    } elseif(isset($result[$relationType."_name"])){
      $result['text_sections'][0]['text'] = $result[$relationType."_name"];
    } elseif(isset($result[$relationType."_string"])){
      $result['text_sections'][0]['text'] = $result[$relationType."_string"];
    } else { //there is no associated text found.
      return false;
    }
    return $result;
  }

  /**
    Sets the type. Only use on unstored elements.
    Seems superfluous because setData already sets the type and all -JD20120927
    @param string $type
    @since 25 July 2012
  */
  //public function setType($type){
    //$this->data['type'] = $type;
  //}

  /**
   * Gets the type
   * @since 25 July 2012
   **/
  public function getType(){
    return $this->data['relation']['type'];
  }

  /**
    Sets the textSection (at this point only one, should be an array in the 
    future: Todo)
    The question is whether we need this as the data is given in it's entirety 
    to the constructor.
    @param textSection $textSection The textSection to be set.
    @since 25 July 2012
  */
 // public function setTextSectionNOTGOOD($textSection){
 //   $this->data['relation']['text_section'] = $textSection;
 // }

  /**
    Gets the first textSection (todo: currently no support for more than 1 
    textSection. Also, it might be better to return a textSection Object.
    @since 25 July 2012
  */
  public function getTextSection(){
    return $this->data['relation']['textSections'][0];
  }

  /**
   * Interprets the relation stored in the internal uninterpreted data 
   * representation. Flattens the uniterpreted structure and uses that 
   * information to map it from the uninterpreted version to the interpreted 
   * version.
   * @since 3 July 2012
   **/
  public function interpret(){
    //The hierarchial structure is not useful here, so flatten it
    $flattenedRelation = Relation::flatten($this->uninterpretedData);
    //The mapping is solely done based on the name of the elements as specified in the mapping specified in the conversion file (accessed through the relationReader).
    $type = $this->uninterpretedData['relation']['type'];
    $interpretedElements = $this->relationReader->getRelationElements($type, true);
    //The top relation must be in the result anyway.
    $result = $this->uninterpretedData['relation'];
    //Perform the mapping if there are any elements to map, add the mapped elements to the 'elements' index of the result.
    if(count($interpretedElements) > 0){
      //echo "perform the mapping with this flattened rel:\n"; //debug
      //print_r($flattenedRelation);//debug
      $result['elements'] = Relation::performMapping($flattenedRelation, $interpretedElements);
    }
    $this->data['relation'] = $result;
  }

  /**
   * This recursive function has a flattened relation as input, where the keys 
   * of the array are the names of the elements of the relation (see function 
   * Relation->flatten()). It puts these elements into the structure that is 
   * given in the $elementStructure argument.
   * @param array $flattenedrelation the to-be-mapped relation, in flattened 
   * form in which the keys of the elements are the names (as given in the xml 
   * spec) of these parts of the relation
   * @param array $elementstructures structure of the new mapping of the 
   * relation (as specified in the xml file). In recursion steps, this argument 
   * only contains the "local subset" of the structure that has to be mapped.
   * @since 5 July 2012
   **/
  private static function performMapping($flattenedRelation, $elementStructures){
    $result = array();
    foreach($elementStructures as $elementStructure){
      //first look whether there are elements, and put those in the elements array.
      $elements = array();
      if(gettype($elementStructure['value']) == "array"){
        $elements[] = Relation::performMapping($flattenedRelation, $elementStructure['value']);
      }
      //always add the current element to the result...
      if(isset($elementStructure['attributes']['name'])){
        $relation = $flattenedRelation[$elementStructure['attributes']['name']];
      } /*else {
        //There is no name attribute, so the current relation can not be found in the flattenedRelation. It however does need to be added.
        $relation = array();
        $relation['type'] = $
      }*///Eliminated because the mapping is not performed for translation from interpreted to database schemes
      //...and if there is a subrelation, also add that one in the recursion step.
      $result[] = $relation;
    }
    return $result;
  }


  /**
   * Saves the specified relation, and it's elements recursively. It presumes 
   * every relation only has ONE textSection (for the while being, this should 
   * be changed at some time).
   * @param associative_array $interpretedRelation This nested associative array 
   * is the standard relation representation, as is used througout the ART, and 
   * is the same as is used for AJAX/JSON data exchange.
   * @since 17 July 2012
   **/
  public function save(){
    $interpretedRelation = $this->data;
    //flatten the relation, so we can "pick out" the elements we need and put them in the DB structure.
    $flattenedInterpretedRelation = $this->flatten($interpretedRelation);
    $type = $interpretedRelation['relation']['type'];
    $id = isset($interpretedRelation['relation']['id']) ? $interpretedRelation['relation']['id'] : null;
    //We need the stored relation because DB elements might not appear in the given interpretedRelation. Therefore we need the already-present structure.
    if($id){
      //Fetch the relation as it is stored in the DB right now, so we can put in the new elements and iterate over them to save/update it's data. This way, if any data is not present in the data of the new version of the relation, those data are not lost but preserved.
      $baseRelation = new Relation(null, $this->db);
      $baseRelation->load($type."-".$id);
      $baseRelationData = $baseRelation->getUninterpretedData();
    } else { //no saved relation, so make the $baseRelation a $skeletonRelation
      $baseRelationData = $this->_makeSkeletonData($interpretedRelation['relation']['type'], false);
    }
    $retval = $this->_saveRecursively($baseRelationData, $flattenedInterpretedRelation, false, array(), $this->db);
    $id = $retval['justSaved']['id'];
    if(!$type || !$id){
      show_error("No type and/or no id, something went wrong in Relation->save()");
    }
    return $type."-".$id; //todo: $id and $type should be filled at all time. (I don't understand what I meant by this exactly, I just added the check above -JD20121008)
  }

  /**
   * This private function creates an associative array (as used throughout the 
   * ART) without filling it, so that the returned result can be filled with 
   * any data. Can be used to make new relations.
   * @param string $type Type of the to-be-made skeleton
   * @param boolean $interpreted Indicates whether the structure of the 
   * relation is the interpreted version (true) or the database version.
   * @param associative-array $elements For use in the recursion step only.
   * @since 26 July 2012
   **/
  public function _makeSkeletonData($type, $interpreted, $elements = false){
    //we presume that this is a recursive call...
    $recursiveCall = true;
    if(!$elements){
      //...unless $elements is false
      $recursiveCall = false;
      $elements = $this->relationReader->getRelation($type, $interpreted);//Get the details of the relation as they are stored in the database.

    }
    $result = array();
    //fill the elements of the relation with a recursive call
    if(isset($elements['value']) && intval($elements['value']) != 0){
      $result['elements'] = array();
      foreach($elements['value'] as $element){
        $result['elements'][] = $this->_makeSkeletonData($element['attributes']['type'], $interpreted, $element);
      }
    }
    //set the result with values of the current relation.
    $result['type'] = $elements['attributes']['type'];
    if(isset($elements['attributes']['name'])){
      $result['name'] = $elements['attributes']['name'];
      //if there is a name, there should also be an arity.
      $result['arity'] = $elements['attributes']['arity'];
      if($elements['attributes']['arity'] == 'n'){
        //todo: make several conjuncts possible
        $result['conjuncts'] = array(0 => array(
              'type' => $elements['attributes']['conjuncttype']
              ));
        $result['conjunctiontable'] = $elements['attributes']['conjunctiontable'];
        $result['occurrencetable'] = $elements['attributes']['occurrencetable'];
      }
    }
    if(isset($elements['attributes']['conclusion'])){
      $result['conclusion'] = $elements['attributes']['conclusion'];
    }
    if($recursiveCall){
      //simply return the result for integration of the higher-level relation
      return $result;
    } else {
      //we are at the top level, so there should be a label
      $result['label'] = $elements['attributes']['label'];
      //return the entire relation in an array with index 'relation'
      return array('relation' => $result);
    }
  }

  /**
   * This private static recursive function createse or updates the relation.
   * @param {associative array} $baseRelationArr The structure of the old 
   * relation, where the new elements have to be put in before being saved. The 
   * base relation is being converted step by step from the old version to the 
   * new version, and saved and returned at the end of te function.
   * @param {associative array} $flattenedNewRelationArr The new, to-be-stored 
   * relation (at the top level). The elements are stored at the indices of 
   * their names that are specified in the XML-specification. (for more info, 
   * see the definition of Relation->flatten()). Is a skeleton if the relation 
   * has not been saved before.
   * @param boolean $recursionCall Represents whether or not the call to 
   * update() was done through an recursion function call or not. Defaults to 
   * false, any calls from outside this function should be done without this 
   * argument. 
   * @param array $alreadySavedElements Already saved: should also only be 
   * given in the recursive call, defaults to an empty array. When filled, keys 
   * are names (from the XML specification) and the values are arrays with 
   * indices id and type. The already saved elements might contain this 
   * relation, in which case it should not be stored again.
   * $param Database $db Dependency injection of database for static function.
   * @returns array with this structure filled with example values:
   * <pre>
   * Array('justSaved' =>
   *         Array('id'=>1,
   *               'type'=>'domain',
   *             ),
   *       'alreadySavedElements' => 
   *         Array('domain1' =>
   *                 Array('id'=>1,
   *                       'type'=>'domain',
   *                      ),
   *               'proposition1'=>
   *                 Array('id'=>2,
   *                       'type'=>'proposition',
   *                      )
   *              )
   *       )
   * </pre>
   * The 'justSaved' index contains the type and id of the just-saved element. 
   * This is necessary for the above-lying element (that gets the return value) 
   * to know what to link to.
   * The 'alreadySavedElements' index contains an associative array where the 
   * keys are the names (as specified in the XML document) of all the elements 
   * that have already been saved, and thus should not be saved again. The 
   * contents of this array are passed as argument for any new recursion call.
   **/
  private static function _saveRecursively($baseRelationArr, $flattenedNewRelationArr, $recursionCall = false, $alreadySavedElements = array(), $db = false){
    //START initialising steps
    if(!$db){ //it's not preferable, but possible to call this function without giving it a DB.
      $db = new Database();
    }
    if(!$recursionCall){ //strip off the 'relation' element for the baseRelationArr, as it is very verbose and difficult to manage when kept in.
      $baseRelationArr = $baseRelationArr['relation'];
    }
    //make a storage object to use for all saving calls. (Maybe it's quicker to give this as an argument to the recursive function instead of making it anew every recursive call.)
    //^$db = new Database();
    $elementIDs = array(); ///< In elementIDs, the IDs of the elements of this relation are stored, so they can be put in the result later.
    $name = isset($baseRelationArr['name']) ? $baseRelationArr['name'] : false;
    //END initializing steps

    //Set the variable $newRelationArr to the right value, being one relation from $flattenedNewRelation. When the name of the current element already exists, return id and type of the already-existing element.
    if($name && isset($alreadySavedElements[$name])){
      //this element was saved before, so return the values of the already-saved relation.
      return array("justSaved"            => $alreadySavedElements[$name],
                   "alreadySavedElements" => $alreadySavedElements);
    } else if ($name){
      //If there is a name, there is a mapping. The name must also be an index of the flattened new relation.
      $newRelationArr = $flattenedNewRelationArr[$name];
    } else {
      //there is no name, so apparently no mapping. We're going to look for the element with the right type (there should be only one such relation).
      foreach($flattenedNewRelationArr as $flattenedNewElement){
        if($flattenedNewElement['type'] == $baseRelationArr['type']){
          //should only occur once
          $newRelationArr = $flattenedNewElement;
        }
      }
    }

    //the element has already been changed when the ID is present in the baseRelationArr
    if(isset($baseRelationArr[$baseRelationArr['type']."_id"])){
      $alreadySaved = true;
    } else {
      $alreadySaved = false;
    }

    //START CONJUNCT PROCESSING
    //if there are conjuncts directly in the baseRelationArr, store these conjuncts and return the results after that, thereby discontinuing the function execution. This is because if there are conjuncts, there are only conjuncts and no other data at the top level of the baseRelationArr.
    if(isset($baseRelationArr['conjuncts'])){
      //$existingOccurrences is an array that will contain all the occurrences that already link a conjunct to its conjunction.
      //^$existingOccurrences = array(); //presume there are none, until shown otherwise
      //Todo: I left out the update of alreadySavedElements because there are no relations yet with conjuncts that have an element in common (or conjuncts that have elements at all, for that matter)

      //if there are no conjuncts at all, or if the ID is missing in the first already saved conjunct (which essentially means that this is a skeleton: otherwise the baseRelation should only have conjuncts with ID's), then make a new conjunction.
      if(count($baseRelationArr['conjuncts']) == 0 || !isset($baseRelationArr['conjuncts'][0]['id'])){
        //make a new (empty) conjunction without any occurrences
        $conjunctionID = $db->insert($baseRelationArr['conjunctiontable'], 
          array()
        );
      } else { //look up the conjunction so we can use it's ID.
        //take the occurrence that belongs to the first conjunct (any conjunct would do, but from the first we are certain it's there)
        $existingOccurrences = $db->select(
          $baseRelationArr['occurrencetable'],
          array($baseRelationArr['conjuncts'][0]['type'] => $baseRelationArr['conjuncts'][0]['id'])
        );
//        echo "Existing occurrences are:\n"; //debug
//        print_r($baseRelationArr['conjuncts']); //debug
        //take the first occurrence; this should also be the only one.
        $conjunctionID = $existingOccurrences[0][$baseRelationArr['conjunctiontable']];
      }
      //add the conjunctionID to the newRelationArr
      $newRelationArr['id'] = $conjunctionID;

      //Check whether all the old conjuncts (occurrences) are still there in the new version. If not, delete them (thereby not deleting the elements themselves, only the link between the conjunction and the element, i.e. the occurrence).
      $oldConjunctsArr = $baseRelationArr['conjuncts'];
//      echo "oldConjunctsArr:"; //debug
//      var_dump($oldConjunctsArr); //debug
      foreach($oldConjunctsArr as $oldConjunctArr){
        $conjunctStillPresent = false; //presumption until shown otherwise
        //^foreach($flattenedNewRelationArr[$baseRelationArr['name']]['conjuncts'] as $newConjunctArr){
        foreach($newRelationArr['conjuncts'] as $newConjunctArr){
          if(isset($oldConjunctArr['id'])){
            //if there is no id in the old conjunct, there was no conjunct yet, so it's new and will be added below (nothing has to be deleted).
            if(isset($newConjunctArr['id']) && $newConjunctArr['id'] == $oldConjunctArr['id']){
                $conjunctStillPresent = true;
              }
          }
        }
        //if the conjunct is not there anymore, delete the occurrence
        if(!$conjunctStillPresent && isset($oldConjunctArr['id'])){
          $db->deleteOccurrence(
            $baseRelationArr['occurrencetable'],
            $oldConjunctArr['type'],
            $oldConjunctArr['id']
          );
        }//^ else {
         //^ $remainingConjunctsArr[] = $newConjunctArr;
       //^ }
      }

      //at this point, all old conjuncts have been deleted (i.e. their occurrence has been deleted). Now only the new conjuncts still have to be added or updated.
      $remainingConjunctsArr = array(); //the (new) conjuncts that are not deleted in the following loop, are stored here (and are taken from the $newRelationArr)
      //^foreach($flattenedNewRelationArr[$baseRelationArr['name']]['conjuncts'] as $newConjunctArr){
      foreach($newRelationArr['conjuncts'] as $newConjunctArr){
        $createOccurrence = null; //should become true or false in the following if-else-block
        if(!isset($newConjunctArr['id'])){
          //There is no id yet, so both the relation and the occurrence have to be created.
          //echo "not isset ID\n"; //debug
          $result = Relation::_saveRecursively(
            $newConjunctArr, //put in the new conjunct as base for that same new conjunct, because there might be no skeleton available
            array($newConjunctArr),
            true,
            $alreadySavedElements,
            $db);
          $createOccurrence = true;
        } else { //the ID of the new conjunct is already set. This means that it already exists and has to be updated.
                //the conjunct is still present in the new relation, so it has to be updated
          $result = Relation::_saveRecursively(
            $oldConjunctArr,
            array($newConjunctArr),
            true,
            $alreadySavedElements,
            $db);
          //we have to find out whether the occurrence already exists, because if it doesn't, we have to make it. We presume that it does not exist (and that we thus do have to create it). When the loop shows that it does exist after all, we don't have to create it anymore.
          $createOccurrence = true;
          //^foreach($existingOccurrences as $existingOccurrence){
          foreach($baseRelationArr['conjuncts'] as $existingOccurrence){
            if($existingOccurrence['id'] == $newConjunctArr['id']){//conjunctiontable    $baseRelationArr['conjuncts'][0]['type']
              //...until it is found: then the occurrence doesn't have to be saved.
              $createOccurrence = false;
            }
          }
//          if($createOccurrence){ //debug
//            echo "WEL isset ID! and create occurrence de existingOccurrences zijn:.\n"; //debug
//            print_r($baseRelationArr['conjuncts']); //debug
//            print_r($newConjunctArr); //debug
//          } //debug
        }
        if($createOccurrence){
//          echo "createOccurrence == true for element with type ".$newConjunctArr['type']; //debug
//          if(isset($newConjunctArr['id'])){ //debug
//              echo " and with ID ".$newConjunctArr['id']; //debug
//          } //debug
//          echo "\n"; //debug
          $justSavedConjunct = $result['justSaved'];
          $arFieldValues = array(
            $newConjunctArr['type'] => $justSavedConjunct['id'],
            $baseRelationArr['conjunctiontable'] => $conjunctionID
          );
          $elementID = $db->insert(
            $baseRelationArr['occurrencetable'],
            $arFieldValues);
        }
      }

      //The conjuncts nor the conjunction are added to the already saved elements because we (for simplicity reasons) presume they will not be in the relation twice, which is the case for all conjunctions at this moment (20121112) Todo: do implement this.
      return array("justSaved"            => $newRelationArr,
                   "alreadySavedElements" => $alreadySavedElements);
    } //end if(isset($baseRelationArr['conjuncts']))
    //END CONJUNCT PROCESSING

    //START PROCESSING ELEMENTS
    //First, we do the recursion step for every element there is
    if(isset($baseRelationArr['elements'])){
      foreach($baseRelationArr['elements'] as $oldElement){
        //recursion step. Todo: The $elementID property is not used yet, only textSections are updated, the actual elements can not be replaced yet by other relations.
        $returnValue = Relation::_saveRecursively($oldElement, $flattenedNewRelationArr, true, $alreadySavedElements, $db);
        $elementIDs[] = $returnValue['justSaved'];
        $alreadySavedElements = $returnValue['alreadySavedElements'];
      }
    }
    //END PROCESSING ELEMENTS

    //START PROCESSING ELEMENTS WITHOUT USER INPUT
    if(!isset($newRelationArr)){
      //There is no mapping for this relation, and also no element in $newFlattenedElement with the right type. This means that the relation is not open for user input, but might not have been created yet. 
      if(!$alreadySaved){
        $newRelationArr = $baseRelationArr;
      } else {
        //Todo: Also, it's elements (registered in $elementIDs) might be changed. In that case, there should be a normal save procedure and not a direct return as is done here.
        //The element that has just been "saved" is the following.
        $newRelationArr = array($baseRelationArr['type']."_id" => $baseRelationArr[$baseRelationArr['type']."_id"],
                           "type" => $baseRelationArr['type']);
        //^There is no change to the alreadySavedElements.
        //^return array("justSaved"            => $justSaved,
        //^             "alreadySavedElements" => $alreadySavedElements);
      }
    }
    //END PROCESSING ELEMENTS WITHOUT USER INPUT

    //At this point, $newRelationArr is set in any case. The elements (if any) are not used because there has already been a recursive step that took care of saving the elements. We unset them here to keep things clear.
    unset($newRelationArr['elements']);

    //Put the references to the already-stored elements in place for saving in the relation.
    if(isset($elementIDs)){
      //echo "start foreach...\n"; //debug
      foreach($elementIDs as $elementID){
        $newRelationArr[$elementID['type']] = $elementID['id'];
        //echo "set the column ".$elementID['type']." to ".$elementID['id']."\n"; //debug
      }
    }

    //START SAVE TEXT SECTIONS
    //Update the text sections, and store the same text in the _name or _string fields of the relation. Note that the text section combinations are also saved for relations that do not have user input. Though the current (20121112) interface does not show these textSections, it is no problem and might be useful in future releases. 
    if(isset($newRelationArr['text_sections'])){
      $textSectionCombination = new TextSectionCombination($newRelationArr['text_sections'], $db);
    } else {
      $textSectionCombination = new TextSectionCombination(null, $db);
      $textSectionCombination->fillEmptyFields();
    }
    $tsc_id = $textSectionCombination->save();

    //Start preparing the data that are to be saved.
    $arRelationFieldValues = $newRelationArr;
    //Link the relation to the appropriate textSectionCombination, when any
    if(isset($tsc_id)){
      $arRelationFieldValues['tsc_id'] = $tsc_id;
    } else {
      $tsc_id = null;
    }
    //END SAVE TEXT SECTIONS
    //START PREPARE UPDATE AND CREATE
    //filter out the arrays of the data of the new relation, so we are left with the "pure" data that needs to be saved directly in the fields of the database (and not in related fields). The type is already stored in the StorageID(), the label comes from the XML file.
    foreach($arRelationFieldValues as $key => $dataItem){
      if(gettype($dataItem) == "array" || 
        $key == "type" || 
        $key == "label" || 
        $key == "id" || 
        $key == "arity" ||
        $key == "name"){
        unset($arRelationFieldValues[$key]);
      }
    }
    if(!isset($baseRelationArr['elements'])){
      //if there are no elements, there must be a text field for this relation.
      if($newRelationArr['type'] == "proposition"){
        //this is an ugly, hard-coded exception to the rule that texts should be stored in the $type."_name" field (which is only the case for propositions). These fields should be fully removed from the DB, ideally, so we only have textSections left.
        $textfield = $newRelationArr['type']."_string";
      } else {
        $textfield = $newRelationArr['type']."_name";
      }
      $arRelationFieldValues[$textfield] = $newRelationArr['text_sections'][0]['text'];
    }
    //END PREPARE UPDATE AND CREATE

    //START UPDATE RELATION PART: update the relation when it was saved before.
    if($alreadySaved){
      $arFieldValues = $arRelationFieldValues;//array('tsc_id' => $tsc_id);
      $arConditions = array($newRelationArr['type']."_id" => $newRelationArr[$newRelationArr['type']."_id"]);
      $db->update($newRelationArr['type'], $arFieldValues, $arConditions);
      //these are certainly not necessary anymore in the future, so unset them.
      unset($arFieldValues);
      unset($arConditions);
      //END UPDATE RELATION PART
    } else {
      //START CREATE RELATION PART
//      //set the 'text' index for storage directly inside the table.
//      if(isset($newRelationArr['text_sections'][0]['text'])){
//        $arRelationFieldValues['text'] = $newRelationArr['text_sections'][0]['text'];
//      }

      //Create the relation (todo: alter name of function)
      $relID = $db->storeRelation($newRelationArr['type'], $arRelationFieldValues);

      //Update the $newRelationArr with the appropriate new values
      $newRelationArr[$newRelationArr['type']."_id"] = $relID;

      //When the relation is linked to a specific discussion, set this link (todo: make link possible to more than 1 discussion)
      if(isset($newRelationArr['discussionIDs'])){
        $arFieldValues = array("relation_id" => $relID,
          "relation_sort" => $newRelationArr['type'],
          "discussion"    => $newRelationArr['discussionIDs'][0]);
        //todo: make better version of this: don't directly input DB table name here.
        $db->insert('ART_relations_discussions', $arFieldValues);
      }
    }
    //END CREATE RELATION PART

    //prepare return values and return them.
    $justSaved = array("type" => $newRelationArr['type'],
                       "id"   => $newRelationArr[$newRelationArr['type']."_id"]);
    if(isset($baseRelationArr['name'])){ //if there was a name (and thus a mapping), then append it, so it will not be erroneously saved or unneccessarily updated two or more times.
      $alreadySavedElements[$baseRelationArr['name']] = $justSaved;
    }
    //echo "RETURNING ARRAY:"; //debug
    //print_r(array("justSaved"            => $justSaved, //debug
                 //"alreadySavedElements" => $alreadySavedElements)); //debug
    return array("justSaved"            => $justSaved,
                 "alreadySavedElements" => $alreadySavedElements);
  }

  /**
   * Static recursive function that flattens the relation by putting each 
   * element in a different, associative index of the array, including the top 
   * element. The keys of the indices are the "name"s from the XML spec in order 
   * to make comparison/iteration easier. When there is no name attribute, the 
   * elements are stored with their type as index. Eliminates all 'elements' 
   * indices. If several elements have the same name, only one will be used and 
   * no comparison is made between them (that means that consistency is 
   * assumed!).
   * @param array $relationsData Array with the relations to be flattened
   * @param boolean $firstCall Indicates whether this function is called for 
   * the first time. Defaults to true, only actively used in the recursion 
   * step.
   * @retval array The flattened relation as associative array, with the 
   * structure as indicated in the description above. The elements of all 
   * relations are chopped off, but always stored at the top level.
   * @since 3 July 2012
   **/
  private static function flatten($relationsData, $firstCall = true){
    $result = array();
    //the top-most relation has all its features defined directly inside the 'relations' index (e.g. $relations['relation']['type']), but the rest of this function assumes there to be one or more relations with numbered indices at the top level, so we also put the topmost relation in such an index.
    if($firstCall){
      $relationsData = array(0 => $relationsData['relation']);
    }
    //Look whether there is an entry 'elements' for each element of the relation and add it's constituents to the top level array.
    foreach($relationsData as $relationData){
      if(isset($relationData['elements'])){
        $result = array_merge($result, Relation::flatten($relationData['elements'], false));
      }
      //when there are any elements, erase them because they should be in the relation now at the topmost level (flattened out)
      unset($relationData['elements']);
      if(isset($relationData['name'])){
        $result[$relationData['name']] = $relationData;
      } else { //there is no 'name' attribute, so store it under it's type.
        $result[$relationData['type']] = $relationData;
      }
    }
    return $result;
  }

  /**
   * Static function that retrieves all data of relations of a given type
   * @param $type
   * @param Database $db Param because of dependency injection
   * @since 19 November 2012
   */
  public static function getRelationsDataOfType($type, $db = null){
    if(!$db) $db = new Database();
    $relationsDB = $db->select(
      $type,
      array()
    );
    $relationsData = array('relations'=>array());
    foreach($relationsDB as $relationDB){
      $rel = new Relation();
      $rel->load($type."-".$relationDB[$type."_id"]);
      $relData = $rel->getData();
      $relationsData['relations'][] = $relData['relation'];
    }
    return $relationsData;
  }
}
