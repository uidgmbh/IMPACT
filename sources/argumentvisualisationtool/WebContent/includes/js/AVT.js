var AVT = AVT || {};
(function (MODULE_NAME) {

     // Augment Array type for older browsers
		 // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
     if ( !Array.prototype.forEach ) {
         Array.prototype.forEach = function(fn, scope) {
             for(var i = 0, len = this.length; i < len; ++i) {
                 fn.call(scope || this, this[i], i, this);
             }
         };
     }

     /**
      * XXX IDs of the debate issues (i.e. the Green Paper questions)
      * for IMPACT. Terrible hard-coded hack for evaluation.
      * @todo TODO Remove this hack ASAP.
      */
     var debate_issues = ["86172211160044268001323532628",
                          "86172211160424414001323532704",
                          "86172211160571292001323532770",
                          "86172211160004862001323532811",
                          "86172211160274349001323532960",
                          "86172211160338255001323533551",
                          "86172211160538262001323533595",
                          "86172211160684959001323533681",
                          "86172211160319722001323533736",
                          "86172211160975727001323533778",
                          "86172211160577778001323533828",
                          "86172211160716819001323533881",
                          "86172211160984157001323534441",
                          "86172211160042978001323534488",
                          "86172211160499399001323534556",
                          "86172211160900082001323534625",
                          "86172211160332931001323534674",
                          "86172211160191863001323534726",
                          "86172211160427606001323535267",
                          "86172211160173963001323535315",
                          "86172211160893172001323535364",
                          "86172211160891869001323535412",
                          "86172211160075286001323535460",
                          "86172211160628025001323537143",
                          "86172211160349383001323537186",
                          "86172211160967585001323537454"];

    /**
     * Replace the normal jQuery getScript function with one that supports
     * debugging and which references the script files as external resources
     * rather than in-lining it.
     * 
     * @param url
     *            the URL of the java script resource to load
     * @param callback
     *            function called after the resource is completely loaded
     * @see: http://www.lockencreations.com/2011/07/02/cant-debug-imported-js-files-when-using-jquery-getscript/
     */
    var lazyLoadScriptResource = function (url, callback) {
        var head = document.getElementsByTagName("head")[0];

        var script = document.createElement("script");
        script.src = url;

        // Handle Script loading
        var done = false;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function()
        {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete"))
            {
                done = true;
                if (callback)
                {
                    callback();
                }

                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
            }
        };

        head.appendChild(script);

        // We handle everything using the script element injection
        return undefined;
    };

    /**
       Function for loading scripts that depend on each other

       @param Array scripts List of script names, where 1st loads before last
       @param Function callback Function to be executed after all scripts loaded
     */
    var loadDependentScripts = function (scripts, callback) {
        var callback = callback || function () {};
        (function lds(scripts) {
            var scripts = scripts || [];
            return (!scripts.length) ? callback : function () {
                lazyLoadScriptResource(scripts[0], lds(scripts.slice(1)));
            };
        })(scripts)();
    };

    /**
       Initialise component and load dependencies (JS, CSS, etc.)
       */
    var init = function (toolbox_state) {
        var path = toolbox_state.avt.path;
        var script_root = path + '/includes/js/';
        var scripts = [
            'd3.v2.min.js',
            'textFlow.min.js',
            'spryMap.min.js',
            'tipTip.min.js',
            'ARGVIZ.map.js',
            'ARGVIZ.network.js'
        ];
        var css_root = path + '/includes/css/';
        var styles = [
            'tipTip.css',
            'ARGVIZ.map.css',
            'ARGVIZ.network.css',
            'AVT.css'
        ];

        var loadScript = function (script) {
            var url = script_root + script;
            lazyLoadScriptResource(url);
        };

        var loadCSS = function (css) {
            var url = css_root + css;
            jQuery('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: url
            }).appendTo('head');
        };

        // Load all script dependencies
        scripts.forEach(loadScript);

        // Load CSS styles
        styles.forEach(loadCSS);

        return toolbox_state;
    };

    /**
       Called every time the component is shown in toolbox
       */
    var start = function (toolbox_state) {
        var path = toolbox_state.avt.path;
        var div_id = toolbox_state.avt.div;
        var debate_id = toolbox_state.currentDebateId;
        var req_params = {
            method: 'getdebatecontents',
            nodeid: debate_id,
            format: 'json'
        };

        var req_url = path + '/api/service.php';

        var drawMap = function (raw_data) {
            var data = ARGVIZ.map.convertCohereData(raw_data);
            var config = {
                data: data,
                container: div_id,
                onclick_handlers: {
                    "Issue": onClickIssue
                },
                theme: {
                    css: "impact-avt",
                    range: 20
                },
                after: addDownloadLink
            };
            ARGVIZ.map.draw(config);
        };

        var addDownloadLink = function () {
            var download_href = req_url +
                "?format=json&method=generatereport&nodeid=" +
                debate_id;

            var download_anchor = "<a href='" +
                download_href +
                "' target=\'_blank'>" +
                "Click to download summary of responses</a>";

            var download_span = "<span class='download-link'>(" +
                download_anchor + ")</span>";

            jQuery(".title-cell:not(:has(>span))").html(function(i, old_html) {
                                           return old_html + " " + download_span;
                                       });
        };

        var onClickIssue = function (issue) {

            // Handler will be called with 'this' set to current DOM element
            // Use this DOM element as container
            var container = this;

            var req_params = {
                method: 'getconnectionsbyissuenode',
                nodeid: issue.nodeid,
                format: 'json'
            };

            var drawNetwork = function (raw_data) {
                var data = ARGVIZ.network.convertCohereData(raw_data);

                // Define callback for when nodes in network are
                // drawn. This callback selects those nodes for which
                // we can find the source-document where the text is
                // taken from. These nodes are made clickable so that
                // user can click to go straight to the
                // source-document. Note, source-documents are URLs in
                // the Cohere data model.
                var nodeSource = function (n) {
                    return n.urls &&
                        d3.select(this).each(function (n) {
                            n.url = n.urls[0].url.url;
                        })
												    .select('text')
                            .on("mouseover", function (n) {
                                this.style.textDecoration = "underline";
                                this.style.fontStyle = "italic";
                            })
                        .on("mouseout", function (n) {
                            this.style.textDecoration = "none";
                            this.style.fontStyle = "normal";
                        })
                        .on("click", function (n) {

                            var window_attr = 'width=800,height=600,scrollbars=yes';

                            window.open(
                                n.url, 'SourceDocument', window_attr);

                        })
                        .style("cursor", "pointer");
                    };

								var nodeVotes = function (n) {
										var isConsultationArgument = function (node) {
												if(node.nodeid === toolbox_state.avt.consultation_arg.id) {
														return true;
												}
												return false;
										};

										var isConsultationPremise = function (node) {
												var premises = toolbox_state.avt.consultation_arg.premises;
												var i;
												for (i = 0; i < premises.length; i += 1) {
														if (premises[i].id === node.nodeid) {
																node.agree_votes = premises[i].agree_votes;
																node.disagree_votes = premises[i].disagree_votes;
																return true;
														}
												}

												return false;
										};

										if (isConsultationArgument(n)) {
												d3.select(this)
														.select("rect")
														.attr("stroke-width", "5");
										}

										if (isConsultationPremise(n)) {
												n.name += " (Agree: " + n.agree_votes +
														", Disagree: " +	n.disagree_votes + ")";
										}
								};

								var nodeCallback = function(n) {
										nodeSource.apply(this, [n]);
										if (toolbox_state.avt.consultation_arg) {
												nodeVotes.apply(this, [n]);
										}
								};

                var config = {
                    data: data,
                    container: container,
                    node_fn: nodeCallback
                };

                ARGVIZ.network.draw(config);
            };

            jQuery.getJSON(req_url, req_params, drawNetwork);
        };

        var callback = function () {
            jQuery.getJSON(req_url, req_params, drawMap);
        };

        // XXX SCT Import hard-coded with Bernd Groninger user
        // credentials.
        // @todo TODO Integrate with toolbox authentication
        function importSctData (callback) {

						// XXX Hardcoded request to SCT for argument-ID 1
						var sct_api = toolbox_state.sct.path +
								"/index.php?submitid=survey-results/1";

						var postToCohere = function (data) {
								var req_params = {
										method: "sctimport",
										format: "json",
										data: data,
										user: "berndgroninger@email.com"
								};

								var processCohereOutput = function (cohere_json) {
										var outcome_obj = cohere_json.result[0].outcome[0];
										var consultation_arg;

										if (! outcome_obj.stdclass.argument_id) {
												consultation_arg = null;
										} else {
												consultation_arg = {
														id: outcome_obj.stdclass.argument_id,
														premises: []
												};

												outcome_obj.stdclass.premises
														.forEach(function(p) {
																				 consultation_arg.premises.push(p.stdclass);
																		 });
										}

										toolbox_state.avt.consultation_arg = consultation_arg;
										callback();
								};

								jQuery.post(req_url, req_params, processCohereOutput, "json");
						};

						jQuery.get(sct_api, {}, postToCohere, "text");
				}

        // XXX ART Import hard-coded with Bernd Groninger user
        // credentials.
        // @todo TODO Integrate with toolbox authentication
        (function importArtData (debate_issues, callback) {

             var completed = 0;

             var getIssueArguments = function (issue) {

                 var art_api = toolbox_state.art.path +
                     '/php/api.php?/issues/' + issue;

                 var postToCohere = function (data) {

                     var req_params = {
                         method: 'artimport',
                         format: 'json',
                         data: data,
                         user: 'berndgroninger@email.com'
                     };

                     var processCohereOutput = function (cohere_json) {
                         completed += 1;
                         if (completed === debate_issues.length) {
                             callback();
                         }
                     };

                     jQuery.post(req_url, req_params, processCohereOutput, "json");
                 };

                 jQuery.get(art_api, {}, postToCohere, "text");
             };

             debate_issues.forEach(getIssueArguments);

        })(debate_issues, function(){ importSctData(callback); });

				jQuery('#'+div_id).html('Loading...Please wait');
        return toolbox_state;
    };


    /**
       Called when component is no longer shown in toolbox
       */
    var stop = function (toolbox_state) {
        var div_id = toolbox_state.avt.div;
        jQuery('#'+div_id).html('');
        return toolbox_state;
    };

    /**
       Called to check whether the tool can be stopped
       @return {Boolean}
       */
    var canBeStopped = function () {
        return true;
    };

    /**
       Called when the toolbox language changes
       */
    var languageChanged = function (lang) {
        // TODO Currently no other languages
        return false;
    };

    // Expose public API for component
    MODULE_NAME.init = init;
    MODULE_NAME.start = start;
    MODULE_NAME.stop = stop;
    MODULE_NAME.canBeStopped = canBeStopped;
    MODULE_NAME.languageChanged = languageChanged;
})(AVT);
