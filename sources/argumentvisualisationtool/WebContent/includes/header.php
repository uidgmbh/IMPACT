<?php
/********************************************************************************
 *                                                                              *
 *  (c) Copyright 2011 University of Leeds, UK                                  *
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
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>
PolicyCommons -- navigate the pros and cons in policy debates
</title>
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/style.css" type="text/css" media="screen" />
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/node.css" type="text/css" media="screen" />
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/tabber.css" type="text/css" media="screen" />
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/tipTip/tipTip.css" media="screen" />
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/css/ARGVIZ.map.css" media="screen" />
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/css/jquery-ui-1.8.18.custom.css" media="screen" />
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/css/ARGVIZ.network.css" media="screen" />
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/css/PolicyCommons.css" media="screen" />
<link rel="icon" href="<?php echo $CFG->homeAddress; ?>favicon.ico" type="images/x-icon" />
<script src="<?php echo $CFG->homeAddress; ?>includes/prototype.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/util.php" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/node.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/urls.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/conns.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/users.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/debate.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/documents.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/dateformat.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/jsr_class.js" type="text/javascript"></script>
<script src='<?php echo $CFG->homeAddress; ?>includes/scriptaculous/scriptaculous.js' type="text/javascript"></script>
<script src='<?php echo $CFG->homeAddress; ?>includes/jquery.js' type="text/javascript"></script>
<script src='<?php echo $CFG->homeAddress; ?>includes/jquery-ui-1.8.18.custom.min.js' type="text/javascript"></script>
<!--Include SpryMap plugin so that argument maps can be grabbed and dragged like Google Maps -->
<script src='<?php echo $CFG->homeAddress; ?>includes/spryMap/spryMap-2.js'></script>
<!-- Prevent jQuery conflicting with Prototype-->
<script type="text/javascript">jQuery.noConflict();</script>

<script src="<?php echo $CFG->homeAddress; ?>includes/d3/d3.v2.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/textFlow/helper_functions.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/textFlow/textFlow.js" type="text/javascript"></script>
<script src='<?php echo $CFG->homeAddress; ?>includes/tipTip/jquery.tipTip.js'></script>

<script src='http://maps.google.com/maps?file=api&amp;v=2&amp;key=<?php echo $CFG->GOOGLE_MAPS_KEY; ?>' type="text/javascript"></script>
<script>
Timeline_ajax_url="<?php echo $CFG->homeAddress; ?>visualize/timeline_2.3.0/timeline_ajax/simile-ajax-api.js";
Timeline_urlPrefix='<?php echo $CFG->homeAddress; ?>visualize/timeline_2.3.0/timeline_js/';
Timeline_parameters='bundle=true';

<?php
$role = $CFG->DEFAULT_NODE_TYPE;
$defaultRole = new Role();
$defaultRole->loadByName($role);
$roleimage = $CFG->homeAddress.$defaultRole->image;
?>

var defaultRoleImage = "<?php echo $roleimage; ?>";
var defaultRoleName = "<?php echo $CFG->DEFAULT_NODE_TYPE; ?>";

</script>
<script src="<?php echo $CFG->homeAddress; ?>visualize/timeline_2.3.0/timeline_js/timeline-api.js"
type="text/javascript">
</script>
<?php
    global $HEADER,$BODY_ATT;
    if(is_array($HEADER)){
        foreach($HEADER as $header){
            echo $header;
        }
    }
?>
<script type="application/x-javascript">
<!--
function init(){
    // create the auto complete for search
    new Ajax.Autocompleter("q", "q_choices", "<?php echo $CFG->homeAddress; ?>api/service.php?method=getnodesbyfirstcharacters&scope=all&format=list", {paramName: "q", minChars: 1});

	setInterval("updateuserstatus()", 600000); // Update every 10 minute
}

function cleanup(){
	if (document.getElementById("Cohere-SocialNet")) {
		obj = document.getElementById("Cohere-SocialNet");
		obj.stop();
		obj.destroy();
		if (document.getElementById("tab-content-svn")) {
			document.getElementById("tab-content-svn").innerHTML="";
		}
	}
	if (document.getElementById("Cohere-ConnectionNet")) {
		obj = document.getElementById("Cohere-ConnectionNet");
		obj.stop();
		obj.destroy();
		if (document.getElementById("tab-content-conn")) {
			document.getElementById("tab-content-conn").innerHTML="";
		}
	}
}

function setSearchResultTab(){
    // set the action for the search form (to preserve the tab/visualisation)
    $('searchform').setAttribute('action',"<?php print($CFG->homeAddress);?>results.php#" + getAnchorVal('node-list'));
}

window.onload = init;
window.onunload = cleanup;

function updateuserstatus() {
	new Ajax.Request('../updateuserstatus.php', { method:'get' });
}
-->
</script>

</head>
<body <?php echo $BODY_ATT; ?> id="cohere-body">

<div id="header">

    <div id="logo">
        <a href="<?php echo $CFG->homeAddress; ?>index.php"
        title="PolicyCommons.co.uk"><img style="border:0px;" alt="PolicyCommons.co.uk" src="<?php echo $CFG->homeAddress; ?>images/policycommons-alpha-logo.png" /></a>
        <div style="clear: both;"><a href="#content" class="accesslink">Skip to content</a></div>
    </div>

    <div style="float: right;">

		<div id="menu">
			<a href='<?php echo $CFG->homeAddress; ?>index.php'>Home</a> |
			<?php
				global $USER;
				if(isset($USER->userid)){
					if($USER->name == ""){
						$name = $USER->getEmail();
					} else {
						$name = $USER->name;
					}
					echo " Signed in as: <a title='edit profile' href='".$CFG->homeAddress."user.php?userid=".$USER->userid."'>". $name ."</a> | <a title='Sign Out' href='".$CFG->homeAddress."logout.php'>Sign Out</a> ";

				} else {
					echo " <a title='Sign In' href='".$CFG->homeAddress."login.php'>Sign In</a> ";
				}
			?>
			| <a href='<?php echo $CFG->homeAddress; ?>about.php'>About</a>
      | <a href="<?php
		print($CFG->homeAddress);?>contact.php">Contact</a>
			| <a href='<?php echo $CFG->homeAddress; ?>help/'>Help</a>

			<?php
			if($USER->getIsAdmin() == "Y"){
				echo "| <a title='Admin' href='".$CFG->homeAddress."admin/index.php'>Admin </a>";
			}
			?>
		</div>

		<div id="search">

			<form name="search" action="<?php print($CFG->homeAddress);?>results.php" method="get" id="searchform" onsubmit="return setSearchResultTab()">

				<label for="q" style="float: left; margin-right: 3px; margin-top: 3px;">Search</label>

				<?php
					// if search term is present in URL then show in search box
					$q = stripslashes(optional_param("q","",PARAM_TEXT));
					$scope = optional_param("scope","all",PARAM_TEXT);
					$tagsonly = optional_param("tagsonly","false",PARAM_TEXT);
				?>

				<div style="float: left;">
					<input type="text" style=" margin-right:3px; width:250px" id="q" name="q" value="<?php print( htmlspecialchars($q) ); ?>"/>
					<div style="clear: both;">
					<?php
						//only show option to restrict to my items if user logged in
						if (isset($USER->userid)) {
						?>
							<input type="radio" name="scope" value="my" <?php if ($scope == 'my'){ echo "checked='checked'";}?>/>My Items &nbsp;
							<input type="radio" name="scope" value="all" <?php if ($scope == 'all'){ echo "checked='checked'";}?>/> All &nbsp;
						<?php
							} else {
						?>
							<input type="hidden" name="scope" value="all"/>
						<?php
						}
						?>
						<input type="checkbox" name="tagsonly" value="true" <?php if ($tagsonly == 'true'){ echo "checked='checked'";}?>/> Tags Only &nbsp;
					</div>
					<div id="q_choices" class="autocomplete" style="border-color: white;"></div>
				 </div>
				 <div style="float:left;"><input type="submit" value="Go"/></div>
			 </form>
		 </div>
     </div>
</div>
<div id="message" style="padding:5px; width: 250px; height: 80px; position: absolute; left:0px; top:0px; overflow: auto; display: none; color: white; background-color: #40B5B2; font-face: Arial; font-weight:bold"></div>
<div id="main">
<div id="contentwrapper">
<div id="content">
<div class="c_innertube">
