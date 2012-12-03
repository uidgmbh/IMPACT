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
	checkLogin();
	include_once("includes/header.php");

    global $USER;

    $searchid = optional_param("searchid","", PARAM_TEXT);

	// network search parameters
    $netnodeid = optional_param("netnodeid","",PARAM_TEXT);
    $netscope = optional_param("netscope","",PARAM_TEXT);
    $netlabelmatch = optional_param("netlabelmatch",'false',PARAM_TEXT);
    $netdepth = optional_param("netdepth",0,PARAM_TEXT);

	// form submitted.
	$netscope = optional_param("scope", "all", PARAM_TEXT);
	$netnodeid = optional_param("focalnodeid", "", PARAM_TEXT);
	$netlabelmatch = optional_param("labelmatch", 'false', PARAM_TEXT);

	// form submitted.
    $directionArray = optional_param("direction","",PARAM_TEXT);
    $linkgroupArray = optional_param("linkgroup","",PARAM_TEXT);
    $linksetArray = optional_param("linkset","",PARAM_TEXT);
    $selectedlinksArray = optional_param("selectedlinks","",PARAM_TEXT);
    $selectedrolesArray = optional_param("selectedroles","",PARAM_TEXT);

	$depth = count($selectedlinksArray);

	for($i=0;$i<$depth;$i++) {
		$next = $selectedlinksArray[$i];
		if ($next == ""){
			$type =  $linksetArray[$i];
			if ($type != '') {
				$selectedlinksArray[$i] = (new LinkTypeSet()).getDefinedLinkSet($type);
			}
		}
	}

	$search = null;
	if ($searchid != "") {
		$search = getSearch($searchid);
		if (!$search->searchid) {
			$search = null;
		}
	}

    $node = getNode($netnodeid);

	$links = "{";
	$keys = array_keys($selectedlinksArray);
	for($i=0;$i< sizeof($keys); $i++){
		$next = $selectedlinksArray[$keys[$i]];
		$links .= $keys[$i].':"'.$next.'"';
		if ($i != (sizeof($keys)-1)) {
			$links .= ',';
		}
	}
	$links .= "}";

	$roles = "{";
	$keys = array_keys($selectedrolesArray);
	for($i=0;$i< sizeof($keys); $i++){
		$next = $selectedrolesArray[$keys[$i]];
		$roles .= $keys[$i].':"'.$next.'"';
		if ($i != (sizeof($keys)-1)) {
			$roles .= ',';
		}
	}
	$roles .= "}";

	$linkgroups = "{";
	$keys = array_keys($linkgroupArray);
	for($i=0;$i< sizeof($keys); $i++){
		$next = $linkgroupArray[$keys[$i]];
		$linkgroups .= $keys[$i].':"'.$next.'"';
		if ($i != (sizeof($keys)-1)) {
			$linkgroups .= ',';
		}
	}
	$linkgroups .= "}";

	$directions = "{";
	$keys = array_keys($directionArray);
	for($i=0;$i< sizeof($keys); $i++){
		$next = $directionArray[$keys[$i]];
		$directions .= $keys[$i].':"'.$next.'"';
		if ($i != (sizeof($keys)-1)) {
			$directions .= ',';
		}
	}
	$directions .= "}";
?>
    <script type='text/javascript'>
    	var CONTEXT = 'agent';
    	var NET_ARGS = new Array();

		NET_ARGS["searchid"] = '<?php echo $searchid; ?>';
		NET_ARGS["netnodeid"] = '<?php echo $netnodeid; ?>';
		NET_ARGS["netscope"] = '<?php echo $netscope; ?>';
		NET_ARGS["netlabelmatch"] = '<?php echo $netlabelmatch; ?>';
		NET_ARGS["netdepth"] = <?php echo $depth; ?>;

		var linktypes = <?php echo $links;?>;
		var nodetypes = <?php echo $roles;?>;
		var linkgroups = <?php echo $linkgroups;?>;
		var directions = <?php echo $directions;?>;
		NET_ARGS["netq"] = linktypes;
		NET_ARGS["netlinkgroup"] = linkgroups;
		NET_ARGS["netdirection"] = directions;
		NET_ARGS["netroles"] = nodetypes;

    	//var linktypes = '<?php echo $netq ; ?>';
    	var linkgroup = '<?php echo $netlinkgroup; ?>';

		Event.observe(window, 'load', function() {
			if ($('Cohere-SearchNet')) {
				$('Cohere-SearchNet').stop();
				$('Cohere-SearchNet').destroy();
				$("tab-content-conn").innerHTML = "";
			}

			bObj = new JSONscriptRequest(URL_ROOT+"visualize/networksearch-netNew.js");
			bObj.buildScriptTag();
			bObj.addScriptTag();
		});

		/**
		 * Open the edit window for this search
		 */
		function editSearch(searchid) {
			loadDialog('structuredsearch', URL_ROOT+"plugin/ui/structuredsearchNew.php?searchid="+searchid, 840, 760);
		}

		/**
		 * Open the edit window for this search
		 */
		function openSearchManager() {
			loadDialog('managesearches', URL_ROOT+"plugin/ui/managesearches.php", 790, 650);
		}

		/**
		 * Run the agent associated with this search, if there is one.
		 */
		function runAgent(searchid, agentid, lastrun) {

			if (NET_ARGS['searchid'] == searchid &&
					agentid != null && agentid != "" &&
						lastrun != null && lastrun != '0') {


				NET_ARGS['agentlastrun'] = lastrun;

				var newURL = URL_ROOT+"agent.php";
				newURL += "?"+Object.toQueryString(NET_ARGS);

				var start = new Date().getTime()/1000;

				var reqUrl = SERVICE_ROOT + "&method=updateagentlastrun&agentid="+agentid+"&lastrun="+start;
				new Ajax.Request(reqUrl, { method:'get',
						onError:  function(error) {
							alert("There was an error updating the agent");
						},
						onSuccess: function(transport){
						   var json = transport.responseText.evalJSON();
							if(json.error){
								alert(json.error[0].message);
								return;
							}

							window.location.href = newURL;
						}
				});
			}
		}

    </script>

    <div id="context">
        <div id="contextimagesmall"><img src="<?php echo $CFG->homeAddress.'images/networksearch.png'; ?>"/></div>
        <div id="contextinfo">
            <h1>Network Search <?php if ($search != null) { echo "for: ".$search->name; } ?></h1>
            <p>Search connection network on <?php echo $netscope; ?> data starting from <b><?php echo $node->name; ?></b>

            <?php
				if ($netlabelmatch == 'true') {
					echo "<br>matching ideas on labels<br>";
				};

            	for($i=0;$i<$depth;$i++) {

					$links = $selectedlinksArray[$i];
					$group = $linkgroupArray[$i];
					$dir = $directionArray[$i];
					$roles = $selectedrolesArray[$i];

					$headerlinks = $links;
					if ($group != "") {
						$headerlinks = $group;
					}

					echo '<br><b> At depth '.($i+1).'</b>';
					echo '<br>Following links of type: '.$headerlinks;
					echo '<br>In '.$dir.' directions';
					echo '<br>Matching on ideas of type: '.$roles;
					echo '<br>';

				}
			?>
			</p>
        </div>
    </div>
    <div style="clear:both;"></div>

    <div id="tabber">
        <ul id="tabs" class="tab">
            <li class="tab"><a class="tab" id="tab-net" href="#agent-net"><span class="tab">Network</span></a></li>
        </ul>
        <div id="tabs-content">
           <div id='tab-content-inner' class='tabcontent'>
			   <div id='tab-content-toolbar' style="margin-bottom: 5px;">
				   <?php
					if ($search != null) {
						echo '<li class="tab" style="padding-left: 5px; margin-left: 5px;"><img title="Edit this network search" src="'.$CFG->homeAddress.'images/edit.png" onclick="editSearch(\''.$search->searchid.'\')" /></li>';
					}
					if ($search != null && $search->agent != null) {
						echo '<li class="tab" style="padding-left: 5px; margin-left: 5px;"><img title="Run the agent associated with this search" src="'.$CFG->homeAddress.'images/runagent.png" onclick="runAgent(\''.$search->searchid.'\', \''.$search->agent->agentid.'\', \''.$search->agent->lastrun.'\')" /></li>';
					}

					if ($USER->userid) {
						echo '<li class="tab" style="padding-left: 5px; margin-left: 7px;"><img title="Open the Search Manager" src="'.$CFG->homeAddress.'images/searchmanager2.png" onclick="openSearchManager()" /></li>';
					}
				?>
				</div>
				<div id='tab-content-net'></div>
			</div>
        </div>
    </div>

<?php
   include_once("includes/footer.php");
?>