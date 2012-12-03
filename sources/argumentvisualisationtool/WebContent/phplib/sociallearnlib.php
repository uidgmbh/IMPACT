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

function postGoalToSocialLearn($nodeid){
    global $CFG,$USER;
    $n = getNode($nodeid);
    
    $sdt = ""; 
    if ($n->startdatetime != ""){ 
        $sdt = date("Y-m-d",$n->startdatetime);
    } 
    $edt = ""; 
    if ($n->enddatetime != ""){ 
        $edt = date("Y-m-d",$n->enddatetime);
    } 
    $visible = "true";
    if($n->private){
        $visible = "false";
    }
    $payload = "
        <goal>
            <short_description>$n->name</short_description>
            <description>$n->description</description>
            <note></note>
            <start_date>$sdt</start_date>
            <end_date>$edt</end_date>
            <goal_type>1</goal_type>
            <visibility>$visible</visibility>
        </goal>";
    
    $username        = $USER->sociallearnid;
    $nonce = dechex(mt_rand()) . dechex(mt_rand());
    $created = gmstrftime('%Y-%m-%dT%TZ');
    $password_digest = base64_encode(sha1($nonce. $created. $USER->getSocialLearnPassword()));
    
    
    //$password_digest = rawurldecode($_GET["password_digest"]);
    //$nonce           = rawurldecode($_GET["nonce"]          );
    //$created         = rawurldecode($_GET["created"]        );

    $wsse_token_header = 'X-WSSE: UsernameToken Username="'.$username.'", PasswordDigest="'.$password_digest.'", Nonce="'.$nonce.'", Created="'.$created.'"';
    
        
    $social_learn_url = "http://beta.sociallearnproject.org";
    $api_key = "1234567890";
    $request = "$social_learn_url/users/$username/goals?api_key=$api_key"; 
    $curl_handle = curl_init();
    
    curl_setopt($curl_handle, CURLOPT_URL, $request);
    curl_setopt($curl_handle, CURLOPT_POST, 1);
    curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $payload);
    if($CFG->PROXY_HOST != ""){
        curl_setopt($curl_handle, CURLOPT_PROXY, "$CFG->PROXY_HOST:$CFG->PROXY_PORT");
    }
    
    curl_setopt($curl_handle, CURLOPT_HTTPHEADER, array(
        'Accept: application/xml',
        'Content-Type: application/xml',
        'Authorization: WSSE profile="UsernameToken"',
        $wsse_token_header));

    curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, true);
    
    $buffer = curl_exec($curl_handle);
    curl_close($curl_handle);
    
}

?>