<?php
/* Jochem Douw 5 July 2012: it is a bit of a mystery to me why this file is necessary. I am going to try to take the approach that api.php handles the URI parsing, calls a function that is part of a class dedicated to that object (relation, document, etc.), which in turn calls the storage.php function for MySQL-specific functions.
*/
/*****************************************
 **           ADD Functions             **
 *****************************************/
/*function addDiscussion($storage,$data){
	if($data){
		$discussion_id = $storage->storeDiscussion(
					$data["title"],
					$data["intro"]
				);
		if($discussion_id && intval($discussion_id)>0){
			echo json_encode(array("data"=>$discussion_id));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
  }
}*/

/**
  Function (either or not temporarily) out of order.
*//*
function addTextElement($storage,$data){
	if($data){
		$textid = $storage->storeTextElement(
						$data["text"],
						$data["documentID"],
						$data["startOffset"],
						$data["endOffset"]
		);
		if($textid && intval($textid) > 0){
			echo json_encode(array("data"=>$textid));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Invalid data provided")
		);
	}
}*/

/**
  Old version, needs to be renewed
*/
function addRelation($storage,$user,$data){
	if($data){
		$relation = $storage->storeRelation(
						$data["discussion"],
						$data["type"],
						$user
					);
		if($relation && intval($relation)>0){
			echo json_encode(array("data"=>$relation));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Could not parse request")
		);
	}
}

/**
  Old version, needs to be renewed
*/
function addRelationElement($storage,$user,$relation_id,$data){
	if($data){
		$relationElem = $storage->storeRelationTextElement(
							$data["type"],
							$relation_id,
							$data["text_element"],
							$data["conclusion"],
							$user
						);
		if($relationElem && intval($relationElem)>0){
			echo json_encode(array("data"=>$relationElem));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Could not parse request")
		);
	}
}

/**
	Add a document 
	@param $storage {Storage} - Storage object.
	@param $data {associative array} - data that needs to be stored. 
  @param $first_id The index first_id is false or an integer > 0 - When a new version of an existing document has to be made, this is the first_id it has to have. Otherwise false.
	@since 7 March 2012
*/
function addDocument($storage, $data, $first_id){
  if(intval($first_id) == 0) $first_id = false;
	if($data){
		$documentID = $storage->storeDocument($data["title"],
																					$data["url"],
																					$data["text"],
																					$first_id
																				);
		if($documentID){
			echo json_encode(array("data"=>$documentID));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Could not parse request")
		);
	}
}

/*****************************************
 **           UPDATE Functions          **
 *****************************************/

//zou hernoemd kunnen worden naar updateRelationHandler
function updateRelation($storage,$user, $id, $data){
	if($data){
		$affected = $storage->updateRelation(
						$id,
						$data["discussion"],
						$data["type"],
						$user
					);
		if($affected){
			echo json_encode(array("data"=>true));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Could not parse request")
		);
	}
}

function updateRelationElement($storage,$user,$id, $data){
	if($data){
		$affected = $storage->updateRelationTextElement(
						$id,
						$data["type"],
						$relation_id,
						$data["text_element"],
						$data["conclusion"],
						$user
					);
		if($affected){
			echo json_encode(array("data"=>true));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Could not parse request")
		);
	}
}
/**
	DEPRECATED. Update a text element
	@param $storage {Storage} - Storage object.
	@param $id {int} - ID of the text element.
	@param $data {associative array} - data that needs to be stored.
*/
function DEPRupdateTextElement($storage, $id, $data){
	//echo "go with startOFfset ".$data['startOffset'];//debug
	if($data){
		$affected = $storage->updateTextElement(
						$id,
						$data["text"],
						$data["documentID"],
						$data["startOffset"],
						$data["endOffset"]
					);
		if($affected){
			echo json_encode(array("data"=>true));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Could not parse request")
		);
	}
}

/**
	Update a document 
	@param $storage {Storage} - Storage object.
	@param $id {int} - ID of the document.
	@param $data {associative array} - data that needs to be stored.
*/
function updateDocument($storage, $id, $data){
	if($data){
		$affected = $storage->updateDocument($id,
																				 $data["title"],
																				 $data["url"],
																				 $data["text"]
																				);
		if($affected){
			echo json_encode(array("data"=>true));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Could not parse request")
		);
	}
}

/**
	Update a discussion
	@param $storage {Storage} - Storage object.
	@param $id {int} - ID of the discussion.
	@param $data {associative array} - data that needs to be stored.
*/
/*function updateDiscussion($storage, $id, $data){
	if($data){
		$affected = $storage->updateDiscussion($id,
																						$data["title"],
																						$data["intro"]
																					 );
		if($affected){
			echo json_encode(array("data"=>true));
		}else{
			header('HTTP/1.0 400 Bad Request');
			echo json_encode(
				array("error"=>"Invalid data provided")
			);
		}
	}else{
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
			array("error"=>"Could not parse request")
		);
	}
}*/

/*****************************************
 **           VIEW Functions            **
 *****************************************/

function fetchRelationElementByType($storage, $relation, $type){
	$details = $storage->fetchRelationElementByType($relation, $type);
	if($details){
		$details["element"] = $storage->fetchTextSection($details["text_element"]);
		if($details["element"]){
			return $details;
		}
	}
	return false;
}
