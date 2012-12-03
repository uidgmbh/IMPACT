<?php

include('database_connect.php');

function getID($tableName){
	$fieldName=$tableName."_id";
	$maxQuery = "select MAX($fieldName) as maxID from $tableName";
	$maxID = mysql_query($maxQuery) or trigger_error(mysql_error()." Query was: ".$maxQuery);
	while($infoMaxID = mysql_fetch_array( $maxID )){
		$id = $infoMaxID['maxID'];
	}
	$id = $id+1;
	return $id;
}




$user_info = $_SESSION['user_info'];

if(isset($user_info)){
	$user_id = $user_info[0];
	$user_name = $user_info[1];
	$consultation_inst_id = $user_info[2];
	
}else{
	Print "error about the user info";
}


$user_id=getID("user");
$user_info[0] = $user_id;
//$user_id = mysql_insert_id();
$sql_user = "INSERT INTO `user` (`user_id`, `user_name`)
							VALUES ($user_id, '$user_name')"; 
mysql_query($sql_user)or trigger_error(mysql_error()." Query was: ".$sql_user);


//Jochem Douw: the ID 'consultation01' was hard-coded into the system, I replaced it with a hard-coded 1
//Begin code added by Jochem Douw (25 June 2012)
//Code overwrites default behaviour: consultation_inst_id should contain the real added ID in stead of the generated one
//Warning: this code is meant as a simple patch to get things working. A more structural solution has to be implemented!
//MAYA changed IDs function
$consultation_inst_id = getID("consultation_inst");
$user_info[2] = $consultation_inst_id;
$sql_consultation_inst = "INSERT INTO consultation_inst (consultation_inst_id, consultation, user)
							VALUES ($consultation_inst_id, $consultationID, $user_id)";


mysql_query($sql_consultation_inst)or trigger_error(mysql_error()." Query was: ".$sql_consultation_inst);
$_SESSION['user_info'] = $user_info;
//End code added by Jochem Douw


function submit_response($table_info, $consultation){
	$dataPRAS =mysql_query( "select practical_reasoning_as from consultation where consultation_id=$consultation") or trigger_error(mysql_error());
	$dataPRASInfo = mysql_fetch_array($dataPRAS);
	$prasID = $dataPRASInfo['practical_reasoning_as'];
	//double quote mark analyse the variable, while single quote mark does not.

	//it means that if variables surrounded in double quote, the brouser will inteprete it into what it is represent.

	$user_info = $_SESSION['user_info'];
	switch($table_info){
		case "circumstance_prur":
			$submit_circ = $_SESSION['circumstance_new'];			
			if(isset($submit_circ)){

				foreach($submit_circ as $circumstance){
					//0 => id, 1 => string, 2 => domain_source, 3 => source_proposition, 4 => domain_proposition
					//5 => credible source id
					//start from 6th value, elements are the reseponse of each question
					$sql_circumstance = "INSERT INTO proposition_prur
						(consultation_inst, practical_reasoning_as, proposition, prop_resp)
						VALUES ($user_info[2], $prasID, '$circumstance[0]', '$circumstance[6]')";
						mysql_query($sql_circumstance)or trigger_error(mysql_error()." Query was: ".$sql_circumstance);

					$sql_csur = "INSERT INTO credible_source_ur
					(credible_source_as, consultation_inst, domain_source_resp, domain_prop_resp,source_prop_resp)
					VALUES ($circumstance[5], $user_info[2],'$circumstance[7]', '$circumstance[9]', '$circumstance[8]')";
					mysql_query($sql_csur) or trigger_error(mysql_error());
				}
			}else{
				Print "Error submit session circ";
			}
			break;

		case "consequence_prur":
			$submit_cons = $_SESSION['consequence_new'];
		
			if(isset($submit_cons)){
				foreach($submit_cons as $consequence){
					//0 => id, 1 => string, 2 => domain_source, 3 => source_proposition, 4 => domain_proposition
					//5 => credible source id
					//start from 6th value, elements are the reseponse of each question
							
					$sql_consequence = "INSERT INTO proposition_prur
						(consultation_inst, practical_reasoning_as, proposition, prop_resp)
						VALUES ($user_info[2], $prasID, '$consequence[0]', '$consequence[6]');"; 

					mysql_query($sql_consequence) or trigger_error(mysql_error());
				
					$sql_csur = "INSERT INTO credible_source_ur
					(credible_source_as, consultation_inst, domain_source_resp, domain_prop_resp, source_prop_resp)
					VALUES ($consequence[5], $user_info[2],'$consequence[7]', '$consequence[9]', '$consequence[8]')";
					mysql_query($sql_csur) or trigger_error(mysql_error());
							 
				}
			}else{
				Print "Error submit session cons";
			}
			break;

				

		case "value_prur":
			$submit_value = $_SESSION['value_new'];
			if(isset($submit_value)){

				foreach($submit_value as $value){

					//0 => id, 1 => name,  2 => default_choice 3 => domain_source, 4 => source_proposition, 5 => domain_proposition
					//6 => credible_source_id 7=> value_recognition_as_id
					//8 => statement_authority_recognition 9=> statement_endows_value
					//start from 10th value, elements are the reseponse of each question

					$sql_value = "INSERT INTO value_prur
					(practical_reasoning_as,consultation_inst, value, value_resp)
					VALUES ('$prasID','$user_info[2]', '$value[0]', '$value[10]')"; 
					mysql_query($sql_value)or trigger_error(mysql_error()." Query was: ".$sql_value);

					$sql_csur = "INSERT INTO value_credible_source_ur
					(value_credible_source_as, consultation_inst, domain_source_resp, domain_action_value_resp, source_action_value_resp)
					VALUES ($value[6], $user_info[2],'$value[11]', '$value[12]', '$value[13]')";
					mysql_query($sql_csur)or trigger_error(mysql_error()." Query was: ".$sql_csur);
										
					$sql_vrur = "INSERT INTO value_vrur
					(value_recognition_as, consultation_inst, value, value_recog_resp, source_endow_resp)
					VALUES ($value[7], $user_info[2],$value[0], '$value[14]', '$value[15]')";
					mysql_query($sql_vrur)or trigger_error(mysql_error()." Query was: ".$sql_vrur);
				}
			}else{
				Print "Error submit session value";
			}
			break;
			
		case "external_info":
			$external_info = $_SESSION['external_info'];
			break;
		default:
			break;

	}



}
submit_response('circumstance_prur', $consultationID);
submit_response('consequence_prur', $consultationID);
submit_response('value_prur', $consultationID);
?>
