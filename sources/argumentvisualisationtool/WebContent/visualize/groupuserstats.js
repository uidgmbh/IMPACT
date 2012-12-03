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
 * Load the starting user stats
 */
function loadGroupUserStats(context,args){
	loadTopConnectionBuilders(args['groupid'], "allP");	
}

function loadPopularIdeasGroup(groupid, current){
	var content = $('tab-content-stats-userstats');
	content.update(getLoading("(Loading most popular group ideas...)"));
	CURRENT_IDEA_CALL = "&method=getpopularnodesbyvote&groupid="+groupid;
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
      			userstatsHeader(content,current, groupid);
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

function loadRecentIdeasGroup(groupid, current){
	var content = $('tab-content-stats-userstats');
	content.update(getLoading("(Loading most recent group ideas...)"));
	

	var reqUrl = SERVICE_ROOT + "&method=getrecentnodes&max=-1&groupid="+groupid;	
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
 				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			userstatsHeader(content,current, groupid);
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

function loadTopNodeBuilders(groupid, current){

	var content = $('tab-content-stats-userstats');
	content.update(getLoading("(Loading top node builders in group...)"));
	
	var reqUrl = SERVICE_ROOT + "&method=getactiveideausers&groupid="+groupid;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				//alert(transport.responseText);
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			
      			userstatsHeader(content,current, groupid);
      			     			
      			var users = json.userset[0].users;
      			if(users.length > 0){

					var str = '<table cellspacing="2" style="margin-left: 30px; margin-top: 20px;border-collapse:collapse;" width="300">';
					str += '<tr style="background-color: #308D88; color: white">';
					str += '<td width="60%"><b>Name</b></td>';
					str += '<td align="right" width="20%"><b>Count</b></td>';
					str += '<td align="right" width="20%"><b>Action</b></td>';
					str += '</tr>';
					str += '<tr>';
					str += '<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>';
					str += '</tr>';

					for(var i=0; i< users.length; i++){
						if(users[i].user){
 							str += '<tr>';
							str += '<td style="color: #666666 ">'+users[i].user.name+'</td>';
							str += '<td align="right">'+ users[i].user.ideacount+'</td>';
							str += '<td align="right"><a href="'+URL_ROOT+'group.php?groupid='+groupid+'&filterusers='+users[i].user.userid+'#node-list">View all</a></td>';
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

function loadTopConnectionBuilders(groupid, current){
	var content = $('tab-content-stats-userstats');
	content.update(getLoading("(Loading top connection builders in group...)"));
	
	var reqUrl = SERVICE_ROOT + "&method=getactiveconnectionusers&groupid="+groupid;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				//alert(transport.responseText);
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			
      			userstatsHeader(content,current, groupid);
      			
      			var users = json.userset[0].users;
      			if(users.length > 0){

					var str = '<table cellspacing="2" style="margin-left: 30px; margin-top: 20px;border-collapse:collapse;" width="300">';
					str += '<tr style="background-color: #308D88; color: white">';
					str += '<td width="60%"><b>Name</b></td>';
					str += '<td align="right" width="20%"><b>Count</b></td>';
					str += '<td align="right" width="20%"><b>Action</b></td>';
					str += '</tr>';
					str += '<tr>';
					str += '<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>';
					str += '</tr>';

					for(var i=0; i< users.length; i++){
						if(users[i].user){
 							str += '<tr>';
							str += '<td style="color: #666666 ">'+users[i].user.name+'</td>';
							str += '<td align="right">'+ users[i].user.connectioncount+'</td>';
							str += '<td align="right"><a href="'+URL_ROOT+'group.php?groupid='+groupid+'&filterusers='+users[i].user.userid+'#conn-list">View all</a></td>';
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

function loadMostConnectedUsers(groupid, current){
	var content = $('tab-content-stats-userstats');
	content.update(getLoading("(Loading top connection builders in group...)"));
	
	var reqUrl = SERVICE_ROOT + "&method=getmostconnectedusers&groupid="+groupid;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			} 
      			content.update("");
      			
      			userstatsHeader(content,current, groupid);
      			
      			var users = json.userset[0].users;
      			if(users.length > 0){

					var str = '<table cellspacing="2" style="margin-left: 30px; margin-top: 20px;border-collapse:collapse;" width="300">';
					str += '<tr style="background-color: #308D88; color: white">';
					str += '<td width="60%"><b>Name</b></td>';
					str += '<td align="right" width="20%"><b>Count</b></td>';
					str += '</tr>';
					str += '<tr>';
					str += '<td colspan="3" valign="top" style="border-top: 1px solid #666666 "></td>';
					str += '</tr>';

					for(var i=0; i< users.length; i++){
						if(users[i].user){
 							str += '<tr>';
							str += '<td style="color: #666666 ">'+users[i].user.name+'</td>';
							str += '<td align="right">'+ users[i].user.connectioncount+'</td>';
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

function userstatsHeader(objDiv,current, groupid){
	var head = new Element("div",{'id':'nodehead'});
	var allUL = new Element("ul",{'class':'home-node-head-list'});
	allUL.insert(new Element("li",{'class':'home-node-head-item'}).insert("<span style='width:30px;'>All:</span>"));
	
	var allP = new Element("li",{'class':'home-node-head-item'}).insert("Top Connection Builders");
	allUL.insert(allP);
	if(current == "allP"){
		allP.addClassName("current");
	} else {
		allP.addClassName("option");
		Event.observe(allP,"click", function(){
			loadTopConnectionBuilders(groupid, "allP");
		});     
	}

	var allT = new Element("li",{'class':'home-node-head-item'}).insert("Top Node Builders");
	allUL.insert(allT);
	if(current == "allT"){
		allT.addClassName("current");
	} else {
		allT.addClassName("option");
		Event.observe(allT,"click", function(){
			loadTopNodeBuilders(groupid, "allT");
		});     
	}
	
	var allC = new Element("li",{'class':'home-node-head-item'}).insert("Most Connected");
	allUL.insert(allC);
	if(current == "allC"){
		allC.addClassName("current");
	} else {
		allC.addClassName("option");
		Event.observe(allC,"click", function(){
			loadMostConnectedUsers(groupid, "allC");
		});     
	}
		
	objDiv.insert(head.insert(allUL));	
}

loadGroupUserStats(CONTEXT, NODE_ARGS)