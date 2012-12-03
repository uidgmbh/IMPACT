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
    include_once($CFG->dirAddress."phplib/validateurlsyntax.php");

    $title = stripslashes(trim(optional_param("title","",PARAM_TEXT)));
    $url = trim(optional_param("url","http://",PARAM_TEXT));
    $desc = stripslashes(trim(optional_param("desc","",PARAM_TEXT)));
    $clip = stripslashes(trim(optional_param("clip","",PARAM_TEXT)));
    $clippath = urldecode(stripslashes(trim(optional_param("clippath","",PARAM_TEXT))));
    $cliphtml = htmlspecialchars_decode(stripslashes(trim(optional_param("cliphtml","",PARAM_HTML))));

    $urlid = optional_param("urlid","",PARAM_TEXT);

    $newtags = optional_param("newtags","",PARAM_TEXT);
    $removetagsarray = optional_param("removetags","",PARAM_TEXT);

    $removeideasarray = optional_param("removeideas","",PARAM_TEXT);
    $addideasarray = optional_param("newideas", "", PARAM_TEXT);

    $errors = array();

    $groups = optional_param("groups","",PARAM_TEXT);
    if($groups == ""){
        $groups = array();
    }

    if(isset($_POST["addurl"]) || isset($_POST["saveurl"])){
        $private = optional_param("private","Y",PARAM_ALPHA);
    } else {
        $private = optional_param("private",$USER->privatedata,PARAM_ALPHA);
    }

    if(isset($_POST["addurl"])){
        //check all fields entered
        if ($url == ""){
            array_push($errors,"You must enter a url.");
        }
        if ($title == ""){
            array_push($errors,"You must enter a title.");
        }

        if($url != "" && !validateUrlSyntax($url, 's?H?S?F?E?u-P-a?I?p?f?q?r?')){
             array_push($errors,"The url doesn't appear to be correctly formatted.");
        }

        //create the idea and add URLs
        if(empty($errors)){
            $urlObj = addURL($url,$title,$desc,$private,$clip,$clippath,$cliphtml);

            // Add any new tags
            $newtagsarray = split(',', $newtags);
            if(sizeof($newtagsarray) != 0){
                foreach($newtagsarray as $tagname){
                	$tagname = trim($tagname);
                	if ($tagname && $tagname != "") {
                    	$tag = addTag($tagname);
                    	if ($tag && $tag->tagid) {
                    		$urlObj->addTag($tag->tagid);
                    	}
                	}
                }
            }

            // Add any new ideas
            if($addideasarray && sizeof($addideasarray) > 0){
                for($i=0; $i<sizeof($addideasarray); $i++){
                    if($addideasarray[$i] != "") {
                    	$urlObj->addIdea($addideasarray[$i], "");
                	}
                }
            }

            // add groups
            if(sizeof($groups) != 0){
                foreach($groups as $group){
                	$urlObj->addGroup($group);
                }
            }

            // refresh parent window then close
            echo "<script type='text/javascript'>";
            echo "closeDialog('web-list')";
            echo "</script>";
            include_once($CFG->dirAddress."includes/dialogfooter.php");
            die;
        }
    }


    if(isset($_POST["saveurl"])){
        //check all fields entered
        if ($url == ""){
            array_push($errors,"You must enter a url.");
        }
        if ($title == ""){
            array_push($errors,"You must enter a title.");
        }
        if($url != "" && !validateUrlSyntax($url, 's?H?S?F?E?u-P-a?I?p?f?q?r?')){
             array_push($errors,"The url doesn't appear to be correctly formatted.");
        }
        //create the idea and add URLs
        if(empty($errors)){
        	$urlObj = editURL($urlid,$url,$title,$desc,$private,$clip,$clippath,$cliphtml);
        	if ($urlObj instanceof URL) {
	        	// remove from this user any tags marked for removal
	            if(sizeof($removetagsarray) > 0){
	                for($i=0; $i<sizeof($removetagsarray); $i++){
	                    if($removetagsarray[$i] != ""){
	                    	$urlObj->removeTag($removetagsarray[$i]);
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
	                    		$urlObj->addTag($tag->tagid);
	                    	}
	                	}
	                }
	            }

	           	// remove from this user any ideas marked for removal
	            if(sizeof($removeideasarray) > 0){
	                for($i=0; $i<sizeof($removeideasarray); $i++){
	                    if($removeideasarray[$i] != ""){
	                     	$urlObj->removeIdea($removeideasarray[$i]);
	                	}
	                }
	            }

	            // Add any new ideas
	            if($addideasarray && sizeof($addideasarray) > 0){
	                for($i=0; $i<sizeof($addideasarray); $i++){
	                    if($addideasarray[$i] != ""){
	                    	$urlObj->addIdea($addideasarray[$i], "");
	                	}
	                }
	            }

	            // add groups
	            if(sizeof($groups) != 0){
	                foreach($groups as $group){
	                	$urlObj->addGroup($group);
	                }
	            }

	            // refresh parent window then close
	            echo "<script type='text/javascript'>";
	            echo "closeDialog('current')";
	            echo "</script>";
	            include_once($CFG->dirAddress."includes/dialogfooter.php");
	            die;
        	} else {
        		echo "<p>";
        		echo $urlObj->message;
        		echo "</p>";
	            include_once($CFG->dirAddress."includes/dialogfooter.php");
        	}
        }
    }


    // see if this is a request to edit node
   	$tags = array();
   	$ideas = array();

    if($urlid != "") {
        // load the URL and set the params
        $urlObj = getURL($urlid);

        if (!$urlObj instanceof URL){
            echo "URL not found";
            die;
        }

        // check user can edit this url
        try {
            $urlObj->canedit();
        } catch (Exception $e){
            echo "You do not have permissions to edit this URL";
            die;
        }

        if (!isset($_POST["saveurl"])){
	        $url = $urlObj->url;
	        $title = $urlObj->title;
	        $desc = $urlObj->description;
	        $clip = $urlObj->clip;
	        $private = $urlObj->private;
        }

	    if($urlObj->tags) {
	    	$tags = $urlObj->tags;
	    }

    	$ideasObj = getNodesByURLID($urlid,0,-1, name, 'ASC');
    	$ideas = $ideasObj->nodes;

        $ugs = $urlObj->groups;
        if($ugs){
            foreach($ugs as $g){
                array_push($groups,$g->groupid);
            }
        }

    }

    $gs = getMyGroups();
    $mygroups = $gs->groups;

?>


<?php
    if(!empty($errors)){
        echo "<div class='errors'>";
        echo "<ul>";
        foreach($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul>";
        echo "</div>";
    }
?>

<script type="text/javascript">

/**
 * Fetch the website title and description from the website page for the url passed.
 */
function autoCompleteWebsiteDetails() {
	var urlvalue = $('url').value;
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

			$('title').value = json.url[0].title;
			$('desc').value = json.url[0].description;
			$('clip').value = json.url[0].clip;
   		}
    });
}

function toggleTags() {
	if ( $("tagsdiv").style.display == "block") {
		$("tagsdiv").style.display = "none";
		$("tagsimg").src=URL_ROOT+"images/arrow-right-green.png";
	} else {
		$("tagsdiv").style.display = "block";
		$("tagsimg").src=URL_ROOT+"images/arrow-down-green.png";
	}
}

function toggleGroups() {
	if ( $("groupsdiv").style.display == "block") {
		$("groupsdiv").style.display = "none";
		$("groupsimg").src=URL_ROOT+"images/arrow-right-green.png";
	} else {
		$("groupsdiv").style.display = "block";
		$("groupsimg").src=URL_ROOT+"images/arrow-down-green.png";
	}
}

function toggleIdeas() {
	if ( $("ideasdiv").style.display == "block") {
		$("ideasdiv").style.display = "none";
		$("ideasimg").src=URL_ROOT+"images/arrow-right-green.png";
	} else {
		$("ideasdiv").style.display = "block";
		$("ideasimg").src=URL_ROOT+"images/arrow-down-green.png";
	}
}

function init() {
	<?php
		if ($urlid == "") {
			echo "$('dialogheader').insert('Website / Clip Creator');";
		} else {
			echo "$('dialogheader').insert('Website / Clip Editor');";
		}
	?>

    // set up auto complete for tags
	new Ajax.Autocompleter("newtags", "newtags_choices", "<?php echo $CFG->homeAddress; ?>api/service.php?method=gettagsbyfirstcharacters&format=list&scope=all", {paramName: "q", minChars: 1, tokens: ","});
	addNewNodes();
}

function openIdeaPicker(searchid) {
	loadDialog('ideaselector', URL_ROOT+"plugin/ui/ideaselector.php?ownonly='true'", 420, 730);
}

function removeAddedIdea(nodeid) {
	$('addidea'+nodeid).remove();
}

/**
 * Repaint any selected nodes if saving gave and error and returned you to the screen.
 */
function addNewNodes() {
    <?php if($addideasarray && sizeof($addideasarray) > 0){
    	echo "\n\nvar node = null;";
        for($i=0; $i<sizeof($addideasarray); $i++){
            if($addideasarray[$i] != ""){
                $node = new CNode($addideasarray[$i]);
                $node->load();
            	if ($node) {
                	$jsonIdea = json_encode($node);
                	echo "node = ";
                	echo $jsonIdea;
                	echo ";\n";
                	echo "if (node) {\n";
                	echo "var iUL = new Element('li', {'id':'addidea".$addideasarray[$i]."' , 'class':'idea-list-li'});\n";
                	echo "var nWrap = new Element('div', {'class':'idea-li-wrapper'});\n";
                	echo "var blobDiv = new Element('div', {'class':'idea-blob', 'style':'float:left;width: 280px;'});\n";
                	echo "var blobNode = renderNode(node,'url-list', node.role, false, 'inactive');\n";
                	echo "blobDiv.insert(blobNode);\n";

                	echo "var removeIdea = new Element('a', {'href':'#', 'style':'margin-left: 10px; float:left;text-align: middle'});\n";
                	echo "removeIdea.onclick = function() { removeAddedIdea(node.nodeid); return false; };\n";
                	echo "removeIdea.style.cssFloat = 'left';\n";
                	echo "var txtNode = document.createTextNode('remove');\n";
                	echo "removeIdea.appendChild(txtNode);\n";

                	echo "nWrap.insert(blobDiv).insert(removeIdea);\n";
                	echo "var hidden = new Element('input', {'id':'hiddenidea'+node.nodeid, 'type':'hidden', 'name':'newideas[]', 'value':node.nodeid});\n";
                	echo "nWrap.insert(hidden);\n";
                	echo "iUL.insert(nWrap);\n";
                	echo "$('idealist').insert(iUL);\n";
                	echo "}\n";
            	}
        	}
        }
    } ?>
}

function addSelectedNode(node, role) {

	if ($('addidea'+node.nodeid) != null || $('removeideas-'+node.nodeid) != null) {
		alert("You have already added this node");
		return;
	}

	var iUL = new Element("li", {'id':'addidea'+node.nodeid, 'class':'idea-list-li'});
	var nWrap = new Element("div", {'class':'idea-li-wrapper'});

	var blobDiv = new Element("div", {'class':'idea-blob', 'style':'float:left;width: 280px;'});
	var blobNode = renderNode(node,'url-list', role, false, 'inactive');
	blobDiv.insert(blobNode);

	var removeIdea = new Element("a", {'href':'#', 'style':'margin-left: 10px; float:left;text-align: middle'});
	removeIdea.onclick = function() { removeAddedIdea(node.nodeid); return false; };
	removeIdea.style.cssFloat = 'left';
	var txtNode = document.createTextNode("remove");
	removeIdea.appendChild(txtNode);

	nWrap.insert(blobDiv).insert(removeIdea);

	var hidden = new Element("input", {'id':'hiddenidea'+node.nodeid, 'type':'hidden', 'name':'newideas[]', 'value':node.nodeid});
	nWrap.insert(hidden);

	iUL.insert(nWrap);

	$('idealist').insert(iUL);
}

window.onload = init;

</script>

<form name="addurl" action="" method="post">

	<input type="hidden" id="clippath" name="clippath" value="<?php echo urlencode($clippath); ?>">
	<input type="hidden" id="cliphtml" name="cliphtml" value="<?php echo urlencode($cliphtml); ?>">

	<div class="formrow">
    	<label class="formlabel" for="url"><span class="required"></span>URL:</label>
    	<input class="forminputmust inputshort" id="url" name="url" value="<?php echo( htmlspecialchars($url) ); ?>">
		<img class="active" style="vertical-align: middle; padding-bottom: 2px;" title="Auto-complete the website title and description from the website page data" src="<?php echo $CFG->homeAddress; ?>images/autofill.png" onClick="autoCompleteWebsiteDetails()" onkeypress="enterKeyPressed(event)" />
    </div>
    <div class="formrow">
        <label class="formlabel" for="title"><span class="required"></span>Title:</label>
        <!-- Do not use htmlspecialchars with the value field !!! -->
        <input class="forminputmust input" id="title" name="title" value="<?php echo( $title ); ?>">
    </div>
    <div class="formrow">
        <label class="formlabel" for="desc">Description:</label>
        <textarea class="forminput input" id="desc" name="desc" rows="2"><?php echo( htmlspecialchars($desc) ); ?></textarea>
    </div>
    <?php if ($urlid != "" && $clip != "") { ?>
    	<div class="formrow">
    		<label class="formlabel" for="clip">Clip:</label>
    		<textarea class="forminput input" style="border:none;" id="clip" name="clip" rows="2" readonly><?php echo( htmlspecialchars($clip) ); ?></textarea>
    	</div>
    <?php } else { ?>
    	<input type="hidden" id="clip" name="clip" value="">
    <?php } ?>

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

    <div class="formrow">
	   <label class="formlabel" for="newtags">Add Tags:</label>
	   <input class="forminput" style="width:290px; font-size: 10pt;" id="newtags" name="newtags" value="<?php echo $newtags; ?>" /> (comma separated)
       <div id="newtags_choices" class="autocomplete"></div>
   </div>

  <div class="formrow">
  	<?php if (sizeof($tags) > 0) { ?>
	    <label class="formlabel">Tags: <img style="vertical-align: bottom;" id="tagsimg" src="<?php echo $CFG->homeAddress."images/arrow-right-green.png" ?>" onclick="javascript: toggleTags()" border="0" alt="Tags" /></label>
	<?php } ?>

   <?php
	if (sizeof($tags) > 0) {
   ?>
		<div id="tagsdiv" class="forminput" style="display: none; float:left">
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
     <?php } ?>
  </div>

  <div class="formrow" style="padding-top: 15px;">
	  <label class="formlabel" for="newideas">Add Idea:</label>
	  <a class="forminput" id="newideas" style="font-size: 10pt;" href="#" onclick="javascript: openIdeaPicker()" />My Idea Selector</a>

	  <ul id="idealist" style="list-style:none;">
	  </ul>
  </div>

  <div class="formrow">
	  	<?php if (sizeof($ideas) > 0) { ?>
	  		<label class="formlabel">Ideas: <img style="vertical-align: bottom;" id="ideasimg" src="<?php echo $CFG->homeAddress."images/arrow-right-green.png" ?>" onclick="javascript: toggleIdeas()" border="0" alt="Ideas" /></label>
	    <?php } ?>

	     <?php if (sizeof($ideas) > 0) { ?>
			<div id="ideasdiv" class="forminput" style="display: none; float:left">
			   	<div class="subform2" id="tagform">
			   	<?php
					$i = 0;
					foreach($ideas as $node){
						$class = "subforminput";
						echo '<div id="ideafield'.$i.'" class="subformrow" style="border-bottom: 1px solid #d3e8e8; margin-top:5px; margin-bottom: 5px; padding-bottom:5px;">';
						echo '<input type="checkbox" class="'.$class.'" id="removeideas-'.$node->nodeid.'" name="removeideas[]" value="'.$node->nodeid.'"';
						if(sizeof($removeideasarray) > 0){
						      for($j=0; $j<sizeof($removeideasarray); $j++){
						    	  if ($removeideasarray[$j] != ""
								  && $removeideasarray[$j] == $node->nodeid) {
						          echo ' checked="true"';
						    		  break;
						    	  }
						      }
						}
						echo '><span style="position:relative; margin-left: 10px; width: 260px;">'.$node->name.'</span>';
						echo '</div>';
						$i++;
			          }
			     ?>
			     <label>(Select to remove)</label>
			  </div>
		   </div>
		 <?php } ?>
  </div>


  <?php if(sizeof($mygroups) != 0 ){ ?>
    <div class="formrow">
  		<label class="formlabel">Groups: <img style="vertical-align: bottom;" id="groupsimg" src="<?php echo $CFG->homeAddress."images/arrow-right-green.png" ?>" onclick="javascript: toggleGroups()" border="0" alt="Groups" /></label>

  		<div id="groupsdiv" class="forminput" style="float:left; display: none">
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
	<span class="formsubmit"></span>
	</div>
   <div class="formrow">
        <?php
            if ($urlid == "") {
                // this is create node form
                echo '<input class="formsubmit" type="submit" value="Save" id="addurl" name="addurl">';
            } else {
                // this is edit node form
                echo '<input class="formsubmit" type="submit" value="Save" id="saveurl" name="saveurl">';
            }
        ?>
        <input type="button" value="Cancel" onclick="window.close();"/>
    </div>
</form>

<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>