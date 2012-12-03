<?php
/********************************************************************************
 *                                                                              *
 *  (c) Copyright 2010 The Open University UK                                   *
 *                                                                              *
 *  This software is freely distributed in accordance with                      *
 *  the GNU Lesser General Public (LGPL) license, version 3 or later            *
 *  as published by the Free Software Foundation.                               *
 *  For details see LGPL: http://www.fsf.org/licensing/licenses/lgpl.html       *
 *               and GPL: http://www.fsf.org/licensing/licenses/gpl-3.0.html    *
 *                                                                              *
 *  This software is provided by the copyright holders and contributors "as is" *
 *  and any express or implied warranties, including, but not limited to, the   *
 *  implied warranties of merchantability and fitness for a particular purpose  *
 *  are disclaimed. In no event shall the copyright owner or contributors be    *
 *  liable for any direct, indirect, incidental, special, exemplary, or         *
 *  consequential damages (including, but not limited to, procurement of        *
 *  substitute goods or services; loss of use, data, or profits; or business    *
 *  interruption) however caused and on any theory of liability, whether in     *
 *  contract, strict liability, or tort (including negligence or otherwise)     *
 *  arising in any way out of the use of this software, even if advised of the  *
 *  possibility of such damage.                                                 *
 *                                                                              *
 ********************************************************************************/
/**
 * Import library
 * Functions for the importing of data from external sources (eg blogs RSS etc)
 */

require_once "rss/rss_php.php";

/**
 * Imports the given RSS XML into ideas for current user
 *
 * @param string $rssxml the RSS XML to import
 * @param array $errors the current errors array (for reporting any problems with this script - note that it's passed by reference)
 * @return integer the number of nodes imported
 */
function importRSS($feedurl,&$errors){
    global $USER,$CFG;

    $http = array('method'  => 'GET',
                    'request_fulluri' => true,
                    'timeout' => '2');
    if($CFG->PROXY_HOST != ""){
        $http['proxy'] = $CFG->PROXY_HOST . ":".$CFG->PROXY_PORT;
    }
    $opts = array();
    $opts['http'] = $http;

    $context  = stream_context_create($opts);
    $rssxml = file_get_contents($feedurl, 0, $context);

    //convert into ximple xml (just to test if it's valid or not)
    // can't use this for processing as it excludes all the CDATA stuff
    $rss = @simplexml_load_string($rssxml);
    if($rss == null){
        array_push($errors,"This does not appear to be a valid RSS feed please try again.");
        return;
    }

    $rss = new rss_php;
    $rss->loadXML($rssxml);

    $items = $rss->getItems();
    $count = 0;
    foreach($items as $index => $item) {
        //add the node
        if($item['content:encoded'] != ""){
            $desc = $item['content:encoded'];
        } else {
            $desc = $item['description'];
        }
        $node = addNode($item['title'],$desc,$USER->privatedata);
        if($item['link'] != ""){
            $url = addURL($item['link'],$item['title'],"");
            addURLToNode($url->urlid,$node->nodeid);
        }
        $count++;
    }
    return $count;
}


/**
 * Updates all the RSS feeds marked as regular
 *
 */
function updateRSS(&$errors, &$log){
    global $CFG,$DB,$USER;
    //get all the RSS feeds marked as regular
    $sql = "SELECT FeedID,UserID FROM Feeds WHERE Regular='Y'";
    $res = mysql_query($sql, $DB->conn);
    while ($array = mysql_fetch_array($res, MYSQL_ASSOC)){
        $USER = new User($array["UserID"]);
        $USER->load();
        $f = new Feed($array["FeedID"]);
        $f->load();
        array_push($log,"Attempting to refresh: ".$f->url);
        addToLog("Refresh feed","Feed",$array["FeedID"]);
        $f->refresh($errors, $log);
    }
}


/**
 * Import from Compendium XML
 */
function importCompendiumXML($xml,&$errors,&$results){

    global $DB, $CFG, $USER;
    $RESPONDS_TO = "responds to";
    $SUPPORTS = "supports";
    $CHALLENGES = "challenges";
    $OBJECTS_TO = "objects to";
    $codeCache = null;

    $codes = $xml->getElementsByTagName( "code" );
    foreach ($codes as $code) {
        $id = $code->getAttribute('id');
        $name = $code->getAttribute('name');
        $codeCache[$id] = $name;
    }

    $nodeCache = null;

    $IDEA = "Idea";
    $QUESTION = "Question";
    //$ANSWER = "Answer";
    $PRO = "Pro";
    $CON = "Con";

    $r = getRoleByName($IDEA);
    $roleIdea = $r->roleid;
    $r = getRoleByName($QUESTION);
    $roleQuestion = $r->roleid;
    //Answer changed to use Idea
    //$r = getRoleByName($ANSWER);
    //$roleAnswer = $r->roleid;
    $r = getRoleByName($PRO);
    $rolePro = $r->roleid;
    $r = getRoleByName($CON);
    $roleCon = $r->roleid;

    $checkRoles = null;

    $nodes = $xml->getElementsByTagName( "node" );
    foreach ($nodes as $node) {
        $id = $node->getAttribute('id');

        // We don't want to import the parent view as it bears
        //if ($id != $rootview) {
            $type = $node->getAttribute('type');
            $label = $node->getAttribute('label');
            $detail = "";

            $ref = "";
            $sources = $node->getElementsByTagName( "source" );
            if ($sources != null) {
                $source = $sources->item(0)->nodeValue;

                // check if it's a URL
                if (substr($source, 0, 3) == "www") {
                    $source = "http://".$source;
                }
                if (substr($source, 0, 7) == "http://" ||
                        substr($source, 0, 8) == "https://" ||
                        substr($source, 0, 7) == "feed://") {

                    $ref = $source;
                }
            }

            $details = $node->getElementsByTagName( "details" );
            foreach($details as $page) {
                $detail .= $page->nodeValue."\r\n\r\n";
            }
            $detail = trim($detail);

            $label = trim($label);
            if ($label == "") {
                $label = "untitled - ".getUniqueID();
            }

            $nextnode['id'] = $id;
            $nextnode['type'] = $type;
            $nextnode['label'] = $label;
            $nextnode['detail'] = $detail;
            $nextnode['ref'] = $ref;

            $nodeTypeID = $roleIdea;
            if ($type == "3" || $type == "13") {
            	$nodeTypeID = $roleQuestion;
            } else if ($type == "4" || $type == "14") {
            	$nodeTypeID = $roleIdea;
            } else if ($type == "6" || $type == "16") {
            	$nodeTypeID = $rolePro;
            } else if ($type == "7" || $type == "17") {
            	$nodeTypeID = $roleCon;
            } else {
                $name="";
                $image = "";
                if ($type == "1" || $type == "11") {
                    $name = "(Compendium List)";
                    $image = 'images/nodetypes/Default/list-32x32.png';
                } else if ($type == "2" || $type == "12" || $type == "22") {
                    $name = "(Compendium Map)";
                    $image = 'images/nodetypes/Default/map-32x32.png';
                } else if ($type == "5" || $type == "15") {
                    $name = "Argument";
                    $image = 'images/nodetypes/Default/argument-32x32.png';
                } else if ($type == "8" || $type == "18") {
                    $name = "Decision";
                    $image = 'images/nodetypes/Default/decision-32x32.png';
               } else if ($type == "9" || $type == "19") {
                    $name = "Reference";
                    $image = 'images/nodetypes/Default/reference-32x32.png';
               } else if ($type == "10" || $type == "20") {
                    $name = "Note";
                    $image = 'images/nodetypes/Default/note-32x32.png';
                } else {

                }
                if ($checkRoles[$name]) {
                	$nodeTypeID = $checkRoles[$name];
                } else {
                	$role = addRole($name, $image);
                    $checkRoles[$name] = $role->roleid;
                    $nodeTypeID = $role->roleid;
                }
            }

            $nodeobj = addNode($label,$detail,$USER->privatedata,$nodeTypeID);

            // add tags
            $coderefs = $node->getElementsByTagName( "coderef" );
            foreach($coderefs as $coderef) {
            	$nexttag = $codeCache[$coderef->getAttribute('coderef')];
            	$tag = addTag($nexttag);
            	$nodeobj->addTag($tag->tagid);
            }

            $nextnode['newID'] = $nodeobj->nodeid;
            array_push($results,"Idea added: ".$label);

            $nodeCache[$id] = $nextnode;
        //}
    }


    $linkCache = null;

    $linkLoop = 0;
    $links = $xml->getElementsByTagName( "link" );
    foreach ($links as $link) {
        $id = $link->getAttribute('id');
        $from = $link->getAttribute('from');
        $to = $link->getAttribute('to');
        $type = $link->getAttribute('type');

        $label = $link->getAttribute('label');

        //Strip out commas as they are now allowed in linktype labels.
        //They are used as the separator when sending lists of linktypes to the server.
        //This would break that, if they where left.
        if ($label != "") {
            $label = str_replace(",", ' ', $label);
        } else {
            if ($type == "39") {
                $label = $RESPONDS_TO;
            } else if ($type == "40") {
                $label = $SUPPORTS;
            } else if ($type == "41") {
                $label = $CHALLENGES;
            } else if ($type == "42") {
                $label = $CHALLENGES;
            } else if ($type == "43") {
                $label = "specializes";
            } else if ($type == "44") {
                $label = "expands on";
            } else if ($type == "45") {
                $label = $RESPONDS_TO;
            } else if ($type == "46") {
                $label = "about";
            } else if ($type == "47") {
                $label = "resolves";
            } else {
                $label = $RESPONDS_TO;
            }
        }

        $nextLink['id'] = $id;
        $nextLink['from'] = $from;
        $nextLink['to'] = $to;
        $nextLink['label'] = $label;
        $nextLink['type'] = $type;

        $linkCache[$linkLoop] = $nextLink;
        $linkLoop ++;
    }

    // get the linktype id for the connection to use.
    $lt = getLinkTypeByLabel($RESPONDS_TO);
    $linktypeRespondsTo = $lt->linktypeid;
    $lt = getLinkTypeByLabel($SUPPORTS);
    $linktypeSupports = $lt->linktypeid;
    $lt = getLinkTypeByLabel($CHALLENGES);
    $linktypeChallenges = $lt->linktypeid;

	if (!$linkCache){
		array_push($errors, "There are no links that can be imported from this map");
		return;
	}
    foreach($linkCache as $next) {

        $fromNode = $nodeCache[$next['from']];
        $toNode = $nodeCache[$next['to']];

        if ($fromNode != null && toNode != null) {

            $fromNodeID = $fromNode['newID'];
            $toNodeID = $toNode['newID'];

            if ($fromNodeID != null && $toNodeID != null) {

                // ADD ANY ASSOCIATED URLS TO THE NODES
                if ($fromNode['ref'] != null) {
                    $url = addURL($fromNode['ref'], $fromNode['ref'], "");
                    addURLToNode($url->urlid,$fromNodeID);
                }
                if ($toNode['ref'] != null) {
                	$url = addURL($toNode['ref'], $toNode['ref'], "");
                    addURLToNode($url->urlid,$toNodeID);
                }

                //create user defined roles for other node types '(Compendium Map)', '(Compendium List)'.

                $groupid = $CFG->defaultRoleGroupID;

                $fromRoleID = "";
                $fromNodeType = $fromNode['type'];

                if ($fromNodeType == "3" || $fromNodeType == "13") {
                    $fromRoleID = $roleQuestion;
                } else if ($fromNodeType == "4" || $fromNodeType == "14") {
                    $fromRoleID = $roleIdea;
                } else if ($fromNodeType == "6" || $fromNodeType == "16") {
                    $fromRoleID = $rolePro;
                } else if ($fromNodeType == "7" || $fromNodeType == "17") {
                    $fromRoleID = $roleCon;
                } else {
                    $name="";
                    $image = "";
                    if ($fromNodeType == "1" || $fromNodeType == "11") {
                        $name = "(Compendium List)";
                        $image = 'images/nodetypes/Default/list-32x32.png';
                    } else if ($fromNodeType == "2" || $fromNodeType == "12" || $type == "22") {
                        $name = "(Compendium Map)";
                        $image = 'images/nodetypes/Default/map-32x32.png';
                    } else if ($fromNodeType == "5" || $fromNodeType == "15") {
                        $name = "Argument";
                        $image = 'images/nodetypes/Default/argument-32x32.png';
                    } else if ($fromNodeType == "8" || $fromNodeType == "18") {
                        $name = "Decision";
                        $image = 'images/nodetypes/Default/decision-32x32.png';
                   } else if ($fromNodeType == "9" || $fromNodeType == "19") {
                        $name = "Reference";
                        $image = 'images/nodetypes/Default/reference-32x32.png';
                   } else if ($fromNodeType == "10" || $fromNodeType == "20") {
                        $name = "Note";
                        $image = 'images/nodetypes/Default/note-32x32.png';
                    } else {

                    }
                    if ($checkRoles[$name]) {
                        $fromRoleID = $checkRoles[$name];
                    } else {
                    	$role = addRole($name, $image);
                        $checkRoles[$name] = $role->roleid;
                        $fromRoleID = $role->roleid;
                    }

                }

                //create user defined roles for other node types '(Compendium Map)', '(Compendium List)'.
                $toRoleID = "";
                $toNodeType = $toNode['type'];

                if ($fromNodeType == "3" || $fromNodeType == "13") {
                    $toRoleID = $roleQuestion;
                } else if ($fromNodeType == "4" || $fromNodeType == "14") {
                	$toRoleID = $roleIdea;
                } else if ($fromNodeType == "6" || $fromNodeType == "16") {
                	$toRoleID = $rolePro;
                } else if ($fromNodeType == "7" || $fromNodeType == "17") {
                	$toRoleID = $roleCon;
                } else {
                    $name="";
                    if ($toNodeType == "1" || $toNodeType == "11") {
                        $name = "(Compendium List)";
                        $image = 'images/nodetypes/Default/list-32x32.png';
                    } else if ($toNodeType == "2" || $toNodeType == "12" || $type == "22") {
                        $name = "(Compendium Map)";
                        $image = 'images/nodetypes/Default/map-32x32.png';
                    } else if ($toNodeType == "5" || $toNodeType == "15") {
                        $name = "Argument";
                        $image = 'images/nodetypes/Default/argument-32x32.png';
                    } else if ($toNodeType == "8" || $toNodeType == "18") {
                        $name = "Decision";
                        $image = 'images/nodetypes/Default/decision-32x32.png';
                    } else if ($toNodeType == "9" || $toNodeType == "19") {
                        $name = "Reference";
                        $image = 'images/nodetypes/Default/reference-32x32.png';
                    } else if ($toNodeType == "10" || $toNodeType == "20") {
                        $name = "Note";
                        $image = 'images/nodetypes/Default/note-32x32.png';
                    } else {

                    }
                    if ($checkRoles[$name]) {
                        $toRoleID = $checkRoles[$name];
                    } else {
                        $role = addRole($name, $image);
                        $checkRoles[$name] = $role->roleid;
                        $toRoleID = $role->roleid;
                    }
                }

                //create user defined link type for other types 'specializes' etc..
                $checkLinkTypes = null;

                $linkLabel = $next['label'];
                $linkLabelID = "";

                if (strtolower($linkLabel) == $RESPONDS_TO) {
                	$linkLabelID = $linktypeRespondsTo;
                } else if (strtolower($linkLabel) == $SUPPORTS) {
                    $linkLabelID = $linktypeSupports;
                } else if (strtolower($linkLabel) == $CHALLENGES) {
                    $linkLabelID = $linktypeChallenges;
                } else if (strtolower($linkLabel) == $OBJECTS_TO) {
                	$linkLabel = $CHALLENGES;
                    $linkLabelID = $linktypeChallenges;
                } else {
                    if ($checkLinkTypes[$linkLabel]) {
                        $linkLabelID = $checkLinkTypes[$linkLabel];
                    } else {
                        $lt = addLinkType($linkLabel, "Neutral");
                        $checkLinkTypes[$linkLabel] = $lt->linktypeid;
                        $linkLabelID = $checkLinkTypes[$linkLabel];
                    }
                }
                // ADD NEW CONNECTION
                $c = addConnection($fromNodeID, $fromRoleID, $linkLabelID, $toNodeID,$toRoleID);
				array_push($results, "Connection added from: '". $fromNode['label']."' to: ''". $toNode['label']."'");
            }
        }
    }
}

/*
 * importLKIFXML()
 * This function imports a set of argument graphs represented in the
 * Legal Knowledge Interchange Format (LKIF). Specifically, the
 * function expects the LKIF to be serialised in XML.
 */
function importLKIFXML($xml, &$errors, &$results) {

  // TODO Should check at the beginning whether the file is a valid
  // LKIF file

  global $DB, $CFG, $USER;

  // If the node-types 'Statement' and 'Argument' don't exist then we
  // need to create them
  $statementNodeTypeID = getRoleByName("Statement")->roleid;
  if ($statementNodeTypeID == null) {
    $statementNodeType = addRole("Statement");
    $statementNodeTypeID = $statementNodeType->roleid;
  }

  $argumentNodeTypeID = getRoleByName("Argument")->roleid;
  if ($argumentNodeTypeID == null) {
    $argumentNodeType = addRole("Argument");
    $argumentNodeTypeID = $argumentNodeType->roleid;
  }

  // If the link-types 'premise', 'conclusion', and 'exception' don't
  // exist then we need to create them
  $premiseLinkTypeID = getLinkTypeByLabel("premise")->linktypeid;
  if ($premiseLinkTypeID == null) {
    $premiseLinkType = addLinkType("premise", "Positive");
    $premiseLinkTypeID = $premiseLinkType->linktypeid;
  }

  $conclusionLinkTypeID = getLinkTypeByLabel("conclusion")->linktypeid;
  if ($conclusionLinkTypeID == null) {
    $conclusionLinkType = addLinkType("conclusion", "Positive");
    $conclusionLinkTypeID = $conclusionLinkType->linktypeid;
  }

  $exceptionLinkTypeID = getLinkTypeByLabel("exception")->linktypeid;
  if ($exceptionLinkTypeID == null) {
    $exceptionLinkType = addLinkType("exception", "Negative");
    $exceptionLinkTypeID = $exceptionLinkType->linktypeid;
  }

  $negated_premiseLinkTypeID =
    getLinkTypeByLabel("negated-premise")->linktypeid;
  if ($negated_premiseLinkTypeID == null) {
    $negated_premiseLinkType =
      addLinkType("negated-premise", "Negative");
    $negated_premiseLinkTypeID =
      $negated_premiseLinkType->linktypeid;
  }

  $negated_conclusionLinkTypeID =
    getLinkTypeByLabel("negated-conclusion")->linktypeid;
  if ($negated_conclusionLinkTypeID == null) {
    $negated_conclusionLinkType =
      addLinkType("negated-conclusion", "Negative");
    $negated_conclusionLinkTypeID =
      $negated_conclusionLinkType->linktypeid;
  }

  // Parse the Statements

  // Somewhere to store the LKIF ID to Cohere ID mappings for later
  // reference
  $lkifIDToCohereID = array();

  $statements = $xml->getElementsByTagName("statement");

  foreach ($statements as $statement) {
    $lkif_id = $statement->getAttribute('id');

    $sEl = $statement->getElementsByTagName("s")->item(0);
    $text = $sEl->nodeValue;

    $newCohereNode =
      addNode($text, /*Node name*/
	      $lkif_id, /*Node description*/
	      $USER->privatedata, /*Set Private or Public*/
	      $statementNodeTypeID);

    $lkifIDToCohereID[$lkif_id] = $newCohereNode->nodeid;

    array_push($results,
	       "Imported LKIF Statement $lkif_id: $text");
  }

  // Parse the Arguments
  $arguments = $xml->getElementsByTagName("argument");

  foreach ($arguments as $argument) {
    $lkif_id = $argument->getAttribute('id');
    $title = $argument->getAttribute('title');
    $scheme = $argument->getAttribute('scheme');
    $direction = $argument->getAttribute('direction');

    // We don't want Cohere nodes with empty names
    if ($title == "") {
			if (isset($_FILES['lkifxmlfile'])) {
				$filename = $_FILES['lkifxmlfile']['name'];
			}
			else if (isset($_POST['lkifxmlurl'])) {
				$filename = $_POST['lkifxmlurl'];
			}

      $filename = basename($filename,
			   ".xml");
      $title = $lkif_id . " (" . $filename . ")";
    }

    // Add new Argument node to Cohere DB
    $newCohereNode =
      addNode($title, /*Node name*/
	      $lkif_id, /*Node description*/
	      $USER->privatedata, /*Set Private or Public*/
	      $argumentNodeTypeID);

    // Deal with the Conclusion
    $conclusionNode =
      $argument->getElementsByTagName("conclusion")->item(0);

    $conclusion = $conclusionNode->getAttribute('statement');

    $fromNodeID = $newCohereNode->nodeid;
    $fromRoleID = $argumentNodeTypeID;
    $toNodeID = $lkifIDToCohereID[$conclusion];
    $toRoleID = $statementNodeTypeID;

    if ($direction == "con")
      $arg_conclusion_link = $negated_conclusionLinkTypeID;
    else
      // Else assume direction is "pro"
      $arg_conclusion_link = $conclusionLinkTypeID;

    // Connect Argument node to its Conclusion
    $newCohereConnection =
      addConnection($fromNodeID,
    		    $fromRoleID,
    		    $arg_conclusion_link,
    		    $toNodeID,
    		    $toRoleID);

    // Deal with the Premises ('ordinary', 'assumption' and
    // 'exception' premises.
    $premiseNodes =
      $argument->getElementsByTagName("premise");

    $premises = array();
    $exceptions = array();

    // Collect all the 'ordinary' and 'assumption' premises in a
    // single array and all the 'exception' premises in another array
    for ($i = 0; $i < $premiseNodes->length; $i++) {
      $statement = $premiseNodes->item($i)->getAttribute('statement');
      $type = $premiseNodes->item($i)->getAttribute('type');
      $polarity = $premiseNodes->item($i)->getAttribute('polarity');

      if ($type == "exception") {
	$exceptions[$i] = $statement;
      }
      else {
	$premises[$i] = array('statement'=>$statement,
			      'polarity'=>$polarity);
      }
    }

    // Connect the Argument node to each of the Premise (Statement)
    // nodes
    foreach ($premises as $premise) {
      $toNodeID = $lkifIDToCohereID[$premise['statement']];

      if ($premise['polarity'] == "negative")
	$arg_premise_link = $negated_premiseLinkTypeID;
      else
	// Else assume polarity is "positive"
	$arg_premise_link = $premiseLinkTypeID;

      $newCohereConnection =
	addConnection($fromNodeID,
		      $fromRoleID,
		      $arg_premise_link,
		      $toNodeID,
		      $toRoleID);
    }

    // Connect the Argument node to each of the exception premises
    foreach ($exceptions as $exception) {
      $toNodeID = $lkifIDToCohereID[$exception];

      $newCohereConnection =
	addConnection($fromNodeID,
		      $fromRoleID,
		      $exceptionLinkTypeID,
		      $toNodeID,
		      $toRoleID);
    }

    array_push($results,
	       "Imported LKIF Argument $lkif_id: (Premises) {" .
	       implode(', ',
		  array_merge(
		     array_map(
		       create_function('$arr',
				       'return $arr["statement"];'),
		       $premises),
		     $exceptions)) .
	       "} --> (Conclusion) $conclusion");
  }
}
?>