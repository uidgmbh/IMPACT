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

    // check that user not already logged in
    if(isset($USER->userid)){
        header('Location: index.php');
        return;
    }

    $errors = array();
    $ref = optional_param("ref",$CFG->homeAddress."user.php",PARAM_TEXT);
    // check to see if form submitted
    if(isset($_POST["login"])){
        $username = required_param("username",PARAM_TEXT);
        $password = required_param("password",PARAM_TEXT);
        $referrer = required_param("referrer",PARAM_TEXT);
        if(userLogin($username,$password)){
            header('Location: '. $referrer);
        } else {
            array_push($errors,"Invalid login, please try again.");
        }
    }
    include_once("includes/header.php");
?>

<h1>Login to PolicyCommons</h1>


<p>Not yet registered? <a href="register.php">Sign Up!</a>
<?php
    if(!empty($errors)){
        echo "<div class='errors'>";
        echo $errors[0];
        echo "</div>";
    }
?>


<form name="login" action="login.php" method="post">
    <div class="formrow">
        <label class="formlabel" for="username">Username/Email:</label>
        <input class="forminput" id="username" name="username" size="30" value="">
    </div>
    <div class="formrow">
        <label class="formlabel" for="password">Password:</label>
        <input class="forminput" id="password" name="password" type="password"  size="30">
    </div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="login" id="login" name="login">
        <a href="forgot.php">Forgotten password?</a>
    </div>
    <input type="hidden" name="referrer" value="<?php print $ref; ?>"/>
</form>

<?php
    include_once("includes/footer.php");
?>