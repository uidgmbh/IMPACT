$(document).ready(function(){
	$("#tocircumstance").live("click", function(toolboxState){
	       // $("#tocircumstance").die();	   
		    $.ajax({ // create an AJAX call...
            type: "POST",
            data: $("#user_name").serialize(), // get the form data
            cache: false,
            url: 'http://impact.uid.com:8080/structuredconsultationtool/index.php?submitid=circumstance', // the file to call
            success: function(response) { // on success..
                $("div#sct").html('');
                document.getElementById("sct").innerHTML =response;  
                $("div.answer:even").addClass("circ");
                $("div.answer:not(.circ)").hide();
                $(".list-no-bullets").find(".hideCS").click(function(){
            	    $(this).closest("div.answer").next().hide(500);
                });
                $(".list-no-bullets").find(".showCS").click(function(){
            	    $(this).closest("div.answer").next().show(500);
                });             
            }
            });
			$("#stage").scrollTop(0);
			return false; // cancel original event to prevent form submitting     
	});

	$("#toconsequence").live("click", function(){
	    //$("#toconsequence").die();	
		    $.ajax({ // create an AJAX call...
                type: "POST",
                data: $("#update-circ").serialize(), // get the form data
                cache: false,
                url: 'http://impact.uid.com:8080/structuredconsultationtool/index.php?submitid=consequence', 
                       success: function(response) { // on success..
                        $("div#sct").html('');
                        document.getElementById("sct").innerHTML =response;  
                        $("div.answer:even").addClass("cons");
                            $("div.answer:not(.cons)").hide();
                            $(".list-no-bullets").find(".hideCS").click(function(){
            	                $(this).closest("div.answer").next().hide(500);
                            });
                            $(".list-no-bullets").find(".showCS").click(function(){
            	                $(this).closest("div.answer").next().show(500);
                            });            
                    }
            });
			$("#stage").scrollTop(0);
            return false; // cancel original event to prevent form submitting
		});

	$("#tovalue").live("click", function(){
		//$("#tovalue").die();	
		    $.ajax({ // create an AJAX call...
                type: "POST",
                data: $("#update-cons").serialize(), // get the form data
                cache: false,
                url: 'http://impact.uid.com:8080/structuredconsultationtool/index.php?submitid=value', 
                       success: function(response) { // on success..
                       $("div#sct").html('');
                       document.getElementById("sct").innerHTML =response;  
                       $("div#value").addClass("value");
           	            $("div.answer:not(#value)").hide();
                        $(".list-no-bullets").find(".hideCS").click(function(){
            	            $(this).closest("div.answer").next().hide(500);
            	            $(this).closest("div.answer").next().next().hide(500);
                        });
                        $(".list-no-bullets").find(".showRS").click(function(){
            	            $(this).closest("div.answer").next().hide(500);
            	            $(this).closest("div.answer").next().next().show(500);
                        });
                        $(".list-no-bullets").find(".showCS").click(function(){
            	            $(this).closest("div.answer").next().show(500);
            	            $(this).closest("div.answer").next().next().hide(500);
                        });           
                    }
            });
            $("#stage").scrollTop(0);
            return false; // cancel original event to prevent form submitting
		});
	
	$("#tosummary").live("click", function(){	
		//$("#tosummary").die();	
		    $.ajax({ // create an AJAX call...
                type: "POST",
                data: $("#update-values").serialize(), // get the form data
                cache: false,
                url: 'http://impact.uid.com:8080/structuredconsultationtool/index.php?submitid=summary', 
                       success: function(response) { // on success..
                       $("div#sct").html('');
                       document.getElementById("sct").innerHTML =response;           
                    }
            });
            $("#stage").scrollTop(0);
            return false; // cancel original event to prevent form submitting
		});
	
	$("#submit").live("click", function(){
		//$("#submit").die();	
		    $.ajax({ // create an AJAX call...
                type: "POST",
                data: $("#submit_sessions").serialize(), // get the form data
                cache: false,
                url: 'http://impact.uid.com:8080/structuredconsultationtool/index.php?submitid=exit', 
                       success: function(response) { // on success..
                       $("div#sct").html('');
                       document.getElementById("sct").innerHTML =response;           
                    }
            });
			$("#stage").scrollTop(0);
			return false; // cancel original event to prevent form submitting
		});

	
	$("#backhome").live("click", function(){
		//$("#backhome").die();	
		    $.ajax({ // create an AJAX call...
                type: "POST",
                data: $("#finish_sessions").serialize(), // get the form data
                cache: false,
                url: 'http://impact.uid.com:8080/structuredconsultationtool/index.php?submitid=default', 
                       success: function(response) { // on success..
                       $("div#sct").html('');
                       document.getElementById("sct").innerHTML =response;           
                    }
            });
			$("#stage").scrollTop(0);
			return false; // cancel original event to prevent form submitting
		});
	
	$("#back").click(function(){
		window.close();
		}
	);
	
});

