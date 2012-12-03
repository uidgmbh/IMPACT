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

class RoleSet {

    public $roles;

    public function __construct() {
      $this->roles = array();
    }
    
    /**
     * add a Role to the set
     * 
     * @param Role $role
     */
    function add($role){
        array_push($this->roles,$role);   
    }

    /**
     * This function combines a given RoleSet with the current one, taking
     * care to remove any duplicates.
     *
     * @param RoleSet $other_set Other RoleSet to combine with this one
     * @returns RoleSet
     */
    public function combine(RoleSet $other_set) {

      $this_roles_copy = $this->roles;

      foreach ($other_set->roles as $role_other) {
        $add = true;

        foreach ($this_roles_copy as $role_this) {
          if ($role_other->roleid === $role_this->roleid) {
            $add = false;
            break;
          }
        }

        $add and $this->add($role_other);
      }

      return $this;
    }
    
    /**
     * load in the roles for the given SQL statement
     * 
     * @param string $sql
     * @return RoleSet (this)
     */
    function load($sql){
        global $DB;
        $res = mysql_query($sql, $DB->conn);

        //create new roleset and loop to add each role to the set
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
           $r = new Role($array["NodeTypeID"]);
           $this->add($r->load());
        } 
        return $this;  
    }
    
    /**
     * load in the roles for the given SQL statement, but only the names and images for using on a filter list
     * 
     * @param string $sql
     * @return RoleSet (this)
     */
    function loadFilterRoles($sql){
        global $DB;
        $res = mysql_query($sql, $DB->conn);

         //create new roleset and loop to add each role to the set
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {        	
           $r = new Role();
           $r->name = $array["Name"];
           $r->image = $array["Image"];
           $this->add($r);
        } 
        return $this;  
    }

    /**
     * This function retrieves the set of node-types (roles) defined and owned
     * by a given user.
     *
     * @param string $user_id
     * @returns RoleSet
     */
    public function loadByUser($user_id) {
      $sql = "SELECT cnt.NodeTypeID FROM NodeType cnt
              INNER JOIN NodeTypeGrouping cntg On cntg.NodeTypeID = cnt.NodeTypeID
              WHERE cnt.UserID='". $user_id ."' ORDER BY Name ASC";

      return $this->load($sql);
    }
    
}
?>