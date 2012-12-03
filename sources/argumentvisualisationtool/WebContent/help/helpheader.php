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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>
Cohere >>> make the connection
</title>
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/style.css" type="text/css" media="screen" />
<link rel="stylesheet" href="<?php echo $CFG->homeAddress; ?>includes/tabber.css" type="text/css" media="screen" />
<link rel="icon" href="<?php echo $CFG->homeAddress; ?>favicon.ico" type="images/x-icon" />
<script src="<?php echo $CFG->homeAddress; ?>includes/prototype.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/util.php" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/node.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/urls.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/conns.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/users.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/dateformat.js" type="text/javascript"></script>
<script src="<?php echo $CFG->homeAddress; ?>includes/jsr_class.js" type="text/javascript"></script>
<script src='<?php echo $CFG->homeAddress; ?>includes/scriptaculous/scriptaculous.js' type="text/javascript"></script>
<?php
    global $HEADER,$BODY_ATT;
    if(is_array($HEADER)){
        foreach($HEADER as $header){
            echo $header;   
        }
    }
?>

</head>
<body <?php echo $BODY_ATT; ?> id="cohere-body">

<div id="header">
    <div id="logo">
        <a href="<?php echo $CFG->homeAddress; ?>index.php" title="Cohere homepage"><img border="0"alt="Cohere Logo" src="<?php echo $CFG->homeAddress; ?>images/cohere_logo2.png" /></a>
        <img class="hourglass" src="<?php echo $CFG->homeAddress; ?>images/hourglass.png" />
        <a href="#content" class="accesslink">Skip to content</a>
    </div>
    <div id="menu">
        <?php
            global $USER;
            if(isset($USER->userid)){
                if($USER->name == ""){
                    $name = $USER->getEmail();   
                } else {
                    $name = $USER->name;
                }
                echo "Signed in as: <a title='edit profile' href='".$CFG->homeAddress."profile.php'>". $name ."</a> | <a title='Sign Out' href='".$CFG->homeAddress."logout.php'>Sign Out</a> ";  
            } else {
                echo "<a title='Sign In' href='".$CFG->homeAddress."login.php'>Sign In</a> | <a title='Sign Up' href='".$CFG->homeAddress."register.php'>Sign Up</a> ";
            }
        ?>
        | <a href='<?php echo $CFG->blogAddress; ?>'>Blog</a> 
        | <a href='<?php echo $CFG->homeAddress; ?>about.php'>About</a> 
        | <a href='<?php echo $CFG->homeAddress; ?>help/'>Help</a>
    </div>
</div>

<div id="main">
<div id="contentwrapper" style="margin-left: 10px;">

