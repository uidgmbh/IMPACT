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

    $searchid = required_param("searchid", PARAM_TEXT);
	$agentid = required_param("agentid", PARAM_TEXT);
	$runid = required_param("runid", PARAM_TEXT);

	$search = getSearch($searchid);
	if (!$search->searchid) {
        echo "Search not found";
        include_once("includes/footer.php");
        die;
	} else {
		$agent = $search->agent;
	    try {
	        $agent->canedit();
	        $run = $agent->getRun($runid);
	        if ($run == null) {
	        	echo "Agent Run not found";
	        	include_once("includes/footer.php");
	        	die;
	        }

	        $node = getNode($search->focalnodeid);

	        $args = array();
	        $args["searchid"] = $searchid;
	        $args["runid"] = $runid;
	        $args["netnodeid"] = $search->focalnodeid;

	        $argsStr = "{";
	        $keys = array_keys($args);
	        for($i=0;$i< sizeof($keys); $i++){
	            $argsStr .= '"'.$keys[$i].'":"'.$args[$keys[$i]].'"';
	            if ($i != (sizeof($keys)-1)){
	                $argsStr .= ',';
	            }
	        }
	        $argsStr .= "}";
	    } catch (Exception $e){
	        echo "You do not have permissions to view this search agent run";
	        die;
	    }
	}

?>
    <script type='text/javascript'>
    	var CONTEXT = 'agent';
    	var NET_ARGS = <?php echo $argsStr ;?>;
    	
    	var linktypes = '<?php echo $search->linktypes; ?>';
    	var linkgroup = '<?php echo $search->linkgroup; ?>';
    	var headerlinks = "";
    	var TABS = {"net":true, "list":true};
    	var DATA_LOADED = {"net":false,"list":false};

    	stpAgentList = setTabPushed.bindAsEventListener($('tab-list'),'agent-list');
    	stpAgentNet = setTabPushed.bindAsEventListener($('tab-net'), 'agent-net');
    	
		Event.observe(window, 'load', function() {
			if (linkgroup != "") {
				headerlinks = linkgroup;
			} else {
				headerlinks = linktypes;
			}
			
			Event.observe('tab-list','click', stpAgentList);
			Event.observe('tab-net','click', stpAgentNet);

			$('headerlinks').innerHTML = headerlinks;

			if ($('Cohere-AgentNet')){
				$('Cohere-AgentNet').stop();
				$('Cohere-AgentNet').destroy();
				$("tab-content-conn").innerHTML = "";
			}

			setTabPushed($(getAnchorVal("tab-net")), getAnchorVal("tab-net"));

		});

		/**
		 *	switch between tabs
		 */
		function setTabPushed(e) {
			var data = $A(arguments);
			var tabID = data[1];
			
			// get tab and the visualisation from the #
			var parts = tabID.split("-");
			var page = parts[0];
			var tab = parts[1];
			
			//alert("args="+tab);
			
			for (i in TABS){
				if(tab == i){
					$("tab-"+i).removeClassName("unselected");
					$("tab-"+i).addClassName("current");
					$("tab-content-"+i).show();
				} else {
					$("tab-"+i).removeClassName("current");
					$("tab-"+i).addClassName("unselected");
					$("tab-content-"+i).hide();
				} 
			}

			if (tab == "net") {
				////if(!DATA_LOADED.net){
					$('tab-net').setAttribute("href","#agent-net");
					
					bObj = new JSONscriptRequest(URL_ROOT+"visualize/agent-net.js");
					bObj.buildScriptTag();
					bObj.addScriptTag();
					//DATA_LOADED.net = true;
				//}				
			} else {
				if (!DATA_LOADED.list) {
					$('tab-list').setAttribute("href","#agent-list");

					$("tab-content-list").update(getLoading("(Loading new connections...)"));
					
					var reqUrl = SERVICE_ROOT + "&method=loadsearchagentrunnew&searchid=" + NET_ARGS['searchid'] + "&runid="+NET_ARGS['runid'];
					
					new Ajax.Request(reqUrl, { method:'get',
				  			onSuccess: function(transport){
				  				var json = transport.responseText.evalJSON();
				      			if(json.error){
				      				alert(json.error[0].message);
				      				return;
				      			}  
								$("tab-content-list").innerHTML = "";		
								
								if(json.connectionset[0].connections.length > 0){
									displayConnectionsPlain($("tab-content-list"),json.connectionset[0].connections, 1, 'right');
								} else {
									$("tab-content-list").innerHTML = "<p><h3>No new Connections found</h3></p>";
								}
				    		}
				  		});
				  		
				  	DATA_LOADED.list = true;		
				}
			}
		}

		function editAgent(searchid) {
			loadDialog('structuredsearch', URL_ROOT+"plugin/ui/structuredsearch.php?searchid="+searchid, 790, 650);
		}

		/**
		 * Open the edit window for this search
		 */
		function openSearchManager() {
			loadDialog('managesearches', URL_ROOT+"plugin/ui/managesearches.php", 790, 650);
		}

	</script>

    <div id="context">
        <div id="contextimagesmall"><img src="<?php echo $CFG->homeAddress.'images/agent.png'; ?>"/></div>
        <div id="contextinfo">
            <h1>Network Search Agent <?php if ($search != null) { echo "on: ".$search->name; } ?></h1>
            <p>Search connection network on <?php echo $search->scope; ?> data starting from <b><?php echo $node->name; ?></b>
            <br>Following links of type: <span id="headerlinks"></span>
            <br>In <?php echo $search->direction; ?> directions, to a depth of <?php echo $search->depth.""; if ($search->labelmatch == "true") { echo ", maching ideas on labels"; } ?>
            <br>Looking for new connections added between:&nbsp;<b><?php echo date("d M Y - H:i", $run->from) ?><b> and <b><?php echo date("d M Y - H:i", $run->to) ?></b></p>
        </div>
    </div>
    <div style="clear:both;"></div>

    <div id="tabber">
        <ul id="tabs" class="tab">
            <li class="tab" style="margin: 3px;"><a class="tab" id="tab-net" href="#agent-net"><span class="tab">Network</span></a></li>
            <li class="tab" style="margin: 3px;"><a class="tab" id="tab-list" href="#agent-net"><span class="tab">New Connections</span></a></li>
        </ul>
        <div id="tabs-content">
			<div id='tab-content-list' class='tabcontent'></div>
			<div id='tab-content-net' class='tabcontent'>
			   <div id='tab-content-toolbar' style="margin-bottom: 5px;">
				<?php
					/*if ($search != null) {
						echo '<li class="tab" style="padding-left: 5px; margin-left: 5px;"><img title="Edit this agent and it\'s search" src="'.$CFG->homeAddress.'images/edit.png" onclick="editAgent(\''.$search->searchid.'\')" /></li>';
					}*/
					if ($USER->userid) {
						echo '<li class="tab" style="padding-left: 5px; margin-left: 7px;"><img title="Open the Search Manager" src="'.$CFG->homeAddress.'images/searchmanager2.png" onclick="openSearchManager()" /></li>';
					}
				?>
				</div>
				<div id='tab-content-innernet'></div>
			</div>
        </div>
    </div>

<?php
   include_once("includes/footer.php");
?>