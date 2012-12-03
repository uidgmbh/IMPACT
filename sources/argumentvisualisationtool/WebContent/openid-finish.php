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

require_once "config.php";
require_once "openid-common.php";
include_once("includes/header.php");
$consumer = getConsumer();
// Complete the authentication process using the server's response.
$return_to = getReturnTo();
$response = $consumer->complete($return_to);

// Check the response status.
if ($response->status == Auth_OpenID_CANCEL) {
    // This means the authentication was cancelled.
    //$msg = 'Verification cancelled.';
    header("Location: login.php");

} else if ($response->status == Auth_OpenID_FAILURE) {
    // Authentication failed; display the error message.
    echo "OpenID authentication failed: " . $response->message;

} else if ($response->status == Auth_OpenID_SUCCESS) {
    // This means the authentication succeeded; extract the
    // identity URL and Simple Registration data (if it was
    // returned).
    $openid = $response->getDisplayIdentifier();
    $esc_identity = htmlspecialchars($openid, ENT_QUOTES);

    $success = sprintf('You have successfully verified ' .
                       '<a href="%s">%s</a> as your identity.<br/>',
                       $esc_identity, $esc_identity);

    if ($response->endpoint->canonicalID) {
        $success .= '  (XRI CanonicalID: '.$response->endpoint->canonicalID.') ';
    }
    
    echo $success;
   
    $email = optional_param("openid_sreg_email","",PARAM_TEXT);
    $fullname = optional_param("openid_sreg_fullname","",PARAM_TEXT);
    
    //find if user already exists in Cohere db
    $user = new User();
    $user->setOpenIDURL($esc_identity);
    $u = $user->getByOpenIDURL();
    
    if($u instanceof Error){
        //users doesn't exist in db  
        $u = $user->add($email,$fullname,"","",'N',$CFG->AUTH_TYPE_OPENID,$esc_identity,"","");
        createSession($u);
        header("Location: profile.php");
    } else if ($u instanceof User) {
        //user does exist so create session for them and log in
        createSession($u);
        //redirect to homepage
        header("Location: index.php");
    }
   
}
 
include_once("includes/footer.php");


?>