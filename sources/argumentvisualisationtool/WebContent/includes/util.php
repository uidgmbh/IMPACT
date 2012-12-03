<?php
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
   include_once("../config.php");

	echo "var NODE_CONTEXT = '".$CFG->NODE_CONTEXT."';";
	echo "var USER_CONTEXT = '".$CFG->USER_CONTEXT."';";
	echo "var GROUP_CONTEXT = '".$CFG->GROUP_CONTEXT."';";
	echo "var SEARCH_CONTEXT = '".$CFG->SEARCH_CONTEXT."';";
	echo "var URL_CONTEXT = '".$CFG->URL_CONTEXT."';";
	echo "var TAGSEARCH_CONTEXT = '".$CFG->TAGSEARCH_CONTEXT."';";
?>

/**
 * Variables
 */
var URL_ROOT = "<?php print $CFG->homeAddress;?>";
var SERVICE_ROOT = URL_ROOT + "api/service.php?format=json";
var SNIPPET_ROOT = URL_ROOT + "snippet/";
var USER = "<?php print $USER->userid; ?>";
var DATE_FORMAT = 'd/m/yy';
var TIME_FORMAT = 'd/m/yy - H:MM';
var SECOND_FORMAT = 'd/m/yy - H:MM:ss';
var SELECTED_LINKTYES = "";
var SELECTED_NODETYPES = "";
var SELECTED_USERS = "";
var GOOGLE_MAPS_API_KEY = "<?php print $CFG->GOOGLE_MAPS_KEY; ?>";

/* SNIPPETS */
var SNIPPET_IDEA = 0;
var SNIPPET_TRIPLE = 1;
var SNIPPET_CONNECTION_LIST = 2;
var SNIPPET_CONNECTION_FOCUS = 3;
var SNIPPET_CONNECTION_NET = 4;

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

var SIMILARITY_SEARCH_LINKS = "+,is an example of,improves on,is analogous to,as a metaphor for,is consistent with,improves on,uses/applies";
var CONTRAST_SEARCH_LINKS = "-,challenges,has counterexample,is inconsistent with,refutes";
var CONSISTENCY_SEARCH_LINKS = "+,is consistent with,supports,proves,is analogous to";
var PROOF_SEARCH_LINKS = "proves,refutes";
var PROBLEMS_SEARCH_LINKS = "addresses the problem,solves the problem,has sub-problem";
var LINEAGE_SEARCH_LINKS = "is an example of,improves on,proves,solves a problem,uses/applies";
var CAUSALITY_SEARCH_LINKS = "predicts,causes";
var ANALOGY_SEARCH_LINKS = "is analogous to,is a metaphor for";

var IE = 0;
var IE5 = 0;
var NS = 0;
var GECKO = 0;
var openpopups = new Array();

/** Store some variables about the browser being used.*/
if (document.all) {     // Internet Explorer Detected
	OS = navigator.platform;
	VER = new String(navigator.appVersion);
	VER = VER.substr(VER.indexOf("MSIE")+5, VER.indexOf(" "));
	if ((VER <= 5) && (OS == "Win32")) {
		IE5 = true;
	} else {
		IE = true;
	}
}
else if (document.layers) {   // Netscape Navigator Detected
	NS = true;
}
else if (document.getElementById) { // Netscape 6 Detected
	GECKO = true;
}

function createDefinedLinkSetSelector(name, handler, depth) {

	var choice = null;
	if (depth) {
		choice = new Element("select", {'id': name, 'name':name, 'onChange':'javascript:'+handler+'('+depth+')'});
	} else {
		choice = new Element("select", {'id': name, 'name':name, 'onChange':'javascript:'+handler+'()'});
	}
	var option0 = new Element("option", {'value':'', 'title':'Select a predefined linktype set'});
	option0.insert("Select Link Set");
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

	return choice;
}


function createDefinedLinkSetSelectorNew(name, id, handler, depth) {

	var choice = null;
	if (depth) {
		choice = new Element("select", {'id': id, 'name':name, 'onChange':'javascript:'+handler+'('+depth+')'});
	} else {
		choice = new Element("select", {'id': id, 'name':name, 'onChange':'javascript:'+handler+'()'});
	}
	var option0 = new Element("option", {'value':'', 'title':'Select a predefined linktype set'});
	option0.insert("Select Link Set");
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

	return choice;
}

function getDefinedLinkSet(type) {

	var selectedLinks = "";

	if (type == USER_DEFINED_LABEL) {
		// Do nothing, leave SELECTED_LINKTYES as it was set already by the dialog.
	} else if (type == SIMILARITY_SEARCH) {
		selectedLinks = SIMILARITY_SEARCH_LINKS;
	} else if (type == CONTRAST_SEARCH) {
		selectedLinks = CONTRAST_SEARCH_LINKS;
	} else if (type == CONSISTENCY_SEARCH) {
		selectedLinks = CONSISTENCY_SEARCH_LINKS;
	} else if (type == PROOF_SEARCH) {
		selectedLinks = PROOF_SEARCH_LINKS;
	} else if (type == PROBLEMS_SEARCH) {
		selectedLinks = PROBLEMS_SEARCH_LINKS;
	} else if (type == LINEAGE_SEARCH) {
		selectedLinks = LINEAGE_SEARCH_LINKS;
	} else if (type == CAUSALITY_SEARCH) {
		selectedLinks = CAUSALITY_SEARCH_LINKS;
	} else if (type == ANALOGY_SEARCH) {
		selectedLinks = ANALOGY_SEARCH_LINKS;
	}


	return selectedLinks;
}

function getDefinedLinkSetName(set) {
	var setname = "";
	if (set == SIMILARITY_SEARCH_LINKS) {
		setname = SIMILARITY_SEARCH;
	} else if (set == CONTRAST_SEARCH_LINKS) {
		setname = CONTRAST_SEARCH;
	} else if (set == CONSISTENCY_SEARCH_LINKS) {
		setname = CONSISTENCY_SEARCH;
	} else if (set == PROOF_SEARCH_LINKS) {
		setname = PROOF_SEARCH;
	} else if (set == PROBLEMS_SEARCH_LINKS) {
		setname = PROBLEMS_SEARCH;
	} else if (set == LINEAGE_SEARCH_LINKS) {
		setname = LINEAGE_SEARCH;
	} else if (set == CAUSALITY_SEARCH_LINKS) {
		setname = CAUSALITY_SEARCH;
	} else if (set == ANALOGY_SEARCH_LINKS) {
		setname = ANALOGY_SEARCH;
	}
	return setname;
}


/**
 * Create and return the snippet code for the given type;
 * Display snippet code in selected prompt.
 */
function showSnippet(type, id) {
	var snippet = getSnippet(type, id);
	//alert (snippet);
	if (snippet != "") {
		var message="";
		var url = "";
		var width="";
		var height="";

		if (type==SNIPPET_IDEA) {
			message = "Snippet of code to add this idea to a webpage";
		} else if (type == SNIPPET_TRIPLE) {
			message = "Snippet of code to add this connection to a webpage";
		} else {
			if (type == SNIPPET_CONNECTION_LIST) {
				message = "Snippet of code to add this connection list to a webpage\n\n";
				if (CONTEXT == NODE_CONTEXT) {
					message += "For the current node context\n";
				} else if (CONTEXT == USER_CONTEXT) {
					message += "For the current user context\n";
				} else if (CONTEXT == GROUP_CONTEXT) {
					message += "For the current group context\n";
				} else if (CONTEXT == SEARCH_CONTEXT) {
					message += "For the search: "+NODE_ARGS['q']+"\n";
					message += "with the search scope: "+NODE_ARGS['scope']+"\n";
				} else if (CONTEXT == URL_CONTEXT) {
					message += "For the current website context\n";
				} else if (CONTEXT == TAGSEARCH_CONTEXT) {
					message += "For the tag search: "+NODE_ARGS['q']+"\n";
					message += "with the search scope: "+NODE_ARGS['scope']+"\n";
				}
				//message += "Connection list starting from "+CONN_ARGS['start']+"\n";
				//message += "listing "+CONN_ARGS['max']+" connections\n";
				message += "ordered by "+CONN_ARGS['orderby']+"\n";
				message += "sorted by "+CONN_ARGS['sort']+"\n";
				if (CONN_ARGS['filtergroup'] != undefined) {
					message += "filtered by "+CONN_ARGS['filtergroup']+" link types\n";
					if (CONN_ARGS['filtergroup'] == "selected") {
						message += "( "+CONN_ARGS['filterlist']+" )\n";
					}
				}
				if (CONN_ARGS['filterusers'] != undefined && CONN_ARGS['filterusers'] != "") {
					message += "filtered by selected users \n";
				}
				message += "arrow direction is "+CONN_ARGS['direction']+"\n";
				message += "\nNote: All connections will be listed starting at item 1\n"
			} else if (type == SNIPPET_CONNECTION_FOCUS) {
				message = "Snippet of code to add this connection neighbourhood to a webpage\n\n";
				message += "Connections for '"+NEIGHBOURHOOD_ARGS['focalnode'].name+"'\n";
				message += "ordered by "+NEIGHBOURHOOD_ARGS['orderby']+"\n";
				message += "sorted by "+NEIGHBOURHOOD_ARGS['sort']+"\n";
				if (NEIGHBOURHOOD_ARGS['filtergroup'] != undefined) {
					message += "filtered by "+NEIGHBOURHOOD_ARGS['filtergroup']+" link types\n";
					if (NEIGHBOURHOOD_ARGS['filtergroup'] == "selected") {
						message += "( "+NEIGHBOURHOOD_ARGS['filterlist']+" )\n";
					}
				}
				if (!NEIGHBOURHOOD_ARGS['direction']) {
					NEIGHBOURHOOD_ARGS['direction'] = "right";
				}
				message += "arrow direction is "+NEIGHBOURHOOD_ARGS['direction']+"\n";
			} else if (type == SNIPPET_CONNECTION_NET) {
				message = "Snippet of code to add this connection network to a webpage\n\n";
				if (NET_ARGS['netnodeid']) {
					message = "Focused on: \""+NET_ARGS['nodelabel']+"\"\n";
					message += "For the links: \""+NET_ARGS['netq']+"\"\n";
					message += "with the search scope: "+NET_ARGS['netscope']+"\n";
					//alert (message);
					//exit();
				} else {
					if (CONTEXT == NODE_CONTEXT) {
						message += "For the current node context\n";
					} else if (CONTEXT == USER_CONTEXT) {
						message += "For the current user context\n";
					} else if (CONTEXT == GROUP_CONTEXT) {
						message += "For the current group context\n";
					} else if (CONTEXT == SEARCH_CONTEXT) {
						message += "For the search: "+NODE_ARGS['q']+"\n";
						message += "With the search scope: "+NODE_ARGS['scope']+"\n";
					} else if (CONTEXT == URL_CONTEXT) {
						message += "For the current website context\n";
					} else if (CONTEXT == TAGSEARCH_CONTEXT) {
						message += "For the tag search: "+NODE_ARGS['q']+"\n";
						message += "With the search scope: "+NODE_ARGS['scope']+"\n";
					}
					//alert (message);
				}
				alert (message);
			}
		}
		//alert (message);
		prompt(message, snippet);
	} else {
		alert("Snippet code could not be created");
	}
}

/**
 * Create and return the snippet code for the given type;
 */
function getSnippet(type, id) {
	var url = "";
	var width="";
	var height="";
	var args = new Array();

	if (type == SNIPPET_IDEA) {
		url = SNIPPET_ROOT+"snippet-node.php?nodeid="+id+"&snippet="+type;
		url += "&context="+CONTEXT; //needs this though not relevant at present.
		//var args = Object.clone(NODE_ARGS);
		//url += Object.toQueryString(args);
		//url += "&context="+CONTEXT;
		width="300";
		height="160";
	} else if (type == SNIPPET_TRIPLE) {
		url = SNIPPET_ROOT+"snippet-connection.php?connid="+id+"&snippet="+type;
		url += "&context="+CONTEXT; //needs this though not relevant at present.
		//var args = Object.clone(CONN_ARGS);
		//url += Object.toQueryString(args);
		//url += "&context="+CONTEXT;
		width="800";
		height="160";
	} else {
		if (type == SNIPPET_CONNECTION_LIST) {
			url = SNIPPET_ROOT+"snippet-conn-list.php?snippet="+type+"&";
			var args = Object.clone(CONN_ARGS);
			if (!args['direction']) {
				args['direction'] = "right";
			}
			url += Object.toQueryString(args);
			url += "&context="+CONTEXT;

			width="860";
			height="406";
		} else if (type == SNIPPET_CONNECTION_FOCUS) {
			url = SNIPPET_ROOT+"snippet-conn-neighbourhood.php?snippet="+type+"&";
			var args = Object.clone(NEIGHBOURHOOD_ARGS);
			if (!args['direction']) {
				args['direction'] = "right";
			}
			url += Object.toQueryString(args);
			url += "&context="+CONTEXT;

			width="1015";
			height="340";
		} else if (type == SNIPPET_CONNECTION_NET) {
			url = SNIPPET_ROOT+"snippet-conn-net.php?snippet="+type+"&";
			var args = Object.clone(NET_ARGS);
			if (!args['direction']) {
				args['direction'] = "right";
			}
			//the following modify the max number which is wrongly get
			//this is a temp fix 12.02.09 G
			if (args['max']== 20) {
				args['max'] = -1;
			}

			url += Object.toQueryString(args);
			url += "&context="+CONTEXT;

			width="666";
			height="490";
		}
	}

	var snippet = "";
	if (url != "" && width != "" && height != "") {
		snippet = '<iframe src="'+url+'" width="'+width+'" height="'+height+'" scrolling="no" frameborder="0"></iframe>';
	}

	return snippet;
}

/**
 *
 */
function showURL(type) {
	var url = getURL(type);
	var message = "";
	if (url != "") {
		if (type==SNIPPET_IDEA) {
			message = "Url for this idea";
		} else if (type == SNIPPET_TRIPLE) {
			message = "Url for this connection";
		} else {
			if (type == SNIPPET_CONNECTION_LIST) {
				message = "Url for this connection list\n\n";
				if (CONTEXT == NODE_CONTEXT) {
					message += "For the current node context\n";
				} else if (CONTEXT == USER_CONTEXT) {
					message += "For the current user context\n";
				} else if (CONTEXT == GROUP_CONTEXT) {
					message += "For the current group context\n";
				} else if (CONTEXT == SEARCH_CONTEXT) {
					message += "For the search: "+NODE_ARGS['q']+"\n";
					message += "with the search scope: "+NODE_ARGS['scope']+"\n";
				} else if (CONTEXT == URL_CONTEXT) {
					message += "For the current website context\n";
				} else if (CONTEXT == TAGSEARCH_CONTEXT) {
					message += "For the tag search: "+NODE_ARGS['q']+"\n";
					message += "with the search scope: "+NODE_ARGS['scope']+"\n";
				}
				//message += "Connection list starting from "+CONN_ARGS['start']+"\n";
				//message += "listing "+CONN_ARGS['max']+" connections\n";
				message += "ordered by "+CONN_ARGS['orderby']+"\n";
				message += "sorted by "+CONN_ARGS['sort']+"\n";

				if (CONN_ARGS['filtergroup'] != undefined) {
					message += "filtered by "+CONN_ARGS['filtergroup']+" link types\n";
					if (CONN_ARGS['filtergroup'] == "selected") {
						message += "( "+CONN_ARGS['filterlist']+" )\n";
					}
				}
				if (CONN_ARGS['filterusers'] != undefined && CONN_ARGS['filterusers'] != "") {
					message += "filtered by selected users \n";
				}
				if (!CONN_ARGS['direction']) {
					CONN_ARGS['direction'] = "right";
				}
				message += "arrow direction is "+CONN_ARGS['direction']+"\n";
				message += "\nNote: All connections will be listed starting at item 1\n"
			} else if (type == SNIPPET_CONNECTION_FOCUS) {
				message = "Url for this connection neighbourhood\n\n";
				message += "Connections for '"+NEIGHBOURHOOD_ARGS['focalnode'].name+"'\n";
				message += "ordered by "+NEIGHBOURHOOD_ARGS['orderby']+"\n";
				message += "sorted by "+NEIGHBOURHOOD_ARGS['sort']+"\n";
				if (NEIGHBOURHOOD_ARGS['filtergroup'] != undefined) {
					message += "filtered by "+NEIGHBOURHOOD_ARGS['filtergroup']+" link types\n";
					if (NEIGHBOURHOOD_ARGS['filtergroup'] == "selected") {
						message += "( "+NEIGHBOURHOOD_ARGS['filterlist']+" )\n";
					}
				}
				if (!NEIGHBOURHOOD_ARGS['direction']) {
					NEIGHBOURHOOD_ARGS['direction'] = "right";
				}
				message += "arrow direction is "+NEIGHBOURHOOD_ARGS['direction']+"\n";
			} else if (type == SNIPPET_CONNECTION_NET) {
				message = "Url for this connection network\n\n";
				if (NET_ARGS['netnodeid']) {
					message = "Focused on: \""+NET_ARGS['nodelabel']+"\"\n";
					message += "For the links: \""+NET_ARGS['netq']+"\"\n";
					message += "with the search scope: "+NET_ARGS['netscope']+"\n";
				} else {
					if (CONTEXT == NODE_CONTEXT) {
						message += "For the current node context\n";
					} else if (CONTEXT == USER_CONTEXT) {
						message += "For the current user context\n";
					} else if (CONTEXT == GROUP_CONTEXT) {
						message += "For the current group context\n";
					} else if (CONTEXT == SEARCH_CONTEXT) {
						message += "For the search: "+NODE_ARGS['q']+"\n";
						message += "With the search scope: "+NODE_ARGS['scope']+"\n";
					} else if (CONTEXT == URL_CONTEXT) {
						message += "For the current website context\n";
					} else if (CONTEXT == TAGSEARCH_CONTEXT) {
						message += "For the tag search: "+NODE_ARGS['q']+"\n";
						message += "With the search scope: "+NODE_ARGS['scope']+"\n";
					}
				}
			}
		}
		prompt(message, url);
	} else {
		alert("Url could not be created");
	}
}

/**
 * Return a url to link to Cohere for the given area and current properties.
 */
function getURL(type) {
	var url = "";
	if (CONTEXT == NODE_CONTEXT) {
		url = URL_ROOT+'node.php?';
	} else if (CONTEXT == USER_CONTEXT) {
		url = URL_ROOT+'user.php?';
	} else if (CONTEXT == SEARCH_CONTEXT) {
		url = URL_ROOT+'results.php?';
	} else if (CONTEXT == GROUP_CONTEXT) {
		url = URL_ROOT+'group.php?';
	} else if (CONTEXT == URL_CONTEXT) {
		url = URL_ROOT+'url.php?';
	} else if (CONTEXT == TAGSEARCH_CONTEXT) {
		url = URL_ROOT+'tagsearch.php?';
	}

	if (type == SNIPPET_IDEA) {
		url += Object.toQueryString(NODE_ARGS);
		url += '#node-list';
	} else if (type == SNIPPET_TRIPLE) {
		//url += Object.toQueryString(CONN_ARGS);
		// Not currently used
		//url += '#conn-list';
	} else if (type == SNIPPET_CONNECTION_LIST) {
		var args = Object.clone(CONN_ARGS);
		if (!args['direction']) {
			args['direction'] = "right";
		}
		url += Object.toQueryString(args);
		url += '#conn-list';
	} else if (type == SNIPPET_CONNECTION_FOCUS) {
		var args = Object.clone(NEIGHBOURHOOD_ARGS);
		if (!args['direction']) {
			args['direction'] = "right";
		}
		url += Object.toQueryString(args);
		url += '#conn-neighbour';
	} else if (type == SNIPPET_CONNECTION_NET) {
		var args = Object.clone(NET_ARGS);
		if (!args['direction']) {
			args['direction'] = "right";
		}
		url += Object.toQueryString(args);
		url += '#conn-net';
	}

	return url;
}

/**
 * Check to see if the enter key was pressed.
 */
function enterKeyPressed(evt) {
 	var event = evt || window.event;
	var thing = event.target || event.srcElement;

	var characterCode = document.all? window.event.keyCode:event.which;
	if(characterCode == 13) {
		thing.onclick();
	}
}

/**
 * get the anchor (#) value from the url
 */
function getAnchorVal(defVal){
    var url = document.location;
    var strippedUrl = url.toString().split("#");
    if(strippedUrl.length > 1 && strippedUrl[1] != ""){
        return strippedUrl[1];
    } else {
        return defVal;
    }
}

/**
 * create a new url based on the current one but with new arguments.
 */
function createNewURL(url, args, view){
	var newURL = "";

	// check for ? otherwise split on #
    var strippedUrl = url.toString().split("?");
    if (strippedUrl.length > 1) {
    	newURL = strippedUrl[0];
    } else {
    	newURL = (url.toString().split("#"))[0];
    }

    newURL += "?"+Object.toQueryString(args);
    newURL += "#"+view;
    return newURL;
}

/**
 * Open the linktype chooser dialog window and pre-select the passed linktypes
 */
function showNodeTypeDialog(type) {
	extra="type="+type;
	if (CONTEXT == NODE_CONTEXT) {
		extra += "&nodeid="+NODE_ARGS['nodeid'];
	} else if (CONTEXT == USER_CONTEXT) {
		extra += "&userid="+USER_ARGS['userid'];
	} else if (CONTEXT == GROUP_CONTEXT) {
		extra += "&groupid="+USER_ARGS['groupid'];
	} else if (CONTEXT == URL_CONTEXT) {
		extra += "&url="+URL_ARGS['url'];
	} else if (CONTEXT == SEARCH_CONTEXT || CONTEXT == TAGSEARCH_CONTEXT) {
		extra += "&q="+NODE_ARGS['q'];
		extra += "&scope="+NODE_ARGS['scope'];
		extra += "&tagsonly="+NODE_ARGS['tagsonly'];
	}

	loadDialog('choosenodetype', URL_ROOT+"plugin/ui/rolefilter.php?"+extra+"&nodetypes="+encodeURIComponent(SELECTED_NODETYPES));
}


/**
 * Open the linktype chooser dialog window and pre-select the passed linktypes
 */
function showLinkTypeDialog() {
	loadDialog('chooselinktype', URL_ROOT+"plugin/ui/linktypesearch.php?links="+encodeURIComponent(SELECTED_LINKTYES));
}

/**
 * Open the user chooser dialog window and pre-select the passed users
 */
function showUsersDialog() {
	loadDialog('chooseuser', URL_ROOT+"plugin/ui/userfilter.php?groupid="+CONN_ARGS['groupid']+"&selected="+encodeURIComponent(SELECTED_USERS));
}

/**
 * open page in the dialog window
 */
function loadDialog(windowName, url, width, height){

    if (width == null){
        width = 570;
    }
    if (height == null){
        height = 510;
    }

    var left = parseInt((screen.availWidth/2) - (width/2));
    var top  = parseInt((screen.availHeight/2) - (height/2));
    var props = "width="+width+",height="+height+",left="+left+",top="+top+",menubar=no,toolbar=no,scrollbars=yes,location=no,status=no,resizable=yes";
    //var props = "width="+width+",height="+height+",left="+left+",top="+top+",menubar=no,toolbar=no,scrollbars=yes,location=no,status=yes,resizable=yes";

    try {
    	var newWin = window.open(url, windowName, props);
    	if(newWin == null){
    		alert("You appear to have blocked popup windows.\n\n Please alter your browser settings to allow Cohere to open popup windows.");
    	} else {
    		newWin.focus();
    	}
    } catch(err) {
    	//IE error
    	alert(err.description);
    }
}

/**
 * close dialog
 */
function closeDialog(gotopage){

	if(gotopage === undefined){
		gotopage="node-list";
	}

	// try to refresh the parent page
	try {
		if (gotopage == "current") {
			window.opener.location.reload(true);
		} else if (gotopage == "conn-neighbour" || gotopage == "conn-net") {
			// Simon wants it to return to the neighbourhood/net view if you are creating the connection there.
			window.opener.location.reload(true);
		} else {
			var wohl = window.opener.location.href;
			if (wohl)
				var newurl = URL_ROOT + "user.php#" + gotopage;

			if(wohl == newurl){
				window.opener.location.reload(true);
			} else {
				window.opener.location.href = newurl;
			}
		}
	} catch(err) {
		//do nothing
	}
    window.close();
}

/**
 * close dialog
 */
function showPopup(pid){
    $(pid).setStyle({'display':'block'});
}

/**
 * close dialog
 */
function hidePopup(pid){
    $(pid).setStyle({'display':'none'});
}

/**
 * Toggle the given div between block and none
 */
function toggleDiv(div) {
	var div = document.getElementById(div);
	if (div.style.display == "none") {
		div.style.display = "block";
	} else {
		div.style.display = "none";
	}
}

function getWindowHeight(){
  	var viewportHeight = 500;
	if (self.innerHeight) {
		// all except Explorer
		viewportHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
	 	// Explorer 6 Strict Mode
		viewportHeight = document.documentElement.clientHeight;
	} else if (document.body)  {
		// other Explorers
		viewportHeight = document.body.clientHeight;
	}
	return viewportHeight;
}

function getWindowWidth(){
  	var viewportWidth = 500;
	if (self.innerHeight) {
		// all except Explorer
		viewportWidth = self.innerWidth;
	} else if (document.documentElement && document.documentElement.clientHeight) {
	 	// Explorer 6 Strict Mode
		viewportWidth = document.documentElement.clientWidth;
	} else if (document.body)  {
		// other Explorers
		viewportWidth = document.body.clientWidth;
	}
	return viewportWidth;
}

/**
 * Show a rollover hint popup div (when multiple lines needed).
 */
function showHint(evt, popupName, extraX, extraY) {

 	var event = evt || window.event;
	var thing = event.target || event.srcElement;

	var viewportHeight = getWindowHeight();
	var viewportWidth = getWindowWidth();
	var panel = document.getElementById(popupName);

	hideHints();
	if (GECKO) {
		//adjust for it going off the screen right or bottom.
		var x = event.clientX;
		var y = event.clientY;
		if ( (x+panel.offsetWidth) > viewportWidth) {
			x = x-(panel.offsetWidth+30);
		} else {
			x = x+10;
		}
		if ( (y+panel.offsetHeight) > viewportHeight) {
			y = y-50;
		} else {
			y = y-5;
		}

		document.getElementById(popupName).style.left = x+extraX+window.pageXOffset+"px";
		document.getElementById(popupName).style.top = y+extraY+window.pageYOffset+"px";
		document.getElementById(popupName).style.background = "#FFFED9";
		document.getElementById(popupName).style.visibility = "visible";
		openpopups.push(popupName);
	}
	else if (NS) {
		//adjust for it going off the screen right or bottom.
		var x = event.pageX;
		var y = event.pageY;
		if ( (x+panel.offsetWidth) > viewportWidth) {
			x = x-(panel.offsetWidth+30);
		} else {
			x = x+10;
		}
		if ( (y+panel.offsetHeight) > viewportHeight) {
			y = y-50;
		} else {
			y = y-5;
		}
		document.layers[popupName].moveTo(x+extraX+window.pageXOffset+"px", y+extraY+window.pageYOffset+"px");
		document.layers[popupName].bgColor = "#FFFED9";
		document.layers[popupName].visibility = "show";
		openpopups.push(popupName);
	}
	else if (IE || IE5) {
		//adjust for it going off the screen right or bottom.
		var x = event.x;
		var y = event.clientY;
		if ( (x+panel.offsetWidth) > viewportWidth) {
			x = x-(panel.offsetWidth+30);
		} else {
			x = x+10;
		}
		if ( (y+panel.offsetHeight) > viewportHeight) {
			y = y-50;
		} else {
			y = y-5;
		}

		window.event.cancelBubble = true;
		document.all[popupName].style.left = x+extraX+ document.documentElement.scrollLeft+"px";
		document.all[popupName].style.top = y+extraY+ document.documentElement.scrollTop+"px";
		document.all[popupName].style.visibility = "visible";
		openpopups[openpopups.length] = popupName;
	}
	return false;
}

function hideHints() {
	var popupname;
	for (var i = 0; i < openpopups.length; i++) {
		popupname = new String (openpopups[i]);
		if ( IE || GECKO) {
			document.getElementById(popupname).style.visibility = "hidden";
		}
		else if (NS) {
			document.layers[popupname].visibility = "hide";
		}
		else if (IE5) {
			document.all[popupname].style.visibility = "hidden";
		}
	}
	openpopups = new Array();
	return;
}

function fadeMessage(messageStr) {
	var viewportHeight = getWindowHeight();
	var viewportWidth = getWindowWidth();
	var x = (viewportWidth-300)/2;
	var y = (viewportHeight-100)/2;
	if (GECKO || NS) {
		$('message').style.left = x+window.pageXOffset+"px";
		$('message').style.top = y+window.pageYOffset+"px";
	}
	else if (IE || IE5) {
		$('message').style.left = x+ document.documentElement.scrollLeft+"px";
		$('message').style.top = y+ document.documentElement.scrollTop+"px";
	}

	$('message').update("");
	$('message').update(messageStr);
	$('message').style.display = "block";
	//$('message').show();
	fadein();
    var fade=setTimeout("fadeout()",2000);
    //var hide=setTimeout("$('message').hide()",3500);
}

function fadein(){
    new Effect.Opacity("message", {duration:1.0, from:0.0, to:1.0});
}

function fadeout(){
    new Effect.Opacity("message", {duration:1.5, from:1.0, to:0.0});
}

function getLoading(infoText){
    var loadDiv = new Element("div",{'class':'loading'});
    loadDiv.insert("<img src='"+URL_ROOT+"images/ajax-loader.gif'/>");
    loadDiv.insert("<br/>"+infoText);
    return loadDiv;
}

function nl2br (dataStr) {
	return dataStr.replace(/(\r\n|\r|\n)/g, "<br />");
}