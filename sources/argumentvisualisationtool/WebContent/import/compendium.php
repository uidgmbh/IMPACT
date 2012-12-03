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
    
    include_once("../phplib/importlib.php");
    // check that user not already logged in
    if(!isset($USER->userid)){
        header('Location: index.php');  
        return; 
    }
    global $CFG, $USER;
    
    echo "<h1>Import from Compendium</h1>";
    
    $errors = array();
    //if submitted then process the file
    if(isset($_POST["import"])){
        //upload the file
        if ($_FILES["compendiumxmlfile"]['name'] != "") {
            $target_path = $CFG->workdir;   
            $dt = time();
            //replace any non alphanum chars in filename 
            $filename = $USER->userid ."_". $dt ."_". basename( eregi_replace('[^A-Za-z0-9.]', '',$_FILES["compendiumxmlfile"]['name']));
            $target_path = $target_path . $filename;
            
            if(!move_uploaded_file($_FILES["compendiumxmlfile"]['tmp_name'], $target_path)) {
                array_push($errors,"An error occured uploading the file");   
            }
            
            $xml = new DOMDocument();
            if (!@$xml->load($target_path)){
                 array_push($errors,"Not a valid XML file");
            } 
            
            if(empty($errors)){
                $results = array();
                importCompendiumXML($xml,$errors,$results);   
                
                if (empty($errors)){
                	echo "<div class='results'>The file was sucessfully uploaded and imported:<ul>";
			        foreach ($results as $result){
			            echo "<li>".$result."</li>";
			        }
			        echo "</ul></div>";
                } 
            }
            //delete the file
            unlink($target_path);
                  
        }
    }
     
    if(!empty($errors)){
        echo "<div class='errors'>The following problems were found during the upload, please try again:<ul>";
        foreach ($errors as $error){
            echo "<li>".$error."</li>";
        }
        echo "</ul></div>";
    }
?>
   
<form action="" method="post" enctype="multipart/form-data">
    <div class="formrow">
        <label class="formlabel" for="compendiumxmlfile">Compendium XML File:</label>
        <input class="forminput" id="compendiumxmlfile" name="compendiumxmlfile" type="file" size="40">
    </div>
    <div class="formrow">
        <input class="formsubmit" type="submit" value="Import" id="import" name="import">
    </div>

</form>

<?php
    include_once("../includes/footer.php");
?>
