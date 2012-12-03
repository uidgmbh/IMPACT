/**
  General object that is used to make edit/view pages. Is the parent class of ArgumentRender, DiscussionRender and DocumentRender.
  @constructor
  @param Obj - The Object that has to be rendered
  @param Data {associative array containing associative arrays containing strings} - Contains information about the way fields of the object have to be rendered
*/
function Render(Obj, Data){
  this._obj = Obj;
  this._data = Data;

  this.getObject = function(){ return this._object; };
  this.getData = function(){ return this._data; };

  this.setObject = function(Obj){ this._object = Obj; };
  /**
    Set the type of input field and the label for each field.
    @param {associative array containing associative arrays containing strings} data
  */
  this.setData = function(data){ this._data = data; };
}

Render.prototype.renderDetails = function(referer){
  var ref = (typeof(referer)=="undefined"?this:referer);
  var data = ref.getData();
  var obj = ref.getObject();
  
  var render_element = Draw.section();

  for(key in data) {
    details_item = data[key];
    value = obj.getDataItem(key);
    ref.renderDisplayItem(render_element, key, details_item, value, ref);
  }
  return render_element;
}

Render.prototype.renderDisplayItem = function(render_element, name, details_item, value, referer){
  var ref = (typeof(referer)=="undefined"?this:referer);
  if ( !value || typeof(value) == "undefined" ) value = "";
  var result = Draw.details.label(name, label);
  result.append(Draw.details.text(name, value));
  return result;
}

/**
  Renders a form in a general way. When objects require a renderForm funciton specific to their data structure, the renderForm function of that specific child does not call this general function, thereby fully overriding it.
  @param {function} submit_callback
  @param referer
*/
Render.prototype.renderForm = function(submit_callback, referer){
  var ref = (referer == undefined ? this : referer);
  var data = ref.getData();
  var obj = ref.getObject();
  
  var form = Draw.form.form(function(){
    console.log("Form callback");
    submit_callback(this);
    return false;
  });
  if(obj.getURI() != undefined){ //apparently this object already existed and has to be uptdated with this form (not created)
    form.append(ref.renderFormItem("id", {"label":"", "type":"hidden"}, obj.getURI(), ref));
  }
  for(key in data) {
    form_item = data[key];
    value = obj.getDataItem(key);
    form.append(ref.renderFormItem(key, form_item, value, ref));
  }
  form.append($("<br/>").css('clear', 'both'));
  form.append(Draw.form.submit());
  return form;
}

/**
  Renders a form item, with tags such as input, select or textarea
  @param {string} name - The contents that have to be in the name-attribute of the item.
  @param {associative array} form_item - Information from the list of form items about what data should be displayed in the form. Possible keys: label, type, rows (the last two only for type textarea), options (for type select).
  @param {string} value - Value that has to be filled in for this item.
  @param {Object} referer
  @param {int} size - Optional parameter that indicates the number of rows when the type is textsection (might have future use for other sizes as well)
*/
Render.prototype.renderFormItem = function(name, form_item, value, referer){
  var ref = (typeof(referer)=="undefined"?this:referer);
  var result;
  if( form_item.type == "input" ){
    result = ref.renderFormInput(name, form_item.label, value, ref);
  }else if(form_item.type == "select" ){
    result = ref.renderFormSelect(name, form_item.label, form_item.options, value, ref); //function does not yet exist (noticed 10 nov. 2011)
  } else if(form_item.type == "textarea"){
    result = ref.renderFormTextarea(name, form_item.label, value, form_item.size, ref);
  } else if(form_item.type == "hidden"){
    result = ref.renderFormHidden(name, value, ref);
  }
  result = result.append($("<br/>"));//.attr("clear", "all")); //debug
  return result;
}

/**
  Render a &lt;input&gt; field with it's contents.
  @param {string} name - The name of the input field that is used for identification of the field sort.
  @param {string} label - The displayed label of the input field.
  @param {string} value - The contents of the input field.
  @param referer
*/
Render.prototype.renderFormInput = function(name, label, value, referer){
  var ref = (typeof(referer)=="undefined"?this:referer);
  if ( !value || typeof(value) == "undefined" ) value = "";
  var result = Draw.form.label(name, label);
  result = result.after(Draw.form.text(name, value));
  return result;
  //render_element.append(Draw.form.label(name, label));
  //render_element.append(Draw.form.text(name, value));
}

/**
  Render a &lt;textarea&gt; with it's contents
  @param {string} name
  @param {string} label
  @param {string} value - The contents of the textarea.
  @param referer
  @since 10 November 2011
*/
Render.prototype.renderFormTextarea = function(name, label, value, size, referer){
  var ref = (typeof(referer)=="undefined"?this:referer);
  if (!value || typeof(value) == "undefined") value = "";
  var result = Draw.form.label(name, label);
  result.append(Draw.form.textarea(name, value, size));
  return result;
}

/**
  Render a &lt;hidden&gt; with it's contents
  @param {string} name
  @param {string} value - The contents of the hidden field
  @param referer
  @since 23 February 2012
*/
Render.prototype.renderFormHidden = function(name, value, referer){
  var ref = (referer==undefined ? this : referer);
  if(!value){
    value = "";
  }
  return Draw.form.hidden(name, value);
}

/**
 * Render a small &lt;input&gt; field with it's contents with small letters and 
 * a non-adjustable content.
 * @param {string} name - The name of the input field that is used for 
 * identification of the field sort.
 * @param {string} label - The displayed label of the input field.
 * @param {string} value - The contents of the input field.
 * @param referer
 * @since 13 March 2012
 **/
Render.prototype.renderFormSmalllock = function(name, label, value, referer){
  var ref = (typeof(referer)=="undefined"?this:referer);
  if (!value || typeof(value) == "undefined") value = "";
  var result = Draw.form.smalllabel(name, label);
  result.append(Draw.form.smalllocked(name, value));
  return result;
}

/**
 * Render a large &lt;input&gt; field with it's contents with small letters and 
 * a non-adjustable content.
 * @param {string} name - The name of the input field that is used for 
 * identification of the field sort.
 * @param {string} label - The displayed label of the input field.
 * @param {string} value - The contents of the input field.
 * @param referer
 * @since 15 October 2012
 **/
Render.prototype.renderFormLargelock = function(name, label, value, referer){
  var ref = (typeof(referer)=="undefined"?this:referer);
  if (!value || typeof(value) == "undefined") value = "";
  var result = Draw.form.smalllabel(name, label);
  result.append(Draw.form.largelocked(name, value));
  return result;
}
