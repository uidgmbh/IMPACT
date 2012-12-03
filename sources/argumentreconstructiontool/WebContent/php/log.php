<?php

define("LOG_PATH", "../log"); 

// set an handler to record all the errors!!!! 
set_error_handler("log_error");

/// This is a very simple function to log
function show_error($error) {
  trigger_error($error, E_USER_ERROR);
}

function show_warning($warning) {
  trigger_error($warning, E_USER_WARNING);
}

function show_message($message){
  trigger_error($message, E_USER_NOTICE);
  //log_message("messages.log", $message);
}

function log_error($errno, $errstr, $errfile, $errline) {
    // This error code is not included in error_reporting
    // if (!(error_reporting() & $errno)) {
    //    return;
    // }

    switch ($errno) {
      case E_USER_WARNING:
        $message = "Line $errline in file $errfile: $errstr.";
        $message .= "Backtrace:\n".print_r(debug_backtrace(), true);
        log_message("warnings.log", $message);
        stop();
        break;

      case E_USER_NOTICE:
        $message =  "Line $errline in file $errfile: $errstr.";
        log_message("notices.log", $message);
        break;

      case E_USER_ERROR:
      default:
        $message = "Line $errline in file $errfile: $errstr.\n";
        $message .= "Backtrace:\n".print_r(debug_backtrace(), true);
        log_message("errors.log", $message);
        stop();
        break;
    }
    if(ini_get("error_reporting") != 0 && ini_get("display_errors") != 0 && $errno != E_USER_NOTICE){
      echo $message."\n";
    }

    /* Don't execute PHP internal error handler */
    return true;
}

// It appends the message $message in the file $filename in the directory "/log"
// if $filename is "" or null it returns without any error
function log_message($filename, $message) {
 
  if ($filename == "" || $filename == NULL)
    return;
    
  $log_path = LOG_PATH;
  
  if (!is_dir($log_path))
    if (!mkdir($log_path)) {
      show_warning("The directory [$log_path] can't be created.");
      return;
    }
      
  $file = $log_path."/".$filename;  
  
  if (is_file($file)) if (!is_writable($file)) {
    show_warning("The file [$file] is not writable.");
    return;
  } 
    
  if (!$fhandle = fopen($file, "a")) {
     show_warning("The file [$file] can't be opened."); return;
  }
  
  if (flock($fhandle, LOCK_EX)) { // do an exclusive lock     
    if (fwrite($fhandle, date("[Y-m-d H:i]")." $message\n") === FALSE) {
      show_warning("The file [$file] can't be written.");
      flock($fhandle, LOCK_UN); // release the lock
      fclose($fhandle);
      return;
    }
    
    flock($fhandle, LOCK_UN); // release the lock
    fclose($fhandle);        
    return;
  } else {
    show_warning("The file [$file] can't be locked.");
    return;
  }
}

/**
 * Display a general error message and stop the program (thereby avoiding it 
 * from producing any more output), but only when we are in production mode.
 * @since 18 September 2012
 **/
function stop(){
  //if (there is a chance that) we are in production mode, exit the program.
  if(ini_get("error_reporting") == 0 || ini_get("display_errors") == 0){
    echo json_encode(array("error" => "An error occurred, and is logged in the log files. Please contact your system administrator."));
    exit(1);
  }
}
