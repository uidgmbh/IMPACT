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

/**
 * Tabber library
 * Formats the output tab view in the main section of the site
 */

/**
 * Displays the tabber
 *
 * @param string $context the context to display
 * @param string $args the url arguments
 */
function display_tabber($context,$args){
    global $CFG;

    if ($context == 'group') { ?>
    <div id="tabber">
        <ul id="tabs" class="tab">
            <li class="tab"><a class="tab" id="tab-node" href="#node-list"><span class="tab">Ideas (<span id="node-list-count">0</span>)</span></a></li>
            <li class="tab"><a class="tab" id="tab-web" href="#web-list"><span class="tab">Websites (<span id="web-list-count">0</span>)</span></a></li>
            <li class="tab"><a class="tab" id="tab-conn" href="#conn-list"><span class="tab">Connections (<span id="conn-list-count">0</span>)</span></a></li>
            <li class="tab"><a class="tab" id="tab-user" href="#user-list"><span class="tab">People (<span id="user-list-count">0</span>)</span></a></li>
            <li class="tab"><a class="tab" id="tab-tags" href="#tags-list"><span class="tab">Tags (<span id="tags-list-count">0</span>)</span></a></li>
        </ul>
        <div id="tabs-content">
            <div id='tab-content-node' class='tabcontent'><div class="loading"><img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/><br/>(Loading group ideas...)</div></div>
            <div id='tab-content-web' class='tabcontent'><div class="loading"><img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/><br/>(Loading group websites...)</div></div>
            <div id='tab-content-conn' class='tabcontent'><div class="loading"><img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/><br/>(Loading group connections...)</div></div>
            <div id='tab-content-user' class='tabcontent'><div class="loading"><img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/><br/>(Loading people in group...)</div></div>

            <div id='tab-content-tags' class='tabcontent'>
				<div id="tagcloud" style="clear:both; float:left;width:100%">
					<ul>
					<?php
						$tags = getGroupTagsForCloud($args["groupid"],-1);
						if ($tags != null) {
							$count = count($tags);
							echo "<script>$('tags-list-count').innerHTML = '".$count."'</script>";
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
    <?php
    } else {
    ?>
    <div id="tabber">
        <ul id="tabs" class="tab">
            <li class="tab"><a class="tab" id="tab-node" href="#node-list"><span class="tab">Ideas (<span id="node-list-count">0</span>)</span></a></li>
            <li class="tab"><a class="tab" id="tab-web" href="#web-list"><span class="tab">Websites (<span id="web-list-count">0</span>)</span></a></li>
            <li class="tab"><a class="tab" id="tab-conn" href="#conn-list"><span class="tab">Connections (<span id="conn-list-count">0</span>)</span></a></li>
            <li class="tab"><a class="tab" id="tab-user" href="#user-list"><span class="tab">People &amp; Groups (<span id="user-list-count">0</span>)</span></a></li>
        </ul>
        <div id="tabs-content">
            <div id='tab-content-node' class='tabcontent'><div class="loading"><img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/><br/>(Loading ideas...)</div></div>
            <div id='tab-content-web' class='tabcontent'><div class="loading"><img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/><br/>(Loading websites...)</div></div>
            <div id='tab-content-conn' class='tabcontent'><div class="loading"><img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/><br/>(Loading connections...)</div></div>
            <div id='tab-content-user' class='tabcontent'><div class="loading"><img src='<?php echo $CFG->homeAddress; ?>images/ajax-loader.gif'/><br/>(Loading people and groups...)</div></div>
        </div>
    </div>
    <?php
    }

    // now trigger the js to load data
    $argsStr = "{";
    $keys = array_keys($args);
    for($i=0;$i< sizeof($keys); $i++){
        $argsStr .= '"'.$keys[$i].'":"'.$args[$keys[$i]].'"';
        if ($i != (sizeof($keys)-1)){
            $argsStr .= ',';
        }
    }
    $argsStr .= "}";

    echo "<script type='text/javascript'>";

    echo "var CONTEXT = '".$context."';";
    echo "var NODE_ARGS = ".$argsStr.";";
    echo "var CONN_ARGS = ".$argsStr.";";
    echo "var NEIGHBOURHOOD_ARGS = ".$argsStr.";";
    echo "var NET_ARGS = ".$argsStr.";";
    echo "var URL_ARGS = ".$argsStr.";";
    echo "var USER_ARGS = ".$argsStr.";";

    echo "</script>";

}
?>