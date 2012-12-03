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

class LinkType {

    public $linktypeid;
    public $label;
    public $userid;
    public $groupid;
    public $grouplabel;

    /**
     * Constructor
     *
     * @param string $linktypeid (optional)
     */
    public function __construct($linktypeid = "") {
      if ($linktypeid !== "") {
        $this->linktypeid = $linktypeid;
      }
    }

    /**
     * Loads the data for the link type from the database
     *
     * @return LinkType object (this)
     */
    function load(){
        global $DB,$CFG;

        $qry1 = "SELECT lt.LinkTypeID, lt.Label, lt.UserID, ltg.LinkTypeGroupID, ltg.Label AS GroupLabel FROM LinkType lt ".
                   " INNER JOIN LinkTypeGrouping ltgg ON lt.LinkTypeID = ltgg.LinkTypeID ".
                   " INNER JOIN LinkTypeGroup ltg ON ltgg.LinkTypeGroupID = ltg.LinkTypeGroupID ".
                   " WHERE lt.LinkTypeID='".$this->linktypeid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        if(mysql_num_rows($res1)==0){
             return database_error("LinkType not found","7002");
        }
        if ($res1) {
            while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                $this->label = $array1['Label'];
                $this->groupid = $array1['LinkTypeGroupID'];
                $this->grouplabel = stripslashes($array1['GroupLabel']);
                $this->userid = $array1['UserID'];
            }
        } else {
            return database_error();
        }

        return $this;
    }

    /**
     * Loads the data for the link type from the database
     *
     * @param string label
     * @return LinkType object (this)
     */
    function loadByLabel($label){
        global $DB,$CFG, $USER;

        $qry1 = "SELECT lt.LinkTypeID FROM LinkType lt ".
                   " INNER JOIN LinkTypeGrouping ltgg ON lt.LinkTypeID = ltgg.LinkTypeID ".
                   " INNER JOIN LinkTypeGroup ltg ON ltgg.LinkTypeGroupID = ltg.LinkTypeGroupID ".
                   " WHERE lt.Label='".mysql_escape_string($label)."' AND lt.UserID='".$USER->userid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        if(mysql_num_rows($res1)==0){
             return database_error("LinkType not found","7002");
        }
        if ($res1) {
            while ($array1 = mysql_fetch_array($res1, MYSQL_ASSOC)) {
                $this->linktypeid = $array1['LinkTypeID'];
            }
        } else {
            return database_error();
        }
		$this->load();
        return $this;
    }

    /**
     * add a link type to the database
     *
     * @param string $label
     * @param string $linktypegroup
     * @return LinkType object (this)
     */
    function add($label,$linktypegroup){
        global $DB,$CFG,$USER;

        //check user can add
        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }

        // check linktypegroup is valid
        $sql = "SELECT LinkTypeGroupID FROM LinkTypeGroup WHERE Label='".$linktypegroup."'";
        $res = mysql_query( $sql, $DB->conn);
        if(mysql_num_rows($res)!=1){
            return database_error("Invalid link type group - must be: Positive, Negative or Neutral");
        } else {
            while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $linktypegroupid = $array['LinkTypeGroupID'];
            }
        }

        //check to see if it already exists
        $sql = "SELECT LinkTypeID FROM LinkType WHERE Label='".mysql_escape_string($label)."' AND (UserID='".$USER->userid."' OR UserID='".$CFG->defaultUserID."')";
        $res = mysql_query( $sql, $DB->conn);
        if(mysql_num_rows($res)!=0){
             while ($array1 = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $this->linktypeid = $array1['LinkTypeID'];
            }
            $this->load();
            return $this;
        }

        //insert the link type
        $this->linktypeid = getUniqueID();
        $qry = "INSERT INTO LinkType
                (LinkTypeID,
                UserID,
                Label,
                CreationDate)
                VALUES
                ('".$this->linktypeid."',
                '".$USER->userid."',
                '".mysql_escape_string($label)."',
                ".time().")";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
             return database_error();
        }
        //now add the linktypegrouping
        $qry = "INSERT INTO LinkTypeGrouping
                (LinkTypeGroupID,
                LinkTypeID,
                UserID,
                CreationDate)
                VALUES
                ('".$linktypegroupid."',
                '".$this->linktypeid."',
                '".$USER->userid."',
                ".time().")";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
             return database_error();
        }
        $this->load();
        return $this;

    }

    /**
     * Edit a linktype
     *
     * @param string $$linktypelabel
     * @return LinkType object (this) (or Error object)
     */
    function edit($linktypelabel){
        global $DB,$USER;
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        $qry = "update LinkType set Label='".mysql_escape_string($linktypelabel)."' where LinkTypeID='".$this->linktypeid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);
        if (!$res) {
            return database_error();
        }
        $this->load();
        return $this;
    }

    /**
     * Delete this linktype and any of this users connections using it.
     *
     * @return Result object (or Error object)
     */
    function delete() {
        global $DB,$CFG,$USER;
        try {
            $this->candelete();
        } catch (Exception $e){
            return access_denied_error();
        }

		$qry = "select * from Triple where LinkTypeID='".$this->linktypeid."' and UserID='".$USER->userid."'";
        $res = mysql_query( $qry, $DB->conn);

		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                $c = new Connection($array['TripleID']);
                $c->load();
				if (!auditConnection($USER->userid, $array['TripleID'], $array['Label'], $array['FromID'], $array['ToID'], $array['LinkTypeID'], $array['FromContextTypeID'],  $array['ToContextTypeID'], $CFG->actionDelete, format_object('xml',$c))) {
		            return database_error();
				}
			}

			$qry1 = "delete from Triple where LinkTypeID='".$this->linktypeid."' and UserID='".$USER->userid."'";
			$res1 = mysql_query( $qry1, $DB->conn);
			if ($res1) {
				$qry1 = "delete from LinkType where UserID='".$USER->userid."' and LinkTypeID='".$this->linktypeid."'";
				$res1 = mysql_query( $qry1, $DB->conn);
				if (!$res1) {
                   return database_error();
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
     * Sets up the default link types for the given user
     *
     * @param string $userid
     * @return Result object (or Error object)
     */
    function setUpDefaultLinkTypes($userid){
        global $CFG,$DB;

  		//really need to change the way the unique identifier is created.
		//have increased to 15, but really can't go any bigger or ID is in danger of exceeding limit of 50 chars.
        $sql = "INSERT INTO LinkType (LinkTypeID,UserID,Label,CreationDate)
                SELECT concat(left(replace(lt.Label,' ',''),15),'".$userid."'), '".$userid."', lt.Label, UNIX_TIMESTAMP() FROM LinkType lt
                WHERE lt.UserID='".$CFG->defaultUserID."'";


        $res = mysql_query( $sql, $DB->conn);
        if (!$res){
             return database_error();
        } else {
            //add the default groupings for these
            $sql = "INSERT INTO LinkTypeGrouping (LinkTypeGroupID, LinkTypeID, UserID, CreationDate)
                    SELECT lgrp.LinkTypeGroupID, lt.LinkTypeID, lt.UserID, UNIX_TIMESTAMP() FROM LinkType lt
                    INNER JOIN (SELECT ltg.LinkTypeGroupID, lt2.Label FROM LinkTypeGrouping ltg INNER JOIN LinkType lt2 ON ltg.LinkTypeID = lt2.LinkTypeID WHERE lt2.UserID='".$CFG->defaultUserID."') lgrp ON lgrp.Label = lt.Label
                    WHERE lt.LinkTypeID NOT IN (SELECT LinkTypeID FROM LinkTypeGrouping)";

            $res2 = mysql_query( $sql, $DB->conn);
            if (!$res2){
                return database_error();
            }
        }
        return new Result("created default roles","true");
    }

    /////////////////////////////////////////////////////
    // security functions
    /////////////////////////////////////////////////////

    /**
     * Check whether the current user can add a node
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
     * Check whether the current user can edit the current linktype
     *
     * @throws Exception
     */
    function canedit(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }

        //can edit only if owner of the link type
        $sql = "SELECT t.LinkTypeID FROM LinkType t WHERE t.UserID = '".$USER->userid."' AND t.LinkTypeID='".$this->linktypeid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can delete the current linktype
     *
     * @throws Exception
     */
    function candelete(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the node
        $sql = "SELECT t.LinkTypeID FROM LinkType t WHERE t.UserID = '".$USER->userid."' AND t.LinkTypeID='".$this->linktypeid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }
}
?>