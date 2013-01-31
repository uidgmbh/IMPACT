<?php
/* ----------------------------------------------------------------------------
 * Copyright (c) 2012 Leibniz Center for Law, University of Amsterdam, the 
 * Netherlands
 *
 * This program and the accompanying materials are licensed and made available
 * under the terms and conditions of the European Union Public Licence (EUPL 
 * v.1.1).
 *
 * You should have received a copy of the  European Union Public Licence (EUPL 
 * v.1.1) along with this program as the file license.txt; if not, please see
 * http://joinup.ec.europa.eu/software/page/eupl/licence-eupl.
 *
 * This software is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 * ----------------------------------------------------------------------------
 * Project:      IMPACT
 * Created:      2011-2012
 * Last Change:  14.12.2012 (final release date)
 * ----------------------------------------------------------------------------
 * Created by the Leibniz Center for Law, University of Amsterdam, The 
 * Netherlands, 2012
 * Authors: Jochem Douw (http://jochemdouw.nl), Sander Latour, Giovanni Sileno
 * ----------------------------------------------------------------------------
 */

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
