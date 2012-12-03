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

class Role {
    public $roleid;
    public $name;
    public $userid;
    public $groupid;
    public $image;

    /**
     * Constructor
     *
     * @param string $roleid (optional)
     */
    public function __construct($roleid = "") {
      if ($roleid != "") {
        $this->roleid = $roleid;
      }
    }

    /**
     * Loads the data for the role from the database
     *
     * @return Role object (this)
     */
    function load() {
        global $DB,$CFG;
        $qry1 = "SELECT cnt.UserID, cnt.Name, cnt.Image, ctng.NodeTypeGroupID FROM NodeTypeGrouping ctng
                INNER JOIN NodeType cnt ON cnt.NodeTypeID = ctng.NodeTypeID
                WHERE cnt.NodeTypeID='".$this->roleid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            if(mysql_num_rows($res1)==0){
                return database_error("Role not found","7002");
            }
            $groupid = "";
            while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                $this->name = stripslashes($array1['Name']);
                $this->userid = $array1['UserID'];
                $this->groupid = $array1['NodeTypeGroupID'];
                $this->image = $array1['Image'];
            }
        } else {
            return database_error();
        }
        return $this;
    }

    /**
     * Loads the data for the role from the database based on role name
     *
     * @return Role object (this)
     */
    function loadByName($rolename){
        global $DB,$CFG,$USER;
        $qry1 = "SELECT NodeTypeID FROM NodeType WHERE (Name='".mysql_escape_string($rolename)."' AND UserID='".$USER->userid."')";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                $this->roleid = $array1['NodeTypeID'];
            }
        } else {
            return database_error("Role not found","7002");
        }
        $this->load();
        return $this;
    }

    /**
     * Add new role to the database
     * If the role already exists, then this will be returned instead
     *
     * @param string $rolename
     * @param string $image, optional parameter local path to an image file (uploaded onto server).
     * @return Role object (this) (or Error object)
     */
    function add($rolename, $image=null){
        global $DB,$CFG,$USER;

        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry1 = "select NodeTypeID from NodeType where (UserID='".$USER->userid."' and Name='".mysql_escape_string($rolename)."') ";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            $num_rows = mysql_num_rows($res1);
            if( $num_rows > 0 ) {
                 while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                    $this->roleid = $array1['NodeTypeID'];
                }
                return $this->load();
            } else {
                $this->roleid = getUniqueID();
                $dt = time();
                $qry2 = "insert into NodeType (NodeTypeID, UserID, CreationDate, Name, Image) values ('".$this->roleid."', '".$USER->userid."', ".$dt.", '".mysql_escape_string($rolename)."', '".mysql_escape_string($image)."')";
                $res2 = mysql_query( $qry2, $DB->conn);
                if ($res2) {
                    // add to group
                    $qry3 = "insert into NodeTypeGrouping (NodeTypeGroupID, NodeTypeID, UserID, CreationDate) values ('".$CFG->defaultRoleGroupID."', '".$this->roleid."', '".$USER->userid."', ".$dt.")";
                    $res3 = mysql_query( $qry3, $DB->conn);
                    if (!$res3) {
                        return database_error();
                    }
                } else {
                    return database_error();
                }
            }
        } else {
            return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Edit a role
     *
     * @param string $rolename
     * @param string $image, optional parameter local path to an image file (uploaded onto server).
     * @return Role object (this) (or Error object)
     */
    function edit($rolename, $image=null){
        global $DB,$USER;
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        $qry = "update NodeType set Name='".mysql_escape_string($rolename)."', Image='".mysql_escape_string($image)."' where NodeTypeID='".$this->roleid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
            return database_error();
        } else {
        	//remove old image if new image added
        	if ($image != $this->image &&
        			$this->image != null && $this->image !="" && substr($this->image,0,7) == 'uploads') {
        		unlink($CFG->dirAddress.$this->image);
        	}
        }
        $this->load();
        return $this;
    }

    /**
     * Delete this role
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

        $qry = "select * from Triple where (FromContextTypeID='".$this->roleid."' or ToContextTypeID='".$this->roleid."') and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        $defRoleID = $this->getDefaultRoleID();
        if ($res) {
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $fromContextType = $array['FromContextTypeID'];
                $toContextType = $array['ToContextTypeID'];
                if ($fromContextType == $this->roleid) {
                    $fromContextType = $defRoleID;
                }
                if ($toContextType == $this->roleid) {
                    $toContextType = $defRoleID;
                }

                $c = new Connection($array['TripleID']);
                $c->load();
                if (!auditConnection($USER->userid, $array['TripleID'], $array['Label'], $array['FromID'], $array['ToID'], $array['LinkTypeID'], $fromContextType,  $toContextType, $CFG->actionEdit, format_object('xml',$c))) {
                    return database_error();
                }
            }

            $qry1 = "update Triple set FromContextTypeID='".$defRoleID."' where FromContextTypeID='".$this->roleid."' and UserID='".$USER->userid."'";
            $qry2 = "update Triple set ToContextTypeID='".$defRoleID."' where ToContextTypeID='".$this->roleid."' and UserID='".$USER->userid."'";
            $res1 = mysql_query( $qry1, $DB->conn);
            $res2 = mysql_query( $qry2, $DB->conn);

            if ($res1 && $res2) {
                $qry1 = "delete from NodeType where UserID='".$USER->userid."' and NodeTypeID='".$this->roleid."'";
                $res1 = mysql_query( $qry1, $DB->conn);
                if (!$res1) {
                    return database_error();
                } else {
                	//delete any associated user assigned icon
                	if ($this->image != null && $this->image !="" && substr($this->image,0,7) == 'uploads') {
                		unlink($CFG->dirAddress.$this->image);
                	}
                }
            } else {
                return database_error();
            }
        } else {
            return database_error();
        }

        return new Result("deleted","true");
    }

    /**
     * Sets up the default roles for the given user
     *
     * @param string $userid
     * @return Result object (or Error object)
     */
    function setUpDefaultRoles($userid){
        global $CFG,$DB;

  		//really need to change the way the unique identifier is created.
		//have increased to 15, but really can't go any bigger or ID is in danger of exceeding limit of 50 chars.
        $sql = "INSERT INTO NodeType (NodeTypeID,UserID,Name,CreationDate,Image)
                SELECT concat(left(nt.Name,15),'".$userid."'), '".$userid."', nt.Name, UNIX_TIMESTAMP(), nt.Image FROM NodeType nt
                WHERE nt.UserID='".$CFG->defaultUserID."'" ;
        $res = mysql_query( $sql, $DB->conn);
        if (!$res){
             return database_error();
        } else {
            //add the default groupings for these
            $sql = "INSERT INTO  NodeTypeGrouping (NodeTypeGroupID, NodeTypeID,UserID,CreationDate)
                    SELECT '".$CFG->defaultRoleGroupID."', NodeTypeID, UserID, UNIX_TIMESTAMP() FROM NodeType
                    WHERE NodeType.NodeTypeID NOT IN (SELECT NodeTypeID FROM NodeTypeGrouping)";
            $res2 = mysql_query( $sql, $DB->conn);
            if (!$res){
                return database_error();
            }
        }
        return new Result("created default roles","true");
    }

    /**
     * Gets the default RoleID for the current user
     *
     * @return String
     */
    function getDefaultRoleID(){
        global $CFG,$USER,$DB;
        // get the id of 'Idea'
        $qry = "SELECT NodeTypeID FROM NodeType WHERE UserID='".$USER->userid."' AND Name='".$CFG->DEFAULT_NODE_TYPE."'";
        $res = mysql_query( $qry, $DB->conn);
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            return $array['NodeTypeID'];
        }
        // if there are no roles at all then add one for for the default node type
        $nr = new Role();
        $nr->add($CFG->DEFAULT_NODE_TYPE);
        return $nr->roleid;
    }

    /////////////////////////////////////////////////////
    // security functions
    // No canview() function as any user can view any role (is this right?!)
    /////////////////////////////////////////////////////

    /**
     * Check whether the current user can add a role
     *
     * @throws Exception
     */
    function canadd(){
        // needs to be logged in - that's all!
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can edit the current role
     *
     * @throws Exception
     */
    function canedit(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the node
        $sql = "SELECT t.NodeTypeID FROM NodeType t WHERE t.UserID = '".$USER->userid."' AND t.NodeTypeID='".$this->roleid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can delete the current role
     *
     * @throws Exception
     */
    function candelete(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the node
        $sql = "SELECT t.NodeTypeID FROM NodeType t WHERE t.UserID = '".$USER->userid."' AND t.NodeTypeID='".$this->roleid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }
}
?>