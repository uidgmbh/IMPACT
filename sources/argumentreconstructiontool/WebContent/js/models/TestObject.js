function TestObject1(arg1, referer){
	var _ref = (referer==undefined?this:referer);
	_ref._arg1 = arg1+2;

	this.getArg1Public = function(referer){
		var ref = (referer==undefined?this:referer);
		return ref._arg1;
	};

	this.setArg1Public = function(arg1,referer){ 
		var ref = (referer==undefined?this:referer);
		ref._arg1 = arg1+"?";
	};

}

function TestObject2(arg2, referer){
	var _ref = (referer==undefined?this:referer);
	this.parent = new TestObject1(arg2, _ref);
	this.__proto__ = this.parent;
	this.setArg1Public(arg2, _ref);

	this.getArg1Public = function(referer){
		var ref = (referer==undefined?this:referer);
		return this.parent.getArg1Public(ref);
	};

	this.setArg1Public = function(arg1, referer){
		var ref = (referer==undefined?this:referer);
		this.parent.setArg1Public(arg1+"@",ref);
	};
	
}

function TestObject3(argA, referer){
	var _ref = (referer==undefined?this:referer);
	this.parent = new TestObject2(argA, _ref);
	this.__proto__ = this.parent;
	this.setArg1Public(argA, _ref);

	this.getArg1Public = function(referer){
		var ref = (referer==undefined?this:referer);
		return this.parent.getArg1Public(ref)+"!!";
	};

	this.setArg1Public = function(arg1, referer){
		var ref = (referer==undefined?this:referer);
		this.parent.setArg1Public(arg1+"#",ref);
	};
}
