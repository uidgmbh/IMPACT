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
include_once("../../config.php");

function checkForValidRDF ($file) {
	global $rdfImport_error;
	include ('rdf_validator.php');
	$model = checkNewModel($file);
	return $rdfImport_error;
}

function getNewRDFModel ($include_ontology = '') {

	$Model = ModelFactory::getDefaultModel(RDFS_VOCABULARY);  // <---------- BITCH
	if ($include_ontology) {
		$Model->load($include_ontology);
	}
	return $Model;
}
	
function import_rdf ($file,&$errors,&$results) {
	
	$model = getNewRDFModel($file);
	
	//the queries
	$query_for_websites = 'SELECT ?website, ?url 
				WHERE (?website, <rdf:type>, <cohere:website> )
					  (?website, <cohere:has_url>, ?url)
				USING cohere FOR <'.$CFG->homeAddress.'ontology/cohere.owl#>';

	$query_for_nodes = 'SELECT ?node, ?name
				WHERE (?node, <rdf:type>, <cohere:node> )
					  (?node, <cohere:has_name>, ?name)
				USING cohere FOR <'.$CFG->homeAddress.'ontology/cohere.owl#>';

	$query_for_roles = 'SELECT ?role ?name
				WHERE (?role, <rdf:type>, <cohere:connection_node_role> )
					  (?role, <cohere:has_name>, ?name)
				USING cohere FOR <'.$CFG->homeAddress.'ontology/cohere.owl#>';
	
	$query_for_labels = 'SELECT ?label ?name 
				WHERE (?label, <rdf:type>, <cohere:connection_label> )
					  (?label, <cohere:has_name>, ?name)
				USING cohere FOR <'.$CFG->homeAddress.'ontology/cohere.owl#>';

	$query_for_connections = 'SELECT ?connection  ?fromnode ?tonode ?label
				WHERE (?connection, <rdf:type>, <cohere:connection> )
				      (?connection, <cohere:has_from_node>, ?fromnode )
				      (?connection, <cohere:has_to_node>, ?tonode )
				      (?connection, <cohere:has_label>, ?label )
				USING cohere FOR <'.$CFG->homeAddress.'ontology/cohere.owl#>';
	
	$websitesIndex = '';
	$nodesIndex = '';
	$rolesIndex = '';
	$labelsIndex = '';
	$connectionsIndex = '';
	$websites = is_there_entity ($model, $query_for_websites);	
	if ($websites) {
		$websitesIndex = addRDFWebsites($model, $websites,$errors,$results);
	}
	
	$nodes = is_there_entity ($model, $query_for_nodes);
    
	if ($nodes) {
		$nodesIndex = addRDFNodes($model, $nodes,$errors,$results);
	}

	addRDFwebsitesToNodes ($model, $websitesIndex, $nodesIndex );

	$roles = is_there_entity ($model, $query_for_roles);
	if ($roles) {
       $rolesIndex = addRDFRoles($model, $roles,$errors,$results);
	}

	$labels = is_there_entity ($model, $query_for_labels);
	if ($labels) {
       $labelsIndex = addRDFLabels($model, $labels,$errors,$results);
	}

	$connections = is_there_entity ($model, $query_for_connections);
	if ($connections) {
		$connectionsIndex = addRDFConnections($model, $connections, $labelsIndex, $rolesIndex, $nodesIndex,$errors,$results);
	}
	
}
	
function is_there_entity ($model, $query) {
	$res = $model->rdqlQuery($query);
	return $res;
}


function addRDFWebsites ($model, $websites,&$errors,&$results) {
	
	foreach ($websites as $site) {
	    if($site['?url']){
    		 $name = "";
    		 $desc = "";
    		 $url = $site['?url']->getLabel();
    			 
    		 $res1 = $model->findFirstMatchingStatement($site['?website'], COHERE_RES::HAS_NAME(), NULL);
    		 $res2 = $model->findFirstMatchingStatement($site['?website'], COHERE_RES::HAS_DESCRIPTION(), NULL);
    			 
    		 if ($res1) {
    		    $name = $res1->getLabelObject();
    		 }
    			 
    		 if ($res2) {
    		 	$desc = $res2->getLabelObject();
    		 }
    
    		 $a = addURL ($url, $name, $desc);
    		 if ($a->urlid) {
    		 	array_push($results,"URL: ".$url. " added");
    		 }
    		 
    		 // and also store the ID mappings
    		 $RDFwebsite_name = $site['?website']->getLabel();
    		 $exitarray[$RDFwebsite_name] = $a->urlid ;
        }
	}	 
	return $exitarray;
}



function addRDFwebsitesToNodes ($model, $websitesIndex, $nodesIndex,&$errors,&$results ) {
	foreach ($nodesIndex as $RDFnode => $node) {
		
		 $website = '';
		 $it1 = $model->findAsIterator(new Resource ($RDFnode), COHERE_RES::HAS_WEBSITE(), NULL);
		 
		 while ($it1->hasNext()) {
		 	
		 	$statement = $it1->next();
		 	$RDFwebsite =  $statement->getLabelObject();
		 	
		 	$website = $websitesIndex[$RDFwebsite];
		 	if ($website) {
		 		$r = addURLToNode($website,$node);
		 		if ($r->nodeid){
                    array_push($results,"URL (".$website. ")added to node: ".$node);
                }
		 	}
         }	
	}
}



function addRDFNodes ($model, $nodes,&$errors,&$results) {

	
	foreach ($nodes as $node) {
	
		 $name = $node['?name']->getLabel();
		 $desc = " ";
			 
		 $res1 = $model->findFirstMatchingStatement($node['?node'], COHERE_RES::HAS_DESCRIPTION(), NULL);
			 
		 if ($res1) {
		    $desc = $res1->getLabelObject();
		 }			 
		// important stuff to ADD 
		 $b = addNode ($name, $desc);
		 if ($b->nodeid) {
			 array_push($results,"Node: ".$name. " added");
		 }
		 $nodeID = $node['?node']->getLabel();
		 $exitarray[$nodeID] = $b->nodeid;
		}	 
		 return $exitarray; 
}




function addRDFRoles ($model, $roles,&$errors,&$results) {

	foreach ($roles as $role) {
        $name = $role['?name']->getLabel();
        $rdfImport_log .=  "Reading====>role: $name<br>";
 
	   $r = addRole($name); 
	   if ($r->name) {
            array_push($results,"Role: ".$name. " added");
	   }
       $RDFrole = $role['?role']->getLabel();
	   $exitarray[$RDFrole] = $r->roleid;  

    }
	return $exitarray;	 		 
}



// http://localhost:8888/cohere-web/api/service.php?method=addlinktype&label=my-linktype&linktypegroup=positive
function addRDFLabels ($model, $labels,&$errors,&$results) {

	foreach ($labels as $label) {
	
		 $name = $label['?name']->getLabel();
		 $linkType = "neutral";  //default
 
	     $res1 = $model->findFirstMatchingStatement($label['?label'], COHERE_RES::HAS_LABEL_ROLE(), NULL);
		 // if there is a label_role value, get the name of the connection_label_role	 
		 if ($res1) {
		    $roleobject = $res1->getObject();
		    $res2 = $model->findFirstMatchingStatement($roleobject, COHERE_RES::HAS_NAME(), NULL);
		    $linkType = $res2->getLabelObject();
		 }
		 
		 // map *positive* *negative* *neutral* to their IDs in the DB (when necessary)
		 $linkTypeID = getLabelIDfromName($linkType);

		 $r = addLinkType($name,$linkTypeID);
		 if ($r->linktypeid) {
                array_push($results,"Link Type: ".$name. " added");
		 	
		 }
		 
		 // and also store the ID mappings
		 $RDFlabel = $label['?label']->getLabel();
		 $exitarray[$RDFlabel] = $r->linktypeid;
		 
		}
		 
		 return $exitarray;	 
		 
}



function getLabelIDfromName ($name) {
	$id = '';
	$lowername = strtolower($name);

	if (!($lowername=="positive" || $lowername=="negative" || $lowername=="neutral" )){
		$lowername = "neutral";
    }
	
	$mappings = array ("positive" => "1371082519211" , "neutral" => "13710825192142" , "negative" => "1371082519212");
	$id = $mappings[$lowername];
	// the API at the moment gets the linktypegroup NAME, not the ID as I thought, so I kept this function even if it's not doing any mapping (just lowercasing the $name)
	//return $id;	
	return $lowername;
}



function addRDFConnections ($model, $connections, $labelsIndex, $rolesIndex, $nodesIndex,&$errors,&$results) {
	
	foreach ($connections as $connection) {
	
		 $RDFtonode = $connection['?tonode']->getLabel();
		 $RDFfromnode = $connection['?fromnode']->getLabel();
		 $RDFlabel = $connection['?label']->getLabel();
		 $RDFfromnoderole = "";
		 $RDFtonoderole = "";
		 
	     $res1 = $model->findFirstMatchingStatement($connection['?connection'], COHERE_RES::HAS_FROM_NODE_ROLE(), NULL);
		 $res2 = $model->findFirstMatchingStatement($connection['?connection'], COHERE_RES::HAS_TO_NODE_ROLE(), NULL);
			 
		 if ($res1) {
		    $RDFfromnoderole = $res1->getLabelObject();
		 }
			 
		 if ($res2) {
		 	$RDFtonoderole = $res2->getLabelObject();
		 }
 
		 $tonode = $nodesIndex [$RDFtonode];
		 $fromnode = $nodesIndex [$RDFfromnode];
		 $label = $labelsIndex[$RDFlabel];
		 $fromrole = $rolesIndex[$RDFfromnoderole];
		 $torole = $rolesIndex[$RDFtonoderole];
		 
         $c = addConnection($fromnode,$fromrole,$label,$tonode,$torole);
		 if ($c->connid )  {
		 	array_push($results,"Connection from ".$fromnode. " to ".$tonode." added");
		 }
		 
		 	
		 // not needed	
		 $exitarray[] = $c;
		}
		 
		 return $exitarray;	 
		 
}









?>