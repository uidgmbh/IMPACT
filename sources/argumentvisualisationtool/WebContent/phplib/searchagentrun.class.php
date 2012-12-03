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
// SearchAgentRun Class
///////////////////////////////////////

class SearchAgentRun {

	public $runid;
    public $agentid;
    public $userid;
    public $from;
    public $to;
    public $type;
    public $results;

    /**
     * Constructor
     *
     * @param string $runid (optional)
     * @return SearchAgentRun (this)
     */
    function SearchAgentRun($runid = ""){
        if ($runid != ""){
            $this->runid = $runid;
            return $this;
        }
    }

    /**
     * Loads the data for the SearchAgentRun from the database
     *
     * @return SearchAgent object (this)
     */
    function load() {
        global $DB;

        try {
			$this->canview();
		} catch (Exception $e){
            return access_denied_error();
        }

        $sql = "SELECT * FROM SearchAgentRun WHERE RunID='".$this->runid."'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res)==0){
             return database_error("SearchAgentRun not found","7002");
        }
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $this->agentid = $array['AgentID'];
            $this->userid = $array['UserID'];
            $this->from = $array['FromDate'];
            $this->to = $array['ToDate'];
            $this->type = $array['RunType'];
        }

        $this->loadAgentRunResults();

        return $this;
    }

    /**
     * Load all the results for this run of the agent
     */
    function loadAgentRunResults() {
        global $DB;

        $this->results = array();

        $sql = "SELECT TripleID FROM SearchAgentRunResults WHERE RunID='".$this->runid."'";
        $res = mysql_query($sql, $DB->conn);
        if ($res) {
        	while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
        		$connid = $array['TripleID'];
        		$item = new Connection($connid);
        		$item->load();
        		if (isset($item->userid)) {
        			array_push($this->results, $item);
        		}
        	}
        }
   }

    /**
     * Add new SearchAgent to the database
     *
     * @param string $agentid
     * @param double $from the time from whihc the search was run
     * @param double $to the tim to which the search was run
     * @param String $user the userid for this run
     * @param String type, who requested this run, the user themselves through an interface button push
     * or an automated process like a nightly cron: values = 'user' or 'auto'; default = 'user';
     * @param array $connections a list of connection which are the result of the run.
     * @return SearchAgentRun object (this) (or Error object)
     */
    function add($agentid, $from, $to, $userid, $type="user", $connections){
        global $DB,$CFG,$USER;
        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }

        $this->runid = getUniqueID();
        $qry = "INSERT INTO SearchAgentRun (RunID, AgentID, UserID, FromDate, ToDate, RunType) values ('".$this->runid."','".$agentid."', '".$userid."',".$from.",".$to.", '".$type."')";
        $res = mysql_query( $qry, $DB->conn);
        if( !$res ) {
           return database_error();
        }

        if (count($connections) > 0) {
	        foreach($connections as $conn) {
	            $qry = "INSERT INTO SearchAgentRunResults (RunID, TripleID) values ('".$this->runid."','".$conn->connid."')";
	            $res = mysql_query( $qry, $DB->conn);
	            if( !$res ) {
	               return database_error();
	            }
	        }
        }

        $this->load();
        return $this;
    }

    /**
     * Edit a SearchAgent
     *
     * @param string $searchid
     * @param boolean $email
     * @param string $runinterval
     * @return SearchAgent object (this) (or Error object)
     */
    /*function edit($email=false, $runinterval="monthly"){
        global $DB,$CFG,$USER;

        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt = time();

		$emaildata = 0;
		if ($email) {
			$emaildata = 1;
		}

		$qry = "UPDATE SearchAgentRun SET
				ModificationDate=".$dt.",
				Email=".$emaildata.",
				RunInterval='".mysql_escape_string($runinterval)."'
				WHERE AgentID='".$this->agentid."'";

		$res = mysql_query( $qry, $DB->conn );
		if( !$res ) {
			return database_error(mysql_error());
		} else {

		}

        $this->load();
        return $this;
    }*/

    /**
     * Delete a SearchAgentRun
     */
    function delete(){
        global $DB,$CFG,$USER;
        try {
            $this->candelete();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt = time();

        //delete
        $qry1 = "DELETE FROM SearchAgentRun WHERE RunID='".$this->runid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        return new Result("deleted","true");
    }

    /////////////////////////////////////////////////////
    // security functions
    /////////////////////////////////////////////////////

    /**
     * Check whether the current user can view the current SearchAgent
     *
     * @throws Exception
     */
    function canview(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can view only if owner of the SearchAgent
        /*$sql = "SELECT RunID FROM SearchAgentRun WHERE UserID = '".$USER->userid."' AND RunID='".$this->runid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }*/
    }

    /**
     * Check whether the current user can add a SearchAgent
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
     * Check whether the current user can edit the current SearchAgent
     *
     * @throws Exception
     */
    function canedit(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the Search
        $sql = "SELECT RunID FROM SearchAgentRun WHERE UserID = '".$USER->userid."' AND RunID='".$this->runid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can delete the current SearchAgent
     *
     * @throws Exception
     */
    function candelete(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can delete only if owner of the Search
        $sql = "SELECT RunID FROM SearchAgentRun WHERE UserID = '".$USER->userid."' AND RunID='".$this->runid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }
}
?>