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
 * cron-rss.php
 * Created on 27 May 2008
 *
 * Alex Little (OCI) / Michelle Bachler
 *
 *
 */

chdir( dirname ( realpath ( __FILE__ ) ) );

include_once("../config.php");
header("Content-Type: text/plain");
include_once($CFG->dirAddress."phplib/importlib.php");

// update the RSS feeds
$log = array();
$errors = array();
updateRSS($errors, $log);

if(!empty($log)){
    foreach ($log as $l){
        echo $l."\r\n";
    }
}
if(!empty($log) && !empty($errors)) {
	echo "\r\n";
}
if(!empty($errors)){
    foreach ($errors as $e){
        echo $e."\r\n";
    }
}
echo "RSS Feeds updated\r\n";
?>