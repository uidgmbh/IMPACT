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

var tl;

 
var resizeTimerID = null;
var LOAD_COUNT = 3;

function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function() {
            resizeTimerID = null;
            if (tl != null) {
            	tl.layout();
            }
        }, 500);
    }
}

function loadSimile(){
	var tb1 = new Element("div", {'class':'toolbarrow'});
	$("tab-content-node").update(tb1);
	
	tb1.insert(displayNodeAdd());
	tb1.insert(displayNodeVisualisations('simile'));
	
	$("tab-content-node").insert('<div style="clear: both; margin:0px; padding: 0px;"></div>');

	$("tab-content-node").insert('<div id="my-timeline" style="height: 400px; border: 1px solid #aaa">Loading timeline</div>');
	testLoaded();
	
	// add onresize to the window event
	Event.observe(window,"resize",onResize);
}

function testLoaded(){
	// bit of a hack as can't tell how long it'll be before timeline is loaded,
	// but seems to do the trick.
	try{
		var temp =new Timeline.DefaultEventSource();
		if ($('node-list-count').childNodes[0].nodeValue != 0){
			onLoad();
		} else if (LOAD_COUNT != 0) {
			setTimeout(testLoaded,300);
			LOAD_COUNT--;
		} else {
			onLoad();
		}
	} catch(err){
		setTimeout(testLoaded,300);
	}
}
function onLoad() {
	var eventSource = new Timeline.DefaultEventSource();
	var d = new Date();
	var today = d.toUTCString();
	var bandInfos = [
    Timeline.createBandInfo({
        eventSource:    eventSource,
        date:           today,
        width:          "30%", 
        intervalUnit:   Timeline.DateTime.DAY, 
        intervalPixels: 200
    }),
    Timeline.createBandInfo({
        eventSource:    eventSource,
        date:           today,
        width:          "70%", 
        intervalUnit:   Timeline.DateTime.MONTH, 
        intervalPixels: 500
     })
   	];
	bandInfos[1].syncWith = 0;
    bandInfos[1].highlight = true;
	tl = Timeline.create(document.getElementById("my-timeline"), bandInfos);
	var url = SERVICE_ROOT.replace('format=json','format=simile');
	var args = Object.clone(NODE_ARGS);
	args["start"] = 0;
	//get all (not just the normal 20 max)
	
	args["max"] = $('node-list-count').childNodes[0].nodeValue;
	Timeline.loadXML(url+"&method=getnodesby"+CONTEXT+"&"+Object.toQueryString(args), function(xml, url) { eventSource.loadXML(xml, url); });
 
}

loadSimile();

