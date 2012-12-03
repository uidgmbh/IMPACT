<?php
	//include('../support/header.php');

	$external_info = $_SESSION['external_info'];
	global $real_response_external_info;
	$real_response_external_info = array();
	foreach ($external_info as $info){	
		if($info!="")
			array_push($real_response_external_info, $info);
	}
?>


<?php 
PRINT  "<div class='breadcrumb'>";
PRINT  "<ul>";
		PRINT  "<li>Introduction</li>";
		PRINT  "<li>Circumstances (+)</li>";
		PRINT  "<li>Consequences (+)</li>";
		PRINT  "<li>Values (+)</li>";
		PRINT  "<li><b>Summary</b></li>";
	PRINT  "</ul>";
PRINT  "</div>";
?>

<?php 
$user_info = $_SESSION['user_info'];
	print "<div class='survey toInit'>";
	print "<div class='intro'>";
	print "<h1 style='margin-top:0;'>Dear ". $user_info[1]."</h1>";
	print "<p>Thank you for your contribution to the consultation.</p>";
	print "<p>Here is the summary of your survey before submit your response</p>";
	print "</div>";

		//$whole_circumstance = $_SESSION['circumstance_new'];
		//0 => id, 1 => string, 2 => domain_source, 3 => source_proposition, 4 => domain_proposition
		//5 => credible source id
		//start from 6th value, elements are the reseponse of each question
			
		print "<div class='intro'>";
		print"<h2>Circumstances</h2>";
		print "</div>";
		$whole_circumstance = $_SESSION['circumstance_new'];
		
		foreach($whole_circumstance as $sub_circumstance){		
			Print "<table border cellpadding=3>";
			Print "<tr>";
			Print "<th>Circumstance Proposition</th><th>Responses</th>";
			Print "<tr>";
				Print "<td>".$sub_circumstance[1]. "</td> ";
				Print "<td>".$sub_circumstance[6]. "</td> ";
				Print "</tr>";

			if($sub_circumstance[6]!="agree"){
			Print "<tr>";
			Print "<th>Associated Credible Source</th>";
			Print "</tr>";
				Print "<tr>";
				Print "<td>".$sub_circumstance[2]. "</td> ";
				Print "<td>".$sub_circumstance[7]. "</td> ";
				Print "</tr>";
				
				Print "<tr>";
				Print "<td>".$sub_circumstance[3]. "</td> ";
				Print "<td>".$sub_circumstance[8]. "</td> ";
				Print "</tr>";
				
				Print "<tr>";
				Print "<td>".$sub_circumstance[4]. "</td> ";
				Print "<td>".$sub_circumstance[9]. "</td> ";
				Print "</tr>";
			}
			Print "</table>";
		}	
			
	?>

	

	<?php 
		
		print "<div class='intro'>";
		print"<h2>Consequences</h2>";
		print "</div>";
		//0 => id, 1 => string, 2 => domain_source, 3 => source_proposition, 4 => domain_proposition
		//5 => credible source id
		//start from 6th value, elements are the reseponse of each question

		$whole_consequence = $_SESSION['consequence_new'];
		
		foreach($whole_consequence as $sub_consequence){
				Print "<table border cellpadding=3>";
				Print "<tr>";
				Print "<th>Consequence Proposition</th><th>Responses</th>";
				
					Print "<tr>";
					Print "<td>".$sub_consequence[1]. "</td> ";
					Print "<td>".$sub_consequence[6]. "</td> ";
					Print "</tr>";
				if($sub_consequence[6]!="agree"){
				Print "<tr>";
				Print "<th>Associated Credible Source</th>";
				Print "</tr>";
					Print "<tr>";
					Print "<td>".$sub_consequence[2]. "</td> ";
					Print "<td>".$sub_consequence[7]. "</td> ";
					Print "</tr>";
					
					Print "<tr>";
					Print "<td>".$sub_consequence[3]. "</td> ";
					Print "<td>".$sub_consequence[8]. "</td> ";
					Print "</tr>";
					
					Print "<tr>";
					Print "<td>".$sub_consequence[4]. "</td> ";
					Print "<td>".$sub_consequence[9]. "</td> ";
					Print "</tr>";
				}
				Print "</table>";
			}
			
	
	?>

	<?php 
	$whole_value = $_SESSION['value_new'];
			print "<div class='intro'>";
		print"<h2>Values</h2>";
		print "</div>";
		//0 => id, 1 => name,  2 => default_choice 3 => domain_source, 4 => source_proposition, 5 => domain_proposition

		//6 => credible_source_id 7=> value_recognition_as_id

		//8 => statement_authority_recognition 9=> statement_endows_value
		//start from 7th value, elements are the reseponse of each question
		
		foreach($whole_value as $sub_value){
			//if($sub_value[10]!="agree"){
			Print "<table border cellpadding=3>";
			Print "<tr>";
			Print "<th>Value </th><th>Responses</th>";
			
				Print "<tr>";
				Print "<td>".$sub_value[1]. "</td> ";
				Print "<td>".$sub_value[10]. "</td> ";
				Print "</tr>";
			
			Print "</tr>";
			if($sub_value[2] != $sub_value[10])	{
			Print "<tr>";
			Print "<th>Associated Credible Source</th>";
			Print "</tr>";
				Print "<tr>";
				Print "<td>".$sub_value[3]. "</td> ";
				Print "<td>".$sub_value[11]. "</td> ";
				Print "</tr>";
				
				Print "<tr>";
				Print "<td>".$sub_value[4]. "</td> ";
				Print "<td>".$sub_value[12]. "</td> ";
				Print "</tr>";
				
				Print "<tr>";
				Print "<td>".$sub_value[5]. "</td> ";
				Print "<td>".$sub_value[13]. "</td> ";
				Print "</tr>";
				

			Print "</tr>";		
			Print "<tr>";
			Print "<th>Associated Value Recognition</th>";
			Print "</tr>";

				Print "<tr>";
				Print "<td>".$sub_value[8]. "</td> ";
				Print "<td>".$sub_value[14]. "</td> ";
				Print "</tr>";

				Print "<tr>";
				Print "<td>".$sub_value[9]. "</td> ";
				Print "<td>".$sub_value[15]. "</td> ";
				Print "</tr>";

					
		}	
			Print "</table>";

		}
	
	?>	
	<?php 
	if(sizeof($real_response_external_info)>0){
	print "<div class='intro'>";
		print "<h2>Appreciate your suggestions</h2>";
		print "</div>";
		print "<div class='intro'>";
		$external_info = $_SESSION['external_info'];
		
		Print "<table border cellpadding=3>";
	
			if($external_info[0]!=""){
			print "<tr> ";
			Print "<td>Circumstance</td>";
			Print "<td>".$external_info[0]. "</td> ";
			print "</tr> ";
			}
			if($external_info[1]!=""){
			print "<tr> ";
			Print "<td>Consequence</td>";
			Print "<td>".$external_info[1]. "</td> ";
			print "</tr> ";
			}
			if($external_info[2]!=""){
			print "<tr> ";
			Print "<td>values</td>";
			Print "<td>".$external_info[2]. "</td> ";
			print "</tr> ";
			}
		Print "</table>";
		}
		print "</div>";
	
	
	PRINT  "<div class='intro'>";
	PRINT  "<p>";
		PRINT  "Thank you very much for your participation, Would you like to submit your opinions?"; 
	print "</p>";
	print "</div>";
	print "<form id = 'submit_sessions' method='post'>";
		print "<input type ='hidden' name= 'submit_sessions' value='Submitpage!'>";
	print "</form>";
	print "<button id='submit' class='next' style='float:left'>Submit</button>";
print "</div>";
?>
