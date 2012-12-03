ART['functionTest'] = function(){
  var root = "http://localhost:8888/art";
  $("#art").empty();
  $("#art").append("Welcome to the js-function-test.js<br>");
  $("#art").append("Starting test by adding a discussion with the discussion object...<br>");
  var discussion = new Discussion(undefined, "Test discussion", "This discussion was made in js-function-test.js, and is used solely for testing purposes.");
  var discussionID = discussion.create();
  if(discussionID){
    $("#art").append("New discussionID is "+discussionID+"<br>");
  } else {
    $("#art").append("discussionID == "+discussionID+", something went wrong!<br>"); 
    return;
  }
  var discussion = new Discussion(discussionID, "Updated test discussion!", "Discussion updated from js-function-test.html");
  if(discussion.alter()){
    $("#art").append('Alter discussion succeeded<br>');
  } else {
    $("#art").append("Alter discussion failed<br>");
    return;
  }
  var rel = new Relation('practical_reasoning_as', 1);
  var element = rel.getElement(new Array('practical_reasoning_as', 'action'));
  $("#art").append(JSON.stringify(element)+"<br><br>");
  var element = rel.getElement(new Array('practical_reasoning_as', 'consequences', '4'));
  $("#art").append(JSON.stringify(element)+"<br><br>");
  rel.deleteConjuncts(new Array('practical_reasoning_as', 'consequences'));
  var element = rel.getElement(new Array('practical_reasoning_as', 'consequences'));
  $("#art").append(JSON.stringify(element));

  $("#art").append("<br><br>Last line. If this text is displayed, no fatal errors occurred.<br>");
};

/*
function concatObject(obj) {
  str='';
  for(prop in obj)
  {
    str+=prop + " value :"+ obj[prop]+"\n";
  }
  return(str);
}*/
