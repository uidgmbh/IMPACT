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


function loadAgentNet(){
		
	//get applet width & height 
	var x = $('tab-content-innernet').offsetWidth - 30;
	var y = getWindowHeight() - 320;

	var applet = new Element('applet', 
						{	'id':'Cohere-AgentNet', 
							'name':'Cohere-AgentNet',
							'archive': 'visualize/connectionnetjars/cohere.jar, visualize/connectionnetjars/prefuse.jar, visualize/connectionnetjars/plugin.jar',
							'code':'cohere.CohereApplet.class',
							'width':x,
							'height':y,
							'mayscript':true,
							'scriptable':true,
							'alt':'(Your browser recognizes the APPLET element but does not run the applet.)'
						});
							
	var appletDiv = new Element('div', {'id':'appletDiv', 'style': 'float:left;'});
    appletDiv.insert(applet);  
    
    $("tab-content-innernet").innerHTML = "";
	$("tab-content-innernet").insert(appletDiv);
	
	//event to resize
	Event.observe(window,"resize",resizeApplet);	


	checkIsActive();
	
}

function checkIsActive() {

	try {
		if ($('Cohere-AgentNet') && $('Cohere-AgentNet').isActive()) {
			var IE = "false"; 
			if (document.all) {
				IE = "true"
			}
			$('Cohere-AgentNet').setIsIE(IE);			
			loadRun();
		}
	} catch(e) { 
	      setTimeout(checkIsActive, 1000);	      
    }
}

function resizeApplet(){
	if ($('Cohere-AgentNet')) {
		if ($('header')&& $('header').style.display == "none") {
			var width = getWindowWidth();
			var height = getWindowHeight()-20;

			$('Cohere-AgentNet').width = width;
			$('Cohere-AgentNet').height = height;
			$('Cohere-AgentNet').setViewSize(width, height);
			$('Cohere-AgentNet').repaint();
		} else {
			var x = $('tab-content-innernet').offsetWidth - 20;
			
			var y = getWindowHeight() - $('header').offsetHeight;
			
			if ($('context') && $('context').style.display != "none")
				y -= $('context').offsetHeight;
			
			if ($('tabs') && $('tabs').style.display != "none")
				y -= $('tabs').offsetHeight;

			if ($('netbuttons') && $('netbuttons').style.display != "none")
				y -= $('netbuttons').offsetHeight;

			y -= 120;

			$('Cohere-AgentNet').width = x;
			$('Cohere-AgentNet').height = y;
			$('Cohere-AgentNet').setViewSize(x, y);
			$('Cohere-AgentNet').validate();
			$('Cohere-AgentNet').repaint();        
		}
	}
}

/**
 * Called by the Applet to make applet normal size.
 */
function smallScreenAppletagent(silly) {

	if ($('header')) {
		$('header').style.display="block";
	}
	if ($('context')) {
		$('context').style.display="block";
	}
	if ($('tabs')) {
		$('tabs').style.display="block";
	}
	if ($('netbuttons')) {
		$('netbuttons').style.display="block";
	}
	
	if ($('content')) {
		$('content').style.marginLeft = "230px";
	}
	if ($('sidebar-header')) {
		$('sidebar-header').style.display="block";
	}
	if ($('sidebar-footer')) {
		$('sidebar-footer').style.display="block";
	}
	if ($('sidebar-content')) {
		$('sidebar-content').style.display="block";
	}
	if ($('sidebar-open')) {
		$('sidebar-open').style.display="none";
	}
	
	resizeApplet();
}

/**
 * Called by the Applet to enlarge full page.
 */
function fullScreenAppletagent(silly) {

	if ($('header')) {
		$('header').style.display="none";
	}
	if ($('context')) {
		$('context').style.display="none";
	}
	if ($('tabs')) {
		$('tabs').style.display="none";
	}
	if ($('netbuttons')) {
		$('netbuttons').style.display="none";
	}
	
	if ($('content')) {
		$('content').style.marginLeft = "10px";
	}
	if ($('sidebar-header')) {
		$('sidebar-header').style.display="none";
	}
	if ($('sidebar-footer')) {
		$('sidebar-footer').style.display="none";
	}
	if ($('sidebar-content')) {
		$('sidebar-content').style.display="none";
	}
	if ($('sidebar-open')) {
		$('sidebar-open').style.display="none";
	}
	
	resizeApplet();
}


/**
 * Called by the Applet to open the applet help
 */
function showHelp() {
    loadDialog('help', URL_ROOT+'help/help.php?subject=applet');
}

/**
 * Called by the Applet to go to the home page of the given userid
 */
function viewUserHome(userid) {
	window.location.href = URL_ROOT+"user.php?userid="+userid;
}

/**
 * Called by the Applet to go to the neightbourhood view for the given node
 */
function neighbourhoodViewFor(nodeid) {
	window.location.href = URL_ROOT+"node.php?nodeid="+nodeid+"#conn-neighbour";
}

/**
 * Called by the Applet to go to the multi connection expanded view for the given connection
 */
function showMultiConnections(connectionids) {
	loadDialog("multiconnections", URL_ROOT+"plugin/ui/showmulticonns.php?connectionids="+connectionids, 790, 450);
}

/**
 * Called by the Applet to display a ideas full details.
 */
function viewNodeDetails(nodeid) {
	loadDialog('nodedetails', URL_ROOT+"plugin/ui/nodedetails.php?nodeid="+nodeid);
}

/**
 * Called by the Applet to bookmark a node.
 */
function bookmarkNode(nodeid, nodelabel) {
	var reqUrl = SERVICE_ROOT + "&method=addtousercache&idea="+nodeid;
	new Ajax.Request(reqUrl, { method:'get',
		onSuccess: function(transport){
			var json = transport.responseText.evalJSON();
   			if(json.error) {
   				alert(json.error[0].message);
   				return;
   			} else {  
   				fadeMessage("Bookmark added for<br><br>"+nodelabel); 				
   			} 
   		}				      			     	   			
  	});
}

/**
 * Called by the Applet to connect an idea.
 */
function connectNode(nodeid, nodelabel) {
	loadDialog('createconn',URL_ROOT + 'plugin/ui/connection.php?ideaid0='+nodeid, 790, 650);
}

/**
 * Called by the Applet to edit an idea.
 */
function editNode(nodeid) {
	loadDialog('editnode',URL_ROOT+"plugin/ui/idea.php?nodeid="+nodeid);
}

/**
 * Called by the Applet to list all ideas with the given label. 
 * This is used when a graph node represents multiple user instances of a node 
 * with the same label and the user wants to see the full list with user info etc.
 */
function searchIdea(id) {
    try {
         var newurl = URL_ROOT + "node.php?nodeid="+id+"#node-list";
       	 window.location.href = newurl;
    } catch(err) {
        //do nothing   
    }	
}

function setConnection(id) {
	loadDialog("editconn",URL_ROOT+"plugin/ui/connection.php?connid="+id, 790, 650);
}

/**
 * Called by the applet to open the Netowrk search dialog with the given node as the focal node.
 */
function showAppletNetworkSearchDialog(nodeid) {
	loadDialog('structuredsearch', URL_ROOT+"plugin/ui/structuredsearch.php?focalnodeid="+encodeURIComponent(nodeid), 790, 650);
}

function loadRun() {

	var reqUrl = SERVICE_ROOT + "&method=loadsearchagentrun&style=short&searchid="+NET_ARGS['searchid']+"&runid="+NET_ARGS['runid'];		
	new Ajax.Request(reqUrl, { method:'post',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
     			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}  
      			var conns = json.connectionset[0].connections;
       			
      			if (conns.length == 0) {
      				alert("No results found");
      			} else {
      			
	      			$('Cohere-AgentNet').prepareGraph(USER, "agent");
	      			
	      			for(var i=0; i< conns.length; i++){
	      				var c = conns[i].connection;
	      				var fN = c.from[0].cnode;
	      				var tN = c.to[0].cnode;
	      				
	      				var fnRole = c.fromrole[0].role;
	      				var fNNodeImage = "";
	      				if (fN.imagethumbnail != null && fN.imagethumbnail != "") {
	      					fNNodeImage = URL_ROOT + fN.imagethumbnail;
	      				} else if (fN.role[0].role.image != null && fN.role[0].role.image != "") {
	      					fNNodeImage = URL_ROOT + fN.role[0].role.image;
	      				}	      				
	      				
	      				var tnRole = c.torole[0].role;
	      				var tNNodeImage = "";
	      				if (tN.imagethumbnail != null && tN.imagethumbnail != "") {
	      					tNNodeImage = URL_ROOT + tN.imagethumbnail;
	      				} else if (tN.role[0].role.image != null && tN.role[0].role.image != "") {
	      					tNNodeImage = URL_ROOT + tN.role[0].role.image;
	      				}	      				
	      				
	      				//create from & to nodes
	      				$('Cohere-AgentNet').addNode(fN.nodeid, fN.name, fN.description, fN.users[0].user.userid, fN.creationdate, fN.otheruserconnections, fNNodeImage, fN.users[0].user.thumb, fN.users[0].user.name, fN.role[0].role.name);	      				
	      				$('Cohere-AgentNet').addNode(tN.nodeid, tN.name, tN.description, tN.users[0].user.userid, tN.creationdate, tN.otheruserconnections, tNNodeImage, tN.users[0].user.thumb, tN.users[0].user.name, tN.role[0].role.name);
	      				
	      				// add edge/conn
	      				$('Cohere-AgentNet').addEdge(c.connid, fN.nodeid, tN.nodeid, c.linktype[0].linktype.grouplabel, c.linktype[0].linktype.label, c.creationdate, c.userid, c.users[0].user.name, c.fromrole[0].role.name,c.torole[0].role.name, c.isNew);
	      			}
 					$('Cohere-AgentNet').displayGraph(NET_ARGS['netnodeid']);
				}
      		}
      	});
} 

loadAgentNet();