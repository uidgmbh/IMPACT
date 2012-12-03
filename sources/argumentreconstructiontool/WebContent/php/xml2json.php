<?php
//converts an xml file to json. Script can be called from the command line from the root of the ART (i.e. the 'art' directory)
//since 22 October 2012
$xml = new XMLReader();
$xml->open('php/relations.xml');
var_export(xml2assoc($xml));
$xml->close();


//Copied from class.relationReader.php (see documentation there. if you want to change this function, CHANGE IT IN RELATIONREADER FIRST!!! Then copy it to here again.
function xml2assoc($xml){
    $tree = null;
    while($xml->read())
      switch ($xml->nodeType) {
        case XMLReader::END_ELEMENT: return $tree;
        case XMLReader::ELEMENT:
          $node = array('tag' => $xml->name, 'value' => $xml->isEmptyElement ? '' : xml2assoc($xml));
          if($xml->hasAttributes)
            while($xml->moveToNextAttribute())
              $node['attributes'][$xml->name] = $xml->value;
          $tree[] = $node;
        break;
        case XMLReader::TEXT:
        case XMLReader::CDATA:
          $tree .= $xml->value;
      }
  return $tree;
}
