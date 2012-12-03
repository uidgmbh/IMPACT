<?php
/**
 * This class was taken from the code of the Wrox book Professional PHP5, and 
 * adapted. Nice as future addition: make extra parameter for select, update, 
 * etc functions with field name list, so one does not always have all fields 
 * (with the * operator) as result.
 * @since 4 September 2012
 **/
require_once('../config/config.php');

class Database {

  private $connection;

  /**
   * The constructor connects to the database and uses the parameters for that. 
   * It also instantiates the private global relationReader object so that the 
   * argument schemes are available in every function of this class.
   * @param string $host The host of the database
   * @param string $db The database
   * @param string $user The username
   * @param string $password The password
   */
  public function __construct($host = false,
                              $db = false,
                              $user = false,
                              $password = false){
    if(!$host && !$db && !$user && !$password){
      $host     = HOST_NAME;
      $db       = DATABASE_NAME;
      $user     = DB_USERNAME;
      $password = DB_PASSWORD;
    } else if(!($host && $db && $user && $password)){
      //if it is not the case that either every parameter is defined or every parameter is undefined, an error should be thrown.
      show_error("Error in defined parameters");
    }
    show_message("starting connection with $db");
    $this->connection = mysqli_connect($host, $user, $password);
    show_message("connection successful");
    show_message("selecting charset utf8..");
    mysqli_set_charset($this->connection, 'utf8');
    show_message("selecting database $db..");
    mysqli_select_db($this->connection, $db);
    show_message("database $db selected.");
    if(mysqli_connect_error()) {
      $connString  = ' host=' . $host;
      $connString .= ' user=' . $user;
      $connString .= ' db=' . $db;
      show_warning(mysqli_error($this->connection)."Unable to connect to the database using \"$connString\"");
    }
//    $backtrace = debug_backtrace();  //debug
//    if($backtrace[2]){ //debug
//      echo "calling function: ".$backtrace[2]['function']."\n"; //debug
//      echo "calling class: ".$backtrace[2]['class']."\n"; //debug
//    } //debug
  }

  /**
   * Performs a SELECT query.
   * @param string $table Table in which to search
   * @param array $arConditions Conditions that have to be met (results in 
   * condition: key = value)
   * @retval array Results of the select statement (empty row when no 
   * results). Keys are simply 0 to n-1 (n being the number of rows), values 
   * are the rows as associative array (keys are the field names)
   * @since 4 September 2012
   **/
  public function select($table, $arConditions) {

    // create a useful array for the WHERE clause 
    $arWhere = array();
    foreach($arConditions as $field => $val) {
      if(! is_numeric($val)) {
        //make sure the values are properly escaped
        $val = "'" . mysqli_escape_string($this->connection, $val) . "'";
      }      
      //for security reasons, also escape the field
      $field = mysqli_escape_string($this->connection, $field);      

      $arWhere[] = "$field = $val";
    }

    $sql = "SELECT * FROM $table ";
    if(count($arWhere) > 0){
      $sql .= 'WHERE ' . join(' AND ', $arWhere);
    }

    //echo "QUERY: $sql\n"; //debug
    $hRes = mysqli_query($this->connection, $sql);
    if(!$hRes) {
      $err = mysqli_error($this->connection) ."\nquery was:\n". $sql;
      show_warning($err);
    }

    $arReturn = array();
    while( $row = mysqli_fetch_assoc($hRes) ) {
      $arReturn[] = $row;
    }
    return $arReturn; 
  }

  /**
   * Selects the conjuncts that belong to a certain database row.
   * @param string $tableName The table in which the conjunction is referenced
   * @param int $tableID ID of the entity in the given $table.
   * @param string $fieldName Name of the field in the table of which the 
   * contents refer to the row in the specified conjunction table.
   * @param string $conjunctiontable The table in which the conjunction is 
   * stored as 1 row
   * @param string $occurrencetable The table in which one row represents one 
   * occurrence, that links to the conjunction it belongs to, as well as to the 
   * actual conjunct we're looking for.
   * @param string $conjunctType The type of the actual conjunct, i.e. the name 
   * of the table where the conjunct is actually stored.
   * @retval array The conjuncts given as elements of this non-associative 
   * array.
   * @since 1 October 2012
   */
  public function selectConjuncts($tableName, $tableID, $fieldName, $conjunctiontable, $occurrencetable, $conjunctType){
    $result = array();
    $query = "SELECT $conjunctType.*, $tableName.{$fieldName} FROM $tableName, $conjunctiontable, $occurrencetable, $conjunctType
      WHERE $tableName.{$tableName}_id = $tableID
      AND $tableName.{$fieldName} = $conjunctiontable.${conjunctiontable}_id
      AND $occurrencetable.{$conjunctiontable} = $conjunctiontable.${conjunctiontable}_id
      AND $occurrencetable.$conjunctType = $conjunctType.${conjunctType}_id";

    $resource = mysqli_query($this->connection, $query) or show_error("The following MySQL error occurred: ".mysqli_error($this->resource));

    //for every found conjunct...
    while($conjunct = mysqli_fetch_assoc($resource)){
      $result[] = $conjunct;
    }
    return $result;
  }

  /**
   * Store the "trail" from a conjunction to it's conjuncts, consisting of 
   * entries in the conjunction table and the occurrence table. Return the ID of 
   * the saved conjunct. (originally from class.Storage.php)
   * @param {associative array} $conjuncts The conjuncts for which a conjunction 
   * has to be made
   * @param {string} $occurrenceTable Name of the occurrence table
   * @param {string} $conjunctionTable Name of the conjunction table
   * @since 2 August 2012
   **/
  public function insertConjunctionTrailDEPRECATED($conjuncts, $occurrenceTable, $conjunctionTable){
    //save conjunction
    $query = "INSERT INTO $conjunctionTable SET ${conjunctionTable}_name='added by ART'";
    mysqli_query($this->connection, $query) or show_warning(mysqli_error($this->connection)." # Query = $query ");
    //with id of conjunction, save occurrence
    $conjunctionID = mysqli_insert_id($this->connection);
    foreach($conjuncts as $conjunct){
      $query2 = "INSERT INTO $occurrenceTable SET
        ".$conjunct['type']." = ".$conjunct[$conjunct['type']."_id"].",
        ".$conjunctionTable." = ".$conjunctionID;
      mysqli_query($this->connection, $query2) or show_warning(mysqli_error($this->connection)." # Query = $query2 ");
    }
    return $conjunctionID;
  }

  /**
   * Update an occurrence. -- We concluded an occurrence does not have to be 
   * uptedated. It can either be deleted or created, but updating (thereby 
   * linking it to another element or conjunction) does not make sense.
   * @param string $occurrenceTable Name of the occurrence table.
   * @param int $occurrenceID ID of the occurrence in the table.
   * @param array $conjunct The new, to-be-stored conjunct in this occurrence
   * @created 12 November 2012
   */
  public function updateOccurrenceDEPRECATED($occurrenceTable, $occurrenceID, $conjunct){
    $query = "UPDATE $occurrenceTable SET
      ".$occurrenceTable."_id = $occurrenceID,
      ".$conjunct['type']." = ".$conjunct[$conjunct['type']."_id"];
    mysqli_query($this->connection, $query) or show_warning(mysqli_error($this->connection)." # Query = $query");
  }

  /**
   * Delete an occurrence
   * @param string $occurrenceTable Name of the occurrence table.
   * @param string $conjunctStr Name of the conjunct
   * @param int $conjunctID ID of the conjunct in the table.
   * @created 12 November 2012
   */
  public function deleteOccurrence($occurrenceTable, $conjunctStr, $conjunctID){
    $query = "DELETE FROM $occurrenceTable
      WHERE $conjunctStr = $conjunctID";
    mysqli_query($this->connection, $query) or show_warning(mysqli_error($this->connection)." # Query = $query");
  }

  /**
   * Store a relation with the given type and data. Returns the insertion id, so 
   * the relation can be linked to another entity.  @param string $type The type 
   * of the relation //todo: needs to be refactored to a more general function.
   * @param {associative array} $data The data that need to be stored.
   **/
  public function storeRelation($type, $data){
    // ToDo: Validatation of input still needs to be done properly!
    //log_message(STORAGE_LOG_FILE, "store relation data: ". print_r($data, true));

    $query = "INSERT INTO $type SET ";

    $hasdatetime = false; // MOD: flag to show if there is the datetime field
    foreach($data as $key => $dataItem){
      if($key == "text"){
        foreach(array("_name", "_string") as $extension){
          $checkQuery = "SHOW COLUMNS FROM `".$type."` LIKE '".$type.$extension."'";
          $result = mysqli_query($this->connection, $checkQuery) or trigger_error(mysqli_error($this->connection));
          $nameExists = mysqli_num_rows($result);
          if($nameExists){
            $query .= $type.$extension." = '".mysqli_real_escape_string($this->connection, $dataItem)."', ";
          }
        }
      } else if(!in_array($key, array("datetime", "user", "id", "relation_id", "text", $type."_id", "name", "arity", "conclusion"))){
        if ($key == "datetime")  // MOD: I've found the datetime field
          $hasdatetime = true;
        $query .= "`".$key."` = '".mysqli_real_escape_string($this->connection, $dataItem)."', ";
      }
    }

    // MOD: had the datetime field if not present
    if (!$hasdatetime)
      $query .= "`datetime` = NOW(), ";

    //remove last comma.
    $query = substr($query, 0, strlen($query)-2);
    log_message(STORAGE_LOG_FILE, "store relation query: ". $query);

    mysqli_query($this->connection, $query) or show_warning(mysqli_error($this->connection)." # Query = $query ");
    //echo "$query\n"; //debug
    return mysqli_insert_id($this->connection);
  }


  /**
   * Performs an update in table $table by putting the $arFieldValues in the 
   * rows that meet the conditions $arConditions.
   * @param string $table
   * @param array $arFieldValues Keys are the field names, values are the field 
   * values.
   * @param array $arConditions Keys are the field names, values are the values 
   * they have to be.
   * @retval int The number of fields that have been changed.
   * @since 4 September 2012
   **/
  public function update($table, $arFieldValues, $arConditions) {
    // create a useful array for the SET clause
    $arUpdates = array();
    foreach($arFieldValues as $field => $val) {
      if($val === null){
        $val = "NULL";
      }elseif(!is_numeric($val)) {
        //make sure the values are properly escaped
        $val = "'" . mysqli_escape_string($this->connection, $val) . "'";
      }
      //for security reasons, also escape the field
      $field = "`".mysqli_escape_string($this->connection, $field)."`";

      $arUpdates[] = "$field = $val";
    }

    // create a useful array for the WHERE clause 
    $arWhere = array();
    foreach($arConditions as $field => $val) {
      if($val === null){
        $val = "NULL";
      } elseif(! is_numeric($val)) {
        //make sure the values are properly escaped
        $val = "'" . mysqli_escape_string($this->connection, $val) . "'";
      }
      //for security reasons, also escape the field
      $field = mysqli_escape_string($this->connection, $field);      

      $arWhere[] = "$field = $val";
    }

    $sql_update  = "UPDATE $table SET ";    
    $sql_update .= join(', ', $arUpdates);
    $sql_update .= ' WHERE ' . join(' AND ', $arWhere);

    //echo $sql_update."\n"; //debug
    //lock table, so nothing can come in between
    $res1 = mysqli_query($this->connection, "LOCK TABLES $table WRITE");
    if(!$res1){
      $err = mysqli_error($this->connection);
      show_warning($err);
    }

    //perform select query, so we know whether something actually exists
    $rows = $this->select($table, $arConditions);
    if(count($rows) == 0){ //if there are no rows, stop with an error.
      show_warning("There are no rows with these conditions:".print_r($arConditions, true)." in table ".$table.".\n");
      return false;
    }

    //if something is found, perform update query
    $hRes = mysqli_query($this->connection, $sql_update);
    if(!$hRes) {
      $err = mysqli_error($this->connection) ."\nquery was:\n". $sql_update;
      show_warning($err);
      return false;
    }   

    //unlock table, we are done 
    $res1 = mysqli_query($this->connection, "UNLOCK TABLES");
    if(!$res1){
      $err = mysqli_error($this->connection);
      show_warning($err);
      return false;
    }

    //return true: if no error occurred, the row(s) existed and the udpate was succesful
    return true;
  }

  /**
    Deletes the rows in $table that comply with $arConditions
    @param $table
    @param array $arConditions Keys are the field names, values are the values they should have.
    @retval int The amount of rows deleted.
    @since 4 September 2012
  */
  function delete($table, $arConditions) {
    //create a useful array for generating the WHERE clause
    $arWhere = array();
    foreach($arConditions as $field => $val) {
      if(! is_numeric($val)) {
        //make sure the values are properly escaped
        $val = "'" . mysqli_escape_string($val) . "'";
      }      

      $arWhere[] = "$field = $val";
    }

    $sql = "DELETE FROM $table WHERE " . join(' AND ', $arWhere);

    $hRes = mysqli_query($sql);
    if(!$hRes) {
      $err = mysqli_error($this->connection) . NL . $sql;
      show_warning($err);
    }   

    return mysqli_affected_rows($hRes);    
  }

  /**
    Inserts a row into the table
    @param $table
    @param $arFieldValues
    @returns The ID of the newly inserted row.
    @since 4 September 2012
  */

  public function insert($table, $arFieldValues) {
    $fields = array_keys($arFieldValues);
    foreach($fields as $key=>$field){
      $fields[$key] = "`".$field."`";
    }
    $values = array_values($arFieldValues);

    // Create a useful array of values
    // that will be imploded to be the 
    // VALUES clause of the insert statement.
    // Run the mysqli_escape_string function on those
    // values that are something other than numeric.
    $escVals = array();
    foreach($values as $val) {
      if($val === null){
        $val = "NULL";
      }else if(!is_numeric($val)) {
        //make sure the values are properly escaped
        $val = "'" . mysqli_escape_string($this->connection, $val) . "'";
      }
      $escVals[] = $val;
    }

    //generate the SQL statement 
    $sql = " INSERT INTO $table (";
    $sql .= join(', ', $fields);
    $sql .= ') VALUES(';    
    $sql .= join(', ', $escVals);
    $sql .= ')';

    //echo "QUERY: $sql\n"; //debug
    $hRes = mysqli_query($this->connection, $sql);
    if(!$hRes) {
      $err = mysqli_error($this->connection) . "\n" . $sql;
      show_warning($err);
    }   

    return mysqli_insert_id($this->connection);
  }

  public function __destruct() {
    if($this->connection) {
      mysqli_close($this->connection);
    }
  }  

}
