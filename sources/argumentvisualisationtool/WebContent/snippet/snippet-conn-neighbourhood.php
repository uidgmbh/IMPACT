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
 * Created on 25 Jun 2008
 *
 * Michelle Bachler (OCI)
 * 
 *  
 */
    include_once("../config.php");
    include_once("header.php");    
?>
<script src="<?php echo $CFG->homeAddress; ?>visualize/conn-neighbour.js" type="text/javascript"></script>
<script type="text/javascript">//<![CDATA[

    Event.observe(window, 'load', function() {
    	loadNeighbourhood($("snippetConnNeighbourhoodDiv"), CONTEXT, NEIGHBOURHOOD_ARGS, false);       
    });
    
    /**
     * Override the method in conn-neighbour as I don't want to draw the toolbars.
     */
    function checkDataBack() {
    	
    	if (toIdeas != null && fromIdeas != null) {
    		if (toIdeas != "error" && fromIdeas != "error") {

    			var direction = NEIGHBOURHOOD_ARGS['direction'];
    			if (direction == null) {
    				direction = CONNECTION_ARROWS_RIGHT;
    			}		            

    			if (toIdeas.length == 0 && fromIdeas.length == 0) {
    				loadFocalNodeData(mainDiv, NODE_ARGS['nodeid'], direction, INCLUDE_MENU);
    			} else {
    				stopScrollingDetector();
    		              
    				if (fromIdeas.length > 0) {
    					focusedNode = fromIdeas[0].connection.from[0].cnode;
    				} else if (toIdeas.length > 0) {
    					focusedNode = toIdeas[0].connection.to[0].cnode;
    				} 
    		             
    				drawGraph(mainDiv, fromIdeas, toIdeas, focusedNode, direction, INCLUDE_MENU);
    				$('columndiv-wide').className = "viewsdiv-snippet";
    				
    		        //event to resize
    				Event.observe(window,"resize",centerConnectionDivs);
    		              
    				startScrollingDetector();
    				
    				centerConnectionDivs();
    			}
    		} else {
     				mainDiv.insert("<p style=\"color: black;\">There has been a problem loading the data for this view.</p>");      				
    		}
    	} else {
    	      setTimeout(checkDataBack, 1000);	      
        }
    }    
    
    /**
     * Override the method in conn-neighbour as I don't want to draw the toolbar.
     */
   function loadFocalNodeData(objDiv, nodeid, direction, includemenu) {
    	var reqUrl = SERVICE_ROOT + "&method=getnode&nodeid=" + nodeid;
    	new Ajax.Request(reqUrl, { method:'get',
      			onSuccess: function(transport){
      				var json = transport.responseText.evalJSON();
         			if(json.error){
          				//alert(json.error[0].message);
     					mainDiv.insert("<p style=\"color: black;\">There has been a problem loading the data for this view.</p>");      				
          				return;
          			}  
          			
          			// Don't want to display sorts and visualizations when there are no links.
    				objDiv.innerHTML = "";  			
          			
    				drawGraph(objDiv, new Array(), new Array(), json.cnode[0], direction, includemenu);
    				$('columndiv-wide').className = "viewsdiv-snippet";

    				centerConnectionDivs();
           		}
          	});      
    }
    
    /**
     * Start the scrolling detector thread for the connection focus view.
     */
    function startScrollingDetector() {
    	var columndiv = document.getElementById('snippetConnNeighbourhoodDiv');
    	lastScrollTop =columndiv.scrollTop;
     	setInterval("scrollingDetector()", 250);
    }

    /**
     * Process the scrolling detector request for the connection focus view.
     * Only does anything if the Connection List focus view is visible.
     */
    function scrollingDetector() {
    	
    	if ($('columndiv-wide')) {
         	if ($('columndiv-wide').scrollTop != lastScrollTop) {
        		lastScrollTop = $('columndiv-wide').scrollTop;
        	}
    	}
    	
       	// fiddle to get vertical links to adjust as required.
       	if (leftVerticalLinkCount > 0) {
       		for (var i=0; i< leftVerticalLinkCount; i++) {
       			if (i==0) {
       				var newHeight = (leftVerticalLinkIdeas[i].offsetHeight/2)+5+"px";
       				if (leftVerticalLinkDivs[i].style.height != newHeight) {
       					leftVerticalLinkDivs[i].style.height = newHeight;
       				}
       			} else if (i == leftVerticalLinkCount-1) {
       				var newHeight = (leftVerticalLinkIdeas[i].offsetHeight/2)+4+"px";
       				if (leftVerticalLinkDivs[i].style.height != newHeight) {
       					leftVerticalLinkDivs[i].style.height = newHeight;
       				}
       			} else {
       				var newHeight = leftVerticalLinkIdeas[i].offsetHeight+6+"px";
       				if (leftVerticalLinkDivs[i].style.height != newHeight) {
       					leftVerticalLinkDivs[i].style.height = newHeight;
       				}
       			}		
       		}	
       	}	
       	if (rightVerticalLinkCount > 0) {
       		for (var i=0; i<rightVerticalLinkCount; i++) {
       			if (i==0) {
       				var newHeight = (rightVerticalLinkIdeas[i].offsetHeight/2)+5+"px";
      				if (rightVerticalLinkDivs[i].style.height != newHeight) {
       					rightVerticalLinkDivs[i].style.height = newHeight;
       				}
       			} else if (i == rightVerticalLinkCount-1) {
       				var newHeight = (rightVerticalLinkIdeas[i].offsetHeight/2)+4+"px";
       				if (rightVerticalLinkDivs[i].style.height != newHeight) {
       					rightVerticalLinkDivs[i].style.height = newHeight;
       				}
       			} else {
       				var newHeight = rightVerticalLinkIdeas[i].offsetHeight+6+"px";
       				if (rightVerticalLinkDivs[i].style.height != newHeight) {
       					rightVerticalLinkDivs[i].style.height = newHeight;
       				}
       			}		
       		}	
       	}
       	
		centerConnectionDivs();       	
    }
    
//]]>
</script>
<div id="snippetConnNeighbourhoodDiv" class="snippetColumnFocusDiv">
<!--@todo.
<p>Please wait, I am loading the Cohere connections.</p><p>This embedded page requires JavaScript to be enabled.</p><p>If you have JavaScript disabled, I cannot help you, sorry.</p>
-->
</div>				
<?php
    include_once("footer.php");
?>