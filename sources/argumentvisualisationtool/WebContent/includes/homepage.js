/********************************************************************************
 *                                                                              *
 *  (c) Copyright 2011 University of Leeds, UK                                  *
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
var HOMETABS = {"home":false,"debates":false, "node":false,"conn":false,"user":false};
var DEFAULTTAB = 'home';
var CURRENT_IDEA_CALL = '';
var CURRENT_CONN_CALL = '';

Event.observe(window, 'load', function() {
	// add events for clicking on the tabs
	Event.observe('tab-home','click', function (){setTabPushed('home');});
	Event.observe('tab-debates','click', function (){setTabPushed('debates');});
	Event.observe('tab-node','click', function (){setTabPushed('node');});
	Event.observe('tab-conn','click', function (){setTabPushed('conn');});
	Event.observe('tab-user','click', function (){setTabPushed('user');});

	setTabPushed(getAnchorVal(DEFAULTTAB));
});


function setTabPushed(tab) {
	for (i in HOMETABS){
		if(tab == i){
			$("tab-"+i).removeClassName("unselected");
			$("tab-"+i).addClassName("current");
			$("tab-content-"+i).show();
		} else {
			$("tab-"+i).removeClassName("current");
			$("tab-"+i).addClassName("unselected");
			$("tab-content-"+i).hide();
		} 
	}
	switch (tab){
		case 'home':
			if(!HOMETABS.home) {
				loadActiveConnectionUsersHome();
				//loadActiveIdeaUsersHome();
				loadMostConnectedIdea();
				loadMostRecentConnection();
				HOMETABS.home = true;
			}
			break;
		case 'welcome':
			break;
		case 'debates':
			if(!HOMETABS.debates){
				loadAllDebates();
				HOMETABS.debates = true;
			}
			break;
		case 'node':
			if(!HOMETABS.node){
				loadAllConnectedIdeas();
				HOMETABS.node = true;
			}
			break;
		case 'conn':
			if(!HOMETABS.conn){
				loadAllRecentConnections();
				HOMETABS.conn = true;
			}
			break;
		case 'user':
			if(!HOMETABS.user){
				loadActiveUsers();
				HOMETABS.user = true;
			}
			break;
	
	}
}

/*** HOME PAGE FUNCTIONS ***/

function loadMostConnectedIdea(){
	var content = $('tab-content-home-idea');
	CURRENT_IDEA_CALL = "&method=getmostconnectednodes&scope=all&max=1";
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			var nodes = json.nodeset[0].nodes;
      			if(nodes.length > 0){
					for(var i=0; i< nodes.length; i++){
						if(nodes[i].cnode){
							var blobNode = renderNode(nodes[i].cnode,'idea-list'+i);
							content.insert(blobNode);
						}
					}
      			}
      		}
      	});     	
}

function loadMostRecentConnection(){
	var content = $('tab-content-home-conn');
	CURRENT_CONN_CALL = "&method=getrecentconnections&max=1";
	var reqUrl = SERVICE_ROOT + CURRENT_CONN_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			
      			var conns = json.connectionset[0].connections;
      			if(conns.length > 0){
					for(var i=0; i< conns.length; i++){
						var blobConn =  renderConnection(conns[i].connection,"conn-list"+i);
						content.insert(blobConn);
					}
					content.insert(lOL);
      			}
      		}
      	}); 
}

function loadActiveConnectionUsersHome(){
	var content = $('tab-content-home-users');
	var reqUrl = SERVICE_ROOT + "&method=getactiveconnectionusers&max=8";
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			var users = json.userset[0].users;
      			if(users.length > 0){
					var lOL = new Element("ol", {'class':'user-list-ol'});
					lOL.style.margin="0px";
					for(var i=0; i< users.length; i++){
						if(users[i].user){
							var iUL = new Element("li", {'id':users[i].user.userid, 'class':'user-list-li'});
							iUL.style.clear = "both";
							//iUL.style.margin="5px";
							//iUL.style.borderBottom = "none";
							iUL.style.height="36px";
							lOL.insert(iUL);	
							
							var user = users[i].user;

							if(user.isgroup == 'Y'){
								iUL.insert("<a style='float:left; padding-right: 3px;' href='group.php?groupid="+ user.userid +"'><img src='"+user.thumb+"' border='0' /></a>");
							} else {
								iUL.insert("<a style='float:left; padding-right: 3px;' href='user.php?userid="+ user.userid +"'><img src='"+user.thumb+"' border='0' /></a>")
							}

							if(user.isgroup == 'Y'){
								iUL.insert("<b style='float:left;'><a href='group.php?groupid="+ user.userid +"'>" + user.name + "</a></b>");
							} else { 
								iUL.insert("<b style='float:left;'><a href='user.php?userid="+ user.userid +"'>" + user.name + "</a></b>");		
							}
							iUL.insert("<br><span style='clear:top; font-size: 80%'>Connection count: "+user.connectioncount+"</span>");
						}
					}
					content.insert(lOL);
      			}
      		}
      	});   
}

function loadActiveIdeaUsersHome(){
	var content = $('tab-content-home-users-ideas');
	var reqUrl = SERVICE_ROOT + "&method=getactiveideausers&max=3";
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			var users = json.userset[0].users;
      			if(users.length > 0){
					var lOL = new Element("ol", {'class':'user-list-ol'});
					lOL.style.margin="0px";
					for(var i=0; i< users.length; i++){
						if(users[i].user){
							var iUL = new Element("li", {'id':users[i].user.userid, 'class':'user-list-li'});
							iUL.style.clear = "both";
							iUL.style.margin="0px";
							//iUL.style.borderBottom = "none";
							iUL.style.height="36px";
							lOL.insert(iUL);	
							
							var user = users[i].user;

							if(user.isgroup == 'Y'){
								iUL.insert("<a style='float:left; padding-right: 3px;' href='group.php?groupid="+ user.userid +"'><img src='"+user.thumb+"' border='0' /></a>");
							} else {
								iUL.insert("<a style='float:left; padding-right: 3px;' href='user.php?userid="+ user.userid +"'><img src='"+user.thumb+"' border='0' /></a>")
							}

							if(user.isgroup == 'Y'){
								iUL.insert("<b style='float:left;'><a href='group.php?groupid="+ user.userid +"'>" + user.name + "</a></b>");
							} else { 
								iUL.insert("<b style='float:left;'><a href='user.php?userid="+ user.userid +"'>" + user.name + "</a></b>");		
							}
							iUL.insert("<br><span style='clear:top; font-size: 80%'>Idea count: "+user.ideacount+"</span>");
						}
					}
					content.insert(lOL);
      			}
      		}
      	});   
}

/************************************************************************/

function loadAllRecentIdeas(){
	var content = $('tab-content-node');
	content.update(getLoading("(Loading ideas...)"));
	CURRENT_IDEA_CALL = "&method=getrecentnodes&scope=all";
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			nodeTabHeader(content,"allR");
      			var nodes = json.nodeset[0].nodes;
      			if(nodes.length > 0){
	      			content.insert('<div style="clear:both;"></div>');
					var lOL = new Element("ol", {'class':'idea-list-ol'});
					for(var i=0; i< nodes.length; i++){
						if(nodes[i].cnode){
							var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li'});
							lOL.insert(iUL);
							var nWrap = new Element("div", {'class':'idea-li-wrapper'});			
							var blobDiv = new Element("div", {'class':'idea-blob'});
							var blobNode = renderNode(nodes[i].cnode,'idea-list'+i);
							blobDiv.insert(blobNode);
							nWrap.insert(blobDiv);
							iUL.insert(nWrap);
						}
					}
					content.insert(lOL);
      			}
      		}
      	}); 
}

function loadAllPopularIdeas(){
	var content = $('tab-content-node');
	content.update(getLoading("(Loading ideas...)"));
	CURRENT_IDEA_CALL = "&method=getpopularnodes&scope=all";
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			nodeTabHeader(content,"allP");
      			var nodes = json.nodeset[0].nodes;
      			if(nodes.length > 0){
	      			content.insert('<div style="clear:both;"></div>');
					var lOL = new Element("ol", {'class':'idea-list-ol'});
					for(var i=0; i< nodes.length; i++){
						if(nodes[i].cnode){
							var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li'});
							lOL.insert(iUL);
							var nWrap = new Element("div", {'class':'idea-li-wrapper'});			
							var blobDiv = new Element("div", {'class':'idea-blob'});
							var blobNode = renderNode(nodes[i].cnode,'idea-list'+i);
							blobDiv.insert(blobNode);
							nWrap.insert(blobDiv);
							iUL.insert(nWrap);
						}
					}
					content.insert(lOL);
      			}
      		}
      	});
}

function loadAllConnectedIdeas(){
	var content = $('tab-content-node');
	content.update(getLoading("(Loading ideas...)"));
	CURRENT_IDEA_CALL = "&method=getmostconnectednodes&scope=all";
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			nodeTabHeader(content,"allC");
      			var nodes = json.nodeset[0].nodes;
      			if(nodes.length > 0){
	      			content.insert('<div style="clear:both;"></div>');
					var lOL = new Element("ol", {'class':'idea-list-ol'});
					for(var i=0; i< nodes.length; i++){
						if(nodes[i].cnode){
							var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li'});
							lOL.insert(iUL);
							var nWrap = new Element("div", {'class':'idea-li-wrapper'});			
							var blobDiv = new Element("div", {'class':'idea-blob'});
							var blobNode = renderNode(nodes[i].cnode,'idea-list'+i);
							blobDiv.insert(blobNode);
							nWrap.insert(blobDiv);
							iUL.insert(nWrap);
						}
					}
					content.insert(lOL);
      			}
      		}
      	});     	
}

function loadMyRecentIdeas(){
	var content = $('tab-content-node');
	content.update(getLoading("(Loading ideas...)"));
	CURRENT_IDEA_CALL = "&method=getrecentnodes&scope=my";
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			nodeTabHeader(content,"myR");
      			var nodes = json.nodeset[0].nodes;
      			if(nodes.length > 0){
	      			content.insert('<div style="clear:both;"></div>');
					var lOL = new Element("ol", {'class':'idea-list-ol'});
					for(var i=0; i< nodes.length; i++){
						if(nodes[i].cnode){
							var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li'});
							lOL.insert(iUL);
							var nWrap = new Element("div", {'class':'idea-li-wrapper'});			
							var blobDiv = new Element("div", {'class':'idea-blob'});
							var blobNode = renderNode(nodes[i].cnode,'idea-list'+i);
							blobDiv.insert(blobNode);
							nWrap.insert(blobDiv);
							iUL.insert(nWrap);
						}
					}
					content.insert(lOL);
      			}
      		}
      	});
}

function loadMyPopularIdeas(){
	var content = $('tab-content-node');
	content.update(getLoading("(Loading ideas...)"));
	CURRENT_IDEA_CALL = "&method=getpopularnodes&scope=my";
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			nodeTabHeader(content,"myP");
      			var nodes = json.nodeset[0].nodes;
      			if(nodes.length > 0){
	      			content.insert('<div style="clear:both;"></div>');
					var lOL = new Element("ol", {'class':'idea-list-ol'});
					for(var i=0; i< nodes.length; i++){
						if(nodes[i].cnode){
							var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li'});
							lOL.insert(iUL);
							var nWrap = new Element("div", {'class':'idea-li-wrapper'});			
							var blobDiv = new Element("div", {'class':'idea-blob'});
							var blobNode = renderNode(nodes[i].cnode,'idea-list'+i);
							blobDiv.insert(blobNode);
							nWrap.insert(blobDiv);
							iUL.insert(nWrap);
						}
					}
					content.insert(lOL);
      			}
      		}
      	});   
}

function loadMyConnectedIdeas(){
	var content = $('tab-content-node');
	content.update(getLoading("(Loading ideas...)"));
	CURRENT_IDEA_CALL = "&method=getmostconnectednodes&scope=my";
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			nodeTabHeader(content,"myC");
      			var nodes = json.nodeset[0].nodes;
      			if(nodes.length > 0){
	      			content.insert('<div style="clear:both;"></div>');
					var lOL = new Element("ol", {'class':'idea-list-ol'});
					for(var i=0; i< nodes.length; i++){
						if(nodes[i].cnode){
							var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li'});
							lOL.insert(iUL);
							var nWrap = new Element("div", {'class':'idea-li-wrapper'});			
							var blobDiv = new Element("div", {'class':'idea-blob'});
							var blobNode = renderNode(nodes[i].cnode,'idea-list'+i);
							blobDiv.insert(blobNode);
							nWrap.insert(blobDiv);
							iUL.insert(nWrap);
						}
					}
					content.insert(lOL);
      			}
      		}
      	});   
}

function nodeTabHeader(objDiv,current){
	var head = new Element("div",{'id':'nodehead'});

	var tb = new Element("div", {'class':'toolbarrow'});
	head.update(tb);
	tb.insert(displayNodeAdd());

	if (USER != null && USER != "") {
			head.insert("...or <a href='"+URL_ROOT+"import/index.php'>Import data</a>");
	}

	var allUL = new Element("ul",{'class':'home-node-head-list'});
	allUL.insert(new Element("li",{'class':'home-node-head-item'}).insert("<span style='width:30px;'>All:</span>"));

	var allR = new Element("li",{'class':'home-node-head-item'}).insert("Recent");
	allUL.insert(allR);
	if(current == "allR"){
		allR.addClassName("current");
	} else {
		allR.addClassName("option");
		Event.observe(allR,'click',loadAllRecentIdeas);
	}
	
	var allP = new Element("li",{'class':'home-node-head-item'}).insert("Popular");
	allUL.insert(allP);
	if(current == "allP"){
		allP.addClassName("current");
	} else {
		allP.addClassName("option");
		Event.observe(allP,'click',loadAllPopularIdeas);
	}
	
	var allC = new Element("li",{'class':'home-node-head-item'}).insert("Connected");
	allUL.insert(allC);
	if(current == "allC"){
		allC.addClassName("current");
	} else {
		allC.addClassName("option");
		Event.observe(allC,'click',loadAllConnectedIdeas);
	}
	
	var feed = new Element("img", 
		{'src': URL_ROOT+'images/toolbars/feed-icon-20x20.png',
		'alt': 'Get an RSS feed for these ideas',
		'title': 'Get an RSS feed for these ideas',
		'class': 'active',
		'style': 'padding-top:5px;'});
	var f = new Element("li",{'class':'home-node-head-item'}).insert(feed);
	allUL.insert(f);
	f.addClassName("option");
	Event.observe(feed,'click',getHomepageNodeFeed);
	
	objDiv.insert(head.insert(allUL));
	
	// only if user logged in
	if(USER != ""){
		var myUL = new Element("ul",{'class':'home-node-head-list'});
		myUL.insert(new Element("li",{'class':'home-node-head-item'}).insert("<span style='width:30px;'>My:</span>"));
	
		var myR = new Element("li",{'class':'home-node-head-item'}).insert("Recent");
		myUL.insert(myR);
		if(current == "myR"){
			myR.addClassName("current");
		} else {
			myR.addClassName("option");
			Event.observe(myR,'click',loadMyRecentIdeas);
		}
		
		var myP = new Element("li",{'class':'home-node-head-item'}).insert("Popular");
		myUL.insert(myP);
		if(current == "myP"){
			myP.addClassName("current");
		} else {
			myP.addClassName("option");
			Event.observe(myP,'click',loadMyPopularIdeas);
		}
		
		var myC = new Element("li",{'class':'home-node-head-item'}).insert("Connected");
		myUL.insert(myC);
		if(current == "myC"){
			myC.addClassName("current");
		} else {
			myC.addClassName("option");
			Event.observe(myC,'click',loadMyConnectedIdeas);
		}
		
		objDiv.insert(head.insert(myUL));
	}
}


function loadAllRecentConnections(){
	var content = $('tab-content-conn');
	content.update(getLoading("(Loading connections...)"));
	CURRENT_CONN_CALL = "&method=getrecentconnections";
	var reqUrl = SERVICE_ROOT + CURRENT_CONN_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			
      			var header = new Element("p");

	var tb = new Element("div", {'class':'toolbarrow'});
	header.update(tb);
	tb.insert(displayConnectionAdd());

	if (USER != null && USER != "") {
			header.insert("...or <a href='"+URL_ROOT+"import/index.php'>Import data</a><br/>");
	}

      			header.insert("<b>Recent connections:</b>");
      			var feed = new Element("img", 
					{'src': URL_ROOT+'images/toolbars/feed-icon-20x20.png',
					'alt': 'Get an RSS feed for these connections',
					'title': 'Get an RSS feed for these connections',
					'class': 'active',
					'style': 'padding-left:5px;'});
				
				header.insert(feed);
				Event.observe(feed,'click',getHomepageConnFeed);
				content.update(header);
				
      			var conns = json.connectionset[0].connections;
      			if(conns.length > 0){
      				var lOL = new Element("ol", { 'class':'conn-list-ol'});
	      			content.insert('<div style="clear:both;"></div>');
					for(var i=0; i< conns.length; i++){
						var iUL = new Element("li", {'id':conns[i].connection.connid, 'class':'conn-list-li'});
						lOL.insert(iUL);
						var cWrap = new Element("div", {'class':'conn-li-wrapper'});			
						var blobDiv = new Element("div", {'class':'conn-blob'});
						var blobConn =  renderConnection(conns[i].connection,"conn-list"+i);
						blobDiv.insert(blobConn);
						cWrap.insert(blobDiv);
						cWrap.insert("<div style='clear:both'></div>");
						iUL.insert(cWrap);
					}
					content.insert(lOL);
      			}
      		}
      	}); 
}


function loadActiveUsers(){
	var content = $('tab-content-user');
	content.update(getLoading("(Loading people &amp; groups...)"));

	var tb = new Element("div", {'class':'toolbarrow'});
	content.update(tb);
	tb.insert(displayGroupAdd());

	var reqUrl = SERVICE_ROOT + "&method=getactiveconnectionusers";
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.insert("<p><b>Most publicly Active Connection Builders:</b></p>");
      			var users = json.userset[0].users;
      			if(users.length > 0){
	      			content.insert('<div style="clear:both;"></div>');
					var lOL = new Element("ol", {'class':'user-list-ol'});
					for(var i=0; i< users.length; i++){
						if(users[i].user){
							var iUL = new Element("li", {'id':users[i].user.userid, 'class':'user-list-li'});
							lOL.insert(iUL);			
							var blobDiv = new Element("div", {'class':'user-blob'});
							var blobUser = renderUser(users[i].user);
							blobDiv.insert(blobUser);
							iUL.insert(blobDiv);
						}
					}
					content.insert(lOL);
      			}
      		}
      	});   
}

/**
 *	show an RSS feed of the ideas
 */
function getHomepageNodeFeed(){
	var url = SERVICE_ROOT.replace('format=json','format=rss');
	var reqUrl = url + CURRENT_IDEA_CALL;
	window.location.href = reqUrl;
}

/**
 *	show an RSS feed of the connections
 */
function getHomepageConnFeed(){
	var url = SERVICE_ROOT.replace('format=json','format=rss');
	var reqUrl = url + CURRENT_CONN_CALL;
	window.location.href = reqUrl;
}

/**
	* Load all the Debates in the system
	*/
function loadAllDebates(){
	var content = $('tab-content-debates');
	content.update(getLoading("(Loading debates...)"));
	CURRENT_IDEA_CALL = "&method=getdebates&scope=all";
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}
      			content.update("");
      			nodeTabHeader(content,"allC");
      			var nodes = json.nodeset[0].nodes;
      			if(nodes.length > 0){
	      			content.insert('<div style="clear:both;"></div>');
					var lOL = new Element("ol", {'class':'idea-list-ol'});
					for(var i=0; i< nodes.length; i++){
						if(nodes[i].cnode){
							var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li'});
							lOL.insert(iUL);
							var nWrap = new Element("div", {'class':'idea-li-wrapper'});
							var blobDiv = new Element("div", {'class':'idea-blob'});
							var blobNode = renderDebateAsNode(nodes[i].cnode,'idea-list'+i);
							blobDiv.insert(blobNode);
							nWrap.insert(blobDiv);
							iUL.insert(nWrap);
						}
					}
					content.insert(lOL);
      			}
      		}
      	});
}

/** Following copied from tabber.js. Really should just be in one
	*	place but for will take the easy road
	*/
/**
 * Add the button to open the add an idea dialog
 */
function displayNodeAdd(){
	var a = new Element("span",{'id':'add-node','class':'add'});
	if (USER != null && USER != "") {
		a.insert("<a href=\"javascript:loadDialog('createidea','"+URL_ROOT+"plugin/ui/idea.php');\"title='Add Idea'><img alt='Add Idea' src='"+URL_ROOT+"images/toolbars/plus.png' class='toolbar'/>Add Idea</a>");
	}
	return a;
}

/**
 * Add the button to open the add a website dialog
 */
function displayWebsiteAdd(){
	var a = new Element("span",{'id':'add-conn','class':'add'});
	if (USER != null && USER != "") {
		a.insert("<a href=\"javascript:loadDialog('createurl','"+URL_ROOT+"plugin/ui/url.php');\" title='Add Website'><img alt='Add Website' src='"+URL_ROOT+"images/toolbars/plus.png' class='toolbar'/></a>");
	}
	return a;
}

/**
 * Add the button to open the add a connection dialog
 */
function displayConnectionAdd(){
	var a = new Element("span",{'id':'add-conn','class':'add'});
	if (USER != null && USER != "") {
		a.insert("<a href=\"javascript:loadDialog('createconn','"+URL_ROOT+"plugin/ui/connection.php',790,650);\" title='Add Connection'><img alt='Add Connection' src='"+URL_ROOT+"images/toolbars/plus.png' class='toolbar'/>Add Connection</a>");
	}
	return a;
}

/**
 * Add the button to open the add a group dialog
 */
function displayGroupAdd(){
	var a = new Element("span",{'id':'add-conn','class':'add'});
	if (USER != null && USER != "") {
		a.insert("<a href=\"javascript:loadDialog('creategroup','"+URL_ROOT+"plugin/ui/addgroup.php');\" title='Add Group'><img alt='Add Group' src='"+URL_ROOT+"images/toolbars/plus.png' class='toolbar'/>Add Group</a>");
	}
	return a;
}