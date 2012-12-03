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
 * jetpack-conn-net.php
 * Created on 19th January 2010
 *
 * Michelle Bachler 
 */
$url = "";
if (isset($_POST['url'])) {       
    $url = $_POST['url'];
} else if (isset($_GET['url'])) {
    $url = $_GET['url'];
}

$userid = "";
if (isset($_POST['userid'])) {       
    $userid = $_POST['userid'];
} else if (isset($_GET['userid'])) {
    $userid = $_GET['userid'];
}

$session = "";
if (isset($_POST['session'])) {       
    $session = $_POST['session'];
} else if (isset($_GET['session'])) {
    $session = $_GET['session'];
}

?>
				

<div id="graphdiv" class="snippetNetDiv">
<APPLET
	id="Cohere-JetpackNet"
	name="Cohere-JetpackNet"
	archive="cohere-jetpack.jar, mysql-connector-java-5.1.6-bin.jar, prefuse.jar, plugin.jar"
	code="cohere.CohereApplet.class"
	width="445"
	height="445"
	mayscript="true"
	scriptable="true"
	alt="(Your browser recognizes the APPLET element but does not run the applet.)">
    <p>Please wait, I am loading the Cohere connections.</p><p>This embedded page requires Java to be enabled.</p><p>If you have Java support disabled, I cannot help you, sorry.</p>
    <PARAM name="url" value="<?php echo $url; ?>">
    <PARAM name="session" value=<?php echo $session; ?>>
    <PARAM name="user" value=<?php echo $userid; ?>>
</APPLET>				
</div>	
