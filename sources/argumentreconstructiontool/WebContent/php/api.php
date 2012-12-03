<?php

header('Access-Control-Allow-Origin: *');


/*
This document has the following parts, in this order:
- Includes and other initial things
- Test area
- CREATE QUERIES
- UPDATE QUERIES
- VIEW QUERIES
 */
/*************************************
 * Includes and other initial things *
 *************************************/
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
include_once("../php/api_handlers.php");

define("API_LOG_FILE", "api.log");
require_once("../config/config.php");

log_message(API_LOG_FILE, "included api.php");

// see in config.php
$storage = new Storage(
  HOST_NAME,         // host
  DATABASE_NAME,     // database
  DB_USERNAME,       // user
  DB_PASSWORD        // password
);

$db = new Database();


$user = 1;
header("Content-type: application/json");

$uri = new URI($_SERVER['QUERY_STRING']);
if($uri->valid()){
  log_message(API_LOG_FILE, "Valid URI.");
  if ( $_SERVER['REQUEST_METHOD'] == "POST" ){
    /******************************
     ***    CREATE QUERIES    ***
     ******************************/
    $data = json_decode(file_get_contents("php://input"),true);

    switch($uri->next()){
    case "discussions":
      /********************************
       * Add discussion               *
       * ============================ *
       * POST /api.php?/discussions/  *
       ********************************/
      if($data){
        $discussion = new Discussion($data, $db);
        $discussion_id = $discussion->save();
        echo json_encode(array("discussion_id"=>$discussion_id));
      }else{
        header('HTTP/1.0 400 Bad Request');
        show_error("No data provided");
      }
      break;

    case "relations":
      if($uri->end()){
        /********************************
         * Add relation                 *
         * ============================ *
         * POST /api.php?/relations/    *
         ********************************/
        //echo var_export($data); //for testing
        $relation = new Relation($data, $db);
        $relation_id = $relation->save();
        echo json_encode(array("relation_id" => $relation_id));
      }else{
        header('HTTP/1.0 400 Bad Request');
      }
      break;

    case "documents":
      if($uri->end()){
        /*******************************
         * Add document                 *
         * ============================ *
         * POST /api.php?/documents/    *
         *******************************/
        //var_export($data);
        $doc = new Document($data, $db);
        $output = $doc->save();
        echo json_encode($output);
        //addDocument($storage, $data, false);
      } elseif($uri->next() == "version" && $firstID = $uri->nextInt()) {
        /*******************************************
         * Add new version of document with this ID *
         * ======================================== *
         * POST /api.php?/documents/version/(id)    *
         *******************************************/
        //addDocument($storage, $data, $firstID);
        //Basically the same as adding a new document
        $doc = new Document($data, $db);
        $output = $doc->save();
        echo json_encode($output);

      } else {
        header('HTTP/1.0 400 Bad Request');
        echo json_encode(
          array("error"=>"Could not parse request, stranded at /document/")
        );
      }
      break;

    default:
      header('HTTP/1.0 400 Bad Request');
    }
    /******************************
     ***    UPDATE QUERIES     ***
     ******************************/
  } else if($_SERVER['REQUEST_METHOD'] == "PUT" ){
    log_message(API_LOG_FILE, "PUT request");
    $data = json_decode(file_get_contents("php://input"),true);
    switch($uri->next()){

    case "relations":
      if($uri->end()){
        /********************************
         * Update relation              *
         * ============================ *
         * PUT /api.php?/relations/     *
         ********************************/
        //          echo var_export($data); //for testing
        $relation = new Relation($data, $db);
        $relation_id = $relation->save();
        echo json_encode(array("relation_id" => $relation_id));
      }
      break;

      /*case "text":
        if($textID = $uri->nextInt()){
          /********************************
           * Update relation element      *
           * ============================ *
           * PUT /api.php?/text/(int)     *
           ********************************
          updateTextElement(
            $storage,
            $textID,
            $data
          );
        }else{
          header('HTTP/1.0 400 Bad Request');
        }
      break; */

    case "documents":
      if($documentID = $uri->nextInt()){
        /**********************************
         * Update document                *
         * ============================== *
         * PUT /api.php?/documents/(int)  *
         **********************************/
      $document = new Document($data, $db);
      $result = $document->save();
      echo json_encode(array("document_id"=>$result));
      }
      break;

    case "discussions":
      if($discussionID = $uri->end()){
        /*********************************
        * Update discussion              *
        * ============================== *
        * PUT /api.php?/discussion/(int) *
        *********************************/
        if($data){
          $discussion = new Discussion($data, $db);
          $success = $discussion->update();
          echo json_encode(array("success"=>(int)$success));
        }else{
          header('HTTP/1.0 400 Bad Request');
          show_error("No data provided for discussion");
        }
      } else {
        header('HTTP/1.0 400 Bad Request');
      }
      break;

    default:
      header('HTTP/1.0 400 Bad Request');
      break;
    }
    /******************************
     ***    VIEW QUERIES        ***
     ******************************/
  } else if($_SERVER['REQUEST_METHOD'] == "GET" ){
    log_message(API_LOG_FILE, "GET request");
    switch($uri->next()){
    case "discussions":
      if( $uri->end() ){
        /*************************************
         * Get all discussions                *
         * ================================== *
         * /api.php?/discussions              *
         *************************************/
      header('HTTP/1.0 200 OK');
      $discussions = $storage->fetchDiscussions();
      echo json_encode(array("discussions"=>$discussions));
      } else if( $discussionID = $uri->nextInt() ){
        if( $uri->end() ){
          /**************************************
           * Get discussion details             *
           * ================================== *
           * GET /api.php?/discussions/(int)    *
           **************************************/
      $discussion = new Discussion(null, $db);
      $discussion->load($discussionID);
      echo json_encode(array("details"=>$discussion->getData()));
        }else if( $uri->next() == "relations" ){
          /*********************************************
           * Get all relations from a discussion       *
           * ========================================= *
           * GET /api.php?/discussions/(int)/relations *
           *********************************************/
      $discussion = new Discussion(null, $db);
      $relations = $discussion->fetchRelations($discussionID);
      //$relations = $storage->fetchRelations($discussionID);
      if($relations || $relations == array()){
        echo json_encode(array("relations"=>$relations));
      } else {
        header('HTTP/1.0 400 Bad Request');
      }
        }else{
          header('HTTP/1.0 400 Bad Request');
        }
      }else{
        header('HTTP/1.0 400 Bad Request');
      }
      break;
    case "relations":
      if($relationType = $uri->next()){
        if($relationID = $uri->nextInt()){
          if($uri->end()){
            /******************************************
             * Get relation details (type)/(ID)       *
             * ====================================== *
             * GET /api.php?/relations/(string)/(int) *
             ******************************************/
      $relation = new Relation(null, $db);
      $relation->load($relationType."-".$relationID);
      $relationArr = $relation->getData(); //^ $relation->interpret($relationType, $relationID);
      echo json_encode($relationArr);
          } 
        } elseif($uri->next() == "all"){
          /*****************************************
           * Get empty relation by type             *
           * ====================================== *
           * GET /api.php?/relations/(string)/all   *
           ******************************************/
          //get a list of all relations with the specified type.
          echo json_encode(Relation::getRelationsDataOfType($relationType, $db));

        } elseif($uri->end()){

        /*************************************
         * Get empty relation by type        *
         * ================================= *
         * GET /api.php?/relations/(string)  *
         *************************************/
      $rel = new Relation(null, $db);
          $json_encoding = $rel->_makeSkeletonData($relationType, true);
          echo json_encode($json_encoding);
        }
      }else{
        header('HTTP/1.0 400 Bad Request');
      }
      break;
    case "documents":
      if($uri->end()){
        /********************************
         * Get document details for all *
         * newest versions of documents.*
         * ============================ *
         * GET /api.php?/documents/     *
         ********************************/
      log_message(API_LOG_FILE, "GET /api.php?/documents/");

      $documents = $storage->fetchDocuments();
      if($documents){
        echo json_encode(array("documents"=>$documents));
      } else {
        header('HTTP/1.0 400 Bad Request');
      }
      }else if($id = $uri->nextInt()){
        /**************************************
         * Get document by id                 *
         * ================================== *
         * GET /api.php?/documents/(int)      *
         **************************************/
      if($uri->end()){
        $document = new Document(null, $db);
        $document->load($id);
        $data = $document->getData();
        //$details = $storage->fetchDocumentByID($id);
        //if($details){
        echo json_encode(array("details"=>$data));
        //            }else{
        //              header('HTTP/1.0 400 Bad Request');
        //            }
      } else if($uri->next() == "versions"){
        /******************************************
         * Get versions by document id            *
         * ====================================== *
         * GET /api.php?/documents/(int)/versions *
         ******************************************/
      $details = $storage->fetchVersionsByDocID($id);
      if($details){
        echo json_encode(array("documents"=>$details));
      } else {
        header('HTTP/1.0 400 Bad Request');
      }
      } else {
        header('HTTP/1.0 400 Bad Request');
      }
      }
      break;
    case "issues":
      if($id = $uri->next()){
        /**********************************
         * Get details for all issues     *
         * ============================== *
         * GET /api.php?/issues/(string)  *
         *********************************/
      $discussion = new Discussion(null, $db);
      $issues = $discussion->fetchIssue($id); //$storage->fetchIssue($id);
      if($issues){
        echo json_encode($issues);
      } else {
        header('HTTP/1.0 400 Bad Request');
      }
      } else {
        header('HTTP/1.0 400 Bad Request');
      }
      break;
    default:
      header('HTTP/1.0 400 Bad Request');
      break;
    }
  }else{
    header('HTTP/1.0 405 Invalid Method');
  }
}else{
  log_message(API_LOG_FILE, "Not valid URI.");
  header('HTTP/1.0 400 Bad Request');
}
$storage->destroy();
