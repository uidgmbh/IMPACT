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

function loadUserGMap(){
	$("tab-content-user").update('<div id="my-usermap" style="height: 400px; border: 1px solid #aaa">Loading map</div>');
	$("tab-content-user").insert('<div id="user-usergmap-loading"></div>');
	$("user-usergmap-loading").insert(getLoading("(Loading people locations...)"));

	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("my-usermap"));
		map.setCenter(new GLatLng(17.383, 11.183), 2);
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
    	} else {
    		alert("Browser not compatible");
    	}
	
	// now load in the users
	loadUserGMapMarkers();
}

function loadUserGMapMarkers(){
	var url = SERVICE_ROOT.replace('format=json','format=gmap');
	var args = Object.clone(USER_ARGS);
	args["start"] = 0;
	//get all (not just the normal 20 max)
	args["max"] = -1;
	var reqUrl = url+"&method=getusersby"+CONTEXT+"&includegroups=false&"+Object.toQueryString(args);
	new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  					var json = transport.responseText.evalJSON();
  					try {
  						var json = transport.responseText.evalJSON();
  					} catch(e) {
  						alert("There was an error loading the geo map data.");
						($("user-usergmap-loading")).remove();					
  						return;
  					}

	      			if(json.error){
	      				alert(json.error[0].message);
						($("user-usergmap-loading")).remove();					
 	      				return;
	      			} 
	      			
					var checker = new Array();					
					var titleArray = new Array();
					
					for(var i=0; i<json.locations.length; i++){									
						var data = json.locations[i];
						
						if (titleArray[data.lat+data.lng]) {
							var title = titleArray[data.lat+data.lng];
							title += ", "+data.title;
							titleArray[ data.lat+data.lng ] = title;														
						} else {
							var title = data.title;
							if (data.city) {
								title = data.city+" - "+data.title;
							}
							titleArray[ data.lat+data.lng ] = title;													
						}						
						if (checker[ data.lat+data.lng ]) {
							var html = checker[data.lat+data.lng];							
							var newhtml = "<div style='margin: 3px; clear: both;float:left;'><div style='clear:both;float:left'><img class='forminput' style='margin-right:5px;' src='"+data.thumb+"'/>";
							newhtml += "<a href='"+URL_ROOT+"user.php?userid="+data.id+"'>"+ data.title + "</a></div>";
							newhtml += "<div style='margin-bottom: 3px;clear:both;float:left'>"+ data.desc + "</div></div>";
							html += newhtml;
							checker[ data.lat+data.lng ] = html;														
						} else {
							var html = "<div style='margin: 3px; clear: both;float:left;'><div style='clear:both;float:left'><img class='forminput' style='margin-right:5px;' src='"+data.thumb+"'/>";
							html += "<a href='"+URL_ROOT+"user.php?userid="+data.id+"'>"+ data.title + "</a></div>";
							html += "<div style='margin-bottom: 3px;clear:both;float:left'>"+ data.desc + "</div></div>";
							checker[data.lat+data.lng] = html;
						}
					}
	      			
	      			checkerDone = new Array();
	      			
					for(var i=0; i<json.locations.length; i++){
						var data = json.locations[i];
					
						if (!checkerDone[ data.lat+data.lng ]) {
							var html = "<div style='overflow-y: auto; height: 150px; width: 250px;'>"+checker[ data.lat+data.lng ]+"</div>";						
							var title = titleArray[ data.lat+data.lng ];
							var point = new GLatLng(data.lat,data.lng);
							map.addOverlay(createUserMarker(point, title, html));	
							
							checkerDone[ data.lat+data.lng ] = 'true';
						}											
					}
					
					DATA_LOADED.usergmap = true;
					($("user-usergmap-loading")).remove();					
    		}
  		});	
}

/**
 * Create a marker with correct listener event
 */
function createUserMarker(point, title, html) {	
    var marker = new GMarker(point, {title: title});
    GEvent.addListener(marker, "click", function() {
       marker.openInfoWindowHtml(html);
    });
    return marker;
}

loadUserGMap();