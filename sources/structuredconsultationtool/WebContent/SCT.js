if(typeof(SCT) == "undefined"){
	SCT = {};
}

  
SCT.init = function(toolboxState){
    
    var path = toolboxState.sct.path;
   
        var scripts = new Array(
           'navigation.js'
       );
       
       for(i = 0; i < scripts.length; i++) {
            scripts[i] = path + "/" + scripts[i];            
        }
  
     
	
        SCT.lazyLoadScriptResources(scripts);
        
        var css_root = path + '/toolbox/css/impact-ui/';
        var styles = [
            'survey.css'
        ];

        var loadCSS = function (css) {
            var url = css_root + css;
            var head = $('head');
            head.append('<link rel="stylesheet" href="'+url+'" type="text/css" />');          
        };
        
      
        // Load CSS styles
        styles.forEach(loadCSS);
        
        return toolboxState;
};  

/**
     The start function is called every time the user clicks the button to load this tool. The given toolboxState can be used to transfer state depending values from tool to tool and from the tools to the toolbox.
     * 
     * @param toolboxState
     *            the current toolboxState
     * @returns {Object} the toolboxState (the function is allowed to make changes on it)
			@since 12 June 2012
*/
SCT.start = function(toolboxState){
	//empty the div just in case something went wrong with the stopping process.
	$("<div>").empty();
	//SCT.init(toolboxState);
	var loadIndex = function(){
            var path = toolboxState.sct.path;
            var sctDiv = $("div#sct");
            sctDiv.load(path+'/index.php', function(){
                $("#home_forum_name_input").keypress(function (e) {
                  if (e.which == 13) {
                        e.preventDefault();
                        $("#tocircumstance").trigger("click");
                        return false;
                  }

                });


                  if(toolboxState.userLoggedIn)
                  {
                        $("#home_forum_name_input").val(toolboxState.username);
                  }


        });
	}

	loadIndex();
	return toolboxState;
};

/**
     * The stop function is called every time the user clicks the button to load another tool. The
     * given toolboxState can be used to transfer state depending values from tool to tool and from
     * the tools to the toolbox.
     * 
     * @param toolboxState
     *            the current toolboxState
     * @returns {Object} the toolboxState (the function is allowed to make changes on it)
     */
SCT.stop = function(toolboxState){
	$("<div>").empty();
	return toolboxState;
};

/**
     * A function to change the tools languages. Supported languages by the toolbox: English,
     * German, Dutch, French, Italian, Spanish, Chinese. languageChanged() is the only function that
     * we want to allow switching in mid-use. This is the only aspect of the state that can be
     * changed, no other functions. If the new language isn't supported, this function returns false
     * and the toolbox shows a notification to the user, that the selected tools doesn't support
     * this language. This function is only called on visible tools. Inactive tools must read the
     * language in their start() method!
     * 
     * @param {String}
     *            newLanguage a 2 letter identifier for the new language (example: 'en')
     * @returns {Boolean} true if the new language is supported, false otherwise

@since 13 June 2012
*/
SCT.languageChanged = function(newLanguage){
	if(newLanguage == "en"){
		return true;
	} else {
    alert("At this moment, the only supported language by the Structured Consultation Tool is English.");
		return false;
	}
};

/**
     * The method returns true or false based on whether the user is currently editing something
     * that might interfere with input in the other tools. When a user switches from one tool to
     * another, and can't be stopped, a message is shown from the toolbox with the choice of either
     * losing the not-saved data (the toolbox will then call the stop-method of the current tool)
     * and switch, or continue with the current tool.
     * 
     * @returns {Boolean} true or false based on whether the tool can be stopped or not
     */
SCT.canBeStopped = function(){
	return true;
};

/** This function is meant to load several URLs that might be interdependent. This means that script nr. n should only be loaded when script nr. n-1 has loaded. We use recursive callbacks to achieve this
@param urls The URL's to load
@param finalCallback The callback that has to be executed only after the last script has loaded.
@param URLindex The index of the URL that has to be executed next. Necessary because this is a recursive function. Optional for the first call (0 is default).
@since 28 June 2012
*/


SCT.lazyLoadScriptResources = function(urls, finalCallback, URLindex){
  if(!URLindex){
    URLindex = 0;
  }
  intermediateCallback = function(){
    SCT.lazyLoadScriptResources(urls, finalCallback, URLindex+1);
  }
  if(URLindex == urls.length){
    //the last script was loaded, execute final callback.
    if(finalCallback){
        finalCallback();
    }
  } else if(URLindex <= urls.length && URLindex >= 0){
    //Load the resource with the callbacks (recursion steps)
    SCT.lazyLoadScriptResource(urls[URLindex], intermediateCallback);
  } else {
    console.log("function lazyLoadScriptResources: URLindex has illegal value");
  }
};

/**
 * Replace the normal jQuery getScript function with one that supports debugging and which
 * references the script files as external resources rather than in-lining it.
 * 
 * @param url
 *            the URL of the java script resource to load
 * @param callback
 *            a callback function to be called after the resource is completely loaded
 * @see: http://www.lockencreations.com/2011/07/02/cant-debug-imported-js-files-when-using-jquery-getscript/
 */
 SCT.lazyLoadScriptResource = function(url, callback){
			var head = document.getElementsByTagName("head")[0];
	
			var script = document.createElement("script");
			script.src = url;
	
			// Handle Script loading
			var done = false;
	
			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function()
			{
					if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete"))
					{
							done = true;
							if (callback)
							{
									callback();
							}
	
							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;
					}
			};
	
			head.appendChild(script);
	
			// We handle everything using the script element injection
			return undefined;
	};
	
/**
 * This function loads the user data which corresponds to the given userToken.
 * If the token is not valid, the user data will be empty. 
 * 
 * @param token
 *            the user token which is a temporary identifier of the user
 */
	SCT.getUserInfos = function(token){
			$.ajax(
			{
					type : 'POST',
					url : "http://impact.uid.com:8080/impact/api/userinfo",
					data : token,
					dataType : "json",
					contentType : "text/plain",

					success : function(jsonData)
					{
							// this is the users name, something like "A user name"
							userName = jsonData.name;
							
							// this is a picture of the user
							userPicUrl = jsonData.pic_url;
							
							// this is the unique identifier of the user, created by the toolbox. This identifier won't change at any time.
							// the userToken is only valid in the current session and will change if the user returns!
							// This userId could now be used to be maped to other user data.
							userId = jsonData.unique_id;
							
							// we could read out more user data from facebook/google if necessary, par example the Email.
							
							error = jsonData.error;
							if (error == "")
							{
									// the user is logged in (authorized)
							}
							else
							{
									// the user is NOT logged in => NOT authorized
							}

					},

					error : function(jqXHR, textStatus, errorThrown)
					{
							// the user is NOT logged in => NOT authorized
					}

			});
	};
