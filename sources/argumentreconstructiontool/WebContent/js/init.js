/* ----------------------------------------------------------------------------
 * Copyright (c) 2012 Leibniz Center for Law, University of Amsterdam, the 
 * Netherlands
 *
 * This program and the accompanying materials are licensed and made available
 * under the terms and conditions of the European Union Public Licence (EUPL 
 * v.1.1).
 *
 * You should have received a copy of the  European Union Public Licence (EUPL 
 * v.1.1) along with this program as the file license.txt; if not, please see
 * http://joinup.ec.europa.eu/software/page/eupl/licence-eupl.
 *
 * This software is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 * ----------------------------------------------------------------------------
 * Project:      IMPACT
 * Created:      2011-2012
 * Last Change:  14.12.2012 (final release date)
 * ----------------------------------------------------------------------------
 * Created by the Leibniz Center for Law, University of Amsterdam, The 
 * Netherlands, 2012
 * Authors: Jochem Douw (http://jochemdouw.nl), Sander Latour
 * ----------------------------------------------------------------------------
 */
if(typeof(ART) == "undefined"){
  /**
   * The ART variable is initialised with an empty array. This might also 
   * happen in another document, as we have no mechanism of controlling which 
   * ART property/function is defined first. 
   **/
  ART = {};
}
ART.initDone = false; //variable to let the start() method know whether it needs to run. As long as this variable is set to false, the js-files have not been lazy loaded, so we can't presume prototypes are available yet.
/**
 * The init function is called at the moment that the toolbox is loaded, in 
 * effect, all tools are loaded from the start of using the toolbox. This may 
 * mean some initial time to load, but make loading tools as they are used 
 * faster.
 * The following happens in this function: The skeleton HTML structure is 
 * built, other JS resources are loaded, a root URL is set for retrieval of 
 * remote documents and the remote API. The argument scheme XML file is loaded, 
 * and finally the starting position of the ART is loaded.
 * When the variable "test" is set to true, the normal ART interface is being 
 * replaced by the output of test functions.
 * 
 * @param toolboxState
 *            (the function IS NOT allowed to make changes on it)
 **/
ART.init = function(toolboxState){
  var test = false; // if true, a test is being performed. Set to false for production phase.
  //insert the basic (fixed) HTML 'skeleton'
 /*           .html($("<p>")
                .attr("style","font-size: 30px; color: #AAAAAA")
                .text("No document selected.")
            )*/
  //Code should be updated/activated when given to UID
  var filesToLoad = new Array(
    'config/config.js',  
    'js/store.js',
    'js/inheritance.js',
    'js/draw.js',
    'js/selector.js',
    'js/helptext.js',
    'js/views/Render.js',
    'js/views/DiscussionRender.js',
    'js/views/RelationRender.js',
    'js/views/DocumentRender.js',
    'js/models/DbItem.js',
    'js/models/TextSection.js',
    'js/models/Annotation.js',
    'js/models/Relation.js',
    'js/models/Discussion.js',
    'js/models/Premise.js',
    'js/models/Conclusion.js',
    'js/models/Document.js',
    'js/pages.js',
    'js/misc.js'
  );
  if(test) filesToLoad.push('test/js-function-test.js');

  for(i = 0; i < filesToLoad.length; i++) {
    filesToLoad[i] = toolboxState.art.path + "/" + filesToLoad[i];
  }
  //callback for after the scripts are loaded
  var callback = function(){
    //This is the only place in which the root is defined
    Store.setData('root', ART.root);//replace second parameter by '/impact/art/' when uploading to Justinian
    DbItem.setStorageURL(Store.getData("root")+"php/api.php?");
    ART.initSelector();
    $.ajax({
      type: "GET",
      url: Store.getData("root")+"php/relations.xml",
      dataType: "xml",
      success: function(xml){
        Scheme = $(xml);
        Store.setData("Scheme", Scheme);
        var ARTDiv = $("div#art");  
        ARTDiv.append(
          $("<div>").attr("id", "canvasleft")
          );
        ARTDiv.append(
          $("<div>").attr("style", "display: inline")
          .attr("id", "canvasright"));
        if(test){
          ART.functionTest(); //All tests are placed in the test dir.
        } else {
          Pages.loadStartingPosition();
          Pages.clearCanvasRight();
          ART.initDone = true; //see info above
        }
      }
    });
  }
  ART.lazyLoadScriptResources(filesToLoad, callback);
};

/**
 * The start function is called every time the user clicks the button to load 
 * this tool. The given toolboxState can be used to transfer state depending 
 * values from tool to tool and from the tools to the toolbox.
 * 
 * @param toolboxState the current toolboxState
 * @returns {Object} the toolboxState (the function is allowed to make changes 
 * on it)
 * @since 12 June 2012
 **/
ART.start = function(toolboxState){
  //empty the div just in case something went wrong with the stopping process.
  if(ART.initDone){ //for info, see initialisation of this variable
    $("div#art").empty();
    var ARTDiv = $("div#art");  
    ARTDiv.append(
        $("<div>").attr("id", "canvasleft")
        );
    ARTDiv.append(
        $("<div>").attr("style", "display: inline")
        .attr("id", "canvasright"));
    Pages.loadStartingPosition();
    Pages.clearCanvasRight();
  }
  return toolboxState;
};

/**
 * The stop function is called every time the user clicks the button to load 
 * another tool. The given toolboxState can be used to transfer state depending 
 * values from tool to tool and from the tools to the toolbox.
 * @param toolboxState the current toolboxState
 * @returns {Object} the toolboxState (the function is allowed to make changes 
 * on it)
 */
ART.stop = function(toolboxState){
  //The ART-div will be hidden by the toolbox, disabling user interface. These hidden elements will have to be reloaded in the start() function anyway, so we empty the div here so the elements can't slow down the toolbox.
  $("div#art").empty();
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
ART.languageChanged = function(newLanguage){
  if(newLanguage == "en"){
    return true;
  } else {
    alert("At this moment, the only supported language by the ART is English.");
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
ART.canBeStopped = function(){
  //debug: should retun a value from the Store variable!
  return true;
};

/** This function is meant to load several URLs that might be interdependent. This means that script nr. n should only be loaded when script nr. n-1 has loaded. We use recursive callbacks to achieve this
@param urls The URL's to load
@param finalCallback The callback that has to be executed only after the last script has loaded.
@param URLindex The index of the URL that has to be executed next. Necessary because this is a recursive function. Optional for the first call (0 is default).
@since 28 June 2012
*/
ART.lazyLoadScriptResources = function(urls, finalCallback, URLindex){
  if(!URLindex){
    URLindex = 0;
  }
  intermediateCallback = function(){
    ART.lazyLoadScriptResources(urls, finalCallback, URLindex+1);
  }
  if(URLindex == urls.length){
    //the last script was loaded, execute final callback.
    finalCallback();
  } else if(URLindex <= urls.length && URLindex >= 0){
    //Load the resource with the callbacks (recursion steps)
    ART.lazyLoadScriptResource(urls[URLindex], intermediateCallback);
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
  ART.lazyLoadScriptResource = function(url, callback){
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
  ART.getUserInfos = function(token){
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
