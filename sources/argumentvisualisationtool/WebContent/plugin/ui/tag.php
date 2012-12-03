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
    include_once($CFG->dirAddress."includes/dialogheader.php");

    $errors = array();

	$tagid = optional_param("tagid","",PARAM_TEXT); 
	$tagname = optional_param("tagname","",PARAM_TEXT);
 
    	
    if(isset($_POST["savetag"])){  
    	if ($tagid != "") {
            $origtag = getTag($tagid);
 	    	if ($tagname != "") {
                editTag($tagid, $tagname);   
	    	} else {
	            array_push($errors,"You must enter a tag name.");  
	        }   
    	} else {
            array_push($errors,"Error passing tag id.");  
    	}
    } else if(isset($_POST["addtag"])){ 
    	if ($tagname != "") {
	        addTag($tagname); 
    	} else {
            array_push($errors,"You must enter a tag name.");  
        }   
    } /*else if(isset($_POST["compendiumtags"])){  
    	
   		//[T:Mark Lynas, T:Our Future on a Hotter Planet, T:Known-unknown in the climate change field]
    	$nodesset = getNodesByUser($USER->userid, 0, -1);
    	    	
    }*/

    
    $ts = getUserTags();
    $tags = $ts->tags;        
?>

<script type="text/javascript">

   var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
              
   function deleteTag(objno){
        var name = $('taglabelval'+objno).value;
        var answer = confirm("Are you sure you want to delete the tag '"+name+"'?\n");
        if(answer){
            var reqUrl = SERVICE_ROOT + "&method=deletetag&tagid="+objno;
            
            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    } 
                    window.location.href = "tag.php";
                }
            });            
        } 
    }
    
    function editTag(objno){
    	cancelAddTag();
   		cancelAllEdits();
   		
        $('edittagform'+objno).show();
        $('savelink'+objno).show();
        
        $('taglabeldiv'+objno).hide();
        $('edittaglink'+objno).hide();
        $('editlink'+objno).hide();        
    }
    
    function cancelEditTag(objno){
         $('edittagform'+objno).hide();
         if ($('savelink'+objno)) {
        	 $('savelink'+objno).hide();
         }
         
       	 $('taglabeldiv'+objno).show();
         if ($('edittaglink'+objno)) {
        	 $('edittaglink'+objno).show();
         }
         if ($('editlink'+objno)) {
        	 $('editlink'+objno).show();
         }
    }
    
    function cancelAllEdits() {    	
    	var array = document.getElementsByTagName('div');
    	for(var i=0;i<array.length;i++) {
    		if (array[i].id.startsWith('edittagform')) {
    			var objno = array[i].id.substring(11);
    			cancelEditTag(objno);				
    		}	
    	}    	    	
    }
    
    function addNewTag(){
    	cancelAllEdits();
    	$('newtagform').show();
    	$('addnewtaglink').hide();
    }
      
    function cancelAddTag(){
    	$('newtagform').hide();
    	$('addnewtaglink').show();
    }

</script>  

<?php 
	if(!empty($errors)){
        echo "<div class='errors'>The following problems were found, please try again:<ul>";
        foreach ($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul></div>";
    }
?>

<h1>Manage Tags</h1>   
<div id="tagsdiv">
    <div class="formrow">
        <a id="addnewtaglink" href="javascript:addNewTag()" class="form">add new</a>        
    </div>
    
   <div id="newtagform" class="formrow" style="display:none; clear:both;">
   		<form id="addtagform" name="addtagform" action="tag.php" method="post" enctype="multipart/form-data">
        <div class="subform" style="width: 430px;">
            <div class='subformrow'><label class='formlabel' style='width: 50px' for='tagname'>Name:</label><input type='text' class='forminput' size='35' id='tagname' name='tagname' value=''/></div>
            <div class="subformrow">
            	<input class="subformbutton" style="margin-left:54px;" type="submit" value="Add" id="addtag" name="addtag">            
                <input class="subformbutton" style="margin-left:7px;" type="button" name="Cancel" value="Cancel" onclick="cancelAddTag();">
            </div>
        </div>
        </form>
    </div>

    <div class="formrow">
        <div id="tags" class="forminput">
         
        <?php        
            echo "<table class='table' cellspacing='0' cellpadding='3' border='1' style='margin: 0px;'>";
            
        echo "<tr>";
            echo "<th width='300'>Name</th>";
            echo "<th width='90'>Action</th>";                      
            echo "</tr>";
            
            foreach($tags as $tag){
                echo "<tr id='tag-".$tag->tagid."'>";
                echo "<td id='second-".$tag->tagid."'>";
                
		        echo "<div class='subform' id='edittagform".$tag->tagid."' style='width: 370px; display:none; clear:both;'>";
		   		echo '<form name="managetags"'.$tag->tagid.' action="tag.php" method="post" enctype="multipart/form-data">';
		   		echo "<input name='tagid' type='hidden' value='".$tag->tagid."' />";
		        echo "<div class='subformrow'><label class='formlabel' style='width: 50px' for='tagname'>Name</label><input type='text' class='forminput' size='35' id='tagname' name='tagname' value=\"".htmlspecialchars($tag->name)."\"/></div>";
  		        echo "<div class='subformrow' id='savelink".$tag->tagid."' style='display:none; clear:both;'>";
                echo '<input class="subformbutton" style="margin-left:54px;" type="submit" value="Save" id="savetag" name="savetag" />';
                echo '<input class="subformbutton" style="margin-left:7px;" type="button" value="Cancel" onclick="javascript:cancelEditTag(\''.$tag->tagid.'\');" />';
                echo '</div>';
                echo "</form>";
                echo "</div>";
                                
                echo "<div id='taglabeldiv".$tag->tagid."'>";
		        echo "<span class='labelinput' style='width: 90%' id='taglabel".$tag->tagid."'>".htmlspecialchars($tag->name)."</span>";
                echo "<input type='hidden' id='taglabelval".$tag->tagid."' value=\"".htmlspecialchars($tag->name)."\"/>";
		        echo "</div>";	
		        
                echo "</td>";
                
                echo "<td id='third-".$tag->tagid."'>";         
                echo "<div id='editlink".$tag->tagid."'>";
				echo "<a id='edittaglink".$tag->tagid."' href='javascript:editTag(\"".$tag->tagid."\")' class='form'>edit</a>&nbsp;|&nbsp;";
 				echo "<a id='deletetaglink".$tag->tagid."' href='javascript:deleteTag(\"".$tag->tagid."\")' class='form'>delete</a>";
 				echo "</div>";
                 echo "</td>";
                
                echo "</tr>";
            }              
            echo "</table>";
        ?>
        </div>
   </div>
        
    <div class="formrow">
        <input type="button" value="Close" onclick="window.close();"/>        
    </div>
        
</div>   
    
       
<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>