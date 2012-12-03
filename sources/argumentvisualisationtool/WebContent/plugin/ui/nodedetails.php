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

    include_once($CFG->dirAddress."includes/dialogheader.php");
     
    $nodeid = required_param("nodeid", PARAM_TEXT);    
 ?> 
    
<script type="text/javascript">
//<![CDATA[
	var nodeid = '<?php echo $nodeid; ?>';
	
	function getNode(){    
		var reqUrl = SERVICE_ROOT + "&method=getnode&nodeid=" + nodeid;
		new Ajax.Request(reqUrl, { method:'get',
	  			onSuccess: function(transport){
	  				var json = transport.responseText.evalJSON();
	     			if(json.error){
	      				alert(json.error[0].message);
	      				return;
	      			}  
	     			var node = json.cnode[0];
                    var nodeObj = renderNode(node, "details", node.role[0].role, false, 'active');
                    nodeObj.style.cssFloat = 'left';
                    $('nodedetails').update(nodeObj);
	       		}
	      	});      
   }
   
    /**
     *  set which tab to show and load first
     */
    Event.observe(window, 'load', function() {
	    $('dialogheader').insert('Idea Details');
        getNode();
       
    });
//]]>
</script>  
</div>
<div id="nodedetails" style="margin: 10px;">(Loading idea...)
           
<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>