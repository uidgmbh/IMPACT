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
?>

<h1>Help - API Error codes</h1>
<table>

<tr>
    <th>Code</th>
    <th>Meaning</th>
</tr>

<tr>
    <td>1000</td>
    <td>Missing parameter</td>
</tr>
<tr>
    <td>1001</td>
    <td>Invalid or no method specified</td>
</tr>
<tr>
    <td>1002</td>
    <td>Invalid order by selection</td>
</tr>
<tr>
    <td>1003</td>
    <td>Invalid sort by selection</td>
</tr>
<tr>
    <td>1004</td>
    <td>Empty parameter</td>
</tr>
<tr>
    <td>2000</td>
    <td>Login failed</td>
</tr>

<tr>
    <td>2001</td>
    <td>Access denied</td>
</tr>
<tr>
    <td>3000</td>
    <td>Method not allowed for this format type</td>
</tr>
<tr>
    <td>3001</td>
    <td>Invalid result type for this formatting</td>
</tr>
<tr>
    <td>7000</td>
    <td>Database error (general)</td>
</tr>
<tr>
    <td>7002</td>
    <td>Item not found in database</td>
</tr>
<tr>
    <td>7003</td>
    <td>A group with this name already exists.</td>
</tr>
<tr>
    <td>9999</td>
    <td>Error in service (catch all)</td>
</tr>

</table>

<?php
    include_once("../includes/footer.php");
?>