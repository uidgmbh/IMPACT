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

var INCOMING_CONNECTION = "incoming";
var OUTGOING_CONNECTION = "outgoing";
var INCLUDE_MENU = true;
var LINKTYPELABEL_CUTOFF = 18;

var intervalID = "firsttime";
var lastScrollTop = 0;
var fromIdeas = null;
var toIdeas = null;
var mainDiv = null;
var leftVerticalLinkDivs = new Array();
var leftVerticalLinkIdeas = new Array();
var leftVerticalLinkCount = 0;
var rightVerticalLinkDivs = new Array();
var rightVerticalLinkIdeas = new Array();
var rightVerticalLinkCount = 0;

function loadCN(){		
	// So it does not load on a snippet page
	if ($("tab-content-conn")) {												
		loadNeighbourhood($("tab-content-conn"), CONTEXT, NEIGHBOURHOOD_ARGS, true);
	}
}

/**
 *	Reverse connection display logic a->b->c = c<-b<-a
 */
function reverseConnections(){	
	if (NEIGHBOURHOOD_ARGS['direction'] == null) {
		NEIGHBOURHOOD_ARGS['direction'] = CONNECTION_ARROWS_LEFT;
	} else {
		if (NEIGHBOURHOOD_ARGS['direction'] == CONNECTION_ARROWS_RIGHT) {
			NEIGHBOURHOOD_ARGS['direction'] = CONNECTION_ARROWS_LEFT;
		} else {
			NEIGHBOURHOOD_ARGS['direction'] = CONNECTION_ARROWS_RIGHT;
		}
	}	
	
	//window.location.href=createNewURL(NEIGHBOURHOOD_ARGS);
	
	loadNeighbourhood($("tab-content-conn"), CONTEXT, NEIGHBOURHOOD_ARGS, true);
}

/**
 *	Filter the connections tab
 */
function filterNeighbourhoodConnections(){
	var filtergroup = $('select-filter-neighbourhood').options[$('select-filter-neighbourhood').selectedIndex].value;
	if (SELECTED_LINKTYES != "") {
		NEIGHBOURHOOD_ARGS['filtergroup'] = "selected";
		NEIGHBOURHOOD_ARGS['filterlist'] = SELECTED_LINKTYES;	
	} else {
		NEIGHBOURHOOD_ARGS['filtergroup'] = filtergroup;
	}

	//window.location.href=createNewURL(NEIGHBOURHOOD_ARGS);

	loadNeighbourhood($("tab-content-conn"), CONTEXT, NEIGHBOURHOOD_ARGS, true);
}

/**
 *	Reorder the neighbourhood connections view
 */
function reorderNeighbourhoodConnections(){
	// change the sort and orderby ARG values
	NEIGHBOURHOOD_ARGS['start'] = 0;
	NEIGHBOURHOOD_ARGS['sort'] = $('select-sort-neighbourhood').options[$('select-sort-neighbourhood').selectedIndex].value;
	NEIGHBOURHOOD_ARGS['orderby'] = $('select-orderby-neighbourhood').options[$('select-orderby-neighbourhood').selectedIndex].value;

	//window.location.href=createNewURL(NEIGHBOURHOOD_ARGS);
	
	loadNeighbourhood($("tab-content-conn"), CONTEXT, NEIGHBOURHOOD_ARGS, true);
}

function loadNeighbourhood(objDiv, type, args, includemenu) {

	if (NODE_ARGS['nodeid']) {
		fromIdeas = null;
		toIdeas = null;
		
		//get from ideas
	    var reqUrl = SERVICE_ROOT + "&method=getconnectionsbyfromlabel&nodeid="+NODE_ARGS['nodeid']+"&"+Object.toQueryString(args);	
	    new Ajax.Request(reqUrl, { method:'get',
	            onSuccess: function(transport){
	                var json = transport.responseText.evalJSON();
	                if(json.error){
	                    fromIdeas = "error";	                    
	                    return;
	                }	                
                
                 	fromIdeas = json.connectionset[0].connections;
	            }
	        });	
		;
		
		//get to ideas
	    var reqUrl = SERVICE_ROOT + "&method=getconnectionsbytolabel&nodeid="+NODE_ARGS['nodeid']+"&"+Object.toQueryString(args);	
	    new Ajax.Request(reqUrl, { method:'get',
	            onSuccess: function(transport){
	                var json = transport.responseText.evalJSON();
	                if(json.error){
	                    toIdeas = "error";	                    
	                    return;
	                }	                
	                
                	toIdeas = json.connectionset[0].connections;
	            }
	        });	
		;
		
		mainDiv = objDiv;
		INCLUDE_MENU = includemenu;
		checkDataBack();		
	}
}

function loadFocalNodeData(objDiv, nodeid, direction, includemenu) {
	var reqUrl = SERVICE_ROOT + "&method=getnode&nodeid=" + nodeid;
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
     			if(json.error){
      				//alert(json.error[0].message);
 					mainDiv.insert("<p style=\"color: black;\">There has been a problem loading the data for this view.</p>");      				
      				return;
      			}  
      			
      			// Don't want to display sorts and visualizations or filters when there are no links.
				objDiv.innerHTML = "";  			
				
				drawGraph(objDiv, new Array(), new Array(), json.cnode[0], direction, includemenu);
      			
				centerConnectionDivs();
       		}
      	});      
}

function checkDataBack() {
	
	if (toIdeas != null && fromIdeas != null) {
		if (toIdeas != "error" && fromIdeas != "error") {

			var direction = NEIGHBOURHOOD_ARGS['direction'];
			if (direction == null) {
				direction = CONNECTION_ARROWS_RIGHT;
			}		            

			if (toIdeas.length == 0 && fromIdeas.length == 0) {
				loadFocalNodeData(mainDiv, NODE_ARGS['nodeid'], direction, INCLUDE_MENU);
			} else {
				// need this check for snippets
				if ($("tab-content-conn")) {
					var tb1 = new Element("div", {'class':'toolbarrow'});
					$("tab-content-conn").update(tb1);
					tb1.insert(displayConnectionAdd());
					tb1.insert(displayConnectionVisualisations('neighbour'));
					
					var sortOpts = {date: 'Create Date', fromidea: 'From Idea', toidea: 'To Idea', link: 'Link Label', moddate: 'Modification Date'};
					tb1.insert(displaySortForm(sortOpts,NEIGHBOURHOOD_ARGS,'neighbourhood'));
					Event.observe($('sort-neighbourhood-options-go'),'click', reorderNeighbourhoodConnections);

					tb1.insert(displaySnippetButtons(SNIPPET_CONNECTION_FOCUS));
				
					var tb2 = new Element("div", {'id':'neighbourhood-options', 'class':'toolbarrow'});
					$("tab-content-conn").insert(tb2);	
					var filterOpts = {all:'All Link Types', Positive: 'Positive', Neutral: 'Neutral', Negative: 'Negative'};
					tb2.insert(displayConnectionFilters(filterOpts,NEIGHBOURHOOD_ARGS,'neighbourhood', filterNeighbourhoodConnections));

					$("tab-content-conn").insert('<div style="clear: both; margin:0px; padding: 0px;"></div>');									
				}
				
		   		stopScrollingDetector();
		              
				if (fromIdeas.length > 0) {
					focusedNode = fromIdeas[0].connection.from[0].cnode;
				} else if (toIdeas.length > 0) {
					focusedNode = toIdeas[0].connection.to[0].cnode;
				}
		             
				drawGraph(mainDiv, fromIdeas, toIdeas, focusedNode, direction, INCLUDE_MENU);
		
		        //event to resize
				Event.observe(window,"resize", centerConnectionDivs);
		              
				startScrollingDetector();
				
				centerConnectionDivs();
			}
		} else {
 				mainDiv.insert("<p style=\"color: black;\">There has been a problem loading the data for this view.</p>");      				
		}
	} else {
	      setTimeout(checkDataBack, 1000);	      
    }
}

/**
 * Stop the scrolling detector thread for the connection focus view.
 */
function stopScrollingDetector() {
	if (intervalID != "firsttime") {
		clearInterval(intervalID);
	}
}

/**
 * Start the scrolling detector thread for the connection focus view.
 */
function startScrollingDetector() {
	lastScrollTop = document.body.scrollTop;
	intervalID = setInterval("scrollingDetector()", 250);		
}

/**
 * Process the scrolling detector request for the connection focus view.
 * Only does anything if the Connection List focus view is visible.
 */
function scrollingDetector() {
	if ($('columndiv-wide')) {
	
		var currentScroll = -1;
		if (document.documentElement && document.documentElement.scrollTop) {
			// IE6 + DTD 4.01
			currentScroll = document.documentElement.scrollTop
		} else if (document.body && document.body.scrollTop) {
			// IE5 or DTD 3.2
			currentScroll = document.body.scrollTop
		}
		
		if (currentScroll != -1 && currentScroll != lastScrollTop) {
			lastScrollTop = currentScroll;
		}	
	}
	
   	// fiddle to get vertical links to adjust as required.
   	if (leftVerticalLinkCount > 0) {
   		for (var i=0; i< leftVerticalLinkCount; i++) {
   			if (i==0) {
   				var newHeight = (leftVerticalLinkIdeas[i].offsetHeight/2)+5+"px";
   				if (leftVerticalLinkDivs[i].style.height != newHeight) {
   					leftVerticalLinkDivs[i].style.height = newHeight;
   				}
   			} else if (i == leftVerticalLinkCount-1) {
   				var newHeight = (leftVerticalLinkIdeas[i].offsetHeight/2)+4+"px";
   				if (leftVerticalLinkDivs[i].style.height != newHeight) {
   					leftVerticalLinkDivs[i].style.height = newHeight;
   				}
   			} else {
   				var newHeight = leftVerticalLinkIdeas[i].offsetHeight+6+"px";
   				if (leftVerticalLinkDivs[i].style.height != newHeight) {
   					leftVerticalLinkDivs[i].style.height = newHeight;
   				}
   			}		
   		}	
   	}	
   	if (rightVerticalLinkCount > 0) {
   		for (var i=0; i<rightVerticalLinkCount; i++) {
   			if (i==0) {
   				var newHeight = (rightVerticalLinkIdeas[i].offsetHeight/2)+5+"px";
  				if (rightVerticalLinkDivs[i].style.height != newHeight) {
   					rightVerticalLinkDivs[i].style.height = newHeight;
   				}
   			} else if (i == rightVerticalLinkCount-1) {
   				var newHeight = (rightVerticalLinkIdeas[i].offsetHeight/2)+4+"px";
   				if (rightVerticalLinkDivs[i].style.height != newHeight) {
   					rightVerticalLinkDivs[i].style.height = newHeight;
   				}
   			} else {
   				var newHeight = rightVerticalLinkIdeas[i].offsetHeight+6+"px";
   				if (rightVerticalLinkDivs[i].style.height != newHeight) {
   					rightVerticalLinkDivs[i].style.height = newHeight;
   				}
   			}		
   		}	
   	}	
   	
	centerConnectionDivs();   	
}


/**
 * Center the three divs of the extended focal connection list.
 */
function centerConnectionDivs() {

	//var viewportWidth = 0;
	var viewportHeight = 0;
	if (self.innerHeight) {
		// all except Explorer 
		//viewportWidth = self.innerWidth;	
		viewportHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
	 	// Explorer 6 Strict Mode
		//viewportWidth = document.documentElement.clientWidth;
		viewportHeight = document.documentElement.clientHeight;
	} else if (document.body)  {
		// other Explorers
		//viewportWidth = document.body.clientWidth;
		viewportHeight = document.body.clientHeight;
	}

	if ($('columndiv-wide')) {
		var curTop = 0;
		var height = 0;
		
		var div2 = document.getElementById( 'columndiv-wide' );	
		var curTop = 0;
		//var height = 0;
		if (div2.offsetParent) {
			curTop = div2.offsetTop;
			//height = div2.offsetHeight;
			while (div2 == div2.offsetParent) {
				curTop += div2.offsetTop;
			}
		}
		
		var fromHeight = $('fromConnectionsDiv').offsetHeight;		
		var focusHeight = $('focusedIdeaDiv').offsetHeight;
		var toHeight = $('toConnectionsDiv').offsetHeight;
		
		// work out which is the tallest and smallest div.
		var biggestHeight = 0;
		if (fromHeight >= focusHeight && fromHeight >= toHeight) {
			biggestHeight = fromHeight;
		} else if (focusHeight >= fromHeight && focusHeight >= toHeight) {
			biggestHeight = focusHeight;
		} else if (toHeight >= fromHeight && toHeight >= focusHeight) {
			biggestHeight = toHeight;
		}		
				
		var totalHeight = viewportHeight - curTop;	
		if (biggestHeight < totalHeight) {
			totalHeight = biggestHeight;
		}
			
		var newFromHeight = $('fromConnectionsDivSpacer').style.height;
		if (fromHeight > 0) {
			var fromTop = (totalHeight-fromHeight)/2;
			if (fromTop > 1) {
				if (fromTop+lastScrollTop < (biggestHeight-fromHeight)/2) {
					newFromHeight = fromTop+lastScrollTop+"px";
				} else {		
					newFromHeight = (biggestHeight-fromHeight)/2+"px";
				}
			} else {
				newFromHeight = "0px";		
			}
		}	
		if (newFromHeight != $('fromConnectionsDivSpacer').style.height) {
			$('fromConnectionsDivSpacer').style.height = newFromHeight;
		}	

		var newFocusHeight = $('focusedIdeaDivSpacer').style.height;
		if (focusHeight > 0) {
			fromTop = (totalHeight-focusHeight)/2;
			if (fromTop > 1) {
				if (fromTop+lastScrollTop < (biggestHeight-focusHeight)/2) {
					newFocusHeight = fromTop+lastScrollTop+"px";
				} else {
					newFocusHeight = (biggestHeight-focusHeight)/2+"px";
				}
			} else {
				newFocusHeight = "0px";		
			}
		}			
		if (newFocusHeight != $('focusedIdeaDivSpacer').style.height) {
			$('focusedIdeaDivSpacer').style.height = newFocusHeight;
		}	
		
		var newToHeight = $('toConnectionsDivSpacer').style.height;
		if (toHeight > 0) {
			fromTop = (totalHeight-toHeight)/2;
			if (fromTop > 1) {
				if (fromTop+lastScrollTop < (biggestHeight-toHeight)/2) {
					newToHeight = fromTop+lastScrollTop+"px";
				} else {
					newToHeight = (biggestHeight-toHeight)/2+"px";
				}
			} else {
				newToHeight = "0px";		
			}
		}
		if (newToHeight != $('toConnectionsDivSpacer').style.height) {
			$('toConnectionsDivSpacer').style.height = newToHeight;
		}
	}
}

/**
 * See if these connections have more than one node as the focal
 *
 * fromconns, the connections where the focal node is the 
 */
function checkForAggregateNode(focusedNode, fromconns, toconns, direction) {
	
	var count = 1;
	var connection = null;
	for (var i=0; i<fromconns.length; i++) {
		connection = fromconns[i].connection;
		if (direction == CONNECTION_ARROWS_RIGHT) {	 	
			if ( focusedNode.nodeid != connection.from[0].cnode.nodeid) {
				count++;		
			}
		} else {
			if ( focusedNode.nodeid != connection.from[0].cnode.nodeid) {
				count++;		
			}
		}
	}
	for (var i=0; i<toconns.length; i++) {
		connection = toconns[i].connection;
		if (direction == CONNECTION_ARROWS_RIGHT) {	 			
			if ( focusedNode.nodeid != connection.to[0].cnode.nodeid ) {
				count++;		
			}
		} else {
			if ( focusedNode.nodeid != connection.to[0].cnode.nodeid ) {
				count++;		
			}
		}
	}

	return count;	
}

/**
 * Create the connections list which displays the incoming and outgoing
 * fromconns, incoming connections for the focused idea.
 * toconns, outgoing connections for the focused idea
 * focusedNode, the focused idea.
 * direction, the direction of flow to draw the connections a->b->c = 'right' or c<-b<-a = 'left'
 */
 function drawGraph(objDiv, fromconns, toconns, focusedNode, direction, includemenu) {

	if (includemenu === undefined) {
		includemenu = true;
	}

	var aggregateCount = checkForAggregateNode(focusedNode, fromconns, toconns, direction);

	NEIGHBOURHOOD_ARGS['focalnode'] = focusedNode.nodeid;

	var leftConnections = new Array();
	var rightConnections = new Array();

	if (direction == CONNECTION_ARROWS_RIGHT) {
		rightConnections = fromconns;
		leftConnections = toconns;
	} else {
		rightConnections = toconns;
		leftConnections = fromconns;
	}
	
	var leftCount = leftConnections.length;
	var rightCount = rightConnections.length;		
	
	var item = null;
	var row = null;
	var cell = null;
	var icondiv = null;
	var innertable = null;
	var innerrow = null;
	var innercell = null;
	var image = null;
	var ideadiv = null;
	var ideatext = null;
	var leftIdea = null;
	var rightidea = null;
	var linkdiv = null;
	var linkType = null;
	var linkGroup = "";
	var role = null;
	var span = null;

	leftVerticalLinkDivs = new Array();
	leftVerticalLinkIdeas = new Array();
	leftVerticalLinkCount = 0;
	rightVerticalLinkDivs = new Array();
	rightVerticalLinkIdeas = new Array();
	rightVerticalLinkCount = 0;
	
	// Create the main div holding the table with the three main moving divs inside that
	// and the spacers above them which have their heights adjusted
	// to line up the three divs as you scroll
	//if coming from snippet, need to use different style
	if ($("tab-content-conn")) {												
		var columndivWide = new Element("div",{'id':'columndiv-wide', 'class': 'viewsdiv'});
	} else {
		var columndivWide = new Element("div",{'id':'columndiv-wide', 'class': 'viewsdiv-snippet'});
	}
		var connectionWideTable = new Element("table", {'id':'connectionWideTable', 'cellspacing':'0', 'cellpadding':'0', 'border':'0', 'style':'border-collapse: collapse;'});
			var connectionWideTableBody = new Element("tbody"); // NEEDED FOR IE
				var connectionWideTableRow = new Element("tr");			
					var connectionWideTableCellFrom = new Element("td", {'valign':'top'});
						fromConnectionsDivSpacerFrom = new Element("div", {'id':'fromConnectionsDivSpacer',	'height': '-1px', 'class':'connectionSpacerDiv'});
						fromConnectionsDiv = new Element("div", {'id':'fromConnectionsDiv',	'class': 'connectionsDiv'});
						connectionWideTableCellFrom.insert(fromConnectionsDivSpacerFrom);
						connectionWideTableCellFrom.insert(fromConnectionsDiv);
					var connectionWideTableCellFocus = new Element("td", {'valign':'top'});
						focusedIdeaDivSpacer = new Element("div", {'id':'focusedIdeaDivSpacer',	'height': '-1px', 'class':'connectionSpacerDiv'});
						focusedIdeaDiv = new Element("div", {'id':'focusedIdeaDiv',	'class': 'connectionsDiv'});							
						connectionWideTableCellFocus.insert(focusedIdeaDivSpacer);
						connectionWideTableCellFocus.insert(focusedIdeaDiv);					
					var connectionWideTableCellTo = new Element("td", {'valign':'top'});	
						toConnectionsDivSpacer = new Element("div", {'id':'toConnectionsDivSpacer',	'height': '-1px', 'class':'connectionSpacerDiv'});
						toConnectionsDiv = new Element("div", {'id':'toConnectionsDiv',	'class': 'connectionsDiv'});
						connectionWideTableCellTo.insert(toConnectionsDivSpacer);
						connectionWideTableCellTo.insert(toConnectionsDiv);
		
				connectionWideTableRow.insert(connectionWideTableCellFrom);			
				connectionWideTableRow.insert(connectionWideTableCellFocus);
				connectionWideTableRow.insert(connectionWideTableCellTo);
			connectionWideTableBody.insert(connectionWideTableRow);
		connectionWideTable.insert(connectionWideTableBody);	
	columndivWide.insert(connectionWideTable);
	
	objDiv.insert(columndivWide);

	// LEFT HAND SIDE DIV	
	
	var fromConnectionsTable = document.createElement( 'table' );
	fromConnectionsTable.id="fromConnectionsTable";
	fromConnectionsTable.cellPadding="0";
	fromConnectionsTable.border="0";
	fromConnectionsTable.className = "fromConnectionsTable";	
	fromConnectionsDiv.appendChild(fromConnectionsTable);

	if (leftCount == 0) {
		row = fromConnectionsTable.insertRow(-1);	
		cell = row.insertCell(-1);
		cell.vAlign="middle";
		dir = INCOMING_CONNECTION;
	 	if (direction == CONNECTION_ARROWS_LEFT) {
			dir = OUTGOING_CONNECTION;
		} 
		ideadiv = document.createElement( 'div' );
		ideadiv.className = "connectionIdeaDivPale";
		cell.appendChild(ideadiv);		
		ideadiv.appendChild(renderFakeNode(focusedNode.nodeid, dir, includemenu));

		cell = row.insertCell(-1);
		cell.vAlign="middle";		
		image = document.createElement( 'img' );
	 	if (direction == CONNECTION_ARROWS_RIGHT) {
			image.src = URL_ROOT+"images/connection/link-line-short-fake.png";
		} else {
			image.src = URL_ROOT+"images/connection/link-left-short-fake.png";
		}
		image.alt = "";										
		cell.appendChild(image);
		
		cell = row.insertCell(-1);
		cell.vAlign="middle";	
		linkdiv = document.createElement( 'div' );
		linkdiv.className = "connectionLinkDivFake";				
		ideatext = document.createTextNode(String.fromCharCode(160));
		linkdiv.appendChild(ideatext);
		cell.appendChild(linkdiv);		
		
		cell = row.insertCell(-1);
		cell.align="right";
		image = document.createElement( 'img' );	
	 	if (direction == CONNECTION_ARROWS_RIGHT) {
			image.src = URL_ROOT+"images/connection/link-right-short-fake.png";
		} else {
			image.src = URL_ROOT+"images/connection/link-line-short-fake.png";
		}
		image.alt = "";
		cell.appendChild(image);
		
	} else {
		var fromHeight = 0;
		var counter = 0;
		
		// loop left-side connections
		for (i=0; i<leftCount; i++) {
		
			counter++;
			item = leftConnections[i].connection;
	
			row = fromConnectionsTable.insertRow(-1);
			cell = row.insertCell(-1);
			cell.vAlign="middle";
	
			ideadiv = document.createElement( 'div' );
			ideadiv.className = "connectionIdeaDivPale";
			cell.appendChild(ideadiv);
	
		 	if (direction == CONNECTION_ARROWS_RIGHT) {	 	
				var fromNode = renderNode(item.from[0].cnode,'neighbourhood-from-idea'+(item.connid+counter), item.fromrole[0].role, includemenu);
			} else {
				var fromNode = renderNode(item.to[0].cnode,'neighbourhood-to-idea'+(item.connid+counter), item.torole[0].role, includemenu);
			}			
			ideadiv.appendChild(fromNode);
			
			cell = row.insertCell(-1);
			cell.vAlign="middle";
			image = document.createElement( 'img' );
		 	if (direction == CONNECTION_ARROWS_RIGHT) {
				image.src = URL_ROOT+"images/connection/link-line-short.png";
			} else {
				image.src = URL_ROOT+"images/connection/link-left-short.png";
			}
			image.alt = "";
			cell.appendChild(image);
			row.appendChild(cell);
	
			// add link
			cell = row.insertCell(-1);
			cell.vAlign="middle";
			cell.appendChild(createLink(item, 'neighbourhood-focus-linkright'+i, direction, includemenu));
						
			fromHeight = ideadiv.offsetHeight;
			
			cell = row.insertCell(-1);
			cell.vAlign="middle";
			image = document.createElement( 'img' );
			if (leftCount == 1) {
			 	if (direction == CONNECTION_ARROWS_RIGHT) {
					image.src = URL_ROOT+"images/connection/link-right-short.png";		
				} else {
					image.src = URL_ROOT+"images/connection/link-line-short.png";
				}									
			} else {
				image.src = URL_ROOT+"images/connection/link-line-short.png";
			}
			image.alt = "";
			cell.appendChild(image);
			
			cell = row.insertCell(-1);
			if (leftCount > 1) {		
				var div = document.createElement( 'div' );
				if (i==0) {
					div.className="verticalLine";
					div.style.height = (fromHeight/2)+5+"px";
					cell.vAlign="bottom";
				} else if (i == leftCount-1) {
					div.className="verticalLine";
					div.style.height = (fromHeight/2)+4+"px";
					cell.vAlign="top";			
				} else {
					div.className="verticalLine";
					div.style.height = fromHeight+"px";
				}
				
				leftVerticalLinkIdeas[leftVerticalLinkCount] = ideadiv;
				leftVerticalLinkDivs[leftVerticalLinkCount] = div;
				leftVerticalLinkCount++;		
				
				cell.appendChild(div);
			} 
		}
	}
		
	// CENTRAL DIV - FOCUSED IDEA
	var focusConnectionsTable = document.createElement( 'table' );
	focusConnectionsTable.id="focusedIdeaTable";
	focusConnectionsTable.cellPadding="0";
	focusConnectionsTable.border="0";
	focusConnectionsTable.className = "focusedIdeaTable";	

	focusedIdeaDiv.appendChild(focusConnectionsTable);
	row = focusConnectionsTable.insertRow(-1);

	if (leftCount > 1) {
		cell = row.insertCell(-1);
		cell.align="right";
		image = document.createElement( 'img' );	
	 	if (direction == CONNECTION_ARROWS_RIGHT) {
			image.src = URL_ROOT+"images/connection/link-right-short.png";
		} else {
			image.src = URL_ROOT+"images/connection/link-line-short.png";
		}
		image.alt = "";
		cell.appendChild(image);
	}
	
	cell = row.insertCell(-1);
	var innerdiv = document.createElement( 'div' );
	innerdiv.className = "innerFocusedIdeaDiv";
	cell.appendChild(innerdiv);
	var focusNode = renderFocalNode(aggregateCount, focusedNode,'neighbourhood-focus-idea'+(counter), focusedNode.role[0].role, includemenu);
	counter++;
	innerdiv.appendChild(focusNode);
	
	if (rightCount > 1) {
		cell = row.insertCell(-1);
		image = document.createElement( 'img' );
 		if (direction == CONNECTION_ARROWS_RIGHT) {
			image.src = URL_ROOT+"images/connection/link-line-short.png";
		} else {
			image.src = URL_ROOT+"images/connection/link-left-short.png";
		}
		image.alt = "";
		cell.appendChild(image);	
	}

	// RIGHT HAND SIDE  DIV - TO CONNECTIONS
	var toConnectionsTable = document.createElement( 'table' );
	toConnectionsTable.id="toConnectionsTable";
	toConnectionsTable.cellPadding="0";
	toConnectionsTable.border="0";
	toConnectionsTable.className = "toConnectionsTable";	

	toConnectionsDiv.appendChild(toConnectionsTable);
	
	if (rightCount == 0) {
		row = toConnectionsTable.insertRow(-1);	
		
		cell = row.insertCell(-1);
		image = document.createElement( 'img' );		
	 	if (direction == CONNECTION_ARROWS_RIGHT) {
			image.src = URL_ROOT+"images/connection/link-line-short-fake.png";
		} else {
			image.src = URL_ROOT+"images/connection/link-left-short-fake.png";
		}
		image.alt = "";
		cell.appendChild(image);	
		
		cell = row.insertCell(-1);
		cell.vAlign="middle";
		linkdiv = document.createElement( 'div' );
		linkdiv.className = "connectionLinkDivFake";				
		ideatext = document.createTextNode(String.fromCharCode(160));
		linkdiv.appendChild(ideatext);
		cell.appendChild(linkdiv);		
			
		cell = row.insertCell(-1);
		cell.vAlign="middle";
		image = document.createElement( 'img' );	

	 	if (direction == CONNECTION_ARROWS_RIGHT) {
			image.src = URL_ROOT+"images/connection/link-right-short-fake.png";
		} else {
			image.src = URL_ROOT+"images/connection/link-line-short-fake.png";
		}
		image.alt = "";
		cell.appendChild(image);			

		cell = row.insertCell(-1);
		cell.vAlign="middle";		
		dir = OUTGOING_CONNECTION;
	 	if (direction == CONNECTION_ARROWS_LEFT) {
			dir = INCOMING_CONNECTION;
		}
		
		ideadiv = document.createElement( 'div' );
		ideadiv.className = "connectionIdeaDivPale";
		cell.appendChild(ideadiv);		
		ideadiv.appendChild(renderFakeNode(focusedNode.nodeid, dir, includemenu));
	} else {
		var div = null;
		var lineCell  =null;
		for (i=0; i<rightCount; i++) {
		
			counter++;
			item = rightConnections[i].connection;
	
			row = toConnectionsTable.insertRow(-1);
	
			// vertical line if more than on connection			
			lineCell = row.insertCell(-1);
			lineCell.className="cell1";					
			if (rightCount > 1) {	
				div = document.createElement( 'div' );
				lineCell.appendChild(div);
			} 
			
			cell = row.insertCell(-1);
			cell.vAlign="middle";
			cell.align="left";
			
			image = document.createElement( 'img' );					
			if (rightCount == 1) {
			 	if (direction == CONNECTION_ARROWS_RIGHT) {
					image.src = URL_ROOT+"images/connection/link-line-short.png";		
				} else {
					image.src = URL_ROOT+"images/connection/link-left-short.png";
				}										
			} else {
				image.src = URL_ROOT+"images/connection/link-line-short.png";
			}
			image.alt = "";
			cell.appendChild(image);
			
			cell = row.insertCell(-1);
			cell.vAlign="middle";
			
			cell.appendChild(createLink(item, 'neighbourhood-focus-linkright'+i, direction, includemenu));
								
			cell = row.insertCell(-1);
			cell.vAlign="middle";
			image = document.createElement( 'img' );	


		 	if (direction == CONNECTION_ARROWS_RIGHT) {
				image.src = URL_ROOT+"images/connection/link-right-short.png";
			} else {
				image.src = URL_ROOT+"images/connection/link-line-short.png";
			}
			image.alt = "";
			cell.appendChild(image);
	
			cell = row.insertCell(-1);
			cell.vAlign="middle";
			ideadiv = document.createElement( 'div' );
			ideadiv.className = "connectionIdeaDivPale";
			cell.appendChild(ideadiv);
	
		 	if (direction == CONNECTION_ARROWS_RIGHT) {	 	
				var toNode = renderNode(item.to[0].cnode,'neighbourhood-to-idea'+(item.connid+counter), item.torole[0].role, includemenu);
			} else {
				var toNode = renderNode(item.from[0].cnode,'neighbourhood-from-idea'+(item.connid+counter), item.fromrole[0].role, includemenu);
			}			
			ideadiv.appendChild(toNode);
					
			if (div) {
				fromHeight = ideadiv.offsetHeight;
				if (i==0) {
					div.className="verticalLine";
					div.style.height = (fromHeight/2)+5+"px";
					lineCell.vAlign="bottom";
				} else if (i == rightCount-1) {
					div.className="verticalLine";
					div.style.height = (fromHeight/2)+4+"px";
						lineCell.vAlign="top";			
				} else {
					div.className="verticalLine";
					div.style.height = fromHeight+"px";
				}	
				
				rightVerticalLinkIdeas[rightVerticalLinkCount] = ideadiv;
				rightVerticalLinkDivs[rightVerticalLinkCount] = div;
				rightVerticalLinkCount++;							
			}
		}
	}
		
	//if (applet != null) {
	//	applet.setFocalNode(id);	
	//}
}

/**
 * Create a link item with the given label for the given group.
 */
function createLink(connection, uniQ, direction, includemenu) {

	uniQ = connection.connid + uniQ;
	linkType = connection.linktype[0].linktype;
	label = linkType.label; 
	group = linkType.grouplabel;
	 
	var linktypelabelfull = label;
	var linktypelabel = linktypelabelfull;
	if (linktypelabelfull.length > LINKTYPELABEL_CUTOFF) {
		linktypelabel = linktypelabelfull.substring(0,LINKTYPELABEL_CUTOFF)+"...";
	}
	
	var grouplabel = group;
	if (grouplabel == null) {
		grouplabel = 'Neutral';
	}
	grouplabel = grouplabel.toLowerCase();
	
	var linkDiv = new Element("div",{'class': 'connlink-horiz-neighbour','id': 'connlink'+connection.connid});
	if (direction == CONNECTION_ARROWS_RIGHT) {
		linkDiv.setStyle('background-image: url("'+URL_ROOT +'images/connection/lozenge-'+grouplabel+'-short.png")');
		var ltDiv = new Element("div",{'class': 'conn-link-text-neighbour'});
	} else {
		linkDiv.setStyle('background-image: url("'+URL_ROOT +'images/connection/lozenge-'+grouplabel+'-short.png")');
		var ltDiv = new Element("div",{'class': 'conn-link-text-neighbour'});
	}
	
	linkDiv.insert(ltDiv);
	
	var ltWrap = new Element("div",{'class': 'link-type-wrapper-neighbour'});
	ltDiv.insert(ltWrap);
	
	var hasTags = false;
	if(connection.tags && connection.tags.length > 0){
		hasTags = true;
		
		var tltMenu = new Element("div",{'class':'link-type-tags'});
		ltWrap.insert(tltMenu);
		
		var tddImg = new Element('img', {'src':URL_ROOT+'images/tagdropdown-grey.png','class':'drop-down-img'});
		Event.observe(tddImg,'mouseover',function (){ showPopup('tdd'+uniQ)});
		Event.observe(tddImg,'mouseout',function (){ hidePopup('tdd'+uniQ)});
		tltMenu.insert(tddImg);

		var tddDiv = new Element("div", {"id":"tdd"+uniQ,"class":"drop-down"});
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
	
	var ltText = new Element("div",{'class':'link-type-text-neighbour'}).insert(linktypelabel);
	if (linktypelabelfull.length > LINKTYPELABEL_CUTOFF) {
		ltText.title = linktypelabelfull;
	}
	ltWrap.insert(ltText);
	
		// set colour of ltText
	if (grouplabel == "positive"){
		ltText.setStyle({"color":"#00BD53"});
	} else if (grouplabel == "negative"){
		ltText.setStyle({"color":"#C10031"});
	} else if (grouplabel == "neutral"){
		ltText.setStyle({"color":"#B2B2B2"});
	}
	
	//if user is logged in		
	var hasMenu = false;
	if(USER != "" && includemenu){
		hasMenu = true;
		var ltMenu = new Element("div",{'class':'link-type-menu'});
		ltWrap.insert(ltMenu);
		var ddImg = new Element('input', {'type':'image', 'alt':'Open/close menu', 'src':URL_ROOT+'images/dropdown-grey.png','class':'drop-down-img'});
		Event.observe(ddImg,'mouseover',function (){ showPopup('dd'+uniQ)});
		Event.observe(ddImg,'mouseout',function (){ hidePopup('dd'+uniQ)});
		ltMenu.insert(ddImg);

		var ddDiv = new Element("div", {"id":"dd"+uniQ,"class":"drop-down"});
		Event.observe(ddDiv,'mouseover',function (){ showPopup("dd"+uniQ)});
		Event.observe(ddDiv,'mouseout',function (){ hidePopup("dd"+uniQ)});
		ltMenu.insert(ddDiv);
		
		var ddUL = new Element('ul',{'class':'dd-list'});
				
		//var ddLI = new Element('li',{'class':'dd-li'}).insert('Copy');
		//Event.observe(ddLI,'click',function (){copyConnection(connection.connid)});
		//ddUL.insert(ddLI);
		
		//if connection owner
		if (USER == connection.userid) {			
			var ddLI = new Element('li',{'class':'dd-li'}).insert('Edit');
			Event.observe(ddLI,'click',function (){loadDialog("editconn",URL_ROOT+"plugin/ui/connection.php?connid="+connection.connid,790,650)});
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
	
	if (hasTags && hasMenu) {
		ltText.style.width="100px";
	} else if (!hasTags && !hasMenu) {
		ltText.style.width="134px";
	} else if (hasTags && !hasMenu) {
		ltText.style.width="114px";
	} else if (!hasTags && hasMenu) {
		ltText.style.width="120px";
	}

	return linkDiv;
}

/**
 * For when a node has no connections at one end or both.
 */
function renderFakeNode(focalnodeid, type, includemenu){
	
	uniQ = type+(new Date()).getTime();
	
	var iDiv = new Element("div", {'class':'idea-container-fake'});
	var ihDiv = new Element("div", {'class':'idea-header-fake'});
	var itDiv = new Element("div", {'class':'idea-title-fake'});
	//itDiv.update("No "+type+" connections");	
	itDiv.update("No connections");	
	ihDiv.insert(itDiv);
	
	var iwDiv = new Element("div", {'class':'idea-wrapper'});
	var imDiv = new Element("div", {'class':'idea-main'});
	var idDiv = new Element("div", {'class':'idea-detail'});
		
	// display the data headers
	if(USER != "" && includemenu){	
		var headerDiv = new Element("div", {'class':'idea-menus'});
		headerDiv.insert("<span class='active' id='connect"+uniQ+"')'>Make a Connection</span>");	
		
		Event.observe(headerDiv,'click',function (){openConnectionForm(focalnodeid, type)});
		idDiv.insert(headerDiv);
	} else {
		var headerDiv = new Element("div", {'class':'idea-menus'});
		headerDiv.insert("<span class='active' id='connect"+uniQ+"')'>&nbsp;</span>");	
		idDiv.insert(headerDiv);
	}	
	imDiv.insert(idDiv);
	
	iwDiv.insert(imDiv);
	iwDiv.insert('<div style="clear:both;"></div>');
	iDiv.insert(ihDiv);
	iDiv.insert('<div style="clear:both;"></div>');
	iDiv.insert(iwDiv);
	return iDiv;
}

/**
 * Open the connection dialog with the passed idea label displayed at the appropriate end
 */
function openConnectionForm(nodeid, type){
	if (type == OUTGOING_CONNECTION) {
		loadDialog('createconn',URL_ROOT + 'plugin/ui/connection.php?ideaid0='+encodeURIComponent(nodeid),790,650);
	} else {
		loadDialog('createconn',URL_ROOT + 'plugin/ui/connection.php?ideaid1='+encodeURIComponent(nodeid),790,650);
	}
}

loadCN();