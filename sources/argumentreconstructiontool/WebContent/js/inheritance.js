/**
	Only works for prototypes that do not change variables in their parent object. Thus, only applied for inheritance of static methods.
*/
Function.prototype.extends = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) { 
		//Normal Inheritance
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} else { 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
} 
