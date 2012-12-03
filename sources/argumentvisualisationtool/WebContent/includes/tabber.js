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
//this list the tabs 
var TABS = {"node":true, "web":true,"conn":true,"user":true};
var GROUP_TABS = {"node":true, "web":true,"conn":true,"user":true, /*"svn":true, "stats":true,*/ "tags":true};
var DEBATE_TABS = {"debatemap":true, "documents":true};
var ISSUE_TABS = {"conn":true};
var DOCUMENT_TABS = {"docview":true};

var DEFAULT_TAB = 'node';
var DEFAULT_VIZ = 'list';
var CURRENT_VIZ = DEFAULT_VIZ;
var CURRENT_TAB = DEFAULT_TAB;

var STATS_VIZ = {"list":true, "userstats":true};

var DATA_LOADED = {"node":false,"url":false,"conn":false,"user":false,"simile":false,"gmap":false,"usergmap":false,"stats":false,"userstats":false,"svn":false,"tags":false};
var NEGATIVE_LINKGROUP_NAME = "Negative";
var POSITIVE_LINKGROUP_NAME = "Positive";
var NEUTRAL_LINKGROUP_NAME = "Neutral";

//define events for clicking on the tabs
var stpNodeList = setTabPushed.bindAsEventListener($('tab-node-list'),'node-list');
var stpWebList = setTabPushed.bindAsEventListener($('tab-web-list'),'web-list');
var stpConnList = setTabPushed.bindAsEventListener($('tab-conn-list'),'conn-list');
var stpUserList = setTabPushed.bindAsEventListener($('tab-user-list'),'user-list');

var stpSVNList = setTabPushed.bindAsEventListener($('tab-svn-list'),'svn-list');
var stpStatsList = setTabPushed.bindAsEventListener($('tab-stats-list'),'stats-list');
var stpStatsUser = setTabPushed.bindAsEventListener($('tab-stats-list'),'stats-userstats');
var stpTagsList = setTabPushed.bindAsEventListener($('tab-tags-list'),'tags-list');

var stpConnNet = setTabPushed.bindAsEventListener($('tab-conn-list'),'conn-net');
var stpConnNeighbour = setTabPushed.bindAsEventListener($('tab-conn-list'),'conn-neighbour');
var stpNodeSimile = setTabPushed.bindAsEventListener($('tab-node-list'),'node-simile');
var stpNodeGMap = setTabPushed.bindAsEventListener($('tab-node-list'),'node-gmap');
var stpUserGMap = setTabPushed.bindAsEventListener($('tab-user-list'),'user-usergmap');

var stpDebateMap =
		setTabPushed.bindAsEventListener($('tab-debatemap'),'debatemap');
var stpDocuments =
		setTabPushed.bindAsEventListener($('tab-documents'),'documents');

var stpDocView =
		setTabPushed.bindAsEventListener($('tab-docview'), 'docview');

/**
 *	set which tab to show and load first
 */
Event.observe(window, 'load', function() {

	// add events for clicking on the tabs
if ($('tab-node')) {
	Event.observe('tab-node','click', stpNodeList);
	Event.observe('tab-web','click', stpWebList);
	Event.observe('tab-conn','click', stpConnList);
	Event.observe('tab-user','click', stpUserList);
}

	if ($('tab-stats')) {
		Event.observe('tab-stats','click', stpStatsList);
		Event.observe('tab-stats-list','click', stpStatsList);
		Event.observe('tab-stats-userstats','click', stpStatsUser);
	}
	if ($('tab-svn')) {
		Event.observe('tab-svn','click', stpSVNList);		
	}
	if ($('tab-tags')) {
		Event.observe('tab-tags','click', stpTagsList);	
	}

	if ($('tab-debatemap')) {
		Event.observe('tab-debatemap','click', stpDebateMap);
		Event.observe('tab-documents','click', stpDocuments);
	}

		if ($('tab-docview')) {
				Event.observe('tab-docview', 'click', stpDocView);
		}

	//load data counts
if ($('tab-node')) {
	loadNodeCount();
}

if ($('tab-conn')) {
	loadConnectionCount();
}

if ($('tab-web')) {
	loadUrlCount();
}

if ($('tab-user')) {
	loadUserCount();
}

		if ($('tab-debatemap')) {
				loadDocumentCount();
				setTabPushed($('tab-debatemap'), 'debatemap');
		} else if ($('tab-docview')) {
				setTabPushed($('tab-docview'), 'docview');
		} else {
				setTabPushed($('tab-'+getAnchorVal(DEFAULT_TAB + "-" + DEFAULT_VIZ)),getAnchorVal(DEFAULT_TAB + "-" + DEFAULT_VIZ));
		}
});

/**
 *	switch between tabs
 */
function setTabPushed(e) {
	var data = $A(arguments);
	var tabID = data[1];
	
	// get tab and the visualisation from the #
	var parts = tabID.split("-");
	var tab = parts[0];
  var viz = parts[1] ? parts[1] : DEFAULT_VIZ;

	if ($('Cohere-ConnectionNet')){
		$('Cohere-ConnectionNet').stop();
		$('Cohere-ConnectionNet').destroy();
		$("tab-content-conn").innerHTML = "";
	}

	var checktabs = TABS;
	if (CONTEXT == 'group')	{
		checktabs = GROUP_TABS;
	} 
	if (CONTEXT == 'debate')	{
		checktabs = DEBATE_TABS;
	}
	if (CONTEXT == 'issuenode')	{
		checktabs = ISSUE_TABS;
	}
	if (CONTEXT == 'document')	{
		checktabs = DOCUMENT_TABS;
	}

	for (i in checktabs){
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
	
	if (tab == 'stats') {	
		for (i in STATS_VIZ){
			if(viz == i){
				$("tab-"+tab+"-"+i).removeClassName("unselected");
				$("tab-"+tab+"-"+i).addClassName("current");				
				$("tab-content-"+tab+"-"+i).show();
			} else {
				$("tab-"+tab+"-"+i).removeClassName("current");
				$("tab-"+tab+"-"+i).addClassName("unselected");
				$("tab-content-"+tab+"-"+i).hide();
			}
		}
	}	
	
	if (tab == 'user') {
		USER_ARGS['orderby'] = 'lastactive';
	}
	
	//if viz not equal to the default then load up
	if(viz != DEFAULT_VIZ){
		CURRENT_VIZ = viz;
		switch(viz){
			case 'userstats':				
				if (!DATA_LOADED.userstats) {
					$('tab-stats').setAttribute("href","#stats-userstats");
					Event.stopObserving('tab-stats','click', stpStatsList);
					Event.stopObserving('tab-stats','click', stpStatsUser);
					Event.observe('tab-stats','click', stpStatsUser);
					loadUserStats();
				}
				break;
			case 'simile':
				if(!DATA_LOADED.simile){
					$('tab-node').setAttribute("href","#node-simile");
					Event.stopObserving('tab-node','click', stpNodeList);
					Event.stopObserving('tab-node','click', stpNodeSimile);
					Event.stopObserving('tab-node','click', stpNodeGMap);
					Event.observe('tab-node','click', stpNodeSimile);
					loadNodesSimile();
					DATA_LOADED.node = false;
				}
				break;
			case 'gmap':
				$('tab-node').setAttribute("href","#node-gmap");
				Event.stopObserving('tab-node','click', stpNodeList);
				Event.stopObserving('tab-node','click', stpNodeGMap);
				Event.stopObserving('tab-node','click', stpNodeSimile);
				Event.observe('tab-node','click', stpNodeGMap);
				loadNodesGMap();
				DATA_LOADED.node = false;
				break;
			case 'usergmap':
				$('tab-user').setAttribute("href","#user-usergmap");
				Event.observe('tab-user','click', stpUserGMap);
				loadUserGMap();
				DATA_LOADED.user = false;
				break;
			case 'neighbour':
					$('tab-conn').setAttribute("href","#conn-neighbour");
					Event.stopObserving('tab-conn','click', stpConnList);
					Event.stopObserving('tab-conn','click', stpConnNeighbour);
					Event.observe('tab-conn','click', stpConnNeighbour);
					loadConnectionNeighbourhood();
					DATA_LOADED.conn = false;
				break;
			case 'net':
				$('tab-conn').setAttribute("href","#conn-net");
				Event.stopObserving('tab-conn','click', stpConnList);
				Event.stopObserving('tab-conn','click', stpConnNet);
				Event.observe('tab-conn','click', stpConnNet);
				loadConnectionNet(CONTEXT,CONN_ARGS);
				DATA_LOADED.conn = false;
				break;
			default:
		}
	} else {
		CURRENT_TAB = tab;
		switch(tab){
			case 'node':
				if(!DATA_LOADED.node){
					$('tab-node').setAttribute("href","#node-list");
					Event.stopObserving('tab-node','click', stpNodeSimile);
					Event.observe('tab-node','click', stpNodeList);
					loadnodes(CONTEXT,NODE_ARGS);
				} 
				break;
			case 'web':
				if(!DATA_LOADED.url){
					$('tab-web').setAttribute("href","#web-list");
					Event.observe('tab-web','click', stpWebList);
					loadurls(CONTEXT,URL_ARGS);
				} 
				break;
			case 'conn':
				if(!DATA_LOADED.conn){
					$('tab-conn').setAttribute("href","#conn-list");
					Event.stopObserving('tab-conn','click', stpConnNet);
					Event.stopObserving('tab-conn','click', stpConnNeighbour);
					Event.observe('tab-conn','click', stpConnList);
					loadconnections(CONTEXT,CONN_ARGS);
				}
				break;
			case 'user':
				if(!DATA_LOADED.user){
					$('tab-user').setAttribute("href","#user-list");
					Event.observe('tab-user','click', stpUserList);
					loadusers(CONTEXT,USER_ARGS);
				}
				break;
			case 'stats':
				if(!DATA_LOADED.stats){
					$('tab-stats').setAttribute("href","#stats-list");
					Event.stopObserving('tab-stats','click', stpStatsList);
					Event.stopObserving('tab-stats','click', stpStatsUser);
					Event.observe('tab-stats','click', stpStatsList);
					loadstats(CONTEXT,NODE_ARGS);
				}
				break;		
			case 'svn':
				loadSocialNet(CONTEXT,CONN_ARGS);
				break;
			case 'tags':
				if(!DATA_LOADED.tags){
					$('tab-tags').setAttribute("href","#tags-list");
					Event.observe('tab-tags','click', stpTagsList);
				}
				break;
			case 'debatemap':
				if(!DATA_LOADED.node){
					$('tab-debatemap').setAttribute("href","#debatemap");
						Event.observe('tab-debatemap','click', stpDebateMap);
						loadDebateMap(CONTEXT,NODE_ARGS);
				}
				break;
			case 'documents':
				if(!DATA_LOADED.url){
					$('tab-documents').setAttribute("href","#documents");
					Event.observe('tab-documents','click', stpDocuments);
					loadDocuments(CONTEXT,URL_ARGS);
				}
				break;
			case 'docview':
				if(!DATA_LOADED.node) {
					$('tab-docview').setAttribute("href","#docview");
						Event.observe('tab-docview','click', stpDocView);
						loadDocument(CONTEXT,NODE_ARGS);
				}
				break;
		default:
		}
	}
}

/**
 *	load next/previous set of nodes
 */
function loadnodes(context,args){
	$("tab-content-node").update(getLoading("(Loading ideas...)"));
	//set method
	var reqUrl = SERVICE_ROOT + "&method=getnodesby" + context + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  			  			
  				try {
  					var json = transport.responseText.evalJSON();
  				} catch(err) {
  					console.log(err);
  				}
  				  				  				
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}      	
      			      			
      			//set the count in tab header
      			$('node-list-count').innerHTML = "";
      			$('node-list-count').insert(json.nodeset[0].totalno);
      			      			
				var tb1 = new Element("div", {'class':'toolbarrow'});
				$("tab-content-node").update(tb1);
				tb1.insert(displayNodeAdd());
										
				if(json.nodeset[0].count != 0){
					tb1.insert(displayNodeVisualisations('list'));
					var sortOpts = {date: 'Create Date', name: 'Idea', moddate: 'Modification Date',connectedness:'Connectedness'};
					tb1.insert(displaySortForm(sortOpts,args,'node'));
					Event.observe($('sort-node-options-go'),'click',reorderNodes);	
					var feed = new Element("img", 
						{'src': URL_ROOT+'images/toolbars/feed-icon-20x20.png',
						'alt': 'Get an RSS feed for these ideas',
						'title': 'Get an RSS feed for these ideas',
						'class': 'active',
						'style': 'padding-top:5px;'});
					tb1.insert(feed);
					Event.observe(feed,'click',getNodesFeed);
					
					var print = new Element("img", 
						{'src': URL_ROOT+'images/toolbars/printer.png',
						'alt': 'Print all ideas',
						'title': 'Print all ideas',
						'class': 'active',
						'style': 'padding-top:5px;padding-left:10px;'});
					tb1.insert(print);
					print.onclick = function() {printNodes()};	    												
				}

				if(json.nodeset[0].nodes.length > 0){
					var tb2 = new Element("div", {'class':'toolbarrow'});
					tb2.insert(displayNodesGroupAction());
					
					tb2.insert(displayIdeaFilters(args,'node', filterIdeas, context));
					$("tab-content-node").insert(tb2);

					new Ajax.Autocompleter("node-addtagaction", "node-addtagaction_choices", SERVICE_ROOT +"&method=gettagsbyfirstcharacters&format=list&scope=all", {paramName: "q", minChars: 1, tokens: ","});    
				}

				//display nav
				var total = json.nodeset[0].totalno;
				$("tab-content-node").insert(createNav(total,json.nodeset[0].start,json.nodeset[0].count,args,context,"nodes"));
				//display nodes
				if(json.nodeset[0].nodes.length > 0){
					displayNodes($("tab-content-node"),json.nodeset[0].nodes,parseInt(args['start'])+1);
				}
						
				//display nav
				if (total > parseInt( args["max"] )) {				
					$("tab-content-node").insert(createNav(total,json.nodeset[0].start,json.nodeset[0].count,args,context,"nodes"));
				}			
							
				//load up the users groups
				var reqUrl = SERVICE_ROOT + "&method=getmygroups";
				new Ajax.Request(reqUrl, { method:'get',
		  			onSuccess: function(transport){
		  					var json = transport.responseText.evalJSON();
			      			if(json.error){
			      				alert(json.error[0].message);
			      				return;
			      			}      
		  					// if there are any group add 'add to group' in group action drop down
		  					// and poulate group selection box.
							var groups = json.groupset[0].groups;
							if(groups.length == 0){
								return;
							}
							var opt4 = new Element("option",{'value':'addselectednodestogroup'}).insert("Add to group");
							var opt5 = new Element("option",{'value':'removeselectednodesfromgroup'}).insert("Remove from group");
							$('node-groupaction-select').insert(opt4);
							$('node-groupaction-select').insert(opt5);
							
							var gopt1 = new Element("option",{'value':'','selected':true}).insert("Select group...");
							$('node-groupaction-select-group').insert(gopt1);
						
							for(var i=0; i<groups.length; i++){
								var gopt = new Element("option",{'value':groups[i].group.groupid}).insert(groups[i].group.name);
								$('node-groupaction-select-group').insert(gopt);
							}
		    		}
		  		});	
    		}
  		});
  	DATA_LOADED.node = true;
  	DATA_LOADED.simile = false;
}


/**
 *	load next/previous set of urls
 */
function loadurls(context,args){
	$("tab-content-web").update(getLoading("(Loading websites...)"));
	//set method
	var reqUrl = SERVICE_ROOT + "&method=geturlsby" + context + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}  
      			
      			//set the count in tab header
      			$('web-list-count').innerHTML = "";
      			$('web-list-count').insert(json.urlset[0].totalno);
				
				var tb1 = new Element("div", {'class':'toolbarrow'});
				$("tab-content-web").update(tb1);
				tb1.insert(displayWebsiteAdd());
				
				if(json.urlset[0].count != 0){
					var sortOpts = {date: 'Create Date', name: 'Name', moddate: 'Modification Date',connectedness: 'Usage'};
					tb1.insert(displaySortForm(sortOpts,args,'urls'));
					Event.observe($('sort-urls-options-go'),'click',reorderURLs);
					
					if (context == "group") {
						tb1.insert(displayWebsiteFilters(args,'node', filterWebsites, context));
					}
										
					var tb2 = new Element("div", {'class':'toolbarrow'});
					tb2.insert(displayURLsGroupAction());						
					$("tab-content-web").insert(tb2);
					
				    new Ajax.Autocompleter("url-addtagaction", "url-addtagaction_choices", SERVICE_ROOT +"&method=gettagsbyfirstcharacters&scope=all&format=list", {paramName: "q", minChars: 1, tokens: ","});				
				}

				//display nav
				var total = json.urlset[0].totalno;
				$("tab-content-web").insert(createNav(total,json.urlset[0].start,json.urlset[0].count,args,context,"urls"));				
				$("tab-content-web").insert('<div style="clear: both; margin:0px; padding: 0px;"></div>');
				
				//display urls
				displayURLs($("tab-content-web"),json.urlset[0].urls,parseInt(args['start'])+1);
				
				//display nav
				if (total > parseInt( args["max"] )) {		
					$("tab-content-web").insert(createNav(total,json.urlset[0].start,json.urlset[0].count,args,context,"urls"));
				}
								
    		}
  		});
	DATA_LOADED.url = true;
}

/**
 *	load next/previous set of connections
 */
function loadconnections(context,args){		
	$("tab-content-conn").update(getLoading("(Loading connections...)"));
	
	var reqUrl = SERVICE_ROOT + "&method=getconnectionsby" + context + "&" + Object.toQueryString(args);
	
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}  
      			//set the count in tab header
      			$('conn-list-count').innerHTML = "";
      			$('conn-list-count').insert(json.connectionset[0].totalno); 		
				$("tab-content-conn").innerHTML = "";				
				
				var tb1 = new Element("div", {'class':'toolbarrow'});
				$("tab-content-conn").update(tb1);
				tb1.insert(displayConnectionAdd());
				
				if(json.connectionset[0].count != 0){
					tb1.insert(displayConnectionVisualisations('list'));

					var sortOpts = {date: 'Create Date', fromidea: 'From Idea', toidea: 'To Idea', link: 'Link Label', moddate: 'Modification Date'};
					tb1.insert(displaySortForm(sortOpts,args,'conn'));
					Event.observe($('sort-conn-options-go'),'click',reorderConnections);

					tb1.insert(displaySnippetButtons(SNIPPET_CONNECTION_LIST));
					
					var feed = new Element("img", 
						{'src': URL_ROOT+'images/toolbars/feed-icon-20x20.png',
						'alt': 'Get an RSS feed for these connections',
						'title': 'Get an RSS feed for these connections',
						'class': 'active',
						'style': 'padding-top:5px;'});
					tb1.insert(feed);
					Event.observe(feed,'click',getConnectionsFeed);																					
				}
								
				if(json.connectionset[0].connections.length > 0){
					var tb2 = new Element("div", {'class':'toolbarrow'});
					tb2.insert(displayConnsGroupAction());	

					var filterOpts = {all:'All Link Types', Positive: 'Positive', Neutral: 'Neutral', Negative: 'Negative'};
					tb2.insert(displayConnectionFilters(filterOpts,args,'conn', filterConnections, context));

					$("tab-content-conn").insert(tb2);
					
					new Ajax.Autocompleter("conn-addtagaction", "conn-addtagaction_choices", SERVICE_ROOT +"&method=gettagsbyfirstcharacters&format=list&scope=all", {paramName: "q", minChars: 1, tokens: ","});    
				}
				

				//display nav
				var total = json.connectionset[0].totalno;
				$("tab-content-conn").insert(createNav(total,json.connectionset[0].start,json.connectionset[0].count,args,context,"connections"));
				$("tab-content-conn").insert('<div style="clear: both; margin:0px; padding: 0px;"></div>');
				
				if(json.connectionset[0].connections.length > 0){
					displayConnections($("tab-content-conn"),json.connectionset[0].connections, parseInt(args['start'])+1, args['direction']);
				}
				
				//display nav
				if (total > parseInt( args["max"] )) {				
					$("tab-content-conn").insert(createNav(total,json.connectionset[0].start,json.connectionset[0].count,args,context,"connections"));
				}			
				
				//load up the users groups
				var reqUrl = SERVICE_ROOT + "&method=getmygroups";
				new Ajax.Request(reqUrl, { method:'get',
		  			onSuccess: function(transport){
		  					var json = transport.responseText.evalJSON();
			      			if(json.error){
			      				alert(json.error[0].message);
			      				return;
			      			}      
		  					// if there are any group add 'add to group' in group action drop down
		  					// and poulate group selection box.
							var groups = json.groupset[0].groups;
							if(groups.length == 0){
								return;
							}
							var opt4 = new Element("option",{'value':'addselectedconnstogroup'}).insert("Add to group");
							var opt5 = new Element("option",{'value':'removeselectedconnsfromgroup'}).insert("Remove from group");
							$('conn-groupaction-select').insert(opt4);
							$('conn-groupaction-select').insert(opt5);
							
							var gopt1 = new Element("option",{'value':'','selected':true}).insert("Select group...");
							$('conn-groupaction-select-group').insert(gopt1);
						
							for(var i=0; i<groups.length; i++){
								var gopt = new Element("option",{'value':groups[i].group.groupid}).insert(groups[i].group.name);
								$('conn-groupaction-select-group').insert(gopt);
							}
		    		}
		  		});
    		}
  		});
  		
  	DATA_LOADED.conn = true;
}

/**
 *	load next/previous set of people and groups
 */
function loadusers(context,args){

	$("tab-content-user").update(getLoading("(Loading people and groups...)"));

	var reqUrl = SERVICE_ROOT + "&method=getusersby" + context + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
			onError: function(error) {
				alert(error);
			},
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}  
       			
      			//set the count in tab header
      			$('user-list-count').innerHTML = "";
      			$('user-list-count').insert(json.userset[0].totalno); 		
				$("tab-content-user").innerHTML = "";
				
				var tb1 = new Element("div", {'class':'toolbarrow'});
				$("tab-content-user").insert(tb1);
				
				tb1.insert(displayGroupAdd());
				
				if(json.userset[0].count != 0){
					tb1.insert(displayUserVisualisations('list'));
					var sortOpts = {date: 'Create Date', name: 'Name', moddate: 'Modification Date', lastactive: 'Last Active'};
					tb1.insert(displaySortForm(sortOpts,args,'user'));
					Event.observe($('sort-user-options-go'),'click',reorderUsers);
				}	

				//display nav
				var total = json.userset[0].totalno;
				$("tab-content-user").insert(createNav(total,json.userset[0].start,json.userset[0].count,args,context,"users"));								
				$("tab-content-user").insert('<div style="clear: both; margin:0px; padding: 0px;"></div>');
							
				//display users
				displayUsers($("tab-content-user"),json.userset[0].users,parseInt(args['start'])+1);

				//display nav
				if (total > parseInt( args["max"] )) {				
					$("tab-content-user").insert(createNav(total,json.userset[0].start,json.userset[0].count,args,context,"users"));
				}
    		}
  		});
}

/**
 *	Load the Debate Map View
 */
function loadDebateMap(context,args) {

    var scriptUrl = URL_ROOT + 'includes/js/ARGVIZ.map.js';
    var map_container = 'tab-content-debatemap';

    var onClickIssue = function (d) {
        var container = this;
        var req = SERVICE_ROOT +
            "&method=getconnectionsbyissuenode" +
            "&nodeid=" + d.nodeid;

        var script = URL_ROOT +
            "includes/js/ARGVIZ.network.js";

        jQuery(container)
            .html('<div class="loading">' +
                  '<img src='+URL_ROOT+'images/ajax-loader.gif />' +
                  '</div>');

        jQuery.getScript(script, load);

        function load () {
            jQuery.getJSON(req, function (json) {
                var data =
                    ARGVIZ.network.convertCohereData(json);

                // Select those nodes for which we can find the
                // source-document where the text is taken from and make
                // those nodes clickable (such that when user clicks
                // he goes straight to the source-document). Source-Documents
                // are URLs in the Cohere data model
                var nodeSource = function (n) {
                    return n.urls &&
                        d3.select(this).each(function (n) {
                            n.urlid = n.urls[0].url.urlid;
                        })
												    .select('text')
                            .on("mouseover", function (n) {
                                this.style.textDecoration = "underline";
                                this.style.fontStyle = "italic";
                            })
                        .on("mouseout", function (n) {
                            this.style.textDecoration = "none";
                            this.style.fontStyle = "normal";
                        })
                        .on("click", function (n) {
                            var document_url = URL_ROOT +
                                "document.php?urlid=" +
                                n.urlid + "#" + n.nodeid;

                            var window_attr = 'width=800,height=600,scrollbars=yes';

                            window.open(
                                document_url, 'SourceDocument', window_attr);

                        })
                        .style("cursor", "pointer");
                    };

                var params = {
                    data: data,
                    container: container,
                    // Pass any function we want to execute on each node
                    node_fn: nodeSource
                };

                ARGVIZ.network.draw(params);
            });
        }
    };

    jQuery.getScript(scriptUrl, load);

    var addDownloadLink = function () {
        var download_href = SERVICE_ROOT +
            "&method=generatereport&nodeid=" +
            args["nodeid"];

        var download_anchor = "<a href='" +
            download_href +
            "' target=\'_blank'>" +
            "Click to download written consultation summary</a>";

        var download_span = "<span class='download-link'>(" +
            download_anchor + ")</span>";

        jQuery(".title-cell:not(:has(>span))").html(function(i, old_html) {
																												return old_html + " " + download_span;
																										});
    };

    function load() {
        var reqUrl = SERVICE_ROOT + "&method=getdebatecontents&";

        jQuery.getJSON(reqUrl, args, function (cohereJson) {
            var d3Json = ARGVIZ.map.convertCohereData(cohereJson);
            var config = {
                data: d3Json,
                container: map_container,
                onclick_handlers: {
                    "Issue": onClickIssue
                },
                after: addDownloadLink
            };

            ARGVIZ.map.draw(config);
        });
    }
}

/**
 * get the number of documents for given debate
 */
function loadDocumentCount(){
		var context = "node";
	var args = Object.clone(URL_ARGS);
	args["start"] = 0;
	//don't get any nodes
	args["max"] = 0;
	
	var reqUrl = SERVICE_ROOT + "&method=geturlsby" + context + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}      	
      			
      			//set the count in tab header
      			$('document-count').innerHTML = "";
      			$('document-count').insert(json.urlset[0].totalno);
      		}
      	});
}

// Function based on loadurls, as Documents are really Cohere URLs
function loadDocuments(context, args) {
		context = "node";
	$("tab-content-documents").update(getLoading("(Loading documents...)"));
	//set method
	var reqUrl = SERVICE_ROOT + "&method=geturlsby" + context + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}  
      			
      			//set the count in tab header
      			$('document-count').innerHTML = "";
      			$('document-count').insert(json.urlset[0].totalno);
				
				var tb1 = new Element("div", {'class':'toolbarrow'});
				$("tab-content-documents").update(tb1);
				tb1.insert(displayWebsiteAdd());
				
				if(json.urlset[0].count != 0){
					var sortOpts = {date: 'Create Date', name: 'Name', moddate: 'Modification Date',connectedness: 'Usage'};
					tb1.insert(displaySortForm(sortOpts,args,'urls'));
					Event.observe($('sort-urls-options-go'),'click',reorderURLs);
					
					if (context == "group") {
						tb1.insert(displayWebsiteFilters(args,'node', filterWebsites, context));
					}
										
					var tb2 = new Element("div", {'class':'toolbarrow'});
					tb2.insert(displayURLsGroupAction());						
					$("tab-content-documents").insert(tb2);
					
				    new Ajax.Autocompleter("url-addtagaction", "url-addtagaction_choices", SERVICE_ROOT +"&method=gettagsbyfirstcharacters&scope=all&format=list", {paramName: "q", minChars: 1, tokens: ","});				
				}

				//display nav
				var total = json.urlset[0].totalno;
				$("tab-content-documents").insert(createNav(total,json.urlset[0].start,json.urlset[0].count,args,context,"urls"));				
				$("tab-content-documents").insert('<div style="clear: both; margin:0px; padding: 0px;"></div>');
				
				//display urls
				displayDocuments($("tab-content-documents"),json.urlset[0].urls,parseInt(args['start'])+1);
				
				//display nav
				if (total > parseInt( args["max"] )) {		
					$("tab-content-documents").insert(createNav(total,json.urlset[0].start,json.urlset[0].count,args,context,"urls"));
				}
								
    		}
  		});
	DATA_LOADED.url = true;
}

/**
 *	Load the Document View. This displays policy documents (as HTML)
 *  within the PolicyCommons environment
 */
function loadDocument(context,args) {
		// Use jQuery.load() to load the external policy-document HTML
		// inside the PolicyCommons page. jQuery.load() is governed by
		// Same Origin Policy so policy-document address needs to have the
		// same domain as the PolicyCommons app. Best solution is to copy
		// policy-documents into the /uploads folder.
		jQuery('#tab-content-docview').load(args['url']);

		// If a node id is given as the anchor part of the URL then search
		// for the text in the document, go straight to that point in the
		// document and highlight the text.
		var nodeid = location.hash.replace("#", "");

		if (nodeid) {
				var req =
						SERVICE_ROOT + "&method=getnode&nodeid=" + nodeid;

				jQuery.getJSON(req, function (data) {
						jQuery('#tab-content-docview p:contains(' +
									 data.cnode[0].name	+')')
								.css("border", "2px solid red")
								.attr("id", nodeid);

						location.href = location.hash;
				});
		}

}

/**
 *	Reorder the nodes tab
 */
function reorderNodes(){
	// change the sort and orderby ARG values
	NODE_ARGS['start'] = 0;
	NODE_ARGS['sort'] = $('select-sort-node').options[$('select-sort-node').selectedIndex].value;
	NODE_ARGS['orderby'] = $('select-orderby-node').options[$('select-orderby-node').selectedIndex].value;
		
	//window.location.href=createNewURL(NODE_ARGS);

	loadnodes(CONTEXT,NODE_ARGS);
}
 
/**
 *	Reverse connection layout logic a->b = b<-a
 */
function reverseConnections(){
	if (CONN_ARGS['direction'] == null) {
		CONN_ARGS['direction'] = CONNECTION_ARROWS_LEFT;
	} else {
		if (CONN_ARGS['direction'] == CONNECTION_ARROWS_RIGHT) {
			CONN_ARGS['direction'] = CONNECTION_ARROWS_LEFT;
		} else {
			CONN_ARGS['direction'] = CONNECTION_ARROWS_RIGHT;
		}
	}	

	loadconnections(CONTEXT,CONN_ARGS);
}
 
/**
 *	Reorder the connections tab
 */
function reorderConnections(){
	// change the sort and orderby ARG values
	CONN_ARGS['start'] = 0;
	CONN_ARGS['sort'] = $('select-sort-conn').options[$('select-sort-conn').selectedIndex].value;
	CONN_ARGS['orderby'] = $('select-orderby-conn').options[$('select-orderby-conn').selectedIndex].value;
	
	loadconnections(CONTEXT,CONN_ARGS);
}

/**
 *	Filter the connections tab
 */
function filterConnections() {
	var filtergroup = $('select-filter-conn').options[$('select-filter-conn').selectedIndex].value;
	if (SELECTED_LINKTYES != "") {
		CONN_ARGS['filtergroup'] = "selected";
		CONN_ARGS['filterlist'] = SELECTED_LINKTYES;	
		NET_ARGS['filtergroup'] = "selected";
		NET_ARGS['filterlist'] = SELECTED_LINKTYES;	
	} else {
		CONN_ARGS['filtergroup'] = filtergroup;
		NET_ARGS['filtergroup'] = filtergroup;
	}

	if (SELECTED_USERS != "") {		
		CONN_ARGS['filterusers'] = SELECTED_USERS;	
		NET_ARGS['filterusers'] = SELECTED_USERS;	
	}

	if (SELECTED_NODETYPES != "") {
		CONN_ARGS['filternodetypes'] = SELECTED_NODETYPES;	
		NET_ARGS['filternodetypes'] = SELECTED_NODETYPES;	
	}

	loadconnections(CONTEXT,CONN_ARGS);
}


/**
 *	Filter the ideas tab
 */
function filterIdeas() {

	if (SELECTED_USERS != "") {
		NODE_ARGS['filterusers'] = SELECTED_USERS;	
	}
	if (SELECTED_NODETYPES != "") {
		NODE_ARGS['filternodetypes'] = SELECTED_NODETYPES;	
	}

	loadnodes(CONTEXT,NODE_ARGS);
}

/**
 *	Filter the websites tab
 */
function filterWebsites() {

	if (SELECTED_USERS != "") {
		URL_ARGS['filterusers'] = SELECTED_USERS;	
	}

	loadurls(CONTEXT,URL_ARGS);
}

/**
 *	Reorder the urls tab
 */
function reorderURLs(){
	// change the sort and orderby ARG values
	URL_ARGS['start'] = 0;
	URL_ARGS['sort'] = $('select-sort-urls').options[$('select-sort-urls').selectedIndex].value;
	URL_ARGS['orderby'] = $('select-orderby-urls').options[$('select-orderby-urls').selectedIndex].value;
	
	loadurls(CONTEXT,URL_ARGS);
}

/**
 *	Reorder the users tab
 */
function reorderUsers(){
	// change the sort and orderby ARG values
	USER_ARGS['start'] = 0;
	USER_ARGS['sort'] = $('select-sort-user').options[$('select-sort-user').selectedIndex].value;
	USER_ARGS['orderby'] = $('select-orderby-user').options[$('select-orderby-user').selectedIndex].value;
	
	loadusers(CONTEXT,USER_ARGS);
}

/**
 * show the sort form
 */
function displaySortForm(sortOpts,args,tab){   

	var sbTool = new Element("span", {'class':'toolbar'});
    sbTool.insert("Sort by: ");
    
    var selOrd = new Element("select");
    selOrd.id = "select-orderby-"+tab;
    selOrd.className = "toolbar";
    selOrd.name = "orderby";
    sbTool.insert(selOrd);
    for(var key in sortOpts){
        var opt = new Element("option");
        opt.value=key; 
        opt.insert(sortOpts[key].valueOf());
        selOrd.insert(opt); 
        if(args.orderby == key){
        	opt.selected = true;
        } 
    }
    var sortBys = {ASC: 'Ascending', DESC: 'Descending'};
    var sortBy = new Element("select");
    sortBy.id = "select-sort-"+tab;
    sortBy.className = "toolbar";
    sortBy.name = "sort";
    sbTool.insert(sortBy);
    for(var key in sortBys){
        var opt = new Element("option");
        opt.value=key; 
        opt.insert(sortBys[key]);
        sortBy.insert(opt); 
        if(args.sort == key){
        	opt.selected = true;
        } 
    }
    
    sbTool.insert('<input type="button" style="font-size: 8pt" value="Go" id="sort-'+tab+'-options-go">');
 
    if (tab == 'conn') {
		var button_reverse = new Element("a", {'href':'#conn-list', 'style':'margin-left: 10px;'}).observe('click',reverseConnections);
		var img_reverse = new Element("img", {'title':'Reverse connection display logic a->b = b<-a', 'src':'images/connection/swap.png','class':'toolbar'});
		button_reverse.insert(img_reverse);	
		sbTool.insert(button_reverse);
	} else if (tab == 'neighbourhood') {
		var button_reverse = new Element("a", {'href':'#conn-neighbour', 'style':'margin-left: 10px;'}).observe('click',reverseConnections);
		var img_reverse = new Element("img", {'title':'Reverse connection display logic a->b->c = c<-b<-a', 'src':'images/connection/swap.png','class':'toolbar'});
		button_reverse.insert(img_reverse);	
		sbTool.insert(button_reverse);
	}
	    
    return sbTool;	
}

/**
 * Called by the node type popup after node types have been selected.
 */
function setSelectedNodeTypes(types) {
	SELECTED_NODETYPES = types;
	
	if ($('select-filter-conn')) {
		$('select-filter-conn').options[0].selected = true;
	} else if ($('select-filter-neighbourhood')) {
		$('select-filter-neighbourhood').options[0].selected = true;
	} else if ($('nodetypegroups')) {
		($('nodetypegroups')).options[0].selected = true;
	}				
}


/**
 * Called by the link type popup after link types have been selected.
 */
function setSelectedLinkTypes(types) {
	SELECTED_LINKTYES = types;
	
	if ($('select-filter-conn')) {
		$('select-filter-conn').options[0].selected = true;
	} else if ($('select-filter-neighbourhood')) {
		$('select-filter-neighbourhood').options[0].selected = true;
	} else if ($('linktypegroups')) {
		($('linktypegroups')).options[0].selected = true;
	}				
}

/**
 * Called by the users popup after users have been selected.
 */
function setSelectedUsers(types) {
	SELECTED_USERS = types;
}

/**
 * show the filters on a ideas tab
 */
function displayIdeaFilters(args,tab,action,context){  
 
 	var sbTool = new Element("span", {'class':'toolbar'});
    sbTool.insert('<span class="toolbaritem">Filter by: </span>');
    
    var nodetypefilter = '<span class="innertoolbar toolbaritem" style="margin-right: 3px;">';	    
    nodetypefilter += " Idea Type ";	    
    nodetypefilter += '<span class="active"" onClick="showNodeTypeDialog(\'node\');" onkeypress="enterKeyPressed(event)" title="Select which node types to filter on">Choose...</span>';
    nodetypefilter += "</span>";	    
    sbTool.insert(nodetypefilter);	    
    
	if (context == "group") {
	    var userfilter = '<span class="innertoolbar toolbaritem" style="margin-right: 3px;">';	    
	    userfilter += " Users ";	    
	    userfilter += '<span class="active"" onClick="showUsersDialog();" onkeypress="enterKeyPressed(event)" title="Select which users to filter on">Choose...</span>';
	    userfilter += "</span>";	    
	    sbTool.insert(userfilter);	    
	}
	
    var button = new Element('input', { 'class':'toolbaritem', 'style':'margin-left: 3px; font-size: 8pt', 'type':'button', 'value':'Go', 'id':'filter-'+tab+'-options-go' });
    sbTool.insert(button); 
	Event.observe(button,'click', action);
	
    return sbTool;	
}

/**
 * show the filters on a websites tab
 */
function displayWebsiteFilters(args,tab,action,context){  
 
 	var sbTool = new Element("span", {'class':'toolbar'});
    sbTool.insert('<span class="toolbaritem">Filter by: </span>');
       
	if (context == "group") {
	    var userfilter = '<span class="innertoolbar toolbaritem" style="margin-right: 3px;">';	    
	    userfilter += " Users ";	    
	    userfilter += '<span class="active"" onClick="showUsersDialog();" onkeypress="enterKeyPressed(event)" title="Select which users to filter on">Choose...</span>';
	    userfilter += "</span>";	    
	    sbTool.insert(userfilter);	    
	}
	
    var button = new Element('input', { 'class':'toolbaritem', 'style':'margin-left: 3px; font-size: 8pt', 'type':'button', 'value':'Go', 'id':'filter-'+tab+'-options-go' });
    sbTool.insert(button); 
	Event.observe(button,'click', action);
	
    return sbTool;	
}


/**
 * show the filters on a connection tab
 */
function displayConnectionFilters(filterOpts,args,tab,action,context){  
 
 	var sbTool = new Element("span", {'class':'toolbar'});
    sbTool.insert('<span class="toolbaritem">Filter by: </span>');
    
    var nodetypefilter = '<span class="innertoolbar toolbaritem" style="margin-right: 3px;">';	    
    nodetypefilter += " Idea Type ";	    
    nodetypefilter += '<span class="active"" onClick="showNodeTypeDialog(\'conn\');" onkeypress="enterKeyPressed(event)" title="Select which node types to filter on">Choose...</span>';
    nodetypefilter += "</span>";	    
    sbTool.insert(nodetypefilter);	    
    
    var selOrdDiv = new Element("span");
    selOrdDiv.className = "innertoolbar toolbaritem";
    sbTool.insert(selOrdDiv);
    
    selOrdDiv.insert("<span> Link Type </span>");
   
    var selOrd = new Element("select");
    selOrd.id = "select-filter-"+tab;
    //selOrd.className = "toolbaritem";
     selOrd.name = "filterby";
     selOrdDiv.insert(selOrd);
    
    for(var key in filterOpts){
        var opt = new Element("option");
        opt.value=key; 
        opt.insert(filterOpts[key].valueOf());
        selOrd.insert(opt); 
        if(args.filtergroup == key){
        	opt.selected = true;
        } 
    }

    selOrdDiv.insert("<span> or </span>");
     
    selOrdDiv.insert('<span class="active" onClick="showLinkTypeDialog();" onkeypress="enterKeyPressed(event)" title="Select which link types to filter on">Choose...</span>');
    
	if (context == "group") {
	    var userfilter = '<span class="innertoolbar toolbaritem" style="margin-left: 3px;">';	    
	    userfilter += '<span style="padding-left: 3px; padding-right: 3px;"> Users </span>';	    
	    userfilter += '<span class="active"" onClick="showUsersDialog();" onkeypress="enterKeyPressed(event)" title="Select which users to filter on">Choose...</span>';
	    userfilter += "</span>";	    
	    sbTool.insert(userfilter);	    
	}
	
    var button = new Element('input', { 'class':'toolbaritem','style':'margin-left: 3px; font-size: 8pt', 'type':'button', 'value':'Go', 'id':'filter-'+tab+'-options-go' });
    sbTool.insert(button); 
	Event.observe(button,'click', action);
	
    return sbTool;	
 }

/**
 * display Nav 
 */
function createNav(total, start, count, argArray, context, type){

	var nav = new Element ("div",{'id':'page-nav', 'class':'toolbarrow', 'style':'padding-top: 8px; padding-bottom: 8px;'});
	
	var header = createNavCounter(total, start, count, type);
	nav.insert(header);

	if (total > parseInt( argArray["max"] )) {
		//previous
	    var prevSpan = new Element("span", {'id':"nav-previous"});
	    if(start > 0){
			prevSpan.update("<img title='Previous' src='"+URL_ROOT+"images/arrow-left.png' class='toolbar' style='padding-right: 0px;' />");	    
	        prevSpan.addClassName("active");
	        Event.observe(prevSpan,"click", function(){
	            var newArr = argArray;
	            newArr["start"] = parseInt(start) - newArr["max"];
	            eval("load"+type+"(context,newArr)");
	        });       
	    } else {
			prevSpan.update("<img title='No Previous' disabled src='"+URL_ROOT+"images/arrow-left-disabled.png' class='toolbar' style='padding-right: 0px;' />");	    
	        prevSpan.addClassName("inactive");   
	    }
	     
	    //pages
	    var pageSpan = new Element("span", {'id':"nav-pages"});
	    var totalPages = Math.ceil(total/argArray["max"]);
	    var currentPage = (start/argArray["max"]) + 1;
	    for (var i = 1; i<totalPages+1; i++){
	    	var page = new Element("span", {'class':"nav-page"}).insert(i);
	    	if(i != currentPage){
		    	page.addClassName("active");
		    	var newArr = Object.clone(argArray);
		    	newArr["start"] = newArr["max"] * (i-1) ;
		    	Event.observe(page,"click", Pages.next.bindAsEventListener(Pages,type,context,newArr));
	    	} else {
	    		page.addClassName("currentpage");
	    	}
	    	pageSpan.insert(page);
	    }
	    
	    //next
	    var nextSpan = new Element("span", {'id':"nav-next"});
	    if(parseInt(start)+parseInt(count) < parseInt(total)){
		    nextSpan.update("<img title='Next' src='"+URL_ROOT+"images/arrow-right.png' class='toolbar' style='padding-right: 0px;' />");
	        nextSpan.addClassName("active");
	        Event.observe(nextSpan,"click", function(){
	            var newArr = argArray;
	            newArr["start"] = parseInt(start) + parseInt(newArr["max"]);
	            eval("load"+type+"(context, newArr)");
	        });     
	    } else {
		    nextSpan.update("<img title='No Next' src='"+URL_ROOT+"images/arrow-right-disabled.png' class='toolbar' style='padding-right: 0px;' />");
	        nextSpan.addClassName("inactive");    
	    }
	    
	    if( start>0 || (parseInt(start)+parseInt(count) < parseInt(total))){
	    	nav.insert(prevSpan).insert(pageSpan).insert(nextSpan);
	    }
	}
	
	return nav;
}

/**
 * display nav header
 */
function createNavCounter(total, start, count, type){
	
    if(count != 0){
    	var objH = new Element("span",{'class':'nav'});
    	var s1 = parseInt(start)+1;
    	var s2 = parseInt(start)+parseInt(count);
        objH.insert("<b>" + s1 + " to " + s2 + " (" + total + ")</b>");
    } else {
    	var objH = new Element("span");
        if (CONTEXT == 'user' &&  USER_ARGS.userid == USER){
        	switch(type){
        		case 'connections':	
        			objH.insert("<p><b>You haven't made any connections yet, <a href='javascript:loadDialog(\"createconn\",\""+ URL_ROOT +"plugin/ui/connection.php\", 790,650);'>why not make one?</a></b></p>");
        			objH.insert("<p><b>Need help getting started? <a href=\""+ URL_ROOT +"#screencast\">Watch our screencast</a> on how to create a connection.</b></p>");
        			break;
        		case 'nodes':
        			objH.insert("<p><b>You haven't added any ideas yet, <a href='javascript:loadDialog(\"createidea\",\""+ URL_ROOT +"plugin/ui/idea.php\");'>why not make one?</a></b></p>");
        			objH.insert("<p><b>Need help getting started? <a href=\""+ URL_ROOT +"#screencast\">Watch our screencast</a> on how to create an idea.</b></p>");
        			break;
        		case 'urls':
        			objH.insert("<p><b>You haven't added any websites yet, <a href='javascript:loadDialog(\"createweb\",\""+ URL_ROOT +"plugin/ui/url.php\");'>why not make one?</a></b></p>");
        			objH.insert("<p><b>Need help getting started? <a href=\""+ URL_ROOT +"#screencast\">Watch our screencast</a> on how to add a website.</b></p>");
        			break;
        		case 'users':
        			objH.insert("<p><b>You are not a member of any groups yet, <a href='javascript:loadDialog(\"creategroup\",\""+ URL_ROOT +"plugin/ui/addgroup.php\");'>why not start a new group?</a></b></p>");
        			
        			break;
        	}
        } else {
        	objH.insert("<b>There are no "+ type+ " to display</b>");
        }
    }
    return objH;
}

var Pages = {
	next: function(e){
		var data = $A(arguments);
		eval("load"+data[1]+"(data[2],data[3])");
	} 
};

/**
 * display node visualisation options
 */
function displayNodeVisualisations(cViz){

	var objV = new Element("span",{'class':'toolbar', 'style':'padding-top:2px; padding-bottom: 2px; height: 25px;'});
	objV.insert("Visualize as: ");
	
	if(cViz != "list"){
		var sp = new Element("a", {'href':'#node-list', 'onkeypress':'enterKeyPressed(event)'});
		var img = new Element("img", {'title':'View the idea list','class':'toolbar'});
		img.src = URL_ROOT+'images/toolbars/list-view.png';	
		sp.insert(img);
		Event.observe(sp,'click', stpNodeList);
	} else {
		var sp = new Element("span");
		var img = new Element("img", {'title':'You are viewing the idea list', 'class':'toolbar'});	
		img.src = URL_ROOT+'images/toolbars/list-view-highlighted.png';	
		sp.insert(img);
	}
	objV.insert(sp);
	
	if(cViz != "simile"){
		var sp = new Element("a", {'href':'#node-simile', 'onkeypress':'enterKeyPressed(event)'});
		var img = new Element("img", {'title':'View the idea timeline','class':'toolbar'});
		img.src = URL_ROOT+'images/toolbars/timeline.png';	
		sp.insert(img);
		Event.observe(sp,'click', stpNodeSimile);
	} else {
		var sp = new Element("span");
		var img = new Element("img", {'title':'You are viewing the idea timeline', 'class':'toolbar'});	
		img.src = URL_ROOT+'images/toolbars/timeline-highlighted.png';	
		sp.insert(img);
	}
	objV.insert(sp);
	
	if(cViz != "gmap"){
		var sp = new Element("a", {'href':'#node-gmap', 'onkeypress':'enterKeyPressed(event)'});
		var img = new Element("img", {'title':'View the idea Google map','class':'toolbar'});
		img.src = URL_ROOT+'images/toolbars/maps.png';	
		sp.insert(img);
		Event.observe(sp,'click', stpNodeGMap);
	} else {
		var sp = new Element("span");
		var img = new Element("img", {'title':'You are viewing the idea Google map', 'class':'toolbar'});	
		img.src = URL_ROOT+'images/toolbars/maps-highlighted.png';	
		sp.insert(img);
	}
		
	objV.insert(sp);
		
	return objV;
}

/**
 * display user visualisation options
 */
function displayUserVisualisations(cViz){

	var objV = new Element("span",{'class':'toolbar', 'style':'padding-top:2px; padding-bottom: 2px; height: 25px;'});
	objV.insert("Visualize as: ");
	
	if(cViz != "list"){
		var sp = new Element("a", {'href':'#user-list', 'onkeypress':'enterKeyPressed(event)'});
		var img = new Element("img", {'title':'View the user list','class':'toolbar'});
		img.src = URL_ROOT+'images/toolbars/list-view.png';	
		sp.insert(img);
		Event.observe(sp,'click', stpUserList);
	} else {
		var sp = new Element("span");
		var img = new Element("img", {'title':'You are viewing the user list', 'class':'toolbar'});	
		img.src = URL_ROOT+'images/toolbars/list-view-highlighted.png';	
		sp.insert(img);
	}
	objV.insert(sp);
	
	if(cViz != "usergmap"){
		var sp = new Element("a", {'href':'#user-usergmap', 'onkeypress':'enterKeyPressed(event)'});
		var img = new Element("img", {'title':'View the user Google map','class':'toolbar'});
		img.src = URL_ROOT+'images/toolbars/maps.png';	
		sp.insert(img);
		Event.observe(sp,'click', stpUserGMap);
	} else {
		var sp = new Element("span");
		var img = new Element("img", {'title':'You are viewing the user Google map', 'class':'toolbar'});	
		img.src = URL_ROOT+'images/toolbars/maps-highlighted.png';	
		sp.insert(img);
	}
		
	objV.insert(sp);
		
	return objV;
}

/**
 * display connection visualisation options
 */
function displayConnectionVisualisations(cViz){

	var objV = new Element("span",{'class':'toolbar', 'style':'padding-top:2px; padding-bottom: 2px; height: 25px;'});
	objV.insert("Visualize as: ");
	
	if(cViz != "list"){
		var sp = new Element("a", {'href':'#conn-list', 'onkeypress':'enterKeyPressed(event)'});
		var img = new Element("img", {'title':'View the connections list','class':'toolbar'});
		img.src = URL_ROOT+'images/toolbars/connection.png';	
		sp.insert(img);
		Event.observe(sp,'click', stpConnList);
	} else {
		var sp = new Element("span");
		var img = new Element("img", {'title':'You are viewing the connections list', 'class':'toolbar'});	
		img.src = URL_ROOT+'images/toolbars/connection-highlighted.png';	
		sp.insert(img);
	}
	
	objV.insert(sp);
	
	if(CONTEXT == NODE_CONTEXT){
		    
	    if(cViz != "neighbour"){
			var sp = new Element("a", {'href':'#conn-neighbour', 'onkeypress':'enterKeyPressed(event)'});
			var img = new Element("img", {'title':'View the connection neighbourhood','class':'toolbar'});
			img.src = URL_ROOT+'images/toolbars/neighbourhood.png';	
			sp.insert(img);
			Event.observe(sp,'click', stpConnNeighbour);
		} else {
			var sp = new Element("span");
			var img = new Element("img", {'title':'You are viewing the connection neighbourhood', 'class':'toolbar'});	
			img.src = URL_ROOT+'images/toolbars/neighbourhood-highlighted.png';	
			sp.insert(img);
		}
		
		objV.insert(sp);	    
	}

	if(cViz != "net"){
		var sp = new Element("a", {'href':'#conn-net', 'onkeypress':'enterKeyPressed(event)'});
		var img = new Element("img", {'title':'View the connection network','class':'toolbar'});
		img.src = URL_ROOT+'images/toolbars/connection-net.png';	
		sp.insert(img);
		Event.observe(sp,'click', stpConnNet);
	} else {
			var sp = new Element("span");
			var img = new Element("img", {'title':'You are viewing the connection network', 'class':'toolbar'});	
			img.src = URL_ROOT+'images/toolbars/connection-net-highlighted.png';	
			sp.insert(img);
	}
	objV.insert(sp);

	return objV;
}

/**
 * display other odd buttons
 */
function displaySnippetButtons(type){

	var objV = new Element("span",{'class':'toolbar', 'style':'padding-top:2px; padding-bottom: 2px; height: 25px;'});
			
	objV.insert("<a href=\"javascript:showURL('"+type+"');\" title='Get the url to navigate back to this view'><img src='"+URL_ROOT+"images/toolbars/link.png' class='toolbar'/></a>");
	objV.insert("<a href=\"javascript:showSnippet('"+type+"');\" title='Get the snippet to embed this view in another website'><img src='"+URL_ROOT+"images/toolbars/snippet.png' class='toolbar' style=\"padding-right: 0px;\"/></a>");
	
	return objV;
}

/**
 * Load JS files for creating simile timeline
 */
function loadNodesSimile(){
	//dynamically load the simile js files
	var aObj = new JSONscriptRequest(URL_ROOT+"visualize/timeline_2.3.0/timeline_js/timeline-api.js");
    aObj.buildScriptTag();
    aObj.addScriptTag();
	
	var bObj = new JSONscriptRequest(URL_ROOT+"visualize/simile.js");
    bObj.buildScriptTag();
    bObj.addScriptTag();
    
    DATA_LOADED.gmap = false;
    DATA_LOADED.simile = true;
}


/**
 * Load JS files for creating google map
 */
function loadNodesGMap(){
	var bObj = new JSONscriptRequest(URL_ROOT+"visualize/gmap.js");
    bObj.buildScriptTag();
    bObj.addScriptTag();
    
    DATA_LOADED.simile = false;
    DATA_LOADED.gmap = true;
}


/**
 * Load JS files for creating google map
 */
function loadUserGMap() {
	var bObj = new JSONscriptRequest(URL_ROOT+"visualize/usergmap.js");
    bObj.buildScriptTag();
    bObj.addScriptTag();
    
    DATA_LOADED.usergmap = true;
}

/**
 * Load JS file for the group general stats
 */
function loadstats(context,args){
	var bObj = new JSONscriptRequest(URL_ROOT+"visualize/groupstats.js");
    bObj.buildScriptTag();
    bObj.addScriptTag();

    DATA_LOADED.stats = true;
}

/**
 * Load JS file for the group user stats
 */
function loadUserStats(){
	var bObj = new JSONscriptRequest(URL_ROOT+"visualize/groupuserstats.js");
    bObj.buildScriptTag();
    bObj.addScriptTag();

    DATA_LOADED.userstats = true;
}

/**
 * Load JS file for the connection neighbourhood
 */
function loadConnectionNeighbourhood(){
	var bObj = new JSONscriptRequest(URL_ROOT+"visualize/conn-neighbour.js");
    bObj.buildScriptTag();
    bObj.addScriptTag();
}

/**
 * load JS file for creating the connection network (applet)
 */
function loadConnectionNet() {

	  var tb2 = new Element("div", {'id':'connmessagediv','class':'toolbarrow'});
	  var messagearea = new Element("div", {'id':'connmessage','class':'toolbitem'});
	  tb2.insert(messagearea);

	  $("tab-content-conn").update(tb2);

    // Check whether there is the document.createElementNS method which D3
    // Library needs to create elements in SVG namespace on the fly. If method
    // isn't present then (we are probably dealing with IE so) fall back to
    // original Cohere ConnectionNet Java applet.
    var scriptUrl = (document.createElementNS) ? URL_ROOT +
        "includes/js/ARGVIZ.network.js" : URL_ROOT + "visualize/conn-net.js";

    jQuery.getScript(scriptUrl, load);

    function load() {
		    // Load the Connection Net data
        var loadDiv = new Element("div",{'class':'loading'});
        loadDiv.insert("<img src='"+URL_ROOT+"images/ajax-loader.gif'/>");
        loadDiv.insert("<br/>(Loading Connection Network View. This may take a " +
                       "few minutes depending on the number of Connections...)");

		    $('connmessage').update(loadDiv);

		    var args = Object.clone(NET_ARGS);
		    args["start"] = 0;

		    //get all (not just the normal 20 max)
		    args["max"] = -1;

		    //request to get the current connections
		    var reqUrl = SERVICE_ROOT + "&method=getconnectionsby" + CONTEXT +
		        "&style=short&";

        jQuery.getJSON(reqUrl, args, draw);
    }

    function draw(cohereJson) {
        var conns = cohereJson.connectionset[0].connections;

        if (conns.length == 0) {
            $('connmessage').innerHTML= "No Connections have been made yet.";
            return false;
        }

        $('connmessage').innerHTML="";

        if (document.createElementNS) {

		        // Open a modal dialog box (using JQuery UI plug-in) to alert user
		        // that network is being drawn. This creates a semi-transparent
		        // overlay on page that prevents user from interacting with page
		        // until drawing is complete.
		        var wait_dialog = jQuery("<div></div>")
				        .html("Drawing visualisation. This may take a few moments..."
							        +"<br /><br />"
							        +"<img src='"+URL_ROOT+"images/ajax-loader.gif'/>")
				        .css("text-align", "center")
				        .dialog({
						        modal: true,
						        draggable: false,
						        position: "center",
						        resizable: false
				        });

		        // Make semi-transparent overlay of modal dialog take up the whole
            // page.
		        jQuery(".ui-widget-overlay")
				        .css("position", "fixed")
				        .css("height", "100%");

            var d3Json = ARGVIZ.network.convertCohereData(cohereJson);
            var config = {
                data: d3Json,
                container: 'tab-content-conn',
                callback: function () { wait_dialog.dialog("destroy"); }
            }
            ARGVIZ.network.draw(config);

						// Insert Hint about how to interact with visualisation
						jQuery("#connmessage").html(
								"<em>Hint 1: Move	individual nodes, or click and grab" +
										" outside of any node to move entire map.</em>" +
										"<br />" +
										"<em>Hint 2: Use mouse-wheel or" +
										" double-click/SHIFT-double-click to zoom-in/out</em>.");
        } else {
            drawConnNetApplet(conns);

				    // let the user know that system is falling back to Java
				    // visualisation
				    $("connmessage").innerHTML = "Your browser doesn't appear to" +
			          " support SVG, so, instead you are viewing a Java-applet-based" +
			          " visualisation. Alternatively, you can try to reload the URL " +
			          "in	Firefox, Safari, Opera, or Chrome.";
        }
    }
}

/**
 * load JS file for creating the connection network (applet)
 */
function loadSocialNet(){
	var bObj = new JSONscriptRequest(URL_ROOT+"visualize/social-net.js");
    bObj.buildScriptTag();
    bObj.addScriptTag();
}

/**
 * get the number of nodes for the given context
 */
function loadNodeCount(){
	var args = Object.clone(NODE_ARGS);
	args["start"] = 0;
	//don't get any nodes
	args["max"] = 0;
	
	var reqUrl = SERVICE_ROOT + "&method=getnodesby" + CONTEXT + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}      	
      			
      			//set the count in tab header
      			$('node-list-count').innerHTML = "";
      			$('node-list-count').insert(json.nodeset[0].totalno);
      		}
      	});
}

/**
 * get the number of urls for given context
 */
function loadUrlCount(){
	var args = Object.clone(URL_ARGS);
	args["start"] = 0;
	//don't get any nodes
	args["max"] = 0;
	
	var reqUrl = SERVICE_ROOT + "&method=geturlsby" + CONTEXT + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}      	
      			
      			//set the count in tab header
      			$('web-list-count').innerHTML = "";
      			$('web-list-count').insert(json.urlset[0].totalno);
      		}
      	});
}

/**
 * Get the number of connections for given context
 */
function loadConnectionCount(){
	var args = Object.clone(CONN_ARGS);
	args["start"] = 0;
	//don't get any nodes
	args["max"] = 0;
	
	var reqUrl = SERVICE_ROOT + "&method=getconnectionsby" + CONTEXT + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}      	
      			
      			//set the count in tab header
      			$('conn-list-count').innerHTML = "";
      			$('conn-list-count').insert(json.connectionset[0].totalno);
      		}
      	});
}

/**
 * Get the number of users for given context
 */
function loadUserCount(){
	var args = Object.clone(USER_ARGS);
	args["start"] = 0;
	//don't get any nodes
	args["max"] = 0;
	
	var reqUrl = SERVICE_ROOT + "&method=getusersby" + CONTEXT + "&" + Object.toQueryString(args);

	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}      	
      			
      			//set the count in tab header
      			$('user-list-count').innerHTML = "";
      			$('user-list-count').insert(json.userset[0].totalno);
      		}
      	});
}

/**
 *	 display the group action toolbar for connections
 */
function displayConnsGroupAction(){
	var ga = new Element("span",{'id':'conn-group-action','class':'toolbar'});
			
	var sel = new Element("select",{'id':'conn-groupaction-select', 'class':'toolbaritem', 'style':'float:left;'}).observe('change',groupActionConnChange);
   	sel.className = "toolbar";

   	var opt2 = new Element("option",{'value':'deleteallselectedconns'}).insert("Delete");
	sel.insert(opt2);
	ga.insert(sel);

   	var opt2 = new Element("option",{'value':'tagallselectedconns'}).insert("Tag My connections");
	sel.insert(opt2);
	ga.insert(sel);

	var tagdiv = new Element('div',{'class':'toolbaritem', 'style':'float:left;'});
	ga.insert(tagdiv);

	var tagfield = new Element("input",{'type':'text', 'style':'margin-left:5px; width:150px', 'id':'conn-addtagaction'}).hide();
	tagdiv.insert(tagfield);

	var auto = new Element("div",{'class':'autocomplete', 'id':'conn-addtagaction_choices'});
	tagdiv.insert(auto);

	var selG = new Element("select",{'id':'conn-groupaction-select-group','class':'toolbaritem', 'style':'margin-left:5px;'}).hide();
	ga.insert(selG);
				
	var alltag = new Element('span',{'class':'active toolbaritem', 'style':'margin-left: 5px;'}).insert(" all").observe('click',selectAllConns);
	ga.insert(alltag);
	
	var bar = new Element('span',{'class':'toolbaritem'}).insert(" | ");
	ga.insert(bar);
	
	var nonetag = new Element('span',{'class':'active toolbaritem'}).insert("none ").observe('click',selectNoConns);
	ga.insert(nonetag);
			
	var gag = new Element("input",{'class':'toolbaritem', 'style':'font-size: 8pt;', 'type':'button','value':'Go'}).observe('click',groupActionConnClick);
	ga.insert(gag);
	
	return ga;	

}

/**
 *	 display the group action toolbar for nodess
 */
function displayNodesGroupAction(){
	var ga = new Element("span",{'id':'node-group-action','class':'toolbar'});

	var sel = new Element("select",{'id':'node-groupaction-select', 'class':'toolbaritem', 'style':'float:left;'}).observe('change',groupActionNodeChange);
   	sel.className = "toolbar";
	
   	var opt2 = new Element("option",{'value':'deleteallselectednodes'}).insert("Delete");
	sel.insert(opt2);

  	var opt4 = new Element("option",{'value':'tagallselectednodes'}).insert("Tag My ideas");
	sel.insert(opt4);

	ga.insert(sel);
 
	var tagdiv = new Element('div',{'class':'toolbaritem', 'style':'float:left;'});
	ga.insert(tagdiv);

	var tagfield = new Element("input",{'type':'text', 'style':'margin-left:5px; width:150px', 'id':'node-addtagaction'}).hide();
	tagdiv.insert(tagfield);

	var auto = new Element("div",{'class':'autocomplete', 'id':'node-addtagaction_choices'});
	tagdiv.insert(auto);

	var selG = new Element("select",{'id':'node-groupaction-select-group', 'class':'toolbaritem', 'style':'margin-left:5px;'}).hide();
	ga.insert(selG);

	var alltag = new Element('span',{'class':'active toolbaritem', 'style':'margin-left: 5px;'}).insert(" all").observe('click',selectAllNodes);
	ga.insert(alltag);
	
	var bar = new Element('span',{'class':'toolbaritem'}).insert(" | ");
	ga.insert(bar);
	
	var nonetag = new Element('span',{'class':'active toolbaritem'}).insert("none ").observe('click',selectNoNodes);
	ga.insert(nonetag);
		
	var gag = new Element("input",{'class':'toolbaritem', 'style':'font-size: 8pt;', 'type':'button','value':'Go'}).observe('click',groupActionNodeClick);
	
	ga.insert(gag);
	
	return ga;	
}

/**
 *	 display the group action toolbar for nodess
 */
function displayURLsGroupAction(){
	var ga = new Element("span",{'id':'url-group-action','class':'toolbar'});

	var sel = new Element("select",{'id':'url-groupaction-select', 'class':'toolbaritem', 'style':'float:left;'}).observe('change',groupActionURLChange);
   	sel.className = "toolbar";
	
  	var opt4 = new Element("option",{'value':'tagallselectedurls'}).insert("Tag My websites");
	sel.insert(opt4);

	ga.insert(sel);
 
	var tagdiv = new Element('div',{'class':'toolbaritem', 'style':'float:left;'});
	ga.insert(tagdiv);

	var tagfield = new Element("input",{'type':'text', 'style':'margin-left:5px; width:150px', 'id':'url-addtagaction'});
	tagdiv.insert(tagfield);

	var auto = new Element("div",{'class':'autocomplete', 'id':'url-addtagaction_choices'});
	tagdiv.insert(auto);
	
	var alltag = new Element('span',{'class':'active toolbaritem', 'style':'margin-left: 5px;'}).insert(" all").observe('click',selectAllURLs);
	ga.insert(alltag);

	var bar = new Element('span',{'class':'toolbaritem'}).insert(" | ");
	ga.insert(bar);
	
	var nonetag = new Element('span',{'class':'active toolbaritem'}).insert("none ").observe('click',selectNoURLs);
	ga.insert(nonetag);
		
	var gag = new Element("input",{'class':'toolbaritem', 'style':'font-size: 8pt;', 'type':'button','value':'Go'}).observe('click',groupActionURLClick);
	
	ga.insert(gag);
	
	return ga;	
}

/**
 * Add the button to open the add an idea dialog
 */
function displayNodeAdd(){
	var a = new Element("span",{'id':'add-node','class':'add'});
	if (USER != null && USER != "") {
		a.insert("<a href=\"javascript:loadDialog('createidea','"+URL_ROOT+"plugin/ui/idea.php');\" title='Add Idea'><img alt='Add Idea' src='"+URL_ROOT+"images/toolbars/plus.png' class='toolbar'/></a>");
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
		a.insert("<a href=\"javascript:loadDialog('createconn','"+URL_ROOT+"plugin/ui/connection.php', 790,650);\" title='Add Connection'><img alt='Add Connection' src='"+URL_ROOT+"images/toolbars/plus.png' class='toolbar'/></a>");
	}
	return a;
}

/**
 * Add the button to open the add a group dialog
 */
function displayGroupAdd(){
	var a = new Element("span",{'id':'add-conn','class':'add'});
	if (USER != null && USER != "") {
		a.insert("<a href=\"javascript:loadDialog('creategroup','"+URL_ROOT+"plugin/ui/addgroup.php');\" title='Add Group'><img alt='Add Group' src='"+URL_ROOT+"images/toolbars/plus.png' class='toolbar'/></a>");
	}
	return a;
}
