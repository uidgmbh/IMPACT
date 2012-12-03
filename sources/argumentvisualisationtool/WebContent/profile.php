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
    include_once("phplib/jmathai-twitter-async-12fa620/EpiCurl.php");
    include_once("phplib/jmathai-twitter-async-12fa620/EpiOAuth.php");
    include_once("phplib/jmathai-twitter-async-12fa620/EpiTwitter.php");

    // check that user logged in
    if(!isset($USER->userid)){
        header('Location: index.php');
        return;
    }

    echo "<h1>Edit Profile</h1>";
    $errors = array();

    $email = optional_param("email",$USER->getEmail(),PARAM_TEXT);
    $newpassword = optional_param("newpassword","",PARAM_TEXT);
    $confirmnewpassword = optional_param("confirmnewpassword","",PARAM_TEXT);
    $fullname = optional_param("fullname",$USER->name,PARAM_TEXT);
    $description = optional_param("description",$USER->description,PARAM_TEXT);

    $homepage = optional_param("homepage",$USER->website,PARAM_URL);
    $homepage2 = optional_param("homepage",$USER->website,PARAM_TEXT);

    $privatedata = optional_param("defaultaccess",$USER->privatedata,PARAM_ALPHA);

    $location = optional_param("location",$USER->location,PARAM_TEXT);
    $loccountry = optional_param("loccountry",$USER->countrycode,PARAM_TEXT);

    $newtags = optional_param("newtags","",PARAM_TEXT);
    $removetagsarray = optional_param("removetags","",PARAM_TEXT);

	$u = new User($USER->userid);
	$user = $u->load();
   	$tags = array();
    if(isset($user->tags)) {
    	$tags = $user->tags;
    }

    $countries = getCountryList();

    if(isset($_POST["update"])){

        // check email,& full name provided
        if (!validEmail($email)) {
            array_push($errors,"Please enter a valid email address.");
        } else {
            //update email address
            if(!$user->updateEmail($email)){
                array_push($errors,"That email address is already in use, please select another one.");
            }
        }
        if ($fullname == ""){
            array_push($errors,"Please enter your full name.");
        } else {
            $user->updateName($fullname);
        }
        // update password
        if($newpassword != ""){
            if ($newpassword != $confirmnewpassword){
                array_push($errors,"The password and password confirmation don't match.");
            } else {
                $user->updatePassword($newpassword);
            }
        } else if($user->getInvitationCode() != "" && $newpassword == ""){
            array_push($errors,"You must provide a password.");

        }

        // update description and homepage
        $user->updateDescription($description);
        if($homepage2 != "" && $homepage != $homepage2){
            array_push($errors,"Please enter a full valid URL (including 'http://') for your homepage.");
            $homepage = $homepage2;
        } else {
            $user->updateWebsite($homepage);
        }
        $user->updatePrivate($privatedata);

        $user->updateLocation($location,$loccountry);

        // update photo
        $photofilename = uploadImage('photo',$errors,$CFG->IMAGE_WIDTH);
        if($photofilename != ""){
            $user->updatePhoto($photofilename);
        }

        // remove from this user any tags marked for removal
        if($removetagsarray != "" && sizeof($removetagsarray) > 0){
            for($i=0; $i<sizeof($removetagsarray); $i++){
                if($removetagsarray[$i] != ""){
            		$user->removeTag($removetagsarray[$i]);
            	}
            }
        }

        // Add any new tags
        $newtagsarray = split(',', $newtags);
        if(sizeof($newtagsarray) != 0){
            foreach($newtagsarray as $tagname){
            	$tagname = trim($tagname);
            	if ($tagname && $tagname != "") {
                	$tag = addTag($tagname);
                	if ($tag && $tag->tagid) {
                		$user->addTag($tag->tagid);
                	}
            	}
            }
        }

        if(empty($errors)){
            //reset validation code
            $user->resetInvitationCode();
            echo "Profile successfully updated";
            include_once("includes/footer.php");
            die;
        }

        $USER = new User($_SESSION["session_userid"]);
        $USER->load();
    }
?>


<?php
    if(!empty($errors)){
        echo "<div class='errors'>The following problems were found with your form, please try again:<ul>";
        foreach ($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul></div>";
    }
?>

<script type="text/javascript">

function toggleTags() {
	if ( $("tagsdiv").style.display == "block") {
		$("tagsdiv").style.display = "none";
		$("tagsimg").src=URL_ROOT+"images/arrow-right-green.png";
	} else {
		$("tagsdiv").style.display = "block";
		$("tagsimg").src=URL_ROOT+"images/arrow-down-green.png";
	}
}

function init() {
    // set up auto complete for tags
	new Ajax.Autocompleter("newtags", "newtags_choices", "<?php echo $CFG->homeAddress; ?>api/service.php?method=gettagsbyfirstcharacters&format=list&scope=all", {paramName: "q", minChars: 1, tokens: ","});
}

window.onload = init;

</script>

<p><span class="required">*</span> indicates required field</p>
<form name="editprofile" action="profile.php" method="post" enctype="multipart/form-data">

    <?php

        // if an openlearn user then can't change email/password
        if ($USER->getAuthType() != $CFG->AUTH_TYPE_OPENLEARN){
    ?>
    <div class="formrow">
    <label class="formlabel" for="photo">Current photo:</label>
    <img class="forminput" src="<?php print $USER->photo; ?>"/>
    </div>
    <div class="formrow">
    <label class="formlabel" for="photo">Replace photo with:</label>
    <input class="forminput" type="file" id="photo" name="photo" size="40">
    </div>
   <div class="formrow">
        <label class="formlabel" for="email">Email:</label>
        <input class="forminput" id="email" name="email" size="40" value="<?php print $email; ?>" <?php if($USER->getAuthType() == $CFG->AUTH_TYPE_OPENLEARN){ echo 'disabled="true"';}?>><span class="required">*</span>
    </div>

    <div class="formrow">
        <label class="formlabel" for="newpassword">New Password:</label>
        <input class="forminput" id="newpassword" name="newpassword" type="password"  size="30" value="">
        <?php
            if($USER->getInvitationCode() != ""){
                echo '<span class="required">*</span>';
            }
        ?>
    </div>
    <div class="formrow">
        <label class="formlabel" for="confirmnewpassword">Confirm New Password:</label>
        <input class="forminput" id="confirmnewpassword" name="confirmnewpassword" type="password" size="30" value="">
        <?php
            if($USER->getInvitationCode() != ""){
                echo '<span class="required">*</span>';
            }
        ?>
    </div>
    <?php
        }
    ?>
    <div class="formrow">
        <label class="formlabel" for="fullname">Full name:</label>
        <input class="forminput" type="text" id="fullname" name="fullname" size="40" value="<?php print $fullname; ?>"><span class="required">*</span>
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
        <label class="formlabel" for="homepage">Homepage:</label>
        <input class="forminput" type="text" id="homepage" name="homepage" size="40" value="<?php print $homepage; ?>">
    </div>
    <div class="formrow">
        <label class="formlabel" for="defaultaccess">By default keep my data:</label>
        <input class="forminput" type="radio" id="defaultaccessprivate" name="defaultaccess" value="Y"
        <?php if($privatedata == "Y"){ echo "checked='checked'";}?>>Private
        <input type="radio" id="defaultaccesspublic" name="defaultaccess" value="N"
        <?php if($privatedata == "N"){ echo "checked='checked'";}?>>Public
    </div>

    <div class="formrow">
    	<label class="formlabel" for="newtags">Add Tags:</label>
		<input class="forminput" style="width:290px; font-size: 10pt;" id="newtags" name="newtags" value="<?php echo $newtags; ?>" /> (comma separated)
   		<div id="newtags_choices" class="autocomplete"></div>
	</div>

	<div class="formrow">
  	<?php if (sizeof($tags) > 0) { ?>
	    <label class="formlabel">Tags: <img style="vertical-align: bottom;" id="tagsimg" src="<?php echo $CFG->homeAddress."images/arrow-right-green.png" ?>" onclick="javascript: toggleTags()" border="0" alt="Tags" /></label>
		<div id="tagsdiv" class="forminput" style="display: none; float:left">
		   	<div class="subform" style="border: 1px solid #40B5B2; padding: 5px; float:left;	width: 405px;" id="tagform">
		   	<?php
		            $i = 0;
		            foreach($tags as $tag){
		              $class = "subforminput";
		              echo '<div id="tagfield'.$i.'" class="subformrow">';
	                  echo '<input type="checkbox" class="'.$class.'" id="removetags" name="removetags[]" value="'.$tag->tagid.'"';
		              if(sizeof($removetagsarray) > 0){
		                  for($j=0; $j<sizeof($removetagsarray); $j++){
			            	  if ($removetagsarray[$j] != ""
			            		  && $removetagsarray[$j] == $tag->tagid) {
			                      echo ' checked="true"';
			            		  break;
			            	  }
		                  }
		              }
	                  echo '>&nbsp;&nbsp;'.$tag->name.'<br/>';
		              echo '</div>';
		              $i++;
		          }
		      ?>
		      <label>(Select to remove)</label>
		  </div>
	   </div>
    <?php } ?>
	</div>
	<div class="formrow">
        <input class="formsubmit" type="submit" value="Update" id="update" name="update">
    </div>
<?php
	/*$key = $USER->getTwitterKey();
	if ($key == "") {
		echo '<div class="formrow">';
		$twitterObj = new EpiTwitter($CGF->TWITTER_CONSUMER_KEY, $CFG->TWITTER_CONSUMER_SECRET);
		echo '<span class="formlabel">&nbsp;</span>';
		echo '<a class="forminput" href="' . $twitterObj->getAuthorizationUrl() . '">Authorize with Twitter</a>';
		echo "</div>";
	} else {
		echo '<div class="formrow">';
		echo '<span class="formlabel">&nbsp;</span>';
		echo '<span class="forminput">Cohere is Authorized with your Twitter Account</span>';
		echo "</div>";

		echo '<div class="formrow">';
		$twitterObj = new EpiTwitter($CGF->TWITTER_CONSUMER_KEY, $CFG->TWITTER_CONSUMER_SECRET);
		echo '<span class="formlabel">&nbsp;</span>';
		echo '<a class="forminput" href="' . $twitterObj->getAuthorizationUrl() . '">Re-Authorize with Twitter</a>';
		echo "</div>";
	}*/
?>
</form>


<?php
	include_once("includes/footer.php");
?>