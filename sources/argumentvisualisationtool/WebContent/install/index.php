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
<?php
//include_once("../config.php");
//include_once("../includes/header.php");
?>
<h1>Installing and upgrading</h1>

<h2>To install</h2>
If you see this file, it means you have moved cohere code into your web root correctly.
<br>Now please follow the following to configure your system.
<ol>

<li>Create database 'cohere'</li>
<li>Run /install/db.sql on 'cohere' database</li>
<li>Run /install/default-data.sql on 'cohere' database</li>
<li>Copy /config-sample.php to /config.php</li>
<li>Edit settings in /config.php to point to your set up and database</li>
<li>If you use proxy set up with proper values</li>
<li>If you use recaptcha, go to <a href="http://recaptcha.net/">http://recaptcha.net/</a> to sign up and get public/private keys</li>
<li>Create a temp directory and set up workdir with the correct value </li>
</ol>
<b> It is strongly recommend you to move all the *.sql out the web root and secure your config.php file.</b>

<?php
//include_once("../includes/footer.php");

?>