var toolboxState =
{

    userToken : "05199deca16614131327f2c3fea9031c",
    language : 'en',
    currentDebateId : "19482142130992902001326731219",
    currentTool : null,

    art :
    {
        path : "http://impact.uid.com:8080/argumentreconstructiontool",
        div : "art",
        icon : "toolbox/css/impact-ui/images/toollogos/Icon_ArgumentReconstruction.png",
    },
    avt :
    {
        path : "http://impact.uid.com:8080/argumentvisualisationtool",
        div : "avt",
        icon : "toolbox/css/impact-ui/images/toollogos/Icon_ArgumentAnalysisTrackingVisual.png",
    },
    pmt :
    {
        path : "http://impact.uid.com:8080/policymodellingtool",
        div : "pm",
        icon : "toolbox/css/impact-ui/images/toollogos/Icon_PolicyModelling.png"
    },
    sct :
    {
        path : "http://impact.uid.com:8080/structuredconsultationtool",
        div : "sct",
        icon : "toolbox/css/impact-ui/images/toollogos/Icon_StructuredConsultation.png",
    },
    toolbox :
    {
        path : "http://impact.uid.com:8080/toolbox",
    }
};

$(document).ready(function()
{
    ImpactToolbox.init();
});

var ImpactToolbox =
{

    init : function()
    {
        // getCookie();
        $(window).resize(function()
        {
            ImpactToolbox.increaseHeight();
            ImpactToolbox.resetTiles();
        });

        token = ImpactToolbox.readCookie("token");
        if (token != null)
        {
            // user is known by the Server
            infos = ImpactToolbox.getUserInfos(token);
        }

        $('#logout').click(function()
        {
            ImpactToolbox.logout();
        });

        // $("#container_outer").click(function(e)
        // {
        // var target = e.target;
        // var loggedin = $("#user");
        // var hasTheseElements = loggedin.has(target);
        //
        // // only remove the Options Popup if something else is clicked
        // if (hasTheseElements.length == 0)
        // {
        // $("#useroptions").hide();
        // $("#user").removeClass("openedOptions");
        //            }
        // });


        // $("#user").click(function()
        // {
        // $("#useroptions").show();
        // $("#user").addClass("openedOptions");
        //
        // });

        PM.init(toolboxState);
        ART.init(toolboxState);
        AVT.init(toolboxState);
        SCT.init(toolboxState);

        // Lazy Loading
        if (typeof ImpactUI == "undefined")
        {
            dynamicallyLoadJSFile('http://impact.uid.com:8080/impact/toolbox/js/impact-ui/impact-init.js', function()
            {
                $("body").data("navi", 999);
                ImpactToolbox.increaseHeight();
                ImpactUI.init();
                tool = ImpactToolbox.getURLParameter("tool");
                ImpactToolbox.loadTool(tool);
            });
        }
        
        ImpactToolbox.initSearchButton();
        ImpactToolbox.initLanguageSwitch();
        
    },
    
    initSearchButton : function()
    {
      $("#searchbutton").click(function()
      {
          ImpactToolbox.showUnderConstructionDialog();
      });
    },

    initLanguageSwitch : function()
    {
      $("#languageselection").change(function() 
      {
          ImpactToolbox.showUnderConstructionDialog();
      });
    },
    
    showUnderConstructionDialog : function()
    {
        $('<div class="toInit"></div>')
        .appendTo('body')
        .html(
                '<div><p>Sorry, this function is under construction.<br />We are working on this project and hope to include this function soon.</p></div>')
        .dialog(
        {
            modal : true,
            title : "Under Construction!",
            zIndex : 10000,
            autoOpen : true,
            width : 'auto',
            resizable : false,
            buttons :
            {
                Ok : function()
                {
                    $(this).dialog("close");
                }
            },
            close : function(event, ui)
            {
                $(this).remove();
            }
        });
        ImpactUI.init();
    },
    
    getURLParameter : function(name)
    {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [ ,
                "" ])[1].replace(/\+/g, '%20'))
                || null;
    },

    loadTool : function(name)
    {
        switch (tool)
        {
        case "art":
        case "argumentreconstructiontool":
            ImpactToolbox.setNavi(2);
            break;
        case "avt":
        case "argumentvisualisationtool":
            ImpactToolbox.setNavi(3);
            break;
        case "pmt":
        case "policymodelingtool":
            ImpactToolbox.setNavi(4);
            break;
        case "sct":
        case "structuredconsultationtool":
            ImpactToolbox.setNavi(5);
            break;
        default:
            ImpactToolbox.setNavi(0);
            break;
        }
    },

    relaod : function()
    {
        window.location.reload();
    },

    increaseHeight : function()
    {

        var windowheight = $(window).height();
        var bodyheight = $("body").height();
        var stagehight = $("#stagebg").height();
        var navi = $("#navi");

        difference = windowheight - bodyheight;
        $("#stagebg").height(stagehight + difference);
        $("#stage").height(stagehight + difference);
        $("#avt").height(stagehight + difference - 1);
        // 20 to fix IE bug
        navi.height(windowheight - navi.offset().top - 20);
    },

    resetTiles : function()
    {
        test = document.getElementById('home_bottom');
        if (test == null || test == undefined)
        {
            return;
        }

        /* main.css 630 */
        welcome = 340;
        seperator = 8;
        height = ($('#stagebg').height() - welcome - seperator + 49);

        $('#home_bottom').css("height", height);

        width = ($('#stagebg').width());
        tilewidth = Math.floor(width / 4);

        $("div[class^=tile]").each(function()
        {
            $(this).css("width", tilewidth);
        })
    },
    setToken : function(token)
    {
        ImpactToolbox.createCookie("token", token, 7);
    },

    getUserInfos : function(token)
    {
        console.log(token);
        $.ajax(
        {
            type : 'POST',
            url : "/impact/api/userinfo",
            data : token,
            dataType : "json",
            contentType : "text/plain",

            success : function(jsonData)
            {
                console.log(jsonData);
                userName = jsonData.name;
                toolboxState.userLoggedIn = true;
                toolboxState.username = userName;
                userPicUrl = jsonData.pic_url;
                error = jsonData.error;
                if (error == "")
                {
                    ImpactToolbox.loggedIn(userName, userPicUrl);
                }
                else
                {
                    console.log(error);
                    ImpactToolbox.removeCookie("token");
                }

            }
        });
    },

    loggedIn : function(name, picurl)
    {
        console.log(name);
        console.log(picurl);
        if (name != "undefined" && picurl != "undefined")
        {
            $("#login").hide();
            $("#username")[0].innerHTML = name;
            $("#user").children("img").attr("src", picurl);
            $("#loggedin").css("display", "inline-block");
        }
    },

    logout : function()
    {
        $.ajax(
        {
            type : 'POST',
            url : "/impact/api/logout",
            data : token,
            success : function()
            {
                ImpactToolbox.removeCookie("token");
                $("#login").show();
                $("#loggedin").hide();
                location.reload();
            }
        });
    },

    setNavi : function(id)
    {
        if (toolboxState.currentTool == null || toolboxState.currentTool.canBeStopped() == true)
        {
            if (id != $("body").data("navi"))
            {
                $("body").data("navi_last", $("body").data("navi"));
                $("body").data("navi", id);
                ImpactToolbox.updateNavi();
            }
        }
        else
        {
            $('<div class="toInit"></div>')
                    .appendTo('body')
                    .html(
                            '<div><h6>Are you sure you want to navigate away from this page?</h6> <p>The changes you made will be lost if you navigate away from this page.</p> <p>Press YES to continue, or NO to stay on the current page.</p></div>')
                    .dialog(
                    {
                        modal : true,
                        title : "Please confirm",
                        zIndex : 10000,
                        autoOpen : true,
                        width : 'auto',
                        resizable : false,
                        buttons :
                        {
                            Yes : function()
                            {
                                if (id != $("body").data("navi"))
                                {
                                    $("body").data("navi_last", $("body").data("navi"));
                                    $("body").data("navi", id);
                                    ImpactToolbox.updateNavi();
                                }
                                $(this).dialog("close");
                            },
                            No : function()
                            {
                                $(this).dialog("close");
                            }
                        },
                        close : function(event, ui)
                        {
                            $(this).remove();
                        }
                    });
            ImpactUI.init();
        }
    },

    updateNavi : function()
    {
        current = $("body").data("navi");
        last = $("body").data("navi_last");

        $(".button.nav" + last).removeClass("active");
        $(".button.nav" + current).addClass("active");

        $("#buttonbg").removeClass("nav" + last);
        $("#buttonbg").addClass("nav" + current);

        $('#stage').fadeOut('fast', function()
        {
            $("#stage")[0].innerHTML = "";
            ImpactToolbox.setPage();
        });
        $("#toollogo").fadeOut('fast', function()
        {
        });
    },

    setPage : function()
    {
        try
        {
            $.address.path("/");
        }
        catch (e)
        {
            console.log(e);
        }

        if (toolboxState.currentTool != null)
        {
            toolboxState = toolboxState.currentTool.stop(toolboxState);
        }

        $("#toollogo").css("visibility", "visible");
        switch ($("body").data("navi"))
        {
        case 0: // HOME
            $.get("http://impact.uid.com:8080/impact/toolbox/subpages/home.html", function(data)
            {
                $("#stage")[0].innerHTML = "<div id='static-content' width='100%'>" + data + "</div>";
                $("#toollogo").css("visibility", "hidden");
                toolboxState.currentTool = null;
                ImpactToolbox.resetTiles();
            });
            break;

        case 1: // Topics
            $("#toollogo").attr("src", "toolbox/css/impact-ui/images/toollogos/Icon_TopicOverview.png");
            $("#stage")[0].innerHTML = "<h1>Topics within the IMPACT toolbox:</h1><h2>1.) Copyright in the Knowledge Economy</h2><p><a target='_blank' href='http://ec.europa.eu/internal_market/copyright/docs/copyright-infso/greenpaper_en.pdf#page=2'>View the Green Paper [pdf]</a></p>";
            break;

        case 2: // ART (Argument reconstruction Tool)
            ImpactToolbox.setTool(ART, toolboxState.art);
            break;

        case 3: // AVT (Argument visualisation Tool)
            ImpactToolbox.setTool(AVT, toolboxState.avt);
            ImpactToolbox.increaseHeight();
            break;

        case 4: // PMT (Policy modelling tool)
            ImpactToolbox.setTool(PM, toolboxState.pmt);
            break;

        case 5:// SCT (Structured consultation tool)
            ImpactToolbox.setTool(SCT, toolboxState.sct);
            break;

        case 6:
            $("#toollogo").attr("src", "toolbox/css/impact-ui/images/toollogos/Icon_Home.png");
            $.ajax(
            {
                type : 'Get',
                url : "toolbox/local.html",
                success : function(data)
                {
                    toolboxState.currentTool = null;
                    $("#stage")[0].innerHTML = data;
                    $("#stage").addClass("toInit");
                    ImpactUI.init();
                }
            });
            break;

        case 10: // about
            ImpactToolbox.loadStaticPage("http://impact.uid.com:8080/impact/toolbox/subpages/about.html");

            break;

        case 11: // imprint
            ImpactToolbox.loadStaticPage("http://impact.uid.com:8080/impact/toolbox/subpages/imprint.html");

            break;

        case 12: // contact
            ImpactToolbox.loadStaticPage("http://impact.uid.com:8080/impact/toolbox/subpages/contact.html");

            break;

        case 13: // privacy
            ImpactToolbox.loadStaticPage("http://impact.uid.com:8080/impact/toolbox/subpages/privacy.html");
            break;

        case 14: // help
            ImpactToolbox.loadStaticPage("http://impact.uid.com:8080/impact/toolbox/subpages/help.html");
            break;
        }

        $("#stage").addClass("toInit");
        ImpactUI.init();

        $("#toollogo").fadeIn('fast ', function()
        {

        });
        $('#stage').fadeIn('fast ', function()
        {

        });
    },

    loadStaticPage : function(url)
    {
        $.get(url, function(data)
        {
            $("#stage")[0].innerHTML = "<div id='static-content' width='100%' style=''>" + data + "</div>";
            $("#toollogo").attr("src", "toolbox/css/impact-ui/images/toollogos/Icon_Home.png");
            toolboxState.currentTool = null;
        });
    },

    setTool : function(tool, config)
    {
        $("#stage")[0].innerHTML = "<div id='" + config.div + "'></div>";
        $("#toollogo").attr("src", config.icon);
        toolboxState = tool.start(toolboxState);
        toolboxState.currentTool = tool;
    },

    loginGoogle : function()
    {
        ImpactToolbox.login("/impact/login/google")
    },
    
    loginFacebook : function()
    {
        ImpactToolbox.login("/impact/login/facebook");
    },

    login : function(url)
    {
        $.ajax(
                {
                    type : 'Get',
                    url : url,
                    dataType : "text",
                    success : function(url)
                    {
                        // var authwindow = window.open(url, "");
                        console.log(url);
                
                        // For large applications, you probably need a name for the window to prevent multiple
                        // window for the same goal
                        var name_of_popup = 'new_window_123';
                        // This works just fine unless there is a popup blocker
                        var popup = window.open(url, name_of_popup);
                
                        
                        if(popup == null ||  typeof(popup) == "undefined" || (popup==null && popup.outerWidth == 0)  ||  (popup!=null && popup.outerHeight == 0)  || popup.test == "undefined")
                        {
                            ImpactToolbox.showPopupNotAllowed(url);
                        }
                        else if(popup) {
                            popup.onload = function() {
                                if (popup.screenX === 0) {
                                    ImpactToolbox.showPopupNotAllowed(url);
                                     popup.close();
                                }
                            };
                        }
                    }
                });  
    },

    showPopupNotAllowed : function(url)
    {
        $('<div class="toInit"></div>')
        .appendTo('body')
        .html(
                '<div><p>Please disable your browser popup blocker in order to continue and try it again. You may also <a target="_blank" href="' + url + '">click here to open the login window.</a></p></div>')
        .dialog(
        {
            modal : true,
            title : "The login popup was blocked!",
            zIndex : 10000,
            autoOpen : true,
            width : 'auto',
            resizable : false,
            buttons :
            {
                Cancel : function()
                {
                    $(this).dialog("close");
                }
            },
            close : function(event, ui)
            {
                $(this).remove();
            }
        });
        ImpactUI.init();
    },

    createCookie : function(name, value, days)
    {
        var expires; 
        if (days)
        {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else
            expires = "";
        
        document.cookie = name + "=" + value + expires + "; path=/";
    },

    readCookie : function(name)
    {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for ( var i = 0; i < ca.length; i++)
        {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    removeCookie : function(name)
    {
        ImpactToolbox.createCookie(name, "", -1);
    }
};

/**
 * Replace the normal jQuery getScript function with one that supports debugging and which
 * references the script files as external resources rather than inline. source:
 * http://www.lockencreations.com/2011/07/02/cant-debug-imported-js-files-when-using-jquery-getscript/
 */
function dynamicallyLoadJSFile(url, callback)
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
};

