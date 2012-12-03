<?php
/**
  This is the test document class
  @since 17 September 2012
*/
class testDocument extends testItem{

  public static function runTests(){
    //Nothing at the moment
  }

  /**
   * Adds a document and checks whether it's there.
   * @retval int ID of the new document
   */
  public static function addDocument(){
    $data = array (
        'url' => 'URL of the new document',
        'title' => 'Title of the new doc',
        'text' => 'text...',
        );
    $doc = new Document($data);
    $document_id = $doc->save();
    testItem::resultMustNotBe(0, $document_id, false);
    $doc2 = new Document();
    $doc2->load($document_id);
    $data2 = $doc2->getData();
    foreach($data as $key=>$value){
      testItem::resultMustBe($value, $data2[$key]);
    }
    return $document_id;
  }

  /**
   Updates a document and checks whether the results are in the DB.
   @param int $document_id ID of the document to be updated
   @retval int ID of the new version of the document (might be the same as the
   old when doc is not yet annotated, different otherwise)
   */
  public static function updateDocument($document_id){
    $random = rand(1,1000);//random number to distinguish rows in DB
    $data = array (
        "url" => "$random Updated URL of document",
        "title" => "$random Updated title of the doc",
        "text" => "$random Updated text...",
        "id" => $document_id
        );
    $doc = new Document($data);
    $document_id2 = $doc->save();
    testItem::resultMustNotBe(0, $document_id2, false);
    $doc2 = new Document();
    $doc2->load($document_id2);
    $data2 = $doc2->getData();
    foreach($data as $key => $value){
      if($key != "id"){
        testItem::resultMustBe($value, $data2[$key], false);
      }
    }
    return $document_id2;
  }

  public static function addVersion(){
    //Add version to existing document with ID 7 (SIIA reply)
    /*
    addDocument($storage, 
        array("id"=>"7",
          "url"=>"",
          "title"=>"SIIA reply to Green Paper on Copyright in the Knowledge Economy (Q9, 11, 12, 24)",
          "text"=>"(9) Should the law be clarified with respect to whether the scanning of works held in libraries for the purpose of making their content searchable on the Internet goes beyond the scope of current exceptions to copyright\n\nScanning of copyright works is a form of copying and as such is generally prohibited under the Berne Convention and copyright laws of countries around the globe unless the copier has first obtained the copyright ownerâ€™s authorization to scan the work(s).",
          "first_id"=>"7"
          ),
        7);
    */
  }
}
