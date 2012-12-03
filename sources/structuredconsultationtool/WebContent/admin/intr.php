<?php
session_start();
include('../support/database_connect_admin.php');

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
		case "insert-domain-source":
			if($_POST['domain']!=-1 && $_POST['source']!=-1){	
			$sql="INSERT INTO domain_source (domain, source)
			VALUES
			('$_POST[domain]','$_POST[source]')";
			mysql_query($sql) or trigger_error(mysql_error());
			}
		break;

		case "insert-source-prop":
			if($_POST['proposition']!=-1 && $_POST['source']!=-1){	
				$sql="INSERT INTO source_proposition (proposition, source)
				VALUES
				('$_POST[proposition]','$_POST[source]')";
				mysql_query($sql) or trigger_error(mysql_error());
			}
			break;
			
		case "insert-domain-prop":

			if($_POST['proposition']!=-1 && $_POST['domain']!=-1){						

				$sql="INSERT INTO domain_proposition (domain,proposition)

					VALUES

					('$_POST[domain]','$_POST[proposition]')";

				mysql_query($sql) or trigger_error(mysql_error());
			}

			break;
				
		default;
	}	
	

	
	if (isset($_POST['DeleteDomainSource'])) {

		$sql="DELETE FROM domain_source WHERE domain_source_id='{$_POST["DeleteDomainSource"]}'";

		mysql_query($sql) or trigger_error(mysql_error());

		unset ($_POST['DeleteDomainSource']);

	}
	
	if (isset($_POST['DeleteDomainProp'])) {

		$sql="DELETE FROM domain_proposition WHERE domain_proposition_id='{$_POST["DeleteDomainProp"]}'";

		mysql_query($sql) or trigger_error(mysql_error());

		unset ($_POST['DeleteDomainProp']);

	}
	
	if (isset($_POST['DeleteSourceProp'])) {

		$sql="DELETE FROM source_proposition WHERE source_proposition_id='{$_POST["DeleteSourceProp"]}'";

		mysql_query($sql) or trigger_error(mysql_error());

		unset ($_POST['DeleteSourceProp']);

	}
?>


<?php

	$dataDomainSource = mysql_query("SELECT domain_source_id, domain_name, source_name 
	FROM domain_source, domain, source
	where domain_source.domain = domain.domain_id
	and domain_source.source = source.source_id")
 or trigger_error(mysql_error()); 
	
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID</th><th>Domain</th><th>Source</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataDomainSource )) 
	{ 
		Print "<tr>";
		Print "<td>".$info['domain_source_id'] . "</td> ";
		Print "<td>".$info['domain_name']."</td> ";
		Print "<td>".$info['source_name']."</td> ";
		Print "<td>";

		print "<form action='intr.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteDomainSource' value=".$info['domain_source_id']." />";

		print "</form> ";

		print "</td> ";
	} 
	Print "</table>"; 
	
	$domainName = mysql_query("SELECT domain_id, domain_name FROM domain") or trigger_error(mysql_error());
	$sourceName = mysql_query("SELECT source_id, source_name FROM source") or trigger_error(mysql_error());
	
?>

<p>
<legend><h2>New Domain Source</h2></legend>
<p>
<fieldset>
<form action="intr.php" method="POST">
<p>Domain: <select name = "domain"><?php  echo createOptions($domainName, 'domain_id', 'domain_name') ?></select></p>
<p>Source: <select name = "source"><?php  echo createOptions($sourceName, 'source_id', 'source_name') ?></select></p>
<input type="hidden" name="mode" value="insert-domain-source" />
<input type="submit">
</form>
</fieldset>

<p>

<?php
	$dataPropSource = mysql_query("SELECT source_proposition_id, proposition_string, source_name 
	FROM source_proposition, proposition, source
	where source_proposition.proposition = proposition.proposition_id
	and source_proposition.source = source.source_id")
 or trigger_error(mysql_error()); 
	
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID</th><th>Proposition</th><th>Source</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataPropSource )) 
	{ 
		Print "<tr>";
		Print "<td>".$info['source_proposition_id'] . "</td> ";
		Print "<td>".$info['proposition_string']."</td> ";
		Print "<td>".$info['source_name']."</td> ";
		Print "<td>";

		print "<form action='intr.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteSourceProp' value=".$info['source_proposition_id']." />";

		print "</form> ";

		print "</td> ";
		
	} 
	Print "</table>"; 
	
	$propositionString = mysql_query("SELECT proposition_id, proposition_string FROM proposition") or trigger_error(mysql_error());
	$sourceName = mysql_query("SELECT source_id, source_name FROM source") or trigger_error(mysql_error());
	
?>

<p>
<legend><h2>New Source Proposition</h2></legend>
<p>
<fieldset>
<form action="intr.php" method="POST">
<p>Proposition: <select name = "proposition"><?php  echo createOptions($propositionString,'proposition_id' ,'proposition_string') ?></select></p>
<p>Source: <select name = "source"><?php  echo createOptions($sourceName,'source_id', 'source_name') ?></select></p>
<input type="hidden" name="mode" value="insert-source-prop" />
<input type="submit">
</form>
</fieldset>

<p>


<?php
	$dataPropDomain = mysql_query("SELECT domain_proposition_id, proposition_string, domain_name 
	FROM domain_proposition, proposition, domain
	where domain_proposition.proposition = proposition.proposition_id
	and domain_proposition.domain = domain.domain_id")
 or trigger_error(mysql_error()); 
	
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID</th><th>Proposition</th><th>Domain</th><th>Remove</th>";
	while($info = mysql_fetch_array( $dataPropDomain )) 
	{ 
		Print "<tr>";
		Print "<td>".$info['domain_proposition_id'] . "</td> ";
		Print "<td>".$info['proposition_string']."</td> ";
		Print "<td>".$info['domain_name']."</td> ";
		Print "<td>";

		print "<form action='intr.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteDomainProp' value=".$info['domain_proposition_id']." />";

		print "</form> ";

		print "</td> ";
	} 
	Print "</table>"; 
	
	$propositionString = mysql_query("SELECT proposition_id, proposition_string FROM proposition") or trigger_error(mysql_error());
	$domainName = mysql_query("SELECT domain_id, domain_name FROM domain") or trigger_error(mysql_error());
	
?>

<p>
<legend><h2>New Domain Proposition</h2></legend>
<p>
<fieldset>
<form action="intr.php" method="POST">
<p>Proposition: <select name = "proposition"><?php  echo createOptions($propositionString, 'proposition_id', 'proposition_string') ?></select></p>
<p>Domain: <select name = "domain"><?php  echo createOptions($domainName, 'domain_id', 'domain_name') ?></select></p>
<input type="hidden" name="mode" value="insert-domain-prop" />
<input type="submit">
</form>
</fieldset>
<p>




