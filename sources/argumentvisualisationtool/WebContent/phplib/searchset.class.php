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
// SearchSet Class
///////////////////////////////////////

class SearchSet {

    public $totalno = 0;
    public $count = 0;
    public $searches;

    /**
     * Constructor
     *
     */
    function SearchSet() {
        $this->searches = array();
    }

    /**
     * add a Search to the set
     *
     * @param Search $search
     */
    function add($search){
        array_push($this->searches,$search);
    }

    /**
     * load in the searches for the given SQL statement
     *
     * @param string $sql
     * @return SearchSet (this)
     */
    function load($sql){
        global $DB;

        //get total count
        $csql = "SELECT COUNT(*) AS total FROM (".$sql.") a";
        $cres = mysql_query($csql, $DB->conn);
        $carray = mysql_fetch_array($cres, MYSQL_ASSOC);
        $total = $carray["total"];

        //create new searchset and loop to add each search to the set
        $res = mysql_query($sql, $DB->conn);

		$this->totalno = $total;
		$this->count = mysql_num_rows($res);

		while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
			$searchobj = new Search($array['SearchID']);
			$this->add($searchobj->load());
		}

        return $this;
    }
}
?>