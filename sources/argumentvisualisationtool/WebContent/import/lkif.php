<?php

include_once("../config.php");

// Redirect to login page if user not logged in
if(!isset($USER->userid)){
  header('Location: ../login.php');
}

include_once("../includes/header.php");

include_once("../phplib/importlib.php");

global $CFG, $USER;
    
echo "<h1>Import LKIF XML</h1>";
    
$errors = array();

//if submitted then process the file
if(isset($_POST["import"])) {

	if($_POST["importsource"] == "file") {
		//upload the file
		if ($_FILES["lkifxmlfile"]['name'] != "") {
			$target_path = $CFG->workdir;
			$dt = time();

			//replace any non alphanum chars in filename
			$filename = $USER->userid ."_". $dt
				."_". basename(eregi_replace('[^A-Za-z0-9.]', '',
																		 $_FILES["lkifxmlfile"]['name']));

			$target_path = $target_path . $filename;
            
			if(!move_uploaded_file($_FILES["lkifxmlfile"]['tmp_name'],
														 $target_path)) {
				array_push($errors,"An error occured uploading the file");
			}
		}
	}

	if ($_POST["importsource"] == "url") {
		$target_path = $_POST["lkifxmlurl"];
	}

	$xml = new DOMDocument();
	if (!@$xml->load($target_path)) {
		array_push($errors,"Not a valid XML file");
	}

	if(empty($errors)) {
		$results = array();
		importLKIFXML($xml,$errors,$results);
                
		if (empty($errors)) {
			echo "<div class='results'>The file was sucessfully uploaded and
			imported:<ul>";

			foreach ($results as $result) {
				echo "<li>".$result."</li>";
			}
			echo "</ul></div>";
		}
	}

	if(!empty($errors)){
		echo "<div class='errors'>The following problems were found during
  the upload, please try again:<ul>";

		foreach ($errors as $error){
			echo "<li>".$error."</li>";
		}
		echo "</ul></div>";
	}

    //delete the file
    unlink($target_path);

}
     

?>
   
<form action="" method="post" enctype="multipart/form-data">
    <div class="formrow">
			<input class="forminput" type="radio" name="importsource"
						 value="file" checked="checked"
						 onclick="jQuery('#lkifxmlurl').attr('disabled', true);
											jQuery('#lkifxmlfile').attr('disabled', false)">
        <label class="formlabel" for="lkifxmlfile">From File:</label>
        <input class="forminput" id="lkifxmlfile" name="lkifxmlfile"
							 type="file" size="40" />
			</input>
    </div>
		<div class="formrow">
			<p>OR</p>
		</div>
		<div class="formrow">
			<input class="forminput" type="radio" name="importsource"
						 value="url"
						 onclick="jQuery('#lkifxmlurl').attr('disabled', false);
											jQuery('#lkifxmlfile').attr('disabled', true)">
        <label class="formlabel" for="lkifxmlurl">From URL:</label>
        <input class="forminput" id="lkifxmlurl" name="lkifxmlurl"
							 type="text" size="100" disabled="disabled"/>
			</input>
		</div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Import"
							 id="import" name="import" />
    </div>

</form>



<?php
if(isset($_POST["import"])) {
	// If form data has been submitted then hide form when we reload
	// page next time
	echo "<script type='text/javascript'>" .
		"jQuery(document).ready(function() {" .
		"jQuery('form').hide();" .
		"});" .
		"</script>";

	echo "<a href='lkif.php'>Import another LKIF file</a>";
}

include_once("../includes/footer.php");
?>