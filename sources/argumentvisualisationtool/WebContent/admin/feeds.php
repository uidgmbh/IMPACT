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

if(!isset($USER->userid)){
    header('Location: index.php');  
    return; 
}
?>

<h2>Feeds Created for Cohere</h2>

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
	} else{
		$qry = "select CreationDate FROM Triple order by CreationDate ASC Limit 1";
		$res = mysql_query( $qry, $con);
		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {					
				$startdate = $array['CreationDate'];	
			}
		}

		$qry = "select count(FeedID) as num from Feeds where CreationDate >= ".$startdate;
		$res = mysql_query( $qry, $con);
		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {					
				$count = $array['num'];
				echo '<div  class="hometext" style="float: left">Total feed count (from '.strftime( '%d/%m/%Y' ,$startdate).') = '.$count.'</div>';
			}
		}
?>				

	<!-- div style="clear: both; float: left; margin-top: 10px;" align="center"><img src="feedsGraph.php?time=weeks" /></div -->
	
	<div style="clear: both; float: left; margin-top: 10px;" align="center"><img src="feedsGraph.php?time=months" /></div>
	
	<div style="clear: both; float: left; margin-top: 10px;" class="adminTableDiv" align="center">
	
	<table width="650" cellpadding="2" border="1" style="border-collapse: collapse">
	
	<?php 							
		$qry = "select Feeds.Name, Feeds.URL, Feeds.FeedType, Feeds.CreationDate, Users.Name as UserName from Feeds left join Users on Feeds.UserID = Users.UserID where Feeds.CreationDate >= ".$startdate;
	
		if ($sort) {
			if ($direction) {
				if ($oldsort === $sort) {
					if ($direction === 'ASC') {
						$direction = "DESC";
					} else {
						$direction = "ASC";
					}
				} else {
					$direction = "ASC";
				}
			} else {
				$direction = "ASC";
			}
	
			if ($sort == 'name') {
				$qry .= ' ORDER BY Feeds.Name '.$direction;
			} else if ($sort == 'date') {
				$qry .= ' ORDER BY Feeds.CreationDate '.$direction;
			} else if ($sort == 'url') {
				$qry .= ' ORDER BY Feeds.URL '.$direction;						
			} else if ($sort == 'type') {
				$qry .= ' ORDER BY Feeds.FeedType '.$direction;						
			} else if ($sort == 'user') {
				$qry .= ' ORDER BY UserName '.$direction;						
			} 
		} else {
			$qry .= ' order by Feeds.CreationDate DESC';
			$sort='date';
			$direction='DESC'; 	
		}			
	
		echo '<td align="left" valign="bottom" width="15%" class="adminTableHead"><a href="feeds.php?&sort=date&lastsort='.$sort.'&lastdir='.$direction.'">Date';
		if ($sort === 'date') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td>';				
		echo '<td align="left" valign="bottom" width="25%" class="adminTableHead"><a href="feeds.php?&sort=name&lastsort='.$sort.'&lastdir='.$direction.'">Name';
		if ($sort === 'name') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td>';				
		echo '<td align="left" valign="bottom" width="15%" class="adminTableHead"><a href="feeds.php?&sort=type&lastsort='.$sort.'&lastdir='.$direction.'">Type';
		if ($sort === 'type') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td>';				
		echo '<td align="left" valign="bottom" width="20%" class="adminTableHead"><a href="feeds.php?&sort=user&lastsort='.$sort.'&lastdir='.$direction.'">Users';
		if ($sort === 'user') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td>';				
		echo '<td align="left" valign="bottom" width="25%" class="adminTableHead"><a href="feeds.php?&sort=url&lastsort='.$sort.'&lastdir='.$direction.'">URL';
		if ($sort === 'url') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td></tr>';				
	
		$res = mysql_query( $qry, $con);
		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {					
				$date = $array['CreationDate'];
				$name = $array['Name'];
				$type = $array['FeedType'];
				$url = $array['URL'];
				$user = $array['UserName'];
	
				echo '<tr>';
					echo '<td valign="top">';
						echo strftime( '%d %B %Y' ,$date);
					echo '</td>';
					echo '<td valign="top">';
						echo $name;
					echo '</td>';
					echo '<td valign="top">';
						echo $type;
					echo '</td>';
					echo '<td valign="top">';
						echo $user;
					echo '</td>';
					echo '<td valign="top">';
						$urltemp = $array['URL'];
						$lastStart = 0;
						while (strlen($urltemp) > 0) {
							if (strlen($urltemp) > 70) {
								echo substr($url, $lastStart, 70);
								echo '<br>';
								$urltemp = substr($url, $lastStart+70);
								$lastStart = $lastStart + 71;
							} else {
								echo $urltemp;
								$urltemp = "";
							}
						}
					echo '</td>';
				echo '</tr>';
			}
		}	
	}
}
?>	
</table>
</div>		

<?php
	include_once("footer.php");
?>