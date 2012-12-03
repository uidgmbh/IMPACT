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
    checkLogin();
    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/scriptaculous/scriptaculous.js' type='text/javascript'></script>");
    include_once($CFG->dirAddress."includes/dialogheader.php");

    $errors = array();

	$type = optional_param("type","",PARAM_TEXT); 
       
	$roleid = optional_param("roleid","",PARAM_TEXT); 
	$rolename = optional_param("rolename","",PARAM_TEXT);
    
    
    if(isset($_POST["saverole"])){  
    	if ($roleid != "") {
            $origrole = getRole($roleid);
 	    	if ($rolename != "") {
 	    	    if ($_FILES['roleicon']['name'] != "") {
	    	        $photofilename = uploadImage('roleicon',$errors,$CFG->ICON_WIDTH);   
	    	        if ($photofilename == null || $photofilename == "") {
	       	        	editRole($roleid, $rolename,$origrole->image);
	    	        } else {
	    	        	$photofilename = "uploads/".$USER->userid."/".$photofilename;
	    	        	editRole($roleid, $rolename, $photofilename);
	    	        }
 	    	    } else {
                    editRole($roleid, $rolename,$origrole->image);   
                }
	    	} else {
	            array_push($errors,"You must enter a link type name.");  
	        }   
    	} else {
            array_push($errors,"Error passing link type id.");  
    	}
    } else if(isset($_POST["addrole"])){ 
    	if ($rolename != "") {
   	        $photofilename = uploadImage('roleicon',$errors,$CFG->ICON_WIDTH);    	    	
	        if ($photofilename == null || $photofilename == "") {
	        	addRole($rolename);
	        } else {
	        	$photofilename = "uploads/".$USER->userid."/".$photofilename;
	        	addRole($rolename, $photofilename);
	        }
    	} else {
            array_push($errors,"You must enter a link type name.");  
        }   
    } 
    
    $rs = getUserRoles();
    $roles = $rs->roles;        
?>

<script type="text/javascript">

   var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
   var rolesArray = <?php echo json_encode($roles) ?>;
   
   function deleteRole(objno){
        var name = $('rolelabelval'+objno).value;
        var answer = confirm("Are you sure you want to delete the role '"+name+"'?\n\nNote: Any links using this role will be replaced with the role 'Idea'");
        if(answer){
            //send request
            var reqUrl = SERVICE_ROOT + "&method=deleterole&roleid="+objno;
            
            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    } 
                    //alert("Role "+name+" has now been deleted.");
                    window.location.href = "role.php";
                }
            });
            
        }  
    }
    
    function editRole(objno){
    	cancelAddRole();
   		cancelAllEdits();
   		
        $('editroleform'+objno).show();
        $('savelink'+objno).show();
        
        $('rolelabeldiv'+objno).hide();
        $('editrolelink'+objno).hide();
        $('editlink'+objno).hide();        
   }
    
    function cancelEditRole(objno){
         $('editroleform'+objno).hide();
         if ($('savelink'+objno)) {
        	 $('savelink'+objno).hide();
         }
         
       	 $('rolelabeldiv'+objno).show();
         if ($('editrolelink'+objno)) {
        	 $('editrolelink'+objno).show();
         }
         if ($('editlink'+objno)) {
        	 $('editlink'+objno).show();
         }
    }
    
    function cancelAllEdits() {
		var array = document.getElementsByTagName('div');
		for(var i=0;i<array.length;i++) {
			if (array[i].id.startsWith('editroleform')) {
				var objno = array[i].id.substring(12);
				cancelEditRole(objno);				
			}
		}    	    	
    }
    
   	function addRole(){
   		cancelAllEdits();
    	$('newroleform').show();
        $('addnewrolelink').hide();
	}
      
	function cancelAddRole(){
        $('newroleform').hide();
        $('addnewrolelink').show();
   	}

	/**
	 * If the parent was the connection window pass back the selection and close, else close.
	 */
	function saveTypeSelection() {
		if (window.opener.loadConnectionNodeType) {
			// get selected role
			var roleid = "";
			var radios = document.getElementsByName('selectedrole');
			for (var i=0; i< radios.length; i++) {
				var next = radios[i];
				if (next.checked) {
					roleid = next.value;
					break;
				}
			}
			var role = null;
			if (roleid != "") {
				for (var j=0; j<rolesArray.length; j++) {
					var next = rolesArray[j];
					if (next.roleid == roleid) {
						role = next;
						break;
					}
				}
				//alert("role = "+roleid);
				if (role != null) {
					window.opener.loadConnectionNodeType(role);
				}
			}
	    }
	    window.close();
	}
</script>  

<?php 
	if(!empty($errors)){
        echo "<div class='errors'>The following problems were found, please try again:<ul>";
        foreach ($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul></div>";
    }
?>

<?php if ($type == "selection") { ?>
	<h1>Pick new Type for selected Idea</h1>
<?php } else { ?>
	<h1>Manage Idea Types</h1>
<?php } ?>

<div id="rolesdiv">
    <div class="formrow">
        <a id="addnewrolelink" href="javascript:addRole()" class="form">add new</a>        
    </div>
    
   <div id="newroleform" class="formrow" style="display:none; clear:both;">
   		<form id="addrole" name="addrole" action="role.php" method="post" enctype="multipart/form-data">
        <div class="subform" style="width: 430px;">
            <div class='subformrow'><label class='formlabel' style='width: 50px' for='rolename'>Name:</label><input type='text' class='forminput' size='35' id='rolename' name='rolename' value=''/></div>
            <div class='subformrow'><label class='formlabel' style='width: 50px' for='roleicon'>Icon:</label><input class='forminput' type='file' id='roleicon' name='roleicon' size='35'></div>                
            <div class="subformrow">
            	<input class="subformbutton" style="margin-left:54px;" type="submit" value="Add" id="addrole" name="addrole">            
                <input class="subformbutton" style="margin-left:7px;" type="button" name="Cancel" value="Cancel" onclick="cancelAddRole();">
            </div>
        </div>
        </form>
    </div>

    <div class="formrow">
        <div id="roles" class="forminput">
         
        <?php        
            echo "<table class='table' cellspacing='0' cellpadding='3' border='0' style='margin: 0px;'>";
            echo "<tr>";
            if ($type == "selection") { 
            	echo "<th width='20'>Pick</th>";
            }
            echo "<th width='45'>&nbsp;</th>";
            echo "<th width='360'>&nbsp;</th>";
            echo "<th width='90'>Action</th>";
                      
            echo "</tr>";
            foreach($roles as $role){
                echo "<tr id='role-".$role->roleid."'>";

                if ($type == "selection") { 
					echo '<td><input type="radio" id="selectedrole" name="selectedrole" value="'.$role->roleid.'" /></td>';
                }
                
                echo "<td>";
                if ($role->image != null && $role->image != "") {
                	echo "<img border='0' src='".$CFG->homeAddress.$role->image."' />";
                } else {
                	echo "<img border='0' src='".$CFG->homeAddress."images/nodetypes/blank.gif' />";
                }
                echo "</td>";
                
                echo "<td id='second-".$role->roleid."'>";
                
		        echo "<div class='subform' id='editroleform".$role->roleid."' style='width: 370px; display:none; clear:both;'>";
		   		echo '<form name="manageroles"'.$role->roleid.' action="role.php" method="post" enctype="multipart/form-data">';
		   		echo "<input name='roleid' type='hidden' value='".$role->roleid."' />";
		        echo "<div class='subformrow'><label class='formlabel' style='width: 50px' for='rolename'>Name</label><input type='text' class='forminput' size='35' id='rolename' name='rolename' value=\"".htmlspecialchars($role->name)."\"/></div>";
                echo "<div class='subformrow'><label class='formlabel' style='width: 50px' for='roleicon'>Replace Icon</label><input type='file' class='forminput' size='35' id='roleicon' name='roleicon' value='' /></div>";
 		        echo "<div class='subformrow' id='savelink".$role->roleid."' style='display:none; clear:both;'>";
                echo '<input class="subformbutton" style="margin-left:54px;" type="submit" value="Save" id="saverole" name="saverole" />';
                echo '<input class="subformbutton" style="margin-left:7px;" type="button" value="Cancel" onclick="javascript:cancelEditRole(\''.$role->roleid.'\');" />';
                echo '</div>';
                echo "</form>";
                echo "</div>";
                                
                echo "<div id='rolelabeldiv".$role->roleid."'>";
		        echo "<span class='labelinput' style='width: 90%' id='rolelabel".$role->roleid."'>".htmlspecialchars($role->name)."</span>";
                echo "<input type='hidden' id='rolelabelval".$role->roleid."' value=\"".htmlspecialchars($role->name)."\"/>";
		        echo "</div>";	
		        
                echo "</td>";
                
                echo "<td id='third-".$role->roleid."'>";         
                if ($role->name != $CFG->DEFAULT_NODE_TYPE) {     
                    echo "<div id='editlink".$role->roleid."'>";
    				echo "<a id='editrolelink".$role->roleid."' href='javascript:editRole(\"".$role->roleid."\")' class='form'>edit</a>&nbsp;|&nbsp;";
     				echo "<a id='deleterolelink".$role->roleid."' href='javascript:deleteRole(\"".$role->roleid."\")' class='form'>delete</a>";
     				echo "</div>";
                } else {
                    echo "<span style='color:silver;'>default</a>";
                }
                echo "</td>";
                
                echo "</tr>";
            }              
            echo "</table>";
        ?>
        </div>
   </div>
        
    <div class="formrow">
    <?php if ($type == "selection") { ?>
    	<input type="button" value="Save Selection" onclick="javascript: saveTypeSelection()"/>    
    <?php } else { ?>
        <input type="button" value="Close" onclick="window.close();"/>
    <?php } ?>
    </div>
        
</div>   
    
       
<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>