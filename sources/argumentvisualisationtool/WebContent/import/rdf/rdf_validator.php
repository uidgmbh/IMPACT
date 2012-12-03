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
//////// ERROR HANDLING
include_once("../../config.php");

global $rdfImport_error;

$old_error_handler = set_error_handler("myErrorHandler");

// I've set this fuction to override the normal error reporting system, so that 
// we can catch and display the RDF API errors 
// for now i've just handled three types of error..
function myErrorHandler($errno, $errstr, $errfile, $errline)
{
	global $rdfImport_error;
	
    switch ($errno) {
    case E_USER_ERROR:
        $rdfImport_error .= "<b>ERROR</b> [$errno] $errstr<br />\n";
        $rdfImport_error .=  "  Fatal error on line $errline in file $errfile";
        $rdfImport_error .=  ", PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";
        $rdfImport_error .=  "Aborting...<br />\n";
        //exit(1);
        break;

    case E_USER_WARNING:
        $rdfImport_error .=  "<b>WARNING</b> [$errno] $errstr<br />\n";
        break;

    case E_USER_NOTICE:
        $rdfImport_error .=  "<b>NOTICE</b> [$errno] $errstr<br />\n";
        break;

    }

     //Don't execute PHP internal error handler 
    return true;
}






function checkNewModel ($include) {

	global $rdfImport_error;	
	$rdfImport_error = '';
/*	include ('../import/export.php');
	loadRapLibraries("../import/rdfapi-php/api/");*/
	
	$Model = ModelFactory::getDefaultModel(RDFS_VOCABULARY);

	$Model->load($include);

	return $Model;

}





/*
 *
 *  HERE I started building a proper validator for the cohere Rdf
 *  e.g. check if for every website, there's also a node
 * if for all the connections, the nodes are existing
 * and so on... but it's not finished yet!!!!



function test1 ($file) {
	
	global $rdfImport_log;
	include ('../import/export.php');
	loadRapLibraries("../import/rdfapi-php/api/");
	$model = loadNewModel($file);
	
	//echo $rdfImport_error;
		//echo "aaaaa";
	//echo $model->writeAsHtmlTable();
	
	//the queries
	$query_for_websites = 'SELECT ?website, ?url 
				WHERE (?website, <rdf:type>, <cohere:website> )
					  (?website, <cohere:has_url>, ?url)
				USING cohere FOR <'.$CFG->homeAddress.'cohere.owl#>';

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
			$websitesIndex = addRDFWebsites($model, $websites);
		}
		

	$nodes = is_there_entity ($model, $query_for_nodes);
	if ($nodes) {
		$nodesIndex = addRDFNodes($model, $nodes);
	}

	$rdfImport_log .= "<br><br>";
	

	$roles = is_there_entity ($model, $query_for_roles);
	if ($roles) {
       $rolesIndex = addRDFRoles($model, $roles);
	}
	
	$rdfImport_log .= "<br><br>";
	
	$labels = is_there_entity ($model, $query_for_labels);
	if ($labels) {
       $labelsIndex = addRDFLabels($model, $labels);
	}
	
	
	$rdfImport_log .= "<br><br>";
	
	$connections = is_there_entity ($model, $query_for_connections);
	
		$rdfImport_log .= "<br><br><a href=\"http://w3.org/RDF/Validator\" title=\"Valid RDF\">
            <img src=\"images/badge-valid-rdf.gif\" alt=\"Valid RDF\"/></a> ";	
	
	echo $rdfImport_log;
	

}







function is_there_entity ($model, $query) {
	$res = $model->rdqlQuery($query);
	return $res;
}


function addRDFWebsites ($model, $websites) {
	global $rdfImport_log;
	global $totalWebsites;
	
	foreach ($websites as $site) {
		 //echo $site['?url']->getLabel() . "<br>";  
		 //echo $site['?website'] . "<br>";
			 
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
			 
		 $rdfImport_log .=  "Reading====>url: $url<br>";

		}
		 
		 //return $exitarray;
	
}






function addRDFNodes ($model, $nodes) {
	global $rdfImport_log;
	global $totalIdeas;
	
	foreach ($nodes as $node) {
	
		 $name = $node['?name']->getLabel();
		 $desc = " ";
			 
		 $res1 = $model->findFirstMatchingStatement($node['?node'], COHERE_RES::HAS_DESCRIPTION(), NULL);
			 
		 if ($res1) {
		    $desc = $res1->getLabelObject();
		 }

			 
		 $rdfImport_log .=  "Reading====>idea: $name<br>";
			 
		}
		 
		 return "";
	
		 
		 
}




function addRDFRoles ($model, $roles) {
	global $rdfImport_log;
	global $totalRoles;
	foreach ($roles as $role) {
	
		
		 $name = $role['?name']->getLabel();
 
		 $rdfImport_log .=  "Reading====>role: $name<br>";
			 

		}
		 
		 return "";	 		 
}



// http://localhost:8888/cohere-web/api/service.php?method=addlinktype&label=my-linktype&linktypegroup=positive
function addRDFLabels ($model, $labels) {
	global $rdfImport_log;
	global $totalLabels;
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

		 $rdfImport_log .= "Reading====>label:----$name------------------type:--$linkType<br>";
		 
		}
		 
		 return "";	 
		 
}



function getLabelIDfromName ($name) {
	$id = '';
	$lowername = strtolower($name);

	if (!($lowername=="positive" || $lowername=="negative" || $lowername=="neutral" ))
		$lowername = "neutral";
	
	$mappings = array ("positive" => "1371082519211" , "neutral" => "13710825192142" , "negative" => "1371082519212");
	$id = $mappings[$lowername];
	// the API at the moment gets the linktypegroup NAME, not the ID as I thought, so I kept this function even if it's not doing any mapping (just lowercasing the $name)
	//return $id;	
	return $lowername;
}


*/






?>