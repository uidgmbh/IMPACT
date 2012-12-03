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

include_once("../config.php");

function get_result2 ($nodeID, $nodeName, $nodeDescription, $authorID) {

	$model = getCohereModel();
	
	$newnode = new Resource(COHERE_NS . $nodeID);
	$newauthor = new Resource(COHERE_NS . $authorID);
	

	$statement2 = new Statement ($newauthor, RDF_RES::TYPE(), COHERE_RES::COHERE_USER());
	
	$model->addWithoutDuplicates($statement2);
		
	$statement1 = new Statement ($newnode, RDF_RES::TYPE(), COHERE_RES::NODE());

	$model->addWithoutDuplicates($statement1);
		
	$statement3 = new Statement ($newnode, COHERE_RES::HAS_CREATOR(), $newauthor);

	$model->addWithoutDuplicates($statement3);

	$ret = $model->writeAsHtml();
	return $ret;
}




function loadRapLibraries ($location) {

	// include all RAP classes
	define("RDFAPI_INCLUDE_DIR", $location);
	include_once( RDFAPI_INCLUDE_DIR . "RdfAPI.php");
	include_once( RDFAPI_INCLUDE_DIR . "resModel/ResModelP.php");
	include_once( RDFAPI_INCLUDE_DIR . "vocabulary/RDF_RES.php");
	include_once( RDFAPI_INCLUDE_DIR . "vocabulary/RDFS_RES.php");
	include_once( RDFAPI_INCLUDE_DIR . "vocabulary/OWL_RES.php");
	include_once( RDFAPI_INCLUDE_DIR . "vocabulary/COHERE_RES.php");
    
	//echo "finished loading ";
  }
  
  
function getCohereModel ($include_ontology = '') {

	define('COHERE_NS', $CFG->homeAddress.'ontology/cohere.owl#');
	$Model = ModelFactory::getDefaultModel(RDFS_VOCABULARY);  // <---------- BITCH
	if ($include_ontology) {
		$Model->load($include_ontology);
	}
	$Model->setBaseURI(COHERE_NS);
	return $Model;

}
	


//$nodeUrl is an array
function addNodeInformation ($model, $nodeID, $nodeName = '', $nodeDescription = '', $userID = '', $nodeUrls = '' ) {

	
	// first thing, crete the user and the websites
	
	if ($userID) {
		$newuser = addUserInformation ($model, $userID);
	}
	
	// store the creted websites in an array so to add them later
	if ($nodeUrls) {
		foreach($nodeUrls as $url){
			$newurl = addURLInformation ($model, $url->urlid, $url->url, $url->title, $url->description);
			$websites[] = $newurl;
			//$model->addWithoutDuplicates(new Statement ($newnode, COHERE_RES::HAS_WEBSITE(), $newurl ));
						}
	}
		
	// now create the damn node
	$nodeID = "node_" . $nodeID;	
	$newnode = new Resource(COHERE_NS . $nodeID);
	$statement1 = new Statement ($newnode, RDF_RES::TYPE(), COHERE_RES::NODE());
	$model->addWithoutDuplicates($statement1);

	
	// add name
	if ($nodeName) {
		$newname = new Literal($nodeName);
		$model->addWithoutDuplicates(new Statement ($newnode, COHERE_RES::HAS_NAME(), $newname));
	
	}
	
	//add desc
	if ($nodeDescription) {
		$newdesc = new Literal($nodeDescription);
		$model->addWithoutDuplicates(new Statement ($newnode, COHERE_RES::HAS_DESCRIPTION(), $newdesc));
		//$newnode->addProperty(COHERE_RES::HAS_DESCRIPTION(), $newdesc);
	}
	
	// add creator (if previously created)
	if ($userID) {
		$model->addWithoutDuplicates(new Statement ($newnode, COHERE_RES::HAS_CREATOR(),  $newuser));
		
	}
	
	
	// add websites (if previously created)
	if ($nodeUrls) {
		foreach($websites as $webs) {
			$model->addWithoutDuplicates(new Statement ($newnode, COHERE_RES::HAS_WEBSITE(), $webs ));
							}
					}
	

	
	return $newnode;

}



function addURLInformation ($model, $urlID, $url, $urlTitle = '', $urlDescription = '', $userID = '') {

	// first things first: add Users if existing
	if ($userID) {
		$newuser = addUserInformation ($model, $userID);
		}
	
	$urlID = "website_" . $urlID;
	$newurl = new Resource(COHERE_NS . $urlID);
	$model->addWithoutDuplicates (new Statement ($newurl, RDF_RES::TYPE(), COHERE_RES::WEBSITE()));
	
	$model->addWithoutDuplicates (new Statement ($newurl, COHERE_RES::HAS_URL(), new Literal ($url)));
	
	if ($urlTitle) {
		$model->addWithoutDuplicates (new Statement ($newurl, COHERE_RES::HAS_NAME(), new Literal ($urlTitle)));
	}
	
	if ($urlDescription) {
		$model->addWithoutDuplicates (new Statement ($newurl, COHERE_RES::HAS_DESCRIPTION(), new Literal ($urlDescription)));
	}
	
	//now add the user already created above
	if ($userID) {
		$model->addWithoutDuplicates (new Statement ($newurl, COHERE_RES::HAS_CREATOR(), $newuser));
	}
	
	return $newurl;

}



function addUserInformation ($model, $userID, $name = '') {
		$newUserID = "cohere_user_" . $userID;	
		$newcreator = new Resource(COHERE_NS . $newUserID);
		$model->addWithoutDuplicates(new Statement ($newcreator,RDF_RES::TYPE(), COHERE_RES::COHERE_USER()));
		//$newcreator->addProperty(RDF_RES::TYPE(), COHERE_RES::COHERE_USER());
		
		if ($name) {
		$newname = new Literal($name);	
		$model->addWithoutDuplicates(new Statement ($newcreator, COHERE_RES::HAS_NAME(), $newname));
		}
		
		return $newcreator;
}



function addConnectionInformation ($model, $connID, $connFrom, $connTo, $userID = '', $linktype = '', $fromrole = '', $torole = '') {

	//first add User, linkType and Roles
	if ($userID) {
		$newuser = addUserInformation ($model, $userID);
	}
	
	if ($linktype) {
		$newLabel = addLinkTypeInformation ($model, $linktype->linktypeid, $linktype->grouplabel, $linktype->groupid,  $linktype->label, $linktype->userid); 
	}
	
	if ($fromrole) {
		$newFromRole = addRoleInformation ($model, $fromrole->roleid, $fromrole->name, $fromrole->userid); 
	}
	
	if ($torole) {
		$newToRole = addRoleInformation ($model, $torole->roleid, $torole->name, $torole->userid); 
	}
	
	$connID = "connection_" . $connID;
	
	// add the connection
	$newConnection = new Resource(COHERE_NS . $connID);
	$statement1 = new Statement ($newConnection, RDF_RES::TYPE(), COHERE_RES::CONNECTION());
	$model->addWithoutDuplicates($statement1);
	
	// add the nodes
	$statement2 = new Statement ($newConnection, COHERE_RES::HAS_FROM_NODE(), $connFrom);
	$model->addWithoutDuplicates($statement2);
	$statement3 = new Statement ($newConnection, COHERE_RES::HAS_TO_NODE(), $connTo);
	$model->addWithoutDuplicates($statement3);
	
	// add the other stuff, if previously created!
	if ($userID) {
		$model->addWithoutDuplicates(new Statement ($newConnection, COHERE_RES::HAS_CREATOR(),  $newuser));
	}
		
	if ($linktype) {
		$model->addWithoutDuplicates(new Statement ($newConnection, COHERE_RES::HAS_LABEL(),$newLabel ));
	}
	
	if ($fromrole) {
		$model->addWithoutDuplicates(new Statement ($newConnection, COHERE_RES::HAS_FROM_NODE_ROLE(),$newFromRole ));
	}
	
	if ($torole) {
		$model->addWithoutDuplicates(new Statement ($newConnection, COHERE_RES::HAS_TO_NODE_ROLE(),$newToRole ));
	}
	
	
	
}



function addLinkTypeInformation ($model, $ID, $groupLabel, $groupLabelID = '',  $label = '', $userID = '') {
	
        // first create Users and  label-roles
        if ($userID) {
        	$newuser = addUserInformation ($model, $userID);	
        }
        
        if ($groupLabelID) {
        	$newLinkRole = addConnectionLabelRoleInformation($model, $groupLabelID, $groupLabel );
        }
	
		// finally create the connection label
		$linkID = "connection_label_" . $ID;
		$newLinkType = new Resource(COHERE_NS . $linkID);
		
		$statement1 = new Statement ($newLinkType, RDF_RES::TYPE(), COHERE_RES::CONNECTION_LABEL());
	    $model->addWithoutDuplicates($statement1);
	    
	    if ($label) {
	    	$newLabelname = new Literal($label);	
		    $model->addWithoutDuplicates(new Statement ($newLinkType, COHERE_RES::HAS_NAME(), $newLabelname));
	    }
	    
	    if ($userID) {
			$model->addWithoutDuplicates(new Statement ($newLinkType, COHERE_RES::HAS_CREATOR(),  $newuser));
	    }
	    
	    if ($groupLabelID) {
	    	$model->addWithoutDuplicates(new Statement ($newLinkType, COHERE_RES::HAS_LABEL_ROLE(), $newLinkRole));
	    }
	    
		
		return $newLinkType;
	
}


function addConnectionLabelRoleInformation ($model, $groupLabelID, $groupLabel) {
	
		$linkRoleID = "connection_label_role_" . $groupLabelID;
		$newLinkRole = new Resource(COHERE_NS . $linkRoleID);
			
        $statement1 = new Statement ($newLinkRole, RDF_RES::TYPE(), COHERE_RES::CONNECTION_LABEL_ROLE());
	    $model->addWithoutDuplicates($statement1);
	    
	    $newLabelRolename = new Literal($groupLabel);	
		$model->addWithoutDuplicates(new Statement ($newLinkRole, COHERE_RES::HAS_NAME(), $newLabelRolename));	
		
		return $newLinkRole;
}



function addRoleInformation ($model, $ID, $name = '', $userID = '') {
	
		// first the user
 		if ($userID) {
			$newuser = addUserInformation ($model, $userID);
	    }
	    
	    // now the role itself
		$roleID = "role_" . $ID;
		$newRole = new Resource(COHERE_NS . $roleID);
		
		$statement1 = new Statement ($newRole, RDF_RES::TYPE(), COHERE_RES::CONNECTION_NODE_ROLE());
	    $model->addWithoutDuplicates($statement1);
	    
	    if ($name) {
	    	$newRolename = new Literal($name);	
		    $model->addWithoutDuplicates(new Statement ($newRole, COHERE_RES::HAS_NAME(), $newRolename));
	    }
	    
	    if ($userID) {
			$model->addWithoutDuplicates(new Statement ($newRole, COHERE_RES::HAS_CREATOR(),  $newuser));
	    }
		
		return $newRole;
	
}


function displayRDF ($model){
	$output = $model->writeRdfToString();
	return $output;
}


function closeCohereModel ($model){
	$model->close();
}




// for testing

/*define("ONTO_LOCATION", "rdf/cohere.owl");
loadRapLibraries(RDFAPI_INCLUDE_DIR);

$mod1 = getCohereModel();  //"rdf/cohere.owl"
echo $mod1->getBaseURI();
echo $mod1->size();

addNodeInformation ($mod1, "node1", "the node of love");
echo displayRDF($mod1);
*/



?>