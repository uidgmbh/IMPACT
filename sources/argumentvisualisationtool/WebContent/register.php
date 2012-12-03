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
    // check if user already logged in
    if(isset($USER->userid)){
        header('Location: index.php');
        return;
    }
    include_once("includes/header.php");

    require_once("phplib/recaptcha-php-1.10/recaptchalib.php");

    $errors = array();
    $email = optional_param("email","",PARAM_TEXT);
    $password = optional_param("password","",PARAM_TEXT);
    $confirmpassword = optional_param("confirmpassword","",PARAM_TEXT);
    $fullname = optional_param("fullname","",PARAM_TEXT);
    $description = optional_param("description","",PARAM_TEXT);

    $location = optional_param("location","",PARAM_TEXT);
    $loccountry = optional_param("loccountry","",PARAM_TEXT);

    $homepage = optional_param("homepage","",PARAM_URL);
    $homepage2 = optional_param("homepage","",PARAM_TEXT);

    $recaptcha_challenge_field = optional_param("recaptcha_challenge_field","",PARAM_TEXT);
    $recaptcha_response_field = optional_param("recaptcha_response_field","",PARAM_TEXT);

    $privatedata = optional_param("defaultaccess","Y",PARAM_ALPHA);

    if(isset($_POST["register"])){
        // check email, password & full name provided
        if (!validEmail($email)) {
            array_push($errors,"Please enter a valid email address.");
        } else {
	        if ($password == ""){
	            array_push($errors,"Please enter a password.");
	        }
	        if ($fullname == ""){
	            array_push($errors,"Please enter your full name.");
	        }
	        // check password & confirm password match
	        if ($password != $confirmpassword){
	            array_push($errors,"The password and password confirmation don't match.");
	        }

	        // check url
	        if($homepage2 != "" && $homepage != $homepage2){
	            array_push($errors,"Please enter a full valid URL (including 'http://') for your homepage.");
	            $homepage = $homepage2;
	        }

			if (empty($errors)) {
		        // check username not already in use

				$u = new User();
				$u->setEmail($email);
				$user = $u->getByEmail();

				if($user instanceof User){
					array_push($errors,"This email address is already in use, please either login or select a different email address.");
				} else {
					//check recaptcha is valid
					$resp = recaptcha_check_answer ($CFG->RECAPTCHA_PRIVATE,
											$_SERVER["REMOTE_ADDR"],
											$recaptcha_challenge_field,
											$recaptcha_response_field);

					if ($recaptcha_response_field == "" || !$resp->is_valid) {
						array_push($errors,"The reCAPTCHA wasn't entered correctly. Please try it again. ");
					   // "(reCAPTCHA said: " . $resp->error . ")
					} else {

						// only create user if no error so far
						// create new user
						$u->add($email,$fullname,$password,$homepage,'N',$CFG->AUTH_TYPE_COHERE,"",$description,'');
						$u->updatePrivate($privatedata);
						$u->updateLocation($location,$loccountry);

						$photofilename = "";
						if(empty($errors)){
							// upload image if provided
							if ($_FILES['photo']['tmp_name'] != "") {
								// Can't upload photo without userid
								$USER = $u;
								$photofilename = uploadImage('photo',$errors,$CFG->IMAGE_WIDTH);
								$USER = null;
							} else {
								$photofilename = $CFG->DEFAULT_USER_PHOTO;
							}
						}

						$u->updatePhoto($photofilename);

						echo "<h1>Registration successful</h1>";
					}
				}
	        }
        }

        if(!empty($errors)){
            echo "<div class='errors'>There where the following issues with your registration:<ul>";
            foreach ($errors as $error){
                echo "<li>".$error."</li>";
            }
            echo "</ul></div>";
        } else {
        	echo "You can now <a href='login.php'>log in</a>";
        }

        include_once("includes/footer.php");
        die;
    }

    $countries = getCountryList();
?>
<h1>Register</h1>

<?php
    if(!empty($errors)){
        echo "<div class='errors'>The following problems were found with your form, please try again:<ul>";
        foreach ($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul></div>";
    }
?>

<p><span class="required">*</span> indicates required field</p>

<form name="register" action="register.php" method="post" enctype="multipart/form-data">

    <div class="formrow">
        <label class="formlabel" for="email">Email:</label>
        <input class="forminput" id="email" name="email" size="40" value="<?php print $email; ?>"><span class="required">*</span>
    </div>
    <div class="formrow">
        <label class="formlabel" for="password">Password:</label>
        <input class="forminput" id="password" name="password" type="password"  size="30" value="<?php print $password; ?>"><span class="required">*</span>
    </div>
    <div class="formrow">
        <label class="formlabel" for="confirmpassword">Confirm Password:</label>
        <input class="forminput" id="confirmpassword" name="confirmpassword" type="password" size="30" value="<?php print $confirmpassword; ?>"><span class="required">*</span>
    </div>
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
        <label class="formlabel" for="photo">Photo:</label>
        <input class="forminput" type="file" id="photo" name="photo" size="40">
    </div>
    <div class="formrow">
        <label class="formlabel" for="defaultaccess">By default keep my data:</label>
        <input class="forminput" type="radio" id="defaultaccessprivate" name="defaultaccess" value="Y"
        <?php if($privatedata == "Y"){ echo "checked='checked'";}?>>Private
        <input type="radio" id="defaultaccesspublic" name="defaultaccess" value="N"
        <?php if($privatedata == "N"){ echo "checked='checked'";}?>>Public
    </div>

    <div class="formrow">
        <label class="formlabel" for="recaptcha_challenge_field">Are you human?</label>
        <?php echo recaptcha_get_html($CFG->RECAPTCHA_PUBLIC); ?>
    </div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Register" id="register" name="register">
    </div>

</form>

<?php
    include_once("includes/footer.php");
?>