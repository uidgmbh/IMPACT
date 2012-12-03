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

global $USER;
$userid = optional_param("userid",$USER->userid,PARAM_TEXT);
$user = getUser($userid,'long');

if($user instanceof Error){
	echo "<h1>User not found</h1>";
	include_once("includes/footer.php");
	die;
}

?>
<div id="context">
	<div id="contextimage"><img src="<?php print $user->photo;?>"/></div>
	<div id="contextinfo">
		<h1>Stats for <?php print $user->name; ?></h1>
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
		$sql .= "(SELECT t.Name as Name From Tag t RIGHT JOIN TagNode tn ON t.TagID = tn.TagID Where tn.UserID = '".$userid."') ";
		$sql .= "UNION ALL ";
		$sql .= "(SELECT t.Name as Name From Tag t RIGHT JOIN TagTriple tt ON t.TagID = tt.TagID Where tt.UserID = '".$userid."') ";
		$sql .= "UNION ALL ";
		$sql .= "(SELECT t.Name as Name From Tag t RIGHT JOIN TagUsers tu ON t.TagID = tu.TagID Where tu.UserID = '".$userid."') ";
		$sql .= "UNION ALL ";
		$sql .= "(SELECT t.Name as Name From Tag t RIGHT JOIN TagURL tl ON t.TagID = tl.TagID Where tl.UserID = '".$userid."')) as alltags ";
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


		/** LINK TYPES **/
		$linkArray = array();

		$qry = "SELECT LinkType.Label, Count(TripleID) AS num ";
		$qry .= "FROM Triple LEFT JOIN LinkType ON Triple.LinkTypeID = LinkType.LinkTypeID ";
		$qry .= "WHERE  Triple.UserID ='".$userid."' ";
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
		$qry .= "WHERE Node.UserID = '".$userid."' ";
		$qry .= "GROUP BY NodeType.Name ORDER BY num DESC";

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

		/** COMPARED THINKING - WITH PRIVACY CHECKING **/
		$connectionSet = new ConnectionSet();

		$qry = "SELECT * FROM ";
		$qry .= "(SELECT Triple.*, Node.UserID as FromUserID ";
		$qry .= "FROM Triple RIGHT JOIN Node ON Triple.FromID = Node.NodeID ";
		$qry .= "WHERE Triple.UserID = '".$userid."' ";
    	$qry .= " AND ((Triple.Private = 'N')
                   OR
                   (TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
                                 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                                  WHERE ug.UserID = '".$USER->userid."')))
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
                            )";

        $qry .= ") AS FRED LEFT JOIN ";

		$qry .= "(SELECT Triple.TripleID as TripleID2, Node.UserID ";
		$qry .= "AS ToUserID ";
		$qry .= "FROM Triple RIGHT JOIN Node ON Triple.ToID = Node.NodeID ";
		$qry .= "WHERE  Triple.UserID = '".$userid."' ";
    	$qry .= " AND ((Triple.Private = 'N')
                   OR
                   (TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
                                 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                                  WHERE ug.UserID = '".$USER->userid."')))
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
                            )";

		$qry .= " ) AS FRED2 on FRED.TripleID = FRED2.TripleID2 ";
		$qry .= "WHERE (FromUserID = '".$userid."' AND ToUserID != '".$userid."')";
		$qry .= "OR (FromUserID != '".$userid."' AND ToUserID = '".$userid."') ";

		$results = mysql_query( $qry, $con);
		$comparedArray = array();
		if ($results) {
			while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
				$id = $array['TripleID'];
				$con = new Connection();
				$con->connid = $id;
				$con = $con->load();
				if (!$con instanceof error) {
					$connectionSet->add($con);
					$comparedArray[count($comparedArray)] = $con;
				}
			}

			$connectionSet->totalno = count($comparedArray);
			$connectionSet->start = 0;
			$connectionSet->count = $connectionSet->totalno;
		} else {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		}

		// Original connection seemed to hit a limit and stop working, so created a new one
		$con = $DB->conn;
		if( !$con ) {
			$err .= "<error>SQL error: ".mysql_error()."</error>";
		} else {

			/** INFORMATION BROKER - WITH PRIVACY CHECKING **/
			$brokerArray = array();
			$brokerConnectionSet = new ConnectionSet();

			$qry = "SELECT * FROM ";
			$qry .= "(SELECT Triple.*, Node.UserID as FromUserID ";
			$qry .= "FROM Triple RIGHT JOIN Node ON Triple.FromID = Node.NodeID ";
			$qry .= "WHERE Triple.UserID = '".$userid."' ";
			$qry .= " AND ((Triple.Private = 'N')
					   OR
					   (TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
									 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
									  WHERE ug.UserID = '".$USER->userid."')))
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
                            )";


			$qry .= ") AS FRED LEFT JOIN ";

			$qry .= "(SELECT Triple.TripleID as TripleID2, Node.UserID as ToUserID ";
			$qry .= "FROM Triple RIGHT JOIN Node ON Triple.ToID = Node.NodeID ";
			$qry .= "WHERE  Triple.UserID = '".$userid."' ";
			$qry .= " AND ((Triple.Private = 'N')
					   OR
					   (TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
									 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
									  WHERE ug.UserID = '".$USER->userid."')))
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
								)";

			$qry .= ") AS FRED2 on FRED.TripleID = FRED2.TripleID2 ";
			$qry .= "WHERE (FromUserID != '".$userid."' AND ToUserID != '".$userid."')";


			$results = mysql_query( $qry, $con);
			if ($results) {
				while ($array = mysql_fetch_array($results, MYSQL_ASSOC)) {
					$id = $array['TripleID'];
					$con = new Connection();
					$con->connid = $id;
					$con = $con->load();
					if (!$con instanceof error) {
						$brokerConnectionSet->add($con);
						$brokerArray[count($brokerArray)] = $con;
					}
				}

				$brokerConnectionSet->totalno = count($brokerArray);
				$brokerConnectionSet->start = 0;
				$brokerConnectionSet->count = $brokerConnectionSet->totalno;
			} else {
				$err .= "<error>SQL error: ".mysql_error()."</error>";
			}
		}
	}
}

?>

<script type="text/javascript">
   	var conns = null;
   	var brokerConns = null;

   	function init() {
		<?php
			$jsonConn = json_encode($connectionSet);
			echo "conns = ";
			echo $jsonConn;
			echo ";";
		?>
		<?php
			$jsonBrokerConn = json_encode($brokerConnectionSet);
			echo "brokerConns = ";
			echo $jsonBrokerConn;
			echo ";";
		?>

		var count = conns.count;
		var lOL = new Element("ol", {'start':0, 'class':'conn-list-ol'});
		for(var i=0; i< count; i++){

			var iUL = new Element("li", {'id':conns.connections[i].connid, 'class':'conn-list-li'});
			lOL.insert(iUL);
			var cWrap = new Element("div", {'class':'conn-li-wrapper'});
			var blobDiv = new Element("div", {'class':'conn-blob'});
			blobDiv.style.marginLeft = "0px";

			var blobConn =  renderThisConnection(conns.connections[i],"conn-list"+i, false);
			blobDiv.insert(blobConn);
			cWrap.insert(blobDiv);
			cWrap.insert("<div style='clear:both'></div>");
			iUL.insert(cWrap);
		}
		$('comparedThinking').insert(lOL);

		var count2 = brokerConns.count;
		var lOL2 = new Element("ol", {'start':0, 'class':'conn-list-ol'});
		for(var i=0; i< count2; i++){

			var iUL = new Element("li", {'id':brokerConns.connections[i].connid, 'class':'conn-list-li'});
			lOL2.insert(iUL);
			var cWrap = new Element("div", {'class':'conn-li-wrapper'});
			var blobDiv = new Element("div", {'class':'conn-blob'});
			blobDiv.style.marginLeft = "0px";
			var blobConn =  renderThisConnection(brokerConns.connections[i],"conn-list"+i, false);
			blobDiv.insert(blobConn);
			cWrap.insert(blobDiv);
			cWrap.insert("<div style='clear:both'></div>");
			iUL.insert(cWrap);
		}
		$('informationBroker').insert(lOL2);

	}

	/**
	 *
	 */
	function renderThisConnection(connection,uniQ, includemenu){

		if (includemenu === undefined) {
			includemenu = true;
		}

		if (connection.userid == null) {
			return;
		}

		uniQ = connection.connid + uniQ;

		var connDiv = new Element("div",{'class': 'connection'});

		if (connectionDirection == CONNECTION_ARROWS_RIGHT) {
			var fromDiv = new Element("div",{'class': 'fromidea-horiz'});
			var fromNode = renderNode(connection.from,'conn-from-idea'+uniQ, connection.fromrole, includemenu);
			fromDiv.insert(fromNode).insert('<div style="clear:both;"></div>');
			connDiv.insert(fromDiv);
		} else {
			var toDiv = new Element("div",{'class': 'toidea-horiz'});
			var toNode = renderNode(connection.to,'conn-to-idea'+uniQ, connection.torole, includemenu);
			toDiv.insert(toNode).insert('<div style="clear:both;"></div>');
			connDiv.insert(toDiv);
		}

		var linktypelabelfull = connection.linktype.label;
		var linktypelabel = linktypelabelfull;
		if (linktypelabelfull.length > LINKTYPELABEL_CUTOFF) {
			linktypelabel = linktypelabelfull.substring(0,LINKTYPELABEL_CUTOFF)+"...";
		}

		var linkDiv = new Element("div",{'class': 'connlink-horiz-slim','id': 'connlink'+connection.connid});
		if (connectionDirection == CONNECTION_ARROWS_RIGHT) {
			linkDiv.setStyle('background-image: url("'+URL_ROOT +'images/connection/conn-'+connection.linktype.grouplabel.toLowerCase()+'-slim3.png")');
			var ltDiv = new Element("div",{'class': 'conn-link-text'});
		} else {
			linkDiv.setStyle('background-image: url("'+URL_ROOT +'images/connection/conn-'+connection.linktype.grouplabel.toLowerCase()+'-slim3-left.png")');
			var ltDiv = new Element("div",{'class': 'conn-link-text-left'});
		}

		//ltDiv.insert(new Element("div",{'style':'float:left;'}).insert(connection.linktype.label));

		linkDiv.insert(ltDiv);

		var ltWrap = new Element("div",{'class': 'link-type-wrapper'});
		ltDiv.insert(ltWrap);

		var hasTags = false;
		if(connection.tags && connection.tags.length > 0){
			hasTags = true;
			var tltMenu = new Element("div",{'class':'link-type-tags'});
			ltWrap.insert(tltMenu);

			var tddImg = new Element('img', {'src':URL_ROOT+'images/tagdropdown-grey.png','class':'drop-down-img'});
			Event.observe(tddImg,'mouseover',function (){ showPopup('tdd'+uniQ)});
			Event.observe(tddImg,'mouseout',function (){ hidePopup('tdd'+uniQ)});
			tltMenu.insert(tddImg);

			var tddDiv = new Element("div", {"id":"tdd"+uniQ,"class":"drop-down"});
			Event.observe(tddDiv,'mouseover',function (){ showPopup("tdd"+uniQ)});
			Event.observe(tddDiv,'mouseout',function (){ hidePopup("tdd"+uniQ)});
			tltMenu.insert(tddDiv);

			var tddUL = new Element('ul',{'class':'dd-list'});

			for (var i=0 ; i< connection.tags.length; i++){
				var tddLI = new Element('li',{'class':'dd-li'});
				tddUL.insert(tddLI);
				var tddLIA = new Element('a',{'href':URL_ROOT+'tagsearch.php?q='+connection.tags[i].name+'&scope=all&tagsonly=true'}).insert(connection.tags[i].name);
				tddLI.insert(tddLIA);
				tddUL.insert(tddLI);
			}

			tddDiv.insert(tddUL);
		}

		var ltText = new Element("div",{'class':'link-type-text'}).insert(linktypelabel);
		if (linktypelabelfull.length > LINKTYPELABEL_CUTOFF) {
			ltText.title = linktypelabelfull;
		}
		ltWrap.insert(ltText);
		// set colour of ltText
		if (connection.linktype.grouplabel.toLowerCase() == "positive"){
			ltText.setStyle({"color":"#00BD53"});
		} else if (connection.linktype.grouplabel.toLowerCase() == "negative"){
			ltText.setStyle({"color":"#C10031"});
		} else if (connection.linktype.grouplabel.toLowerCase() == "neutral"){
			ltText.setStyle({"color":"#B2B2B2"});
		}

		//if user is logged in
		var hasMenu = false;
		if(USER != "" && includemenu){
			hasMenu = true;
			var ltMenu = new Element("div",{'class':'link-type-menu'});
			ltWrap.insert(ltMenu);
			var ddImg = new Element('img', {'src':URL_ROOT+'images/dropdown-grey.png','class':'drop-down-img'});
			Event.observe(ddImg,'mouseover',function (){ showPopup('dd'+uniQ)});
			Event.observe(ddImg,'mouseout',function (){ hidePopup('dd'+uniQ)});
			ltMenu.insert(ddImg);

			var ddDiv = new Element("div", {"id":"dd"+uniQ,"class":"drop-down"});
			Event.observe(ddDiv,'mouseover',function (){ showPopup("dd"+uniQ)});
			Event.observe(ddDiv,'mouseout',function (){ hidePopup("dd"+uniQ)});
			ltMenu.insert(ddDiv);

			var ddUL = new Element('ul',{'class':'dd-list'});

			//var ddLI = new Element('li',{'class':'dd-li'}).insert('Copy');
			//Event.observe(ddLI,'click',function (){copyConnection(connection.connid)});
			//ddUL.insert(ddLI);

			//if connection owner
			if (USER == connection.userid){

				var ddLI = new Element('li',{'class':'dd-li'}).insert('Edit');
				Event.observe(ddLI,'click',function (){loadDialog("editconn",URL_ROOT+"plugin/ui/connection.php?connid="+connection.connid, 790, 650)});
				ddUL.insert(ddLI);

				var ddLI = new Element('li',{'class':'dd-li'}).insert('Delete');
				Event.observe(ddLI,'click',function (){deleteConnection(connection.connid)});
				ddUL.insert(ddLI);
			}

			var ddLI = new Element('li',{'class':'dd-li'}).insert('<nobr>Get Snippet</nobr>');
			Event.observe(ddLI,'click',function (){ showSnippet(SNIPPET_TRIPLE, connection.connid) });
			ddUL.insert(ddLI);

			// Not at present as we could not decide where this sould go
			// same reason snippet has no context button.
			//var ddLI = new Element('li',{'class':'dd-li'}).insert('Get URL');
			//Event.observe(ddLI,'click',function (){ showURL(SNIPPET_TRIPLE, connection.connid) } );
			//ddUL.insert(ddLI);

			ddDiv.insert(ddUL);
		}

		if (hasTags && hasMenu) {
			ltText.style.width="120px";
		} else if (!hasTags && !hasMenu) {
			ltText.style.width="154px";
		} else if (hasTags && !hasMenu) {
			ltText.style.width="134px";
		} else if (!hasTags && hasMenu) {
			ltText.style.width="140px";
		}

		var iuDiv = new Element("div");
		iuDiv.style.marginLeft='100px';
		iuDiv.style.marginTop="3px";
		var imagelink = new Element('a', {
			'href':URL_ROOT+"user.php?userid="+connection.users[0].userid,
			'title':connection.users[0].name});
		imagelink.target = "_blank";
		var userimageThumb = new Element('img',{'title': connection.users[0].name, 'style':'padding-right:5px;','border':'0','src': connection.users[0].thumb});
		imagelink.insert(userimageThumb);
		iuDiv.insert(imagelink);
		linkDiv.insert(iuDiv);

		connDiv.insert(linkDiv);

		if (connectionDirection == CONNECTION_ARROWS_RIGHT) {
			var toDiv = new Element("div",{'class': 'toidea-horiz'});
			var toNode = renderNode(connection.to,'conn-to-idea'+uniQ, connection.torole, includemenu);

			toDiv.insert(toNode).insert('<div style="clear:both;"></div>');
			connDiv.insert(toDiv);
		} else {
			var fromDiv = new Element("div",{'class': 'fromidea-horiz'});

			var fromNode = renderNode(connection.from,'conn-from-idea'+uniQ, connection.fromrole, includemenu);
			fromDiv.insert(fromNode).insert('<div style="clear:both;"></div>');
			connDiv.insert(fromDiv);
		}
		return connDiv;
	}

   	window.onload = init;

</script>


<!-- DISPLAY AREA -->

<div style="float:left;">

	<?php if ($err != "") {
		echo $err;
	}
	?>

	<h3>SUMMARY</h3>
	<table cellspacing="2" style="border-collapse:collapse;" width="500">
		<tr style="background-color: #308D88; color: white">
			<td width="30%"><b>Name</b></td>
			<td width="30%"><b>Item</b></td>
			<td align="right" width="10%"><b>Count</b></td>
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
			<td valign="top" style="color: #666666 ">Most Popular Tag</td>
			<td valign="top"><?php echo $poptag; ?></td>
			<td valign="top" align="right"><?php echo $tags[$poptag]; ?></td>
			<td valign="top" align="right"><a href="#tags">top 10</a></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Compared Thinking</td>
			<td valign="top"></td>
			<td valign="top" align="right"><?php echo count($comparedArray); ?></td>
			<td valign="top" align="right"><a href="#compared">view all</a></td>
		</tr>
		<tr>
			<td valign="top" style="color: #666666 ">Information Broker</td>
			<td valign="top"></td>
			<td valign="top" align="right"><?php echo count($brokerArray); ?></td>
			<td valign="top" align="right"><a href="#broker">view all</a></td>
		</tr>
	</table>
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
	<h3>Node Types</h3>
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
	<!-- NODE TYPES used on Ideas -->
	<a name="compared"></a>
	<h3>Compared Thinking (privacy included)</h3>
	<div id="comparedThinking"></div>
<br>
	<!-- NODE TYPES used on Ideas -->
	<a name="broker"></a>
	<h3>Information Broker (privacy included)</h3>
	<div id="informationBroker"></div>


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