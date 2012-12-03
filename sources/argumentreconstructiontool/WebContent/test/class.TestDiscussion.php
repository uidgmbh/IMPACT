<?php
/** 
  Unit testing for the the Discussion class.
 */
class testDiscussion extends testItem{

  public static function runTests(){
    testDiscussion::addLoadUpdateDiscussion();
    //$this->removeDiscussion();
  }

  public static function addLoadUpdateDiscussion(){
    $data =
      array (
          'title' => 'Test discussion, original title',
          'intro' => 'Introduction of the test discussion (original one)',
          );
    $discussion = new Discussion($data);
    $discussion_id = $discussion->save();
    $discussion2 = new Discussion();
    $discussion2->load($discussion_id);
    $actualResult = $discussion2->getData();
    testItem::resultMustBe($data['title'], $actualResult['title']);
    testItem::resultMustBe($data['intro'], $actualResult['intro']);
    testItem::resultMustNotBe(false, $actualResult['id'], false);
  }
}
