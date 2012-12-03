/**
	This class contains specific rendering information for the Document objects.
	@constructor
	@extends Render
	@param Obj - Object (Document) that needs to be rendered.
*/
DocumentRender.extends(Render);
function DocumentRender(Obj){
	var Data = {
		"title": { "type": "input", "label": "Title" },
		"url" : {"type": "input", "label": "URL"},
		"text": { "type": "textarea", "label": "Text", "size": 20 },
	}
	this.setObject(Obj);
	this.setData(Data);
}

/*
//the functions below were strangely left behind after copy-pasting or something (-JD 20120416)
DiscussionRender.prototype.renderDetails = function(referer){
	var ref = (typeof(referer)=="undefined"?this:referer);
	return this.parent.renderDetails(ref);
}

DiscussionRender.prototype.renderForm = function(submit, referer){
	var ref = (typeof(referer)=="undefined"?this:referer);
	return this.parent.renderForm(submit, ref);
}
*/