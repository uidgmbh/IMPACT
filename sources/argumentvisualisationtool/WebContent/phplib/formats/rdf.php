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

class format_rdf extends format_base {
    
    //default to plain text
    function get_header(){
        return "Content-Type: text/xml";   
    }
    
    /**
     * Format the object in rdf
     * 
     * @param Object $object - the data to format
     * @return string
     */
    function format($object){
        global $CFG;
        include_once($CFG->dirAddress.'import/export.php');
            
        $api_class = get_class($object);
        loadRapLibraries($CFG->dirAddress."import/rdfapi-php/api/");
        $model = getCohereModel();
        $base = $model->getBaseURI();  //maybe not needed
    
        switch ($api_class) {
     
          case "NodeSet":                 
                $nodes = $object->nodes;
                foreach($nodes as $node){ 
                    addNodeInformation ($model,  $node->nodeid, $node->name, $node->description, $node->userid, $node->urls); 
                }
                break;     
            case "ConnectionSet":
                $connections = $object->connections;
                foreach ($connections as $conn) {
                    $fromNodeObj = $conn->from;
                    $toNodeObj = $conn->to;
                    $fromNode = addNodeInformation ($model,  $fromNodeObj->nodeid, $fromNodeObj->name, $fromNodeObj->description, $fromNodeObj->userid, $fromNodeObj->urls);
                    $toNode = addNodeInformation ($model,  $toNodeObj->nodeid, $toNodeObj->name, $toNodeObj->description, $toNodeObj->userid, $toNodeObj->urls);
                    
                    addConnectionInformation ($model, $conn->connid, $fromNode, $toNode, $conn->userid, $conn->linktype, $conn->fromrole, $conn->torole);
                }
        
                break;  
                
            case "Connection":
                
                    $fromNodeObj = $object->from;
                    $toNodeObj = $object->to;
                    
            
                    $fromNode = addNodeInformation ($model,  $fromNodeObj->nodeid, $fromNodeObj->name, $fromNodeObj->description, $fromNodeObj->userid, $fromNodeObj->urls);
                    $toNode = addNodeInformation ($model,  $toNodeObj->nodeid, $toNodeObj->name, $toNodeObj->description, $toNodeObj->userid, $toNodeObj->urls);
                    
                    addConnectionInformation ($model, $object->connid, $fromNode, $toNode, $object->userid, $object->linktype, $object->fromrole, $object->torole);
                
                break;   
                
            case "LinkType":
                addLinkTypeInformation ($model, $object->linktypeid, $object->grouplabel, $object->groupid,  $object->label, $object->userid);    
                break; 
                
            case "LinkTypeSet":
                $linktypes = $object->linktypes;
                
                foreach ($linktypes as $linktype) {
                    addLinkTypeInformation ($model, $linktype->linktypeid, $linktype->grouplabel, $linktype->groupid,  $linktype->label, $linktype->userid);    
               
                }
                break;  
                
            case "CNode":
                addNodeInformation ($model,  $object->nodeid, $object->name, $object->description, $object->userid, $object->urls);
                break;  
                
            case "Role":
                addRoleInformation ($model, $object->roleid, $object->name, $object->userid);
                break;  
                
            case "RoleSet":
                $roles = $object->roles;
                
                foreach ($roles as $role) {
                    addRoleInformation ($model, $role->roleid, $role->name, $role->userid);      
                }
                break;
                
            case "URL":
                addURLInformation ($model, $object->urlid, $object->url, $object->title, $object->description, $object->userid);
                break;  
                
            case "URLSet":
                $nodeUrls = $object->urls;
                foreach ($nodeUrls as $url){
                    addURLInformation ($model, $url->urlid, $url->url, $url->title, $url->description, $url->userid);
                }
                break;   
                 
            case "User":
                addUserInformation ($model, $object->userid, $object->name);
                break;  
                
            case "UserSet":
                $users = $object->users;
                foreach ($users as $user){
                    addUserInformation ($model, $user->userid, $user->name);            
                }
                break;  
            case "error":
                $doc = "<?xml version=\"1.0\"?>";
                $doc .= "<error><message>".$object->message."</message><code>".$object->code."</code></error>";
                return $doc;
                break;   
            default:
                //error as method not defined.
                global $ERROR;
                $ERROR = new error;
                $ERROR->message = "Error in formatting.";
                $ERROR->code = "9999";
                include($CFG->dirAddress."api/apierror.php");
                die; 
        }
           
        $doc = displayRDF($model);
        closeCohereModel($model);
        return $doc;
    }
    

   
}
?>