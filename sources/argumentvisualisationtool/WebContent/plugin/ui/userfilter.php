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
    include_once("../../config.php");
    global $USER, $CFG;

    include_once($CFG->dirAddress."includes/dialogheader.php");
        
	$groupid = required_param("groupid", PARAM_TEXT); 
	$selected = optional_param("selected", "", PARAM_TEXT); 
 	
	$rs = getUsersByGroup($groupid, 0, -1, 'name');
	
    $users = $rs->users;  
	
	$userlist=null;
	if ($selected !=null && $selected != "") {
		$userlist = split(",", $selected);
	}	
	   
	$usersFilterList = array();	
	if ($userlist != null) {
		foreach ($userlist as $value) {
			$usersFilterList[$value] = $value;
		}
	}	
?>

<script type="text/javascript">

	var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";

	function getSelections(){
	   var selectedOnes = "";
	   var checks = document.getElementsByName("checklist");
	   for (i=0; i<checks.length; i++) {	
		   if (checks[i].checked) {
			   if (selectedOnes == "") {
				   selectedOnes = checks[i].value;
			   } else {
				   selectedOnes += ","+checks[i].value;
			   }
		   }
	   }
	   
	   window.opener.setSelectedUsers(selectedOnes);
	   window.close();
   }
</script>  

<h1>Choose Users</h1>
<form name="manageusers" action="" method="post">

<div id="usersdiv">
    <div class="formrow">
        <div id="linktypes" class="forminput">
         
        <?php        
            echo "<table class='table' cellspacing='0' cellpadding='3' border='0'>";
            echo "<tr>";
            echo "<th width='82%'>Users</th>";
            echo "<th width='90'></th>";
                      
            echo "</tr>";
            foreach($users as $user){
           		echo "<tr>";	
                      		
                echo "<td id='name-".$user->userid."'>".$user->name;                                
		        echo "</td>";
                
                echo "<td>";  
                if (sizeof($usersFilterList) > 0 
                		&& $usersFilterList[$user->userid]) {
                	echo "<input type='checkbox' name='checklist' checked value='".$user->userid."'></a>";
               } else {
                	echo "<input type='checkbox' name='checklist' value='".$user->userid."'></a>";
               }
                echo "</td>";
                
                echo "</tr>";
            }              
            echo "</table>";
        ?>
        </div>
    </div>
        
    <div class="formrow">
       <input type="button" value="Select" onclick="javascript:getSelections();"/>        
       <input type="button" value="Cancel" onclick="window.close();"/>        
    </div>
        
 </div>   
</form> 
    
       
<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>