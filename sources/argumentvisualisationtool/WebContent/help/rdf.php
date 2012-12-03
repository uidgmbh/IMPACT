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
    include_once("helpheader.php");
?>
<h1>
	<a target="_blank" href="http://www.w3.org/RDF/" title="RDF Resource Description Framework">
	<img border="0" class="alignmiddle" height=25   width=25   src="http://www.w3.org/RDF/icons/rdf_flyer.24" /></a>
	<span><span style="color: DarkSlateBlue">RDF</span> - Resource Description Framework - the <i>how-to</i> for Cohere</span>
</h1>
            
<p>
<a href="#"></a><h2>Table of Contents</h2>
</p>
<P><A class="link" href="#whatis">What is RDF?</A><BR>
	<A class="link" href="#cohererdf">What does the Cohere RDF model look like?</A><BR />
	<A class="link" href="#create">How can I create some RDF for Cohere? </A><BR />
</P>
                        
            
<!--
here start the new info on RDF imports!
-->
        
<a name="whatis"></a><h2>What is RDF?</h2>

            
<p>RDF, the Resource Description Framework - developed by the World-Wide Web Consortium (W3C) - provides the foundation for metadata interoperability across different resource description communities.</p>

<p>RDF (Resource Description Framework) is a model for storing graphs of information. Given a set of resources, each resource being a thing, such as a person, a song, a web page or a bookmark, RDF is used to create relationships between these resources. Some people think of RDF as an XML language for describing data. However, this XML format is just a method of storing RDF in a file. If you are trying to learn RDF, it may be confusing to learn it via the XML syntax; instead, you should try first to 
<a class="link" target="_blank" href = "http://www.xulplanet.com/tutorials/mozsdk/rdfstart.php">understand the RDF model without looking at the XML syntax.</a></p>
<p>Think of a web or graph of interconnected nodes. The nodes are connected via various relationships. For example, let's say each node represents a person. Each person might be related to another person because they are siblings, parents, spouses, employees or enemies. Each interconnection is labeled with the relationship name. As a result we will have a densely populated graph of things and relations among things! For example, you can see below a graphical representation of an rdf structure describing actors and tv-shows.</p>
<p><a target="_blank" href="http://www.xml.com/pub/a/2001/01/24/rdf.html"><img border="0" class="alignmiddle" src="../images/rdf_schema/whatisrdf_1.gif"   /></a><p>

<p>RDF may look difficult at first sight, but actually its model is really simple: it always consists of <i>triples</i>, i.e., sequences of *subject* => *predicate* => *object* statements. In order to find out more about RDF and how to create valid RDF files, check out the following resources:
<ul>
<li style="margin-left: 40px;"><a class="link" target="_blank" href="http://www.xulplanet.com/tutorials/mozsdk/rdfstart.php">XUL-Planet: Introduction to the RDF Model</a></li>
<li style="margin-left: 40px;"><a class="link" target="_blank" href="http://www.xml.com/pub/a/2001/01/24/rdf.html">XML.com: what is RDF?</a></li>
<li style="margin-left: 40px;"><a class="link" target="_blank" href="http://blog.gandrew.com/2006/06/rdf-in-nutshell.html">RDF in a nutshell</a></li>
<li style="margin-left: 40px;"><a class="link" target="_blank" href="http://www.xml.com/lpt/a/1057">Make you XML RDF-friendly</a></li>
<li style="margin-left: 40px;"><a class="link" target="_blank" href="http://renato.iannella.it/paper/rdf-idiot/">An idiot's guide to RDF</a></li>
<li style="margin-left: 40px;"><a class="link" target="_blank" href="http://www.w3schools.com/rdf/default.asp">W3schools: RDF tutorial</a></li>
<li style="margin-left: 40px;"><a href="http://www.w3.org/RDF/Validator/" class="link"> W3C RDF Validator</a></li>
</ul>
</p>
<br> 
            
            
<a name="cohererdf"></a><h2>What does the Cohere RDF Model look like?</h2>
            
<p>The Cohere data model is encoded in an ontology, which can be accessed at <a class="link" target="_blank" href="../ontology/cohere.owl"><?php echo $CFG->homeAddress; ?>ontology/cohere.owl</a>. It probably will not be very useful to open it in a web-browser,so we suggest you to use a tool like <a class="link" target="_blank" href="http://protege.stanford.edu/">Protege'</a> to visualize it. (just create a new project, select 'create from existing sources' and type in the cohere ontology url). Here we'll give you a quite detailed explanation of the entities in the Cohere world, and the relations among them. Let's see how these elements link up together.</p>
<p>Essentially, Cohere is about making connection among ideas, and linking them up to resources on the web: the key elements here are therefore the <i>people</i> who create such objects, the <i>web resources</i> we want to describe or refer to, the <i>ideas</i> we create and the <i>connections</i> used to relate the ideas.</p>
<p>In the <b>first figure</b> it's possible to see the modeling of the PERSON , WEBSITE, IMAGE and IDEA classes (images can be added to ideas and persons as a mean of 
describing them). Notice how an ABSTRACT_IDEA is a complex entity, which subsumes NODE, CONNECTION and SET. This is needed (see below) for being able to create 
connections at various levels of abstraction: e.g. by linking a node (i.e. a simple idea) and a connection, two nodes or a node and a set of connections. The result 
of this is a mechanism that supports the creation of complex networks of nested ideas.</p>
<p><a href="../images/rdf_schema/cohere-rdf-1.png"><img border="0" class="alignmiddle" src="../images/rdf_schema/cohere-rdf-1-small.png"   /></a></p>
<p>The <b>second figure</b> shows the modeling of the CONNECTION class, which is the element Cohere provides in order to create relations among ideas. The important thing 
to remember here is that an idea only plays a role (e.g. premise, conclusion, example etc.) in the context of a connection. Therefore a connection class, beyond 
having the <i>from_node</i> and <i>to_node</i> properties, has also the <i>has_from_node_role</i> and <i>has_to_node_role</i> properties. By doing so, the role of 
a node in a connection is stored together with the connection, and not with the node itself. Further, a connection contains also a <i>connection_label</i> which is the edge 
connecting the two elements. Connections have three default roles you can choose from, 'positive', 'negative' and 'neutral', which are represented as instance 
of the <i>connection_label_role</i> class. If left unspecified, they will be classified as neutral.<p>
<p><a href="../images/rdf_schema/cohere-rdf-2.png"><img border="0" class="alignmiddle" src="../images/rdf_schema/cohere-rdf-2-small.png"   /></a></p>
<p>The <b>third figure</b> shows an example-instantiation. Here we have a simple connection between two ideas: <b>chemistry</b> and <b>neurobiology</b>. Notice how 
the creation of the triple [chemistry -> supports -> neurobiology] involves the instantiation of several other classes! <p>
<p><a href="../images/rdf_schema/cohere-rdf-3-instantiation.png"><img border="0" class="alignmiddle" src="../images/rdf_schema/cohere-rdf-3-instantiation-small.png"   /></a></p>


<!--
<p>Finally, in the <b>fourth figure</b> we can recognize the same example described in figure 3, with the augmentation of a new connection obtained by 
reifying the previous connection and treating it as a simple idea (i.e. a node in a connection). This is possible thanks to the design pattern used for modeling ideas, described on figure 1.
 <p>
<p><a href="../images/rdf_schema/cohere-rdf-3-instantiation-reified.png"><img border="0" class="alignmiddle" src="../images/rdf_schema/cohere-rdf-3-instantiation-reified-small.png"   /></a></p>
-->

<br><br>           
            
<a name="create"></a><h2>How can I create RDF for Cohere?</h2>

<p>Okay .. it's time to get more practical now. </p>
<p>We'll create some RDF/XML code expressing the instantiation example on fig.3. If you're reading this, you probably need to upload large data files
 containing ideas and connections into Cohere, so you'll be better off creating the RDF-XML programmatically with a script or 
 some other library (you can find here a good <a target="_blank" class="link" href="http://planetrdf.com/guide/#sec-tools">list of the available libraries</a>). 
 Now instead, for the sake of explanation, we'll do all this tedious work manually... :-)
<p>One last thing to remember (if you're not familiar with the rdf family of languages): in rdf 
the statements do not have to respect a fixed order; as a result, usually your automatically-generated code will be quite difficult to read for humans 
(e.g. some statements may refer to objects which are created only at the end of the file). Also, resources can be created within other resources: that means that 
new resources do not all have to be created at the top-level. <br>For example, we could have the <i>&#60;person rdf:ID="person_mikele1"\&#62</i> created within the description 
of another resource, e.g. an instance of a connection link:  <i>&#60;connection_link rdf:ID="connection_link_chemistry_TO_neurobiology"&#62</i> . This may appear very 
confusing, cause the person and the connection we are talking about are not strictly or exclusively related to each other. For a gentle and quick introduction to 
rdf, make sure you had a look at one of the links above... Enjoy!</p>

<p>An RDF/XML file usually starts with a <b>namespace declaration</b>. This is basically where we're declaring
what vocabularies we are using. For example, here we specify that with the prefix <i>ns1</i> we are actually referring to 
the namespace <i><?php echo $CFG->homeAddress; ?>ontology/cohere.owl</i>, which is the cohere ontology. This will become useful
later on, when referring to the classes in the Cohere model, because we can just use the prefix notation instead of writing every time 
the whole url (of course, it could have been done the 'verbose' way too). Even if you do not really want to understand what this is about, please make sure that
 the following code stays at the top of your rdf file, otherwise you surely will not be able to import your data!</p>
                 
<p style='color:red;background:#ffffff'>
                 
<pre style="color: red; font-family: monospace; font-size: 10px;" >
                 
<font color="#0000ff">&lt;?</font><font color="#298a52"><b>xml</b></font><font color="#298a52"><b> </b></font><font color="#298a52"><b>version</b></font>=<font color="#ff00ff">&quot;1.0&quot;</font><font color="#298a52"><b> </b></font><font color="#298a52"><b>encoding</b></font>=<font color="#ff00ff">&quot;UTF-8&quot;</font><font color="#298a52"><b> </b></font><font color="#0000ff">?&gt;</font>

<font color="#008a8c">&lt;</font><font color="#6b59ce">rdf</font><font color="#0000ff">:</font><font color="#008a8c">RDF</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xml</b></font><font color="#0000ff">:</font><font color="#298a52"><b>base</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="<?php echo $CFG->homeAddress; ?>ontology/cohere.owl#"><?php echo $CFG->homeAddress; ?>ontology/cohere.owl#</a>&quot;</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xmlns</b></font><font color="#0000ff">:</font><font color="#298a52"><b>rdf</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/1999/02/22-rdf-syntax-ns#">http://www.w3.org/1999/02/22-rdf-syntax-ns#</a>&quot;</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xmlns</b></font><font color="#0000ff">:</font><font color="#298a52"><b>rdfs</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2000/01/rdf-schema#">http://www.w3.org/2000/01/rdf-schema#</a>&quot;</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xmlns</b></font><font color="#0000ff">:</font><font color="#298a52"><b>xsd</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#">http://www.w3.org/2001/XMLSchema#</a>&quot;</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xmlns</b></font><font color="#0000ff">:</font><font color="#298a52"><b>owl</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2002/07/owl#">http://www.w3.org/2002/07/owl#</a>&quot;</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xmlns</b></font><font color="#0000ff">:</font><font color="#298a52"><b>dc</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://purl.org/dc/elements/1.1/">http://purl.org/dc/elements/1.1/</a>&quot;</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xmlns</b></font><font color="#0000ff">:</font><font color="#298a52"><b>dcterms</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://purl.org/dc/terms/">http://purl.org/dc/terms/</a>&quot;</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xmlns</b></font><font color="#0000ff">:</font><font color="#298a52"><b>vcard</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/vcard-rdf/3.0#">http://www.w3.org/2001/vcard-rdf/3.0#</a>&quot;</font>
<font color="#008a8c">   </font><font color="#298a52"><b>xmlns</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ns1</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="<?php echo $CFG->homeAddress; ?>ontology/cohere.owl#"><?php echo $CFG->homeAddress; ?>ontology/cohere.owl#</a>&quot;</font><font color="#008a8c">&gt;</font>

</pre></p>

<p>Now we can start defining our data. First of all we need to instantiate all the 'basic' elements of our example. That is, <b>websites, users and images</b>. <br />In the case of the <b>websites</b>, we will have the following: 
</p>

<!--
the example code in this section was created from the cohere_rdf_example.rdf file in the /import/rdf/ directory
the coloring was iniitally created using the handy http://www.mensus.net/widgets/color.shtml
then I tweaked a little the colors for a better rendering (it can be improved still...)
                -->
                                
<p style='color:red;background:#ffffff'><pre style="color: red; font-family: monospace; font-size: 10px;" >

<font color="#000000">&lt;</font><font color="#000000">ns1:website</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;website_49_chemistry&quot;</font><font color="#000000">&gt;</font>
   <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>my favourite chemistry website<font color="#000000">&lt;/ns1:has_description&gt;</font>
   <font color="#000000">&lt;</font><font color="#000000">has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>http://chemistry_website.com<font color="#000000">&lt;/ns1:has_url&gt;</font>
   <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>the website of chemistry<font color="#000000">&lt;/ns1:has_name&gt;</font>
<font color="#000000">&lt;/ns1:website&gt;</font>


 <font color="#000000">&lt;</font><font color="#000000">ns1:website</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;website_neurobiology&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>the website of neurobiology<font color="#000000">&lt;/ns1:has_name&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>neurobiology website<font color="#000000">&lt;/ns1:has_description&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>http://neurobiology_website.com<font color="#000000">&lt;/ns1:has_url&gt;</font>
<font color="#000000">&lt;/ns1:website&gt;</font>


<font color="#000000">&lt;</font><font color="#000000">ns1:website</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;website_mikele2&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>mikele2's homepage<font color="#000000">&lt;/ns1:has_name&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>www.mikele2.com<font color="#000000">&lt;/ns1:has_url&gt;</font>
<font color="#000000">&lt;/ns1:website&gt;</font>

<font color="#000000">&lt;</font><font color="#000000">ns1:website</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;website_42_mikele1&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>www.mikele1.com<font color="#000000">&lt;/ns1:has_url&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>mikele's homepage<font color="#000000">&lt;/ns1:has_name&gt;</font>
<font color="#000000">&lt;/ns1:website&gt;</font>

</pre></p>

<p>Now it's the turn of the <b>users</b>:</p>
                                               
<p style='color:#000000;background:#ffffff'><pre style="color: red; font-family: monospace; font-size: 10px;"  >
                    
<font color="#000000">&lt;</font><font color="#000000">ns1:cohere_user</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;person_mikele1&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_homepage</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#website_42_mikele1&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_email_address</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>mikele1@open.ac.uk<font color="#000000">&lt;/ns1:has_email_address&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>one of the aliases of this ontology's creator<font color="#000000">&lt;/ns1:has_description&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_depiction</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#image_43_mikele1&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>mikele1<font color="#000000">&lt;/ns1:has_name&gt;</font>
<font color="#000000">&lt;/ns1:cohere_user&gt;</font>


<font color="#000000">&lt;</font><font color="#000000">ns1:cohere_user</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;person_mikele2&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_homepage</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#website_mikele2&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_email_address</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>mikele2@open.ac.uk<font color="#000000">&lt;/ns1:has_email_address&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>mikele2<font color="#000000">&lt;/ns1:has_name&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>another one of the aliases of this ontology's creator<font color="#000000">&lt;/ns1:has_description&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_depiction</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#image_mikele2&quot;</font><font color="#000000">/&gt;</font>
<font color="#000000">&lt;/ns1:cohere_user&gt;</font>

</pre></p>

<p>Finally, let's create some instances for the <b>images</b> as well. </p>
            
<p style='color:#000000;background:#ffffff'><pre style="color: red; font-family: monospace; font-size: 10px;"  >

<font color="#000000">&lt;</font><font color="#000000">ns1:image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;image_43_mikele1&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>http://mikele1.tiff<font color="#000000">&lt;/ns1:has_url&gt;</font>
<font color="#000000">&lt;/ns1:image&gt;</font>
<font color="#000000">&lt;</font><font color="#000000">ns1:image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;image_mikele2&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>http://mikele2.tiff<font color="#000000">&lt;/ns1:has_url&gt;</font>
<font color="#000000">&lt;/ns1:image&gt;</font>
<font color="#000000">&lt;</font><font color="#000000">ns1:image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;image_52_neurobiology&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>http://neurobiologyimage.tiff<font color="#000000">&lt;/ns1:has_url&gt;</font>
<font color="#000000">&lt;/ns1:image&gt;</font>
<font color="#000000">&lt;</font><font color="#000000">ns1:image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;thumbnail_image_neurobiology&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>http://thumbnail_neurobiology.tiff<font color="#000000">&lt;/ns1:has_url&gt;</font>
<font color="#000000">&lt;/ns1:image&gt;</font>
<font color="#000000">&lt;</font><font color="#000000">ns1:image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;image_47_chemistry&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>http://chemistryimage.tiff<font color="#000000">&lt;/ns1:has_url&gt;</font>
<font color="#000000">&lt;/ns1:image&gt;</font>
<font color="#000000">&lt;</font><font color="#000000">ns1:image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;thumbnail_image_48_neurobiology&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_url</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>http://thumbnail_neurobiology.tiff<font color="#000000">&lt;/ns1:has_url&gt;</font>
<font color="#000000">&lt;/ns1:image&gt;</font>
            
</pre></p>

<p>Now we have all the elements for creating the <b>node</b> instances, that is, the two atomic ideas which are connected together, i.e. neurobiology and chemistry. 
Notice how the already existing object are referenced to by using the rdf:resource=#... syntax. </p>
            
<p style='color:#000000;background:#ffffff'><pre style="color: red; font-family: monospace; font-size: 10px;"  >
            
<font color="#000000">&lt;</font><font color="#000000">ns1:node</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;simple_idea_51_neurobiology&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creator</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#person_mikele2&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creation_date</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#dateTime">http://www.w3.org/2001/XMLSchema#dateTime</a>&quot;</font><font color="#000000">&gt;</font>2008-02-19T14:34:49<font color="#000000">&lt;/ns1:has_creation_date&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#image_52_neurobiology&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_website</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#website_neurobiology&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>neurobiology<font color="#000000">&lt;/ns1:has_name&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_thumbnail_image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#thumbnail_image_neurobiology&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>the idea of neurobiology, the discipline<font color="#000000">&lt;/ns1:has_description&gt;</font>
<font color="#000000">&lt;/ns1:node&gt;</font>

<font color="#000000">&lt;</font><font color="#000000">ns1:node</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;simple_idea_20_chemistry&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creation_date</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#dateTime">http://www.w3.org/2001/XMLSchema#dateTime</a>&quot;</font><font color="#000000">&gt;</font>2008-02-19T14:34:49<font color="#000000">&lt;/ns1:has_creation_date&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creator</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#person_mikele1&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>chemistry<font color="#000000">&lt;/ns1:has_name&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>the idea of chemistry, the discipline<font color="#000000">&lt;/ns1:has_description&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#image_47_chemistry&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_website</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#website_49_chemistry&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_thumbnail_image</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#thumbnail_image_48_neurobiology&quot;</font><font color="#000000">/&gt;</font>
<font color="#000000">&lt;/ns1:node&gt;</font>
    
</pre></p>

<p>Quite straighforward up to now, uh? <br />So we're getting to the final bit, which is creating the connection instance. Before doing that, though, 
we have to create some more basic elements of the connection object. These are the <b>label</b> connecting the two nodes and the <b>label-role</b> specifying 
whether the label stands for a *positive*, *negative* or *neutral* relationship. </p><p><b>Remember</b> that is not compulsory to create label-roles 
when you upload a cohere-rdf file! <br />When Cohere finds a label without an associated role it will automatically attach a *neutral* role
to it. Also, if the specified role's <b>name</b> does not match one of the three default ones (i.e. 'positive', 'negative' and 'neutral')
it won't be recognized as a valid option and will be transformed into a *neutral* label-role. This is only a temporary 
solution - we are working for extending this functionality so to let users have complete freedom in the creation of label-roles.
<br /></p><p></p>So, to sum up: you can create as many instances of <b>connection_label</b> as you like, but only three instances of <b>connection_label_role</b> 
will be imported correctly, namely, the ones where the <i>ns1:has_name</i> property is set to 'positive', 'negative' or 'neutral'. 
<br />For example, in the following code we are creating a valid *positive* label-role instance, which is then used to describe the label with name 'supports_idea'.</p>
            
<p style='color:#000000;background:#ffffff'><pre style="color: red; font-family: monospace; font-size: 10px;" >
    
<font color="#000000">&lt;</font><font color="#000000">ns1:connection_label_role</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;connection_label_role_1_positive&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>instance representing the positive role<font color="#000000">&lt;/ns1:has_description&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creator</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#person_mikele1&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>positive<font color="#000000">&lt;/ns1:has_name&gt;</font>
<font color="#000000">&lt;/ns1:connection_label_role<&gt;</font>
            
<font color="#000000">&lt;</font><font color="#000000">ns1:connection_label</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;connection_link_chemistry_TO_neurobiology&quot;</font><font color="#000000">&gt;</font>
    <font color="#000000">&lt;</font><font color="#000000">ns1:has_label_role</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#connection_label_role_1_positive&quot;</font><font color="#000000">/&gt;</font>
    <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>supports_idea<font color="#000000">&lt;/ns1:has_name&gt;</font>
<font color="#000000">&lt;/ns1:connection_label&gt;</font>

</pre></p>
                        
<p>The other type or roles we might want to create are the <b>roles</b> the nodes have in the connection. For example, we can say that 
the first node acts as a <i>premise</i>, and the second as a <i>conclusion</i>. Or that the first one is the <i>evidence</i>, while the second is
an <i>objection</i>, and so on... Cohere has a set of pre-defined roles to use, but if you want you can always create a
new node-role if it suits your needs best. </p>
                
<p style='color:#000000;background:#ffffff'><pre style="color: red; font-family: monospace; font-size: 10px;" >
        
<font color="#000000">&lt;</font><font color="#000000">ns1:connection_node_role</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;connection_node_type_conclusion&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creator</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#person_mikele1&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>a conclusion in some argumentation schema<font color="#000000">&lt;/ns1:has_description&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>conclusion<font color="#000000">&lt;/ns1:has_name&gt;</font>
<font color="#000000">&lt;/ns1:connection_node_role&gt;</font>

<font color="#000000">&lt;</font><font color="#000000">ns1:connection_node_role</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;connection_node_type_premise&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creator</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#person_mikele1&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_name</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>premise<font color="#000000">&lt;/ns1:has_name&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_description</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#string">http://www.w3.org/2001/XMLSchema#string</a>&quot;</font><font color="#000000">&gt;</font>a premise in some argumentation schema<font color="#000000">&lt;/ns1:has_description&gt;</font>
<font color="#000000">&lt;/ns1:connection_node_role&gt;</font>

</pre></p>  

<p>Finally, now we have all the elements needed to instantiate the <b>connection</b> class!
</p>    
                       
<p style='color:#000000;background:#ffffff'>
<pre style="color: red; font-family: monospace; font-size: 10px;" >
            
<font color="#000000">&lt;</font><font color="#000000">ns1:connection</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>ID</b></font>=<font color="#ff00ff">&quot;connection_chemistry_to_neurobiology&quot;</font><font color="#000000">&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creator</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#person_mikele1&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_creation_date</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>datatype</b></font>=<font color="#ff00ff">&quot;<a style="color: blue;" href="http://www.w3.org/2001/XMLSchema#dateTime">http://www.w3.org/2001/XMLSchema#dateTime</a>&quot;</font><font color="#000000">&gt;</font>2008-02-19T14:41:50<font color="#000000">&lt;/ns1:has_creation_date&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_to_node_role</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#connection_node_type_conclusion&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_to_node</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#simple_idea_51_neurobiology&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_from_node_role</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#connection_node_type_premise&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_from_node</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#simple_idea_20_chemistry&quot;</font><font color="#000000">/&gt;</font>
  <font color="#000000">&lt;</font><font color="#000000">ns1:has_label</font><font color="#000000"> </font><font color="#298a52"><b>rdf</b></font><font color="#0000ff">:</font><font color="#298a52"><b>resource</b></font>=<font color="#ff00ff">&quot;#connection_link_chemistry_TO_neurobiology&quot;</font><font color="#000000">/&gt;</font>
<font color="#000000">&lt;/ns1:connection&gt;</font>
</pre></p>
                
<p>Last but not least, we have to close the <i>rdf</i> tag.... </p>

<p style='color:#000000;background:#ffffff'>
<pre style="color: red; font-family: monospace; font-size: 10px;" >
            
<font color="#008a8c">&lt;/</font><font color="#6b59ce">rdf</font><font color="#0000ff">:</font><font color="#008a8c">RDF&gt;</font>
                
</pre></p>

<p>IMPORTANT: once you've created the RDF of the data you want to import into Cohere, it's always a good practice to validate
it before trying to import it! For this purpose, you can use the <a href="http://www.w3.org/RDF/Validator/" class="link"> W3C RDF Validator</a>. </p>
            
<?php
    include_once("../includes/dialogfooter.php");
?>