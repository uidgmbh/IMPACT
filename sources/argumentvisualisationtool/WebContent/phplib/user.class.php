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

class user {

    private $phpsessid;
    public $userid;
    public $name;
    public $photo;
    public $thumb;
    public $lastlogin;
    public $lastactive;
    public $status = 0;

    //public $description;
    //public $creationdate;
    //public $modificationdate;
    //public $privatedata;
    //public $website;
    //public $location;
    //public $countrycode;
    //public $country;
    //public $locationlat;
    //public $locationlng;
    //public $sociallearnid;
    //public twitterid;
    //public $tags;
    public $isgroup;
    private $authtype;
    private $isadmin;
    private $openidurl;
    private $password;
    private $email;

    /**
     * Constructor
     *
     * @param string $userid (optional)
     */
    public function __construct($userid = "") {
      if ($userid != "") {
        $this->userid = $userid;
      }
    }

    /**
     * Loads the data for the user from the database
     * This will not return a "group" (even though groups are
     * stored in the Users table)
     *
     * @param String $style (optional - default 'long') may be 'short' or 'long'
     * @return User object (this) (or Error object)
     */
    function load($style='long'){
        global $DB,$CFG;

        $sql = "SELECT * FROM Users
                WHERE UserID='".$this->userid."'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res)==0){
             return database_error("User not found:".$this->userid,"7002");
        }

        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $this->name = stripslashes($array['Name']);
            $this->isgroup = $array['IsGroup'];

            if($array['Photo']){
            	//set user photo and thumb the thumb creation is done during registration
                $originalphotopath = $CFG->dirAddress."uploads/".$this->userid."/".stripslashes($array['Photo']);
                if (file_exists($originalphotopath)) {
                	$this->photo =  $CFG->homeAddress."uploads/".$this->userid."/".stripslashes($array['Photo']);
                	$this->thumb =  $CFG->homeAddress."uploads/".$this->userid."/".str_replace('.','_thumb.', stripslashes($array['Photo']));
                	if (!file_exists($this->thumb)) {
                       	create_image_thumb($array['Photo'], $CFG->IMAGE_THUMB_WIDTH, $this->userid);
                	}
                } else {
					//if the file does not exists how to get it from a upper level? change it to
					//if file doesnot exists directly using default photo
                	if ($this->isgroup == "Y") {
                		$this->photo =  $CFG->homeAddress."uploads/".$CFG->DEFAULT_GROUP_PHOTO;
                		$this->thumb =  $CFG->homeAddress."uploads/".str_replace('.','_thumb.', stripslashes($CFG->DEFAULT_USER_PHOTO));
                	} else {
                		$this->photo =  $CFG->homeAddress."uploads/".$CFG->DEFAULT_USER_PHOTO;
                		$this->thumb =  $CFG->homeAddress."uploads/".str_replace('.','_thumb.', stripslashes($CFG->DEFAULT_USER_PHOTO));
                	}
				}
            } else {
            	if ($this->isgroup == "Y") {
            		$this->photo =  $CFG->homeAddress."uploads/".$CFG->DEFAULT_GROUP_PHOTO;
            		$this->thumb =  $CFG->homeAddress."uploads/".str_replace('.','_thumb.', stripslashes($CFG->DEFAULT_USER_PHOTO));
            	} else {
            		$this->photo =  $CFG->homeAddress."uploads/".$CFG->DEFAULT_USER_PHOTO;
            		$this->thumb =  $CFG->homeAddress."uploads/".str_replace('.','_thumb.', stripslashes($CFG->DEFAULT_USER_PHOTO));
            	}
            }
            $this->lastlogin = $array['LastLogin'];
            $this->lastactive = $array['LastActive'];

            if ($array['CurrentStatus']) {
            	$this->status = $array['CurrentStatus'];
            }

            if($style=='long'){
                $this->description = stripslashes($array['Description']);
                $this->creationdate = $array['CreationDate'];
                $this->modificationdate = $array['ModificationDate'];
                $this->privatedata = $array['Private'];
                $this->openidurl = $array['OpenIDURL'];
                $this->isadmin = $array['IsAdministrator'];
                $this->authtype = $array['AuthType'];
                $this->password = $array['Password'];
                $this->website = $array['Website'];
                $this->email = $array['Email'];
                $this->sociallearnid = $array['SocialLearnID'];

                if($array['LocationText']){
                    $this->location = $array['LocationText'];
                } else {
                	$this->location = "";
                }
                if($array['LocationCountry']){
                    $cs = getCountryList();
                    $this->countrycode = $array['LocationCountry'];
                    $this->country = $cs[$array['LocationCountry']];
                } else {
                	$this->countrycode = "";
                }

                if($array['LocationLat']){
                    $this->locationlat = $array['LocationLat'];
                }
                if($array['LocationLng']){
                    $this->locationlng = $array['LocationLng'];
                }

                //now add in any tags
                $sql = "SELECT u.TagID FROM TagUsers ut INNER JOIN Tag u ON u.TagID = ut.TagID WHERE ut.UserID='".$this->userid."' ORDER BY Name ASC";
                $res = mysql_query($sql, $DB->conn);
                if(mysql_num_rows($res) > 0){
                    $this->tags = array();
                    while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                        $tag = new Tag(trim($array['TagID']));
                        array_push($this->tags,$tag->load());
                    }
                }
            }
        }
        return $this;

    }

    /**
     * Check whether supplied password matches that in database
     *
     * @param string $password
     * @return boolean
     */
    function validPassword($password){
        global $CFG;
        // can only validate password against cohere auth type users
        if ($this->authtype == $CFG->AUTH_TYPE_COHERE){
            if(crypt( $password, $this->password ) == $this->password ){
               return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Load user based on their email address
     *
     * @return User object (this) (or Error object)
     */
    function getByEmail(){
        global $DB,$CFG;
        $sql = "SELECT UserID FROM Users WHERE Email = '" . $this->email . "' AND AuthType != '".$CFG->AUTH_TYPE_OPENID."'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res)==0){
             return database_error("User not found","7002");
        }
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $this->userid =  trim($array['UserID']);
        }

        return $this->load();
    }

    /**
     * Load user based on their OpenIDURL
     *
     * @return User object (this) (or Error object)
     */
    function getByOpenIDURL(){
        global $DB,$CFG;
        $sql = "SELECT UserID FROM Users WHERE OpenIDURL = '" . $this->openidurl . "' AND AuthType = '".$CFG->AUTH_TYPE_OPENID."'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res)==0){
             return database_error("User not found","7002");
        }
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $this->userid =  trim($array['UserID']);
        }
        $this->load();
        return $this;
    }

    /**
     * Add new users to database
     *
     * @param string $email
     * @param string $name
     * @param string $password
     * @param string $website
     * @param string $isgroup 'Y'/'N'
     * @param string $authtype
     * @param string $openidurl (optional)
     * @return User object (this) (or Error object)
     */
    function add($email,$name,$password,$website,$isgroup="N",$authtype,$openidurl="",$description="",$photo=""){
        global $DB,$CFG;
        $dt = time();

        //not sure why it is coming through with no authtype
        //temporary patch.
        if ($authtype == '') {
        	$authtype=$CFG->AUTH_TYPE_COHERE;
        }

        $this->userid = getUniqueID();
        if ($photo == ""){
            //set to the default one
            $photo = $CFG->DEFAULT_USER_PHOTO;
        }
        $qry = "INSERT INTO Users (
                    UserID,
                    CreationDate,
                    ModificationDate,
                    Email,
                    Name,
                    Password,
                    Website,
                    Private,
                    LastLogin,
                    IsAdministrator,
                    IsGroup,
                    AuthType,
                    OpenIDURL,
                    Description,
                    Photo )
                VALUES (
                    '".$this->userid."',
                    ".$dt.",
                    ".$dt.",
                    '".mysql_real_escape_string($email, $DB->conn)."',
                    '" . mysql_real_escape_string($name, $DB->conn)."',
                    '".mysql_real_escape_string(crypt($password), $DB->conn)."',
                    '".mysql_real_escape_string($website, $DB->conn)."',
                    'N',
                    ". $dt .",
                    'N',
                    '".$isgroup."',
                    '".$authtype."',
                    '".$openidurl."',
                    '".mysql_real_escape_string($description, $DB->conn)."',
                    '".mysql_real_escape_string($photo, $DB->conn)."')";
        //accommodate group as a user, add user from group this will have value Y


         $res = mysql_query( $qry, $DB->conn );
         if( !$res ) {
            return database_error();
         } else {
            $this->load();
            return $this;
         }
    }

    /**
     * Update a users name
     *
     * @param string $name
     * @return User object (this) (or Error object)
     */
    function updateName($name){
        global $DB;
        $qry = "UPDATE Users SET Name='". mysql_real_escape_string($name, $DB->conn)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
         if( !$res ) {
            return database_error();
         } else {
            $this->load();
            return $this;
         }
    }

    /**
     *  Update a users desctiption
     *
     * @param string $description
     * @return User object (this) (or Error object)
     */
    function updateDescription($desc){
        global $DB;
        $qry = "UPDATE Users SET Description='". mysql_real_escape_string($desc, $DB->conn)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
         if( !$res ) {
            return database_error();
         } else {
            $this->load();
            return $this;
         }
    }

    /**
     *  Update a users website
     *
     * @param string $website
     * @return User object (this) (or Error object)
     */
    function updateWebsite($website){
        global $DB;
        $qry = "UPDATE Users SET Website='". mysql_escape_string($website)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
         if( !$res ) {
            return database_error();
         } else {
            $this->load();
            return $this;
         }
    }

    /**
     *  Update a users public/private setting
     *
     * @param string $private
     * @return User object (this) (or Error object)
     */
    function updatePrivate($private){
        global $DB;
        $qry = "UPDATE Users SET Private='". mysql_escape_string($private)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
         if( !$res ) {
            return database_error();
         } else {
            $this->load();
            return $this;
         }
    }

    /**
     *  Update a users photo
     *
     * @param string $photo
     * @return User object (this) (or Error object)
     */
    function updatePhoto($photo){
        global $DB;
        $qry = "UPDATE Users SET Photo='". mysql_real_escape_string($photo, $DB->conn)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
         if( !$res ) {
            return database_error();
         } else {
            $this->load();
            return $this;
         }
    }
    /**
     * Update a users email
     *
     * @param string $email
     * @return boolean
     */
    function updateEmail($email){
        global $DB;

        //can only update email address if it's not already in use
        $qry = "SELECT UserID FROM Users WHERE Email ='".$email."' AND UserID != '".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
        if (mysql_num_rows($res)!=0){
            return false;
        }
        $qry = "UPDATE Users SET Email='". mysql_real_escape_string($email, $DB->conn)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
         if( !$res ) {
            return false;
         } else {
            $this->load();
            return true;
         }
    }

    /**
     * Update a users password
     *
     * @param string $password
     * @return boolean
     */
    function updatePassword($password){
        global $DB;
        $qry = "UPDATE Users SET Password='". mysql_real_escape_string(crypt($password), $DB->conn)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
         if( !$res ) {
            return database_error();
         } else {
            $this->load();
            return $this;
         }
    }

    /**
     * Update a users last login date/time
     *
     */
    function updateLastLogin(){
        global $DB;
        $dt = time();
        $qry = "UPDATE Users SET LastLogin = " . $dt . " WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
        if( !$res ) {
            return;
        } else {
            $this->lastlogin = $dt;
            $this->updateLastActive($dt);
            return;
        }
    }

   /**
     * Update the time the user last did something to now (was active)
     *
     */
    function updateLastActive($time){
        global $DB;
        $qry = "UPDATE Users SET LastActive = " . $time . " WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
        if( !$res ) {
            return;
        } else {
            $this->lastactive = $time;
            return;
        }
    }

    /**
     * Update the location for this user
     *
     * @return User object (this) (or Error object)
     */
    function updateLocation($location="",$loccountry=""){
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


    /**
     * Send Invitation to join cohere and group
     *
     */
    function sendGroupInvitation($group){
        global $CFG,$USER;

        $group  = getGroup($group);
        if ($group->photo != ""){
            $temp_image = "<img src='".$group->photo."' alt='logo for ".$group->name."'/><br/>";
        } else {
            $temp_image = "";
        }
        if ($group->description != ""){
            $temp_desc = "<p>".$group->description."</p>";
        } else {
            $temp_desc = "";
        }
        $paramArray = array ($CFG->homeAddress,
                            $USER->name,
                            $temp_image,
                            $CFG->homeAddress."group.php?groupid=".$group->groupid,
                            $group->name,
                            $temp_desc,
                            $CFG->homeAddress."invite.php?userid=".$this->userid."&code=".$this->getInvitationCode(),
                            $USER->getEmail(),
                            $USER->name);
        sendMail("invitetogroup","Invitation to join Cohere",$this->email,$paramArray);
    }

    /**
     * get users invitation code
     *
     */
    function getInvitationCode(){
        global $DB;
        $qry = "SELECT InvitationCode FROM Users WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );

        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            return $array['InvitationCode'];
        }
        return "";
    }

    /**
     * Set users invitation code
     *
     */
    function setInvitationCode(){
        global $DB;
        $code = getUniqueID();
        $qry = "UPDATE Users SET InvitationCode = '" . $code . "' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
        if( !$res ) {
            return "";
        } else {
            return $code;
        }
    }

    /**
     * Reset users invitation code (so once it;s been used it can't be reused)
     *
     */
    function resetInvitationCode(){
        global $DB;

        $qry = "UPDATE Users SET InvitationCode = '' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
        if( !$res ) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Validate users invitation code
     *
     */
    function validateInvitationCode($code){
        global $DB;

        $qry = "SELECT UserID FROM Users WHERE InvitationCode = '".$code."' AND UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
        if( !$res ) {
            return false;
        } else {
            if(mysql_num_rows($res)==0){
                return false;
            } else {
                return true;
            }
        }
    }
    /////////////////////////////////////////////////////
    // getter/setter functions
    // the reason for having these is that the variables are private
    // as we don't want these vars to appear in the REST API output
    // but do need way of setting/getting these variables in other parts
    // of the code
    /////////////////////////////////////////////////////

    /**
     * get PHPSessionID
     *
     * @return string
     */
    function getPHPSessID(){
        return $this->phpsessid;
    }

    /**
     * set PHPSessionID
     *
     * @param string
     */
    function setPHPSessID($phpsessid){
        $this->phpsessid = $phpsessid;
    }

    /**
     * Set email address
     *
     * @param string $email
     */
    function setEmail($email){
        $this->email = $email;
    }

    /**
     * get email address
     *
     * @return string
     */
    function getEmail(){
        return $this->email;
    }

    /**
     * Set OpenIDURL
     *
     * @param string $openidurl
     */
    function setOpenIDURL($openidurl){
        $this->openidurl = $openidurl;
    }

    /**
     * get OpenIDURL
     *
     * @return string
     */
    function getOpenIDURL(){
        return $this->openidurl;
    }

    /**
     * Set AuthType
     *
     * @param string $authtype
     */
    function setAuthType($authtype){
        $this->authtype = $authtype;
    }

    /**
     * get AuthType
     *
     * @return string
     */
    function getAuthType(){
        return $this->authtype;
    }

    /**
     * Set isAdmin
     *
     * @param string $isadmin
     */
    function setIsAdmin($isadmin){
        $this->isadmin = $isadmin;
    }

    /**
     * get isAdmin
     *
     * @return string
     */
    function getIsAdmin(){
        return $this->isadmin;
    }

    /**
     * Update a users Twitter key and secret
     *
     * @param string $twitterkey
     * @param string $twittersecret
     * @return User object (this) (or Error object)
     */
    function updateTwitterAccount($twitterkey,$twittersecret) {
        global $DB;
        $qry = "UPDATE Users SET TwitterID=AES_ENCRYPT('".$twitterkey."', UserID) WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
        if( !$res ) {
           return database_error();
        }
        if($twittersecret != ''){
            $qry = "UPDATE Users SET TwitterPassword=AES_ENCRYPT('".$twittersecret."', UserID) WHERE UserID='".$this->userid."'";
            $res = mysql_query( $qry, $DB->conn );
            if( !$res ) {
               return database_error();
            }
        }
        $this->load();
        return $this;

    }

    /**
     * get Twitter password
     *
     * @return string
     */
    function getTwitterKey(){
        global $DB;
        $qry = "SELECT CONVERT(AES_DECRYPT(TwitterID, UserID) USING latin1) as twitterkey FROM Users WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );

        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            return $array['twitterkey'];
        }
        return "";
    }

    /**
     * get Twitter password
     *
     * @return string
     */
    function getTwitterSecret(){
        global $DB;
        $qry = "SELECT CONVERT(AES_DECRYPT(TwitterPassword, UserID) USING latin1) as twittersecret FROM Users WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );

        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            return $array['twittersecret'];
        }
        return "";
    }

    /**
     * Update a users SocialLearn ID and password
     *
     * @param string $slid
     * @param string $slpassword
     * @return User object (this) (or Error object)
     */
    function updateSocialLearn($slid,$slpassword){
        global $DB;
        $qry = "UPDATE Users SET SocialLearnID='". mysql_real_escape_string($slid, $DB->conn)."' WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );
        if( !$res ) {
           return database_error();
        }

        if($slpassword != ''){
            $qry = "UPDATE Users SET SocialLearnPassword=AES_ENCRYPT('".$slpassword."',UserID) WHERE UserID='".$this->userid."'";
            $res = mysql_query( $qry, $DB->conn );
            if( !$res ) {
               return database_error();
            }
        }
        $this->load();
        return $this;

    }

    /**
     * get SocialLearn password
     *
     * @return string
     */
    function getSocialLearnPassword(){
        global $DB;
        if($this->sociallearnid == ""){
            return "";
        }
        $qry = "SELECT CONVERT(AES_DECRYPT(SocialLearnPassword, UserID) USING latin1) as slpassword FROM Users WHERE UserID='".$this->userid."'";
        $res = mysql_query( $qry, $DB->conn );

        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            return $array['slpassword'];
        }
        return "";
    }

    /**
     * Add a Tag to this url
     *
     * @param string $tagid
     * @return URL object (this) (or Error object)
     */
    function addTag($tagid){
        global $DB,$CFG,$USER;

        //check user can edit the Tag
        $tag = new Tag($tagid);
        $tag->load();
        $tag->canedit();

        $dt = time();

        $qry4 = "select TagID from TagUsers where TagID='".$tagid."' and UserID='".$this->userid."'";
        $res4 = mysql_query( $qry4, $DB->conn);
        if ($res4) {
            $num_rows = mysql_num_rows($res4);
            if( $num_rows == 0 ) {
                $qry5 = "insert into TagUsers (UserID, TagID) values ('".$this->userid."', '".$tagid."')";
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
     * Remove a Tag from this user
     *
     * @param string $urlid
     * @return User object (this) (or Error object)
     */
    function removeTag($tagid){
        global $DB,$CFG,$USER;

        //check user can edit the Tag
        $tag = new Tag($tagid);
        $tag->load();
        $tag->canedit();

        $dt = time();

        $qry = "DELETE FROM TagUsers WHERE UserID='".$this->userid."' and TagID='".$tagid."'";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
            return database_error();
        }
        $this->load();
        return $this;
    }

	/**
	 * Update the status for this url
	 *
	 * @return User object (this) (or Error object)
	 */
	function updateStatus($status){
	    global $DB,$CFG,$USER;

	    $dt = time();
	    $sql = "UPDATE Users SET CurrentStatus=".$status.", ModificationDate=".$dt." WHERE UserID='".$this->userid."'";
	    $res = mysql_query( $sql, $DB->conn );
		if (!$res) {
			return database_error();
		}

	    $this->load();
	    return $this;
	}

  /**
   * Retrieve user-defined link-types
   * @returns LinkTypeSet
   */
  public function getLinkTypes() {
    $link_types = new LinkTypeSet();
    return $link_types->loadByUser($this->userid);
  }

  /**
   * Retrieve user-defined node-types
   * @returns NodeTypeSet
   */
  public function getNodeTypes() {
    $node_types = new NodeTypeSet();
    return $node_types->loadByUser($this->userid);
  }
}

?>