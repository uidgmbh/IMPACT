<?php
//Do the includes that are also at the top of api.php
include_once("../php/log.php");
include_once("../php/class.URI.php");
include_once("../php/class.Database.php");
include_once("../php/class.DbItem.php");
include_once("../php/class.Discussion.php");
include_once("../php/class.Document.php");
include_once("../php/class.RelationReader.php");
include_once("../php/class.Relation.php");
include_once("../php/class.TextSection.php");
include_once("../php/class.TextSectionCombination.php");
include_once("../php/class.Storage.php");
//include_once("../php/api_handlers.php");
//include_once("../php/class.debug.php"); 

define("TEST_LOG_FILE", "test.log"); 
require_once("../config/config.php"); 

log_message(TEST_LOG_FILE, "including documents complete");

// set $storage see definitions of constants in config.php
$storage = new Storage(
			HOST_NAME,         // host
			DATABASE_NAME,	   // database
			DB_USERNAME,       // user
			DB_PASSWORD        // password
);

//Include test classes:
include_once("class.TestItem.php");
include_once("class.TestDiscussion.php");
include_once("class.TestTextSection.php");
include_once("class.TestDocument.php");
include_once("class.TestRelation.php");
 

//perform the tests
echo "<pre>";
testAll();

/**
  Function for testing the entire application
 */
function testAll(){
  /*
  //first, add a document (and check whether it's there)
  $doc_id1 = testDocument::addDocument();

  //// updating the document should not result in new version
  $doc_id2 = testDocument::updateDocument($doc_id1);
  testItem::resultMustBe($doc_id1, $doc_id2, false);

  //// add an annotation to the document so this version becomes locked
  $ts_id1 = testTextSection::addAnnotationToDocument($doc_id1);
  $ts_id_empty = testTextSection::makeEmptyTextSection();

  //// update the document again and check that the ID's are not the same
  $doc_id3 = testDocument::updateDocument($doc_id1);
  testItem::resultMustNotBe($doc_id1, $doc_id3, false);

  //// check whether textSection can be updated to be an annotation of the new version of the document
  $ts_id2 = testTextSection::updateTextSection($ts_id1, $doc_id3);
  testItem::resultMustBe($ts_id1, $ts_id2, false);

  //// test textSectionCombination
  $tsc_id1 = testTextSection::addTextSectionCombination($ts_id1);
   */

  //// Make a new relation
  $rel_id1 = testRelation::addAndUpdateRelation();
/*  $rel = new Relation();
  $rel->load('credible_source_as-19');
print_r($rel->getData());*/
  //$reldata = testRelation::getRelation('practical_reasoning_as-1');
  //print_r($relData);

 // $discussion = new Discussion();
  
  //print_r($discussion->fetchRelations(28));


  echo "If there are no errors displayed above, the test might have succeeded!";
}



?>
