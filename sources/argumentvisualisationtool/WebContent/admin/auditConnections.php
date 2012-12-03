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

<h2>Connections Audited for Cohere</h2>

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
		$qry = "select ModificationDate FROM AuditTriple order by ModificationDate ASC Limit 1";
		$res = mysql_query( $qry, $con);
		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {					
				$startdate = $array['ModificationDate'];	
			}
		}
		//$startdate = mktime(0, 0, 0, 7, 18, 2007);

		echo '<div class="hometext" style="float:left; margin-bottom: 10px; font-size: 12pt;">Figures calculated from '.strftime( '%d/%m/%Y' ,$startdate).'</div>';

		echo '<div style="clear: both; float: left;">';
		echo '<table>';

		$qry = "select count(TripleID) as num from AuditTriple where ModificationDate >= ".$startdate;
		$res = mysql_query( $qry, $con);
		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {					
				$count = $array['num'];
				echo '<tr><td><span class="hometext">Total connection count</span></td><td><span class="hometext"> = '.$count.'</span</td></tr>';
			}
		}
		
		$qry = "SELECT count(TripleID) as num FROM AuditTriple WHERE ModificationDate >= ".$startdate." AND ChangeType='add'";
		$res = mysql_query( $qry, $con);
		if ($res) {
			$array = mysql_fetch_array($res, MYSQL_ASSOC);					
			$num = $array['num'];	
			echo '<tr><td><span class="hometext">Added connection count</span></td><td><span class="hometext"> = '.$num.'</span></td></tr>';
			
		}			

		$qry = "SELECT count(TripleID) as num FROM AuditTriple WHERE ModificationDate >= ".$startdate." AND ChangeType='edit'";
		$res = mysql_query( $qry, $con);
		if ($res) {
			$array = mysql_fetch_array($res, MYSQL_ASSOC);					
			$num2 = $array['num'];	
			echo '<tr><td><span class="hometext">Edited connection count</span></td><td><span class="hometext"> = '.$num2.'</span></td></tr>';
		}		

		$qry = "SELECT count(TripleID) as num FROM AuditTriple WHERE ModificationDate >= ".$startdate." AND ChangeType='delete'";
		$res = mysql_query( $qry, $con);
		if ($res) {
			$array = mysql_fetch_array($res, MYSQL_ASSOC);					
			$num3 = $array['num'];	
			echo '<tr><td><span class="hometext">Deleted connection count</span></td><td><span class="hometext"> = '.$num3.'</span></td></tr>';
		}		
		
		echo '</table></div>';
	}
}
?>				

<!-- div style="clear: both; float: left; margin-top: 20px;" align="center"><img src="auditConnectionsGraph.php?time=weeks" /></div -->

<!-- div style="clear: both; float: left; margin-top: 20px;" align="center"><img src="auditConnectionsGraph.php?time=months" /></div -->

</div>

<?php
	include_once("footer.php");
?>
