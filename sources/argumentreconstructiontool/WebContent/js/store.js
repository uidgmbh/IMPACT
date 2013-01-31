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
	Store is used for storage of data that has to be globally available, but does not have to be stored in the database. DbItem is used for synchronized storage in the remote database.
	@constructor
*/
var Store = {
/*	type : 'localStorage',   // Cookies | localStorage
	//Out of order because this is an old function that was useful in the time this was still a Chrome plugin.
	init : function(){
		console.log("Init");
		chrome.windows.getCurrent(
			function(win){
				chrome.tabs.getSelected(
					win.id,
					function(tab){
						Store.data.url = tab.url;
						if( Store.type == "Cookies" ){
							Store.loadCookieData(tab.url);
						}else{
							Store.loadLocalStorageData(tab.url);
						}
						Store.setData("url",tab.url);
					}
				);
			}
		);
	},
*/
	/*********************
	 * Sync data storage *
	 *********************/
//Out of order for now. The (new?) principle is that everything that has to wait for an answer, works with callbacks
/*	synced : false,
	sync_callbacks : [],
	setSynced : function(synced){
		Store.synced = synced;
		if(synced){
			console.log("Call synced callbacks");
			for(var c = 0; c < Store.sync_callbacks.length; c++){
				Store.sync_callbacks[c]();
			}
		}else{
			if( Store.type == 'Cookies' ){
				Store.saveCookieData();
			}else{
				Store.saveLocalStorageData();
			}
		}
	},
	ensureSynced : function(callback){
		if(Store.synced){
			callback();
		}else{
			console.log("Niet sync! Callback wordt in array gestopt.");
			Store.sync_callbacks[Store.sync_callbacks.length] = callback;
		}
	},
*/

	// Placeholder for persistant data storage. Do not alter
	// or retrieve directly, use setData and getData.
	// Store will make sure that the data is always synced.
	data : {},
	/**
		setData is used for local storage in JavaScript variables.
		@param {string} key - Key under which the value has to be stored.
		@param {string} value - Value that has to be stored.
	*/
	setData : function(key, value){
		console.log("Set data in local Store:"+key+":"+value);
		Store.data[key] = value;
	},
	/**
		GetData is used to retrieve locally stored variables in JavaScript variables.
		@param {string} key - Key under which the value that must be retrieved, is stored.
	*/	
	getData : function(key){
		var data = Store.data[key];
		console.log("Get data from local Store: "+ key + "=" + data);
		return data;
	},

	loadLocalStorageData: function(url){
		Store.data = localStorage.art-data[url];
	},

//we don't work with cookies as storage place anymore
/*	loadCookieData : function(url){
		if(!url){
			Store.getData(
				"url", 
				function(url){
					Store.loadCookieDataInUrl(url);
				}
			);
		}else{
			Store.loadCookieDataInUrl(url);
		}
	},
	loadCookieDataInUrl : function(url){
		Store.setSynced(false);
		chrome.cookies.get(
			{
				"name":"art-data",
				"url": url
			},
			function(cookie){
				if(cookie != null){
					Store.data = JSON.parse(cookie.value);
				}
				Store.setSynced(true);
			}
		)
	},
	saveCookieData : function(){
		chrome.cookies.set({
			"url": Store.data.url,
			"name": "art-data",
			"value": JSON.stringify(Store.data)
		});
		Store.synced = true;
	},*/

//strangely enough, the = sign in the function below yielded a syntax error. Therefore it is now temporarily disabled
/*	saveLocalStorageData: function(){
		localStorage.art-data[Store.data.url] = Store.data;
	}*/
}
