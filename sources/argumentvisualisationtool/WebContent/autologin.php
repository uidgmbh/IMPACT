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
require_once 'config.php';
global $CFG;
clearSession();



$postfix = stripslashes(required_param('pf',PARAM_TEXT));
$MoodleSession = stripslashes(required_param('ms',PARAM_TEXT));
$MoodleSessionTest = stripslashes(required_param('mst',PARAM_TEXT));
$domainfrom = stripslashes(required_param('from',PARAM_TEXT));

$data = null;
if ($MoodleSession != null && $MoodleSession != null && $domainfrom != null) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch, CURLOPT_COOKIE, 'MoodleSession'.$postfix.'='.$MoodleSession.'; MoodleSessionTest'.$postfix.'='.$MoodleSessionTest);
	curl_setopt($ch, CURLOPT_URL, $domainfrom.'/blocks/compendium/validate.php');
	$data = curl_exec ($ch);
	curl_close ($ch);			
}

if ($data != null) {

	$xml_parser = xml_parser_create();
	xml_parse_into_struct($xml_parser, $data, $values, $index);
	xml_parser_free($xml_parser);

	$email = "";
	$login = "";
	$name = "";
	$password = "";
	foreach ($index as $key=>$val) {
		if ($key == "EMAIL") {
			$email = $values[$val[0]]['value'];
		} if ($key == "DISPLAYNAME") {
			$name = $values[$val[0]]['value'];
		} else {
			continue;
		}
	}
	
	if ($email != "" && $name != "") {	
		
        //get by email
        $u = new User();
        $u->setEmail($email);
        $t = $u->getByEmail();
        if ($t instanceof Error){
            //user not found so create them
            $nu = $u->add($email,$name,"","",'N',$CFG->AUTH_TYPE_OPENLEARN);   
        } else {
            //user found in db so just update their name
            $nu = $u->updateName($name);    
        }
        createSession($nu);
        header('Location: index.php');
    }
}

include_once("includes/header.php");
?>
    <p>Unfortunately an error occured whilst trying to log you in to Cohere.</p>
    
    <p>Please try again, or to report this as an error please visit our <a href="<?php print($CFG->homeAddress);?>support/">support site</a>.</p> 
<?php
    include_once("includes/footer.php");
?>