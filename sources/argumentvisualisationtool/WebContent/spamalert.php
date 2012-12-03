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
 * Send am email to alert of user reported spam on site.
 */

include_once('config.php');

global $USER,$CFG;

//send the header info
header("Content-Type: text/plain");
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );  // disable IE caching
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . " GMT" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Pragma: no-cache" );

$type = required_param('type',PARAM_TEXT);
$id = required_param('id',PARAM_TEXT);

//add to database
if ($type == "idea") {
	$node = new CNode($id);
	$node->load();
	echo $node->updateStatus($CFG->STATUS_SPAM);
} else if ($type == "url") {
	$url = new URL($id);
	$url->load();
	echo $url->updateStatus($CFG->STATUS_SPAM);
} else if ($type == "user") {
	$user = new User($id);
	$user->load();
	echo $user->updateStatus($CFG->STATUS_SPAM);
}

//send email
$headtemp = loadFileToString($CFG->dirAddress."mailtemplates/emailhead.txt");
$head = vsprintf($headtemp,array($CFG->homeAddress."images/cohere_logo2.png"));
$foottemp = loadFileToString($CFG->dirAddress."mailtemplates/emailfoot.txt");
$foot = vsprintf($foottemp,array ($CFG->homeAddress));

$message = "SERVER: ".$CFG->homeAddress."<br>";
$message .= "TYPE: ".$type."<br>";
$message .= "ID: ".$id;
if ($USER->userid) {
	$message .= "<br>Reported By: ".$USER->userid;
}

$recipient = $CFG->SPAM_ALERT_RECIPIENT;
$subject = "Spam Report";
$headers = "Content-type: text/html; charset=utf-8\r\n";
ini_set("sendmail_from", $CFG->EMAIL_FROM_ADDRESS );
$headers .= "From: ".$CFG->EMAIL_FROM_NAME ." <".$CFG->EMAIL_FROM_ADDRESS .">\r\n";
$headers .= "Reply-To: ".$CFG->EMAIL_REPLY_TO."\r\n";
if($CFG->send_mail){
	mail($recipient,$subject,$message,$headers);
}

echo "\nEmail sent";
?>