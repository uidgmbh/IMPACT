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
    include_once("../../config.php");

	checkLogin();

    global $USER, $CFG;

    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/scriptaculous/scriptaculous.js' type='text/javascript'></script>");
    include_once($CFG->dirAddress."includes/dialogheader.php");

	$searchid = optional_param("searchid", "", PARAM_TEXT);
	$links = optional_param("links", "", PARAM_TEXT);
	$linkgroup = optional_param("linkgroup", "", PARAM_TEXT);
	$linkset = optional_param("linkset", "", PARAM_TEXT);
	$checklist = optional_param("checklist", "", PARAM_TEXT);
	$scope = optional_param("scope", "all", PARAM_TEXT);
	$focalnodeid = optional_param("focalnodeid", "", PARAM_TEXT);
	$depth = optional_param("depth", 7, PARAM_INT);
	$direction = optional_param("direction", "both", PARAM_TEXT);
	$labelmatch = optional_param("labelmatch", false, PARAM_BOOL);
	$searchname = optional_param("searchname", "", PARAM_TEXT);

	if ($linkgroup != "") {
		$links = "";
		$checklist = "";
		$linkset = "";
	}

	if ($linkset != "") {
		$links = "";
		$checklist = "";
		$linkgroup = "";
	}

	if ($depth > 7) {
		$depth = 7;
	}

	$linklist = "";
	if ($checklist != "") {
		for($i =0 ; $i<sizeof($checklist); $i++){
			if($checklist[$i] != ""){
			   if ($linklist == "") {
				   $linklist = $checklist[$i];
			   } else {
				   $linklist .= ",".$checklist[$i];
			   }
			}
		}

	}

	if ($links == "" && $linklist != "") {
		$links = $linklist;
	}

	//echo "set=".$linkset;
	//echo "group=".$linkgroup;

	if(isset($_POST["addsearch"])){
			$search = new Search();

			if ($searchname == "") {
				echo "You must give the search a name";
				die;
			}

			$search = $search->add($searchname, $scope, $depth, $focalnodeid, $linklist, $linkgroup, $linkset, $direction, $labelmatch);
            // refresh parent window then close
            echo "<script type='text/javascript'>";
            echo "if (window.opener.refreshSearchList) { window.opener.refreshSearchList(); ";
            echo "} else if (window.opener.opener && window.opener.opener.refreshSearchList) { window.opener.opener.refreshSearchList(); }";
            echo 'window.close();';
            echo '</script>';
            include_once($CFG->dirAddress."includes/dialogfooter.php");
            die;

	} else if($searchid != "" && isset($_POST["savesearch"])){

	        // check user can edit this search
			if ($searchname == "") {
				echo "You must give the search a name";
				die;
			}

			$search = new Search($searchid);
			$search->load();
	        try {
	            $search->canedit();
	        } catch (Exception $e){
	            echo "You do not have permissions to edit this network search";
	            die;
	        }

			$search->edit($searchname, $scope, $depth, $focalnodeid, $linklist, $linkgroup, $linkset, $direction, $labelmatch);

            // refresh parent window then close
            echo "<script type='text/javascript'>";
            echo "if (window.opener.refreshSearchList) { window.opener.refreshSearchList(); ";
            echo "} else if (window.opener.opener && window.opener.opener.refreshSearchList) { window.opener.opener.refreshSearchList(); }";
            echo 'window.close();';
            echo "</script>";
            include_once($CFG->dirAddress."includes/dialogfooter.php");
            die;
	} else {
		$focalnode = null;

		// load data if editing an existing search
		if ($searchid != "") {
			$search = new Search($searchid);
			$search->load();

			if (!$search instanceof Search){
				echo "Search not found";
				die;
			}

			// check user can edit this search
			try {
				$search->canedit();
			} catch (Exception $e){
				echo "You do not have permissions to edit this Search";
				die;
			}

			$links = $search->linktypes;
			$linkgroup = $search->linkgroup;
			$linkset = $search->linkset;
			$scope = $search->scope;
			$focalnodeid = $search->focalnodeid;
			$focalnode = $search->focalnode;
			$depth = $search->depth;
			$searchname = $search->name;
			$direction = $search->direction;
			$labelmatch = $search->labelmatch;

			$linklist=null;
			if ($links != null && $links != "") {
				$linklist = split(",", $links);
			}
		}
	}

	if ($focalnode == null && $focalnodeid != "") {
		$focalnode = new CNode($focalnodeid);
		$focalnode->load();
	}

	$linkTypeFilterList = array();
	if ($linklist != null) {
		foreach ($linklist as &$value) {
			$linkTypeFilterList[$value] = $value;
		}
	}

	$rs = getAllLinkTypes();
	$linktypes = $rs->linktypes;
?>

<script type="text/javascript">

	var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
	var URL_ROOT = "<?php echo $CFG->homeAddress; ?>";
   	var roles = null;
   	var linktypes = null;
   	var role0 = null;
   	var node0 = null;


   	function init(){

		//document.onkeypress = pickerSearchKeyPressed;

  	    //self.resizeTo(790,650);

	    $('dialogheader').insert('Network Search Builder');

		loadPickerNodes('<?php echo($USER->userid); ?>', 0, 10);
		loadPickerBookmarks(0, 10);

		$('linksetarea').insert(createDefinedLinkSetSelector('linkset', 'linkSetChanged'));

		var options = $('linkset').options;
		for (var itemIndex = 0; itemIndex < options.length; itemIndex++) {
			if (options[itemIndex].value == '<?php echo $linkset; ?>') {
				$('linkset').options[itemIndex].selected = true;
			}
		}

		$('definedsetsdiv').insert('<a href="#" onMouseOver="showLinkConnectionSearchMessage(event, \'connectionsearchhint\'); return false;" onMouseOut="hideHints(); return false;" onClick="hideHints(); return false;" onkeypress="enterKeyPressed(event)"><img src="'+URL_ROOT+'images/info.png" border="0" style="margin-top: 2px; margin-left: 5px; margin-right: 2px;" /></a>');
		$('definedsetsdiv').insert('<div id="connectionsearchhint" class="hintRollover" style="position: absolute; visibility: hidden"><table width="350" border="0" cellpadding="1" cellspacing="0" bgcolor="#FFFED9"><tr width="350"><td width="350" align="left"><span id="connectionSearchHintMessage"></span></td></tr></table></div>');

		options = $('linkgroup').options;
		for (var itemIndex = 0; itemIndex < options.length; itemIndex++) {
			if (options[itemIndex].value == '<?php echo $linkgroup; ?>') {
				$('linkgroup').options[itemIndex].selected = true;
			}
		}


		<?php if ($focalnode) {
			$jsonIdea0 = json_encode($focalnode);
			echo "node0 = ";
			echo $jsonIdea0;
			echo ";";
		}
		?>

		if (node0 != null) {
			loadConnectionNodeInternal(node0);
		} else {
			renderFakeNode();
		}

	}

	function showLinkConnectionSearchMessage(evt, panelName) {

		var event = evt || window.event;
		var thing = event.target || event.srcElement;

		$("connectionSearchHintMessage").innerHTML="";
		var sometext = document.createTextNode("These are predefined sets of link types using the default link types we provide. When selecting from the list each set will display its link types.");
		$("connectionSearchHintMessage").appendChild(sometext);

		showHint(event, panelName, 30, -40);
	}

	function linkSetChanged() {
		if ($('linkset').selectedIndex > 0) {
			$('linkgroup').options[0].selected = true;
		}
	}


	function linkGroupChanged() {
		if ($('linkgroup').selectedIndex > 0) {
			$('linkset').options[0].selected = true;
		}
	}

	function runNetworkSearch() {

		if (node0 == null) {
			alert("You must select an idea first");
			return;
		}

		var linkgroup = "";
		if ($('linkgroup').selectedIndex > 0) {
			linkgroup = $('linkgroup').options[$('linkgroup').selectedIndex].value;
		}

		var scope = 'my';
		var radios = document.getElementsByName('scope');
		if (radios[0].checked == true) {
		   scope = radios[0].value;
		} else {
		   scope = radios[1].value;
		}

		var netargs = {};
		netargs['netnodeid'] = node0.nodeid;
		//netargs['nodelabel'] = node0.name;

		var selectedlinks = getSelections();

		if (selectedlinks == "") {
			if ($('linkset').selectedIndex > 0) {
				var type = $('linkset').options[$('linkset').selectedIndex].value;
				selectedlinks = getDefinedLinkSet(type);
			}
		}

		if (selectedlinks == "" && linkgroup == "") {
			alert("You must select links to search on");
			return;
		}

		var direction = $('direction').options[$('direction').selectedIndex].value;
		var depth = $('depth').options[$('depth').selectedIndex].value

		var labelmatch = 'false';
		if ($('labelmatch').checked) {
			labelmatch = 'true';
		}

		netargs['netq'] = selectedlinks;
		netargs['netlinkgroup'] = linkgroup;
		netargs['netscope'] = scope;

    	netargs['netdepth']= depth;
    	netargs['netdirection'] = direction;
    	netargs['netlabelmatch']= labelmatch;

		var newURL = URL_ROOT+"networksearch.php";
		newURL += "?"+Object.toQueryString(netargs);
		if ($('searchid').value != "") {
			newURL += "&searchid="+$('searchid').value;
		}
		newURL += "#"+'conn-net';

		// if your in the manager, need to go one parent deeper
		if (window.opener.refreshSearchList && window.opener.opener) {
			window.opener.opener.location.href = newURL;
        } else {
			window.opener.location.href = newURL;
		}
	}

	/**
	 * Check to see if the enter key was pressed.
	 */
	function pickerSearchKeyPressed(evt) {

		var event = evt || window.event;
		var thing = event.target || event.srcElement;

		var characterCode = document.all? window.event.keyCode:event.which;
		if(characterCode == 13) {
			runPickerSearch('0', '10')
		}
	}

   	function runPickerSearch(start, max) {

	   $("conn-search-results").innerHTML = "";

	   var search = $('connsearch').value;

	   // pants but works - couldn't get jquery to work
	   var scope = 'my';
	   var radios = document.getElementsByName('pickerscope');
	   if (radios[0].checked == true) {
		   scope = "my";
	   } else {
		   scope = "all";
	   }

	   if ($('tagsonly').checked) {
		   var reqUrl = SERVICE_ROOT + "&method=getnodesbytagsearch&q="+search+"&scope="+scope+"&start="+start+"&max="+max;
	   } else {
		   var reqUrl = SERVICE_ROOT + "&method=getnodesbysearch&q="+search+"&scope="+scope+"&start="+start+"&max="+max;
	   }

       new Ajax.Request(reqUrl, { method:'get',
    	   		onError:  function(error) {
    	   			alert("There was an error retreiving your search from the server");
       			},
    	   		onSuccess: function(transport){
                   var json = transport.responseText.evalJSON();
                   if(json.error){
                       alert(json.error[0].message);
                       return;
                   }

                   $('search-conn-list-count').innerHTML = "";
                   $('search-conn-list-count').insert(json.nodeset[0].totalno);

	   				if(json.nodeset[0].nodes.length > 0){
	   					var total = json.nodeset[0].totalno;
	   					$("conn-search-results").insert(createNav(total, json.nodeset[0].count, start, max, "search"));
	   					displayConnectionNodes($("conn-search-results"),json.nodeset[0].nodes,1);
	   				}
               }
        });
   }

   function loadPickerBookmarks(start, max) {
	    $("conn-bookmark-list").innerHTML = "";

	   var reqUrl = SERVICE_ROOT + "&method=getusercachenodes&start="+start+"&max="+max;
       new Ajax.Request(reqUrl, { method:'get',
    	   		onError:  function(error) {
    	   			alert("There was an error retreiving Bookmarks from the server");
       			},
    	   		onSuccess: function(transport){
                   var json = transport.responseText.evalJSON();
                   if(json.error){
                       alert(json.error[0].message);
                       return;
                   }
                   $('bookmark-conn-list-count').innerHTML = "";
                   $('bookmark-conn-list-count').insert(json.nodeset[0].totalno);

	   				if(json.nodeset[0].nodes.length > 0){
	   					var total = json.nodeset[0].totalno;
	   					$("conn-bookmark-list").insert(createNav(total, json.nodeset[0].count, start, max, "bookmarks"));

	   					displayConnectionNodes($("conn-bookmark-list"),json.nodeset[0].nodes,1);
	   				}
               }
           });
   }

   /**
    *	load user nodes
    */
   function loadPickerNodes(userid, start, max){
	    $("conn-idea-list").innerHTML = "";

   		var reqUrl = SERVICE_ROOT + "&method=getnodesbyuser&userid="+userid+"&start="+start+"&max="+max;
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

          			$('node-conn-list-count').innerHTML = "";
          			$('node-conn-list-count').insert(json.nodeset[0].totalno);

	   				if(json.nodeset[0].nodes.length > 0){
	   					var total = json.nodeset[0].totalno;

	   					$("conn-idea-list").insert(createNav(total, json.nodeset[0].count, start, max, "node"));

	   					displayConnectionNodes($("conn-idea-list"),json.nodeset[0].nodes,1);
	   				}
       		}
   		});
   	}

    /**
	 * Render a list of nodes
	 */
	function displayConnectionNodes(objDiv,nodes,start){
		objDiv.insert('<div style="clear:both; margin: 0px; padding: 0px;"></div>');
		var lOL = new Element("ol", {'start':start, 'class':'idea-list-ol', 'style':'overflow-y: auto; overflow-x: hidden; height: 420px;'});
		for(var i=0; i< nodes.length; i++){
			if(nodes[i].cnode){
				var iUL = new Element("li", {'id':nodes[i].cnode.nodeid, 'class':'idea-list-li', 'style':'padding-bottom: 5px;'});
				lOL.insert(iUL);
				var blobDiv = new Element("div", {'style':'margin: 2px; width: 295px'});
				var blobNode = renderNode(nodes[i].cnode,'idea-list'+i+start, nodes[i].cnode.role[0].role, false, 'connselect');
				blobDiv.insert(blobNode);
				iUL.insert(blobDiv);
			}
		}
		objDiv.insert(lOL);
	}

	/**
	 * display Nav
	 */
	function createNav(total, count, start, max, type){

   	   var nav = new Element ("div",{'id':'page-nav', 'class':'toolbarrow', 'style':'padding-top: 3px;'});

   	   var header = createNavCounter(total, start, count);
   	   nav.insert(header);

   	   var clearnav = new Element ("div",{'style':'clear: both; margin: 3px; height: 3px;'});
   	   nav.insert(clearnav);

   	   if (total > parseInt( max )) {
   	   		//previous
   	   	    var prevSpan = new Element("span", {'id':"nav-previous"});
   	   	    if(start > 0){
   	   			prevSpan.update("<img title='Previous' src='"+URL_ROOT+"images/arrow-left.png' class='toolbar' style='padding-right: 0px;' />");
   	   	        prevSpan.addClassName("active");
   	   	        Event.observe(prevSpan,"click", function(){
   	   		    	var newArr = {"max":max, "start":start};
   	   	            newArr["start"] = parseInt(start) - newArr["max"];
   	   	            if (type=="node") {
   	   	            	loadPickerNodes('<?php echo($USER->userid); ?>', newArr["start"], newArr["max"])
   	   	            } else if (type=="bookmarks") {
   	   	            	loadPickerBookmarks(newArr["start"], newArr["max"]);
   	   	            } else if (type=="search") {
   	   	            	runPickerSearch(newArr["start"], newArr["max"]);
   	   	            }
   	   	        });
   	   	    } else {
   	   			prevSpan.update("<img title='No Previous' disabled src='"+URL_ROOT+"images/arrow-left-disabled.png' class='toolbar' style='padding-right: 0px;' />");
   	   	        prevSpan.addClassName("inactive");
   	   	    }

   	   	    //pages
   	   	    var pageSpan = new Element("span", {'id':"nav-pages"});
   	   	    var totalPages = Math.ceil(total/max);
   	   	    var currentPage = (start/max) + 1;
   	   	    for (var i = 1; i<totalPages+1; i++){
   	   	    	var page = new Element("span", {'class':"nav-page"}).insert(i);
   	   	    	if(i != currentPage){
   	   		    	page.addClassName("active");
   	   		    	var newArr = {"max":max, "start":start};
   	   		    	newArr["start"] = newArr["max"] * (i-1) ;
   	   		    	Event.observe(page,"click", Pages.next.bindAsEventListener(Pages,type,newArr));
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
   	   		    	var newArr = {"max":max, "start":start};
   	   	            newArr["start"] = parseInt(start) + parseInt(newArr["max"]);
   	   	            if (type=="node") {
   	   	            	loadPickerNodes('<?php echo($USER->userid); ?>', newArr["start"], newArr["max"])
   	   	            } else if (type=="bookmarks") {
   	   	            	loadPickerBookmarks(newArr["start"], newArr["max"]);
   	   	            } else if (type=="search") {
   	   	            	runPickerSearch(newArr["start"], newArr["max"]);
   	   	            }
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

       var Pages = {
   			next: function(e){
   				var data = $A(arguments);
   				var type = data[1];
   				var arrayData = data[2];
      	            if (type=="node") {
      	            	loadPickerNodes('<?php echo($USER->userid); ?>', arrayData['start'], arrayData['max']);
      	            } else if (type=="bookmarks") {
      	            	loadPickerBookmarks(arrayData['start'], arrayData['max']);
      	            } else if (type=="search") {
      	            	runPickerSearch(arrayData['start'], arrayData['max']);
      	            }
   			}
   	};

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
			objH.insert("<p><b>You haven't added any ideas yet</b></p>");
		}
		return objH;
	}

	function getSelections(){
	   var selectedOnes = "";
	   var checks = document.getElementsByName("checklist[]");
	   for (i=0; i<checks.length; i++) {
		   if (checks[i].checked) {
			   if (selectedOnes == "") {
				   selectedOnes = checks[i].value;
			   } else {
				   selectedOnes += ","+checks[i].value;
			   }
		   }
	   }
	   return selectedOnes;
	   //window.opener.setSelectedLinkTypes(selectedOnes);
	}

	function checkForGroupSelected() {

		var groupSelected = true;
		//var groupUnselected = false;
		var lastGroup = "";

	   	var checks = document.getElementsByName("checklist[]");
		for (i=0; i < checks.length; i++) {
		   	if (checks[i].id != lastGroup && lastGroup != "") {
		   		if (groupSelected == true) {
		   			$('linkGroup'+lastGroup).checked = true;
		   		} else {
		   			$('linkGroup'+lastGroup).checked = false;
		   		}
		   		groupSelected = true;
		   	}

		   	lastGroup = checks[i].id;

		   	if (checks[i].checked == false) {
		   		groupSelected = false;
		   	}
		}

		if (groupSelected == true) {
			$('linkGroup'+lastGroup).checked = true;
		} else {
			$('linkGroup'+lastGroup).checked = false;
		}

	}

	function groupSelection(elementName, groupName) {
		if ($(elementName).checked) {
			selectGroup(groupName);
		} else {
			unselectGroup(groupName);
		}
	}

	function selectGroup(groupname){
	   var checks = document.getElementsByName("checklist[]");
	   for (i=0; i < checks.length; i++) {
		   	if (checks[i].id == groupname) {
		   		checks[i].checked = true;
		   	}
	   }
	}

	function unselectGroup(groupname){
	   var checks = document.getElementsByName("checklist[]");
	   for (i=0; i < checks.length; i++) {
		   	if (checks[i].id == groupname) {
		   		checks[i].checked = false;
		   	}
	   }
	}


   /**
    * Load the node data into the currently selected idea.
    */
   function loadConnectionNode(node, role) {
   		node.role = role;
	    loadConnectionNodeInternal(node);
   }

   /**
    * Load the node data into the indicated idea.
    */
   function loadConnectionNodeInternal(node) {

	   var blobNode = renderNode(node, "focalnode", node.role, false, 'inactive');
       $('ideadivarea').innerHTML = "";
       $('ideadivarea').insert(blobNode);

       $('focalnodeid').value = node.nodeid;
       $('removeidea').style.visibility = "visible";

	   node0 = node;
    }


	/**
	* Remove the node at the given position and replace with blank node.
	*/
	function removeFocalNode() {
	   renderFakeNode();
	}

    /**
     * For when a node has no connections at one end or both.
     */
    function renderFakeNode(){
       $('removeidea').style.visibility = "hidden";

	   	var iDiv = new Element("div", {'class':'idea-container-fake'});
	   	var ihDiv = new Element("div", {'class':'idea-header-fake'});
	   	var itDiv = new Element("div", {'class':'idea-title-fake'});
   		itDiv.update('Select CENTRAL IDEA to search from<br/><br />Use Idea Selector - click link on right');
		//itDiv.insert("<a href='#' onclick='javascript:toggleNodePicker()'>Click to view Idea Picker</a>");

	   	ihDiv.insert(itDiv);

	   	var iwDiv = new Element("div", {'class':'idea-wrapper'});
	   	var imDiv = new Element("div", {'class':'idea-main'});
		iwDiv.style.background = "transparent";

	   	iwDiv.insert(imDiv);

	   	iDiv.insert(ihDiv);
	   	iDiv.insert('<div style="clear:both;"></div>');
	   	iDiv.insert(iwDiv);

	   	$('focalnodeid').value = "";
   		node0 = null;
	    $('ideadivarea').innerHTML = "";
    	$('ideadivarea').insert(iDiv);
    }

	function viewNodes() {
   	   $("tab-conn-node").removeClassName("unselected");
   	   $("tab-conn-node").addClassName("current");
   	   $("conn-idea-list").style.display = 'block';

   	   $("tab-conn-bookmarks").removeClassName("current");
   	   $("tab-conn-bookmarks").addClassName("unselected");
   	   $("conn-bookmark-list").style.display = 'none';

   	   $("tab-conn-search").removeClassName("current");
   	   $("tab-conn-search").addClassName("unselected");
   	   $("conn-search-list").style.display = 'none';
	}

	function viewBookmarks() {
   	   $("tab-conn-node").removeClassName("current");
   	   $("tab-conn-node").addClassName("unselected");
   	   $("conn-idea-list").style.display = 'none';

   	   $("tab-conn-bookmarks").removeClassName("unselected");
   	   $("tab-conn-bookmarks").addClassName("current");
   	   $("conn-bookmark-list").style.display = 'block';

   	   $("tab-conn-search").removeClassName("current");
   	   $("tab-conn-search").addClassName("unselected");
   	   $("conn-search-list").style.display = 'none';
	}

 	function viewSearch() {
   	   $("tab-conn-node").removeClassName("current");
   	   $("tab-conn-node").addClassName("unselected");
   	   $("conn-idea-list").style.display = 'none';

   	   $("tab-conn-bookmarks").removeClassName("current");
   	   $("tab-conn-bookmarks").addClassName("unselected");
   	   $("conn-bookmark-list").style.display = 'none';

   	   $("tab-conn-search").removeClassName("unselected");
   	   $("tab-conn-search").addClassName("current");
   	   $("conn-search-list").style.display = 'block';
  	}

	/**
	 * Open and close the Node Selector area
	 */
	function toggleNodePicker(forceOpen) {
		if ($("nodepicker").style.display == 'none' || forceOpen) {
			$("nodepicker").style.display = "block";
			$("linkpicker").style.display = "none";
		} else {
			$("nodepicker").style.display = "none";
		}
	}

	/**
	 * Open and close the Link type Selector area
	 */
	function toggleLinkPicker(forceOpen) {
		if ($("linkpicker").style.display == 'none' || forceOpen) {
			// reset other link menus to zero
			$('linkgroup').options[0].selected = true;
			$('linkset').options[0].selected = true;

			$("linkpicker").style.display = "block";
			$("nodepicker").style.display = "none";
		} else {
			$("linkpicker").style.display = "none";
		}
	}

   	window.onload = init;

</script>

<div style="float: left;">

<form name="structuredsearch" action="" method="post">

<input type="hidden" id="searchid" name="searchid" value="<?php echo $searchid; ?>">
<input type="hidden" id="focalnodeid" name="focalnodeid" value="<?php echo $focalnodeid; ?>">

<div style="float: left;">

	<div style="padding: 5px;">
		<label style="font-weight: bold;">Search connection networks</label>
	</div>
	<div style="padding: 5px;">
		<label style="font-weight: bold;">On</label>
		<input type="radio" name="scope" value="my" <?php if ($scope == 'my'){ echo 'checked="checked"';}?> />My Data &nbsp;
		<input type="radio" name="scope" value="all" <?php if ($scope == 'all'){ echo 'checked="checked"';}?> /> All Data&nbsp;
	</div>

	<div id="ideadivspacer0" class="ideadivspacer">
		<table>
			<tr>
			<td><div style="width: 45px; float: left; font-weight: bold; padding: 3px; ">Starting From</div></td>
			<td><div id="ideadivarea" class="ideadiv"></div></td>
			<td>
				<div id="removeidea" style="width: 35px; float: left; visibility: hidden; padding: 3px; margin-bottom: 10px;"><a title="Remove this node from the connection" href="javascript: removeFocalNode()">Remove</a></div>
				<div style="width: 35px; float: left; padding: 3px; "><a title="Open the idea selector" href="javascript: toggleNodePicker()">Idea Selector</a></div>
			</td>
			</tr>
		</table>
	</div>

	<div style="padding: 5px;">
		<fieldset style="border-color: #d3e8e8; padding: 10px; width: 350px;">
			<legend><b>Following Links of type</b></legend>

			<div style="margin-top: 10px;">
				<label style="float: left;margin-left:0px;width: 90px;padding:0px;text-align: left;">Link Groups</label>
				<select class="forminput" id="linkgroup" name="linkgroup" onchange="javascript:linkGroupChanged()">
					<option value="" selected="selected">select</option>
					<option value="All">All Link Types</option>
					<option value="Neutral">Neutral</option>
					<option value="Positive" >Positive</option>
					<option value="Negative">Negative</option>
				</select>
			<div>
			OR
			<div>
				<label style="float: left;margin-left:0px;width: 90px;padding:0px;text-align: left;">Defined Sets</label>
				<span class="forminput" id="linksetarea" name="linksetarea"></span>
				<span id="definedsetsdiv" style="margin-top: 2px;"></span>
			<div>
			OR
			<div>
				<label style="float: left;margin-left:0px; margin-right: 10px;width: 100;padding:0px;text-align: left;">Specific Links</label>
				<a class="forminput" title="Open the link selector" href="javascript: toggleLinkPicker()">My Links Selector</a>
			</div>

		</fieldset>
	</div>

	<div style="padding: 5px;">
		<label class="formlabel" style="margin-left:3px; text-align:left;font-weight: bold;">In Directions</label>
		<?php
			echo '<select class="forminput" id="direction" name="direction">';

			$dirs = array('outgoing','incoming','both');
			foreach($dirs as $dir) {
				if ($direction == $dir) {
					echo '<option value="'.$dir.'" selected="selected">'.$dir.'</option>';
				} else {
					echo '<option value="'.$dir.'">'.$dir.'</option>';
				}
			}

			echo '</select>'
		?>
	</div>

	<div style="padding: 5px;">
		<label class="formlabel" style="margin-left:3px; text-align:left; font-weight: bold;">To a Depth of</label>
		<?php
			echo '<select class="forminput" id="depth" name="depth">';

			for ($i=1; $i<8; $i++) {
				if ($depth == $i) {
					echo '<option value="'.$i.'" selected="selected">'.$i.'</option>';
				} else {
					echo '<option value="'.$i.'">'.$i.'</option>';
				}
			}

			echo '</select>'
		?>
	</div>

	<div style="padding: 5px; margin-bottom: 20px;">
		<label class="formlabel" style="margin-left:3px; text-align:left; font-weight: bold;">Matching Ideas on Labels</label>
		<?php
			if ($labelmatch == 1) {
				echo '<input class="forminput" type="checkbox" id="labelmatch" name="labelmatch" value="true" checked="checked" />';
			} else {
				echo '<input class="forminput" type="checkbox" id="labelmatch" name="labelmatch" value="true" />';
			}
		?>
	</div>

	<div class="formrow">
	   <input type="button" value="Run" onclick="runNetworkSearch();" />
	   <input type="button" value="Cancel" onclick="window.close();" />
	</div>

	<div style="padding: 5px; margin-top: 20px;">
		<fieldset style="border-color: #d3e8e8; padding: 10px; width: 350px;">
			<legend><b>Save Search</b></legend>

			<div style="padding: 5px; style="margin-top: 10px;"">
				<label style="font-weight: bold" for="searchname">Name</label>
				<input class="forminput" style="width:270px; font-size: 10pt;" id="searchname" name="searchname" value="<?php echo $searchname; ?>" />
			</div>

			<div style="float:left; margin-top: 5px;">
				<?php
				if ($searchid == "") {
					echo '<input class="submit" type="submit" value="Save" id="addsearch" name="addsearch">';
				} else {
					echo '<input class="submit" type="submit" value="Save" id="savesearch" name="savesearch">';
				}
				?>
			</div>
		</fieldset>
	</div>
</div>

<div id="linkpicker" style="float: left; width: 320px; margin-left: 10px; display: none">
	<div style="font-weight: bold; font-size: 130%; padding: 5px; margin-bottom: 5px; margin-left: 8px;">My Links Selector <a href="#" style="margin-left: 20px;font-weight: normal; font-size: 80%;" onclick="javascript: toggleLinkPicker();">Close</a></div>
	<div class="formrow">
		<div id="linktypes" class="forminput">

		<?php
			echo "<table class='table' cellspacing='0' cellpadding='3' border='0'>";
			echo "<tr>";
			echo "<th width='89%'></th>";
			echo "<th width='90'></th>";
			echo "</tr>";

			$linkgroup = "";

			$allSelected = true;
			$links = "";
			$linkHeading = "";

			foreach($linktypes as $linktype) {

				if ($linktype->grouplabel != $linkgroup && $linkgroup != "") {
					if ($linkgroup == "Positive") {
						$linkHeading .= "<tr class='linktypepositive'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
						if ($allSelected) {
							$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroupPositive" onclick="groupSelection(\'linkGroupPositive\', \''.$linkgroup.'\')"></input></td></tr>';
						} else {
							$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroupPositive" onclick="groupSelection(\'linkGroupPositive\', \''.$linkgroup.'\')"></input></td></tr>';
						}
					} else if ($linkgroup == "Negative") {
						$linkHeading .= "<tr class='linktypenegative'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
						if ($allSelected) {
							$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroupNegative" onclick="groupSelection(\'linkGroupNegative\', \''.$linkgroup.'\')"></input></td></tr>';
						} else {
							$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroupNegative" onclick="groupSelection(\'linkGroupNegative\', \''.$linkgroup.'\')"></input></td></tr>';
						}
					} else {
						$linkHeading .= "<tr class='linktypeneutral'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
						if ($allSelected) {
							$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroupNeutral" onclick="groupSelection(\'linkGroupNeutral\', \''.$linkgroup.'\')"></input></td></tr>';
						} else {
							$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroupNeutral" onclick="groupSelection(\'linkGroupNeutral\', \''.$linkgroup.'\')"></input></td></tr>';
						}
					}

					echo $linkHeading;
					echo $links;

					$linkHeading = "";
					$links = "";
					$allSelected = true;
				}

				$linkgroup = $linktype->grouplabel;

				$links .= "<td id='name-".$linktype->linktypeid."'>".$linktype->label;
				$links .= "</td>";

				$links .= "<td>";
				if (count($linkTypeFilterList) > 0
						&& $linkTypeFilterList[$linktype->label]) {
					$links .= '<input onclick="checkForGroupSelected()" type="checkbox" name="checklist[]" id="'.htmlspecialchars($linktype->grouplabel).'" checked value="'.htmlspecialchars($linktype->label).'"></input>';
			    } else {
			    	$allSelected = false;
					$links .= '<input onclick="checkForGroupSelected()" type="checkbox" name="checklist[]" id="'.htmlspecialchars($linktype->grouplabel).'" value="'.htmlspecialchars($linktype->label).'"></input>';
			    }
				$links .= "</td>";

				$links .= "</tr>";
			}

			if ($linkgroup == "Positive") {
				$linkHeading .= "<tr class='linktypepositive'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
				if ($allSelected) {
					$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupPositive\', \''.$linkgroup.'\')"></input></td></tr>';
				} else {
					$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupPositive\', \''.$linkgroup.'\')"></input></td></tr>';
				}
			} else if ($linkgroup == "Negative") {
				$linkHeading .= "<tr class='linktypenegative'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
				if ($allSelected) {
					$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupNegative\', \''.$linkgroup.'\')"></input></td></tr>';
				} else {
					$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupNegative\', \''.$linkgroup.'\')"></input></td></tr>';
				}
			} else {
				$linkHeading .= "<tr class='linktypeneutral'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
				if ($allSelected) {
					$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupNeutral\', \''.$linkgroup.'\')"></input></td></tr>';
				} else {
					$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroupNeutral" onclick="groupSelection(\'linkGroupNeutral\', \''.$linkgroup.'\')"></input></td></tr>';
				}
			}
			echo $linkHeading;
			echo $links;

			echo "</table>";
		?>
		</div>
	</div>
</div>

</form>

</div>

<div id="nodepicker" style="float: left; width: 320px; margin-left: 10px; display: none">
	<div style="font-weight: bold; font-size: 130%; padding: 5px; margin-bottom: 5px;">Idea Selector <a href="#" style="margin-left: 20px;font-weight: normal; font-size: 80%;" onclick="javascript: toggleNodePicker();">Close</a></div>
	<div id="tabber">
		<ul id="tabs" class="tab2">
		    <li class="tab"><a class="tab current" id="tab-conn-node" href="#" onclick="javascript: viewNodes();"><span class="tab">Mine (<span id="node-conn-list-count">0</span>)</span></a></li>
		    <li class="tab"><a class="tab unselected" id="tab-conn-bookmarks" href="#" onclick="javascript: viewBookmarks();"><span class="tab">Bookmarks (<span id="bookmark-conn-list-count">0</span>)</span></a></li>
		    <li class="tab"><a class="tab unselected" id="tab-conn-search" href="#" onclick="javascript: viewSearch();"><span class="tab">Search (<span id="search-conn-list-count">0</span>)</span></a></li>
		</ul>
		<div id="tabs-content">
			<div id='conn-idea-list' class='tabcontent' style="width: 320px; height: 500px;"></div>
		    <div id='conn-bookmark-list' class='tabcontent' style="width: 320px; height: 500px; display: none;"></div>
		    <div id='conn-search-list' class='tabcontent' style="width: 320px; height: 500px; display: none;">
		    	<div>
			    	<label for="connsearch" style="float: left; margin-right: 3px; margin-top: 3px;">Search</label>
			    	<div style="float: left;">
						<input type="text" style=" margin-right:3px; width:200px" id="connsearch" name="connsearch" value=""  onkeypress="pickerSearchKeyPressed(event)" />
						<div style="clear: both;">
							<input type="radio" id="pickerscope" name="pickerscope" value="my" />My Items &nbsp;
							<input type="radio" id="pickerscope" name="pickerscope" value="all" checked="checked" /> All &nbsp;
							<input type="checkbox" id="tagsonly" name="tagsonly" value="true" /> Tags Only &nbsp;
						</div>
						<!-- div id="q_choices" class="autocomplete" style="border-color: white;"></div -->
						</div>
						<div style="float:left;"><input type="button" value="Go" onclick="javascript: runPickerSearch('0', '10');" ></input></div>
				 </div>
				 <div id="conn-search-results" style="clear: both; margin-top: 5px; border-top: 1px solid #d3e8e8;">

				 </div>
			</div>
		</div>
	</div>

</div>


<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>