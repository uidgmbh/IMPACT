/**
 * Contains functions for making pages. Usually done by first calling an 
 * init-function (e.g. initShowAddDiscussion()), which sets up the general page 
 * with a title and, when applicable, defines a callback function for retrieving 
 * the data that has to be displayed. (This approach is being altered, text has 
 * to be updated --JD 2012-06-04)<br>

 * In the init-function, a show-functin is being called (e.g. 
 * showAddiscussion()). In this function, when available, the 
 * renderForm()-function of the element that has to be displayed, is called. The 
 * result of this function is given as argument to the Draw.display()-function. 
 * When rendering is complicated, Draw is used in stead of Render and renderForm 
 * to display "lower level"-items.<br>
 *
 * This class is entirely static.
 * @constructor
 **/
var Pages = {
  /** Currently out of order! Variable that holds the history for use of the back button. Variable might in the future contain tab-specific history. */
  //history: [],
  message: false, ///< When this is a string, this message is shown at the top of the page and immediately set to false again (can be used for e.g. showing success or error messages

 /**
   Sets the message that has to be displayed next
   @param string message
   @since 11 September 2012
  */
  setMessage: function(message){
    if(message){
      this.message = message;
    }
  },

  /**
   Indicates whether the message is set or not.
   @retval boolean True if the message is set, otherwise false.
   @since 11 September 2012
  */
  messageSet: function(){
    if(this.message !== false){
      return true;
    }
    return false;
  },
  /**
   Gets the message that has been stored before, and immediately erase it, as it should only be displayed once.
   @since 11 September 2012
  */
  getMessage: function(){
    if(this.message){
      //help variable is necessary for returning the message after deletion
      var message = this.message;
      this.message = false;
      return message;
    }
    return false;
  },

  /**********************
   * Shortcut functions *
   **********************/
  /**
    Display the given contents in the element with the given ID, with a fast fade out and in.
    @param {string} elementID - The ID of the element that has to be displayed.
    @param {JQuery HTML structure} contents - The contents that have to be displayed in the given element.
  */
  show: function(elementID, contents){
    var element = $("#"+elementID);
    element.fadeOut("fast", function(){
      $(this).html(contents);
      $(this).fadeIn("fast");
    });
  },
  
  /**
    Function that fades out the element with the given ID and removes it's contents
    @param {string} elementID - The ID of the element that has to be emptied.
    Since: 5 June 2012
  */
  empty: function(elementID){
    var element = $("#"+elementID);
    element.fadeOut("fast", function(){
      $(this).empty();
    });
  },
  
  /**
    Loads the starting position of the ART.
  */
  loadStartingPosition: function(){
    var documentsTab = $("<div>");
    var tabbed_area = Draw.tabbed_area(
      [
        {
          "id":"documentstab",
          "label":"Documents"
        },
        {
          "id":"annotationtab",
          "label":"Annotate"
        }
      ],
      {
        "documentstab":Draw.section(),
        "annotationtab":Draw.section()
      }
    );
    $("div#canvasleft").append(tabbed_area.tabs());
    Pages.showDiscussionManagement();
    Pages.showDocumentManagement();
  },
  
  /********************************
    DISCUSSION-RELATED FUNCTIONS
  *********************************/
  /**
    Discussions page - Create or select a discussion to use as argument context
    @param {boolean} addToHistory - Indicates whether this pageview has to be added to the history that is accessible through the "back" button
  */
  showDiscussionManagement: function(addToHistory){
    var dm = Draw.section(); //dm = discussionManagement
    dm.append(Draw.topbar("Issue Management"));
    dm.append(Draw.alert_element("discussionManagement", "About issue management"));
    var new_discussion = Draw.section();
    //new_discussion.append(Draw.title("Create discussion"));
    //new_discussion.append(Draw.description("Create a new discussion on the server"));
    new_discussion.append(
      Draw.button(
        "Add new issue",
        function (e){
          Pages.showAddDiscussion();
        }
      )
    );
    dm.append(new_discussion);
    
    var discussion_list = Pages.getDiscussionList(
      Discussion.getRemoteDiscussions()
    );
    dm.append(discussion_list);
    Pages.show("annotationtab", dm);
  },
  
  /**
    Get the discussions given in the discussions parameter.
    @param {array} discussions - The discussions that need to be displayed.
    @param {boolean} addToHistory - (DELETED) Indicates whether this pageview has to be added to the history that is accessible through the "back" button
  */
  getDiscussionList: function(discussions){
    var discussion_list = Draw.section();
    discussion_list.append(Draw.title("Select issue"));
    discussion_list.append(Draw.description("Select the issue to which the arguments belong you wish to annotate"));
    var list = Draw.list();
    
    for(i in discussions){
      list.append(
        Draw.list_item(
          discussions[i].getTitle()+ " ["+discussions[i].getURI()+"]",
          function(e){
            console.log("Clicked on (and discussion ID set to): "+e.data.uri);
            Store.setData("discussionID", e.data.uri);
            Pages.showDiscussion(e.data.uri);
          },
          { "uri" : discussions[i].getURI() }
        )
      );
    }
    discussion_list.append(list);
    return discussion_list;
  },
  
  /**
    Show the add discussion-form.
  */
  showAddDiscussion: function(){
    var d = new Discussion();
    var callback = function(){
      Pages.showDiscussionManagement();
    }
    var annotationtab = Draw.section();
    annotationtab.append(Draw.topbar("Add issue", callback));
    annotationtab.append(Draw.alert_element("discussionManagement", "About issues"));
    annotationtab.append(d.renderForm());
    Pages.show("annotationtab", annotationtab);
  },

  /**
   * Show the form for editing this discussion. Does not have an init-function 
   * because that would be unnecessarily complicated.
   * @param Discussion discussion The discussion to be edited
   * @created 13 April 2012
   **/
  showEditDiscussion: function(discussion){
    console.log("showEditDiscussion");
    discussiontab = Draw.section();
    var callback = function(){
      Pages.showDiscussion(discussion.getID());
    };
    discussiontab.append(Draw.topbar("Edit issue", callback));
    discussiontab.append(discussion.renderForm());
    Pages.show("annotationtab", discussiontab);
  },

  /**
   * Shows the relations given to the function in the relations argument, 
   * including an add-button.
   * @param {integer} discussionID - The ID of the discussion that needs to be 
   * displayed.
   **/
  showDiscussion: function(discussionID){
    //set the active discussion in the store (for the back-button etc.)
    Store.setData('discussionID', discussionID);
    var annotationtab = Draw.section();
    //initiation of variables, title, etc.
    var discussion = Discussion.getByURI(discussionID);
    var relations = Relation.getRelations(discussionID);
    //callback for the "back"-button in the topbar
    var callback = function(){
      Pages.showDiscussionManagement();
    };
    if(this.messageSet()){
      var message = Draw.message(this.getMessage());
      annotationtab.append(message);
    }
    annotationtab.append(Draw.topbar("Issue: "+discussion.getDataItem("title"), callback));
    //show intro of the discussion with edit button
    var discussion_intro = Draw.section();
    discussion_intro.append(Draw.description(discussion.getDataItem("intro")));
    discussion_intro.append(Draw.button(
      "Edit issue",
      function(e){
        Pages.showEditDiscussion(discussion);
      }
    ));
    annotationtab.append(discussion_intro);

    //show create new argument button
    var new_relation = Draw.section();
    new_relation.append(Draw.title("Create argument"));
    new_relation.append(Draw.description("Create a new argument"));
    new_relation.append(
      Draw.button(
        "Add new argument",
        function (e){
          Pages.showAddRelation();
        }
      )
    );
    annotationtab.append(new_relation);
    
    //show clickable list of arguments
    var remote_relation_list = Draw.section();
    remote_relation_list.append(Draw.title("Arguments"));
    remote_relation_list.append(Draw.alert_element("Arguments", "About the arguments list"));
    remote_relation_list.append(Draw.description("Click on the argument you wish to edit"));
    var list = Draw.list();
    var i = 0;
    $.each(relations, function(){
      list.append(
        Draw.list_item(
          relations[i].getDisplayType(relations[i].getType())+" [no. "+relations[i].getID()+"]",
          function(e){
            console.log("In showDiscussion, Clicked on "+e.data.id);
            Pages.showRelation(e.data.type, e.data.id);
          },
          { "id" : relations[i].getID(),
            "type": relations[i].getType() }
        )
      );
      i++;
    });
    remote_relation_list.append(list);
    annotationtab.append(remote_relation_list);
    Pages.show("annotationtab", annotationtab);
  },

  /******************************
   * RELATION-RELATED FUNCTIONS *
   ******************************/

  /**
   * Show the form that enables adding relations.
   **/
  showAddRelation: function(){
    //Retrieve scheme information and display scheme selector box
    var annotationtab = Draw.section();
    var discussionID = Store.getData("discussionID");
    var backButtonCallback = function(){   
      Pages.showDiscussion(discussionID);
    };
    annotationtab.append(Draw.topbar("Add Argument", backButtonCallback));
    var schemes = [];
    var Scheme = Store.getData("Scheme");
    Scheme
      .find("relation")
      .each(function(){
        if($(this).attr("label")){
          if($(this).attr("type").slice(-2) == "as"){
            //only add real argument schemes
            schemes[schemes.length] = {
              "key": $(this).attr("type"),
              "value": $(this).attr("label")
            }
          }
        }
      });
    var scheme_section = Draw.section();
    var scheme_form = Draw.form.form(function(){return false;});
    var selector = Draw.form.select(
          'schemes',
          schemes,
          undefined,
          "Select a scheme"
        );
    scheme_form.append(selector);
    scheme_section.append(scheme_form);
    annotationtab.append(scheme_section);
    
    var argument_section = Draw.section('argument_section');
    selector.change(function(){
      scheme = this.value;
      if (scheme){
        Store.setData("active-scheme", scheme);
        var discussion = Discussion.getByURI(discussionID);
        argument_section = $('#argument_section');
        argument_section.empty();
        var rel = new Relation(scheme);
        argument_section.append(rel.renderForm());
      }
    });
    annotationtab.append(argument_section);
    Pages.show("annotationtab", annotationtab);
  },
  
  /**
   * Draw details of a relation (argument) instance by fetching the relation 
   * from the database. This function calls showRelation on success, and prints 
   * an error message in the user interface if argument can not be loaded.
   * @param {int} relationID - ID of the relation that has to be retrieved.
   **/
  showRelation: function(relationType, relationID){
    var annotationtab = Draw.section();
    var relation = new Relation(relationType, relationID);
    //callback for the "back" button
    var callback = function(){
      Pages.showDiscussion(Store.getData('discussionID'));
    }
    if(this.messageSet()){
      var message = Draw.message(this.getMessage());
      annotationtab.append(message);
    }
    annotationtab.append(Draw.topbar("Edit relation ("+relation.getDisplayType(relationType)+" no. "+relation.getID()+")", callback));
    annotationtab.append(Draw.alert_element("EditRelation"+relation.getType(), "Info about the argument scheme"));
    annotationtab.append($("<br>"));
    annotationtab.append(Draw.alert_element("Annotation", "Info about the annotation interface"));
    annotationtab.append(relation.renderForm());
    Pages.show("annotationtab", annotationtab);
  },

  /**
    DEPRECATED
    Relation details page with view tab and edit tab.
    @param {Relation} relation - the relation that has to be displayed.
  */
  showRelationDEPRECATED: function(relation){
    /*********************
     * VIEW TAB RELATION *
     *********************/
    var details_tab = Draw.section();
        
    // Add argument information to the matrix
    if(relation.getUser() == 1){
      var user = "anonymous";
    } else {
      var user = relation.getUser();
    }
    var details_tabular = [
      [ "Field", "Value"],
      [ "Id", relation.getURI()],
      [ "Scheme", relation.getType() ],
      [ "Created on", ART.Misc.date("d F Y \\a\\t H:i:s", relation.getTimestamp()) ],
      [ "Created by", user],
      [ Draw.title("Premises") ]
    ];

    // Add premise information to the matrix
    var elements = relation.getElements();
    for( eType in elements ) {
      var element = elements[eType];
      var ts = element.getSubject();
      details_tabular[details_tabular.length] = [
        element.getLabel(),
        ts.getText()
      ];
    }
  
    // Display matrix as table
    var details_table = Draw.table(details_tabular,true);

    // Apply special style to the first column of each row
    details_table.find("tr").each(function(){
      $($(this).find("td")[0]).css("width","70px");
    });

    // Add table to the tab
    details_tab.append(details_table);

    /*********************
     * EDIT TAB RELATION *
     *********************/
    var edit_tab = Draw.section();
    
    var form = $("<form>");

    var scheme_options = new Array();
    var Scheme = Store.getData("Scheme");
    Scheme.find('scheme').each(function(){
      scheme_options[scheme_options.length] = {
        "key":$(this).attr("name"),
        "value":$(this).attr("label")
      };
    });

    var edit_tabular = [
      [ "Field", "Value"],
      [ "Id", relation.getURI() ],
      [  "Scheme", relation.getType()],
      [ "Created on", ART.Misc.date("d F Y \\a\\t H:i:s", relation.getTimestamp()) ],
      [ "Created by", user ],
      [ Draw.title("Premises") ]
    ];

    form.append(Draw.table(edit_tabular, true));
    
    form.append(relation.renderForm());
    
    submit_button = Draw.form.submit();
    
    form.submit(function(){
      var elements = relation.getElements();
      for ( eType in elements ){
        var element = elements[eType];
        var ts = element.getSubject();
        ts.setText(this[eType]["value"]);
        ts.alter();
      }
      Pages.ShowRelation(relation.getURI());
      return false;
    });
    
    var edit_table = Draw.table(edit_tabular,true);
    edit_table.find("tr").each(function(){
      $($(this).find("td")[0]).css("width","70px");  
    });
    
    edit_tab.append(form);

    /*************************
     * CREATE TABS RELATIONS *
     *************************/

    var tabbed_area = Draw.tabbed_area(
      [
        {
          "id":"view",
          "label":"View"
        },
        {
          "id":"edit",
          "label":"Edit"
        }
      ],
      {
        "view":details_tab,
        "edit":edit_tab
      }
    );
    tabbed_area.tabs();
    tabbed_area.prepend(Draw.topbar("Argument Details",function(){
      Pages.showDiscussion(Store.getData("discussionID"));
    }));

    Pages.show("annotationtab", tabbed_area);
  },
  
  /*****************************
    DOCUMENT-RELATED FUNCTIONS
  *****************************/
  /**
    Document page - Create or select a document to use as argument context. (in time this function has to allow for the selection some subset of the documents because the number of documents will become too large to be practical for display in one list)
    @param {int} docID - ID of the document for which the versions have to be displayed. At the time of writing only used when a new document has been made, and therefore has to be added to the list of documents. (Can otherwise be left undefined).
  */
  showDocumentManagement: function(docID){
    var tab = $("div#documentstab");
    tab.empty();
    tab.append(Draw.topbar("Document Management"));
    tab.append(Draw.alert_element("documentManagement", "About document management"));
    var new_document = Draw.section();
    //new_document.append(Draw.title("Create document"));
    //new_document.append(Draw.description("Create a new document on the server"));
    new_document.append(
      Draw.button(
        "Add new document",
        function (e){
          Pages.showAddDocument();
        }
      )
    );
    tab.append(new_document);
    
    var documentList = Pages.getDocumentList(Document.getRemoteDocuments());
    documentList.attr("id", "documentList");
    tab.append(documentList);
    //empty document version list is made so it can be filled later on.
    tab.append(Draw.section("documentVersionList"));
    if(docID != undefined){
      Pages.initShowDocument(docID);
    }
  },
  
  /**
    Show an individual document
    @param {int} documentID - The document id
    @created 24 May 2012
  */
  initShowDocument: function(documentID){
    //Part 1 of 2: Show version list
    if(documentID != undefined){
      var documentVersions = Document.getRemoteDocumentVersions(documentID);
    } else {
      documentID = Store.getData('documentID');
      if(documentID != undefined){
        var documentVersions = Document.getRemoteDocumentVersions(documentID);
      } else {
        console.log("ERROR: no document versions");
      }
    }
    //var documentList = Pages.getDocumentList(Document.getRemoteDocuments());
    //tab.append(documentList);
    
    var version_list = Draw.section();
    version_list.append(Draw.title("Select a version of the document \""+documentVersions[0].getDataItem('title')+"\""));
    if(documentVersions.length > 1){
      var list = Draw.list();
      for(version in documentVersions){
        list.append(
          Draw.list_item(
            "Version "+documentVersions[version].getDataItem('version'),// + " [DB ID: " + documentVersions[version].getURI() + "]",
            function(e){
              console.log("Clicked on (and documentID stored): " + e.data.uri);
              Store.setData("documentID", e.data.uri);
              Pages.showDocument(e.data.uri);
            },
            { "uri" : documentVersions[version].getURI() }
          )
        );
      }
      version_list.append(list);
    } else {
      version_list.append(Draw.description("There is only one version of the document, which is being displayed now."));
    }

    var versionListDiv = $("div#documentVersionList");
    versionListDiv.fadeOut(300, function(){
      $(this).replaceWith(version_list.attr("id", "documentVersionList"));
      var versionListDiv = $("div#documentVersionList");//has to be done again because original reference is lost by the replacement.
      versionListDiv.hide();
      versionListDiv.fadeIn(300);
    });
    
    //Part 2 of 2: Show actual document
    Pages.showDocument(documentID);
    //documentVersions[0].getURI());
  },
  
  /**
    Show documents. 
    @param {Documents array} documents - The documents that need to be displayed.
    @param {boolean} isVersionList - Indicates whether the list of documents is a list of versions of a document (this has consequences for what sections are being refreshed).
  */
  getDocumentList: function(documents, isVersionList){
    if(isVersionList == undefined){
      isVersionList = false;
    }
    var document_list = Draw.section();
    document_list.append(Draw.title("Select document"));
    document_list.append(Draw.description("Select the document you wish to annotate"));
    var list = Draw.list();
    
    for( i in documents ){
      list.append(
        Draw.list_item(
          documents[i].getDataItem('title'),//+" [DB ID: " + documents[i].getURI() + "]",
          function(e){
            console.log("set documentID to "+e.data.uri);
            Store.setData("documentID", e.data.uri);
            Pages.initShowDocument(e.data.uri);
          },
          { "uri" : documents[i].getURI() }
        )
      );
    }
    document_list.append(list);
    return document_list;
  },
  
  /**
    This function displays the add-form for new documents.
    @ {Document} document - Contains a document when a new version of that document has to be created. Otherwise false or undefined.
    @since 2 March 2012
  */
  showAddDocument: function(document){
    var add_form = Draw.section();
    add_form.append(Draw.topbar("Add new document"));
    if(document == undefined || document == false){
      var doc = new Document(); //renderForm() is not static, so it needs an object, in this case an empty document
    } else {
      var doc = document;
    }
    add_form.append(doc.renderForm(true));
    Pages.show("canvasright", add_form);
    Pages.empty("documentVersionList");
  },
  
  refreshDocument: function(){
    console.log("Refresh document!");//debug
    var id = Store.getData("documentID");
    Pages.initShowDocument(id, true);
  },
  
  /**
    This function shows the wanted document on the right side of the screen.
    @param {string} documentID - ID as it is registered in the database.
    @param {boolean} refreshOnlyRight - true when only the right canvas has to be refreshed
  */
  /*initShowDocument: function(documentID, refreshOnlyRight){
    refreshOnlyRight = (refreshOnlyRight == true ? true : false);
    var document = Document.getRemoteDocument(documentID);
    Pages.initRightPage(
      "Document information",
      function(){
        Pages.showDocument(
          Document.getRemoteDocument(documentID)
        );
      }
    );
    if(!refreshOnlyRight){
      Pages.showDocument(document.getDataItem("first_id"));
    }
    Store.setData("documentID", documentID);
  },*/
  
  /**
    Document details page with view tab and edit tab. (Note that the variable "document" is a predefined class in JavaScript.)
    @param {int} docID - the id of the document that has to be displayed.
  */
  showDocument: function(docID){
    //retrieve document
    var doc = Document.getRemoteDocument(docID);
    /**********************
     * VIEW TAB DOCUMENTS *
     **********************/
    var view_tab = Draw.section();

    view_tab.append(Draw.topbar(doc.getDataItem('title')));
    
    //Display URL, if there is any.
    var url = doc.getDataItem("url");
    
    if(url != undefined){
      var url_display = $("<a>")
                          .attr("href", url)
                          .attr("target", "_new")
                          .text(url);
    } else {
      var url_display = $("<i>").text("No URL specified (free text input)");
    }
    view_tab.append(Draw.slot_value("URL: ", url_display));
    //Version
    var version = doc.getDataItem("version");
    var id = doc.getDataItem("id");
    var first_id = doc.getDataItem("first_id");
    var versionAddition = " (not newest version, ";
    var newestVersion = false;
    if(doc.getDataItem("newest_version")){ //this is the newest version of the doc
      versionAddition = " (newest version, ";
      newestVersion = true;
    }
    if(doc.getDataItem("annotated")){
      var annotated = true;
      versionAddition += "annotated)";
    } else {
      var annotated = false;
      versionAddition += "not annotated)";
    }
    view_tab.append(Draw.slot_value("Version: ", version+versionAddition));
    //Database ID
    view_tab.append(Draw.slot_value("Database ID: ", id));
    
    //Actual text
    view_tab.append(Draw.description(
      //ART.Misc.nl2br(doc.getDataItem("text"), true)
      doc.getDataItem("text")
    ).attr('id', 'documenttext')
    );
    //display of view_tab is done below the definition of the edit tab.
    
    /**********************
     * EDIT TAB DOCUMENTS *
     **********************/
    var edit_tab = Draw.section();
    if(!annotated){ //only allow edits to non-annotated documents
      edit_tab.append(doc.renderForm());
    } else {
      if (!newestVersion){
        edit_tab.append(Draw.description("This documents has associated annotations, and therefore it can not be edited. If you want to edit this document, please try editing the newest version first."));
      } else {
        edit_tab.append(Draw.description("This document has associated annotations. When you want to change this document, a new version has to be made so that the annotations will not be lost."));
        edit_tab.append(Draw.button(
          "Add new version of this document",
          function (e){
            Pages.showAddDocument(doc);
          }
        ));
      }
    }
        
    /*************************
     * CREATE TABS DOCUMENTS *
     *************************/

    var tabbed_area = Draw.tabbed_area(
      [
        {
          "id":"view",
          "label":"View"
        },
        {
          "id":"edit",
          "label":"Edit"
        }
      ],
      {
        "view":view_tab,
        "edit":edit_tab
      }
    );
    tabbed_area.tabs();

    var divID = "canvasright";
    var canvasright = $("div#"+divID);
    canvasright.fadeOut("fast", function(){
      $(this).html(tabbed_area)//.attr("id", divID));
      $(this).prepend(Draw.button("Close document", function(){
        Pages.clearCanvasRight();
      })
                          .addClass("art-closebox")
                     );
      canvasright.fadeIn("fast");
    });
  },

  /**
   * Displays the help text in the right canvas
   */
  clearCanvasRight : function(){
     var canvasright = $("<p>")
       .attr("style", "font-size:30px; color: #AAAAAA")
       .text("Welcome to the ART");
       canvasright = canvasright.after($("<br>"));
       canvasright = canvasright.after(
                         $("<p>")
                         .text("The Argument Reconstruction Tool is designed to support reconstructing arguments from internet resources. This tool is mainly meant for adminstrators of user consultations and for policy analists. In order to be able to use the tool, one needs to have a basic knowledge of argument modelling. Therefore this tool is in principle not suitable for consultation participants."))
                         .after($("<br>"))
                         .after($("<p>")
                         .text("For help, please refer to the introduction to this tool and to the help provided in the tool itself. Clicking one of the ")
                         .append($("<img>")
                         .attr('src', Store.getData("root")+"/img/info.png")
                         )
                         .append(" symbols will open a dialog box with information about that specific part of the tool.")
                         .after($("<br>"))
                         .after($("<p>")
                         .text("The tool might react slowly at a number of points because the prototype still needs to be optimized. Please be patient after clicking buttons.")));
       $("#canvasright").html(canvasright);
       Store.setData("documentID", undefined);
   },
}
