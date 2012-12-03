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

    $type = optional_param("type","",PARAM_TEXT);

    $rs = getUserLinkTypes();
    $linktypes = $rs->linktypes;
?>

<script type="text/javascript">

   var SERVICE_ROOT = "<?php echo $CFG->homeAddress."api/service.php?format=json"; ?>";
   var dialogType = "<?php echo $type ?>";

   function editLinkType(objno){
        $('editlinktypeform'+objno).show();
        $('savelink'+objno).show();

        $('linktypelabeldiv'+objno).hide();
        $('editlinktypelink'+objno).hide();
        $('editlink'+objno).hide();
   }

   function saveLinkType(objno){

        if($('editlinktypeinput'+objno).value == ""){
            alert("You must enter a link type label.");
            return;
        }
        var reqUrl = SERVICE_ROOT + "&method=editlinktype&linktypeid="+objno+"&linktypelabel=" + encodeURIComponent($('editlinktypeinput'+objno).value);

        new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }

 					$('linktypelabel'+json.linktype[0].linktypeid).update(json.linktype[0].label);

                    //reset and hide the form
                    $('editlinktypeinput'+json.linktype[0].linktypeid).value = json.linktype[0].label;

 					cancelEditLinkType(json.linktype[0].linktypeid);
                }
            });
   }

   function cancelEditLinkType(objno){
        $('editlinktypeform'+objno).hide();
        $('savelink'+objno).hide();

        $('linktypelabeldiv'+objno).show();
        $('editlinktypelink'+objno).show();
        $('editlink'+objno).show();
   }

    function deleteLinkType(objno){
        var name = $('editlinktypeinput'+objno).value;
        var answer = confirm("Are you sure you want to delete the link type '"+name+"'?\n\nNote: All connections using this link type will be deleted");
        if(answer){
            //send request
            var reqUrl = SERVICE_ROOT + "&method=deletelinktype&linktypeid="+objno;

            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }
                    //alert("Link type "+name+" has now been deleted.");
                    window.location.href = "linktype.php";
                }
            });

        }
    }

    function addLinkType(){
        $('newlinktypeform1').show();
        $('addnewlinktype').hide();
    }

    function cancelAddLinkType(){
        $('newlinktypeform1').hide();
        $('addnewlinktype').show();
    }

    function addNewLinkType(){

        if($('newlinktype').value == ""){
            alert("You must enter a new link type name.");
            return;
        } else if (($('newlinktype').value).indexOf(",") != -1) {
    		// Check for comma, as this character is not aloud
    		// as it is the separator used to send list of link types to the server.
    		alert("Sorry, commas are not allowed in link type names.")
    		return;
        }
        if($('linktypegroup')[$('linktypegroup').selectedIndex].value == ""){
            alert("You must select a link type group.");
            return;
        }
        var reqUrl = SERVICE_ROOT + "&method=addlinktype&label=" + encodeURIComponent($('newlinktype').value) + "&linktypegroup="+$('linktypegroup')[$('linktypegroup').selectedIndex].value;

        new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }

                    window.location.href = "linktype.php";
                 }
            });
    }

    function saveLinkTypeChoice() {

    	window.close();
    }
</script>
<h1>Manage Link Types</h1>
<form name="managelinktypes" action="" method="post">

<div id="linktypesdiv">
	<div class="formrow">
		<a id="addnewlinktype" href="javascript:addLinkType();" class="form">add new</a>
	</div>
	<div class="formrow"  style="display:none; clear:both;" id="newlinktypeform1">
		<div class="subform" style="width: 250px;">
			<div class="subformrow">
		    	<label class="subformlabel" for="newlinktype">Link type:</label>
		    	<input class="subforminput" type="text" id="newlinktype" name="newlinktype" value=""/>
		    </div>
		    <div class="subformrow">
		        <label class="subformlabel" for="linktypegroup">Group:</label>
		        <select class="subforminput" id="linktypegroup" name="linktypegroup">
                <option value='Positive' class='linktypepositive' selected='true'>Positive</option>
                <option value='Negative' class='linktypenegative'>Negative</option>
                <option value='Neutral' class='linktypeneutral'>Neutral</option>
                </select>
		    </div>
		    <div class="subformrow">
		        <input class="subformsubmit" type="button" name="Add" value="Add" onclick="addNewLinkType();">
		        <input class="subformbutton" type="button" name="Cancel" value="Cancel" onclick="cancelAddLinkType();">
		    </div>
		</div>
	</div>

    <div class="formrow">
        <div id="linktypes" class="forminput">

        <?php
            echo "<table class='table' cellspacing='0' cellpadding='3' border='0'>";
            echo "<tr>";
            echo "<th width='350'></th>";
            echo "<th width='90'>Action</th>";

            echo "</tr>";

            $linkgroup = "";

            foreach($linktypes as $linktype){
            	if ($linktype->grouplabel != $linkgroup) {
                    if ($linktype->grouplabel == "Positive") {
                   		echo "<tr class='linktypepositive'><td style='font-size: 11pt' colspan='2'>".$linktype->grouplabel."</td></tr>";
                    } else if ($linktype->grouplabel == "Negative") {
                    	echo "<tr class='linktypenegative'><td style='font-size: 11pt' colspan='2'>".$linktype->grouplabel."</td></tr>";
                    } else {
                   		echo "<tr class='linktypeneutral'><td style='font-size: 11pt' colspan='2'>".$linktype->grouplabel."</td></tr>";
                    }
            	}

            	$linkgroup = $linktype->grouplabel;
            	$cs = getConnectionsByLinkTypeLabel($linktype->label, 'my', 0, 1);
            	$usecount = $cs->totalno;

                echo "<td id='name-".$linktype->linktypeid."'>";

                echo "<div id='linktypelabeldiv".$linktype->linktypeid."'>";
               	echo "<span class='labelinput' style='font-size: 11pt; width: 90%;' id='linktypelabel".$linktype->linktypeid."' />".htmlspecialchars($linktype->label)."</span";
               	//echo "<br><span style='font-size:8pt;'>used in <a title='Click to view connections' target='_blank' href='".$CFG->homeAddress."results.php?q=".rawurlencode($linktype->label)."&scope=my#conn-list'>".$usecount."</a> connection(s)</span>";
              	echo "<br><span style='margin-left: 10px;font-size:8pt;'>used in ".$usecount." connection(s)</span>";
                echo "</div>";

               	echo "<div id='editlinktypeform".$linktype->linktypeid."' style='display:none; clear:both;' >";
		        echo "<input type='text' style='font-size:11pt; width: 90%;' id='editlinktypeinput".$linktype->linktypeid."' name='editlinktypeinput' value=\"".htmlspecialchars($linktype->label)."\"/></div>";

		        echo "</td>";

                echo "<td>";
                echo "<div id='editlink".$linktype->linktypeid."'>";
				echo "&nbsp;<br><a id='editlinktypelink".$linktype->linktypeid."' href='javascript:editLinkType(\"".$linktype->linktypeid."\")' class='form'>edit</a>&nbsp;|&nbsp;";
 				echo "<a id='deletelinktypelink".$linktype->linktypeid."' href='javascript:deleteLinkType(\"".$linktype->linktypeid."\")' class='form'>delete</a></div>";
 		        echo "<div id='savelink".$linktype->linktypeid."' style='display:none; clear:both;'>";
 		        echo "<a href='javascript:saveLinkType(\"".$linktype->linktypeid."\");'>save</a>&nbsp;|&nbsp;";
		        echo "<a href='javascript:cancelEditLinkType(\"".$linktype->linktypeid."\");'>cancel</a></div>";
                echo "</td>";

                echo "</tr>";
            }
            echo "</table>";
        ?>
        </div>
    </div>

    <div class="formrow">
    	<?php if ($type == "select") { ?>
    		<input type="button" value="Save" onclick="javascript: saveLinkTypeChoice()"/>
    	<?php } else  { ?>
    		<input type="button" value="Close" onclick="window.close();"/>
    	<?php } ?>
    </div>

 </div>
</form>


<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>