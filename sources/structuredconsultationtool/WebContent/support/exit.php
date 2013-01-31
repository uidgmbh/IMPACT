<?php
PRINT  "<div class='survey toInit'>";
	PRINT  "<div class='intro'>";
	PRINT  "<h1>Thank you very much.</h1>";
	PRINT  "</div>";
	PRINT  "<div class='question'>";
	PRINT  "<h2>Your response submited successfully!</h2>";
	PRINT  "</div>";
	
	PRINT  "<form id = 'finish_sessions' method='post'>";
		PRINT  "<input type ='hidden' name= 'finish_sessions' value='FinishSurvey'>";
	PRINT  "</form>";
	PRINT  "<button id='backhome' class='next back_home'>Back home</button>";
PRINT  "</div>";
?>
