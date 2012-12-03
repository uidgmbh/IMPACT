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
 
 /* Author: Michelle Bachler - m.s.bachler@open.ac.uk */
 
var manifest = {
  firstRunPage: (<>
   <div style="font-family:Tahoma, verdana, arial, helvetica; font-size: 10pt; border: 1px solid white">
    <p>
      <img src="http://cohere.open.ac.uk/jetpack/ui/images/cohere_logo.png" border="0" style="margin-bottom: 5px; vertical-align: bottom" />
      <br />Thank you for installing the Cohere Jetpack!
      <br />Visit the Cohere <a href="http://cohere.open.ac.uk">homepage</a> to <b>create an account</b> and for more information about Cohere.
    </p>
    <p style="font-weight: bold">Cohere Jetpack Quickstart Guide</p>
    <p>
    The Cohere jetpack consists of 3 slidebars: <i>Ideas</i>, <i>Clips</i> and <i>Connections</i>.
    <br />It also has 3 status bar elements one for each of the slidebars, displaying counts of the items on each slidebar.
    <br />The contents of all of these are webpage specific, so are refreshed as you browse.
    <br />To create content you must be logged in to Cohere. 
    <ul>
    <li style="clear: both;"><img src="http://cohere.open.ac.uk/jetpack/ui/images/lightbulb-16.png" border="0" style="border-right: 3px;" /><b>Ideas</b>: are annotations of a webpage, usually associated with one or more clips.
     <div style="margin: 0px; padding: 0px; padding-left: 20px;">
     To create a new idea, select some text on a webpage and use the right-click Cohere menu item 'Create Idea'.
     </div>  
    </li>    
    <li style="clear: both; margin-top: 10px;"><img src="http://cohere.open.ac.uk/jetpack/ui/images/clip.png" border="0" style="border-right: 3px;" /><b>Clips</b>: are text selection from a webpage stored against that page and associated with an idea.
     <div style="margin: 0px; padding: 0px; padding-left: 20px;">
     To create a new clips, select some text on a webpage and use the right-click Cohere menu item 'Create Clip' or drag the selected text onto the Clip slidebar.
     </div>  
    </li>    
    <li style="clear: both; margin-top: 10px;"><img src="http://cohere.open.ac.uk/jetpack/ui/images/3-connections-16px.png" border="0" style="border-right: 3px;" /><b>Connections</b>: are two ideas that have been associated in a meaningful way.     
     <div style="margin: 0px; padding: 0px; padding-left: 20px;">
     To create a new connection go to the first idea and click the <img src="http://cohere.open.ac.uk/jetpack/ui/images/favorites.png" border="0" style="border-right: 3px;" />bookmark button.
     <br />Then go to the second idea and click the <img src="http://cohere.open.ac.uk/jetpack/ui/images/connection-16px.png" border="0" style="border-right: 3px;" />connection button. 
     <br />This will open a child window with that idea at the top.
     <br />You can then use the bookmark dropdown to select the other idea you bookmarked.
     </div>
    </li>    
    </ul>
    </p>
    </div>
</>).toString()
};
 
jetpack.future.import("selection");
jetpack.future.import("menu");
jetpack.future.import("slideBar");
jetpack.future.import("pageMods");

// Global variables
const TAB_IDEA_WIDTH = 318;
const TAB_CLIP_WIDTH = 318;
const TAB_CONN_WIDTH = 490;
const IDEA_TYPE = 0;
const CLIP_TYPE = 1;
const CONN_TYPE = 2;
const STATUS_TYPE = 3;
const OTHER_TYPE = 4;
const MY_HIGHLIGHT_COLOR = "#FFFF80"; // yellow
const OTHERS_HIGHLIGHT_COLOR = "#C0FFFF"; // light cyan
const NOTFOUND_HIGHLIGHT_COLOR = "#DEDCDC"; // light gray
const CON_TYPE_HIGHLIGHT_COLOR = "#FF8080"; // light red
const PRO_TYPE_HIGHLIGHT_COLOR = "#C0FFC0"; // light green
const IDEA_BACKGROUND_COLOR = "#E9F3F3"; //pale cyan
const CLIP_BACKGROUND_COLOR = "#FAF0F6"; // pale pink
const CONNECTION_BACKGROUND_COLOR = "#E9F3F3"; //pale cyan
const CON_TYPE_LABEL = "Con";
const PRO_TYPE_LABEL = "Pro";
const WARNING_ICON_GREEN = 'http://cohere.open.ac.uk/jetpack/ui/images/warning-green.ico';
const WARNING_ICON_PINK = 'http://cohere.open.ac.uk/jetpack/ui/images/warning-pink.ico';

var	jumpNode;
var	jumpClip;
var	jumpType;	

var dateCode = {};

// "import" formatdate.js code from Cohere server
$.get("http://cohere.open.ac.uk/includes/dateformat.js", function(data, status) {
	eval(data);	
	dateCode.dateFormat = dateFormat;		
});

// Window specific variables
// - so I will need a set of these for each window
//   when I figure the multiple window problem out
var oldTabURL = "";

var ideasStatusBar;
var clipsStatusBar;
var connectionsStatusBar;

var ideasSlideBar;
var clipsSlideBar;
var connectionsSlideBar;

// I have no idea which window sent these events, 
// and therefore no idea which slidebar to update 
// even if I had stored more than one set of them for each window.
jetpack.tabs.onFocus(function(d) {
	updateCoherePlugin();
});

jetpack.tabs.onReady(function(d) {
	updateCoherePlugin();
});

// add styles for highlight colours to all pages 
// THIS IS 'WORK IN PROGRES' AND CURRENTLY DOES NOT WORK
/*var callback = function(document){
	var head = document.getElementsByTagName('head')[0];
	if (head) {
    	$(head).append('<link rel="stylesheet" href="http://cohere.open.ac.uk/jetpack/ui/highlights.css" type="text/css" />');
    }
};
var options = {};
options.matches = ["http://*", "https://*"];
jetpack.pageMods.add(callback, options);*/


/**************** UI ELEMENTS *******************/

/*** STATUS BAR ***/
jetpack.statusBar.append({
    html: (<><![CDATA[
        <style type="text/css">
            .statusbar {
                font-family: Tahoma, verdana, arial, helvetica; 
                font-size: 11px;
                height: 20px;
                width: 35px;
                vertical-align: middle;
                padding: 0px;
                margin: 0px;
            }
            .statuslabel{
            	text-align: middle;
                vertical-align: top;
            }
        </style>
        <div id='ideastatusbar' class="statusbar">
 			<label id='cohere-idea-status' class='statuslabel' title='Number of Cohere ideas on this webpage'> 0 </label>               
            <img id='cohere-idea-status-img' src='http://cohere.open.ac.uk/jetpack/ui/images/lightbulb-16.png' alt='ideas' border='0' title='Cohere ideas' />
        </div>
    	]]></>).toString(),
  	onReady: function(bar) { 
  		// work around until I figure out the multiple windows issue
  		if (ideasStatusBar == null) {
	    	ideasStatusBar = bar;   
	    	//As title arrtibute broken in jetpack on the status bar, using notifcations as tooltip for now
	    	var statusbar = bar.getElementById('ideastatusbar');
	    	$(statusbar).bind("mouseover", function() {jetpack.notifications.show({title:"Cohere", body:'This shows number of Cohere ideas on this webpage'})} );
	    }
    }
});

jetpack.statusBar.append({
    html: (<><![CDATA[
        <style type="text/css">
          .statusbar {
                font-family: Tahoma, verdana, arial, helvetica; 
                font-size: 11px;
                height: 20px;
                width: 35px;
                vertical-align: middle;
                padding: 0px;
                margin: 0px;
            }
            .statuslabel{
            	text-align: middle;
                vertical-align: top;
            }
        </style>
        <div id="clipstatusbar" class="statusbar">
 			<label id='cohere-clip-status' class='statuslabel' title='Number of Cohere clips on this webpage'> 0 </label>
            <img src='http://cohere.open.ac.uk/jetpack/ui/images/clip.png' border='0' alt='clips' title='Cohere clips' />
        </div>
    	]]></>).toString(),
  	onReady: function(bar) { 
  		// work around until I figure out the multiple windows issue
  		if (clipsStatusBar == null) {
	    	clipsStatusBar = bar;    	
	    	//As title arrtibute broken in jetpack on the status bar, using notifcations as tooltip for now
	    	var statusbar = bar.getElementById('clipstatusbar');
	    	$(statusbar).bind("mouseover", function() {jetpack.notifications.show({title:"Cohere", body:'This shows number of Cohere clips on this webpage'})} );
	    }
    }
});

jetpack.statusBar.append({
    html: (<><![CDATA[
        <style type="text/css">
          .statusbar {
                font-family: Tahoma, verdana, arial, helvetica; 
                font-size: 11px;
                height: 20px;
                width: 35px;
                vertical-align: middle;
                padding: 0px;
                margin: 0px;
            }
            .statuslabel{
            	text-align: middle;
                vertical-align: top;
            }
        </style>
        <div id='connstatusbar' class="statusbar">
	 		<label id='cohere-conn-status' class='statuslabel' title='Number of Cohere connections on this webpage'> 0 </label>
            <img src='http://cohere.open.ac.uk/jetpack/ui/images/3-connections-16px.png' border='0' alt='connections' title='Cohere connections'/>
        </div>
    	]]></>).toString(),
  	onReady: function(bar) { 
  		// work around until I figure out the multiple windows issue
  		if (connectionsStatusBar == null) {
	    	connectionsStatusBar = bar;    	
	    	//As title arrtibute broken in jetpack on the status bar, using notifcations as tooltip for now
	    	var statusbar = bar.getElementById('connstatusbar');
	    	$(statusbar).bind("mouseover", function() {jetpack.notifications.show({title:"Cohere", body:'This shows number of Cohere connections on this webpage'})} );
	    }
    }
});

/*** SIDEBARS ****/
jetpack.slideBar.append({
  	icon: "http://cohere.open.ac.uk/jetpack/ui/images/lightbulb-16.png",
	width: TAB_IDEA_WIDTH,
  	persist: true,
  	html: (<><![CDATA[
        <style type="text/css">
            .coheretooltip {
                border:1px solid gray;
                padding: 3px;
                font-family: arial;
                font-size: 10pt;
                background-color: #FFFED9;
                width:150;
                position: absolute;
                top: 5px;
                left: 10px;
                display: none;
            }
            .coherewrapper {
            	overflow: visible;
            	width: 300px;
            	height: 99%;
            	border: 1px solid gray;
            }
            .coherecountbar {
            	padding: 4px; 
            	border-bottom: 1px solid gray; 
            	background-color: white;
            }
            .coherecountlabel {
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 12px;
            }
            .coherecounturl {
            	background-color: #E9F3F3;
            	border: 1px solid gray; 
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 12px;
            }
            .cohereselectionbar {
            	margin: 4px;
            }
            .cohereslidelist {
            	width: 300px; 
            	height: 90%; 
            	overflow: auto; 
            	background: transparent; 
            	border-top: 1px solid gray
            }
             .selectlabel { 
             	font-family: Tahoma, verdana, arial, helvetica;
				font-size: 10pt;
				margin: 3px;	   			
				background-color: transparent;		
            }
         </style>
		<div id='cohere-ideas-tooltip' class='coheretooltip'></div>
		<div id='cohere-ideas-wrapper' class='coherewrapper'>
	 		<div id='cohere-idea-count' class='coherecountbar'>
	 			<label id='cohere-idea-count-label' class='coherecountlabel'>Ideas found for: </label>
	 			<input id='cohere-idea-count-field' class='coherecounturl' type='text' size='30' value='' readonly></input>
	 		</div>
	 		<div id='cohere-idea-selectiondiv' class='cohereselectionbar'></div>
	 		<div id='cohere-ideas-sidelist' class='cohereslidelist'></div>
		</div>  			
		]]></>).toString(),  	
  	onReady: function(slide) {
  		// work around until I figure out the multiple windows issue
  		if (ideasSlideBar == null) {
 			ideasSlideBar = slide;
			addIdeasSelectionMenu(slide);
		}
	},		
});

jetpack.slideBar.append({
	icon: "http://cohere.open.ac.uk/jetpack/ui/images/clip.png",
  	html: (<><![CDATA[
        <style type="text/css">
            .coheretooltip {
                border:1px solid gray;
                padding: 3px;
                font-family: arial;
                font-size: 10pt;
                background-color: #FFFED9;
                width:150;
                position: absolute;
                top: 5px;
                left: 10px;
                display: none;
            }
            .coherewrapper {
            	overflow: visible;
            	width: 300px;
            	height: 99%;
            	border: 1px solid gray;
            }
            .coherecountbar {
            	padding: 4px; 
            	border-bottom: 1px solid gray; 
            	background-color: white;
            }
            .coherecountlabel {
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 12px;
            }
            .coherecounturl {
            	background-color: #FAF0F6;
            	border: 1px solid gray; 
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 12px;
            }
            .cohereselectionbar {
            	margin: 4px;
            }
            .cohereslidelist {
            	width: 300px; 
            	height: 90%; 
            	overflow: auto; 
            	background: transparent; 
            	border-top: 1px solid gray
            }
            .selectlabel { 
             	font-family: Tahoma, verdana, arial, helvetica;
				font-size: 10pt;
				margin: 3px;	   			
				background-color: transparent;		
            }
        </style>
  		<div id='cohere-clips-tooltip' class='coheretooltip'></div>
  		<div id='cohere-clips-wrapper' class='coherewrapper'>
  			<div id='cohere-clip-count' class='coherecountbar'>
  				<label id='cohere-clip-count-label' class='coherecountlabel'>Clips found for: </label>
  				<input id='cohere-clip-count-field' class='coherecounturl' type='text' size='30' value='' readonly></input>
			</div>
			<div id='cohere-clip-selectiondiv' class='cohereselectionbar'></div>
  			<div id='cohere-clips-sidelist' class='cohereslidelist'></div>
  		</div>  	
  		]]></>).toString(),
  	persist: true,
  	width: TAB_CLIP_WIDTH,
  	onReady: function(slide) { 
  		// work around until I figure out the multiple windows issue
  		if (clipsSlideBar == null) {
			clipsSlideBar = slide;
			addClipsSelectionMenu(slide);
			
			var dropzone = clipsSlideBar.contentDocument.getElementById('cohere-clips-sidelist');
			dropzone.addEventListener("drop", function (e) { return processClipDrop(e) } , false);
			dropzone.addEventListener("dragenter", function (e) { e.preventDefault(); return false } , false);
			dropzone.addEventListener("dragover", function (e) { e.preventDefault(); return false } , false);
		}
  	},
});

jetpack.slideBar.append({
  	icon: "http://cohere.open.ac.uk/jetpack/ui/images/3-connections-16px.png",
  	html: (<><![CDATA[ 	
         <style type="text/css">
            .coheretooltip {
                border:1px solid gray;
                padding: 3px;
                font-family: arial;
                font-size: 10pt;
                background-color: #FFFED9;
                width:150;
                position: absolute;
                top: 5px;
                left: 10px;
                display: none;
            }
            .coherewrapper {
            	overflow: visible;
            	width: 470px;
            	height: 99%;
            	border: 1px solid gray;
            }
            .coherecountbar {
            	padding: 4px; 
            	border-bottom: 1px solid gray; 
            	background-color: white;
            }
            .coherecountlabel {
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 12px;
            }
            .coherecounturl {
            	background-color: #E9F3F3;
            	border: 1px solid gray; 
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 12px;
            }
            .cohereselectionbar {
            	margin: 4px;
            }
            .cohereslidelist {
            	width: 470px; 
            	height: 90%; 
            	overflow: auto; 
            	background: transparent; 
            	border-top: 1px solid gray;
            }
            .cohereflash {
            	width: 404px; 
            	height: 400px; 
            	overflow: visible; 
            	background: transparent; 
            	margin:0px;
            	padding:0px;
            }
            .cohereflashframe {
            	width: 410px; 
            	height: 400px; 
            	margin:0px;
            	padding:0px;
            	overflow: auto; 
            	border: none;
            }
            .selectlabel { 
             	font-family: Tahoma, verdana, arial, helvetica;
				font-size: 10pt;
				margin: 3px;	   			
				background-color: transparent;		
            }
        </style>
  		<div id='cohere-connections-tooltip' class='coheretooltip'></div>
  		<div id='cohere-connections-wrapper' class='coherewrapper'>
	  		<div id='cohere-connection-count' class='coherecountbar'>
	  			<label id='cohere-connection-count-label' class='coherecountlabel'>Connections found for: </label>
	  			<input id='cohere-connection-count-field' class='coherecounturl' type='text' size='30' value='' readonly></input>
	  		</div>
	  		<div id='cohere-connection-selectiondiv' class='cohereselectionbar'></div>
	  		<div id='cohere-connections-sidelist' class='cohereslidelist'></div>
	  		<!-- div id='cohere-connections-flash' class='cohereflash'>
	  			<iframe id="flashframe" class="cohereflashframe" src="http://cohere.open.ac.uk/jetpack/ui/quick-connect.php"></iframe>
	  		</div -->
  		</div>
  		]]></>).toString(),
  	width: TAB_CONN_WIDTH,
  	persist: true,
  	onReady: function(slide) {
   		// work around until I figure out the multiple windows issue
  		if ( connectionsSlideBar == null) {
			connectionsSlideBar = slide;
			addConnectionsSelectionMenu(slide);
	
			//resize list panel depending on height		
			//var window = jetpack.tabs.focused.contentWindow;
			//var height = window.screen.availHeight - (300+255);
			//connectionsSlideBar.contentDocument.getElementById('cohere-connections-sidelist').style.height = height;
			
			//addFlashConnections();
		}
  	},
});

/*** TOOLBAR ***/
// MB: to be added when jetpack implements them

/*** MENUS ***/

var coherecontextmenu = new jetpack.Menu([
  {
    label: "Create Clip",
    mnemonic: "p",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/clip.png",
    command: function () cohereMain.createClip(),
  },
  {
    label: "Create Idea",
    mnemonic: "I",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/add.png",
    command: function () cohereMain.createIdea(),
  },
  {
    label: "Create Connection",
    mnemonic: "C",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/connection-16px.png",
    command: function () cohereMain.createConnection(),
  },
]);

var coheremainmenu = new jetpack.Menu([
  {
    label: "Login",
    mnemonic: "l",
    command: function () cohereMain.login(),
  },
  {
    label: "Create Clip",
    mnemonic: "p",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/clip.png",
    command: function () cohereMain.createClip(),
  },
  {
    label: "Create Idea",
    mnemonic: "I",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/add.png",
    command: function () cohereMain.createIdea(),
  },
  {
    label: "Create Connection",
    mnemonic: "C",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/connection-16px.png",
    command: function () cohereMain.createConnection(),
  },
  /*{
    label: "My Cohere",
    mnemonic: "m",
    disabled: true,
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/profile.png",
    command: function () cohereMain.openMyCohere(),
  },*/
  null,
  {
    label: "Cohere Home",
    mnemonic: "h",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/cohere_hourglass16x16.png",
    command: function () cohereMain.openCohere(),
   }
]);

jetpack.menu.tools.add({
  label: "Cohere",
  mnemonic: "o",
  menu: coheremainmenu,
});

jetpack.menu.context.page.add( {
  label: "Cohere",
  mnemonic: "o",
  menu: coherecontextmenu, 
});

/*** UI BUILDER/HELPER METHODS ***/

/**
 * If the current URL of the focus tab is different from the last one checked.
 * Check the users login status and reload all the slidebar data.
 */
function updateCoherePlugin() {	

	var newURL = cohereMain.getURL();

	// Block child window calls
	if(newURL.length >= 32 && newURL.substr(0, 32) == "http://cohere.open.ac.uk/plugin/") {
		return;	
	}

	if(oldTabURL != newURL && newURL != "about:blank" ) {
		oldTabURL = newURL;
		cohereMain.checkLogin();
	} else if (newURL == "about:blank" && oldTabURL != "") {
		clearCohereSidePanel();
	}	 							    		
}

/**
 * Show the given tooltip
 */
function showTooltip(tooltip) {	
	//$(tooltip).fadeIn('slow');
	tooltip.style.display = "block";
}

/**
 * Hide the given tooltip
 */
function hideTooltip(tooltip) {	
	//$(tooltip).fadeOut('slow');
	tooltip.style.display = "none";
}

/**
 * Show / hide tooltips
 */
//MB: work around until title tooltips in slidebars bug is fixed in jetpack
function tooltipToggle(event) {
	var tooltip;
	var width = 0;
	if (this.parentarea == IDEA_TYPE) {
		tooltip = ideasSlideBar.contentDocument.getElementById('cohere-ideas-tooltip');
		width = TAB_IDEA_WIDTH;
	} else if (this.parentarea == CLIP_TYPE) {
		tooltip = clipsSlideBar.contentDocument.getElementById('cohere-clips-tooltip');
		width = TAB_CLIP_WIDTH;
	} else if (this.parentarea == CONN_TYPE){
		tooltip = connectionsSlideBar.contentDocument.getElementById('cohere-connections-tooltip');
		width = TAB_CONN_WIDTH;
	}
	
	if (tooltip) {
		if (event.type == 'mouseover' && this.title && this.title != "") {
			if (event.clientX+10+150 > width) {
				tooltip.style.left = (event.clientX-10) - 150;
			} else {
				tooltip.style.left = event.clientX+10;
			}
			// MB: how to detect height of slidebar and 
			// make sure does not go off page below?
			tooltip.style.top = event.clientY+5;
			tooltip.innerHTML = this.title;

			setTimeout(function(){showTooltip(tooltip)}, 1000);
			setTimeout(function(){hideTooltip(tooltip)}, 4000);
		} else if (event.type == 'mouseout'){
			tooltip.style.display = "none";
			tooltip.innerHTML = "";
		}
	}
}

/**
 * FlashConnections Movie
 */
function addFlashConnections() {

	var newRequestBase = cohereMain.getBase();
	var flashMovie = connectionsSlideBar.contentDocument.getElementById('flashMovie');
		
	applet = connectionsSlideBar.contentDocument.createElement('applet');
 	applet.setAttribute('id','Cohere-ConnectionNet');
 	applet.setAttribute('name','Cohere-ConnectionNet');
  	applet.setAttribute('archive', cohereMain.getBase()+'jetpack/hello.jar');
	applet.setAttribute('code','HelloWorld.hello.class');
 	applet.setAttribute('width','300');
 	applet.setAttribute('height','300');
 	applet.setAttribute('mayscript','true');
 	applet.setAttribute('scriptable','true');
 	applet.setAttribute('alt','(Your browser recognizes the APPLET element but does not run the applet.)');
	
	flashMovie.appendChild(applet);
	
	/*var applet = new Element('applet', 
						{	'id':'Cohere-ConnectionNet', 
							'name':'Cohere-ConnectionNet',
							'archive': newRequestBase+'visualize/connectionnetjars/cohere.jar,'+newRequestBase+'visualize/connectionnetjars/prefuse.jar,'+newRequestBase+'visualize/connectionnetjars/plugin.jar',
							'code':'cohere.CohereApplet.class',
							'width':x,
							'height':y,
							'mayscript':true,
							'scriptable': true,
							'alt':'(Your browser recognizes the APPLET element but does not run the applet.)'
						});*/
						
	//flashMovie.appendChild(applet);
	
	/*var fireFoxObject = connectionsSlideBar.contentDocument.createElement('embed');
  	fireFoxObject.setAttribute('type','application/x-shockwave-flash');
 	fireFoxObject.setAttribute('src',newRequestBase+"jetpack/LiteMap.swf");
 	fireFoxObject.setAttribute('width','300');
 	fireFoxObject.setAttribute('height','300');
 	fireFoxObject.setAttribute('allowscriptaccess','always');
 	fireFoxObject.setAttribute('name','Cohere-FlashConnectionNet');
	
	flashMovie.appendChild(fireFoxObject);*/
	
	/*fireFoxObject = connectionsSlideBar.contentDocument.createElement('object');
  	fireFoxObject.setAttribute('type','application/x-shockwave-flash');
 	fireFoxObject.setAttribute('data',newRequestBase+"jetpack/LiteMap.swf");
 	fireFoxObject.setAttribute('name','Cohere-FlashConnectionNet');
 	fireFoxObject.setAttribute('allowscriptaccess','always');
 	fireFoxObject.setAttribute('width','300');
 	fireFoxObject.setAttribute('height','300'); 	
 	flashMovie.appendChild(fireFoxObject);

	var ffParam2 = document.createElement('param');
 	ffParam2.setAttribute('name','allowfullscreen');
 	ffParam2.setAttribute('value','true');

	var ffParam3 = document.createElement('param');
 	ffParam3.setAttribute('name','allowscriptaccess');
 	ffParam3.setAttribute('value','always');

	fireFoxObject.appenChild(ffParam2);
	fireFoxObject.appenChild(ffParam3);*/
	
	//checkIsActive();
}

/*function checkIsActive() {
	try {
		if (applet.isActive()) {
			jetpack.tabs.focused.contentWindow.alert("LOADED");		    
		} 
	} catch(e) { 
	      setTimeout(checkIsActive, 1000);	      
    }
}*/


/**
 * Create ideas selection toolbar.
 */
function addIdeasSelectionMenu(slide) {
	var doc = slide.contentDocument;
	var selectionmenu = doc.getElementById('cohere-idea-selectiondiv');
	
	if (selectionmenu) {
	    selectionmenu.appendChild(createSelectionLabel(doc, 'Select: '));

		var allitem = createSelectionButton(doc, 'cohere-idea-selectall-btn', 'All');
		$(allitem).bind("click", selectAllIdeas);	    					
	    selectionmenu.appendChild(allitem);

		var myitem = createSelectionButton(doc, 'cohere-idea-selectmy-btn', 'My');
		if (cohereMain.user && cohereMain.session) {
			myitem.removeAttribute('disabled');
		} else {
			myitem.setAttribute('disabled', 'true');
		}
		$(myitem).bind("click", selectMyIdeas);	    					
	    selectionmenu.appendChild(myitem);

		var proitem = createSelectionButton(doc, 'cohere-idea-selectpro-btn', PRO_TYPE_LABEL);
		proitem.ideatype = PRO_TYPE_LABEL;	
		$(proitem).bind("click", selectIdeasByIdeaType);	    					
	    selectionmenu.appendChild(proitem);

		var conitem = createSelectionButton(doc, 'cohere-idea-selectcon-btn', CON_TYPE_LABEL);
		conitem.ideatype = CON_TYPE_LABEL;	
		$(conitem).bind("click", selectIdeasByIdeaType);	    					
	    selectionmenu.appendChild(conitem);

		var clearitem = createSelectionButton(doc, 'cohere-idea-selectclear-btn', 'Clear');
		$(clearitem).bind("click", clearIdeasSelection);	    					
	    selectionmenu.appendChild(clearitem);	
	}
}

/**
 * Create clips selection toolbar.
 */
function addClipsSelectionMenu(slide) {
	var doc = slide.contentDocument;
	var selectionmenu = doc.getElementById('cohere-clip-selectiondiv');
	
	if (selectionmenu) {
	    selectionmenu.appendChild(createSelectionLabel(doc, 'Select: '));

		var allitem = createSelectionButton(doc, 'cohere-clip-selectall-btn', 'All');
		$(allitem).bind("click", selectAllClips);	    					
	    selectionmenu.appendChild(allitem);

		var myitem = createSelectionButton(doc, 'cohere-clip-selectmy-btn', 'My');
		if (cohereMain.user && cohereMain.session) {
			myitem.removeAttribute('disabled');
		} else {
			myitem.setAttribute('disabled', 'true');
		}
		$(myitem).bind("click", selectMyClips);	    					
	    selectionmenu.appendChild(myitem);

		var clearitem = createSelectionButton(doc, 'cohere-clip-selectclear-btn', 'Clear');
		$(clearitem).bind("click", clearClipsSelection);	    					
	    selectionmenu.appendChild(clearitem);
	
	}
}

/**
 * Create Connection selection toolbar.
 */
function addConnectionsSelectionMenu(slide) {
	var doc = slide.contentDocument;
	var selectionmenu = doc.getElementById('cohere-connection-selectiondiv');
	if (selectionmenu) {
	    selectionmenu.appendChild(createSelectionLabel(doc, 'Select: '));

		var allitem = createSelectionButton(doc, 'cohere-conn-selectall-btn', 'All');
		$(allitem).bind("click", selectAllConnectionIdeas);	    					
	    selectionmenu.appendChild(allitem);

		var myitem = createSelectionButton(doc, 'cohere-conn-selectmy-btn', 'My');
		if (cohereMain.user && cohereMain.session) {
			myitem.removeAttribute('disabled');
		} else {
			myitem.setAttribute('disabled', 'true');
		}
		$(myitem).bind("click", selectMyConnectionIdeas);	    					
	    selectionmenu.appendChild(myitem);

		var proitem = createSelectionButton(doc, 'cohere-conn-selectpro-btn', PRO_TYPE_LABEL);
		proitem.ideatype = PRO_TYPE_LABEL;	
		$(proitem).bind("click", selectConnectionIdeasByIdeaType);	    					
	    selectionmenu.appendChild(proitem);

		var conitem = createSelectionButton(doc, 'cohere-conn-selectcon-btn', CON_TYPE_LABEL);
		conitem.ideatype = CON_TYPE_LABEL;	
		$(conitem).bind("click", selectConnectionIdeasByIdeaType);	    					
	    selectionmenu.appendChild(conitem);

		var clearitem = createSelectionButton(doc, 'cohere-conn-selectclear-btn', 'Clear');
		$(clearitem).bind("click", clearConnectionIdeasSelection);	    					
	    selectionmenu.appendChild(clearitem);	
	}
}

/**
 * Create a button for the selection menus
 */
function createSelectionButton(doc, id, label) {
	var button = doc.createElement("button");
	button.setAttribute('type', 'submit');
	button.setAttribute('id', id);
	var text = doc.createTextNode(label);
	button.appendChild(text);
	button.style.cssFloat = "left";	
	return button;
}

/**
 * Create a divlabel for the selection menus
 */
function createSelectionLabel(doc, label) {
	var labeldiv = doc.createElement("div");
	labeldiv.setAttribute('class', 'selectlabel');
	var text = doc.createTextNode(label);
	labeldiv.appendChild(text);
	labeldiv.style.cssFloat = "left";	
    return labeldiv;
}


/**
 * Reload all the ui elements holding data.
 */
function refreshUI(newURL) {
	//now daisy chained calls
	// ideas will call clips and clips will call connections
	refreshIdeasUI(newURL);
}

/**
 * Reload the ideas tab and drop down ui elements.
 */
function refreshIdeasUI(newURL) {
	clearCohereIdeaTab();	
	addIdeasToUI(newURL);
}

/**
 * Reload the clips tab ui elements.
 */
function refreshClipsUI(newURL) {
	clearCohereClipsTab();	
	addClipsToUI(newURL);
}

/**
 * Reload the connections tab ui elements.
 */
function refreshConnectionsUI(newURL) {			
	clearCohereConnectionsTab();		
	addConnectionsToUI(newURL);
}

/**
 * Clear the ideas and clips tabs out ready for reloading
 */
function clearCohereSidePanel(){
	clearCohereIdeaTab();
	clearCohereClipsTab();
	clearCohereConnectionsTab();
}

/**
 * Clear the ideas tab out ready for reloading
 */
function clearCohereIdeaTab(){	
   	var cohereIdeasCountLabel = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-label');
   	var cohereIdeasCountField = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-field');
   	cohereIdeasCountLabel.innerHTML = "Ideas found for: ";
   	cohereIdeasCountField.value = "";

	var idealist = ideasSlideBar.contentDocument.getElementById('cohere-ideas-sidelist');	
	if (idealist && idealist.hasChildNodes()) {
		while ( idealist.childNodes.length >= 1 ) {
			idealist.removeChild( idealist.firstChild ); 
		}
	}
}

/**
 * Clear the clips tab out ready for reloading
 */
function clearCohereClipsTab(){
   	var cohereClipsCountLabel = clipsSlideBar.contentDocument.getElementById('cohere-clip-count-label');
   	var cohereClipsCountField = clipsSlideBar.contentDocument.getElementById('cohere-clip-count-field');
   	cohereClipsCountLabel.innerHTML = "Clips found for: ";
   	cohereClipsCountField.value = "";			    

	var idealistclips = clipsSlideBar.contentDocument.getElementById('cohere-clips-sidelist');
	if (idealistclips && idealistclips.hasChildNodes()) {
		while ( idealistclips.childNodes.length >= 1 ) {
			idealistclips.removeChild( idealistclips.firstChild ); 
		}
	}
}

/**
 * Clear the connections tab out ready for reloading
 */
function clearCohereConnectionsTab(){	
  	var cohereConnectionsCountLabel = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-label');
	var cohereConnectionsCountField = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-field');
	cohereConnectionsCountLabel.innerHTML = "Connections found for: ";
	cohereConnectionsCountField.value = "";	

	var connectionslist = connectionsSlideBar.contentDocument.getElementById('cohere-connections-sidelist');
	if (connectionslist && connectionslist.hasChildNodes()) {
		while ( connectionslist.childNodes.length >= 1 ) {
			connectionslist.removeChild( connectionslist.firstChild ); 
		}
	}
}

function createErrorMessage(message) {

	var icon = ideasSlideBar.contentDocument.createElement("img");
	toggleButton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/warning.png');

   	var textbox = ideasSlideBar.contentDocument.createElement("div");
	var text = ideasSlideBar.contentDocument.createTextNode(message);
	textbox.appendChild(text);
	textbox.style.margin='3px';
	return textbox;			
}

/**
 * Add the ideas list for this website to the dtoolbar drop down and the side panel
 */
function addIdeasToUI(newURL) {   	
   	var cohereIdeasCountLabel = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-label');
   	var cohereIdeasCountField = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-field');
   	cohereIdeasCountLabel.innerHTML = "0 Ideas found for: ";
   	cohereIdeasCountField.value = newURL;
 	var statuslabel = ideasStatusBar.getElementById('cohere-idea-status');
	statuslabel.innerHTML = "0";

	var newRequestBase = cohereMain.getBase();
	var sidelist = ideasSlideBar.contentDocument.getElementById('cohere-ideas-sidelist');
	var newRequestUrl = newRequestBase + "api/service.php?format=json&method=getnodesbyurl&style=long&url=" + encodeURIComponent(newURL);
	
	//jetpack.tabs.focused.contentWindow.alert("Getting idea data="+newRequestUrl);  							    		
	$.ajax({
	    url: newRequestUrl,
	    type: 'GET',
	    dataType: 'json',
	    timeout: 2000,
	    error: function(request,error){
	     	jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Idea data due to: '+error, icon: WARNING_ICON_GREEN});
 	    	refreshClipsUI(newURL);     
	    },
	    success: function(json){
	    	if(json.error){
      			//json.error[0].message - use this when multi-line notifications available      			 	    	
	     		jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Idea data from Cohere. Sorry.', icon: WARNING_ICON_GREEN});
     			return;
      		}		    
	        var ns = json.nodeset[0];	        
    		if(ns.nodes.length > 0) {    		
       			var count = 0;
   				for(var n = 0; n<ns.nodes.length; n++ ){ 
 					var node = ns.nodes[n].cnode;
 					   					
   					// append to side list
   					if (sidelist) {	      
     					var label = node.name;
   					
   						var mainbox = ideasSlideBar.contentDocument.createElement("div");
 						mainbox.setAttribute('id', "ideamainbox"+node.nodeid);
   						mainbox.style.fontFamily="Tahoma, verdana, arial, helvetica";
						mainbox.style.fontSize='8pt';
    					mainbox.style.borderBottom="2px solid gray"; /*#308D88";*/
    					mainbox.style.paddingTop='3px';
    					mainbox.style.paddingBottom='5px';
    					mainbox.style.paddingLeft='3px';
    					mainbox.style.paddingRight='3px';
    					mainbox.style.background = '#E9F3F3';
    					mainbox.nodeid = node.nodeid;
 						mainbox.addEventListener("drop", function (e) { return processIdeaClipDrop(e, this.nodeid) } , true);
						mainbox.addEventListener("dragenter", function (e) { e.preventDefault(); return false } , false);
						mainbox.addEventListener("dragover", function (e) { e.preventDefault(); return false } , false);  	
 							    				
    					var userbox = ideasSlideBar.contentDocument.createElement("div");
     					
   						var imagebox = ideasSlideBar.contentDocument.createElement("div");
  						imagebox.style.cssFloat = 'left';    
  						 						    					
    					var image = ideasSlideBar.contentDocument.createElement("img");
    					image.setAttribute('border','0');
	     				image.setAttribute('src', newRequestBase+"getupload.php?userid="+node.users[0].user.userid+"&width=50");	
	     				image.userid = node.users[0].user.userid;     				
						$(image).bind("click", cohereShowUserDetails);
	     				image.style.paddingRight = "5px";
						image.style.cursor = 'pointer';
						imagebox.appendChild(image);
						userbox.appendChild(imagebox);

   						var labelbox = ideasSlideBar.contentDocument.createElement("div");
						labelbox.style.cssFloat="left";
						
    					var imagelabel = ideasSlideBar.contentDocument.createElement("label");
    					var text = ideasSlideBar.contentDocument.createTextNode(node.users[0].user.name);
    					imagelabel.appendChild(text);
						imagelabel.style.fontSize='8pt';
						imagelabel.style.color = '#e80074';
						imagelabel.style.cursor = 'pointer';
						imagelabel.style.marginBottom = "3px";
	     				imagelabel.userid = node.users[0].user.userid;     				
						$(imagelabel).bind("click", cohereShowUserDetails);
						labelbox.appendChild(imagelabel);

    					var date = ideasSlideBar.contentDocument.createElement("div");
    					var cDate = new Date(node.creationdate*1000);	 
    					var fDate = dateCode.dateFormat(cDate, "d mmm yyyy"); 	
    					var datetext = ideasSlideBar.contentDocument.createTextNode(fDate);
    					date.appendChild(datetext);
    					date.style.fontSize='8pt';
						labelbox.appendChild(date);
						
 						var connections = ideasSlideBar.contentDocument.createElement("div");
    					var connectionstext = ideasSlideBar.contentDocument.createTextNode("Connections : "+node.connectedness);
    					connections.appendChild(connectionstext);
    					connections.style.fontSize='8pt';
    					connections.style.verticalAlign='bottom';
						labelbox.appendChild(connections);						
						
						userbox.appendChild(labelbox);

  						var nodetypebox = ideasSlideBar.contentDocument.createElement("div");
  						nodetypebox.style.cssFloat = 'right';    						    					
    					var nodetype = ideasSlideBar.contentDocument.createElement("img");
						nodetype.setAttribute('border', '0');
  						nodetype.setAttribute('title', node.role[0].role.name);
 	     				nodetype.setAttribute('src', newRequestBase+node.role[0].role.image);
 	     				nodetype.parentarea = IDEA_TYPE;
						$(nodetype).bind("mouseover", tooltipToggle);	
						$(nodetype).bind("mouseout", tooltipToggle);	
 	     				
						nodetypebox.appendChild(nodetype);
						userbox.appendChild(nodetypebox);

 						mainbox.appendChild(userbox);							 						
 
      					var labelsmall = label;
     					if (labelsmall.length > 100) {
      						labelsmall = label.substring(0, 100)+"..."; 
     					}
 
 						var separator = ideasSlideBar.contentDocument.createElement("div");	
						separator.style.clear="both";								       													     																			     	
						separator.style.borderBottom="1px dashed gray";	
						separator.style.marginTop = "2px";						
 						separator.style.height = "4px";						
 						mainbox.appendChild(separator);
 
    					var textbox = ideasSlideBar.contentDocument.createElement("div");
    					var text = ideasSlideBar.contentDocument.createTextNode(labelsmall);
    					textbox.appendChild(text);
    					textbox.setAttribute('name', 'nodetext');
    					textbox.setAttribute('id', 'nodetext'+node.nodeid);
     					textbox.style.clear="both";
						textbox.style.cursor = 'pointer';
	    				textbox.style.marginTop='3px';
	    				textbox.style.marginBottom='3px';
	    				textbox.nodeid = node.nodeid;
	    				textbox.typename = node.role[0].role.name;
	    				textbox.userid = node.users[0].user.userid;
	    				textbox.label = label;
	    				textbox.cohereHighlight = getHighlightColour(node.users[0].user.userid, node.role[0].role.name);
						$(textbox).bind("click", selectIdea);	    				
						
						mainbox.appendChild(textbox);

	    				if (labelsmall != label) {
	    					textbox.labelsmall = labelsmall;	    				
	    					var morelabel = ideasSlideBar.contentDocument.createElement("label");
   							var text = ideasSlideBar.contentDocument.createTextNode('more');
							morelabel.appendChild(text);
							morelabel.style.fontSize='8pt';
							morelabel.style.color = '#e80074';
							morelabel.style.cursor = 'pointer';
	    					morelabel.style.cssFloat = "left";
	    					morelabel.style.marginBottom = "2px";
	    					morelabel.boxid = 'nodetext'+node.nodeid;
	    					morelabel.type = IDEA_TYPE;
 							$(morelabel).bind("click", cohereMoreText);	    				
							mainbox.appendChild(morelabel);
	    				}
 						
						var ideatoolbar = ideasSlideBar.contentDocument.createElement("div");	
						ideatoolbar.style.clear="both";								       													     																			     	
						ideatoolbar.style.borderTop="1px dashed gray";							
					    mainbox.appendChild(ideatoolbar);	
	     			   	
	     			   	if (node.description && node.description != "") {
	   			   			var descriptionboxhidden = ideasSlideBar.contentDocument.createElement("div");
							descriptionboxhidden.setAttribute('id', 'descbox'+node.nodeid);
	   						descriptionboxhidden.style.background = 'transparent'; 
    						descriptionboxhidden.style.borderTop="1px solid #308D88";
    						descriptionboxhidden.style.paddingTop = "2px;";
	  						descriptionboxhidden.style.display = 'none';
							mainbox.appendChild(descriptionboxhidden);							
	     			   	
 	    					var textboxdesc = ideasSlideBar.contentDocument.createElement("div");
	    					var textdesc = ideasSlideBar.contentDocument.createTextNode(node.description);
 	    					textboxdesc.appendChild(textdesc);
  							textboxdesc.style.padding='3px';
		   					textboxdesc.style.backgroundcolor = 'transparent'; 
							descriptionboxhidden.appendChild(textboxdesc);							

							var descbutton = ideasSlideBar.contentDocument.createElement("img");
							descbutton.setAttribute('id', 'cohere-description-btn');
							descbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-down-green.png');
	   						descbutton.setAttribute('alt', 'View description');
	   						descbutton.setAttribute('title', 'View description');
							descbutton.style.cursor = 'pointer';	   						
							descbutton.style.margin = '3px';	   						
							descbutton.nodeid = node.nodeid;							
  							$(descbutton).bind("click", switchDescriptionVisibility);
  							descbutton.parentarea = IDEA_TYPE;
							$(descbutton).bind("mouseover", tooltipToggle);	
							$(descbutton).bind("mouseout", tooltipToggle);														    				
							ideatoolbar.appendChild(descbutton);
	     			   	}
						
	       				var hasClips = checkForClips(node.urls);
	       				textbox.hasClips = hasClips;
	       				//if (hasClips) {			       				
	       				if (node.urls.length > 0) {			       				
							var mainclipbox = ideasSlideBar.contentDocument.createElement("div");
							mainclipbox.style.width='100%';
							
							mainbox.appendChild(mainclipbox);							
	       					       											
							var toggleButton = ideasSlideBar.contentDocument.createElement("img");
							toggleButton.setAttribute('id', 'cohere-showhide-btn'+node.nodeid);
							if (jumpType == IDEA_TYPE && jumpNode == node.nodeid) {
								toggleButton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-up.png');
							} else { 
								toggleButton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-down.png');
							}
							toggleButton.setAttribute('alt', 'Show/Hide Clips/Websites');
							toggleButton.setAttribute('title', 'Show/Hide Clips/Websites');
							toggleButton.style.cursor = 'pointer';	   						
							toggleButton.style.margin = '3px';	   						
							toggleButton.boxid = 'clipbox'+node.nodeid;
							toggleButton.type = IDEA_TYPE;
 							$(toggleButton).bind("click", switchClippingsVisibility);	    				
 							toggleButton.parentarea = IDEA_TYPE;
							$(toggleButton).bind("mouseover", tooltipToggle);	
							$(toggleButton).bind("mouseout", tooltipToggle);														    				
						    
							ideatoolbar.appendChild(toggleButton);

		       				var clipboxhidden = ideasSlideBar.contentDocument.createElement("div");
							if (jumpType == IDEA_TYPE && jumpNode == node.nodeid) {
		   						clipboxhidden.style.display = 'block';
							} else {
	   							clipboxhidden.style.display = 'none';								
							}
							clipboxhidden.setAttribute('id', 'clipbox'+node.nodeid);
	   						clipboxhidden.style.clear = "both";
		   					clipboxhidden.style.background = '#E9F3F3'; 
 				 			mainclipbox.appendChild(clipboxhidden);	 				 		
 				 		
		     				for(var i = 0; i<node.urls.length; i++ ){
	 	     					var label2 = node.urls[i].url.clip;
		     				
			       				var mainbox3 = ideasSlideBar.contentDocument.createElement("div");
	 	    					mainbox3.style.borderTop="1px solid #308D88";
			   					mainbox3.style.paddingTop='3px';
			   					mainbox3.style.paddingBottom='5px';
			   					mainbox3.style.paddingLeft='3px';
			   					mainbox3.style.paddingRight='3px';
			   					mainbox3.style.background = CLIP_BACKGROUND_COLOR; 
      					
      							var title = ideasSlideBar.contentDocument.createElement("div");
      							title.style.overflow = "hidden";
      							title.style.fontWeight="bold";
      							if (node.urls[i].url.url == newURL) {
      								var titletext;
      								if (label2 != "") {
		    							titletext = ideasSlideBar.contentDocument.createTextNode("clip source: current page");
		    						} else {	
		    							titletext = ideasSlideBar.contentDocument.createTextNode("page source: current page");
		    						}
		    						title.appendChild(titletext);
      					 		} else {
      					 			var url = node.urls[i].url.title;
      					 			if (url.length > 30)
      					 				url = url.substring(0, 30)+"..."; 
		    						var titletext;
		    						if (label2 != "") {		    						
		    							title.label = label2;		    							
		    							titletext = ideasSlideBar.contentDocument.createTextNode("clip source: "+url);
		    						} else {
		    							titletext = ideasSlideBar.contentDocument.createTextNode("page source: "+url);
		    						}
		    						title.appendChild(titletext);
									title.url = node.urls[i].url.url;
									title.nodeid = node.nodeid;
									title.clipid = node.urls[i].url.urlid;
									title.type = IDEA_TYPE;
									$(title).bind("click", jumpToURL);	
      					 		}
      					 		mainbox3.appendChild(title);

	      						if (label2 != "") {
		 	    					var textbox2 = ideasSlideBar.contentDocument.createElement("div");
			    					var text2 = ideasSlideBar.contentDocument.createTextNode(label2);
		 	    					textbox2.appendChild(text2);
				   					textbox2.setAttribute('id', 'ideaclip'+node.urls[i].url.urlid);	
				   					textbox2.setAttribute('name', 'ideaclip'+node.nodeid);	
									textbox2.style.cursor = 'pointer';
    								textbox2.style.paddingTop='2px';
				   					textbox2.style.backgroundcolor = 'transparent'; 
		 	    					textbox2.label = label2;
    								textbox2.userid = node.urls[i].url.user[0].user.userid;
				   					textbox2.cohereHighlight = getHighlightColour(node.urls[i].url.user[0].user.userid, node.role[0].role.name);					   										   					
	      							if (node.urls[i].url.url == newURL) {
 											$(textbox2).bind("click", selectClip);	
 										} else {
 											textbox2.url = node.urls[i].url.url;
 											textbox2.nodeid = node.nodeid;
 											textbox2.clipid = node.urls[i].url.urlid;
 											textbox2.type = IDEA_TYPE;
 											$(textbox2).bind("click", jumpToURL);	
 										}    				
			    					
			    					mainbox3.appendChild(textbox2);   					
								}
																															
								clipboxhidden.appendChild(mainbox3);									
	    					}
						}
																	     		
						var editbutton = ideasSlideBar.contentDocument.createElement("img");
						editbutton.setAttribute('id', 'cohere-editidea-btn');
						editbutton.setAttribute('alt', 'Edit');
						editbutton.setAttribute('title', 'Edit this Idea');
 						editbutton.style.margin = '3px';	  
   			   			if (cohereMain.user && cohereMain.session 
								&& cohereMain.user == node.users[0].user.userid 
									&& node.otheruserconnections && node.otheruserconnections == 0) {															
							editbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/edit.png');
							editbutton.setAttribute('title', 'Edit this Idea');
							editbutton.style.cursor = 'pointer';	   						
							editbutton.nodeid = node.nodeid; 						
							$(editbutton).bind("click", cohereEditIdea);	    				
						} else {
							editbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/edit-disabled.png');
							if (node.otheruserconnections && node.otheruserconnections > 0)	{														
								editbutton.setAttribute('title', 'This idea cannot be edited as it has 1+ connections by other people');
							} else {
								editbutton.setAttribute('title', 'If you are the creator, login to Edit this Idea');
							}
						}
 	     				editbutton.parentarea = IDEA_TYPE;
						$(editbutton).bind("mouseover", tooltipToggle);	
						$(editbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(editbutton);

						var deletebutton = ideasSlideBar.contentDocument.createElement("img");
						deletebutton.setAttribute('id', 'cohere-deleteidea-btn');
						deletebutton.setAttribute('alt', 'Delete');
   			   			if (cohereMain.user && cohereMain.session 
								&& cohereMain.user == node.users[0].user.userid 
									&& node.otheruserconnections && node.otheruserconnections == 0) {															
							deletebutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/delete.png');
							deletebutton.setAttribute('title', 'Delete this Idea and its connections');
							deletebutton.style.cursor = 'pointer';	   						
							deletebutton.nodeid = node.nodeid;
							deletebutton.label = label;	
 							$(deletebutton).bind("click", cohereDeleteIdea);	    				
						} else {
							deletebutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/delete-disabled.png');							
							if (node.otheruserconnections && node.otheruserconnections > 0)	{														
								deletebutton.setAttribute('title', 'This idea cannot be deleted as it has 1+ connections by other people');
							} else {
								deletebutton.setAttribute('title', 'If you are the creator, login to Delete this Idea');
							}
						}
						deletebutton.style.margin = '3px';	   				
 	     				deletebutton.parentarea = IDEA_TYPE;
						$(deletebutton).bind("mouseover", tooltipToggle);	
						$(deletebutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(deletebutton);
						
						var toolbarbutton = ideasSlideBar.contentDocument.createElement("img");
						toolbarbutton.setAttribute('id', 'cohere-add-clip-btn');
						toolbarbutton.setAttribute('alt', 'Add Clip');
   			   			if (cohereMain.user && cohereMain.session 
								&& cohereMain.user == node.users[0].user.userid) {
							toolbarbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/clip.png');
							toolbarbutton.setAttribute('title', 'Add selected text as Clip on this idea');
							toolbarbutton.style.cursor = 'pointer';	   						
							toolbarbutton.nodeid = node.nodeid;
 							$(toolbarbutton).bind("click", addNewClipToIdea);	
						} else {
							toolbarbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/clip-disabled.png');
							toolbarbutton.setAttribute('title', 'If you are to creator, login to Add selected text as Clip on this idea');
						}
						toolbarbutton.style.margin = '3px';	   						
 	     				toolbarbutton.parentarea = IDEA_TYPE;
						$(toolbarbutton).bind("mouseover", tooltipToggle);	
						$(toolbarbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(toolbarbutton);
   			   		     
     			   		var bookmark = ideasSlideBar.contentDocument.createElement("img");
						bookmark.setAttribute('id', 'cohere-bookmark-btn');
						bookmark.setAttribute('alt', 'Bookmark');
    			   		if (cohereMain.user && cohereMain.session) { 
							bookmark.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/favorites.png');
							bookmark.setAttribute('title', 'Bookmark this idea');
							bookmark.style.cursor = 'pointer';	   						
							bookmark.nodeid = node.nodeid;
							bookmark.label = label;
	  						$(bookmark).bind("click", bookmarkIdea);	    				
						} else {
							bookmark.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/favorites-disabled.png');
							bookmark.setAttribute('title', 'Login to Bookmark this idea');
						}
						bookmark.style.margin = '3px';	   						
 	     				bookmark.parentarea = IDEA_TYPE;
						$(bookmark).bind("mouseover", tooltipToggle);	
						$(bookmark).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(bookmark);
    			   		     
						var newconbutton = ideasSlideBar.contentDocument.createElement("img");
						newconbutton.setAttribute('id', 'cohere-newconnection-btn');
						newconbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/connection-16px.png');
						newconbutton.setAttribute('alt', 'Connect');
    			   		if (cohereMain.user && cohereMain.session) { 
							newconbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/connection-16px.png');
							newconbutton.setAttribute('title', 'Connect to another Idea');
							newconbutton.style.cursor = 'pointer';	   						
							newconbutton.nodeid = node.nodeid;
							newconbutton.label = label;
							newconbutton.role = node.role[0].role.name;
		  					$(newconbutton).bind("click", cohereShowNewConnection);	    				
						} else {
							newconbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/connection-16px-disabled.png');
							newconbutton.setAttribute('title', 'Login to Connect to another Idea');
						}
						newconbutton.style.margin = '3px';	   						
 	     				newconbutton.parentarea = IDEA_TYPE;
						$(newconbutton).bind("mouseover", tooltipToggle);	
						$(newconbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(newconbutton);
	
						var neighbourhoodbutton = ideasSlideBar.contentDocument.createElement("img");
						neighbourhoodbutton.setAttribute('id', 'cohere-neighbourhood-btn');
						neighbourhoodbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/neighbourhood-16px.png');
	  					neighbourhoodbutton.setAttribute('title', 'Neighbourhood');
	   					neighbourhoodbutton.setAttribute('alt', 'View Network Neighbourhood');
						neighbourhoodbutton.style.cursor = 'pointer';	   						
						neighbourhoodbutton.style.margin = '3px';	 
						neighbourhoodbutton.nodeid = node.nodeid;  						
	 					$(neighbourhoodbutton).bind("click", cohereShowNeighbourhood);	    				
 	     				neighbourhoodbutton.parentarea = IDEA_TYPE;
						$(neighbourhoodbutton).bind("mouseover", tooltipToggle);	
						$(neighbourhoodbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(neighbourhoodbutton);		
											
						sidelist.appendChild(mainbox);
    				}  			
    			}
    		} else {
 				//var cohereTabber = ideasSlideBar.contentDocument.getElementById('cohereTabs');
				//cohereTabber.selectedIndex = TAB_CLIPS;
    		}
    		 
 	    	var cohereIdeasCountLabel = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-label');
 	    	var cohereIdeasCountField = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-field');
 	    	cohereIdeasCountLabel.innerHTML = ns.nodes.length+" Ideas found for: ";
 	    	cohereIdeasCountField.value = newURL;
 	    	
	    	statuslabel.innerHTML = ns.nodes.length;
 	    	
  	    	if (jumpType == IDEA_TYPE && jumpClip && jumpClip != "") { 	    	
 	    		var clip = ideasSlideBar.contentDocument.getElementById('ideaclip'+jumpClip);
 	    		clip.previousSibling.scrollIntoView(true);
 	    		clearAllSelections();
   				highlightSearchTerms([clip], false); 	    		
				
				jumpType = null;
				jumpNode = null;
				jumpClip = null;
	    	} 	    	
 	    	refreshClipsUI(newURL);     
	    } 	    
	});	
}

/**
 * Add the clips for this website to the side panel
 */
function addClipsToUI(newURL) {
   	var cohereClipsCountLabel = clipsSlideBar.contentDocument.getElementById('cohere-clip-count-label');
   	var cohereClipsCountField = clipsSlideBar.contentDocument.getElementById('cohere-clip-count-field');
   	cohereClipsCountLabel.innerHTML = "0 Clips found for: ";
   	cohereClipsCountField.value = newURL;			    
	var statuslabel = clipsStatusBar.getElementById('cohere-clip-status');
	statuslabel.innerHTML = "0";

	var sidelistclips = clipsSlideBar.contentDocument.getElementById('cohere-clips-sidelist');
   	if (sidelistclips) {	     
		var newRequestBase = cohereMain.getBase();
		var newRequestUrl = newRequestBase + "api/service.php?format=json&method=getclipsbyurl&url="+encodeURIComponent(newURL);

		$.ajax({
		    url: newRequestUrl,
		    type: 'GET',
		    dataType: 'json',
		    timeout: 2000,
		    error: function(request,error){
		    	jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Clip data due to: '+error, icon: WARNING_ICON_GREEN});
	    		refreshConnectionsUI(newURL);	     		    		    
		    },
		    success: function(json){
		    	if(json.error){
      				//json.error[0].message - use this when multi-line notifications available
      				jetpack.tabs.focused.contentWindow.alert(json.error[0].message);
		    		jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Clip data from Cohere. Sorry.', icon: WARNING_ICON_GREEN});
	      			return;
	      		}		    
		        var us = json.urlset[0];
	    		if(us.urls.length > 0){	 	    		       	
	   				for(var n = 0; n<us.urls.length; n++ ){
     					var label = us.urls[n].url.clip;
   						var userid = us.urls[n].url.user[0].user.userid;
   						
   						var mainbox = clipsSlideBar.contentDocument.createElement("div");
   						mainbox.style.fontFamily="Tahoma, verdana, arial, helvetica";
						mainbox.style.fontSize='8pt';
    					mainbox.style.borderBottom="2px solid gray";
    					mainbox.style.paddingTop='3px';
    					mainbox.style.paddingBottom='5px';
    					mainbox.style.paddingLeft='3px';
    					mainbox.style.paddingRight='3px';
    					mainbox.style.background = CLIP_BACKGROUND_COLOR; 

    					var userbox = clipsSlideBar.contentDocument.createElement("div");
     					userbox.style.marginBottom="3px";
     						    			
	       				var imagebox = clipsSlideBar.contentDocument.createElement("div");
						imagebox.style.cssFloat = 'left';
     						    					
    					var image = clipsSlideBar.contentDocument.createElement("img");
	     				image.setAttribute('src', newRequestBase+"getupload.php?userid="+userid+"&width=50");
	     				image.setAttribute('border', '0');
	     				image.style.paddingRight = "5px";
	     				image.userid = userid;
   						$(image).bind("click", cohereShowUserDetails);	    				
						imagebox.appendChild(image);

						userbox.appendChild(imagebox);

   						var labelbox = clipsSlideBar.contentDocument.createElement("div");
						labelbox.style.cssFloat = 'left';
						
    					var imagelabel = clipsSlideBar.contentDocument.createElement("label");
    					var text = clipsSlideBar.contentDocument.createTextNode(us.urls[n].url.user[0].user.name);
    					imagelabel.appendChild(text);
						imagelabel.style.fontSize='8pt';
						imagelabel.style.color = '#e80074';
						imagelabel.style.cursor = 'pointer';
						imagelabel.userid = userid;
   						$(imagelabel).bind("click", cohereShowUserDetails);	    				
						labelbox.appendChild(imagelabel);

    					var date = clipsSlideBar.contentDocument.createElement("div");
    					var cDate = new Date(us.urls[n].url.creationdate*1000);	 
    					var fDate = dateCode.dateFormat(cDate, "d mmm yyyy"); 	
    					var datetext = clipsSlideBar.contentDocument.createTextNode(fDate);
    					date.appendChild(datetext);
    					date.style.fontSize='8pt';
						labelbox.appendChild(date);
						
 						var connections = clipsSlideBar.contentDocument.createElement("div");
    					var connectionstext = clipsSlideBar.contentDocument.createTextNode("Ideas : "+us.urls[n].url.ideacount);
    					connections.appendChild(connectionstext);
    					connections.style.fontSize='8pt';
    					connections.style.verticalAlign='bottom';
						labelbox.appendChild(connections);						
						
						userbox.appendChild(labelbox);
						 	     				
						var deleteClipButton = clipsSlideBar.contentDocument.createElement("img");
						deleteClipButton.setAttribute('id', 'cohere-delete-clip-btn');
						deleteClipButton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/delete.png');
						deleteClipButton.setAttribute('alt', 'Delete');
						if (cohereMain.user && cohereMain.session 
							&& cohereMain.user == userid) {													
							deleteClipButton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/delete.png');
							deleteClipButton.setAttribute('title', 'Delete this clip');
	 						deleteClipButton.style.cursor = 'pointer';	   						
							deleteClipButton.clipid = us.urls[n].url.urlid;
							deleteClipButton.clipname = label;			
	  						$(deleteClipButton).bind("click", deleteClip);	    				
						} else {
							deleteClipButton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/delete-disabled.png');
							deleteClipButton.setAttribute('title', 'If you are the creator, login to Delete this clip');
						}
						deleteClipButton.parentarea = CLIP_TYPE;
						$(deleteClipButton).bind("mouseover", tooltipToggle);	
						$(deleteClipButton).bind("mouseout", tooltipToggle);	
						
						deleteClipButton.style.cssFloat = "right";
						deleteClipButton.style.margin = '3px';	   			
						userbox.appendChild(deleteClipButton);

						var addToIdeaButton = clipsSlideBar.contentDocument.createElement("img");
						addToIdeaButton.setAttribute('id', 'cohere-addtoidea-clip-btn');
						addToIdeaButton.setAttribute('alt', 'Add to Idea');
						if (cohereMain.user && cohereMain.session 
							&& cohereMain.user == userid) {													
							addToIdeaButton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/add-an-idea.png');
							addToIdeaButton.setAttribute('title', 'Add this clip to an Idea');
							addToIdeaButton.style.cursor = 'pointer';	   						
	 						addToIdeaButton.clipid = us.urls[n].url.urlid;
	 						addToIdeaButton.clipname = label;
	  						$(addToIdeaButton).bind("click", addClipToIdea);	    				
						} else {
							addToIdeaButton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/add-an-idea-disabled.png');
							addToIdeaButton.setAttribute('title', 'If you are the creator, login to Add this clip to an Idea');
						}
						addToIdeaButton.parentarea = CLIP_TYPE;
						$(addToIdeaButton).bind("mouseover", tooltipToggle);	
						$(addToIdeaButton).bind("mouseout", tooltipToggle);	
						addToIdeaButton.style.cssFloat = "right";
						addToIdeaButton.style.margin = '3px';	   						
						userbox.appendChild(addToIdeaButton);

 						mainbox.appendChild(userbox);

						var separator = clipsSlideBar.contentDocument.createElement("div");	
						separator.style.clear="both";								       													     																			     	
						separator.style.borderBottom="1px dashed gray";	
						separator.style.marginTop = "2px";						
 						separator.style.height = "4px";						
 						mainbox.appendChild(separator);

      					var labelsmall = label;
     					if (labelsmall.length > 100) {
     						labelsmall = label.substring(0, 100)+"..."; 
     					}

    					var textbox = clipsSlideBar.contentDocument.createElement("div");
    					var text = clipsSlideBar.contentDocument.createTextNode(labelsmall);
    					textbox.appendChild(text);
					   	textbox.setAttribute('id', 'clip'+us.urls[n].url.urlid);						   					 	    					
					   	textbox.setAttribute('name', 'clipnodetext');						   					 	    					
    					textbox.style.clear="both";
 						textbox.style.cursor = 'pointer';
	    				textbox.style.paddingTop='4px';
	    				textbox.style.paddingBottom='3px';
	    				textbox.label = label;
	    				textbox.userid = userid;
    					textbox.cohereHighlight = getHighlightColour(userid, "");					   										   					    					    					
   						$(textbox).bind("click", selectClip);	    				
 						mainbox.appendChild(textbox);
 						
	    				if (labelsmall != label) {
	    					textbox.labelsmall = labelsmall;	    				
	    					var morelabel = clipsSlideBar.contentDocument.createElement("label");
   							var text = clipsSlideBar.contentDocument.createTextNode('more');
							morelabel.appendChild(text);
							morelabel.style.fontSize='8pt';
							morelabel.style.color = '#e80074';
							morelabel.style.cursor = 'pointer';
	    					morelabel.style.marginBottom = "2px";
	    					morelabel.boxid = 'clip'+us.urls[n].url.urlid;
	    					morelabel.type = CLIP_TYPE;
 							$(morelabel).bind("click", cohereMoreText);	    				
							mainbox.appendChild(morelabel);
	    				}
							
						sidelistclips.appendChild(mainbox);
     				}  			
 	    		} else {
 					//var cohereTabber = clipsSlideBar.contentDocument.getElementById('cohereTabs');
					//cohereTabber.selectedIndex = TAB_IDEAS;
 	    		} 
		    	var cohereClipsCountLabel = clipsSlideBar.contentDocument.getElementById('cohere-clip-count-label');
		   		var cohereClipsCountField = clipsSlideBar.contentDocument.getElementById('cohere-clip-count-field');
		   		cohereClipsCountLabel.innerHTML = us.urls.length+" Clips found for: ";
		   		cohereClipsCountField.value = newURL;	

 				statuslabel.innerHTML = +us.urls.length;
	    		
	    		refreshConnectionsUI(newURL);	     		    		    
		    } 		    		     	    		
 		});	
	}	
}

/**
 * Add the connections list for this website to the side panel
 */
function addConnectionsToUI(newURL) {
  	var cohereConnectionsCountLabel = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-label');
	var cohereConnectionsCountField = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-field');
	cohereConnectionsCountLabel.innerHTML = "0 Connections found for: ";
	cohereConnectionsCountField.value = newURL;	
	var statuslabel = connectionsStatusBar.getElementById('cohere-conn-status');
	statuslabel.innerHTML = "0";
	
	var sidelistcons = connectionsSlideBar.contentDocument.getElementById('cohere-connections-sidelist');
   	if (sidelistcons) {	     
		var newRequestBase = cohereMain.getBase();	
		var newRequestUrl = newRequestBase + "api/service.php?format=json&method=getconnectionsbyurl&style=long&url=" + encodeURIComponent(newURL);	
		$.ajax({
		    url: newRequestUrl,
		    type: 'GET',
		    dataType: 'json',
		    timeout: 2000,
		    error: function(request,error){
		    	jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Connection data due to: '+error, icon: WARNING_ICON_GREEN});
		    },
		    success: function(json){
		    	if(json.error){
      				//json.error[0].message - use this when multi-line notifications available
	      			jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Connection data from Cohere. Sorry.', icon: WARNING_ICON_GREEN});	      			
	      			return;
	      		}
		        var cons = json.connectionset[0];
		        var count = cons.connections.length;
	    		if(cons.connections.length > 0){
	   				for(var n=0; n<cons.connections.length; n++ ){
	   				
	   					var connection = cons.connections[n].connection;
	   					var fromnode = connection.from[0].cnode;
	   					var tonode = connection.to[0].cnode;
	   					var fromrole = connection.fromrole[0].role;
	   					var torole = connection.torole[0].role;
	   					var user = connection.users[0].user;
 
   						var connectionbox = connectionsSlideBar.contentDocument.createElement("div");
   						connectionbox.style.fontFamily="Tahoma, verdana, arial, helvetica";
						connectionbox.style.fontSize='8pt';
    					connectionbox.style.borderBottom="2px solid gray";
    					connectionbox.style.paddingTop='3px';
    					connectionbox.style.paddingBottom='5px';
    					connectionbox.style.paddingLeft='3px';
    					connectionbox.style.paddingRight='3px';
	
						var rowbox = connectionsSlideBar.contentDocument.createElement("div");
						rowbox.style.clear = "both";
	   					
  						var imagebox = ideasSlideBar.contentDocument.createElement("div");
	     				imagebox.setAttribute('title', user.name);	
  						imagebox.style.cssFloat = 'left';    
  	     				imagebox.parentarea = CONN_TYPE;
						$(imagebox).bind("mouseover", tooltipToggle);	
						$(imagebox).bind("mouseout", tooltipToggle);													
  						 						    					
    					var image = ideasSlideBar.contentDocument.createElement("img");
    					image.setAttribute('border','0');
	     				image.setAttribute('src', newRequestBase+"getupload.php?userid="+user.userid+"&width=50");	
	     				image.setAttribute('alt', user.name);	
	     				image.userid = user.userid;     				
						$(image).bind("click", cohereShowUserDetails);
	     				image.style.paddingRight = "5px";
						image.style.cursor = 'pointer';						
						imagebox.appendChild(image);
	   					rowbox.appendChild(imagebox);
	   					
	   					//draw from node	 
						var fromnodebox = createConnectionIdea(connection, fromnode, fromrole, newURL);
						rowbox.appendChild(fromnodebox); 
												
						//draw connection type
						var arrowmain = connectionsSlideBar.contentDocument.createElement("div");
						arrowmain.style.cssFloat="left";					    					
																			     		
	     				var arrow2 = connectionsSlideBar.contentDocument.createElement("img");
						arrow2.style.marginTop= '25px';
	     				arrow2.setAttribute('border','0');
	     				var grouplabel = connection.linktype[0].linktype.grouplabel;
	     				if (grouplabel == "Positive") {
   							arrow2.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-right-green.png');
   						} else if (grouplabel == "Negative") {
   							arrow2.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-right-red.png');
   						} else if (grouplabel == "Neutral") {
   							arrow2.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-right-gray.png');
   						} else {
   							arrow2.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-right.png');
   						}
						arrowmain.appendChild(arrow2);
								
						rowbox.appendChild(arrowmain);						
												
						//draw to node	
						var tonodebox = createConnectionIdea(connection, tonode, torole, newURL);
						rowbox.appendChild(tonodebox); 
						
						var editbuttonpanel = connectionsSlideBar.contentDocument.createElement("div");
						editbuttonpanel.style.cssFloat="left";	
						//editbuttonpanel.style.margin ="5px";		    					
						
						var editbutton = connectionsSlideBar.contentDocument.createElement("img");
						editbutton.setAttribute('id', 'cohere-editconn-btn');
						editbutton.setAttribute('alt', 'Edit');
						editbutton.setAttribute('title', 'Edit this Connection');
 						editbutton.style.clear="both";					    					
						editbutton.style.cssFloat="left";					    					
 						editbutton.style.margin = '5px';	  
   			   			if (cohereMain.user && cohereMain.session 
								&& cohereMain.user == connection.userid) {															
							editbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/edit.png');
							editbutton.setAttribute('title', 'Edit this Connection');
							editbutton.style.cursor = 'pointer';	   						
							editbutton.connid = connection.connid; 						
							$(editbutton).bind("click", cohereEditConnection);	    				
						} else {
							editbutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/edit-disabled.png');
							editbutton.setAttribute('title', 'If you are the creator, login to Edit this Connection');
						}
 	     				editbutton.parentarea = CONN_TYPE;
						$(editbutton).bind("mouseover", tooltipToggle);	
						$(editbutton).bind("mouseout", tooltipToggle);													
						editbuttonpanel.appendChild(editbutton);
						
						var deletebutton = connectionsSlideBar.contentDocument.createElement("img");

						deletebutton.setAttribute('id', 'cohere-deleteconn-btn');
						deletebutton.setAttribute('alt', 'Delete');
  						deletebutton.style.clear="both";					    					
 						deletebutton.style.cssFloat="left";					    					
   			   			if (cohereMain.user && cohereMain.session 
								&& cohereMain.user == connection.userid) {															
							deletebutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/delete.png');
							deletebutton.setAttribute('title', 'Delete this Connection');
							deletebutton.style.cursor = 'pointer';	   						
							deletebutton.connid = connection.connid;
							deletebutton.label = fromnode.name+"\n\n"+connection.linktype[0].linktype.label+"\n\n"+tonode.name;	
 							$(deletebutton).bind("click", cohereDeleteConnection);	    				
						} else {
							deletebutton.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/delete-disabled.png');							
							deletebutton.setAttribute('title', 'If you are the creator, login to Delete this Connection');
						}
						deletebutton.style.margin = '5px';	   				
 	     				deletebutton.parentarea = CONN_TYPE;
						$(deletebutton).bind("mouseover", tooltipToggle);	
						$(deletebutton).bind("mouseout", tooltipToggle);													
						editbuttonpanel.appendChild(deletebutton);
						
						rowbox.appendChild(editbuttonpanel);
						
						connectionbox.appendChild(rowbox);
						
						var linkbox = connectionsSlideBar.contentDocument.createElement("div");
						linkbox.setAttribute('align', 'center');
						linkbox.style.clear = "both";
						
						var linktype = connectionsSlideBar.contentDocument.createElement("div");
						linktype.style.paddingTop = "3px";
    					var linktypetext = connectionsSlideBar.contentDocument.createTextNode(connection.linktype[0].linktype.label);
    					linktype.appendChild(linktypetext);
						linkbox.appendChild(linktype);

						connectionbox.appendChild(linkbox);
						
						sidelistcons.appendChild(connectionbox);
     				}  	
	    		} 
	    		
			  	var cohereConnectionsCountLabel = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-label');
				var cohereConnectionsCountField = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-field');
				cohereConnectionsCountLabel.innerHTML = count+" Connections found for: ";
				cohereConnectionsCountField.value = newURL;	
				
				statuslabel.innerHTML = count;

				//var flashURL = cohereMain.getBase()+"jetpack/ui/network/jetpack-conn-net-flash.php?userid="+cohereMain.user+"&session="+cohereMain.session+"&url="+encodeURIComponent(newURL);
				//jetpack.tabs.focused.contentWindow.alert(flashURL);
				
				//jetpack.tabs.focused.contentWindow.alert("slidebar = "+networkSlidebar);
				//networkSlidebar.contentDocument.location.href = flashURL;	
				
				//var iframe = connectionsSlideBar.contentDocument.getElementById('flashframe');				
				//iframe.src=flashURL;
				
	 	    	if (jumpType == CONN_TYPE) { 	    	
	 	    		var clip = connectionsSlideBar.contentDocument.getElementById('connectionclip'+jumpClip);
	 	    		clip.previousSibling.scrollIntoView(true);
	 	    		clearAllSelections();
	   				highlightSearchTerms([clip], false); 	    		
					
					jumpType = null;
					jumpNode = null;
					jumpClip = null;
		    	}				
		    }		    
		});
	}			
}

/**
 * Create an idea box on a connection.
 */
function createConnectionIdea(connection, node, role, newURL) {
	var urlBase = cohereMain.getBase();

	var isThisWebsite = false;
	if (node.urls) {
		for(var i = 0; i<node.urls.length; i++ ){
    		var url = node.urls[i].url.url;
     		if (url == newURL) {
     			isThisWebsite = true;
     			break;
     		}
		}
	}

	var label = node.name;
	var labelsmall = label;
	if (labelsmall.length > 55) {
		labelsmall = label.substring(0, 55)+"..."; 
	}
	
	var mainbox = connectionsSlideBar.contentDocument.createElement("div");
	mainbox.style.cssFloat="left";
	mainbox.style.paddingTop='3px';
	mainbox.style.paddingBottom='5px';
	mainbox.style.paddingLeft='3px';
	mainbox.style.paddingRight='3px';
	mainbox.style.background = '#E9F3F3'; 
	mainbox.style.width='170px';
	if (isThisWebsite) {
		mainbox.style.border="1px solid #e80074";
	}	

	var userbox = connectionsSlideBar.contentDocument.createElement("div");
	userbox.style.cssFloat="left";

	var nodetypebox = connectionsSlideBar.contentDocument.createElement("div");
	var nodetype = connectionsSlideBar.contentDocument.createElement("img");
	nodetype.setAttribute('border','0');
	nodetype.setAttribute('src', urlBase+role.image);
	if (isThisWebsite) {
		//nodetypebox.nodeid=node.nodeid;
		//$(nodetypebox).bind("click", selectTabAndIdea);	    				
		//nodetype.setAttribute('title',role.name+": Click to go to idea on Idea Tab");
		nodetype.setAttribute('title',role.name);
		//nodetypebox.style.cursor = 'pointer'; 							     					
	} else {
		nodetype.setAttribute('title',role.name);
	}		    
	nodetype.parentarea = CONN_TYPE;
	$(nodetype).bind("mouseover", tooltipToggle);	
	$(nodetype).bind("mouseout", tooltipToggle);														    				
 				 				
	nodetypebox.appendChild(nodetype);
	userbox.appendChild(nodetypebox);

	if (node.urls.length > 0) {
		var toggleButton = connectionsSlideBar.contentDocument.createElement("img");
		toggleButton.setAttribute('id', 'cohere-conn-showhide-btn'+node.nodeid+connection.connid);
		if (jumpType == CONN_TYPE && jumpNode == node.nodeid+connection.connid) {
			toggleButton.setAttribute('src', urlBase+'jetpack/ui/images/arrow-up.png');
		} else { 
			toggleButton.setAttribute('src', urlBase+'jetpack/ui/images/arrow-down.png');
		}
		toggleButton.setAttribute('alt', 'Show/Hide Clips/Websites');
		toggleButton.setAttribute('title', 'Show/Hide Clips/Websites');
		toggleButton.style.cursor = 'pointer';	   						
		toggleButton.style.margin = '3px';	
		toggleButton.style.marginTop = '10px';	
		toggleButton.style.marginRight = '1px';	
		toggleButton.style.cssFloat = "left";   						
		toggleButton.boxid = 'clipbox'+node.nodeid+connection.connid;
		toggleButton.type = CONN_TYPE;
		$(toggleButton).bind("click", switchClippingsVisibility);	    				
		toggleButton.parentarea = CONN_TYPE;
		$(toggleButton).bind("mouseover", tooltipToggle);	
		$(toggleButton).bind("mouseout", tooltipToggle);														    				
	    
		userbox.appendChild(toggleButton);
	} 
	
	var neighbourhoodbutton = connectionsSlideBar.contentDocument.createElement("img");
	neighbourhoodbutton.setAttribute('id', 'cohere-neighbourhood-btn');
	neighbourhoodbutton.setAttribute('src', urlBase+'jetpack/ui/images/neighbourhood-16px.png');
	neighbourhoodbutton.setAttribute('border', '0');
	neighbourhoodbutton.setAttribute('alt', 'Neighbourhood');
	neighbourhoodbutton.setAttribute('title', 'View Network Neighbourhood');
	neighbourhoodbutton.style.cursor = 'pointer';	   						
	neighbourhoodbutton.style.margin = '3px';	   			
	neighbourhoodbutton.style.marginTop = '5px';	   			
	neighbourhoodbutton.style.cssFloat = "left";   						
	neighbourhoodbutton.nodeid = node.nodeid;
 	$(neighbourhoodbutton).bind("click", cohereShowNeighbourhood);	 
 	neighbourhoodbutton.parentarea = CONN_TYPE;
	$(neighbourhoodbutton).bind("mouseover", tooltipToggle);	
	$(neighbourhoodbutton).bind("mouseout", tooltipToggle);														    					     				   				
 				   			
	userbox.appendChild(neighbourhoodbutton);

	mainbox.appendChild(userbox);		
		 												
	var textboxdiv = connectionsSlideBar.contentDocument.createElement("div");
	textboxdiv.style.cssFloat="right";

    var hasClips = checkForClips(node.urls);

	var textbox = connectionsSlideBar.contentDocument.createElement("div");
	var text = connectionsSlideBar.contentDocument.createTextNode(labelsmall);
	textbox.appendChild(text);    					
	textbox.setAttribute('id', 'nodetext'+node.nodeid+connection.connid);
	textbox.setAttribute('name', 'connodetext');
	textbox.style.height='40px';
	textbox.style.width='120px';
	textbox.style.margin = "0px";
	textbox.style.marginRight = "3px";
	textbox.style.marginLeft = "5px";
	textbox.label = label;
	textbox.hasClips = hasClips;		
	textbox.boxid = node.nodeid+connection.connid;
	textboxdiv.appendChild(textbox);	    				
	if (isThisWebsite) {
		textbox.typename = role.name;
		textbox.style.cursor = 'pointer';	   						
		textbox.userid = node.users[0].user.userid;
		textbox.nodeid = node.nodeid;
		textbox.cohereHighlight = getHighlightColour(node.users[0].user.userid, role.name);
		$(textbox).bind("click", selectConnectionIdea);	    				
	}
	if (labelsmall != label) {
		textbox.labelsmall = labelsmall;	    				
		var morelabel = connectionsSlideBar.contentDocument.createElement("label");
		var text = connectionsSlideBar.contentDocument.createTextNode('more');
		morelabel.appendChild(text);
		morelabel.style.fontSize='8pt';
		morelabel.style.color = '#e80074';
		morelabel.style.cursor = 'pointer';
		morelabel.style.marginLeft="5px";
		morelabel.boxid = 'nodetext'+node.nodeid+connection.connid;
		morelabel.type = CONN_TYPE;
		$(morelabel).bind("click", cohereMoreText);	    				
		textboxdiv.appendChild(morelabel);
	}
 	mainbox.appendChild(textboxdiv);	
 			    
	// Add urls	
   	if (node.urls.length > 0) {			       				
		var mainclipbox = connectionsSlideBar.contentDocument.createElement("div");
		mainclipbox.style.width='100%';
		mainbox.appendChild(mainclipbox);							     			         			      																
   				    
   		var clipboxhidden = connectionsSlideBar.contentDocument.createElement("div");
		if (jumpType == CONN_TYPE && jumpNode == node.nodeid+connection.connid) {
			clipboxhidden.style.display = 'block';
		} else {
			clipboxhidden.style.display = 'none';								
		}
		clipboxhidden.setAttribute('id', 'clipbox'+node.nodeid+connection.connid);
		clipboxhidden.style.clear = "both";
		clipboxhidden.style.background = '#E9F3F3'; 
 
 		mainclipbox.appendChild(clipboxhidden);	 				 		
   						       					       											
  		for(var i = 0; i<node.urls.length; i++ ){	
  			var urlObject = node.urls[i].url		     				
   			var label2 = urlObject.clip;

  			var mainbox3 = connectionsSlideBar.contentDocument.createElement("div");
			mainbox3.style.borderTop="1px solid #308D88";
			mainbox3.style.paddingTop='3px';
			mainbox3.style.paddingBottom='5px';
			mainbox3.style.paddingLeft='3px';
			mainbox3.style.paddingRight='3px';
			mainbox3.style.background = CLIP_BACKGROUND_COLOR; 
 							      						
			var title = connectionsSlideBar.contentDocument.createElement("div");
			title.style.overflow = "hidden";
			title.style.fontWeight="bold";
			if (urlObject.url == newURL) {
				var titletext;
				if (label2 != "") {
 					titletext = connectionsSlideBar.contentDocument.createTextNode("clip source: current page");
 				} else {
					titletext = connectionsSlideBar.contentDocument.createTextNode("page source: current page");
 				}
 				title.appendChild(titletext);
 			} else {
 				var url = urlObject.title;
 				if (url.length > 30)
 				 	url = url.substring(0, 30)+"..."; 
 				var titletext;
				if (label2 != "") {		    						
 					title.label = label2;
					titletext = connectionsSlideBar.contentDocument.createTextNode("clip source: "+url);
				} else {
					titletext = connectionsSlideBar.contentDocument.createTextNode("page source: "+url);
				}
 				title.appendChild(titletext);
				title.url = urlObject.url;
				title.nodeid = node.nodeid+connection.connid;
				title.clipid = urlObject.urlid+connection.connid;
				title.type = CONN_TYPE;
				$(title).bind("click", jumpToURL);	
 			}
			mainbox3.appendChild(title);
 
  			if (label2 != "") {						
  				var textbox2 = connectionsSlideBar.contentDocument.createElement("div");
				textbox2.setAttribute('name', 'connodetextclip'+node.nodeid+connection.connid);
 				var text2 = connectionsSlideBar.contentDocument.createTextNode(label2);
  				textbox2.appendChild(text2);				   					
				textbox2.style.cursor = 'pointer';
				textbox2.style.paddingTop='2px';
				textbox2.style.backgroundColor = 'transparent'; 
				textbox2.setAttribute('id', 'connectionclip'+urlObject.urlid+connection.connid);	
 				textbox2.label = label2;
				textbox2.userid = urlObject.user[0].user.userid;
				textbox2.cohereHighlight = getHighlightColour(urlObject.user[0].user.userid, role.name);
				if (node.urls[i].url.url == newURL) {
					$(textbox2).bind("click", selectClip);	
				} else {
					textbox2.url = urlObject.url;
					textbox2.nodeid = node.nodeid+connection.connid;
					textbox2.clipid = urlObject.urlid+connection.connid;
					textbox2.type = CONN_TYPE;
					$(textbox2).bind("click", jumpToURL);	
				}   				
  										   										   					
   				mainbox3.appendChild(textbox2);   					
 			}
			
			clipboxhidden.appendChild(mainbox3);																	
		}
	}
	
	return mainbox;
}


/**
 * Check the given list of urls and return true 
 * if there is at least on clip on a url
 */
function checkForClips(urls) {
	var hasClips = false;
  	if(urls && urls.length > 0) {	     
  		for(var i = 0; i<urls.length; i++ ){
  			if (urls[i].url.clip != "") {
  				hasClips = true;
  				break;
  			}
    	}
	}
	return hasClips;
}

/**
 * Open the Cohere connection window passing the current item's
 * nodeid, role and label as the from idea in the connection.
 */
function cohereShowNewConnection() {
	var nodeid = this.nodeid;
	var role = this.role;
	var label = this.label;
	var newURL = cohereMain.getBase() + "plugin/ui/connection.php?";
	if (label) {
		newURL = newURL+"idea0="+encodeURIComponent(label);
	}
	if (role) {
		newURL = newURL+"&role0="+encodeURIComponent(role);
	} 		
	if (nodeid) {
		newURL = newURL+"&ideaid0="+nodeid;
	} 		
	newURL += "&url1=" + encodeURIComponent(cohereMain.getURL());
    newURL += "&urltitle1=" + encodeURIComponent(cohereMain.getURLTitle());
	
	cohereMain.loadDialog(newURL, OTHER_TYPE, false);	
}

/**
 * Used to show and hide the full label of an idea or clip
 * (which was trimmed to keep display items smaller)
 */
function cohereMoreText() {	
	var box;
	if (this.type == IDEA_TYPE) {
		box = ideasSlideBar.contentDocument.getElementById(this.boxid);
	} else if (this.type == CLIP_TYPE) {
		box = clipsSlideBar.contentDocument.getElementById(this.boxid);
	} else if (this.type == CONN_TYPE) {
		box = connectionsSlideBar.contentDocument.getElementById(this.boxid);
	}
	if (box) {
		var firstChild = box.childNodes[0];
		var label = this.childNodes[0];
		if (label.nodeValue == "more") {
			label.nodeValue = "less";
			if (this.type == CONN_TYPE) {
				box.style.height="auto";
			}
			firstChild.nodeValue = box.label;
		} else {
			label.nodeValue = "more";
			if (this.type == CONN_TYPE) {
				box.style.height="40px";
			}
			firstChild.nodeValue = box.labelsmall;
		}
	}
}

/**
 * Open the clippings area for the nodeid attached to the given object.
 */
function openClippingsVisibility(obj, type) {
	var box;
	var button;
	if (type == IDEA_TYPE) {
		box = ideasSlideBar.contentDocument.getElementById('clipbox'+obj.nodeid);
		button = ideasSlideBar.contentDocument.getElementById('cohere-showhide-btn'+obj.nodeid);
	} else if (type == CONN_TYPE) {
		box = connectionsSlideBar.contentDocument.getElementById('clipbox'+obj.boxid);
		button = connectionsSlideBar.contentDocument.getElementById('cohere-conn-showhide-btn'+obj.boxid);
	}
	if (box && button) {
		box.style.display = 'block';
		button.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-up.png');
	}
}

/**
 * Open and close the clippings area for the boxid on the current obj.
 */
function switchClippingsVisibility() {
	var box;
	if (this.type == IDEA_TYPE) {
		box = ideasSlideBar.contentDocument.getElementById(this.boxid);
	} else if (this.type == CONN_TYPE) {
		box = connectionsSlideBar.contentDocument.getElementById(this.boxid);
	}
	if (box) {
		if (box.style.display == 'none') {
			box.style.display = 'block';
   			this.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-up.png');
		} else {
			box.style.display = 'none';
			this.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-down.png');
		}
	}
}

/**
 * Open and close the description area for the nodeid attached to the given object.
 */
function switchDescriptionVisibility() {
	var box = ideasSlideBar.contentDocument.getElementById('descbox'+this.nodeid);
	if (box) {
		if (box.style.display == 'none') {
			box.style.display = 'block';
   			this.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-up-green.png');
		} else {
			box.style.display = 'none';
			this.setAttribute('src', cohereMain.getBase()+'jetpack/ui/images/arrow-down-green.png');
		}
	}
}


/**
 * Select the node with the nodeid on the current object 
 * and then switch to the Idea slidebar to show it and scroll to it
 * Called from the Connection slidebar
 */
//MB:  NOT WORKING AT PRESENT
function selectTabAndIdea() {
	//var nodeid = this.nodeid;
	//var textbox =  ideasSlideBar.contentDocument.getElementById("nodetext"+nodeid);
	//selectIdea(textbox);
	
	//connectionsSlideBar.close();
 	//ideasSlideBar.notify();
	//ideasSlideBar.slide(TAB_IDEA_WIDTH, true);
	 
	// scroll to idea
	//textbox.scrollIntoView(true);
	 	
 	// ORIGINAL CODE
 	//var cohereTabber = window.sidebar.document.getElementById('cohereTabs');
	//cohereTabber.selectedIndex=TAB_IDEAS;
	//var sidelist = window.sidebar.document.getElementById('cohere-ideas-sidelist');	
	//var ideabox = window.sidebar.document.getElementById("ideamainbox"+nodeid);
	//var xpcomInterface = sidelist.boxObject.QueryInterface(Components.interfaces.nsIScrollBoxObject);
  	//xpcomInterface.ensureElementIsVisible(ideabox);
}
		
/**
 * Return the highlight colour to use when idea or clip text selected.
 */
function getHighlightColour(userid, rolename) {

	var highlightColour = OTHERS_HIGHLIGHT_COLOR;
	if (cohereMain.user && userid == cohereMain.user) {
		highlightColour = MY_HIGHLIGHT_COLOR;
	}
	if (rolename) {
		if (rolename == PRO_TYPE_LABEL) {
			highlightColour = PRO_TYPE_HIGHLIGHT_COLOR;
		} else if (rolename == CON_TYPE_LABEL) {
			highlightColour = CON_TYPE_HIGHLIGHT_COLOR;
		}
	}
	
	return highlightColour;
}
		

/**** SELECTION FUNCTIONS ****/

/** Holds some data to pass round walkDownDom recursion while searching */
var searchStuff = {
	allText : "",
	searchTerm : "",
	textNodes : new Array(),
	highlightNodes : new Array(),

	setSearchTerm: function(text) {
		this.searchTerm = text;
	},

	setAllText: function(text) {
		this.allText = text;
	},
	
	addTextNode: function(node) {
		this.textNodes[this.textNodes.length] = node;
	},

	addHighlightNode: function(node) {
		this.highlightNodes[this.highlightNodes.length] = node;
	},
}

/** 
 * Replaces my previously used treeWalker as I could not get treeWalker to return anything
 * MB: Needs to investigate why.  
 */
function walkDownDom(node) {  
	var found = false;        
    if (node.nodeType == 3) {
    	searchStuff.addTextNode(node);
   		searchStuff.allText += node.nodeValue;     
		searchStuff.allText = searchStuff.allText.replace(/\s+/g, " ");
    	var ind = searchStuff.allText.indexOf(searchStuff.searchTerm);
   		if (ind > -1) {
   			searchStuff.addHighlightNode(node);
   			found = true;
   		}   
    }                                 
    var children = node.childNodes;                
    for(var i=0; i < children.length; i++) {    
        found = walkDownDom(children[i]);   
        if (found) {
        	break
        }   
    }
    return found;                             
}

/**
 * Search the Dom for text that matches the label on the given obj.
 * Search across html tags to find phrase.
 */
function searchText(obj) {
	var searchTerm = obj.label; 
	//var itemID = obj.id; 
	var highlightColour = obj.cohereHighlight;

	var document = jetpack.tabs.focused.contentDocument;	

	searchStuff.allText="";
	searchStuff.textNodes = new Array(),
	searchStuff.highlightNodes = new Array(),	
	searchStuff.setSearchTerm(searchTerm);
	var found = walkDownDom(document);
	
	var itemFoundCount = 0;
	if (found) {		
		var searchTerm = searchStuff.searchTerm;
		var highlightNodes = searchStuff.highlightNodes;
		if (highlightNodes.length > 0) {
			
			var lastNode = highlightNodes.length[0];
			var textNodes = searchStuff.textNodes;
	 		textNodes.reverse();
	 		var reverseText = "";
	 		for (var j=0; j<textNodes.length; j++) {
		   		var node = textNodes[j];
				reverseText = node.nodeValue + reverseText;
	  			reverseText = reverseText.replace(/\s+/g, " ");		
		   		var ind = reverseText.indexOf(searchTerm);		   		
		   		if (node != lastNode) {
					highlightNodes[highlightNodes.length] = node;
				}
		   		if (ind > -1) {
		   			break;
		   		} 
	 		}
		
			highlightNodes.reverse();
			
			var count = highlightNodes.length;
			var splitText = searchTerm.split(' ');		
			
			if (count > 0) {
				itemFoundCount ++;
			}		
			
	       	var selection = jetpack.tabs.focused.contentWindow.wrappedJSObject.content.getSelection();			
			var range = document.createRange();
			
			if (count == 1) {
				var node = highlightNodes[0];	
				/*if (node.className) {	
					if (node.className.indexOf("proselection") == -1)
						node.className+=" proselection";					
				} else {
					node.className="proselection";
				}*/
				var nodeText = node.nodeValue;
				var firstindex = findIndexOfTerm(nodeText, splitText, 0, true);	
				if (firstindex != -1) {
					range.setStart(node, firstindex);
					range.setEnd(node, (firstindex+searchTerm.length));
					selection.addRange(range);				
				}
			} else {
				for (var i=0; i<count; i++) {
					var node = highlightNodes[i];
					//jetpack.tabs.focused.contentWindow.alert("next ="+node.nodeValue);	
					/*if (node.className) {	
						if (node.className.indexOf("proselection") == -1)
							node.className+=" proselection";					
					} else {
						node.className="proselection";
					}*/
					//jetpack.tabs.focused.contentWindow.alert(node.className);
					var parent = node.parentNode;				
					var nodeText = node.nodeValue;
					if (i==0) {
						var firstindex = findIndexOfTerm(nodeText, splitText, 0, true);				
						//jetpack.tabs.focused.contentWindow.alert("firstindex ="+firstindex);	
						if (firstindex != -1) {
							range.setStart(node, firstindex);
						}
					} else if (i == count-1) {
						var lastindex = findIndexOfTerm(nodeText, splitText, splitText.length-1, false);
						//jetpack.tabs.focused.contentWindow.alert("lastindex ="+lastindex);	
						if (lastindex != -1) {
							range.setEnd(node, lastindex);
							selection.addRange(range);				
						}
					} else {
						//set selection colour on node somehow?
					}
				}
			}
			if (range && range.startContainer.parentNode) {
				range.startContainer.parentNode.scrollIntoView(true);
			}
		}
	}
	
	return itemFoundCount;
}

/**
 * Search for the given term (broken down into an array)
 * in the given textBlock, and return the index point at 
 * which the term starts (if looking down), or stops (if looking up - !down)
 */
function findIndexOfTerm(textBlock, termArray, indexPoint, down) {
	
	var searchTerm = "";
	
	if (down) {
		for (var i=0; i<=indexPoint; i++) {
			if (searchTerm != "") {
				searchTerm += " "+termArray[i];
			} else {
				searchTerm += termArray[i];
			}
		}
	} else {
		for (var i=termArray.length-1; i>=indexPoint; i--) {
			if (searchTerm != "") {
				searchTerm = termArray[i] +" "+ searchTerm;
			} else {
				searchTerm += termArray[i];
			}
		}
	}

	var ind1 = textBlock.indexOf(searchTerm);
	var ind2 = textBlock.lastIndexOf(searchTerm);

	if (ind1 != ind2) {
		return findIndexOfTerm(textBlock, termArray, indexPoint+1, down);
	} else {
		if (down) {
			return ind1;
		} else {
			return ind1+searchTerm.length;
		}
	}
}

/**
 * This takes the searchArray of textbox objects whose label attribute to search, and highlights them.
 */
function highlightSearchTerms(searchArray, keepSelected) {	
	if (!jetpack.tabs.focused.contentDocument.body 
			|| typeof(jetpack.tabs.focused.contentDocument.body.innerHTML) == "undefined") {
     	jetpack.tabs.focused.contentWindow.alert("Sorry, for some reason the text of this page is unavailable. Searching will not work.");
	    return false;
	}
    
	var globalFoundCount = 0;
	for (var i = 0; i < searchArray.length; i++) {
		var next = searchArray[i];		
		var itemFoundCount = searchText(next);	  	
	   	if (itemFoundCount > 0) {
	   		globalFoundCount++;
	   		if (next.style)
	   			next.style.backgroundColor = next.cohereHighlight;
	   	} else {
			if (next.style)
				next.style.backgroundColor = NOTFOUND_HIGHLIGHT_COLOR;
	   	}
	}
  
   	if (globalFoundCount > 0) {
		return true;
	}
	return false;
}

/********** IDEAS SLIDEABAR SELECTION ************/

/**
 * Select the text for the current idea textbox obj and any of its clips
 */
function selectIdea() {
	clearAllSelections();

	var ideas = new Array();	
	ideas[0] = this;	
	
	var clips = new Array();
	clips = ideasSlideBar.contentDocument.getElementsByName( "ideaclip"+this.nodeid);
   	if (clips != null) {
		for (var j=0; j<clips.length;j++ ){
			var clip = clips[j];
			ideas[ideas.length] = clip;
   		}  		
	   	openClippingsVisibility(this, IDEA_TYPE); 	   		   		   		
   	}
   	
   	highlightSearchTerms(ideas, false);
}

/**
 * Select all the ideas.
 */
function selectAllIdeas() {	
	clearAllSelections();
	
	var textboxes = new Array();
	textboxes = ideasSlideBar.contentDocument.getElementsByName( "nodetext" );
	
	var ideas = new Array();	
	for (var i=0; i<textboxes.length;i++ ){
		var next = textboxes[i];
		ideas[ideas.length] = next;
		
		var clips = new Array();
		clips = ideasSlideBar.contentDocument.getElementsByName( "ideaclip"+next.nodeid);
	   	if (clips != null) {
			for (var j=0; j<clips.length;j++ ){
				var clip = clips[j];
				ideas[ideas.length] = clip;
	   		}
	   		openClippingsVisibility(next, IDEA_TYPE); 	   		   		
	   	}				
	}
	
	highlightSearchTerms(ideas, true);	
}

/**
 * Select my ideas.
 */
function selectMyIdeas() {
	clearAllSelections();

	var textboxes = new Array();
	textboxes = ideasSlideBar.contentDocument.getElementsByName( "nodetext" );

	var ideas = new Array();
	for (var i=0; i<textboxes.length;i++ ){
		var next = textboxes[i];
		var userid = next.userid;
		if (cohereMain.user && userid == cohereMain.user) {
			ideas[ideas.length] = next;
			
			var clips = new Array();
			clips = ideasSlideBar.contentDocument.getElementsByName( "ideaclip"+next.nodeid);
		   	if (clips != null) {
				for (var j=0; j<clips.length;j++ ){
					var clip = clips[j];
					ideas[ideas.length] = clip;
		   		}		   		
			   	openClippingsVisibility(next, IDEA_TYPE); 	   		   		   				   		
		   	}				
		}
	}
	
	highlightSearchTerms(ideas, true);
}

/**
 * Select ideas by thier idea type.<b> 
 * Match against the 'type' property of the given element.
 */
function selectIdeasByIdeaType() {
	clearAllSelections();

	var textboxes = new Array();
	textboxes = ideasSlideBar.contentDocument.getElementsByName( "nodetext" );

	var ideas = new Array();
	for (var i=0; i<textboxes.length;i++ ){
		var next = textboxes[i];
		if (next.typename == this.ideatype) {
			ideas[ideas.length] = next;
			
			var clips = new Array();
			clips = ideasSlideBar.contentDocument.getElementsByName( "ideaclip"+next.nodeid);
		   	if (clips != null) {
				for (var j=0; j<clips.length;j++ ){
					var clip = clips[j];
					ideas[ideas.length] = clip;
		   		}
			   	openClippingsVisibility(next, IDEA_TYPE); 	   		   		   				   		
		   	}				
		}
	}
	
	highlightSearchTerms(ideas, true);
}

/**
 * clear ideas Selection
 */
function clearIdeasSelection() {
	var selection =  jetpack.tabs.focused.contentWindow.wrappedJSObject.content.getSelection();			
    if(selection.rangeCount > 0) selection.removeAllRanges();

	var textboxes = new Array();
	textboxes = ideasSlideBar.contentDocument.getElementsByName( "nodetext" );

	if (textboxes) {
		for (var i=0; i<textboxes.length;i++ ){
			var next = textboxes[i];
			next.style.backgroundColor = 'transparent';
			var clips = new Array();
			clips = ideasSlideBar.contentDocument.getElementsByName( "ideaclip"+next.nodeid);
		   	if (clips != null) {
				for (var j=0; j<clips.length;j++ ){
					var clip = clips[j];
		 			clip.style.backgroundColor = 'transparent';
		    	}
		   	}
		}	
	}
}

/********** CLIPS SLIDEABAR SELECTION ************/
/**
 * Select the text for the current idea object and any of its clips
 */
function selectClip() {
	clearAllSelections();
   	highlightSearchTerms([this], false);
}

/**
 * Select all the clips.
 */
function selectAllClips() {
	clearAllSelections();

	var textboxesclip = new Array();
	textboxesclip = clipsSlideBar.contentDocument.getElementsByName( "clipnodetext" );

	var clips = new Array();
	for (var i=0; i<textboxesclip.length;i++ ){
		var next = textboxesclip[i];
		clips[i] = next;;
	}
	
	highlightSearchTerms(clips, true);
}

/**
 * Select my clips.
 */
function selectMyClips() {
	clearAllSelections();

	var textboxesclip = new Array();
	textboxesclip = clipsSlideBar.contentDocument.getElementsByName( "clipnodetext" );

	var clips = new Array();
	for (var i=0; i<textboxesclip.length;i++ ){
		var next = textboxesclip[i];
		var userid = next.userid;
		if (cohereMain.user && userid == cohereMain.user) {
			clips[clips.length] = next;
		}    	
	}
	
	highlightSearchTerms(clips, true);
}

/**
 * clear ideas Selection
 */
function clearClipsSelection() {
	var selection =  jetpack.tabs.focused.contentWindow.wrappedJSObject.content.getSelection();			
    if(selection.rangeCount > 0) selection.removeAllRanges();

	var textboxesclip = new Array();
	textboxesclip = clipsSlideBar.contentDocument.getElementsByName( "clipnodetext" );

	if (textboxesclip) {
		for (var i=0; i<textboxesclip.length;i++ ){
			var next = textboxesclip[i];
			next.style.backgroundColor = 'transparent';
		}
	}
}		

/******** CONNECTION SELECTION METHODS **********/

/**
 * Select the text for the current connection idea object and any of its clips
 */
function selectConnectionIdea() {
	clearAllSelections();

	var ideas = new Array();	
	ideas[0] = this;
	
	var clips = new Array();	
	clips = connectionsSlideBar.contentDocument.getElementsByName( "connodetextclip"+this.boxid );	
   	if (clips != null) {
		for (var i=0; i<clips.length;i++ ){
			var clip = clips[i];
			ideas[ideas.length] = clip;
   		}
   		openClippingsVisibility(this, CONN_TYPE); 	   		   		   				   				   		   		
   	}
   	
   	highlightSearchTerms(ideas, false);
}

/**
 * Select all the ideas.
 */
function selectAllConnectionIdeas() {
	clearAllSelections();
	
	var ideas = new Array();
	
	var connectiontextboxes = new Array();
	connectiontextboxes = connectionsSlideBar.contentDocument.getElementsByName( "connodetext" );	
		
	for (var i=0; i<connectiontextboxes.length;i++ ){
		var next = connectiontextboxes[i];
		ideas[ideas.length] = next;
		
		var clips = new Array();
		clips = connectionsSlideBar.contentDocument.getElementsByName( "connodetextclip"+next.boxid );	
	   	if (clips != null) {
			for (var j=0; j<clips.length;j++ ){
				var clip = clips[j];
				ideas[ideas.length] = clip;
	   		}
   			openClippingsVisibility(next, CONN_TYPE); 	   		   		   				   				   		   		
	   	}				
	}
	
	highlightSearchTerms(ideas, true);	
}

/**
 * Select my ideas.
 */
function selectMyConnectionIdeas() {
	clearAllSelections();

	var connectiontextboxes = new Array();
	connectiontextboxes = connectionsSlideBar.contentDocument.getElementsByName( "connodetext" );	

	var ideas = new Array();
	for (var i=0; i<connectiontextboxes.length;i++ ){
		var next = connectiontextboxes[i];
		var userid = next.userid;
		if (cohereMain.user && userid == cohereMain.user) {
			ideas[ideas.length] = next;
			
			var clips = new Array();
			clips = connectionsSlideBar.contentDocument.getElementsByName( "connodetextclip"+next.boxid );	
		   	if (clips != null) {
				for (var j=0; j<clips.length;j++ ){
					var clip = clips[j];
					ideas[ideas.length] = clip;
		   		}		   		
		   		openClippingsVisibility(next, CONN_TYPE); 	   		   		   				   				   		
		   	}				
		}
	}
	
	highlightSearchTerms(ideas, true);
}

/**
 * Select ideas by thier idea type.<b> 
 * Match against the 'type' property of the given element.
 */
function selectConnectionIdeasByIdeaType() {
	clearAllSelections();

	var connectiontextboxes = new Array();
	connectiontextboxes = connectionsSlideBar.contentDocument.getElementsByName( "connodetext" );	

	var ideas = new Array();
	for (var i=0; i<connectiontextboxes.length;i++ ){
		var next = connectiontextboxes[i];
		if (next.typename == this.ideatype) {
			ideas[ideas.length] = next;
			
			var clips = new Array();
			clips = connectionsSlideBar.contentDocument.getElementsByName( "connodetextclip"+next.boxid );	
		   	if (clips != null) {
				for (var j=0; j<clips.length;j++ ){
					var clip = clips[j];
					ideas[ideas.length] = clip;
		   		}
		   		openClippingsVisibility(next, CONN_TYPE); 	   		   		   				   				   		
		   	}				
		}
	}
	
	highlightSearchTerms(ideas, true);
}

/**
 * clear ideas Selection
 */
function clearConnectionIdeasSelection() {
	var selection =  jetpack.tabs.focused.contentWindow.wrappedJSObject.content.getSelection();			
    if(selection.rangeCount > 0) selection.removeAllRanges();

	var connectiontextboxes = new Array();
	connectiontextboxes = connectionsSlideBar.contentDocument.getElementsByName( "connodetext" );	

	if (connectiontextboxes) {
		for (var i=0; i<connectiontextboxes.length;i++ ){
			var next = connectiontextboxes[i];
			if (next.style) {
				next.style.backgroundColor = 'transparent';
			   	
				var clips = new Array();
				clips = connectionsSlideBar.contentDocument.getElementsByName( "connodetextclip"+next.boxid );	
			   	if (clips != null) {
					for (var j=0; j<clips.length;j++ ){
						var clip = clips[j];
			 			clip.style.backgroundColor = 'transparent';
			    	}
			   	}
			}
		}	
	}
}

/**
 * Clear all the slidebar list selections and webpage selections
 */
function clearAllSelections() {
	clearIdeasSelection();
	clearClipsSelection();
	clearConnectionIdeasSelection();
}

/**** END SELECTION FUNCTIONS ****/

/******** FUNCTIONS THAT CALL COHERE SERVER IN SOME WAY *************/

/**
 * Drag text from webpage to create clip
 */
function processClipDrop(event) {
	var value = event.dataTransfer.getData("text/plain"); 
	if (value != "") {
		cohereMain.addClip(value);
	}
}

/**
 * Create an idea with a clip using the value of the text passed,
 * On the idea with the nodeid of the target.
 */
function processIdeaClipDrop(event, nodeid) {
	var value = event.dataTransfer.getData("text/plain"); 
	if (nodeid && nodeid != "" && value != "") {
		cohereMain.addClipOnExistingIdea(nodeid, value);
	}
}

/**
 * Open a new window showing the user details for the userid of the current object
 */
function cohereShowUserDetails() {
	var newURL = cohereMain.getBase() + "user.php?userid=" + this.userid;
	cohereMain.loadDialog(newURL, OTHER_TYPE, true);
}

/**
 * Open a new window showing the network neightbourhood view 
 * for the idea with the nodeid of the current object.
 */
function cohereShowNeighbourhood() {
	var newURL = cohereMain.getBase() + "node.php?nodeid=" + this.nodeid + "#conn-neighbour";
	cohereMain.loadDialog(newURL, OTHER_TYPE, true);
}

/**
 * Open the Cohere Idea window to edit 
 * the idea with the nodeid on the current item.
 */
function cohereEditIdea() {
	cohereMain.editIdea(this.nodeid);
}

/**
 * Ask cohere to delete the idea with the nodeid of the current object.
 */
function cohereDeleteIdea() {
	cohereMain.deleteIdea(this.label, this.nodeid);
}

/**
 * Open the Cohere Idea window to edit 
 * the connection with the connid on the current item.
 */
function cohereEditConnection() {
	cohereMain.editConnection(this.connid);
}

/**
 * Ask cohere to delete the connection with the connid of the current object.
 */
function cohereDeleteConnection() {
	cohereMain.deleteConnection(this.label, this.connid);
}

/**
 * Add the idea with the given nodeid to the 
 * user's bookmarks on the Cohere website.
 */
function bookmarkIdea() {
	cohereMain.bookmark(this.nodeid, this.label);
}

/**
 * Add the clip with the given clip text to an idea.
 */
function addClipToIdea() {
	cohereMain.addClipToIdea(this.clipname);
}

/**
 * Add the currently selected text to the idea with the given nodeid.
 */
function addNewClipToIdea() {
	cohereMain.createClipOnIdea(this.nodeid);
}

/**
 * Remove the clip with the clipid on the current object
 * from the nodeid on the current iobject.
 */
function removeClipFromIdea() {
	cohereMain.removeClipFromIdea(this.nodeid, this.clipdid, this.clipname);
}

/**
 * Delete the clip with the clipid on the current object.
 */
function deleteClip() {
	cohereMain.deleteClip(this.clipid, this.clipname);
}

function jumpToURL() {
	jumpNode = this.nodeid;
	jumpClip = this.clipid;
	jumpType = this.type;	
	cohereMain.loadPage(this.url);
}


/*** COHERE MAIN CLASS ***/
/**
 * Has all the functions that communicate with the Cohere server
 * and their helper functions
 */ 
var cohereMain = {
	
	user : null,
	session : null,
	newWindow: null,
	newIdeaWindow: null,
	newClipWindow: null,
	newConnWindow: null,
	
	// remember trailing '/' on cohereBase
	cohereBase : "http://cohere.open.ac.uk/",
	cookieDomain : "cohere.open.ac.uk",
	
	checkLogin: function() {
		this.user = null;
		this.session = null;
		
	    var userCookie = "user";
     	var sessionCookie = "Cohere";
     	var u = null;
     	var sess = null;
     	var cookieManager = Components.classes["@mozilla.org/cookiemanager;1"]
     				.getService(Components.interfaces.nsICookieManager); 
     	var iter = cookieManager.enumerator; 
     	while (iter.hasMoreElements()){ 
   			var cookie = iter.getNext(); 
         	if (cookie instanceof Components.interfaces.nsICookie) { 
            	if (cookie.host == this.cookieDomain && cookie.name == sessionCookie) {
                  	sess = cookie.value;
                } else if (cookie.host == this.cookieDomain && cookie.name == userCookie) {
                	u = cookie.value;
            	}
         	} 
     	}
     	
     	if (sess != null && sess != "" && u != null && u != "") {     	
	     	// Check that the session and user are still valid.
	     	var newRequestBase = this.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=validatesession&userid=" + u + "&PHPSESSID="+sess;
			$.ajax({
			    url: newRequestUrl,
			    type: 'GET',
			    dataType: 'json',
			    timeout: 2000,
			    error: function(){
			    	cohereMain.session = null;
			    	cohereMain.user = null;
			    	cohereMain.notLoggedIn();
			    },
			    success: function(json) {
			    	var elem = ["cohere-menu-mycohere"];		    		    	
	      			if(json.error) {
			    		cohereMain.session = null;
			    		cohereMain.user = null;
			    		cohereMain.notLoggedIn();
	      			} else { 		
						cohereMain.session = sess;
						cohereMain.user = u;
						cohereMain.loggedIn();
			        }		        	
			    }
			});		
		} else {
    		cohereMain.session = null;
    		cohereMain.user = null;
    		cohereMain.notLoggedIn();
		}     	
	},

	loggedIn: function() {
	
		// This does not work at present - suspect jetpack bug
		/*var loginitem = coheremainmenu.item('Login');
		if (!loginitem) {
			loginitem = coheremainmenu.item('Logout');
		}
		loginitem.label = "Logout";
		
		var mycohereitem = coheremainmenu.item('My Cohere');
		if (mycohereitem) {
			//jetpack.tabs.focused.contentWindow.alert("enabling menuitem");
			mycohereitem.disabled = 'false';
 	   	} else {
 	   		//jetpack.tabs.focused.contentWindow.alert("my cohere item not found");
 	   	}*/
 	   	
 		var myideaselectionmenu = ideasSlideBar.contentDocument.getElementById('cohere-idea-selectmy-btn');
		if (myideaselectionmenu) {
			myideaselectionmenu.removeAttribute('disabled');
		} 
 		var myclipselectionmenu = clipsSlideBar.contentDocument.getElementById('cohere-clip-selectmy-btn');
		if (myclipselectionmenu) {
			myclipselectionmenu.removeAttribute('disabled');
 		} 
 		var myconnselectionmenu = connectionsSlideBar.contentDocument.getElementById('cohere-conn-selectmy-btn');
		if (myconnselectionmenu) {
			myconnselectionmenu.removeAttribute('disabled');
 		} 
 		
		var newURL = this.getURL(); 		
 	   	refreshUI(newURL);	  
	},
	
	notLoggedIn: function() {

		// This does not work at present - suspect jetpack bug
		/*var loginitem = coheremainmenu.item('Login');
		if (!loginitem) {
			loginitem = coheremainmenu.item('Logout');
		}
		loginitem.label = "Login";

		var mycohereitem = coheremainmenu.item('My Cohere');
		mycohereitem.disabled = 'true';
		*/
		
		var myideaselectionmenu = ideasSlideBar.contentDocument.getElementById('cohere-idea-selectmy-btn');
		if (myideaselectionmenu) {
			myideaselectionmenu.setAttribute('disabled', 'true');
		}
		var myclipselectionmenu = clipsSlideBar.contentDocument.getElementById('cohere-clip-selectmy-btn');
		if (myclipselectionmenu) {
			myclipselectionmenu.setAttribute('disabled', 'true');
		} 
		var myconnselectionmenu = connectionsSlideBar.contentDocument.getElementById('cohere-conn-selectmy-btn');
		if (myconnselectionmenu) {
			myconnselectionmenu.setAttribute('disabled', 'true');
		} 
		
		var newURL = this.getURL(); 		
 	   	refreshUI(newURL);	  
	},
			
	login: function() {
		if (!this.session){
			this.loadPage(this.cohereBase + "login.php");
			//this.loadDialog(this.cohereBase + "login.php", OTHER_TYPE, true)
		} else {
			this.loadPage(this.cohereBase + "logout.php");
			//this.loadDialog(this.cohereBase + "logout.php", OTHER_TYPE, true)
		}
	},
	
	/**
	 * Add idea to the users cache
	 */
	bookmark: function(nodeid, label) {
		if (nodeid) {
			var newRequestBase = cohereMain.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=addtousercache&idea="+nodeid+"&PHPSESSID="+this.session;;
			$.ajax({
			    url: newRequestUrl,
			    type: 'GET',
			    dataType: 'json',
			    timeout: 2000,
			    error: function(request,error){
		     		jetpack.notifications.show({title:"Cohere Warning", body:'Unable to bookmark node. Sorry.', icon: WARNING_ICON_GREEN});
			    },
			    success: function(json){
		  			if(json.error){
		  				jetpack.tabs.focused.contentWindow.alert(json.error[0].message);
		  			} else { 		
						jetpack.tabs.focused.contentWindow.alert(label+"\n\n has been bookmarked");
					} 
		 		}				      			     	   			
		  	});
		 }
	},
	
	createIdea: function() {
        var data = this.getData();
		this.loadDialog(this.cohereBase + "plugin/ui/idea.php?"+ data, IDEA_TYPE, false);
	},
	
	editIdea: function(nodeid) {
		this.loadDialog(this.cohereBase + "plugin/ui/idea.php?"+ "nodeid="+nodeid, IDEA_TYPE, false);
	},
	
	deleteIdea: function(label, nodeid) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to delete the idea:\n\n'"+label+"' \n\n and all it's connections from Cohere?\n")) {	
			if (nodeid && this.user && this.session) {
				var newRequestBase = cohereMain.getBase();
				var newRequestUrl2 = newRequestBase + "api/service.php?format=json&method=deletenode&nodeid="+nodeid+"&PHPSESSID="+this.session;
				$.ajax({
				    url: newRequestUrl2,
				    type: 'GET',
				    dataType: 'json',
				    timeout: 2000,
				    error: function(request,error){
				    	 jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete idea. Sorry.', icon: WARNING_ICON_GREEN});
				    },
				    success: function(json){
		      			if(json.error){
      						//json.error[0].message - use this when multi-line notifications available      			 	    	
				    	 	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete idea. Sorry.', icon: WARNING_ICON_GREEN});
		      			} else { 		
		      				var newURL = cohereMain.getURL();
		      				refreshUI(newURL);	      			    
	    					//ideasSlideBar.slide(TAB_IDEA_WIDTH, true);
				        }		        	
				    }
				});
			}		
		}
	},
	
	addClipToIdea: function(cliptext) {	
        var data = "&url=" + encodeURIComponent(this.getURL());
        data += "&urltitle=" + encodeURIComponent(this.getURLTitle());
    	data += "&urlclip=" + encodeURIComponent(cliptext);
        
		this.loadDialog(this.cohereBase + "plugin/ui/idea.php?"+ data, IDEA_TYPE, false);
	},	
	
	createClipOnIdea: function(nodeid) {
		var clip = this.getSelectedText()
		if (clip == null || clip == "") {
			jetpack.tabs.focused.contentWindow.alert("Please select some website text first");
		} else {
			addClipOnExistingIdea(nodeid, clip);
		}
	},
	
	/**
 	 * Create an idea with a clip using the clip value passed,
 	 * On the idea with the nodeid passed.
 	 */
	addClipOnExistingIdea: function(nodeid, clip) {
		if (this.user && this.session&& clip && clip!="") {
			var newRequestBase = this.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=addurl" + this.getClipService() + "&PHPSESSID="+this.session;
			$.ajax({
			    url: newRequestUrl,
			    type: 'GET',
			    dataType: 'json',
			    timeout: 2000,
			    error: function(request,error){
			    	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip. Sorry.', icon: WARNING_ICON_GREEN});
			    },
			    success: function(json){
	      			if(json.error){
      					//json.error[0].message - use this when multi-line notifications available      			 	    	
			    		jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip. Sorry.', icon: WARNING_ICON_GREEN});
	      			} else { 	
	      				if (json.url) {	
		    				cohereMain.addClipAgainstIdea(nodeid, json.url[0].urlid);
						}
			        }		        	
			    }
			});		
		} 
	},

	addClipAgainstIdea: function(nodeid, urlid) {
		if (this.user && this.session) {
			var newRequestBase = this.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=addurltonode&nodeid="+nodeid+"&urlid="+urlid+"&PHPSESSID="+this.session;
			$.ajax({
			    url: newRequestUrl,
			    type: 'GET',
			    dataType: 'json',
			    timeout: 2000,
			    error: function(request,error){
			    	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip to Idea. Sorry.', icon: WARNING_ICON_GREEN});
			    },
			    success: function(json){
	      			if(json.error){
	      			   	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip to Idea. Sorry.', icon: WARNING_ICON_GREEN});	      			
      					//jetpack.tabs.focused.contentWindow.alert(json.error[0].message);// - use this when multi-line notifications available      			 	    	
	      			} else { 	
      					var newURL = cohereMain.getURL();
      					jumpNode = nodeid;
      					jumpClip = urlid;
      					jumpType = IDEA_TYPE;
      					refreshIdeasUI(newURL);
  						//ideasSlideBar.slide(TAB_IDEA_WIDTH, true);
			        }		        	
			    }
			});		
		} 
	},
	
	createClip: function() {
		var clip = this.getSelectedText();
		if (clip == null || clip == "") {
			jetpack.tabs.focused.contentWindow.alert("Please select some website text first");
		} else {
			this.addClip(clip);
		}
	},
	
	addClip: function(clip) {	
		if (this.user && this.session && clip && clip != "") {
			var newRequestBase = this.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=addurl" + this.getClipService() + "&PHPSESSID="+this.session;
			$.ajax({
			    url: newRequestUrl,
			    type: 'GET',
			    dataType: 'json',
			    timeout: 2000,
			    error: function(request,error){
			    	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip. Sorry.', icon: WARNING_ICON_GREEN});			    
			    },
			    success: function(json){
	      			if(json.error){
			    		jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip. Sorry.', icon: WARNING_ICON_GREEN});
      					//json.error[0].message - use this when multi-line notifications available      			 	    	
	      			} else { 		
	      				var newURL = cohereMain.getURL();	
 	      				refreshUI(newURL);	      			    	      				
   						//clipsSlideBar.slide(TAB_CLIP_WIDTH, true);
			        }		        	
			    }
			});		
		} else {		
 	   		var data = this.getClip();	
 			this.loadDialog(this.cohereBase + "plugin/ui/url.php?"+ data, CLIP_TYPE, false);
		}
	},
	
	removeClipFromIdea: function(nodeid, clipid, clipname) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to remove the clip:\n\n'"+clipname+"' From this node?")) {	
			if (clipid && this.user && this.session) {
				var newRequestBase = this.getBase();
				var newRequestUrl = newRequestBase + "api/service.php?format=json&method=removeurlfromnode&nodeid="+nodeid+"&urlid="+clipid+"&PHPSESSID="+this.session;
				$.ajax({
				    url: newRequestUrl,
				    type: 'GET',
				    dataType: 'json',
				    timeout: 2000,
				    error: function(request,error){
				        jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to remove clip. Sorry.', icon: WARNING_ICON_GREEN});
				    },
				    success: function(json){
		      			if(json.error){
		      				jetpack.tabs.focused.contentWindow.alert(json.error[0].message);
		      			} else { 		
		      				var newURL = cohereMain.getURL();	      			    
				    		refreshIdeasUI(newURL);  
	    					//ideasSlideBar.slide(TAB_IDEA_WIDTH, true);
				        }		        	
				    }
				});
			}		
		}	
	},
	
	deleteClip: function(clipid, clipname) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to delete the clip:\n\n'"+clipname+"' ?")) {	
			if (clipid && this.user && this.session) {
				var newRequestBase = this.getBase();
				var newRequestUrl2 = newRequestBase + "api/service.php?format=json&method=deleteurl&urlid="+clipid+"&PHPSESSID="+this.session;
				$.ajax({
				    url: newRequestUrl2,
				    type: 'GET',
				    dataType: 'json',
				    timeout: 2000,
				    error: function(request,error){
				    	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete clip. Sorry.', icon: WARNING_ICON_GREEN});
				    },
				    success: function(json){
		      			if(json.error){
		      				jetpack.tabs.focused.contentWindow.alert(json.error[0].message);
		      			} else { 		
		      				var newURL = cohereMain.getURL();
		      				refreshUI(newURL);	      			    
	   						//clipsSlideBar.slide(TAB_CLIP_WIDTH, true);
				        }		        	
				    }
				});
			}		
		}
	
	},
		
	createConnection: function() {
		var data = this.getData(0);
		this.loadDialog(this.cohereBase + "plugin/ui/connection.php?"+ data, CONN_TYPE, false);
	},
	
	editConnection: function(connid) {
		this.loadDialog(this.cohereBase + "plugin/ui/connection.php?connid="+connid, CONN_TYPE, false);
	},
	
	deleteConnection: function(label, connid) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to delete the connection:\n\n'"+label+"' \n\n from Cohere?\n")) {	
			if (connid && this.user && this.session) {
				var newRequestBase = cohereMain.getBase();
				var newRequestUrl2 = newRequestBase + "api/service.php?format=json&method=deleteconnection&connid="+connid+"&PHPSESSID="+this.session;
				$.ajax({
				    url: newRequestUrl2,
				    type: 'GET',
				    dataType: 'json',
				    timeout: 2000,
				    error: function(request,error){
				    	 jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete connection. Sorry.', icon: WARNING_ICON_GREEN});
				    },
				    success: function(json){
		      			if(json.error){
      						//json.error[0].message - use this when multi-line notifications available      			 	    	
				    	 	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete connection. Sorry.', icon: WARNING_ICON_GREEN});
		      			} else { 		
		      				var newURL = cohereMain.getURL();
		      				refreshConnectionsUI(newURL);	      			    
	    					//connectionsSlideBar.slide(TAB_CONN_WIDTH, true);
				        }		        	
				    }
				});
			}		
		}
	},
	
	openMyCohere: function() {
		this.loadDialog(this.cohereBase + "user.php", OTHER_TYPE, true);
	},
	
	openCohere: function() {
 	  	this.loadDialog(this.cohereBase, OTHER_TYPE, true);
	},
	
	loadPage : function(aUrl){
		var newTab = jetpack.tabs.open(aUrl);
		newTab.focus();
    	return;
   	},	
   	
   	quickConnect: function() {
		var width = 404; 
		var height = 400;
		var window = jetpack.tabs.focused.contentWindow;
		
      	var left = parseInt((window.screen.availWidth/2) - (width/2)); 
      	var top  = parseInt((window.screen.availHeight/2) - (height/2));
      	var props = "width="+width+",height="+height+",left="+left+",top="+top+",menubar=0,toolbar=0,scrollbars=1,location=0,status=1,resizable=1";
 
	    cohereMain.newConnWindow = window.open(url, "cohere", props);      
      	cohereMain.newConnWindow.focus();  
      	cohereMain.checkConn(); 
   	},		
   	
	loadDialog: function(url, type, large){
		var width = 600; 
		var height = 600;
		//make it 80% of screen realestate

      	var window = jetpack.tabs.focused.contentWindow.wrappedJSObject.window;

		if (large) {
			width = (window.screen.availWidth/100)*80;			
			height = (window.screen.availHeight/100)*80;
		}
		
      	var left = parseInt((window.screen.availWidth/2) - (width/2)); 
      	var top  = parseInt((window.screen.availHeight/2) - (height/2));
      
      	var props = "width="+width+",height="+height+",left="+left+",top="+top+",menubar=0,toolbar=0,scrollbars=1,location=0,status=1,resizable=1";
     	
      	if (type == CLIP_TYPE) {
	      	cohereMain.newClipWindow = window.open(url, "cohere", props);      
	      	cohereMain.newClipWindow.focus();  
	      	cohereMain.checkClip(); 
      	} else if (type == IDEA_TYPE) {
	      	cohereMain.newIdeaWindow = window.open(url, "cohere", props);      
	      	cohereMain.newIdeaWindow.focus();  
	      	cohereMain.checkIdea(); 
      	} else if (type == CONN_TYPE) {
 	      	cohereMain.newConnWindow = window.open(url, "cohere", props);      
	      	cohereMain.newConnWindow.focus();  
	      	cohereMain.checkConn(); 
     	} else  {	      	
	      	cohereMain.newWindow = window.open(url, "cohere", props);      
	      	cohereMain.newWindow.focus();  
	      	cohereMain.check(); 
	    }	      	   	      	
	},
 	
    checkClip : function() {
  		if (cohereMain.newClipWindow == null || cohereMain.newClipWindow.closed) {
    		//var newURL = cohereMain.getURL();
   			refreshUI(oldTabURL);	      			    
   			//clipsSlideBar.slide(TAB_CLIP_WIDTH, true); // does not work at present
  		} else {
  			setTimeout(function(){cohereMain.checkClip()},10);
  		}
	},		
 
    checkIdea : function() {
  		if (cohereMain.newIdeaWindow == null || cohereMain.newIdeaWindow.closed) {
    		//var newURL = cohereMain.getURL();
   			refreshUI(oldTabURL);	   			
   			//ideasSlideBar.slide(TAB_IDEA_WIDTH, true); // does not work at present
  		} else {  		
  			setTimeout(function(){cohereMain.checkIdea()},10);
  		}
	},		

    checkConn : function() {
  		if (cohereMain.newConnWindow == null || cohereMain.newConnWindow.closed) {
    		//var newURL = cohereMain.getURL();
   			refreshConnectionsUI(oldTabURL);	      			    
 			//connectionsSlideBar.slide(TAB_CONN_WIDTH, true);  // does not work at present   			    			    		    		
  		} else {
  			setTimeout(function(){ cohereMain.checkConn() } ,10);
  		}
	},		
    
    check : function() {
  		if (cohereMain.newWindow == null || cohereMain.newWindow.closed) {
    		//var newURL = cohereMain.getURL();
	      	refreshUI(oldTabURL);	      			    			    		    		
  		} else {
  			setTimeout(function(){ cohereMain.check()},10);
  		}
	},		
    
    getURL : function(){
    	var url = jetpack.tabs.focused.contentWindow.location.href
        return url;
    },
    
    getBase : function(){
        return this.cohereBase;
    },
    
	getURLTitle : function(){
    	var title = jetpack.tabs.focused.contentDocument.title;
      	if(!title || title == ""){
       		title = jetpack.tabs.focused.contentWindow.location.href;
        }
        return title;
    },
    
    getSelectedText : function(charlen) {
       	var searchStr = jetpack.selection.text;
       	if (searchStr == null) {
       		searchStr = "";
       	}
 
       	if (!charlen){
        	charlen = 4096;
       	}       
       	if (charlen < searchStr.length) {
	    	var pattern = new RegExp("^(?:\\s*.){0," + charlen + "}");
	        pattern.test(searchStr);
	        searchStr = RegExp.lastMatch;
       	}
      
       	searchStr = searchStr.replace(/^\s+/, ""); //strip white space at start of line
       	searchStr = searchStr.replace(/\s+$/, ""); // strip white space at end of line
       	searchStr = searchStr.replace(/\s+/g, " "); // turn mutiple white spaces into single
    
    	return searchStr;
   	},
     
	getClip : function(id) {
   		if (id != null){
   			var postfix = id;
   		} else {
   			var postfix = "";
   		}
        var data = "&clip"+postfix+"=" + encodeURIComponent(this.getSelectedText());
        data += "&url"+postfix+"=" + encodeURIComponent(this.getURL());
        data += "&title"+postfix+"=" + encodeURIComponent(this.getURLTitle());
    
    	return data;
   	},
 
    getClipService : function(id) {
        var data = "&clip=" + encodeURIComponent(this.getSelectedText());
        data += "&url=" + encodeURIComponent(this.getURL());
        data += "&title=" + encodeURIComponent(this.getURLTitle());
        data += "&desc=";    
    	return data;
   	},
    
   	getData : function(id) {
   		if (id != null){
   			var postfix = id;
   		} else {
   			var postfix = "";
   		}
        var data = "&url"+postfix+"=" + encodeURIComponent(this.getURL());
        data += "&urltitle"+postfix+"=" + encodeURIComponent(this.getURLTitle());
    	data += "&urlclip"+postfix+"=" + encodeURIComponent(this.getSelectedText());
    	return data;
   	},
}