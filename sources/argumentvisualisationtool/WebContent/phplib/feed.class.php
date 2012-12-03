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
// Feed Class
///////////////////////////////////////

require_once "rss/rss_php.php";

class Feed {

    public $feedid;
    public $userid;
    public $url;
    public $name;
    public $creationdate;
    public $lastupdated;
    public $regular;


   /**
     * Constructor
     *
     * @param string $feedid (optional)
     * @return Feed (this)
     */
    function Feed($feedid = ""){
        if ($feedid != ""){
            $this->feedid = $feedid;
            return $this;
        }
    }

    /**
     * Loads the data for the feed from the database
     *
     * @return Feed object (this)
     */
    function load() {
        global $DB;
        $sql = "SELECT * FROM Feeds WHERE FeedID='".$this->feedid."'";
        $res = mysql_query($sql, $DB->conn);

        if(mysql_num_rows($res)==0){
             return database_error("Feed not found","7002");
        }
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $this->url = stripslashes($array['URL']);
            $this->name = stripslashes($array['Name']);
            $this->userid = $array['UserID'];
            $this->creationdate = $array['CreationDate'];
            $this->lastupdated = $array['LastUpdated'];
            $this->regular = $array['Regular'];
        }
        return $this;
    }

    /**
     * Add new Feed to the database
     *
     * @param string $url
     * @param string $name
     * @param string $regular
     * @return Feed object (this) (or Error object)
     */
    function add($url, $name, $regular){
        global $DB,$CFG,$USER;
        try {
            $this->canadd();
        } catch (Exception $e){
            return access_denied_error();
        }

        $dt = time();

        $qry = "SELECT FeedID FROM Feeds WHERE UserID='".$USER->userid."' AND URL='".mysql_escape_string($url)."'";
        $res = mysql_query( $qry, $DB->conn);
        if ($res) {
            $num_rows = mysql_num_rows($res);
            if( $num_rows > 0 ) {
                //feed url already exists for user, so just return this one
                while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
                    $this->feedid = $array["FeedID"];
                }
            } else {
               //add new feed
               $this->feedid = getUniqueID();
               $qry2 = "INSERT INTO Feeds (
                            FeedID,
                            UserID,
                            URL,
                            Name,
                            CreationDate,
                            LastUpdated,
                            Regular)
                        VALUES (
                            '".$this->feedid."',
                            '".$USER->userid."',
                            '".mysql_escape_string($url)."',
                            '".mysql_escape_string($name)."',
                            ".$dt.",
                            0,
                            '".$regular."')";
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
     * Delete feed
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

        $sql = "DELETE FROM Feeds WHERE FeedID='".$this->feedid."'";
        $res = mysql_query( $sql, $DB->conn );
        if(!$res){
            return database_error();
        }
        return new Result("deleted","true",1);
    }
    /**
     * Refreshes a feed (i.e. reloads all the data from the feed)
     *
     * @param array $errors the current errors array (for reporting any problems with this script - note that it's passed by reference)
     * @return Result or Error
     */
    function refresh(&$errors,&$log){
        global $CFG,$USER;
        try {
            $this->canrefresh();
        } catch (Exception $e){
            return access_denied_error();
        }

        $http = array('method'  => 'GET',
                    'request_fulluri' => true,
                    'timeout' => '2');
        if($CFG->PROXY_HOST != ""){
            $http['proxy'] = $CFG->PROXY_HOST . ":".$CFG->PROXY_PORT;
        }
        $opts = array();
        $opts['http'] = $http;
        $context  = stream_context_create($opts);
        $rssxml = @file_get_contents($this->url, 0, $context);

		if (isset($http_response_header)) {
			if (strpos($http_response_header[0], "200")) {

				// convert into simple xml (just to test if it's valid or not)
				// can't use this for processing as it excludes all the CDATA stuff
				$rss = @simplexml_load_string($rssxml);
				if(!($rss instanceof SimpleXMLElement)){
					array_push($errors,$this->url." does not appear to be a valid RSS feed please try again.");
					return;
				}
				$rss = new rss_php;
				$rss->loadXML($rssxml);
				$items = $rss->getItems();
				foreach($items as $index => $item) {
					//add the node
					$desc = "";
					if(isset($item['content:encoded']) && $item['content:encoded'] != ""){
						$desc = $item['content:encoded'];
					} else if (isset($item['description'])) {
						$desc = $item['description'];
					}
					$rssdate = "";
					if(isset($item['pubDate'])){
						$rssdate = strtotime($item['pubDate']);
					}
					if(isset($item['dc:date'])){
						$rssdate = strtotime($item['dc:date']);
					}
					//array_push($log,"... date:".$rssdate. " : ".$this->lastupdated);
					if($rssdate == "" || ($rssdate != "" && $rssdate > $this->lastupdated)){

						$node = addNode($item['title'],$desc,$USER->privatedata);
						array_push($log,"... ".$item['title']." idea added");
						$s = $node->updateStartDate($rssdate);

						$node->updateEndDate($rssdate);
						if($item['link'] != ""){
							$url = addURL($item['link'],$item['title'],"");
							addURLToNode($url->urlid,$node->nodeid);
						}
					}
				}
				// now update the lastupdated time
				$this->updateLastUpdated();
				$this->load();
			} else {
				$status = $http_response_header[0];
				//HTTP/1.0 403 Forbidden
				//HTTP/1.0 503 Service Unavailable
				//HTTP/1.0 404 Not Found
				array_push($errors,$this->url." could not be accessed. Status: ".$status);
				return;
			}
		} else {
			array_push($errors,$this->url." could not be accessed.");
			return;
		}

        return $this;
    }

    /**
     * Update the lastUpdated time
     *
     * @return Feed object (this)
     */
    function updateLastUpdated() {
        global $DB;
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt= time();
        $sql = "UPDATE Feeds SET LastUpdated = ".$dt." WHERE FeedID='".$this->feedid."'";
        $res = mysql_query($sql, $DB->conn);
        $this->load();
        return $this;
    }

    /**
     * Update the Regular
     *
     * @return Feed object (this)
     */
    function updateRegular($regular) {
        global $DB;
        try {
            $this->canedit();
        } catch (Exception $e){
            return access_denied_error();
        }
        $dt= time();
        $sql = "UPDATE Feeds SET Regular = '".$regular."' WHERE FeedID='".$this->feedid."'";
        $res = mysql_query($sql, $DB->conn);
        $this->load();
        return $this;
    }

    /////////////////////////////////////////////////////
    // security functions
    /////////////////////////////////////////////////////

    /**
     * Check whether the current user can add a Feed
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
     * Check whether the current user can edit the current feed
     *
     * @throws Exception
     */
    function canedit(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the feed
        $sql = "SELECT u.FeedID FROM Feeds u WHERE u.UserID = '".$USER->userid."' AND u.FeedID='".$this->feedid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can delete the current feed
     *
     * @throws Exception
     */
    function candelete(){
        //can delete only if owner of the feed
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can delete only if owner of the node
        $sql = "SELECT u.FeedID FROM Feeds u WHERE u.UserID = '".$USER->userid."' AND u.FeedID='".$this->feedid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }

    /**
     * Check whether the current user can refresh the current Feed
     *
     * @throws Exception
     */
    function canrefresh(){
        global $DB,$USER;
        if(api_check_login() instanceof Error){
            throw new Exception("access denied");
        }
        //can edit only if owner of the feed
        $sql = "SELECT u.FeedID FROM Feeds u WHERE u.UserID = '".$USER->userid."' AND u.FeedID='".$this->feedid."'";
        $res = mysql_query( $sql, $DB->conn );
        $n = mysql_num_rows( $res );
        if($n == 0){
            throw new Exception("access denied");
        }
    }
}
?>