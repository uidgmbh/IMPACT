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
// Node Class
///////////////////////////////////////

class CNode {

    public $nodeid;
    public $name;
    public $creationdate;
    public $modificationdate;
    public $private;
    public $users;
    public $otheruserconnections;
    public $isbookmarked;
    public $status = 0;
    public $description;
    public $startdatetime;
    public $enddatetime;
    public $location;
    public $countrycode;
    public $country;
    public $locationlat;
    public $locationlng;
    public $urls;
    public $groups;
    public $tags;
    public $imageurlid;
    public $imagethumbnail;
    public $role;
    public $positivevotes;
    public $negativevotes;
    public $uservote;

    public function __construct($nodeid = "") {
      if ($nodeid != "") {
        $this->nodeid = $nodeid;
      }
    }

    /**
     * Loads the data for the node from the database
     *
     * @param String $style (optional - default 'long') may be 'short' or 'long'
     * @return Node object (this)
     */
    function load($style = 'long') {

        global $DB, $USER;
        try {
            $this->canview();
        } catch (Exception $e){
            return access_denied_error();
        }
        $sql = "SELECT t.*, COUNT(fT.FromID) + COUNT(tT.ToID) AS connectedness  FROM Node t
                LEFT OUTER JOIN (SELECT FromID FROM Triple) fT ON t.NodeID = fT.FromID
                LEFT OUTER JOIN (SELECT ToID FROM Triple) tT ON t.NodeID = tT.ToID
                WHERE t.NodeID='".$this->nodeid."'
                GROUP BY t.NodeID";

        $res = mysql_query($sql, $DB->conn);

        if(mysql_num_rows($res)==0){
             return database_error("Node not found","7002");
        }

        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $this->name = stripslashes(trim($array['Name']));
            $this->connectedness = $array['connectedness'];
            $this->creationdate = $array['CreationDate'];
            $this->modificationdate = $array['ModificationDate'];
            $this->private = $array['Private'];
            $this->users = array();
            $this->users[0] = getUser($array['UserID'],$style);
            if($array['StartDate'] != 0){
            	$this->startdatetime = $array['StartDate'];
            }
            if($array['EndDate'] != 0){
            	$this->enddatetime = $array['EndDate'];
            }
            if($array['LocationText']){
                $this->location = $array['LocationText'];
            }
            if($array['LocationCountry']){
                $cs = getCountryList();
                $this->countrycode = $array['LocationCountry'];
                $this->country = $cs[$array['LocationCountry']];
            }
            if($array['LocationLat']){
                $this->locationlat = $array['LocationLat'];
            }
            if($array['LocationLng']){
                $this->locationlng = $array['LocationLng'];
            }
            if($array['Image']){
                $this->imageurlid = $array['Image'];
            }
            if($array['ImageThumbnail']){
                $this->imagethumbnail = $array['ImageThumbnail'];
            }
            if($array['NodeTypeID']){
                $this->role = new Role($array['NodeTypeID']);
                $this->role->load();
            }
            if ($array['CurrentStatus']) {
            	$this->status = $array['CurrentStatus'];
            }

			if (trim($array['Description']) != "") {
				$this->hasdesc = true;
			}

	        if ($style == 'long'){
            	$this->description = stripslashes(trim($array['Description']));
			}
         }

         // check for eternal connections
         $sql = "SELECT COUNT(TripleID) AS connectedness  FROM Triple " .
        		"WHERE (FromID='".$this->nodeid."' OR ToID='".$this->nodeid."') AND UserID != '".$USER->userid."'";

         $res = mysql_query($sql, $DB->conn);
         if(mysql_num_rows($res) > 0 ){
            $array = mysql_fetch_array($res, MYSQL_ASSOC);
 			$this->otheruserconnections = $array['connectedness'];
         } else {
        	 $this->otheruserconnections = 0;
         }

        if ($style == 'long'){
	        $this->loadWebsites($style);
	        $this->loadTags();
	        $this->loadGroups();
	        $this->loadVotes();
        }

        $this->isbookmarked = false;
        //check if it's in the current user's bookmarks
        $sql2 = "SELECT NodeID FROM UsersCache WHERE UserID='".$USER->userid."' AND NodeID='".$this->nodeid."'";
        $res2 = mysql_query( $sql2, $DB->conn );
        if(mysql_num_rows($res2) > 0){
            $this->isbookmarked = true;
       	}

        return $this;
    }

	/**
	 * Load Associated vote counts
	 */
	function loadVotes() {
        global $DB, $USER;

        //load positive votes
        $sql = "Select count(VoteType) as Positive from Voting where ItemID='".$this->nodeid."' AND VoteType='Y'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res) > 0){
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
        		$this->positivevotes = $array['Positive'];
        	}
		} else {
			$this->positivevotes = 0;
		}

        //load negative votes
        $sql = "Select count(VoteType) as Negative from Voting where ItemID='".$this->nodeid."' AND VoteType='N'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res) > 0){
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
        		$this->negativevotes = $array['Negative'];
        	}
		} else {
        	$this->negativevotes = 0;
		}


        $this->uservote = '0';
        //load the current user's vote for this node if any
        $sql2 = "SELECT VoteType FROM Voting WHERE UserID='".$USER->userid."' AND ItemID='".$this->nodeid."'";
        $res2 = mysql_query( $sql2, $DB->conn );
        if(mysql_num_rows($res2) > 0){
            while ($array2 = mysql_fetch_array($res2, MYSQL_ASSOC)) {
            	$this->uservote = $array2['VoteType'];
            }
       	}
	}

	/**
	 * Load Associated websites
     * @param String $style (optional - default 'long') may be 'short' or 'long'
	 */
	function loadWebsites($style = 'long') {
        global $DB;

	    //now add in any websites
        $sql = "SELECT u.URLID FROM URLNode ut INNER JOIN URL u ON u.URLID = ut.URLID WHERE ut.NodeID='".$this->nodeid."' ORDER BY u.Title ASC";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res) > 0){
            $this->urls = array();
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            	// make sure url associated with this node can actually be seen by the current user.
            	// if they can see the node they should really be able to see the url
            	// but not necessarily
                try {
                    $url = new URL(trim($array['URLID']));
                    array_push($this->urls,$url->load($style));
                } catch (Exception $e){
                    //return access_denied_error();
                }
            }
        }
	}

	/**
	 * Load associated tags
	 */
	function loadTags() {
        global $DB;
        $sql = "SELECT u.TagID FROM TagNode ut INNER JOIN Tag u ON u.TagID = ut.TagID WHERE ut.NodeID='".$this->nodeid."' ORDER BY Name ASC";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res) > 0){
            $this->tags = array();
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $tag = new Tag(trim($array['TagID']));
                array_push($this->tags,$tag->load());
            }
        }
	}

	/**
	 * Load groups
	 */
	function loadGroups() {
        global $DB;
        $sql = "SELECT GroupID FROM NodeGroup tg WHERE tg.NodeID='".$this->nodeid."'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res) > 0){
            $this->groups = array();
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $group = new Group(trim($array['GroupID']));
                array_push($this->groups,$group->load());
            }
        }
	}

    /**
     * Add new node to the database
     *
     * @param string $name
     * @param string $desc
     * @param string $private optional, can be Y or N, defaults to users preferred setting
     * @param string $nodetypeid optional, the id of the nodetype this node is, defaults to 'Idea' node type id.
     * @param string $imageurlid optional, the urlid of the url for the image that is being used as this node's icon
     * @param string $imagethumbnail optional, the local server path to the thumbnail of the image used for this node
     * @return Node object (this) (or Error object)
     */
    function add($name,$desc="",$private,$nodetypeid="",$imageurlid="",$imagethumbnail=""){
        global $DB,$CFG,$USER;

        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }
        $qry1 = "select NodeID, CreationDate from Node where UserID='".$USER->userid."' and Name='".mysql_escape_string($name)."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        $dt = time();

        if ($res1) {
            $num_rows = mysql_num_rows($res1);
            if( $num_rows > 0 ) {
                while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                    $this->nodeid = $array1["NodeID"];
                }
            } else {
                $this->nodeid = getUniqueID();
                $qry2 = "insert into Node (NodeID, UserID, CreationDate, ModificationDate, Name, Description, Private, NodeTypeID, Image, ImageThumbnail) values ('".$this->nodeid."', '".$USER->userid."', ".$dt.", ".$dt.", '".mysql_escape_string($name)."', '".mysql_escape_string($desc)."','".$private."','".$nodetypeid."','".$imageurlid."','".$imagethumbnail."')";
                $res2 = mysql_query( $qry2, $DB->conn);
                if (!$res2) {
                    return database_error();
                }
            }
        }
        $this->load();
        auditIdea($USER->userid, $this->nodeid, $name, $desc, $CFG->actionAdd,format_object('xml',$this));
        return $this;
    }

    /**
     * Edit a node
     *
     * @param string $name
     * @param string $desc
     * @param string $private optional, can be Y or N, defaults to users preferred setting
     * @param string $nodetypeid optional, the id of the nodetype this node is, defaults to 'Idea' node type id.
     * @param string $imageurlid optional, the urlid of the url for the image that is being used as this node's icon
     * @param string $imagethumbnail optional, the local server path to the thumbnail of the image used for this node
     *
     * @return Node object (this) (or Error object)
     */
    function edit($name,$desc,$private,$nodetypeid="",$imageurlid="",$imagethumbnail=""){
        global $CFG,$DB,$USER;
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt = time();

        $qry2 = "update Node set ModificationDate=".$dt.", Name='".mysql_escape_string($name)."', Description='".mysql_escape_string($desc)."', Private='".$private."', NodeTypeID='".$nodetypeid."', Image='".$imageurlid."', ImageThumbnail='".$imagethumbnail."' where NodeID='".$this->nodeid."' and UserID='".$USER->userid."'";

    	//remove old thumbnail if new image added or old one deleted
    	if ( ($imageurlid == null || $imageurlid == "" || $imagethumbnail != $this->imagethumbnail) &&
    			$this->imagethumbnail != null && $this->imagethumbnail !="" && substr($this->imagethumbnail,0,7) == 'uploads') {
    		unlink($CFG->dirAddress.$this->imagethumbnail);
    	}

        $res2 = mysql_query( $qry2, $DB->conn);
        if ($res2) {
            //update labels in Triple Table
            $qry3 = "update Triple set ToLabel='".mysql_escape_string($name)."' where ToID='".$this->nodeid."' and UserID='".$USER->userid."'";
            mysql_query( $qry3,$DB->conn);
            $qry4 = "update Triple set FromLabel='".mysql_escape_string($name)."' where FromID='".$this->nodeid."' and UserID='".$USER->userid."'";
            mysql_query( $qry4, $DB->conn);
        } else {
            return database_error();
        }
        $this->load();
        auditIdea($USER->userid, $this->nodeid, $name, $desc, $CFG->actionEdit,format_object('xml',$this));
        return $this;
    }

    /**
     * Delete node
     *
     * @return Result object (or Error object)
     */
    function delete(){
        global $DB,$CFG,$USER;
        try {
            $this->candelete();
        } catch (Exception $e){
            return access_denied_error();
        }
        $this->load();

		$this->load();
		$xml = format_object('xml',$this);

        $qry = "DELETE FROM Node WHERE NodeID='".$this->nodeid."'";
        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            auditIdea($USER->userid, $this->nodeid, $this->name, $this->description, $CFG->actionDelete, $xml);

            // NOT SURE THIS IS REQUIRED NOW AS IT SHOULD HAPPEN ON CASCADE DELETE IN THE DATABASE
            // update the related connections (triples)
            $qry2 = "select TripleID from Triple where (FromID='".$this->nodeid."' or ToID='".$this->nodeid."')";
            $res2 = mysql_query( $qry2, $DB->conn);
            if($res2){
                while ($array = mysql_fetch_array($res2, MYSQL_ASSOC)) {
                    $conn = new Connection($array['TripleID']);
                    $conn->delete();
                }
            } else {
                 return database_error();
            }

            //update the related URLs
            $qry3 = "DELETE FROM URLNode WHERE NodeID='".$this->nodeid."'";
            $res3 = mysql_query( $qry3, $DB->conn);
            if (!$res3) {
                return database_error();
            }
        } else {
            return database_error();
        }
        //remove old thumbnail if new image added or old one deleted
        if ($this->imagethumbnail != null && $this->imagethumbnail !="" && substr($this->imagethumbnail,0,7) == 'uploads') {
            unlink($CFG->dirAddress.$this->imagethumbnail);
        }
        return new Result("deleted","true");
    }

    function vote($vote){
        global $DB,$USER;
        try {
            $this->canview();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry = "SELECT VoteID FROM Voting WHERE UserID='".$USER->userid."' AND ItemID='".$this->nodeid."'";
        $res = mysql_query( $qry, $DB->conn);
        if(mysql_num_rows($res)==0){
	        $dt = time();
	        $qry = "INSERT INTO Voting (UserID, ItemID, VoteType, CreationDate, ModificationDate) values ('".$USER->userid."', '".mysql_escape_string(trim($this->nodeid))."','".mysql_escape_string(trim($vote))."',".$dt.",".$dt.")";
	        $res = mysql_query( $qry, $DB->conn);
	        if(!$res){
	            return database_error();
	        }
        } else {
	        $dt = time();
	        $qry = "UPDATE Voting SET ModificationDate=".$dt.", VoteType='".mysql_escape_string(trim($vote))."' WHERE UserID='".$USER->userid."' AND ItemID='".$this->nodeid."'";
	        $res = mysql_query( $qry, $DB->conn);
	        if(!$res){
	            return database_error();
	        }
        }

        $this->load();
        return $this;
    }

    function deleteVote($vote){
        global $DB,$USER;
        try {
            $this->canview();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry = "DELETE FROM Voting WHERE UserID='".$USER->userid."' AND ItemID='".$this->nodeid."' AND VoteType='".mysql_escape_string(trim($vote))."'";
        $res = mysql_query( $qry, $DB->conn);
        if(!$res){
            return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Add a URL to this node
     *
     * @param string $urlid
     * @param string $comments
     * @return Node object (this) (or Error object)
     */
    function addURL($urlid,$comments){
        global $DB,$CFG,$USER;
        //check user can edit the Node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        //check user can edit the URL
        $url = new URL($urlid);
        $url->load();
        try {
            $url->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $dt = time();

        $qry4 = "select URLID, Comments, CreationDate from URLNode where NodeID='".$this->nodeid."' and URLID='".$urlid."' and UserID='".$USER->userid."'";
        $res4 = mysql_query( $qry4, $DB->conn);
        if ($res4) {
            $num_rows = mysql_num_rows($res4);
            if( $num_rows == 0 ) {
                $qry5 = "insert into URLNode (UserID, URLID, NodeID, CreationDate, ModificationDate, Comments) values ('".$USER->userid."', '".$urlid."', '".$this->nodeid."', ".$dt.", ".$dt.", '".mysql_escape_string($comments)."')";
                $res5 = mysql_query( $qry5, $DB->conn);
                if ($res5) {
                    if (!auditURL($USER->userid, $urlid, $this->nodeid, $urlid, "", "", "", "", "", "", $comments, $CFG->actionAdd,format_object('xml',$this))) {
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
     * @param string $urlid
     * @return Node object (this) (or Error object)
     */
    function removeURL($urlid){
        global $DB,$CFG,$USER;
        //check user can edit the Node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        //check user can edit the URL
        $url = new URL($urlid);
        try {
            $url->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry = "DELETE FROM URLNode WHERE NodeID='".$this->nodeid."' and URLID='".$urlid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            if (!auditURL($USER->userid, $urlid, $this->nodeid, "", "", "", "", "", "", "", $CFG->actionDelete, format_object('xml',$this))) {
                return database_error();
            }
        } else {
            return database_error();
        }
        $this->load();
        return $this;
    }

     /**
     * Remove all urls from this Node
     *
     * @return Node object (this) (or Error object)
     */
    function removeAllURLs(){
        global $DB;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry = "DELETE FROM URLNode WHERE NodeID='".$this->nodeid."'";
        $res = mysql_query( $qry, $DB->conn );
        if (!$res) {
            return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Add group to this node
     *
     * @param string $groupid
     * @return Node object (this) (or Error object)
     */
    function addGroup($groupid){
        global $DB, $USER;
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
        $sql = "SELECT GroupID FROM NodeGroup tg WHERE tg.NodeID='".$this->nodeid."' AND tg.GroupID='".$groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(mysql_num_rows($res) == 0){
            $dt = time();
            $sql = "INSERT INTO NodeGroup (NodeID,GroupID,CreationDate) VALUES ('".$this->nodeid."','".$groupid."',".$dt.")";
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
        global $DB, $USER;
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
        $sql = "DELETE FROM NodeGroup WHERE NodeID='".$this->nodeid."' AND GroupID='".$groupid."'";
        mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }

    /**
     * Remove all groups from this Node
     *
     * @return Node object (this) (or Error object)
     */
    function removeAllGroups(){
        global $DB;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $sql = "DELETE FROM NodeGroup WHERE NodeID='".$this->nodeid."'";
        mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }

    /**
     * Add a Tag to this node
     *
     * @param string $tagid
     * @return Node object (this) (or Error object)
     */
    function addTag($tagid){
        global $DB, $USER;

        //check user can edit the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user can edit the Tag
        $tag = new Tag($tagid);
        $tag->load();
        $tag->canedit();

        $qry4 = "select TagID from TagNode where NodeID='".$this->nodeid."' and TagID='".$tagid."' and UserID='".$USER->userid."'";
        $res4 = mysql_query( $qry4, $DB->conn);
        if ($res4) {
            $num_rows = mysql_num_rows($res4);
            if( $num_rows == 0 ) {
                $qry5 = "insert into TagNode (UserID, TagID, NodeID) values ('".$USER->userid."', '".$tagid."', '".$this->nodeid."')";
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
     * Remove a Tag from this node
     *
     * @param string $urlid
     * @return Node object (this) (or Error object)
     */
    function removeTag($tagid){
        global $DB, $USER;

        //check user can edit the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user can edit the Tag
        $tag = new Tag($tagid);
        $tag->load();
        $tag->canedit();

        $qry = "DELETE FROM TagNode WHERE NodeID='".$this->nodeid."' and TagID='".$tagid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
             return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Set the privacy setting of this node
     *
     * @return Node object (this) (or Error object)
     */
    function setPrivacy($private){
        global $DB;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $dt = time();
        $sql = "UPDATE Node SET Private='".$private."', ModificationDate=".$dt." WHERE NodeID='".$this->nodeid."'";
        mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }

    /**
     * Update the start date for this node
     *
     * @return Node object (this) (or Error object)
     */
    function updateStartDate($startdate){
        global $DB;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        try {
            if(is_numeric($startdate)){
                $mydate = $startdate;
            } else {
                $mydate = strtotime($startdate);
            }
            $dt = time();
            $sql = "UPDATE Node SET StartDate='".$mydate."', ModificationDate=".$dt." WHERE NodeID='".$this->nodeid."'";
            mysql_query( $sql, $DB->conn );
        } catch (Exception $e) {
            //failed
        }

        $this->load();
        return $this;
    }

    /**
     * Update the end date for this node
     *
     * @return Node object (this) (or Error object)
     */
    function updateEndDate($enddate){
        global $DB;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        try {
            if(is_numeric($enddate)){
                $mydate = $enddate;
            } else {
                $mydate = strtotime($enddate);
            }
            $dt = time();
            $sql = "UPDATE Node SET EndDate='".$mydate."', ModificationDate=".$dt." WHERE NodeID='".$this->nodeid."'";
            mysql_query( $sql, $DB->conn );
        } catch (Exception $e) {
            //failed
        }

        $this->load();
        return $this;
    }


    /**
     * Update the location for this node
     *
     * @return Node object (this) (or Error object)
     */
    function updateLocation($location,$loccountry){
        global $DB;
        //check user owns the node
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt = time();
        $sql = "UPDATE Node SET LocationText='".mysql_escape_string($location)."', LocationCountry='".mysql_escape_string($loccountry)."', ModificationDate=".$dt." WHERE NodeID='".$this->nodeid."'";
        $res = mysql_query( $sql, $DB->conn );

        //try to geocode
        if ($location != "" && $loccountry != "" && ($location != $this->location || $loccountry != $this->countrycode)){
            $coords = geoCode($location,$loccountry);
            if($coords["lat"] != "" && $coords["lng"] != ""){
                $sql = "UPDATE Node SET LocationLat='".$coords["lat"]."', LocationLng='".$coords["lng"]."' WHERE NodeID='".$this->nodeid."'";
                $res = mysql_query( $sql, $DB->conn );
            } else {
                $sql = "UPDATE Node SET LocationLat=null, LocationLng=null WHERE NodeID='".$this->nodeid."'";
                $res = mysql_query( $sql, $DB->conn );
            }
        }
        $this->load();
        return $this;
    }


    /**
     * Update the status for this node
     *
     * @return Node object (this) (or Error object)
     */
    function updateStatus($status){
        global $DB;

        $dt = time();
        $sql = "UPDATE Node SET CurrentStatus=".$status.", ModificationDate=".$dt." WHERE NodeID='".$this->nodeid."'";
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
     * Check whether the current user can view the current node
     *
     * @throws Exception
     */
    function canview(){
        // check whether a user can view a node
        global $DB, $USER;
        $sql = "SELECT t.NodeID FROM Node t
                WHERE t.NodeID = '".$this->nodeid."'
                AND (
                  (t.Private = 'N')
                  OR
                  (t.UserID = '".$USER->userid."')
                  OR
                  (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
                                INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                                WHERE tg.NodeID = '".$this->nodeid."'
                                 AND ug.UserID = '".$USER->userid."')
                  ))";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can add a node
     *
     * @throws Exception
     */
    function canadd(){
        // needs to be logged in that's all!
        api_check_login();
    }

    /**
     * Check whether the current user can edit the current node
     *
     * @throws Exception
     */
    function canedit(){
        global $DB,$USER;
        api_check_login();
        //can edit only if owner of the node
        $sql = "SELECT t.NodeID FROM Node t WHERE t.UserID = '".$USER->userid."' AND t.NodeID='".$this->nodeid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can delete the current node
     *
     * @throws Exception
     */
    function candelete(){
        //can delete only if owner of the node
        global $DB,$USER;
        api_check_login();
        //can delete only if owner of the node
        $sql = "SELECT t.NodeID FROM Node t WHERE t.UserID = '".$USER->userid."' AND t.NodeID='".$this->nodeid."'";
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
     * How many times this node has been used in making a connection
     *
     * @return integer
     */
    function getConnectionUsage() {
        global $DB;
        $usage = 0;

        //one side of connection
        $qry = "select count(FromID) as nodecount from Triple where FromID='".$this->nodeid."' and UserID='".$this->userid."'";

        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            $array = mysql_fetch_array($res, MYSQL_ASSOC);
            $usage = $array['nodecount'];
        }

        //other side of connection
        $qry = "select count(ToID) as nodecount from Triple where ToID='".$this->nodeid."' and UserID='".$this->userid."'";

        $res = mysql_query( $qry,$DB->conn);
        if ($res) {
            $array = mysql_fetch_array($res, MYSQL_ASSOC);
            $usage = $usage+$array['nodecount'];
        }

        return $usage;
    }

    /**
     * How many users have entered this idea
     *
     * @return integer
     */
    function getNodeEntryUsage() {
        global $DB;
        $usage = 0;

        $qry = "select count(Name) as nodecount from Node where Name='".mysql_escape_string($this->name)."' and UserID='".$this->userid."'";

        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            $array = mysql_fetch_array($res, MYSQL_ASSOC);
            $usage = $array['nodecount'];
        }

        return $usage;
    }
}
?>