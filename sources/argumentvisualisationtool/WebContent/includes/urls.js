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
 * Javascript functions for URLs
 */

/**
 * Render a list of nodes
 */
function displayURLs(objDiv,urls,start){
	objDiv.insert('<div style="clear:both; margin: 0px; padding: 0px;"></div>');
	var lOL = new Element("ol", {'start':start, 'class':'idea-list-ol'});
	for(var i=0; i< urls.length; i++){
		if(urls[i].url){		
			var iUL = new Element("li", {'id':urls[i].url.urlid, 'class':'idea-list-li'});
			lOL.insert(iUL);
			var nWrap = new Element("div", {'class':'idea-li-wrapper'});
			var liNo = new Element("div", {'class':'li-no'}).insert(start+i + ".");			
			var inChk = new Element("input",{'type':'checkbox','class':'urlcheck','id':'urlcheck'+urls[i].url.urlid});
			var blobDiv = new Element("div", {'class':'idea-blob'});			
			var blobNode = renderURL(urls[i].url);
			blobDiv.insert(blobNode);
			nWrap.insert(liNo).insert(inChk).insert(blobDiv);
			iUL.insert(nWrap);
		}
	}
	objDiv.insert(lOL);
}

function renderURL(url){
	
	var objDiv = new Element("div",{id:'context','style':'border-bottom:1px solid #d3e8e8;'});
	
	var uiDiv = new Element("div",{id:'contextinfo'});
	
	if(url.clip != ""){
		uiDiv.insert("<p class='urllist' style><b>Clip: </b>" + url.clip + "</p>");
	} 
	uiDiv.insert("<p class='urllist'><b style='font-size: 120%'><a href=url.php?urlid="+ url.urlid +">" + url.title + "</a></b></p>");
	if(url.description){
		uiDiv.insert("<p class='urllist'><b>Desc: </b>" + url.description + "</p>");
	}
	if(url.tags){
		var tagsStr = "<p class='urllist'><b>Tags: </b>";
		if(url.tags && url.tags.length > 0){
			for (var i=0 ; i< url.tags.length; i++){
				if (i > 0) {
					tagsStr += ", ";
				}
				tagsStr += '<a href="'+URL_ROOT+'tagsearch.php?q='+url.tags[i].tag.name+'&scope=all&tagsonly=true">'+url.tags[i].tag.name+'</a>';
			}
		}	
		tagsStr += "</p>";
		uiDiv.insert(tagsStr);
	}
	var opt = new Element("p");
	opt.className = 'urllist';
	opt.insert("<a href='"+ url.url +"' target='_blank' title='Visit website - opens in new browser window'>[Visit site]</a>");
	if (USER == url.userid){
		opt.insert(" <a href='javascript:loadDialog(\"editurl\",\""+URL_ROOT+"plugin/ui/url.php?urlid="+url.urlid+"\")'>[Edit]</a>");
		opt.insert(" <a href='javascript:deleteURL(\""+url.urlid+"\",\""+url.title+"\")'>[Delete]</a>");
	}
	uiDiv.insert(opt);
	
	// Add spam icon
	var spamimg = document.createElement('img');
	spamimg.style.verticalAlign="bottom";
	spamimg.style.marginLeft="5px";
	if(USER != ""){
		if (url.status == 1) {
			spamimg.setAttribute('alt', 'This website has been reported as Spam / Inappropriate');
			spamimg.setAttribute('title', 'This website has been reported Spam / Inappropriate');
			spamimg.setAttribute('src', URL_ROOT+'images/spam-reported.png');
		} else if (url.status == 0) {
			spamimg.setAttribute('alt', 'Report this Website as Spam / Inappropriate');
			spamimg.setAttribute('title', 'Report this Website as Spam / Inappropriate');
			spamimg.setAttribute('src', URL_ROOT+'images/spam.png');
			spamimg.id = url.urlid;
			spamimg.label = url.url;
			spamimg.style.cursor = 'pointer';	   	
			Event.observe(spamimg,'click',function (){ reportURLSpamAlert(this, url) } );
		}
	} else {
		spamimg.setAttribute('alt', 'Login to reported this as Spam / Inappropriate content');
		spamimg.setAttribute('title', 'Login to reported this as Spam / Inappropriate content');
		spamimg.setAttribute('src', URL_ROOT+'images/spam-disabled.png');
	}
	opt.insert(spamimg);
	
	objDiv.insert(uiDiv);
	objDiv.insert("<div style='clear:both'></div>");
	return objDiv;
}

/**
 * Delete the selected URL
 */
function deleteURL(uid, uname){
	var ans = confirm("Are you sure you want to delete the url '"+uname+"'?");
	if(ans){
		var reqUrl = SERVICE_ROOT + "&method=deleteurl&urlid=" + encodeURIComponent(uid);
		new Ajax.Request(reqUrl, { method:'get',
  			onSuccess: function(transport){
  				var json = transport.responseText.evalJSON();
      			if(json.error){
      				alert(json.error[0].message);
      				return;
      			}      	
				//now refresh the page
				try {
			        window.location.reload(true);
			    } catch(err) {
			        //do nothing   
			    }
    		}
  		});
	
	}
}

/**
 * Send a spam alert to the server.
 */
function reportURLSpamAlert(obj, url) {	
	var ans = confirm("Are you sure you want to report \n\n"+obj.label+"\n\nas Spam / Inappropriate?\n\n");
	if (ans){			
		var reqUrl = URL_ROOT + "spamalert.php?type=url&id="+obj.id;
		new Ajax.Request(reqUrl, { method:'get',
			onError: function(error) {
			},
			onSuccess: function(transport){
				obj.setAttribute('alt', 'This website has been reported as Spam / Inappropriate');
				obj.setAttribute('title', 'This website has been reported as Spam / Inappropriate');
				obj.setAttribute('src', URL_ROOT+'images/spam-reported.png');
				obj.style.cursor = 'auto';	   	
				$(obj).unbind("click");	    				
				url.status = 1;
			}
		});
	}
}

/**
 *	do an action on all the currently selected items
 */
function groupActionURLClick(event){
	var opt = $('url-groupaction-select').options[$('url-groupaction-select').selectedIndex].value;
	switch (opt){
		case "tagallselectedurls":
			tagAllSelectedURLs();
			break;
		default:
			//do nothing
	}
}

/**
 *	do an action on all the currently selected items
 */
function groupActionURLChange(event){
	var opt = $('url-groupaction-select').options[$('url-groupaction-select').selectedIndex].value;

	switch (opt){
		case "tagallselectedurls":
			$('url-addtagaction').show();
			break;
		default:
			$('url-addtagaction').hide();
	}
}

/**
 *	select all the urls on the page
 */
function selectAllURLs(event){
	var nodes = $("tab-content-web").select('[class="urlcheck"]');
	nodes.each(function(name, index) {
		nodes[index].checked = true;
		}); 
}

/**
 *	deselect all the urls on the page
 */
function selectNoURLs(event){
	var nodes = $("tab-content-web").select('[class="urlcheck"]');
	nodes.each(function(name, index) {
		nodes[index].checked = false;
		}); 
}

/**
 *	get all the selected connection ids
 */
function getSelectedURLIDs(){
	var retArr = new Array();
	var cs = $("tab-content-web").select('[class="urlcheck"]');
	cs.each(function(name, index) {
		if(cs[index].checked){
			retArr.push(cs[index].id.replace(/urlcheck/,''));
		}
	});
	return retArr;
}

/**
 *	Tag all the selected urls
 */
function tagAllSelectedURLs(){
	
	var selectedURLs = getSelectedURLIDs();
	if(selectedURLs.length == 0){
		alert("You must first select some websites.");
		return;
	}
	var tags = $('url-addtagaction').value;
	if(tags == ""){
		alert("You must add at least one tag.");
		return;
	} else {
		//alert("tag:"+tags);
	}

	var reqUrl = SERVICE_ROOT + "&method=addtagstourls&urlids=" + encodeURIComponent(selectedURLs.join(","))+"&tags="+ encodeURIComponent(tags);
	new Ajax.Request(reqUrl, { method:'get',
 			onSuccess: function(transport){
 				//now refresh the page
				try {
			        window.location.reload(true);
			    } catch(err) {
			        //do nothing   
			    }    	
   		}
	});
}