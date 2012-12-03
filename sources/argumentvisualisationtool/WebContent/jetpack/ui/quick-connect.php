<?php
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
    include_once("../../config.php");
    global $USER, $CFG;
    checkLogin();
    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/scriptaculous/scriptaculous.js' type='text/javascript'></script>");
    include_once("jetpackdialogheader.php");
 
     $ideaid0 = optional_param("ideaid0","",PARAM_TEXT);   
     $linktype = optional_param("linktype","",PARAM_TEXT);
     $ideaid1 = optional_param("ideaid1","",PARAM_TEXT);
 

    // only want to set the default privacy if the form hasn't been posted yet
    if(isset($_POST["addconn"]) ){
        $private = optional_param("private","Y",PARAM_ALPHA);         
     } else {
     	$private = optional_param("private",$USER->privatedata,PARAM_ALPHA);
     }
   

    $groups = optional_param("groups","",PARAM_TEXT);
    if($groups == ""){
        $groups = array();   
    }    

    if(isset($_POST["addconn"])){

	     $fromnode = null;
	     $tonode = null;

		 if ($ideaid0 != "") {
			$fromnode = getnode($ideaid0);
			if ($ideaObj0->users[0]) {
				$fromrole = $ideaObj0->role;          		
			}
		}

		if ($ideaid1 != "") {
			$tonode = getnode($ideaid1);
			if ($ideaObj1->users[0]) {
				$torole = $ideaObj1->role;
			}	
		}
        
		// add groups
		if(sizeof($groups) != 0){
			foreach($groups as $group){
				addGroupToNode($fromnode->nodeid,$group); 
			}   
		}

		// add groups
		if(sizeof($groups) != 0){
			foreach($groups as $group){
				addGroupToNode($tonode->nodeid,$group); 
			}   
		}

		// create connection
		$c = addConnection($fromnode->nodeid,$fromrole->roleid,$linktype,$tonode->nodeid,$torole->roleid,$private);

		// add groups
		if(sizeof($groups) != 0){
			foreach($groups as $group){
				addGroupToConnection($c->connid,$group); 
			}   
		}
    }
?>
    
<script type="text/javascript">

   var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
   // array for linktype group colours
   ltgroups = new Array();
   ltgroups["positive"] = "#00BD53";
   ltgroups["neutral"] = "#B2B2B2";
   ltgroups["negative"] = "#C10031";
   
   var linktypes = null; 
      
   function init(){
        loadBookmarks('0');
        loadBookmarks('1');
        loadLinkTypes('<?php echo($linktype); ?>');                
   }
         
    function bookmarkSelected(objno) {
        var index = $('bookmarks'+objno).selectedIndex;
    	var id = $('bookmarks'+objno)[index].value;
     	if (id !=  "") {
         	var s = $('bookmarks'+objno).options[index].text;         	
         	$('ideaid'+objno).value = id;
    	}
    }
    
    function loadBookmarks(objno){
        var reqUrl = SERVICE_ROOT + "&method=getusercachenodes&max=-1";
        
        $('bookmarks'+objno).update("");
        
        new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    } 
                    var nodes = json.nodeset[0].nodes;
                    var opt = new Element("option",{'value':'','style':'width: 350px; background:white'}).insert("Select bookmarked idea...");
                    $('bookmarks'+objno).insert(opt);
                            
                    for (var i=0; i<nodes.length; i++) {
                    	var node = nodes[i].cnode;	
                        var opt = new Element("option",{'value':node.nodeid,'style':'width: 350px; background:white','title':node.role[0].role.name}).insert(node.name);
                        $('bookmarks'+objno).insert(opt);
                    }
                }
            });
   }   
   
   function loadLinkTypes(selectedName){
        var reqUrl = SERVICE_ROOT + "&method=getalllinktypes";
        
        $('linktype').update("");
        
        new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    } 
                    linktypes = json.linktypeset[0].linktypes;
                    
                    var curgroup = "";
                    
                    if (selectedName == ""){
                        var opt = new Element("option",{'value':'','style':'background:white','selected':true}).insert("Select link type...");
                    } else {
                        var opt = new Element("option",{'value':'','style':'background:white'}).insert("Select link type...");
                    }
                    $('linktype').insert(opt);
                            
                    for (var i=0; i<linktypes.length; i++){
                        if (curgroup != linktypes[i].linktype.grouplabel){
                            var opt = new Element("option",{'value':'','style':'background:white'}).insert("");
                            $('linktype').insert(opt);
                            var opt = new Element("option",{'value':'','style':'background:'+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]}).insert(linktypes[i].linktype.grouplabel);
                            $('linktype').insert(opt);
                            var opt = new Element("option",{'value':linktypes[i].linktype.grouplabel.toLowerCase(),'style':'background:'+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]}).insert(linktypes[i].linktype.grouplabel);
                        }
                        
                         if(selectedName == linktypes[i].linktype.label){
                            var opt = new Element("option",{'value':linktypes[i].linktype.linktypeid,'style':'background:white','selected':true}).insert(linktypes[i].linktype.label);
                            $('linktype').insert(opt);
                        } else {
                            var opt = new Element("option",{'value':linktypes[i].linktype.linktypeid,'style':'background:white'}).insert(linktypes[i].linktype.label);
                            $('linktype').insert(opt);
                        }
                        curgroup = linktypes[i].linktype.grouplabel;
                    }
                    linkTypeSelected();
                }
            });
   }
   
   function linkTypeSelected(){
        // find which group it belongs to and change the colour accordingly
        var s = $('linktype')[$('linktype').selectedIndex].value;
        for (var i=0; i<linktypes.length; i++){
            if(linktypes[i].linktype.linktypeid == s){                
                $('link-top').setStyle('background-image: url("'+URL_ROOT+'images/connection/edit/link-'+linktypes[i].linktype.grouplabel.toLowerCase()+'-top.png")');
                $('link-bottom').setStyle('background-image: url("'+URL_ROOT+'images/connection/edit/link-'+linktypes[i].linktype.grouplabel.toLowerCase()+'-bottom.png")');
                $('link').setStyle('border-left: 2px solid '+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]);
                $('link').setStyle('border-right: 2px solid '+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]);
                $('linktype').setStyle('background:'+ltgroups[linktypes[i].linktype.grouplabel.toLowerCase()]);
                return;   
            }
        }
   }
   
   function switchIdeas(){
       $('bookmarks0').selectedIndex = $('bookmarks1').selectedIndex
       $('bookmarks1').selectedIndex = $('bookmarks0').selectedIndex
   }
   
   window.onload = init;
</script>  
   
<form name="addidea" action="" method="post">

<input type="hidden" id="ideaid0" name="ideaid0" value="<?php echo $ideaid0; ?>">
<input type="hidden" id="ideaid1" name="ideaid1" value="<?php echo $ideaid1; ?>">

<!-- IDEA 0 (FROM)-->
<div id="fromidea">
    <b class="c1"></b><b class="c2"></b><b class="c3"></b><b class="c4"></b>
    <div class="connwrapper">
        <div class="formrow">
            <label class="formlabel" for="bookmarks1">Idea:</label>
            <select class="forminput" id="bookmarks0" name="bookmarks0"  width="300" style="width: 300px; background:white;" onchange="bookmarkSelected('0');"></select>        
        </div>
    </div>
    <div style="clear:both;"></div>   
</div>   

     
<div id="link-top">
    <div style="clear:both;"></div>
</div>
    
<!-- LINK -->    
<div id="link">
    <label for="linktype"><a href="javascript:switchIdeas();" class="form">Switch</a> Link:</label>
    <select id="linktype" name="linktype" style="background:white;" onchange="linkTypeSelected();"></select>
    <div style="clear:both;"></div>
</div>    


<div id="link-bottom">
    <div style="clear:both;"></div>
</div>

<!-- IDEA 1 (TO) --> 
<div id="toidea">  

    <b class="c1"></b><b class="c2"></b><b class="c3"></b><b class="c4"></b>
    
    <div class="connwrapper">     
        <div class="formrow">
            <label class="formlabel" for="bookmarks1">Idea:</label>
            <select class="forminput" id="bookmarks1" name="bookmarks1" width="300" style="width: 300px; background:white;" onchange="bookmarkSelected('1');"></select>
        </div>       
    </div>
    <div style="clear:both;"></div> 
</div>

    <div class="formrow">
        <label class="formlabel" for="private">Public:</label>
        <input type="checkbox" class="forminput" id="private" name="private" value="N" 
        <?php 
            if($private == "N"){
                echo ' checked="true"';
            }
        ?>
        >
        
    </div>
    <?php
        $gs = getMyGroups();
        $mygroups = $gs->groups;
        if(sizeof($mygroups) != 0 ){
    ?> 
        <div class="formrow">
            <label class="formlabel" for="groups">Groups:</label>
            <?php
                $i = 0;
                foreach($mygroups as $group){
                    if ($i ==0){
                        $class = "forminput";   
                    } else {
                        $class = "formsubmit";  
                    }
                    echo "<input type='checkbox' class='".$class."' id='groups' name='groups[]' value='".$group->groupid."'";
                    if(in_array($group->groupid,$groups)){
                        echo " checked='true'";   
                    }
                    echo ">".$group->name."<br/>";   
                    $i++;
                }
            ?>   
        </div>
    <?php
        }
    ?>
    
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Create Connection" id="addconn" name="addconn">
        <input type="button" value="Cancel" onclick="window.close();"/>
    </div>
</form> 
    
       
<?php
    include_once("jetpackdialogfooter.php");
?>