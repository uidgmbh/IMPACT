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
 * conn-net.php
 * Created on 4 July 2008
 *
 * Michelle Bachler
 */
    include_once("../config.php");
    include_once("header.php");

    $netquery = optional_param('netq', "", PARAM_TEXT);
    $netscope = optional_param('netscope','all',PARAM_TEXT);
    $netnodeid = optional_param("netnodeid", "", PARAM_TEXT);
?>

<script type="text/javascript">//<![CDATA[
	NET_ARGS['netq'] = '<?php echo $netquery; ?>';
	NET_ARGS['netscope'] = '<?php echo $netscope; ?>';
	NET_ARGS['netnodeid'] = '<?php echo $netnodeid; ?>';

	function viewNodeDetails(nodeid) {
		loadDialog('nodedetails', URL_ROOT+"plugin/ui/nodedetails.php?nodeid="+nodeid);
	}

	function loadAppletData() {

		var reqUrl = SERVICE_ROOT + "&method=getconnectionsby"+CONTEXT+"&"+Object.toQueryString(NET_ARGS);

		$('Cohere-ConnectionNet').prepareGraph("", "snippet");

		new Ajax.Request(reqUrl, { method:'get',
	  			onSuccess: function(transport){
	  				var json = transport.responseText.evalJSON();
	      			if(json.error){
	      				$('Cohere-ConnectionNet').stop();
	      				$('Cohere-ConnectionNet').destroy();
                    	$('displayContextButton').style.visibility = 'hidden';
                    	$('displayURLButton').style.visibility = 'hidden';
                    	$('displaySnippetButton').style.visibility = 'hidden';
	      				$('graphdiv').innerHTML = "<p style=\"color: black; margin: 10px;\">"+json.error[0].message+"</p>";
 	      				return;
	      			}

	      			if (json.connectionset[0].totalno == 0) {
	      				$('Cohere-ConnectionNet').stop();
	      				$('Cohere-ConnectionNet').destroy();
                    	$('displayContextButton').style.visibility = 'hidden';
                    	$('displayURLButton').style.visibility = 'hidden';
                    	$('displaySnippetButton').style.visibility = 'hidden';
	      				$('graphdiv').innerHTML = "";
	      				$('graphdiv').insert("<p style=\"color: black; margin: 10px;\">No connections can be found anymore matching the criteria for this Cohere network view</p>")
	      			} else {
		      			var conns = json.connectionset[0].connections;

		      			for(var i=0; i< conns.length; i++) {
		      				var c = conns[i].connection;
		      				var fN = c.from[0].cnode;
		      				var tN = c.to[0].cnode;
		      				
		      				var fnRole = c.fromrole[0].role;
		      				var fNNodeImage = "";
		      				if (fN.imagethumbnail != null && fN.imagethumbnail != "") {
		      					var fNNodeImage = URL_ROOT + fN.imagethumbnail;
		      				} else if (fN.role[0].role.image != null && fN.role[0].role.image != "") {
		      					fNNodeImage = URL_ROOT + fN.role[0].role.image;
		      				}	      				
		      				
		      				var tnRole = c.torole[0].role;
		      				var tNNodeImage = "";
		      				if (tN.imagethumbnail != null && tN.imagethumbnail != "") {
		      					var tNNodeImage = URL_ROOT + tN.imagethumbnail;
		      				} else if (tN.role[0].role.image != null && tN.role[0].role.image != "") {
		      					tNNodeImage = URL_ROOT + tN.role[0].role.image;
		      				}	      				
		      				
		      				//create from & to nodes
		      				$('Cohere-ConnectionNet').addNode(fN.nodeid, fN.name, fN.description, fN.users[0].user.userid, fN.creationdate, fN.otheruserconnections, fNNodeImage, fN.users[0].user.thumb, fN.users[0].user.name, fN.role[0].role.name);	      				
		      				$('Cohere-ConnectionNet').addNode(tN.nodeid, tN.name, tN.description, tN.users[0].user.userid, tN.creationdate, tN.otheruserconnections, tNNodeImage, tN.users[0].user.thumb, tN.users[0].user.name, tN.role[0].role.name);
		      				
		      				// add edge/conn
		      				$('Cohere-ConnectionNet').addEdge(c.connid, fN.nodeid, tN.nodeid, c.linktype[0].linktype.grouplabel, c.linktype[0].linktype.label, c.creationdate, c.userid, c.users[0].user.name, c.fromrole[0].role.name,c.torole[0].role.name);
		      			}

		      			if (NET_ARGS['netnodeid'] != undefined &&
		      					NET_ARGS['netnodeid'] != null
		      						&& NET_ARGS['netnodeid'] != "") {

		      				$('Cohere-ConnectionNet').displayGraph(NET_ARGS['netnodeid']);
		      			} else if (CONTEXT == NODE_CONTEXT) {
		      				$('Cohere-ConnectionNet').displayGraph(NET_ARGS['nodeid']);
		      			} else {
		      				$('Cohere-ConnectionNet').displayGraph();
		      			}
	      			}
	      		}
	      	});
	}

	function checkIsActive() {
		try {
			if ($('Cohere-ConnectionNet').isActive()) {
				loadAppletData()
			}
		} catch(e) {
		      setTimeout(checkIsActive, 1000);
	    }
	}


    Event.observe(window, 'load', function() {
    	checkIsActive();
    });
//]]>
</script>

<div id="graphdiv" class="snippetNetDiv">
<APPLET
	id="Cohere-ConnectionNet"
	name="Cohere-ConnectionNet"
	archive="../visualize/connectionnetjars/cohere.jar, ../visualize/connectionnetjars/prefuse.jar, ../visualize/connectionnetjars/plugin.jar"
	code="cohere.CohereApplet.class"
	width="645"
	height="445"
	mayscript="true"
	scriptable="true"
	alt="(Your browser recognizes the APPLET element but does not run the applet.)">
    <p>Please wait, I am loading the Cohere connections.</p><p>This embedded page requires Java to be enabled.</p><p>If you have Java support disabled, I cannot help you, sorry.</p>
</APPLET>
</div>

<?php
    include_once("footer.php");
?>