/**
	DEPRECATED. Replaced by RelationRender. This class contains specific rendering information for the Argument objects. 
	@constructor
	@extends Render
	@param Obj - Object (Argument) that needs to be rendered.
  @deprecated
*/
ArgumentRender.extends(Render);
function ArgumentRender(Obj){
	var scheme = Obj.getScheme();
	var Scheme = Store.getData("Scheme");
	/** Data is an associative array. Keys of this array are the names (i.e. contents of the name attributes) of the form items. Values are arrays containing additional information, like the type of input field and the label that has to be displayed with it. */
	var Data = {};
	Scheme
		.find('scheme')
		.filter(function(index){
			return $(this).attr("name") == scheme;
		})
		.find("premise")
		.each(function(){
			Data[$(this).attr("name")] = {
				"type": "annotation", 
				"label": $(this).attr("label"),
				"copyfield": true
			};
		});//"copyfield" is true when a button needs to be placed next to the textarea that copies contents into the textarea (and ideally also adds metadata in a hidden input field)
	this.setObject(Obj);
	this.setData(Data);
}

ArgumentRender.prototype.renderDetails = function(referer){
	var ref = (typeof(referer)=="undefined"?this:referer);
	return this.parent.renderDetails(ref);
}

/**
	Function that calls renderForm of it's parent when a new item has to be made. When an existing item is being displayed, it runs it's own version of the method because of the specific Argument data structure (with elements that are annotations)
	@param {function} submit_callback - function that is being called after the user submits the form.
	@param referer
*/
ArgumentRender.prototype.renderForm = function(submit_callback, referer){
	var ref = (referer==undefined ? this : referer);
	var data = ref.getData();
	var argument = ref.getObject();
	var elements = argument.getElements();
	var offsets = new Array("",""); //will be overwritten if argument already exists
	var form = Draw.form.form(function(){
		console.log("Form callback");
		submit_callback(this);
		return false;
	});
	if(elements == false){ //new argument is made
		var data = ref.getData();
		for(key in data){
			form_item = data[key];
			this.renderFormItem(form, key, form_item, "", ref, "", Array("",""));
		}
	} else { //existing argument is adapted
		this.renderFormItem(form, "id", {"type":"hidden"}, argument.getURI(), ref);
		for(key in elements){
			form_item = data[key];
			subject = elements[key].getSubject();
			documentID = subject.getDocumentID();
			value = subject.getText();//WARNING: presumes that subject is a textSection object. Should build in some testing of the type of subject, which is not straight-forward.
			offsets = subject.getOffsets();
			this.renderFormItem(form, key, form_item, value, ref, documentID, offsets);
		}
	}
	form.append(Draw.form.submit());
	return form;
}

/**
	Renders a form item, with tags such as input, select or textarea. Overloads Render's renderFormItem function because of specific argument datastructure.
	@param {JQuery object} render_element - The element (form) to which the item has to be appended.
	@param {string} name - The contents that have to be in the name-attribute of the item.
	@param form_item - Information from the list of form items about what data should be displayed in the form, like the label and type of form item.
	@param {string} value - Value that has to be filled in for this item.
	@param {Object} referer
	@param {int} documentID - Optional. Contains the ID of the document this entitiy is associated with.
	@param {int array} offsets - Character at which the textSection starts in the document at index 0 and ending position at index 1.
*/
ArgumentRender.prototype.renderFormItem = function(render_element, name, form_item, value, referer, documentID, offsets){
	var ref = (typeof(referer)=="undefined"?this:referer);
	if( form_item.type == "input" ){
		ref.renderFormInput(render_element, name, form_item.label, value, ref);
	//"annotation" is a special type that consists of a textarea, containing the actual annotation, and a hidden field that may contain a link to the document the text snippet was taken from, as well as the associated offsets.
	} else if(form_item.type == "annotation"){
		ref.renderFormTextarea(render_element, name+"-text", form_item.label, value, form_item.size, ref);
		ref.renderFormSmalllock(render_element, name+"-document", "docID", documentID, ref);
		ref.renderFormSmalllock(render_element, name+"-startoffset", "Start", offsets[0], ref);
		ref.renderFormSmalllock(render_element, name+"-endoffset", "End", offsets[1], ref);
		if(form_item.copyfield){ //a button is added to copy text into the textarea
			var onclick = function(){
				var selectedText = Selector.getSelected().toString();
				var startOffset = Selector.getRange()[1];
				var endOffset = Selector.getRange()[3];
				console.log("start and end offset are: "+startOffset+", "+endOffset);
				//starting and ending point debug
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
				}
			};
			render_element.append(Draw.button("Paste", onclick));
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
			};
			render_element.append(Draw.button("Unlink", onclickForUnlink));
			var onclickForHighlight = function(){
				//ADD CODE HERE!debug
				$("#documenttext").innerText = highlightedText;
			}
			render_element.append(Draw.button("Highlight", onclickForHighlight));
			render_element.append($("<br>"));
		}
	} else if(form_item.type == "hidden"){
		ref.renderFormHidden(render_element, name, value, ref);
	}
}
