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
    include_once($CFG->dirAddress."includes/dialogheader.php");

	$searchid = required_param("searchid", PARAM_TEXT);
	$agentid = required_param("agentid", PARAM_TEXT);
	$runs = array();
	if ($searchid!= "" && $agentid != "") { 
		$search = new Search($searchid);
		$search->load();
		$agent = new SearchAgent($agentid);
		$agent->load();
	    try {
	        $agent->canedit();
	        $runs = $agent->agentruns;
	    } catch (Exception $e){
	        echo "You do not have permissions to view this search agent";
	        die;
	    }
	} else {
        echo "No agent details could be loaded";
	}
?>

<script type="text/javascript">

   	var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
   	var URL_ROOT = "<?php echo $CFG->homeAddress; ?>";
   	var searchid = "<?php echo $searchid; ?>";
   	var agentid = "<?php echo $agentid; ?>";
   	
	function init(){
		$('dialogheader').insert('Agent Runs for: <?php echo $search->name; ?>');
	}

	function viewAgentRun(runid) {
		var newURL = URL_ROOT+"agent.php?searchid="+searchid+"&agentid="+agentid+"&runid="+runid;
		window.opener.opener.location.assign(newURL);
		window.close();
	}
	
   	window.onload = init;

</script>

<form name="manageagentruns" action="" method="post">

<div id="agentformsdiv">
    <div class="formrow">
        <div id="formsdiv" class="forminput">

        <?php
            echo "<table class='table' cellspacing='0' cellpadding='3' border='0'>";

            echo "<tr>";
            echo "<th width='140'>From</th>";
            echo "<th width='140'>To</th>";
            echo "<th width='100'>Connection<br>Count</th>";
            echo "<th width='50'>New<br>Connections</th>";
            echo "<th width='50'>Run Type</th>";
            echo "<th width='50'>Action</th>";
            echo "</tr>";

            $form = "";

            foreach($runs as $run) {
    	        $newConnections = $search->getNewConnections($run->runid);

                echo "<td>";
               	echo "<span class='labelinput' style='font-size: 100%;' id='name".$form->formid."'>".date("d M Y - H:i", $run->from)."</span>";
  		        echo "</td>";

                echo "<td>";
               	echo "<span class='labelinput' style='font-size: 100%;' id='articlenumber".$form->formid."'>".date("d M Y - H:i", $run->to)."</span>";
  		        echo "</td>";
 
                echo "<td>";
               	echo "<span class='labelinput' style='font-size: 100%;' >".count($run->results)."</span>";
  		        echo "</td>";

                echo "<td>";
               	echo "<span class='labelinput' style='font-size: 100%;' >".$newConnections->count."</span>";
  		        echo "</td>";

                echo "<td>";
               	echo "<span class='labelinput' style='font-size: 100%;' >".$run->type."</span>";
  		        echo "</td>";

                echo "<td>";
				echo "<a href='javascript:viewAgentRun(\"".$run->runid."\")' class='form'>view</a>";
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
</form>


<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>