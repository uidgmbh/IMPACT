<?php
/**
  This test document is for testing the relation management on the server side
  @constructor
  @since 27 September 2012
*/
class testRelation extends testItem{

  public static function addAndUpdateRelation(){
    //relationData is the result of a var_export statement, that was temporarily placed in the api.php file at the place where the API POST call was received.
    $relation1Data = testRelation::getPRASData();
    $relation1 = new Relation($relation1Data);
    $relation1_id = $relation1->save();
    echo "relation saved with id $relation1_id...\n"; //debug
    $relation2 = new Relation();
    $relation2->load($relation1_id);
    print_r($relation2->getUninterpretedData());
    /*
    $relation4 = new Relation(); //debug
    $relation4->load($relation3_id);
    echo "relation loaded...\n"; //debug
    $relationData4 = $relation4->getData();
    print_r($relationData4); //debug
     */
    //return $relation_id;
  }

  public static function getRelation($id){
    $relation = new Relation();
    $relation->load($id);
    $data = $relation->getData();
    print_r($data);
  }

  /**
   * Simply returns a newly defined relation with the practical reasoning 
   * argument scheme (PRAS). Does presume there is a document with id 4, and a discussion with ID 36.
   */
  public static function getPRASData(){
    $discussionID = 29;
    $documentID = 4;
    return array (
      'relation' => 
      array (
        'elements' => 
        array (
          0 => 
          array (
            'type' => 'action',
            'name' => 'action1',
            'arity' => '1',
            'conclusion' => '1',
            'label' => 'Action',
            'text_sections' => 
            array (
              0 => 
              array (
                'text' => 'This is the action',
                'document_id' => '',
                'start_offset' => '',
                'end_offset' => '',
              ),
            ),
          ),
          1 => 
          array (
            'type' => 'agent',
            'name' => 'agent1',
            'arity' => '1',
            'label' => 'Agent',
            'text_sections' => 
            array (
              0 => 
              array (
                'text' => 'This is the agent',
                'document_id' => '',
                'start_offset' => '',
                'end_offset' => '',
              ),
            ),
          ),
          2 => 
          array (
            'type' => 'circumstances',
            'name' => 'circumstances1',
            'arity' => 'n',
            'conjuncts' => 
            array (
              0 => 
              array (
                'type' => 'proposition',
                'label' => 'Proposition',
                'text_sections' => 
                array (
                  0 => 
                  array (
                    'text' => 'This is cicrumstance 1',
                    'document_id' => '',
                    'start_offset' => '',
                    'end_offset' => '',
                  ),
                ),
              ),
              1 => 
              array (
                'type' => 'proposition',
                'label' => 'Proposition',
                'text_sections' => 
                array (
                  0 => 
                  array (
                    'text' => 'Circumstanza nummero 2',
                    'document_id' => ''.$documentID,
                    'start_offset' => '1133',
                    'end_offset' => '1606',
                  ),
                ),
              ),
            ),
            'conjunctiontable' => 'conjunction',
            'occurrencetable' => 'prop_occurrence',
          ),
          3 => 
          array (
            'type' => 'consequences',
            'name' => 'consequences1',
            'arity' => 'n',
            'conjuncts' => 
            array (
              0 => 
              array (
                'type' => 'proposition',
                'label' => 'Proposition',
                'text_sections' => 
                array (
                  0 => 
                  array (
                    'text' => 'The one and only consequence.',
                    'document_id' => '',
                    'start_offset' => '',
                    'end_offset' => '',
                  ),
                ),
              ),
            ),
            'conjunctiontable' => 'conjunction',
            'occurrencetable' => 'prop_occurrence',
          ),
          4 => 
          array (
            'type' => 'values',
            'name' => 'values1',
            'arity' => 'n',
            'conjuncts' => 
            array (
              0 => 
              array (
                'type' => 'value',
                'label' => 'Value',
                'text_sections' => 
                array (
                  0 => 
                  array (
                    'text' => 'Value 1',
                    'document_id' => '',
                    'start_offset' => '',
                    'end_offset' => '',
                  ),
                ),
              ),
              1 => 
              array (
                'type' => 'value',
                'label' => 'Value',
                'text_sections' => 
                array (
                  0 => 
                  array (
                    'text' => 'Value 2',
                    'document_id' => ''+$documentID,
                    'start_offset' => '2104',
                    'end_offset' => '2450',
                  ),
                ),
              ),
              2 => 
              array (
                'type' => 'value',
                'label' => 'Value',
                'text_sections' => 
                array (
                  0 => 
                  array (
                    'text' => 'and value 3',
                    'document_id' => '',
                    'start_offset' => '',
                    'end_offset' => '',
                  ),
                ),
              ),
            ),
            'conjunctiontable' => 'conjunction',
            'occurrencetable' => 'value_occurrence',
          ),
        ),
        'type' => 'practical_reasoning_as',
        'label' => 'Practical Reasoning Argument Scheme',
        'discussionIDs' => 
        array (
          0 => ''.$discussionID,
        ),
        'text_sections' => 
        array (
          0 => 
          array (
            'text' => '',
            'document_id' => '',
            'start_offset' => '',
            'end_offset' => '',
          ),
        ),
      ),
      'skeletonMade' => true,
    );
  }

}
