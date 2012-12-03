<?php
PRINT  "<div class='survey toInit'>";
	PRINT  "<div class='intro'><p>";
	PRINT  "<b>Thank you very much.</b>";
	PRINT  "</p></div>";
	PRINT  "<div class='question'><p>";
	PRINT  "<b>Your response submited successfully!</b>";
	PRINT  "</p></div>";
	
	PRINT  "<form id = 'finish_sessions' method='post'>";
		PRINT  "<input type ='hidden' name= 'finish_sessions' value='FinishSurvey'>";
	PRINT  "</form>";
	PRINT  "<button id='backhome' class='next'>Back home</button>";
PRINT  "</div>";
?>