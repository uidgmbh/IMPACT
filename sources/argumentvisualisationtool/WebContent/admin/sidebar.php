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
?>
<script type="text/javascript">
    function init(){
        // create the auto complete for search
        new Ajax.Autocompleter("q", "q_choices", "<?php echo $CFG->homeAddress; ?>api/service.php?method=getnodesbyfirstcharacters&scope=all&format=list", {paramName: "q", minChars: 1});
    }
    
    function setSearchResultTab(){       
        // set the action for the search form (to preserve the tab/visualisation)
        $('searchform').setAttribute('action',"<?php print($CFG->homeAddress);?>results.php#" + getAnchorVal('node-list'));
    }

    window.onload = init;
</script>


<div id="sidebar-header"></div>
<div id="sidebar-content">
     
    <ul>
        <li><a href="<?php print($CFG->homeAddress);?>">Home</a></li>

    <?php
        if(isset($USER->userid)){
    ?>
        <li><a href="<?php print($CFG->homeAddress);?>user.php?userid=<?php print $USER->userid; ?>#conn-list">My Data</a></li>
     <?php }  ?>
    </ul>
                 
<ul>
	<li>
		<a class="statslabel" href="generalStats.php">General Stats Report</a>
	</li>
	<li>
		<a class="statslabel" href="userRegistration.php">User Registration Report</a>
	</li>
	<li>
		<a class="statslabel" href="newIdeas.php">Ideas Created Report</a>
	</li>
	<li>
		<a class="statslabel" href="auditIdeas.php">Audit Ideas Report</a>
	</li>			
	<li>
		<a class="statslabel" href="connections.php">Connections Created Report</a>
	</li>			
	<li>
		<a class="statslabel" href="auditConnections.php">Audit Connections Report</a>
	</li>			
	<li>
		<a class="statslabel" href="feeds.php">Feeds Created Report</a>
	</li>
</ul>


</div>
<div id="sidebar-footer"></div>
