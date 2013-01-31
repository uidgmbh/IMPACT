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
	Representation of a specific text segment originating from the document that was tagged.
	@param text - The contents of the text segment.
 	@param documentID - The document this text segment is associated with.
 	@constructor
*/
function TextSection(text, documentID, startOffset, endOffset){
	this.parent = DbItem;
	this.parent();
	this.parent = new DbItem();
	this.setDataItem("text", text);
	this.setDataItem("documentID", documentID);
	this.setDataItem("startOffset", startOffset);
	this.setDataItem("endOffset", endOffset);

	this.getText = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		return ref.getDataItem("text");
	};
	
	/**
		Gets the ID of the document this textSection is associated with.
		@param referer
	*/
	this.getDocumentID = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		return ref.getDataItem("documentID");
	};

	this.setText = function(text, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		ref.setDataItem("text",text);
	};

	/**
		@param {text} documentID - The origin of the textSection
		@param referer
	*/
	this.setDocumentID = function(documentID, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		ref.setDataItem("documentID",documentID);
	};

	/**
		Returns an array with the startOffset (at index 0) and the endOffset (at index 1).
		@since 12 March 2012
	*/
	this.getOffsets = function(referrer){
		var ref = (typeof(referrer)=="undefined"?this:referrer);
		var startOffset = ref.getDataItem("startOffset");
		var endOffset = ref.getDataItem("endOffset");
		return new Array(startOffset, endOffset);
	};

	/**
		Stores the offsets
		@param {int array} offsets - startOffset (at index 0) and the endOffset (at index 1).
		@since 12 March 2012
	*/
	this.setOffsets = function(offsets, referrer){
		var ref = (typeof(referrer)=="undefined"?this:referrer);
		ref.setDataItem("startOffset", offsets[0]);
		ref.setDataItem("endOffset", offsets[1]);		
	}
	
	this.create = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		this.parent.create("/text/",undefined,undefined,undefined,ref);
	};
	
	this.alter = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		var uri = ref.getURI();
		if( typeof("uri") != "undefined" )
			this.parent.alter("/text/"+uri+"/",undefined,undefined,undefined,ref);
		else
			this.parent.create("/text/",undefined,undefined,undefined,ref);
	};
}

