<?php
/********************************************************************************
 *                                                                              *
 *  (c) Copyright 2012 University of Leeds, UK
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
// ConnectionSet Class
///////////////////////////////////////

class ConnectionSet {

    public $totalno = 0;
    public $start = 0;
    public $count = 0;
    public $connections;

    public function __construct(array $connections = array()) {
      $this->connections = $connections;
      $this->totalno = $this->count = count($connections);
    }

    /**
     * add a connection to the set
     *
     * @param Connection $conn
     */
    function add($conn){
        array_push($this->connections,$conn);
    }

    /**
     * load in the connections for the given SQL statement
     *
     * @param string $sql
     * @return ConnectionSet (this)
     */
    function load($sql,$start,$max,$orderby,$sort, $style='long'){
        global $DB;

        $csql = "SELECT COUNT(*) AS totalconns FROM (".$sql.") a";
        //get the nodes for user
        $sql .= connectionOrderString($start,$max,$orderby,$sort);

        $res = mysql_query($sql, $DB->conn);
        //get total count
        $cres = mysql_query($csql, $DB->conn);
        $carray = mysql_fetch_array($cres, MYSQL_ASSOC);
        $totalconns = $carray["totalconns"];

        //create new nodeset and loop to add each node to the set
        $this->totalno = $totalconns;
        $this->start = $start;
        $this->count = mysql_num_rows($res);
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $c = new Connection($array["TripleID"]);
            $conn = $c->load($style);
            $this->add($conn);
        }

        return $this;
    }

    /**
     * load in the connections given in the passed array
     *
     * @param array $conns the array to load.
     * @return ConnectionSet (this)
     */
    function loadConnections($conns, $style='long') {
        $this->totalno = count($conns);
        $this->start = 0;
        $this->count =  $this->totalno;

        for ($i=0; $i < $this->count; $i++) {
			$array = $conns[$i];
            $c = new Connection($array["TripleID"]);
            $conn = $c->load($style);
            $this->add($conn);
        }
        return $this;
    }
}
?>