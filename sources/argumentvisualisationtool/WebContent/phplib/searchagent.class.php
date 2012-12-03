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
// SearchAgent Class
///////////////////////////////////////

class SearchAgent {

    public $agentid;
    public $userid;
    public $searchid;
    public $creationdate;
    public $modificationdate;
    public $lastrun;
    public $email;
    public $runinterval;

    public $user;

    public $agentruns;

    /**
     * Constructor
     *
     * @param string $agentid (optional)
     * @return SearchAgent (this)
     */
    function SearchAgent($agentid = ""){
        if ($agentid != ""){
            $this->agentid = $agentid;
            return $this;
        }
    }

    /**
     * Loads the data for the SearchAgent from the database
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


        $sql = "SELECT * FROM SearchAgent WHERE AgentID='".$this->agentid."'";
        $res = mysql_query($sql, $DB->conn);
        if(mysql_num_rows($res)==0){
             return database_error("SearchAgent not found","7002");
        }
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $this->userid = $array['UserID'];
            $this->searchid = stripslashes($array['SearchID']);
            $this->creationdate = $array['CreationDate'];
            $this->modificationdate = $array['ModificationDate'];
            $this->lastrun = $array['LastRun'];
            $this->email = $array['Email'];
            $this->runinterval = $array['RunInterval'];

            //$this->user = new user($this->userid);
        }

        $this->loadAgentRuns();

        return $this;
    }

    /**
     * Load all the data about the runs of this agent
     */
    function loadAgentRuns() {
        global $DB;

        $this->agentruns = array();

        $sql = "SELECT RunID FROM SearchAgentRun WHERE AgentID='".$this->agentid."' order by ToDate DESC";
        $res = mysql_query($sql, $DB->conn);
        if ($res) {
	        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
	            $runid = $array['RunID'];
	            $item = new SearchAgentRun($runid);
	            array_push($this->agentruns,$item->load());
	       }
        }
   }

    /**
     * Add new SearchAgent to the database
     *
     * @param string $searchid
     * @param boolean $email
     * @param string $runinterval
     * @return SearchAgent object (this) (or Error object)
     */
    function add($searchid, $email=false, $runinterval="monthly"){
        global $DB,$CFG,$USER;
        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt = time();

		$emaildata = 0;
		if ($email) {
			$emaildata = 1;
		}

        $this->agentid = getUniqueID();
        $qry = "INSERT INTO SearchAgent (AgentID, UserID, SearchID, CreationDate, ModificationDate, LastRun, Email, RunInterval) values ('".$this->agentid."', '".$USER->userid."','".$searchid."', ".$dt.", ".$dt.", ".$dt.", ".$emaildata.", '".mysql_escape_string($runinterval)."')";

        $res = mysql_query( $qry, $DB->conn);
        if( !$res ) {
           return database_error();
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
    function edit($email=false, $runinterval="monthly"){
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

		$qry = "UPDATE SearchAgent SET
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
    }

    /**
     * Update the LastRun time for this SearchAgent
     *
     * @param string $lastrun
     * @return SearchAgent object (this) (or Error object)
     */
    function updateLastRun($lastrun=0){
        global $DB,$CFG,$USER;
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
		$qry = "UPDATE SearchAgent SET LastRun=".$lastrun." WHERE AgentID='".$this->agentid."'";
		$res = mysql_query( $qry, $DB->conn );
		if( !$res ) {
			return database_error(mysql_error());
		} else {
			$this->lastrun = $lastrun;
		}

        return $this;
    }

    /**
     * Create a new SearchAgentRun and store the results of this run.
     * @param double $from the time from whihc the search was run
     * @param double $to the tim to which the search was run
     * @param String type, who requested this run, the user themselves through an interface button push
     * or an automated process like a nightly cron: values = 'user' or 'auto'; default = 'user';
     * @param array $connections a list of connection which are the result of the run.
     */
    function addAgentRun($from, $to, $type='user', $connections) {

    	$run = new SearchAgentRun();
    	$results = $run->add($this->agentid, $from, $to, $this->userid, $type, $connections);

    	if (!$results instanceof error) {
    		$this->updateLastRun($to);
    		$this->loadAgentRuns();
    	}

    	return $results;
    }

    /**
     * Delete a SearchAgent
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
        $qry1 = "DELETE FROM SearchAgent WHERE AgentID='".$this->agentid."'";
        $res1 = mysql_query( $qry1, $DB->conn);
        return new Result("deleted","true");
    }

    /**
     * Return the SearchAgentRun object for the given run id
     * @param $runid the runid of the agent run to return;
     * @return SearchAgentRun object or null;
     */
    function getRun($runid) {
    	if ($this->agentruns) {
	    	foreach($this->agentruns as $run) {
	    		if ($run && $run->runid && $run->runid === $runid) {
	    			return $run;
	    		}
	    	}
    	}
    	return null;
    }

    /**
     * Return the SearchAgentRun object previous to the given run id
     * @param $run the SearchAgentRun to find the previous run for.
     * @return SearchAgentRun object or null;
     */
    function getPreviousRun($run) {
        global $DB,$USER;
    	$previousrun = null;

    	$sql = "SELECT RunID FROM SearchAgentRun WHERE ToDate <= ".$run->from. " order by ToDate DESC LIMIT 1";
        $res = mysql_query($sql, $DB->conn);
        if($res) {
	        if( mysql_num_rows($res) > 0 ){
	         	$runid = "";
		        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
		            $runid = $array['RunID'];
		        }
		        $previousrun = $this->getRun($runid);
	        }
        }
	    return $previousrun;
    }

    /**
     * Return the newest agent run or null
     */
    function getLastAgentRun() {
    	//runs are loaded in order of newest first.
    	if ($this->agentruns && count($this->agentruns) > 0) {
    		return $this->agentruns[0];
    	}

    	return null;
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
        /*$sql = "SELECT AgentID FROM SearchAgent WHERE UserID = '".$USER->userid."' AND AgentID='".$this->agentid."'";
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
        $sql = "SELECT AgentID FROM SearchAgent WHERE UserID = '".$USER->userid."' AND AgentID='".$this->agentid."'";
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
        $sql = "SELECT AgentID FROM SearchAgent WHERE UserID = '".$USER->userid."' AND AgentID='".$this->agentid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }
}
?>