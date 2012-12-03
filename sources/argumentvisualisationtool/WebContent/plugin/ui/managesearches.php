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

    if(isset($_POST["saveagent"])){
    	$searchid = required_param("searchid", PARAM_TEXT);
		$search = new Search($searchid);
		$search->load();
        try {
            $search->canedit();
        } catch (Exception $e){
            echo "You do not have permissions to edit this network search";
            die;
        }
		$agent = new SearchAgent();
		$agent->load();
		$agentruninterval = required_param("agentruninterval-".$searchid, PARAM_TEXT);
    	$agentemail = optional_param("agentemail-".$searchid, "", PARAM_TEXT);
    	$agent->add($searchid, $agentemail, $agentruninterval);

    } else if(isset($_POST["updateagent"])) {
    	$searchid = required_param("searchid", PARAM_TEXT);
		$search = new Search($searchid);
        try {
            $search->canedit();
        } catch (Exception $e){
            echo "You do not have permissions to edit this network search";
            die;
        }

    	$agentid = required_param("agentid", PARAM_TEXT);
		if ($agentid != "") {
			$a = new SearchAgent($agentid);
			$agent = $a->load();
			if ($agent && !$agent instanceof error) {
		    	$agentruninterval = required_param("agentruninterval-".$searchid, PARAM_TEXT);
		    	$agentemail = optional_param("agentemail-".$searchid, "", PARAM_TEXT);
				$agent->edit($agentemail, $agentruninterval);
			}
		}
    }

    $rs = getUserSearches();
    $searches = $rs->searches;
?>

<script type="text/javascript">

   	var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
   	var URL_ROOT = "<?php echo $CFG->homeAddress; ?>";

	function init(){
		$('dialogheader').insert('Manage Structured Searches<br>and their Agents');
	}

   	function manageRuns(searchid,agentid) {
		loadDialog('manageruns', URL_ROOT+"plugin/ui/managesearchagentruns.php?searchid="+searchid+"&agentid="+agentid);
   	}

   	function addNewSearch() {
		loadDialog('structuredsearch', URL_ROOT+"plugin/ui/structuredsearch.php", 790, 650);
   	}

   	function editSearch(searchid) {
		loadDialog('structuredsearch', URL_ROOT+"plugin/ui/structuredsearch.php?searchid="+searchid, 790, 650);
   	}

   	function deleteSearch(searchid) {

        var name = $('searchlabel'+searchid).firstChild.data;
        if (!name) {
        	name = "";
        }

        var answer = confirm("Are you sure you want to Delete the Search:\n\n'"+name+"'?\n\n");
        if(answer){
            //send request
            var reqUrl = SERVICE_ROOT + "&method=deletesearch&searchid="+searchid;

            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }

                    window.location.href = "managesearches.php";
                }
            });

        }
   	}

   	function deleteSearchAgent(searchid, agentid) {

        var name = $('searchlabel'+searchid).firstChild.data;
        if (!name) {
        	name = "";
        }

        var answer = confirm("Are you sure you want to Delete the Agent for the search:\n\n'"+name+"'?\n\n");
        if(answer){
            //send request
            var reqUrl = SERVICE_ROOT + "&method=deletesearchagent&agentid="+agentid;

            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }

                    window.location.href = "managesearches.php";
                }
            });

        }
   	}

   	function runAgentSearch(searchid, agentid) {
   		if (searchid != "" && agentid != "") {
			var reqUrl = SERVICE_ROOT + "&method=runsearchagent&searchid="+searchid+"&type=user";
			new Ajax.Request(reqUrl, { method:'get',
					onError:  function(error) {
						alert("There was an error running the agent");
					},
					onSuccess: function(transport){
					   var json = transport.responseText.evalJSON();
						if(json.error){
							alert(json.error[0].message);
							return;
						}

						var runid = json.searchagentrun[0].runid;
						var newURL = URL_ROOT+"agent.php?searchid="+searchid+"&agentid="+agentid+"&runid="+runid;
						window.opener.location.assign(newURL);

						refreshSearchList();
					}
			});
		}
   	}

   	function runSearch(searchid) {
  		var reqUrl = SERVICE_ROOT + "&method=getsearchbyid&searchid="+searchid;
   		new Ajax.Request(reqUrl, { method:'get',
     			onSuccess: function(transport) {

     				try {
     					var json = transport.responseText.evalJSON();
     				} catch(err) {
     					console.log(err);
     				}

         			if(json.error){
         				alert(json.error[0].message);
         				return;
         			}

					//scope, focalnodeid, links, linkgroup, linkset, depth
					var search = json.search[0];

					var netargs = {};
					netargs['netnodeid'] = search.focalnodeid;

					var selectedlinks = search.linktypes;
					if (selectedlinks == "") {
						if (search.linkset != null && search.linkset != "") {
							selectedlinks = getDefinedLinkSet(search.linkset);
						}
					}

					if (selectedlinks == "" && search.linkgroup == "") {
						alert("Links to search on missing. Run aborted");
						return;
					}

					var labelmatchdata = 'false';
					if (search.labelmatch == 1) {
						labelmatchdata = 'true';
					}

					netargs['netq'] = selectedlinks;
					netargs['netlinkgroup'] = search.linkgroup;
					netargs['netscope'] = search.scope;

					netargs['netdepth'] = search.depth;
    				netargs['netdirection'] = search.direction;
    				netargs['netlabelmatch']= labelmatchdata;

					var newURL = URL_ROOT+"networksearch.php";
					newURL += "?searchid="+searchid+"&"+Object.toQueryString(netargs);
					newURL += "#"+'conn-net';

					//alert(newURL);

					window.opener.location.assign(newURL);

					window.close();
       		}
   		});
   	}

   	function checkInterval(searchid) {
   		if ($('agentemail-'+searchid).checked == true) {
   			$('interval-'+searchid).style.display = "block";
   		} else {
   			$('interval-'+searchid).style.display = "none";
  		}
   	}

   	function refreshSearchList() {
   		window.location.href = "managesearches.php";
   	}

   	function openNewAgent(area, trigger) {
   		$(area).style.display = 'block';
   		$(trigger).style.display = 'none';
   	}

   	function closeNewAgent(area, trigger) {
   		$(area).style.display = 'none';
   		$(trigger).style.display = 'block';
   	}

   	function openAgentEdit(area, trigger) {
   		$(area).style.display = 'block';
   		$(trigger).style.visibility = 'hidden';
   	}

   	function closeAgentEdit(area, trigger) {
   		$(area).style.display = 'none';
   		$(trigger).style.visibility = 'visible';
   	}

   	window.onload = init;

</script>

<div id="searchesdiv">
	<div class="formrow">
		<a id="addnewsearch" href="javascript:addNewSearch();" class="form">add new</a>
	</div>
    <div class="formrow">
        <div id="searchesdiv" class="forminput">
            <table class='table' cellspacing='0' cellpadding='3' border='0'>
	            <tr>
	            <th width='210'>Search Name</th>
	            <th width='100'>Search Action</th>
	            <th width='180' style=\"border-left: 1px solid\">Agent</th>
	            <th width='210'>Agent Action</th>
	           </tr>

            <?php
            $search = "";
            foreach($searches as $search) {

                echo "<td>";
               	echo "<span class='labelinput' style='font-size: 100%;' id='searchlabel".$search->searchid."'>".htmlspecialchars($search->name)."</span>";
  		        echo "</td>";

                echo "<td>";
				echo '<a id="runsearch'.$search->searchid.'" href="javascript:runSearch(\''.$search->searchid.'\')" class="form">run</a>&nbsp;|&nbsp;';
				echo "<a id='editsearch".$search->searchid."' href='javascript:editSearch(\"".$search->searchid."\")' class='form'>edit</a>&nbsp;|&nbsp;";
 				echo "<a id='deletesearch".$search->searchid."' href='javascript:deleteSearch(\"".$search->searchid."\")' class='form'>delete</a>";
                echo "</td>";

                echo "<td style=\"border-left: 1px solid\">";
                if ($search->agent != null) {
                	if (count($search->agent->agentruns) == 0) {?>
                		<span style='font-size: 80%'>Created: <?php echo date("d M Y - H:i", $search->agent->lastrun); ?></span>
                	<?php } else { ?>
              			<span style='font-size: 80%'>Last run: <?php echo date("d M Y - H:i", $search->agent->lastrun); ?></span>
                    <?php } ?>
					<div id="agentarea<?php echo $search->searchid; ?>" style="display:none; border: 1px solid; padding: 5px;">
        				<form name="managesearches" action="" method="post">
		        			<input type="hidden" id="searchid" name="searchid" value="<?php echo $search->searchid; ?>" />
		        			<input type="hidden" id="agentid" name="agentid" value="<?php echo $search->agent->agentid; ?>" />
							<div>
								<label class="subformlabel" style="margin-left:3px; margin-bottom: 5px; text-align:left; font-weight: bold;">Send Email?</label>
								<?php
									if ($search->agent->email == 1) {
										echo '<input class="subforminput" style="margin-bottom: 5px;" type="checkbox" id="agentemail-'.$search->searchid.'" name="agentemail-'.$search->searchid.'" value="true" onClick="checkInterval(\''.$search->searchid.'\')" checked="checked" />';
									} else {
										echo '<input class="subforminput" style="margin-bottom: 5px;" type="checkbox" id="agentemail-'.$search->searchid.'" name="agentemail-'.$search->searchid.'" value="true" onClick="checkInterval(\''.$search->searchid.'\')" />';
									}
								?>
								<br/>
								<div id="interval-<?php echo $search->searchid; ?>" style="display:<?php if ($search->agent->email == 1){ echo 'block'; } else { echo 'none'; } ?>">
									<label class="subformlabel" style="margin-left:3px; text-align:left; font-weight: bold;">Run Interval</label><br>
									<input class="sub" type="radio" name="agentruninterval-<?php echo $search->searchid; ?>" value="weekly" <?php if ($search->agent->runinterval == 'weekly'){ echo 'checked="checked"';} ?> /> Weely&nbsp;<br>
									<input type="radio" name="agentruninterval-<?php echo $search->searchid; ?>" value="monthly" <?php if ($search->agent->runinterval == 'monthly'){ echo 'checked="checked"';} ?> /> Monthly&nbsp;<br><br>
								</div>
							</div>
			        		<input class="submit" type="submit" value="Save" id="updateagent" name="updateagent">
							<input type="button" value="Cancel" onclick="closeAgentEdit('agentarea<?php echo $search->searchid; ?>', 'editagent<?php echo $search->searchid; ?>')"/>
						</form>
					</div>
	 			<?php } else { ?>
					<a id="createagent<?php echo $search->searchid; ?>" href="javascript:openNewAgent('agentarea<?php echo $search->searchid; ?>', 'createagent<?php echo $search->searchid; ?>', '<?php echo $search->searchid; ?>')" class="form">create</a>
					<!-- span>coming soon!</span -->
                <?php } ?>
        			<div id="agentarea<?php echo $search->searchid; ?>" style="display:none; border: 1px solid; padding: 5px;">
	            		<form name="managesearches" action="" method="post">
			        		<input type="hidden" id="searchid" name="searchid" value="<?php echo $search->searchid; ?>" />
			        		<div>
		        				<label class="subformlabel" style="margin-left:3px; margin-bottom: 5px; text-align:left; font-weight: bold;" >Send Email?</label>
		        				<input class="subforminput" style="margin-bottom: 5px;" type="checkbox" id="agentemail-<?php echo $search->searchid; ?>" onClick="checkInterval('<?php echo $search->searchid; ?>')" name="agentemail-<?php echo $search->searchid; ?>" value="true" />
			        			<div id="interval-<?php echo $search->searchid; ?>" style="display:none">
			        				<label class="subformlabel" style="margin-left:3px; text-align:left; font-weight: bold;">Run Interval</label><br>
			        				<input class="sub" type="radio" name="agentruninterval-<?php echo $search->searchid; ?>" value="weekly" /> Weely&nbsp;<br>
			        				<input type="radio" name="agentruninterval-<?php echo $search->searchid; ?>" value="monthly" checked="checked" /> Monthly&nbsp;<br><br>
			        			</div>
			        		</div>
			        		<input type="submit" value="Save" id="saveagent" name="saveagent">
			        		<input type="button" value="Cancel" onclick="closeNewAgent('agentarea<?php echo $search->searchid; ?>', 'createagent<?php echo $search->searchid; ?>')"/>
		        		</form>
	        		</div>
                </td>
                <td>
				<?php
                if ($search->agent != null) {
					$labelmatchdata = 0;
					if ($search->labelmatch == 1) {
						$labelmatchdata = 1;
					}
    				echo '<form name="managesearches" action="" method="post" onsubmit="return checkDelete();">';
        			echo '<input type="hidden" id="searchid" name="searchid" value="'.$search->searchid.'" />';
        			echo '<input type="hidden" id="agentid" name="agentid" value="'.$search->agent->agentid.'" />';
					echo "<a id='editagent".$search->searchid."' href='javascript:openAgentEdit(\"agentarea".$search->searchid."\", \"editagent".$search->searchid."\")' class='form'>edit</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
	 				echo '<a id="deleteagent'.$search->searchid.'" name="deleteagent'.$search->searchid.'" href="javascript:deleteSearchAgent(\''.$search->searchid.'\', \''.$search->agent->agentid.'\')" class="form">delete</a>&nbsp;|&nbsp;';
					echo '<a id="runagentsearch'.$search->searchid.'" href="javascript:runAgentSearch(\''.$search->searchid.'\', \''.$search->agent->agentid.'\')" class="form">run agent</a>';
					if (count($search->agent->agentruns) > 0) {
						echo '&nbsp;&nbsp;|&nbsp;&nbsp<a id="manageruns'.$search->searchid.'" name="manageruns'.$search->searchid.'" href="javascript:manageRuns(\''.$search->searchid.'\', \''.$search->agent->agentid.'\')" class="form">view runs</a>';
					}
	 				echo '</form>';
                }
                echo "</td>";
                echo "</tr>";
            }
            echo "</table>";
        ?>
        </div>
    </div>

    <div class="formrow">
   		<input type="button" value="Close" onclick="window.close();"/>
    </div>

 </div>

<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>