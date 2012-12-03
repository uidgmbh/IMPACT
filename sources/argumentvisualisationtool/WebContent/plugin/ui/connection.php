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
    global $USER, $CFG;
    checkLogin();

    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/scriptaculous/scriptaculous.js' type='text/javascript'></script>");
    include_once($CFG->dirAddress."includes/dialogheader.php");

    $roleid0 = optional_param("roleid0","",PARAM_TEXT);
    $ideaid0 = optional_param("ideaid0","",PARAM_TEXT);

    $url = optional_param("url","",PARAM_URL);
    $urltitle = stripslashes(optional_param("urltitle","",PARAM_TEXT));
    $urlclip = stripslashes(optional_param("urlclip","",PARAM_TEXT));

    $linktype = optional_param("linktype","",PARAM_TEXT);

    $roleid1 = optional_param("roleid1","",PARAM_TEXT);
    $ideaid1 = optional_param("ideaid1","",PARAM_TEXT);

    $desc = stripslashes(trim(optional_param("desc","",PARAM_TEXT)));

    $newtags = optional_param("newtags","",PARAM_TEXT);
    $removetagsarray = optional_param("removetags","",PARAM_TEXT);


    // Temproary code to keep it backward compatible until new Firefox extensions go out.
    $url0 = optional_param("url0","",PARAM_URL);
    $urltitle0 = stripslashes(optional_param("urltitle0","",PARAM_TEXT));
    $url1 = optional_param("url1","",PARAM_URL);
    $urltitle1 = stripslashes(optional_param("urltitle1","",PARAM_TEXT));
    if ($url == "" && $url0 != "") {
    	$url = $url0;
    	$urltitle = $urltitle0;
    }
    if ($url == "" && $url1 != "") {
    	$url = $url1;
    	$urltitle = $urltitle1;
    }

    // only want to set the default privacy if the form hasn't been posted yet
    if(isset($_POST["addconn"]) || isset($_POST["saveconn"])){
        $private = optional_param("private","Y",PARAM_ALPHA);
    } else {
    	$private = optional_param("private",$USER->privatedata,PARAM_ALPHA);
    }

    $groups = optional_param("groups","",PARAM_TEXT);
    if($groups == ""){
        $groups = array();
    }

    $gs = getMyGroups();
    $mygroups = $gs->groups;
   	$tags = array();

    // see if this is a request to edit node
    $connid = optional_param("connid","",PARAM_TEXT);

    $linkid = "";
    if($connid != "" && !isset($_POST["saveconn"])){
        // load the node and set the params
        $conn = getConnection($connid);
        if (!$conn instanceof Connection){
            echo "Connection not found";
            die;
        }
        // check user can edit this node
        try {
            $conn->canedit();
        } catch (Exception $e){
            echo "You do not have permissions to edit this connection";
            die;
        }

        $roleObj0 = $conn->fromrole;
        $roleid0 = $conn->fromrole->roleid;

        $ideaObj0 = $conn->from;
        $ideaid0 = $conn->from->nodeid;

        $linktype = $conn->linktype->label;
        $linkid = $conn->linktype->linkid;

        $ideaObj1 = $conn->to;
        $ideaid1 = $conn->to->nodeid;

        $roleObj1 = $conn->torole;
    	$roleid1 = $conn->torole->roleid;

        $private = $conn->private;

        $desc = $conn->description;

        $cgs = $conn->groups;
        if($cgs){
            foreach($cgs as $g){
                array_push($groups,$g->groupid);
            }
        }

        if($conn->tags) {
        	$tags = $conn->tags;
        }
    } else {
    	// load role data if vaiables passed
        if ($roleid0 != "") {
        	$roleObj0 = new Role($roleid0);
        	$roleObj0->load();
        }
        if ($roleid1 != "") {
        	$roleObj1 = new Role($roleid1);
        	$roleObj1->load();
        }

    	// load idea and role data if vaiables passed
        if ($ideaid0 != "") {
        	$ideaObj0 = getnode($ideaid0);
        	if ($ideaObj0->users[0]) {
        		if ($roleid0 == "") {
        			$roleObj0 = $ideaObj0->role;
	               	$roleid0 = $ideaObj0->role->roleid;
        		}
        	}
        }

        if ($ideaid1 != "") {
         	$ideaObj1 = getnode($ideaid1);
         	if ($ideaObj1->users[0]) {
        		if ($roleid1 == "") {
        			$roleObj1 = $ideaObj1->role;
        			$roleid1 = $ideaObj1->role->roleid;
        		}
         	}
        }
    }

    $errors = array();

    $rs = getAllRoles();
    $roles = $rs->roles;


    if(isset($_POST["addconn"])){
        //check all fields entered
    	if ($ideaid0 == "") {
            array_push($errors,"You must add a 'from' idea.");
        }
        if ($linktype == ""){
            array_push($errors,"You must select a link type");
        }
        if ($ideaid1 == ""){
            array_push($errors,"You must add a 'to' idea.");
        }

        if(empty($errors)){

        	// get from node
          	if ($ideaObj0 != null) {
         		$fromnode = $ideaObj0;
        	} else {
        		$fromnode = getnode($ideaid0);
        	}

            // add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                    addGroupToNode($fromnode->nodeid,$group);
                }
            }

            // get to node
         	if ($ideaObj1 != null) {
         		$tonode = $ideaObj1;
    		} else {
    			$tonode = getnode($ideaid1);
    		}

            // add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                    addGroupToNode($tonode->nodeid,$group);
                }
            }

            // create connection
            $c = addConnection($fromnode->nodeid, $roleid0, $linktype, $tonode->nodeid, $roleid1, $private,$desc);

            // add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                    addGroupToConnection($c->connid,$group);
                }
            }

            // Add any new tags
            $newtagsarray = split(',', $newtags);
            if(sizeof($newtagsarray) != 0){
                foreach($newtagsarray as $tagname){
                	$tagname = trim($tagname);
                	if ($tagname && $tagname != "") {
	                	$tag = addTag($tagname);
	                	if ($tag && $tag->tagid) {
	                		$c->addTag($tag->tagid);
	                	}
                	}
                }
            }

            // refresh parent window then close
             // refresh parent window then close
            /*echo "<script type='text/javascript'>";
            echo "   var val = 'conn-list';";
            echo "	 try {";
            echo "	 	var url = opener.document.location;";
            echo "	 	var strippedUrl = url.toString().split(\"#\");";
            echo "	 	if(strippedUrl.length > 1){";
            echo "		 	if (strippedUrl[1] == 'conn-net' || strippedUrl[1] == 'conn-neighbour') {";
            echo "				val = strippedUrl[1];";
            echo "		 	}";
            echo "	 	}";
            echo "  } catch(err) {}";
            echo "  closeDialog(val)";
            echo "</script>";*/

			echo "<script type='text/javascript'>";

			echo "  closeDialog('current')";
			echo "</script>";

 			include_once($CFG->dirAddress."includes/dialogfooter.php");
            die;
        }
    }

    if(isset($_POST["saveconn"])){
    	if ($ideaid0 == "") {
            array_push($errors,"You must add a 'from' idea.");
        }
        if ($linktype == ""){
            array_push($errors,"You must select a link type");
        }
        if ($ideaid1 == ""){
            array_push($errors,"You must add a 'to' idea.");
        }

        if(empty($errors)){

        	// get to node
          	if ($ideaObj0 != null) {
         		$fromnode = $ideaObj0;
        	} else {
        		$fromnode = getnode($ideaid0);
        	}

          	// add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                    addGroupToNode($fromnode->nodeid,$group);
                }
            }

            // get to node
         	if ($ideaObj1 != null) {
         		$tonode = $ideaObj1;
    		} else {
    			$tonode = getnode($ideaid1);
    		}

            // add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                    addGroupToNode($tonode->nodeid,$group);
                }
            }

            // create connection
            $c = editConnection($connid, $fromnode->nodeid, $roleid0, $linktype, $tonode->nodeid, $roleid1, $private,$desc);
            removeAllGroupsFromConnection($c->connid);
            // add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                    addGroupToConnection($c->connid,$group);
                }
            }

            // remove from this node any tags marked for removal
            if(sizeof($removetagsarray) > 0){
                for($i=0; $i<sizeof($removetagsarray); $i++){
                    if($removetagsarray[$i] != ""){
                		$c->removeTag($removetagsarray[$i]);
                	}
                }
            }

            // Add any new tags
            $newtagsarray = split(',', $newtags);
            if(sizeof($newtagsarray) != 0){
                foreach($newtagsarray as $tagname){
                	$tagname = trim($tagname);
                	if ($tagname && $tagname != "") {
	                	$tag = addTag($tagname);
	                	if ($tag && $tag->tagid) {
	                		$c->addTag($tag->tagid);
	                	}
                	}
                }
            }

            // refresh parent window then close
            echo '<script type="text/javascript">';
            echo '  closeDialog("current")';
            echo '</script>';
            include_once($CFG->dirAddress."includes/dialogfooter.php");
            die;
        }
    }
?>

<?php
    if(!empty($errors)){
        echo "<div class='errors'>";
        echo "The connection could not be created because of the following errors:";
        echo "<ul>";
        foreach($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul>";
        echo "</div>";
    }


?>

<script type="text/javascript">

   var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";

   var selectedIdea = '0';

   // array for linktype group colours
   ltgroups = new Array();
   ltgroups["positive"] = "#00BD53";
   ltgroups["neutral"] = "#B2B2B2";
   ltgroups["negative"] = "#C10031";
   var roles = null;
   var linktypes = null;
   var role0 = null;
   var role1 = null;
   var node0 = null;
   var node1 = null;

   function init(){
  	    //self.resizeTo(790,650);

	    $('dialogheader').insert('Connection Builder');

        loadnodes('<?php echo($USER->userid); ?>', 0, 10);
        loadbookmarks(0, 10);
        loadLinkTypes('<?php echo($linktype); ?>');

        <?php if ($ideaObj0) {
        	$jsonIdea0 = json_encode($ideaObj0);
        	echo "node0 = ";
        	echo $jsonIdea0;
        	echo ";";

        	$jsonRole0 = json_encode($roleObj0);
        	echo "role0 = ";
        	echo $jsonRole0;
        	echo ";";
        }
        ?>
        <?php if ($ideaObj1) {
        	$jsonIdea1 = json_encode($ideaObj1);
        	echo "node1 = ";
        	echo $jsonIdea1;
        	echo ";";

        	$jsonRole1 = json_encode($roleObj1);
        	echo "role1 = ";
        	echo $jsonRole1;
        	echo ";";
        }
        ?>

        if (node0 != null) {
        	loadConnectionNodeInternal(node0, role0, '0');
        } else {
	        renderFakeNode("0");
        }

        if (node1 != null) {
        	loadConnectionNodeInternal(node1, role1, '1');
        } else {
        	renderFakeNode("1");
        }

        if (node0 != null && node1 == null) {
        	selectIdea('1');
        } else {
        	selectIdea('0');
        }

    	new Ajax.Autocompleter("newtags", "newtags_choices", URL_ROOT+"api/service.php?method=gettagsbyfirstcharacters&format=list&scope=all", {paramName: "q", minChars: 1, tokens: ","});
   }

   function loadLinkTypes(selectedName){
        var reqUrl = SERVICE_ROOT + "&method=getalllinktypes";

        $('linktype').update("");
        $('linktypegroup').update("");

        new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }
                    linktypes = json.linktypeset[0].linktypes;

                    var curgroup = "";

                    if (selectedName == ""){
                        var opt = new Element("option",{'value':'','style':'background:white','selected':true}).insert("Select link type...");
                    } else {
                        var opt = new Element("option",{'value':'','style':'background:white'}).insert("Select link type...");
                    }
                    $('linktype').insert(opt);

                    for (var i=0; i<linktypes.length; i++){
                        if (curgroup != linktypes[i].linktype.grouplabel){
                            var opt = new Element("option",{'value':'','style':'background:white'}).insert("");
                            $('linktype').insert(opt);
                            var opt = new Element("option",{'value':'','style':'background:'+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]}).insert(linktypes[i].linktype.grouplabel);
                            $('linktype').insert(opt);
                            var opt = new Element("option",{'value':linktypes[i].linktype.grouplabel.toLowerCase(),'style':'background:'+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]}).insert(linktypes[i].linktype.grouplabel);
                            $('linktypegroup').insert(opt);
                        }

                         if(selectedName == linktypes[i].linktype.label){
                            var opt = new Element("option",{'value':linktypes[i].linktype.linktypeid,'style':'background:white','selected':true}).insert(linktypes[i].linktype.label);
                            $('linktype').insert(opt);
                        } else {
                            var opt = new Element("option",{'value':linktypes[i].linktype.linktypeid,'style':'background:white'}).insert(linktypes[i].linktype.label);
                            $('linktype').insert(opt);
                        }
                        curgroup = linktypes[i].linktype.grouplabel;
                    }
                    linkTypeSelected();
                }
            });
   }

   function linkTypeSelected(){
        // find which group it belongs to and change the colour accordingly
        var s = $('linktype')[$('linktype').selectedIndex].value;
        for (var i=0; i<linktypes.length; i++){
            if(linktypes[i].linktype.linktypeid == s){
                $('link-top').setStyle('background-image: url("'+URL_ROOT+'images/connection/edit/link-'+linktypes[i].linktype.grouplabel.toLowerCase()+'-top2.png")');
                $('link-bottom').setStyle('background-image: url("'+URL_ROOT+'images/connection/edit/link-'+linktypes[i].linktype.grouplabel.toLowerCase()+'-bottom2.png")');
                $('link').setStyle('border-left: 2px solid '+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]);
                $('link').setStyle('border-right: 2px solid '+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]);
                $('linktype').setStyle('background:'+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]);
                return;
            }
        }
   }

   /**
    * This swaps the from and to ideas around
    */
   function switchIdeas(){
	   	var nodetemp = node0;
		node0 = node1;
		node1 = nodetemp;

    	var temprole = role0;
    	role0 = role1;
    	role1 = temprole;

    	if (node0 != null) {
       		loadConnectionNodeInternal(node0, role0, '0');
    	} else {
    		renderFakeNode("0");
    	}

    	if (node1 != null) {
    		loadConnectionNodeInternal(node1, role1, '1');
    	} else {
    		renderFakeNode("1");
    	}
   }

   /**
    * Show the dialog to add a new link type
    */
   function addLinkType(){
        $('newlinktypeform').show();
        $('addnewlinktype').hide();
   }

   /**
    * Hide the dialog to add a new link type
    */
   function cancelAddLinkType(){
        $('newlinktypeform').hide();
        $('addnewlinktype').show();
   }

   /**
    * Process the request to add a new link type
    */
   function addNewLinkType(){

        if($('newlinktype').value == ""){
            alert("You must enter a new link type name.");
            return;
        } else if (($('newlinktype').value).indexOf(",") != -1) {
    		// Check for comma, as this character is not allowed
    		// as it is the separator used to send list of link types to the server.
    		alert("Sorry, commas are not allowed in link type names.")
    		return;
        }
        if($('linktypegroup')[$('linktypegroup').selectedIndex].value == ""){
            alert("You must select a link type group.");
            return;
        }
        var reqUrl = SERVICE_ROOT + "&method=addlinktype&label=" + encodeURIComponent($('newlinktype').value) + "&linktypegroup="+$('linktypegroup')[$('linktypegroup').selectedIndex].value;

        new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }
                    //refresh the link type drop drop down
                    loadLinkTypes($('newlinktype').value);

                    //reset and hide the form
                    $('newlinktype').value = "";
                    $('newlinktypeform').hide();
                    $('addnewlinktype').show();
                    $('closenewlinktype').hide();
                }
            });
   }

   function toggleGroups() {
		if ( $("groupsdiv").style.display == "block") {
			$("groupsdiv").style.display = "none";
			$("groupsimg").src=URL_ROOT+"images/arrow-down-green.png";
		} else {
			$("groupsdiv").style.display = "block";
			$("groupsimg").src=URL_ROOT+"images/arrow-up-green.png";
		}
	}

   function toggleTags() {
		if ( $("tagsdiv").style.display == "block") {
			$("tagsdiv").style.display = "none";
			$("tagsimg").src=URL_ROOT+"images/arrow-down-green.png";
		} else {
			$("tagsdiv").style.display = "block";
			$("tagsimg").src=URL_ROOT+"images/arrow-up-green.png";
		}
	}


	/**
	 * Check to see if the enter key was pressed.
	 */
	function runSearchKeyPressed(evt) {
		var event = evt || window.event;
		var thing = event.target || event.srcElement;

		var characterCode = document.all? window.event.keyCode:event.which;
		if(characterCode == 13) {
			runSearch('0', '10')
		}
	}

   function runSearch(start, max) {
	   $("conn-search-results").innerHTML = "";

	   var search = $('connsearch').value;

	   // pants but works - couldn't get jquery to work
	   var scope = 'my'
	   var radios = document.getElementsByName('scope');
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

   function loadbookmarks(start, max) {
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
   function loadnodes(userid, start, max){
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

	   //if (type == "node") {
		//   nav.insert("<a href=\"javascript:loadDialog('createidea','"+URL_ROOT+"plugin/ui/idea.php');\" title='Add Idea'><img alt='Add Idea' src='"+URL_ROOT+"images/toolbars/plus.png' class='toolbar' style='margin-right: 5px;' /></a>");
	   //}

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
	   	            	loadnodes('<?php echo($USER->userid); ?>', newArr["start"], newArr["max"])
	   	            } else if (type=="bookmarks") {
	   	            	loadbookmarks(newArr["start"], newArr["max"]);
	   	            } else if (type=="search") {
	   	            	runSearch(newArr["start"], newArr["max"]);
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
	   	            	loadnodes('<?php echo($USER->userid); ?>', newArr["start"], newArr["max"])
	   	            } else if (type=="bookmarks") {
	   	            	loadbookmarks(newArr["start"], newArr["max"]);
	   	            } else if (type=="search") {
	   	            	runSearch(newArr["start"], newArr["max"]);
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
   	            	loadnodes('<?php echo($USER->userid); ?>', arrayData['start'], arrayData['max']);
   	            } else if (type=="bookmarks") {
   	            	loadbookmarks(arrayData['start'], arrayData['max']);
   	            } else if (type=="search") {
   	            	runSearch(arrayData['start'], arrayData['max']);
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

   function selectIdea(objno) {
	   $('ideadivarea0').className = "ideadiv";
	   $('ideadivarea1').className = "ideadiv";
	   $('ideadivarea'+objno).className = "ideadivselected";
	   selectedIdea = objno;
   }

   /**
    * For when a node has no connections at one end or both.
    */
   function renderFakeNode(type){
       $('changetype'+type).style.visibility = "hidden";
       $('removeidea'+type).style.visibility = "hidden";

	   	var iDiv = new Element("div", {'class':'idea-container-fake'});
	   	var ihDiv = new Element("div", {'class':'idea-header-fake'});
	   	var itDiv = new Element("div", {'class':'idea-title-fake'});
	   	if (type == "0") {
	   		itDiv.update('CONNECT FROM: <span style="font-weight: normal; padding-left:3px;"> (click to select this end)</span><br/><br />Click on an Idea on the left hand lists or');
	   	} else {
	   		itDiv.update('CONNECT TO: <span style="font-weight: normal; padding-left:3px;">(click to select this end)</span><br/><br />Click on an Idea on the left hand lists or');
	   	}
	   	ihDiv.insert(itDiv);

	   	var iwDiv = new Element("div", {'class':'idea-wrapper'});
	   	var imDiv = new Element("div", {'class':'idea-main'});
	   	var idDiv = new Element("div", {'class':'idea-detail'});

   		var headerDiv = new Element("div", {'class':'idea-menus'});
   		headerDiv.insert("<span class='active'>add new</span>");

   		// passs up any url info coming from firefox extension
   		var data = "";
   		var url = $('url').value;
   		var urltitle = $('urltitle').value;
   		var urlclip = $('urlclip').value;
   		data+="?url="+url+"&urltitle="+urltitle+"&urlclip="+urlclip;

   		Event.observe(headerDiv,'click',function (){loadDialog("createidea",URL_ROOT+'plugin/ui/idea.php'+data);});
   		idDiv.insert(headerDiv);
	   	imDiv.insert(idDiv);

	   	iwDiv.insert(imDiv);
	   	iwDiv.insert('<div style="clear:both;"></div>');

	   	iDiv.insert(ihDiv);
	   	iDiv.insert('<div style="clear:both;"></div>');
	   	iDiv.insert(iwDiv);

	   	$('ideaid'+type).value = "";
	   	$('roleid'+type).value = "";
	   	if (type == "0") {
	   		node0 = null;
	   		role0 = null;
	   	} else {
	   		node1 = null;
	   		role1 = null;
	   	}
	    $('ideadivarea'+type).innerHTML = "";
    	$('ideadivarea'+type).insert(iDiv);
   }

   /**
    * Reload the node with a new idea
    */
   function loadConnectionNodeType(role) {
	   if (role != null) {
		   if (selectedIdea == '0') {
			   loadConnectionNode(node0, role, selectedIdea);
		   } else {
			   loadConnectionNode(node1, role, selectedIdea);
		   }
	   } else {
		   alert("Chosen type was not correctly passed");
	   }
   }

   /**
    * Open the Idea Type Manager to allow type selection + creation
    */
   function changeConnectionNodeType(selection) {
       selectIdea(selection);
       loadDialog("managerolesselection",URL_ROOT+'plugin/ui/role.php?type=selection');
   }

   /**
    * Remove the node at the given position and replace with blank node.
    */
   function removeConnectionNode(selection) {
       renderFakeNode(selection);
       selectIdea(selection);
   }

   /**
    * When New node created in popup, wnat to refresh list, so have separate entry point
    */
   function addNewConnectionNode(node, role) {
	   loadConnectionNodeInternal(node, role, selectedIdea);
       loadnodes('<?php echo($USER->userid); ?>', 0, 10);
   }

   /**
    * Load the node data into the currently selected idea.
    */
   function loadConnectionNode(node, role) {
	   loadConnectionNodeInternal(node, role, selectedIdea);
   }

   /**
    * Load the node data into the indicated idea.
    */
   function loadConnectionNodeInternal(node, role, selection) {

	   var blobNode = renderNode(node, "conn"+selection, role, false, 'inactive');
       $('ideadivarea'+selection).innerHTML = "";
       $('ideadivarea'+selection).insert(blobNode);

       $('ideaid'+selection).value = node.nodeid;
       $('roleid'+selection).value = role.roleid;

       $('changetype'+selection).style.visibility = "visible";
       $('removeidea'+selection).style.visibility = "visible";

	   if (selection == '0') {
		   node0 = node;
		   role0 = role;
	   } else {
		   node1 = node;
		   role1 = role;
	   }
   }

   window.onload = init;
</script>

<div id="connectionmain" style="width: 100%; overflow: hidden">

<div style="float: left; width: 320px; margin-right: 20px;">
	<div style="font-weight: bold; font-size: 130%; padding: 5px; margin-bottom: 5px; margin-right: 10px;">Idea Selector</div>
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
						<input type="text" style=" margin-right:3px; width:200px" id="connsearch" name="connsearch" value="" onkeypress="runSearchKeyPressed(event)" />
						<div style="clear: both;">
							<input type="radio" id="scope" name="scope" value="my" />My Items &nbsp;
							<input type="radio" id="scope" name="scope" value="all" checked="checked" /> All &nbsp;
							<input type="checkbox" id="tagsonly" name="tagsonly" value="true" /> Tags Only &nbsp;
						</div>
						<!-- div id="q_choices" class="autocomplete" style="border-color: white;"></div -->
						</div>
						<div style="float:left;"><button onclick="javascript: runSearch('0', '10');" >Go </button></div>
				 </div>
				 <div id="conn-search-results" style="clear: both; margin-top: 5px; border-top: 1px solid #d3e8e8;">

				 </div>
			</div>
		</div>
	</div>
</div>

<div style="float: left; margin-top: 30px;">
<form name="addidea" action="" method="post">

	<input type="hidden" id="ideaid0" name="ideaid0" value="<?php echo $ideaid0; ?>">
	<input type="hidden" id="ideaid1" name="ideaid1" value="<?php echo $ideaid1; ?>">

	<input type="hidden" id="roleid0" name="roleid0" value="<?php echo $roleid0; ?>">
	<input type="hidden" id="roleid1" name="roleid1" value="<?php echo $roleid1; ?>">

	<input type="hidden" id="url" name="url" value="<?php echo $url; ?>">
	<input type="hidden" id="urltitle" name="urltitle" value="<?php echo $urltitle; ?>">
	<input type="hidden" id="urlclip" name="urlclip" value="<?php echo $urlclip; ?>">

	<!-- IDEA 0 (FROM)-->
	<div id="ideadivspacer0" class="ideadivspacer">
		<table>
			<tr>
			<td><div id='changetype0' style="width: 55px; float:left; visibility: hidden; padding: 3px;"><a title="Change the idea type used, just for this connection" href="javascript: changeConnectionNodeType('0')">Override Type</a></div></td>
			<td><div id="ideadivarea0" class="ideadiv" onclick="selectIdea('0')"></div></td>
			<td><div id="removeidea0" style="width: 40px; float: left; visibility: hidden; padding: 3px; "><a title="Remove this node from the connection" href="javascript: removeConnectionNode('0')">Remove</a></div></td>
			</tr>
		</table>
	</div>

	<div style="clear:both;" id="link-top"></div>

	<!-- LINK -->
	<div id="link">

	    <label for="linktype"><a href="javascript:switchIdeas();" class="form">Switch</a> Link:</label>
	    <select id="linktype" name="linktype" onchange="linkTypeSelected();">
	    </select>
	    <a id="addnewlinktype" href="javascript:addLinkType();" style="padding: 5px;">add new</a>

	    <div style="display:none;" id="newlinktypeform">

	        <div class="subformrow">
	            <label class="subformlabel" for="newlinktype">Link type:</label>
	            <input class="subforminput" type="text" id="newlinktype" name="newlinktype" value=""/>
	        </div>
	        <div class="subformrow">
	            <label class="subformlabel" for="linktypegroup">Group:</label>
	            <select class="subforminput" id="linktypegroup" name="linktypegroup">
	            </select>
	        </div>
	        <div class="subformrow">
	            <input class="subformsubmit" type="button" name="Add" value="Add" onclick="addNewLinkType();">
	            <input class="subformbutton" type="button" name="Cancel" value="Cancel" onclick="cancelAddLinkType();">
	        </div>

	    </div>
	    <div style="clear:both;"></div>
	</div>

	<div style="clear:both;" id="link-bottom"></div>

	<!-- IDEA 1 (TO) -->
	<div id="ideadivspacer1" class="ideadivspacer">
		<table>
			<tr>
			<td><div id='changetype1' style="float:left; visibility: hidden; padding: 3px;"><a title="Change the idea type used, just for this connection" href="javascript: changeConnectionNodeType('1')">Override Type</a></div></td>
			<td><div id="ideadivarea1" class="ideadiv" onclick="selectIdea('1')"></div></td>
			<td><div id="removeidea1" style="float: left; visibility: hidden; padding: 3px; "><a title="Remove this node from the connection" href="javascript: removeConnectionNode('1')">Remove</a></div></td>
			</tr>
		</table>
	</div>

	<div class="formrow">&nbsp</div>

    <div class="formrow">
        <label class="formlabelshort" for="desc">Description:</label>
        <textarea class="forminput hgrinput" style="width:300px;" id="desc" name="desc" rows="2"><?php echo( htmlspecialchars($desc) ); ?></textarea>
    </div>

		<div class="formrow">
	        <label class="formlabelshort" for="private">Public:</label>
	        <input type="checkbox" class="forminput" id="private" name="private" value="N"
	        <?php
	            if($private == "N"){
	                echo ' checked="true"';
	            }
	        ?>
	        >
	    </div>
	    <div class="formrow">
	        <label class="formlabelshort" for="newtags">Add Tags:</label>
	   		<input class="forminput" style="width:300px; font-size: 10pt;" id="newtags" name="newtags" value="<?php echo $newtags; ?>" />
	   		<div id="newtags_choices" class="autocomplete"></div>
	    </div>
	    <div class="formrow" style="margin-bottom: 10px;">
	    	<label class="formlabel" for="newtags">&nbsp;</label>
			<span class="forminput">(comma separated)</span>
		</div>

	    <?php if ($connid && $connid != "" && sizeof($tags) != 0) { ?>
		    <label style="margin-left: 5px;">Tags: <img style="vertical-align: bottom;" id="tagsimg" src="<?php echo $CFG->homeAddress."images/arrow-down-green.png" ?>" onclick="javascript: toggleTags()" border="0" alt="Tags" /></label>
		<?php } ?>
	    <?php if (sizeof($mygroups) != 0 ) { ?>
	        <label style="margin-left: 5px;">Groups: <img style="vertical-align: bottom" id="groupsimg" src="<?php echo $CFG->homeAddress."images/arrow-down-green.png" ?>" onclick="javascript: toggleGroups()" border="0" alt="Groups" /></label>
	    <?php } ?>

		<?php
			if ($connid && $connid != "") {
		?>
			<div class="formrow">
				<div id="tagsdiv" style="display: none; float:left">
			       	<label class="formlabelshort">Added Tags: </label>
			       	<div class="subform2" id="tagform">
			       	<?php
				            $i = 0;
				            foreach($tags as $tag){
			                  $class = "subforminput";
			                  echo '<div id="tagfield'.$i.'" class="subformrow">';
			                  echo '<input type="checkbox" class="'.$class.'" id="removetags" name="removetags[]" value="'.$tag->tagid.'"';
				              if(sizeof($removetagsarray) > 0){
				                  for($j=0; $j<sizeof($removetagsarray); $j++){
					            	  if ($removetagsarray[$j] != ""
					            		  && $removetagsarray[$j] == $tag->tagid) {
					                      echo ' checked="true"';
					            		  break;
					            	  }
				                  }
				              }
			                  echo '>&nbsp;&nbsp;'.$tag->name.'<br/>';
			                  echo '</div>';
			                  $i++;
			              }
			          ?>
			   	      	 <label>(Select to remove)</label>
			      </div>
		      </div>
	      </div>
	   <?php } ?>

	    <?php if(sizeof($mygroups) != 0 ){ ?>
	        <div class="formrow">
				<div id="groupsdiv" style="display: none">
		       	<label class="formlabelshort">Groups: </label>
				<div class="subform2">
	           <?php
	                $i = 0;
	                foreach($mygroups as $group){
	                    $class = "subforminput";
	                    echo '<div class="subformrow">';
	                    echo "<input type='checkbox' class='".$class."' id='groups' name='groups[]' value='".$group->groupid."'";
	                    if(in_array($group->groupid,$groups)){
	                        echo " checked='true'";
	                    }
	                    echo ">".$group->name."<br/>";
	                    echo '</div>';
	                   $i++;
	                }
	            ?>
	            </div>
			    </div>
	        </div>
	    <?php } ?>
	    <div class="formrow">
	         <?php
	            if ($connid == "") {
	                // this is create node form
	                echo '<input class="formsubmit" type="submit" value="Save" id="addconn" name="addconn">';
	            } else {
	                // this is edit node form
	                echo '<input class="formsubmit" type="submit" value="Save" id="saveconn" name="saveconn">';
	            }
	        ?>
	        <input type="button" value="Cancel" onclick="window.close();"/>
	    </div>
	</form>
</div>

</div>

</div>
</div>
<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>