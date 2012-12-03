/**
 * A relation object contains a local representation of the relation. When the 
 * relation is made (i.e. the constructor is called) with the arguments given, 
 * the relation is retrieved through the AJAX-API. When no arguments are given, 
 * a skeleton structure is made in which things can be saved, first locally, 
 * and through the save() function at the server side through the API.
 * @param {string} type The ID of the type of the relation. In case the 
 * relation is an argument scheme, the type represents the argumentation 
 * scheme.
 * @param {string} id The ID of the relation (is unique when combined with the 
 * type).
 * @constructor
 * @extends DbItem
 **/
function Relation(type, id){
  this.parent = DbItem;
  this.parent();
  this.parent = new DbItem();
  
  /**
   * This function sets the id (only the integer, not the type), for when a 
   * relation has just been saved.
   * @param int id The ID, without the type.
   * @since 13 November 2012
   */
  this.setID = function(id){
    var rel = this.getDataItem("relation");
    rel[this.getType()+'_id'] = id;
  };

  /**
   * @retval boolean The return value indicates whether the relation is stored 
   * (true) or not (false)
   **/
  this.isStored = function(){
    var rel = this.getDataItem("relation");
    if(rel['id']){
      return true;
      // mod: ADDED THIS CHECK 
    } else if(rel['conjuncts'] && rel['conjuncts'].length > 0 && rel['conjuncts'][0]['id']) {
      return true;
    } else {
      return false;
    }
    //return this.getDataItem("stored");
  }

  /**
   * Returns a boolean value: true when a skeleton relation was already stored, 
   * and false otherwise.
   * @since 20 July 2012 
   **/
  this.skeletonMade = function(){
    return this.getDataItem("skeletonMade");
  }

  /**
   * Gets the type of the relation.
   **/
  this.getType = function(){
    var rel = this.getDataItem("relation");
    //if(rel['type']){
      return rel['type'];
    //} else {
      //all conjuncts should contain the (same) type. reftype is the 'referring type', not the type of the table the relation is in.
     // return rel['conjuncts'][0]['reftype'];
    //}
  };
  
  /**
   * Gets the ID of the relation
   * @since 9 July 2012
   **/
  this.getID = function(){
    var rel = this.getDataItem("relation");
    return rel[this.getType()+'_id'];
  };
  
  /**
   * Gets the name (as stored in the XML file) of the relation
   **/
  this.getName = function(){
    var rel = this.getDataItem("relation");
    return rel['name'];
  };
  
  /**
   * Private function to set the data
   * @param {associative array} data
   **/
  this._setData = function(data){
    this.setDataItem('relation', data);
  }
  
  /**
   * Gets the currently associated discussion. todo: support for more than 1 
   * discussion
   * @returns an array
   **/
  this.getDiscussionIDs = function(){
    this.setDataItem('discussionIDs', discussionIDs);
    var rel = this.getDataItem("relation");
    if(rel['discussionIDs']){
      return rel['discussionIDs'][0];
    }
  };

  /**
   * Sets the discussionIDs to which the relation belongs
   * @param array discussions
   **/
  this.setDiscussionIDs = function(discussions){
    var relation = this.getDataItem('relation');
    relation['discussionIDs'] = discussions;
    this.setDataItem('relation', relation);
  };
  
  /**
   * Take the first associated textSection (in the future, this should be 
   * altered: all textSections should be displayed; todo).
   * @returns The text of the first text section
   * @since 12 July 2012
   **/
  this.getFirstTextSection = function(){
    var rel = this.getDataItem("relation");
    if(rel['text_sections'] && rel['text_sections'][0]){
      return rel['text_sections'][0]['text'];
    } else if(rel['conjuncts'] && 
              rel['conjuncts'][0]['text_sections'] && 
              rel['conjuncts'][0]['text_sections'][0]){
      return rel['conjuncts'][0]['text_sections'][0]['text'];
    }
  };

  /**
   * Sets the first associated textSection (in the future, this should be 
   * altered: all textSections should be displayed; todo).
   * @param {string} text Text for the textsection
   * @param {int} documentID Optional.
   * @param {array} offsets Optional. (startoffset at 0, endoffset at 1)
   * @since 13 July 2012
   **/
  this.setFirstTextSection = function(text, documentID, offsets){
    var rel = this.getDataItem("relation");
    if(!rel['conjuncts']){
      //would be better to set these through a textSection-object
      if(!rel['text_sections']) rel['text_sections'] = [];
      if(!rel['text_sections'][0]) rel['text_sections'][0] = {};
      rel['text_sections'][0]['text'] = text;
      //if(documentID && offsets){//nonsensical if-conditional, people might want to delete the offsets as well. (-JD 20120802)
        rel['text_sections'][0]['document_id'] = documentID;
        rel['text_sections'][0]['start_offset'] = offsets[0];
        rel['text_sections'][0]['end_offset'] = offsets[1];
      //}
    } else { //there are conjuncts, so store the text in the first conjunct (todo: make this possible for >1 conjuncts.
    //this is a copy of the code above, with an adaption for the conjuncts (todo: make this more elegant)
      if(!rel['conjuncts'][0]['text_sections']) rel['conjuncts'][0]['text_sections'] = [];
      if(!rel['conjuncts'][0]['text_sections'][0]) rel['conjuncts'][0]['text_sections'][0] = {};
      rel['conjuncts'][0]['text_sections'][0]['text'] = text;
      //if(documentID && offsets){
        rel['conjuncts'][0]['text_sections'][0]['document_id'] = documentID;
        rel['conjuncts'][0]['text_sections'][0]['start_offset'] = offsets[0];
        rel['conjuncts'][0]['text_sections'][0]['end_offset'] = offsets[1];
      //}
    }

    this.setDataItem("relation", rel);
  }
  
  /**
   * Get the offsets of the first text section of this relation. Returns an 
   * array with two empty strings when no offsets are found. (should in the 
   * future return the offsets of all textsections. todo)
   * @ returns an array with at index 0 the starting offset and at index 1 the 
   * end offset.
   * @since 12 July 2012
   **/
  this.getFirstOffsets = function(){
    var rel = this.getDataItem("relation");
    if(rel['text_sections'] && rel['text_sections'][0] && rel['text_sections'][0]['start_offset']){
      //textSections don't have offsets per se, but when they have a start_offset, they should have an end_offset
      return new Array(rel['text_sections'][0]['start_offset'], rel['text_sections'][0]['end_offset']);
    } else if(rel['conjuncts'] 
        && rel['conjuncts'][0]['text_sections'] 
        && rel['conjuncts'][0]['text_sections'][0] 
        && rel['conjuncts'][0]['text_sections'][0]['start_offset']){
      return new Array(rel['conjuncts'][0]['text_sections'][0]['start_offset'], rel['conjuncts'][0]['text_sections'][0]['end_offset']);
    } else {
      //there are no offsets, so return an empty array.
      return new Array("","");
    }
  }
  
  /**
   * Get the document ID of the first text section (todo: should be made ready 
   * for textsectioncombinations
   **/
  this.getFirstDocID = function(){
    var rel = this.getDataItem("relation");
    if(rel['text_sections'] && rel['text_sections'][0]){
      return rel['text_sections']['0']['document_id'];
    } else if(rel['conjuncts']
              && rel['conjuncts'][0]['text_sections']
              && rel['conjuncts'][0]['text_sections'][0]){
      return rel['conjuncts'][0]['text_sections'][0]['document_id'];
    }
  }

  /**
   * Get the quote for the first text section
   * @since 15 October 2012
   **/
  this.getFirstQuote = function(){
    var rel = this.getDataItem("relation");
    if(rel['text_sections'] && rel['text_sections'][0] && rel['text_sections'][0]['quote']){
      return rel['text_sections'][0]['quote'];
    } else if(rel['conjuncts']
              && rel['conjuncts'][0]['text_sections']
              && rel['conjuncts'][0]['text_sections'][0]
              && rel['conjuncts'][0]['text_sections'][0]['quote']){
      return rel['conjuncts'][0]['text_sections'][0]['quote'];
    }
  }

  /**
   * This function sets the arity of this relation (which MUST be the element 
   * of another relation)
   * @since 13 July 2012
   **/
  this.setArity = function(arity){
    this.setDataItem("arity", arity);
  }
  
  /**
   * This function gets the arity of the relation. Returns 1 or 'n'. Warning: 
   * the relation has to be an element of another relation, otherwise having an 
   * arity doesn't make sense.
   * @since 12 July 2012
   **/
  this.getArity = function(){
    return this.getDataItem("arity");
  }
    

  /* timestamp-related functions have to be replaced/updated, adapted to the 
   * version management system.*/
//  this._timestamp = undefined;
  this.getTimestamp = function(){ 
    return this._relation['datetime'];
  };

  //user-related functions have to be replaced/updated
  this.getUser = function(){
    var rel = this.getDataItem("relation");
    return rel['user'];
  };
  
  /**
   * Get all directly underlying elements of this relation as a 
   * (non-associative) array containing Relation objects. Returns an empty 
   * array if this relation does not have any elements. This function is NOT 
   * recursive. Works for both stored and non-stored relations.
   **/
  this.getElements = function(){
    var result = new Array();
    var relationData = this.getDataItem("relation");
    if(relationData['elements']){
      for(elementKey in relationData['elements']){
        var relation = new Relation();
        relation._setData(relationData['elements'][elementKey]);
        result[result.length] = relation;
      }
      return result;
    } else {
      //when there are no elements, return an empty array.
      return [];
    }
  };
  
  /**
   * Get conjuncts of this relation as a (non-associative) array containing 
   * Relation objects. Returns an empty array if this relation does not have 
   * any conjuncts. This function is NOT recursive. Works for both stored and 
   * non-stored relations.
   **/
  this.getConjuncts = function(){
    var result = new Array();
    var relationData = this.getDataItem("relation");
    if(relationData['conjuncts']){
      for(conjunctKey in relationData['conjuncts']){
        var relation = new Relation();
        relation._setData(relationData['conjuncts'][conjunctKey]);
        result[result.length] = relation;
      }
      return result;
    } else {
      //when there are no elements, return an empty array.
      return [];
    }
  };

  /**
   * This function is meant for the situation in which a new relation is made, 
   * that is not stored yet, and we basically only have the type. This function 
   * recursively iterates over the relation definition as it is stored in the 
   * relations.xml file, and makes the appropriate structure in the data item 
   * "relation", with attributes type, elements and text_sections in place.
   * @param {string} type The type of this relation (has to be passed as an 
   * argument, as it is not stored yet.
   * @param {associative array} structure Contans the structure in which the 
   * element can be found. Only used at the recursive call.
   * @since 20 July 2012
   **/
  this._makeSkeleton = function(type, structure){
    console.log("start makeSkeleton for type"+type);//debug
    var result;
    var success_callback = function(data, xhr){
      result = data;
    }
    var error_callback = function(status, xhr){
      console.log("Error retrieving relations ["+status+"]");
    };
    DbItem.getRemoteInstances("/relations/"+type, success_callback, error_callback);
    console.log("return makeSkeleton for type"+type);//debug
    return result;
  };


  /**
   * Get the element that is at the specified breadcrumb location. Returns 
   * false when the element is not found, returns a Relation object when it is 
   * found.
   * @param {array} breadcrumb An array containing the "route" to the right 
   * element, starting with this relation, followed by the types of the 
   * descendant children. See deliverable D3.2 for the exact definition of a 
   * breadcrumb.
   * @since 13 July 2012
   **/
  this.getElement = function(breadcrumbArr){
    var rel = this.getDataItem("relation");
    //we're going into a for-loop that, in each loop, goes one element (crumb) further in the breadcrumb-route. We're maintaining the original breadcrumb, so we need a helper variable that is a clone of the original:
    var breadcrumbArrRest = breadcrumbArr.slice(0);
    //we also make a clone of the relation, so we can overwrite it with one of it's own elements at the end of the loop.
    var currentRel =  $.extend(true, {}, rel);
    for(var i = 0; i < breadcrumbArr.length; i++){
      //Stop condition: if the breadcrumbArrRest has one crumb left, we are at the end of it, so we can return the current relation, that represents the desired element of the relation.
      if(breadcrumbArrRest.length == 1 || breadcrumbArrRest.length == 0){  // || (breadcrumbArrRest.length == 2 && (breadcrumbArrRest[1].slice(0, 2) == "n_" || /^\d*$/.test(breadcrumbArrRest))))
        //if the length is 0, we're at the end. If the crumb at index 0 is this type
        if(breadcrumbArrRest[0] == currentRel['type'] || breadcrumbArrRest.length == 0){//^.getType()){
          //^on index 1, the ID is given, or the word "undefined" for relations that have not been created yet.
          //^if(breadcrumbArrRest[1] == "undefined" || breadcrumbArrRest[1] == this.getID()){
          var result = new Relation();
          //if(breadcrumbArrRest.length == 1){
          result._setData(currentRel);
          /*} else {
            //look for the conjunct with the right ID (arity == n)
            for(var conjunctnr = 0; conjunctnr < currentRel['conjuncts'].length; conjunctnr++){
              var conjunct = currentRel['conjuncts'][conjunctnr];
              if(conjunct['id'] == breadcrumbArrRest[1]){
                result._setData(currentConjunct);
              }
            }
          }*/
          return result;
        } else {
          console.log("Something wrong in the breadcrumb. breadcrumb was: "+breadcrumbArr);
          return false;
        }
      }
      //there are one or more crumbs left, so make an iteration.
      var counter = 0; //helper variable
      //search for the element that has the desired type (namely the type at the beginning of the rest of the breadcrumbArr). Counter finally gets the index position of that element.
      var type; var arity;
      if(currentRel['arity']) {
        arity = currentRel['arity'];
      } else {
        arity = 1;
      }
      if(arity == 1){
        while(currentRel['elements'][counter] && type != breadcrumbArrRest[1]){
          type = currentRel['elements'][counter]['type'];
          if(type != breadcrumbArrRest[1]){ //breadcrumbArrRest[1] contains the next element, to be examined in the next loop iteration
            counter++;
          }
          if(counter > 100){ //debug
            return false; //debug
          } //debug
        }
        if(counter == currentRel['elements'].length){
          //we're past the last element, so the search failed.
          console.log("element " + breadcrumbArrRest[1] + " not found!, the entire breadcrumbArr was: "+breadcrumbArr);
          return false;
        }
        //prepare for the next loop
        currentRel = currentRel['elements'][counter];
        breadcrumbArrRest = breadcrumbArrRest.splice(1);
      } else if(arity == 'n'){
        var conjunctID;
        while(currentRel['conjuncts'][counter] && conjunctID != breadcrumbArrRest[1] && counter <= currentRel['conjuncts'].length){
          conjunctID = currentRel['conjuncts'][counter]['id'];
          if(conjunctID != breadcrumbArrRest[1]){ //breadcrumbArrRest[1] contains the next element, to be examined in the next loop iteration
            counter++;
          }
          if(counter > 100){ //debug
            return false; //debug
          } //debug
        }
        if(counter == currentRel['conjuncts'].length){
          //we're past the last element, so the search failed.
          console.log("conjunct not found!, the entire breadcrumbArr was: "+breadcrumbArr);
          return false;
        }
        //prepare for the next loop
        currentRel = currentRel['conjuncts'][counter];
        breadcrumbArrRest = breadcrumbArrRest.splice(2);
      }
    }
    return false;
  };

  /**
   * The deleteConjuncts function looks for the element located at the 
   * specified breadcrumb, and deletes all conjuncts present. This can be used 
   * as a preparation for putting in the updated conjuncts that the user 
   * specified. Based on the structure of the function setElement().
   * @param array breadcrumbArr
   * @since 6 November 2012
   */
  this.deleteConjuncts = function(breadcrumbArr){
    var rel = this.getDataItem("relation");
    //el is a helper variable that will eventually point to the right location in the rel array, so it can be changed and stored. Note that whenever el is changed, rel is changed as well.
    var el = rel;
    for(key in breadcrumbArr){ //key will be a string, so whenever used, it's converted back to integer with +key
      if(+key == breadcrumbArr.length-1){ //we're at the last key.
        //so clean up the conjuncts one by one (but don't delete the "conjuncts" index altogether)
        el["conjuncts"] = new Array();
        //...and store back the relation.
        this.setDataItem("relation", rel);
      } else { //we're not at the last key
        var index = 0;
        //search for the element with the right type in the elements of the current el(element). There should be elements in here, otherwise the breadcrumbArr would be wrong... We're presuming the breadcrumbArr is right.
        while(el['elements'][index]['type'] != breadcrumbArr[+key+1] && index < el['elements'].length){ //we want to look at the type of the "next" element in the breadcrumbArr, that's the reason for the +1. We not only want to stop when the right type is found, but also if there are no more elements
          index++;
        }
        if(index >= el['elements'].length){ //this means that the type is not found in the elements
          console.log("ERROR in Relation.setElement");
          return false;
        }
        //The type was found at index, so make el to be the new pointer (and do another loop)
        el = el['elements'][index];
      }
    }
  };

  /**
   * Sets the given element at the given breadcrumb location. Does NOT do so 
   * for the elements of the element, these are left intact (if there are any).
   * @param {Relation} element The relation that has to be stored at the given 
   * breadcrumb location. Has to have the type of the last element of the 
   * breadcrumb, otherwise the function will return false
   * @param {non-associative array} breadcrumb Breadcrumb, exactly like the one 
   * for getElement.
   * @since 16 July 2012
   **/
  this.setElement = function(element, breadcrumbArr){
    var elementInternals = element._getInternals();
    //elements of the elements not wanted here.
    delete elementInternals['elements'];
    var rel = this.getDataItem("relation");
    //el is a helper variable that will eventually point to the right location in the rel array, so it can be changed and stored. Note that whenever el is changed, rel is changed as well.
    var el = rel;
    if(/^(n_){0,1}\d*$/.test(breadcrumbArr[breadcrumbArr.length-1])){
      //there is a conjunct, so put apart the conjunct in order to let the parsing continue normally
      var conjunctID = breadcrumbArr[breadcrumbArr.length-1];
      breadcrumbArr = breadcrumbArr.slice(0, breadcrumbArr.length-1);
    }
    for(key in breadcrumbArr){ //key will be a string, so whenever used, it's converted back with +key
      if(+key == breadcrumbArr.length-1){ //we're at the last key.
        //so put in all elements that were not present there yet, if this is not a conjunct
        if(!conjunctID){
          for(var internalKey in elementInternals){
            el[internalKey] = elementInternals[internalKey];
          }
        } else {
          //the elementInternals are the conjunct, so add it to the existing conjuncts (if any)
          var numberOfConjuncts = el["conjuncts"].length;
          el["conjuncts"].push(elementInternals);
        }
        this.setDataItem("relation", rel);
      } else { //we're not at the last key
        var index = 0;
        //search for the element with the right type in the elements of the current el(element). There should be elements in here, otherwise the breadcrumbArr would be wrong... We're presuming the breadcrumbArr is right.
        while(el['elements'][index]['type'] != breadcrumbArr[+key+1] && index < el['elements'].length){ //we want to look at the type of the "next" element in the breadcrumbArr, that's the reason for the +1. We not only want to stop when the right type is found, but also if there are no more elements
          index++;
        }
        if(index >= el['elements'].length){ //this means that the type is not found in the elements
          console.log("ERROR in Relation.setElement");
          return false;
        }
        //The type was found at index, so make el to be the new pointer (and do another loop)
        el = el['elements'][index];
      }
    }
  }

   /**
    * Private function returning the internal data representation of this 
    * object.
    * @since 16 July 2012
    **/
   this._getInternals = function(){
     return this.getDataItem('relation');
   }

  /**
   * This function renders a form by making an RelationRender object and 
   * calling the renderForm-function with the submit_callback as argument. This 
   * callback is defined in this function.
   * @param referrer
   **/
  this.renderForm = function(){
    var render = new RelationRender(this);
    var submit_callback = function(form){
      var alreadySaved = false;
      form = $(form); //wrap form in an JQuery object so we can search in it easily
      var alreadySaved = false; //presume false until proven otherwise

      //START look for the element at the TOP LEVEL
      //we're going to initiate a relation object (baseRelation), so that later on the elements can be put into it. We do this by looking for the topmost fieldset, get the type from there and the ID, if available.
      var value; var type; var id; var name;
      form
        .find('*') //all descendants
        .filter(function(){ //filter out the id-value
          name = $(this).attr("name");
          //the name must be defined, and this must be an input element
          if(typeof(name) != "undefined" //is there a name...
            && $(this).is("input")       //in an <input> tag...
            && name.split("-").length == 2){        //at the top level...
            //...ending with "-id"?
            return name.slice(name.length-3, name.length) == "-id";
          } else {
            return false;
          }
        }).each(function(){ //should only be one, or zero when not present.
          //get type and ID, when this is an input tag.
          alreadySaved = true;
          value = $(this).attr("value");
          var typeAndID = value.split("-");
          type = typeAndID[0];
          id = typeAndID[1];
          name = $(this).attr("name");
        });
      if(alreadySaved){
        var baseRelation = new Relation(type, id);
      } else { //relation not saved yet
        var baseRelation = new Relation(type);
      }
      baseRelation.setDiscussionIDs(new Array(Store.getData("discussionID")));
      //name contains the breadcrumb, only the last element ("-id") should be removed (conversion into an array, slice, and a join to make it a string again.
      var nameArr = name.split("-");
      var breadcrumbArr = nameArr.slice(0, nameArr.length-1);
      var breadcrumbStr = breadcrumbArr.join("-");
      var currentElement = Relation.convertFieldsetToRelation(form, breadcrumbStr);
      baseRelation.setElement(currentElement, breadcrumbArr);
      //END look for the element at the TOP LEVEL

      //We chose not to make this iteration recursive yet because of time limitations, and because there are currently no argument schemes of which the interpreted version requires this (the database version is fully handled by the PHP)
      var breadcrumbTopArr = breadcrumbArr; //in preparation for the underlying elements one can use this top level breadcrumb for augmentation.
      delete breadcrumbArr; //this var will be redefined shortly.
      var elementsArr = baseRelation.getElements();
      var element; var conjunct; //to be filled with the different elements/conjuncts before they are put into baseRelation
      for(var elementNr = 0; elementNr < elementsArr.length; elementNr ++){
        if(elementsArr[elementNr].getConjuncts().length > 0){
          //apparently arity == n
          //create a copy of the top breadcrumb and put in the type, so it can be used to delete the conjuncts, before putting in the new ones.
          breadcrumbArr = breadcrumbTopArr.slice(0);
          breadcrumbArr[breadcrumbArr.length] = 
            elementsArr[elementNr].getType();
          baseRelation.deleteConjuncts(breadcrumbArr);
          //for each conjunct found in the form...
          $("fieldset").filter(function(){
            //the ID must be right
            return $(this).attr("id") == breadcrumbArr.join("-")
            //for all fieldset children (i.e. for each each conjunct)
          }).children().each(function(){
            //And the child itself should also be a fieldset.
            if($(this).is("fieldset")){
              var breadcrumbStr = $(this).attr("id");
              conjunct = Relation.convertFieldsetToRelation(form, breadcrumbStr);
              //Set the conjunct at the right breadcrumb position
              baseRelation.setElement(conjunct, breadcrumbStr.split("-"));
            }
          });
        } else {
          breadcrumbArr = breadcrumbTopArr.slice(0);
          breadcrumbArr[breadcrumbArr.length] = elementsArr[elementNr].getType();
          breadcrumbStr = breadcrumbArr.join("-");
          element = Relation.convertFieldsetToRelation(form, breadcrumbStr);
          baseRelation.setElement(element, breadcrumbArr);
        }
      }
      
      //SAVE the relation
      baseRelation.save();
      Pages.setMessage("The relation has been saved");
      Pages.showRelation(baseRelation.getType(), baseRelation.getID());
      if(Store.getData('documentID') != undefined){
        Pages.refreshDocument();
      }
      return false;
    };
    return render.renderForm(submit_callback);
  };

  /**
   * Saves the relation. The function itself looks whether an update or 
   * deletion has to take place.
   **/
  this.save = function(){
    var ref = this;
    var success_callback = function(data){
      var fullIDArr = data['relation_id'].split("-");
      ref.setID(fullIDArr[1]);
    }
    if(this.isStored()){
      this.parent.alter("/relations/", undefined, undefined, undefined, this);
    } else { //relation not stored
      this.parent.create("/relations/", undefined, success_callback, undefined, this);
    }
    return ref.getID();
  }

  /**
   * Static function for display purposes (data should be incorporated into XML 
   * doc)
   * @param string relationType Type of the relation
   * @since 7 August 2012
   **/
  this.getDisplayType = function(relationType){
    var rel = this.getDataItem("relation");
    if(!rel['label']){ //if there is no label available, output the type.
      return rel['type'];
    }
    return rel['label'];
  };

  //Actual initialisation (constructor) of the relation based on the constructor arguments type and id.
  if(id !== undefined && id.split("-")[id.split("-").length-1].slice(0,2) != "n_"){ //type is presumed to be defined as well if id is defined. If last crumb of the id starts with n_, the relation is not saved yet.
      this.setDataItem("skeletonMade", false); //not applicable when relation is already saved.
      console.log("start constructing the relation with type "+type+" and id "+id);//debug
      var xhr = DbItem.sendDirectRemoteRequest(
          "/relations/"+type+"/"+id,
          "GET",
          undefined
          );
      if(xhr.status == 200){
        //if the retrieval is succesful, the relation is stored in a private variable. This variable remains the base for all operations on the data.
        var relationData = $.parseJSON(xhr.responseText);
        this.setDataItem("relation", relationData['relation']);
        //Important for later reference whether the relation is already stored.
        //this.setDataItem("stored", true);
      } else {
        console.log("ERROR! The XHR retrieval of the relation failed.");
      }
  } else if(type !== undefined) { //A new relation has to be made. Set up a relation array that represents the 'skeleton' relation, based on the relations.xml file (in the form of the Scheme variable).
    //this.setDataItem("stored", false);
    var skeleton = this._makeSkeleton(type);
    this.setDataItem("relation", skeleton['relation']);
    this.setDataItem("skeletonMade", true);
  } else { //no type is specified
  //it's no problem if the data is set immediately after this. todo: make more elegant solution for this.
   // console.log("ERROR! No type specified for the relation");
  }
  //end of initialisation of this object based on constructor arguments type and id.
} //end of the Relation object definition

/**
 * Static function.
 * @param {int} discussionID - ID of the discussion of which the relations are 
 * being retrieved.
 **/
Relation.getRelations = function(discussionID){
  var result = new Array();
  var discussion = new Discussion(discussionID);
  /** Callback-methode als BbItem.getRemoteInstances slaagt */
  var success_callback = function(data, xhr){
    for(var r_index in data.relations){
      result[+(r_index)] = new Relation(
        data.relations[r_index].type,
        data.relations[r_index].id
      );
      (result[+(r_index)]).setDiscussionIDs(
        new Array(discussionID)
      );
    }
  };
  var error_callback = function(status, xhr){
    console.log("Error retrieving relations [no. "+status+"]");
  };
  DbItem.getRemoteInstances("/discussions/"+discussionID+"/relations",success_callback, error_callback);
  return result;
};

/**
 * Static function that retrieves all relations that belong to a given type.
 * @param {string} type - type of the relations
 * @since 19 November 2012
 **/
Relation.getRelationsByType = function(type){
  var result = new Array();
  /** Callback-methode als BbItem.getRemoteInstances slaagt */
  var success_callback = function(data, xhr){
    for(var r_index in data.relations){
      result[+(r_index)] = new Relation(
        data.relations[r_index].type,
        data.relations[r_index].id
      );
//^      (result[+(r_index)]).setDiscussionIDs(
//^        new Array(discussionID)
//^      );
    }
  };
  var error_callback = function(status, xhr){
    console.log("Error retrieving relations [no. "+status+"]");
  };
  DbItem.getRemoteInstances("/relations/"+type+"/all",success_callback, error_callback);
  return result;
};


/**
 * Static function. Converts the relation that is in the form at the location 
 * of the breadcrumb into a real relation and returns this.
 * @param JQueryobject form A JQuery object containing the form.
 * @param string breadcrumbStr The breadcrumb specifiying which element to 
 * take.
 * @since 5 November 2012
 **/
Relation.convertFieldsetToRelation = function(form, breadcrumbStr){
  var text = form.find("*").filter(function(){
    return $(this).attr("name") == breadcrumbStr+"-text";
  }).val();
  var startOffset = form.find("*").filter(function(){
    return $(this).attr("name") == breadcrumbStr+"-startoffset";
  }).val();
  var endOffset = form.find("*").filter(function(){
    return $(this).attr("name") == breadcrumbStr+"-endoffset";
  }).val();
  var documentID = form.find("*").filter(function(){
    return $(this).attr("name") == breadcrumbStr+"-document";
  }).val();
  var typeAndIDString = form.find("*").filter(function(){
    return $(this).attr("name") == breadcrumbStr+"-id";
  }).val();
  if(typeof(typeAndIDString) != "undefined"){
    var typeAndID = typeAndIDString.split("-");
    var type = typeAndID[0];
    if(typeof(typeAndID[1]) != "undefined"){
      var id = typeAndID[1];
      var result = new Relation(type, id);
    } else {
      var result = new Relation(type);
    }
    result.setFirstTextSection(text, documentID, [startOffset, endOffset]);
    return result;
  } else {
    console.log("Something went wrong: no type nor id");
    return false;
  }
};

