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
 /* version 0.2.3 */
 
/**
 *  This section has the twitter accounts setting and the first run welcome/help text
 */
var manifest = {
  settings: [
	{
	  name: "coherejetpack",
	  type: "group",
	  label: "Twitter Account",
	  settings: [
		{ name: "twitterName", type: "text", label: "Username" },
		{ name: "twitterPassword", type: "password", label: "Password" }
	  ]
	}
  ],

  firstRunPage: (<>
   <div style="font-family:Tahoma, verdana, arial, helvetica; font-size: 10pt; border: 1px solid white">
    <p>
      <img src="http://cohere.open.ac.uk/jetpack/ui/images/cohere_logo.png" border="0" style="margin-bottom: 5px; vertical-align: bottom" />
      <br />Thank you for installing the Cohere Jetpack version 0.2.3
      <br />Visit the Cohere <a href="http://cohere.open.ac.uk">homepage</a> to <b>create an account</b> and for more information about Cohere.
    </p>
    <p style="font-weight: bold">Cohere Jetpack Quickstart Guide</p>
    <p>
    The Cohere jetpack consists of 4 slidebars: <i>Ideas</i>, <i>Clips</i>, <i>Connections</i> and <i>OER Commons Recommendations</i>. It also has 4 status bar elements one for each of the slidebars, displaying counts of the items on each slidebar.
    <br /><br />To access any of these slidebars click the blue arrow on the far left of the browser tabs and then the icon of the slidebar you want to view.
    The contents of all of these are webpage specific, so are refreshed as you browse. 
    <br /><a href="http://www.youtube.com/watch?v=uOPtKYU8I3A" target="_blank">Watch Overview Movie</a>

    <br /><br />To create content you must be logged in to Cohere.
    <a href="http://www.youtube.com/watch?v=wiS4HY7MVI8" target="_blank">Watch Login Movie</a>
    
    <br /><br />The Cohere slidebars are:<br />
    <ul>
    <li style="clear: both; list-style-type: none;"><img src="http://cohere.open.ac.uk/jetpack/ui/images/lightbulb-16.png" border="0" style="border-right: 3px;" /><b>Ideas</b>: are annotations of a webpage, usually associated with one or more clips.
     <div style="margin: 0px; padding: 0px; padding-left: 20px;">
     To create a new idea, select some text on a webpage and use the right-click Cohere menu item 'Create Idea'. <a href="http://www.youtube.com/watch?v=fFlAc9Xh3C0" target="_blank">Watch Ideas Movie</a>  
     <br />Also <a href="http://www.youtube.com/watch?v=q3hvFNYzE1U" target="_blank">Watch 'Navigating the web through ideas' Movie</a>   
     </div>  
    </li>    
    <li style="clear: both; margin-top: 10px; list-style-type: none;"><img src="http://cohere.open.ac.uk/jetpack/ui/images/clip.png" border="0" style="border-right: 3px;" /><b>Clips</b>: are text selection from a webpage stored against that page and associated with an idea.
     <div style="margin: 0px; padding: 0px; padding-left: 20px;">
     To create a new clips, select some text on a webpage and use the right-click Cohere menu item 'Create Clip' or drag the selected text onto the Clip slidebar. <a href="http://www.youtube.com/watch?v=W1B_z9HH3kY" target="_blank">Watch Clips Movie</a>
     </div>  
    </li>    
    <li style="clear: both; margin-top: 10px; list-style-type: none;"><img src="http://cohere.open.ac.uk/jetpack/ui/images/3-connections-16px.png" border="0" style="border-right: 3px;" /><b>Connections</b>: are two ideas that have been associated in a meaningful way.     
     <div style="margin: 0px; padding: 0px; padding-left: 20px;">
     To create a new connection go to the first idea and click the <img src="http://cohere.open.ac.uk/jetpack/ui/images/favorites.png" border="0" style="border-right: 3px;" />bookmark button.
     <br />Then go to the second idea and click the <img src="http://cohere.open.ac.uk/jetpack/ui/images/connection-16px.png" border="0" style="border-right: 3px;" />connection button. 
     <br />This will open a child window with that idea at the top.
     <br />You can then use the bookmark dropdown to select the other idea you bookmarked. <a href="http://www.youtube.com/watch?v=yRw3zN_GypM" target="_blank">Watch Connections Movie</a> 
     </div>
     </li>
     <li style="clear: both; margin-top: 10px; list-style-type: none;"><img src="http://cohere.open.ac.uk/jetpack/ui/images/oercommons.png" border="0" style="border-right: 3px;" /><b>OER Commons Recommendations</b>: are a list of search results from the OER Commons resource. 
     <div style="margin: 0px; padding: 0px; padding-left: 20px;">
     This resource holds aggregations of open educational courses and materials.
     For each page the Cohere Jetpack attempts to list relevant Open Educational Resources (OERs) and allows you to see any Cohere ideas that may have been added against those sites.
     </div>  
    </li>    
    </ul>
    </p>
    </div>
</>).toString()
};
 
// Import the jetpack libraries needed 
jetpack.future.import("storage.settings");		    
jetpack.future.import("selection");
jetpack.future.import("menu");
jetpack.future.import("slideBar");

// Global variables
const TAB_IDEA_WIDTH = 367;
const TAB_CLIP_WIDTH = 367;
const TAB_CONN_WIDTH = 467;
const TAB_OER_WIDTH = 348;

const BITLY_KEY = 'R_9fbf2caa780100435afc35753685cd1e';
const BITLY_LOGIN = 'cohere';

const IDEA_TYPE = 0;
const CLIP_TYPE = 1;
const CONN_TYPE = 2;
const OER_TYPE = 3;
const OTHER_TYPE = 4;

const OER_RESULT_COUNT = 20;

// text selection highlight colours
const MY_HIGHLIGHT_COLOR = "#FFFF80"; // yellow
const OTHERS_HIGHLIGHT_COLOR = "#C0FFFF"; // light cyan
const NOTFOUND_HIGHLIGHT_COLOR = "#DEDCDC"; // light gray
const CON_TYPE_HIGHLIGHT_COLOR = "#FF8080"; // light red
const PRO_TYPE_HIGHLIGHT_COLOR = "#C0FFC0"; // light green
const SELECTION_COLOR = "lightyellow"; // light yellow

// Item (idea/clip/connection/oer) background colours
const IDEA_BACKGROUND_COLOR = "#E9F3F3"; //pale cyan
const CLIP_BACKGROUND_COLOR = "#FAF0F6"; // pale pink
const CONNECTION_BACKGROUND_COLOR = "#E9F3F3"; //pale cyan
const OER_BACKGROUND_COLOR = "white"; //pale yellow

const CON_TYPE_LABEL = "Con";
const PRO_TYPE_LABEL = "Pro";
const WARNING_ICON_GREEN = 'http://cohere.open.ac.uk/jetpack/ui/images/warning-green.ico';
const WARNING_ICON_PINK = 'http://cohere.open.ac.uk/jetpack/ui/images/warning-pink.ico';
const TWITTER_ICON = 'http://cohere.open.ac.uk/jetpack/ui/images/twitter.ico';

const helpPreFix = 'data:text/html;charset=utf-8,<!DOCTYPE HTML PUBLIC "-%2F%2FW3C%2F%2FDTD HTML 4.0%2F%2FEN">%0D%0A<html lang%3D"en">%0D%0A <head>%0D%0A  <title>Cohere Jetpack Help<%2Ftitle>%0D%0A  <style type%3D"text%2Fcss">%0D%0A  <%2Fstyle>%0D%0A <%2Fhead>%0D%0A <body>';
const helpPostFix = '<%2Fbody>%0D%0A<%2Fhtml>%0D%0A';

var	jumpNode;
var	jumpClip;
var	jumpType;	

var dateCode = {};

// "import" formatdate.js code from Cohere server
$.get("http://cohere.open.ac.uk/includes/dateformat.js", function(data, status) {
	eval(data);	
	dateCode.dateFormat = dateFormat;		
});

// Browser Window specific variables
// - so I will need a set of these for each window
//   when I figure the multiple window problem out
var oldTabURL = "";

var ideasStatusBar;
var clipsStatusBar;
var connectionsStatusBar;
var oerStatusBar;

var ideasSlideBar;
var clipsSlideBar;
var connectionsSlideBar;
var oerSlideBar;

// I have no idea which window sent these events, 
// and therefore no idea which slidebar to update 
// even if I had stored more than one set of them for each window.
jetpack.tabs.onFocus(function(d) {
	updateCoherePlugin(this.url);
});

jetpack.tabs.onReady(function(d) {
	updateCoherePlugin(this.url);
});

// add styles for highlight colours to all pages 
// THIS IS 'WORK IN PROGRESS' AND CURRENTLY DOES NOT WORK
/*
 jetpack.future.import("pageMods");
 var callback = function(document){
	var head = document.getElementsByTagName('head')[0];
	if (head) {
    	$(head).append('<link rel="stylesheet" href="http://cohere.open.ac.uk/jetpack/ui/highlights.css" type="text/css" />');
    }
};
var options = {};

options.matches = ['http://*', 'https://*'];
jetpack.pageMods.add(callback, options);
*/

/**************** UI ELEMENTS *******************/

/*** STATUS BARS ***/
/**
 * The Ideas status entry
 */
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
                background-color: transparent;
            }
            .statuslabel{
            	text-align: middle;
                vertical-align: top;
                background-color: transparent;
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

/**
 * The Clips status entry
 */
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
                background-color: transparent;
            }
            .statuslabel{
            	text-align: middle;
                vertical-align: top;
                background-color: transparent;
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

/**
 * The Connections status entry
 */
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
                background-color: transparent;
            }
            .statuslabel{
            	text-align: middle;
                vertical-align: top;
                background-color: transparent;
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

/**
 * The OER status entry
 */
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
                background-color: transparent;
            }
            .statuslabel{
            	text-align: middle;
                vertical-align: top;
                background-color: transparent;
            }
        </style>
        <div id='oerstatusbar' class="statusbar">
 			<label id='cohere-oer-status' class='statuslabel' title='Number of Recommened Open Educational Resources against this webpage'> 0 </label>               
            <img id='cohere-oer-status-img' src='http://cohere.open.ac.uk/jetpack/ui/images/oercommons.png' alt='ideas' border='0' title='Recommended OERs' />
        </div>
    	]]></>).toString(),
  	onReady: function(bar) { 
  		// work around until I figure out the multiple windows issue
  		if (oerStatusBar == null) {
	    	oerStatusBar = bar;   
	    	//As title arrtibute broken in jetpack on the status bar, using notifcations as tooltip for now
	    	var statusbar = bar.getElementById('oerstatusbar');
	    	$(statusbar).bind("mouseover", function() {jetpack.notifications.show({title:"Cohere", body:'This shows number of Recommended Open Educational Resources against this webpage'})} );
	    }
    }
});

/*** SIDEBARS ****/
/**
 * The Ideas slidebar
 */
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
            	width: 349px;
            	height: 99%;
            	border: 1px solid gray;
            }
            .coherecountbar {
             	height: 28px;
            	padding-top: 3px; 
            	padding-left: 3px;
            	border-bottom: 1px solid gray; 
            	background-color: white;
            	line-height: 1.5em;
            }
            .coherecountlabel {
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 8pt;
            	vertical-align: middle;
            }
            .coherecounturl {
            	background-color: #E9F3F3;
            	border: 1px solid gray; 
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 8pt;
            	width: 145px;
            }
            .cohereselectionbar {
            	height: 24px;
            	padding-top: 3px;
            	background-color: transparent; /*#FFFED9;*/
            }
            .cohereslidelist {
            	width: 349px; 
            	height: 90%; 
            	overflow: auto; 
            	background: transparent; 
            	border-top: 1px solid gray
            }
            .selectlabel { 
             	font-family: Tahoma, verdana, arial, helvetica;
				font-size: 8pt;
				margin: 3px;	   			
				background-color: transparent;		
            }
            .cohereaddbutton {
            	margin: 0px;
            	padding: 0px;
            	vertical-align: middle;
             }
         </style>
		<div id='cohere-ideas-tooltip' class='coheretooltip'></div>
		<div id='cohere-ideas-wrapper' class='coherewrapper'>
	 		<div id='cohere-idea-count' class='coherecountbar'>
	 			<label id='cohere-idea-count-label' class='coherecountlabel'> </label>
	 			<label class='coherecountlabel'> Ideas for: </label>
	 			<input id='cohere-idea-count-field' class='coherecounturl' type='text' value='' readonly></input>
	  			<button id='cohere-idea-add_button' title="Login to Create Idea" class='cohereaddbutton' disabled><img alt="Create Idea" id='cohere-idea-add_button_img' src="http://cohere.open.ac.uk/jetpack/ui/images/add-an-idea-disabled.png" border="0" /></button>
	  			<button id='cohere-idea-login_button' title="Login to Cohere" class='cohereaddbutton'><img alt="Login to Cohere" src="http://cohere.open.ac.uk/jetpack/ui/images/cohere-logo-16.png" border="0" /></button>
	  			<button id='cohere-idea-help_button' title="View Cohere Jetpack help" class='cohereaddbutton'><img alt="Cohere Jetpack help" src="http://cohere.open.ac.uk/images/info.png" border="0" /></button>
	 		</div>
	 		<div id='cohere-idea-selectiondiv' class='cohereselectionbar'></div>
	 		<div id='cohere-ideas-sidelist' class='cohereslidelist'></div>
		</div>  			
		]]></>).toString(),  	
  	onReady: function(slide) {
  		// work around until I figure out the multiple windows issue
  		if (ideasSlideBar == null) {
 			ideasSlideBar = slide;
			addIdeaToolbarItems(slide);
		}
	},		
});

/**
 * The Clips slidebar
 */
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
            	width: 349px;
            	height: 99%;
            	border: 1px solid gray;
            }
            .coherecountbar {
             	height: 28px;
            	padding-top: 3px; 
            	padding-left: 3px;
            	border-bottom: 1px solid gray; 
            	background-color: white;
            	line-height: 1.5em;
            }
            .coherecountlabel {
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 8pt;
            	vertical-align: middle;
            }
            .coherecounturl {
            	background-color: #E9F3F3;
            	border: 1px solid gray; 
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 8pt;
            	width: 145px;
            }
            .cohereselectionbar {
            	height: 24px;
            	padding-top: 3px;
            	background-color: transparent; /*#FFFED9;*/
            }
            .cohereslidelist {
            	width: 349px; 
            	height: 90%; 
            	overflow: auto; 
            	background: transparent; 
            	border-top: 1px solid gray
            }
            .selectlabel { 
             	font-family: Tahoma, verdana, arial, helvetica;
				font-size: 8pt;
				margin: 3px;	   			
				background-color: transparent;		
            }
            .cohereaddbutton {
            	margin: 0px;
            	padding: 0px;
            	vertical-align: middle;
            }
        </style>
  		<div id='cohere-clips-tooltip' class='coheretooltip'></div>
  		<div id='cohere-clips-wrapper' class='coherewrapper'>
  			<div id='cohere-clip-count' class='coherecountbar'>
  				<label id='cohere-clip-count-label' class='coherecountlabel'> </label>
   				<label class='coherecountlabel'> Clips for: </label>
  				<input id='cohere-clip-count-field' class='coherecounturl' type='text' value='' readonly></input>
	  			<button id='cohere-clip-add_button' title="Login in to Create Clip of selected text" class='cohereaddbutton' disabled><img alt="Create Clip" id='cohere-clip-add_button_img' src="http://cohere.open.ac.uk/jetpack/ui/images/clip-disabled.png" border="0" /></button>
	  			<button id='cohere-clip-login_button' title="Login/Logout of Cohere" class='cohereaddbutton'><img alt="Login/Logout of Cohere" src="http://cohere.open.ac.uk/jetpack/ui/images/cohere-logo-16.png" border="0" /></button>
	  			<button id='cohere-clip-help_button' title="View Cohere Jetpack help" class='cohereaddbutton'><img alt="Cohere Jetpack help" src="http://cohere.open.ac.uk/images/info.png" border="0" /></button>
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
			addClipToolbarItems(slide);
			
			var dropzone = clipsSlideBar.contentDocument.getElementById('cohere-clips-sidelist');
			dropzone.addEventListener("drop", function (e) { return processClipDrop(e) } , false);
			dropzone.addEventListener("dragenter", function (e) { e.preventDefault(); return false } , false);
			dropzone.addEventListener("dragover", function (e) { e.preventDefault(); return false } , false);
		}
  	},
});

/**
 * The Connections slidebar
 */
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
            	width: 450px;
            	height: 99%;
            	border: 1px solid gray;
            }
            .coherecountbar {
             	height: 28px;
            	padding-top: 3px; 
            	padding-left: 3px;
            	border-bottom: 1px solid gray; 
            	background-color: white;
            	line-height: 1.5em;
            }
            .coherecountlabel {
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 8pt;
            	vertical-align: middle;
            }
            .coherecounturl {
            	background-color: #E9F3F3;
            	border: 1px solid gray; 
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 8pt;
            	width: 145px;
            }
            .cohereselectionbar {
            	height: 24px;
            	padding-top: 3px;
            	background-color: transparent; /*#FFFED9;*/
            }
            .cohereslidelist {
            	width: 450px; 
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
				font-size: 8pt;
				margin: 3px;	   			
				background-color: transparent;		
            }
            .cohereaddbutton {
            	margin: 0px;
            	padding: 0px;
            	vertical-align: middle;
            }
        </style>
  		<div id='cohere-connections-tooltip' class='coheretooltip'></div>
  		<div id='cohere-connections-wrapper' class='coherewrapper'>
	  		<div id='cohere-connection-count' class='coherecountbar'>
  				<label id='cohere-connection-count-label' class='coherecountlabel'> </label>
  				<label class='coherecountlabel'> Connections for: </label>
  				<input id='cohere-connection-count-field' class='coherecounturl' type='text' value='' readonly></input>
	  			<button id='cohere-connection-add_button' title="Login in to Create Connection" class='cohereaddbutton' disabled><img alt="Create Connection" id='cohere-connection-add_button_img' src="http://cohere.open.ac.uk/jetpack/ui/images/connection-16px-disabled.png" border="0" /></button>
	  			<button id='cohere-connection-login_button' title="Login/Logout of Cohere" class='cohereaddbutton'><img alt="Login/Logout of Cohere" src="http://cohere.open.ac.uk/jetpack/ui/images/cohere-logo-16.png" border="0" /></button>
	  			<button id='cohere-connection-help_button' title="View Cohere Jetpack help" class='cohereaddbutton'><img alt="Cohere Jetpack help" src="http://cohere.open.ac.uk/images/info.png" border="0" /></button>
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
			addConnectionToolbarItems(slide);
	
			//resize list panel depending on height		
			//var window = jetpack.tabs.focused.contentWindow;
			//var height = window.screen.availHeight - (300+255);
			//connectionsSlideBar.contentDocument.getElementById('cohere-connections-sidelist').style.height = height;
			
			//addFlashConnections();
		}
  	},
});

/**
 * The OER slidebar
 */
jetpack.slideBar.append({
  	icon: "http://cohere.open.ac.uk/jetpack/ui/images/oercommons.png",
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
            	width: 330px;
            	height: 99%;
            	border: 1px solid gray;
            }
            .coherecountbar {
             	height: 28px;
            	padding-top: 3px; 
            	padding-left: 3px;
            	border-bottom: 1px solid gray; 
            	background-color: white;
            	line-height: 1.5em;
            }
            .coherecountlabel {
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 8pt;
            	vertical-align: middle;
            }
            .coherecounturl {
            	background-color: #E9F3F3;
            	border: 1px solid gray; 
            	font-family: Tahoma, verdana, arial, helvetica; 
            	font-size: 8pt;
            	width: 145px;
            }
            .coheretoolbarbar {
            	height: 24px;
            	background-color: transparent; 
            }
            .coherebannerbar {
            	height: 41px;
            	background-color: transparent; 
            }
            .cohereslidelist {
            	width: 330px; 
            	height: 80%; 
            	overflow: auto; 
            	background: transparent; 
            	border-top: 1px solid gray;
            }
            .selectlabel { 
             	font-family: Tahoma, verdana, arial, helvetica;
				font-size: 8pt;
				margin: 3px;	   			
				background-color: transparent;		
            }
            .cohereaddbutton {
            	margin: 0px;
            	padding: 0px;
            	vertical-align: middle;
            }
        </style>
  		<div id='cohere-oer-tooltip' class='coheretooltip'></div>
  		<div id='cohere-oer-wrapper' class='coherewrapper'>
	  		<div id='cohere-oer-count' class='coherecountbar'>
  				<label id='cohere-oer-count-label' class='coherecountlabel'> </label>
  				<label class='coherecountlabel'> OER Results for: </label>
  				<input id='cohere-oer-count-field' class='coherecounturl' type='text' value='' readonly></input>
	  			<button id='cohere-oer-help_button' title="View Cohere Jetpack help" class='cohereaddbutton'><img alt="Cohere Jetpack help" src="http://cohere.open.ac.uk/images/info.png" border="0" /></button>
	  		</div>
	  		<div id='cohere-oer-bannerdiv' class='coherebannerbar'></div>
	  		<div id='cohere-oer-toolbardiv' class='coheretoolbarbar'></div>
	  		<div id='cohere-oer-sidelist' class='cohereslidelist'></div>
  		</div>
  		]]></>).toString(),
  	width: TAB_OER_WIDTH,
  	persist: true,
  	onReady: function(slide) {
   		// work around until I figure out the multiple windows issue
  		if (oerSlideBar == null) {
  			oerSlideBar = slide;
  			addOERToolbarItems(slide);
		}
  	},
});

/*** TOOLBAR ***/
// MB: to be added when jetpack implements new toolbar creation

/*** MENUS ***/

var coherecontextmenu = new jetpack.Menu([
  {
    label: "Create Clip",
    mnemonic: "p",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/clip.png",
    command: function () cohereConnection.createClip(),
  },
  {
    label: "Create Idea",
    mnemonic: "I",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/add.png",
    command: function () cohereConnection.createIdea(),
  },
  {
    label: "Create Connection",
    mnemonic: "C",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/connection-16px.png",
    command: function () cohereConnection.createConnection(),
  },
]);


var cohereConnectionmenu = new jetpack.Menu([
  {
    label: "Login",
    mnemonic: "l",
    command: function () cohereConnection.login(),
  },
  {
    label: "Create Clip",
    mnemonic: "p",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/clip.png",
    command: function () cohereConnection.createClip(),
  },
  {
    label: "Create Idea",
    mnemonic: "I",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/add.png",
    command: function () cohereConnection.createIdea(),
  },
  {
    label: "Create Connection",
    mnemonic: "C",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/connection-16px.png",
    command: function () cohereConnection.createConnection(),
  },
  {
    label: "My Cohere",
    mnemonic: "m",
    disabled: true,
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/profile.png",
    command: function () cohereConnection.openMyCohere(),
  },
  null,
  {
    label: "Cohere Home",
    mnemonic: "h",
    icon: "http://cohere.open.ac.uk/jetpack/ui/images/cohere_hourglass16x16.png",
    command: function () cohereConnection.openCohere(),
   }
]);

/**
 * Add the main Cohere Jetpack menu to the tools menu
 */
jetpack.menu.tools.add({
  label: "Cohere Jetpack",
  mnemonic: "o",
  menu: cohereConnectionmenu,
});

/**
 * Add the Cohere Jetpack context menu
 */
 jetpack.menu.context.page.add( {
  label: "Cohere Jetpack",
  mnemonic: "o",
  menu: coherecontextmenu, 
});

/*** UI BUILDER/HELPER METHODS ***/

/**
 * If the current URL of the focus tab is different from the last one checked.
 * Check the users login status and reload all the slidebar data.
 * @param eventURL the url of the tab that fired the onReady or onFocus event that called this function.
 */
function updateCoherePlugin(eventURL) {	

	var newURL = cohereConnection.getURL();
	
	// only process event for currently selected tab.
	
	if (newURL != eventURL) {
		return;
	}
	
	// Block child window calls
	if(newURL.length >= 32 && newURL.substr(0, 32) == "http://cohere.open.ac.uk/plugin/") {
		return;	
	}

	if (newURL.substring(0, 5) == "data:") {
		clearCohereSidePanel();
		return;
	}

	//jetpack.tabs.focused.contentWindow.alert("newURL="+newURL);
	//jetpack.tabs.focused.contentWindow.alert("eventURL="+eventURL);
	//jetpack.tabs.focused.contentWindow.alert("oldTabURL="+oldTabURL);

	if(oldTabURL != newURL && newURL != "about:blank" ) {
		oldTabURL = newURL;
		cohereConnection.checkLogin();
	} else if (newURL == "about:blank" && oldTabURL != "") {
		clearCohereSidePanel();
	}	 							    		
}

/**
 * Show the given tooltip
 * @param tooltip the tip object to show
 */
function showTooltip(tooltip) {	
	//$(tooltip).fadeIn('slow');
	if (tooltip.innerHTML != "") {
		tooltip.style.display = "block";
	}
}

/**
 * Hide the given tooltip
 * @param tooltip the tip object to hide
 */
function hideTooltip(tooltip) {	
	//$(tooltip).fadeOut('slow');
	tooltip.style.display = "none";
}

/**
 * Show / hide tooltips
 * @param event the event that evoked the tooltip
 */
//MB: work around until title tooltips in slidebars bug is fixed in jetpack
function tooltipToggle(event) {
	var tooltip;
	var width = 0;
	var title = this.title;
	if (this.parentarea == IDEA_TYPE) {
		tooltip = ideasSlideBar.contentDocument.getElementById('cohere-ideas-tooltip');
		width = TAB_IDEA_WIDTH;
	} else if (this.parentarea == CLIP_TYPE) {
		tooltip = clipsSlideBar.contentDocument.getElementById('cohere-clips-tooltip');
		width = TAB_CLIP_WIDTH;
	} else if (this.parentarea == CONN_TYPE){
		tooltip = connectionsSlideBar.contentDocument.getElementById('cohere-connections-tooltip');
		width = TAB_CONN_WIDTH;
	} else if (this.parentarea == OER_TYPE){
		tooltip = oerSlideBar.contentDocument.getElementById('cohere-oer-tooltip');
		width = TAB_OER_WIDTH;
	}
	
	if (tooltip) {
		if (event.type == 'mouseover' && title && title != "") {
			if (event.clientX+10+150 > width) {
				tooltip.style.left = (event.clientX-10) - 150;
			} else {
				tooltip.style.left = event.clientX+10;
			}
			// MB: how to detect height of slidebar and 
			// make sure does not go off page below?
			tooltip.style.top = event.clientY+5;
			tooltip.innerHTML = title;

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

	var newRequestBase = cohereConnection.getBase();
	var flashMovie = connectionsSlideBar.contentDocument.getElementById('flashMovie');
		
	applet = connectionsSlideBar.contentDocument.createElement('applet');
 	applet.setAttribute('id','Cohere-ConnectionNet');
 	applet.setAttribute('name','Cohere-ConnectionNet');
  	applet.setAttribute('archive', cohereConnection.getBase()+'jetpack/hello.jar');
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
 * Create ideas selection toolbar and add button event handlers.
 * @param slide the slide bar  to add the toolbar to
 */
function addIdeaToolbarItems(slide) {
	var doc = slide.contentDocument;
	var selectionmenu = doc.getElementById('cohere-idea-selectiondiv');
	
	if (selectionmenu) {
	    // add clear bookmarks button here as there is a bit of space.
		var button = doc.createElement("button");
		var img = doc.createElement("img");
		var img = doc.createElement("img");
		if (cohereConnection.user && cohereConnection.session) {
			button.removeAttribute('disabled');
			img.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/minus-favourites.png');
		} else {
			button.setAttribute('disabled', 'true');
			img.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/minus-favourites-disabled.png');
		}
		button.setAttribute('type', 'submit');
		button.setAttribute('id', 'clear_bookmarks');
		button.setAttribute('title', 'Unbookmark All Your Bookmarks');
		button.appendChild(img);
		button.style.margin = "0px";
		button.style.marginRight = "3px";
		button.style.padding = "0px";
		button.style.cssFloat = "left";	
		//button.style.cursor = "pointer";
		button.parentarea = IDEA_TYPE;
		$(button).bind("mouseover", tooltipToggle);	
		$(button).bind("mouseout", tooltipToggle);													
		$(button).bind("click", function() { cohereConnection.clearBookmarks(); });													
	    selectionmenu.appendChild(button);	

	    selectionmenu.appendChild(createSelectionLabel(doc, 'Select: '));

		var allitem = createSelectionButton(doc, 'cohere-idea-selectall-btn', 'All');
		$(allitem).bind("click", selectAllIdeas);	    					
	    selectionmenu.appendChild(allitem);

		var myitem = createSelectionButton(doc, 'cohere-idea-selectmy-btn', 'My');
		if (cohereConnection.user && cohereConnection.session) {
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
	
	var myideaaddbutton = doc.getElementById('cohere-idea-add_button');
	if (myideaaddbutton) {
		myideaaddbutton.parentarea = IDEA_TYPE;
		//myideaaddbutton.style.cursor = "pointer";		
		$(myideaaddbutton).bind("mouseover", tooltipToggle);	
		$(myideaaddbutton).bind("mouseout", tooltipToggle);													
		$(myideaaddbutton).bind("click", function() { cohereConnection.createIdea(); });													
	}

	var myidealoginbutton = doc.getElementById('cohere-idea-login_button');
	if (myidealoginbutton) {
		myidealoginbutton.parentarea = IDEA_TYPE;
		$(myidealoginbutton).bind("mouseover", tooltipToggle);	
		$(myidealoginbutton).bind("mouseout", tooltipToggle);	
		$(myidealoginbutton).bind("click", function() { cohereConnection.quicklogin(); });													
	}
	
	var myhelpbutton = doc.getElementById('cohere-idea-help_button');
	if (myhelpbutton) {
		myhelpbutton.parentarea = IDEA_TYPE;
		$(myhelpbutton).bind("mouseover", tooltipToggle);	
		$(myhelpbutton).bind("mouseout", tooltipToggle);	
		$(myhelpbutton).bind("click", function() { openHelp(); });													
	}
}

/**
 * Create clips selection toolbar and add event handlers for add button.
 * @param slide the slide bar  to add the toolbar to
 */
function addClipToolbarItems(slide) {
	var doc = slide.contentDocument;
	var selectionmenu = doc.getElementById('cohere-clip-selectiondiv');
	
	if (selectionmenu) {
	    selectionmenu.appendChild(createSelectionLabel(doc, 'Select: '));

		var allitem = createSelectionButton(doc, 'cohere-clip-selectall-btn', 'All');
		$(allitem).bind("click", selectAllClips);	    					
	    selectionmenu.appendChild(allitem);

		var myitem = createSelectionButton(doc, 'cohere-clip-selectmy-btn', 'My');
		if (cohereConnection.user && cohereConnection.session) {
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
	
	var myclipaddbutton = doc.getElementById('cohere-clip-add_button');
	if (myclipaddbutton) {
		myclipaddbutton.parentarea = CLIP_TYPE;
		$(myclipaddbutton).bind("mouseover", tooltipToggle);	
		$(myclipaddbutton).bind("mouseout", tooltipToggle);													
		$(myclipaddbutton).bind("click", function() { 
			cohereConnection.createClip();
		});													
	}	
	
	var mycliploginbutton = doc.getElementById('cohere-clip-login_button');
	if (mycliploginbutton) {
		mycliploginbutton.parentarea = CLIP_TYPE;
		$(mycliploginbutton).bind("mouseover", tooltipToggle);	
		$(mycliploginbutton).bind("mouseout", tooltipToggle);	
		$(mycliploginbutton).bind("click", function() { cohereConnection.quicklogin(); });													
	}

	var myhelpbutton = doc.getElementById('cohere-clip-help_button');
	if (myhelpbutton) {
		myhelpbutton.parentarea = CLIP_TYPE;
		$(myhelpbutton).bind("mouseover", tooltipToggle);	
		$(myhelpbutton).bind("mouseout", tooltipToggle);	
		$(myhelpbutton).bind("click", function() { openHelp(); });													
	}										
}

/**
 * Create Connection selection toolbar and add handlers for the add new Button.
 * @param slide the slide bar  to add the toolbar to
 */
function addConnectionToolbarItems(slide) {
	var doc = slide.contentDocument;
	var selectionmenu = doc.getElementById('cohere-connection-selectiondiv');
	if (selectionmenu) {
	    selectionmenu.appendChild(createSelectionLabel(doc, 'Select: '));

		var allitem = createSelectionButton(doc, 'cohere-conn-selectall-btn', 'All');
		$(allitem).bind("click", selectAllConnectionIdeas);	    					
	    selectionmenu.appendChild(allitem);

		var myitem = createSelectionButton(doc, 'cohere-conn-selectmy-btn', 'My');
		if (cohereConnection.user && cohereConnection.session) {
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
	var myconnaddbutton = doc.getElementById('cohere-connection-add_button');
	if (myconnaddbutton) {
		myconnaddbutton.parentarea = CONN_TYPE;
		$(myconnaddbutton).bind("mouseover", tooltipToggle);	
		$(myconnaddbutton).bind("mouseout", tooltipToggle);													
		$(myconnaddbutton).bind("click", function() { cohereConnection.createConnection(); });													
	}											
	var myconnloginbutton = doc.getElementById('cohere-connection-login_button');
	if (myconnloginbutton) {
		myconnloginbutton.parentarea = IDEA_TYPE;
		$(myconnloginbutton).bind("mouseover", tooltipToggle);	
		$(myconnloginbutton).bind("mouseout", tooltipToggle);	
		$(myconnloginbutton).bind("click", function() { cohereConnection.quicklogin(); });													
	}											

	var myhelpbutton = doc.getElementById('cohere-connection-help_button');
	if (myhelpbutton) {
		myhelpbutton.parentarea = CONN_TYPE;
		$(myhelpbutton).bind("mouseover", tooltipToggle);	
		$(myhelpbutton).bind("mouseout", tooltipToggle);	
		$(myhelpbutton).bind("click", function() { openHelp(); });													
	}										
}

/**
 * Create oer slidebar header image and inner toolbar.
 * @param slide the slide bar  to add the toolbar to
 */
function addOERToolbarItems(slide) {
	var doc = slide.contentDocument;
	var selectionmenu = doc.getElementById('cohere-oer-bannerdiv');
	var newRequestBase = cohereConnection.getBase();

	var myhelpbutton = doc.getElementById('cohere-oer-help_button');
	if (myhelpbutton) {
		myhelpbutton.parentarea = OER_TYPE;
		$(myhelpbutton).bind("mouseover", tooltipToggle);	
		$(myhelpbutton).bind("mouseout", tooltipToggle);	
		$(myhelpbutton).bind("click", function() { openHelp(); });													
	}

	var image = ideasSlideBar.contentDocument.createElement("img");
	image.setAttribute('border','0');
	image.setAttribute('src', newRequestBase+"jetpack/ui/images/oercommonsheader_sm.png");	
	image.url = "http://www.oercommons.org/";     				
	$(image).bind("click", loadPage);
	image.style.paddingRight = "5px";
	image.style.cursor = 'pointer';	
	selectionmenu.appendChild(image);
		
	var toolbar = doc.getElementById('cohere-oer-toolbardiv');
	var fullbutton = createSelectionButton(doc, 'cohere-oer-full', "View Full Results");
	fullbutton.url = "";
	$(fullbutton).bind("click", loadPage);	 
	fullbutton.style.marginTop = "2px";
	fullbutton.setAttribute('disabled','true');
	toolbar.appendChild(fullbutton);	
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
	button.style.fontSize = "8pt";
	//button.style.cursor = "pointer";
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
 * @param newURL the context
 */
function refreshUI(newURL) {
	//now daisy chained calls
	// ideas will call clips and clips will call connections
	refreshIdeasUI(newURL);
}

/**
 * Reload the ideas tab and drop down ui elements.
 * @param newURL the context
 */
function refreshIdeasUI(newURL) {
	clearCohereIdeaTab();	
	
   	var cohereIdeasCountLabel = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-label');
   	var cohereIdeasCountField = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-field');	
	var sidelist = ideasSlideBar.contentDocument.getElementById('cohere-ideas-sidelist');
 	var statuslabel = ideasStatusBar.getElementById('cohere-idea-status');
	addIdeasToUI(IDEA_TYPE, newURL, sidelist, true, cohereIdeasCountLabel, cohereIdeasCountField, statuslabel, false);
}

/**
 * Reload the clips tab ui elements.
 * @param newURL the context
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
 * Reload the oer tab ui elements.
 * @param newURL the context
 */
function refreshOERUI(newURL) {	
	clearCohereOERTab();
	addOERToUI(newURL);
}

/**
 * Clear the ideas and clips tabs out ready for reloading
 */
function clearCohereSidePanel(){
	clearCohereIdeaTab();
	clearCohereClipsTab();
	clearCohereConnectionsTab();
	clearCohereOERTab();
}

/**
 * Clear the ideas tab out ready for reloading
 */
function clearCohereIdeaTab(){	
   	var cohereIdeasCountLabel = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-label');
   	var cohereIdeasCountField = ideasSlideBar.contentDocument.getElementById('cohere-idea-count-field');
   	cohereIdeasCountLabel.innerHTML = "";
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
   	cohereClipsCountLabel.innerHTML = "";
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
	cohereConnectionsCountLabel.innerHTML = "";
	cohereConnectionsCountField.value = "";	

	var connectionslist = connectionsSlideBar.contentDocument.getElementById('cohere-connections-sidelist');
	if (connectionslist && connectionslist.hasChildNodes()) {
		while ( connectionslist.childNodes.length >= 1 ) {
			connectionslist.removeChild( connectionslist.firstChild ); 
		}
	}
}

/**
 * Clear the oers tab out ready for reloading
 */
function clearCohereOERTab(){	
  	var cohereOerCountLabel = oerSlideBar.contentDocument.getElementById('cohere-oer-count-label');
	var cohereOerCountField = oerSlideBar.contentDocument.getElementById('cohere-oer-count-field');
	cohereOerCountLabel.innerHTML = "";
	cohereOerCountField.value = "";	

	var oerlist = oerSlideBar.contentDocument.getElementById('cohere-oer-sidelist');
	if (oerlist && oerlist.hasChildNodes()) {
		while ( oerlist.childNodes.length >= 1 ) {
			oerlist.removeChild( oerlist.firstChild ); 
		}
	}
}

/**
 * Add the ideas list for the given url to the given panel
 */
function addIdeasToUI(contextType, newURL, sidelist, shouldRefreshClipsUI, cohereIdeasCountLabel, cohereIdeasCountField, statuslabel, addNoIdeasMessage) {
	if (cohereIdeasCountLabel) {
		cohereIdeasCountLabel.innerHTML = "0";
	}
	if (cohereIdeasCountField) {
		cohereIdeasCountField.value = newURL.substring(7, newURL.length);
	}
	if (statuslabel) {
		statuslabel.innerHTML = "0";
	}
	
	var currentURL =  cohereConnection.getURL();
	var newRequestBase = cohereConnection.getBase();
	var newRequestUrl = newRequestBase + "api/service.php?format=json&method=getnodesbyurl&style=long&url="+encodeURIComponent(newURL);
	
	//jetpack.tabs.focused.contentWindow.alert("Getting idea data="+newRequestUrl);  							    		
	$.ajax({
	    url: newRequestUrl,
	    type: 'GET',
	    dataType: 'json',
	    timeout: 10000,
	    error: function(request, error){
	     	jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Idea data due to: '+error+" status:"+request.status, icon: WARNING_ICON_GREEN});
 	    	return;   
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
    					mainbox.style.background = IDEA_BACKGROUND_COLOR;
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
 	     				nodetype.parentarea = contextType;
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
						separator.style.opacity = "0.5";
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
	    					morelabel.style.marginLeft = "280px";
	    					morelabel.box = textbox;
							$(morelabel).bind("click", cohereMoreText);	    				
							mainbox.appendChild(morelabel);
	    				}
 						
						var ideatoolbar = ideasSlideBar.contentDocument.createElement("div");	
						ideatoolbar.style.clear="both";								       													     																			     	
						ideatoolbar.style.borderTop="1px dashed gray";							
					    mainbox.appendChild(ideatoolbar);	
	     			   	
	     			   	if (node.description && node.description != "") {
	   			   			var descriptionboxhidden = ideasSlideBar.contentDocument.createElement("div");
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
							descbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-down-green.png');
	   						descbutton.setAttribute('alt', 'Show/Hide Description');
	   						descbutton.setAttribute('title', 'Show/Hide Description');
							descbutton.style.cursor = 'pointer';	   						
							descbutton.style.margin = '3px';	   						
							descbutton.box = descriptionboxhidden;							
							descbutton.parentarea = contextType;
  							$(descbutton).bind("click", switchGreenBoxVisibility);
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

		       				var clipboxhidden = ideasSlideBar.contentDocument.createElement("div");

							var toggleButton = ideasSlideBar.contentDocument.createElement("img");
							toggleButton.setAttribute('id', 'cohere-showhide-btn'+node.nodeid);
							if (jumpType == IDEA_TYPE && contextType == IDEA_TYPE && jumpNode == node.nodeid) {
								toggleButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-up.png');
							} else { 
								toggleButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-down.png');
							}
							toggleButton.setAttribute('alt', 'Show/Hide Clips/Websites');
							toggleButton.setAttribute('title', 'Show/Hide Clips/Websites');
							toggleButton.style.cursor = 'pointer';	   						
							toggleButton.style.margin = '3px';	   						
							toggleButton.box = clipboxhidden;
 							$(toggleButton).bind("click", switchPinkBoxVisibility);	    				
 							toggleButton.parentarea = contextType;
							$(toggleButton).bind("mouseover", tooltipToggle);	
							$(toggleButton).bind("mouseout", tooltipToggle);														    				
						    
							ideatoolbar.appendChild(toggleButton);

							if (jumpType == IDEA_TYPE && contextType == IDEA_TYPE && jumpNode == node.nodeid) {
		   						clipboxhidden.style.display = 'block';
							} else {
	   							clipboxhidden.style.display = 'none';								
							}
							clipboxhidden.setAttribute('id', 'clipbox'+node.nodeid);
	   						clipboxhidden.style.clear = "both";
		   					clipboxhidden.style.background = IDEA_BACKGROUND_COLOR; 
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
      							if (node.urls[i].url.url == currentURL) {
      								var titletext;
      								if (label2 != "") {
		    							titletext = ideasSlideBar.contentDocument.createTextNode("source: current page");
		    						} else {	
		    							titletext = ideasSlideBar.contentDocument.createTextNode("source: current page");
		    						}
		    						title.appendChild(titletext);
      					 		} else {
      					 			var url = node.urls[i].url.title;
      					 			if (url.length > 30)
      					 				url = url.substring(0, 30)+"..."; 
		    						var titletext;
		    						if (label2 != "") {		    						
		    							title.label = label2;		    							
		    							titletext = ideasSlideBar.contentDocument.createTextNode("source: "+url);
		    						} else {
		    							titletext = ideasSlideBar.contentDocument.createTextNode("source: "+url);
		    						}
		    						title.appendChild(titletext);
									title.url = node.urls[i].url.url;
									title.nodeid = node.nodeid;
									title.clipid = node.urls[i].url.urlid;
									title.type = IDEA_TYPE;
									title.style.cursor = 'pointer';
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
	      							if (node.urls[i].url.url == currentURL) {
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
   			   			if (cohereConnection.user && cohereConnection.session 
								&& cohereConnection.user == node.users[0].user.userid 
									&& node.otheruserconnections && node.otheruserconnections == 0) {															
							editbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/edit.png');
							editbutton.setAttribute('title', 'Edit this Idea');
							editbutton.style.cursor = 'pointer';	   						
							editbutton.nodeid = node.nodeid; 			
							editbutton.box = mainbox;			
							$(editbutton).bind("click", cohereEditIdea);	    				
						} else {
							editbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/edit-disabled.png');
							if (node.otheruserconnections && node.otheruserconnections > 0)	{														
								editbutton.setAttribute('title', 'This idea cannot be edited as it has 1+ connections by other people');
							} else {
								editbutton.setAttribute('title', 'If you are the creator, login to Edit this Idea');
							}
						}
 	     				editbutton.parentarea = contextType;
						$(editbutton).bind("mouseover", tooltipToggle);	
						$(editbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(editbutton);

						var deletebutton = ideasSlideBar.contentDocument.createElement("img");
						deletebutton.setAttribute('id', 'cohere-deleteidea-btn');
						deletebutton.setAttribute('alt', 'Delete');
   			   			if (cohereConnection.user && cohereConnection.session 
								&& cohereConnection.user == node.users[0].user.userid 
									&& node.otheruserconnections && node.otheruserconnections == 0) {															
							deletebutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/delete.png');
							deletebutton.setAttribute('title', 'Delete this Idea and its connections');
							deletebutton.style.cursor = 'pointer';	   						
							deletebutton.nodeid = node.nodeid;
							deletebutton.label = label;	
							deletebutton.box = mainbox;
 							$(deletebutton).bind("click", cohereDeleteIdea);	    				
						} else {
							deletebutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/delete-disabled.png');							
							if (node.otheruserconnections && node.otheruserconnections > 0)	{														
								deletebutton.setAttribute('title', 'This idea cannot be deleted as it has 1+ connections by other people');
							} else {
								deletebutton.setAttribute('title', 'If you are the creator, login to Delete this Idea');
							}
						}
						deletebutton.style.margin = '3px';	   				
 	     				deletebutton.parentarea = contextType;
						$(deletebutton).bind("mouseover", tooltipToggle);	
						$(deletebutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(deletebutton);
						
						var toolbarbutton = ideasSlideBar.contentDocument.createElement("img");
						toolbarbutton.setAttribute('id', 'cohere-add-clip-btn');
						toolbarbutton.setAttribute('alt', 'Add Clip');
   			   			if (cohereConnection.user && cohereConnection.session 
								&& cohereConnection.user == node.users[0].user.userid) {
							toolbarbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/clip.png');
							toolbarbutton.setAttribute('title', 'Add selected text as Clip on this idea');
							toolbarbutton.style.cursor = 'pointer';	   						
							toolbarbutton.nodeid = node.nodeid;
 							$(toolbarbutton).bind("click", addNewClipToIdea);	
						} else {
							toolbarbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/clip-disabled.png');
							toolbarbutton.setAttribute('title', 'If you are to creator, login to Add selected text as Clip on this idea');
						}
						toolbarbutton.style.margin = '3px';	   						
 	     				toolbarbutton.parentarea = contextType;
						$(toolbarbutton).bind("mouseover", tooltipToggle);	
						$(toolbarbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(toolbarbutton);
   			   		     
     			   		var bookmark = ideasSlideBar.contentDocument.createElement("img");
						bookmark.setAttribute('id', 'cohere-bookmark-btn');
						bookmark.setAttribute('alt', 'Bookmark');
						bookmark.box = mainbox;						
						if (cohereConnection.user && cohereConnection.session) {
							bookmark.nodeid = node.nodeid;
							bookmark.label = label;
    			   			if (node.isbookmarked != null && node.isbookmarked == true) {
								bookmark.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/favorites.png');
	  							$(bookmark).bind("click", unbookmarkIdea);	
								bookmark.setAttribute('title', 'Unbookmark this idea');
							} else { 
								bookmark.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/favorites-empty.png');
	  							$(bookmark).bind("click", bookmarkIdea);	    				
								bookmark.setAttribute('title', 'Bookmark this idea');
							}
							bookmark.style.cursor = 'pointer';	   						
						} else {
							bookmark.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/favorites-disabled.png');
							bookmark.setAttribute('title', 'Login to Bookmark this idea');
						}
						bookmark.style.margin = '3px';	   						
 	     				bookmark.parentarea = contextType;
						$(bookmark).bind("mouseover", tooltipToggle);	
						$(bookmark).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(bookmark);
    			   		     
						var newconbutton = ideasSlideBar.contentDocument.createElement("img");
						newconbutton.setAttribute('id', 'cohere-newconnection-btn');
						newconbutton.setAttribute('alt', 'Connect');
    			   		if (cohereConnection.user && cohereConnection.session) { 
							newconbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/connection-16px.png');
							newconbutton.setAttribute('title', 'Connect to another Idea');
							newconbutton.style.cursor = 'pointer';	   						
							newconbutton.nodeid = node.nodeid;
							newconbutton.label = label;
							newconbutton.role = node.role[0].role.name;
							newconbutton.box = mainbox;
		  					$(newconbutton).bind("click", cohereShowNewConnection);	    				
						} else {
							newconbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/connection-16px-disabled.png');
							newconbutton.setAttribute('title', 'Login to Connect to another Idea');
						}
						newconbutton.style.margin = '3px';	   						
 	     				newconbutton.parentarea = contextType;
						$(newconbutton).bind("mouseover", tooltipToggle);	
						$(newconbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(newconbutton);
	
						var neighbourhoodbutton = ideasSlideBar.contentDocument.createElement("img");
						neighbourhoodbutton.setAttribute('id', 'cohere-neighbourhood-btn');
						neighbourhoodbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/neighbourhood-16px.png');
	  					neighbourhoodbutton.setAttribute('title', 'View Network Neighbourhood');
	   					neighbourhoodbutton.setAttribute('alt', 'Neighbourhood');
						neighbourhoodbutton.style.cursor = 'pointer';	   						
						neighbourhoodbutton.style.margin = '3px';	 
						neighbourhoodbutton.nodeid = node.nodeid;  						
	 					$(neighbourhoodbutton).bind("click", cohereShowNeighbourhood);	    				
 	     				neighbourhoodbutton.parentarea = contextType;
						$(neighbourhoodbutton).bind("mouseover", tooltipToggle);	
						$(neighbourhoodbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(neighbourhoodbutton);		
											
						var tweetbutton = ideasSlideBar.contentDocument.createElement("img");
						tweetbutton.setAttribute('id', 'cohere-twitter-btn');
						tweetbutton.setAttribute('alt', 'Twitter');
			   			tweetbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/twitter.png');
			   			tweetbutton.setAttribute('title', 'Tweet this Idea');
			   			tweetbutton.style.cursor = 'pointer';	   						
			   			tweetbutton.nodeid = node.nodeid;
			   			tweetbutton.label = label;
	  					$(tweetbutton).bind("click", tweetIdea);	    				
	  					tweetbutton.style.margin = '3px';	   						
	  					tweetbutton.parentarea = contextType;
						$(tweetbutton).bind("mouseover", tooltipToggle);	
						$(tweetbutton).bind("mouseout", tooltipToggle);													
						ideatoolbar.appendChild(tweetbutton);		
						
						// twitter icon
						sidelist.appendChild(mainbox);
    				}  			
    			}
    		} else {
         		if (addNoIdeasMessage) {
					var label = ideasSlideBar.contentDocument.createElement("label");
					var text = ideasSlideBar.contentDocument.createTextNode("No Ideas registered");
					label.appendChild(text);
					label.style.fontSize='8pt';
					label.style.color = '#e80074';
					label.style.backgroundColor = "transparent";
					sidelist.appendChild(label);         			
         		}
    		}
    		 
    		if (cohereIdeasCountLabel) {
    			cohereIdeasCountLabel.innerHTML = ns.nodes.length;
    		}
    		if (statuslabel) {
    			statuslabel.innerHTML = ns.nodes.length;
    		}
 	    	
  	    	if (jumpType == IDEA_TYPE && contextType == IDEA_TYPE && jumpClip && jumpClip != "") { 	    	
 	    		var clip = ideasSlideBar.contentDocument.getElementById('ideaclip'+jumpClip);
 	    		if (clip) {
	 	    		clearAllSelections();
	   				highlightSearchTerms([clip], false); 	    		
 	 	    		clip.previousSibling.scrollIntoView(true);
				}
				jumpType = null;
				jumpNode = null;
				jumpClip = null;
	    	} 	
  	    	
  	    	if (shouldRefreshClipsUI) {
  	    		refreshClipsUI(newURL);
  	    	}
	    } 	    
	});	
}

/**
 * Add the clips for this website to the side panel
 * @param newURL the url associated with this clip ui area
 */
function addClipsToUI(newURL) {
   	var cohereClipsCountLabel = clipsSlideBar.contentDocument.getElementById('cohere-clip-count-label');
   	var cohereClipsCountField = clipsSlideBar.contentDocument.getElementById('cohere-clip-count-field');
   	cohereClipsCountLabel.innerHTML = "0";
   	cohereClipsCountField.value = newURL.substring(7, newURL.length);			    
	var statuslabel = clipsStatusBar.getElementById('cohere-clip-status');
	statuslabel.innerHTML = "0";

	var sidelistclips = clipsSlideBar.contentDocument.getElementById('cohere-clips-sidelist');
   	if (sidelistclips) {	     
		var newRequestBase = cohereConnection.getBase();
		var newRequestUrl = newRequestBase + "api/service.php?format=json&method=getclipsbyurl&url="+encodeURIComponent(newURL);

		$.ajax({
		    url: newRequestUrl,
		    type: 'GET',
		    dataType: 'json',
		    timeout: 10000,
		    error: function(request,error){
		    	jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Clip data due to: '+error+" status:"+request.status, icon: WARNING_ICON_GREEN});
		    	return;
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
						deleteClipButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/delete.png');
						deleteClipButton.setAttribute('alt', 'Delete');
						if (cohereConnection.user && cohereConnection.session 
							&& cohereConnection.user == userid) {													
							deleteClipButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/delete.png');
							//deleteClipButton.setAttribute('width', '15');
							//deleteClipButton.setAttribute('height', '15');
							deleteClipButton.setAttribute('title', 'Delete this clip');
	 						deleteClipButton.style.cursor = 'pointer';	
							deleteClipButton.clipid = us.urls[n].url.urlid;
							deleteClipButton.clipname = label;		
							deleteClipButton.box = mainbox;	
	  						$(deleteClipButton).bind("click", deleteClip);	    				
						} else {
							deleteClipButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/delete-disabled.png');
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
						if (cohereConnection.user && cohereConnection.session 
							&& cohereConnection.user == userid) {													
							addToIdeaButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/add-an-idea.png');
							addToIdeaButton.setAttribute('title', 'Add this clip to an Idea');
							addToIdeaButton.style.cursor = 'pointer';	   						
	 						addToIdeaButton.clipid = us.urls[n].url.urlid;
	 						addToIdeaButton.clipname = label;
	 						addToIdeaButton.box = mainbox;
	  						$(addToIdeaButton).bind("click", addClipToIdea);	    				
						} else {
							addToIdeaButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/add-an-idea-disabled.png');
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
 						separator.style.opacity = "0.5"; 										
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
	    					morelabel.style.marginLeft = "280px";
	    					morelabel.box = textbox;
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
		   		cohereClipsCountLabel.innerHTML = us.urls.length;

 				statuslabel.innerHTML = +us.urls.length;
	    		
				refreshConnectionsUI(newURL);
		    } 		    		     	    		
 		});	
	}	
}

/**
 * Add the connections list for this website to the side panel
 * @param newURL the url associated with this connection ui area
 */
function addConnectionsToUI(newURL) {
  	var cohereConnectionsCountLabel = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-label');
	var cohereConnectionsCountField = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-field');
	cohereConnectionsCountLabel.innerHTML = "0";
	cohereConnectionsCountField.value = newURL.substring(7, newURL.length);	
	var statuslabel = connectionsStatusBar.getElementById('cohere-conn-status');
	statuslabel.innerHTML = "0";
	
	var sidelistcons = connectionsSlideBar.contentDocument.getElementById('cohere-connections-sidelist');
   	if (sidelistcons) {	     
		var newRequestBase = cohereConnection.getBase();	
		var newRequestUrl = newRequestBase + "api/service.php?format=json&method=getconnectionsbyurl&style=long&url=" + encodeURIComponent(newURL);	
		$.ajax({
		    url: newRequestUrl,
		    type: 'GET',
		    dataType: 'json',
		    timeout: 10000,
		    error: function(request,error){
		    	jetpack.notifications.show({title:"Cohere Warning", body:'Error loading Connection data due to: '+error+" status:"+request.status, icon: WARNING_ICON_GREEN});
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
	   					if (connection) {
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
	   							arrow2.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-right-green.png');
	   						} else if (grouplabel == "Negative") {
	   							arrow2.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-right-red.png');
	   						} else if (grouplabel == "Neutral") {
	   							arrow2.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-right-gray.png');
	   						} else {
	   							arrow2.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-right.png');
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
	   			   			if (cohereConnection.user && cohereConnection.session 
									&& cohereConnection.user == connection.userid) {															
								editbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/edit.png');
								editbutton.setAttribute('title', 'Edit this Connection');
								editbutton.style.cursor = 'pointer';	   						
								editbutton.connid = connection.connid; 	
								editbutton.box = connectionbox;					
								$(editbutton).bind("click", cohereEditConnection);	    				
							} else {
								editbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/edit-disabled.png');
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
	   			   			if (cohereConnection.user && cohereConnection.session 
									&& cohereConnection.user == connection.userid) {															
								deletebutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/delete.png');
								deletebutton.setAttribute('title', 'Delete this Connection');
								deletebutton.style.cursor = 'pointer';	   						
								deletebutton.connid = connection.connid;
								deletebutton.box = connectionbox;
								deletebutton.label = fromnode.name+"\n\n"+connection.linktype[0].linktype.label+"\n\n"+tonode.name;	
	 							$(deletebutton).bind("click", cohereDeleteConnection);	    				
							} else {
								deletebutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/delete-disabled.png');							
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
	    		} 
	    		
			  	var cohereConnectionsCountLabel = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-label');
				var cohereConnectionsCountField = connectionsSlideBar.contentDocument.getElementById('cohere-connection-count-field');
				cohereConnectionsCountLabel.innerHTML = count;
				
				statuslabel.innerHTML = count;

				//var flashURL = cohereConnection.getBase()+"jetpack/ui/network/jetpack-conn-net-flash.php?userid="+cohereConnection.user+"&session="+cohereConnection.session+"&url="+encodeURIComponent(newURL);
				//jetpack.tabs.focused.contentWindow.alert(flashURL);
				
				//jetpack.tabs.focused.contentWindow.alert("slidebar = "+networkSlidebar);
				//networkSlidebar.contentDocument.location.href = flashURL;	
				
				//var iframe = connectionsSlideBar.contentDocument.getElementById('flashframe');				
				//iframe.src=flashURL;
				
	 	    	if (jumpType == CONN_TYPE) { 	    	
	 	    		var clip = connectionsSlideBar.contentDocument.getElementById('connectionclip'+jumpClip);
	 	    		if (clip) {
		 	    		clip.previousSibling.scrollIntoView(true);
		 	    		clearAllSelections();
		   				highlightSearchTerms([clip], false); 	    		
					}
					jumpType = null;
					jumpNode = null;
					jumpClip = null;
		    	}	
	 	    	
	 	    	
	 	    	refreshOERUI(newURL);
		    }		    
		});				
	}			
}

/**
 * Create an idea box on a connection.
 * @param connection the Cohere connection object to cerate the idea from
 * @param node the idea on the connection to create
 * @param role the cohere role object associated with the current node (idea)
 * @param newURL the url associated with this connection.
 */
function createConnectionIdea(connection, node, role, newURL) {
	var urlBase = cohereConnection.getBase();

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
	if (labelsmall.length > 65) {
		labelsmall = label.substring(0, 55)+"..."; //need a row for the 'more' button so trim to less.
	}
	
	var mainbox = connectionsSlideBar.contentDocument.createElement("div");
	mainbox.style.cssFloat="left";
	mainbox.style.paddingTop='3px';
	mainbox.style.paddingBottom='5px';
	mainbox.style.paddingLeft='3px';
	mainbox.style.paddingRight='3px';
	mainbox.style.background = CONNECTION_BACKGROUND_COLOR; 
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

	if (node.urls && node.urls.length > 0) {
   		var clipboxhidden = connectionsSlideBar.contentDocument.createElement("div");

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
		toggleButton.style.marginTop = '5px';	
		toggleButton.style.marginRight = '1px';	
		toggleButton.style.cssFloat = "left";   						
		toggleButton.box = clipboxhidden;
		$(toggleButton).bind("click", switchPinkBoxVisibility);	    				
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
		morelabel.style.marginLeft="90px";
		morelabel.box = textbox;
		morelabel.type = CONN_TYPE;
		$(morelabel).bind("click", cohereMoreText);	    				
		textboxdiv.appendChild(morelabel);
	}
 	mainbox.appendChild(textboxdiv);	
 			    
	// Add urls	
   	if (node.urls && node.urls.length > 0) {			       				
		var mainclipbox = connectionsSlideBar.contentDocument.createElement("div");
		mainclipbox.style.width='100%';
		mainbox.appendChild(mainclipbox);							     			         			      																
   				    
		if (jumpType == CONN_TYPE && jumpNode == node.nodeid+connection.connid) {
			clipboxhidden.style.display = 'block';
		} else {
			clipboxhidden.style.display = 'none';								
		}
		clipboxhidden.setAttribute('id', 'clipbox'+node.nodeid+connection.connid);
		clipboxhidden.style.clear = "both";
		clipboxhidden.style.background = CONNECTION_BACKGROUND_COLOR; 
 
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
 					titletext = connectionsSlideBar.contentDocument.createTextNode("source: current page");
 				} else {
					titletext = connectionsSlideBar.contentDocument.createTextNode("source: current page");
 				}
 				title.appendChild(titletext);
 			} else {
				title.style.cursor = 'pointer';
 				var url = urlObject.title;
 				if (url.length > 30)
 				 	url = url.substring(0, 30)+"..."; 
 				var titletext;
				if (label2 != "") {		    						
 					title.label = label2;
					titletext = connectionsSlideBar.contentDocument.createTextNode("source: "+url);
				} else {
					titletext = connectionsSlideBar.contentDocument.createTextNode("source: "+url);
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
 * Return the meta data for the name passed
 * @param name the name of the meta data to get
 * @return the meta data requested or null.
 */
function getMetaData(name){ 
	var m = jetpack.tabs.focused.contentDocument.getElementsByTagName('meta'); 
	for(var i in m){ 
		if(m[i].name == name){ 
			return m[i].content; 
	    } 
    } 
	return null;
}

/**
 * Add the OERs from (OER Commons) for this website's keywords searched, to the side panel
 * @param newURL the url associated with this OER interface area.
 */
function addOERToUI(newURL) {
   	var cohereOerCountLabel = oerSlideBar.contentDocument.getElementById('cohere-oer-count-label');
   	var cohereOerCountField = oerSlideBar.contentDocument.getElementById('cohere-oer-count-field');
   	cohereOerCountLabel.innerHTML = "0";
   	cohereOerCountField.value = newURL.substring(7, newURL.length);		    
	var statuslabel = oerStatusBar.getElementById('cohere-oer-status');
	statuslabel.innerHTML = "0";

	var keywordSearch = "";
	var keywordString = getMetaData('keywords');
	if (keywordString == null) {
		var titleString = jetpack.tabs.focused.contentDocument.title;
		titleString = titleString.replace(/[^a-zA-Z 0-9]+/g,'');

		//clean for stop words and characters.
		var titleArray = titleString.split(" ");
		for (var i=0; i<titleArray.length; i++) {
			var next = titleArray[i];
			next.replace(/^\s+|\s+$/g, ''); //trim string
			if (next != "") {
				if (i > 0) {
					keywordSearch += '+"'+next+'"';
				} else {
					keywordSearch += '"'+next+'"';
				}
			}
		}
	} else {
		var keywordArray = keywordString.split(",");
		for (var i=0; i<keywordArray.length; i++) {
			var next = keywordArray[i];
			next.replace(/^\s+|\s+$/g, ''); //trim string
			if (next != "") {
				if (i > 0) {
					keywordSearch += '+"'+next+'"';
				} else {
					keywordSearch += '"'+next+'"';
				}
			}
		}
	}
	
	//jetpack.tabs.focused.contentWindow.alert("keywordSearch="+keywordSearch);
	
	var sidelistoer = oerSlideBar.contentDocument.getElementById('cohere-oer-sidelist');
   	if (sidelistoer) {	     
		var newRequestBase = cohereConnection.getBase();
		var newRequestUrl = "http://www.oercommons.org/searchXML?&batch_size="+OER_RESULT_COUNT+"&f.search=&f.search.exact=&f.search.any="+encodeURIComponent(keywordSearch);

		var fullURL = "http://oercommons.org/search?f.search.any="+encodeURIComponent(keywordSearch);
		//jetpack.tabs.focused.contentWindow.alert("ajax call="+newRequestUrl);
		
		$.ajax({
		    url: newRequestUrl,
		    type: 'GET',
		    dataType: 'xml',
		    timeout: 10000,
		    error: function(request,error){
		    	jetpack.notifications.show({title:"Cohere Warning", body:'Error loading OER data due to: '+error+" status:"+request.status, icon: WARNING_ICON_GREEN});
	    		return;		    		    
		    },
		    success: function(data) {	
		    	
		    	var count = 0;
		    	
		    	$(data).find("result").each(function() {
		    		count++;

		    		var title = $(this).find("title").text();
		    		var abstractText = $(this).find("abstract").text();
		    		var author = $(this).find("author").text();
		    		var institution = $(this).find("institution").text();
		    		var link = $(this).find("title").attr("href");

		    		var mainbox = oerSlideBar.contentDocument.createElement("div");
					//mainbox.style.fontFamily="Tahoma, verdana, arial, helvetica";
					mainbox.style.fontFamily="Arial, Verdana, Tahoma, Lucida Grande, sans-serif";

					mainbox.style.fontSize='8pt';
					mainbox.style.borderBottom="2px solid gray";
					mainbox.style.paddingTop='3px';
					mainbox.style.paddingBottom='5px';
					mainbox.style.paddingLeft='3px';
					mainbox.style.paddingRight='3px';
					mainbox.style.background = OER_BACKGROUND_COLOR; 
					//mainbox.style.background = "white"; 

					var sText = ""
					if (author == "") {
						sText = institution;
					} else {
						sText = author+" from "+institution
					}

					var oerauthor = oerSlideBar.contentDocument.createElement("div");
					var text = oerSlideBar.contentDocument.createTextNode(sText);
					oerauthor.appendChild(text);
					oerauthor.style.fontSize='8pt';
					mainbox.appendChild(oerauthor);

					/*var oerinstitution = oerSlideBar.contentDocument.createElement("div");
					var text = oerSlideBar.contentDocument.createTextNode("Institution: "+institution);
					oerinstitution.appendChild(text);
					oerinstitution.style.fontSize='8pt';
					oerinstitution.style.clear="both";								       													     																			     	
					mainbox.appendChild(oerinstitution);*/

					var separator = ideasSlideBar.contentDocument.createElement("div");	
					separator.style.clear="both";								       													     																			     	
					separator.style.borderBottom="1px dashed gray";	
					separator.style.marginTop = "2px";						
					separator.style.height = "4px";
					separator.style.opacity = "0.5";											
					mainbox.appendChild(separator);
					
					var oerlabel = oerSlideBar.contentDocument.createElement("label");
					var text = oerSlideBar.contentDocument.createTextNode(title);
					oerlabel.appendChild(text);
					oerlabel.style.fontSize='8pt';
					oerlabel.style.fontWeight = "bold";
					oerlabel.style.cursor = 'pointer';
					oerlabel.style.color = '#1f555f';
					oerlabel.url=link;
					$(oerlabel).bind("click", loadOERPage);
					mainbox.appendChild(oerlabel);

					var ideatoolbar = oerSlideBar.contentDocument.createElement("div");	
					ideatoolbar.style.clear="both";								       													     																			     	
					ideatoolbar.style.borderTop="1px dashed gray";							
				    mainbox.appendChild(ideatoolbar);	

     			   	if (abstractText != "") {
     			   		
   			   			var descriptionboxhidden = oerSlideBar.contentDocument.createElement("div");
						descriptionboxhidden.setAttribute('id', 'descbox');
   						descriptionboxhidden.style.background = 'transparent'; 
						descriptionboxhidden.style.borderTop="1px solid #308D88";
						descriptionboxhidden.style.paddingTop = "2px";
						descriptionboxhidden.style.marginTop = "3px";
  						descriptionboxhidden.style.display = 'none';
 
						var descbutton = oerSlideBar.contentDocument.createElement("img");
						descbutton.setAttribute('id', 'cohere-description-btn');
						descbutton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-down-green.png');
   						descbutton.setAttribute('alt', 'Show/Hide abstract');
   						descbutton.setAttribute('title', 'Show/Hide abstract');
						descbutton.style.cursor = 'pointer';	   						
						descbutton.style.margin = '3px';	   						
						descbutton.box = descriptionboxhidden;							
						descbutton.parentarea = OER_TYPE;
						$(descbutton).bind("click", switchGreenBoxVisibility);
						$(descbutton).bind("mouseover", tooltipToggle);	
						$(descbutton).bind("mouseout", tooltipToggle);														    				
						ideatoolbar.appendChild(descbutton);

	    				var textboxdesc = oerSlideBar.contentDocument.createElement("div");
    					var textdesc = oerSlideBar.contentDocument.createTextNode(abstractText);
	    				textboxdesc.appendChild(textdesc);
						textboxdesc.style.padding='3px';
	   					textboxdesc.style.backgroundcolor = 'transparent'; 
						descriptionboxhidden.appendChild(textboxdesc);							
 
						mainbox.appendChild(descriptionboxhidden);							
					}	

       				var ideaboxhidden = oerSlideBar.contentDocument.createElement("div");
       				ideaboxhidden.style.borderTop="1px solid #308D88";
       				ideaboxhidden.style.display = 'none';								
       				ideaboxhidden.style.clear = "both";
       				ideaboxhidden.style.background = IDEA_BACKGROUND_COLOR; 
   					mainbox.appendChild(ideaboxhidden);	 				 		

					var toggleButton = oerSlideBar.contentDocument.createElement("img");
					toggleButton.setAttribute('id', 'cohere-showhide-btn');
					if (jumpType == IDEA_TYPE && jumpNode == node.nodeid) {
						toggleButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-up.png');
					} else { 
						toggleButton.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-down.png');
					}
					toggleButton.setAttribute('alt', 'Show/Hide Ideas');
					toggleButton.setAttribute('title', 'Show/Hide Ideas');
					toggleButton.style.cursor = 'pointer';	   						
					toggleButton.style.margin = '3px';	   						
					toggleButton.box = ideaboxhidden;					
					toggleButton.url = link;
					toggleButton.loaded = false;
					$(toggleButton).bind("click", switchPinkBoxVisibility);	    				
					toggleButton.parentarea = OER_TYPE;
					$(toggleButton).bind("mouseover", tooltipToggle);	
					$(toggleButton).bind("mouseout", tooltipToggle);														    				
				    
					ideatoolbar.appendChild(toggleButton);
				    
		    		//var innerbox = oerSlideBar.contentDocument.createElement("div");
					//innerbox.style.float = "left";
					sidelistoer.appendChild(mainbox);
		    	});
		    
		    	if (count == OER_RESULT_COUNT) {
		    		var fullbutton = oerSlideBar.contentDocument.getElementById('cohere-oer-full');
		    		fullbutton.url = fullURL;
		    		fullbutton.removeAttribute('disabled');
		    	}
		    	
		    	var cohereClipsCountLabel = oerSlideBar.contentDocument.getElementById('cohere-oer-count-label');
		   		var cohereClipsCountField = oerSlideBar.contentDocument.getElementById('cohere-oer-count-field');
		   		cohereClipsCountLabel.innerHTML = count;

 				statuslabel.innerHTML = +count; 				
		    } 		    		     	    		
 		});	
	}	
}

/** 
 * Open a new Tab and load the url on the current object into it.
 * Then open the ideas slidebar
 */
function loadOERPage() {	
	cohereConnection.loadPage(this.url);
	ideasSlideBar.slide(TAB_IDEA_WIDTH);
}

/** 
 * Open a new Tab and load the url on the current object into it.
 */
function loadPage() {	
	cohereConnection.loadPage(this.url);
}

/**
 * Check the given list of urls and return true 
 * if there is at least on clip on a url
 * @param urls the array tor Cohere urls to check for clips within
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
	this.box.style.backgroundColor = SELECTION_COLOR;

	var nodeid = this.nodeid;
	var role = this.role;
	var label = this.label;
	var newURL = cohereConnection.getBase() + "plugin/ui/connection.php?";
	if (label) {
		newURL = newURL+"idea0="+encodeURIComponent(label);
	}
	if (role) {
		newURL = newURL+"&role0="+encodeURIComponent(role);
	} 		
	if (nodeid) {
		newURL = newURL+"&ideaid0="+nodeid;
	} 		
	newURL += "&url1=" + encodeURIComponent(cohereConnection.getURL());
    newURL += "&urltitle1=" + encodeURIComponent(cohereConnection.getURLTitle());
	
	cohereConnection.loadDialog(newURL, OTHER_TYPE, false);	
}

/**
 * Used to show and hide the full label of an idea or clip
 * (which was trimmed to keep display items smaller)
 */
function cohereMoreText() {	
	var box = this.box;
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
 * @param obj the object whose clipping area to open
 * @param type the slidebar type this function was called from
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
	} else if (type == OER_TYPE) {
		box = oerSlideBar.contentDocument.getElementById('clipbox'+obj.nodeid);
		button = oerSlideBar.contentDocument.getElementById('cohere-conn-showhide-btn'+obj.nodeid);
	}
	if (box && button) {
		box.style.display = 'block';
		button.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-up.png');
	}
}

/**
 * Open and close the current objects box area (with the pink arrows).
 */
function switchPinkBoxVisibility() {
	var box = this.box;
	if (box) {
		if (box.style.display == 'none') {
			if (this.parentarea == OER_TYPE && this.loaded == false) {
     			addIdeasToUI(OER_TYPE, this.url, box, false, null, null, null, true);
				this.loaded = true;
			} 
			box.style.display = 'block';
   			this.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-up.png');
		} else {
			box.style.display = 'none';
			this.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-down.png');
		}
	}
}

/**
 * Open and close the the current objects box area (with the green arrows).
 */
function switchGreenBoxVisibility() {
	var box = this.box;
	if (box) {
		if (box.style.display == 'none') {
			box.style.display = 'block';
   			this.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-up-green.png');
		} else {
			box.style.display = 'none';
			this.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/arrow-down-green.png');
		}
	}
}


/**
 * Select the node with the nodeid on the current object 
 * and then switch to the Idea slidebar to show it and scroll to it
 * Called from the Connection slidebar
 */
//MB:  Not working at present due to Jetpack limitation
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
 * @param userid the id of the user to return the highlight colour for.
 * @param rolename an optional parameter specifying the name of the role to take into account when choosing the highlight colour to return.
 */
function getHighlightColour(userid, rolename) {

	var highlightColour = OTHERS_HIGHLIGHT_COLOR;
	if (cohereConnection.user && userid == cohereConnection.user) {
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

/** 
 * Holds some data to pass round walkDownDom recursion while searching 
 */
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
 * MB: Need to investigate why.  
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
 * @param obj the object whose label property to search for
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
			
			var textNodes = searchStuff.textNodes;
	 		textNodes.reverse();
			var lastNode = highlightNodes[0];
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
						//jetpack.tabs.focused.contentWindow.alert("nodeText:"+nodeText);

						var firstindex = findIndexOfTerm(nodeText, splitText, 0, true);				
						//jetpack.tabs.focused.contentWindow.alert("firstindex ="+firstindex);	
						if (firstindex != -1) {
							range.setStart(node, firstindex);
						}
					} else if (i == count-1) {
						//jetpack.tabs.focused.contentWindow.alert("nodeText:"+nodeText);
						
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
 * @param textBlock the text block to search
 * @param termArray the array of terms to search for
 * @param indexPoint the index within the textBlock that searching has currently reached.
 * @param down the direction to search through the textblock
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
 * @param searchArray the array of object whse label property to search for.
 * @param keepSelected indicates whether to clear the current selection or add to it // not currently used.
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

/********** IDEAS SLIDEBAR SELECTION METHODS ************/

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
		 		if (clip != null) {
					ideas[ideas.length] = clip;
				}
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
		if (cohereConnection.user && userid == cohereConnection.user) {
			ideas[ideas.length] = next;
			
			var clips = new Array();
			clips = ideasSlideBar.contentDocument.getElementsByName( "ideaclip"+next.nodeid);
		   	if (clips != null) {
				for (var j=0; j<clips.length;j++ ){
					var clip = clips[j];
					if (clip != null) {
						ideas[ideas.length] = clip;
					}
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
		 			if (clip != null) {
						ideas[ideas.length] = clip;
					}
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
		 			if (clip != null) {
		 				clip.style.backgroundColor = 'transparent';		 				
		 			}
		    	}
		   	}
		}	
	}
}

/********** CLIPS SLIDEBAR SELECTION METHODS ************/
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
		if (cohereConnection.user && userid == cohereConnection.user) {
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
		if (cohereConnection.user && userid == cohereConnection.user) {
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

/**
 * Tweet the idea on the current object, if the user has added thier twitter setting, 
 * else give them a message with instructions of how tp add thier settings
 */	
function tweetIdea() {	
	var sStorage = jetpack.storage.settings.coherejetpack;
  	if(!sStorage.twitterName || !sStorage.twitterPassword){
  		jetpack.tabs.focused.contentWindow.alert("Please set Your Twitter account in our Jetpack 'settings'.\n\n1. Type 'about:jetpack' in the browser addess bar\n2. Click 'Installed Features'\n3. Click 'settings' on the Cohere Jetpack entry\n4. Enter your Twitter account details\n\n");
  		return;
  	}

  	var currentURL = cohereConnection.getURL();
  	if (currentURL.substring(0,7) == "http://") {
  		currentURL = currentURL.substring(7, currentURL.length);
  	}
  	if (currentURL.substring(0,8) == "https://") {
  		currentURL = currentURL.substring(8, currentURL.length);
  	}
  	if (currentURL.substring(0,4) == "www.") {
  		currentURL = currentURL.substring(4, currentURL.length);
  	}

  	var urlArray = currentURL.split('/');
  	currentURL = urlArray[0];
  	
  	if (currentURL.length > 30) {
    	currentURL = currentURL.substring(0, 30)+"...";
	}
  		 	
    var extra = 30-currentURL.length; 
  	var label = this.label;
    if (label.length > (47+extra)) {
    	label = label.substring(0, 47+extra)+"...";
	}  	

	var twitterName = sStorage.twitterName;
	var twitterPassword = sStorage.twitterPassword;	

	//var tweetMessage = "Cohere Idea: http://cohere.open.ac.uk/node.php?nodeid="+this.nodeid+"#conn-neighbour";

	var twitterURL = "http://cohere.open.ac.uk/node.php?nodeid="+this.nodeid+"#conn-neighbour";
	var tweetMessage = "'"+label+"' annotated on "+currentURL+" - more: ";
		
	var newRequestUrl = "http://api.bit.ly/shorten?format=json&version=2.0.1&longUrl="+encodeURIComponent(twitterURL)+"&login="+BITLY_LOGIN+"&apiKey="+BITLY_KEY;	
	$.ajax({
		    url: newRequestUrl,
		    type: 'GET',
		    dataType: 'json',
		    timeout: 10000,
		    error: function(error) {
	     		jetpack.notifications.show({title:"Cohere Warning", body:'Bit.ly service called failed due to:'+error+" status:"+request.status, icon: WARNING_ICON_GREEN});
		    },
		    success: function(data) {
	  			var short = "";
				for (var i in data['results']) {
					// Stupid JavaScript, can't figure it out using json['results'][encodeURIComponent(twitterURL)]['shortUrl'].
				    short = data['results'][i]['shortUrl'];
				}
				
				var message = tweetMessage + short + " #cohereweb";
				
				//jetpack.tabs.focused.contentWindow.alert("message="+message);
				
				jetpack.lib.twitter.statuses.update({  
					data: {  
				    	status: message
				   },  
				   username: twitterName,  
				   password: twitterPassword,  
				   success: function () {
						jetpack.notifications.show(  {
							 title: "Cohere",
							 body: "Tweet sent successfully",
							 icon: TWITTER_ICON
						});
			   	   },   	
			   	   
				   error: function(){
						jetpack.notifications.show(  {
											 title: "Cohere",
											 body: "Tweet was not successful",
											 icon: WARNING_ICON_GREEN
						});
				   }
				}); 	
	  			
		    },
	});		
}

/******** FUNCTIONS THAT CALL COHERE CONNECTION OBJECT IN SOME WAY *************/

function openHelp() {
	cohereConnection.loadPage(helpPreFix+manifest.firstRunPage+helpPostFix);
}

/**
 * Drag text from webpage to create clip
 */
function processClipDrop(event) {
	var value = event.dataTransfer.getData("text/plain"); 
	value = cohereConnection.processSelection(value);
	if (value != "") {
		cohereConnection.addClip(value);
	}
}

/**
 * Create an idea with a clip using the value of the text passed,
 * On the idea with the nodeid of the target.
 */
function processIdeaClipDrop(event, nodeid) {
	var value = event.dataTransfer.getData("text/plain"); 
	value = cohereConnection.processSelection(value);
	if (nodeid && nodeid != "" && value != "") {
		cohereConnection.addClipOnExistingIdea(nodeid, value);
	}
}

/**
 * Open a new window showing the user details for the userid of the current object
 */
function cohereShowUserDetails() {
	var newURL = cohereConnection.getBase() + "user.php?userid=" + this.userid;
	//cohereConnection.loadDialog(newURL, OTHER_TYPE, true);
	cohereConnection.loadPage(newURL);
}

/**
 * Open a new window showing the network neightbourhood view 
 * for the idea with the nodeid of the current object.
 */
function cohereShowNeighbourhood() {
	var newURL = cohereConnection.getBase() + "node.php?nodeid=" + this.nodeid + "#conn-neighbour";
	cohereConnection.loadPage(newURL);
}

/**
 * Open the Cohere Idea window to edit 
 * the idea with the nodeid on the current item.
 */
function cohereEditIdea() {
	this.box.style.backgroundColor = SELECTION_COLOR;
	cohereConnection.editIdea(this.nodeid);
}

/**
 * Ask cohere to delete the idea with the nodeid of the current object.
 */
function cohereDeleteIdea() {
	this.box.style.backgroundColor = SELECTION_COLOR;
	cohereConnection.deleteIdea(this.label, this.nodeid, this.box);
}

/**
 * Open the Cohere Idea window to edit 
 * the connection with the connid on the current item.
 */
function cohereEditConnection() {
	this.box.style.backgroundColor = SELECTION_COLOR;
	cohereConnection.editConnection(this.connid);
}

/**
 * Ask cohere to delete the connection with the connid of the current object.
 */
function cohereDeleteConnection() {
	this.box.style.backgroundColor = SELECTION_COLOR;
	cohereConnection.deleteConnection(this.label, this.connid, this.box);
}

/**
 * Add the idea with the given nodeid to the 
 * user's bookmarks on the Cohere website.
 */
function bookmarkIdea() {
	cohereConnection.bookmark(this);
}

/**
 * remove the idea with the given nodeid from the 
 * user's bookmarks on the Cohere website.
 */
function unbookmarkIdea() {
	this.box.style.backgroundColor = SELECTION_COLOR;	
	cohereConnection.deleteBookmark(this);
}

/**
 * Add the clip with the given clip text to an idea.
 */
function addClipToIdea() {
	this.box.style.backgroundColor = SELECTION_COLOR;
	cohereConnection.addClipToIdea(this.clipname);
}

/**
 * Add the currently selected text to the idea with the given nodeid.
 */
function addNewClipToIdea() {
	cohereConnection.createClipOnIdea(this.nodeid);
}

/**
 * Remove the clip with the clipid on the current object
 * from the nodeid on the current iobject.
 */
function removeClipFromIdea() {
	cohereConnection.removeClipFromIdea(this.nodeid, this.clipdid, this.clipname);
}

/**
 * Delete the clip with the clipid on the current object.
 */
function deleteClip() {
	this.box.style.backgroundColor = SELECTION_COLOR;
	cohereConnection.deleteClip(this.clipid, this.clipname, this.box);
}

/**
 * Open a new tab to the url on the current object.
 * Store the nodeid, clipid and type properties of the current object.
 * When the new tab is opened these will be used to open and select the object that lancuhed this call.
 */
function jumpToURL() {
	jumpNode = this.nodeid;
	jumpClip = this.clipid;
	jumpType = this.type;	
	cohereConnection.loadPage(this.url);
}


/*** COHERE CONNECTION CLASS ***/
/**
 * Has almost all the functions that communicate with the Cohere server
 * and their helper functions
 */ 
var cohereConnection = {
	
	user : null,
	session : null,
	newWindow: null,
	newIdeaWindow: null,
	newClipWindow: null,
	newConnWindow: null,
	bookmarks: null,
	
	// remember trailing '/' on cohereBase
	cohereBase : "http://cohere.open.ac.uk/",
	cookieDomain : "cohere.open.ac.uk",
	
	/**
	 * Check to see of the current user is logged in to Cohere
	 */	
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
			    timeout: 10000,
			    error: function(){
			    	cohereConnection.session = null;
			    	cohereConnection.user = null;
			    	cohereConnection.notLoggedIn();
			    },
			    success: function(json) {
	      			if(json.error) {
			    		cohereConnection.session = null;
			    		cohereConnection.user = null;
			    		cohereConnection.notLoggedIn();
	      			} else { 		
						cohereConnection.session = sess;
						cohereConnection.user = u;
						cohereConnection.loggedIn();
			        }		        	
			    }
			});		
		} else {
    		cohereConnection.session = null;
    		cohereConnection.user = null;
    		cohereConnection.notLoggedIn();
		}     	
	},

	/**
	 * Refresh the interface for a user who is logged in to Cohere.
	 */
	loggedIn: function() {
 
		// This does not work at present with either property change or replace - suspect jetpack bug
		/*var loginitem = cohereConnectionmenu.item('Login');
		var replacements = new Array({
    				label: "Logout",
				    mnemonic: "l",
				    command: function () cohereConnection.login(),
  					});

		if (!loginitem) {
			loginitem = cohereConnectionmenu.item('Logout');
  		}
		cohereConnectionmenu.replace(loginitem, replacements);
		//loginitem.label = "Logout";
		
		var mycohereitem = cohereConnectionmenu.item('My Cohere');
		replacements = new Array({
				    label: "My Cohere",
				    mnemonic: "m",
				    disabled: false,
				    icon: "http://cohere.open.ac.uk/jetpack/ui/images/profile.png",
				    command: function () cohereConnection.openMyCohere()
				  });
		
		if (mycohereitem) {
			cohereConnectionmenu.replace(mycohereitem, replacements);
			//mycohereitem.disabled = 'false';
 	   	}*/
 	   	
 		var myideaselectionmenu = ideasSlideBar.contentDocument.getElementById('cohere-idea-selectmy-btn');
		if (myideaselectionmenu) {
			myideaselectionmenu.removeAttribute('disabled');
		} 
		var myideaaddbutton = ideasSlideBar.contentDocument.getElementById('cohere-idea-add_button');
		if (myideaaddbutton) {
		   	myideaaddbutton.setAttribute('title', 'Create Idea');	
		   	myideaaddbutton.removeAttribute('disabled');
		   	myideaaddbutton.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/add-an-idea.png');	
		}											
		var clearBookmarks = ideasSlideBar.contentDocument.getElementById('clear_bookmarks');
		if (clearBookmarks) {
			clearBookmarks.removeAttribute('disabled');
			clearBookmarks.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/minus-favourites.png');
		}
 		var myidealoginbutton = ideasSlideBar.contentDocument.getElementById('cohere-idea-login_button');
		if (myidealoginbutton) {
		   	myidealoginbutton.setAttribute('title', 'Goto My Cohere Data');	
			myidealoginbutton.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/toolbar/profile.png');
		}											
 		var myclipselectionmenu = clipsSlideBar.contentDocument.getElementById('cohere-clip-selectmy-btn');
		if (myclipselectionmenu) {
			myclipselectionmenu.removeAttribute('disabled');
 		} 
 		var myclipaddbutton = clipsSlideBar.contentDocument.getElementById('cohere-clip-add_button');
		if (myclipaddbutton) {
		   	myclipaddbutton.setAttribute('title', 'Create Clip of selected text');	
		   	myclipaddbutton.removeAttribute('disabled');
		}											
 		var myclipaddbuttonimg = clipsSlideBar.contentDocument.getElementById('cohere-clip-add_button_img');
		if (myclipaddbuttonimg) {
		   	myclipaddbuttonimg.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/clip.png');	
		}										
 		var mycliploginbutton = clipsSlideBar.contentDocument.getElementById('cohere-clip-login_button');
		if (mycliploginbutton) {
		   	mycliploginbutton.setAttribute('title', 'Goto My Cohere Data');	
			mycliploginbutton.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/toolbar/profile.png');
		}											
 		var myconnselectionmenu = connectionsSlideBar.contentDocument.getElementById('cohere-conn-selectmy-btn');
		if (myconnselectionmenu) {
			myconnselectionmenu.removeAttribute('disabled');
 		} 
 		var myconnaddbutton = connectionsSlideBar.contentDocument.getElementById('cohere-connection-add_button');
		if (myconnaddbutton) {
		   	myconnaddbutton.setAttribute('title', 'Create Connection');	
		   	myconnaddbutton.removeAttribute('disabled');
		}											
  		var myconnaddbuttonimg = connectionsSlideBar.contentDocument.getElementById('cohere-connection-add_button_img');
		if (myconnaddbuttonimg) {
		   	myconnaddbuttonimg.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/connection-16px.png');	
		}									
		var myconnloginbutton = connectionsSlideBar.contentDocument.getElementById('cohere-connection-login_button');
		if (myconnloginbutton) {
		   	myconnloginbutton.setAttribute('title', 'Goto My Cohere Data');	
			myconnloginbutton.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/toolbar/profile.png');
		}											
 		
		var newURL = this.getURL(); 		
 	   	refreshUI(newURL);	  
	},
	
	/**
	 * Refresh the interface for a user who is not logged in to Cohere.
	 */
	notLoggedIn: function() {

		// This does not work at present with either property change or replace - suspect jetpack bug
		/*var loginitem = cohereConnectionmenu.item('Login');
		var replacements = new Array({
    				label: "Login",
				    mnemonic: "l",
				    command: function () cohereConnection.login()
  					});
		
		if (!loginitem) {
			loginitem = cohereConnectionmenu.item('Logout');
		}
		cohereConnectionmenu.replace(loginitem, replacements);
		replacements = new Array({
				    label: "My Cohere",
				    mnemonic: "m",
				    disabled: true,
				    icon: "http://cohere.open.ac.uk/jetpack/ui/images/profile.png",
				    command: function () cohereConnection.openMyCohere()
				  });
		//loginitem.label = "Login";

		var mycohereitem = cohereConnectionmenu.item('My Cohere');
		if (mycohereitem) {
			cohereConnectionmenu.replace(mycohereitem, replacements);
			//mycohereitem.disabled = 'true';
 	   	}*/
		
		var myideaselectionmenu = ideasSlideBar.contentDocument.getElementById('cohere-idea-selectmy-btn');
		if (myideaselectionmenu) {
			myideaselectionmenu.setAttribute('disabled', 'true');
		}
		var myideaaddbutton = ideasSlideBar.contentDocument.getElementById('cohere-idea-add_button');
		if (myideaaddbutton) {
		   	myideaaddbutton.setAttribute('title', 'Login to Create Idea');	
		   	myideaaddbutton.setAttribute('disabled', 'true');
		   	myideaaddbutton.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/add-an-idea-disabled.png');	
		}											
		var clearBookmarks = ideasSlideBar.contentDocument.getElementById('clear_bookmarks');
		if (clearBookmarks) {
			clearBookmarks.setAttribute('disabled', 'true');
			clearBookmarks.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/minus-favourites-disabled.png');
		}
 		var myidealoginbutton = ideasSlideBar.contentDocument.getElementById('cohere-idea-login_button');
		if (myidealoginbutton) {
		   	myidealoginbutton.setAttribute('title', 'Login to Cohere');	
			myidealoginbutton.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/cohere-logo-16.png');
		}											
		var myclipselectionmenu = clipsSlideBar.contentDocument.getElementById('cohere-clip-selectmy-btn');
		if (myclipselectionmenu) {
			myclipselectionmenu.setAttribute('disabled', 'true');
		} 
 		var myclipaddbutton = clipsSlideBar.contentDocument.getElementById('cohere-clip-add_button');
		if (myclipaddbutton) {
		   	myclipaddbutton.setAttribute('title', 'Login to Create Clip');	
		   	myclipaddbutton.setAttribute('disabled', 'true');
		}													
 		var myclipaddbuttonimg = clipsSlideBar.contentDocument.getElementById('cohere-clip-add_button_img');
		if (myclipaddbuttonimg) {
		   	myclipaddbuttonimg.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/clip-disabled.png');	
		}											
 		var mycliploginbutton = clipsSlideBar.contentDocument.getElementById('cohere-clip-login_button');
		if (mycliploginbutton) {
		   	mycliploginbutton.setAttribute('title', 'Login to Cohere');	
			mycliploginbutton.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/cohere-logo-16.png');
		}											
		var myconnselectionmenu = connectionsSlideBar.contentDocument.getElementById('cohere-conn-selectmy-btn');
		if (myconnselectionmenu) {
			myconnselectionmenu.setAttribute('disabled', 'true');
		} 
 		var myconnaddbutton = connectionsSlideBar.contentDocument.getElementById('cohere-connection-add_button');
		if (myconnaddbutton) {
		   	myconnaddbutton.setAttribute('title', 'Login to Create Connection');	
		   	myconnaddbutton.setAttribute('disabled', 'true');
		}											
 		var myconnaddbuttonimg = connectionsSlideBar.contentDocument.getElementById('cohere-connection-add_button_img');
		if (myconnaddbuttonimg) {
		   	myconnaddbuttonimg.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/connection-16px-disabled.png');	
		}											
 		var myconnloginbutton = connectionsSlideBar.contentDocument.getElementById('cohere-connection-login_button');
		if (myconnloginbutton) {
		   	myconnloginbutton.setAttribute('title', 'Login to Cohere');	
			myconnloginbutton.firstChild.setAttribute('src', 'http://cohere.open.ac.uk/jetpack/ui/images/cohere-logo-16.png');
		}											
		
		var newURL = this.getURL(); 		
 	   	refreshUI(newURL);	  
	},

	/**
	 * Open the Cohere login page, or if the user is already logged in, open thier home page.
	 */
	quicklogin: function() {
		if (!this.session){
			this.loadPage(this.cohereBase + "login.php");
		} else {
			this.openMyCohere();
		}
	},
			
	/**
	 * Open the cohere login page, or of loggied in already, logout.
	 */
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
	 * @param obj the object whose nodeid to bookmark
	 */
	bookmark: function(obj) {
		if (obj.nodeid) {
			var newRequestBase = cohereConnection.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=addtousercache&idea="+obj.nodeid+"&PHPSESSID="+this.session;;
			$.ajax({
			    url: newRequestUrl,
			    type: 'GET',
			    dataType: 'json',
			    timeout: 10000,
			    error: function(request,error){
		     		jetpack.notifications.show({title:"Cohere Warning", body:'Unable to bookmark node. Sorry.', icon: WARNING_ICON_GREEN});
			    },
			    success: function(json){
		  			if(json.error){
		  				jetpack.tabs.focused.contentWindow.alert("Unable to bookmark node due to:\n"+json.error[0].message);
		  			} else { 		
						//jetpack.tabs.focused.contentWindow.alert(obj.label+"\n\n has been bookmarked");

						obj.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/favorites.png');
						$(obj).unbind("click");	    				
						$(obj).bind("click", unbookmarkIdea);	    				
						obj.setAttribute('title', 'Unbookmark this idea');
					} 
		 		}				      			     	   			
		  	});
		 }
	},

	/**
	 * Delete an idea from the users cache
	 * @param obj the object whose nodeid is the bookmarked idea to delete
	 */
	deleteBookmark: function(obj) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want unbookmark the idea:\n\n'"+obj.label+"' ?\n")) {	
			if (obj.nodeid) {
				var newRequestBase = cohereConnection.getBase();
				var newRequestUrl = newRequestBase + "api/service.php?format=json&method=deletefromusercache&idea="+obj.nodeid+"&PHPSESSID="+this.session;;
				$.ajax({
					url: newRequestUrl,
					type: 'GET',
					dataType: 'json',
					timeout: 10000,
					error: function(request,error){
						jetpack.notifications.show({title:"Cohere Warning", body:'Unable to delete bookmark. Sorry.', icon: WARNING_ICON_GREEN});
					},
					success: function(json){
						if(json.error){
							jetpack.tabs.focused.contentWindow.alert("Unable to delete bookmark due to:\n"+json.error[0].message);
						} else { 		
							//jetpack.tabs.focused.contentWindow.alert(obj.label+"\n\n has been removed from your bookmarks");

							obj.setAttribute('src', cohereConnection.getBase()+'jetpack/ui/images/favorites-empty.png');
							$(obj).unbind("click");	    				
							$(obj).bind("click", bookmarkIdea);	    				
							obj.setAttribute('title', 'Bookmark this idea');
						} 
					}				      			     	   			
				});
			 }
		}
		obj.box.style.backgroundColor = IDEA_BACKGROUND_COLOR;	
	},

	/**
	 * Clear user's bookmark list
	 */
	clearBookmarks: function() {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to clear your bookmark list?\n\n")) {	
			var newRequestBase = cohereConnection.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=clearusercache&PHPSESSID="+this.session;;
			$.ajax({
				url: newRequestUrl,
				type: 'GET',
				dataType: 'json',
				timeout: 10000,
				error: function(request,error){
					jetpack.notifications.show({title:"Cohere Warning", body:'Unable to clear bookmarks. Sorry.', icon: WARNING_ICON_GREEN});
				},
				success: function(json){
					if(json.error){
						jetpack.tabs.focused.contentWindow.alert("Unable to clear bookmarks due to:\n"+json.error[0].message);
					} else { 		
						jetpack.tabs.focused.contentWindow.alert("Your bookmarks have been cleared");
						refreshIdeasUI(cohereConnection.getURL());	      			    
					} 
				}				      			     	   			
			});
		}
	},
	
	/**
	 * Open the Cohere idea creation window
	 */
	createIdea: function() {
        var data = this.getData();
		this.loadDialog(this.cohereBase + "plugin/ui/idea.php?"+ data, IDEA_TYPE, false);
	},
	
	/**
	 * Open the Cohere idea editing window
	 * @param nodeid the nodeid of the idea to edit
	 */
	editIdea: function(nodeid) {
		this.loadDialog(this.cohereBase + "plugin/ui/idea.php?"+ "nodeid="+nodeid, IDEA_TYPE, false);
	},
	
	/**
	 * Check if the user wants to delete the given idea, and if so request the delete from the server.
	 * @param label the label of the idea to delete
	 * @param nodeid the id of the idea to delete
	 * @param box the visual element representing the idea to unselect if required
	 */
	deleteIdea: function(label, nodeid, box) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to delete the idea:\n\n'"+label+"' \n\n and all it's connections from Cohere?\n")) {	
			if (nodeid && this.user && this.session) {
				var newRequestBase = cohereConnection.getBase();
				var newRequestUrl2 = newRequestBase + "api/service.php?format=json&method=deletenode&nodeid="+nodeid+"&PHPSESSID="+this.session;
				$.ajax({
				    url: newRequestUrl2,
				    type: 'GET',
				    dataType: 'json',
				    timeout: 10000,
				    error: function(request,error){
				    	 jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete idea. Sorry.', icon: WARNING_ICON_GREEN});
				    },
				    success: function(json){
		      			if(json.error){
      						//json.error[0].message - use this when multi-line notifications available      			 	    	
				    	 	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete idea. Sorry.', icon: WARNING_ICON_GREEN});
		      			} else { 		
		      				var newURL = cohereConnection.getURL();
		      				refreshUI(newURL);	      			    
	    					//ideasSlideBar.slide(TAB_IDEA_WIDTH, true);
				        }		        	
				    }
				});
			}		
		} else {
			box.style.backgroundColor = IDEA_BACKGROUND_COLOR;
		}
	},
	
	/**
	 * Add the given cliptext to an idea
	 * @param cliptext the selected text to use
	 */
	addClipToIdea: function(cliptext) {	
        var data = "&url=" + encodeURIComponent(this.getURL());
        data += "&urltitle=" + encodeURIComponent(this.getURLTitle());
    	data += "&urlclip=" + encodeURIComponent(cliptext);
        
		this.loadDialog(this.cohereBase + "plugin/ui/idea.php?"+ data, IDEA_TYPE, false);
	},	
	
	/**
	 * Add the currently selected text to the idea with the given nodeid
	 * @param nodeid the id of the idea to add the selected text to
	 */
	createClipOnIdea: function(nodeid) {
		var clip = this.getSelectedText()
		if (clip == null || clip == "") {
			jetpack.tabs.focused.contentWindow.alert("Please select some website text first");
		} else {
			this.addClipOnExistingIdea(nodeid, clip);
		}
	},
	
	/**
 	 * Create an idea with a clip using the clip value passed,
 	 * On the idea with the nodeid passed.
 	 * @param nodeid the id of the idea to add the given clip to
 	 * @param clip the text to as as a clip on the given idea.
 	 */
	addClipOnExistingIdea: function(nodeid, clip) {
		if (this.user && this.session&& clip && clip!="") {
			var newRequestBase = this.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=addurl" + this.getClipService(clip) + "&PHPSESSID="+this.session;
			$.ajax({
			    url: newRequestUrl,
			    type: 'POST',
			    dataType: 'json',
			    timeout: 10000,
			    error: function(request,error){
			    	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip. Sorry.', icon: WARNING_ICON_GREEN});
			    },
			    success: function(json){
	      			if(json.error){
      					//json.error[0].message - use this when multi-line notifications available      			 	    	
			    		jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip. Sorry.', icon: WARNING_ICON_GREEN});
	      			} else { 	
	      				if (json.url) {	
		    				cohereConnection.addClipAgainstIdea(nodeid, json.url[0].urlid);
						}
			        }		        	
			    }
			});		
		} 
	},

	/**
 	 * Add the clip with the given urlid to the idea with the given nodeid
  	 * @param nodeid the id of the idea to add the given clip to
 	 * @param urlid the id of the clip to add.
 	 */
	addClipAgainstIdea: function(nodeid, urlid) {
		if (this.user && this.session) {
			var newRequestBase = this.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=addurltonode&nodeid="+nodeid+"&urlid="+urlid+"&PHPSESSID="+this.session;
			$.ajax({
			    url: newRequestUrl,
			    type: 'GET',
			    dataType: 'json',
			    timeout: 10000,
			    error: function(request,error){
			    	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip to Idea. Sorry.', icon: WARNING_ICON_GREEN});
			    },
			    success: function(json){
	      			if(json.error){
	      			   	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip to Idea. Sorry.', icon: WARNING_ICON_GREEN});	      			
      					//jetpack.tabs.focused.contentWindow.alert(json.error[0].message);// - use this when multi-line notifications available      			 	    	
	      			} else { 	
      					var newURL = cohereConnection.getURL();
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
	
	/**
 	 * Create a new clip from the currently selected text
  	 */
	createClip: function() {
		var clip = this.getSelectedText();
		if (clip == null || clip == "") {
			jetpack.tabs.focused.contentWindow.alert("Please select some website text first");
		} else {
			this.addClip(clip);
		}
	},
	
	/**
 	 * Create a new clip from the given clip text
 	 * @param clip the text to add as a new clip
 	 */
	addClip: function(clip) {	
		if (this.user && this.session && clip && clip != "") {
			var newRequestBase = this.getBase();
			var newRequestUrl = newRequestBase + "api/service.php?format=json&method=addurl" + this.getClipService(clip) + "&PHPSESSID="+this.session;
			$.ajax({
			    url: newRequestUrl,
			    type: 'POST',
			    dataType: 'json',
			    timeout: 10000,
			    error: function(request,error){
			    	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip. Sorry.', icon: WARNING_ICON_GREEN});			    
			    },
			    success: function(json){
	      			if(json.error){
			    		jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to add clip. Sorry.', icon: WARNING_ICON_GREEN});
      					//json.error[0].message - use this when multi-line notifications available      			 	    	
	      			} else { 		
	      				var newURL = cohereConnection.getURL();	
 	      				refreshUI(newURL);	      			    	      				
   						//clipsSlideBar.slide(TAB_CLIP_WIDTH, true);
			        }		        	
			    }
			});		
		} else {		
 	   		var data = this.getClip(clip);	
 			this.loadDialog(this.cohereBase + "plugin/ui/url.php?"+data, CLIP_TYPE, false);
		}
	},
	
	/**
 	 * Remove the clip with the given clipid from the idea with the given nodeid.
 	 * @param nodeid the id of the idea to remove the clip from
 	 * @param clipid the id of the clip to remove
 	 * @param clipname the text of the clip to remove
 	 */
	removeClipFromIdea: function(nodeid, clipid, clipname) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to remove the clip:\n\n'"+clipname+"' From this node?")) {	
			if (clipid && this.user && this.session) {
				var newRequestBase = this.getBase();
				var newRequestUrl = newRequestBase + "api/service.php?format=json&method=removeurlfromnode&nodeid="+nodeid+"&urlid="+clipid+"&PHPSESSID="+this.session;
				$.ajax({
				    url: newRequestUrl,
				    type: 'GET',
				    dataType: 'json',
				    timeout: 10000,
				    error: function(request,error){
				        jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to remove clip. Sorry.', icon: WARNING_ICON_GREEN});
				    },
				    success: function(json){
		      			if(json.error){
		      				jetpack.tabs.focused.contentWindow.alert(json.error[0].message);
		      			} else { 		
		      				var newURL = cohereConnection.getURL();	      			    
				    		refreshIdeasUI(newURL);  
	    					//ideasSlideBar.slide(TAB_IDEA_WIDTH, true);
				        }		        	
				    }
				});
			}		
		}	
	},
	
	/**
 	 * Delete the clip with the given clipid.
 	 * @param clipid the id of the clip to delete
 	 * @param clipname the text of the clip to delete
 	 * @param box the visual clip object - to delselect if required.
 	 */
	deleteClip: function(clipid, clipname, box) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to delete the clip:\n\n'"+clipname+"' ?")) {	
			if (clipid && this.user && this.session) {
				var newRequestBase = this.getBase();
				var newRequestUrl2 = newRequestBase + "api/service.php?format=json&method=deleteurl&urlid="+clipid+"&PHPSESSID="+this.session;
				$.ajax({
				    url: newRequestUrl2,
				    type: 'GET',
				    dataType: 'json',
				    timeout: 10000,
				    error: function(request,error){
				    	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete clip. Sorry.', icon: WARNING_ICON_GREEN});
				    },
				    success: function(json){
		      			if(json.error){
		      				jetpack.tabs.focused.contentWindow.alert(json.error[0].message);
		      			} else { 		
		      				var newURL = cohereConnection.getURL();
		      				refreshUI(newURL);	      			    
	   						//clipsSlideBar.slide(TAB_CLIP_WIDTH, true);
				        }		        	
				    }
				});
			}		
		} else {
			box.style.backgroundColor = CLIP_BACKGROUND_COLOR;		
		}
	},
		
	/**
 	 * Open the Cohere Connection creation window
 	 */
	createConnection: function() {
		var data = this.getData(0);
		this.loadDialog(this.cohereBase + "plugin/ui/connection.php?"+ data, CONN_TYPE, false);
	},
	
	/**
 	 * Open the Cohere Connection editing window for the connection with the given connid
 	 * @param connid the id of the connection to edit.
 	 */
	editConnection: function(connid) {
		this.loadDialog(this.cohereBase + "plugin/ui/connection.php?connid="+connid, CONN_TYPE, false);
	},
	
	/**
 	 * Delete the connection with the given connid
 	 * @param label the text of the connection to display to the user for confirmation of the deletion
 	 * @param connid the id of the connection to delete.
 	 * @param box the visual component representing the connection area - to deselect if required.
 	 */
	deleteConnection: function(label, connid, box) {
		if (jetpack.tabs.focused.contentWindow.confirm("Are you sure you want to delete the connection:\n\n'"+label+"' \n\n from Cohere?\n")) {	
			if (connid && this.user && this.session) {
				var newRequestBase = cohereConnection.getBase();
				var newRequestUrl2 = newRequestBase + "api/service.php?format=json&method=deleteconnection&connid="+connid+"&PHPSESSID="+this.session;
				$.ajax({
				    url: newRequestUrl2,
				    type: 'GET',
				    dataType: 'json',
				    timeout: 10000,
				    error: function(request,error){
				    	 jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete connection. Sorry.', icon: WARNING_ICON_GREEN});
				    },
				    success: function(json){
		      			if(json.error){
      						//json.error[0].message - use this when multi-line notifications available      			 	    	
				    	 	jetpack.notifications.show({title: 'Cohere Warning', body: 'Unable to delete connection. Sorry.', icon: WARNING_ICON_GREEN});
		      			} else { 		
		      				var newURL = cohereConnection.getURL();
		      				refreshConnectionsUI(newURL);	      			    
	    					//connectionsSlideBar.slide(TAB_CONN_WIDTH, true);
				        }		        	
				    }
				});
			}		
		} else {
			box.style.backgroundColor = 'transparent';		
		}
	},
	
	/**
 	 * Open the current user Cohere home page
 	 */
	openMyCohere: function() {
		this.loadPage(this.cohereBase + "user.php");
	},
	
	/**
 	 * Open the Cohere website home page
 	 */
	openCohere: function() {
 	  	this.loadPage(this.cohereBase);
	},
	
	/**
 	 * Open a new tab and load the given url
 	 * @param aUrl the url to load into the new tab
 	 */
	loadPage : function(aUrl){
		var newTab = jetpack.tabs.open(aUrl);
		newTab.focus();
    	return;
   	},	
   	   	
	/**
 	 * Open a new window for the given url
 	 * @param url the url to load into the new window
 	 * @param type the identifier for the slidebar making the request
 	 * @param large indicates if a large or small window should be opened (large - 80% screen; small = 600x600
 	 */
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
	      	cohereConnection.newClipWindow = window.open(url, "cohere", props);      
	      	cohereConnection.newClipWindow.focus();  
	      	cohereConnection.checkClip(); 
      	} else if (type == IDEA_TYPE) {
	      	cohereConnection.newIdeaWindow = window.open(url, "cohere", props);      
	      	cohereConnection.newIdeaWindow.focus();  
	      	cohereConnection.checkIdea(); 
      	} else if (type == CONN_TYPE) {
 	      	cohereConnection.newConnWindow = window.open(url, "cohere", props);      
	      	cohereConnection.newConnWindow.focus();  
	      	cohereConnection.checkConn(); 
     	} else  {	      	
	      	cohereConnection.newWindow = window.open(url, "cohere", props);      
	      	cohereConnection.newWindow.focus();  
	      	cohereConnection.check(); 
	    }	      	   	      	
	},
 	
	/**
 	 * Timer check to wait for the window opened by the clip slidebar to close, then repaint.
  	 */
    checkClip : function() {
  		if (cohereConnection.newClipWindow == null || cohereConnection.newClipWindow.closed) {
    		//var newURL = cohereConnection.getURL();
   			refreshUI(oldTabURL);	      			    
   			//clipsSlideBar.slide(TAB_CLIP_WIDTH, true); // does not work at present
  		} else {
  			setTimeout(function(){cohereConnection.checkClip()},10);
  		}
	},		
 
 	/**
 	 * Timer check to wait for the window opened by the odea slidebar to close, then repaint.
  	 */
    checkIdea : function() {
  		if (cohereConnection.newIdeaWindow == null || cohereConnection.newIdeaWindow.closed) {
    		//var newURL = cohereConnection.getURL();
   			refreshUI(oldTabURL);	   			
   			//ideasSlideBar.slide(TAB_IDEA_WIDTH, true); // does not work at present
  		} else {  		
  			setTimeout(function(){cohereConnection.checkIdea()},10);
  		}
	},		

	/**
 	 * Timer check to wait for the window opened by the connection slidebar to close, then repaint.
  	 */
    checkConn : function() {
  		if (cohereConnection.newConnWindow == null || cohereConnection.newConnWindow.closed) {
    		//var newURL = cohereConnection.getURL();
   			refreshConnectionsUI(oldTabURL);	      			    
 			//connectionsSlideBar.slide(TAB_CONN_WIDTH, true);  // does not work at present   			    			    		    		
  		} else {
  			setTimeout(function(){ cohereConnection.checkConn() } ,10);
  		}
	},		
    
	/**
 	 * Timer check to wait for the window opened by the oer slidebar to close, then repaint.
  	 */
    check : function() {
  		if (cohereConnection.newWindow == null || cohereConnection.newWindow.closed) {
    		//var newURL = cohereConnection.getURL();
	      	refreshUI(oldTabURL);	      			    			    		    		
  		} else {
  			setTimeout(function(){ cohereConnection.check()},10);
  		}
	},		
    
 	/**
 	 * Return the url of the currently focused tab.
  	 */
    getURL : function(){
    	var url = jetpack.tabs.focused.url; //jetpack.tabs.focused.contentWindow.location.href;
    	//if (url.substring(0, 6) == "chrome") {
    	//	url = "";
    	//}
        return url;
    },
    
 	/**
 	 * Return the Cohere base url.
  	 */
    getBase : function(){
        return this.cohereBase;
    },
    
 	/**
 	 * Return the title of the currently focused tab.
  	 */
	getURLTitle : function(){
    	var title = jetpack.tabs.focused.contentDocument.title;
      	if(!title || title == ""){
       		title = jetpack.tabs.focused.contentWindow.location.href;
        }
        return title;
    },
    
 	/**
 	 * Return the currently selected text
 	 * @param charlen optional parameter to specify a maximum character length of the selection to get.
  	 */
    getSelectedText : function(charlen) {
       	var searchStr = jetpack.selection.text;
       	if (searchStr == null || searchStr == "") {
  			// jetpack does not get the selection, if the selection has lost the focus 
  			// as here when a button in the slidebar is pressed.
			// Therefore resorted to getting it from actual browser object.
			var selection = jetpack.tabs.focused.contentWindow.wrappedJSObject.content.getSelection();		
			searchStr = selection.toString();
       	}
    	return this.processSelection(searchStr, charlen);
   	},
     
 	/**
 	 * Clean the currently given text for sending to the Cohere database
 	 * @text the text to process.
 	 * @param charlen optional parameter to specify a maximum character length of the selection to get.
  	 */
    processSelection : function(text, charlen) {
    	var searchStr = text;
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
     
 	/**
 	 * Compose the parameters required to send to the Cohere url window
 	 * @clip the text of the clip.
  	 */
	getClip : function(clip) {
        var data = "&clip"+"=" + encodeURIComponent(clip);
        data += "&url"+"=" + encodeURIComponent(this.getURL());
        data += "&title"+"=" + encodeURIComponent(this.getURLTitle());
    
    	return data;
   	},
 
  	/**
 	 * Compose the parameters required to send to a Cohere service call for creating a new clip with
 	 * @clip the text of the clip.
  	 */
    getClipService : function(clip) {
        var data = "&clip=" + encodeURIComponent(clip);
        data += "&url=" + encodeURIComponent(this.getURL());
        data += "&title=" + encodeURIComponent(this.getURLTitle());
        data += "&desc=";    
    	return data;
   	},
        
  	/**
 	 * Compose the parameters required to send to a Cohere service call for the current url
 	 * @clip the text of the clip.
  	 */
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