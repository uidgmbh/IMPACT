<?php
/********************************************************************************
 *                                                                              *
 *  (c) Copyright 2011 University of Leeds, UK                                  *
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

//get groups for current user
   $groupset = getMyGroups();
   $groups = $groupset->groups;

?>
<script type="text/javascript">
//<![CDATA[

	function toggleGroups() {
 		if ( $("groupsdiv").style.display == "block") {
 			$("groupsdiv").style.display = "none";
 			$("groupsimg").src=URL_ROOT+"images/arrow-right-green.png";
 		} else {
 			$("groupsdiv").style.display = "block";
 			$("groupsimg").src=URL_ROOT+"images/arrow-down-green.png";
 		}
 	}

	function toggleManage() {
 		if ( $("managediv").style.display == "block") {
 			$("managediv").style.display = "none";
 			$("manageimg").src=URL_ROOT+"images/arrow-right-green.png";
 		} else {
 			$("managediv").style.display = "block";
 			$("manageimg").src=URL_ROOT+"images/arrow-down-green.png";
 		}
 	}

	function toggleAdds() {
 		if ( $("addsdiv").style.display == "block") {
 			$("addsdiv").style.display = "none";
 			$("addsimg").src=URL_ROOT+"images/arrow-right-green.png";
 		} else {
 			$("addsdiv").style.display = "block";
 			$("addsimg").src=URL_ROOT+"images/arrow-down-green.png";
 		}
 	}

	function install (aEvent) {
  		var params = {
    		"Cohere 0.6.9": { URL: aEvent.target.href,
             IconURL: aEvent.target.getAttribute("iconURL"),
             Hash: aEvent.target.getAttribute("hash"),
             toString: function () { return this.URL; }
    		}
  		};
  		InstallTrigger.install(params);

  		return false;
	}

	function hideSideBar() {
		if ($('content')) {
			$('content').style.marginLeft = "20px";
		}
		$('sidebar-header').style.display="none";
		$('sidebar-footer').style.display="none";
		$('sidebar-content').style.display="none";
		$('sidebar-open').style.display="block";
		if (resizeApplet) {
			resizeApplet();
		}
		return true;
	}

	function showSideBar() {
		if ($('content')) {
			$('content').style.marginLeft = "230px";
		}
		$('sidebar-header').style.display="block";
		$('sidebar-footer').style.display="block";
		$('sidebar-content').style.display="block";
		$('sidebar-open').style.display="none";
		if (resizeApplet) {
			resizeApplet();
		}
		return true;
	}
//]]>
</script>

<div id="sidebar-header">
	<img src="images/arrow-left.png" border="0" onclick="javascript:hideSideBar();" />
</div>

<div id="sidebar-open" style="display: none; width: 10px;"><img src="images/arrow-right.png" border="0" onclick="javascript:showSideBar();" /></div>

<div id="sidebar-content">

	<div style="float:left; margin:3px;"><a href="<?php print($CFG->homeAddress);?>">Home</a></div>

    <?php
    	if(isset($USER->userid)){
    ?>
           <div style="clear:both; float:left; margin:3px; margin-bottom: 6px;">
           		<a href="<?php print($CFG->homeAddress);?>user.php?userid=<?php print $USER->userid; ?>#conn-list">My Data</a>
           </div>

           <div style="clear:both; float:left; margin:3px; margin-bottom:0px;">
       			<label>Add: <img style="vertical-align: bottom;" id="addsimg" src="<?php print $CFG->homeAddress;?>images/arrow-right-green.png" onclick="javascript: toggleAdds();" border="0" alt="Add" /></label>
                <div id="addsdiv" style="display: none; margin:0px; padding:0px;">
                	<ul style="padding-top:0px;padding-bottom:0px; margin-top:3px; margin-bottom:0px;">
	                    <li><a href="javascript:loadDialog('createidea','<?php print($CFG->homeAddress);?>plugin/ui/idea.php');">Idea</a></li>
	                    <li><a href="javascript:loadDialog('createconn','<?php print($CFG->homeAddress);?>plugin/ui/connection.php', 840, 760);">Connection</a></li>
	                    <li><a href="javascript:loadDialog('createurl','<?php print($CFG->homeAddress);?>plugin/ui/url.php');">Website</a></li>
                        <li><a href="javascript:loadDialog('creategroup','<?php print($CFG->homeAddress);?>plugin/ui/addgroup.php');">Group</a></li>
	                </ul>
	            </div>
            </div>

            <div style="clear:both; float:left; margin:3px; margin-bottom:0px;">
	            <label>Manage: <img style="vertical-align: bottom;" id="manageimg" src="<?php print $CFG->homeAddress;?>images/arrow-right-green.png" onclick="javascript: toggleManage();" border="0" alt="Manage" /></label>

                <div id="managediv" style="display: none; margin:0px; padding:0px;">
	                <ul style="padding-top:0px;padding-bottom:0px; margin-top:3px; margin-bottom:0px;">
                    	<li><a href="<?php print($CFG->homeAddress);?>profile.php">My Profile</a></li>
                        <li><a href="<?php print($CFG->homeAddress);?>import/index.php">Imports / feeds</a></li>
                        <li><a href="<?php print($CFG->homeAddress);?>editgroup.php">Groups</a></li>
                        <li><a href="javascript:loadDialog('managetags','<?php print($CFG->homeAddress);?>plugin/ui/tag.php');">Tags</a></li>
	                    <li><a href="javascript:loadDialog('managebookmarks','<?php print($CFG->homeAddress);?>plugin/ui/bookmarks.php');">Bookmarks</a></li>
	                    <li><a href="javascript:loadDialog('managesearches','<?php print($CFG->homeAddress);?>plugin/ui/managesearches.php', 790, 650);">Searches</a></li>
	                    <li><a href="javascript:loadDialog('manageroles','<?php print($CFG->homeAddress);?>plugin/ui/role.php');">Idea Types</a></li>
	                    <li><a href="javascript:loadDialog('managelinktypes','<?php print($CFG->homeAddress);?>plugin/ui/linktype.php');">Link Types</a></li>
	                </ul>
                </div>
            </div>
        <?php } else { ?>
           <div style="clear:both; float:left; margin:3px;">
                <a href="login.php">Sign In</a> to:
                <ul style="padding-top:0px;padding-bottom:0px; margin-top:3px; margin-bottom:0px;">
                    <li>Add Idea</li>
                    <li>Add Connection</li>
                    <li>Import Data</li>
                    <li>Edit Profile</li>
                </ul>
            </div>
        <?php } ?>

    <?php
       if(sizeof($groups) > 0){
    	   echo '<div style="clear:both; float:left; margin:3px;">';
    	   echo "My groups:";
   	       echo '<img style="vertical-align: bottom;" id="groupsimg" src="'.$CFG->homeAddress.'images/arrow-right-green.png" onclick="javascript: toggleGroups();" border="0" alt="Groups" />';
   	       echo '<div id="groupsdiv" style="display: none">';

            //get groups for current user
            echo '<ul style="padding-top:0px;padding-bottom:0px; margin-top:3px; margin-bottom:0px;">';
            foreach($groups as $group){
                echo "<li>";
                echo "<a href='".$CFG->homeAddress."group.php?groupid=".$group->groupid."'>".$group->name."</a>";
                echo "</li>";
            }
            echo "</ul>";
            echo '</div>';
            echo '</div>';
        }
    ?>

    <div id="tagcloud" style="clear:both; float:left; margin-top: 6px;">
		<ul>
    	<?php

    		if ($args["groupid"] && $args["groupid"] != "") {
				if(isset($USER->userid)){
					$tags = getGroupTagsForCloud($args["groupid"],50);
				} else {
					$tags = getTagsForCloud(20);
				}
    		} else {
				if(isset($USER->userid)){
					$tags = getUserTagsForCloud(-1);
				} else {
					$tags = getTagsForCloud(20);
				}
    		}

			if (sizeof($tags) > 0) {
				echo '<hr class="hrline" />';
			}

    		if ($args["groupid"] && $args["groupid"] != "") {
				if(isset($USER->userid)){
					echo "<p>Top 50 Group Tags:</p>";
				} else {
					echo "<p>Top 20 Tags:</p>";
				}
    		} else {
				if(isset($USER->userid)){
					echo "<p>My Tags:</p>";
				} else {
					echo "<p>Top 20 Tags:</p>";
				}
    		}

    		if ($tags != null) {

	    		// get the count range first
	    		$minCount = -1;
	    		$maxCount = -1;
	    		foreach($tags as $tag) {
	    			$count = $tag['UseCount'];
	    			if ($count > $maxCount) {
	    				$maxCount = $count;
	    			}
	    			if ($minCount == -1) {
	    				$minCount = $count;
	    			} else if ($count < $minCount) {
	    				$minCount = $count;
	    			}
	    		}
    			//echo $maxCount."<br>";
    			//echo $minCount."<br>";

    			if ($maxCount < 10) {
    				$range = 1;
    			} else {
    				$range = round(($maxCount - $minCount) / 10);
    			}
    			//echo $range."<br>";

	    		$i = 0;
	    		foreach($tags as $tag) {

	    			$cloudlistcolour = "";
	    			if ($i % 2) {
	    				$cloudlistcolour = "#40b5b2";
	    			} else {
	    				$cloudlistcolour = "#e80074";
	    			}
	    			$i++;

	    			$count = $tag['UseCount'];

   	    			if ($count >= $minCount && $count < $minCount+$range) {
   	    				echo '<li class="tag1" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*1) && $count < $minCount+($range*2)) {
   	    				echo '<li class="tag2" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*2) && $count < $minCount+($range*3)) {
   	    				echo '<li class="tag3" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*3) && $count < $minCount+($range*4)) {
   	    				echo '<li class="tag4" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*4) && $count < $minCount+($range*5)) {
   	    				echo '<li class="tag5" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*5) && $count < $minCount+($range*6)) {
   	    				echo '<li class="tag6" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*6) && $count < $minCount+($range*7)) {
   	    				echo '<li class="tag7" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*7) && $count < $minCount+($range*8)) {
   	    				echo '<li class="tag8" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*8) && $count < $minCount+($range*9)) {
   	    				echo '<li class="tag9" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			} else if ($count >= $minCount+($range*9))  {
   	    				echo '<li class="tag10" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
   	    			}
	    		}
    		}
    	?>
    	</ul>

    </div>

</div>
<div id="sidebar-footer"></div>
