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
<html>
<head>
<script type="text/javascript">//<![CDATA[
	var url = '<?php echo $url; ?>';
	var user = '<?php echo $userid; ?>';
	var session = <?php echo $session; ?>;
	
	var flashNet;

	function isReady() {
		flashNet = thisMovie('Cohere-FlashConnectionNet');
		return true;
	}

	function thisMovie(movieName) {
		 if (navigator.appName.indexOf("Microsoft") != -1) {
				 return window[movieName];
		 } else {
				 return document[movieName];
		 }
	}

	function loadAppletData() {

		var args = new Array();
		args["url"] = url;
		args["start"] = 0;
		args["max"] = 0;

		flashNet.prepareGraph(user, session, "&method=getconnectionsbyurl&" + Object.toQueryString(args));

		return;
	}
	
    Event.observe(window, 'load', function() {
    	loadAppletData();       
    });
	
//]]>
</script>
</head>
<body>
<div id="graphdiv" class="margin:0px; padding:0px; overflow: visible">
<OBJECT 
	width="380" 
	height="325" 
	id="Cohere-JetpackNet"
	allowscriptaccess="always"
	type="application/x-shockwave-flash"
	data="LiteMap.swf"
	name="Cohere-JetpackNet">

	<PARAM name=quality value=high>
	<PARAM name=allowscriptaccess value=always>
	<PARAM name=allowfullscreen value=true>	
    <PARAM name="movie" value="LiteMap.swf?url=<?php echo $url; ?>&session=<?php echo $session; ?>&user=<?php echo $userid; ?>">
	<param name="flashvars" value="session=<?php echo $session; ?>&url=<?php echo $url; ?>&user=<?php echo $userid; ?>" />

	<EMBED href="LiteMap.swf 
		quality=high 
		width="380" 
		height="325" 
		name="Cohere-JetpackNet" 
		type="application/x-shockwave-flash" 
		flashvars="session=<?php echo $session; ?>&url=<?php echo $url; ?>&user=<?php echo $userid; ?>"
		src="LiteMap.swf"
	</EMBED>
</OBJECT> 
</div>	
</body>
</html>