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
 * node.php
 * Created on 24 Jun 2008
 *
 * Alex Little (OCI)
 * 
 *  
 */
 
    include_once("../config.php");
    include_once("header.php");
 
    addToLog("View node snippet","Idea",$nodeid);
?>
<script type="text/javascript">//<![CDATA[
        //load the node then display
        var NODE_ID = "<?php echo $nodeid;?>"
        if (NODE_ID != null && NODE_ID != "") {
	        function getNode(){
	            var reqUrl = SERVICE_ROOT + "&method=getnode&nodeid=" + NODE_ID ;
	
	            new Ajax.Request(reqUrl, { method:'get',
	                    onSuccess: function(transport){
	                        var json = transport.responseText.evalJSON();
	                        if(json.error){
	                        	$('displayContextButton').style.visibility = 'hidden';
	                        	$('displayURLButton').style.visibility = 'hidden';
	                        	$('displaySnippetButton').style.visibility = 'hidden';
	                        	
	                        	$('node').update("<p style=\"color: black;\">The idea referenced by the snippet can no loner be accessed. It may have been deleted or the idea's creator may have made the data private.</p>");
	                            return;
	                        }
	                        var nodeObj = renderNode(json.cnode[0],"snippet"+NODE_ID);
	                        $('node').update(nodeObj);
	                    }
	                    
	            });        
	        }
	    
	        /**
	         *  set which tab to show and load first
	         */
	        Event.observe(window, 'load', function() {
	            getNode();
	           
	        });
        } else {
        	alert("Missing required parameter nodeid");
        }
      //]]>
      </script>
      <div id="node">
      <p>Please wait, I am loading the Cohere idea.</p><p>This embedded page requires JavaScript to be enabled.</p><p>If you have JavaScript disabled, I cannot help you, sorry.</p>
      </div>

<?php
    include_once("footer.php");
?>