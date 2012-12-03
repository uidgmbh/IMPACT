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
// UsersCache Class
// Stores the users bookmarked ideas
///////////////////////////////////////

class UsersCache {

    public $ideas;

    function UsersCache(){
        return $this->load();
    }

    function load(){
        global $DB,$USER;
        $loggedin = api_check_login();
        if($loggedin instanceof Error){
            return $loggedin;
        }
        $qry = "SELECT * FROM UsersCache WHERE UserID='".$USER->userid."' ORDER BY CreationDate DESC";
        $res = mysql_query( $qry, $DB->conn);
        if(!$res){
            return database_error();
        } else {
             $this->ideas = array();
             while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                  $uci = new UserCachedIdea();
                  $uci->idea = $array['NodeID'];
                  $uci->date = $array['CreationDate'];
                  array_push($this->ideas,$uci);
             }
        }
        return $this;
    }

    function add($nodeid){
        global $DB,$USER;
        $loggedin = api_check_login();
        if($loggedin instanceof Error){
            return $loggedin;
        }

        if(trim($nodeid)==""){
            $ERROR = new error;
            $ERROR->message = "The idea id cannot be blank.";
            $ERROR->code = "1004";
            return $ERROR;
        }

        $qry = "SELECT UsersCacheID FROM UsersCache WHERE UserID='".$USER->userid."' AND NodeID='".$nodeid."'";
        $res = mysql_query( $qry, $DB->conn);
        if(mysql_num_rows($res)==0){
	        $dt = time();
	        $qry = "INSERT INTO UsersCache (UserID, NodeID, CreationDate ) values ('".$USER->userid."', '".mysql_escape_string(trim($nodeid))."',".$dt.")";
	        $res = mysql_query( $qry, $DB->conn);
	        if(!$res){
	            return database_error();
	        }
        } else {
	        $dt = time();
	        $qry = "UPDATE UsersCache SET CreationDate=".$dt." WHERE UserID='".$USER->userid."' AND NodeID='".$nodeid."'";
	        $res = mysql_query( $qry, $DB->conn);
	        if(!$res){
	            return database_error();
	        }
        }
        $this->load();
        return $this;
    }

    function delete($nodeid){
        global $DB,$USER;
        $loggedin = api_check_login();
        if($loggedin instanceof Error){
            return $loggedin;
        }

        $qry = "DELETE FROM UsersCache WHERE UserID='".$USER->userid."' AND NodeID='".$nodeid."'";
        $res = mysql_query( $qry, $DB->conn);
        if(!$res){
            return database_error();
        }
        $this->load();
        return $this;
    }

    function clear(){
        global $DB,$USER;
        $loggedin = api_check_login();
        if($loggedin instanceof Error){
            return $loggedin;
        }

        $qry = "DELETE FROM UsersCache WHERE UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if(!$res){
            return database_error();
        }
        $this->load();
        return $this;
    }

}

class UserCachedIdea {

    public $idea;
    public $date;
}
?>