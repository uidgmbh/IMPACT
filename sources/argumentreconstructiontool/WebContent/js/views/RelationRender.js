/**
 * This class contains specific rendering information for the Relation objects 
 * (relpaces ArgumentRender)
 * @constructor
 * @extends Render
 * @param relation - relation (Relation) that needs to be rendered.
 **/
RelationRender.extends(Render);
function RelationRender(relation){
  var type = relation.getType();
  var Scheme = Store.getData("Scheme");
  /** Data is an associative array. Keys of this array are the names (i.e. contents of the name attributes) of the form items. Values are arrays containing additional information, like the type of input field and the label that has to be displayed with it. */
  var Data = {};
  Data['elements'] = {};
  Scheme
    .find('relation')
    .filter(function(){
      return $(this).attr('type') == type;
    })
    .find('structure')
    .filter(function(index){
      return $(this).attr("version") == 'interpreted';
    })
    .children("element")
    .each(function(){
      //If there are no children of the element, enable direct input. If there are children, some recursion has to appear (not yet implemented; debug)
      console.log("element found!"+$(this).attr("arity")); //debug
      Data['elements'][$(this).attr("type")] = {
        "type": "annotation", 
        "label": $(this).attr("label"),
        "arity": $(this).attr("arity")
      };
    });//"copyfield" is true when a button needs to be placed next to the textarea that copies contents into the textarea (and ideally also adds metadata in a hidden input field)
  this.setObject(relation);
  this.setData(Data);
}

RelationRender.prototype.renderDetails = function(referer){
  var ref = (typeof(referer)=="undefined"?this:referer);
  return this.parent.renderDetails(ref);
}

/**
 * @param {function} submit_callback - function that is being called after the 
 * user submits the form.
 **/
RelationRender.prototype.renderForm = function(submit_callback){
  //display the relation itself, and iterate over it's elements.
  var relation = this.getObject();
  var form = Draw.form.form(function(){
    console.log("RelationRender Form callback");
    submit_callback(this);
    return false;
  });
  //Render the relations and its elements
  var breadcrumb = new Array(relation.getType());
  form.append(this._renderRelation(relation, breadcrumb));
  form.append(Draw.form.submit());
  return form;
}

/**
 * Private recursive function. Renders the relation form recursively. The 
 * function consists of a non-recursive part for the current relation, and ends 
 * with a recursive part for the elements of that relation.
 * @param {Relation} relation (does not change in the recursion step, the right 
 * elements are being found using the breadcrumb)
 * @param {array} breadcrumbArr Name of the element in the form (consisting of 
 * the "breadcrumb route" in the array that contains the relation)
 * @since 9 July 2012
 **/
RelationRender.prototype._renderRelation = function(relation, breadcrumbArr){
  //START Non-recursive part: part covering this relation 
  var thisRelation = relation.getElement(breadcrumbArr);
  //convert the form name array into the to-be-inserted string
  var breadcrumbString = breadcrumbArr.join("-");
  var formContents = $();//start empty
  var conjuncts = thisRelation.getConjuncts();
  //if the relation is stored fill the appropriate fields
  if(thisRelation.isStored()){
    //As text, take the first associated textSection (in the future, this should be altered: all textSections should be displayed; debug).
    var id = thisRelation.getID();
    var text = thisRelation.getFirstTextSection();
    var offsets = thisRelation.getFirstOffsets();
    var documentID = thisRelation.getFirstDocID();
    //var formContents = Draw.form.hidden('id', thisRelation.getType()+"-"+thisRelation.getID());
    var quote = thisRelation.getFirstQuote();
  } else { //no associated textsections, fill in empty default values
    var id = "n_0"; //with the + button, it starts with number 1 (if arity == n)
    var text = "";
    var offsets = new Array("","");
    var documentID = "";
    var quote = "";
  }
  var type = thisRelation.getType();
  var arity = thisRelation.getArity();

  //for putting a relation in the from, n_0 needs to be added.
  if(breadcrumbArr[breadcrumbArr.length-1] === undefined){
    breadcrumbArr[breadcrumbArr.length-1] = "n_0";
    breadcrumbString = breadcrumbArr.join("-");
  }

  //render the current relation with every input field in one fieldset
  var formContents = formContents.after($(Draw.form.fieldset(breadcrumbString)));
  if(conjuncts.length == 0){
    var label = thisRelation.getDisplayType();
    var minusButton = false;
    if(/^(n_){0,1}\d*$/.test(breadcrumbArr[breadcrumbArr.length-1])){
      //if the last crumb of the breadcrumb is a digit, this is a conjunct, so we have a minusbutton
      minusButton = true;
      //also, if it's a conjunct, the conjuncttype should be set with the breadcrumb without the number, because it's not specific to any specific conjunct, only to the entire conjunction
      var conjunctTypeBreadcrumbArr = breadcrumbArr.slice(0, breadcrumbArr.length-1);
      Store.setData(conjunctTypeBreadcrumbArr.join("-")+"-conjuncttype", type);
      Store.setData(conjunctTypeBreadcrumbArr.join("-")+"-conjunctlabel", label);
    }
    var formItem = this._renderFormAnnotation(
        breadcrumbString,
        {'label':label, 'copyfield':true, 'arity':arity},
        text,
        this, //deprecated referer
        documentID,
        offsets,
        quote,
        type+"-"+id,
        minusButton);

    if(breadcrumbArr.length == 1){ //don't display input for toplevel of relations
      formItem.hide();
    }
    formContents.append(formItem);
  } else {
    //There are conjuncts. No input field is displayed, but we do need to display the type of the relation.
    formContents.append(Draw.title(thisRelation.getDisplayType()));
    //START plus button code
    var plusButtonCallback = function(plusbutton){
      $(plusbutton).parent()
        .each(function(){  //should only be one fieldset
          var nr = Store.getData($(this).attr("id")+"-nr");
          if(!nr){
            nr = 1;
          } else {
            nr++;
          }
          Store.setData($(this).attr("id")+"-nr", nr);
          var breadcrumb = $(this).attr("id")+"-n_"+nr;
          var relationID = Store.getData($(this).attr("id")+"-conjuncttype")+"-n_"+nr;
          var label = Store.getData($(this).attr("id")+"-conjunctlabel");
          var formItem = RelationRender.prototype._renderFormAnnotation(
            breadcrumb,
            {'label':label, 'copyfield':true, 'arity':arity},
            "",
            null, 
            null,
            new Array(null, null),
            "",
            relationID,
            true);
          var newFieldSet = $("<fieldset>")
            .attr("id", breadcrumb)
            .attr("class", "art-form label-item")
            .append(formItem);
          $(this).append(newFieldSet);
        });
    };
    formContents.append(Draw.button("+",//plusButtonCallback
          function(){
            plusButtonCallback(this);
          }));
    //END plus button code
  }
  //END Non-recursive part
  
  //START Recursive part: Render all elements or all conjuncts (if there are any) with a recursive call.
  var elements = thisRelation.getElements();
  var conjuncts = thisRelation.getConjuncts();
  var breadcrumbRecursionStep; //helper variable
  if(elements.length > 0 && conjuncts.length > 0){
    console.log("Something went wrong: we have both elements and conjuncts on the same level.");
  } else if(elements.length > 0){
    //foreach element:
    for(var elementNr = 0; elementNr < elements.length; elementNr++){
      //Fill the breadcrumb-helper variable with a clone of the original breadcrumb and the name of the current element
      breadcrumbRecursionStep = breadcrumbArr.slice(0);
      breadcrumbRecursionStep[breadcrumbRecursionStep.length] =
          elements[elementNr].getType();
      //put the contents inside the fieldset.
      formContents = formContents.append(this._renderRelation(relation, breadcrumbRecursionStep)); // first element was: elements[elementNr]
    }
  } else if(conjuncts.length > 0){
    //foreach conjunct:
    for(var conjunctNr = 0; conjunctNr < conjuncts.length; conjunctNr++){
      breadcrumbRecursionStep = breadcrumbArr.slice(0);
      breadcrumbRecursionStep[breadcrumbRecursionStep.length] = 
          conjuncts[conjunctNr].getID();
      //put the conjuncts inside the fieldset.
      formContents = formContents.append(this._renderRelation(relation, breadcrumbRecursionStep));
    }
    //END Recursive part
  } else {
    console.log("Elements nor conjuncts found.");
  }
  return formContents;
}

/**
 * Renders a form item, with tags such as input, select or textarea. Overloads 
 * Render's renderFormItem function because of specific argument datastructure.
 * @param {string} name - The contents that have to be in the name-attribute of 
 * the item.
 * @param {associative array} form_item - Information from the list of form 
 * items about what data should be displayed in the form. Possible keys: label, 
 * arity, type, rows (the last two only for type textarea), options (for type 
 * select).
 * @param {string} value - Value that has to be filled in for this item.
 * @param {Object} referer
 * @param {int} documentID - Optional. Contains the ID of the document this 
 * entitiy is associated with.
 * @param {int array} offsets - Character at which the textSection starts in the 
 * document at index 0 and ending position at index 1.
 * @param {string} quote - The literal quote of the text.
 **/
RelationRender.prototype._renderFormItem = function(name, form_item, value, referer, documentID, offsets, quote){
  var ref = (typeof(referer)=="undefined" ? this : referer);
  if(form_item.type == "input"){
    return ref.renderFormInput(name, form_item.label, value, ref);
  //"annotation" is a special type that consists of a textarea, containing the actual annotation, and a hidden field that may contain a link to the document the text snippet was taken from, as well as the associated offsets.
  //} else if(form_item.type == "annotation") {
    //return ref._renderFormAnnotation(name, form_item, value, referer, documentID, offsets, quote);
  } else if(form_item.type == "hidden"){
    return ref.renderFormHidden(render_element, name, value, ref);
  }
}

/**
 * Private function. Generates a button that, as callback function, adds a new 
 * annotation fieldset to the fieldset higher in the hierarchy
 * @param array breadcrumbArr the breadcrumb to the conjunction (not the 
 * conjunct, the conjunct-breadcrub will be generated inside this function)
 * @since 6 November 2012
 * Deprecated since 13 Nov 2012
 **/
RelationRender.prototype._renderPlusButtonDEPRECATED = function(breadcrumbArr){
  var callback = function(){
    //after(this._renderFormAnnotation(breadcrumbString, {'label':label, 'copyfield':true, 'arity':1}, text, this, documentID, offsets, quote, thisRelation.getType()+"-"+thisRelation.getID(), minusButton));
  };
}

/**
 * Renders an annotation: a textarea with a number of buttons that are designed 
 * for doing annotations (like 'paste', 'unlink', 'highlight' and '-' buttons 
 * for elements with an arity of 'n' ('+'-buttons are placed at the end).
 * @param {string} name - The contents that have to be in the name-attribute of 
 * the item.
 * @param {associative array} form_item - Information from the list of form 
 * items about what data should be displayed or at least incorporated in(to) 
 * the form. Possible keys: label, arity, type, rows (the last two only for 
 * type textarea), options (for type select).
 * @param {string} value - Value that has to be filled in for this item.
 * @param {Object} referer OBSOLETE, not used anymore
 * @param {int} documentID - Optional. Contains the ID of the document this 
 * entitiy is associated with.
 * @param {int array} offsets - Character at which the textSection starts in 
 * the document at index 0 and ending position at index 1.
 * @param {string} quote - The literal quote of the text.
 * @param {string} relationID - Optional. ID of the relation, with syntax 
 * "type-ID" where ID is the integer indicating the storage ID.
 **/

RelationRender.prototype._renderFormAnnotation = function(
    name,
    form_item,
    value,
    referer,
    documentID,
    offsets,
    quote,
    relationID,
    minusButton){
  //^var ref = (typeof(referer)=="undefined" ? this : referer);
  var result = Render.prototype.renderFormHidden(name+"-id", relationID);
  relationIDArr =  relationID.split("-");
  var conjuncttype = relationIDArr[0];
  //var result = result.after(ref.renderFormLargelock(name+"-id", name+"-id", relationID, ref)); //debug; alleen hidden overhouden
  var result = result.after(Render.prototype.renderFormTextarea(name+"-text", form_item.label, value, form_item.size));
  result = result.after($("<br/>").attr('style', 'clear:both'));
  result = result.after(Render.prototype.renderFormHidden(name+"-document", documentID));
  result = result.after(Render.prototype.renderFormHidden(name+"-startoffset", offsets[0]));
  result = result.after(Render.prototype.renderFormHidden(name+"-endoffset", offsets[1]));
  result = result.after(Render.prototype.renderFormLargelock(name+"-quote", "Quote: ", quote));
  result = result.after($("<br>"));
  if(form_item.copyfield){ //a button is added to copy text into the textarea
    //START paste button code
    var onclickPaste = function(){
      var selectedText = Selector.getSelected().toString();
      var startOffset = Selector.getRange()[1];
      var endOffset = Selector.getRange()[3];
      if(selectedText != ""){
        //filter out the textarea with the current name and insert selected text there
        $("textarea")
          .filter(function(index){
            return $(this).attr("name") == name+"-text";
          })
          .val(selectedText.toString());
        $("input")
          .filter(function(index){
            return $(this).attr("name") == name+"-document";
          })
          .attr("value", Store.getData('documentID'));
        $("input")
          .filter(function(index){
            return $(this).attr("name") == name+"-startoffset";
          })
          .attr("value", startOffset);
        $("input")
          .filter(function(index){
            return $(this).attr("name") == name+"-endoffset";
          })
          .attr("value", endOffset);
        $("span")
          .filter(function(index){
            return $(this).attr("name") == name+"-quote";
          })
          .text(selectedText.toString());
      }
    };
    result = result.after(Draw.button("Paste", onclickPaste));
    //END paste button code
    //START unlink button code
    var onclickForUnlink = function(){
      $("input")
        .filter(function(index){
          return $(this).attr("name") == name+"-document";
        })
        .attr("value", "");
      $("input")
        .filter(function(index){
          return $(this).attr("name") == name+"-startoffset";
        })
        .attr("value", "");
      $("input")
        .filter(function(index){
          return $(this).attr("name") == name+"-endoffset";
        })
        .attr("value", "");
        $("span")
          .filter(function(index){
            return $(this).attr("name") == name+"-quote";
          })
        .text('\"\"');
    };
    result = result.after(Draw.button("Unlink", onclickForUnlink));
    //END unlink button code
    //START choose existing button code
    var onclickForChooseExisting = function(){
      //start by defining callback for ok...
      var okCallback = function(){
        //Get hold of the existing-element-fieldset (that needs to be removed eventually)
        //Get the ID of the existing element, make a relation object out of it...
        var JQdropdown = $('select#'+name+'-existingelement');
        var idStr = JQdropdown.val();
        var idArr = idStr.split("-"); 
        var existingElement = new Relation(idArr[0], idArr[1]);
        //Make the new annotation
        var annotationblock = RelationRender.prototype._renderFormAnnotation(
            name,
            {'copyfield':true, 'label':existingElement.getDisplayType()},
            existingElement.getFirstTextSection(),
            null, //deprecated referer
            existingElement.getFirstDocID(),
            existingElement.getFirstOffsets(),
            existingElement.getFirstQuote(),
            idStr,
            existingElement.getArity() == "n");
        //empty the entire fieldset
        $('fieldset#'+name).empty();
        //and fill it with the new annotation block
        $('fieldset#'+name).append(annotationblock);
      };
      //...and the callback for cancel
      var cancelCallback = function(){
        var JQdropdownfieldset = $("fieldset#"+name+"-existingelementfieldset");
        JQdropdownfieldset.remove();
        $('fieldset#'+name).find('*').show();
      };
      var relations = Relation.getRelationsByType(conjuncttype);
      var selects = new Array();
      for(relationKey in relations){
        var relation = relations[relationKey];
        //var relTextSection = 
        selects[selects.length] = {
            'key': relation.getType()+"-"+relation.getID(),
            'value': relation.getFirstTextSection()
            };
      }
      //remove buttons
      $("fieldset")
        .filter(function(index){
          return $(this).attr("id") == name;
        })
        .children()
        .filter(function(index){
          return $(this).attr('type') == 'button';
        }).hide();
      //hide textarea, and after that add the drop-down and buttons
      $("textarea")
        .filter(function(index){
          return $(this).attr("name") == name+"-text"
        })
        .hide();
          //)))));
      //hide quote
      $("label")
        .filter(function(index){
          return $(this).attr("for") == name+"-quote";
        }).hide()
          .after($("<br>")
            .after(
              Draw.form.fieldset(name+'-existingelementfieldset')
              .append(
                Draw.form.select(name+'-existingelement', selects, null, "Select element")
                )
              .append($("<br>"))
              .append(Draw.button('OK', okCallback))
              .append(Draw.button('Cancel', cancelCallback))
              .append($("<br>"))
              .append(Draw.alert_element("ChooseExisting", "About adding an existing item"))
              ));
    }
    result = result.after(Draw.button("Choose existing", onclickForChooseExisting));
    //END choose existing button code
    //START minus button code
    if(minusButton){
      var onClickForMinus = function(){
        $("fieldset").filter(function(index){
          return $(this).attr("id") == name;
        }).remove();
      };
      result = result.after(Draw.button("-", onClickForMinus));
    }
    //END minus button code
    //var onclickForHighlight = function(){ //todo: make this
      //Add code here!todo
      //$("#documenttext").innerText = highlightedText;
    //}
    //result = result.after(Draw.button("Highlight", onclickForHighlight));
    result.after($("<br>"));
  }
  return result;
}
