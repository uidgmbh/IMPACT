<?php
/**
 * The class TextSection represents a textSection. It functions similarly to the 
 * Relation class. The textSection can be saved through this class.  
 * @since 18 July 2012
 **/
class TextSection extends DbItem{
  
  /**
   * The constructor
   * @param array $data Data to put in this text section
   * @since 18 July 2012
   **/
  function __construct($data = false, $db = false){
    parent::__construct($data, $db);
  }

  /**
   * Returns the unique identifier of objects of this type for storage in the 
   * storage mechanism
   **/
  public static function getStorageID(){ 
    return "ART_text_sections";
  }

  /**
   * Extension of parent::load() to actually fill the data with a quote as well 
   * (is redundant information, but needs to be shipped with the API calls.
   * @since 15 October 2012
   */
  public function load($id){
    parent::load($id);
    $this->setQuote();
  }

  /**
   * Sets the data in the internal data representation to the given data.
   * @param array $data
   **/
  function setData($data){
    $this->data = $data;
    $this->setQuote();
  }

  /**
   * Sets the document ID and the offsets.
   * @param int $documentID
   * @param array $offsets The offsets, with the start offset at index 0 and the 
   * end offest at index 1.
   * @since 18 July 2012
   **/
  function setDocAndOffsets($documentID, $offsets){
    $this->data['document_id'] = $documentID;
    $this->data['start_offset'] = $offsets[1];
    $this->data['end_offset'] = $offsets[0];
    $this->setQuote();
  }

  /**
   * Sets the 'quote' index of the data to the quote of the document with the 
   * stored document id and start and end offsets (if any). If necessary values 
   * are incomplete, nothing is done and the function returns false. If the 
   * quote could be set, returns true.
   * @since 15 October 2012
   **/
  function setQuote(){
    if($this->data['document_id'] && $this->data['start_offset'] && $this->data['end_offset']){
      $document = new Document(null, $this->db);
      $document->load($this->data['document_id']);
      $docData = $document->getData();
      $this->data['quote'] = mb_substr($docData['text'], $this->data['start_offset'], ($this->data['end_offset']-$this->data['start_offset']));
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sets the text
   * @param string $text
   * @since 18 July 2012
   **/
  public function setText($text){
    $this->data['text'] = $text;
  }
  
  /**
   * Gets the text
   * @since 25 July 2012
   **/
  public function getText(){
    return $this->data['text'];
  }

  /**
   * Make a skeleton of the textSection, i.e. create empty values for all 
   * slots. Does not overwrite existing values.
   * @since 8 October 2012
   */
  public function fillEmptyFields(){
    //todo: make a generally available list of the fields for this object and use that one here, preferably moving this whole function to DbItem.
    foreach(array('document_id', 'start_offset', 'end_offset', 'text') as $field){
      if(!isset($this->data[$field])){
        if($field == 'text'){
          $this->data[$field] = ""; 
        } else {
          $this->data[$field] = null; 
        }
      }
    }
  }

  /**
   * Saves the textSection. When an ID is set, stores the textSection at the 
   * specified ID. Otherwise, stores a new textSection.
   * @since 18 July 2012
   **/
  function save(){
    if($this->data['start_offset'] > $this->data['end_offset']){ //selection was made in reverse order, so reverse values
      //store start_offset in help variable
      $start_offset = $this->data['start_offset'];
      //..and swap!
      $this->data['start_offset'] = $this->data['end_offset'];
      $this->data['end_offset'] = $start_offset;
    }
    $this->fillEmptyFields();
    //^$db = new Database();
    if(isset($this->data['id'])){ //the textSection is already stored and needs to be updated.
      $text_section_id = $this->update();
    } else { //the textSection is not stored yet. When it is stored, this object also gets it's ID set, so will be recognized as being saved.
      //echo "save a new text section with text ".$this->data['text']."!\n"; //debug
      $text_section_id = $this->create();
    }
    return $text_section_id;
  }

  /**
   * Create a textSection that does not exist yet
   **/
  protected function create(){
    $arFieldValues = array();
    $arFieldValues['text'] = $this->data["text"];
    $arFieldValues['document_id'] =
      $this->data["document_id"] ? $this->data["document_id"]: null;
    $arFieldValues['start_offset'] =
      $this->data["start_offset"] ? $this->data["start_offset"] : null;
    $arFieldValues['end_offset'] = 
      $this->data["end_offset"] ? $this->data["end_offset"] : null;
    //^$db = new Database();
    $text_section_id = $this->db->insert($this->getStorageID(), $arFieldValues);
		if($text_section_id && intval($text_section_id) > 0){
			return $text_section_id;
		} else {
      show_error("Creating text section failed");
    }
  }

  /**
   * Update an existing textSection.
   */
  protected function update(){
    $arFieldValues = array();
    $arFieldValues['text'] = $this->data["text"];
    $arFieldValues['document_id'] =
      $this->data["document_id"] ? $this->data["document_id"]: null;
    $arFieldValues['start_offset'] =
      $this->data["start_offset"] ? $this->data["start_offset"] : null;
    $arFieldValues['end_offset'] = 
      $this->data["end_offset"] ? $this->data["end_offset"] : null;
    $arConditions = array("id" => $this->data["id"]);
    //^$db = new Database();
    $success = $this->db->update($this->getStorageID(), $arFieldValues, $arConditions);
		if($success){
			return $this->data["id"];
		} else {
      show_error("Updating text section failed");
    }
  }
}
?>
