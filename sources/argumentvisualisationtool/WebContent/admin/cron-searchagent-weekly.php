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
/**
 * cron-searchagent-weekly.php
 * Created on 18th October 2010
 *
 * Michelle Bachler
 */

chdir( dirname ( realpath ( __FILE__ ) ) );

include_once("../config.php");
include_once($CFG->dirAddress."phplib/apilib.php");

header("Content-Type: text/plain");

// Run the Search Agents
global $CFG,$DB,$USER;

$ss = new SearchSet();

//RUN MONTHLY REPORTS
$sql = "SELECT SearchAgent.SearchID, SearchAgent.UserID FROM SearchAgent INNER JOIN Search on SearchAgent.SearchID = Search.SearchID " .
		"Where SearchAgent.RunInterval = 'weekly' Order By SearchAgent.UserID";

//echo $sql;
$res = mysql_query($sql, $DB->conn);
if ($res) {
	while ($array = mysql_fetch_array($res, MYSQL_ASSOC)){
		//need to do this as only owner of search can view it and run it
		$USER = new User($array["UserID"]);
		$USER->load();
		$s = new Search($array["SearchID"]);
		$search = $s->load();
		if ((!$search instanceof Error) && $search->agent->email) {
			$reply = $search->runSearchAgent("auto");
			if ($reply instanceof error) {
				addToLog("Run Weekly Agent - Error:".$reply->message,"Agent",$search->agent->agentid);
				$search->error = true;
			} else {
				addToLog("Run Weekly Agent","Agent",$search->agent->agentid);
			}
			$ss->add($search);
		}
	}
}

$ss->totalno = count($ss->searches);
$ss->count = $ss->totalno;

$currentUser = null;
$nextMessage = "";

// COLLATE AND SEND EMAILS OUT
if ($ss && isset($ss->count) && $ss->count > 0) {
	foreach($ss->searches as $search) {
		$USER = new User($search->userid);
		$USER->load();
		//echo "next=".$search->userid."\n";
		if ($search->userid != $currentUser || $currentUser == null) {
			if ($currentUser != null) {
				//echo "sending email to: ".$currentUser."\n";
				//echo "next message=".$nextMessage."\n";
			    $paramArray = array ($USER->name, "Weekly", $nextMessage);
			    sendMail("agentreport","Weekly Cohere Agent Report",$USER->getEmail(),$paramArray);
			}
			$nextMessage = "";
			$currentUser = $search->userid;
		}
		$lastRun = $search->agent->getLastAgentRun();
		if ($lastRun != null && $lastRun instanceof SearchAgentRun) {
			$newConns = $search->getNewConnections($lastRun);
			if ($nextMessage == "") {
				$nextMessage .= "<b>Results for run of agent on search: ".$search->name."</b><br>";
			} else {
				$nextMessage .= "<br><br><b>Results for run of agent on search: ".$search->name."</b><br>";
			}
			$nextMessage .= "<br>From ".date("d M Y - H:i", $lastRun->from)." To ".date("d M Y - H:i", $lastRun->to);
			$nextMessage .= "<br>Search Connection Count: ".count($lastRun->results);

			if (isset($newConns->connections)) {
				$nextMessage .= "<br>New Connection Count: ".count($newConns->connections);
			} else {
				$nextMessage .= "<br>New Connection Count: 0";
			}
			$nextMessage .= '<br><a href="'.$CFG->homeAddress.'agent.php?searchid='.$search->searchid.'&agentid='.$search->agent->agentid.'&runid='.$lastRun->runid.'#agent-net">View Agent Run</a>';
		}
	}
	//for the last user
	//echo "message=".$nextMessage;
	if ($currentUser != null) {
	    $paramArray = array ($USER->name, "Weekly", $nextMessage);
	    sendMail("agentreport","Weekly Cohere Agent Report",$USER->getEmail(),$paramArray);
	}
}

//echo "Agents Run\r\n";
?>