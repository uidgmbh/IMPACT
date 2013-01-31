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

