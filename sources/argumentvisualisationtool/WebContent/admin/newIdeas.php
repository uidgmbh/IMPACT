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

<h2>Ideas Created for Cohere</h2>

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
		$qry = "select CreationDate FROM Node order by CreationDate ASC Limit 1";
		$res = mysql_query( $qry, $con);
		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {					
				$startdate = $array['CreationDate'];	
				//echo strftime( '%d/%m/%Y' ,$startdate);
			}
		}

		//$startdate = mktime(0, 0, 0, 7, 18, 2007);
		echo '<div class="hometext" style="float:left; margin-bottom: 10px; font-size: 12pt;">Figures calculated from '.strftime( '%d/%m/%Y' ,$startdate).'</div>';

		echo '<div style="clear: both; float: left;"><table>';

		$qry = "select count(NodeID) as num from Node where CreationDate >= ".$startdate;
		$res = mysql_query( $qry, $con);
		if ($res) {
			$array = mysql_fetch_array($res, MYSQL_ASSOC);					
			$count = $array['num'];
			echo '<tr><td><span class="hometext">Total idea count</span></td><td><span class="hometext"> = '.$count.'</span</td></tr>';
		}
		
		$qry = "SELECT count(NodeID) as num FROM Node WHERE CreationDate >= ".$startdate." AND CreatedFrom='cohere'";
		$res = mysql_query( $qry, $con);
		$num = 0;
		if ($res) {
			$array = mysql_fetch_array($res, MYSQL_ASSOC);					
			$num = $array['num'];	
			echo '<tr><td><span class="hometext">Cohere idea count</span></td><td><span class="hometext"> = '.$num.'</span</td></tr>';
		}	
		
		$qry = "SELECT count(NodeID) as num FROM Node WHERE CreationDate >= ".$startdate." AND CreatedFrom != 'cohere'";
		$res = mysql_query( $qry, $con);
		$num = 0;
		if ($res) {
			$array = mysql_fetch_array($res, MYSQL_ASSOC);					
			$num2 = $array['num'];	
			echo '<tr><td><span class="hometext">Imported idea count</span></td><td><span class="hometext"> = '.$num2.'</span</td></tr>';
		}	
		
		echo '</table></div>';
		
?>				

<!-- div style="clear: both; float: left; margin-top: 20px;" align="center"><img src="newIdeasGraph.php?time=weeks" /></div -->

<div style="clear: both; float: left; margin-top: 20px;" align="center"><img src="newIdeasGraph.php?time=months" /></div>

<div style="clear: both; float: left; margin-top: 20px;" align="center">
<table width="650" cellpadding="2" border="1" style="border-collapse: collapse">
<?php 							
		$qry = "select Node.Name,  Node.Description,  Node.CreationDate,  Node.CreatedFrom, Users.Name as UserName from  Node left join Users on  Node.UserID = Users.UserID where  Node.CreationDate >= ".$startdate;

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
				$qry .= ' ORDER BY Node.Name '.$direction;
			} else if ($sort == 'date') {
				$qry .= ' ORDER BY Node.CreationDate '.$direction;
			} else if ($sort == 'desc') {
				$qry .= ' ORDER BY Node.Description '.$direction;						
			} else if ($sort == 'user') {
				$qry .= ' ORDER BY UserName '.$direction;						
			}  else if ($sort == 'origin') {
				$qry .= ' ORDER BY CreatedFrom '.$direction;						
			} 
		} else {
			$qry .= ' order by Node.CreationDate DESC';
			$sort='date';
			$direction='DESC'; 	
		}			

		echo '<tr><td align="left" valign="bottom" width="15%" class="adminTableHead"><a href="newIdeas.php?&sort=user&lastsort='.$sort.'&lastdir='.$direction.'">User';
		if ($sort === 'user') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td>';				
		echo '<td align="left" valign="bottom" width="30%" class="adminTableHead"><a href="newIdeas.php?&sort=name&lastsort='.$sort.'&lastdir='.$direction.'">Label';
		if ($sort === 'name') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td>';				
		echo '<td align="left" valign="bottom" width="15%" class="adminTableHead"><a href="newIdeas.php?&sort=date&lastsort='.$sort.'&lastdir='.$direction.'">Date';
		if ($sort === 'date') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td>';				
		echo '<td align="left" valign="bottom" width="30%" class="adminTableHead"><a href="newIdeas.php?&sort=desc&lastsort='.$sort.'&lastdir='.$direction.'">Description';
		if ($sort === 'desc') {
			if ($direction === 'ASC') {
				echo '<img border="0" src="../images/uparrow.gif" width="16" height="8" />';		
			} else {
				echo '<img border="0" src="../images/downarrow.gif" width="16" height="8" />';
			}
		}
		echo '</td>';				
		echo '<td align="left" valign="bottom" width="10%" class="adminTableHead"><a href="newIdeas.php?&sort=origin&lastsort='.$sort.'&lastdir='.$direction.'">Origin';
		if ($sort === 'origin') {
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
				$user = $array['UserName'];
				$name = $array['Name'];
				$date = $array['CreationDate'];
				$desc = $array['Description'];
				$origin = $array['CreatedFrom'];

				echo '<tr>';
					echo '<td valign="top">';
						echo $user;
					echo '</td>';
					echo '<td valign="top">';
						echo $name;
					echo '</td>';
					echo '<td valign="top">';
						echo strftime( '%d %B %Y' ,$date);
					echo '</td>';
					echo '<td valign="top">';
						echo $desc;
					echo '</td>';
					echo '<td valign="top">';
						echo $origin;
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