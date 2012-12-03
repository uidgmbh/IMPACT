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
    include_once("../config.php");
    include_once("../includes/header.php");
    
    // check that user not already logged in
    checkLogin();
?>
    <h1>My Imports and Feeds</h1> 
    
    <p>There are a number of ways in which you can import data into your Cohere workspace:
    <ul>
        <li>Import an RSS feed (see below)</li>
        <li><a href="<?php print($CFG->homeAddress);?>import/compendium.php">Import from Compendium</a></li>
        <li><a href="<?php print($CFG->homeAddress);?>import/rdf.php">Import from RDF</a></li>
        <li><a href="<?php
    print($CFG->homeAddress);?>import/lkif.php">Import from LKIF XML</a></li>
        <li>using the <a href="<?php print($CFG->homeAddress);?>/help/code-doc/Cohere-API/_apilib.php.html">Cohere API</a></li>
    </ul>
    
    
     
<?php    
    $errors = array();
    $log = array();
    $feedurl = optional_param("feedurl","",PARAM_TEXT);
    $import = optional_param("import","",PARAM_ALPHA);
    $feedname = optional_param("feedname","",PARAM_TEXT);
    $feedreg= optional_param("feedreg","",PARAM_ALPHA);
    if($import != "" && $feedurl != ""){
        
        $feed = addFeed($feedurl,$feedname,$feedreg);
        $result = $feed->refresh($errors,$log);
        
        if(!($result instanceof Feed)){
            array_push($errors,"The supplied feed didn't contain anything we could import");
        } else {
            array_push($log,"Feed added and records imported from: ".$feedurl);           
        }
    } else if($import != "" && $feedurl == ""){
        // feed url is not valid
        array_push($errors,"That doesn't appear to be a valid URL, please try again.") ;  
    }
    
    
    $uf = getFeedsForUser();
    $feeds = $uf->feeds;
?>

<script type="text/javascript">
// custom JS for this page
    function setRegular(obj,id){
        var reqUrl = SERVICE_ROOT + "&method=feedsetregular&feedid=" + encodeURIComponent(id) + "&regular=" + encodeURIComponent(obj.value);
        new Ajax.Request(reqUrl, { method:'get',
            onSuccess: function(transport){
                var json = transport.responseText.evalJSON();
                if(json.error){
                    alert(json.error[0].message);
                    return;
                }       
            }
        });   
    }
    
    function updateFeed(id){
        $('update'+id).hide();
        $('updating'+id).show();
        var reqUrl = SERVICE_ROOT + "&method=refreshfeed&feedid=" + encodeURIComponent(id);
        new Ajax.Request(reqUrl, { method:'get',
            onSuccess: function(transport){
                var json = transport.responseText.evalJSON();
                if(json.error || !json.feed[0]){
                    alert(json.error[0].message);
                    $('update'+id).show();
                    $('updating'+id).hide();
                    return;
                }    
                //update the date/time
                var modDate = new Date(json.feed[0].lastupdated*1000);
                $('lastupdate'+id).update(modDate.format('d-mmm-yy HH:MM'));
                
                $('update'+id).show();
                $('updating'+id).hide();   
            }
        }); 
    }
    
    function deleteFeed(id,name){
        var ans = confirm("Are you sure you want to remove '"+name+"'?");
        if(ans){
            var reqUrl = SERVICE_ROOT + "&method=deletefeed&feedid=" + encodeURIComponent(id);
            new Ajax.Request(reqUrl, { method:'get',
                onSuccess: function(transport){
                    var json = transport.responseText.evalJSON();
                    if(json.error){
                        alert(json.error[0].message);
                        return;
                    }    
                    //remove the row 
                    $(id).remove();  
                }
            }); 
        } 
    }
</script>

<h2>RSS Feeds:</h2>

<?php 
    if(!empty($log)){
        echo "<div class='log'>The feed has been successfully imported:<ul>";
        foreach ($log as $l){
            echo "<li>".$l."</li>";
        }
        echo "</ul></div>";
    }
?>

<?php
    if(sizeof($feeds) >0){
        echo "<table class='table' cellspacing='0'>";
        echo "<tr>";
        echo "<th>Name & URL</th>";
        echo "<th>Last Updated</th>";
        echo "<th>Daily Refresh</th>";
        echo "<th></th>";
        echo "</tr>";
        foreach($feeds as $feed){
            echo "<tr id='".$feed->feedid."'>";
            echo "<td><b>".$feed->name."</b><br/>".$feed->url."</td>";
            echo "<td id='lastupdate".$feed->feedid."'>".date('j-M-y H:i',$feed->lastupdated)."</td>";
            echo "<td>";
            echo '<input type="radio" name="feedreg'.$feed->feedid.'" value="Y" onchange="setRegular(this,\''.$feed->feedid.'\');"';
            if($feed->regular == "Y"){
                echo "checked='checked'";
            }
            echo ">Yes";
            echo '<input type="radio" name="feedreg'.$feed->feedid.'" value="N" onchange="setRegular(this,\''.$feed->feedid.'\');"';
            if($feed->regular == "N"){
                echo "checked='checked'";
            }
            echo ">No";
            echo "</td>";
            echo "<td>";
            echo "<a href='#' onclick='updateFeed(\"".$feed->feedid."\")' id='update".$feed->feedid."'>Update now</a><span id='updating".$feed->feedid."' style='display:none;'>Updating...</span>";
            echo " | ";
            echo "<a href='#' onclick='deleteFeed(\"".$feed->feedid."\",\"".htmlspecialchars($feed->name,ENT_QUOTES)."\")' id='delete".$feed->feedid."'>Delete</a>";
            echo "</td>";
            echo "</tr>";    
        }        
        echo "</table>";  
    }
?>


<?php 
    if(!empty($errors)){
        echo "<div class='errors'>The following problems occured when trying to import the RSS feed:<ul>";
        foreach ($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul></div>";
    }
?>

<form action="" method="post">
    <div class="formrow">
        <label class="formlabel" for="feedurl">New Feed URL:</label>
        <input class="forminput" id="feedurl" name="feedurl" type="text" size="40">
    </div>
    <div class="formrow">
        <label class="formlabel" for="feedname">Name for Feed:</label>
        <input class="forminput" id="feedname" name="feedname" type="text" size="40">
    </div>
    <div class="formrow">
        <label class="formlabel" for="feedreg">Daily refresh:</label>
        <input class="forminput" type="radio" id="feedreg" name="feedreg" value="Y" checked='checked'>Yes
        <input type="radio" id="feedreg" name="feedreg" value="N">No
    </div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Add feed" id="import" name="import">
    </div>

</form>

<?php
    include_once("../includes/footer.php");
?>
