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
    include_once("includes/header.php");

    global $USER;
    $groupid = required_param("groupid",PARAM_TEXT);

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
    $filterusers = optional_param("filterusers","",PARAM_TEXT);

	// network search parameters
    $netnodeid = optional_param("netnodeid","",PARAM_TEXT);
    $netq = optional_param("netq","",PARAM_TEXT);
    $netscope = optional_param("netscope","",PARAM_TEXT);
    $netlinkgroup = optional_param("netlinkgroup","",PARAM_TEXT);
    $netdepth = optional_param("netdepth",1,PARAM_INT);
    $netdirection = optional_param("netdirection",'both',PARAM_TEXT);
    $netlabelmatch = optional_param("netlabelmatch",'false',PARAM_TEXT);

    $agentlastrun = optional_param("agentlastrun",'',PARAM_TEXT);

    $group = getGroup($groupid);
    //getGroup does not return group properties apart from its members

    if($group instanceof Error){
        echo "<h1>Group not found</h1>";
        include_once("includes/footer.php");
        die;
    }

    $args = array();
    $args["groupid"] = $groupid;

    $args["start"] = $start;
    $args["max"] = $max;
    $args["orderby"] = $orderby;
    $args["sort"] = $sort;

    $args["direction"] = $direction;
    $args["filtergroup"] = $filtergroup;
    $args["filterlist"] = $filterlist;
    $args["filternodetypes"] = $filternodetypes;
    $args["filterusers"] = $filterusers;

    $args["netnodeid"] = $netnodeid;
    $args["netq"] = $netq;
    $args["netscope"] = $netscope;
    $args["netlinkgroup"] = $netlinkgroup;
    $args["netdepth"] = $netdepth;
    $args["netdirection"] = $netdirection;
    $args["netlabelmatch"] = $netlabelmatch;

    $args["agentlastrun"] = $agentlastrun;

    $args["title"] = $group->name;
?>

<div id="context">
  <div id="contextinfo">
    <h1>Group: <?php print $group->name; ?></h1>
    <?php if ($USER->getIsAdmin() == "Y") { ?>
    <a title="stats"
       href="<?php echo $CFG->homeAddress.'admin/groupContextStats.php?groupid='.$groupid; ?>">
      (stats)
    </a>
    <a title="stats-new"
       href="<?php echo $CFG->homeAddress.'admin/groupContextStats2.php?groupid='.$groupid; ?>">
      (tag stats)
    </a>
		<?php	} ?>
    <?php if ($group->description != "") { ?>
    <div id="desc_text">
      <?php echo $group->description; ?>
    </div>
    <?php } ?>
    <?php if ($group->website != "") { ?>
    <a href="<?php echo $group->website; ?>">
      <?php echo $group->website; ?>
    </a>
    <?php } ?>
  </div>
</div>

<div style="clear:both;"></div>

<div id="tabber">
  <ul id="tabs" class="tab">
    <li class="tab"><a class="tab" id="tab-node" href="#node-list"><span class="tab">Ideas (<span id="node-list-count">0</span>)</span></a></li>
    <li class="tab"><a class="tab" id="tab-web" href="#web-list"><span class="tab">Websites (<span id="web-list-count">0</span>)</span></a></li>
    <li class="tab"><a class="tab" id="tab-conn" href="#conn-list"><span class="tab">Connections (<span id="conn-list-count">0</span>)</span></a></li>
    <li class="tab"><a class="tab" id="tab-user" href="#user-list"><span class="tab">People (<span id="user-list-count">0</span>)</span></a></li>
    <li class="tab"><a class="tab" id="tab-tags" href="#tags-list"><span class="tab">Tags (<span id="tags-list-count">0</span>)</span></a></li>
  </ul>
  <div id="tabs-content">
    <div id='tab-content-node' class='tabcontent'>
      <div class="loading">
        <img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/>
        <br/>
        (Loading group ideas...)
      </div>
    </div>
    <div id='tab-content-web' class='tabcontent'>
      <div class="loading">
        <img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/>
        <br/>
        (Loading group websites...)
      </div>
    </div>
    <div id='tab-content-conn' class='tabcontent'>
      <div class="loading">
        <img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/>
        <br/>
        (Loading group connections...)
      </div>
    </div>
    <div id='tab-content-user' class='tabcontent'>
      <div class="loading">
        <img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/>
        <br/>
        (Loading people in group...)
      </div>
    </div>
    <div id='tab-content-tags' class='tabcontent'>
			<div id="tagcloud" style="clear:both; float:left;width:100%">
				<ul>
					<?php
					  $tags = getGroupTagsForCloud($args["groupid"], -1);
						if ($tags != null) {
							$count = count($tags);
          ?>
          <script>
            $('tags-list-count').innerHTML = <?php echo $count; ?>;
          </script>
					<?php
							// get the count range first
							$minCount = -1;
							$maxCount = -1;
							foreach($tags as $tag) {
								$count = $tag['UseCount'];

                $maxCount = ($count > $maxCount) ? $count : $maxCount;
                $minCount = ($minCount === -1 || $count < $minCount) ?
                  $count :
                  $minCount;
							}

              $range = ($maxCount < 10) ?
                1 :
                round(($maxCount - $minCount) / 10);

							$i = 0;
							foreach($tags as $tag) {

                $cloudlistcolour = ($i % 2) ? "#40b5b2" : "#e80074";
								$i++;

								$count = $tag['UseCount'];

								if ($count >= $minCount && $count < $minCount+$range) {
									echo '<li class="tag1" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*1) && $count < $minCount+($range*2)) {
									echo '<li class="tag2" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*2) && $count < $minCount+($range*3)) {
									echo '<li class="tag3" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*3) && $count < $minCount+($range*4)) {
									echo '<li class="tag4" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*4) && $count < $minCount+($range*5)) {
									echo '<li class="tag5" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*5) && $count < $minCount+($range*6)) {
									echo '<li class="tag6" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*6) && $count < $minCount+($range*7)) {
									echo '<li class="tag7" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*7) && $count < $minCount+($range*8)) {
									echo '<li class="tag8" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*8) && $count < $minCount+($range*9)) {
									echo '<li class="tag9" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								} else if ($count >= $minCount+($range*9))  {
									echo '<li class="tag10" title="'.$count.'"><a href="'.$CFG->homeAddress.'tagsearch.php?q='.$tag['Name'].'&scope=all&tagsonly=true&groupid='.$args["groupid"].'" style="color: '.$cloudlistcolour.';">'.$tag['Name'].'</a></li>';
								}
							}
						}
					?>
			  </ul>
		  </div>
    </div>
  </div>
</div>

<script type='text/javascript'>

  var CONTEXT = 'group';
  var NODE_ARGS = CONN_ARGS = NEIGHBOURHOOD_ARGS = NET_ARGS =
      URL_ARGS = USER_ARGS = <?php echo json_encode($args); ?>;

</script>

<script type='text/javascript'
        src='<?php echo $CFG->homeAddress; ?>includes/tabber.js'>
</script>

<?php include_once("includes/footer.php"); ?>