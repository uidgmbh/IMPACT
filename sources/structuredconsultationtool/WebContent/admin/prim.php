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
?>

<?php 
if (!isset($_POST['mode'])) {
	$_POST['mode'] = "undefine";
}

	switch($_POST['mode']){
		case "insert-agent":

			$sql="INSERT INTO agent (agent_name)

			VALUES

			('$_POST[agent_name]')";

			mysql_query($sql) or trigger_error(mysql_error());

		break;

		case "insert-action":
			if($_POST['agent']!=-1){
				$sql="INSERT INTO action (action_name, agent)

				VALUES

				('$_POST[action_name]','$_POST[agent]')";

				mysql_query($sql) or trigger_error(mysql_error());
			}

			break;
			
			
		case "insert-proposition":
			$sql="INSERT INTO proposition (proposition_string)
				VALUES
					('$_POST[proposition_string]')";
			mysql_query($sql) or trigger_error(mysql_error());
		break;

		case "insert-value":
			$sql="INSERT INTO value (value_name)
				VALUES
					('$_POST[value_name]')";

			mysql_query($sql) or trigger_error(mysql_error());
		break;


	case "insert-domain":

			$sql="INSERT INTO domain (domain_name)

			VALUES

			('$_POST[domain_name]')";

			mysql_query($sql) or trigger_error(mysql_error());

			break;
			
	case "insert-source":

				$sql="INSERT INTO source (source_name)

				VALUES

				('$_POST[source_name]')";

				mysql_query($sql) or trigger_error(mysql_error());

				break;
		default;
	}	
	

	if (isset($_POST['DeleteAction'])) {

		$sql="DELETE FROM Action WHERE action_id='{$_POST["DeleteAction"]}'";

		mysql_query($sql) or trigger_error(mysql_error());
		unset ($_POST['DeleteAction']);

	}
	
	if (isset($_POST['DeleteAgent'])) {

		$sql="DELETE FROM Agent WHERE agent_id='{$_POST["DeleteAgent"]}'";

		mysql_query($sql) or trigger_error(mysql_error());
		unset ($_POST['DeleteAgent']);

	}
	
	if (isset($_POST['DeleteProposition'])) {

		$sql="DELETE FROM Proposition WHERE Proposition_id='{$_POST["DeleteProposition"]}'";

		mysql_query($sql) or trigger_error(mysql_error());

		unset ($_POST['DeleteProposition']);

	}
	
	if (isset($_POST['DeleteValue'])) {

		$sql="DELETE FROM Value WHERE value_id='{$_POST["DeleteValue"]}'";

		mysql_query($sql) or trigger_error(mysql_error());

		unset ($_POST['DeleteValue']);

	}
	
	if (isset($_POST['DeleteDomain'])) {

		$sql="DELETE FROM Domain WHERE domain_id='{$_POST["DeleteDomain"]}'";

		mysql_query($sql) or trigger_error(mysql_error());

		unset ($_POST['DeleteDomain']);

	}

	
	
	if (isset($_POST['DeleteSource'])) {

		$sql="DELETE FROM Source WHERE source_id='{$_POST["DeleteSource"]}'";

		mysql_query($sql) or trigger_error(mysql_error());
		unset ($_POST['DeleteSource']);

	}
	

?>
<legend><h2>Agents</h2></legend>

<p>

<?php

	$dataAction = mysql_query("SELECT * FROM agent") or trigger_error(mysql_error()); 
	
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID</th><th>Agent</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataAction )) 
	{ 
		Print "<tr>";
		Print "<td>".$info['agent_id'] . "</td> ";
		Print "<td>".$info['agent_name'] . "</td> ";
		Print "<td>";

		print "<form action='prim.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteAgent' value=".$info['agent_id']." />";

		print "</form> ";

		print "</td> ";
		
	} 
	Print "</table>"; 
?>

<p>

<fieldset>
<form action="prim.php" method="POST">
<p>Agent: <input type="text" name="agent_name" /></p>
<input type="hidden" name="mode" value="insert-agent" />
<input type="submit">
</form>
</fieldset>

<p>


<legend><h2>Actions</h2></legend>

<p>

<?php

	$dataAction = mysql_query("SELECT action_id, action_name, agent_name FROM action, agent where action.agent = agent.agent_id") or trigger_error(mysql_error()); 
	
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID</th><th>Action</th><th>Agent</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataAction )) 
	{ 
		Print "<tr>";
		Print "<td>".$info['action_id']. "</td> ";
		Print "<td>".$info['action_name'] . "</td> ";
		Print "<td>".$info['agent_name'] . "</td> ";
		Print "<td>";
		print "<form action='prim.php' method='POST'>";
		print "<input type='submit' value='delete'/>";
		print "<input type='hidden' name='DeleteAction' value=".$info['action_id']." />";
		print "</form> ";
		print "</td> ";
	} 
	Print "</table>"; 
	
	$agentInfo = mysql_query("SELECT agent_id, agent_name FROM agent") or trigger_error(mysql_error());
?>

<p>

<fieldset>
<form action="prim.php" method="POST">
<p>Action: <input type="text" name="action_name" /></p>
<p>Agent: <select name = "agent"><?php  echo createOptions($agentInfo, 'agent_id', 'agent_name') ?></select></p>
<input type="hidden" name="mode" value="insert-action" />
<input type="submit">
</form>
</fieldset>

<p>


<legend><h2>Values</h2></legend>
<p>
<?php
	$dataValue = mysql_query("SELECT * FROM value") or trigger_error(mysql_error()); 
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID</th><th>Value</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataValue )) 
	{ 
		Print "<tr>";
		Print "<td>".$info['value_id'] . "</td> ";
		Print "<td>".$info['value_name'] . "</td> ";
		Print "<td>";

		print "<form action='prim.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteValue' value=".$info['value_id']." />";

		print "</form> ";

		print "</td> ";
	} 
	Print "</table>"; 
?>

<p>

<fieldset>
<form action="prim.php" method="POST">
<p>Value: <input type="text" name="value_name" /></p>
<input type="hidden" name="mode" value="insert-value" />
<input type="submit">
</form>
</fieldset>

<p>


<legend><h2>Propositions</h2></legend>

<p>

<?php

	$dataProp = mysql_query("SELECT * FROM proposition") or trigger_error(mysql_error()); 

	Print "<table border cellpadding=3>";
	Print "<th>ID</th><th>Proposition</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataProp ))
	{
		Print "<tr>";
		Print "<td>".$info['proposition_id'] . "</td> ";
		Print "<td>".$info['proposition_string'] . "</td> ";
		Print "<td>";

		print "<form action='prim.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteProposition' value=".$info['proposition_id']." />";

		print "</form> ";

		print "</td> ";
	}
	Print "</table>";
?>

<p>

<fieldset>
<form action="prim.php" method="POST">
<p>Proposition: <input type="text" name="proposition_string" /></p>
<input type="hidden" name="mode" value="insert-proposition" />
<input type="submit">
</form>
</fieldset>

<p>


<legend><h2>Domains</h2></legend>

<p>

<?php

	$dataProp = mysql_query("SELECT * FROM domain") or trigger_error(mysql_error()); 

	Print "<table border cellpadding=3>";
	Print "<th>ID</th><th>Domain</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataProp ))
	{
		Print "<tr>";
		Print "<td>".$info['domain_id'] . "</td> ";
		Print "<td>".$info['domain_name'] . "</td> ";
		Print "<td>";

		print "<form action='prim.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteDomain' value=".$info['domain_id']." />";

		print "</form> ";

		print "</td> ";

	}
	Print "</table>";
?>

<p>

<fieldset>
<form action="prim.php" method="POST">
<p>Domain Name: <input type="text" name="domain_name" /></p>
<input type="hidden" name="mode" value="insert-domain" />
<input type="submit">
</form>
</fieldset>

<p>


<legend><h2>Sources</h2></legend>
<p>
<?php

	$dataProp = mysql_query("SELECT * FROM source") or trigger_error(mysql_error()); 

	Print "<table border cellpadding=3>";
	Print "<th>ID</th><th>Source</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataProp ))
	{
		Print "<tr>";
		Print "<td>".$info['source_id'] . "</td> ";
		Print "<td>".$info['source_name'] . "</td> ";
		Print "<td>";

		print "<form action='prim.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteSource' value=".$info['source_id']." />";

		print "</form> ";

		print "</td> ";

	}
	Print "</table>";
?>

<p>

<fieldset>
<form action="prim.php" method="POST">
<p>Source Name: <input type="text" name="source_name" /></p>
<input type="hidden" name="mode" value="insert-source" />
<input type="submit">
</form>
</fieldset>

<p>
