/* ----------------------------------------------------------------------------
 * Copyright (c) 2012 Leibniz Center for Law, University of Amsterdam, the 
 * Netherlands
 *
 * This program and the accompanying materials are licensed and made available
 * under the terms and conditions of the European Union Public Licence (EUPL 
 * v.1.1).
 *
 * You should have received a copy of the  European Union Public Licence (EUPL 
 * v.1.1) along with this program as the file license.txt; if not, please see
 * http://joinup.ec.europa.eu/software/page/eupl/licence-eupl.
 *
 * This software is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 * ----------------------------------------------------------------------------
 * Project:      IMPACT
 * Created:      2011-2012
 * Last Change:  14.12.2012 (final release date)
 * ----------------------------------------------------------------------------
 * Created by the Leibniz Center for Law, University of Amsterdam, The 
 * Netherlands, 2012
 * Authors: Jochem Douw (http://jochemdouw.nl), Sander Latour
 * ----------------------------------------------------------------------------
 */
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
