<?php
/* ----------------------------------------------------------------------------
 * Copyright (c) 2012 Leibniz Center for Law, University of Amsterdam, the 
 * Netherlands
 *
 * This program and the accompanying materials are licensed and made available
 * under the terms and conditions of the European Union Public Licence (EUPL 
 * v.1.1).
 *
 * You should have received a copy of the  European Union Public Licence (EUPL 
 * v.1.1) along with this program as the file license.txt; if not, please see
 * http://joinup.ec.europa.eu/software/page/eupl/licence-eupl.
 *
 * This software is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 * ----------------------------------------------------------------------------
 * Project:      IMPACT
 * Created:      2011-2012
 * Last Change:  14.12.2012 (final release date)
 * ----------------------------------------------------------------------------
 * Created by the Leibniz Center for Law, University of Amsterdam, The 
 * Netherlands, 2012
 * Authors: Jochem Douw (http://jochemdouw.nl), Sander Latour, Giovanni Sileno
 * ----------------------------------------------------------------------------
 */
/**
  The class TextSectionCombination represents a textSectionCombination, which at this point only consists of one textSection. The textSectionCombinations can be saved and retrieved through this class. 
  @since 1 October 2012
*/
class TextSectionCombination extends DbItem{
  
  /**
    The constructor
    @param array $data Data to put in this text section
    @since 1 October 2012
  */
  function __construct($data = false, $db = false){
    //parent::__construct($data); //loading of data was no good idea
    $this->loaded = false;
    $this->IDName = "id";
    if($data){
      $this->setData($data);
    }
    if($db){
      $this->db = $db;
    } else {
      $this->db = new Database();
    }
  }

  /**
    Returns the unique identifier of objects of this type for storage in the storage mechanism
   */
  public static function getStorageID(){ 
    return "ART_text_section_combinations";
  }

  /**
    Sets the data in the internal data representation to the given data.
    @param array $data
   */
  function setData($data){
    $this->data = $data;
  }

  /**
   * Make a skeleton of the textSectionCombination, i.e. create empty values 
   * for all slots and make one empty textSection. Does not overwrite existing 
   * values.
   * @since 9 October 2012
   */
  public function fillEmptyFields(){
    $ts = new TextSection(null, $this->db);
    $ts->fillEmptyFields();
    $this->data = array(0=>$ts->getData());
  }


/*
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
 */

  /**
   * Extension of it's parent's load() function consisting of the loading of 
   * the associated text section. Todo: this hard-coded text_section_id should 
   * of course not be there, as there should be several textSections possible 
   * per combination.
   * @since 1 October 2012
   **/
  public function load($id){
    parent::load($id);
    $ts = new TextSection(null, $this->db);
    $ts->load($this->data['text_section_id']);
    $ts_data = $ts->getData();
    $this->data[0] = $ts_data; //for the moment, only one ts is stored in index 0
  }

  /**
   * Saves the textSectionCombination. When an ID is set, updates the 
   * textSection at the specified ID. Otherwise, stores a new 
   * textSectionCombination.
   * @since 1 October 2012
   **/
  function save(){
    if(isset($this->data)){
      if(isset($this->data['id'])){ //the textSection is already stored and needs to be updated.
        $text_section_combination_id = $this->update();
      } else { //the textSectionCombination is not stored yet. When it is stored, this object also gets it's ID set, so will be recognized as being saved.
        //print_r($this->data);//debug
        $text_section_combination_id = $this->create();
      }
      //$textSectionObj = new TextSection($this->data[0]);
      //$textSectionObj->save();
      return $text_section_combination_id;
    } else {
      show_error("No data present in textSectionCombination object");
    }
  }

  /**
   * Create a textSection that does not exist yet. Todo for enabling several 
   * textSections: take care of value for combination_id
   **/
  protected function create(){
    if(isset($this->data[0]["id"])){ //textSection exists
      $ts_id = $this->data[0]["id"];
    } else { //textSection does not exists and needs to be created
      $textSection = new textSection($this->data[0], $this->db);
      $ts_id = $textSection->save();
    }

    $arFieldValues['text_section_id'] = $ts_id;

    $text_section_combination_id = $this->db->insert($this->getStorageID(), $arFieldValues);
		if(!$text_section_combination_id || !intval($text_section_combination_id) > 0){
      show_error("Creating text section combination failed");
    }
    //also store the combination id
    $arFieldValues2['combination_id'] = $text_section_combination_id;
    $arConditions = array("id" => $text_section_combination_id);
    $tsc_id2 = $this->db->update($this->getStorageID(), $arFieldValues2, $arConditions);
		if($tsc_id2 && intval($tsc_id2) > 0){
			return $text_section_combination_id;
    } else {
      show_error("Creating combination_id failed while creating text section combination ");
    }
  }

  /**
   * Update an existing textSectionCombination.
   * @retval Returns the ID under which it is stored.
   */
  protected function update(){
    $textSection = new textSection($this->data[0], $this->db);
    $ts_id = $textSection->save(); //whether the TS exists or not, it is being saved in the right way.

    $arFieldValues = array();
    $arFieldValues['text_section_id'] = $ts_id;//^$this->data["text_section_id"];
    $arConditions = array("id" => $this->data["id"]);
    $success = $this->db->update($this->getStorageID(), $arFieldValues, $arConditions);
//    if($text_section_combination_id == 1){ //debug
//      echo "conditions:"; //debug
//      print_r($arConditions); //debug
//      echo "values:"; //debug
//      print_r($arFieldValues); //debug
//      show_error("TSC id is 1"); //debug
//    } //debug
		if($success){
			return $this->data["id"];
		} else {
      show_error("Updating text section combination failed");
    }
  }

}
?>
