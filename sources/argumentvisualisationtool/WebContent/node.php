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
    array_push($HEADER,'<script src="'.$CFG->homeAddress.'includes/tabber.js" type="text/javascript"></script>');
    include_once("includes/header.php");
    include_once("phplib/tabberlib.php");
    global $USER;
    $nodeid = required_param("nodeid",PARAM_TEXT);

	// default parameters
    $start = optional_param("start",0,PARAM_INT);
    $max = optional_param("max",20,PARAM_INT);
    $orderby = optional_param("orderby","date",PARAM_ALPHA);
    $sort = optional_param("sort","DESC",PARAM_ALPHA);

	// filter parameters
    $direction = optional_param("direction","right",PARAM_ALPHA);
    $filtergroup = optional_param("filtergroup","",PARAM_TEXT);
    $filterlist = optional_param("filterlist","",PARAM_TEXT);
    $filternodetypes = optional_param("filternodetypes","",PARAM_TEXT);
    $filterusers = optional_param("filterusers","",PARAM_TEXT);

	// network search parameters
    $netnodeid = optional_param("netnodeid","",PARAM_TEXT);
    $netq = optional_param("netq","",PARAM_TEXT);
    $netscope = optional_param("netscope","",PARAM_TEXT);
    $netlinkgroup = optional_param("netlinkgroup","",PARAM_TEXT);
    $netdepth = optional_param("netdepth",1,PARAM_INT);
    $netdirection = optional_param("netdirection",'both',PARAM_TEXT);
    $netlabelmatch = optional_param("netlabelmatch",'false',PARAM_TEXT);

    $agentlastrun = optional_param("agentlastrun",'',PARAM_TEXT);

    $node = getNode($nodeid);

    if($node instanceof Error){
        echo "<h1>Idea not found</h1>";
        include_once("includes/footer.php");
        die;
    }
?>
    <div id="context">
        <div id="contextinfo">
            <h1><?php print $node->name; ?></h1>
            <?php
                if($node->description != ""){
            ?>
                    <div id="desc_display" class="active" onClick="desctoggle()">Show Description</div>
                    <div id="desc_text"><?php echo $node->description; ?></div>
                    <script type="text/javascript">
                        $('desc_text').toggle();

                        function desctoggle(){
                            $('desc_text').toggle();

                            if($('desc_text').visible()){
                                $('desc_display').update("Hide Description");
                            } else {
                                $('desc_display').update("Show Description");
                            }
                        }
                    </script>
            <?php
                }
            ?>
        </div>
    </div>
    <div style="clear:both;"></div>
<?php


    $args = array();
    $args["nodeid"] = $nodeid;

    $args["start"] = $start;
    $args["max"] = $max;
    $args["orderby"] = $orderby;
    $args["sort"] = $sort;

    $args["direction"] = $direction;
    $args["filtergroup"] = $filtergroup;
    $args["filterlist"] = $filterlist;
    $args["filternodetypes"] = $filternodetypes;
    $args["filterusers"] = $filterusers;

    $args["netnodeid"] = $netnodeid;
    $args["netq"] = $netq;
    $args["netscope"] = $netscope;
    $args["netlinkgroup"] = $netlinkgroup;
    $args["netdepth"] = $netdepth;
    $args["netdirection"] = $netdirection;
    $args["netlabelmatch"] = $netlabelmatch;

    $args["agentlastrun"] = $agentlastrun;

    $args["title"] = $node->name;

    display_tabber($CFG->NODE_CONTEXT,$args);

    include_once("includes/footer.php");
?>
