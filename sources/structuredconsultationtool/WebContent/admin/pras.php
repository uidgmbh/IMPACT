<?php
include('../support/database_connect_admin.php');
include ('admin_header.php');

session_start();
if(isset($_SESSION['conjPorporties']))
	unset($_SESSION['conjPorporties']);
if(isset($_SESSION['conjValues']))
	unset($_SESSION['conjValues']);
if(isset($_SESSION['conjCSAS']))
	unset($_SESSION['conjCSAS']);
session_unset();
session_destroy();

session_start();
global $consequncesPRAS; 
$consequncesPRAS= array();
global $circumstancesPRAS;
$circumstancesPRAS= array();
global $valuesPRAS;
$valuesPRAS= array();

function createOptions($information, $value1, $value2){

	$optionsReturn = '<option value=-1 selected>N/A</option>';

	while($info = mysql_fetch_array($information)){
		$optionsReturn .= '<option value='.$info[$value1].'>'.$info[$value2].'</option>';
	}
	return $optionsReturn;
}

function createOptionsArray($infoArray){

	$optionsReturn = '<option value=-1 selected>N/A</option>';
	foreach($infoArray as $info ){
		$optionsReturn .= '<option value='.$info[0].'>'.$info[1].'</option>';
	}
	return $optionsReturn;
}
?>

<?php 
if (!isset($_POST['mode'])) {
	$_POST['mode'] = "undefine";
}

	switch($_POST['mode']){
		case "insert_new_pras":
			$sql="INSERT INTO practical_reasoning_as (circumstances, action, consequences, practical_reasoning_as.values)
			VALUES
			('$_POST[cicumstances]','$_POST[action]','$_POST[consequences]','$_POST[values]')";
			mysql_query($sql) or trigger_error(mysql_error());
			break;	
		default;
	}	

	if (isset($_POST['DeletePRAS'])) {
		$sql="DELETE FROM practical_reasoning_as WHERE practical_reasoning_as_id='{$_POST["DeletePRAS"]}'";
		mysql_query($sql) or trigger_error(mysql_error());
		unset ($_POST['DeletePRAS']);
	}
	

?>

<legend><h2>Practical Reasoning Schemes</h2></legend>
<?php

	$dataPRAS = mysql_query("SELECT practical_reasoning_as_id, practical_reasoning_as.circumstances, practical_reasoning_as.consequences, practical_reasoning_as.values, action_name, agent_name 
			 from practical_reasoning_as, action, agent 
			where practical_reasoning_as.action = action.action_id and agent.agent_id = action.agent") or trigger_error(mysql_error()); 

	Print "<table border cellpadding=3 width=80%>";
	Print "<tr>";
	Print "<th>ID</th><th>Circumstances</th><th>Action</th><th>Agent</th><th>Consequences</th><th>Values</th><th>Remove</th>";
	
		
	while($info = mysql_fetch_array($dataPRAS)){
		
		$conjCircum = $info['circumstances'];
		$conjConsq = $info['consequences'];
		$conjValue = $info['values'];

		
		$dataValues = mysql_query("select value_name from value, conjunction, value_occurrence 	where conjunction_id = value_occurrence.conjunction and value_id = value_occurrence.value
				and conjunction_id = '$conjValue'") or trigger_error(mysql_error());
		
		$dataCons = mysql_query("select proposition_string	 from proposition, conjunction, prop_occurrence where conjunction_id = prop_occurrence.conjunction and 
				proposition_id = prop_occurrence.proposition and conjunction_id = '$conjConsq'") or trigger_error(mysql_error());
		
		$dataCircum = mysql_query("select proposition_string	from proposition, conjunction, prop_occurrence where conjunction_id = prop_occurrence.conjunction and 
				proposition_id = prop_occurrence.proposition and conjunction_id = '$conjCircum'") or trigger_error(mysql_error());
				
		$conseqString ="";
		while($infoCons = mysql_fetch_array($dataCons)){
			$conseqString.= $infoCons['proposition_string']." - ";
		}
		
		$circumString ="";
		
		while($infoCircum = mysql_fetch_array($dataCircum)){
			$circumString.= $infoCircum['proposition_string']." - ";
		}
		
		$dataString ="";
		while($infoValues = mysql_fetch_array($dataValues)){
			$dataString.= $infoValues['value_name']." - ";
		}
					
		
		Print "<tr>";
		Print "<td width = 1%>".$info['practical_reasoning_as_id']."</td> ";									
		Print "<td width = 20%>".$circumString."</td> ";
		Print "<td width = 10%>".$info['action_name']."</td> ";
		Print "<td width = 4%>".$info['agent_name']."</td> ";
		Print "<td width = 20%>".$conseqString."</td> ";
		Print "<td width = 20%>".$dataString."</td> ";
		Print "<td>";
		print "<form action='pras.php' method='POST'>";
		print "<input type='submit' value='delete'/>";
		print "<input type='hidden' name='DeletePRAS' value=".$info['practical_reasoning_as_id']." />";
		print "</form> ";
		print "</td> ";
		print  "</tr>";
	}
	Print "</table>";
?>


<?php
	$actionInfo = mysql_query("SELECT action_id, action_name FROM action") or trigger_error(mysql_error());
	
	$conjunction = mysql_query("select distinct conjunction_id from conjunction") or trigger_error(mysql_error());
	while($infoConj = mysql_fetch_array($conjunction)){
		//get conjunction id
		$conjID = $infoConj['conjunction_id'];
		$dataProposition = mysql_query("select proposition_string from proposition, conjunction, prop_occurrence where conjunction_id = prop_occurrence.conjunction and
				proposition_id = prop_occurrence.proposition and conjunction_id = '$conjID'") or trigger_error(mysql_error());

		$dataValues = mysql_query("select value_name from value, conjunction, value_occurrence 	where conjunction_id = value_occurrence.conjunction and value_id = value_occurrence.value
		and conjunction_id = '$conjID'") or trigger_error(mysql_error());

		//build strings
		$propString ="";
		while($infoProp = mysql_fetch_array($dataProposition)){
			$propString.= $infoProp['proposition_string']."-";
		}
		
		$dataString ="";
		while($infoValues = mysql_fetch_array($dataValues)){
			$dataString.= $infoValues['value_name']." - ";
		}
		
		//add to array
		$propArray = array();
		if($propString!=""){
			array_push($propArray, $conjID);
			array_push($propArray, $propString);
			array_push($consequncesPRAS, $propArray);
			array_push($circumstancesPRAS, $propArray);
			
		}
		
		if($dataString!=""){
			$val = array();
			array_push($val, $conjID);
			array_push($val, $dataString);
			array_push($valuesPRAS, $val);
		}
	}
?>

<p>
<fieldset>
<legend><h2>New Practical Reasoning Scheme</h2></legend>
<form action="pras.php" method="POST">
<p>Cicumstances: <select name = "cicumstances"><?php  echo createOptionsArray($circumstancesPRAS) ?></select></p>
<p>
<p>Action: <select name = "action"><?php  echo createOptions($actionInfo, 'action_id', 'action_name') ?></select></p>
<p>
<p>Consequences: <select name = "consequences"><?php  echo createOptionsArray($consequncesPRAS) ?></select></p>
<p>
<p>Value: <select name = "values"><?php  echo createOptionsArray($valuesPRAS) ?></select></p>
<input type="hidden" name="mode" value="insert_new_pras" />
<input type="submit" value="Add">
</form>
</fieldset>
<p>