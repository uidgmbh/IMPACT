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

// TO BE USED AS A INCLUDE ONLY

$user = getUser($userid,'long');

if($user instanceof Error){
	echo "<h1>User not found</h1>";
	die;
}

?>
<div style="clear:both"></div>
<hr style="margin-top:20px; margin-bottom:10px;">

<div id="context">
	<div id="contextimage"><img src="<?php print $user->photo;?>"/></div>
	<div id="contextinfo">
		<a name="<?php echo $userid ?>"></a>
		<h1>Tag Stats for <?php print $user->name; ?> <br><span style="font-size: 80%">in group <?php print $group->name; ?></span></h1>
	</div>
</div>
<div style="clear:both;"></div>


<!-- DATABASE QRY AREA -->
<?php
if($USER == null || $USER->getIsAdmin() == "N"){
    //reject user
    echo "Sorry you need to be an administrator to access these pages";
    include_once("../includes/dialogfooter.php");
    die;
} else {
    global $DB,$CFG;

	$con = $DB->conn;
	if( !$con ) {
		$err .= "<error>SQL error: ".mysql_error()."</error>";
	} else {

		/** TOP 10 TAGS **/
		$tags = array();

		$sql = "SELECT alltags.Name, count(alltags.Name) as UseCount FROM ( ";
		$sql .= "(SELECT t.Name as Name From Tag t RIGHT JOIN TagNode tn ON t.TagID = tn.TagID RIGHT JOIN Node ON tn.NodeID = Node.NodeID ";
		$sql .=	"WHERE tn.UserID = '".$userid."' AND Node.NodeID IN (Select NodeID FROM NodeGroup WHERE GroupID='".$groupid."')) ";
		$sql .= "UNION ALL ";
		$sql .= "(SELECT t.Name as Name From Tag t RIGHT JOIN TagTriple tt ON t.TagID = tt.TagID RIGHT JOIN Triple on tt.TripleID = Triple.TripleID ";
		$sql .= "WHERE tt.UserID = '".$userid."' AND Triple.TripleID IN (Select TripleID FROM TripleGroup WHERE GroupID='".$groupid."')) ";
		$sql .= "UNION ALL ";
		$sql .= "(SELECT t.Name as Name From Tag t RIGHT JOIN TagUsers tu ON t.TagID = tu.TagID ";
		$sql .= "WHERE tu.UserID = '".$userid."') ";
		$sql .= "UNION ALL ";
		$sql .= "(SELECT t.Name as Name From Tag t RIGHT JOIN TagURL tl ON t.TagID = tl.TagID RIGHT JOIN URL ON tl.URLID = URL.URLID ";
		$sql .= "WHERE tl.UserID = '".$userid."' AND URL.URLID IN (Select URLID FROM URLGroup WHERE GroupID='".$groupid."'))) as alltags ";
		$sql .= "group by alltags.Name order by UseCount DESC LIMIT 10";

		$results = mysql_query( $sql, $con);
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$name = $array['Name'];
				$count = $array['UseCount'];
				$tags[$name] = $count;
			}
			reset($tags);
			$poptag = key($tags);
		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}
	}
}

?>

<!-- DISPLAY AREA -->
<div style="float:left;">

	<?php if ($err != "") {
		echo $err;
	}
	?>
<br>
	<!-- TAGS -->
	<a name="tags"></a>
	<h3>Top 10 Tags</h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="300">
		<tr style="background-color: #308D88; color: white">
			<td width="40%"><b>Tag</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>

		<?php foreach($tags as $n=>$c) { ?>
			<tr>
				<td style="color: #666666 "><?php echo $n ?></td>
				<td align="right"><?php echo $c ?></td>
			</tr>
		<?php } ?>
	</table>

</div>