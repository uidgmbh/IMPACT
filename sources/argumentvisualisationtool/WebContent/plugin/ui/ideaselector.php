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

    include_once($CFG->dirAddress."includes/dialogheader.php");
    
    $ownOnly = trim(optional_param("ownonly", false, PARAM_TEXT));    
?>

<script type="text/javascript">

	var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
	var URL_ROOT = "<?php echo $CFG->homeAddress; ?>";
	var sratedLoading = false;
	var ownOnly = <?php echo $ownOnly; ?>;

   	function init(){
	    //$('dialogheader').insert('Idea Selector');

		loadPickerNodes('<?php echo($USER->userid); ?>', 0, 10);
		
		if (!ownOnly) {
			loadPickerBookmarks(0, 10);
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
	   if (!ownOnly) {
		   var radios = document.getElementsByName('pickerscope');
		   if (radios[0].checked == true) {
			   scope = "my";
		   } else {
			   scope = "all";
		   }
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

	/**
	* Load the node data into the currently selected idea.
	*/
	function loadConnectionNode(node, role) {
        if (window.opener.addSelectedNode) { 
    		window.opener.addSelectedNode(node, role);
        	window.close();
        }
	}
   		
	function viewNodes() {
   	   	$("tab-conn-node").removeClassName("unselected");
   	   	$("tab-conn-node").addClassName("current");
   	   	$("conn-idea-list").style.display = 'block';

 	   	if (!ownOnly) {
 	   		$("tab-conn-bookmarks").removeClassName("current");
 	   		$("tab-conn-bookmarks").addClassName("unselected");
 	   		$("conn-bookmark-list").style.display = 'none';
 	   	}
 	   	
 	   	$("tab-conn-search").removeClassName("current");
 	   	$("tab-conn-search").addClassName("unselected");
 	   	$("conn-search-list").style.display = 'none';
	}

	function viewBookmarks() {
   	    $("tab-conn-node").removeClassName("current");
   	    $("tab-conn-node").addClassName("unselected");
   	    $("conn-idea-list").style.display = 'none';

  	   	if (!ownOnly) {
  	   		$("tab-conn-bookmarks").removeClassName("unselected");
  	   		$("tab-conn-bookmarks").addClassName("current");
  	   		$("conn-bookmark-list").style.display = 'block';
  	   	}
  	   	
   	    $("tab-conn-search").removeClassName("current");
   	    $("tab-conn-search").addClassName("unselected");
   	    $("conn-search-list").style.display = 'none';
	}

 	function viewSearch() {
   	   	$("tab-conn-node").removeClassName("current");
   	   	$("tab-conn-node").addClassName("unselected");
   	   	$("conn-idea-list").style.display = 'none';

   	   	if (!ownOnly) {
	   	   $("tab-conn-bookmarks").removeClassName("current");
	   	   $("tab-conn-bookmarks").addClassName("unselected");
	   	   $("conn-bookmark-list").style.display = 'none';
   	   	}
   	   	
   	   	$("tab-conn-search").removeClassName("unselected");
   	   	$("tab-conn-search").addClassName("current");
   	   	$("conn-search-list").style.display = 'block';
  	}

   	window.onload = init;

</script>

<?php if (!$ownOnly) { ?>
	<div style="font-weight: bold; font-size: 130%; padding: 5px; padding-top:0px; margin-bottom: 5px;">Idea Selector <a href="#" style="margin-left: 20px;font-weight: normal; font-size: 80%;" onclick="javascript: window.close();">Close</a></div>
<?php } else { ?>
	<div style="font-weight: bold; font-size: 130%; padding: 5px; padding-top:0px; margin-bottom: 5px;">My Idea Selector <a href="#" style="margin-left: 20px;font-weight: normal; font-size: 80%;" onclick="javascript: window.close();">Close</a></div>
<?php } ?>
<div id="nodepicker" style="float: left; width: 320px; margin-left: 10px; display: block">
	<div id="tabber">
		<ul id="tabs" class="tab2">
		    <li class="tab"><a class="tab current" id="tab-conn-node" href="#" onclick="javascript: viewNodes();"><span class="tab">Mine (<span id="node-conn-list-count">0</span>)</span></a></li>
		    <?php if (!$ownOnly) { ?>
		    	<li class="tab"><a class="tab unselected" id="tab-conn-bookmarks" href="#" onclick="javascript: viewBookmarks();"><span class="tab">Bookmarks (<span id="bookmark-conn-list-count">0</span>)</span></a></li>
		    <?php } ?>
	    	<li class="tab"><a class="tab unselected" id="tab-conn-search" href="#" onclick="javascript: viewSearch();"><span class="tab">Search (<span id="search-conn-list-count">0</span>)</span></a></li>
		</ul>
		<div id="tabs-content">
			<div id='conn-idea-list' class='tabcontent' style="width: 320px; height: 470px;"></div>
		    
		    <?php if (!$ownOnly) { ?>
				<div id='conn-bookmark-list' class='tabcontent' style="width: 320px; height: 470px; display: none;"></div>
			<?php } ?>
			    <div id='conn-search-list' class='tabcontent' style="width: 320px; height: 470px; display: none;">
			    	<div>
				    	<label for="connsearch" style="float: left; margin-right: 3px; margin-top: 3px;">Search</label>
				    	<div style="float: left;">
							<input type="text" style=" margin-right:3px; width:200px" id="connsearch" name="connsearch" value=""  onkeypress="pickerSearchKeyPressed(event)" />
							<div style="clear: both;">
								
								<?php if (!$ownOnly) { ?>
									<input type="radio" id="pickerscope" name="pickerscope" value="my" />My Items &nbsp;
									<input type="radio" id="pickerscope" name="pickerscope" value="all" checked="checked" /> All &nbsp;
								<?php } else { ?>
									<input type="hidden" id="pickerscope" name="pickerscope" value="my" />
								<?php } ?>
								
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