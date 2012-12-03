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
    include_once("includes/header.php");
?>

    <h1>About PolicyCommons</h1>
<p>PolicyCommons is a tool that displays arguments about policies as
browsable debate maps. It is designed to help users make sense of the
range of publicly expressed opinions about public policies. Users can
browse debate maps about public policies and follow links
from the visual summaries of the arguments back to the original policy
documents. Ultimately, the aim of PolicyCommons is to support greater
	participation in the democrative process, as well as to improve the
	openness and accountability of the democratic process.</p>

<p>PolicyCommons is being developed within the
<a href="http://www.policy-impact.eu/">EU-funded IMPACT
project</a>. The IMPACT project is researching and developing a set of
	tools for facilitating online, public deliberation of policies being
	proposed by governmental or non-governmental organisations. Within
	the IMPACT project, PolicyCommons plays the role of the Argument
	Analysis, Tracking and Visualisation Tool (AVT).</p>

<p>PolicyCommons is powered by the
<a href="http://cohere.open.ac.uk/">Cohere</a> tool developed at the
 Open University. Cohere is a general information management tool that
	allows users to visually create, connect and share ideas, as well as
	annotate URLs with these ideas.</p>

    <h2>Key Features</h2>
	<p>Currently, PolicyCommons provides most of the main features of
	Cohere. These features allow users to:</p>
    <ul>
        <li>Annotate a URL with any number of Ideas, or vice-versa.</li>
        <li>Visualize your network as it grows</li>
        <li>Make connections between your Ideas, or Ideas that anyone else has made public or shared with you via a common Group</li>
        <li>Use Groups to organise your Ideas and Connections by project, and to manage access-rights</li>
        <li>Import your data as RSS feeds (eg. bookmarks or blog posts), to convert them to Ideas, ready for connecting</li>
        <li>Use the <a href="<?php echo $CFG->homeAddress; ?>help/code-doc/Cohere-API/apilib.html">RESTful API services</a> to query, edit and mashup data from other tools</li>
    </ul>

	<h2>Open Source</h2>

	<p>PolicyCommons is an open source tool. The code, which is
	distributed under the LGPL licence, can be downloaded
	from the
  <a href="https://github.com/cdc-leeds/PolicyCommons">
  GitHub PolicyCommons page</a>.</p>



    <h2>Acknowledgements</h2>

	<p>PolicyCommons is developed at the Centre for Digital Citizenship,
	Institute of Communications Studies, University of Leeds, UK. It is
	funded as part of the <a href="http://www.policy-impact.eu/">EU FP7
  IMPACT project</a>. PolicyCommons is powered by the
  <a href="http://cohere.open.ac.uk">Cohere</a> tool developed at the
  Knowledge Media Institute, The Open University.</p>

	<p>We gratefully acknowledge use of the <a href="#">D3 visualisation
  library</a> for generating network views of debates.</p>

<?php
    include_once("includes/footer.php");
?>