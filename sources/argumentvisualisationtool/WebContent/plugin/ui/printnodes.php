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

    array_push($HEADER,"<link rel='stylesheet' href='".$CFG->homeAddress."includes/style.css' type='text/css' media='screen' />");
    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/node.js' type='text/javascript'></script>");
    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/urls.js' type='text/javascript'></script>");
    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/conns.js' type='text/javascript'></script>");
    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/users.js' type='text/javascript'></script>");
    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/dateformat.js' type='text/javascript'></script>");

    include_once($CFG->dirAddress."includes/dialogheader2.php");

    $dataurl = required_param("url", PARAM_TEXT);
    $context = optional_param("context", "", PARAM_TEXT);
    $title = optional_param("title", "", PARAM_TEXT);

 ?>
<style type="text/css">
 @media print {
 input#btnPrint {
 display: none;
 }
 }
</style>
<script type="text/javascript">
//<![CDATA[
	var dataurl = '<?php echo $dataurl; ?>';

	function getNodes(){
		new Ajax.Request(dataurl, { method:'post',
	  			onSuccess: function(transport){
	  				var json = transport.responseText.evalJSON();
	     			if(json.error){
	      				alert(json.error[0].message);
	      				return;
	      			}

					$("printnodes").innerHTML = "";

					if(json.nodeset[0].nodes.length > 0) {
						var lOL = displayReportNodes($("printnodes"), json.nodeset[0].nodes, 1);
					}
	       		}
	      	});
   }

    /**
     *  set which tab to show and load first
     */
    Event.observe(window, 'load', function() {
    	//var message = getReportContext('node', <?php echo $context; ?>);
    	//alert("message="+message);
    	<?php if ($context != "" && $title != "") {
			if ($context == 'tagsearch') {
				echo 'var context="Search results for tags \"'.$title.'\"";';
			} else if ($context == 'node') {
				echo 'var context="Idea: \"'.$title.'\"";';
			} else if ($context == 'user') {
				echo 'var context="\"'.$title.'\"";';
			} else if ($context == 'group') {
				echo 'var context="\"Group: '.$title.'\"";';
			} else if ($context == 'search') {
				echo 'var context="\"Search results for '.$title.'\"";';
			} else if ($context == 'url') {
				echo 'var context="\"Website: '.$title.'\"";';
			} else {
				echo 'var context="";';
			}
		}
    	?>
	    $('dialogheader').insert('Idea List <br><span style="font-size: 10pt;">'+context+'</span>');
        getNodes();

    });
//]]>
</script>

<input style="margin-left: 10px;" type="button" id="btnPrint" value=" Print Page " onclick="window.print();return false;" />

<div id="printnodes" style="margin: 10px; padding-bottom: 10px;">(Loading ideas...)</div>
</div>

</div>

</body>
</html>