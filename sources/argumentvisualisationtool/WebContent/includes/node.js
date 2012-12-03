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
 * Javascript functions for nodes
 */
 
/**
 * Render a list of nodes
 */
function displayNodes(objDiv,nodes,start){
	objDiv.insert('<div style="clear:both; margin: 0px; padding: 0px;"></div>');
	var lOL = new Element("ol", {'start':start, 'class':'idea-list-ol'});
	for(var i=0; i< nodes.length; i++){
		if(nodes[i].cnode){
			var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li'});
			lOL.insert(iUL);
			var nWrap = new Element("div", {'class':'idea-li-wrapper'});
			var liNo = new Element("div", {'class':'li-no'}).insert(start+i + ".");			
			var inChk = new Element("input",{'type':'checkbox','class':'nodecheck','id':'nodecheck'+nodes[i].cnode.nodeid});
			var blobDiv = new Element("div", {'class':'idea-blob'});
			var blobNode = renderNode(nodes[i].cnode,'idea-list'+i+start);
			blobDiv.insert(blobNode);
			nWrap.insert(liNo).insert(inChk).insert(blobDiv);
			iUL.insert(nWrap);
		}
	}
	objDiv.insert(lOL);
}

/**
 * Render a list of nodes
 */
function displayReportNodes(objDiv,nodes,start){
	objDiv.insert('<div style="clear:both; margin: 0px; padding: 0px;"></div>');
	var lOL = new Element("ol", {'start':start, 'class':'idea-list-ol', 'style':'list-style-type:none; height: 700px;'});
	for(var i=0; i< nodes.length; i++){
		if(nodes[i].cnode){
			var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li', 'style':'padding-bottom: 5px;'});
			lOL.insert(iUL);
			var blobDiv = new Element("div", {'style':'margin: 2px; width: 650px'});			
			var blobNode = renderReportNode(nodes[i].cnode,'idea-list'+i+start, nodes[i].cnode.role[0].role);
			blobDiv.insert(blobNode);
			iUL.insert(blobDiv);
		}
	}
	objDiv.insert(lOL);
}


/**
 * Delete the selected node
 */
function deleteNode(nodeid, nname){
	var ans = confirm("Are you sure you want to delete the idea '"+nname+"'?");
	if(ans){
		var reqUrl = SERVICE_ROOT + "&method=deletenode&nodeid=" + encodeURIComponent(nodeid);
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


function tweetNode(obj) {
	if(obj.private == 'N'){
		var reqUrl = SERVICE_ROOT + "&method=tweetuseridea&nodeid="+obj.nodeid;
		new Ajax.Request(reqUrl, { method:'get',
			onSuccess: function(transport){
				var json = transport.responseText.evalJSON();
	   			if(json.error) {
	   				alert(json.error[0].message);
	   				return;
	   			} else {  
	   				fadeMessage("Idea tweeted: for<br><br>"+obj.name); 				
	   			} 
	   		}				      			     	   			
	  	});
	}
}

function nodeVote(obj) {
	var reqUrl = SERVICE_ROOT + "&method=nodevote&vote="+obj.vote+"&nodeid="+obj.nodeid;
	new Ajax.Request(reqUrl, { method:'get',
		onSuccess: function(transport){
			var json = transport.responseText.evalJSON();
   			if(json.error) {
   				alert(json.error[0].message);
   				return;
   			} else {     			
   				if (obj.vote == 'Y') {
   				
  					$$("#nodevotefor"+obj.nodeid).each(function(elmt) { elmt.innerHTML = json.cnode[0].positivevotes; });
 
   					$$("#nodefor"+obj.nodeid).each(function(elmt) { 
   						elmt.setAttribute('src', URL_ROOT+'images/thumb-up-filled.png'); 
   						elmt.setAttribute('title', 'Un-promote this...');
   						Event.stopObserving(elmt, 'click');
   						Event.observe(elmt,'click', function (){deleteNodeVote(this);});
   					});
					
  					$$("#nodevoteagainst"+obj.nodeid).each(function(elmt) { elmt.innerHTML = json.cnode[0].negativevotes; });
  					
  					$$("#nodeagainst"+obj.nodeid).each(function(elmt) { 
  						elmt.setAttribute('src', URL_ROOT+'images/thumb-down-empty.png'); 
  						elmt.setAttribute('title', 'Demote this: not so important...');
  						Event.stopObserving(elmt, 'click');
  						Event.observe(elmt,'click', function (){nodeVote(this) } );
  					});					
				} else if (obj.vote == 'N') {
					$$("#nodevoteagainst"+obj.nodeid).each(function(elmt) { elmt.innerHTML = json.cnode[0].negativevotes; });

   					$$("#nodeagainst"+obj.nodeid).each(function(elmt) { 
   						elmt.setAttribute('src', URL_ROOT+'images/thumb-down-filled.png'); 
   						elmt.setAttribute('title', 'Un-demote this...');
   						Event.stopObserving(elmt, 'click');
   						Event.observe(elmt,'click', function (){deleteNodeVote(this) } );
   					});
					
  					$$("#nodevotefor"+obj.nodeid).each(function(elmt) { elmt.innerHTML = json.cnode[0].positivevotes; });
  					
  					$$("#nodefor"+obj.nodeid).each(function(elmt) { 
  						elmt.setAttribute('src', URL_ROOT+'images/thumb-up-empty.png'); 
  						elmt.setAttribute('title', 'Promote this: looks important...');
  						Event.stopObserving(elmt, 'click');
  						Event.observe(elmt,'click', function (){nodeVote(this) } ); 
  					});
				}	
   			} 
   		}				      			     	   			
  	});
}

function deleteNodeVote(obj) {
	var reqUrl = SERVICE_ROOT + "&method=deletenodevote&vote="+obj.vote+"&nodeid="+obj.nodeid;
	new Ajax.Request(reqUrl, { method:'get',
		onSuccess: function(transport){
			var json = transport.responseText.evalJSON();
   			if(json.error) {
   				alert(json.error[0].message);
   				return;
   			} else {     	
   				if (obj.vote == 'Y') {

  					$$("#nodevotefor"+obj.nodeid).each(function(elmt) { elmt.innerHTML = json.cnode[0].positivevotes; });
 
   					$$("#nodefor"+obj.nodeid).each(function(elmt) { 
   						elmt.setAttribute('src', URL_ROOT+'images/thumb-up-empty.png'); 
   						elmt.setAttribute('title', 'Promote this: looks important...');
   						Event.stopObserving(elmt, 'click');
   						Event.observe(elmt,'click', function (){nodeVote(this);});
   					});
					
  					$$("#nodevoteagainst"+obj.nodeid).each(function(elmt) { elmt.innerHTML = json.cnode[0].negativevotes; });
  					
  					$$("#nodeagainst"+obj.nodeid).each(function(elmt) { 
  						elmt.setAttribute('src', URL_ROOT+'images/thumb-down-empty.png'); 
  						elmt.setAttribute('title', 'Demote this: not so important...');
  						Event.stopObserving(elmt, 'click');
  						Event.observe(elmt,'click', function (){nodeVote(this) } );
  					});					

					$(obj.nodeid+obj.uniqueid+'nodeagainst').setAttribute('src', URL_ROOT+'images/thumb-down-empty.png');
					$(obj.nodeid+obj.uniqueid+'nodeagainst').setAttribute('title', 'Demote this: not so important...');
					Event.stopObserving($(obj.nodeid+obj.uniqueid+'nodeagainst'), 'click');
					Event.observe($(obj.nodeid+obj.uniqueid+'nodeagainst'),'click', function (){ connectionVote(this) } );
					
				} if (obj.vote == 'N') {
					$$("#nodevoteagainst"+obj.nodeid).each(function(elmt) { elmt.innerHTML = json.cnode[0].negativevotes; });

   					$$("#nodeagainst"+obj.nodeid).each(function(elmt) { 
   						elmt.setAttribute('src', URL_ROOT+'images/thumb-down-empty.png'); 
   						elmt.setAttribute('title', 'Demote this: not so important...');
   						Event.stopObserving(elmt, 'click');
   						Event.observe(elmt,'click', function (){nodeVote(this) } );
   					});
					
  					$$("#nodevotefor"+obj.nodeid).each(function(elmt) { elmt.innerHTML = json.cnode[0].positivevotes; });
  					
  					$$("#nodefor"+obj.nodeid).each(function(elmt) { 
  						elmt.setAttribute('src', URL_ROOT+'images/thumb-up-empty.png'); 
  						elmt.setAttribute('title', 'Promote this: looks important...');
  						Event.stopObserving(elmt, 'click');
  						Event.observe(elmt,'click', function (){nodeVote(this) } ); 
  					});
				}
   			} 
   		}				      			     	   			
  	});
}

function bookmark(obj) {
	// add idea to the users cache
	//var obj = this;
	var reqUrl = SERVICE_ROOT + "&method=addtousercache&idea="+obj.nodeid;
	new Ajax.Request(reqUrl, { method:'get',
		onSuccess: function(transport){
			var json = transport.responseText.evalJSON();
   			if(json.error) {
   				alert(json.error[0].message);
   				return;
   			} else {  
				obj.setAttribute('src', URL_ROOT+'jetpack/ui/images/favorites.png');
				obj.setAttribute('title', 'Unbookmark this idea');
				Event.stopObserving(obj, 'click');
				Event.observe(obj,'click', function (){ unbookmark(this) } );

   			} 
   		}				      			     	   			
  	});
}

function unbookmark(obj) {
	// add idea to the users cache
	//var obj = this;
	if (window.confirm("Are you sure you want unbookmark the idea:\n\n'"+obj.label+"' ?\n")) {	
		var reqUrl = SERVICE_ROOT + "&method=deletefromusercache&idea="+obj.nodeid;
		new Ajax.Request(reqUrl, { method:'get',
			onSuccess: function(transport){
				var json = transport.responseText.evalJSON();
	   			if(json.error) {
	   				alert(json.error[0].message);
	   				return;
	   			} else {
	   				json.node.
					obj.setAttribute('src', URL_ROOT+'jetpack/ui/images/favorites-empty.png');
					obj.setAttribute('title', 'Bookmark this idea');
					Event.stopObserving(obj, 'click');
					Event.observe(obj,'click', function (){ bookmark(this) } );
					
	   			} 
	   		}				      			     	   			
	  	});
	  }
 }


/**
 * Send a spam alert to the server.
 */
function reportNodeSpamAlert(obj, node) {	
	var ans = confirm("Are you sure you want to report \n\n"+obj.label+"\n\nas Spam / Inappropriate?\n\n");
	if (ans){			
		var reqUrl = URL_ROOT + "spamalert.php?type=idea&id="+obj.id;
		new Ajax.Request(reqUrl, { method:'get',
			onError: function(error) {
		   		alert(error);
			},
			onSuccess: function(transport){
				obj.setAttribute('alt', 'This has been reported as Spam / Inappropriate content');
				obj.setAttribute('title', 'This has been reported as Spam / Inappropriate content');
				obj.setAttribute('src', URL_ROOT+'images/spam-reported.png');
				obj.style.cursor = 'auto';	   	
				$(obj).unbind("click");	    				
				node.status = 1;
			}
		});
	}
}

/**
 * Open the Netowrk search dialog with the given node as the focal node.
 */
function showNetworkSearchDialog(node) {
	loadDialog('structuredsearch', URL_ROOT+"plugin/ui/structuredsearch.php?focalnodeid="+encodeURIComponent(node.nodeid), 840, 760);
}


/**
 * Open the Netowrk search dialog with the given node as the focal node.
 */
function showNetworkSearchDialogNew(node) {
	window.name="coheremain";
	loadDialog('structuredsearch', URL_ROOT+"plugin/ui/structuredsearchNew.php?focalnodeid="+encodeURIComponent(node.nodeid), 530, 760);
}

/**
 * open connection form for the given node
 */
function addToConnectionForm(node){
	loadDialog('createconn', URL_ROOT + 'plugin/ui/connection.php?ideaid0='+encodeURIComponent(node.nodeid), 840,760);
}

/**
 * Render the central node which can be an aggregate
 */
function renderFocalNode(aggregateCount, node, uniQ, role, includemenu){
	if (aggregateCount < 2) {
		return renderNode(node, uniQ, role, includemenu);
	} else  if (aggregateCount > 1) {
		return renderAggregateNode(node);
	}
}

/**
 * Render an Aggregated Node - label and default role only
 * @param node the node object to render
 */
function renderAggregateNode(node) {

	var ihDiv = new Element("div", {'class':'idea-header'});
	var itDiv = new Element("div", {'class':'idea-title'});

	var nodeTable = document.createElement( 'table' );
	nodeTable.className = "toConnectionsTable";
	nodeTable.width="100%";
	var row = nodeTable.insertRow(-1);	
	var leftCell = row.insertCell(-1);
	leftCell.vAlign="top";	
	leftCell.align="left";

	var iDiv = new Element("div", {'class':'idea-container-aggregate'});
	
	var nodeicon = new Element('img',{'alt':defaultRoleName, 'title':defaultRoleName, 'style':'padding-right:5px;','align':'left', 'border':'0','src': defaultRoleImage});
	itDiv.insert(nodeicon);
	itDiv.insert("<span>"+ node.name + "</span>");	
	leftCell.appendChild(itDiv);
	ihDiv.insert(nodeTable);

	iDiv.insert(ihDiv);

	return iDiv;
}
	
/**
 * Render the given node.
 * @param node the node object do render
 * @param uniQ is a unique id element prepended to the nodeid to form an overall unique id within the currently visible site elements
 * @param role the role object for this node
 * @param includemenu whether to include the drop-down menu (and bookmark and spam buttons)
 * @param type defaults to 'active', but can be 'inactive' so nothing is clickable 
 * 			or a specialized type for some of the popups
 */
function renderNode(node, uniQ, role, includemenu, type){
	
	if (type === undefined) {
		type = "active";
	}
	if (includemenu === undefined) {
		includemenu = true;
	}
	if(role === undefined){
		role = node.role[0].role;
	}

	var user = null;
	// JSON structure different if coming from popup where json_encode used.
	if (node.users[0].userid) {
		user = node.users[0];
	} else {
		user = node.users[0].user;
	}
	
	var breakout = "";
	
	//needs to check if embedded as a snippet
	if(top.location != self.location){
		breakout = " target='_blank'";
	}
	uniQ = node.nodeid + uniQ;
	var iDiv = new Element("div", {'class':'idea-container'});	
	var ihDiv = new Element("div", {'class':'idea-header'});	
	var itDiv = new Element("div", {'class':'idea-title'});
	
	var nodeTable = document.createElement( 'table' );
	nodeTable.className = "toConnectionsTable";
	nodeTable.width="100%";
	if (type == "connselect") {
		nodeTable.style.cursor = 'pointer';
		Event.observe(nodeTable,'click',function (){ 
			loadConnectionNode(node, role);
		});
	}

	var row = nodeTable.insertRow(-1);	
	var leftCell = row.insertCell(-1);
	leftCell.vAlign="top";	
	leftCell.align="left";
	var rightCell = row.insertCell(-1);
	rightCell.vAlign="top";
	rightCell.align="right";

	//get url for any saved image.
	
	//add left side with icon image and node text.

	var roleDiv = new Element("div", {'class':'idea-title'});
	itDiv.insert(roleDiv);

	if (node.imagethumbnail != null && node.imagethumbnail != "") {
		var originalurl = "";		
		if(node.urls && node.urls.length > 0){
			for (var i=0 ; i< node.urls.length; i++){
				var urlid = node.urls[i].url.urlid;
				if (urlid == node.imageurlid) {
					originalurl = node.urls[i].url.url;
					break;
				}
			}
		}
		if (originalurl == "") {
			originalurl = node.imagethumbnail;
		}
		var iconlink = new Element('a', {
			'href':originalurl,
			'title':'View original image', 'target': '_blank' });
 		var nodeicon = new Element('img',{'alt':'View original image', 'style':'padding-right:5px;','align':'left', 'border':'0','src': URL_ROOT + node.imagethumbnail});
 		iconlink.insert(nodeicon);
 		roleDiv.insert(iconlink);
 		itDiv.insert(role.name+": ");
	} else if (role.image != null && role.image != "") {
 		var nodeicon = new Element('img',{'alt':role.name, 'title':role.name, 'style':'padding-right:5px;','align':'left', 'border':'0','src': URL_ROOT + role.image});
		roleDiv.insert(nodeicon);
	} else {
 		itDiv.insert(role.name+": ");
	}	

	if (type == "active") {
		itDiv.insert("<a href='"+createNodeURL(node.nodeid)+"'"+breakout+">"+ node.name + "</a>");
	} else if (type == "inactive" || type == "connselect") {
		itDiv.insert("<span>"+node.name+"</span>");
	}
	
	leftCell.appendChild(itDiv);
	
	// Add right side with user image and date below
	var iuDiv = new Element("div", {'class':'idea-user'});

	var userimageThumb = new Element('img',{'alt':user.name, 'title': user.name, 'style':'padding-right:5px;','align':'right', 'border':'0','src': user.thumb});		

	if (type == "active") {		
		var imagelink = new Element('a', {
			'href':URL_ROOT+"user.php?userid="+user.userid,
			'title':user.name});
		if (breakout != "") {
			imagelink.target = "_blank";		
		} 		
		imagelink.insert(userimageThumb);			
		iuDiv.update(imagelink);
	} else {
		iuDiv.insert(userimageThumb)
	}
		
	var modDate = new Date(node.modificationdate*1000);
	iuDiv.insert("<div style='clear: both;'>"+ modDate.format(DATE_FORMAT)+"</span>");	
	rightCell.appendChild(iuDiv);
	ihDiv.insert(nodeTable);
		
	var iwDiv = new Element("div", {'class':'idea-wrapper'});
	var imDiv = new Element("div", {'class':'idea-main'});
	var idDiv = new Element("div", {'class':'idea-detail'});
		
	// display the data headers
	var headerDiv = new Element("div", {'class':'idea-menus', 'style':'width: 100%'});

	// Add bookmark icon
	if (includemenu && type == "active") {
		var bookmarkDiv = new Element("div", {'style':'float:left'});
		var bookmarkimg = document.createElement('img');
		bookmarkimg.setAttribute('alt', 'Bookmark');
		bookmarkimg.nodeid = node.nodeid;
		bookmarkimg.label = node.name;
		bookmarkimg.style.cursor = 'pointer';	   	
		bookmarkimg.style.verticalAlign="bottom";
		bookmarkimg.style.marginRight="5px";
		bookmarkimg.style.cssFloat = "left";
		if(USER != ""){
			if (node.isbookmarked != null && node.isbookmarked == true) {
				bookmarkimg.setAttribute('src', URL_ROOT+'images/favorites.png');
				Event.observe(bookmarkimg,'click',function (){ unbookmark(this) } );
				bookmarkimg.setAttribute('title', 'Unbookmark this idea');
			} else { 
				bookmarkimg.setAttribute('src', URL_ROOT+'images/favorites-empty.png');
				Event.observe(bookmarkimg,'click',function (){ bookmark(this) } );
				bookmarkimg.setAttribute('title', 'Bookmark this idea');
			}
		} else {
			bookmarkimg.setAttribute('src', URL_ROOT+'images/favorites-disabled.png');
			bookmarkimg.setAttribute('title', 'Login to Bookmark this idea');
		}
		bookmarkDiv.insert(bookmarkimg);
		headerDiv.insert(bookmarkDiv);
	}
	
	// Add voting icons
	if (includemenu && type == "active") {
		var votingDiv = new Element("div", {'style':'float:left; margin-right: 6px;margin-left: 3px;'});
		
		// vote for
		var voteforimg = document.createElement('img');
		voteforimg.setAttribute('src', URL_ROOT+'images/thumb-up-grey.png');
		voteforimg.setAttribute('alt', 'Voting For');
		voteforimg.setAttribute('id','nodefor'+node.nodeid);
		voteforimg.nodeid = node.nodeid;
		voteforimg.uniqueid = uniQ;
		voteforimg.vote='Y';
		voteforimg.style.verticalAlign="bottom";
		voteforimg.style.marginRight="3px";
		voteforimg.style.cssFloat = "left";
		votingDiv.insert(voteforimg);
		if(USER != ""){
			voteforimg.style.cursor = 'pointer';	   	
			if (node.uservote && node.uservote == 'Y') {
				Event.observe(voteforimg,'click',function (){ deleteNodeVote(this) } );
				voteforimg.setAttribute('src', URL_ROOT+'images/thumb-up-filled.png');
				voteforimg.setAttribute('title', 'Un-promote this...');
			} else if (!node.uservote || node.uservote != 'Y') {
				Event.observe(voteforimg,'click',function (){ nodeVote(this) } );
				voteforimg.setAttribute('src', URL_ROOT+'images/thumb-up-empty.png');
				voteforimg.setAttribute('title', 'Promote this: looks important...');
			}
			votingDiv.insert('<b><span style="font-size: 10pt" id="nodevotefor'+node.nodeid+'">'+node.positivevotes+'</span></b>');
		} else {
			voteforimg.setAttribute('title', 'Login to Promote this');
			votingDiv.insert('<b><span style="font-size: 10pt" id="nodevotefor'+node.nodeid+'">'+node.positivevotes+'</span></b>');
		}
		
		headerDiv.insert(votingDiv);


		var votingAgainstDiv = new Element("div", {'style':'float:left; margin-right: 6px;'});
		
		// vote against
		var voteagainstimg = document.createElement('img');
		voteagainstimg.setAttribute('src', URL_ROOT+'images/thumb-down-grey.png');
		voteagainstimg.setAttribute('alt', 'Voting Against');
		voteagainstimg.setAttribute('id', 'nodeagainst'+node.nodeid);
		voteagainstimg.nodeid = node.nodeid;
		voteagainstimg.vote='N';
		voteagainstimg.style.verticalAlign="bottom";
		voteagainstimg.style.marginRight="3px";
		voteagainstimg.style.cssFloat = "left";
		votingAgainstDiv.insert(voteagainstimg);
		if(USER != ""){
			voteagainstimg.style.cursor = 'pointer';	   	
			if (node.uservote && node.uservote == 'N') {
				Event.observe(voteagainstimg,'click',function (){ deleteNodeVote(this) } );
				voteagainstimg.setAttribute('src', URL_ROOT+'images/thumb-down-filled.png');
				voteagainstimg.setAttribute('title', 'Un-demote this...');
			} else if (!node.uservote || node.uservote != 'N') {
				Event.observe(voteagainstimg,'click',function (){ nodeVote(this) } );
				voteagainstimg.setAttribute('src', URL_ROOT+'images/thumb-down-empty.png');
				voteagainstimg.setAttribute('title', 'Demote this: not so important...');
			}
			votingAgainstDiv.insert('<b><span style="font-size: 10pt" id="nodevoteagainst'+node.nodeid+'">'+node.negativevotes+'</span></b>');
		} else {
			voteagainstimg.setAttribute('title', 'Login to Demote this');
			votingAgainstDiv.insert('<b><span style="font-size: 10pt" id="nodevoteagainst'+node.nodeid+'">'+node.negativevotes+'</span></b>');
		}
		
		headerDiv.insert(votingAgainstDiv);
	}
	
	if(node.description || node.hasdesc){
		headerDiv.insert("<div style='float:left'><span class='active' id='desctoggle"+uniQ+"' title='Click to view description and meta data' onClick='ideatoggle(\"desc"+uniQ+"\",\""+node.nodeid+"\",\"desc\")'>Details<span style=\"font-size: 120%;\">*</span> <span id='opendesc"+uniQ+"'>+</span></span> </div>");
	} else {
		headerDiv.insert("<div style='float:left'><span class='active' id='desctoggle"+uniQ+"' title='Click to view meta data' onClick='ideatoggle(\"desc"+uniQ+"\",\""+node.nodeid+"\",\"desc\")'>Details <span id='opendesc"+uniQ+"'>+</span></span> </div>");
	}
	

	//headerDiv.insert("<span class='active' id='datatoggle"+uniQ+"' onClick='ideatoggle(\"data"+uniQ+"\")'>Data <span id='opendata"+uniQ+"'>+</span></span>");
	
	idDiv.insert(headerDiv);
		
	var iaDiv = new Element("div", {'class':'idea-action','style':'float:right'});
	if(USER != "" && includemenu && type == "active"){
		var ddImg = new Element('img', {'src':URL_ROOT+'images/dropdown-grey.png','class':'drop-down-img'});
		Event.observe(ddImg,'mouseover',function (){ showPopup('dd'+uniQ)});
		Event.observe(ddImg,'mouseout',function (){ hidePopup('dd'+uniQ)});
		iaDiv.insert(ddImg);
		
		var ddDiv = new Element("div", {"id":"dd"+uniQ,"class":"drop-down"});
		Event.observe(ddDiv,'mouseover',function (){ showPopup("dd"+uniQ)});
		Event.observe(ddDiv,'mouseout',function (){ hidePopup("dd"+uniQ)});
		iaDiv.insert(ddDiv);
		
		var ddUL = new Element('ul',{'class':'dd-list'});
		
		if (USER == user.userid) {
			var ddLI = new Element('li',{'class':'dd-li'}).insert('Edit');
			Event.observe(ddLI,'click',function (){loadDialog('editnode',URL_ROOT+"plugin/ui/idea.php?nodeid="+node.nodeid)});
			ddUL.insert(ddLI);
		
			var ddLI = new Element('li',{'class':'dd-li'}).insert('Delete');
			Event.observe(ddLI,'click',function (){deleteNode(node.nodeid,node.name)});
			ddUL.insert(ddLI);
		}

		var ddLI = new Element('li',{'class':'dd-li'}).insert('Connect');		
		Event.observe(ddLI,'click',function (){addToConnectionForm(node)});
		ddUL.insert(ddLI);

		var ddLI = new Element('li',{'class':'dd-li'}).insert('Network Search');		
		Event.observe(ddLI,'click',function (){showNetworkSearchDialog(node)});
		ddUL.insert(ddLI);

		var ddLI = new Element('li',{'class':'dd-li'}).insert('Network Search By Depth');		
		Event.observe(ddLI,'click',function (){showNetworkSearchDialogNew(node)});
		ddUL.insert(ddLI);
		

		var ddLI = new Element('li',{'class':'dd-li'}).insert('Get Snippet');
		Event.observe(ddLI,'click',function (){ showSnippet(SNIPPET_IDEA, node.nodeid) });
		ddUL.insert(ddLI);

		var ddLI = new Element('li',{'class':'dd-li'}).insert('Get URL');
		Event.observe(ddLI,'click',function (){ showURL(SNIPPET_IDEA, node.nodeid) } );
		ddUL.insert(ddLI);
		
		ddDiv.insert(ddUL);
	}
	headerDiv.insert(iaDiv);
		
	// Add spam icon
	var spamDiv = new Element("div");
	spamDiv.addClassName("idea-action");	

	if (includemenu && type == "active") {
		var spamimg = document.createElement('img');
		spamimg.style.verticalAlign="bottom";
		//spamimg.style.marginRight="5px";
		if(USER != ""){
			if (node.status == 1) {
				spamimg.setAttribute('alt', 'This has been reported as Spam / Inappropriate content');
				spamimg.setAttribute('title', 'This has been reported as Spam / Inappropriate content');
				spamimg.setAttribute('src', URL_ROOT+'images/spam-reported.png');
			} else if (node.status == 0) {
				spamimg.setAttribute('alt', 'Report this as Spam / Inappropriate content');
				spamimg.setAttribute('title', 'Report this as Spam / Inappropriate content');
				spamimg.setAttribute('src', URL_ROOT+'images/spam.png');
				spamimg.id = node.nodeid;
				spamimg.label = node.name;
				spamimg.style.cursor = 'pointer';	   	
				Event.observe(spamimg,'click',function (){ reportNodeSpamAlert(this, node) } );
			}
		} else {
			spamimg.setAttribute('alt', 'Login to reported this as Spam / Inappropriate content');
			spamimg.setAttribute('title', 'Login to reported this as Spam / Inappropriate content');
			spamimg.setAttribute('src', URL_ROOT+'images/spam-disabled.png');
		}
		spamDiv.insert(spamimg);		
		headerDiv.insert(spamDiv);
	}
	
	var descDiv = new Element("div", {"id":"desc"+uniQ,"class":"ideadata","style":"display:none; padding-top: 5px;"});

	if(node.urls && node.urls.length > 0){
		var urlDiv = new Element("div", {"id":"urls"+uniQ, "style":"margin-top: 5px;"});
		urlDiv.insert("<div style='margin-top: 5px;'>Websites:</div>");
		
		descDiv.insert(urlDiv);
		
		var otherURLs = new Array();
		var count=0;
		var str = "";
		var img;
		var urlLower="";		

		//pick out any images and add those first
		for (var i=0 ; i< node.urls.length; i++){
			var url = null;
			if (node.urls[i].urlid) {
				url = node.urls[i];
			} else {
				url = node.urls[i].url; 
			}

			try {
				var urladdress = url.url;
				urlLower = urladdress.toLowerCase();
				if (urlLower.endsWith('.jpg') 
					|| urlLower.endsWith('.jpeg') 
					|| urlLower.endsWith('.gif') 
					|| urlLower.endsWith('.png')) {
					
					img = new Image();
					img.src = urladdress;
					var width=img.width;
					if (width > 125) {
						width = 125;
					}
					if (type == "active") {
						str += "<div style='clear: both; float: left; overflow: auto; padding: 5px;'><a href='"+urladdress+"' target='_blank' title='View original image'><img src=\""+urladdress+"\" width='"+width+"' border=\"0\" /></a></div>";
					} else {
						str += "<div style='clear: both; float: left; overflow: auto; padding: 5px;'><img src=\""+urladdress+"\" width='"+width+"' border=\"0\" /></div>";
					}
				} else {
					url
					otherURLs[count] = url;
					count++;
				}
			} catch (err) {
    			alert(err);
			}
		}
				
		str += "<div class='ideadata' style='padding-top:5px;padding-left:10px;'><ul type='disc'  style='padding-left: 0px; margin-left:0px;' >";		
		for (var i=0 ; i< otherURLs.length; i++){
			str += '<li style="margin-bottom: 5px;">';
			if (otherURLs[i].clip != "") {
				str += '<b style="margin-bottom: 2px;">Clip: </b>'+otherURLs[i].clip+'<br/>';
			}
			if (type == "active") {
				str += otherURLs[i].title+ " <a href='"+otherURLs[i].url+"' target='_blank'>visit site</a>";
			} else {	
				str += otherURLs[i].title;
			}
			str += "</li>";
		}
		str += "</ul></div>";
		urlDiv.insert(str)
	}

	if(node.groups && node.groups.length > 0){
		var grpStr = "<div id='groups"+uniQ+"' style='margin-top: 5px;'>Groups:<ul type='disc'>";
		for (var i=0 ; i< node.groups.length; i++){
			var group = null;
			if (node.groups[i].groupid) {
				group = node.groups[i];
			} else {
				group = node.groups[i].group; 
			}
			if (type == "active") {
				grpStr += "<li><a href='"+URL_ROOT+"group.php?groupid="+group.groupid+"'"+breakout+">"+group.name+"</a></li>";
			} else {
				grpStr += "<li>"+group.name+"</li>";
			}
		}
		grpStr += "</ul></div>";
		descDiv.insert(grpStr);
	}

	if(node.tags && node.tags.length > 0){
		var grpStr = "<div id='tags"+uniQ+"' style='margin-top:5px;'>Tags:<ul type='disc'>";
		for (var i=0 ; i< node.tags.length; i++){
			var tag = null;
			if (node.tags[i].name) {
				tag = node.tags[i];
			} else {
				tag = node.tags[i].tag 
			}
			if (type == "active") {
				grpStr += '<li><a href="'+URL_ROOT+'tagsearch.php?q='+tag.name+'&scope=all&tagsonly=true">'+tag.name+'</a></li>';
			} else {
				grpStr += '<li>'+tag.name+'</li>';
			}
		}
		grpStr += "</ul></div>";
		descDiv.insert(grpStr);
	}
	
	var cDate = new Date(node.creationdate*1000);
	var dStr = "<br><b>Create date: </b>"+ cDate.format(DATE_FORMAT) + "<br/>";
	if(node.creationdate != node.modificationdate){
		var modDate = new Date(node.modificationdate*1000);
		dStr += "<b>Modification date: </b>"+ modDate.format(DATE_FORMAT) + "<br/>";
	}
	if(node.private == 'Y'){
		dStr += "<b>Visibility:</b> Private<br/>";
	} else {
		dStr += "<b>Visibility:</b> Public<br/>";
	}
	if(node.startdatetime){
		var sDate = new Date(node.startdatetime*1000);
		dStr += "<b>Start Date: </b>"+sDate.format(DATE_FORMAT)+"<br/>";
	}
	if(node.enddatetime){
		var eDate = new Date(node.enddatetime*1000);
		dStr += "<b>End Date: </b>"+eDate.format(DATE_FORMAT)+"<br/>";
	}
	
	if(node.location){
		dStr += "<b>Location: </b>"+node.location + ", "+ node.country + "<br/>";
	}
	
	if(node.connectedness){
		dStr += "<b>Connectedness: </b>"+node.connectedness+"<br/>";
	}
	
	descDiv.insert(dStr);
	
	if(node.description || node.hasdesc){	
		descDiv.insert('<br/><b>Description: </b><br/>');
	}		
	
	idDiv.insert(descDiv);
			
	imDiv.insert(idDiv);
	
	iwDiv.insert(imDiv);
	iwDiv.insert('<div style="clear:both;"></div>');
	iDiv.insert(ihDiv);
	iDiv.insert('<div style="clear:both;"></div>');
	iDiv.insert(iwDiv);
	
	return iDiv;
}
	
/**
 * Render the given node for a report.
 * @param node the node object do render
 * @param uniQ is a unique id element prepended to the nodeid to form an overall unique id within the currently visible site elements
 * @param role the role object for this node
 * @param includemenu whether to include the drop-down menu (and bookmark and spam buttons)
 * @param type defaults to 'active', but can be 'inactive' so nothing is clickable 
 * 			or a specialized type for some of the popups
 */
function renderReportNode(node, uniQ, role){
	
	if(role === undefined){
		role = node.role[0].role;
	}

	var user = null;
	// JSON structure different if coming from popup where json_encode used.
	if (node.users[0].userid) {
		user = node.users[0];
	} else {
		user = node.users[0].user;
	}
	
	var breakout = "";
	
	//needs to check if embedded as a snippet
	if(top.location != self.location){
		breakout = " target='_blank'";
	}
	uniQ = node.nodeid + uniQ;
	var iDiv = new Element("div", {'style':'border-bottom: 1px solid gray;padding-bottom:5px;'});	
	var ihDiv = new Element("div", {});	
	var itDiv = new Element("div", {});
	
	var nodeTable = document.createElement( 'table' );
	//nodeTable.border="1";
	nodeTable.width="100%";

	var row = nodeTable.insertRow(-1);	

	var rightCell = row.insertCell(-1);
	rightCell.vAlign="top";
	rightCell.align="left";
	rightCell.width="50px";

	var midCell = row.insertCell(-1);
	midCell.vAlign="top";	
	midCell.align="left";
	midCell.width = "320px";
	
	var leftCell = row.insertCell(-1);
	leftCell.vAlign="top";	
	leftCell.align="right";
	leftCell.width="50px";
	
	//get url for any saved image.	
	//add left side with icon image and node text.
	if (node.imagethumbnail != null && node.imagethumbnail != "") {
		var originalurl = "";		
		if(node.urls && node.urls.length > 0){
			for (var i=0 ; i< node.urls.length; i++){
				var urlid = node.urls[i].url.urlid;
				if (urlid == node.imageurlid) {
					originalurl = node.urls[i].url.url;
					break;
				}
			}
		}
		if (originalurl == "") {
			originalurl = node.imagethumbnail;
		}
		var iconlink = new Element('a', {
			'href':originalurl,
			'title':'View original image', 'target': '_blank' });
 		var nodeicon = new Element('img',{'alt':'View original image', 'style':'padding-right:5px;','align':'right', 'border':'0','src': URL_ROOT + node.imagethumbnail});
 		iconlink.insert(nodeicon);
 		itDiv.insert(iconlink);
 		itDiv.insert(role.name+": ");
	} else if (role.image != null && role.image != "") {
 		var nodeicon = new Element('img',{'alt':role.name, 'title':role.name, 'style':'padding-right:5px;','align':'right', 'border':'0','src': URL_ROOT + role.image});
		itDiv.insert(nodeicon);
	} else {
 		itDiv.insert(role.name+": ");
	}	

	midCell.innerHTML=("<span>"+node.name+"</span>");
	
	leftCell.appendChild(itDiv);
	
	// Add left side with user image
	var iuDiv = new Element("div", {'class':'idea-user', 'style':'margin:0px;padding:0px;'});
	var userimageThumb = new Element('img',{'alt':user.name, 'title': user.name, 'style':'padding:0px;margin: 0px;','align':'left', 'border':'0','src': user.thumb});		
	iuDiv.insert(userimageThumb)
		
	rightCell.appendChild(iuDiv);
	
	ihDiv.insert(nodeTable);
		
	
	iDiv.insert(ihDiv);
	iDiv.insert('<div style="float: left;clear:both;"></div>');
	
	return iDiv;
}

/**
 * Create the url which is run when a node is clicked.
 */
function createNodeURL(nodeid, view) {

		// The 'view' should be one of three possible views. If no view is
		// specified then default to "conn-neighbour"
		if (!(view == "conn-list" ||
				  view == "conn-neighbour" ||
					view == "conn-net")) {
				view = "conn-neighbour";
		}

	var url = URL_ROOT+"node.php?";
	try {
		if (CURRENT_VIZ !== undefined && CURRENT_VIZ == 'neighbour') {	
			var args = Object.clone(NEIGHBOURHOOD_ARGS);
			args['nodeid'] = nodeid;
			url += Object.toQueryString(args);	
		} else {
			url += "nodeid="+nodeid;
		}
	} catch (e){
		url += "nodeid="+nodeid;		
	}
	url += "#"+view;

	return url;
}



/**
 * Open and close the meta data sections - get details if required.
 */
function ideatoggle(section, id, sect){
    $(section).toggle();
    if($('open'+section)){
        if($(section).visible()){
            $('open'+section).update("-");   
        } else {
            $('open'+section).update("+");  
        }   
    }
    //if it's the description
    if(sect == "desc" && $(section).visible() && !$(section).description){
    	var reqUrl = SERVICE_ROOT + "&method=getnode&nodeid=" + encodeURIComponent(id);
		new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			Element.insert($(section), {'bottom':json.cnode[0].description});   
      			$(section).description = 'true';
    		}
  		});
    }
}


/**
 *	select all the nodes on the page
 */
function selectAllNodes(event){
	var nodes = $("tab-content-node").select('[class="nodecheck"]');
	nodes.each(function(name, index) {
		nodes[index].checked = true;
	}); 
}

/**
 *	deselect all the nodes on the page
 */
function selectNoNodes(event){
	var nodes = $("tab-content-node").select('[class="nodecheck"]');
	nodes.each(function(name, index) {
		nodes[index].checked = false;
		}); 
}

/**
 *	do an action on all the currently selected items
 */
function groupActionNodeClick(event){
	var opt = $('node-groupaction-select').options[$('node-groupaction-select').selectedIndex].value;
	switch (opt){
		case "deleteallselectednodes":
			deleteAllSelectedNodes();
			break;
		case "addselectednodestomyworkspace":
			addSelectedNodesToWorkspace();
			break;
		case "addselectednodestogroup":
			addSelectedNodesToGroup();
			break;
		case "removeselectednodesfromgroup":
			removeSelectedNodesFromGroup();
			break;
		case "tagallselectednodes":
			tagAllSelectedNodes();
			break;
		default:
			//do nothing
	}
}

/**
 *	do an action on all the currently selected items
 */
function groupActionNodeChange(event){
	var opt = $('node-groupaction-select').options[$('node-groupaction-select').selectedIndex].value;
	switch (opt){
		case "deleteallselectednodes":
			$('node-groupaction-select-group').hide();
			$('node-addtagaction').hide();
			break;
		case "addselectednodestomyworkspace":
			$('node-groupaction-select-group').hide();
			$('node-addtagaction').hide();
			break;
		case "addselectednodestogroup":
			$('node-addtagaction').hide();
			$('node-groupaction-select-group').show();
			break;
		case "removeselectednodesfromgroup":
			$('node-addtagaction').hide();
			$('node-groupaction-select-group').show();
			break;
		case "tagallselectednodes":
			$('node-groupaction-select-group').hide();
			$('node-addtagaction').show();
			break;
		default:
			$('node-groupaction-select-group').hide();
			$('node-addtagaction').hide();
	}
}

/**
 *	get all the selected node ids
 */
function getSelectedNodeIDs(){
	var retArr = new Array();
	var nodes = $("tab-content-node").select('[class="nodecheck"]');
	nodes.each(function(name, index) {
		if(nodes[index].checked){
			retArr.push(nodes[index].id.replace(/nodecheck/,''));
		}
	});
	return retArr;
}

/**
 *	delete all the selected node ids
 */
function deleteAllSelectedNodes(){
	var toDel = getSelectedNodeIDs();
	if(toDel.length == 0){
		alert("You must first select some ideas.");
		return;
	}
	var ans = confirm("Are you sure you want to delete the selected ideas?\n\n Note: this will only delete the ideas that you own.");
	if (ans){
		// loop through and delete the selected nodes, ignoring any reply (in case user doesn't own)
		var reqUrl = SERVICE_ROOT + "&method=deletenodes&nodeids=" + encodeURIComponent(toDel.join(","));
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
 *	Tag all the selected nodes
 */
function tagAllSelectedNodes(){

	var selectedNodes = getSelectedNodeIDs();
	if(selectedNodes.length == 0){
		alert("You must first select some ideas.");
		return;
	}
	var tags = $('node-addtagaction').value;
	if(tags == ""){
		alert("You must add at least one tag.");
		return;
	} else {
		//alert("tag:"+tags);
	}
	
	var reqUrl = SERVICE_ROOT + "&method=addtagstonodes&nodeids=" + encodeURIComponent(selectedNodes.join(","))+"&tags="+ encodeURIComponent(tags);
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
function addSelectedNodesToWorkspace(){
	var toAdd = getSelectedNodeIDs();
	if(toAdd.length == 0){
		alert("You must first select some ideas.");
		return;
	}

	var reqUrl = SERVICE_ROOT + "&method=addnodesbyid&nodeids=" + encodeURIComponent(toAdd.join(","));
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
 *	add selected nodes to a group
 */
function addSelectedNodesToGroup(){
	var toAdd = getSelectedNodeIDs();
	if(toAdd.length == 0){
		alert("You must first select some ideas.");
		return;
	}
	var groupid = $('node-groupaction-select-group').options[$('node-groupaction-select-group').selectedIndex].value;
	if(groupid == ""){
		alert("You must select a group.");
		return;
	}
	var reqUrl = SERVICE_ROOT + "&method=addgrouptonodes&nodeids=" + encodeURIComponent(toAdd.join(",")) + "&groupid="+ encodeURIComponent(groupid);
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
function removeSelectedNodesFromGroup(){
	var toAdd = getSelectedNodeIDs();
	if(toAdd.length == 0){
		alert("You must first select some ideas.");
		return;
	}
	var groupid = $('node-groupaction-select-group').options[$('node-groupaction-select-group').selectedIndex].value;
	if(groupid == ""){
		alert("You must select a group.");
		return;
	}
	var reqUrl = SERVICE_ROOT + "&method=removegroupfromnodes&nodeids=" + encodeURIComponent(toAdd.join(",")) + "&groupid="+ encodeURIComponent(groupid);
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
 *	show an RSS feed of the nodes
 */
function getNodesFeed(){
	var url = SERVICE_ROOT.replace('format=json','format=rss');
	var args = Object.clone(NODE_ARGS);
	args["start"] = 0;
	var reqUrl = url+"&method=getnodesby"+CONTEXT+"&"+Object.toQueryString(args);
	window.location.href = reqUrl;
}

/**
 * Print current node list in new popup window
 */
function printNodes(){
	var url = SERVICE_ROOT;
	
	var args = Object.clone(NODE_ARGS);
	args["start"] = 0;
	args["max"] = -1;
	args["style"] = 'short';
	
	var reqUrl = url+"&method=getnodesby"+CONTEXT+"&"+Object.toQueryString(args);		
	var urlcall =  URL_ROOT+"plugin/ui/printnodes.php?context="+CONTEXT+"&title="+args['title']+"&url="+encodeURIComponent(reqUrl);
	
	loadDialog('printnodes', urlcall, 700, 700);
}