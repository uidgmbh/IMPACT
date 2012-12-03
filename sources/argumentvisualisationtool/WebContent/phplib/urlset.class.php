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
// URLSet Class
///////////////////////////////////////

class URLSet {

    public $totalno = 0;
    public $start = 0;
    public $count = 0;
    public $urls;

    /**
     * Constructor
     *
     */
    function URLSet() {
        $this->urls = array();
    }

    /**
     * add a URL to the set
     *
     * @param URL $url
     */
    function add($url){
        array_push($this->urls,$url);
    }

    /**
     * load in the urls for the given SQL statement
     *
     * @param string $sql
     * @param integer $start (optional - default: 0)
     * @param integer $max (optional - default: 20)
     * @param string $orderby (optional, either 'date', 'nodeid', 'name' or 'moddate' - default: 'date')
     * @param string $sort (optional, either 'ASC' or 'DESC' - default: 'DESC')
     * @param String $style (optional - default 'long') may be 'short' or 'long'  - how much of a urls details to load (long includes: tags and groups).
     * @return URLSet (this)
     */
    function load($sql,$start=0,$max=20,$orderby='date',$sort='ASC',$style='long'){
        global $DB;

        $csql = "SELECT COUNT(*) AS totalurls FROM (".$sql.") a";

        $sql .= urlOrderString($start,$max,$orderby,$sort);
        $res = mysql_query($sql, $DB->conn);
        //get total count
        $cres = mysql_query($csql, $DB->conn);
        $carray = mysql_fetch_array($cres, MYSQL_ASSOC);
        $totalconns = $carray["totalurls"];

        //create new nodeset and loop to add each node to the set
        $this->totalno = $totalconns;
        $this->start = $start;
        $this->count = mysql_num_rows($res);
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $url = new URL($array['URLID']);
            $this->add($url->load($style));
        }
        return $this;
    }
}
?>