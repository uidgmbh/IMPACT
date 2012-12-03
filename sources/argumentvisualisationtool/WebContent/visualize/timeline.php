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
   include_once("../config.php");
    
    //array_push($HEADER,'<script src="http://simile.mit.edu/timeline/api/timeline-api.js" type="text/javascript"></script>');
	include_once("timeline_2.3.0/timeline_js/timeline-api.js");
    
    $BODY_ATT = 'onload="onLoad();" onresize="onResize();"';
    include_once($CFG->dirAddress."includes/header.php");
    
    
    $userid = optional_param("userid","",PARAM_TEXT);
    $groupid = optional_param("groupid","",PARAM_TEXT);
    $nodeid = optional_param("nodeid","",PARAM_TEXT);
    $urlid = optional_param("urlid","",PARAM_TEXT);
    $q = optional_param("q","",PARAM_TEXT);
    $scope = optional_param("scope","all",PARAM_TEXT);
    
    $qm = "";
    //get the connectionset
    if($userid != ""){
        $qm = "getnodesbyuser";
    }
    
    if($groupid != ""){
        $qm = "getnodesbygroup";
    }
    
    if($nodeid != ""){
        $qm = "getnodesbynode";
    }
    
    if($urlid != ""){
        $qm = "getnodesbyurl";
    }
    
    if($q != ""){
        $qm = "getnodesbysearch";
    }
?>


    <script type="text/javascript">
        var tl;
        function onLoad() {
          var eventSource = new Timeline.DefaultEventSource();
          var bandInfos = [
            Timeline.createBandInfo({
                eventSource:    eventSource,
                date:           "<?php echo gmdate("D, d M Y H:i:s" )." GMT"; ?>",
                width:          "30%", 
                intervalUnit:   Timeline.DateTime.DAY, 
                intervalPixels: 200
            }),
            Timeline.createBandInfo({
                eventSource:    eventSource,
                date:           "<?php echo gmdate("D, d M Y H:i:s" )." GMT"; ?>",
                width:          "70%", 
                intervalUnit:   Timeline.DateTime.MONTH, 
                intervalPixels: 500
            })
          ];
          bandInfos[1].syncWith = 0;
          bandInfos[1].highlight = true;
          tl = Timeline.create(document.getElementById("my-timeline"), bandInfos);
          Timeline.loadXML("<?php echo $CFG->homeAddress; ?>api/service.php?format=simile&max=500&method=<?php echo $qm."&".parse_url($_SERVER["REQUEST_URI"],PHP_URL_QUERY); ?>", function(xml, url) { eventSource.loadXML(xml, url); });
        }
        
        var resizeTimerID = null;
        function onResize() {
            if (resizeTimerID == null) {
                resizeTimerID = window.setTimeout(function() {
                    resizeTimerID = null;
                    tl.layout();
                }, 500);
            }
        }
    </script>

<h1>Simile Timeline</h1>
<div id="my-timeline" style="height: 400px; border: 1px solid #aaa"></div>



<?php    
    include_once($CFG->dirAddress."includes/footer.php");
?>