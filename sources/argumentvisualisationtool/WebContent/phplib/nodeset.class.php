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

class NodeSet {

    public $totalno = 0;
    public $start = 0;
    public $count = 0;
    public $nodes;

    public function __construct() {
      $this->nodes = array();
    }

    /**
     * add a node to the set
     *
     * @param Node $node
     */
    function add($node){
        array_push($this->nodes,$node);
    }

    /**
     * load in the nodes for the given SQL statement
     *
     * @param string $sql
     * @return NodeSet (this)
     */
    function load($sql,$start,$max,$orderby,$sort,$style = 'short'){
        global $DB;

        $csql = "SELECT COUNT(*) AS totalnodes FROM (".$sql.") a";
        //get the nodes for user
        $sql .= nodeOrderString($start,$max,$orderby,$sort);
        $res = mysql_query($sql, $DB->conn);
        //get total count
        $cres = mysql_query($csql, $DB->conn);
        $carray = mysql_fetch_array($cres, MYSQL_ASSOC);
        $totalconns = $carray["totalnodes"];

        //create new nodeset and loop to add each node to the set
        $this->totalno = $totalconns;
        $this->start = $start;
        $this->count = mysql_num_rows($res);
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $node = new CNode($array["NodeID"]);
            $this->add($node->load($style));
        }
        return $this;
    }

    public function loadByUser(
      $user_id, $start = 0, $max = 20, $orderby = 'date', $sort ='DESC',
      $filternodetypes = "", $style = 'long') {

      $sql = "SELECT t.NodeID,
                (SELECT COUNT(FromID) FROM Triple WHERE FromID=t.NodeID)+
                (SELECT COUNT(ToID) FROM Triple WHERE ToID=t.NodeID) AS connectedness
            FROM Node t ";

      if ($filternodetypes != "") {
        $pieces = explode(",", $filternodetypes);
        $loopCount = 0;
        $searchNodeTypes = "";
        foreach ($pieces as $value) {
          if ($loopCount == 0) {
            $searchNodeTypes .= "'".$value."'";
          } else {
            $searchNodeTypes .= ",'".$value."'";
          }
          $loopCount++;
        }

        $sql .= "LEFT JOIN NodeType nt ON t.NodeTypeID = nt.NodeTypeID ";
        $sql .= "WHERE nt.Name IN (".$searchNodeTypes.") AND ";
      } else {
        $sql .= "WHERE ";
      }

      $sql .= "t.UserID = '". $user_id ."' AND (
            (t.Private = 'N')
             OR
            (t.UserID = '". $user_id ."') ".
        " OR
            (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
                         INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                         WHERE ug.UserID = '". $user_id ."')" .
        "))";

      return $this->load($sql,$start,$max,$orderby,$sort,$style);
    }
}
?>