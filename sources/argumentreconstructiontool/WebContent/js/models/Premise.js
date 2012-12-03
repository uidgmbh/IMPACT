/**
	Sibling of Conclusion. A Premise is a special type of Annotation that belongs to an Argument.
	@param argumentation
	@param name
	@param subject - Previously called "text".
	@param meta - Not used at this time, might be used later for additional information
	@constructor
	@extends Annotation
*/
function Premise(argumentation, name, subject, meta){
	this.parent = Annotation;
//	name = argumentation.getScheme()+"-"+name;
	this.parent(argumentation, name, subject, meta);
	this.parent = new Annotation();
	
	this.setDataItem("conclusion",false);
	
	//Get the label from the Scheme (based on the XML file that defines the schemes)
	this.getLabel = function(){
		var argument = this.getRelation();
		var annotation = this.getAnnotationLabel();
		var Scheme = Store.getData("Scheme");
		var p = Scheme
			.find("scheme")
			.filter(function(index){
				return $(this).attr("name") == argument.getScheme();
			})
			.find("premise")
			.filter(function(index){
				return $(this).attr("name") == annotation;
			});
		return $(p[0]).attr("label");
	};

	this.create = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		this.parent.create(ref);
	};
	
	this.alter = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		this.parent.alter(ref);
	};
}
