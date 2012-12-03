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
    include_once("config.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>
Cohere >>> make the connection
</title>
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/style.css" type="text/css" media="screen" />
</head>
<?php
    $type = optional_param("type","",PARAM_TEXT);		
   	$mode = optional_param("mode","",PARAM_TEXT);	
   	$pathtype = optional_param("pathtype","",PARAM_TEXT);	
   	$id = optional_param("id","",PARAM_TEXT);	
   	$links = optional_param("links","",PARAM_TEXT);	
   	$searchText = optional_param("text","",PARAM_TEXT);	
   	$userid = optional_param("uid","",PARAM_TEXT);	
   	$sort =  optional_param("sort","",PARAM_TEXT);	
   	$sortdir = optional_param("sortdir","",PARAM_TEXT);	
   	$filter = optional_param("filter","",PARAM_TEXT);
   	$focus =  optional_param("focus","",PARAM_TEXT);
   	$direction = optional_param("condir","",PARAM_TEXT);
   	$select = optional_param("select","",PARAM_TEXT);
   	$exact = optional_param("exact","",PARAM_TEXT);

   	$context = 'context=node&nodeid='.$focus;
   	
   	$url = $CFG->homeAddress.'node.php?'.$context.'#conn-neighbour';
?>


    <div id="snippetConnNeighbourhoodDiv" class="snippetDiv snippetColumnFocusDiv" style="height: 290px;">
<div id="header">
<div id="logo">
    <a href="<?php echo $CFG->homeAddress; ?>" target="_blank"><img border="0" alt="Cohere Logo" src="<?php echo $CFG->homeAddress; ?>images/cohere_logo2small.png" /></a>

</div>
</div>
<p>The <a href=<?php echo $CFG->homeAddress; ?>>Cohere website</a> has been radically altered.<br> 
			The creator of this website needs to go and get a <a target="_blank" href="<?php echo $url;?>">new Cohere code snippet</a> to replace this one.
			</p>
    </div>				
<?php
    include_once($CFG->dirAddress."snippet/footer.php");
?>