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
<script type="text/javascript">//<![CDATA[
	function displaySnippetNavHeader(objDiv, total, start, count, type){
	    if(count != 0){
	        objDiv.insert("<b>Showing " + (parseInt(start)+1) + " to " + (parseInt(start)+parseInt(count)) + " of " + total + " " + type + "</b>");
	    } else {
	        objDiv.insert("<b>There are no "+ type+ " to display</b>");   
	    }
	}

	function displaySnippetNav(objDiv, total, start, count, argArray, context, type){

		var prevSpan = new Element("div", {id:"nav-previous", "style":"float:left;"}).update("<b>&lt; Previous</b>");
	    if(start > 0){
	        prevSpan.addClassName("active");
	        Event.observe(prevSpan,"click", function(){
	        	var newArr = Object.clone(CONN_ARGS);
	            newArr["start"] = parseInt(start) - newArr["max"];
	            getConnections(CONTEXT, newArr);
	            //eval("load"+type+"(context, newArr)");
	        });       
	    } else {
	        prevSpan.addClassName("inactive");   
	    }
	    objDiv.insert(prevSpan); 
	    
	    var nextSpan = new Element("div", {id:"nav-next", "style":"float:right;"}).update("<b>Next &gt;</b>");
	    if(parseInt(start)+parseInt(count) < parseInt(total)){
	        nextSpan.addClassName("active");
	        Event.observe(nextSpan,"click", function(){
	        	var newArr = Object.clone(CONN_ARGS);
	            newArr["start"] = parseInt(start) + parseInt(newArr["max"]);
	            getConnections(CONTEXT, newArr);
	            //eval("load"+type+"(context,newArr)");
	        });     
	    } else {
	        nextSpan.addClassName("inactive");    
	    }
	    
	    objDiv.insert(nextSpan);
	}
	
	function displaySnippetConnections(objDiv, conns, start, direction){
	
		if (direction != null) {
			connectionDirection = direction;
		}
		
		var lOL = new Element("ol", {'start':start, 'class':'conn-list-ol'});
		for(var i=0; i< conns.length; i++){		
			var iUL = new Element("li", {'id':conns[i].connection.connid, 'class':'conn-list-li'});
			lOL.insert(iUL);
			var cWrap = new Element("div", {'class':'conn-li-wrapper'});
			var liNo = new Element("div", {'class':'li-no'}).insert(start+i + ".");			
			var blobConn =  renderConnection(conns[i].connection,"conn-list"+i+start, false);
			cWrap.insert(liNo).insert(blobConn);
			cWrap.insert("<div style='clear:both'></div>");
			iUL.insert(cWrap);
		}
		objDiv.insert(lOL);	
	}

	function getConnections(context, args){
    	var reqUrl = SERVICE_ROOT + "&method=getconnectionsby" + context + "&" + Object.toQueryString(args);
    	new Ajax.Request(reqUrl, { method:'get',
      			onSuccess: function(transport){
      				var json = transport.responseText.evalJSON();
          			if(json.error){
                    	$('displayContextButton').style.visibility = 'hidden';
                    	$('displayURLButton').style.visibility = 'hidden';
                    	$('displaySnippetButton').style.visibility = 'hidden';
	      				$('snippetConnDiv').innerHTML = "<p style=\"color: black; margin: 10px;\">"+json.error[0].message+"</p>";
 	      				return;
          			}  
   				
    				if(json.connectionset[0].connections.length > 0){
    					$('snippetConnDivTop').innerHTML = "";
    					$('snippetConnDiv').innerHTML = "";
    					$('snippetConnDivBottom').innerHTML = "";
    					displaySnippetNavHeader($("snippetConnDivTop"),json.connectionset[0].totalno,json.connectionset[0].start,json.connectionset[0].count,"connections");
    					displaySnippetConnections($("snippetConnDiv"),json.connectionset[0].connections, parseInt(args['start'])+1, args['direction']);
    					displaySnippetNav($("snippetConnDivBottom"),json.connectionset[0].totalno,json.connectionset[0].start,json.connectionset[0].count, args, context,"connections");		
   				} else {
                    	$('displayContextButton').style.visibility = 'hidden';
                    	$('displayURLButton').style.visibility = 'hidden';
                    	$('displaySnippetButton').style.visibility = 'hidden';
	      				$('snippetConnDiv').update("<p style=\"color: black; margin: 10px;\">No connections can be found anymore matching the criteria for this Cohere connection list view</p>")
 	      				return;
    				}
        		}
      		});
      		
    }

    Event.observe(window, 'load', function() {
    	var newArr = Object.clone(CONN_ARGS);
        newArr["start"] = 0;
        getConnections(CONTEXT, newArr);
       
    });

//]]>
</script>
<div id="snippetConnDivTop" class="snippetColumnListDiv snippetColumnDivExtra"></div>				
<div id="snippetConnDiv" class="snippetColumnDiv snippetColumnListDiv">
  <p>Please wait, I am loading the Cohere connections.</p><p>This embedded page requires JavaScript to be enabled.</p><p>If you have JavaScript disabled, I cannot help you, sorry.</p>
</div>
<div id="snippetConnDivBottom" class="snippetColumnListDiv snippetColumnDivExtra"></div>				
<?php
    include_once("footer.php");
?>