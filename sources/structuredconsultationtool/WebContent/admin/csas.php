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
	$_POST['mode'] = "undefine";
}

	switch($_POST['mode']){

/*insert into
 * domain_proposition
 * domain_source
 * source_proposition - get returned id.
 * credible_source_as*/
		case "insert_new_csas":
			
			$domain_source_max = mysql_query("select MAX(domain_source_id) as maxDS from domain_source") or trigger_error(mysql_error());
			$infoMaxCon = mysql_fetch_array( $domain_source_max );
			$domain_source_id = intval($infoMaxCon['maxDS'])+1;
			
			$sql="INSERT INTO domain_source (domain_source_id, domain, source)
			VALUES
			($domain_source_id, '$_POST[domain]','$_POST[source]')";
			mysql_query($sql) or trigger_error(mysql_error());
			
			$domain_prop_max = mysql_query("select MAX(domain_proposition_id) as maxDS from domain_proposition") or trigger_error(mysql_error());
			$infoMaxCon = mysql_fetch_array( $domain_prop_max );
			$domain_proposition_id = intval($infoMaxCon['maxDS'])+1;
			$sql="INSERT INTO domain_proposition (domain_proposition_id, domain, proposition)
			VALUES
			($domain_proposition_id, '$_POST[domain]','$_POST[domainProp]')";
			mysql_query($sql) or trigger_error(mysql_error());
				
			
			
			$source_proposition_max = mysql_query("select MAX(source_proposition_id) as maxDS from source_proposition") or trigger_error(mysql_error());
			$infoMaxCon = mysql_fetch_array( $source_proposition_max );
			$source_proposition_id = intval($infoMaxCon['maxDS'])+1;
				
			$sql="INSERT INTO source_proposition (source_proposition_id, source, proposition)
			VALUES
			($source_proposition_id, '$_POST[source]','$_POST[sourceProp]')";
			mysql_query($sql) or trigger_error(mysql_error());

			
			
			$sql="INSERT INTO credible_source_as(domain_source, source_proposition, domain_proposition)
			VALUES
			('$domain_source_id','$source_proposition_id','$domain_proposition_id')";
			mysql_query($sql) or trigger_error(mysql_error());
			
			break;	
			
			case "insert-csas-conjunction":
				if(isset($_SESSION['conjCSAS'])){
					$ConjCSAS = $_SESSION['conjCSAS'];
					$maxConjunction = mysql_query("select MAX(conjunction_id) as maxConj from conjunction") or trigger_error(mysql_error());
					while($infoMaxCon = mysql_fetch_array( $maxConjunction )){
						$conjunctionID = $infoMaxCon['maxConj'];
					}
					$conjunctionID = $conjunctionID+1;
						
					$sql="INSERT INTO conjunction (conjunction_id)
					VALUES ('$conjunctionID')";
					mysql_query($sql) or trigger_error(mysql_error());
						
						
					foreach ($ConjCSAS as $csasID){
							$sql="INSERT INTO credible_source_occurrence (conjunction, credible_source_as)
							VALUES
							('$conjunctionID', '$csasID')";
							mysql_query($sql) or trigger_error(mysql_error());
					}
					unset ($_SESSION['conjCSAS']);
				}
				break;
					
			case "form-csas-conjunction":
				if(isset($_SESSION['conjCSAS'])){
					$ConjCSAS = $_SESSION['conjCSAS'];
					array_push($ConjCSAS, $_POST['credibleSource']);
					$_SESSION['conjCSAS'] = $ConjCSAS;
				}
				break;
				
				case "reset-csas-conjunction":
					unset ($_SESSION['conjCSAS']);
					break;
				
		default;
	}	
	

	if (isset($_POST['DeleteCSAS'])) {
		$sql="DELETE FROM credible_source_as WHERE credible_source_as_id='{$_POST["DeleteCSAS"]}'";
		mysql_query($sql) or trigger_error(mysql_error());
		unset ($_POST['DeleteCSAS']);
	}
	
	if (isset($_POST['DeleteCSASConj'])) {
		$sql="DELETE FROM credible_source_occurrence WHERE conjunction='{$_POST["DeleteCSASConj"]}'";
		mysql_query($sql) or trigger_error(mysql_error());
		unset ($_POST['DeleteCSASConj']);
	}
	
?>
<?php
print "<div id='contentWrap'>";
print "<div id='contentTop'>";
print "<legend><h2>Credible Source Schemes</h2></legend>";


	$dataCSAS = mysql_query("select credible_source_as_id, source_name, domain_name, 
	s.proposition_string as source_porp, 
	d.proposition_string as domain_prop
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

	Print "<table border cellpadding=3 width=80%>";
	Print "<tr>";
	Print "<th>ID</th><th>Source</th><th>Expert in Domain</th><th>Source Proposition</th><th>Domain Proposition</th>";
	
		
	while($info = mysql_fetch_array($dataCSAS)){
		Print "<tr>";
		Print "<td width = 1%>".$info['credible_source_as_id']."</td> ";									
		Print "<td width = 20%>".$info['source_name']."</td> ";
		Print "<td width = 20%>".$info['domain_name']."</td> ";
		Print "<td width = 20%>".$info['source_porp']."</td> ";
		Print "<td width = 20%>".$info['domain_prop']."</td> ";
		Print "<td width = 5%>";
		print "<form action='csas.php' method='POST'>";
		print "<input type='submit' value='delete'/>";
		print "<input type='hidden' name='DeleteCSAS' value=".$info['credible_source_as_id']." />";
		print "</form>";
		print "</td> ";
		print  "</tr>";
	}
	Print "</table>";
?>


<?php
$propDData = mysql_query("select proposition_id, proposition_string from proposition") or trigger_error(mysql_error());
$propSData = mysql_query("select proposition_id, proposition_string from proposition") or trigger_error(mysql_error());
$sourceData = mysql_query("select source_id, source_name from source") or trigger_error(mysql_error());
$domainData = mysql_query("select domain_id, domain_name from domain") or trigger_error(mysql_error());

print "<p>";
print "<fieldset>";
print "<legend><h2>New Credible Source Scheme</h2></legend>";
print "<form action='csas.php' method='POST'>";
print "<p>Source: <select name = 'source'>";
echo createOptions($sourceData, 'source_id', 'source_name');
print "</select></p>";
print"<p>Expert in Domain: <select name = 'domain'>";
echo createOptions($domainData, 'domain_id', 'domain_name');
print "</select></p>";
print "<p>Source Proposition: <select name = 'domainProp'>";
echo createOptions($propSData, 'proposition_id', 'proposition_string');
print "</select></p>";
print "<p>Domain Proposition: <select name = 'sourceProp'>";
echo createOptions($propDData, 'proposition_id', 'proposition_string'); 
print "</select></p>";
print "<input type='hidden' name='mode' value='insert_new_csas'/>";
print "<input type='submit' value='Add'>";
print "</form>";
print "</fieldset>";

print "</body>";
print "</html>";
?>