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
// FeedSet Class
///////////////////////////////////////

class FeedSet {

    public $totalno;
    public $feeds;

    /**
     * Constructor
     *
     */
    function FeedSet() {
        $this->feeds = array();
    }

    /**
     * add a Feed to the set
     *
     * @param Feed $feed
     */
    function add($feed){
        array_push($this->feeds,$feed);
    }

    /**
     * load in the feeds for the given SQL statement
     *
     * @param string $sql
     * @return FeedSet (this)
     */
    function load($sql){
        global $DB;
        $csql = "SELECT COUNT(*) AS totalfeeds FROM (".$sql.") a";
        //get the nodes for user
        $res = mysql_query($sql, $DB->conn);
        //get total count
        $cres = mysql_query($csql, $DB->conn);
        $carray = mysql_fetch_array($cres, MYSQL_ASSOC);
        $totalfeeds = $carray["totalfeeds"];

        //create new nodeset and loop to add each node to the set
        $this->totalno = $totalfeeds;
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $f = new Feed($array['FeedID']);
            $this->add($f->load());
        }
        return $this;
    }
}
?>