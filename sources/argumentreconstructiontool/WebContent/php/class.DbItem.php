<?php
/**
 * This class contains a number of general functions that are the same for all 
 * items that have something to do with the database.
 **/
class DbItem{

  public $data; ///< This array is the internal data representation. debug: should be protected; there seems to be a Quercus problem with this.
  protected $loaded; ///< Indicates whether the discussion is loaded from the DB or not
  //protected $table_name; //< Name of the database table associated with Discussions (replaced by storage ID)
  protected $IDName; ///< Name of the ID in the storage mechanism. Defaults to "id". Practical for classes that have other names for their ID field.

  /**
   * The constructor takes the data of the object, represented in an array, 
   * as a parameter. The data representation of the data is exactly the same 
   * as the JSON-serialized version passed between the client and the 
   * server, and serves as primary information representation mechanism 
   * within the class.
   * @param array $data
   * @param Database $db Optional. Dependency injection of a database object 
   * (optional; if none is given, a new Database instance will be made).
   **/
  function __construct($data = false, $db = false){
    if($db){
      //echo "get DB from params"; //debug
      $this->db = $db;
    } else {
      //echo "make new DB"; //debug
      $this->db = new Database();
      //print_r($this->db); //debug
    }
    $this->loaded = false;
    $this->IDName = "id";
    if($data){
      $this->setData($data);
//      if(gettype($data) == "object"){ //debug
//        show_error("Type storage!"); //debug
//      } //debug
      if(isset($data['id'])){
        //load the rest of the properties from the DB (WHY? can't we just fill up the gaps during saving and with fillEmptyFIelds??? -JD 20121009)
        $this->load($data['id']);
      }
    }
  }

  /**
    Sets the data in the internal data representation to the given data.
    @param array $data
   */
  protected function setData($data){
    $this->data = $data;
  }

  /**
    * Gets the internal data representation data.
    * @retval array The data
   */
  public function getData(){
    if(isset($this->data)){
      return $this->data;
    } else {
      show_error("Data not present");
    }
  }

  /**
   * Returns true when data is present, false otherwise. (getData returns an 
   * error when no data is present, this function gives the possibility to 
   * check first)
   * @retval boolean
   * @since 8 October 2012
   */
  function dataSet(){
    return isset($this->data);
  }

  /**
   * Gets the ID (out of the $data internal data representation)
   * @retval int Returns the ID, or false when there is none
   * @since 11 September 2012
   **/
  function getID(){
    if(isset($this->data) && isset($this->data['id'])){
      return $this->data['id'];
    } else {
      return false;
    }
  }

  /**
   * Load the data from the database and put them in the internal data 
   * representation of the class, as long as they are not already there. If 
   * there is already data and you want a "fresh" load with only data, make a 
   * new object.
   * @param int $id ID of the element in the storage (e.g. a databae row ID).
   * @since 5 September 2012
   **/
  public function load($id){
    //echo "select from DB (in dbitem->load) with IDName $this->IDName\n"; //debug
//    if(!$this->db){ //debug
//      print_r(debug_backtrace()); //debug
//      var_dump($this->db); //debug
//    } //debug
    $result = $this->db->select($this->getStorageID(), array($this->IDName => $id));
    if(count($result) === 1){
      $this->data[$this->IDName] = $id;
      foreach($result[0] as $key => $value){
        if(!isset($this->data[$key])){ // only add non-existing keys
          $this->data[$key] = $value;
        }
      }
      $this->loaded = true;
    } else {
      show_warning("Loading ID yielded ".count($result)." results in stead of 1.");
    }
  }

  /**
   * Function calls create when the object doesn't exist yet, and calls update 
   * otherwise. Commented out because of ambiguity in return value (on create: 
   * the new ID, on update: success or not)
   * @retval int/boolean When a create was succesful, the new ID is returned 
   * (int). When an update was succesful, true is returned (bool). When a 
   * create or update was no success, an exception is thrown.
   */
  public function save(){
    if(isset($this->data)){
      //existence of this object in the DB is tested based on the presence of the id index.
      if(isset($this->data['id'])){
        return $this->update();
      } else {
        return $this->create();
      }
    } else {
      show_error("Tried to save data that doesn't exist");
    }
  }
}
