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
include_once("../config.php");
include_once("../includes/header.php");
//include_once("../phplib/utillib.php");

$groupid = required_param("groupid",PARAM_TEXT);
$group = getGroup($groupid);

if($group instanceof Error){
	echo "<h1>Group not found</h1>";
	include_once("includes/footer.php");
	die;
}

?>
<div id="context">
	<div id="contextimage">
		<img src="<?php print $group->photo;?>"/></div>
	<div id="contextinfo">
		<h1>Tag Stats for Group: <?php print $group->name; ?></h1>
	</div>
</div>
<div style="clear:both;"></div>

<?php

if($USER == null || $USER->getIsAdmin() == "N"){
    //reject user
    echo "Sorry you need to be an administrator to access these pages";
    include_once("../includes/dialogfooter.php");
    die;
} else {
    global $DB,$CFG;
	$con = $DB->conn;

	$sort= $_GET['sort'];
	$oldsort= $_GET['lastsort'];
	$direction = $_GET['lastdir'];
	$startdate = 0;

	$err = "";
	if( ! $con ) {
		$err = mysql_error();
	} else {
		$tags = getGroupTagsForCloud($groupid,10,"UseCount","DESC");
	}
}
?>

<!-- DISPLAY AREA -->

<div style="float:left;">

	<?php if ($err != "") {
		echo $err;
	}
	?>

	<h3>SUMMARY</h3>

<h4>Top 10 Group Tags</h4>
<table cellspacing="2" style="border-collapse:collapse;" width="300">
		<tr style="background-color: #308D88; color: white">
			<td width="40%"><b>Tag - click to view search</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>

 <?php
	foreach($tags as $tag) {
		echo '<tr><td valign="top">';
		echo '<a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true">'.$tag['Name'].'</a>';
		echo '</td><td align="right">';
		echo $tag['UseCount'];
		echo '</td></tr>';
	}
 ?>
</table>
<br>
 <?php
	$groupqry = "SELECT UserGroup.UserID, Users.Name from UserGroup left join Users on UserGroup.UserID = Users.UserID where GroupID='".$groupid."' order by Name ASC";
	$groupresults = mysql_query( $groupqry, $con);
	if ($groupresults) {
		while ($grouparray = mysql_fetch_array($groupresults, MYSQL_ASSOC)) {
			$userid = $grouparray['UserID'];
			include("userGroupContextStats2.php");
		}
	}
 ?>
 <br>
</div>

<!-- IGNORE REST -->

</div>

</div> <!-- end content -->
</div> <!-- end contentwrapper -->

<div id="sidebar">
    <div class="s_innertube">
    <?php
        include("../includes/sidebar.php");
    ?>
    </div>
</div>

</div> <!-- end main -->
<div id="footer">
    A <a href="http://projects.kmi.open.ac.uk/hyperdiscourse/">KMi</a> Tool from the <a href="http://www.olnet.org/">OLnet</a> Project
    | <a href="<?php print($CFG->homeAddress);?>contact.php">Contact</a>
</div>

<!-- Google analytics -->
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
if (typeof(_gat)=="object") {
    var pageTracker = _gat._getTracker("<?php print($CFG->GOOGLE_ANALYTICS_KEY);?>");
    pageTracker._initData();
    pageTracker._trackPageview();
}
</script>

</body>
</html>