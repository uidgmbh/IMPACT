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
    if(!isset($USER->userid)){
        header('Location: ../index.php');  
        return; 
    }
    
    echo "<h1>Import an RSS feed</h1>";
    
    $errors = array();
    $feedurl = optional_param("feedurl","",PARAM_URL);
    $import = optional_param("import","",PARAM_ALPHA);
    $feedname = optional_param("feedname","",PARAM_TEXT);
    $feedreg= optional_param("feedreg","",PARAM_ALPHA);
    
    if($import != "" && $feedurl != ""){
        
        $feed = addFeed($feedurl,$feedname,$feedreg);
        
        $result = $feed->refresh($errors);
        
        if(!($result instanceof Feed)){
            array_push($errors,"The supplied feed didn't contain anything we could import");
        } else {
            echo "<p>".$result->recordsaffected." records have been imported from: ".$feedurl."</p>";
            echo "<p><a href='".$CFG->homeAddress."feeds.php'>Manage your feeds</a></p>";
            include_once("../includes/footer.php");
            die;               
        }
    } else if($import != "" && $feedurl == ""){
        // feed url is not valid
        array_push($errors,"That doesn't appear to be a valid URL, please try again.") ;  
    }
?>

<?php 
    if(!empty($errors)){
        echo "<div class='errors'>The following problems when trying to import the RSS feed:<ul>";
        foreach ($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul></div>";
    }
?>

<p>Use the form below to import data from an RSS feed. This will convert all the items in the feed into Cohere ideas in your workspace.</p>

<form action="rss.php" method="post">
    <div class="formrow">
        <label class="formlabel" for="feedurl">Feed URL:</label>
        <input class="forminput" id="feedurl" name="feedurl" type="text" size="40">
    </div>
    <div class="formrow">
        <label class="formlabel" for="feedname">Name for Feed:</label>
        <input class="forminput" id="feedname" name="feedname" type="text" size="40">
    </div>
    <div class="formrow">
        <label class="formlabel" for="feedreg">Regular:</label>
        <input class="forminput" type="radio" id="feedreg" name="feedreg" value="Y" checked='checked'>Yes
        <input type="radio" id="feedreg" name="feedreg" value="N">No
    </div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Import" id="import" name="import">
    </div>

</form>

<?php
    include_once("../includes/footer.php");
?>