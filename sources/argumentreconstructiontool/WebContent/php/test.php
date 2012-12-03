<?php

class A{
  protected $data;

  function __construct($data){
    $this->data = $data;
  }

  function giveData(){
    return $this->data;
  }
}

class B extends A{
  function __construct($data){
    parent::__construct($data);
  }

  function doSomething(){
    $this->data = "bla";
  }
}

$var = new B("bliblablo");
//$var->doSomething();
echo $var->giveData();
