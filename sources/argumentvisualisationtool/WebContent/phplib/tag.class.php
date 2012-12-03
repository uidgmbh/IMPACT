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
// Tag Class
///////////////////////////////////////

class Tag {
    public $tagid;
    public $name;
    public $userid;

    //public $groupid;

    /**
     * Constructor
     *
     * @param string $tageid (optional)
     * @return Tag (this)
     */
    function Tag($tagid = ""){
        if ($tagid != ""){
            $this->tagid= $tagid;
            return $this;
        }
    }

    /**
     * Loads the data for the tag from the database
     *
     * @return Tag object (this)
     */
    function load(){
        global $DB,$CFG;
        $qry1 = "SELECT Tag.UserID, Tag.Name FROM Tag
                WHERE Tag.TagID='".$this->tagid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            if(mysql_num_rows($res1)==0){
                return database_error("Tag not found","7002");
            }
            $groupid = "";
            while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                $this->name = stripslashes($array1['Name']);
                $this->userid = $array1['UserID'];
            }
        } else {
            return database_error();
        }
        return $this;
    }

    /**
     * Loads the data for the tag from the database based on tag name
     *
     * @return Tag object (this)
     */
    function loadByName($tagname){
        global $DB,$CFG,$USER;
        $qry1 = "SELECT TagID FROM Tag WHERE (Name='".mysql_escape_string($tagname)."' AND UserID='".$USER->userid."')";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                $this->tagid = $array1['TagID'];
            }
        } else {
            return database_error("Tag not found","7002");
        }
        $this->load();
        return $this;
    }

    /**
     * Add new tag to the database
     * If the tag already exists, then this will be returned instead
     *
     * @param string $tagname
     * @returnTag object (this) (or Error object)
     */
    function add($tagname){
        global $DB,$CFG,$USER;

        $tagname = trim($tagname);
        if ($tagname == "") {
        	return;
        }

        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry1 = "select TagID from Tag where (UserID='".$USER->userid."' and Name='".mysql_escape_string($tagname)."') ";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            $num_rows = mysql_num_rows($res1);
            if( $num_rows > 0 ) {
                 while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                    $this->tagid = $array1['TagID'];
                }
                return $this->load();
            } else {
                $this->tagid = getUniqueID();
                $dt = time();
                $qry2 = "insert into Tag (TagID, UserID, CreationDate, Name) values ('".$this->tagid."', '".$USER->userid."', ".$dt.", '".mysql_escape_string($tagname)."')";
                $res2 = mysql_query( $qry2, $DB->conn);
                if (!$res2) {
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
     * Edit a tag
     *
     * @param string $tagname
     * @return Tag object (this) (or Error object)
     */
    function edit($tagname){
        global $DB,$USER;
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }

        $qry1 = "select TagID from Tag where (UserID='".$USER->userid."' and Name='".mysql_escape_string($tagname)."') ";
        $res1 = mysql_query( $qry1, $DB->conn);
        if ($res1) {
            $num_rows = mysql_num_rows($res1);
            if( $num_rows > 0 ) {
            	return database_error("Tag already exists","7012");
            } else {
		        $qry = "update Tag set Name='".mysql_escape_string($tagname)."' where TagID='".$this->tagid."' and UserID='".$USER->userid."'";
		        $res = mysql_query( $qry, $DB->conn);
		        if (!$res) {
		            return database_error();
		        }
            }
        }
        $this->load();
        return $this;
    }

    /**
     * Delete this tag
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

        $qry1 = "delete from Tag where UserID='".$USER->userid."' and TagID='".$this->tagid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        if (!$res1) {
            return database_error();
        }

        return new Result("deleted","true");
    }

    /////////////////////////////////////////////////////
    // security functions
    // No canview() function as any user can view any tag (is this right?!)
    /////////////////////////////////////////////////////

    /**
     * Check whether the current user can add a tag
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
     * Check whether the current user can edit the current tag
     *
     * @throws Exception
     */
    function canedit(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the tag
        $sql = "SELECT t.TagID FROM Tag t WHERE t.UserID = '".$USER->userid."' AND t.TagID='".$this->tagid."'";

        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );

        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can delete the current tag
     *
     * @throws Exception
     */
    function candelete(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the tag
        $sql = "SELECT t.TagID FROM Tag t WHERE t.UserID = '".$USER->userid."' AND t.tagID='".$this->tagid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }
}
?>