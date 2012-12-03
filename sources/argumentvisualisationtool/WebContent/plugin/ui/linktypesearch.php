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
    array_push($HEADER,"<script src='".$CFG->homeAddress."includes/scriptaculous/scriptaculous.js' type='text/javascript'></script>");
    include_once($CFG->dirAddress."includes/dialogheader.php");

    $rs = getAllLinkTypes();
    $linktypes = $rs->linktypes;

	$links = required_param("links", PARAM_TEXT);
    $depth = optional_param("depth", "0", PARAM_TEXT);

	$linklist=null;
	if ($links !=null && $links != "") {
		$linklist = split(",", $links);
	}

	$linkTypeFilterList = array();
	if ($linklist != null) {
		foreach ($linklist as &$value) {
			$linkTypeFilterList[$value] = $value;
		}
	}
?>

<script type="text/javascript">
	var depth = <?php echo $depth.";"; ?>

	function getSelections(){
	   	var selectedOnes = "";
	   	var checks = document.getElementsByName("checklist[]");
	   	for (i=0; i<checks.length; i++) {
		   if (checks[i].checked) {
			   if (selectedOnes == "") {
				   selectedOnes = checks[i].value;
			   } else {
				   selectedOnes += ","+checks[i].value;
			   }
		   }
	   	}

	   	if (depth != 0) {
	   		window.opener.setSelectedLinkTypes(selectedOnes, depth);
	   	} else {
	   		window.opener.setSelectedLinkTypes(selectedOnes);
	   	}
	   	window.close();
	}

	function checkForGroupSelected() {

		var groupSelected = true;
		//var groupUnselected = false;
		var lastGroup = "";

	   	var checks = document.getElementsByName("checklist[]");
		for (i=0; i < checks.length; i++) {
		   	if (checks[i].id != lastGroup && lastGroup != "") {
		   		if (groupSelected == true) {
		   			$('linkGroup'+lastGroup).checked = true;
		   		} else {
		   			$('linkGroup'+lastGroup).checked = false;
		   		}
		   		groupSelected = true;
		   	}

		   	lastGroup = checks[i].id;

		   	if (checks[i].checked == false) {
		   		groupSelected = false;
		   	}
		}

		if (groupSelected == true) {
			$('linkGroup'+lastGroup).checked = true;
		} else {
			$('linkGroup'+lastGroup).checked = false;
		}

	}

	function groupSelection(elementName, groupName) {
		if ($(elementName).checked) {
			selectGroup(groupName);
		} else {
			unselectGroup(groupName);
		}
	}

	function selectGroup(groupname){
	   var checks = document.getElementsByName("checklist[]");
	   for (i=0; i < checks.length; i++) {
		   	if (checks[i].id == groupname) {
		   		checks[i].checked = true;
		   	}
	   }
	}

	function unselectGroup(groupname){
	   var checks = document.getElementsByName("checklist[]");
	   for (i=0; i < checks.length; i++) {
		   	if (checks[i].id == groupname) {
		   		checks[i].checked = false;
		   	}
	   }
	}


</script>

<h1>Choose Link Types</h1>
<form name="managelinktypes" action="" method="post">

<div id="linktypesdiv">
    <div class="formrow">
        <div id="linktypes" class="forminput">

        <?php
            echo "<table class='table' cellspacing='0' cellpadding='3' border='0'>";
            echo "<tr>";
            echo "<th width='82%'></th>";
            echo "<th width='90'></th>";

            echo "</tr>";

			$linkgroup = "";

			$allSelected = true;
			$links = "";
			$linkHeading = "";

			foreach($linktypes as $linktype) {

				if ($linktype->grouplabel != $linkgroup && $linkgroup != "") {
					if ($linkgroup == "Positive") {
						$linkHeading .= "<tr class='linktypepositive'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
						if ($allSelected) {
							$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroupPositive" onclick="groupSelection(\'linkGroupPositive\', \''.$linkgroup.'\')"></input></td></tr>';
						} else {
							$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroupPositive" onclick="groupSelection(\'linkGroupPositive\', \''.$linkgroup.'\')"></input></td></tr>';
						}
					} else if ($linkgroup == "Negative") {
						$linkHeading .= "<tr class='linktypenegative'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
						if ($allSelected) {
							$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroupNegative" onclick="groupSelection(\'linkGroupNegative\', \''.$linkgroup.'\')"></input></td></tr>';
						} else {
							$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroupNegative" onclick="groupSelection(\'linkGroupNegative\', \''.$linkgroup.'\')"></input></td></tr>';
						}
					} else {
						$linkHeading .= "<tr class='linktypeneutral'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
						if ($allSelected) {
							$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroupNeutral" onclick="groupSelection(\'linkGroupNeutral\', \''.$linkgroup.'\')"></input></td></tr>';
						} else {
							$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroupNeutral" onclick="groupSelection(\'linkGroupNeutral\', \''.$linkgroup.'\')"></input></td></tr>';
						}
					}

					echo $linkHeading;
					echo $links;

					$linkHeading = "";
					$links = "";
					$allSelected = true;
				}

				$linkgroup = $linktype->grouplabel;

				$links .= "<td id='name-".$linktype->linktypeid."'>".$linktype->label;
				$links .= "</td>";

				$links .= "<td>";
				if (count($linkTypeFilterList) > 0
						&& $linkTypeFilterList[$linktype->label]) {
					$links .= '<input onclick="checkForGroupSelected()" type="checkbox" name="checklist[]" id="'.htmlspecialchars($linktype->grouplabel).'" checked value="'.htmlspecialchars($linktype->label).'"></input>';
			    } else {
			    	$allSelected = false;
					$links .= '<input onclick="checkForGroupSelected()" type="checkbox" name="checklist[]" id="'.htmlspecialchars($linktype->grouplabel).'" value="'.htmlspecialchars($linktype->label).'"></input>';
			    }
				$links .= "</td>";

				$links .= "</tr>";
			}

			if ($linkgroup == "Positive") {
				$linkHeading .= "<tr class='linktypepositive'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
				if ($allSelected) {
					$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupPositive\', \''.$linkgroup.'\')"></input></td></tr>';
				} else {
					$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupPositive\', \''.$linkgroup.'\')"></input></td></tr>';
				}
			} else if ($linkgroup == "Negative") {
				$linkHeading .= "<tr class='linktypenegative'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
				if ($allSelected) {
					$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupNegative\', \''.$linkgroup.'\')"></input></td></tr>';
				} else {
					$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupNegative\', \''.$linkgroup.'\')"></input></td></tr>';
				}
			} else {
				$linkHeading .= "<tr class='linktypeneutral'><td style='font-size: 11pt' colspan='1'>My ".$linkgroup." Links</td>";
				if ($allSelected) {
					$linkHeading .= '<td><input type="checkbox" checked value="'.$linktype->grouplabel.'" id="linkGroup'.$linkgroup.'" onclick="groupSelection(\'linkGroupNeutral\', \''.$linkgroup.'\')"></input></td></tr>';
				} else {
					$linkHeading .= '<td><input type="checkbox" value="'.$linktype->grouplabel.'" id="linkGroupNeutral" onclick="groupSelection(\'linkGroupNeutral\', \''.$linkgroup.'\')"></input></td></tr>';
				}
			}
			echo $linkHeading;
			echo $links;
            echo "</table>";
        ?>
        </div>
    </div>

    <div class="formrow">
       <input type="button" value="Select" onclick="javascript:getSelections();"/>
       <input type="button" value="Cancel" onclick="window.close();"/>
    </div>

 </div>
</form>


<?php
    include_once($CFG->dirAddress."includes/dialogfooter.php");
?>