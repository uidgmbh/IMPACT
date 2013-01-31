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
