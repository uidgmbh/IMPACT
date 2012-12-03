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
// Connection Class
///////////////////////////////////////

class Connection {

    public $connid;
    public $from;
    public $to;
    public $userid;
    public $users;
    public $creationdate;
    public $modificationdate;
    public $linktype;
    public $fromrole;
    public $torole;
    public $description;
    public $groups;
    public $tags;
    public $positivevotes;
    public $negativevotes;
    public $uservote;
    public $private;
    public $fromcontexttypeid;
    public $tocontexttypeid;
    public $linktypeid;

    function __construct($connid = "") {
        if ($connid != "") {
            $this->connid = $connid;
        }
    }

    /**
     * Loads the data for the connection from the database
     *
     * @param String $style (optional - default 'long') may be 'short' or 'long'
     * @return Connection object (this)
     */
    function load($style = 'long'){
        global $DB;
        try {
            $this->canview();
        } catch (Exception $e){
            return access_denied_error();
        }

        $sql = "SELECT * FROM Triple WHERE TripleID='".$this->connid."'";
        $res = mysql_query($sql, $DB->conn);
        $fromid = 0;
        $toid = 0;
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $fromid = trim($array['FromID']);
            $toid = trim($array['ToID']);
            $this->fromcontexttypeid = trim($array['FromContextTypeID']);
            $this->tocontexttypeid = trim($array['ToContextTypeID']);
            $this->creationdate = trim($array['CreationDate']);
            $this->modificationdate = trim($array['ModificationDate']);
            $this->userid = trim($array['UserID']);
            $this->users = array();
            $this->users[0] = getUser($this->userid, $style);
            $this->linktypeid = trim($array['LinkTypeID']);
            $this->private = $array['Private'];
           	$this->description = $array['Description'];
        }
        //now add in from/to nodes
        $this->from = new CNode($fromid);
        $this->from->load($style);
        $this->from->description = ""; // we don't need the long descriptions on connections - even if style for rest is long
        $this->to = new CNode($toid);
        $this->to->load($style);
        $this->to->description = ""; // we don't need the long descriptions on connections - even if style for rest is long

        $r = new Role($this->fromcontexttypeid);
        $this->fromrole = $r->load();

        $r = new Role($this->tocontexttypeid);
        $this->torole = $r->load();

        $l = new LinkType($this->linktypeid);
        $this->linktype = $l->load();

        if ($style == 'long'){
	        // add in the groups
	        $sql = "SELECT GroupID FROM TripleGroup tg WHERE tg.TripleID='".$this->connid."'";
	        $res = mysql_query($sql, $DB->conn);
	        if(mysql_num_rows($res) > 0){
	            $this->groups = array();
	            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
	                $group = new Group(trim($array['GroupID']));
	                array_push($this->groups,$group->load());
	            }
	        }

	        //now add in any tags
	        $sql = "SELECT u.TagID FROM TagTriple ut INNER JOIN Tag u ON u.TagID = ut.TagID WHERE ut.TripleID='".$this->connid."' ORDER BY Name ASC";
	        $res = mysql_query($sql, $DB->conn);
	        if(mysql_num_rows($res) > 0){
	            $this->tags = array();
	            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
	                $tag = new Tag(trim($array['TagID']));
	                array_push($this->tags,$tag->load());
	            }
	        }

	        $this->loadVotes();
		}

        return $this;
    }

	/**
	 * Load Associated vote counts
	 */
	function loadVotes() {
        global $DB, $USER;

        //load positive votes
        $sql = "Select count(VoteType) as Positive from Voting where ItemID='".$this->connid."' AND VoteType='Y'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res) > 0){
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
        		$this->positivevotes = $array['Positive'];
        	}
		} else {
			$this->positivevotes = 0;
		}

        //load negative votes
        $sql = "Select count(VoteType) as Negative from Voting where ItemID='".$this->connid."' AND VoteType='N'";
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
        $sql2 = "SELECT VoteType FROM Voting WHERE UserID='".$USER->userid."' AND ItemID='".$this->connid."'";
        $res2 = mysql_query( $sql2, $DB->conn );
        if(mysql_num_rows($res2) > 0){
            while ($array2 = mysql_fetch_array($res2, MYSQL_ASSOC)) {
            	$this->uservote = $array2['VoteType'];
            }
       	}
	}

    /**
     * Add new connection to the database
     *
     * @param string $fromnodeid
     * @param string $fromroleid
     * @param string $linktypeid
     * @param string $tonodeid
     * @param string $toroleid
     * @param string $private
     * @param string $description
     * @return Connection object (this) (or Error object)
     */
    function add($fromnodeid,$fromroleid,$linktypeid,$tonodeid,$toroleid,$private,$description=""){
        global $DB,$CFG,$USER;
        $dt = time();
        //check user can add connection
        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }

        $fromnode = new CNode($fromnodeid);
        $fromnode->load();
        $tonode = new CNode($tonodeid);
        $tonode->load();

        try {
            $lt = new LinkType($linktypeid);
            $lt->load();
            $lt->canedit();
        } catch (Exception $e){
            $lt->add($lt->label, $lt->grouplabel);
        }

        $qry1 = "select TripleID, CreationDate from Triple where UserID='".$USER->userid."' and LinkTypeID='".$linktypeid."' and FromID='".$fromnodeid."' and ToID='".$tonodeid."' and FromContextTypeID='".$fromroleid."' and ToContextTypeID='".$toroleid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            $num_rows = mysql_num_rows($res1);
            if( $num_rows > 0 ) {
                while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                    $this->connid = $array1['TripleID'];
                    return $this->load();
                }
            } else {
                $this->connid = getUniqueID();
                $qry = "insert into Triple (
                                TripleID,
                                UserID,
                                CreationDate,
                                ModificationDate,
                                LinkTypeID,
                                FromID,
                                ToID,
                                FromContextTypeID,
                                ToContextTypeID,
                                FromLabel,
                                ToLabel,
                                Private,
                                Description)
                        VALUES (
                                '".$this->connid."',
                                '".$USER->userid."',
                                ".$dt.",
                                ".$dt.",
                                '".$linktypeid."',
                                '".$fromnodeid."',
                                '".$tonodeid."',
                                '".$fromroleid."',
                                '".$toroleid."',
                                '".mysql_escape_string($fromnode->name)."',
                                '".mysql_escape_string($tonode->name)."',
                                 '".$private."',
                                '".mysql_escape_string($description)."')";
                $res = mysql_query( $qry, $DB->conn);
                if (!$res) {
                    return database_error();
                }
            }
        } else {
            return database_error();
        }

        $this->load();
        if (!auditConnection($USER->userid, $this->connid, "", $fromnodeid, $tonodeid, $linktypeid, $fromroleid, $toroleid, $CFG->actionAdd,format_object('xml',$this))) {
            return database_error();
        }
        return $this;
    }

    /**
     * Edit a connection
     * after the update need to update the nodes so they're in the same groups as the connection
     * @param string $fromnodeid
     * @param string $fromroleid
     * @param string $linktypeid
     * @param string $tonodeid
     * @param string $toroleid
     * @param string $private
     * @param string $description
     * @return Connection object (this) (or Error object)
     */
    function edit($fromnodeid,$fromroleid,$linktypeid,$tonodeid,$toroleid,$private,$description=""){
        global $DB,$CFG,$USER;

        $dt = time();

        //check user can edit connection
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry = "update Triple
                set
                ModificationDate=".$dt.",
                ToLabel='".mysql_escape_string($tonode->name)."',
                FromLabel='".mysql_escape_string($fromnode->name)."',
                LinkTypeID='".$linktypeid."',
                FromID='".$fromnodeid."',
                ToID='".$tonodeid."',
                FromContextTypeID='".$fromroleid."',
                ToContextTypeID='".$toroleid."',
                Private ='".$private."',
                Description='".mysql_escape_string($description)."'
                where TripleID='".$this->connid."' and UserID='".$USER->userid."'";

        $res = mysql_query( $qry, $DB->conn);

        if (!$res) {
            return database_error();
        }


        // now update the to from nodes for each of the groups this connection is in

        // now also add groups to the from and to nodes
        $sql = "SELECT GroupID FROM TripleGroup tg WHERE tg.TripleID='".$this->connid."'";
        $res = mysql_query($sql, $DB->conn);
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $groupid = $array['GroupID'];
            $fromnode = new CNode($fromnodeid);
            $fromnode->addGroup($groupid);
            $tonode = new CNode($tonodeid);
            $tonode->addGroup($groupid);
        }
        $this->load();

        if (!auditConnection($USER->userid, $this->connid, "", $fromnodeid, $tonodeid, $linktypeid, $fromroleid, $toroleid, $CFG->actionEdit,format_object('xml',$this))) {
             return database_error();
        }
        return $this;
    }

    /**
     * Delete connection
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
		$xml = format_object('xml',$this);

        $qry = "DELETE FROM Triple WHERE TripleID='".$this->connid."'";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
            return database_error();
        }
        if (!auditConnection($USER->userid, $this->connid, "", $this->from->nodeid, $this->to->nodeid, $this->linktype->linktypeid, $this->fromrole->roleid, $this->torole->roleid, $CFG->actionDelete,$xml)) {
            return database_error();
        }

        return new Result("deleted","true","1");
    }

    function vote($vote){
        global $DB,$USER;
        try {
            $this->canview();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry = "SELECT VoteID FROM Voting WHERE UserID='".$USER->userid."' AND ItemID='".$this->connid."'";
        $res = mysql_query( $qry, $DB->conn);
        if(mysql_num_rows($res)==0){
	        $dt = time();
	        $qry = "INSERT INTO Voting (UserID, ItemID, VoteType, CreationDate, ModificationDate) values ('".$USER->userid."', '".mysql_escape_string(trim($this->connid))."','".mysql_escape_string(trim($vote))."',".$dt.",".$dt.")";
	        $res = mysql_query( $qry, $DB->conn);
	        if(!$res){
	            return database_error();
	        }
        } else {
	        $dt = time();
	        $qry = "UPDATE Voting SET ModificationDate=".$dt.", VoteType='".mysql_escape_string(trim($vote))."' WHERE UserID='".$USER->userid."' AND ItemID='".$this->connid."'";
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

        $qry = "DELETE FROM Voting WHERE UserID='".$USER->userid."' AND ItemID='".$this->connid."' AND VoteType='".mysql_escape_string(trim($vote))."'";
        $res = mysql_query( $qry, $DB->conn);
        if(!$res){
            return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Add group to this Connection
     * Also adds this group to the corresponding connected nodes as
     * the nodes also need to be in the group for them to be visible
     *
     * @param string $groupid
     * @return Connection object (this) (or Error object)
     */
    function addGroup($groupid){
        global $DB, $USER;
        //check user owns the connection
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
        $sql = "SELECT GroupID FROM TripleGroup tg WHERE tg.TripleID='".$this->connid."' AND tg.GroupID='".$groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(mysql_num_rows($res) == 0){
            $dt = time();
            $sql = "INSERT INTO TripleGroup (TripleID,GroupID,CreationDate) VALUES ('".$this->connid."','".$groupid."',".$dt.")";
            mysql_query( $sql, $DB->conn );
            // now also add group to the from and to nodes
            $fromnode = $this->from;
            $fromnode->addGroup($groupid);
            $tonode = $this->to;
            $tonode->addGroup($groupid);
        }
        $this->load();
        return $this;
    }

    /**
     * Remove group from this Connection
     *
     * @param string $groupid
     * @return Connection object (this) (or Error object)
     */
    function removeGroup($groupid){
        global $DB, $USER;
        //check user owns the connection
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
        $sql = "DELETE FROM TripleGroup WHERE TripleID='".$this->connid."' AND GroupID='".$groupid."'";
        mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }

    /**
     * Remove all groups from this Connection
     *
     * @return Connection object (this) (or Error object)
     */
    function removeAllGroups(){
        global $DB;
        //check user owns the connection
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $sql = "DELETE FROM TripleGroup WHERE TripleID='".$this->connid."'";
        mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }


    /**
     * Add a Tag to this connection
     *
     * @param string $tagid
     * @return Connection object (this) (or Error object)
     */
    function addTag($tagid){
        global $DB, $USER;

        //check user can edit the connection
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user can edit the Tag
        $tag = new Tag($tagid);
        $tag->load();
        $tag->canedit();

        $qry4 = "select TagID from TagTriple where TripleID='".$this->connid."' and TagID='".$tagid."' and UserID='".$USER->userid."'";
        $res4 = mysql_query( $qry4, $DB->conn);
        if ($res4) {
            $num_rows = mysql_num_rows($res4);
            if( $num_rows == 0 ) {
                $qry5 = "insert into TagTriple (UserID, TagID, TripleID) values ('".$USER->userid."', '".$tagid."', '".$this->connid."')";
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
     * Remove a Tag from this connection
     *
     * @param string $urlid
     * @return Connection object (this) (or Error object)
     */
    function removeTag($tagid){
        global $DB, $USER;

        //check user can edit the connection
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check user can edit the Tag
        $tag = new Tag($tagid);
        $tag->load();
        $tag->canedit();

        $qry = "DELETE FROM TagTriple WHERE TripleID='".$this->connid."' and TagID='".$tagid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
            return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Set the privacy setting of this Connection
     *
     * @return Connection object (this) (or Error object)
     */
    function setPrivacy($private){
        global $DB;
        //check user owns the Connection
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $dt = time();
        $sql = "UPDATE Triple SET Private='".$private."', ModificationDate=".$dt." WHERE TripleID='".$this->connid."'";
        mysql_query( $sql, $DB->conn );
        $this->load();
        return $this;
    }
    /////////////////////////////////////////////////////
    // security functions
    /////////////////////////////////////////////////////

    /**
     * Check whether the current user can view the current connection
     *
     * @throws Exception
     */
    function canview(){
        global $DB, $USER;
        $sql = "SELECT t.TripleID FROM Triple t
                WHERE t.TripleID = '".$this->connid."'
                AND ((t.Private = 'N')
                   OR
                   (t.UserID = '".$USER->userid."')
                   OR
                   (t.TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
                                 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                                  WHERE ug.UserID = '".$USER->userid."')))
                AND FromID IN (SELECT t.NodeID FROM Node t
                                WHERE ((t.Private = 'N')
                                   OR
                                   (t.UserID = '".$USER->userid."')
                                   OR
                                   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
                                               INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                                                WHERE ug.UserID = '".$USER->userid."')))
                                )
                AND ToID IN (SELECT t.NodeID FROM Node t
                                WHERE ((t.Private = 'N')
                                   OR
                                   (t.UserID = '".$USER->userid."')
                                   OR
                                   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
                                               INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                                                WHERE ug.UserID = '".$USER->userid."')))
                            )";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can add a connection
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
     * Check whether the current user can copy a connection
     *
     * @throws Exception
     */
    function cancopy(){
        // needs to be logged in that's all!
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can edit the current connection
     *
     * @throws Exception
     */
    function canedit(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }

        //can edit only if owner of the connection
        $sql = "SELECT t.TripleID FROM Triple t WHERE t.UserID = '".$USER->userid."' AND t.TripleID='".$this->connid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can delete the current connection
     *
     * @throws Exception
     */
    function candelete(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can delete only if owner of the connection
        $sql = "SELECT t.TripleID FROM Triple t WHERE t.UserID = '".$USER->userid."' AND t.TripleID='".$this->connid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

}
?>