<?php
	header("Content-type: application/json");
	include('../support/database_connect.php');	
	$pras_id=-1;
	if (isset($_SESSION['pras_id'])){
		$pras_id = $_SESSION['pras_id'];
		unset($_SESSION['pras_id']);
	}
	
?>
<?php 
function fetchResponseForProposition($prasID, $consultation, $response, $propID){
	$query = "select count(*) as responses
				from proposition_prur, consultation_inst, consultation, practical_reasoning_as
				where consultation_id  = $consultation
				and practical_reasoning_as_id =$prasID
				and prop_resp = '$response'
				and proposition_prur.proposition=$propID
				and proposition_prur.consultation_inst = consultation_inst_id
				and consultation_inst.consultation = consultation_id
				and consultation.practical_reasoning_as = practical_reasoning_as_id";
	
	$resource = mysql_query($query) or trigger_error(mysql_query());
	$data = mysql_fetch_assoc($resource);
	if(isset($data)){
		return $data['responses'];
	} 
}

function fetchResponseForValue($prasID, $consultation, $response, $valueID){
	$query = "select count(*) as responses
				from value_prur, consultation_inst, consultation, practical_reasoning_as
				where consultation_id  = $consultation
				and practical_reasoning_as_id =$prasID
				and value_resp = '$response'
				and value_prur.value = $valueID
				and value_prur.consultation_inst = consultation_inst_id
				and consultation_inst.consultation = consultation_id
				and consultation.practical_reasoning_as = practical_reasoning_as_id";

	$resource = mysql_query($query) or trigger_error(mysql_query());
	$data = mysql_fetch_assoc($resource);
	if(isset($data)){
		return $data['responses'];
	}
}


function fetchValuesStats($prasID, $consultation, $premises){
	//get all circumstances for given pras and for each get the three responses count and then create an array
	$query = "select value_name, value_id
			from consultation, practical_reasoning_as, value_occurrence, conjunction, value
			where consultation_id  = $consultation
			and practical_reasoning_as_id =$prasID
			and consultation.practical_reasoning_as = practical_reasoning_as_id
			and practical_reasoning_as.values = conjunction_id
			and conjunction_id = value_occurrence.conjunction
			and value_occurrence.value = value_id";

	$resource = mysql_query($query) or trigger_error(mysql_query());
	while($info =  mysql_fetch_array($resource)){
		$demoteCount = fetchResponseForValue($prasID, $consultation, "demote", $info['value_id']);
		$promoteCount = fetchResponseForValue($prasID, $consultation, "promote", $info['value_id']);
		$nwwCount = fetchResponseForValue($prasID, $consultation, "NotWorthWhile", $info['value_id']);
		$neturalCount = fetchResponseForValue($prasID, $consultation, "neutral", $info['value_id']);
		
		$value = array(
				'id' => $info['value_name'],
				//'proposition_string' => $info['value_id'],
				'scheme_role' => 'Value',
				'promote_votes' =>$promoteCount,
				'demote_votes' =>$demoteCount,
				'neutral_votes' =>$neturalCount,
				'nw_votes' =>$nwwCount
		);
		$premises[] = array("statement" => $value);
	}
	return $premises;
}


function fetchCircumstanceStats($prasID, $consultation, $premises){
	//get all circumstances for given pras and for each get the three responses count and then create an array
	$query = "select proposition_string, proposition_id
				from  consultation, practical_reasoning_as, prop_occurrence, conjunction, proposition
				where consultation_id  = $consultation
				and practical_reasoning_as_id =$prasID
				and consultation.practical_reasoning_as = practical_reasoning_as_id
				and practical_reasoning_as.circumstances = conjunction_id
				and conjunction_id = prop_occurrence.conjunction
				and prop_occurrence.proposition = proposition_id";
	
	$resource = mysql_query($query) or trigger_error(mysql_query());
	while($info =  mysql_fetch_array($resource)){
		$agreeCount = fetchResponseForProposition($prasID, $consultation, "agree", $info['proposition_id']);
		$disagreeCount = fetchResponseForProposition($prasID, $consultation, "disagree", $info['proposition_id']);
		$naagreeCount = fetchResponseForProposition($prasID, $consultation, "n/a", $info['proposition_id']);
		
		$circumstace = array(
				'id' => $info['proposition_id'],
				//'proposition_string' => $info['proposition_string'],
				'scheme_role' => 'Circumstance',
				'agree_votes' =>$agreeCount,
				'disagree_votes' =>$disagreeCount,
				'na_votes' =>$naagreeCount
		);
		$premises[] = array("statement" => $circumstace);
	}
	
	return $premises;
}


function fetchConsequencesStats($prasID, $consultation, $premises){
	//get all circumstances for given pras and for each get the three responses count and then create an array
	$query = "select proposition_string, proposition_id
				from  consultation, practical_reasoning_as, prop_occurrence, conjunction, proposition
				where consultation_id  = $consultation
				and practical_reasoning_as_id =$prasID
				and consultation.practical_reasoning_as = practical_reasoning_as_id
				and practical_reasoning_as.consequences = conjunction_id
				and conjunction_id = prop_occurrence.conjunction
				and prop_occurrence.proposition = proposition_id";
	
	$resource = mysql_query($query) or trigger_error(mysql_query());
	while($info =  mysql_fetch_array($resource)){
		$agreeCount = fetchResponseForProposition($prasID, $consultation, "agree", $info['proposition_id']);
		$disagreeCount = fetchResponseForProposition($prasID, $consultation, "disagree", $info['proposition_id']);
		$naagreeCount = fetchResponseForProposition($prasID, $consultation, "n/a", $info['proposition_id']);		
		$consequences = array(
				'id' => $info['proposition_id'],
				//'proposition_string' => $info['proposition_string'],
				'scheme_role' => 'Consequence',
				'agree_votes' =>$agreeCount,
				'disagree_votes' =>$disagreeCount,
				'na_votes' =>$naagreeCount
		);
		$premises[] = array("statement" => $consequences);
	}
	
	return $premises;
}

function fetchConclusion($prasID, $consultation){
	//get all circumstances for given pras and for each get the three responses count and then create an array
	$query = "select action_name, action_id
				from consultation, practical_reasoning_as, action
				where consultation_id  = $consultation
				and practical_reasoning_as_id =$prasID
				and consultation.practical_reasoning_as = practical_reasoning_as_id
				and practical_reasoning_as.action = action_id";

	$resource = mysql_query($query) or trigger_error(mysql_query());
	$info =  mysql_fetch_array($resource);
	
	$conclusion = array(
				'id' => $info['action_id'],
				//'action_name' => $info['action_name'],
				'scheme_role' => 'Action'
		);
		$conclusions = array("statement" => $conclusion);

	return $conclusions;
}

function fetchPRASStats($prasID, $consultation){
	$argument = array();
			$argument['id'] = $prasID;
			$argument['scheme'] = 'Practical Reasoning';//debug: a more descriptive value here?
			$argument['conclusion'] = array();
			$premises = array();
			$premises = fetchCircumstanceStats($prasID, $consultation, $premises);
			$premises = fetchConsequencesStats($prasID, $consultation, $premises);
			$premises = fetchValuesStats($prasID, $consultation, $premises);
			$conclusion = array();
			$conclusion = fetchConclusion($prasID, $consultation);
			
			
			$argument['premises'] = $premises;
			$argument['conclusion'] = $conclusion;			
	
			return $argument;
}
?>
<?php
	if ($pras_id<0){
		header('HTTP/1.0 400 Bad Request');
		echo json_encode(
				array("error"=>"Could not parse request")
		);
	}
	else{
		$argument = fetchPRASStats($pras_id, $consultationID);
		echo json_encode($argument);
	}
	
?>
