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
 	Representation of a remote database item which can be inspected and manipulated by means of a server api. Communication with the server api is based on a REST/JSON architecture. This object is typically extended by other objects that override the methods: create, alter, remove.

 	@constructor
 	@param data
*/
function DbItem(data){
	
	/** Resource Id: Could be everything from a tripple resource to a relational primary key. */
	this._resource_id = undefined;
	
	/** Structure containing all data related to this DbItem. */
	this._data = (typeof(data)=="undefined"?new Object():data);
	
	this.getData = function(){
		return this._data;
	};
	
	this.getDataItem = function(key){
		if( key in this._data ){
			return this._data[key];
		}
	};
	
	this.getURI = function(){
		return this._resource_id;
	};
	
	this.getStorageURL = function(){
		return DbItem.StorageUrl;
	};
	
	this.setURI = function(resource_id){
		this._resource_id = resource_id;
	};
	
	this.setData = function(data){
		this._data = data;
	};
	
	this.setDataItem = function(key, value){
		if( typeof(key) != "undefined" )
			this._data[key] = value;
	};
	
  /** Send a remote request and execute callback functions on various 
   * scenarios. Callbacks can be overriden.<br>
   * Uses JQuery.ajax({..}) call to execute the HTTP request. The body of the 
   * request, if any, contains the JSON encoding of this.getData().
   * @param entity -  REST entity that will handle the HTTP request sent to 
   * alter an existing remote resource. Default: (uri).
   * @param method -  HTTP method that should be used. Default: "PUT".
   * @param success - Callback function that is called when the returned HTTP 
   * status is 200.
   * @param error -   Callback function that is called when the returned HTTP 
   * status is not 200.
   * @param referer - Current object instance
	 **/
	this.sendRemoteRequest = function(entity, method, success, error, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		if(typeof(success)=="undefined"){
			var _success = function(status, xhr){
				ref.onDbSuccess(status, xhr, ref)
			};
		}else{
			var _success = success;
		}
		
		if(typeof(error)=="undefined"){
			var _error = function(status, xhr){
				ref.onDbFailure(status, xhr, ref)
			};
		}else{
			var _error = error;
		}
		var xhr = DbItem.sendDirectRemoteRequest(entity, method, ref.getData());
		DbItem.handleSJAXResponse(xhr, _success, _error);
	}
	
	
	
	/**
   * Create a DB item that contains the values of this object and execute 
   * callback functions on various scenarios. Callbacks can be overriden. Uses 
   * the sendRemoteRequest function.
   * @param {string} entity - REST entity that will handle the HTTP request sent 
   * to alter an existing remote resource. Default: (uri).
   * @param method - HTTP method that should be used. Default: "POST".
   * @param success - Callback function that is called when the returned HTTP 
   * status is 200.
   * @param error -   Callback function that is called when the returned HTTP 
   * status is not 200.
   * @param referer - Current object instance
	 **/
	this.create = function(entity, method, success, error, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		if(typeof(success)=="undefined"){
			var _success = function(data, xhr){
				ref.onCreateSuccess(data, xhr, ref)
			};
		}else{
			var _success = success;
		}
		
		if(typeof(error)=="undefined"){
			var _error = function(status, xhr){
				ref.onDbFailure(status, xhr, ref);
			};
		}else{
			var _error = error;
		}
	
		if( typeof(method) == "undefined"){
			var _method = "POST";
		}else{
			var _method = method;
		}
	
		ref.sendRemoteRequest(entity, _method, _success, _error, ref);
	}
	
	/**
   * Alter a DB item so that it has the values of this object and execute 
   * callback functions on various scenarios. Callbacks can be overriden. Uses 
   * the sendRemoteRequest function.
   * @param entity - REST entity that will handle the HTTP request sent to alter 
   * an existing remote resource. Default: (uri).
   * @param method - HTTP method that should be used. Default: "PUT".
   * @param success - Callback function that is called when the returned HTTP 
   * status is 200.
   * @param error - Callback function that is called when the returned HTTP 
   * status is not 200.
   * @param referer - Current object instance
	 **/
	this.alter = function(entity, method, success, error, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
    if(typeof(success)=="undefined"){
      var _success = function(data, xhr){
        ref.onAlterSuccess(data, xhr, ref)
      };
		}else{
			var _success = success;
		}
		
		if(typeof(error)=="undefined"){
			var _error = function(status, xhr){
				ref.onDbFailure(status, xhr, ref);
			};
		}else{
			var _error = error;
		}
	
		if( typeof(method) == "undefined"){
			var _method = "PUT";
		}else{
			var _method = method;
		}
	
		ref.sendRemoteRequest(entity, _method, _success, _error, ref);
	}
	
	this.onCreateSuccess = function(data, xhr, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		ref.setURI(data.data);
		console.log("onCreateSucces called, stored id = "+ref.getURI());
	};
	
	this.onAlterSuccess = function(data, xhr, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		console.log("onAlterSucces called, response = "+data.data);
	};
	
	this.onDbSuccess = function(data, xhr, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		console.log("onDbSuccess called");
	};
	
	this.onDbFailure = function(code, xhr, referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		console.log("onDbFailure called on code: "+code);
	};

}

/** In order to define the (root of the) storage URL elsewhere, this is the way to define the storage URL dor DbItem.
	@param {string} storage_url - The storage URL of the server that contains the API.
*/
DbItem.setStorageURL = function(storage_url){
		DbItem.StorageUrl = storage_url;
}

DbItem.handleSJAXResponse = function(xhr, success_callback, error_callback){
	if(xhr.status == 200){
		var data = $.parseJSON(xhr.responseText);
		success_callback(data, xhr);
	}else{
		error_callback(xhr.status, xhr);
	}
}

/**
 @param entity - The addition to the StorageUrl that is specific for the instances we would like to retrieve.
 @param success_callback - function is are given to handleSJAXResponse directly.
 @param error_callback - function is are given to handleSJAXResponse directly.
 @param {string} method - HTTP method (when undefined, GET is used)
*/
DbItem.getRemoteInstances = function(entity, success_callback, error_callback, method){
	var param = {
		"type": (typeof(method)=="undefined"?"GET":method),
		"contentType":"text/json",
		"dataType":"json",
		"async":false,
	};
	
	// Set URL
	if( typeof(entity) == "undefined" )
		param.url = DbItem.StorageUrl;
	else
		param.url = DbItem.StorageUrl+entity;
	
	//Ajax call with parameters
	console.log("AJAX call in getRemoteInstances: "+JSON.stringify(param));
	var xhr = $.ajax(param);
	DbItem.handleSJAXResponse(xhr, success_callback, error_callback);
}

/**
	@param entity
	@param method - HTTP method: GET/HEAD/OPTIONS/DELETE/PUT/POST
	@param data
*/
DbItem.sendDirectRemoteRequest = function(entity, method, data){
	var param = {
		"dataType":"json",
		"async":false,
	};
	
	if (
		method.toUpperCase() == "GET" ||
		method.toUpperCase() == "HEAD" ||
		method.toUpperCase() == "OPTIONS" ||
		method.toUpperCase() == "DELETE"
	){
		param.type = method.toUpperCase();
	}else if(
		method.toUpperCase() == "POST" ||
		method.toUpperCase() == "PUT"
	){
		param.type = method.toUpperCase();
		param.contentType = "text/json";
		param.data = JSON.stringify(data);
	}else{
		param.type = "GET";
	}

	// Set URL
	if(typeof(entity) == "undefined")
		param.url = DbItem.StorageUrl;
	else
		param.url = DbItem.StorageUrl+entity;

	// Execute request
	console.log("AJAX call from sendDirectRemoteRequest: "+JSON.stringify(param));
	
	return $.ajax(param);
}
