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
/**
 * getupload.php
 * Created on 6 Aug 2008
 *
 * Alex Little
 * 
 * modified by Gary Li 
 * 
 *  $RELEASEDATE
 */
 include_once("config.php");
 
 //get the size and user dir
 $userid = optional_param("userid","",PARAM_TEXT);
 $width = optional_param("width","",PARAM_INT);
 $width = 30;
 //echo "user id=".$userid;
 //echo "width= ".$width;
// exit();
 
 function displayDefaultImage(){
    global $CFG;
    
    $image=@imagecreatefrompng($CFG->homeAddress."uploads/".$CFG->DEFAULT_USER_PHOTO);
    if ($image){
        imagealphablending($image, true);
        imagesavealpha($image, true);
        header('Content-Type: image/png');
        imagepng($image);
    }
    die;  
 }
 
 $user = getUser($userid);
 if($user instanceof Error){
 	//echo "user does not exists";
    displayDefaultImage();
 }
 //find if file exists
 $photodir = $CFG->dirAddress.'uploads/'.$userid.'/';
 $photoparts = split('/',$user->photo);
 $originalphotofilename = $photoparts[count($photoparts)-1];
 $newphotofilename = str_replace('.','_'.$width.'px.',$originalphotofilename);
 
 //echo "photodir = ". $photodir;
 //echo "photoparts" . $photoparts;
 //echo "filename" . $originalphotofilename;
 //echo "newfilename". $newphotofilename;
 
 if(!file_exists($photodir.$newphotofilename)){//if a smaller image file does not exist, create one
    //find if dir for user exists and create if not
    if(!file_exists($photodir)){
        mkdir($photodir, 0777, true);
    }
    
    //create the new image
    $originalphotopath = $CFG->dirAddress.'uploads/'.$userid.'/'.$originalphotofilename;
    if (!file_exists($originalphotopath)) {
        $originalphotopath = $CFG->dirAddress.'uploads/'.$originalphotofilename;
    }
    resize_image($originalphotopath,$photodir.$newphotofilename,$width);    
 }

 
 //dump out image
 $photoname = strtolower($newphotofilename);
 
 //echo "new small photo file name; " . $photoname;
 //exit();
 // note that when resized (in utillib) all images are actually made into pngs- hence the slightly odd code below.
 // is thsi true? certainly my bmp fiel does not chenge to png file,
 //it is still bmp file. Gary 2009 .01. 13
 
 if (endsWith($photoname,'.jpg') or endsWith($photoname,'.jpeg')or endsWith($photoname,'.bmp') or endsWith($photoname,'.gif') or endsWith($photoname,'.png')){
    //this is extreamly chicky that check if exsiting file has different type including uppercase
 	$image=@imagecreatefrompng($photodir.$newphotofilename);
    if ($image){
        imagealphablending($image, true);
        imagesavealpha($image, true);
        header('Content-Type: image/png');
        imagepng($image);
    } else {
        displayDefaultImage();
    }
 } 
 
 displayDefaultImage();
?>
