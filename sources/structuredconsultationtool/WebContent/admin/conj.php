<?php
session_start();
include('../support/database_connect_admin.php');
include ('admin_header.php');

?>

<?php 
function createOptions($information, $value){
	$optionsReturn = '<option selected>N/A</option>';
	while($info = mysql_fetch_array($information)){
		$optionsReturn .= '<option>'.$info[$value].'</option>';
	}
	return $optionsReturn;
}

function createValueOptions(){

	$optionsReturn = '<option selected>neutral</option>';
	$optionsReturn .= '<option selected>promoted</option>';
	$optionsReturn .= '<option selected>demoted</option>';

	

	return $optionsReturn;

}

function GenerateConjunctionID(){
	$maxConjunction = mysql_query("select MAX(conjunction_id) as maxConj from conjunction") or trigger_error(mysql_error());
	$infoMaxCon = mysql_fetch_array( $maxConjunction );

	$conjunctionID = $infoMaxCon['maxConj'];

	$conjunctionID = $conjunctionID+1;	

	mysql_query("INSERT INTO conjunction (conjunction_id) VALUES ('$conjunctionID')") or trigger_error(mysql_error());
	return $conjunctionID;
}

function GetNewID($tableName){
	$idField = $tableName."_id";

	$maxID = mysql_query("select MAX($idField) as maxID from $tableName") or trigger_error(mysql_error());

	$infoID = mysql_fetch_array($maxID);

	$maxID = $infoID['maxID'] + 1;

	return $maxID;

}
?>

<?php 
if (!isset($_POST['mode'])) {
	$_POST['mode'] = "undefined";
}

	switch($_POST['mode']){
		
		case "insert-proposition-conjunction":		
			if(isset($_SESSION['conjPorporties'])){
				$ConjProps = $_SESSION['conjPorporties'];
				$conjunctionID = GenerateConjunctionID();
				$sql="INSERT INTO conjunction (conjunction_id)

				VALUES ('$conjunctionID')";

				mysql_query($sql) or trigger_error(mysql_error());
				
				
				foreach ($ConjProps as $propString){
					$propIDQuery = mysql_query("select proposition_id from proposition where proposition_string='$propString'") or trigger_error(mysql_error());
					while($infoPropID = mysql_fetch_array( $propIDQuery )){

						$propID = $infoPropID['proposition_id'];

					}
					$sql="INSERT INTO prop_occurrence (conjunction, proposition)

					VALUES

					('$conjunctionID', '$propID')";

					mysql_query($sql) or trigger_error(mysql_error());
				}
				
				 unset ($_SESSION['conjPorporties']);
			}
		break;
		
		case "reset-proposition-conjunction":

			unset ($_SESSION['conjPorporties']);

			break;
			
		case "form-proposition-conjunction":
			if(isset($_SESSION['conjPorporties']) && $_POST['proposition']!="N/A"){
				$ConjProps = $_SESSION['conjPorporties'];
				array_push($ConjProps, $_POST['proposition']);
				$_SESSION['conjPorporties'] = $ConjProps;
			}
			break;

			
	//VALUES
			case "insert-value-conjunction":

				if(isset($_SESSION['conjValues'])){

					$ConjValue = $_SESSION['conjValues'];

					$conjunctionIDV = GenerateConjunctionID();
					

					foreach ($ConjValue as $valueOccurrence){
						$valueName = $valueOccurrence[0];
						$defaultChoice = $valueOccurrence[1];

						$valueIDQuery = mysql_query("select value_id from value where value_name='$valueName'") or trigger_error(mysql_error());

						//GetNewID
						while($infoValueID = mysql_fetch_array( $valueIDQuery)){

							$valueID = $infoValueID['value_id'];

						}
						if(isset($valueID)){
							$value_occurrence_id = GetNewID('value_occurrence');

							mysql_query("INSERT INTO value_occurrence (value_occurrence_id, value, conjunction)
							VALUES ($value_occurrence_id, $valueID, $conjunctionIDV)") or trigger_error(mysql_error());
							
							mysql_query("INSERT INTO value_occurrence_default_choice (value_occurrence, default_choice)

							VALUES ($value_occurrence_id, '$defaultChoice')") or trigger_error(mysql_error());

						}

					}

					unset ($_SESSION['conjValues']);

				}

				break;

			

			case "form-value-conjunction":

				if(isset($_SESSION['conjValues']) && $_POST['value']!="N/A"){

					$ConjValue = $_SESSION['conjValues'];
					$value_occurrence = array();
					array_push($value_occurrence, $_POST['value']);
					array_push($value_occurrence, $_POST['default_choice']);

					array_push($ConjValue, $value_occurrence);

					$_SESSION['conjValues'] = $ConjValue;

				}

				break;
				
			case "reset-value-conjunction":

				unset ($_SESSION['conjValues']);

				break;
		default;
	}	
	
	if (isset($_POST['DeleteConj'])) {

		$sql="DELETE FROM conjunction WHERE conjunction_id='{$_POST["DeleteConj"]}'";

		mysql_query($sql) or trigger_error(mysql_error());

		unset ($_POST['DeleteConj']);

	}
	

?>


<?php 
	$dataConjProp= mysql_query("select distinct conjunction_id 
								from prop_occurrence, conjunction 
								where conjunction_id = prop_occurrence.conjunction") or trigger_error(mysql_error());
	$propositions = mysql_query("SELECT * FROM proposition") or trigger_error(mysql_error());

	Print "<div id='contentWrap'>";
	Print "<div id='contentTop'>";
	Print "<legend><h2>Proposition Conjunctions</h2></legend>";
		  
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th>ID </th><th>Remove</th><th>Propositions</th>";
	
	while($info = mysql_fetch_array( $dataConjProp ))
	{
		$conjID = $info['conjunction_id'];						
		$dataPropositions = mysql_query("Select proposition_string from proposition, prop_occurrence, conjunction where conjunction_id = prop_occurrence.conjunction and proposition.proposition_id = prop_occurrence.proposition and conjunction_id='$conjID'") or trigger_error(mysql_error());
		$rowsconjProp =  1+mysql_num_rows($dataPropositions);
		Print "<tr>";
		Print "<td rowspan='$rowsconjProp'>".$conjID. "</td> ";	
		Print "<td rowspan='$rowsconjProp'>";

		print "<form action='conj.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteConj' value=".$conjID." />";

		print "</form>";

		print "</td> ";
		
		while($infoProp = mysql_fetch_array( $dataPropositions )){
			//$PropositionsString.= $infoProp['proposition_string']."-";
			Print "<tr><td>" .$infoProp['proposition_string']."</td></tr>";
		}
		
	
	}
	Print "</table>";
	Print "</div>";
	
	Print	"<div id='contentLeft'>";
	Print	"<ul>";
	Print	"<legend><h2>Propositions</h2></legend>";
	Print	"<fieldset>";
	Print	"<form action='conj.php' method='POST'>";
	print "<p>Porposition: <select name = 'proposition'>";
	echo createOptions($propositions, 'proposition_string');
	print "</select></p>";
	print "<input type='hidden' name='mode' value='form-proposition-conjunction'/>";
	print "<input type='submit' value='Add Proposition'>";
	print "</form>";
	print "</fieldset>";
	print "</div>";?>
	
	<?php 
		print "<div id='contentRight'>";
		print "<ul>";
		if(isset($_SESSION['conjPorporties'])){				
			foreach ($_SESSION['conjPorporties'] as $prop)
			{
				print "<li id='recordsArray_$prop $prop></li>";
			 }
		}
		else{

				global $ConjProps;

				$ConjProps=array();

				$_SESSION['conjPorporties'] = $ConjProps;

		} 
		print "<table>";
		print "<tr>";
		print "<td>";
		print "<form action='conj.php' method='POST'>";
		print "<input type='hidden' name='mode' value='insert-proposition-conjunction'/>";
		print "<input type='submit' value='Submit Propositions'>";
		print "</form>";
		print "</td>";
		print "<td>";
		print "<form action='conj.php' method='POST'>";
		print "<input type='hidden' name='mode' value='reset-proposition-conjunction'/>";
		print "<input type='submit' value='Reset'>";
		print "</form>";
		print "</td>";
		print "</tr>";
		print "</table>";
		print "</ul>";
		print "<p>&nbsp; </p>";
		print "</div>";
		print "</div>";

?>
	
<?php 
$dataConjValue = mysql_query("select distinct conjunction_id 
								from value_occurrence, conjunction 
								where conjunction_id = value_occurrence.conjunction") or trigger_error(mysql_error());

	print "<div id='contentWrap'>";
	print "<div id='contentTop'>";
	print "<legend><h2>Values Conjunctions</h2></legend>";	
	Print "<table border cellpadding=3>";
	Print "<tr>";
	Print "<th> ID </th><th>Remove</th><th>Values</th>";
	while($info = mysql_fetch_array($dataConjValue)){	

		$conjID = $info['conjunction_id'];
		$dataValues = mysql_query("Select value_name, default_choice
								from value, value_occurrence, conjunction, value_occurrence_default_choice
								where conjunction_id = value_occurrence.conjunction 
                				and value_occurrence_default_choice.value_occurrence = value_occurrence_id
								and value.value_id = value_occurrence.value 
								and conjunction_id=$conjID") or trigger_error(mysql_error());

		
		$rowsconjValues =  1+mysql_num_rows($dataValues);
		Print "<tr>";
		Print "<td rowspan='$rowsconjValues'>".$conjID."</td> ";	
		Print "<td rowspan='$rowsconjProp'>";

		print "<form action='conj.php' method='POST'>";

		print "<input type='submit' value='delete'/>";

		print "<input type='hidden' name='DeleteConj' value=".$conjID." />";

		print "</form>";

		print "</td> ";
		
		while($infoValue = mysql_fetch_array($dataValues)){
			Print "<tr><td>" .$infoValue['value_name']." - ".$infoValue['default_choice']."</td></tr>";
		}
	}
	Print "</table>";
	 Print "</div>";
?>	
<?php
	$values = mysql_query("SELECT * FROM Value") or trigger_error(mysql_error()); 
	Print "<div id='contentLeft'>";
	Print "<ul>";
	Print "<legend><h2>Values</h2></legend>";
	Print "<fieldset>";
	Print "<form action='conj.php' method='POST'>";
	Print "<p>Values: <select name = 'value'>";
	echo createOptions($values, 'value_name');
	print "</select></p>";
	
	Print "<p>Default Choice: <select name = 'default_choice'>";

	echo createValueOptions();

	print "</select></p>";
	
	Print "<input type='hidden' name='mode' value='form-value-conjunction' />";
	Print "<input type='submit' value='Add Value'>";
	Print "</form>";
	Print "</fieldset>";

	Print "</div>";
?>
<?php 
	print "<div id='contentRight'>";
	 Print "<ul>";
		if(isset($_SESSION['conjValues'])){				
			foreach ($_SESSION['conjValues'] as $value){
				print "<li>".$value[0]." - ".$value[1]."</li>";
			 }
			}
			else{
					global $ConjValues;
					$ConjValues=array();
					$_SESSION['conjValues'] = $ConjValues;
				} 
				
			print "<table>";
			
			print "<tr>";
			print "<td>";
			print "<form action='conj.php' method='POST'>";
			print "<input type='hidden' name='mode' value='insert-value-conjunction'/>";
			print "<input type='submit' value='Submit Values'>";
			print "</form>";
			print "</td>";
			print "<td>";
			print "<form action='conj.php' method='POST'>";
			print "<input type='hidden' name='mode' value='reset-value-conjunction'/>";
			print "<input type='submit' value='Reset'>";
			print "</td>";
			print "</tr>";
		  	print "</ul>";
		  	print "<p>&nbsp</p>";
			print "</div>";
	
	print "</div>";
	
print "</body>";
print "</html>";
?>