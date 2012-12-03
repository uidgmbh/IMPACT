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
var LOAD_COUNT = 3;
var map;

function loadGMap(){
	var tb1 = new Element("div", {'class':'toolbarrow'});
	$("tab-content-node").update(tb1);
	
	tb1.insert(displayNodeAdd());
	tb1.insert(displayNodeVisualisations('gmap'));
	
	$("tab-content-node").insert('<div style="clear: both; margin:0px; padding: 0px;"></div>');

	$("tab-content-node").insert('<div id="my-nodemap" style="height: 400px; border: 1px solid #aaa">Loading map</div>');

	if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("my-nodemap"));
        map.setCenter(new GLatLng(17.383, 11.183), 2);
        map.addControl(new GLargeMapControl());
        map.addControl(new GMapTypeControl());
    }
	
	// now load in the nodes
	testLoaded();
}


function testLoaded(){
	// bit of a hack as can't tell how long it'll be before map is loaded,
	// but seems to do the trick.
	try{
		if ($('node-list-count').childNodes[0].nodeValue != 0){
			loadGMapMarkers();
		} else if (LOAD_COUNT != 0) {
			setTimeout(testLoaded,300);
			LOAD_COUNT--;
		} else {
			loadGMapMarkers();
		}
		
	} catch(err){
		setTimeout(testLoaded,300);
	}
}

function loadGMapMarkers(){
	var url = SERVICE_ROOT.replace('format=json','format=gmap');
	var args = Object.clone(NODE_ARGS);
	args["start"] = 0;
	//get all (not just the normal 20 max)
	args["max"] = $('node-list-count').childNodes[0].nodeValue;
	var reqUrl = url+"&method=getnodesby"+CONTEXT+"&"+Object.toQueryString(args);
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  					var json = transport.responseText.evalJSON();
	      			if(json.error){
	      				alert(json.error[0].message);
	      				return;
	      			} 
					for(var i=0; i<json.locations.length; i++){
						var point = new GLatLng(json.locations[i].lat,json.locations[i].lng);
						var marker = new GMarker(point);
						map.addOverlay(createMarker(point,json.locations[i]));	
											
					}
    		}
  		});	
}

/**
 * Create a marker with correct listener event
 */
function createMarker(point,data) {
	
    var marker = new GMarker(point, {title: data.title});
    GEvent.addListener(marker, "click", function() {
    	var html = "<a href='"+URL_ROOT+"node.php?nodeid="+data.id+"'>"+ data.title + "</a>";
        marker.openInfoWindowHtml(html);
    });
    return marker;
}

loadGMap();