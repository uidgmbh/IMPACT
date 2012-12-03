
<?php
include('../support/database_connect.php');
session_start();
if(isset($_SESSION['conjPorporties']))
	unset($_SESSION['conjPorporties']);
if(isset($_SESSION['conjValues']))
	unset($_SESSION['conjValues']);
if(isset($_SESSION['conjCSAS']))
	unset($_SESSION['conjCSAS']);
if(isset($_SESSION['conjVRAS']))
	unset($_SESSION['conjVRAS']);
if(isset($_SESSION['newConsultation']))
	unset($_SESSION['newConsultation']);
if(isset($_SESSION['step']))
	unset($_SESSION['step']);
session_unset();
session_destroy();

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
		case "link-credible-source-value":
			if($_POST['value']!=-1 && $_POST['credibleSource']!=-1){	
			$sql="INSERT INTO consult_value (value, credible_source_as)
			VALUES
			('$_POST[value]','$_POST[credibleSource]')";
			mysql_query($sql) or trigger_error(mysql_error());
			}
		break;

			
		default;
	}	
	


	if (isset($_POST['DeleteLink'])) {
		$sql="DELETE FROM consult_value WHERE consult_value_id='{$_POST["DeleteLink"]}'";
		mysql_query($sql) or trigger_error(mysql_error());
		unset ($_POST['DeleteLink']);
	}
	
?>


<?php

	$dataConsultValue = mysql_query("SELECT consult_value_id, value_name, CONCAT('Expert : ', source_name, ', in : ', domain_name, ', supports: ',
	s.proposition_string, 'AND this PROPSITION is in the given DOMAIN') as info
	FROM consult_value, value, domain, source, credible_source_as, domain_source, domain_proposition, source_proposition, proposition as s, proposition as d
	WHERE  credible_source_as_id = consult_value.credible_source_as
	AND value.value_id =consult_value.value
	AND credible_source_as.domain_source = domain_source_id
	AND credible_source_as.domain_proposition = domain_proposition_id
	AND credible_source_as.source_proposition = source_proposition_id
	AND domain_source.domain = domain_id
	AND domain_source.source = source_id
	AND source_proposition.source = source_id
	AND domain_proposition.domain = domain_id
	AND domain_proposition.proposition = d.proposition_id
	AND source_proposition.proposition = s.proposition_id")
 	or trigger_error(mysql_error()); 
	
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID</th><th>Value</th><th>Credible Source Scheme</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataConsultValue )) 
	{ 
		Print "<tr>";
		Print "<td>".$info['consult_value_id'] . "</td> ";
		Print "<td>".$info['value_name']."</td> ";
		Print "<td>".$info['info']."</td> ";
		Print "<td>";
		print "<form action='consultationValue.php' method='POST'>";
		print "<input type='submit' value='delete'/>";
		print "<input type='hidden' name='DeleteLink' value=".$info['consult_value_id']." />";
		print "</form> ";
		print "</td> ";
	} 
	Print "</table>"; 
	
	$value = mysql_query("SELECT value_id, value_name FROM value") or trigger_error(mysql_error());
	$csas = mysql_query("select credible_source_as_id, CONCAT('Expert : ', source_name, ', in : ', domain_name, ', supports: ',
					s.proposition_string, 'AND this PROPSITION is in the given DOMAIN') as info
					from domain, source, credible_source_as, domain_source, domain_proposition, source_proposition, proposition as s, proposition as d
					where credible_source_as.domain_source = domain_source_id
					and credible_source_as.domain_proposition = domain_proposition_id
					and credible_source_as.source_proposition = source_proposition_id
					and domain_source.domain = domain_id
					and domain_source.source = source_id
					and source_proposition.source = source_id
					and domain_proposition.domain = domain_id
					and domain_proposition.proposition = d.proposition_id
					and source_proposition.proposition = s.proposition_id") or trigger_error(mysql_error());
	
?>

<p>
<legend><h2>New Consultation Value</h2></legend>
<p>
<fieldset>
<form action="consultationValue.php" method="POST">
<p>Value: <select name = "value"><?php  echo createOptions($value, 'value_id', 'value_name') ?></select></p>
<p>Credible Source: <select name = "credibleSource"><?php  echo createOptions($csas, 'credible_source_as_id', 'info') ?></select></p>
<input type="hidden" name="mode" value="link-credible-source-value" />
<input type="submit">
</form>
</fieldset>

<p>


