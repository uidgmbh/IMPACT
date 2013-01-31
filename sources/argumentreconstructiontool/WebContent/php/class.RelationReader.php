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
 * Authors: Jochem Douw (http://jochemdouw.nl), Sander Latour
 * ----------------------------------------------------------------------------
 */

define("RELATION_READER_LOG_FILE", "relation_reader.log"); 

log_message(RELATION_READER_LOG_FILE, "included class.relationReader.php");

/**
  The relationReader class reads an XML file containing argument schemes and other relations and provides a number of convenience functions to use them.
  @since 7 June 2012
*/
class relationReader{
  
  /**
   * This function reads the xml schema from relations.xml and makes an 
   * associative array out of it that is globally available in this class
   * @since 7 June 2012
   **/
  function __construct(){
    log_message(RELATION_READER_LOG_FILE, "reading the xml schema");
    //$xml = new XMLReader();
    //$xml->open('relations.xml');
    $xml = null;//temporary, until good parse function is found
    $this->assoc = $this->xml2assoc($xml);
    $this->relations = $this->assoc[0]['value'];//only look at the contents inside the root element (with tag name 'relations').
    //$xml->close();
    log_message(RELATION_READER_LOG_FILE, "reading successful");
  }
  
  /**
   * Recursive function that converts an XMLReader-object into an associative 
   * array. This function is taken from a user contribution to php.net on 
   * http://php.net/manual/en/class.xmlreader.php.  @param XMLReader $xml The 
   * to-be-read XMLReader object
   * @since 7 June 2012
   **/
  function xml2assoc($xml){
    $tree = $this->giveAssoc(); //see description at this function. The commented-out code below is functioning properly in normal PHP.
    /*
    $tree = null;
    while($xml->read())
      switch ($xml->nodeType) {
        case XMLReader::END_ELEMENT: return $tree;
        case XMLReader::ELEMENT:
          $node = array('tag' => $xml->name, 'value' => $xml->isEmptyElement ? '' : $this->xml2assoc($xml));
          if($xml->hasAttributes)
            while($xml->moveToNextAttribute())
              $node['attributes'][$xml->name] = $xml->value;
          $tree[] = $node;
        break;
        case XMLReader::TEXT:
        case XMLReader::CDATA:
          $tree .= $xml->value;
      }
      */
    return $tree;
  }
  
  
  /**
   * Gets the relation types that (currently) correspond to the MySQL table 
   * names given by the Liverpool team for the SCT. Outputs an array containing 
   * associative arrays that consist of a 'type' and a 'label' output.
   * @param boolean $interpreted Indicates whether the interpreted or the 
   * database version of the argument has to be returned.
   * @since 20 June 2012
   **/
  function getRelations($interpreted){
    $result = array();
    foreach($this->relations as $relation){
      //The properties of this relation, not only it's elements, have to be added.
      $rel = $relation;
      unset($rel['value']);//we're giving the elements a structure in the code below.
      $elements = $this->getRelationElements(
        $relation['attributes']['type'],
        $interpreted
      );
      $rel = array_merge($rel, array('value' => $elements));
      $result[] = $rel;
    }
    return $result;
  }

  /**
   * Gets an entire relation, including it's elements. cf. 
   * getRelationElements().
   * @param {string} $relationType Type of the relation
   * @param {boolean} $interpreted Indicates whether we want the relation to be 
   * structured according to it's interpreted scheme (set true) or it's 
   * database scheme (set false)
   * @since 26 July 2012
   **/
  public function getRelation($relationType, $interpreted){
    $relations = $this->getRelations($interpreted);
    foreach($relations as $relation){
      if($relation['attributes']['type'] == $relationType){
        return $relation;
      }
    }
  }

  /**
   * Gets information about one relation. Returns false if relationType does 
   * not exist or some other failure occurs, and returns an empty array if 
   * there are no elements (i.e. the relation is atomic).
   * @param string $relationType The type of the relation.
   * @param boolean $interpreted Indicates whether the interpreted or the 
   * database version of the argument has to be returned.
   **/
  function getRelationElements($relationType, $interpreted){
    foreach($this->relations as $relation){ // a loop solely meant to select the right relation (with type being $relationType)
      if($relation['attributes']['type'] == $relationType){
        if(isset($relation['value'][0]) and 
          $relation['value'][0]['tag'] == 'structure'){
          foreach($relation['value'] as $structure){
            if($structure['attributes']['version'] == 'interpreted' && $interpreted){
              //We have to have this version, and we presume that whenever we have a structure, that it will contain elements (otherwise the entire structure wouldn't make sense.
              $result = $structure['value'];
            } elseif($structure['attributes']['version'] == 'database' 
                     && !$interpreted){
              //if the version is not interpreted, we have to have the database version
              $result = $structure['value'];
            }
            if(isset($result)){
              return $result;
            }
          }
        } else if(isset($relation['value'])){ //there is a value field (so there is a relation), but it's empty
          return array();
        }
      }
    }
    //Relation type not found.
    return false;
  }

  /**
   * This function is only made to avoind having to use XMLReader, because it's 
   * not supported by the PHP to Java framework Resin.
   * In Vim, you can update this function by deleting the contents of the 
   * function except for return and the semicolon, then go in between those two 
   * with your cursor and call :r !php php/xml2json.php
   * If you don't use Vim, use the output of the mentioned script as return 
   * value for this function.
   * @returns Associative array containing the contents of relations.xml
   **/
  function giveAssoc(){
    return 

array (
  0 => 
  array (
    'tag' => 'relations',
    'value' => 
    array (
      0 => 
      array (
        'tag' => 'relation',
        'value' => '',
        'attributes' => 
        array (
          'type' => 'domain',
          'label' => 'Domain',
        ),
      ),
      1 => 
      array (
        'tag' => 'relation',
        'value' => '',
        'attributes' => 
        array (
          'type' => 'source',
          'label' => 'Source',
        ),
      ),
      2 => 
      array (
        'tag' => 'relation',
        'value' => '',
        'attributes' => 
        array (
          'type' => 'proposition',
          'label' => 'Proposition',
        ),
      ),
      3 => 
      array (
        'tag' => 'relation',
        'value' => '',
        'attributes' => 
        array (
          'type' => 'premise',
          'label' => 'Premise',
        ),
      ),
      4 => 
      array (
        'tag' => 'relation',
        'value' => '',
        'attributes' => 
        array (
          'type' => 'concl',
          'label' => 'Conclusion',
        ),
      ),
      5 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'domain',
                  'name' => 'domain1',
                  'arity' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'proposition',
                  'name' => 'proposition1',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'domain',
                  'name' => 'domain1',
                  'arity' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'proposition',
                  'name' => 'proposition1',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'domain_proposition',
          'arity' => '1',
        ),
      ),
      6 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'domain',
                  'name' => 'domain1',
                  'arity' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'source',
                  'name' => 'source1',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'domain',
                  'name' => 'domain1',
                  'arity' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'source',
                  'name' => 'source1',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'domain_source',
          'arity' => '1',
        ),
      ),
      7 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'proposition',
                  'name' => 'proposition1',
                  'arity' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'source',
                  'name' => 'source1',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'proposition',
                  'name' => 'proposition1',
                  'arity' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'source',
                  'name' => 'source1',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'source_proposition',
        ),
      ),
      8 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => 
                array (
                  0 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'domain',
                      'name' => 'domain1',
                      'arity' => '1',
                    ),
                  ),
                  1 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'source',
                      'name' => 'source1',
                      'arity' => '1',
                    ),
                  ),
                ),
                'attributes' => 
                array (
                  'type' => 'domain_source',
                  'arity' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => 
                array (
                  0 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'domain',
                      'name' => 'domain1',
                      'arity' => '1',
                    ),
                  ),
                  1 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'proposition',
                      'name' => 'proposition1',
                      'arity' => '1',
                    ),
                  ),
                ),
                'attributes' => 
                array (
                  'type' => 'domain_proposition',
                  'arity' => '1',
                ),
              ),
              2 => 
              array (
                'tag' => 'element',
                'value' => 
                array (
                  0 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'proposition',
                      'name' => 'proposition1',
                      'arity' => '1',
                    ),
                  ),
                  1 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'source',
                      'name' => 'source1',
                      'arity' => '1',
                    ),
                  ),
                ),
                'attributes' => 
                array (
                  'type' => 'source_proposition',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'domain',
                  'name' => 'domain1',
                  'arity' => '1',
                  'label' => 'Domain',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'proposition',
                  'name' => 'proposition1',
                  'arity' => '1',
                  'label' => 'Proposition',
                  'conclusion' => '1',
                ),
              ),
              2 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'source',
                  'name' => 'source1',
                  'arity' => '1',
                  'label' => 'Source',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'credible_source_as',
          'label' => 'Credible Source Argument Scheme',
        ),
      ),
      9 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'agent',
                  'name' => 'agent1',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'agent',
                  'name' => 'agent1',
                  'arity' => '1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'action',
          'label' => 'Action',
        ),
      ),
      10 => 
      array (
        'tag' => 'relation',
        'value' => '',
        'attributes' => 
        array (
          'type' => 'agent',
          'label' => 'Agent',
        ),
      ),
      11 => 
      array (
        'tag' => 'relation',
        'value' => '',
        'attributes' => 
        array (
          'type' => 'proposition',
          'label' => 'Proposition',
        ),
      ),
      12 => 
      array (
        'tag' => 'relation',
        'value' => '',
        'attributes' => 
        array (
          'type' => 'value',
          'label' => 'Value',
        ),
      ),
      13 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => 
                array (
                  0 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'agent',
                      'arity' => '1',
                      'name' => 'agent1',
                    ),
                  ),
                ),
                'attributes' => 
                array (
                  'type' => 'action',
                  'arity' => '1',
                  'name' => 'action1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'circumstances',
                  'arity' => 'n',
                  'conjunctiontable' => 'conjunction',
                  'occurrencetable' => 'prop_occurrence',
                  'conjuncttype' => 'proposition',
                  'name' => 'circumstances1',
                  'label' => 'Circumstances',
                ),
              ),
              2 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'consequences',
                  'arity' => 'n',
                  'conjunctiontable' => 'conjunction',
                  'occurrencetable' => 'prop_occurrence',
                  'conjuncttype' => 'proposition',
                  'name' => 'consequences1',
                  'label' => 'Consequences',
                ),
              ),
              3 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'values',
                  'arity' => 'n',
                  'conjunctiontable' => 'conjunction',
                  'occurrencetable' => 'value_occurrence',
                  'conjuncttype' => 'value',
                  'name' => 'values1',
                  'label' => 'Values',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'action',
                  'arity' => '1',
                  'name' => 'action1',
                  'conclusion' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'agent',
                  'arity' => '1',
                  'name' => 'agent1',
                ),
              ),
              2 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'circumstances',
                  'arity' => 'n',
                  'conjuncttype' => 'proposition',
                  'conjunctiontable' => 'conjunction',
                  'occurrencetable' => 'prop_occurrence',
                  'name' => 'circumstances1',
                  'label' => 'Circumstances',
                ),
              ),
              3 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'consequences',
                  'arity' => 'n',
                  'conjuncttype' => 'proposition',
                  'conjunctiontable' => 'conjunction',
                  'occurrencetable' => 'prop_occurrence',
                  'name' => 'consequences1',
                  'label' => 'Consequences',
                ),
              ),
              4 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'values',
                  'arity' => 'n',
                  'conjuncttype' => 'value',
                  'conjunctiontable' => 'conjunction',
                  'occurrencetable' => 'value_occurrence',
                  'name' => 'values1',
                  'label' => 'Values',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'practical_reasoning_as',
          'label' => 'Practical Reasoning Argument Scheme',
        ),
      ),
      14 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'source',
                  'arity' => '1',
                  'name' => 'source1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'value',
                  'arity' => '1',
                  'name' => 'value1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'source',
                  'arity' => '1',
                  'name' => 'source1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'value',
                  'arity' => '1',
                  'name' => 'value1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'value_recognition_as',
          'label' => 'Value Recognition Argument Scheme',
        ),
      ),
      15 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => 
                array (
                  0 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'domain',
                      'name' => 'domain1',
                      'arity' => '1',
                    ),
                  ),
                  1 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'source',
                      'name' => 'source1',
                      'arity' => '1',
                    ),
                  ),
                ),
                'attributes' => 
                array (
                  'type' => 'domain_source',
                  'arity' => '1',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => 
                array (
                  0 => 
                  array (
                    'tag' => 'element',
                    'value' => '',
                    'attributes' => 
                    array (
                      'type' => 'agent',
                      'arity' => '1',
                      'name' => 'agent1',
                    ),
                  ),
                ),
                'attributes' => 
                array (
                  'type' => 'action',
                  'arity' => '1',
                  'name' => 'action1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'domain',
                  'name' => 'domain1',
                  'arity' => '1',
                  'label' => 'Domain',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'source',
                  'name' => 'source1',
                  'arity' => '1',
                  'label' => 'Source',
                ),
              ),
              2 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'action',
                  'name' => 'action1',
                  'arity' => '1',
                  'label' => 'Source',
                ),
              ),
              3 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'agent',
                  'name' => 'agent1',
                  'arity' => '1',
                  'label' => 'Agent',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'value_credible_source_as',
          'label' => 'Value Credible Source Argument Scheme',
        ),
      ),
      16 => 
      array (
        'tag' => 'relation',
        'value' => 
        array (
          0 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'premises',
                  'arity' => 'n',
                  'conjunctiontable' => 'conjunction',
                  'occurrencetable' => 'premise_occurrence',
                  'conjuncttype' => 'premise',
                  'name' => 'premise1',
                  'label' => 'Premises',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'concl',
                  'arity' => '1',
                  'name' => 'concl1',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'database',
            ),
          ),
          1 => 
          array (
            'tag' => 'structure',
            'value' => 
            array (
              0 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'premises',
                  'arity' => 'n',
                  'conjunctiontable' => 'conjunction',
                  'occurrencetable' => 'premise_occurrence',
                  'conjuncttype' => 'premise',
                  'name' => 'premise1',
                  'label' => 'Premises',
                ),
              ),
              1 => 
              array (
                'tag' => 'element',
                'value' => '',
                'attributes' => 
                array (
                  'type' => 'concl',
                  'arity' => '1',
                  'name' => 'concl1',
                  'label' => 'Conclusion',
                ),
              ),
            ),
            'attributes' => 
            array (
              'version' => 'interpreted',
            ),
          ),
        ),
        'attributes' => 
        array (
          'type' => 'general_as',
          'label' => 'General Argument Scheme',
        ),
      ),
    ),
  ),
)
      ;
  } //end of function giveAssoc();

}

?>
