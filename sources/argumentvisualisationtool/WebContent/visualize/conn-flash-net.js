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

var USER_DEFINED_SEARCH = "User-Defined";
var SIMILARITY_SEARCH = "Similarity";
var CONTRAST_SEARCH = "Contrast";
var CONSISTENCY_SEARCH = "Consistency";
var PROOF_SEARCH = "Proof";
var PROBLEMS_SEARCH = "Problems";
var LINEAGE_SEARCH = "Lineage";
var CAUSALITY_SEARCH = "Causality";
var ANALOGY_SEARCH = "Analogy";
var USER_DEFINED_LABEL = "User Defined...";

var NODE_LABEL = "";
var NODE_ID = "";

function loadCNet(){

	var tb1 = new Element("div", {'class':'toolbarrow'});
	$("tab-content-conn").update(tb1);
	tb1.insert(displayConnectionAdd());
	tb1.insert(displayConnectionVisualisations('net'));
	tb1.insert(displaySnippetButtons(SNIPPET_CONNECTION_NET));

	var tb2 = new Element("div", {'class':'toolbarrow'});
	$("tab-content-conn").insert(tb2);

	var div2 = new Element('div', {'class':'toolbar', 'style': 'width: 99%; float:left;'});
	var innerDiv1 = new Element('div', {'style': 'float:left; padding: 2px;'});
	innerDiv1.insert("Search connection networks following links of type: ");
	div2.insert(innerDiv1);

	var selecttypes = new Element('div', {'style': 'float:left;'});
	selecttypes.insert('<span class="active compoundButton3" onClick="showLinkTypeDialog()" onkeypress="enterKeyPressed(event)" title="Select which link types to search on"><span class="leftButton3"></span><span class="middleButton3">Choose Link Types...</span><span class="rightButton3"></span></span>');
	div2.insert(selecttypes);

	var innerDiv4 = new Element('div', {'style': 'float:left; padding: 5px;'});
	innerDiv4.insert(" or ");
	div2.insert(innerDiv4);

	var linktypeinfo = new Element('div', {'style': 'float:left; padding: 2px;'});
	linktypeinfo.insert('<a href="#" onMouseOver="showLinkConnectionSearchMessage(event, \'connectionsearchhint\'); return false;" onMouseOut="hideHints(); return false;" onClick="hideHints(); return false;" onkeypress="enterKeyPressed(event)"><img src="'+URL_ROOT+'images/info.png" border="0" style="margin-top: 2px; float:left; margin-left: 5px; margin-right: 2px;" /></a>');
	linktypeinfo.insert('<div id="connectionsearchhint" class="hintRollover"><table width="350" border="0" cellpadding="1" cellspacing="0" bgcolor="#FFFED9"><tr width="350"><td width="350" align="left"><span id="connectionSearchHintMessage"></span></td></tr></table></div>');
	div2.insert(linktypeinfo);

	var innerDiv5 = new Element('div', {'style': 'float:left; padding: 2px;'});
	var choice = new Element("select", {'id': 'linktypegroups', 'onChange':'javascript:changeOptions()'});
	var option0 = new Element("option", {'value':'', 'title':'Select a link type grouping'});
	option0.insert("select");
	choice.insert(option0);
	var option8 = new Element("option", {'value':ANALOGY_SEARCH, 'title':'Search on: is analogous to, is a metaphor for'});
	option8.insert(ANALOGY_SEARCH);
	choice.insert(option8);
	var option3 = new Element("option", {'value':CONSISTENCY_SEARCH, 'title':'Search on: +, is consistent with, supports, proves, is analogous to'});
	option3.insert(CONSISTENCY_SEARCH);
	choice.insert(option3);
	var option2 = new Element("option", {'value':CONTRAST_SEARCH, 'title':'Search on: -, challenges, has counterexample, is inconsistent with, refutes'});
	option2.insert(CONTRAST_SEARCH);
	choice.insert(option2);
	var option7 = new Element("option", {'value':CAUSALITY_SEARCH, 'title':'Search on: predicts, causes'});
	option7.insert(CAUSALITY_SEARCH);
	choice.insert(option7);
	var option6 = new Element("option", {'value':LINEAGE_SEARCH, 'title':'Search on: is an example of, improves on, proves, solves a problem, uses/applies'});
	option6.insert(LINEAGE_SEARCH);
	choice.insert(option6);
	var option5 = new Element("option", {'value':PROBLEMS_SEARCH, 'title':'Search on: addresses the problem, solves the problem, has sub-problem'});
	option5.insert(PROBLEMS_SEARCH);
	choice.insert(option5);
	var option4 = new Element("option", {'value':PROOF_SEARCH, 'title':'Search on: proves, refutes'});
	option4.insert(PROOF_SEARCH);
	choice.insert(option4);
	var option1 = new Element('option', {'value':SIMILARITY_SEARCH, 'title': 'Search on: +, is an example of, improves on, is analogous to, as a metaphor for, is consistent with, improves on, uses/applies'});
	option1.insert(SIMILARITY_SEARCH);
	choice.insert(option1);

	innerDiv5.insert(choice);
	div2.insert(innerDiv5);

	var innerDiv8 = new Element('div', {'style': 'float:left; padding: 2px;'});
	var choosebutton = new Element('a', {'id':'edituserdefined', 'style':'visibility: hidden;'});
	choosebutton.insert(' edit...');
	choosebutton.href = "javascript:showLinkTypeDialog("+SELECTED_LINKTYES+");";
	innerDiv8.insert(choosebutton);
	div2.insert(innerDiv8);

	var innerDiv6b = new Element('div', {'style': 'float:left;'});

	var innerDiv6 = new Element('div', {'style': 'float:left; padding: 5px;'});
	innerDiv6.insert("  for  ");

	var innerDiv7 = new Element('div', {'style': 'float:left; padding: 2px;'});

	if (USER != null && USER != "") {
		var scopemy = new Element('input', {'id':'net-scopemy', 'type':'radio', 'name':'scope2', 'value':'my'});
		innerDiv7.insert(scopemy);
		innerDiv7.insert('My Data ');
	}

	var scopeall = new Element('input', {'id':'net-scopeall', 'type':'radio', 'name':'scope2', 'value':'all', 'checked':'checked'});
	innerDiv7.insert(scopeall);
	innerDiv7.insert('All Data ');

	innerDiv6b.insert(innerDiv6);
	innerDiv6b.insert(innerDiv7);
	div2.insert(innerDiv6b);

	div2.insert('<div style="clear: both;"></div>');

	var innerDiv6 = new Element('div', {'style': 'float:left; padding: 2px;'});
	innerDiv6.insert('Starting from idea ');
	div2.insert(innerDiv6);

	var linktypeinfo = new Element('div', {'style': 'float:left; padding-bottom: 5px;'});
	linktypeinfo.insert('<a href="#" onMouseOver="showFocusIdeaSearchMessage(event, \'focusideahint\'); return false;" onMouseOut="hideHints(); return false;" onClick="hideHints(); return false;" onkeypress="enterKeyPressed(event)"><img src="'+URL_ROOT+'images/info.png" border="0" style="margin-top: 2px; float:left; margin-left: 5px; margin-right: 5px;" /></a>');
	linktypeinfo.insert('<div id="focusideahint" class="hintRollover"><table width="350" border="0" cellpadding="1" cellspacing="0" bgcolor="#FFFED9"><tr width="350"><td width="350" align="left"><span id="focusideahintMessage"></span></td></tr></table></div>');
	div2.insert(linktypeinfo);

	var idealabel = new Element("div", {'id':'focusidealabel', 'style': 'float:left; color: #40B5B2; font-weight: bold; border: none; padding: 2px;'});
	div2.insert(idealabel);

	var innerDiv9 = new Element('div', {'style': 'float:right; padding: 2px;'});
	var submitbutton = new Element('input', {'type':'button', 'value': 'Go', 'onClick': 'loadPathSearch()'});
	innerDiv9.insert(submitbutton);
	div2.insert(innerDiv9);

	tb2.insert(div2);

	//get the width & height to fit the flash app into
	var x = $('tab-content-conn').offsetWidth - 30;
	var y = getWindowHeight() - 320;	

	var flashPath = 'visualize/conn-flash-net/LiteMap.swf';
	var installerPath = 'visualize/conn-flash-net/expressInstall.swf';
		
	var appletDiv = new Element('div', {'id':'appletDiv', 'style': 'float:left;'});
	// add <p> text to above div to above div
	//var alternateContent = "<div id='appletDiv'><p>You will need Flash and Javascript to see this content</p><p><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a></p></div>";
	$("tab-content-conn").insert(appletDiv);
	

	var flashvars = {};
	var params = {
	  allowfullscreen: "true",
	  allowscriptaccess: "always"
	};
	var attributes = {
	  id: "Cohere-FlashConnectionNet",
	  name: "Cohere-FlashConnectionNet"
	};
	swfobject.embedSWF(flashPath, "appletDiv",x, y, "10.0.0", installerPath, flashvars, params, attributes);

	//var args = Object.clone(NET_ARGS);
	loadSelectedLinkTypes();

	if (NET_ARGS['netnodeid'] != undefined &&
			NET_ARGS['netnodeid'] != null
				&& NET_ARGS['netnodeid'] != "") {

		NODE_ID = NET_ARGS['netnodeid'];
		loadNodeData(NODE_ID);
	} else if (CONTEXT == NODE_CONTEXT) {
		NODE_ID = NODE_ARGS['nodeid'];
		loadNodeData(NODE_ID);
	}

	// checkIsActive(); // Flash will call for data when it's ready

	// Work around for IE bug.
	// This call actually makes it paint the selection.
	if (USER != null && USER != "" && NET_ARGS['netscope'] == "my") {
		scopemy.checked = true;
	} else {
		scopeall.checked = true;
	}
}

/**
 * If link types have been selected reflect this in the display.
 */
function loadSelectedLinkTypes() {
	if (NET_ARGS['netq'] != undefined &&
			NET_ARGS['netq'] != null
				&& NET_ARGS['netq'] != "") {

		SELECTED_LINKTYES = NET_ARGS['netq'];
		if (SELECTED_LINKTYES == "+,is an example of,improves on,is analogous to,as a metaphor for,is consistent with,improves on,uses/applies") {
			setSelectedValue(SIMILARITY_SEARCH);
		} else if (SELECTED_LINKTYES == "-,challenges,has counterexample,is inconsistent with,refutes") {
			setSelectedValue(CONTRAST_SEARCH);
		} else if (SELECTED_LINKTYES == "+,is consistent with,supports,proves,is analogous to") {
			setSelectedValue(CONSISTENCY_SEARCH);
		} else if (SELECTED_LINKTYES == "proves,refutes") {
			setSelectedValue(PROOF_SEARCH);
		} else if (SELECTED_LINKTYES == "addresses the problem,solves the problem,has sub-problem") {
			setSelectedValue(PROBLEMS_SEARCH);
		} else if (SELECTED_LINKTYES == "is an example of,improves on,proves,solves a problem,uses/applies") {
			setSelectedValue(LINEAGE_SEARCH);
		} else if (SELECTED_LINKTYES == "predicts,causes") {
			setSelectedValue(CAUSALITY_SEARCH);
		} else if (SELECTED_LINKTYES == "is analogous to,is a metaphor for") {
			setSelectedValue(ANALOGY_SEARCH);
		}
	}
}

/**
 * Select the given option in the select list.
 */
function setSelectedValue(selection) {
 	var options = $('linktypegroups').options;
	for (var itemIndex = 0; itemIndex < options.length; itemIndex++) {
		if (options[itemIndex].value == selection) {
			$('linktypegroups').option[itemIndex].selected = true;
		}
	}
}

/**
 * Display the Connection Net link search hint.
 */
function showLinkConnectionSearchMessage(evt, panelName) {

 	var event = evt || window.event;
	var thing = event.target || event.srcElement;

	$("connectionSearchHintMessage").innerHTML="";
	var sometext = document.createTextNode("These are examples of named Connection Searches using the default connection types we provide. You can define your own, and in the future will be able to save your own.");
	$("connectionSearchHintMessage").appendChild(sometext);

	showHint(event, panelName, 30, -40);
}

/**
 * Display the Connection Net focus idea search hint.
 */
function showFocusIdeaSearchMessage(evt, panelName) {

 	var event = evt || window.event;
	var thing = event.target || event.srcElement;

	$("focusideahintMessage").innerHTML="";
	var sometext = document.createTextNode("Select an idea by clicking on one in the network view below.");
	$("focusideahintMessage").appendChild(sometext);

	showHint(event, panelName, 30, -40);
}

function checkIsActive() {
	try {
		if ($('Cohere-ConnectionNet').isActive()) {
			var IE = "false";
			if (document.all) {
				IE = "true"
			}
			$('Cohere-ConnectionNet').setIsIE(IE);
			if (NET_ARGS['netnodeid'] != undefined
					&& NET_ARGS['netnodeid'] != null
						&& NET_ARGS['netnodeid'] != ""
							&& NET_ARGS['netq'] != UNDEFINED
								&& NET_ARGS['netq'] != NULL
									&& NET_ARGS['netq'] != "") {

				loadPathSearch();
			} else {
				loadAppletData();
				}
		}
	} catch(e) {
				setTimeout(checkIsActive, 1000);
		}
}

/**
  * Added by Geoff to handle Flash-Javascript interaction
  */
	var jsReady = false;
	var flashNet;

	function isReady() {
		flashNet = thisMovie('Cohere-FlashConnectionNet');
		return true; // TODO get pageInit called from BODY onload function
		// return jsReady;
	}

	function pageInit() {
		 jsReady = true;
	}

	function thisMovie(movieName) {
		 if (navigator.appName.indexOf("Microsoft") != -1) {
				 return window[movieName];
		 } else {
				 return document[movieName];
		 }
	}


function loadAppletData() {

	//	flashNet.prepareGraph(USER);
	var args = Object.clone(NET_ARGS);

	args["start"] = 0;
	//get all (not just the normal 20 max)
	args["max"] = $('conn-list-count').childNodes[0].nodeValue;
	//request to get the current connections

	var reqUrl = SERVICE_ROOT + "&method=getconnectionsby" + CONTEXT + "&" + Object.toQueryString(args);

	flashNet.prepareGraph(USER, SESSIONID, "&method=getconnectionsby" + CONTEXT + "&" + Object.toQueryString(args));
	return;

	// alert(reqUrl);
	new Ajax.Request(reqUrl, { method:'get',
				onSuccess: function(transport){
					var json = transport.responseText.evalJSON();

					if(json.error){
						alert(json.error[0].message);
						return;
					}
					alert(json.connectionset[0].connections.length);
					var conns = json.connectionset[0].connections;
					// alert("FlashNet" + flashNet);

					if (conns.length > 0) {
						for(var i=0; i< conns.length; i++){
							var c = conns[i].connection;
							var fN = c.from[0].cnode;
							var tN = c.to[0].cnode;
							//create from & to nodes

							flashNet.addNode(fN.nodeid, fN.name, fN.description, fN.users[0].user.userid, fN.creationdate);
							flashNet.addNode(tN.nodeid, tN.name, tN.description, tN.users[0].user.userid, tN.creationdate);
							// add edge/conn
							flashNet.addEdge(c.connid, fN.nodeid, tN.nodeid, c.linktype[0].linktype.grouplabel, c.linktype[0].linktype.label, c.creationdate, c.userid, c.fromrole[0].role.name,c.torole[0].role.name);
						}
					flashNet.displayGraph(NODE_ID);
				}
					}
				});
}


/**
 * Called by the Applet to display a ideas full details.
 */
function viewNodeDetails(nodeid) {
	loadDialog('nodedetails', URL_ROOT+"plugin/ui/nodedetails.php?nodeid="+nodeid);
}

/**
 * Called by the Applet to connect an idea.
 */
function connectNode(idea0, idea1) {
//	addToConnectionForm(nodelabel);

	loadDialog('createconn',URL_ROOT + 'plugin/ui/connection.php?idea0='+encodeURIComponent(idea0) + "&idea1="+encodeURIComponent(idea1));
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

/**
 * Called by the Applet to view the details of the node with the given id.
 */
function setIdea(id) {
	NODE_ID = id;
	loadNodeData(id);
}

function setConnection(id) {
	loadDialog("editconn",URL_ROOT+"plugin/ui/connection.php?connid="+id);
}

/*The Applet calls for deleteConnnection and copyConnection are dealt with in code in conns.js*/

function changeOptions() {
	if ($('linktypegroups').options[$('linktypegroups').selectedIndex].value == USER_DEFINED_LABEL) {
		showLinkTypeDialog(SELECTED_LINKTYES);
		$('edituserdefined').style.visibility = 'visible';
	} else {
		$('edituserdefined').style.visibility= 'hidden';
	}
}

/**
 * Called by the Applet to run a path search focused
 * on the node with the given id and the search of the given type.
 */
function runPathSearch(nodeid, type) {

	NODE_ID = nodeid;
	loadNodeData(nodeid);

	if (type == USER_DEFINED_SEARCH) {
		type = USER_DEFINED_LABEL;
	}

	var count= $('linktypegroups').options.length;
	for (var i=0; i<count; i++) {
		if ($('linktypegroups').options[i].value == type) {
			$('linktypegroups').selectedIndex = i;
		}
	}

	if (type == USER_DEFINED_LABEL) {
		showLinkTypeDialog();
	} else {
		loadPathSearch();
	}
}

function loadNodeData(nodeid) {
	var reqUrl = SERVICE_ROOT + "&method=getnode&nodeid=" + nodeid;
	new Ajax.Request(reqUrl, { method:'get',
				onSuccess: function(transport){
					var json = transport.responseText.evalJSON();
					 if(json.error){
							alert(json.error[0].message);
							return;
						}

					$('focusidealabel').innerHTML = "";
					 $('focusidealabel').insert("\""+json.cnode[0].name+"\"");
					 NODE_LABEL = json.cnode[0].name;
					 NET_ARGS['nodelabel'] = NODE_LABEL;
					 }
				});
}

function loadPathSearch() {
	if (NODE_ID == null || NODE_ID == "") {
		alert("you must select an idea first: "+NODE_ID);
		return;
	}

	var type = $('linktypegroups').options[$('linktypegroups').selectedIndex].value;
	if (type == USER_DEFINED_LABEL) {
		// leave SELECTED_LINKTYES as it was set already by the dialog.
	} else if (type == SIMILARITY_SEARCH) {
		SELECTED_LINKTYES = "+,is an example of,improves on,is analogous to,as a metaphor for,is consistent with,improves on,uses/applies";
	} else if (type == CONTRAST_SEARCH) {
		SELECTED_LINKTYES = "-,challenges,has counterexample,is inconsistent with,refutes";
	} else if (type == CONSISTENCY_SEARCH) {
		SELECTED_LINKTYES = "+,is consistent with,supports,proves,is analogous to";
	} else if (type == PROOF_SEARCH) {
		SELECTED_LINKTYES = "proves,refutes";
	} else if (type == PROBLEMS_SEARCH) {
		SELECTED_LINKTYES = "addresses the problem,solves the problem,has sub-problem";
	} else if (type == LINEAGE_SEARCH) {
		SELECTED_LINKTYES = "is an example of,improves on,proves,solves a problem,uses/applies";
	} else if (type == CAUSALITY_SEARCH) {
		SELECTED_LINKTYES = "predicts,causes";
	} else if (type == ANALOGY_SEARCH) {
		SELECTED_LINKTYES = "is analogous to,is a metaphor for";
	}

	if ((SELECTED_LINKTYES == null || SELECTED_LINKTYES == "") &&
			$('linktypegroups').selectedIndex == 0) {
		alert("You must select one or more link types to search on");
		return;
	}

	var args = {'start':'0','max':'-1'};

	var scope = 'all';
	if ($("net-scopemy")) {
		if ($("net-scopemy").checked) {
			scope = 'my';
		}
	}

	NET_ARGS['netscope'] = scope;
	NET_ARGS['netnodeid'] = NODE_ID;
	NET_ARGS['netq'] = SELECTED_LINKTYES;

	var reqUrl = SERVICE_ROOT + "&method=getconnectionsbypath&scope="+scope+"&nodeid=" + NODE_ID + "&labels="+encodeURIComponent(SELECTED_LINKTYES)+"&" + Object.toQueryString(args);
	new Ajax.Request(reqUrl, { method:'post',
				onSuccess: function(transport){
					var json = transport.responseText.evalJSON();
					 if(json.error){
							alert(json.error[0].message);
							return;
						}
						var conns = json.connectionset[0].connections;

						if (conns.length == 0) {
							alert("No matching results found");
						} else {

							$('Cohere-ConnectionNet').prepareGraph(USER);

							for(var i=0; i< conns.length; i++){
								var c = conns[i].connection;
								var fN = c.from[0].cnode;
								var tN = c.to[0].cnode;
								//create from & to nodes
								$('Cohere-ConnectionNet').addNode(fN.nodeid, fN.name, fN.description, fN.users[0].user.userid, fN.creationdate);
								$('Cohere-ConnectionNet').addNode(tN.nodeid, tN.name, tN.description, tN.users[0].user.userid, tN.creationdate);
								// add edge/conn
								$('Cohere-ConnectionNet').addEdge(c.connid, fN.nodeid, tN.nodeid, c.linktype[0].linktype.grouplabel, c.linktype[0].linktype.label, c.creationdate, c.userid, c.fromrole[0].role.name,c.torole[0].role.name);
							}

					$('Cohere-ConnectionNet').displayGraph(NODE_ID);
				}
					}
				});
}

loadCNet();