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

///////////////////////////////////////
// URL Class
///////////////////////////////////////

class URL {

    public $urlid;
    public $url;
    public $creationdate;
    public $title;
    public $description;
    public $modificationdate;
    public $userid;
    public $user;
    public $clip;
    public $ideacount;
    public $status = 0;
    public $clippath = "";
    public $cliphtml = "";
    public $private;

    public $tags;
    public $groups;

    //public $ideas;

    /**
     * Constructor
     *
     * @param string $urlid (optional)
     * @return URL (this)
     */
    function URL($urlid = ""){
        if ($urlid != ""){
            $this->urlid = $urlid;
            return $this;
        }
    }

    /**
     * Loads the data for the node from the database
     *
     * @return URL object (this)
     */
    function load($style='long') {
        global $DB;
        $this->canview();
        $sql = "SELECT u.*, COUNT(ut.URLID) AS ideacount FROM URL u " .
        		"LEFT OUTER JOIN (SELECT URLID FROM URLNode) ut ON u.URLID = ut.URLID " .
        		"WHERE u.URLID='".$this->urlid."' GROUP BY u.URLID";
        $res = mysql_query($sql, $DB->conn);

        if(mysql_num_rows($res)==0){
             return database_error("URL not found","7002");
        }
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $this->url = stripslashes($array['URL']);
            $this->description = stripslashes($array['Description']);
            $this->userid = $array['UserID'];
            $this->title = stripslashes($array['Title']);
            $this->creationdate = $array['CreationDate'];
            $this->modificationdate = $array['ModificationDate'];
            $this->clip = $array['Clip'];
            $this->private = $array['Private'];
            if ($array['ClipPath']) {
            	$this->clippath = $array['ClipPath'];
            }
            if ($array['ClipHTML']) {
            	$this->cliphtml = $array['ClipHTML'];
            }
            $this->user = new user($this->userid);
            $this->ideacount = $array['ideacount'];
            if ($array['CurrentStatus']) {
            	$this->status = $array['CurrentStatus'];
            }
       }

       if($style=='long') {
	        //now add in any tags
	        $sql = "SELECT u.TagID FROM TagURL ut INNER JOIN Tag u ON u.TagID = ut.TagID WHERE ut.URLID='".$this->urlid."' ORDER BY Name ASC";
	        $res = mysql_query($sql, $DB->conn);
	        if(mysql_num_rows($res) > 0){
	            $this->tags = array();
	            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
	                $tag = new Tag(trim($array['TagID']));
	                array_push($this->tags,$tag->load());
	            }
	        }

	        // add in the groups
	        $sql = "SELECT GroupID FROM URLGroup tg WHERE tg.URLID='".$this->urlid."'";
	        $res = mysql_query($sql, $DB->conn);
	        if(mysql_num_rows($res) > 0){
	            $this->groups = array();
	            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
	                $group = new Group(trim($array['GroupID']));
	                array_push($this->groups,$group->load());
	            }
	        }
		}

        //now add in any ideas
        //Can't do this or it will cause a never ending loop as CNode also loads related URLs
        /*$sql = "SELECT u.NodeID, u.Name FROM URLNode ut INNER JOIN Node u ON u.NodeID = ut.NodeID WHERE ut.URLID='".$this->urlid."' ORDER BY u.Name ASC";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res) > 0){
            $this->ideas = array();
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $idea = new CNode(trim($array['NodeID']));
                $idea->load($style);
                array_push($this->ideas, $idea);
            }
        }*/

        return $this;
    }

    /**
     * Add new URL to the database
     *
     * @param string $url
     * @param string $title
     * @param string $desc
     * @param string $private optional, can be Y or N, defaults to users preferred setting
     * @param string $clip (optional)
     * @param string $clippath (optional) - only used by Firefox plugin
     * @param string $cliphtml (optional) - only used by Firefox plugin
     * @return URL object (this) (or Error object)
     */
    function add($url, $title, $desc, $private='Y', $clip="", $clippath="", $cliphtml = ""){
        global $DB,$CFG,$USER;
        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt = time();

        $qry1 = "";
        if ($clippath != "") {
        	$qry1 = "SELECT * FROM URL WHERE UserID='".$USER->userid."' and URL='".mysql_escape_string($url)."' and ClipPath='".mysql_escape_string($clippath)."'";
        } else {
        	$qry1 = "SELECT * FROM URL WHERE UserID='".$USER->userid."' and URL='".mysql_escape_string($url)."' and Clip='".mysql_escape_string($clip)."'";
        }

        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            $num_rows = mysql_num_rows($res1);
            if( $num_rows > 0) {
                while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                    $this->urlid = $array1['URLID'];
                }
            } else {
                $this->urlid = getUniqueID();
                $qry3 = "INSERT INTO URL (URLID, UserID, CreationDate, ModificationDate, URL, Title, Description, Clip, ClipPath, ClipHTML, Private) values ('".$this->urlid."', '".$USER->userid."', ".$dt.", ".$dt.", '".mysql_escape_string($url)."', '".mysql_escape_string($title)."', '".mysql_escape_string($desc)."', '".mysql_escape_string($clip)."', '".mysql_escape_string($clippath)."', '".mysql_escape_string($cliphtml)."','".$private."')";
                $res3 = mysql_query( $qry3, $DB->conn);
                if( !$res3 ) {
                    return database_error();
                }
            }
        } else {
        	return database_error();
        }

        $this->load();
        if (!auditURL($USER->userid, $this->urlid, "", $url, $title, $desc, $clip, $clippath, $cliphtml, "", $CFG->actionAdd,format_object('xml',$this))) {
            return database_error();
        }
        return $this;
    }

    /**
     * Edit a URL
     *
     * @param string $url
     * @param string $title
     * @param string $desc
     * @param string $private optional, can be Y or N, defaults to users preferred setting
     * @param string $clip (optional)
     * @param string $clippath (optional) - only used by Firefox plugin
     * @param string $cliphtml (optional) - only used by Firefox plugin
     * @return URL object (this) (or Error object)
     */
    function edit($url, $title, $desc, $private='Y', $clip="", $clippath="", $cliphtml = ""){
        global $DB,$CFG,$USER;
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt = time();

        //added check to make sure the edit does not duplicate an existing item
        $qry1 = "";
        if ($clippath != "") {
        	$qry1 = "SELECT * FROM URL WHERE UserID='".$USER->userid."' and URL='".mysql_escape_string($url)."' and ClipPath='".mysql_escape_string($clippath)."'";
        } else {
        	$qry1 = "SELECT * FROM URL WHERE UserID='".$USER->userid."' and URL='".mysql_escape_string($url)."' and Clip='".mysql_escape_string($clip)."'";
        }
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
        	$runUpdate = false;
        	$num_rows = mysql_num_rows($res1);
            if( $num_rows > 0) {
                while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                	if ($this->urlid != $array1['URLID']) {
		                return database_error("You have another URL with the same url / clip combination already!");
                	} else {
                		$runUpdate = true;
                	}
                	break;
                }
            }
            if ($runUpdate) {
		         $qry = "UPDATE URL SET
		                ModificationDate=".$dt.",
		                URL='".mysql_escape_string($url)."',
		                Description='".mysql_escape_string($desc)."',
		                Title='".mysql_escape_string($title)."',
		                Private='".$private."',
		                ClipPath='".mysql_escape_string($clippath)."',
		                ClipHTML='".mysql_escape_string($cliphtml)."'
		                WHERE URLID='".$this->urlid."'";

		          $res = mysql_query( $qry, $DB->conn );
		         if( !$res ) {
		            return database_error(mysql_error());
		         } else {
		            if (!auditURL($USER->userid, $this->urlid, "", $url, $title, $desc, $clip, $clippath, $cliphtml, "", $CFG->actionEdit, format_object('xml',$this))) {
		                return database_error("URL Audit entry failed");
		            }
		         }
            }
         } else {
        	 return database_error();
         }

         $this->load();
         return $this;
    }

    /**
     * Delete a URL
     */
    function delete(){
        global $DB,$CFG,$USER;
        try {
            $this->candelete();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt = time();

		$this->load();
		$xml = format_object('xml',$this);

        //remove any node associations.
        $qry = "select NodeID from URLNode where URLID='".$this->urlid."'";
        $res = mysql_query( $qry, $DB->conn );
        if( !$res ) {
            return database_error();
        } else {
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $this->nodeid = $array['NodeID'];
	            $qry1 = "DELETE FROM URLNode WHERE NodeID='".$this->nodeid."' and URLID='".$this->urlid."' and UserID='".$USER->userid."'";
                $res1 = mysql_query( $qry1, $DB->conn);
	            if ($res1) {
	                if (!auditURL($USER->userid, $this->urlid, $this->nodeid, "","","", "", "", "", "", $CFG->actionDelete, $xml)) {
	                    return database_error();
	                }
	            } else {
	                return database_error();
	            }
            }
        }

        //delete
        $qry1 = "DELETE FROM URL WHERE URLID='".$this->urlid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
			if (!auditURL($USER->userid, $this->urlid, "", $this->url, $this->title, $this->description, $this->clip, $this->clippath, $this->cliphtml, "", $CFG->actionDelete, $xml)) {
				return database_error();
			}
		}

        return new Result("deleted","true");
    }

    /**
     * Set the privacy setting of this url
     *
     * @return URL object (this) (or Error object)
     */
    function setPrivacy($private){
        global $DB,$CFG,$USER;
        //check user owns the url
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $dt = time();
        $sql = "UPDATE URL SET Private='".$private."', ModificationDate=".$dt." WHERE URLID='".$this->urlid."'";
        $res = mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }

    /**
     * Add group to this url
     *
     * @param string $groupid
     * @return URL object (this) (or Error object)
     */
    function addGroup($groupid){
        global $DB,$CFG,$USER;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user member of group
        $group = new Group($groupid);
        $group->load();
        if(!$group->ismember($USER->userid)){
           return access_denied_error();
        }

        // check group not already in url
        $sql = "SELECT GroupID FROM URLGroup tg WHERE tg.URLID='".$this->urlid."' AND tg.GroupID='".$groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(mysql_num_rows($res) == 0){
            $dt = time();
            $sql = "INSERT INTO URLGroup (URLID,GroupID,CreationDate) VALUES ('".$this->urlid."','".$groupid."',".$dt.")";
            mysql_query( $sql, $DB->conn );
        }
        $this->load();
        return $this;
    }

    /**
     * Remove group from this node
     *
     * @param string $groupid
     * @return Node object (this) (or Error object)
     */
    function removeGroup($groupid){
        global $DB,$CFG,$USER;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user member of group
        $group = new Group($groupid);
        $group->load();
        if(!$group->ismember($USER->userid)){
           return access_denied_error();
        }

        // check group not already in node
        $sql = "DELETE FROM URLGroup WHERE URLID='".$this->urlid."' AND GroupID='".$groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }

    /**
     * Remove all groups from this Node
     *
     * @return Node object (this) (or Error object)
     */
    function removeAllGroups(){
        global $DB,$CFG,$USER;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $sql = "DELETE FROM URLGroup WHERE NodeID='".$this->urlid."'";
        $res = mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }

    /**
     * Add a Tag to this url
     *
     * @param string $tagid
     * @return URL object (this) (or Error object)
     */
    function addTag($tagid){
        global $DB,$CFG,$USER;

        //check user can edit the url
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user can edit the Tag
        $tag = new Tag($tagid);
        $tag->load();
        $tag->canedit();

        $dt = time();

        $qry4 = "select TagID from TagURL where URLID='".$this->urlid."' and TagID='".$tagid."' and UserID='".$USER->userid."'";
        $res4 = mysql_query( $qry4, $DB->conn);
        if ($res4) {
            $num_rows = mysql_num_rows($res4);
            if( $num_rows == 0 ) {
                $qry5 = "insert into TagURL (UserID, TagID, URLID) values ('".$USER->userid."', '".$tagid."', '".$this->urlid."')";
                $res5 = mysql_query( $qry5, $DB->conn);
                if (!$res5) {
                     return database_error();
                }
            }
        }
        $this->load();
        return $this;
    }

    /**
     * Remove a Tag from this url
     *
     * @param string $urlid
     * @return URL object (this) (or Error object)
     */
    function removeTag($tagid){
        global $DB,$CFG,$USER;

        //check user can edit the url
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user can edit the Tag
        $tag = new Tag($tagid);
        $tag->load();
        $tag->canedit();

        $dt = time();

        $qry = "DELETE FROM TagURL WHERE URLID='".$this->urlid."' and TagID='".$tagid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
            return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Add a Node to this URL
     *
     * @param string $nodeid
     * @param string $comments
     * @return URL object (this) (or Error object)
     */
    function addIdea($nodeid,$comments){
        global $DB,$CFG,$USER;
        //check user can edit the URL
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        //check user can edit the Node
        $node = new CNode($nodeid);
        $node->load();
        try {
        	$node->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $dt = time();

        $qry = "select NodeID, Comments, CreationDate from URLNode where URLID='".$this->urlid."' and NodeID='".$nodeid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            $num_rows = mysql_num_rows($res);
            if( $num_rows == 0 ) {
                $qry2 = "insert into URLNode (UserID, URLID, NodeID, CreationDate, ModificationDate, Comments) values ('".$USER->userid."', '".$this->urlid."', '".$nodeid."', ".$dt.", ".$dt.", '".mysql_escape_string($comments)."')";
                $res2 = mysql_query( $qry2, $DB->conn);
                if ($res2) {
                    if (!auditURL($USER->userid, $this->urlid, $nodeid, $this->urlid, "", "", "", "", "", "", $comments, $CFG->actionAdd,format_object('xml',$node))) {
                        return database_error();
                    }
                } else {
                     return database_error();
                }
            }
        }
        $this->load();
        return $this;
    }

    /**
     * Remove a URL from this node
     *
     * @param string $nodeid
     * @return URL object (this) (or Error object)
     */
    function removeIdea($nodeid){
        global $DB,$CFG,$USER;
        //check user can edit the URL
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user can edit the Node
        $node = new CNode($nodeid);
        $node->load();
        try {
        	$node->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $dt = time();

        $qry = "DELETE FROM URLNode WHERE NodeID='".$nodeid."' and URLID='".$this->urlid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            if (!auditURL($USER->userid, $this->urlid, $nodeid, "", "", "", "", "", "", "", $CFG->actionDelete, format_object('xml',$node))) {
                return database_error();
            }
        } else {
            return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Update the status for this url
     *
     * @return URL object (this) (or Error object)
     */
    function updateStatus($status){
        global $DB,$CFG,$USER;

        $dt = time();
        $sql = "UPDATE URL SET CurrentStatus=".$status.", ModificationDate=".$dt." WHERE URLID='".$this->urlid."'";
        $res = mysql_query( $sql, $DB->conn );
		if (!$res) {
			return database_error();
		}

        $this->load();
        return $this;
    }


    /////////////////////////////////////////////////////
    // security functions
    /////////////////////////////////////////////////////

    /**
     * Check whether the current user can view the current URL
     *
     * @throws Exception
     */
    function canview(){
        //anyone can view any URL
        global $DB,$CFG,$USER;
        $sql = "SELECT t.URLID FROM URL t
                WHERE t.URLID = '".$this->urlid."'
                AND (
                  (t.Private = 'N')
                  OR
                  (t.UserID = '".$USER->userid."')
                  OR
                  (t.URLID IN (SELECT tg.URLID FROM URLGroup tg
                                INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                                WHERE tg.URLID = '".$this->urlid."'
                                 AND ug.UserID = '".$USER->userid."')
                  ))";

        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can add a URL
     *
     * @throws Exception
     */
    function canadd(){
        // needs to be logged in that's all!
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can edit the current URL
     *
     * @throws Exception
     */
    function canedit(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the node
        $sql = "SELECT u.URLID FROM URL u WHERE u.UserID = '".$USER->userid."' AND u.URLID='".$this->urlid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can delete the current URL
     *
     * @throws Exception
     */
    function candelete(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can delete only if owner of the node
        $sql = "SELECT u.URLID FROM URL u WHERE u.UserID = '".$USER->userid."' AND u.URLID='".$this->urlid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /////////////////////////////////////////////////////
    // helper functions
    /////////////////////////////////////////////////////
    /**
     * How many times this website has been connected to an idea
     *
     * @return integer
     */
    function getWebsiteAssociationUsage() {
        global $DB,$CFG;
        $usage = 0;
        $qry = "select count(URLID) as urlcount from URLNode where URLID='".$this->urlid."' and UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            $array = mysql_fetch_array($res, MYSQL_ASSOC);
            $usage = $array['urlcount'];
        }
        return $usage;
    }
}
?>