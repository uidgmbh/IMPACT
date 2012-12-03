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

/* FUNCTIONS TO ADD TO THE AUDIT TABLES */  

/**
 * Add a new audit entry into the node/idea audit table.
 * 
 * @param string $userid The unique userid for the person making the entry
 * @param string $nodeid The unique id for the node/idea begin audited
 * @param string $name The name of the node/idea. It's label
 * @param string $desc The description of the node/idea
 * @param string $changeType The type of the change to the record (delete, edit, add)
 * @return boolean

 */
function auditIdea($userid, $nodeid, $name, $desc, $changeType,$xml) {
    global $DB;
    $wentOK = true;
    $modificationDate = time();
    $qry = "insert into AuditNode (UserID, NodeID, Name, Description, ModificationDate, ChangeType, NodeXML) 
            values 
            ('".$userid."', '".$nodeid."', '".mysql_escape_string($name)."', '".mysql_escape_string($desc)."', ".$modificationDate.", '".$changeType."', '".mysql_escape_string($xml)."')";
    $res = mysql_query( $qry, $DB->conn);
    if (!$res) {            
        $wentOK = false;
    }       
    return $wentOK;     
}
    

/**
 * Add a new audit entry into the url audit table.
 * 
 * @param string $userid The unique userid for the person making the entry
 * @param string $urlid The unique id for the url begin audited
 * @param string $nodeid The unique id for the node involved in this association (if this is an asssociation entry)
 * @param string $url The url itself
 * @param string $title The title for the url page
 * @param string $desc The description for the url page
 * @param string $clip The selected text, if any, on the url page 
 * @param string $clippath - only used by Firefox plugin
 * @param string $cliphtml - only used by Firefox plugin
 * @param string $comments The comments for the website association with a node (if this is an asssociation entry)
 * @param string $changeType The type of the change to the record (delete, edit, add)
 * @return booelan
 */
function auditURL($userid, $urlid, $nodeid, $url, $title, $desc, $clip, $clippath, $cliphtml, $comments, $changeType, $xml) {
    global $DB;
    $wentOK = true;
    $modificationDate = time();
    $qry = "insert into AuditURL (UserID, URLID, URL, Title, Description, Clip, ClipPath, ClipHTML, ModificationDate, ChangeType, URLXML)
            values 
            ('".$userid."', '".$urlid."', '".mysql_escape_string($url)."', '".mysql_escape_string($title)."', '".mysql_escape_string($desc)."', '".mysql_escape_string($clip)."', '".mysql_escape_string($clippath)."', '".mysql_escape_string($cliphtml)."', ".$modificationDate.", '".$changeType."', '".mysql_escape_string($xml)."')";
    $res = mysql_query( $qry, $DB->conn);
    if (!$res) {            
        $wentOK = false;
    }       
    return $wentOK;     
}

/**
 * Add a new audit entry into the connection audit table.
 * 
 * @param string $userid The unique userid for the person making the entry
 * @param string $connnectionid The unique id for the connection begin audited
 * @param string $label The label for this connection if LinkType label overridden
 * @param string $fromIdeaID The id of the idea the connection connects from
 * @param string $toIdeaID The id of the idea the connection connects to
 * @param string $linkTypeID The id of the LinkType of this connection
 * @param string $fromRoleID The id of the Role for the idea the connection connects from
 * @param string $toRoleID The id of the Role for the idea the connection connects to   
 * @param string $changeType The type of the change to the record (delete, edit, add)
 * @return booelan
 */
function auditConnection($userid, $connnectionid, $label, $fromIdeaID, $toIdeaID, $linkTypeID, $fromRoleID, $toRoleID, $changeType, $xml) {
    global $DB;
    $wentOK = true;
    $modificationDate = time();
    $qry = "insert into AuditTriple (TripleID, UserID, LinkTypeID, FromID, ToID, Label, FromContextTypeID, ToContextTypeID, ModificationDate, ChangeType, TripleXML) 
            values 
            ('".$connnectionid."', '".$userid."', '".$linkTypeID."', '".$fromIdeaID."', '".$toIdeaID."', '".mysql_escape_string($label)."', '".$fromRoleID."', '".$toRoleID."', ".$modificationDate.", '".$changeType."', '".mysql_escape_string($xml)."')";
    $res = mysql_query( $qry, $DB->conn);
    if (!$res) {            
        $wentOK = false;
    }   
    return $wentOK;     
}
?>