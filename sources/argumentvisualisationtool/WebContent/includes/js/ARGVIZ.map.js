/********************************************************************************
 *                                                                              *
 *  (c) Copyright 2011 University of Leeds, UK                                  *
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
var ARGVIZ = ARGVIZ || {};
ARGVIZ.map = ARGVIZ.map || {};

(function (MODULE_NAME) {

    /**
        This converts debate data in Cohere ConnectionSet format into D3 treemap
        data format.

        @param {Object} cohere_json - The data in Cohere ConnectionSet format
      */
    function convertCohereData(cohere_json) {
        // Total number of issues and responses in the debate
        var num_issues = cohere_json.connectionset[0].num_issues;
        var num_responses = cohere_json.connectionset[0].num_responses;

        // Pointer to just the array of connections in the ConnectionSet object
        var connections = cohere_json.connectionset[0].connections;

        // The root of the debate is the 'from' node in the first connection
        var root_node = connections[0].connection.from[0].cnode;
        root_node.nodetype = root_node.role[0].role.name;

        // Temporary variables for building treemap data
        var nodes_hash = {}, from_cnode, to_cnode;

        // The treemap data (initialised with clone of root of the debate)
        var d3_tree = jQuery.extend(true, {}, root_node);

        // For-loop variables
        var i, len = connections.length;

        d3_tree.num_issues = num_issues;
        d3_tree.num_responses = num_responses;

        // For each connection in connections array...
        for (i = 0; i < len; i += 1) {

            // Clone from and to node
            from_cnode = jQuery.extend(
                true, {}, connections[i].connection.from[0].cnode);

            to_cnode = jQuery.extend(
                true, {}, connections[i].connection.to[0].cnode);

            // Copy Cohere 'role name' into new attribute called 'nodetype'
            from_cnode.nodetype = from_cnode.role[0].role.name;
            to_cnode.nodetype = to_cnode.role[0].role.name;

            // Store all the 'to-node' children of a 'from-node' in a hash
            nodes_hash[from_cnode.nodeid] =
                nodes_hash[from_cnode.nodeid] || from_cnode;

            nodes_hash[from_cnode.nodeid].children =
                nodes_hash[from_cnode.nodeid].children || [];

            nodes_hash[from_cnode.nodeid].children.push(to_cnode);
        }

        // Now build the tree
        (function buildTree(tree) {
            var i, len;

            tree.children =
                nodes_hash[tree.nodeid] && nodes_hash[tree.nodeid].children;

            if (tree.children) {
                for (i = 0, len = tree.children.length; i < len; i += 1) {
                    buildTree(tree.children[i]);
                }
            }

            return;

        })(d3_tree);

        return d3_tree;
    }

    /**
     * This produces the colour pallete for the map cells
     *
     * @param {Object} theme - Object with CSS class and range properties
     * @return {Array} - An array of RGB colours
     */
    function pallete(theme) {

        theme = theme || {};
        theme.css = (theme && theme.css) || 'ARGVIZ-default-theme';
        theme.range = (theme && theme.range) || 10;

        var i,
            colors = [];

        // Easiest way to get colors for theme is to add hidden DOM element,
        // attach CSS class and get value of CSS 'fill' property
        var div = jQuery('<div id="map-pallete"></div>').hide()
            .appendTo('body')
            .addClass(theme.css);

        var getCSSFill = function (val, i) {
            return jQuery('<div></div>').appendTo(div)
                .addClass('q' + i + '-' + theme.range)
                .css('fill');
        };

        // Need to initialise array for Array.map to work
        for (i = 0; i < theme.range; i += 1) {
            colors.push(null);
        }

        return colors.map(getCSSFill);
    }

    function draw(config) {
        var data = jQuery.extend(true, {}, config.data);
        var current = root = data;
        var container = '#' + config.container;

        // Check for before and after callback functions
        var before = config.before || function () {};
        var after = config.after || function () {};

         // Insert a new <div> for the debate map
        jQuery(container).html('<div id="debatemap-div"></div>');

        // Set width & height for SVG
        var w = config.width || jQuery(container).get(0).offsetWidth;
        var h = config.height || jQuery(container).height() || jQuery(window).height();
        var color = d3.scale.ordinal()
            .range(pallete(config.theme));

        var vis = d3.select("#debatemap-div");
        vis = render(vis, root);

        function render(vis, data) {
            // XXX Possible bug: Recalling this function at different points of
            // tree might mean d.depth is no longer correct for each node.
            var treemap = d3.layout.treemap()
                .size([w, h])
                .padding([40, 0, 0, 0])
                .sticky(true)
                .value(function (d) {
                    // Make size of region in debate map be determined based on
                    // Log of the number of responses. Use log so that variation
                    // in size isn't too much. Need to add 2 to num_responses so
                    // that if number of responses is 0 we still get the cell to
                    // display (adding 1 would give log(1) which is 0). There
                    // probably is a more elegant way of doing this.
                    return Math.log(parseInt(d.num_responses, 10) + 2);
                })
                .sort(function (a, b) {
                    // Sort so largest cell in treemap is top-left rather than
                    // bottom right
                    return a.value - b.value;
                });

            vis.html('')
                .attr("class", "debatemap")
                .style("width", w + "px")
                .style("height", h + "px");

            vis.style("opacity", 1e-6)
                .transition()
                .duration(1000)
                .style("opacity", 1);

            vis.data([data]).selectAll("div")
                .data(treemap.nodes)
                .enter().append("div")
                .each(before)
                .call(cell)
                .each(after);

            return vis;
        }

        function cell() {
            this
                .attr('id', function (d) { return d.nodeid; })
                .attr("class", "debatemap-cell")
                .style("left", function (d) { return d.x + "px"; })
                .style("top", function (d) { return d.y + "px"; })
                .style("width", function (d) { return d.dx - 1 + "px"; })
                .style("height", function (d) { return d.dy - 1 + "px"; })
                .style("background", function (d) {
                    // Sub-Debates (i.e. sections within a Debate) should
                    // have a unique background colour in the treemap. But
                    // Issues in a treemap should have the same background
                    // colour as the Sub-Debate or section they are
                    // contained in.
                    return d.nodeid && (d.nodetype === "Issue") ?
                        color(d.parent.nodeid) : color(d.nodeid);
                })
                .style('display', function (d) {
                    return (d === current) || child_of(d, current) ?
                        'block' : 'none';
                })
            // Insert empty div to help with CSS
                .append("div")
                .html(function (d) {
                    return (d === current) ?
                        title_html(d, this) :
                        cell_html(d, this);
                })
            // Add onclick handlers to nav_links so user can click link to
            // render map at desired point in hierarchy.
                .selectAll('span.nav_link')
                .on('click', function() {
                    var i;
                    up = parseInt(this.getAttribute('up'));

                    for (i = 0; i < up; i += 1) {
                        current = current.parent;
                    }
                    vis = render(vis, current);
                });
        }

        // Helper function to check whether node is child of another
        function child_of(child, parent) {
            var i;
            for (i = 0; i < parent.children.length; i += 1) {
                if (child.name === parent.children[i].name) {
                    return true;
                }
            }
            return false;
        }

        // Prepare HTML for title cell
        function title_html(d, current_cell) {
            d3.select(current_cell)
                .attr('class', 'title-cell');

            return ancestry_nav(d, 1) + d.name;
        }

        // Prepare links for navigating back up the tree
        function ancestry_nav(d, up) {
            return (d.parent) ?
                ancestry_nav(d.parent, up+1) + nav_link(d.parent, up) + ' / ' :
                '';
        }

        // Prepare single nav link. Include attribute 'up 'so we know how far
        // back up to navigate in the treemap when link is clicked
        function nav_link(d, up) {
            return '<span class="nav_link" up=' + up +'>' +
                ((up < 2) ? d.name : '..') + '</span>';
        }

        // Prepare HTML for cells with content
        function cell_html(d, current_cell) {
            var html = d.name;
            var cell_type = d.nodetype;

            if (cell_type === "Debate") {
                html = html + "<br /><br />" +
                    "(Issues: " + d.num_issues + ")" + "<br />" +
                    "(Responses: " + d.num_responses + ")";

                // Only if the number of issues is more than 0 do we make
                // Sub-Debate cells clickable. (In principle there
                // should always be issues in debates/sub-debates, but in
                // practice the modeller might not always get around to
                // modelling the issues within a debate/sub-debate.)
                if (d.num_issues > 0) {
                    d3.select(current_cell)
                        .attr("class", "clickable")
                        .style("cursor", "pointer")
                        .on('click', function (d) {
                            // Re-render treemap with current node as root
                            // XXX Possible bug: d.depth might no longer be
                            // correct
                            current = d;
                            vis = render(vis, current);
                        });
                }
            } else if (cell_type === "Issue") {
                html = html + "<br /><br />" +
                    "(Responses: " + d.num_responses + ")";

                // Only if the number of responses is more than 0 do we
                // make Issue cells clickable
                if (d.num_responses > 0) {
                    d3.select(current_cell)
                        .attr("class", "clickable")
                        .style("cursor", "pointer")
                    // Add any onclick handlers for Issue cells passed in
                    // with the config parameter
                    .on("click", function (d) {
                        var container;
                        current = d;
                        vis = render(vis, current);

                        config.onclick_handlers &&
                            config.onclick_handlers[cell_type] &&
                                (function () {
                                    var container = vis.select('div')
                                        .append('div')
                                        .style('border-top',
                                               'solid 1px white')[0][0];
                                    config.onclick_handlers[cell_type]
                                        .apply(container, [d]);
                                })();
                    });
                }
            }
            return html;
        }
    }

    // Expose public API for the module
    MODULE_NAME.convertCohereData = convertCohereData;
    MODULE_NAME.draw = draw;

})(ARGVIZ.map);
