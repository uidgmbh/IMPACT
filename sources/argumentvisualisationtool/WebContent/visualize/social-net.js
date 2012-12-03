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

function loadSocialNet() {
	
	var tb2 = new Element("div", {'id':'svnmessagediv','class':'toolbarrow'});	
	

	var link = new Element("a", {'id':'expandsvnlink', 'title':'Enlarge/Reduce Map', 'style':'visibility:hidden;cursor:pointer'});
	link.insert('<span id="linkbuttonsvn">Enlarge Map</span>');
	Event.observe(link,"click", function() {	
		if ($('header').style.display == "none") {
			smallScreenApplet('silly');
			$('linkbuttonsvn').update('Enlarge Map');
		} else {
			fullScreenApplet('silly');
			$('linkbuttonsvn').update('Reduce Map');
		}
	});  
	
	tb2.insert(link);

	var view = new Element("a", {'id':'viewdetailsvnlink', 'title':"Open the person's home page currently selected person", 'style':'margin-left: 30px;cursor:pointer; visibility:hidden;'});
	view.insert('<span id="viewbuttons">Explore Selected Person</span>');
	Event.observe(view,"click", function() {	
		if ($('Cohere-SocialNet').isActive()){
			try {			
				var userid = $('Cohere-SocialNet').getSelectedUser();
				if (userid != "") {
					viewUserHome(userid);
				} else {
					alert("Cannot retrieve required information from Map");
				}
			} catch(err) {alert("err:"+err);}
		}
	});     
	tb2.insert(view);

	var view2 = new Element("a", {'id':'viewusersvnlink', 'title':'Show all connections for the selected link', 'style':'margin-left: 30px;cursor:pointer; visibility:hidden;'});
	view2.insert('<span id="viewbuttons">Explore Selected Link</span>');
	Event.observe(view2,"click", function() {	
		if ($('Cohere-SocialNet').isActive()){
			try {			
				var connectionids = $('Cohere-SocialNet').getSelectedConnectionIDs();
				if (connectionids != "") {
					showMultiConnections(connectionids);
				} else {
					alert("Cannot retrieve required information from Map");
				}
			} catch(err) {alert("err:"+err.description);}
		}
	});     
	tb2.insert(view2);

	var messagearea = new Element("div", {'id':'svnmessage','class':'toolbitem'});	
	tb2.insert(messagearea);

	$("tab-content-svn").update(tb2);

	if ($('Cohere-SocialNet')){
		$('Cohere-SocialNet').stop();
		$('Cohere-SocialNet').destroy();
		$("tab-content-svn").innerHTML = "";
	}

	//get applet width & height 
	var x = $('tab-content-svn').offsetWidth - 30;
	var y = getWindowHeight() - 320;

	var applet = new Element('applet', 
						{	'id':'Cohere-SocialNet', 
							'name':'Cohere-SocialNet',
							'archive': 'visualize/connectionnetjars/coheresocial.jar, visualize/connectionnetjars/prefuse.jar, visualize/connectionnetjars/plugin.jar',
							'code':'cohere.CohereApplet.class',
							'width':x,
							'height':y,
							'mayscript':true,
							'scriptable':true,
							'separate_jvm':true,
							'alt':'(Your browser recognizes the APPLET element but does not run the applet.)'
						});
							
	var appletDiv = new Element('div', {'id':'appletDiv', 'style': 'float:left;'});
    appletDiv.insert(applet);    												
	$("tab-content-svn").insert(appletDiv);
	
	//event to resize
	Event.observe(window,"resize",resizeApplet);	

	loading = false;
	checkIsActive();	
}

var loading = false;

function checkIsActive() {
	try {
		if ($('Cohere-SocialNet') && $('Cohere-SocialNet').isActive()) {
			if (!loading) {
				var IE = "false"; 
				if (document.all) {
					IE = "true"
				}
				$('Cohere-SocialNet').setIsIE(IE);

				loadAppletData();	
			}
		}
	} catch(e) { 
	      setTimeout(checkIsActive, 1000);	      
    }
}


function loadAppletData() {
	
	loading = true;
		
    var loadDiv = new Element("div",{'class':'loading'});
    loadDiv.insert("<img src='"+URL_ROOT+"images/ajax-loader.gif'/>");
    loadDiv.insert("<br/>(Loading Social Network View. This may take a few minutes to calculate depending on the number of Connections in the group...)");
	
	$('svnmessage').update(loadDiv);

	$('Cohere-SocialNet').prepareGraph(USER, "network");
	
	var args = Object.clone(NET_ARGS);
	args["start"] = 0;
	args["max"] = -1;
		
	//request to get the current connections  
	var reqUrl = SERVICE_ROOT + "&method=getconnectionsby" + CONTEXT + "&style=short&max=-1&start=0&groupid="+NET_ARGS['groupid'];

	new Ajax.Request(reqUrl, { method:'post',
  			onSuccess: function(transport){
  				var json = null;
  				try {
  					json = transport.responseText.evalJSON();
  				} catch(e) {
  					alert(e);
  				} 				
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}  
      			
      			var conns = json.connectionset[0].connections;
      			//alert("connection count = "+conns.length);
      			if (conns.length > 0) {
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
	      				$('Cohere-SocialNet').addNode(fN.nodeid, fN.name, fN.description, fN.users[0].user.userid, fN.creationdate, fN.otheruserconnections, fNNodeImage, fN.users[0].user.thumb, fN.users[0].user.name, fN.role[0].role.name);	      				
	      				$('Cohere-SocialNet').addNode(tN.nodeid, tN.name, tN.description, tN.users[0].user.userid, tN.creationdate, tN.otheruserconnections, tNNodeImage, tN.users[0].user.thumb, tN.users[0].user.name, tN.role[0].role.name);
	      				
	      				// add edge/conn
	      				$('Cohere-SocialNet').addEdge(c.connid, fN.nodeid, tN.nodeid, c.linktype[0].linktype.grouplabel, c.linktype[0].linktype.label, c.creationdate, c.userid, c.users[0].user.name, c.fromrole[0].role.name,c.torole[0].role.name);
	      			}	
      				$('svnmessage').innerHTML="";	
					$('expandsvnlink').style.visibility = 'visible';    
					$('viewdetailsvnlink').style.visibility = 'visible';					
					$('viewusersvnlink').style.visibility = 'visible';					
					$('Cohere-SocialNet').displayGraph(NET_ARGS['netnodeid']);
				} else {
					$('svnmessage').innerHTML="No Connections have been made yet to calculate the Social Network from.";
				}
      		}
      	});
} 

function resizeApplet(){
	if ($('Cohere-SocialNet')) {
		if ($('header')&& $('header').style.display == "none") {
			var width = getWindowWidth();
			var height = getWindowHeight()-20;
			
			$('Cohere-SocialNet').width = width;
			$('Cohere-SocialNet').height = height;
			$('Cohere-SocialNet').setViewSize(width, height);
			$('Cohere-SocialNet').repaint();
		} else {
			var x = $('tab-content-svn').offsetWidth - 20;
			
			var y = getWindowHeight() - $('header').offsetHeight;
			
			if ($('context') && $('context').style.display != "none")
				y -= $('context').offsetHeight;
			
			if ($('tabs') && $('tabs').style.display != "none")
				y -= $('tabs').offsetHeight;

			if ($('netbuttons') && $('netbuttons').style.display != "none")
				y -= $('netbuttons').offsetHeight;

			y -= 120;

			$('Cohere-SocialNet').width = x;
			$('Cohere-SocialNet').height = y;
			$('Cohere-SocialNet').setViewSize(x, y);
			$('Cohere-SocialNet').validate();
			$('Cohere-SocialNet').repaint();        
		}
	}
}

/**
 * Called by the Applet to make applet normal size.
 */
function smallScreenApplet(silly) {

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
function fullScreenApplet(silly) {

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
	var width = getWindowWidth();
	var height = getWindowHeight()-20;

	loadDialog('userdetails', URL_ROOT+"user.php?userid="+userid, width,height);	
}

/**
 * Called by the Applet to go to the multi connection expanded view for the given connection
 */
function showMultiConnections(connectionids) {
	loadDialog("multiconnections", URL_ROOT+"plugin/ui/showmulticonns.php?connectionids="+connectionids, 790, 450);
}

loadSocialNet();