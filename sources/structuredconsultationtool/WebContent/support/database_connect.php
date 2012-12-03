<?php
/*- <connection>
  <connectionaName>localhost</connectionaName> 
  <user>root</user> 
  <password>root</password> 
  <database>impact_UoL_UvA_DB_v1_3</database> 
  </connection>*/

	$connectionPath = realpath($_SERVER['DOCUMENT_ROOT']).'/environment_vars/Connection_Vars.xml';

	if (file_exists($connectionPath)) {
		$connection_vars = simplexml_load_file($connectionPath);
		$status=mysql_connect("{$connection_vars->connectionaName}", "{$connection_vars->user}", "{$connection_vars->password}") or trigger_error(mysql_error());
		$status=mysql_select_db("{$connection_vars->database}") or trigger_error(mysql_error());
	}
	else{
		echo "ERROR WITH CONNECTION XML FILE : ".$connectionPath;
	}
   
	$consultationPath = realpath($_SERVER['DOCUMENT_ROOT']).'/environment_vars/Consultation_Vars.xml';
	global $consultationID;
	$consultationID=4;	
	
	if (file_exists($consultationPath)) {
		$consultation_vars = simplexml_load_file($consultationPath);
		$consultationID = $consultation_vars->ID;
	}
	else{
		echo "ERROR WITH CONSULTATION XML FILE";		
	}
	
	
?>
