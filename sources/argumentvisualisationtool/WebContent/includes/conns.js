/********************************************************************************
 *                                                                              *
 *  (c) Copyright 2010 The Open University UK                                   *
 *                                                                              *
 *  This software is freely distributed in accordance with                      *
 *  the GNU Lesser General Public (LGPL) license, version 3 or later            *
 *  as published by the Free Software Foundation.                               *
 *  For details see LGPL: http://www.fsf.org/licensing/licenses/lgpl.html       *
 *               and GPL: http://www.fsf.org/licensing/licenses/gpl-3.0.html    *
 *                                                                              *
 *  This software is provided by the copyright holders and contributors "as is" *
 *  and any express or implied warranties, including, but not limited to, the   *
 *  implied warranties of merchantability and fitness for a particular purpose  *
 *  are disclaimed. In no event shall the copyright owner or contributors be    *
 *  liable for any direct, indirect, incidental, special, exemplary, or         *
 *  consequential damages (including, but not limited to, procurement of        *
 *  substitute goods or services; loss of use, data, or profits; or business    *
 *  interruption) however caused and on any theory of liability, whether in     *
 *  contract, strict liability, or tort (including negligence or otherwise)     *
 *  arising in any way out of the use of this software, even if advised of the  *
 *  possibility of such damage.                                                 *
 *                                                                              *
 ********************************************************************************/
/**
 * Javascript functions for connections
 */

var CONNECTION_ARROWS_LEFT = "left";
var CONNECTION_ARROWS_RIGHT = "right";
var LINKTYPELABEL_CUTOFF = 18;
var connectionDirection = CONNECTION_ARROWS_RIGHT;

/**
 * Display a list of connections with numbers and checkboxes
 */
function displayConnections(objDiv, conns, start, direction){

	if (direction != null) {
		connectionDirection = direction;
	}
	
	var lOL = new Element("ol", {'start':start, 'class':'conn-list-ol'});
	//lOL.start = start;
	for(var i=0; i< conns.length; i++){
	
		var iUL = new Element("li", {'id':conns[i].connection.connid, 'class':'conn-list-li'});
		lOL.insert(iUL);
		var cWrap = new Element("div", {'class':'conn-li-wrapper'});
		var liNo = new Element("div", {'class':'li-no'}).insert(start+i + ".");			
		var inChk = new Element("input",{'type':'checkbox','class':'conncheck','id':'conncheck'+conns[i].connection.connid});
		var blobDiv = new Element("div", {'class':'conn-blob'});
		var blobConn =  renderConnection(conns[i].connection,"conn-list"+i+start);
		blobDiv.insert(blobConn);
		cWrap.insert(liNo).insert(inChk).insert(blobDiv);
		cWrap.insert("<div style='clear:both'></div>");
		iUL.insert(cWrap);
	}
	objDiv.insert(lOL);
}


/**
 * Display a list of connections with no numbers and checkboxes
 */
function displayConnectionsPlain(objDiv,conns, start, direction){
	displayConnectionsPlainIncludeMenu(objDiv,conns, start, direction, true);
} 

/**
 * Display a list of connections with no numbers and checkboxes
 */
function displayConnectionsPlainIncludeMenu(objDiv,conns, start, direction, includemenu){

	if (direction != null) {
		connectionDirection = direction;
	}
	
	var lOL = new Element("ol", {'start':start, 'class':'conn-list-ol'});
	for(var i=0; i< conns.length; i++){
	
		var iUL = new Element("li", {'id':conns[i].connection.connid, 'class':'conn-list-li'});
		lOL.insert(iUL);
		var cWrap = new Element("div", {'class':'conn-li-wrapper'});
		var blobDiv = new Element("div", {'class':'conn-blob'});
		var blobConn =  renderConnection(conns[i].connection,"conn-list"+i+start, includemenu);
		blobDiv.insert(blobConn);
		cWrap.insert(blobDiv);
		cWrap.insert("<div style='clear:both'></div>");
		iUL.insert(cWrap);
	}
	objDiv.insert(lOL);
}

/**
 * 
 */
function renderConnection(connection,uniQ, includemenu){

	if (includemenu === undefined) {
		includemenu = true;
	}

	uniQ = connection.connid + uniQ;
	var connDiv = new Element("div",{'class': 'connection'});
	
	if (connectionDirection == CONNECTION_ARROWS_RIGHT) {
		var fromDiv = new Element("div",{'class': 'fromidea-horiz'});
		
		var fromNode = renderNode(connection.from[0].cnode,'conn-from-idea'+uniQ, connection.fromrole[0].role, includemenu);
		fromDiv.insert(fromNode).insert('<div style="clear:both;"></div>');
		connDiv.insert(fromDiv);
	} else {
		var toDiv = new Element("div",{'class': 'toidea-horiz'});
		var toNode = renderNode(connection.to[0].cnode,'conn-to-idea'+uniQ, connection.torole[0].role, includemenu);
	
		toDiv.insert(toNode).insert('<div style="clear:both;"></div>');
		connDiv.insert(toDiv);
	}
	
	var linktypelabelfull = connection.linktype[0].linktype.label;
	var linktypelabel = linktypelabelfull;
	if (linktypelabelfull.length > LINKTYPELABEL_CUTOFF) {
		linktypelabel = linktypelabelfull.substring(0,LINKTYPELABEL_CUTOFF)+"...";
	}
	
	var linkDiv = new Element("div",{'class': 'connlink-horiz-slim','id': 'connlink'+connection.connid});
	if (connectionDirection == CONNECTION_ARROWS_RIGHT) {
		linkDiv.setStyle('background-image: url("'+URL_ROOT +'images/connection/conn-'+connection.linktype[0].linktype.grouplabel.toLowerCase()+'-slim3.png")');
		var ltDiv = new Element("div",{'class': 'conn-link-text'});
	} else {
		linkDiv.setStyle('background-image: url("'+URL_ROOT +'images/connection/conn-'+connection.linktype[0].linktype.grouplabel.toLowerCase()+'-slim3-left.png")');
		var ltDiv = new Element("div",{'class': 'conn-link-text-left'});
	}
	
	//ltDiv.insert(new Element("div",{'style':'float:left;'}).insert(connection.linktype[0].linktype.label));
	
	linkDiv.insert(ltDiv);
	
	var ltWrap = new Element("div",{'class': 'link-type-wrapper'});
	ltDiv.insert(ltWrap);

	var hasDesc = false;
	if(connection.description && connection.description != ""){
		hasDesc = true;
		
		var descMenu = new Element("div",{'class':'link-type-tags'});
		ltWrap.insert(descMenu);
		
		var descimg = new Element('img', {'src':URL_ROOT+'images/desc.png','class':'drop-down-img'});
		Event.observe(descimg,'mouseover',function (){ showPopup('tddesc'+uniQ)});
		Event.observe(descimg,'mouseout',function (){ hidePopup('tddesc'+uniQ)});
		descMenu.insert(descimg);

		var tddescDiv = new Element("div", {"id":"tddesc"+uniQ,"class":"drop-down","style":"width:300px;padding:3px;margin-top:15px;"});
		Event.observe(tddescDiv,'mouseover',function (){ showPopup("tddesc"+uniQ)});
		Event.observe(tddescDiv,'mouseout',function (){ hidePopup("tddesc"+uniQ)});
		descMenu.insert(tddescDiv);
		
		var str = nl2br(connection.description);	
		var desc = "<span style='padding-bottom:3px;'>"+str+"</span>";
		tddescDiv.insert(desc);
	}
	
	var hasTags = false;
	if(connection.tags && connection.tags.length > 0){
		hasTags = true;
		var tltMenu = new Element("div",{'class':'link-type-tags'});
		ltWrap.insert(tltMenu);
		
		var tddImg = new Element('img', {'src':URL_ROOT+'images/tagdropdown-grey.png','class':'drop-down-img'});
		Event.observe(tddImg,'mouseover',function (){ showPopup('tdd'+uniQ)});
		Event.observe(tddImg,'mouseout',function (){ hidePopup('tdd'+uniQ)});
		tltMenu.insert(tddImg);

		var tddDiv = new Element("div", {"id":"tdd"+uniQ,"class":"drop-down","style":"margin-top:10px;"});
		Event.observe(tddDiv,'mouseover',function (){ showPopup("tdd"+uniQ)});
		Event.observe(tddDiv,'mouseout',function (){ hidePopup("tdd"+uniQ)});
		tltMenu.insert(tddDiv);
		
		var tddUL = new Element('ul',{'class':'dd-list'});
		
		for (var i=0 ; i< connection.tags.length; i++){
			var tddLI = new Element('li',{'class':'dd-li'});
			tddUL.insert(tddLI);
			var tddLIA = new Element('a',{'href':URL_ROOT+'tagsearch.php?q='+connection.tags[i].tag.name+'&scope=all&tagsonly=true'}).insert(connection.tags[i].tag.name);
			tddLI.insert(tddLIA);
			tddUL.insert(tddLI);
		}
		
		tddDiv.insert(tddUL);
	}
	
	var ltText = new Element("div",{'class':'link-type-text'}).insert(linktypelabel);
	if (linktypelabelfull.length > LINKTYPELABEL_CUTOFF) {
		ltText.title = linktypelabelfull;
	}
	ltWrap.insert(ltText);
	// set colour of ltText
	if (connection.linktype[0].linktype.grouplabel.toLowerCase() == "positive"){
		ltText.setStyle({"color":"#00BD53"});
	} else if (connection.linktype[0].linktype.grouplabel.toLowerCase() == "negative"){
		ltText.setStyle({"color":"#C10031"});
	} else if (connection.linktype[0].linktype.grouplabel.toLowerCase() == "neutral"){
		ltText.setStyle({"color":"#B2B2B2"});
	}

	//if user is logged in		
	var hasMenu = false;
	if(USER != "" && includemenu){
		hasMenu = true;
		var ltMenu = new Element("div",{'class':'link-type-menu'});
		ltWrap.insert(ltMenu);
		var ddImg = new Element('img', {'src':URL_ROOT+'images/dropdown-grey.png','class':'drop-down-img'});
		Event.observe(ddImg,'mouseover',function (){ showPopup('dd'+uniQ)});
		Event.observe(ddImg,'mouseout',function (){ hidePopup('dd'+uniQ)});
		ltMenu.insert(ddImg);

		var ddDiv = new Element("div", {"id":"dd"+uniQ,"class":"drop-down","style":"z-index:10;"});
		Event.observe(ddDiv,'mouseover',function (){ showPopup("dd"+uniQ)});
		Event.observe(ddDiv,'mouseout',function (){ hidePopup("dd"+uniQ)});
		ltMenu.insert(ddDiv);
		
		var ddUL = new Element('ul',{'class':'dd-list'});
		
		//var ddLI = new Element('li',{'class':'dd-li'}).insert('Copy');
		//Event.observe(ddLI,'click',function (){copyConnection(connection.connid)});
		//ddUL.insert(ddLI);
		
		//if connection owner
		if (USER == connection.userid){
			
			var ddLI = new Element('li',{'class':'dd-li'}).insert('Edit');
			Event.observe(ddLI,'click',function (){loadDialog("editconn",URL_ROOT+"plugin/ui/connection.php?connid="+connection.connid, 820, 720)});
			ddUL.insert(ddLI);
		
			var ddLI = new Element('li',{'class':'dd-li'}).insert('Delete');
			Event.observe(ddLI,'click',function (){deleteConnection(connection.connid)});
			ddUL.insert(ddLI);
		}
		
		var ddLI = new Element('li',{'class':'dd-li'}).insert('<nobr>Get Snippet</nobr>');
		Event.observe(ddLI,'click',function (){ showSnippet(SNIPPET_TRIPLE, connection.connid) });
		ddUL.insert(ddLI);

		// Not at present as we could not decide where this sould go
		// same reason snippet has no context button.
		//var ddLI = new Element('li',{'class':'dd-li'}).insert('Get URL');
		//Event.observe(ddLI,'click',function (){ showURL(SNIPPET_TRIPLE, connection.connid) } );
		//ddUL.insert(ddLI);
		
		ddDiv.insert(ddUL);
	}
	
	if (hasTags && hasMenu && hasDesc) {
		ltText.style.width="100px";
	} else if (hasTags && hasMenu && !hasDesc) {
		ltText.style.width="120px";
	} else if (!hasTags && !hasMenu && !hasDesc) {
		ltText.style.width="154px";
	} else if (hasTags && !hasMenu && !hasDesc) {
		ltText.style.width="134px";
	} else if (hasTags && !hasMenu && hasDesc) {
		ltText.style.width="114px";
	} else if (!hasTags && hasMenu && hasDesc) {
		ltText.style.width="120px";
	} else if (!hasTags && hasMenu && !hasDesc) {
		ltText.style.width="140px";
	}
	
	var iuDiv = new Element("div");
	iuDiv.style.marginLeft='60px';
	iuDiv.style.marginTop="3px";				
	
	// Add voting icons
	if (includemenu) {
		var votingDiv = new Element("div", {'style':'clear:both; float:left;margin-right: 5px;'});

		// vote for
		var voteforimg = document.createElement('img');
		voteforimg.setAttribute('src', URL_ROOT+'images/thumb-up-grey.png');
		voteforimg.setAttribute('alt', 'Votes For');
		voteforimg.setAttribute('id', connection.connid+'for');
		voteforimg.connid = connection.connid;
		voteforimg.vote='Y';
		voteforimg.style.verticalAlign="bottom";
		voteforimg.style.marginRight="5px";
		voteforimg.style.cssFloat = "left";
		votingDiv.insert(voteforimg);
		if(USER != ""){
			if (connection.uservote && connection.uservote == 'Y') {
				voteforimg.style.cursor = 'pointer';	   	
				Event.observe(voteforimg,'click',function (){ deleteConnectionVote(this) } );
				voteforimg.setAttribute('src', URL_ROOT+'images/thumb-up-filled.png');
				voteforimg.setAttribute('title', 'Un-promote this...');
			} else if (!connection.uservote || connection.uservote != 'Y') {
				voteforimg.style.cursor = 'pointer';	   	
				Event.observe(voteforimg,'click',function (){ connectionVote(this) } );
				voteforimg.setAttribute('src', URL_ROOT+'images/thumb-up-empty.png');
				voteforimg.setAttribute('title', 'Promote this: looks important...');
			}
			votingDiv.insert('<b><span id="'+connection.connid+'votefor">'+connection.positivevotes+'</span></b>');
		} else {
			voteforimg.setAttribute('title', 'Login to Promote this');
			votingDiv.insert('<b><span id="'+connection.connid+'votefor">'+connection.positivevotes+'</span></b>');
		}

		iuDiv.insert(votingDiv);

		var votingagainstDiv = new Element("div", {'style':'clear:both; float:left; margin-top: 3px'});

		// vote against
		var voteagainstimg = document.createElement('img');
		voteagainstimg.setAttribute('src', URL_ROOT+'images/thumb-down-grey.png');
		voteagainstimg.setAttribute('alt', 'Votes Against');
		voteagainstimg.setAttribute('id', connection.connid+'against');
		voteagainstimg.connid = connection.connid;
		voteagainstimg.vote='N';
		voteagainstimg.style.verticalAlign="bottom";
		voteagainstimg.style.marginRight="5px";
		voteagainstimg.style.cssFloat = "left";
		votingagainstDiv.insert(voteagainstimg);
		if(USER != ""){
			if (connection.uservote && connection.uservote == 'N') {
				voteagainstimg.style.cursor = 'pointer';	   	
				Event.observe(voteagainstimg,'click',function (){ deleteConnectionVote(this) } );
				voteagainstimg.setAttribute('src', URL_ROOT+'images/thumb-down-filled.png');
				voteagainstimg.setAttribute('title', 'Un-demote this...');
			} else if (!connection.uservote || connection.uservote != 'N' ) {
				voteagainstimg.style.cursor = 'pointer';	   	
				Event.observe(voteagainstimg,'click',function (){ connectionVote(this) } );
				voteagainstimg.setAttribute('src', URL_ROOT+'images/thumb-down-empty.png');
				voteagainstimg.setAttribute('title', 'Demote this: not so important...');
			}
			votingagainstDiv.insert('<b><span id="'+connection.connid+'voteagainst">'+connection.negativevotes+'</span></b>');
		} else {
			voteagainstimg.setAttribute('title', 'Login to Demote this');
			votingagainstDiv.insert('<b><span id="'+connection.connid+'voteagainst">'+connection.negativevotes+'</span></b>');
		}

		iuDiv.insert(votingagainstDiv);
	}

	var imagelink = new Element('a', {
		'href':URL_ROOT+"user.php?userid="+connection.users[0].user.userid,
		'title':connection.users[0].user.name});
	imagelink.target = "_blank";		
	var userimageThumb = new Element('img',{'title': connection.users[0].user.name, 'style':'padding-right:5px;','border':'0','src': connection.users[0].user.thumb});			
	imagelink.insert(userimageThumb);			
	iuDiv.insert(imagelink);

	linkDiv.insert(iuDiv);
	
	connDiv.insert(linkDiv);

	if (connectionDirection == CONNECTION_ARROWS_RIGHT) {
		var toDiv = new Element("div",{'class': 'toidea-horiz'});
		var toNode = renderNode(connection.to[0].cnode,'conn-to-idea'+uniQ, connection.torole[0].role, includemenu);
	
		toDiv.insert(toNode).insert('<div style="clear:both;"></div>');
		connDiv.insert(toDiv);
	} else {
		var fromDiv = new Element("div",{'class': 'fromidea-horiz'});
		
		var fromNode = renderNode(connection.from[0].cnode,'conn-from-idea'+uniQ, connection.fromrole[0].role, includemenu);
		fromDiv.insert(fromNode).insert('<div style="clear:both;"></div>');
		connDiv.insert(fromDiv);
	}
	return connDiv;
}

function connectionVote(obj) {
	var reqUrl = SERVICE_ROOT + "&method=connectionvote&vote="+obj.vote+"&connid="+obj.connid;
	new Ajax.Request(reqUrl, { method:'get',
		onSuccess: function(transport){
			var json = transport.responseText.evalJSON();
   			if(json.error) {
   				alert(json.error[0].message);
   				return;
   			} else {    
   				if (obj.vote == 'Y') {
					$(obj.connid+'votefor').innerHTML = json.connection[0].positivevotes;
					obj.setAttribute('src', URL_ROOT+'images/thumb-up-filled.png');
					obj.setAttribute('title', 'Un-promote this...');
					Event.stopObserving(obj, 'click');
					Event.observe(obj,'click', function (){ deleteConnectionVote(this) } );

					$(obj.connid+'voteagainst').innerHTML = json.connection[0].negativevotes;
					$(obj.connid+'against').setAttribute('src', URL_ROOT+'images/thumb-down-empty.png');
					$(obj.connid+'against').setAttribute('title', 'Demote this: not so important...');
					Event.stopObserving($(obj.connid+'against'), 'click');
					Event.observe($(obj.connid+'against'),'click', function (){ connectionVote(this) } );
				} else if (obj.vote == 'N') {
					$(obj.connid+'voteagainst').innerHTML = json.connection[0].negativevotes;
					obj.setAttribute('src', URL_ROOT+'images/thumb-down-filled.png');
					obj.setAttribute('title', 'Un-demote this...');
					Event.stopObserving(obj, 'click');
					Event.observe(obj,'click', function (){ deleteConnectionVote(this) } );

					$(obj.connid+'votefor').innerHTML = json.connection[0].positivevotes;
					$(obj.connid+'for').setAttribute('src', URL_ROOT+'images/thumb-up-empty.png');
					$(obj.connid+'for').setAttribute('title', 'Promote this: looks important...');
					Event.stopObserving($(obj.connid+'for'), 'click');
					Event.observe($(obj.connid+'for'),'click', function (){ connectionVote(this) } );
				}				
   			} 
   		}				      			     	   			
  	});
}

function deleteConnectionVote(obj) {
	var reqUrl = SERVICE_ROOT + "&method=deleteconnectionvote&vote="+obj.vote+"&connid="+obj.connid;
	new Ajax.Request(reqUrl, { method:'get',
		onSuccess: function(transport){
			var json = transport.responseText.evalJSON();
   			if(json.error) {
   				alert(json.error[0].message);
   				return;
   			} else {     			
   				if (obj.vote == 'Y') {
					$(obj.connid+'votefor').innerHTML = json.connection[0].positivevotes;
					obj.setAttribute('src', URL_ROOT+'images/thumb-up-empty.png');
					obj.setAttribute('title', 'Promote this: looks important...');
					Event.stopObserving(obj, 'click');
					Event.observe(obj,'click', function (){ connectionVote(this) } );

					$(obj.connid+'voteagainst').innerHTML = json.connection[0].negativevotes;
					$(obj.connid+'against').setAttribute('src', URL_ROOT+'images/thumb-down-empty.png');
					$(obj.connid+'against').setAttribute('title', 'Promote this: looks important...');
					Event.stopObserving($(obj.connid+'against'), 'click');
					Event.observe($(obj.connid+'against'),'click', function (){ connectionVote(this) } );
				} if (obj.vote == 'N') {
					$(obj.connid+'voteagainst').innerHTML = json.connection[0].negativevotes;
					obj.setAttribute('src', URL_ROOT+'images/thumb-down-empty.png');
					obj.setAttribute('title', 'Demote this: not so important...');
					Event.stopObserving(obj, 'click');
					Event.observe(obj,'click', function (){ connectionVote(this) } );
					
					$(obj.connid+'votefor').innerHTML = json.connection[0].positivevotes;
					$(obj.connid+'for').setAttribute('src', URL_ROOT+'images/thumb-up-empty.png');
					$(obj.connid+'for').setAttribute('title', 'Promote this: looks important...');
					Event.stopObserving($(obj.connid+'for'), 'click');
					Event.observe($(obj.connid+'for'),'click', function (){ connectionVote(this) } );
				}
   			} 
   		}				      			     	   			
  	});
}

/**
 *	select all the conn on the page
 */
function selectAllConns(event){
	var cs = $("tab-content-conn").select('[class="conncheck"]');
	cs.each(function(name, index) {
		cs[index].checked = true;
		}); 
}

/**
 *	deselect all the nodes on the page
 */
function selectNoConns(event){
	var cs = $("tab-content-conn").select('[class="conncheck"]');
	cs.each(function(name, index) {
		cs[index].checked = false;
		}); 
}

/**
 *	do an action on all the currently selected items
 */
function groupActionConnClick(event){
	var opt = $('conn-groupaction-select').options[$('conn-groupaction-select').selectedIndex].value;
	switch (opt){
		case "deleteallselectedconns":
			deleteAllSelectedConns();
			break;
		case "addselectedconnstomyworkspace":
			addSelectedConnsToWorkspace();
			break;
		case "addselectedconnstogroup":
			addSelectedConnsToGroup();
			break;
		case "removeselectedconnsfromgroup":
			removeSelectedConnsFromGroup();
			break;
		case "tagallselectedconns":
			tagAllSelectedConns();
			break;
		default:
			//do nothing
	}
}

/**
 *	do an action on all the currently selected items
 */
function groupActionConnChange(event){
	var opt = $('conn-groupaction-select').options[$('conn-groupaction-select').selectedIndex].value;

	switch (opt){
		case "deleteallselectedconns":
			$('conn-groupaction-select-group').hide();
			$('conn-addtagaction').hide();
			break;
		case "addselectedconnstomyworkspace":
			$('conn-groupaction-select-group').hide();
			$('conn-addtagaction').hide();
			break;
		case "addselectedconnstogroup":
			$('conn-addtagaction').hide();
			$('conn-groupaction-select-group').show();
			break;
		case "removeselectedconnsfromgroup":
			$('conn-addtagaction').hide();
			$('conn-groupaction-select-group').show();
			break;
		case "tagallselectedconns":
			$('conn-groupaction-select-group').hide();
			$('conn-addtagaction').show();
			break;
		default:
			$('conn-groupaction-select-group').hide();
			$('conn-addtagaction').hide();
	}
}



/**
 *	get all the selected connection ids
 */
function getSelectedConnIDs(){
	var retArr = new Array();
	var cs = $("tab-content-conn").select('[class="conncheck"]');
	cs.each(function(name, index) {
		if(cs[index].checked){
			retArr.push(cs[index].id.replace(/conncheck/,''));
		}
	});
	return retArr;
}

/**
 *	delete all the selected conn ids
 */
function deleteAllSelectedConns(){
	var toDel = getSelectedConnIDs();
	if(toDel.length == 0){
		alert("You must first select some connections.");
		return;
	}
	var ans = confirm("Are you sure you want to delete the selected connections?\n\n Note: this will only delete the connections that you own.");
	if (ans){
		// loop through and delete the selected nodes, ignoring any reply (in case user doesn't own)
		var reqUrl = SERVICE_ROOT + "&method=deleteconnections&connids=" + encodeURIComponent(toDel.join(","));
		new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  					//now refresh the page
					try {
				        //alert("now all deleted");
				        window.location.reload(true);
				    } catch(err) {
				        //do nothing   
				    }    	
    		}
  		});
	}
}

/**
 *	Tag all the selected conns
 */
function tagAllSelectedConns(){
	
	var selectedConns = getSelectedConnIDs();
	if(selectedConns.length == 0){
		alert("You must first select some connections.");
		return;
	}
	var tags = $('conn-addtagaction').value;
	if(tags == ""){
		alert("You must add at least one tag.");
		return;
	} else {
		//alert("tag:"+tags);
	}

	var reqUrl = SERVICE_ROOT + "&method=addtagstoconnections&connids=" + encodeURIComponent(selectedConns.join(","))+"&tags="+ encodeURIComponent(tags);
	new Ajax.Request(reqUrl, { method:'get',
		onSuccess: function(transport){
			//now refresh the page
			try {
		        window.location.reload(true);
		    } catch(err) {
		        //do nothing   
		    }    	
		},
		onError: function(error){
			//now refresh the page
			try {
		        window.location.reload(true);
		    } catch(err) {
		        //do nothing   
		    }    	
		}
	});
}

/**
 *	add selected nodes to current users workspace
 */
function addSelectedConnsToWorkspace(){
	alert("Not yet implemented");
	/*var toAdd = getSelectedNodeIDs();
	if(toAdd.length == 0){
		alert("You must first select some ideas.");
		return;
	}

	var reqUrl = SERVICE_ROOT + "&method=addnodesbyid&nodeids=" + encodeURIComponent(toAdd.join(","));
	new Ajax.Request(reqUrl, { method:'get',
 			onSuccess: function(transport){
 				//now refresh the page
				try {
			        //alert("now all deleted");
			        window.location.reload(true);
			    } catch(err) {
			        //do nothing   
			    }    	
   		}
 	});*/
}


/**
 *	add selected connections to a group
 */
function addSelectedConnsToGroup(){
	var toAdd = getSelectedConnIDs();
	if(toAdd.length == 0){
		alert("You must first select some connections.");
		return;
	}
	var groupid = $('conn-groupaction-select-group').options[$('conn-groupaction-select-group').selectedIndex].value;
	if(groupid == ""){
		alert("You must select a group.");
		return;
	}
	var reqUrl = SERVICE_ROOT + "&method=addgrouptoconnections&connids=" + encodeURIComponent(toAdd.join(",")) + "&groupid="+ encodeURIComponent(groupid);
	new Ajax.Request(reqUrl, { method:'get',
 			onSuccess: function(transport){
 				//now refresh the page
				try {
			        window.location.reload(true);
			    } catch(err) {
			        //do nothing   
			    }    	
   		}
 	});
}

/**
 *	remove selected nodes to a group
 */
function removeSelectedConnsFromGroup(){
	var toAdd = getSelectedConnIDs();
	if(toAdd.length == 0){
		alert("You must first select some connections.");
		return;
	}
	var groupid = $('conn-groupaction-select-group').options[$('conn-groupaction-select-group').selectedIndex].value;
	if(groupid == ""){
		alert("You must select a group.");
		return;
	}
	var reqUrl = SERVICE_ROOT + "&method=removegroupfromconnections&connids=" + encodeURIComponent(toAdd.join(",")) + "&groupid="+ encodeURIComponent(groupid);
	new Ajax.Request(reqUrl, { method:'get',
 			onSuccess: function(transport){
 				//now refresh the page
				try {
			        window.location.reload(true);
			    } catch(err) {
			        //do nothing   
			    }    	
   		}
 	});
}

/**
 * 
 */
function deleteConnection(connid){
	var ans = confirm("Are you sure you want to delete this connection?");
	if(ans){
		var reqUrl = SERVICE_ROOT + "&method=deleteconnection&connid=" + encodeURIComponent(connid);
		new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}      	
				//now refresh the page
				try {
			        window.location.reload(true);
			    } catch(err) {
			        //do nothing   
			    }
    		}
  		});
	}
}

/**
 * Open the connection dialog with the roles, linktype and idea text
 * already filled in from the data for connection with the given id.
 * Also check if the user has the roles and linktype already in thier list.
 * If not, create them first.
 * @param connid the id of the connections whose data to copy.
 */
/*function copyConnection(connid){

	var reqUrl = SERVICE_ROOT + "&method=copyconnection&connid=" + encodeURIComponent(connid);
	new Ajax.Request(reqUrl, { method:'get',
 			onSuccess: function(transport){
 				var json = transport.responseText.evalJSON();
     			if(json.error){
     				alert(json.error[0].message);
     				return;
     			}      	
				
				$fromrole = json.connection[0].fromrole[0].role.name;
				$torole = json.connection[0].torole[0].role.name;
				$linktype = json.connection[0].linktype[0].linktype.label;
				$fromidea = json.connection[0].from[0].cnode.name;
				$toidea = json.connection[0].to[0].cnode.name;
					
				loadDialog("copyconn",URL_ROOT+"plugin/ui/connection.php?role0="+$fromrole+"&role1="+$torole+"&linktype="+$linktype+"&idea0="+$fromidea+"&idea1="+$toidea, 790, 650);				
   		}
 		});
}*/

/**
 *	show an RSS feed of the connections
 */
function getConnectionsFeed(){
	var url = SERVICE_ROOT.replace('format=json','format=rss');
	var args = Object.clone(CONN_ARGS);
	args["start"] = 0;
	var reqUrl = url+"&method=getconnectionsby"+CONTEXT+"&"+Object.toQueryString(args);
	window.location.href = reqUrl;
}