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
	@param {string} url - The URL of the retrieved document. When it is a free text entry, the URL will be null and in the database the URL will be set to the database ID, in order to make the url-timestamp-pair still unique and in order to be able to make URI's e.g. of the form impact.eu/discussion/ID or something. (Note that the variable "document" is a predefined class in JavaScript.)
	@param {string} title
	@param {string} text
	@constructor
	@extends DbItem
	@since 22 November 2011
*/
function Document(id, url, title, text, first_id, version, annotated, newest_version){
  this.parent = DbItem;
  this.parent();
  this.parent = new DbItem();

  this.setDataItem("id",id);
  this.setDataItem("url",url);
  this.setDataItem("title",title);
  this.setDataItem("text", text);
  this.setDataItem("first_id", first_id);
  this.setDataItem("version", version);
  this.setDataItem("annotated", annotated);
  this.setDataItem("newest_version", newest_version);

  this._timestamp = undefined;
  this.getTimestamp = function(){ return this._timestamp; };
  this.setTimestamp = function(timestamp){
    this._timestamp = timestamp;
  };

	//we might want to add a distincion between user_added and user_deleted
	this._user = undefined;
	this.getUser = function(){ return this._user; };
	this.setUser = function(user){ this._user = user; };
	
	/**
		Create a new Document, basically by calling this.parent.create().
		@param referer
	*/
	this.create = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		this.parent.create("/documents/", undefined, undefined, undefined, ref);
    //this.setDataItem('id', ref.getDataItem('id'));
    //return ref.getData('id');
	}
	
	/**
		Create a new version of this Document.
		@param referer
	*/
	this.createVersion = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		this.parent.create("/documents/version/"+ref.getDataItem("first_id"), undefined, undefined, undefined, ref);
    //this.setDataItem('id', ref.getDataItem('id'));
    //return ref.getData('id');
	}

	/**
		Update a Document, basically by calling this.parent.alter().
		@param referer
	*/
	this.alter = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		this.parent.alter("/documents/"+this.getDataItem("id"), undefined, undefined, undefined, ref);
	}
	
	/**
		Function in which a form is created with which you can add or edit a document.
		@param {int} newVersion
	*/
	this.renderForm = function(newVersion){
		var ref = (typeof(referer)=="undefined"?this:referer);
		var render = new DocumentRender(ref);
		var submit_callback = function(form){
			var d = new Document(form.id.value,
													 form.url.value,
													 form.title.value,
													 form.text.value,
													 ref.getDataItem("first_id"));
			if(form.id.value == undefined){ //a new document has to be created
				d.create();
				var docID = d.getURI();	
			} else if(newVersion){ //make new version of doc with this ID
				d.createVersion();
				var docID = d.getURI();	
			} else {
				d.alter();
				var docID = form.id.value;
			}
			Pages.showDocumentManagement(docID);//docID
			return false;
		};
		return render.renderForm(submit_callback);
	}
}

/**
	Returns an array containing the newest versions of all documents
*/
Document.getRemoteDocuments = function(){
	var result = new Array();
	var success_callback = function(data, xhr){
		for(var d_index in data.documents){
			result[+(d_index)] = new Document(
				data.documents[d_index].id,
				data.documents[d_index].url,
				data.documents[d_index].title,
				data.documents[d_index].text,
				data.documents[d_index].first_id,
				data.documents[d_index].version,
				data.documents[d_index].annotated,
				data.documents[d_index].newest_version
			);
			(result[+(d_index)]).setURI(
				data.documents[d_index].id
			);
		}
	};
	var error_callback = function(status, xhr){
		console.log("Error retrieving documents ["+status+"]");
	}; 
	DbItem.getRemoteInstances("/documents/",success_callback, error_callback);
	return result;
}

/**
	Returns an array containing all versions of one document
	@param {int} id - ID of the first version of the document for which the versions have to be displayed.
	@added 28 February 2012
*/
Document.getRemoteDocumentVersions = function(id){
	var result = new Array();
	var success_callback = function(data, xhr){
		for(var d_index in data.documents){
			result[+(d_index)] = new Document(
				data.documents[d_index].id,
				data.documents[d_index].url,
				data.documents[d_index].title,
				data.documents[d_index].text,
				data.documents[d_index].first_id,
				data.documents[d_index].version,
				data.documents[d_index].annotated,
				data.documents[d_index].newest_version
			);
			(result[+(d_index)]).setURI(
				data.documents[d_index].id
			);
		}
	};
	var error_callback = function(status, xhr){
		console.log("Error retrieving documents ["+status+"]");
	}; 
	DbItem.getRemoteInstances("/documents/"+id+"/versions",success_callback, error_callback);
	return result;
}

/**
	Returns the document with the specified id.
	@param {int} id
*/
Document.getRemoteDocument = function(id){
	return this.getByID(id);
}

/**
	Return one specific document based in the document (database) ID.
	@param documentID
*/
Document.getByID = function(id){
	var xhr = DbItem.sendDirectRemoteRequest(
		"/documents/"+id,
		"GET",
		undefined
	);
	if(xhr.status == 200){
		var data = $.parseJSON(xhr.responseText);
		var doc = new Document(
			data["details"]["id"],
			data["details"]["url"],
			data["details"]["title"],
			data["details"]["text"],
			data["details"]["first_id"],
			data["details"]["version"],
			data["details"]["annotated"],
			data["details"]["newest_version"]
		);
		doc.setURI(id);
		return doc;
	}
	return false;
}



/**
 @param {int} discussionID - ID of the discussion that is being retrieved. FUNCTION DOES NOT WORK YET (copied from Relation.getRelations(discussionID)), but might be practical later on.
*/
//Document.getRemoteDocuments = function(discussionID){
/*	var result = new Array();
	var success_callback = function(data, xhr){
		for(var r_index in data.relations){
			result[+(r_index)] = new Relation(
				data.relations[r_index].type
			);
			(result[+(r_index)]).setURI(
				data.relations[r_index].id
			);
		}
	};
	var error_callback = function(status, xhr){
		console.log("Error retrieving relations ["+status+"]");
	};
	DbItem.getRemoteInstances("/discussions/"+discussionID+"/relations",success_callback, error_callback);
	return result;*/
//}
