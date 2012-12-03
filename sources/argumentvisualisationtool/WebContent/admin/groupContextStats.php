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

$groupid = required_param("groupid",PARAM_TEXT);
$group = getGroup($groupid);

$brokercount = 0;
$brokername = "";
$brokerlink = "#";
$comparedcount = 0;
$comparedname = "";
$comparedlink = "#";

if($group instanceof Error){
	echo "<h1>Group not found</h1>";
	include_once("includes/footer.php");
	die;
}

?>
<script>
//by Simon Willison (http://simonwillison.net/)
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}
</script>
<div id="context">
	<div id="contextimage">
		<img src="<?php print $group->photo;?>"/></div>
	<div id="contextinfo">
		<h1>Stats for Group: <?php print $group->name; ?></h1>
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
		/** LINK TYPES **/
		$linkArray = array();

		$qry = "SELECT LinkType.Label, Count(TripleID) as num ";
		$qry .= "FROM Triple inner join LinkType on Triple.LinkTypeID = LinkType.LinkTypeID ";
		$qry .= "WHERE  Triple.UserID IN (SELECT UserID FROM UserGroup WHERE GroupID='".$groupid."') ";
		$qry .= "AND TripleID IN (Select TripleID FROM TripleGroup WHERE GroupID='".$groupid."') ";
		$qry .= "GROUP BY Label ";
		$qry .= "ORDER BY num DESC";

		$results = mysql_query( $qry, $con);
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$name = $array['Label'];
				$count = $array['num'];
				$linkArray[$name] = $count;
			}
			reset($linkArray);
			$poplink = key($linkArray);
		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}


		/** NODE TYPES used on IDEAS **/
		$nodeArray = array();

		$qry = "SELECT NodeType.Name, count(NodeID) AS num ";
		$qry .= "FROM Node LEFT JOIN NodeType on Node.NodeTypeID = NodeType.NodeTypeID ";
		$qry .= "WHERE Node.UserID IN (SELECT UserID FROM UserGroup WHERE GroupID='".$groupid."') ";
		$qry .= "AND NodeID IN (Select NodeID FROM NodeGroup WHERE GroupID='".$groupid."') ";
		$qry .= "GROUP BY NodeType.Name ORDER BY num DESC ";

		$results = mysql_query( $qry, $con);
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$name = $array['Name'];
				$count = $array['num'];
				$nodeArray[$name] = $count;
			}
			reset($nodeArray);
			$popnodetype = key($nodeArray);
		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}

		/** NODE TYPES used in CONNECTIONS **/
		$nodeConArray = array();

		$qry = "SELECT allnodes.Name, Count(TripleID) AS num FROM(";
		$qry .= "(SELECT NodeType.Name AS Name, TripleID  ";
		$qry .= "FROM Triple LEFT JOIN NodeType ON Triple.FromContextTypeID = NodeType.NodeTypeID ";
		$qry .= "WHERE  Triple.UserID IN (SELECT UserID FROM UserGroup WHERE GroupID='".$groupid."') ";
		$qry .= "AND TripleID IN (Select TripleID FROM TripleGroup WHERE GroupID='".$groupid."')) ";
		$qry .= "UNION ALL ";
		$qry .= "(SELECT  NodeType.Name AS Name, TripleID ";
		$qry .= "FROM Triple LEFT JOIN NodeType ON Triple.ToContextTypeID = NodeType.NodeTypeID ";
		$qry .= "WHERE  Triple.UserID IN (SELECT UserID FROM UserGroup WHERE GroupID='".$groupid."') ";
		$qry .= "AND TripleID IN (Select TripleID FROM TripleGroup WHERE GroupID='".$groupid."')) ";
		$qry .= ") AS allnodes ";
		$qry .= "GROUP BY allnodes.Name ORDER BY num DESC";

		$results = mysql_query( $qry, $con);
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$name = $array['Name'];
				$count = $array['num'];
				$nodeConArray[$name] = $count;
			}
			reset($nodeConArray);
			$popconnodetype = key($nodeConArray);

		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}

		/** MOST CONNECTED NODES - WITH PRIVACY CHECKING **/
		$ideaConArray = array();

		$qry = "SELECT allnodes.ID, Count(node) AS num FROM( ";

		$qry .= "(SELECT Node.NodeID AS ID, FromID AS node ";
		$qry .= "FROM Triple right join Node on Triple.FromID = Node.NodeID ";
		$qry .= "WHERE  Triple.UserID IN (SELECT UserID FROM UserGroup WHERE GroupID='".$groupid."') ";
		$qry .= "AND TripleID IN (Select TripleID FROM TripleGroup WHERE GroupID='".$groupid."') ";
		$qry .= "AND ((Triple.Private = 'N')
					   OR
					   (Triple.UserID = '".$USER->userid."')
					   OR
					   (TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
									 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
									  WHERE ug.UserID = '".$USER->userid."'))
					AND FromID IN (SELECT t.NodeID FROM Node t
									WHERE ((t.Private = 'N')
									   OR
									   (t.UserID = '".$USER->userid."')
									   OR
									   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
												   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
													WHERE ug.UserID = '".$USER->userid."')))
									)
					AND ToID IN (SELECT t.NodeID FROM Node t
									WHERE ((t.Private = 'N')
									   OR
									   (t.UserID = '".$USER->userid."')
									   OR
									   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
												   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
													WHERE ug.UserID = '".$USER->userid."')))
								)))";

		$qry .= "UNION ALL ";

		$qry .= "(SELECT  Node.NodeID AS ID, ToID AS node ";
		$qry .= "FROM Triple right join Node on Triple.ToID = Node.NodeID ";
		$qry .= "WHERE  Triple.UserID IN (SELECT UserID FROM UserGroup WHERE GroupID='".$groupid."') ";
		$qry .= "AND TripleID IN (Select TripleID FROM TripleGroup WHERE GroupID='".$groupid."')  ";
		$qry .= "AND ((Triple.Private = 'N')
					   OR
					   (Triple.UserID = '".$USER->userid."')
					   OR
					   (TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
									 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
									  WHERE ug.UserID = '".$USER->userid."'))
					AND FromID IN (SELECT t.NodeID FROM Node t
									WHERE ((t.Private = 'N')
									   OR
									   (t.UserID = '".$USER->userid."')
									   OR
									   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
												   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
													WHERE ug.UserID = '".$USER->userid."')))
									)
					AND ToID IN (SELECT t.NodeID FROM Node t
									WHERE ((t.Private = 'N')
									   OR
									   (t.UserID = '".$USER->userid."')
									   OR
									   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
												   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
													WHERE ug.UserID = '".$USER->userid."')))
								)))";


		$qry .= ") AS allnodes ";
		$qry .= "Group by allnodes.ID order by num DESC ";

		$results = mysql_query( $qry, $con);
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$id = $array['ID'];
				$node = new CNode();
				$node->nodeid = $id;
				$node->load();
				if (!$node instanceof error) {
					$count = $array['num'];
					$ideaConArray[$node->name] = $count;
				}
			}
			reset($ideaConArray);
			$mostconidea = key($ideaConArray);
		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}


		/** NUMBER OF CONNECTIONS PER USER **/
		$userConArray = array();

		$sql = "SELECT Users.Name as Name, t.UserID, count(t.UserID) as num FROM Triple t left join Users on t.UserID = Users.UserID
				WHERE ";

		$sql .= "t.UserID NOT IN (SELECT GroupID FROM UserGroup) AND ";

		$sql .= " t.TripleID in (Select TripleID from TripleGroup where GroupID='".$groupid."') AND ";
		$sql .= " t.UserID in (Select UserID from UserGroup where GroupID='".$groupid."') AND ";

		$sql .= " ((t.Private = 'N')
			   OR
			   (t.UserID = '".$USER->userid."')
			   OR
			   (t.TripleID IN

							(SELECT tg.TripleID FROM TripleGroup tg
							 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
							  WHERE ug.UserID = '".$USER->userid."')
				AND FromID IN (SELECT t.NodeID FROM Node t
							WHERE ((t.Private = 'N')
							   OR
							   (t.UserID = '".$USER->userid."')
							   OR
							   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
										   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
											WHERE ug.UserID = '".$USER->userid."')))
							)
				AND ToID IN (SELECT t.NodeID FROM Node t
							WHERE ((t.Private = 'N')
							   OR
							   (t.UserID = '".$USER->userid."')
							   OR
							   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
										   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
											WHERE ug.UserID = '".$USER->userid."')))
							)))";


		$sql .= " group by t.UserID order by num DESC";

		$results = mysql_query( $sql, $con);
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$name = $array['Name'];
				$count = $array['num'];
				$userConArray[$name] = $count;
			}
			reset($userConArray);
			$userconns = key($userConArray);
		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}

		/** NUMBER OF NODES PER USER **/
		$userNodeArray = array();

		$sql = "SELECT Users.Name as Name, Users.UserID, count(Node.UserID) as num FROM Users left join Node on Node.UserID = Users.UserID
				WHERE Node.UserID NOT IN (SELECT GroupID FROM UserGroup)";
		$sql .= "AND Node.NodeID in (Select NodeID from NodeGroup where GroupID='".$groupid."') ";
		$sql .= "AND Node.UserID in (Select UserID from UserGroup where GroupID='".$groupid."') ";
		$sql .= "AND ((Node.Private = 'N')
			   OR
			   (Node.UserID = '".$USER->userid."')
			   OR
			   (Node.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
						 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
						 WHERE ug.UserID = '".$USER->userid."'))".
			")";
		$sql .= " group by Users.UserID order by num DESC";

		$results = mysql_query( $sql, $con);
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$name = $array['Name'];
				$count = $array['num'];
				$userNodeArray[$name] = $count;
			}
			reset($userNodeArray);
			$usernodes = key($userNodeArray);
		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}

		/** IN ACTIVE USER'S **/
		// Needs Node in group or NULL adding - it didn't work, not sure why
		/*$userNoNodeArray = array();

		$sql = "SELECT DISTINCT Users.Name FROM Users left outer join Node on Node.UserID = Users.UserID ";
		$sql .= "WHERE Users.UserID NOT IN (SELECT GroupID FROM UserGroup) ";
		$sql .= "AND Node.NodeID IS NULL ";
		$sql .= "AND Users.UserID in (Select UserID from UserGroup where GroupID='".$groupid."') ";
		$sql .= "order by Name ";

		$results = mysql_query( $sql, $con);
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$name = $array['Name'];
				$userNoNodeArray[$name] = 0;
			}
			reset($userNoNodeArray);
			$usernonodes = key($userNoNodeArray);
		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}*/

		$tags = getGroupTagsForCloud($args["groupid"],10,"UseCount","DESC");

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

	<div style="margin-bottom: 10px;" >
	<a href="#allconnections">Go to All Group Connections as a Table</a>
	</div>

	<table cellspacing="2" style="border-collapse:collapse;" width="600">
		<tr style="background-color: #308D88; color: white">
			<td width="40%"><b>Name</b></td>
			<td width="35%"><b>Item</b></td>
			<td align="right" width="5%"><b>Count</b></td>
			<td align="right" width="10%"><b>Action</b></td>
		</tr>
		<tr>
			<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Most Popular Link Type</td>
			<td valign="top"><?php echo $poplink; ?></td>
			<td valign="top" align="right"><?php echo $linkArray[$poplink]; ?></td>
			<td valign="top" align="right"><a href="#linktypes">view all</a></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Most Popular Node Type</td>
			<td valign="top"><?php echo $popnodetype; ?></td>
			<td valign="top" align="right"><?php echo $nodeArray[$popnodetype]; ?></td>
			<td valign="top" align="right"><a href="#nodetypes">view all</a></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Most Popular Connected Node Type</td>
			<td valign="top"><?php echo $popconnodetype; ?></td>
			<td valign="top" align="right"><?php echo $nodeConArray[$popconnodetype]; ?></td>
			<td valign="top" align="right"><a href="#nodetypescon">view all</a></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Most Connected Idea</td>
			<td valign="top"><?php echo $mostconidea; ?></td>
			<td valign="top" align="right"><?php echo $ideaConArray[$mostconidea]; ?></td>
			<td valign="top" align="right"><a href="#mostconidea">view all</a></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Top Connection Builder</td>
			<td valign="top"><?php echo $userconns; ?></td>
			<td valign="top" align="right"><?php echo $userConArray[$userconns]; ?></td>
			<td valign="top" align="right"><a href="#userconns">view all</a></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Top Node Builder</td>
			<td valign="top"><?php echo $usernodes; ?></td>
			<td valign="top" align="right"><?php echo $userNodeArray[$usernodes]; ?></td>
			<td valign="top" align="right"><a href="#usernodes">view all</a></td>
		</tr>
		<!-- tr>
			<td valign="top" style="color: #666666 ">Users with No Nodes</td>
			<td valign="top"></td>
			<td valign="top" align="right"><?php echo count($userNoNodeArray); ?></td>
			<td valign="top" align="right"><a href="#usernonodes">view all</a></td>
		</tr -->
		<tr>
			<td valign="top" style="color: #666666 ">Top Information Broker</td>
			<td valign="top"><span id="brokername"></td>
			<td valign="top" align="right"><span id="brokercount"></td>
			<td valign="top" align="right"><a id="brokerlink" href="#">view all</a></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Top Compared Thinker</td>
			<td valign="top"><span id="comparedname"></td>
			<td valign="top" align="right"><span id="comparedcount"></span></td>
			<td valign="top" align="right"><a id="comparedlink" href="#">view all</a></td>
		</tr>
	</table>
<br>

<table cellspacing="2" style="border-collapse:collapse;" width="300">
<tr style="background-color: #308D88; color: white">
	<td><b>User - (click name to view stats)</b></td>
</tr>
 <?php
	$groupqry = "SELECT UserGroup.UserID, Users.Name from UserGroup left join Users on UserGroup.UserID = Users.UserID where GroupID='".$groupid."' order by Name ASC";
	$groupresults = mysql_query( $groupqry, $con);
	if ($groupresults) {
		while ($grouparray = mysql_fetch_array($groupresults, MYSQL_ASSOC)) {
			echo '<tr><td valign="top">';
			echo '<a href="#'.$grouparray['UserID'].'">'.$grouparray['Name'].'</a>';
			echo '</td></tr>';
		}
	}
 ?>
</table>
<br>
	<!-- LINK TYPES -->
	<a name="linktypes"></a>
	<h3>Link Types</h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="300">
		<tr style="background-color: #308D88; color: white">
			<td width="40%"><b>Name</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>
		<tr>
			<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
		</tr>

		<?php foreach($linkArray as $n=>$c) { ?>
			<tr>
				<td style="color: #666666 "><?php echo $n ?></td>
				<td align="right"><?php echo $c ?></td>
			</tr>
		<?php } ?>
	</table>
<br>
	<!-- NODE TYPES used on Ideas -->
	<a name="nodetypes"></a>
	<h3>Node Types used on Ideas</h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="300">
		<tr style="background-color: #308D88; color: white">
			<td width="40%"><b>Name</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>
		<tr>
			<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
		</tr>

		<?php foreach($nodeArray as $n=>$c) { ?>
			<tr>
				<td style="color: #666666 "><?php echo $n ?></td>
				<td align="right"><?php echo $c ?></td>
			</tr>
		<?php } ?>
	</table>
<br>
	<!-- NODE TYPES used in Connections -->
	<a name="nodetypescon"></a>
	<h3>Node Types used in Connections</h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="300">
		<tr style="background-color: #308D88; color: white">
			<td width="40%"><b>Name</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>
		<tr>
			<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
		</tr>

		<?php foreach($nodeConArray as $n=>$c) { ?>
			<tr>
				<td style="color: #666666 "><?php echo $n ?></td>
				<td align="right"><?php echo $c ?></td>
			</tr>
		<?php } ?>
	</table>
<br>
	<!-- MOST CONNECTED IDEAS -->
	<a name="mostconidea"></a>
	<h3>Ideas used in Connections (privacy included)</h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="600">
		<tr style="background-color: #308D88; color: white">
			<td width="80%"><b>Name</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>
		<tr>
			<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
		</tr>

		<?php foreach($ideaConArray as $n=>$c) { ?>
			<tr>
				<td style="color: #666666;"><?php echo $n ?></td>
				<td align="right"><?php echo $c ?></td>
			<tr>
				<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
			</tr>
			</tr>
		<?php } ?>
	</table>
<br>
	<!-- CONNECTIONS PER USER -->
	<a name="userconns"></a>
	<h3>Number of connections per User </h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="600">
		<tr style="background-color: #308D88; color: white">
			<td width="80%"><b>Name</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>
		<tr>
			<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
		</tr>

		<?php foreach($userConArray as $n=>$c) { ?>
			<tr>
				<td style="color: #666666;"><?php echo $n ?></td>
				<td align="right"><?php echo $c ?></td>
			<tr>
				<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
			</tr>
			</tr>
		<?php } ?>
	</table>
<br>
	<!-- NODES PER USER -->
	<a name="usernodes"></a>
	<h3>Number of nodes per User </h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="600">
		<tr style="background-color: #308D88; color: white">
			<td width="80%"><b>Name</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>
		<tr>
			<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
		</tr>

		<?php foreach($userNodeArray as $n=>$c) { ?>
			<tr>
				<td style="color: #666666;"><?php echo $n ?></td>
				<td align="right"><?php echo $c ?></td>
			<tr>
				<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
			</tr>
			</tr>
		<?php } ?>
	</table>
<br>

	<!-- NO NODES PER USER -->
	<!--a name="usernonodes"></a>
	<h3>Users with no Nodes </h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="600">
		<tr style="background-color: #308D88; color: white">
			<td width="80%"><b>Name</b></td>
			<td align="right" width="20%"><b>Count</b></td>
		</tr>
		<tr>
			<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
		</tr>

		<?php foreach($userNoNodeArray as $n=>$c) { ?>
			<tr>
				<td style="color: #666666;"><?php echo $n ?></td>
				<td align="right"><?php echo $c ?></td>
			<tr>
				<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>
			</tr>
			</tr>
		<?php } ?>
	</table>
<br -->
 <?php
	$groupqry = "SELECT UserGroup.UserID, Users.Name from UserGroup left join Users on UserGroup.UserID = Users.UserID where GroupID='".$groupid."' order by Name ASC";
	$groupresults = mysql_query( $groupqry, $con);
	if ($groupresults) {
		while ($grouparray = mysql_fetch_array($groupresults, MYSQL_ASSOC)) {
			$userid = $grouparray['UserID'];
			include("userGroupContextStats.php");
		}
	}
 ?>
 <br>

<div style="clear: both"></div>
 <!-- all group connections as a table of info -->
 <h3>All Groups Connections As Table</h3>

 <a name="allconnections"></a>
 <table border="1" cellspacing="2" cellpadding="3" style="border-collapse:collapse;">

 <tr style="background-color: #308D88; color: white; font-weight: bold">
 	<td>Connection Author</td>
 	<td>From Label</td>
 	<td>From Type</td>
 	<td>From Author</td>
 	<td>Link Type</td>
 	<td>Link Group</td>
 	<td>To Label</td>
 	<td>To Type</td>
 	<td>To Author</td>
 </tr>
 <?php

    $groupConnectionsAll = getConnectionsByGroup($groupid, 0, -1);

 	if ($groupConnectionsAll && $groupConnectionsAll->count > 0) {
 		$conns = $groupConnectionsAll->connections;
 		$count = $groupConnectionsAll->count;
 		for ($i=0; $i < $count; $i++) {
 			$connection = $conns[$i];
 			if ($connection) {
				echo "<tr>";
				echo "<td>".$connection->users[0]->name."</td>";
				echo "<td>".$connection->from->name."</td>";
				echo "<td>".$connection->fromrole->name."</td>";
				echo "<td>".$connection->from->users[0]->name."</td>";

				echo "<td>".$connection->linktype->label."</td>";
				echo "<td>".$connection->linktype->grouplabel."</td>";

				echo "<td>".$connection->to->name."</td>";
				echo "<td>".$connection->torole->name."</td>";
				echo "<td>".$connection->to->users[0]->name."</td>";
				echo "</tr>";
			}
 		}
 	}
 ?>
 </table>
</div>

<script type="text/javascript">
$('brokername').insert('<?php echo $brokername; ?>');
$('brokercount').insert('<?php echo $brokercount; ?>');
$('brokerlink').href = '<?php echo $brokerlink; ?>';
$('comparedname').insert('<?php echo $comparedname; ?>');
$('comparedcount').insert('<?php echo $comparedcount; ?>');
$('comparedlink').href = '<?php echo $comparedlink; ?>';
</script>

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