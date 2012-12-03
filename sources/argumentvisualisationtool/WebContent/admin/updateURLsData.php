<?php
		
include_once('../config.php');
				
global $USER, $CFG;

$sql = "Select URLID from URL";
$res = mysql_query($sql, $DB->conn);
while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
    $urlid = stripslashes(trim($array['URLID']));
    $sql2 = "SELECT tg.GroupID FROM URLNode ut
        INNER JOIN Node ON Node.NodeID = ut.NodeID
        INNER JOIN NodeGroup tg ON tg.NodeID = Node.NodeID
        WHERE ut.URLID = '".$urlid."'"; 
       	
    $res2 = mysql_query($sql2, $DB->conn);    
    while ($array2 = mysql_fetch_array($res2, MYSQL_ASSOC)) {
        $dt = time();
        $sql = "INSERT INTO URLGroup (URLID,GroupID,CreationDate) VALUES ('".$urlid."','".$array2['GroupID']."',".$dt.")";
        mysql_query( $sql, $DB->conn );
    }    
}
?>