/**
  In this class buttons, litst, tables and other elements are build with help of JQuery.
  @constructor
*/
var Draw = {
  /**********************************
   * Display settings
   * Change these values if you want
   * to use different css classes or
   * a different canvas id
   **********************************/
  canvasLeft: "#canvasleft",
  canvasRight: "#canvasright",
  style: {
    button:"art-button",
    button_group:"art-button-group",
    list:"art-list",
    title:"art-title",
    description:"art-desc",
    tabular: {
      table:"art-tabular table",
      row:"art-tabular row",
      first_row:"art-tabular row first",
      alternate_row:"art-tabular row alternate",
      column:"art-tabular column",
      first_column:"art-tabular column first"
    },
    details: {
      label:"art-details label-item",
      text:"art-details text-item"
    },
    form: {
      form:"art-form form-item",
      label:"art-form label-item",
      text:"art-form text-item",
      select:"art-form select-item",
      submit:"art-form submit-item",
      textarea: "art-form textarea-item",
      smalllocked: "art-form smalllocked-item",
      largelocked: "art-form largelocked-item",
      smalllabel:"art-form smalllabel-item"
    },
    section:"art-section",
    message:"art-message"
  },
  /**********************************
   * Layout functions
   * Normally you should not change
   * anything in this section
   **********************************/
  getCanvasLeft: function(){ return $(this.canvasLeft); },
  getCanvasRight: function(){ return $(this.canvasRight); },
  /**
    Remove everything from the left canvas
  */
  clearCanvasLeft: function(){
    this.getCanvasLeft().children().remove();
  },
  /**
    Remove everything from the right canvas
  */
  clearCanvasRight: function(){
   this.getCanvasRight().children().remove(); 
  },
  /**
    Add (append) an element to the left canvas
    @param element - element to be added
    @param {boolean} fade - Indicates whether this display should be faded in or not
  */
  displayLeft: function(element, fade){
    if(fade != false){ //It has to be false explicitly in order to block the fade
      this.getCanvasLeft().append(element.hide().fadeIn());
    } else {
      this.getCanvasLeft().append(element);
    }
  },
  /**
    Add (append) an element to the right canvas
    @param element - element to be added
    @param {boolean} fade - Indicates whether this display should be faded in or not
  */
  displayRight: function(element, fade){
    if(fade != false){ //It has to be false explicitly in order to block the fade
      this.getCanvasRight().append(element.hide().fadeIn());
    } else {
      this.getCanvasRight().append(element);
    }
  },
  /**
    The topbar is the topmost bar with purple background. It has a "Back"-button whenever you're not on the first page of the active tab.
    @param {string} title - Title that has to be displayed
    @param {function} callback - Function that has to be called when user hits the "Back" button.
  */
  topbar: function(title, callback){
    var topbar = Draw.section().attr("id","topbar");
    if(callback){
      topbar.append(
        Draw.button(
          "Back",
          callback
        ).addClass("art-back-button")
      );
    }
    topbar.append(
      Draw.title(title)
    );
    return topbar;
  },
  title: function(title){
    return $("<span>")
      .text(title)
      .addClass(this.style.title);
  },
  description: function(text){
    return $("<pre>")
      .text(text)
      .addClass(this.style.description);
  },
  button: function(label, onclick, onclick_data){
    if(!onclick) onclick = function(){}
    if(!onclick_data) onclick_data = {};
    var b =
      $("<input>")
        .attr({
          "type":"button",
          "class":this.style.button,
          "value":label
        })
        .click(onclick_data, onclick);
    return b;
  },
  button_group: function(){
    return $("<div>").addClass(this.style.button_group);
  },
  details: {
    text: function(name, value){
      return $("<span>")
        .attr("name",name)
        .text(value)
        .addClass(Draw.style.details.text);
    },
    label: function(name, label){
      return $("<span>")
        .attr("name",name)
        .text(label)
        .addClass(Draw.style.details.label);
    }
  },
  /**
    Displays a slot and a value in an HTML paragraph, where the slot is in a &lt;b&gt; tag and the value in a &lt;span&gt; tag.
    @param {string: plain text} slot
    @param {string: html text} value
  */
  slot_value: function(slot, value){
    return $("<p>")
      .append($("<b>").text(slot))
      .append($("<span>").html(value));
  },
  form: {
    form: function(submitCallback){
      if ( typeof(submitCallback) != "undefined" ){
        return $("<form>")
          .submit(submitCallback)
          .attr("onSubmit","return false;")
          .addClass(Draw.style.form.form);
      }else{
        return $("<form>")
          .addClass(Draw.style.form.form);
      }
    },
    text: function(name, value){
      return $("<input>")
        .attr("type", "text")
        .attr("name", name)
        .attr("value", value)
        .attr("size", 55)
        .addClass(Draw.style.form.text)
    },
    hidden: function(name, value){
      return $("<input>")
        .attr("type", "hidden")
        .attr("name", name)
        .attr("value", value)
    },
    textarea: function(name, value, rows){
      rows = (rows == undefined ? 2 : rows);
      return $("<textarea>")
        .attr("cols", 45)
        .attr("rows", rows)
        .attr("name", name)
        .html(value)
        .addClass(Draw.style.form.textarea)
    },
    label: function(name, label){
      return $("<label>")
        .attr("for", name)
        .text(label)
        .addClass(Draw.style.form.label);
    },
    smalllabel: function(name, label){
      return $("<label>")
      .attr("for", name)
      .text(label)
      .addClass(Draw.style.form.smalllabel)
    },
    /**
     * Generates a &lt;select&gt; tag with &lt;option&gt; tags.
     * @param string id The id for the select-tag
     * @param array map An array with indices 0-n, where the elements contain 
     * the indices 'key' and 'value'.
     * @param string selected Optional - the key of the element of map that is 
     * @param string toptext Optional - text to be displayed at the top of the 
     * dropdown as instruction (without value)
     * selected.
     */
    select: function(id, map, selected, toptext){
      var select = $("<select>").attr("id",id);
      select.addClass(Draw.style.form.select);
      if(toptext){
        var option = $("<option>")
          .attr("value", "")
          .text(toptext); //must be general drop-down. Scheme selection is currently the only drop-down menu
      }
      select.append(option);
      for(var i = 0; i < map.length; i++){
        option = $("<option>")
          .attr("value",map[i].key)
          .text(map[i].value)
        if(map[i].key == selected){
          option.attr("selected","selected");
        }
        select.append(option);
      }
      return select;
    },
    smalllocked: function(name, value){
      return $("<input>")
        .attr("type", "input")
        .attr("disabled", "disabled")
        .attr("name", name)
        .attr("value", value)
        .addClass(Draw.style.form.smalllocked)
        .attr("size", 4)
    },
    largelocked: function(name, value){
      return $("<span style='font-size: 10px; font-weight: normal;'>")
        .attr("cols", 45)
        .attr("rows", 2)
        .attr("name", name)
        .html('"'+value+'"')
//      return $("<input>")
//        .attr("type", "input")
//        .attr("disabled", "disabled")
//        .attr("name", name)
//        .attr("value", value)
//        .addClass(Draw.style.form.smalllocked)
//        .attr("size", 20)
    },
    fieldset: function(id){
      return $("<fieldset>")
        .attr("id", id);
    },
    submit: function(){
      return $("<input>")
        .attr("type","submit")
        .attr("value","Save")
        .addClass(Draw.style.form.submit);
    }
  },
  /** Displays an unrdered list &lt;ul&gt;. */
  list: function(){
    return $("<ul>")
      .attr("class", this.style.list);
  },
  
  /** Displays list items &lt;li&gt; with an optional onclick callback. */
  list_item: function(label, onclick, onclick_data){
    if(!onclick) onclick = function(){}
    if(!onclick_data) onclick_data = {};
    return $("<li>").text(label).click(onclick_data, onclick);
  },
  
  /**
    Create table structure for data. 
    @param {bool} firstRowIsHeader - Set firstRowIsHeader to true if you want the first row in your data to be treated as the header.
    @param {array} data - Contains a two-dimensional array representing the data that are being displayed in the table.
  */
  table: function(data, firstRowIsHeader){
    // Calculate maximum columns
    var maxColumn = Math.max.apply(Math, $.map(data, function (cols) { return cols.length }));
    var table = $("<table>").attr("class",this.style.tabular.table);

    if(firstRowIsHeader)
      var thead = $("<thead>");
    var tbody = $("<tbody>");

    for(var r = 0; r < data.length; r++){
      // Create row object
      var row = $("<tr>");
      
      // Set the correct class
      if(firstRowIsHeader && r == 0)
        row.attr("class",this.style.tabular.first_row);
      else if(r % 2 == 0)
        row.attr("class",this.style.tabular.alternate_row);
      else
        row.attr("class",this.style.tabular.row);
      
      for(var c = 0; c < data[r].length; c++){
        // Create column object
        if(firstRowIsHeader && r == 0)
          var column = $("<th>");
        else 
          var column = $("<td>");
        
        // Set the correct class
        if(c==0)
          column.attr("class",this.style.tabular.first_column);
        else
          column.attr("class",this.style.tabular.column);
        
        // Set colspan if necessary
        if( 
          // If this is the last column
          c == (data[r].length-1)
          // End there is room left to fill
          && (maxColumn - data[r].length) > 0 
        ){
          column.attr("colspan", (maxColumn - data[r].length)+1);
        }

        // Put content in column
        column.append(data[r][c]);

        // Add column to row
        row.append(column);
      }

      // Add row to the correct part of the table
      // based on if the first row is a header
      if(firstRowIsHeader && r == 0)
        thead.append(row);
      else
        tbody.append(row);
    }

    // Add the table head to the table
    // if the first row is a header
    if(firstRowIsHeader)
      table.append(thead);

    // Add the table body to the table
    table.append(tbody);

    return table;
  },
  
  section: function(id){
    var section = $("<div>").attr("class",this.style.section);
    if(typeof(id) == "undefined"){
      return section;
    } else {
      return section.attr("id", id);
    }
  },
  
  /**
    This function returns a tabbed area consisting of the HTML elements that are necessary for the creation of tabs with JQuery UI (see http://jqueryui.com/demos/tabs/)
    @param {nested array} tabs - This parameter specify the actual tabs (the small clickable rectangles) The elements of this array represent the tabs. Each tab element is an associative array, containing a value for "id" and one for "label".
    @param {associative array} area - This parameter specifies the areas that become (in)visible if one clicks on a tab. The elements of this array (also) represent the tabs. The keys must be the ids of the tab (as defined in the tabs parameter), the values are objects that represent the HTML objects (preferably made with the Draw class).
  */
  tabbed_area: function(tabs, areas){
    var tabbed_area = $("<div>");
    var tab_list = $("<ul>");
    for(var t = 0; t < tabs.length; t++){
      tab_list.append(
        $("<li>").append(
          $("<a>")
            .attr("href","#"+tabs[t].id)
            .text(tabs[t].label)
        )
      );
      tabbed_area.append(
        areas[tabs[t].id]
          .attr("id",tabs[t].id)
          .css("width","auto")
      );
    }
    tabbed_area.prepend(tab_list);
    return tabbed_area;
  },

/**
 * This function is intended to make a button with which people can get a short 
 * description of the things that are in the vicinity of the help button
 * @param string helpTextID Identifier of the text that is showed in a 
 * JavaScript alert-window (using the HelpText-class)
 * @param string clickText Optional. Clickable text that should be shown in the 
 * UI. Text is displayed after the (i) images.
 **/
  alert_element: function(helpTextID, clickText){
    //var helpText = new HelpText();
    if(!clickText){
      var clickText = "";
    }
    var link = $("<a>")
               .attr("href","#")
               .click(function(){
                 alert(HelpText.giveText(helpTextID))
               })
               .html($("<img>")
                 .attr('src', Store.getData("root")+"/img/info.png")
               );
    link = link.append(clickText)
    return link;
  },

  /**
   * Made for showing a succes or error message at the top of the page
   * @param String message The message to be displayed
   * @since 11 September 2012
   **/
  message: function(message){
    var delay = 7000; //milliseconds of delay for letting messages dissapear
    if(message){
      return $("<p>").addClass('art-message')
                     .text(message)
                     .delay(delay)
                     .hide('slow');
    } else { 
      console.log("NO MESSAGE GIVEN in Draw.message");
    }
  }
}
