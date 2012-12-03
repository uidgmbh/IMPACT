<?php
	include_once("config.php");
	global $USER, $CFG;

	checkLogin();

	$groupset = getMyGroups();
	$groups = $groupset->groups;

	$continueOn = false;
	foreach($groups as $group){
		if ($group->groupid == $CFG->MDLLGroup) {
			$continueOn = true;
		}
	}

	if (!$continueOn) {
	    header('HTTP/1.0 404 Not Found');
	    die('Permission Denied');
	}

    $relativepath = optional_param('file', FALSE, PARAM_PATH);
    if (!$relativepath) {
	    header('HTTP/1.0 404 Not Found');
	    die('No valid arguments supplied or incorrect server configuration');
    }

    $pathname = $CFG->dataroot.$relativepath;

    // check that file exists
	if(!file_exists($pathname) || !is_file($pathname)) {
	    header('HTTP/1.0 404 Not Found');
	    die('The file does not exist');
	}

	// Make sure the file is an image
	$imagecheck = getimagesize($pathname);
	if(!$imagecheck) {
	    header('HTTP/1.0 403 Forbidden');
	    die('The file you requested is not an image.');
	}

	header("Pragma: public");
	header("Expires: 0");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	header("Content-Type: image/jpg");
	header("Content-length: " . filesize($pathname));

	// Print the image data
	readfile($pathname);
	exit();
?>
