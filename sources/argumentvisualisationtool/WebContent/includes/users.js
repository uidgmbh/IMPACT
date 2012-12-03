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
 * Javascript functions for users
 */
function displayUsers(objDiv,users,start){
	
	var lOL = new Element("ol", {'class':'user-list-ol'});
	for(var i=0; i< users.length; i++){
		if(users[i].user){
			var iUL = new Element("li", {'id':users[i].user.userid, 'class':'user-list-li'});
			lOL.insert(iUL);			
			var blobDiv = new Element("div", {'class':'user-blob'});
			var blobUser = renderUser(users[i].user);
			blobDiv.insert(blobUser);
			iUL.insert(blobDiv);
		}
	}
	objDiv.insert(lOL);
}

/**
 * Send a spam alert to the server.
 */
function reportUserSpamAlert(obj, user) {	
	var ans = confirm("Are you sure you want to report \n\n"+obj.label+"\n\nas a Spammer / Inappropriate?\n\n");
	if (ans){			
		var reqUrl = URL_ROOT + "spamalert.php?type=user&id="+obj.id;
		new Ajax.Request(reqUrl, { method:'get',
			onError: function(error) {
			},
			onSuccess: function(transport){
				obj.setAttribute('alt', 'User or Group has been reported as a Spammer / Inappropriate');
				obj.setAttribute('title', 'User or Group has been reported as a Spammer / Inappropriate');
				obj.setAttribute('src', URL_ROOT+'images/spam-reported.png');
				obj.style.cursor = 'auto';	   	
				$(obj).unbind("click");	    				
				user.status = 1;
			}
		});
	}
}

function renderUser(user){

	var uDiv = new Element("div",{id:'context'});	

	var imgDiv = new Element("div");	
	imgDiv.style.cssFloat = "left";
	uDiv.insert(imgDiv);

	var cI = new Element('div',{'id':'contextimage'});
	if(user.isgroup == 'Y'){
		cI.insert("<a href='group.php?groupid="+ user.userid +"'><img src='"+user.photo+"'/></a>");
	} else {
		cI.insert("<a href='user.php?userid="+ user.userid +"'><img src='"+user.photo+"'/></a>")
	}
	
	// Add spam icon
	var spamDiv = new Element("div");
	spamDiv.style.marginTop="5px";
	spamDiv.style.cssFloat = "left";
	spamDiv.style.clear = "both";
	var spamimg = document.createElement('img');
	spamimg.style.verticalAlign="bottom";
	spamimg.style.marginLeft="5px";
	if(USER != ""){
		if (user.status == 1) {
			spamimg.setAttribute('alt', 'User or Group has been reported as a Spammer / Inappropriate');
			spamimg.setAttribute('title', 'User or Group has been reported as a Spammer / Inappropriate');
			spamimg.setAttribute('src', URL_ROOT+'images/spam-reported.png');
		} else if (user.status == 0) {
			spamimg.setAttribute('alt', 'Report this User or Group as a Spammer / Inappropriate');
			spamimg.setAttribute('title', 'Report this User or Group as a Spammer / Inappropriate');
			spamimg.setAttribute('src', URL_ROOT+'images/spam.png');
			spamimg.id = user.userid;
			spamimg.label = user.name;
			spamimg.style.cursor = 'pointer';	   	
			Event.observe(spamimg,'click',function (){ reportUserSpamAlert(this, user) } );
		}
	} else {
		spamimg.setAttribute('alt', 'Login to reported this User or Group as Spam / Inappropriate');
		spamimg.setAttribute('title', 'Login to reported this User or Group as Spam / Inappropriate');
		spamimg.setAttribute('src', URL_ROOT+'images/spam-disabled.png');
	}
	spamDiv.insert(spamimg);	
	cI.insert(spamDiv);	
	imgDiv.insert(cI);	

	var uiDiv = new Element("div",{id:'contextinfo'});
	uiDiv.style.cssFloat = "left";
	uiDiv.style.width='600px';
	uDiv.insert(uiDiv);

	if(user.isgroup == 'N'){
		var statusImg = document.createElement('img');
		statusImg.style.verticalAlign="bottom";
		statusImg.style.marginRight="5px";
		statusImg.setAttribute('alt', 'Offline');
		statusImg.setAttribute('title', 'User offline or inactive for more than 20 minutes');
		statusImg.setAttribute('src', URL_ROOT+'images/red-light.png');
		uiDiv.insert(statusImg);
		if (user.lastactive && user.lastactive > 0) {
			var cDate = new Date(user.lastactive*1000);
			var now = new Date();
			if ( (now.getTime() - cDate.getTime()) < (20*60*1000) ) { // 20 minutes ago
				statusImg.setAttribute('alt', 'Online');
				statusImg.setAttribute('title', 'User active in the last 20 minutes');
				statusImg.setAttribute('src', URL_ROOT+'images/green-light.png');
			}
		}
	}
	
	if(user.isgroup == 'Y'){
		uiDiv.insert("<b><a href='group.php?groupid="+ user.userid +"'>" + user.name + "</a></b>");
	} else { 
		uiDiv.insert("<b><a href='user.php?userid="+ user.userid +"'>" + user.name + "</a></b>");		
	}
				
	if (user.lastactive && user.lastactive > 0) {
		var cDate = new Date(user.lastactive*1000);
		uiDiv.insert("<p><b>Last Active: </b>"+cDate.format(TIME_FORMAT)+"</p>");
	} else {
		var cDate = new Date(user.lastlogin*1000);
		uiDiv.insert("<p><b>Last Active: </b>"+cDate.format(TIME_FORMAT)+"</p>");
	}
		
	if(user.description != ""){
		uiDiv.insert("<p>"+user.description+"</p>");
	}
	if(user.website != ""){
        uiDiv.insert("<p><a href='"+user.website+"' target='_blank'>"+user.website+"</a></p>");
    }
	
	if(user.tags){
		var tagsStr = "<p><b>Profile Tags: </b>";
		if(user.tags && user.tags.length > 0){
			for (var i=0 ; i< user.tags.length; i++){
				if (i > 0) {
					tagsStr += ", ";
				}
				tagsStr += '<a href="'+URL_ROOT+'tagsearch.php?q='+user.tags[i].tag.name+'&scope=all&tagsonly=true">'+user.tags[i].tag.name+'</a>';
			}
		}	
		tagsStr += "</p>";
		uiDiv.insert(tagsStr);
	}			

	uDiv.insert("<div style='clear:both; margin: 0px; padding: 0px; height: 0px;'></div>");
	return uDiv;

}