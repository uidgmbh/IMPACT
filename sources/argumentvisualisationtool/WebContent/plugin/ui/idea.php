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
    include_once($CFG->dirAddress."phplib/sociallearnlib.php");
    include_once($CFG->dirAddress."phplib/validateurlsyntax.php");

    $errors = array();

    $nodetypeid = optional_param("role","",PARAM_TEXT);
    $idea = stripslashes(trim(optional_param("idea","",PARAM_TEXT)));
    $desc = stripslashes(trim(optional_param("desc","",PARAM_TEXT)));
    $sdt = trim(optional_param("ideastartdate","",PARAM_TEXT));
    $edt = trim(optional_param("ideaenddate","",PARAM_TEXT));

    $urlarray = optional_param("urlarray","",PARAM_URL);
    $urltitlearray = optional_param("urltitlearray","",PARAM_TEXT);
    $urlidarray = optional_param("urlidarray","",PARAM_TEXT);
    $urlcliparray = optional_param("urlcliparray","",PARAM_TEXT);
    $urlclippatharray = optional_param("urlclippatharray","",PARAM_TEXT);
    $urlcliphtmlarray = optional_param("urlcliphtmlarray","",PARAM_TEXT);

    $location = optional_param("location","",PARAM_TEXT);
    $loccountry = optional_param("loccountry","",PARAM_TEXT);

    $posttosl = optional_param("posttosl","",PARAM_TEXT);
    $selectedURLID = optional_param("imageicon","",PARAM_TEXT);
    $newtags = optional_param("newtags","",PARAM_TEXT);
    $removetagsarray = optional_param("removetags","",PARAM_TEXT);

	if(isset($_POST["addrole"])){
		$rolename = stripslashes(optional_param("rolename","",PARAM_TEXT));
    	if ($rolename != "") {
   	        $photofilename = uploadImage('roleicon',$errors,$CFG->ICON_WIDTH);
	        if ($photofilename == null || $photofilename == "") {
	        	$newRole = addRole($rolename);
	        } else {
	        	$photofilename = "uploads/".$USER->userid."/".$photofilename;
	        	$newRole = addRole($rolename, $photofilename);
	        }
    	} else {
            array_push($errors,"You must enter a link type name.");
        }
    }

    // only want to set the default privacy if the form hasn't been posted yet
    if(isset($_POST["addidea"]) || isset($_POST["saveidea"])){
        $private = optional_param("private","Y",PARAM_ALPHA);
    } else {
        $private = optional_param("private",$USER->privatedata,PARAM_ALPHA);

        if (!isset($_POST["addrole"])) {
			$url = trim(optional_param("url","",PARAM_URL));
			$urltitle = stripslashes(trim(optional_param("urltitle","",PARAM_TEXT)));
			$urlclip = stripslashes(trim(optional_param("urlclip","",PARAM_TEXT)));
    		$urlclippath = urldecode(stripslashes(trim(optional_param("urlclippath","",PARAM_TEXT))));
			$urlcliphtml = htmlspecialchars_decode(stripslashes(trim(optional_param("urlcliphtml","",PARAM_TEXT))));
			$urlarray[0] = $url;
			$urltitlearray[0]  = $urltitle;
			$urlcliparray[0]  = $urlclip;
			$urlclippatharray[0]  = $urlclippath;
			$urlcliphtmlarray[0]  = $urlcliphtml;
			$urlidarray[0] = "0";
		}
    }

    $groups = optional_param("groups","",PARAM_TEXT);
    if($groups == ""){
        $groups = array();
    }

   	$tags = array();

    // see if this is a request to edit node
    $nodeid = optional_param("nodeid","",PARAM_TEXT);
    if($nodeid != "" && !isset($_POST["saveidea"])){

        // load the node and set the params
        $node = getNode($nodeid);
        if (!$node instanceof CNode){
            echo "Idea not found";
            die;
        }
        // check user can edit this node
        try {
            $node->canedit();
        } catch (Exception $e){
            echo "You do not have permissions to edit this idea";
            die;
        }

        $idea = $node->name;
        $desc = $node->description;
        $sdt = $node->startdatetime;
        $edt = $node->enddatetime;
        $location = $node->location;
        $loccountry = $node->countrycode;
        $nodetypeid = $node->role->roleid;
        $image = $node->role->image;
        $imageurlid = $node->imageurlid;

        $imagethumbnail = $node->imagethumbnail;
        if ($imagethumbnail != null && $imagethumbnail != "") {
        	$image = $imagethumbnail;
        }
        if ($image == null || $image == "") {
        	$image = 'images/nodetypes/blank.gif';
        }

        $private = $node->private;
        $ngs = $node->groups;
        if($ngs){
            foreach($ngs as $g){
                array_push($groups,$g->groupid);
            }
        }
        $urls = $node->urls;
        $i = 0;
        if($urls){
            foreach($urls as $u){
                $urlarray[$i] = $u->url;
                $urltitlearray[$i] = $u->title;
                $urlcliparray[$i] = $u->clip;
                $urlclippatharray[$i] = $u->clippath;
                $urlcliphtmlarray[$i] = $u->cliphtml;
                $urlidarray[$i] = $u->urlid;
                $i++;
            }
        }

        if($node->tags) {
        	$tags = $node->tags;
        }
    }

    if(isset($_POST["addidea"])){
        if ($idea == ""){
            array_push($errors,"You must enter an idea.");
        }

        for($i =0 ; $i<sizeof($urlarray); $i++){
            if($$urlarray[$i] != "" && !validateUrlSyntax($urlarray[$i], 's?H?S?F?E?u-P-a?I?p?f?q?r?')){
                array_push($errors,"The url doesn't appear to be correctly formatted.");
                break;
            }
        }

        //create the idea and add URLs
        if(empty($errors)){
            //array_push($errors,"A");

            $node = addNode(stripslashes($idea),stripslashes($desc),$private,$nodetypeid);

            //array_push($errors,"b=".$node->nodeid);

            // add urls
        	$selectedurl=null;
            for($i =0 ; $i<sizeof($urlarray); $i++){
                if($urlarray[$i] != ""){
                    if ($urltitlearray[$i] == ""){
                        $urltitlearray[$i] = $urlarray[$i];
                    }

                    $urlObj = addURL($urlarray[$i],$urltitlearray[$i],"", $private, stripslashes($urlcliparray[$i]), urldecode($urlclippatharray[$i]), htmlspecialchars_decode(stripslashes($urlcliphtmlarray[$i])));
                    if (strcmp( $selectedURLID, $urlidarray[$i] ) == 0) {
                    	$selectedurl = $urlObj;
                    }

					// add groups to url
					if(sizeof($groups) != 0){
						foreach($groups as $group){
							$return = $urlObj->addGroup($group);
							if ($return instanceof error) {
								echo $return->message;
								die();
							}
						}
					}

                    addURLToNode($urlObj->urlid,$node->nodeid);
                }
            }

            if ($selectedurl != null) {
                //array_push($errors,"about to get image for=".$selectedurl->url);

	        	$photofilename = uploadImageURL($selectedurl->url,$errors,$CFG->ICON_WIDTH);

                //array_push($errors,"image=".$photofilename);

	        	if ($photofilename != null || $photofilename != "") {
		        	$photofilename = "uploads/".$USER->userid."/".$photofilename;
		        	$node = editNode($node->nodeid,$idea,$desc,$private,$nodetypeid,$selectedurl->urlid,$photofilename);
		        }
            }

            updateNodeStartDate($node->nodeid,$sdt);
            updateNodeEndDate($node->nodeid,$edt);
            updateNodeLocation($node->nodeid,$location,$loccountry);

            // add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                	$node->addGroup($group);
                }
            }

            // Add any new tags
            $newtagsarray = split(',', $newtags);
            if(sizeof($newtagsarray) != 0){
        		$n = new CNode($node->nodeid);
                foreach($newtagsarray as $tagname){
                	if ($tagname && $tagname != "") {
	                	$tag = addTag($tagname);
	                	if ($tag && $tag->tagid) {
	                		$n->addTag($tag->tagid);
	                	}
                	}
                }
            }

            //if($posttosl == "1" && $USER->sociallearnid != ""){
            //    postGoalToSocialLearn($node->nodeid);
            //}
        	$jsonNode = json_encode($node);
        	$jsonRole = json_encode($node->role);


            // refresh parent window then close
            echo "<script type='text/javascript'>";
            echo "if (window.opener && window.opener.loadConnectionNode) {";
            echo "	  var node = ";
            echo $jsonNode;
            echo ";";
            echo "	  var role = ";
            echo $jsonRole;
            echo ";";
            echo "	  window.opener.addNewConnectionNode(node, role);";
            echo " 	  window.close();";
            echo "} else {";
            echo "closeDialog('node-list') }";
            echo "</script>";
            include_once($CFG->dirAddress."includes/dialogfooter.php");
            die;
        }
    }

    if(isset($_POST["saveidea"])){
        //check all fields entered
        if ($idea == ""){
            array_push($errors,"You must enter an idea.");
        }

        for($i =0 ; $i<sizeof($urlarray); $i++){
            if($$urlarray[$i] != "" && !validateUrlSyntax($urlarray[$i], 's?H?S?F?E?u-P-a?I?p?f?q?r?')){
                array_push($errors,"The url doesn't appear to be correctly formatted.");
                break;
            }
        }

        //create the idea and add URL
        if(empty($errors)){

        	$node = getNode($nodeid);

            // remove all the existing groups
            removeAllGroupsFromNode($nodeid);

            // remove all the existing urls
            removeAllURLsFromNode($nodeid);

            // add urls
        	$selectedurl=null;
            for($i =0 ; $i<sizeof($urlarray); $i++){
                if($urlarray[$i] != ""){
                    if ($urltitlearray[$i] == ""){
                        $urltitlearray[$i] = $urlarray[$i];
                    }
                    $urlObj = addURL($urlarray[$i],$urltitlearray[$i],"",$private, stripslashes($urlcliparray[$i]),urldecode($urlclippatharray[$i]),htmlspecialchars_decode(stripslashes($urlcliphtmlarray[$i])));
                    if (strcmp( $selectedURLID, $urlidarray[$i] ) == 0) {
                    	$selectedurl = $urlObj;
                    }

					// add groups to url
					if(sizeof($groups) != 0){
						foreach($groups as $group){
							$urlObj->addGroup($group);
						}
					}

                    addURLToNode($urlObj->urlid,$node->nodeid);
                }
            }

            if ($selectedURLID == "") {
                $node = editNode($nodeid,$idea,$desc,$private,$nodetypeid,"","");
            } else {
            	if ($selectedurl != null
            		&& $selectedurl->urlid != null && $selectedurl->urlid != ""
            			&& $selectedurl->urlid != $node->imageurlid) {

    	        	$photofilename = uploadImageURL($selectedurl->url,$errors,$CFG->ICON_WIDTH);
    		        if ($photofilename == null || $photofilename == "") {
    	        	    $node = editNode($nodeid,stripslashes($idea),stripslashes($desc),$private,$nodetypeid,"","");
    		        } else {
    	        	    $photofilename = "uploads/".$USER->userid."/".$photofilename;
    		        	$node = editNode($nodeid,stripslashes($idea),stripslashes($desc),$private,$nodetypeid,$selectedurl->urlid, $photofilename);
    		        }
            	} else {
            		$node = editNode($nodeid,$idea,$desc,$private,$nodetypeid,$node->imageurlid,$node->imagethumbnail);
            	}
            }

            //$node = editNode($nodeid,$idea,$desc,$private,$nodetypeid);
            updateNodeStartDate($node->nodeid,$sdt);
            updateNodeEndDate($node->nodeid,$edt);
            updateNodeLocation($node->nodeid,$location,$loccountry);

            // add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                	$node->addGroup($group);
                }
            }

            $n = new CNode($nodeid);

            // remove from this node any tags marked for removal
            if(sizeof($removetagsarray) > 0){
                for($i=0; $i<sizeof($removetagsarray); $i++){
                    if($removetagsarray[$i] != ""){
                		$n->removeTag($removetagsarray[$i]);
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
	                		$n->addTag($tag->tagid);
	                	}
                	}
                }
            }

            //if($posttosl == "1" && $USER->sociallearnid != ""){
            //    postGoalToSocialLearn($node->nodeid);
            //}

            // refresh parent window then close
            echo "<script type='text/javascript'>";
            echo "closeDialog('current')";
            echo "</script>";
            include_once($CFG->dirAddress."includes/dialogfooter.php");
            die;
        }
    }

    $gs = getMyGroups();
    $mygroups = $gs->groups;
    $countries = getCountryList();

?>
<?php
if(!empty($errors)){
    echo "<div class='errors'>The following problems were found, please try again:<ul>";
    foreach ($errors as $error){
        echo "<li>".$error."</li>";
    }
    echo "</ul></div>";
}
?>

<script type="text/javascript">

var roles = null;

//set initial no of URLs
var noURLs = <?php echo sizeof($urlarray);?>;
var passedURL = '<?php echo $url;?>';

//store any image override to the role icon.
var imagethumbnail = "<?php if ($imagethumbnail != null && $imagethumbnail != "") { echo $imagethumbnail; } ?>";

//add another url field
function addURL(){
	if($('urlform').childElements().length != 0){
        $('urlform').insert('<hr id="urlhr'+noURLs+'" class="urldivider"/>');
    }
    $('urlform').insert('<div id="urlfield'+noURLs+'" class="subformrow"><label class="subformlabel" for="urlarray[]">URL:</label><input class="subforminput urlinput" id="urlarray[]" name="urlarray[]" size="50" value=""> <a href="javascript:removeURL('+noURLs+')" class="form">remove</a></div>');
    $('urlform').insert('<div id="urltitlefield'+noURLs+'" class="subformrow"><label class="subformlabel" for="urltitlearray[]">Title:</label><input class="subforminput urlinput" id="urltitlearray[]" name="urltitlearray[]" size="50" value=""><input type="hidden" id="urlidarray[]" name="urlidarray[]" value="'+noURLs+'"><img class="active" style="vertical-align: middle; padding-bottom: 2px;margin-left: 5px;" title="Auto-complete the website title from the website page data" src="'+URL_ROOT+'images/autofill.png" onClick="autoCompleteWebsiteDetails('+noURLs+')" onkeypress="enterKeyPressed(event)" /></div>');
    $('urlform').insert('<input type="hidden" id="urlclipfield'+noURLs+'" name="urlcliparray[]" value="" />');
    $('urlform').insert('<input type="hidden" id="urlclippathfield'+noURLs+'" name="urlclippatharray[]" value="" />');
    $('urlform').insert('<input type="hidden" id="urlcliphtmlfield'+noURLs+'" name="urlcliphtmlarray[]" value="" />');
    $('urlform').insert('<div id="urlradiofield'+noURLs+'" class="subformrow"><input type="radio" style="margin-left:75px;" name="imageicon" value="'+noURLs+'">Set this url as the icon for this idea</input></div>');

    noURLs++;
}

//remove URL field
function removeURL(i){
    if(	$('urlform').childElements()[0].nodeName.toUpperCase() != "HR"){

	    $('urlfield'+i).remove();
	    $('urltitlefield'+ i).remove();
	    $('urlclipfield'+ i).remove();
	    $('urlclippathfield'+ i).remove();
	    $('urlcliphtmlfield'+ i).remove();
	    $('urlradiofield'+ i).remove();
	    $('urlidarray'+ i).remove();
	    try {
	        $('urlhr'+ i).remove();
	    } catch (err) {
	        // do nowt
	    }
	    if($('urlform').childElements()[0] && $('urlform').childElements()[0].nodeName.toUpperCase() == "HR"){
	        $('urlform').childElements()[0].remove();
	    }
    }
}

function loadRoles(selected){

    var reqUrl = SERVICE_ROOT + "&method=getallroles";
    // if selected is blank then get the currently selected index
    if(selected == ""){
        selected = $('role')[$('role').selectedIndex].value;
    }

    $('role').update("");
    new Ajax.Request(reqUrl, { method:'get',
            onSuccess: function(transport){
                var json = transport.responseText.evalJSON();
                if(json.error){
                    alert(json.error[0].message);
                    return;
                }
                var found = false;
                var index=0;
                roles = json.roleset[0].roles;
                for (var i=0; i<roles.length; i++){
                   if (roles[i].role.roleid == selected){
                   		index = i;
                   }
                   $('role').insert("<option value='"+roles[i].role.roleid+"'>"+roles[i].role.name+"</option>");
                }

                $('role').selectedIndex = index;
                resetIcon();

            }
        });
}

function resetIcon() {
	if (imagethumbnail == null || imagethumbnail == "") {
		var selected = $('role').options[$('role').selectedIndex].value;
	    for (var i=0; i<roles.length; i++){
	        if (roles[i].role.roleid == selected){
	        	if (roles[i].role.image != null && roles[i].role.image != "") {
	        		$('nodetypeimage').src = URL_ROOT+roles[i].role.image;
	        	} else {
	        		$('nodetypeimage').src = URL_ROOT+"images/nodetypes/blank.gif";
	        	}
	        }
	    }
	}
}

function addRole(){
    $('newroleform').show();
    $('addnewrolelink').hide();
}

function cancelAddRole(){
    $('newroleform').hide();
    $('addnewrolelink').show();
}

function init() {
	<?php
		if ($nodeid == "") {
			echo "$('dialogheader').insert('Idea Creator');";
		} else {
			echo "$('dialogheader').insert('Idea Editor');";
		}
	?>

    new Ajax.Autocompleter("idea", "idea_choices", "<?php echo $CFG->homeAddress; ?>api/service.php?method=getnodesbyfirstcharacters&format=list", {paramName: "q", minChars: 1});

    // set up auto complete for tags
	new Ajax.Autocompleter("newtags", "newtags_choices", "<?php echo $CFG->homeAddress; ?>api/service.php?method=gettagsbyfirstcharacters&format=list&scope=all", {paramName: "q", minChars: 1, tokens: ","});

    loadRoles('<?php if ($newRole) { echo $newRole->roleid; } else if ($nodetypeid == ""){$r = new Role(); echo $r->getDefaultRoleID();} else { echo $nodetypeid; }?>');

    if (passedURL != "") {
    	toggleResources();
    }
}

/**
 * Display the idea resource hint.
 */
function showIdeaResourcesMessage(evt, panelName) {

 	var event = evt || window.event;
	var thing = event.target || event.srcElement;

	$("resourceMessage").innerHTML="";
	var sometext = document.createTextNode("Use this area to add relevant websites and web-based images and documents to this idea.");
	$("resourceMessage").appendChild(sometext);

	showHint(event, panelName, 30, -40);
}

/**
 * Fetch the website title and description from the website page for the url passed.
 */
function autoCompleteWebsiteDetails(count) {
	var urlvalue = $('urlfield'+count).value;
	if (urlvalue == "" || urlvalue == "http://") {
		alert("You must enter a url first");
		return;
	}

	var reqUrl = SERVICE_ROOT + "&method=autocompleteurldetails&url="+encodeURIComponent(urlvalue);
    new Ajax.Request(reqUrl, { method:'get',
        onSuccess: function(transport){
            var json = transport.responseText.evalJSON();
            if(json.error){
                //alert(json.error[0].message);
                return;
            }

            //console.log(json.url[0]);

			$('urltitle-'+count).value = json.url[0].title;
			//$('desc').value = json.url[0].description;
			//$('clip').value = json.url[0].clip;
   		}
    });
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

function toggleResources() {
	if ( $("resourcediv").style.display == "block") {
		$("resourcediv").style.display = "none";
		$("resourceimg").src=URL_ROOT+"images/arrow-down-green.png";
	} else {
		$("resourcediv").style.display = "block";
		$("resourceimg").src=URL_ROOT+"images/arrow-up-green.png";
	}
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

function toggleExtras() {
	if ( $("extrasdiv").style.display == "block") {
		$("extrasdiv").style.display = "none";
		$("extrasimg").src=URL_ROOT+"images/arrow-down-green.png";
	} else {
		$("extrasdiv").style.display = "block";
		$("extrasimg").src=URL_ROOT+"images/arrow-up-green.png";
	}
}

window.onload = init;

</script>

<form name="addrole" action="" enctype="multipart/form-data" method="post">
	<div id="newroleform" class="formrow" style="display:none; clear:both; margin-left: 100px;">
			<div class="subform" style="width: 430px;">
				<div class='subformrow'><label class='formlabel' style='width: 50px' for='rolename'>Name:</label><input type='text' class='forminput' size='35' id='rolename' name='rolename' value=''/></div>
				<div class='subformrow'><label class='formlabel' style='width: 50px' for='roleicon'>Icon:</label><input class='forminput' type='file' id='roleicon' name='roleicon' size='35'></div>
				<div class="subformrow">
				<input class="subformbutton" style="margin-left:54px;" type="submit" value="Add" id="addrole" name="addrole">
				<input class="subformbutton" style="margin-left:7px;" type="button" name="Cancel" value="Cancel" onclick="cancelAddRole();">
				</div>
			</div>
	</div>
</form>

<form name="addidea" action="" enctype="multipart/form-data" method="post">
<div id="fromidea">
<div class="connwrapper">
	<div class="formrow">
		<span class="formlabel" style="text-align: center;"><img id="nodetypeimage" name="nodetypeimage" border="0" src="<?php echo $CFG->homeAddress.$image ?>" /></span>
		<br>
		<label class="formlabel" for="role">Type:</label>
		<select class="forminputmust" id="role" name="role" onChange="javascript:resetIcon(this)">
		</select> <a id="addnewrolelink" href="javascript:addRole()" class="form">add new</a>
	</div>
    <div class="formrow">
		<label class="formlabel" for="idea">Summary:</label>
		<input class="forminputmust input" id="idea" name="idea" value="<?php echo( htmlspecialchars($idea) ); ?>"><div id="idea_choices" class="autocomplete"></div>
	</div>
    <div class="formrow">
        <label class="formlabel" for="desc">Description:</label>
        <textarea class="forminput input" id="desc" name="desc" rows="2"><?php echo( htmlspecialchars($desc) ); ?></textarea>
    </div>
</div>
</div>

    <div class="formrow">
        <label class="formlabel" for="private">Public:</label>
        <input type="checkbox" class="forminput" id="private" name="private" value="N"
        <?php
            if($private == "N"){
                echo ' checked="true"';
            }
        ?>
        >
    </div>
    <div class="formrow" style="margin-bottom: 10px;">
        <label class="formlabel" for="newtags">Add Tags:</label>
   		<input class="forminput" style="width:290px; font-size: 10pt;" id="newtags" name="newtags" value="<?php echo $newtags; ?>" /> (comma separated)
   		<div id="newtags_choices" class="autocomplete"></div>
     </div>

  <div class="formrow">
  	<?php if ($idea && $idea != "" && sizeof($tags) > 0) { ?>
	    <label style="margin-left: 5px;">Tags: <img style="vertical-align: bottom;" id="tagsimg" src="<?php echo $CFG->homeAddress."images/arrow-down-green.png" ?>" onclick="javascript: toggleTags()" border="0" alt="Tags" /></label>
	<?php } ?>
	<?php if(sizeof($mygroups) != 0 ){ ?>
		<label >Groups: <img style="vertical-align: bottom" id="groupsimg" src="<?php echo $CFG->homeAddress."images/arrow-down-green.png" ?>" onclick="javascript: toggleGroups()" border="0" alt="Groups" /></label>
	<?php } ?>
	<label style="margin-left: 5px;">Extras: <img style="vertical-align: bottom;" id="extrasimg" src="<?php echo $CFG->homeAddress."images/arrow-down-green.png" ?>" onclick="javascript: toggleExtras()" border="0" alt="Resources" /></label>
	<label style="margin-left: 5px;">Websites: <img style="vertical-align: bottom;" id="resourceimg" src="<?php echo $CFG->homeAddress."images/arrow-down-green.png" ?>" onclick="javascript: toggleResources()" border="0" alt="Resources" /></label>
  </div>

  <?php
	if ($idea && $idea != "" && sizeof($tags) > 0) {
	?>
		<div class="formrow">
		<div id="tagsdiv" style="display: none; float:left">
       	<label class="formlabel" for="url">Added Tags: </label>
       	<div class="subform" id="tagform">
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
		<label  class="formlabel" for="url">Groups: </label>
			<div class="subform">
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
    	<div id="extrasdiv" style="display: none">
    		<label  class="formlabel" for="url">Extras: </label>
        	<div class="subform">
            	<div class="subformrow">
				    <label class="subformlabel" for="ideastartdate">Date/time:</label>
				    <input class="subforminput dateinput" id="ideastartdate" name="ideastartdate" value="<?php if($sdt){echo date(r,$sdt);} ?>">
				      <label for="ideaenddate"> to </label>
				    <input class="dateinput" id="ideaenddate" name="ideaenddate" value="<?php if($edt){echo date(r,$edt);} ?>">
				    <?php helpIcon("ideadate"); ?>
				</div>

				<div class="subformrow">
				    <label class="subformlabel" for="location">Location:</label>
				    <input class="subforminput" id="location" name="location" style="width:140px;" value="<?php echo $location; ?>">
				    <select id="loccountry" name="loccountry" style="width:140px;">
				        <option value="" >Country...</option>
				        <?php
				            foreach($countries as $code=>$c){
				                echo "<option value='".$code."'";
				                if($code == $loccountry){
				                    echo " selected='true'";
				                }
				                echo ">".$c."</option>";
				            }
				        ?>
				    </select>
				    <?php helpIcon("idealocation"); ?>
				</div>
		  </div>
		</div>
	</div>

    <div class="formrow">
    	<div id="resourcediv" style="display: none; float:left">
    		<label  class="formlabel" for="url">Websites: </label>
	        <div class="subform" id="urlform">
	            <?php
	                // output rows for each url
	                for($i=0; $i<sizeof($urlarray); $i++){
	                    if($i != 0){
	                        echo '<hr id="urlhr<?php echo $i; ?>" class="urldivider"/>';
	                    }
	            ?>
	                <div id="urlfield<?php echo $i; ?>" class="subformrow">
	                    <label class="subformlabel" for="url-<?php echo $i; ?>">URL:</label>
	                    <input class="subforminput urlinput" id="url-<?php echo $i; ?>" name="urlarray[]" value="<?php echo $urlarray[$i]; ?>" />
	                    <a href="javascript:removeURL(<?php echo $i; ?>)" class="form">remove</a>
	                </div>
	                <div id="urltitlefield<?php echo $i; ?>" class="subformrow">
	                    <label class="subformlabel" for="urltitle-<?php echo $i; ?>">Title:</label>
	                    <input class="subforminput urlinput" id="urltitle-<?php echo $i; ?>" name="urltitlearray[]" value="<?php echo $urltitlearray[$i]; ?>" />
	            		<img class="active" style="vertical-align: middle; padding-bottom: 2px;" title="Auto-complete the website title and description from the website page data" src="<?php echo $CFG->homeAddress; ?>images/autofill.png" onClick="autoCompleteWebsiteDetails(<?php echo $i; ?>)" onkeypress="enterKeyPressed(event)" />
	                    <input type="hidden" id="urlidarray-<?php echo $i; ?>" name="urlidarray[]" value="<?php echo $urlidarray[$i]; ?>">
	                </div>
	                <div id="urlradiofield<?php echo $i; ?>" class="subformrow">
	                	<?php if ($urlidarray[$i] != "" && $urlidarray[$i] == $imageurlid) { ?>
	                		<input checked type="radio" onDblClick="this.checked=false;" style="margin-left:75px;" name="imageicon" value="<?php echo $urlidarray[$i]; ?>" id="imageicon<?php echo $i ?>" /><label for="imageicon-<?php echo $i; ?>">Set this url as the icon for this idea</label>
	                	<?php } else { ?>
	            			<input type="radio" onDblClick="this.checked=false;" style="margin-left:75px;" name="imageicon" value="<?php echo $urlidarray[$i]; ?>" id="imageicon<?php echo $i ?>" /><label for="imageicon-<?php echo $i; ?>">Set this url as the icon for this idea</label>
	                	<?php } ?>
	                </div>
	                <?php if ($urlcliparray[$i] != "") { ?>
		                <div id="urlclipfield<?php echo $i; ?>" class="subformrow">
	                    	<label class="subformlabel" for="urlclip-<?php echo $i; ?>">Clip:</label>
	                    	<textarea class="subforminput urlinput" style="border: none; font-size: 110%" readonly id="urlclip-<?php echo $i; ?>" rows="2" name="urlcliparray[]"><?php echo( htmlspecialchars($urlcliparray[$i]) ); ?></textarea>
	                    </div>
	                <?php } else { ?>
		            	<input type="hidden" id="urlclipfield<?php echo $i ?>" name="urlcliparray[]" value="<?php echo urlencode($urlcliparray[$i]); ?>" />
	                <?php } ?>

	                <input type="hidden" id="urlclippathfield<?php echo $i ?>" name="urlclippatharray[]" value="<?php echo urlencode($urlclippatharray[$i]); ?>" />
	                <input type="hidden" id="urlcliphtmlfield<?php echo $i ?>" name="urlcliphtmlarray[]" value="<?php echo urlencode($urlcliphtmlarray[$i]); ?>" />

	            <?php
	                }
	            ?>

	        </div>

	        <!-- div style="float:right; padding: 2px;">
	        	<a href="#" onMouseOver="showIdeaResourcesMessage(event, \'idearesourcehint\'); return false;" onMouseOut="hideHints(); return false;" onClick="hideHints(); return false;" onkeypress="enterKeyPressed(event)"><img src="'+URL_ROOT+'images/info.png" border="0" style="margin-top: 2px; margin-left: 5px; margin-right: 2px;" /></a>
	        	<div id="idearesourcehint" class="hintRollover">
	        		<table width="350" border="0" cellpadding="1" cellspacing="0" bgcolor="#FFFED9">
	        			<tr width="350">
	        				<td width="350" align="left">
	        					<span id="resourceMessage"></span>
	        				</td>
	        			</tr>
	        		</table>
	        	</div>
	        </div -->
	        <div class="formrow">
	        	<a class="formsubmit form" href="javascript:addURL();">add url</a>
	        </div>
        </div>
    </div>

    <?php
        //if($USER->sociallearnid != ""){
    ?>
        <!-- div class="formrow">
            <input type="checkbox" class="formsubmit " id="posttosl" name="posttosl" value="1">Post to SocialLearn profile
            <?php helpIcon("sociallearn"); ?>
        </div -->
    <?php
        //}
    ?>
    <br>
    <div class="formrow">
        <?php
            if ($nodeid == "") {
                // this is create node form
                echo '<input class="submit" type="submit" value="Save" id="addidea" name="addidea">';
            } else {
                // this is edit node form
                echo '<input class="submit" type="submit" value="Save" id="saveidea" name="saveidea">';
            }
        ?>
        <input type="button" value="Cancel" onclick="window.close();"/>
    </div>
</form>

<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>