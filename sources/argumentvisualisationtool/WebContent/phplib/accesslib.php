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

/**
 * Logs the into the site
 *
 * @uses $CFG
 * @param string $username
 * @param string $password
 * @return boolean whether login successful or not
 */
function userLogin($username,$password){
    global $CFG;
    clearSession();

    if($password == ""){
        return false;
    }
    $user = new User();
    $user->setEmail($username);
    $user = $user->getByEmail();
    if ($user instanceof Error) {
        //user doesn't exist so see if openlearn user
        $OLdata = validateAgainstOpenLearn($username, $password);
        if ($OLdata['email'] != "" && $OLdata['name'] != "") {
            //user has been validates against openlearn
            $user = new User();
            $user->setEmail($OLdata['email']);
            $u = $user->getByEmail();

            if ($u instanceof Error) {
                // i.e. user doesn't already exist.
                $u = new User();
                $u->add($OLdata['email'],$OLdata['name'],$password,"",'N',$CFG->AUTH_TYPE_OPENLEARN,"","","");
            } else if ($u instanceof User) {
                $u->updateName($OLdata['name']);
                $u->updateLastLogin();
           } else {
                return false;
            }
            createSession($u);
            $u->resetInvitationCode();
            return true;
        } else {
            //user hasn't been validated against openlearn
            return false;
        }
    } else if ($user instanceof User)  {
        // If the user logging in is an OpenLearn user,
        // validate them against open learn then update the name in case they have changed.
        if ($user->getAuthType() == $CFG->AUTH_TYPE_OPENLEARN) {
            $OLdata = validateAgainstOpenLearn($username, $password);
            if ($OLdata['email'] != "" && $OLdata['name'] != "") {
                $user->updateName($OLdata['name']);
                createSession($user);
                $user->resetInvitationCode();
                return true;
            } else {
                return false;
            }
        } else {
            $passwordCheck = $user->validPassword($password);
            if($passwordCheck){
                createSession($user);
                $user->updateLastLogin();
                $user->resetInvitationCode();
                return true;
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}

/**
 * Start a session
 *
 * @return string | false
 */
function startSession($time = 99999999, $ses = 'Cohere') {
    ini_set('session.cache_expire', $time);
    session_set_cookie_params($time);
    session_name($ses);
    session_start();

    // Reset the expiration time upon page load
    if (isset($_COOKIE[$ses])){
    	setcookie($ses, $_COOKIE[$ses], time() + $time, "/");
    }
}
/**
 * Clear all session variables
 *
 */
 function clearSession() {
    $_SESSION["session_userid"] = "";
    setcookie("user","",time()-3600, "/");
 }

 /**
  * Create the user session details.
  * (also updates the last login date/time)
  */
 function createSession($user) {
    $_SESSION["session_userid"] = $user->userid;
    setcookie("user",$user->userid,time()+99999999,"/");
    //update last login for this user
    $user->updateLastLogin();
 }

/**
 * Validates the user against openlearn
 *
 * @uses $CFG
 * @param string $username
 * @param string $password
 * @return array containing email and name keys
 */
function validateAgainstOpenLearn($username, $password) {
    global $CFG;

    $data = "username=" . urlencode($username) . "&password=" . urlencode($password);

    $ch = curl_init();
    $cookiefile = $CFG->workdir."COOKIES_TEMP_".microtime().".txt";
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookiefile);
    curl_setopt($ch, CURLOPT_URL,$CFG->auth_openlearn_login_url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    ob_start();      // prevent any output
    curl_exec ($ch); // execute the curl command
    ob_end_clean();  // stop preventing output

    curl_close ($ch);
    unset($ch);

    $cookie = is_file( $cookiefile ) ? file($cookiefile) : false;
    if( !empty($cookie) ) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookiefile);
        curl_setopt($ch, CURLOPT_URL,$CFG->auth_openlearn_validate_url);
        $buf2 = curl_exec ($ch);
        $reply = $buf2;
        curl_close ($ch);
    }
    // now delete the cookie file (don't need/want to keep these)
    @unlink($cookiefile);

    return parseOpenLearnResponse($reply);
}


/**
 * Process and extract data from the data returned from openlearn
 *
 * @param string $data xml data string
 * @return array containing email and name keys
 */
function parseOpenLearnResponse($data){
    $retdata = array();
    $retdata['email'] = "";
    $retdata['name'] = "";

    if($data != null){
        $xml_parser = xml_parser_create();
        $values = null;
        $index = null;
        xml_parse_into_struct($xml_parser, $data, $values, $index);
        xml_parser_free($xml_parser);

        foreach ($index as $key=>$val) {
            if ($key == "EMAIL") {
                $retdata['email'] = $values[$val[0]]['value'];
            } if ($key == "DISPLAYNAME") {
                $retdata['name']= $values[$val[0]]['value'];
            }
        }
    }
    return $retdata;
}

/**
 * Check that the session is active and valid for the user passed.
 */
function validateSession($userid) {
	try {
		if (isset($_SESSION["session_userid"]) && $_SESSION["session_userid"] == $userid) {
			return "OK";
		} else {
			return "Session Invalid";
	    }
	} catch(Exception $e) {
		return "Session Invalid";
	}
}

/**
 * Checks if current user is logged in
 * if not, they get redirected to homepage
 *
 */
function checkLogin(){
    global $USER,$CFG;
    $url = "http" . ((!empty($_SERVER["HTTPS"])) ? "s" : "") . "://".$_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
    if(!isset($USER->userid)){
        header('Location: '.$CFG->homeAddress.'login.php?ref='.urlencode($url));
        die;
    }
}
?>