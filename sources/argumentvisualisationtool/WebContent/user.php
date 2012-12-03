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
    include_once("config.php");
    array_push($HEADER,'<script src="'.$CFG->homeAddress.'includes/tabber.js" type="text/javascript"></script>');
    include_once("includes/header.php");
    include_once("phplib/tabberlib.php");
    global $USER;
    $userid = optional_param("userid",$USER->userid,PARAM_TEXT);
    $user = getUser($userid,'long');

	// default parameters
    $start = optional_param("start",0,PARAM_INT);
    $max = optional_param("max",20,PARAM_INT);
    $orderby = optional_param("orderby","date",PARAM_ALPHA);
    $sort = optional_param("sort","DESC",PARAM_ALPHA);

	// filter parameters
    $direction = optional_param("direction","right",PARAM_ALPHA);
    $filtergroup = optional_param("filtergroup","",PARAM_TEXT);
    $filterlist = optional_param("filterlist","",PARAM_TEXT);
    $filternodetypes = optional_param("filternodetypes","",PARAM_TEXT);

	// network search parameters
    $netnodeid = optional_param("netnodeid","",PARAM_TEXT);
    $netq = optional_param("netq","",PARAM_TEXT);
    $netscope = optional_param("netscope","",PARAM_TEXT);
    $netlinkgroup = optional_param("netlinkgroup","",PARAM_TEXT);
    $netdepth = optional_param("netdepth",1,PARAM_INT);
    $netdirection = optional_param("netdirection",'both',PARAM_TEXT);
    $netlabelmatch = optional_param("netlabelmatch",'false',PARAM_TEXT);

    $agentlastrun = optional_param("agentlastrun",'',PARAM_TEXT);

    if($user instanceof Error){
        echo "<h1>User not found</h1>";
        include_once("includes/footer.php");
        die;
    }
?>
    <div id="context">
        <div id="contextimage"><img src="<?php print $user->photo;?>"/></div>
        <div id="contextinfo">
            <h1><?php print $user->name; ?></h1>
<?php if (isset($USER->userid)) {?>
<div>
New: <a href="javascript:loadDialog('createidea','<?php print($CFG->homeAddress);?>plugin/ui/idea.php');">Idea</a> |
     <a href="javascript:loadDialog('createconn','<?php print($CFG->homeAddress);?>plugin/ui/connection.php', 840, 760);">
        Connection</a> |
     <a href="javascript:loadDialog('createurl','<?php print($CFG->homeAddress);?>plugin/ui/url.php');">Website</a> |
     <a href="javascript:loadDialog('creategroup','<?php print($CFG->homeAddress);?>plugin/ui/addgroup.php');">Group</a> |
     <a href="<?php print($CFG->homeAddress);?>import/index.php">Import / Feed</a>
</div>
<div>
Edit: <a href="<?php
        print($CFG->homeAddress);?>profile.php">Profile</a> | <a
        href="<?php print($CFG->homeAddress);?>editgroup.php">
        Groups</a> | <a
        href="javascript:loadDialog('managetags','<?php
        print($CFG->homeAddress);?>plugin/ui/tag.php');">
        Tags</a> | <a
        href="javascript:loadDialog('managebookmarks','<?php
        print($CFG->homeAddress);?>plugin/ui/bookmarks.php');">
        Bookmarks</a> | <a
        href="javascript:loadDialog('managesearches','<?php
        print($CFG->homeAddress);?>plugin/ui/managesearches.php', 790,
        650);">Searches</a> | <a
        href="javascript:loadDialog('manageroles','<?php
        print($CFG->homeAddress);?>plugin/ui/role.php');">
        Idea Types</a> | <a
        href="javascript:loadDialog('managelinktypes','<?php
        print($CFG->homeAddress);?>plugin/ui/linktype.php');">
        Link Types</a>
</div>
			<?php } ?>
            <?php
				if($USER->getIsAdmin() == "Y"){
					echo "<a title='stats' href='".$CFG->homeAddress."admin/userContextStats.php?userid=".$userid."'> (stats) </a>";
				}
                if($user->description != ""){
                    echo "<p>".$user->description."</p>";
                }
                if($user->website != ""){
                    echo "<p><a href='".$user->website."'>".$user->website."</a></p>";
                }
            ?>
        </div>
    </div>
    <div style="clear:both;"></div>
<?php

    $args = array();
    $args["userid"] = $user->userid;

    $args["start"] = $start;
    $args["max"] = $max;
    $args["orderby"] = $orderby;
    $args["sort"] = $sort;

    $args["direction"] = $direction;
    $args["filtergroup"] = $filtergroup;
    $args["filterlist"] = $filterlist;
    $args["filternodetypes"] = $filternodetypes;

    $args["netnodeid"] = $netnodeid;
    $args["netq"] = $netq;
    $args["netscope"] = $netscope;
    $args["netlinkgroup"] = $netlinkgroup;
    $args["netdepth"] = $netdepth;
    $args["netdirection"] = $netdirection;
    $args["netlabelmatch"] = $netlabelmatch;

    $args["agentlastrun"] = $agentlastrun;

    $args["title"] = $user->name;


    display_tabber($CFG->USER_CONTEXT,$args);

    include_once("includes/footer.php");
?>