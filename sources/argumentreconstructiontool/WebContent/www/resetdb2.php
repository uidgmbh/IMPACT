<?php
/*
$files = array("resetqueries.sql", "impact_UoL_UvA_DB_v1_2.sql");
foreach($files as $file){
  $command = "mysql -u 'root' --password='Leibniz01' --host='localhost' 'impact_UoL_UvA_DB_v1_2' < $file";
  echo exec($command);
}

header('Location: ../art.html');
 */
?>
<?php
include_once('../config/config.php');
//The resetqueries file just contains drop table-statements, which takes care of deleting all tables (in the right order, because foreign key constraints are violated otherwise)
//the other file is an SQL dump of the entire database, which puts back everyting in the original situation.
$files = array("resetqueries.sql", DATABASE_NAME.".sql");
foreach($files as $file){
  //If you have MAMP installed on a Mac, this should work.
  $command = "mysql -u '".DB_USERNAME."' --password='".DB_PASSWORD."' --host='".HOST_NAME."' '".DATABASE_NAME."' < $file";

  echo exec($command);
}

//you might want to redirect after being finished.
header('Location: index.html');

?>
Well, it might have worked out, I'd say: go check in the DB!

