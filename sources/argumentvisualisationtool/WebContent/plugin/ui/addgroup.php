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
    checkLogin();
    include_once($CFG->dirAddress."includes/dialogheader.php");

    echo "<h1>Create Group</h1>";
    $errors = array();

    $groupname = optional_param("groupname","",PARAM_TEXT);
    $description = optional_param("description","",PARAM_TEXT);
    $website = optional_param("website","",PARAM_TEXT);
    $members = optional_param("members","",PARAM_TEXT);

    if(isset($_POST["creategroup"])){
        if ($groupname == ""){
            array_push($errors,"Please enter a name for the group.");
        } else {
            $group = addGroup($groupname);

            //echo "groupid=". $group->groupid;
            //exit();

            if($group instanceof Error){
                array_push($errors,$group->message);
            } else {
            //group is a new user Ha!
                $gu = new User($group->groupid);
                $gu->load();
                $gu->updateDescription($description);
                $gu->updateWebsite($website);
                $photofilename = uploadImage('photo',$errors,$CFG->IMAGE_WIDTH, $group->groupid);
                //echo "photofilename:".$photofilename."<br>";
                if($photofilename == ""){
                    $photofilename = $CFG->DEFAULT_GROUP_PHOTO;
                }
                $gu->updatePhoto($photofilename);
                echo "<p>Group created</p>";

                // go through all the members and see if they match existing users if so add them to the group
                // show results back to user so they know who has/hasn't already got an account
                $memberArr = split(',',trim($members));
                if(trim($members) != "" && sizeof($memberArr) > 0 ){
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
?>
    <script type="text/Javascript">
        function closeGroupDialog(){
            try {
                var newurl = URL_ROOT + "group.php?groupid=<?php echo $group->groupid;?>";
                window.opener.location.href = newurl;

            } catch(err) {
                //do nothing
            }
            window.close();

        }

    </script>
<?php
                echo "<p>Visit the <a href='javascript:closeGroupDialog();'>group page</a>.</p>";
                include_once($CFG->dirAddress."includes/dialogfooter.php");
                die;
            }
        }
    }
    if(!empty($errors)){
        echo "<div class='errors'>The following problems when creating the group, please try again:<ul>";
        foreach ($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul></div>";
    }
?>

<form name="addgroup" action="addgroup.php" method="post" enctype="multipart/form-data">

    <div class="formrow">
        <label class="formlabel" for="groupname">Name:</label>
        <input class="forminput" type="text" id="groupname" name="groupname" size="40" value="<?php print $groupname; ?>">
    </div>
    <div class="formrow">
        <label class="formlabel" for="description">Description:</label>
        <textarea class="forminput" id="description" name="description" cols="40" rows="5"><?php print $description; ?></textarea>
    </div>
    <div class="formrow">
        <label class="formlabel" for="website">Website:</label>
        <input class="forminput" type="text" id="website" name="website" size="40" value="<?php print $homepage; ?>">
    </div>
    <div class="formrow">
        <label class="formlabel" for="photo">Photo:</label>
        <input class="forminput" type="file" id="photo" name="photo" size="40">
    </div>
    <div class="formrow">
        <label class="formlabel" for="members">Members:<br/>(comma separated)</label>
        <textarea class="forminput" id="members" name="members" cols="40" rows="5"><?php print $members; ?></textarea><br/>
        <div class="formhelp">Please enter the email address of all those people you would like to join this group, all of these people will be sent an email notifying them of the group membership and any users who don't already have Cohere accounts will be invited to join.</div>

    </div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Create" id="creategroup" name="creategroup">
    </div>

</form>

<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>
