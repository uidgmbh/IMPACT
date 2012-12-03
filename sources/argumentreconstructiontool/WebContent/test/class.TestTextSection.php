<?php
/**
 * This is the test textSection class, also used for testing text section 
 * combinations
 * @since 25 September 2012
 **/
class testTextSection extends testItem{

  public static function runTests(){
    //self::addLoadUpdateTextSection();
  }

  /**
   * Adds a textSection that is linked to the given document id.
   * $param int $doc_id
   */
  public static function addAnnotationToDocument($doc_id){
    $data1 = 
      array (
        'text' => 'En deze bevat een begin en eind-marker. Should the law be clarified with respect to whether the scanning of works held in libraries for the purpose of making their content searchable on the Internet goes beyond the scope of current exceptions to copyright',
        'document_id' => $doc_id,
        'start_offset' => '4',
        'end_offset' => '219',
      );
    $textSection = new TextSection($data1);
    $text_section_id = $textSection->save();
    testItem::resultMustNotBe(0, $text_section_id, false);
    //check whether new textSection exists
    $textSection2 = new TextSection();
    $textSection2->load($text_section_id);
    $data2 = $textSection2->getData();
    foreach($data1 as $key => $value){
      testItem::resultMustBe($value, $data2[$key], false);
    }
    return $text_section_id;
  }

  /**
   * Adds a textSection that is empty.
   **/
  public static function makeEmptyTextSection(){
    $data1 = 
      array (
        'text' => '',
        'document_id' => 0,
        'start_offset' => 0,
        'end_offset' => 0,
      );
    $textSection = new TextSection();
    $textSection->fillEmptyFields();
    $text_section_id = $textSection->save();
    testItem::resultMustNotBe(0, $text_section_id, false);
    //check whether new textSection exists
    $textSection2 = new TextSection();
    $textSection2->load($text_section_id);
    $data2 = $textSection2->getData();
    foreach($data1 as $key => $value){
      testItem::resultMustBe($value, $data2[$key], false);
    }
    return $text_section_id;
  }

  /**
   * Updates a textSection and check whether the update succeeded.
   * $param int $ts_id The ID of the to-be-updated textSection
   * $param int $doc_id The document ID of the to-be-updated textSection
   **/
  public static function updateTextSection($ts_id, $doc_id){
    $data1 = 
      array (
        'text' => 'Deze update wist de start_offset en end_offset, laat echter een document_id intact',
        'document_id' => $doc_id,
        'start_offset' => '0',
        'end_offset' => '0',
        'id' => $ts_id
      );
    $textSection = new TextSection($data1);
    $ts_id2 = $textSection->save();
    testItem::resultMustBe($ts_id, $ts_id2, false);
    //check whether new textSection contains the right data
    $textSection2 = new TextSection();
    $textSection2->load($ts_id);
    $data2 = $textSection2->getData();
    foreach($data1 as $key => $value){
      testItem::resultMustBe($value, $data2[$key], false);
    }
    return $ts_id;
  }

  /**
   * Creates a textSectionCombination with one textSection that has the given 
   * text section ID and tests whether it exists.
   * @param $ts_id TextSection ID
   **/
  public static function addTextSectionCombination($ts_id){
    $textSection = new TextSection();
    $textSection->load($ts_id);
    $ts_data = $textSection->getData();
    $data1 = array (0 => $ts_data);
    $textSectionCombination = new TextSectionCombination($data1);
    $tsc_id = $textSectionCombination->save();
    $tsc2 = new TextSectionCombination();
    $tsc2->load($tsc_id);
    $data2 = $tsc2->getData();
    print_r($data2);
    testItem::resultMustBe($ts_data, $data2[0], false);
  }

  /**
   * Creates an empty textSectionCombination with one empty textSection 
   * (FUNCTION NOT FINISHED YET)
   **/
  public static function addEmptyTextSectionCombination(){
    //create empty text section...
    $textSection = new TextSection();
    $textSection->fillEmptyfields();
    $ts_data = $textSection->getData();
    //... put it in an array of text sections as only element ...
    $tsc1data = array (0 => $ts_data);
    //... and make a textSectionCombination with it.
    $textSectionCombination = new TextSectionCombination($tsc1data);
    $tsc_id = $textSectionCombination->save();
    //After having it saved, try to load it again...
    $tsc2 = new TextSectionCombination();
    $tsc2->load($tsc_id);
    $tsc2data = $tsc2->getData();
    testItem::resultMustBe($ts_data['document_id'], $data2[0][$field], false);
    foreach(array('document_id', 'start_offset', 'end_offset', 'text') as $field){

    }
  }
}
