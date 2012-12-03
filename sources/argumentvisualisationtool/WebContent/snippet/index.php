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
    array_push($HEADER,'<script src="'.$CFG->homeAddress.'../includes/tabber.js" type="text/javascript"></script>');
    include_once("../includes/header.php");
    include_once("../phplib/tabberlib.php");
    
    $query = stripslashes(optional_param("q","",PARAM_TEXT));
    $scope = optional_param("scope","all",PARAM_TEXT);
    
    $start = optional_param("start",0,PARAM_INT);   
    $max = optional_param("max",20,PARAM_INT);
    $orderby = optional_param("orderby","date",PARAM_ALPHA);
    $sort = optional_param("sort","DESC",PARAM_ALPHA);
    
?>
<html>
<head>
<link rel="stylesheet" href="../includes/style.css" type="text/css" media="screen" />
</head>

<body style="margin-left: 20px;">
<h1>Snippet Examples</h1>

<div id="innerwrap">

<hr/>
<p>Single Idea</p>
<iframe
src="<?php echo $CFG->homeAddress; ?>snippet/snippet-node.php?nodeid=137108145101185528487&context=node&context=node&snippet=0" width="300" height="160" scrolling="auto"
frameborder="0"></iframe>
<br>

<p>Single Connection</p>
<iframe src="<?php echo $CFG->homeAddress; ?>snippet/snippet-connection.php?connid=81178581881193255744&context=node&snippet=1" width="800" height="160" scrolling="auto" frameborder="0"></iframe>

<p>Connection List</p>
<iframe 
src="<?php echo $CFG->homeAddress; ?>snippet/snippet-conn-list.php?snippet=2&q=cetis&scope=all&start=0&max=20&orderby=date&sort=DESC&direction=right&context=search" 
width="860" height="406" scrolling="no" frameborder="0">
</iframe>

<br><br>
<p>Connection Neighbourhood</p>
<iframe 
	src="<?php echo $CFG->homeAddress; ?>snippet/snippet-conn-neighbourhood.php?snippet=3&nodeid=137108251921195810901&start=0&max=20&orderby=date&sort=DESC&focalnode=137108251921195810901&direction=right&context=node" 
	width="1015" height="340" scrolling="no" frameborder="0">
</iframe>

<br><br>
<p>Connection Network</p>
<iframe src="<?php echo $CFG->homeAddress; ?>snippet/snippet-conn-net.php?snippet=4&q=century&scope=all&start=0&max=20&orderby=date&sort=DESC&context=search" 
	width="666" height="490" scrolling="no" frameborder="0">
</iframe>

</div>		
<?php
include_once("../includes/footer.php");
?>