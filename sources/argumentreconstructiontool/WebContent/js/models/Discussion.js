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
 * Note that in order to be in coherence with the AVT, in all user 
 * communication we use the term "issue" rather than "discussion". These refer 
 * to the exact same thing within the ART though.
 *	@constructor
 *  @param {string} title - The title of the discussion. Default: [timestamp]
 *  @param {string} intro - The uri to an introduction to the discussion. 
 *  Default: ""
 *  @extends Relation
 **/
function Discussion(id, title, intro){
	this.parent = DbItem;
	this.parent();
	this.parent = new DbItem();
	if(typeof(title) == "undefined"){
		this.setDataItem("title", "");
	} else {
		this.setDataItem("title", title);
	}

	this.setDataItem("intro",(typeof(intro)=="undefined"?"":intro));
	this.setDataItem("id", id);//(id != undefined ? id : intro)); (old code)
	
	this.getTitle = function(){ return this.getDataItem("title"); };
	this.getIntro = function(){ return this.getDataItem("intro"); };
	this.getID = function(){ return this.getDataItem("id"); };

	this.setTitle = function(title){
		this.setDataItem("title",title);
	};

	this.setIntro = function(intro){
		this.setDataItem("intro",intro);
	};

	this.create = function(referer){
		var ref = (typeof(referer) == "undefined" ? this : referer);
    var success_callback = function(data){
      ref.setDataItem("id", data['discussion_id']);
    }
		this.parent.create("/discussions/", undefined, success_callback, undefined, ref);
    return ref.getID();
	};
	
	this.alter = function(referrer){
		var ref = (typeof(referer) == "undefined" ? this : referer);
    var success;
    var success_callback = function(data){
      success = data['success'];
    }
		this.parent.alter("/discussions/"/*+this.getDataItem("id")*/, undefined, success_callback, undefined, ref);
    return success;
	}

	this.renderForm = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		var render = new DiscussionRender(ref);
		var submit_callback = function(form){
			var discussion = new Discussion(form.id.value, form.title.value, form.intro.value);
			if(form.id.value == undefined){ // the discussion does not exist yet, has to be created
				var discussion_id = discussion.create();				
        Pages.setMessage("The issue '"+discussion.getTitle()+"' has been created.");
			} else { //the discussion exists, has to be updated
				discussion.alter();
        Pages.setMessage("The issue '"+discussion.getTitle()+"' has been saved.");
			}
      Pages.showDiscussion(discussion.getDataItem("id"));
			return false;
		};
		return render.renderForm(submit_callback);
	};

	this.renderDetails = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		var render = new DiscussionRender(ref);
		return render.renderDetails();
	};
}

/** Returns an array containing all discussions */
Discussion.getRemoteDiscussions = function(){
	var result = new Array();
	var success_callback = function(data, xhr){
		for(var d_index in data.discussions){
			result[+(d_index)] = new Discussion(
				data.discussions[d_index].id,
				data.discussions[d_index].title,
				data.discussions[d_index].intro
			);
			(result[+(d_index)]).setURI(
				data.discussions[d_index].id
			);
		}
	};
	var error_callback = function(status, xhr){
		console.log("Error retrieving issues ["+status+"]");
	}; 
	DbItem.getRemoteInstances("/discussions/",success_callback, error_callback);
	return result;
}

/** This function returns a discussion object based on the uri specified, or false if the uri is not found.
@param uri - this is interpreted as an id right now. In the future, this will probably be a real URI.
*/
Discussion.getByURI = function(uri){
	var xhr = DbItem.sendDirectRemoteRequest(
		"/discussions/"+uri,
		"GET",
		undefined
	);
	if(xhr.status == 200){
		var data = $.parseJSON(xhr.responseText);
		var discussion = new Discussion(
			data["details"]["id"],
			data["details"]["title"],
			data["details"]["intro"]
		);
		discussion.setURI(uri);
		return discussion;
	}
	return false;
}

