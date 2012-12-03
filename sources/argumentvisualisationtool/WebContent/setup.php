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
    require_once('phplib/accesslib.php');

    //start session
    startSession();

    unset($DB);
    unset($USER);
    global $CFG;
    global $DB;
    global $USER;
    global $HEADER;
    global $BODY_ATT;

    $HEADER = array();

    // connect to mysql
    $DB->conn = mysql_connect( $CFG->databaseaddress , $CFG->databaseuser, $CFG->databasepass );
    if(!$DB->conn){
         die('Could not connect to database - please check the server configuration.');
    }

    //connect to specified database
    mysql_select_db($CFG->databasename, $DB->conn) or die('Could not connect to database - please check the server configuration.');

    //include common libaries coherelib.php and apilib.php
    require_once('phplib/apilib.php');
    require_once('phplib/error.class.php');
    require_once('phplib/auditlib.php');

    if (isset($_SESSION["session_userid"])) {
    	$USER = new User($_SESSION["session_userid"]);
    	$USER->load();
    } else {
    	$USER = new User();
    }
    // ensure there are no spaces or blank lines after php these closing tags
?>