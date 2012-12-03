
//
// This is how the toolbox state will look like: It will be initialized and provided by the toolbox
//  
//        
//    var toolboxState =
//    {
//    
//        userToken : "05199deca16614131327f2c3fea9031c",
//        language : 'en',
//        currentDebateId : 5,
//    
//        art:{ 
//            path: "http://impact.uid.com:8080/art",
//            div : "art",
//        },
//        avt:{ 
//            path: "http://impact.uid.com:8080/avt",
//            div : "avt",
//        },
//        pmt:{ 
//            path: "http://impact.uid.com:8080/pmt",
//            div : "pmt",
//        },
//        sct:{ 
//            path: "http://impact.uid.com:8080/sct",
//            div : "sct",
//        },
//        toolbox:{ 
//            path: "http://impact.uid.com:8080/toolbox",
//        },
//        
//    };



/**
 * This is an example of "An Impact Tool". This tool is called AIT and has the following API:
 */
var AIT =
{

    /**
     * The init function is called at the moment that the toolbox is loaded, in effect, all tools
     * are loaded from the start of using the toolbox. This may mean some initial time to load, but
     * make loading tools as they are used faster.
     * 
     * @param toolboxState
     *            (the function IS NOT allowed to make changes on it)
     */
    init : function(toolboxState)
    {
        // lazy load all necessary java script files and do all other needed initialization.
        // (can be done with the lazyLoadScriptResource function, see below at the end of the file)
        // Par example read the rootPath of the tool in the toolbox state...
    },

    /**
     * The start function is called every time the user clicks the button to load this tool. The
     * given toolboxState can be used to transfer state depending values from tool to tool and from
     * the tools to the toolbox.
     * 
     * @param toolboxState
     *            the current toolboxState
     * @returns {Object} the toolboxState (the function is allowed to make changes on it)
     */
    start : function(toolboxState)
    {
        // read the id if the HTML <div> from the toolboxState
        // place the HTML of the tool inside this <div>
        // read and handle everything else in the toolbox state (example: language, debateId...)

        // You may need this on the client side, normally user authentication is done on the server side
        // but this goes analogous...
        getUserInfos(toolboxState.userToken);

        return toolboxState;
    },

    /**
     * The stop function is called every time the user clicks the button to load another tool. The
     * given toolboxState can be used to transfer state depending values from tool to tool and from
     * the tools to the toolbox.
     * 
     * @param toolboxState
     *            the current toolboxState
     * @returns {Object} the toolboxState (the function is allowed to make changes on it)
     */
    stop : function(toolboxState)
    {
        // do everything which is needed to close/shutdown the tool
        // write changes to the toolbox state (example: debateId, or what ever was changed)
        // the toolbox will remove the HTML from the <div> automatically.

        return toolboxState;
    },

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
     */
    languageChanged : function(newLanguage)
    {
        // change the language inside the tool. Everything else is handled by the toolbox
        return false;
    },

    /**
     * The method returns true or false based on whether the user is currently editing something
     * that might interfere with input in the other tools. When a user switches from one tool to
     * another, and can’t be stopped, a message is shown from the toolbox with the choice of either
     * losing the not-saved data (the toolbox will then call the stop-method of the current tool)
     * and switch, or continue with the current tool.
     * 
     * @returns {Boolean} true or false based on whether the tool can be stopped or not
     */
    canBeStopped : function()
    {
        return true;
    },

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
    lazyLoadScriptResource : function(url, callback)
    {
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
    },

    /**
     * This function loads the user data which corresponds to the given userToken.
     * If the token is not valid, the user data will be empty. 
     * 
     * @param token
     *            the user token which is a temporary identifier of the user
     */
    getUserInfos : function(token)
    {
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
    }

};
