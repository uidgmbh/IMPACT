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
    
    
    // check that user not already logged in
    if(isset($USER->userid)){
        header('Location: index.php');  
        return; 
    }
    
?>

<h1>Forgotten password?</h1>

<p>Please enter your email address and we'll send you a link where you can reset your password.</p>

<?php
    $errors = array();
    
    // check to see if form submitted
    if(isset($_POST["reset"])){
        $email = required_param("email",PARAM_TEXT);
        
        $u = new User();
        $u->setEmail($email);
        $user = $u->getByEmail();
        
        //check user exists
        if(!$user instanceof User || $user->getAuthType() != $CFG->AUTH_TYPE_COHERE){
            array_push($errors,"Email address not found - you can only reset the password for Cohere authenticated accounts, (not OpenID or Open University OUCUs)");   
        } else {
            //set validation code
            if($user->getInvitationCode() == ""){
                $user->setInvitationCode();   
            }
            //send email
            $paramArray = array ($user->name,$CFG->homeAddress,$user->userid,$user->getInvitationCode());
            sendMail("resetpassword","Reset Cohere password",$user->getEmail(),$paramArray);
            echo "An email has been sent for you to reset your password.";
            include_once("includes/footer.php");
            die;
        }
    }
    

?>

<?php 
    if(!empty($errors)){
        echo "<div class='errors'>";
        echo $errors[0];
        echo "</div>";
    }
?>

<form name="forgot" action="forgot.php" method="post">
    <div class="formrow">
        <label class="formlabel" for="email">Email:</label>
        <input class="forminput" id="email" name="email" size="30" value="">
        
    </div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Submit" id="reset" name="reset">
    </div>
   
</form>

<?php
    include_once("includes/footer.php");
?>
