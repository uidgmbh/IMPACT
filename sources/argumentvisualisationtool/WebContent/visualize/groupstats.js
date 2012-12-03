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
 * Load the starting stats point
 */
function loadGroupStats(context,args){
	loadRecentIdeasGroup(args['groupid'], 'all', "allR");	
}

function loadPopularIdeasGroup(groupid, scope, current){
	var content = $('tab-content-stats-list');
	content.update(getLoading("(Loading most popular group ideas...)"));
	CURRENT_IDEA_CALL = "&method=getpopularnodesbyvote&scope="+scope+"&groupid="+groupid;
	var reqUrl = SERVICE_ROOT + CURRENT_IDEA_CALL;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				//alert(transport.responseText);
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			statsHeader(content,current, groupid);
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
      			} else {
      				content.insert('<div style="margin-left: 30px; padding-top: 20px; font-size: 12pt">No results found</div>');
      			}
      		}
      	});
}

function loadRecentIdeasGroup(groupid, scope, current){
	var content = $('tab-content-stats-list');
	content.update(getLoading("(Loading most recent group ideas...)"));
	

	var reqUrl = SERVICE_ROOT + "&method=getrecentnodes&scope="+scope+"&groupid="+groupid;	
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
 				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			statsHeader(content,current, groupid);
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
      			} else {
      				content.insert('<div style="margin-left: 30px; padding-top: 20px; font-size: 12pt">No results found</div>');
      			}
      		}
      	}); 
}

function loadConnectedIdeasGroup(groupid, scope, current){
	var content = $('tab-content-stats-list');
	content.update(getLoading("(Loading most connected group ideas)"));
	var reqUrl = SERVICE_ROOT + "&method=getmostconnectednodes&scope="+scope+"&groupid="+groupid;;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			statsHeader(content, current, groupid);
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
      			} else {
      				content.insert('<div style="margin-left: 30px; padding-top: 20px; font-size: 12pt">No results found</div>');
      			}
      		}
      	});     	
}

function loadNodeTypes(groupid, scope, current){
	var content = $('tab-content-stats-list');
	content.update(getLoading("(Loading node types)"));
	

	var reqUrl = SERVICE_ROOT + "&method=getgroupnodetypeusage&scope="+scope+"&groupid="+groupid;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			statsHeader(content, current, groupid);
      			
      			var roles = json.roleset[0].roles;
      			if(roles.length > 0){

					var str = '<table cellspacing="2" style="margin-left: 30px; margin-top: 20px;border-collapse:collapse;" width="300">';
					str += '<tr style="background-color: #308D88; color: white">';
					str += '<td width="40%"><b>Name</b></td>';
					str += '<td align="right" width="20%"><b>Count</b></td>';
					str += '</tr>';
					str += '<tr>';
					str += '<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>';
					str += '</tr>';

					for(var i=0; i< roles.length; i++){
						if(roles[i].role){
							str += '<tr>';
							str += '<td style="color: #666666 ">'+roles[i].role.name+'</td>';
							str += '<td align="right">'+ roles[i].role.num+'</td>';
							str += '</tr>';
						}
					}
					
					str += '</table>';
					
					content.insert(str);
      			} else {
      				content.insert('<div style="margin-left: 30px; padding-top: 20px; font-size: 12pt">No results found</div>');
      			}
      		}
      	});  	
}

function loadLinkTypes(groupid, scope, current){
	var content = $('tab-content-stats-list');
	content.update(getLoading("(Loading node types)"));
	var reqUrl = SERVICE_ROOT + "&method=getgrouplinktypeusage&scope="+scope+"&groupid="+groupid;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			statsHeader(content, current, groupid);
      			var linktypes = json.linktypeset[0].linktypes;
      			if(linktypes.length > 0){

					var str = '<table cellspacing="2" style="margin-left: 30px; margin-top: 20px;border-collapse:collapse;" width="300">';
					str += '<tr style="background-color: #308D88; color: white">';
					str += '<td width="40%"><b>Name</b></td>';
					str += '<td align="right" width="20%"><b>Count</b></td>';
					str += '</tr>';
					str += '<tr>';
					str += '<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>';
					str += '</tr>';

					for(var i=0; i< linktypes.length; i++){
						if(linktypes[i].linktype){
						
							str += '<tr>';
							str += '<td style="color: #666666 ">'+linktypes[i].linktype.label+'</td>';
							str += '<td align="right">'+linktypes[i].linktype.num+'</td>';
							str += '</tr>';
						}
					}
					
					str += '</table>';
					
					content.insert(str);
      			} else {
      				content.insert('<div style="margin-left: 30px; padding-top: 20px; font-size: 12pt">No results found</div>');
      			}
      		}
      	});     	
}

function statsHeader(objDiv,current, groupid){
	var head = new Element("div",{'id':'nodehead'});
	var allUL = new Element("ul",{'class':'home-node-head-list'});
	allUL.insert(new Element("li",{'class':'home-node-head-item'}).insert("<span style='width:30px;'>All:</span>"));
	
	var allP = new Element("li",{'class':'home-node-head-item'}).insert("Popular");
	allUL.insert(allP);
	if(current == "allP"){
		allP.addClassName("current");
	} else {
		allP.addClassName("option");
		Event.observe(allP,"click", function(){
			loadPopularIdeasGroup(groupid, 'all', "allP");
		});     
	}

	var allR = new Element("li",{'class':'home-node-head-item'}).insert("Recent");
	allUL.insert(allR);
	if(current == "allR"){
		allR.addClassName("current");
	} else {
		allR.addClassName("option");
		Event.observe(allR,"click", function(){
			loadRecentIdeasGroup(groupid, 'all', "allR");
		});     
	}
	
	var allC = new Element("li",{'class':'home-node-head-item'}).insert("Connected");
	allUL.insert(allC);
	if(current == "allC"){
		allC.addClassName("current");
	} else {
		allC.addClassName("option");
		Event.observe(allC,"click", function(){
			loadConnectedIdeasGroup(groupid, 'all', "allC");
		});     
	}

	var allN = new Element("li",{'class':'home-node-head-item'}).insert("Node Type");
	allUL.insert(allN);
	if(current == "allN"){
		allN.addClassName("current");
	} else {
		allN.addClassName("option");
		Event.observe(allN,"click", function(){
			loadNodeTypes(groupid, 'all', "allN");
		});     
	}

	var allL = new Element("li",{'class':'home-node-head-item'}).insert("Link Type");
	allUL.insert(allL);
	if(current == "allL"){
		allL.addClassName("current");
	} else {
		allL.addClassName("option");
		Event.observe(allL,"click", function(){
			loadLinkTypes(groupid, 'all', "allL");
		});     
	}
		
	objDiv.insert(head.insert(allUL));
	
	// only if user logged in
	if(USER != ""){
		var myUL = new Element("ul",{'class':'home-node-head-list'});
		myUL.insert(new Element("li",{'class':'home-node-head-item'}).insert("<span style='width:30px;'>My:</span>"));
		
		var myP = new Element("li",{'class':'home-node-head-item'}).insert("Popular");
		myUL.insert(myP);
		if(current == "myP"){
			myP.addClassName("current");
		} else {
			myP.addClassName("option");
			Event.observe(myP,"click", function(){
				loadPopularIdeasGroup(groupid, 'my', "myP");
			});     
		}
	
		var myR = new Element("li",{'class':'home-node-head-item'}).insert("Recent");
		myUL.insert(myR);
		if(current == "myR"){
			myR.addClassName("current");
		} else {
			myR.addClassName("option");
			Event.observe(myR,"click", function(){
				loadRecentIdeasGroup(groupid, 'my', "myR");
			});     
		}
		
		var myC = new Element("li",{'class':'home-node-head-item'}).insert("Connected");
		myUL.insert(myC);
		if(current == "myC"){
			myC.addClassName("current");
		} else {
			myC.addClassName("option");
			Event.observe(myC,"click", function(){
				loadConnectedIdeasGroup(groupid, 'my', "myC");
			});     
		}

		var myN = new Element("li",{'class':'home-node-head-item'}).insert("Node Type");
		myUL.insert(myN);
		if(current == "myN"){
			myN.addClassName("current");
		} else {
			myN.addClassName("option");
			Event.observe(myN,"click", function(){
				loadNodeTypes(groupid, 'my', "myN");
			});     
		}

		var myL = new Element("li",{'class':'home-node-head-item'}).insert("Link Type");
		myUL.insert(myL);
		if(current == "myL"){
			myL.addClassName("current");
		} else {
			myL.addClassName("option");
			Event.observe(myL,"click", function(){
				loadLinkTypes(groupid, 'my', "myL");
			});     
		}
		
		objDiv.insert(head.insert(myUL));
	}
}

loadGroupStats(CONTEXT, NODE_ARGS)