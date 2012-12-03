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
    include_once("config.php");
    include_once("includes/header.php");

    if(!isset($USER->userid)){
        header('Location: index.php');
        return;
    }
    echo "<h1>Manage Groups</h1>";

    $groupset = getMyAdminGroups();
    $groups = $groupset->groups;

    $groupid = optional_param("groupid","",PARAM_TEXT);


    //check user is an admin for the group.
    if($groupid != ""){
        $g = new Group($groupid);
        $g->load();
        if(!$g->isgroupadmin($USER->userid)){
            echo "You are not an administrator for this group";
            include_once("includes/footer.php");
            die;
        }
    }

    if(sizeof($groups) == 0){
        echo "You are not an administrator for any groups";
        include_once("includes/footer.php");
        die;
    }

    $group = getGroup($groupid);
    $errors = array();
    $groupname = stripslashes(optional_param("groupname",$group->name,PARAM_TEXT));
    $description = stripslashes(optional_param("description",$group->description,PARAM_TEXT));
    $website = optional_param("website",$group->website,PARAM_TEXT);
    $newmembers = optional_param("newmembers","",PARAM_TEXT);

    $location = optional_param("location",$group->location,PARAM_TEXT);
    $loccountry = optional_param("loccountry",$group->countrycode,PARAM_TEXT);


    // process the update if form submitted
    if(isset($_POST["updategroup"])){
        $gu = new User($group->groupid);
        $gu->load();
        if ($groupname == ""){
            array_push($errors,"Please enter a name for the group.");
        } else {
            $ge = new Group();
            $gee = $ge->groupNameExists($groupname,$group->groupid);
            if($gee instanceof Error){
                array_push($errors,$gee->message);
            } else {
                $gu->updateName($groupname);
                $gu->updateDescription($description);
                $gu->updateWebsite($website);
                $gu->updateLocation($location,$loccountry);
                $photofilename = uploadImage('photo',$errors,$CFG->IMAGE_WIDTH,$groupid);
                if($photofilename == "" && $group->photo == ""){
                    $photofilename = $CFG->DEFAULT_GROUP_PHOTO;
                }
                if($photofilename != ""){
                    $gu->updatePhoto($photofilename);
                }
            }
        }

        if(!empty($errors)){
            echo "<div class='errors'>The following problems when updating the group:<ul>";
            foreach ($errors as $error){
                echo "<li>".$error."</li>";
            }
            echo "</ul></div>";
        } else {
            echo "<p>Group updated</p>";

            // go through all the members and see if they match existing users if so add them to the group
            // show results back to user so they know who has/hasn't already got an account
            $memberArr = split(',',trim($newmembers));
            if(trim($newmembers) != "" && sizeof($memberArr) > 0 ){
                echo "<ul>";
                foreach($memberArr as $member){
                	$member = trim($member);
                    //check valid email address
                    if(!validEmail($member)){
                        echo "<li>".$member." is not a valid email address</li>";
                    } else {
                        //find out if existing user
                        $u = new User();
                        $u->setEmail($member);
                        $user = $u->getByEmail();
                        if($user instanceof User){
                            //user already exists in db
                            addGroupMember($group->groupid,$user->userid);
                            echo "<li>".$member." is a current Cohere user and has been added to the group.</li>";

                        } else {
                            //user doesn't exist so create user and send them an invite code
                            $newU = new User();
               				$names = split('@',$member);
                            $newU->add($member,$names[0],"","",'N',$CFG->AUTH_TYPE_COHERE,"","","");
                            $newU->setInvitationCode();
                            addGroupMember($group->groupid,$newU->userid);
                            echo "<li>".$member." is not a current Cohere user and has been invited to join.</li>";

                        }
                    }
                }
                echo "</ul>";
            }
        }

        //refresh loaded data
        $groupset = getMyAdminGroups();
        $groups = $groupset->groups;
        $group = getGroup($groupid);

    }

    $countries = getCountryList();
?>



<script type="text/javascript">
    function loadgroup(){
        var groupid = $('groupid').options[$('groupid').selectedIndex].value;
        window.location.href = "editgroup.php?groupid="+groupid;
    }
    function admintoggle(user){
        var id = user.id.replace('admin-','');
        var service="removegroupadmin";
        if(user.checked){
            var service = "makegroupadmin";
        }

        var reqUrl = SERVICE_ROOT + "&method="+service+"&groupid=<?php echo $group->groupid;?>&userid="+id ;

        new Ajax.Request(reqUrl, { method:'get',
            onSuccess: function(transport){
                var json = transport.responseText.evalJSON();
                if(json.error){
                    alert(json.error[0].message);
                    return;
                }
            }
        });
    }
    function deletemember(user){
        var id = user.id.replace('remove-','');
        var username = $('name-'+id).firstChild.nodeValue;
        var answer = confirm("Are you sure you want to remove "+ username +" from this group?");
        if(answer){
            //send request
            var reqUrl = SERVICE_ROOT + "&method=removegroupmember&groupid=<?php echo $group->groupid;?>&userid="+id ;

            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }
                    $('member-'+id).remove();
                }
            });

        } else {
            //uncheck
            $(user.id).checked = false;
        }
    }

    function deletegroup(){
        var answer = confirm("Are you sure you want to delete the group '<?php echo $group->name;?>'?");
        if(answer){
            //send request
            var reqUrl = SERVICE_ROOT + "&method=deletegroup&groupid=<?php echo $group->groupid;?>";

            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }
                    alert("Group '<?php echo $group->name;?>' has now been deleted.");
                    window.location.href = "editgroup.php";
                }
            });

        }
    }
</script>


<div class="formrow">
    <label class="formlabel" for="groupid">Group to manage:</label>

    <select class="forminput" name="groupid" id="groupid" onchange="loadgroup();">
        <option value=""></option>
        <?php
            foreach($groups as $g){
               echo "<option value='".$g->groupid."' ";
               if($g->groupid == $groupid){
                    echo "selected='true'";
               }
               echo ">".$g->name."</option>";
            }
        ?>
    </select>
</div>


<?php
    // if a groupid is not selected then end here
    if ($groupid == ""){
        include_once("includes/footer.php");
        die;
    }
?>


<form name="editgroup" action="" method="post" enctype="multipart/form-data">
    <div class="formrow">
        <span class="formsubmit"><span class="required">*</span> indicates required field</span>
    </div>
    <div class="formrow">
        <label class="formlabel" for="groupname">Name:</label>
        <input class="forminput" type="text" id="groupname" name="groupname" size="40" value="<?php print $groupname; ?>"><span class="required">*</span>
    </div>
    <div class="formrow">
        <label class="formlabel" for="description">Description:</label>
        <textarea class="forminput" id="description" name="description" cols="40" rows="5"><?php print $description; ?></textarea>
    </div>

    <div class="formrow">
		<label class="formlabel" for="location">Location: (town/city)</label>
		<input class="forminput" id="location" name="location" style="width:160px;" value="<?php echo $location; ?>">
		<select id="loccountry" name="loccountry" style="margin-left: 5px;width:160px;">
	        <option value="" >Country...</option>
	        <?php
	            foreach($countries as $code=>$c){
	                echo "<option value='".$code."'";
	                if($code == $loccountry){
	                    echo " selected='true'";
	                }
	                echo ">".$c."</option>";
	            }
	        ?>
	    </select>
    </div>

    <div class="formrow">
        <label class="formlabel" for="website">Website:</label>
        <input class="forminput" type="text" id="website" name="website" size="40" value="<?php print $website; ?>">
    </div>
    <div class="formrow">
        <label class="formlabel" for="photo">Current photo:</label>
        <img class="forminput" src="<?php print $group->photo; ?>" />
    </div>
    <div class="formrow">
        <label class="formlabel" for="photo">Replace photo with:</label>
        <input type="file" id="photo" name="photo" size="40" class="forminput">
    </div>
    <div class="formrow">
        <label class="formlabel" for="members">Members:</label>
        <div id="members" class="forminput">
        <?php
            $userset = $group->members;
            $users = $userset->users;
            if(sizeof($users)==0){
                echo "This group has no members.";
            } else {
                echo "<table class='table' cellspacing='0' cellpadding='3' border='0'>";
                echo "<tr>";
                echo "<th></th>";
                echo "<th class='table-th-center'>Admin</th>";
                echo "<th class='table-th-center'>Remove</th>";

                echo "</tr>";
                foreach($users as $u){
                    echo "<tr id='member-".$u->userid."'>";
                    echo "<td id='name-".$u->userid."'>";
                    //username
                    if($u->name == ""){
                        echo $u->getEmail();
                    } else {
                        echo $u->name;
                    }
                    echo "</td>";
                    echo "<td align='center'>";
                    //if user is admin
                    $disabled = "";
                    if($u->userid == $USER->userid){
                        $disabled = "disabled";
                    }
                    $checked = "";
                    if($group->isgroupadmin($u->userid)){
                        $checked = "checked='checked'";
                    }
                    echo "<input type='checkbox' id='admin-".$u->userid."' name='admin-".$u->userid."' ".$checked." ".$disabled." onchange='admintoggle(this);'>";
                    echo "</td>";
                    echo "<td align='center'>";
                    //delete user field
                    $disabled = "";
                    if($u->userid == $USER->userid){
                        $disabled = "disabled";
                    }
                    echo "<input type='checkbox' id='remove-".$u->userid."' name='remove-".$u->userid."' onchange='deletemember(this);' ".$disabled.">";
                    echo "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            }
        ?>
        </div>
    </div>
    <div class="formrow">
        <label class="formlabel" for="newmembers">Add Members:<br/>(comma separated)</label>
        <textarea class="forminput" id="newmembers" name="newmembers" cols="40" rows="5"><?php print $members; ?></textarea><br/>
        <div class="forminput">Please enter the email address of all those people you would like to join this group, all of these people will be sent an email notifying them of the group membership and any users who don't already have Cohere accounts will be invited to join.</div>

    </div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Save changes" id="updategroup" name="updategroup"/>
        <input type="button" value="Delete group" id="deletegroupbtn" name="deletegroupbtn" onclick="deletegroup();"/>
    </div>

</form>



<?php
    include_once("includes/footer.php");
?>
