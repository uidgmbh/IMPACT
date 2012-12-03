<?php
	session_start();
	include('../support/database_connect_admin.php');
	include ('admin_header.php');

	function createOptions($information, $value1, $value2){
	
		$optionsReturn = '<option  value=-1 selected>N/A</option>';
	
		while($info = mysql_fetch_array($information)){
			$optionsReturn .= '<option value='.$info[$value1].'>'.$info[$value2].'</option>';
		}
		return $optionsReturn;
	}	
	
	
?>

<?php 
if (!isset($_POST['mode'])) {
	$_POST['mode'] = "undefined";
}
	switch($_POST['mode']){
		case "insert-vras":		
			$sql="INSERT INTO value_recognition_as (value, source)
				VALUES
				 	('$_POST[value]','$_POST[source]')";
			mysql_query($sql) or trigger_error(mysql_error()) or trigger_error(mysql_error());
			break;
				
		default;
	}
	
	
	if (isset($_POST['DeleteVRAS'])) {
		$sql="DELETE FROM value_recognition_as WHERE value_recognition_as_id='{$_POST["DeleteVRAS"]}'";
		mysql_query($sql) or trigger_error(mysql_error());
		unset ($_POST['DeleteVRAS']);
	}	
	

?>



<legend><h2>Value Recognition Argumentation Schemes</h2></legend>
<p>
<?php
	$vrasData = mysql_query("select value_recognition_as_id, value_name, source_name
from value_recognition_as, source, value
where source_id = value_recognition_as.source
and value_id = value_recognition_as.value")
 or trigger_error(mysql_error()); 
	
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID</th><th>Value</th><th>Source</th><th>Remove</th>";
	while($info = mysql_fetch_array( $vrasData )) 
	{ 
		Print "<tr>";
		Print "<td>".$info['value_recognition_as_id'] . "</td> ";
		Print "<td>".$info['value_name']."</td> ";
		Print "<td>".$info['source_name']."</td> ";
		Print "<td>";
		print "<form action='vras.php' method='POST'>";
		print "<input type='submit' value='delete'/>";
		print "<input type='hidden' name='DeleteVRAS' value=".$info['value_recognition_as_id']." />";
		print "</form>";
		print "</td> ";
		
	} 
	Print "</table>"; 
	
	$valueName = mysql_query("SELECT value_id, value_name FROM value") or trigger_error(mysql_error());
	$sourceName = mysql_query("SELECT source_id, source_name FROM source") or trigger_error(mysql_error());	
?>
</p>
<p>
<legend><h2>New Value Recognition Argumentation Scheme</h2></legend>
<p>
<fieldset>
<form action="vras.php" method="POST">
<p>Value: <select name = "value"><?php  echo createOptions($valueName, 'value_id', 'value_name') ?></select></p>
<p>Expert: <select name = "source"><?php  echo createOptions($sourceName, 'source_id', 'source_name') ?></select></p>
<input type="hidden" name="mode" value="insert-vras" />
<input type="submit">
</form>
</fieldset>
</p>





</body>
</html>
