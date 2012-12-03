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
    include_once($CFG->dirAddress."includes/dialogheader.php");

    $errors = array();
    
    $ns = getUserCacheNodes(0, -1);
    $bookmarks = $ns->nodes;        
?>

<script type="text/javascript">

    var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
    var closing = true;
    
    function deleteManagementBookmark(objno){
        var name = $('nodelabelval'+objno).value;
        if(confirm("Are you sure you want unbookmark the idea:\n\n'"+name+"' ?\n")){
            //send request
            var reqUrl = SERVICE_ROOT + "&method=deletefromusercache&idea="+objno;            
            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    } 
                    closing = false;
                    window.location.href = "bookmarks.php";
                }
            });
            
        }  
    }
    
    function clearAllBookmarks() {
    	if (confirm("Are you sure you want to clear your bookmark list?\n\n")) {	
    		// clear user cache for current user
    		var reqUrl = SERVICE_ROOT + "&method=clearusercache";
    		new Ajax.Request(reqUrl, { method:'get',
    			onSuccess: function(transport){
    				var json = transport.responseText.evalJSON();
    	   			if(json.error) {
    	   				alert(json.error[0].message);
    	   				return;
    	   			} else {
                        closing = false;
                        window.location.href = "bookmarks.php";
    	   			} 
    	   		}				      			     	   			
    	  	});
    	 }
     }
    
    function onClose() {
    	if (closing) {
    		window.opener.location.reload(true);
    		window.close();
    	}
    }
    
    window.onunload=onClose;    
    
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

<h1>Manage Bookmarks</h1>   
<div id="rolesdiv"">
    
    <div class="formrow">
        <div id="bookmarks" class="forminput">
         
        <?php        
            echo "<table class='table' cellspacing='0' cellpadding='3' border='0' style='margin: 0px;'>";
            echo "<tr>";
            echo "<th width='45'>&nbsp;</th>";
            echo "<th width='380'>&nbsp;</th>";
            echo "<th width='90'>Action</th>";
                      
            echo "</tr>";
            foreach($bookmarks as $node){
                echo "<tr id='node-".$node->nodeid."'>";

                echo "<td>";
                $image = $node->role->image;                                
                $imagethumbnail = $node->imagethumbnail;        
                if ($imagethumbnail != null && $imagethumbnail != "") {
                	$image = $imagethumbnail1;      	
                } 
                if ($image == null || $image == "") {
                	$image = 'images/nodetypes/blank.gif';
                }
               	echo "<img border='0' src='".$CFG->homeAddress.$image."' />";
                echo "</td>";
                
                echo "<td id='second-".$node->nodeid."'>";
                                                
                echo "<div id='nodelabeldiv".$node->nodeid."'>";
		        echo "<span class='labelinput' style='width: 90%' id='nodelabel".$node->nodeid."'>".htmlspecialchars($node->name)."</span>";
                echo "<input type='hidden' id='nodelabelval".$node->nodeid."' value=\"".htmlspecialchars($node->name)."\"/>";
		        echo "</div>";	
		        
                echo "</td>";
                
                echo "<td id='third-".$node->nodeid."'>";         
                echo "<div id='deletelink".$node->nodeid."'>";
  				echo "<a id='deletenodelink".$node->nodeid."' href='javascript:deleteManagementBookmark(\"".$node->nodeid."\")' class='form'>unbookmark</a>";
   				echo "</div>";
                echo "</td>";
                
                echo "</tr>";
            }              
            echo "</table>";
        ?>
        </div>
   </div>
        
    <div class="formrow">
        <input style="border=left: 10px;" type="button" value="Close" onclick="javascript:closing = true; onClose()"/>        
    	<input style="float:right;" type="button" value="Unbookmark All" onclick="javascript:clearAllBookmarks()"/>        
    </div>
        
</div>   
    
       
<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>