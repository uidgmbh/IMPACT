$(document).ready(function() {
	$("body").data("navi", 999);
	increaseHight();
	setNavi(0);
	// getCookie();
	$(window).resize(function(){
		increaseHight();
	});
	
	
	
	
	
	token = readCookie("token");
	if (token != null) {
		// user is known by the Server
		infos = getUserInfos(token);
	}
	$("#container_outer").click(function(e) {
		var target = e.target;
		var loggedin = $("#user");
		var hasTheseElements = loggedin.has(target);
		// only remove the Options Popup if something else is clicked
		if (hasTheseElements.length == 0) {
			$("#useroptions").hide();
			$("#user").removeClass("openedOptions");
		}
	});

	$("#user").click(function() {
		$("#useroptions").show();
		$("#user").addClass("openedOptions");

	});

});

function increaseHight(){
	
	var windowheight = $(window).height();
	var bodyheight = $("body").height();
	var stagehight = $("#stage").height();
	var navi = $("#navi");
	
	difference = windowheight-bodyheight;
	console.log("difference: " + difference);
	$("#stage").height(stagehight+difference);
	//20 to fix IE bug
	navi.height(windowheight-navi.offset().top - 20);	
}

function setToken(token) {
	createCookie("token", token, 7);
}

function getUserInfos(token) {
	console.log(token);
	$.ajax({
		type : 'POST',
		url : "/impact/api/userinfo",
		data : token,
		dataType : "json",
		contentType : "text/plain",
		
		success : function(jsonData) {
			console.log(jsonData);
			userName = jsonData.name;
			userPicUrl = jsonData.pic_url;
			error = jsonData.error;
			if (error == "") {
				loggedIn(userName, userPicUrl);
			} else {
				console.log(error);
				removeCookie("token");
			}

		}
	});
}

function loggedIn(name, picurl) {
	console.log(name);
	console.log(picurl);
	if (name != "undefined" && picurl != "undefined") {
		$("#login").hide();
		$("#username")[0].innerHTML = name;
		$("#user").children("img").attr("src", picurl);
		$("#loggedin").css("display","inline-block");
	}
}

function logout() {
	$.ajax({
		type : 'POST',
		url : "/impact/api/logout",
		data : token,
		success : function(bool) {
			if (bool == "true") {
				removeCookie("token");
				location.reload();
			}
		}
	});
}

function setNavi(id) {
	if (id != $("body").data("navi")) {
		$("body").data("navi_last", $("body").data("navi"));
		$("body").data("navi", id);
		updateNavi();
	}
}

function updateNavi() {
	current = $("body").data("navi");
	last = $("body").data("navi_last");

	$(".button.nav" + last).removeClass("active");
	$(".button.nav" + current).addClass("active");

	$("#buttonbg").removeClass("nav" + last);
	$("#buttonbg").addClass("nav" + current);

	$("#stage")[0].innerHTML = "";
	setPage();
}

function setPage() {

	switch ($("body").data("navi")) {
	case 0:
		$.ajax({
			type : 'Get',
			url : "toolbox/local.html",
			success : function(data) {
				$("#stage")[0].innerHTML = data;
				$("#stage").addClass("toInit");
				init();
			}
		});
		break;

	case 1:
		$.ajax({
			type : 'Get',
			url : "toolbox/policy-modelling.html",
			success : function(data) {
				$("#stage")[0].innerHTML = data;
				$("#stage").addClass("toInit");
				init();
			}
		});
		break;

	case 2:
		$.ajax({
			type : 'Get',
			url : "toolbox/control/controls.html",
			success : function(data) {
				$("#stage")[0].innerHTML = data;
				$("#stage").addClass("toInit");
				init();
			}
		});
		
		break;

	case 3:
		$.ajax({
			type : 'Get',
			url : "toolbox/nodes.html",
			success : function(data) {
				$("#stage")[0].innerHTML = data;
				$("#stage").addClass("toInit");
				init();
			}
		});
		break;
	case 4:
		$.ajax({
			type : 'Get',
			url : "http://127.0.0.1:8090/carneadesbrowser/#/argument/aston2/",
			success : function(data) {
				$("#stage")[0].innerHTML = data;
				console.log(data);
				$("#stage").addClass("toInit");
				carneadesBrowserInit();
				set_argumentgraph_url("aston2");
				init();
			}
		});
		break;

	case 5:
		
		/*$.ajax({
			type : 'Get',
			url : "http://127.0.0.1:8090/carneadesws/map/aston2",
			success : function(data) {
				$("#stage").svg(data);
				console.log(data);

			}
		});
		*/
		
		
		$("#stage")[0].innerHTML = "<iframe src='http://127.0.0.1/copyrightScreens/copyrightIntrov2.php' width='100%' height='99%' scrolling='no'></iframe>";
		
		break;

	case 6:
		$('#stage').rssfeed('https://sites.google.com/a/policy-impact.eu/public/project-updates/posts.xml', {
		    limit: 5,
		    date :true
		  });
		
		break;
	}
	
	$("#stage").addClass("toInit");
	init();
}

function showLocalContent(question) {
	$
			.ajax({
				type : 'POST',
				url : "/impact/callotherserver",
				data : "question=" + question,
				success : function(data) {
					$("#result").innerHTML = data;
				}
			});
}

function showTwitterContent(question) {
	$
			.ajax({
				type : 'POST',
				url : "/impact/calltwitter",
				data : "question=" + question,
				success : function(data) {
					$("#result").html("");
					var tweetsJSON = $.parseJSON(data);
					console.log(tweetsJSON);
					$
							.each(
									tweetsJSON.results,
									function(i, tweet) {
										// Uncomment line below to show tweet
										// data in Fire Bug console
										// Very helpful to find out what is
										// available in the tweet objects
										console.log(tweet);
										// Before we continue we check that we
										// got data
										if (tweet.text !== undefined) {

											// Build the html string for the
											// current tweet
											var tweet_html = '<div class="tweet_text">';
											tweet_html += "<div style='font-weight: bold;'>"
													+ tweet.from_user
													+ ": </div>";
											tweet_html += tweet.text;
											tweet_html += '<a href="http://www.twitter.com/';
											tweet_html += tweet.from_user
													+ '/status/' + tweet.id_str
													+ '">';
											tweet_html += ' [link]<\/a><\/div>';

											// Append html string to
											// tweet_container div
											var res = $("tweetresult");
											$("tweetresult").append(tweet_html);
										}
									});
				}
			});
}

/*
 * function showRemoteContent(pos) { $.ajax({ type : 'POST', url :
 * "/impact/remote", data : "position=" + pos, success : function(data) { pos++;
 * parent.frames[0].document.getElementById("result").innerHTML = "The movie on
 * position " + pos + " is " + data; } }); }
 */

/*
 * function loadSVG(text) { $.ajax({ type : 'POST', url :
 * "/SampleRestServer/server/svg", data : text, contentType : "text/plain",
 * success : function(data) { //
 * document.getElementById("tab-content-conn").innerHTML = "<object // id =
 * 'svg_graphic' type='image/svg+xml' // data='"+data+"'></object>"; } }); }
 */

function loadData() {

	$.ajax({
		type : 'Get',
		url : "/SampleRestServer/server/data",
		success : function(data) {
			// document.getElementById("tab-content-conn").innerHTML = data;
		}
	});
}

function loginGoogle() {

	$.ajax({
		type : 'Get',
		url : "/impact/login/google",
		dataType : "text",
		success : function(url) {

			var authwindow = window.open(url, "");
			console.log(url);
		}
	});
}

function loginFacebook() {

	$.ajax({
		type : 'Get',
		url : "/impact/login/facebook",
		dataType : "text",
		success : function(url) {

			var authwindow = window.open(url, "");
			console.log(url);
		}
	});
}

function getTextAndSubmit(num) {
	$.ajax({
		type : 'GET',
		url : "/impact/node/" + num,
		dataType : "json",
		success : function(data) {
			drawNetwork(data);

		},
		error : function(data) {
			console.log(data);
		}
	});
}

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else
		var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function removeCookie(name) {
	createCookie(name, "", -1);
}
