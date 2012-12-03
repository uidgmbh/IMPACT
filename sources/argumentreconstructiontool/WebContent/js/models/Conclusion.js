/**
	DEPRECATED
  Sibling of Premise. A Conclusion is a special type of Annotation that belongs to an Argument.
	@param argumentation
	@param name
	@param text
	@param meta - Not used at this time, might be used later for additional information
	@constructor
	@extends Annotation
*/
function Conclusion(argumentation, name, text, meta){
	this.parent = Annotation;
	this.parent(argumentation, name, text, meta);
	this.parent = new Annotation();
	this.setDataItem("conclusion",true);
}
