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


function GetIDFromName($tableName, $searchName){
	$idField = $tableName."_id";
	$nameField = $tableName."_name";
	$data = mysql_query("Select $idField from $tableName where $nameField = '$searchName'") or trigger_error(mysql_error());
	if(mysql_num_rows($data)>0){

		$info = mysql_fetch_array($data);

		$id = $info[$idField];

		return $id;

	}

	else{

		return -1;

	}
}



function GenerateDomainSourceID($domain, $source){ //return real ID if the source is alread in DB or generates new ID if not.

	$domainData = mysql_query("Select domain_source_id from domain_source where domain = $domain and source=$source") or trigger_error(mysql_error());

	if(mysql_num_rows($domainData)>0){

		$infoDomain = mysql_fetch_array($domainData);

		$domainID = $infoDomain['domain_source_id'];

		return $domainID;

	}

	else{

		$maxID = mysql_query("select MAX(domain_source_id) as maxDomain from domain_source") or trigger_error(mysql_error());

		$infoID = mysql_fetch_array($maxID);

		$id = $infoID['maxDomain'];

		$id = $id+1;

		mysql_query("INSERT INTO domain_source (domain_source_id, domain, source)

		VALUES ($id, $domain, $source)") or trigger_error(mysql_error());

		return $id;

	}

}







function InsertNewValueCredibleSource($domain_source, $action, $value_default_choice){ //return real ID if the source is alread in DB or generates new ID if not.

	$data = mysql_query("Select value_credible_source_as_id

			from value_credible_source_as

			where domain_source = $domain_source

			and action=$action

			and value_occurrence_default_choice=$value_default_choice") or trigger_error(mysql_error());

	if(mysql_num_rows($data)>0){

		return;

	}

	else{

		mysql_query("INSERT INTO value_credible_source_as (domain_source, action, value_occurrence_default_choice)

		VALUES ($domain_source, $action, $value_default_choice)") or trigger_error(mysql_error());

	}

}


?>

<?php 
if (!isset($_POST['mode'])) {
	$_POST['mode'] = "undefine";
}

	switch($_POST['mode']){

		case "insert_new_vcsas":

			$domain_source_id = GenerateDomainSourceID($_POST['domain'], $_POST['source']);

			InsertNewValueCredibleSource($domain_source_id, $_POST['action'], $_POST['value_choice']);	
			break;				
		default;
	}	
	

	if (isset($_POST['DeleteVSAS'])) {

		$sql="DELETE FROM value_credible_source_as WHERE value_credible_source_as_id='{$_POST["DeleteVSAS"]}'";

		mysql_query($sql) or trigger_error(mysql_error());

		unset ($_POST['DeleteCSAS']);

	}
	
?>
<?php
print "<div id='contentWrap'>";
print "<div id='contentTop'>";
print "<legend><h2>Credible Source Schemes</h2></legend>";

	$dataVCSAS = mysql_query("select value_credible_source_as_id, source_name, domain_name, 
							value_name,value_occurrence_default_choice.default_choice, action_name
							from value_credible_source_as, 
							     domain_source, domain, source,
							     action, 
							     value_occurrence_default_choice, value_occurrence, value
							where value_credible_source_as.domain_source=domain_source_id
							and value_credible_source_as.action = action_id
							and domain_source.source = source_id
							and domain_source.domain=domain_id
							and value_credible_source_as.value_occurrence_default_choice = value_occurrence_default_choice_id
							and value_occurrence_default_choice.value_occurrence = value_occurrence_id
							and value_occurrence.value = value_id") or trigger_error(mysql_error()); 

	Print "<table border cellpadding=3 width=80%>";
	Print "<tr>";
	Print "<th>ID</th><th>Source</th><th>Expert in Domain</th><th>Value</th><th>Default Choice</th><th>Action</th>";
	
		
	while($info = mysql_fetch_array($dataVCSAS)){
		Print "<tr>";
		Print "<td width = 1%>".$info['value_credible_source_as_id']."</td> ";									
		Print "<td width = 20%>".$info['source_name']."</td> ";
		Print "<td width = 20%>".$info['domain_name']."</td> ";
		Print "<td width = 20%>".$info['value_name']."</td> ";
		Print "<td width = 20%>".$info['default_choice']."</td> ";
		Print "<td width = 20%>".$info['action_name']."</td> ";
		Print "<td width = 5%>";

		print "<form action='csas.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteVSAS' value=".$info['value_credible_source_as_id']." />";

		print "</form>";

		print "</td> ";
		print  "</tr>";
	}
	Print "</table>";
?>


<?php
$sourceData = mysql_query("select source_id, source_name from source") or trigger_error(mysql_error());
$domainData = mysql_query("select domain_id, domain_name from domain") or trigger_error(mysql_error());
$actionData = mysql_query("select action_id, action_name from action") or trigger_error(mysql_error());

$valueData = mysql_query("select value_occurrence_default_choice_id, Concat(value_name, ' - ' , default_choice) as value_choice
from value_occurrence_default_choice, value_occurrence, value
where value_occurrence_default_choice.value_occurrence = value_occurrence_id
and value_occurrence.value = value_id") or trigger_error(mysql_error());



print "<p>";
print "<fieldset>";
print "<legend><h2>New Credible Source Scheme</h2></legend>";
print "<form action='vcsas.php' method='POST'>";
print "<p>Source: <select name = 'source'>";
echo createOptions($sourceData, 'source_id', 'source_name');
print "</select></p>";
print"<p>Expert in Domain: <select name = 'domain'>";
echo createOptions($domainData, 'domain_id', 'domain_name');
print "</select></p>";
print "<p>Says that Action: <select name = 'action'>";
echo createOptions($actionData, 'action_id', 'action_name');
print "</select></p>";
print "<p>Relates to Value: <select name = 'value_choice'>";
echo createOptions($valueData, 'value_occurrence_default_choice_id', 'value_choice'); 
print "</select></p>";
print "<input type='hidden' name='mode' value='insert_new_vcsas'/>";
print "<input type='submit' value='Add'>";
print "</form>";
print "</fieldset>";

print "</body>";
print "</html>";
?>