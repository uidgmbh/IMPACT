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

class LinkTypeSet {

  /**
   * @todo These need to be made into constants elsewhere and referenced in
   * getDefinedLinkSet() below as well as includes/util.php
   */
	public $USER_DEFINED_SEARCH = "User-Defined";
	public $SIMILARITY_SEARCH = "Similarity";
	public $CONTRAST_SEARCH = "Contrast";
	public $CONSISTENCY_SEARCH = "Consistency";
	public $PROOF_SEARCH = "Proof";
	public $PROBLEMS_SEARCH = "Problems";
	public $LINEAGE_SEARCH = "Lineage";
	public $CAUSALITY_SEARCH = "Causality";
	public $ANALOGY_SEARCH = "Analogy";
	public $USER_DEFINED_LABEL = "User Defined...";

	public $SIMILARITY_SEARCH_LINKS = "+,is an example of,improves on,is analogous to,as a metaphor for,is consistent with,improves on,uses/applies";
	public $CONTRAST_SEARCH_LINKS = "-,challenges,has counterexample,is inconsistent with,refutes";
	public $CONSISTENCY_SEARCH_LINKS = "+,is consistent with,supports,proves,is analogous to";
	public $PROOF_SEARCH_LINKS = "proves,refutes";
	public $PROBLEMS_SEARCH_LINKS = "addresses the problem,solves the problem,has sub-problem";
	public $LINEAGE_SEARCH_LINKS = "is an example of,improves on,proves,solves a problem,uses/applies";
	public $CAUSALITY_SEARCH_LINKS = "predicts,causes";
	public $ANALOGY_SEARCH_LINKS = "is analogous to,is a metaphor for";
	
    public $linktypes;


    public function __construct() {
      $this->linktypes = array();
    }
    
    /**
     * add a linktype to the set
     * 
     * @param LinkType $linktype
     */
    function add($linktype){
        array_push($this->linktypes,$linktype);   
    }

    /**
     * This function combines a given LinkTypeSet with the current one, taking
     * care to remove any duplicates.
     *
     * @param LinkTypeSet $other_set Other LinkTypeSet to combine with this one
     * @returns LinkTypeSet
     */
    public function combine(LinkTypeSet $other_set) {

      $this_linktypes_copy = $this->linktypes;

      foreach ($other_set->linktypes as $linktype_other) {
        $add = true;

        foreach ($this_linktypes_copy as $linktype_this) {
          if ($linktype_other->linktypeid === $linktype_this->linktypeid) {
            $add = false;
            break;
          }
        }

        $add and $this->add($linktype_other);
      }

      return $this;
    }
    
    /**
     * load in the linktypes for the given SQL statement
     * 
     * @param string $sql
     * @return LinkTypeSet (this)
     */
    function load($sql){
        global $DB;
        //get the nodes for user
         $res = mysql_query($sql, $DB->conn);
         
         //create new nodeset and loop to add each node to the set
         while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $lt = new LinkType($array['LinkTypeID']);
            $this->add($lt->load());
         }
         return $this;  
    }

    /**
     * This function retrieves the set of link-types defined and owned by a
     * given user.
     *
     * @param string $user_id
     * @returns LinkTypeSet
     */
    public function loadByUser($user_id) {

      $sql = "SELECT lt.LinkTypeID FROM LinkTypeGroup ltg
            INNER JOIN LinkTypeGrouping ltgg ON ltgg.LinkTypeGroupID = ltg.LinkTypeGroupID
            INNER JOIN LinkType lt ON lt.LinkTypeID = ltgg.LinkTypeID
            WHERE ltgg.UserID = '".$user_id."' AND lt.UserID = '".$user_id."'
            ORDER BY ltg.Label DESC, lt.Label ASC";

      return $this->load($sql);
    }
    
    function getDefinedLinkSet($type) {

    	$selectedLinks = "";

    	if ($type == $this->USER_DEFINED_LABEL) {
    		// Do nothing, leave SELECTED_LINKTYES as it was set already by the dialog.
    	} else if ($type == $this->SIMILARITY_SEARCH) {
    		$selectedLinks = $this->SIMILARITY_SEARCH_LINKS;
    	} else if ($type == $this->CONTRAST_SEARCH) {
    		$selectedLinks = $this->CONTRAST_SEARCH_LINKS;
    	} else if ($type == $this->CONSISTENCY_SEARCH) {
    		$selectedLinks = $this->CONSISTENCY_SEARCH_LINKS;
    	} else if ($type == $this->PROOF_SEARCH) {
    		$selectedLinks = $this->PROOF_SEARCH_LINKS;
    	} else if ($type == $this->PROBLEMS_SEARCH) {
    		$selectedLinks = $this->PROBLEMS_SEARCH_LINKS;
    	} else if ($type == $this->LINEAGE_SEARCH) {
    		$selectedLinks = $this->LINEAGE_SEARCH_LINKS;
    	} else if ($type == $this->CAUSALITY_SEARCH) {
    		$selectedLinks = $this->CAUSALITY_SEARCH_LINKS;
    	} else if ($type == $this->ANALOGY_SEARCH) {
    		$selectedLinks = $this->ANALOGY_SEARCH_LINKS;
    	}

    	return $selectedLinks;
    }    
}
?>