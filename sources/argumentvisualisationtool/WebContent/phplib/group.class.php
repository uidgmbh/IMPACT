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
// Group Class
///////////////////////////////////////

class Group {

    public $groupid;
    public $name;
    public $description;
    public $website;
    public $photo;
    public $thumb;

    //public $location;
    //public $countrycode;
    //public $country;
    //public $locationlat;
    //public $locationlng;

    /**
     * Constructor
     *
     * @param string $groupid (optional)
     * @return Group (this)
     */
    function Group($groupid = ""){
        if ($groupid != ""){
            $this->groupid = $groupid;
            return $this;
        }
    }

    /**
     * Loads the data for the group from the database
     *
     * @return Group object (this)
     */
    function load(){
        global $DB,$CFG;
        $qry = "SELECT * FROM Users
                WHERE Userid ='".$this->groupid."'";
        $res = mysql_query( $qry, $DB->conn);

        if ($res) {
            if(mysql_num_rows($res)==0){
                return database_error("Group not found","7002");
            }
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $this->name = stripslashes($array['Name']);
                $this->description = stripslashes($array['Description']);
                $this->website = stripslashes($array['Website']);
	            if($array['Photo']){

	            	//set user photo and thumb the thumb creation is done during registration
	                $originalphotopath = $CFG->dirAddress."uploads/".$this->groupid."/".stripslashes($array['Photo']);
	                if (file_exists($originalphotopath)) {
	                	$this->photo =  $CFG->homeAddress."uploads/".$this->groupid."/".stripslashes($array['Photo']);
	                	$this->thumb =  $CFG->homeAddress."uploads/".$this->groupid."/".str_replace('.','_thumb.', stripslashes($array['Photo']));

	                } else {
						//if the file does not exists how to get it from a upper level? change it to
						//if file doesnot exists directly using default photo
						$this->photo =  $CFG->homeAddress."uploads/".$CFG->DEFAULT_GROUP_PHOTO;
						$this->thumb =  $CFG->homeAddress."uploads/".str_replace('.','_thumb.', stripslashes($CFG->DEFAULT_GROUP_PHOTO));
					}
	            } else {
	                $this->photo =  $CFG->homeAddress."uploads/".$CFG->DEFAULT_GROUP_PHOTO;
	                $this->thumb =  $CFG->homeAddress."uploads/".str_replace('.','_thumb.', stripslashes($CFG->DEFAULT_GROUP_PHOTO));
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
            }
        } else {
            return database_error();
        }
        //echo $this->photo;
        //exit();
        return $this;
    }

    /**
     * Loads the members of the group from the database
     *
     * @return Group object (this)
     */
    function loadmembers(){
        global $DB,$CFG;
        $qry = "SELECT u.UserID FROM Users u
                INNER JOIN UserGroup ug ON ug.UserID = u.UserID
                WHERE ug.GroupID='".$this->groupid."'";

        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            $us = new UserSet();
            $us->totalno = mysql_num_rows($res);
             while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $u = new User($array['UserID']);
                $us->add($u->load());
             }
             $this->members = $us;
        } else {
            return database_error();
        }
        return $this;
    }

    /**
     * Checks whether the given user is a member of this group
     *
     * @param string $userid
     * @return boolean
     */
    function ismember($userid){
        global $DB;
        $qry = "SELECT ug.UserID FROM UserGroup ug
                WHERE ug.GroupID='".$this->groupid."'
                AND ug.UserID='".$userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
             while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                return true;
             }
             return false;
        } else {
            return false;
        }
    }

    function groupNameExists($groupname,$groupid = ""){
        global $DB;
        $sql = "SELECT u.UserID FROM Users u
                INNER JOIN UserGroup ug ON ug.GroupID = u.UserID
                WHERE u.Name = '".mysql_real_escape_string($groupname, $DB->conn)."'";
        if ($groupid != ""){
            $sql .= " AND u.UserID != '".$groupid."'";
        }
        $res = mysql_query( $sql, $DB->conn );
        if(mysql_num_rows($res) != 0){
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "A group with this name already exists.";
            $ERROR->code = "7003";
            return $ERROR;
        } else {
            return false;
        }
    }


    /**
     * Adds a new group
     *
     * @param string $groupname
     * @return Group object (this)
     */
    function add($groupname){
        global $DB,$CFG,$USER;
        //check user can add a group
        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }

        //check group name doesn't already exist
        $ge = $this->groupNameExists($groupname);
        if($ge instanceof Error){
            return $ge;
        }

        // add the 'user' (group)
        $user = new User();
        $password = crypt(getUniqueID()); //dummy (non-blank) password
        $isGroup = 'Y';
        $user->add("",$groupname,$password,"",$isGroup, $CFG->AUTH_TYPE_COHERE,"","","");

        $dt = time();
        //now add the user who created the group as an admin
        $sql = "INSERT INTO UserGroup (
                    GroupID,
                    UserID,
                    CreationDate,
                    IsAdmin
                    ) VALUES (
                    '".$user->userid."',
                    '".$USER->userid."',
                    ".$dt.",
                    'Y'
                    )";
         $res = mysql_query( $sql, $DB->conn );
         if( !$res ) {
            return database_error();
         } else {
            $this->groupid = $user->userid;
            $this->load();
            $this->loadmembers();
            return $this;
         }
    }

    /**
     * Deletes a group
     *
     * @return Result object
     */
    function delete(){
        global $DB,$CFG,$USER;
        //check user can delete a group
        if(!$this->candelete()){
            return access_denied_error();
        }
        // delete the NodeGroup records
        $sql = "DELETE FROM NodeGroup WHERE GroupID='".$this->groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(!$res){
            return database_error();
        }

        // delete the TripleGroup records
        $sql = "DELETE FROM TripleGroup WHERE GroupID='".$this->groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(!$res){
            return database_error();
        }

        // delete the UserGroup records
        $sql = "DELETE FROM UserGroup WHERE GroupID='".$this->groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(!$res){
            return database_error();
        }

        // delete the User record
        $sql = "DELETE FROM Users WHERE UserID='".$this->groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(!$res){
            return database_error();
        }
        return new Result("deleted","true");
    }

    /**
     * Adds a member to the group
     *
     * @param string $userid
     * @return Group object (this)
     */
    function addmember($userid){
        global $DB,$CFG,$USER;
        //check user can add to the group
        if(!$this->isgroupadmin($USER->userid)){
            return access_denied_error();
        }

        // check user exists
        $user = new User($userid);
        if($user->load() instanceof Error){
             return database_error("User not found:".$userid,"7002");
        }

        // check user isn't already in group
        $sql = "SELECT * FROM UserGroup WHERE UserID='".$userid."' AND GroupID='".$this->groupid."'";
        $res = mysql_query( $sql, $DB->conn );

        if(mysql_num_rows($res) == 0){
            $dt = time();
            // now add the user
            $sql = "INSERT INTO UserGroup (
                        GroupID,
                        UserID,
                        CreationDate,
                        IsAdmin
                        ) VALUES (
                        '".$this->groupid."',
                        '".$userid."',
                        ".$dt.",
                        'N'
                        )";
             $res = mysql_query( $sql, $DB->conn );
             if( !$res ) {
                return database_error();
             }
        }
        // send notification email
        // first check that their account is validated (ie there isn't an outstanding validation code)
        if($user->getInvitationCode() == ""){
            //send group member email
            if ($this->photo != ""){
                $temp_image = "<img src='".$this->photo."' alt='logo for ".$this->name."'/><br/>";
            } else {
                $temp_image = "";
            }
            if ($this->description != ""){
                $temp_desc = "<p>".$this->description."</p>";
            } else {
                $temp_desc = "";
            }
            $paramArray = array ($user->name,
                                    $USER->name,
                                    $temp_image,
                                    $CFG->homeAddress."group.php?groupid=".$this->groupid,
                                    $this->name,
                                    $temp_desc,
                                    $USER->getEmail(),
                                    $USER->name,
                                    $CFG->homeAddress."contact.php");
            sendMail("groupmember","New Cohere group: ".$this->name,$user->getEmail(),$paramArray);
        } else {
            //send invite
            $user->sendGroupInvitation($this->groupid);
        }


        $this->load();
        $this->loadmembers();
        return $this;
    }

    /**
     * Makes a member an admin of the group
     *
     * @param string $userid
     * @return Group object (this)
     */
    function makeadmin($userid){
        global $DB,$CFG,$USER;
        //check user can add to the group
        if(!$this->isgroupadmin($USER->userid)){
            return access_denied_error();
        }

        // check user exists
        $user = new User($userid);
        if($user->load() instanceof Error){
             return database_error("User not found:".$userid,"7002");
        }

        // now add the user
        $sql = "UPDATE UserGroup SET IsAdmin='Y' WHERE GroupID='".$this->groupid."' AND UserID ='".$userid."'";
        $res = mysql_query( $sql, $DB->conn );
        if( !$res ) {
            return database_error();
        }

        $this->load();
        $this->loadmembers();
        return $this;
    }

    /**
     * Remove a member as admin of the group
     * (they'll remain a group member though)
     *
     * @param string $userid
     * @return Group object (this)
     */
    function removeadmin($userid){
        global $DB,$CFG,$USER;
        //check user can add to the group
        if(!$this->isgroupadmin($USER->userid)){
            return access_denied_error();
        }

        // check user exists
        $user = new User($userid);
        if($user->load() instanceof Error){
             return database_error("User not found:".$userid,"7002");
        }

        // can only remove if there's at least one other admin left
        $sql = "SELECT GroupID FROM UserGroup WHERE IsAdmin='Y' AND GroupID='".$this->groupid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(mysql_num_rows($res) < 2){
            return database_error("Cannot remove user as admin as group will have no admins","7002");
        }

        // now add the user
        $sql = "UPDATE UserGroup SET IsAdmin='N' WHERE GroupID='".$this->groupid."' AND UserID ='".$userid."'";
        $res = mysql_query( $sql, $DB->conn );
        if( !$res ) {
            return database_error();
        }

        $this->load();
        $this->loadmembers();
        return $this;
    }

    /**
     * Remove a of the group
     *
     * @param string $userid
     * @return Group object (this)
     */
    function removemember($userid){
        global $DB,$CFG,$USER;
        //check user can add to the group
        if(!$this->isgroupadmin($USER->userid)){
            return access_denied_error();
        }

        // check user exists
        $user = new User($userid);
        if($user->load() instanceof Error){
             return database_error("User not found:".$userid,"7002");
        }

        // remove them as admin (if they are already)
        if(($this->removeadmin($userid) instanceof Error) && ($this->isgroupadmin($userid))){
            return database_error("Cannot remove user as admin as group will have no admins","7002");
        }

        // remove the user from the group
        $sql = "DELETE FROM UserGroup WHERE GroupID='".$this->groupid."' AND UserID ='".$userid."'";
        $res = mysql_query( $sql, $DB->conn );
        if( !$res ) {
            return database_error();
        }

        $this->load();
        $this->loadmembers();
        return $this;
    }

    /**
     * Update the location for this user group
     *
     * @return Group object (this) (or Error object)
     */
    function updateLocation($location,$loccountry){
        global $DB,$CFG,$USER;

        $sql = "UPDATE Users SET LocationText='".mysql_escape_string($location)."', LocationCountry='".mysql_escape_string($loccountry)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $sql, $DB->conn );

        //try to geocode
        if ($location != "" && $loccountry != "" && ($location != $this->location || $loccountry != $this->countrycode)){
            $coords = geoCode($location,$loccountry);
            if($coords["lat"] != "" && $coords["lng"] != ""){
                $sql = "UPDATE Users SET LocationLat='".$coords["lat"]."', LocationLng='".$coords["lng"]."' WHERE UserID='".$this->userid."'";
                $res = mysql_query( $sql, $DB->conn );
            } else {
                $sql = "UPDATE Users SET LocationLat=null, LocationLng=null WHERE UserID='".$this->userid."'";
                $res = mysql_query( $sql, $DB->conn );
            }
        }
        $this->load();
        return $this;
    }

    /////////////////////////////////////////////////////
    // security functions
    /////////////////////////////////////////////////////

    /**
     * Check whether the current user can add a group
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
     * Check whether the given user is an admin for this group
     *
     * @throws Exception
     */
    function isgroupadmin($userid){
        global $DB;
        if(api_check_login() instanceof Error){
            return false;
        }
        //can edit only if admin for the group
        $sql = "SELECT t.GroupID FROM UserGroup t WHERE t.GroupID='".$this->groupid."' AND t.UserID = '".$userid."' AND t.IsAdmin='Y'";
        $res = mysql_query( $sql, $DB->conn );
        if(mysql_num_rows($res) == 0){
            return false;
        } else {
            return true;
        }
    }

    /**
     * Check whether the current user can delete the group
     *
     * @throws Exception
     */
    function candelete(){
        global $USER;
        // needs to be an admin
        return $this->isgroupadmin($USER->userid);
    }
}
?>