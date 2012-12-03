/**
	This class contains specific rendering information for the Discussion objects.
	@constructor
	@extends Render
	@param Obj - Object (Discussion) that needs to be rendered.
*/
DiscussionRender.extends(Render);
function DiscussionRender(Obj){
	var Data = {
		"title": { "type": "input", "label": "Title" },
		"intro": { "type": "textarea", "label": "Introduction" },
	}
	this.setObject(Obj);
	this.setData(Data);
}

DiscussionRender.prototype.renderDetails = function(referer){
	var ref = (typeof(referer)=="undefined"?this:referer);
	return this.parent.renderDetails(ref);
}

DiscussionRender.prototype.renderForm = function(submit, referer){
	var ref = (typeof(referer)=="undefined"?this:referer);
	return this.parent.renderForm(submit, ref);
}

