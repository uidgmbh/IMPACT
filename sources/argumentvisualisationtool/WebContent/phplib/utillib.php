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
 * Utility library
 * Misc functions that don't fit anywhere else!
 */

/**
 * Does all sorts of transformations and filtering
 */
define('FORMAT_MOODLE',   '0');   // Does all sorts of transformations and filtering

/**
 * Plain HTML (with some tags stripped)
 */
define('FORMAT_HTML',     '1');   // Plain HTML (with some tags stripped)

/**
 * Plain text (even tags are printed in full)
 */
define('FORMAT_PLAIN',    '2');   // Plain text (even tags are printed in full)

/**
 * Wiki-formatted text
 * Deprecated: left here just to note that '3' is not used (at the moment)
 * and to catch any latent wiki-like text (which generates an error)
 */
define('FORMAT_WIKI',     '3');   // Wiki-formatted text

/**
 * Markdown-formatted text http://daringfireball.net/projects/markdown/
 */
define('FORMAT_MARKDOWN', '4');   // Markdown-formatted text http://daringfireball.net/projects/markdown/


 /// Parameter constants - every call to optional_param(), required_param()  ///
/// or clean_param() should have a specified type of parameter.  //////////////


/**
 * PARAM_CLEAN - obsoleted, please try to use more specific type of parameter.
 * It was one of the first types, that is why it is abused so much ;-)
 */
define('PARAM_CLEAN',    0x0001);

/**
 * PARAM_INT - integers only, use when expecting only numbers.
 */
define('PARAM_INT',      0x0002);

/**
 * PARAM_INTEGER - an alias for PARAM_INT
 */
define('PARAM_INTEGER',  0x0002);

/**
 * PARAM_NUMBER - a real/floating point number.
 */
define('PARAM_NUMBER',  0x000a);

/**
 * PARAM_ALPHA - contains only english letters.
 */
define('PARAM_ALPHA',    0x0004);

/**
 * PARAM_ACTION - an alias for PARAM_ALPHA, use for various actions in formas and urls
 * @TODO: should we alias it to PARAM_ALPHANUM ?
 */
define('PARAM_ACTION',   0x0004);

/**
 * PARAM_FORMAT - an alias for PARAM_ALPHA, use for names of plugins, formats, etc.
 * @TODO: should we alias it to PARAM_ALPHANUM ?
 */
define('PARAM_FORMAT',   0x0004);

/**
 * PARAM_NOTAGS - all html tags are stripped from the text. Do not abuse this type.
 */
define('PARAM_NOTAGS',   0x0008);

 /**
 * PARAM_MULTILANG - alias of PARAM_TEXT.
 */
define('PARAM_MULTILANG',  0x0009);

 /**
 * PARAM_TEXT - general plain text compatible with multilang filter, no other html tags.
 */
define('PARAM_TEXT',  0x0009);

/**
 * PARAM_FILE - safe file name, all dangerous chars are stripped, protects against XSS, SQL injections and directory traversals
 */
define('PARAM_FILE',     0x0010);

/**
 * PARAM_TAG - one tag (interests, blogs, etc.) - mostly international alphanumeric with spaces
 */
define('PARAM_TAG',   0x0011);

/**
 * PARAM_TAGLIST - list of tags separated by commas (interests, blogs, etc.)
 */
define('PARAM_TAGLIST',   0x0012);

/**
 * PARAM_PATH - safe relative path name, all dangerous chars are stripped, protects against XSS, SQL injections and directory traversals
 * note: the leading slash is not removed, window drive letter is not allowed
 */
define('PARAM_PATH',     0x0020);

/**
 * PARAM_HOST - expected fully qualified domain name (FQDN) or an IPv4 dotted quad (IP address)
 */
define('PARAM_HOST',     0x0040);

/**
 * PARAM_URL - expected properly formatted URL. Please note that domain part is required, http://localhost/ is not acceppted but http://localhost.localdomain/ is ok.
 */
define('PARAM_URL',      0x0080);

/**
 * PARAM_LOCALURL - expected properly formatted URL as well as one that refers to the local server itself. (NOT orthogonal to the others! Implies PARAM_URL!)
 */
define('PARAM_LOCALURL', 0x0180);

/**
 * PARAM_CLEANFILE - safe file name, all dangerous and regional chars are removed,
 * use when you want to store a new file submitted by students
 */
define('PARAM_CLEANFILE',0x0200);

/**
 * PARAM_ALPHANUM - expected numbers and letters only.
 */
define('PARAM_ALPHANUM', 0x0400);

/**
 * PARAM_BOOL - converts input into 0 or 1, use for switches in forms and urls.
 */
define('PARAM_BOOL',     0x0800);

/**
 * PARAM_CLEANHTML - cleans submitted HTML code and removes slashes
 * note: do not forget to addslashes() before storing into database!
 */
define('PARAM_CLEANHTML',0x1000);

/**
 * PARAM_HTML - keep the HTML as HTML
 * note: do not forget to addslashes() before storing into database!
 */
define('PARAM_HTML',0x1100);

/**
 * PARAM_ALPHAEXT the same contents as PARAM_ALPHA plus the chars in quotes: "/-_" allowed,
 * suitable for include() and require()
 * @TODO: should we rename this function to PARAM_SAFEDIRS??
 */
define('PARAM_ALPHAEXT', 0x2000);

/**
 * PARAM_SAFEDIR - safe directory name, suitable for include() and require()
 */
define('PARAM_SAFEDIR',  0x4000);

/**
 * PARAM_SEQUENCE - expects a sequence of numbers like 8 to 1,5,6,4,6,8,9.  Numbers and comma only.
 */
define('PARAM_SEQUENCE',  0x8000);

/**
 * PARAM_PEM - Privacy Enhanced Mail format
 */
define('PARAM_PEM',      0x10000);

/**
 * PARAM_BASE64 - Base 64 encoded format
 */
define('PARAM_BASE64',   0x20000);


/**
 * Returns a particular value for the named variable, taken from
 * POST or GET.  If the parameter doesn't exist then an error is
 * thrown because we require this variable.
 *
 * This function should be used to initialise all required values
 * in a script that are based on parameters.  Usually it will be
 * used like this:
 *    $id = required_param('id');
 *
 * @param string $parname the name of the page parameter we want
 * @param int $type expected type of parameter
 * @return mixed
 */
function required_param($parname, $type=PARAM_CLEAN) {
    global $CFG;
    if (isset($_POST[$parname])) {       // POST has precedence
        $param = $_POST[$parname];
    } else if (isset($_GET[$parname])) {
        $param = $_GET[$parname];
    } else {
         global $ERROR;
         $ERROR = new error;
         $ERROR->message = "Required parameter missing: ".$parname;
         $ERROR->code = "1000";
         include($CFG->dirAddress."api/apierror.php");
         die;
    }

    return clean_param($param, $type);
}

/**
 * Returns a particular value for the named variable, taken from
 * POST or GET, otherwise returning a given default.
 *
 * This function should be used to initialise all optional values
 * in a script that are based on parameters.  Usually it will be
 * used like this:
 *    $name = optional_param('name', 'Fred');
 *
 * @param string $parname the name of the page parameter we want
 * @param mixed  $default the default value to return if nothing is found
 * @param int $type expected type of parameter
 * @return mixed
 */
function optional_param($parname, $default=NULL, $type=PARAM_CLEAN) {


    if (isset($_POST[$parname])) {       // POST has precedence
        $param = $_POST[$parname];
    } else if (isset($_GET[$parname])) {
        $param = $_GET[$parname];
    } else {
        return $default;
    }

    return clean_param($param, $type);
}


/**
 * Check whether current user is logged in or not
 *
 * @return Error object
 */
function api_check_login(){
    global $USER;
    if(!isset($USER->userid)){
         return access_denied_error();
    }
    return true;
}

/**
 * Create access denied error message
 *
 * @return Error object
 */
function access_denied_error(){
    global $ERROR;
    $ERROR = new error;
    $ERROR->message = "Access denied";
    $ERROR->code = "2001";
    return $ERROR;
}

/**
 * Create database error message
 *
 * @param string $error (optional error message)
 * @param string $code (optional error code)
 * @return Error object
 */
function database_error($error="Database error", $code="7000"){
    global $ERROR;
    $ERROR = new error;
    $ERROR->message = $error;
    $ERROR->code = $code;
    return $ERROR;
}

/**
 * Create tweet error message
 *
 * @param string $error (optional error message)
 * @param string $code (optional error code)
 * @return Error object
 */
function tweet_error($error="Tweet error", $code="8000"){
    global $ERROR;
    $ERROR = new error;
    $ERROR->message = $error;
    $ERROR->code = $code;
    return $ERROR;
}

/**
 * Replace reserved chars with their XML entity equivalents
 *
 * @param string $xmlStr
 * @return string
 */
function parseToXML($xmlStr) {
    $xmlStr=str_replace("&",'&amp;',$xmlStr);
    $xmlStr=str_replace('<','&lt;',$xmlStr);
    $xmlStr=str_replace('>','&gt;',$xmlStr);
    $xmlStr=str_replace('"','&quot;',$xmlStr);
    $xmlStr=str_replace("'",'&#39;',$xmlStr);
    return $xmlStr;
}

/**
 * Replace XML entities with their character equivalents
 *
 * @param string $text
 * @return string
 */
function parseFromXML($text) {
    $text = str_replace("&quot;", '"', $text);
    $text = str_replace("&#039;", "'", $text);
    $text = str_replace("&lt;", "<", $text);
    $text = str_replace("&gt;", ">", $text);
    $text = str_replace("&amp;", "&", $text);
    return $text;
}

/**
 * Replace chars with their JSON escaped chars. Also removes line feeds/returns/tabs which mess up JSON validation
 *
 * @param string $str
 * @return string
 */
function parseToJSON($str) {
    //$str = str_replace(chr(13),' ',$str); // remove returns
    //$str = str_replace(chr(10), ' ',$str); // remove line feeds

    $str = str_replace("\r\n", "\n", $str);
    $str = str_replace("\r", "\n", $str);

    // JSON requires new line characters be escaped
    $str = str_replace("\n", "\\n", $str);

    $str = str_replace(chr(9),' ',$str);  // remove tabs
    $str = str_replace("\"",'\\"',$str); // escape double quotes
    return $str;
}

/**
 * Used by {@link optional_param()} and {@link required_param()} to
 * clean the variables and/or cast to specific types, based on
 * an options field.
 * <code>
 * $course->format = clean_param($course->format, PARAM_ALPHA);
 * $selectedgrade_item = clean_param($selectedgrade_item, PARAM_CLEAN);
 * </code>
 *
 * @uses $CFG
 * @uses PARAM_CLEAN
 * @uses PARAM_INT
 * @uses PARAM_INTEGER
 * @uses PARAM_ALPHA
 * @uses PARAM_ALPHANUM
 * @uses PARAM_NOTAGS
 * @uses PARAM_ALPHAEXT
 * @uses PARAM_BOOL
 * @uses PARAM_SAFEDIR
 * @uses PARAM_CLEANFILE
 * @uses PARAM_FILE
 * @uses PARAM_PATH
 * @uses PARAM_HOST
 * @uses PARAM_URL
 * @uses PARAM_LOCALURL
 * @uses PARAM_CLEANHTML
 * @uses PARAM_HTML
 * @uses PARAM_SEQUENCE
 * @param mixed $param the variable we are cleaning
 * @param int $type expected format of param after cleaning.
 * @return mixed
 */
function clean_param($param, $type) {

    global $CFG,$ERROR;

    if (is_array($param)) {              // Let's loop
        $newparam = array();
        foreach ($param as $key => $value) {
            $newparam[$key] = clean_param($value, $type);
        }
        return $newparam;
    }

    switch ($type) {

        case PARAM_CLEAN:        // General HTML cleaning, try to use more specific type if possible
            if (is_numeric($param)) {
                return $param;
            }
            $param = stripslashes($param);   // Needed for kses to work fine
            $param = clean_text($param);     // Sweep for scripts, etc
            return addslashes($param); // Restore original request parameter slashes
        case PARAM_CLEANHTML:    // prepare html fragment for display, do not store it into db!!
            $param = stripslashes($param);   // Remove any slashes
            $param = clean_text($param);     // Sweep for scripts, etc
            return trim($param);

        case PARAM_HTML:    // keep as HTML, no processing
            $param = stripslashes($param);   // Remove any slashes
            return trim($param);

        case PARAM_INT:
            return (int)$param;  // Convert to integer

        case PARAM_NUMBER:
            return (float)$param;  // Convert to integer

        case PARAM_ALPHA:        // Remove everything not a-z
            return eregi_replace('[^a-zA-Z]', '', $param);

        case PARAM_ALPHANUM:     // Remove everything not a-zA-Z0-9
            return eregi_replace('[^A-Za-z0-9]', '', $param);

        case PARAM_ALPHAEXT:     // Remove everything not a-zA-Z/_-
            return eregi_replace('[^a-zA-Z/_-]', '', $param);

        case PARAM_SEQUENCE:     // Remove everything not 0-9,
            return eregi_replace('[^0-9,]', '', $param);

        case PARAM_BOOL:         // Convert to 1 or 0
            $tempstr = strtolower($param);
            if ($tempstr == 'on' or $tempstr == 'yes' or $tempstr == 'true') {
                $param = 1;
            } else if ($tempstr == 'off' or $tempstr == 'no' or $tempstr == 'false') {
                $param = 0;
            } else {
                $param = empty($param) ? 0 : 1;
            }
            return $param;

        case PARAM_NOTAGS:       // Strip all tags
            return strip_tags($param);

        case PARAM_TEXT:    // leave only tags needed for multilang
        	$param = clean_param(strip_tags($param, '<lang><span>'), PARAM_CLEAN);
            return   stripslashes($param);

        case PARAM_SAFEDIR:      // Remove everything not a-zA-Z0-9_-
            return eregi_replace('[^a-zA-Z0-9_-]', '', $param);

        case PARAM_CLEANFILE:    // allow only safe characters
            return clean_filename($param);

        case PARAM_FILE:         // Strip all suspicious characters from filename
            $param = ereg_replace('[[:cntrl:]]|[<>"`\|\':\\/]', '', $param);
            $param = ereg_replace('\.\.+', '', $param);
            if($param == '.') {
                $param = '';
            }
            return $param;

        case PARAM_PATH:         // Strip all suspicious characters from file path
            $param = str_replace('\\\'', '\'', $param);
            $param = str_replace('\\"', '"', $param);
            $param = str_replace('\\', '/', $param);
            $param = ereg_replace('[[:cntrl:]]|[<>"`\|\':]', '', $param);
            $param = ereg_replace('\.\.+', '', $param);
            $param = ereg_replace('//+', '/', $param);
            return ereg_replace('/(\./)+', '/', $param);

        case PARAM_HOST:         // allow FQDN or IPv4 dotted quad
            preg_replace('/[^\.\d\w-]/','', $param ); // only allowed chars
            // match ipv4 dotted quad
            if (preg_match('/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/',$param, $match)){
                // confirm values are ok
                if ( $match[0] > 255
                     || $match[1] > 255
                     || $match[3] > 255
                     || $match[4] > 255 ) {
                    // hmmm, what kind of dotted quad is this?
                    $param = '';
                }
            } elseif ( preg_match('/^[\w\d\.-]+$/', $param) // dots, hyphens, numbers
                       && !preg_match('/^[\.-]/',  $param) // no leading dots/hyphens
                       && !preg_match('/[\.-]$/',  $param) // no trailing dots/hyphens
                       ) {
                // all is ok - $param is respected
            } else {
                // all is not ok...
                $param='';
            }
            return $param;

        case PARAM_URL:          // allow safe ftp, http, mailto urls
            include_once($CFG->dirAddress . 'phplib/validateurlsyntax.php');
            if (!empty($param) && validateUrlSyntax($param, 's?H?S?F?E?u-P-a?I?p?f?q?r?')) {
                // all is ok, param is respected
            } else {
                $param =''; // not really ok
            }
            return $param;

        case PARAM_LOCALURL:     // allow http absolute, root relative and relative URLs within wwwroot
            $param = clean_param($param, PARAM_URL);
            if (!empty($param)) {
                if (preg_match(':^/:', $param)) {
                    // root-relative, ok!
                } elseif (preg_match('/^'.preg_quote($CFG->wwwroot, '/').'/i',$param)) {
                    // absolute, and matches our wwwroot
                } else {
                    // relative - let's make sure there are no tricks
                    if (validateUrlSyntax($param, 's-u-P-a-p-f+q?r?')) {
                        // looks ok.
                    } else {
                        $param = '';
                    }
                }
            }
            return $param;

        case PARAM_PEM:
            $param = trim($param);
            // PEM formatted strings may contain letters/numbers and the symbols
            // forward slash: /
            // plus sign:     +
            // equal sign:    =
            // , surrounded by BEGIN and END CERTIFICATE prefix and suffixes
            if (preg_match('/^-----BEGIN CERTIFICATE-----([\s\w\/\+=]+)-----END CERTIFICATE-----$/', trim($param), $matches)) {
                list($wholething, $body) = $matches;
                unset($wholething, $matches);
                $b64 = clean_param($body, PARAM_BASE64);
                if (!empty($b64)) {
                    return "-----BEGIN CERTIFICATE-----\n$b64\n-----END CERTIFICATE-----\n";
                } else {
                    return '';
                }
            }
            return '';

        case PARAM_BASE64:
            if (!empty($param)) {
                // PEM formatted strings may contain letters/numbers and the symbols
                // forward slash: /
                // plus sign:     +
                // equal sign:    =
                if (0 >= preg_match('/^([\s\w\/\+=]+)$/', trim($param))) {
                    return '';
                }
                $lines = preg_split('/[\s]+/', $param, -1, PREG_SPLIT_NO_EMPTY);
                // Each line of base64 encoded data must be 64 characters in
                // length, except for the last line which may be less than (or
                // equal to) 64 characters long.
                for ($i=0, $j=count($lines); $i < $j; $i++) {
                    if ($i + 1 == $j) {
                        if (64 < strlen($lines[$i])) {
                            return '';
                        }
                        continue;
                    }

                    if (64 != strlen($lines[$i])) {
                        return '';
                    }
                }
                return implode("\n",$lines);
            } else {
                return '';
            }

        case PARAM_TAG:
            //first fix whitespace
            $param = preg_replace('/\s+/', ' ', $param);
            //remove blacklisted ASCII ranges of chars - security FIRST - keep only ascii letters, numnbers and spaces
            //the result should be safe to be used directly in html and SQL
            $param = preg_replace("/[\\000-\\x1f\\x21-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\x7f]/", '', $param);
            //now remove some unicode ranges we do not want
            $param = preg_replace("/[\\x{80}-\\x{bf}\\x{d7}\\x{f7}]/u", '', $param);
            //cleanup the spaces
            $param = preg_replace('/ +/', ' ', $param);
            $param = trim($param);
            $textlib = textlib_get_instance();
            $param = $textlib->substr($param, 0, TAG_MAX_LENGTH);
            //numeric tags not allowed
            return is_numeric($param) ? '' : $param;

        case PARAM_TAGLIST:
            $tags = explode(',', $param);
            $result = array();
            foreach ($tags as $tag) {
                $res = clean_param($tag, PARAM_TAG);
                if ($res != '') {
                    $result[] = $res;
                }
            }
            if ($result) {
                return implode(',', $result);
            } else {
                return '';
            }

        default:
            $ERROR = new error;
             $ERROR->message = "Invalid parameter type";
             $ERROR->code = "10001";
             include("../api/apierror.php");
             die;
    }
}

/**
 * Given raw text (eg typed in by a user), this function cleans it up
 * and removes any nasty tags that could mess up Moodle pages.
 *
 * @uses FORMAT_MOODLE
 * @uses FORMAT_PLAIN
 * @uses ALLOWED_TAGS
 * @param string $text The text to be cleaned
 * @param int $format Identifier of the text format to be used
 *            (FORMAT_MOODLE, FORMAT_HTML, FORMAT_PLAIN, FORMAT_WIKI, FORMAT_MARKDOWN)
 * @return string The cleaned up text
 */
function clean_text($text, $format=FORMAT_MOODLE) {

    global $ALLOWED_TAGS, $CFG;

    if (empty($text) or is_numeric($text)) {
       return (string)$text;
    }

    switch ($format) {
        case FORMAT_PLAIN:
        case FORMAT_MARKDOWN:
            return $text;

        default:

            if (!empty($CFG->enablehtmlpurifier)) {
                $text = purify_html($text);
            } else {
            /// Fix non standard entity notations
                $text = preg_replace('/(&#[0-9]+)(;?)/', "\\1;", $text);
                $text = preg_replace('/(&#x[0-9a-fA-F]+)(;?)/', "\\1;", $text);

            /// Remove tags that are not allowed
                $text = strip_tags($text, $ALLOWED_TAGS);

            /// Clean up embedded scripts and , using kses
                $text = cleanAttributes($text);

            /// Again remove tags that are not allowed
                $text = strip_tags($text, $ALLOWED_TAGS);
            }

        /// Remove potential script events - some extra protection for undiscovered bugs in our code
            $text = eregi_replace("([^a-z])language([[:space:]]*)=", "\\1Xlanguage=", $text);
            $text = eregi_replace("([^a-z])on([a-z]+)([[:space:]]*)=", "\\1Xon\\2=", $text);


            return $text;
    }
}

/**
 * This function takes a string and examines it for HTML tags.
 * If tags are detected it passes the string to a helper function {@link cleanAttributes2()}
 *  which checks for attributes and filters them for malicious content
 *         17/08/2004              ::          Eamon DOT Costello AT dcu DOT ie
 *
 * @param string $str The string to be examined for html tags
 * @return string
 */
function cleanAttributes($str){
    $result = preg_replace_callback(
            '%(<[^>]*(>|$)|>)%m', #search for html tags
            "cleanAttributes2",
            $str
            );
    return  $result;
}

/**
 * This function takes a string with an html tag and strips out any unallowed
 * protocols e.g. javascript:
 * It calls ancillary functions in kses which are prefixed by kses
 *        17/08/2004              ::          Eamon DOT Costello AT dcu DOT ie
 *
 * @param array $htmlArray An array from {@link cleanAttributes()}, containing in its 1st
 *              element the html to be cleared
 * @return string
 */
function cleanAttributes2($htmlArray){

    global $CFG, $ALLOWED_PROTOCOLS;
    require_once($CFG->dirAddress .'phplib/kses.php');

    $htmlTag = $htmlArray[1];

    if (substr($htmlTag, 0, 1) != '<') {
        return '&gt;';  //a single character ">" detected
    }
    if (!preg_match('%^<\s*(/\s*)?([a-zA-Z0-9]+)([^>]*)>?$%', $htmlTag, $matches)) {
        return ''; // It's seriously malformed
    }
    $slash = trim($matches[1]); //trailing xhtml slash
    $elem = $matches[2];    //the element name
    $attrlist = $matches[3]; // the list of attributes as a string

    $attrArray = kses_hair($attrlist, $ALLOWED_PROTOCOLS);

    $attStr = '';
    foreach ($attrArray as $arreach) {
        $arreach['name'] = strtolower($arreach['name']);
        if ($arreach['name'] == 'style') {
            $value = $arreach['value'];
            while (true) {
                $prevvalue = $value;
                $value = kses_no_null($value);
                $value = preg_replace("/\/\*.*\*\//Us", '', $value);
                $value = kses_decode_entities($value);
                $value = preg_replace('/(&#[0-9]+)(;?)/', "\\1;", $value);
                $value = preg_replace('/(&#x[0-9a-fA-F]+)(;?)/', "\\1;", $value);
                if ($value === $prevvalue) {
                    $arreach['value'] = $value;
                    break;
                }
            }
            $arreach['value'] = preg_replace("/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t/i", "Xjavascript", $arreach['value']);
            $arreach['value'] = preg_replace("/e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n/i", "Xexpression", $arreach['value']);
        } else if ($arreach['name'] == 'href') {
            //Adobe Acrobat Reader XSS protection
            $arreach['value'] = preg_replace('/(\.(pdf|fdf|xfdf|xdp|xfd))[^a-z0-9_\.\-].*$/i', '$1', $arreach['value']);
        }
        $attStr .=  ' '.$arreach['name'].'="'.$arreach['value'].'"';
    }

    $xhtml_slash = '';
    if (preg_match('%/\s*$%', $attrlist)) {
        $xhtml_slash = ' /';
    }
    return '<'. $slash . $elem . $attStr . $xhtml_slash .'>';
}

/**
 * Create the SQL ORDER and LIMIT BY clause for nodes
 *
 * @param integer $start start row
 * @param integer $max max number of rows to return
 * @param string $o order by column
 * @param string $s sort order (ASC or DESC)
 * @return string
 */
function nodeOrderString($start,$max,$o,$s){
    global $CFG;

    //check order by & sort param are valid
    switch ($o) {
        case "date":
            $orderby = "t.CreationDate";
            break;
        case "tagid":
        case "nodeid":
            $orderby = "t.NodeID";
            break;
        case "name":
            $orderby = "t.Name";
            break;
        case "moddate":
            $orderby = "t.ModificationDate";
            break;
        case "connectedness":
            $orderby = "connectedness";
            break;
        default:
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "Invalid order by selection";
            $ERROR->code = "1002";
            include($CFG->dirAddress."api/apierror.php");
            die;
    }

    //check order by & sort param are valid
    switch ($s) {
        case "ASC":
            $sort = "ASC";
            break;
        case "DESC":
            $sort = "DESC";
            break;
        default:
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "Invalid sort selection";
            $ERROR->code = "1003";
            include($CFG->dirAddress."api/apierror.php");
            die;
    }

     if ($max > -1) {
        $str = " ORDER BY ". $orderby ." " .$sort." LIMIT ". $start.",".$max;
    }
    else {
        $str = " ORDER BY ". $orderby ." " .$sort;
    }

    return $str;
}

/**
 * Create the SQL ORDER and LIMIT BY clause for users
 *
 * @param integer $start start row
 * @param integer $max max number of rows to return
 * @param string $o order by column
 * @param string $s sort order (ASC or DESC)
 * @return string
 */
function userOrderString($start,$max,$o,$s){
    global $CFG;

    //check order by & sort param are valid
    switch ($o) {
        case "date":
            $orderby = "t.CreationDate";
            break;
        case "name":
            $orderby = "t.Name";
            break;
        case "moddate":
            $orderby = "t.ModificationDate";
            break;
        case "lastlogin":
            $orderby = "t.LastLogin";
            break;
        case "connectedness":
            $orderby = "connectedness";
            break;
        case "lastactive":
        	$orderby = "t.LastActive";
        	break;
        default:
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "Invalid order by selection";
            $ERROR->code = "1002";
            include($CFG->dirAddress."api/apierror.php");
            die;
    }

    //check order by & sort param are valid
    switch ($s) {
        case "ASC":
            $sort = "ASC";
            break;
        case "DESC":
            $sort = "DESC";
            break;
        default:
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "Invalid sort selection";
            $ERROR->code = "1003";
            include($CFG->dirAddress."api/apierror.php");
            die;
    }

     if ($max > -1) {
        $str = " ORDER BY ". $orderby ." " .$sort." LIMIT ". $start.",".$max;
    }
    else {
        $str = " ORDER BY ". $orderby ." " .$sort;
    }

    return $str;
}

/**
 * Create the SQL ORDER and LIMIT BY clause for urls
 *
 * @param integer $start start row
 * @param integer $max max number of rows to return
 * @param string $o order by column
 * @param string $s sort order (ASC or DESC)
 * @return string
 */
function urlOrderString($start,$max,$o,$s){
    global $CFG;
    //check order by & sort param are valid
    switch ($o) {
        case "date":
            $orderby = "t.CreationDate";
            break;
        case "name":
            $orderby = "t.Title";
            break;
        case "moddate":
            $orderby = "t.ModificationDate";
            break;
        case "connectedness":
            $orderby = "connectedness";
            break;
        default:
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "Invalid order by selection";
            $ERROR->code = "1002";
            include($CFG->dirAddress."api/apierror.php");
            die;
    }

    //check order by & sort param are valid
    switch ($s) {
        case "ASC":
            $sort = "ASC";
            break;
        case "DESC":
            $sort = "DESC";
            break;
        default:
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "Invalid sort selection";
            $ERROR->code = "1003";
            include($CFG->dirAddress."api/apierror.php");
            die;
    }

    if ($max > -1) {
    	$str = " ORDER BY ". $orderby ." " .$sort." LIMIT ". $start.",".$max;
    }
    else {
    	$str = " ORDER BY ". $orderby ." " .$sort;
    }

    return $str;
}

/**
 * Create the SQL ORDER and LIMIT BY clause for connections
 *
 * @param integer $start start row
 * @param integer $max max number of rows to return
 * @param string $o order by column
 * @param string $s sort order (ASC or DESC)
 * @return string
 */
function connectionOrderString($start,$max,$o,$s){
    global $CFG;
    //check order by & sort param are valid
    switch ($o) {
        case "date":
            $orderby = "t.CreationDate";
            break;
        case "name":
        case "fromidea":
            $orderby = "t.FromLabel";
            break;
        case "toidea":
            $orderby = "t.ToLabel";
            break;
        case "link":
        	$orderby = "lt.Label";
        	break;
        case "moddate":
            $orderby = "t.ModificationDate";
            break;
        default:
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "Invalid order by selection";
            $ERROR->code = "1002";
            include($CFG->dirAddress."api/apierror.php");
            die;
    }

    //check order by & sort param are valid
    switch ($s) {
        case "ASC":
            $sort = "ASC";
            break;
        case "DESC":
            $sort = "DESC";
            break;
        default:
            global $ERROR;
            $ERROR = new error;
            $ERROR->message = "Invalid sort selection";
            $ERROR->code = "1003";
            include($CFG->dirAddress."api/apierror.php");
            die;
    }

    if ($max > -1) {
    	$str = " ORDER BY ". $orderby ." " .$sort." LIMIT ". $start.",".$max;
    }
    else {
    	$str = " ORDER BY ". $orderby ." " .$sort;
    }

    return $str;
}


/**
 * Create a unique ID number (based on users IP address and current time)
 *
 * @return string
 */
function getUniqueID() {

	if (isset($_SERVER['REMOTE_ADDR'])) {
		$newid = eregi_replace('[^A-Za-z0-9]', '', $_SERVER['REMOTE_ADDR']);
	} else {
    	$newid = 'unknownip';
    }
    if ($newid == ""){
        $newid = "unknownip";
    }
    $time =  eregi_replace('[^0-9]', '', microtime());
    $newid .= $time;

    return $newid;
}

function get_file_from_url($url,&$errors)  {
    global $CFG;

	$info = pathinfo($url);
	$filename = $CFG->workdir.$info['basename'];

 	$http = array('method'  => 'GET',
	                'request_fulluri' => true,
	                'timeout' => '30');
 	if($CFG->PROXY_HOST != ""){
	    $http['proxy'] = $CFG->PROXY_HOST . ":".$CFG->PROXY_PORT;
	}
	$opts = array();
	$opts['http'] = $http;
	$context  = stream_context_create($opts);

	if ($fp = &fopen($url, 'rb', false, $context)) {
		$contents = '';
		while (!feof($fp)) {
		  $contents .= fread($fp, 8192);
		}
		fclose($fp);
	} else {
    	array_push($errors,"Cannot download url image");
		return "";
	}

	//check its an image
	if ($contents !== FALSE) {
		$im = imagecreatefromstring($contents);
		if ($im !== false) {

		    if (!$handle = fopen($filename, 'wb')) {
		    	array_push($errors,"Cannot open file ($filename)");
		        return"";
		    }

		   // Write $somecontent to our opened file.
		   if (fwrite($handle, $contents) === FALSE) {
			   array_push($errors,"Cannot write to file ($filename)");
		       return "";
		   }
		   fclose($handle);

		   return $filename;
		} else {
	       array_push($errors,"Sorry you can only upload images.");
	       return "";
		}
	} else {
    	array_push($errors,"Cannot download url image");
        return"";
	}
}

/**
 * Upload an image from a url(checking it's actually an image and get it resized
 *
 * @param string $url
 * @param array $errors
 * @param array $errors
 * @return array
 */
function uploadImageURL($url,&$errors,$imagewidth, $directory=""){
    global $CFG, $USER;
    if ($directory =="") {
    	if(!isset($USER->userid)){
        	array_push($errors,"User unknown");
        	return "";
    	} else {
    	 $directory = $USER->userid;
    	}
    }

    $target_path = $CFG->dirAddress."uploads/".$directory."/";
    if(!file_exists($target_path)){
        mkdir($target_path, 0777, true);
    }

    $dt = time();

    $file = get_file_from_url($url,$errors);
    if ($file == "") {
    	return "";
    }

    //replace any non alphanum chars in filename
    $info = pathinfo($file);
    $t_filename = $dt ."_". basename( eregi_replace('[^A-Za-z0-9.]', '', $info['basename']));

    //replace the filetype with png (as the resize image code makes everything a png)
    $filename = eregi_replace('.[G|g][i|I][f|F]$', '.png',$t_filename);
    $filename = eregi_replace('.[J|j][p|P][g|G]$', '.png',$t_filename);
    $filename = eregi_replace('.[J|j][p|P][e|E][g|G]$', '.png',$t_filename);
    $target_path = $target_path . $filename;

    if(!getimagesize($file)){
        array_push($errors,"Sorry you can only upload images.");
        $filename = "";
    } else if (filesize($file) > $CFG->IMAGE_MAX_FILESIZE) {
        array_push($errors,"Sorry image file is too large.");
        $filename = "";
    }

    //resize image
    if($filename == "" || !resize_image($file,$target_path,$imagewidth)){
         array_push($errors,"Error resizing image");
         $filename == "";
    }

    //delete original local file
    unlink($file);

    return $filename;

}

/**
 * Upload an image
 * checking it's actually an image and get it resized to default image size
 * on success return file name;
 * of fialuar return error
 *
 * @param string $field
 * @param array $errors
 * @return filename or empty string
 */
function uploadImage($field,&$errors,$imagewidth,$directory=""){
    global $CFG, $USER;

    if ($directory == "") {
    	if(!isset($USER->userid)){
        	array_push($errors,"User unknown");
        	return "";
    	} else {
    	 $directory = $USER->userid;
    	}
    }

    if ($_FILES[$field]['tmp_name'] != "") {
        $target_path = $CFG->dirAddress. "uploads/" .$directory."/";
        if(!file_exists($target_path)){
            mkdir($target_path, 0777, true);
        }

        //$dt = time();
        //replace any non alphanum chars in filename
        //should warn user about the file type Gary 2009. 01. 13
        //$t_filename = $dt ."_". basename( eregi_replace('[^A-Za-z0-9.]', '',$_FILES[$field]['name']));
        $t_filename =  basename( eregi_replace('[^A-Za-z0-9.]', '',$_FILES[$field]['name']));

        //echo "t-filename: " . $t_filename;

        //replace the filetype with png (as the resize image code makes everything a png)
        $filename = eregi_replace('.[B|b][m|M][p|P]$', '.png', $t_filename);
        $filename = eregi_replace('.[G|g][i|I][f|F]$', '.png', $t_filename);
        $filename = eregi_replace('.[J|j][p|P][g|G]$', '.png', $t_filename);
        $filename = eregi_replace('.[J|j][p|P][e|E][g|G]$', '.png', $t_filename);

       //echo "filename: ".$filename;
       //exit();
        $target_path = $target_path . $filename;

        if(!getimagesize($_FILES[$field]['tmp_name'])){
            array_push($errors,"Sorry you can only upload images.");
            return "";
        } else if (filesize($_FILES[$field]['tmp_name']) > $CFG->IMAGE_MAX_FILESIZE) {
            array_push($errors,"Sorry image file is too large.");
            return "";
        } else if(!move_uploaded_file($_FILES[$field]['tmp_name'], $target_path)) {
            array_push($errors,"An error occured uploading the image");
            return "";
        }

        //resize image
        if(!resize_image($target_path,$target_path,$imagewidth)){
             array_push($errors,"Error resizing image");
             return "";
        }
       	//create thumnail
       	//echo "Image has been resized: $target_path ,$imagewidth";
       	//exit();
       	if (!create_image_thumb($filename, $CFG->IMAGE_THUMB_WIDTH, $directory)){
       		array_push($errors,"Error create image thumb.");
            return "";
       	}
        return $filename;

    }
    return "";
}

/**
 * Resize an image
 *
 * @param string $in
 * @param string $out
 * @param int $size
 * @return boolean
 */
function resize_image($in,$out,$size){

	$imagetype = exif_imagetype($in);
	if ($imagetype == IMAGETYPE_JPEG) {
		$image = @imagecreatefromjpeg($in);
	} else if ($imagetype == IMAGETYPE_GIF) {
       $image = @imagecreatefromgif($in);
    } else if ($imagetype == IMAGETYPE_PNG) {
       $image = @imagecreatefrompng($in);
    } else if ($imagetype == IMAGETYPE_BMP) {
       $image = @imagecreatefrombmp($in);
	} else {
      return false;
	}

    $width = imagesx($image);
    $height = imagesy($image);

    $new_width = floatval($size);
    $new_height = $height * ($new_width/$width);
    //if already as wide as resize then return
    if($width < $size){
        return true;
    }
    //echo "width ". $width ;
    //echo "height ". $height ;
    //echo "new_width ". $new_width ;
    //echo "new_height ". $new_height ;

    $image_resized = imagecreatetruecolor($new_width,$new_height);
    imagesavealpha($image_resized, true);
    $trans_colour = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);
    imagefill($image_resized, 0, 0, $trans_colour);

    imagecopyresampled($image_resized,$image,0,0,0,0,$new_width,$new_height, $width,$height);
    imagepng($image_resized,$out);
    return true;
}

/**
 * Creat an thumbnail for an image
 *
 * @param string $image
 * @param int $size
 * @param string $directory
 * @return true
 */
function create_image_thumb($image_name, $size, $directory){
	global $CFG, $USER;
    if ($directory == "") {
    	if(!isset($USER->userid)){
        	array_push($errors,"User unknown");
        	return "";
    	} else {
    	 $directory = $USER->userid;
    	}
    }

    $target_path = $CFG->dirAddress. "uploads/" .$directory."/";
    if(!file_exists($target_path)){
        mkdir($target_path, 0777, true);
    }
	$image = $target_path . $image_name;
	$image_thumb = $target_path . str_replace('.','_thumb.',$image_name);

   //echo "imagename=".$image;
   //echo "thumb_imagename=".$image_thumb;

	if(!resize_image($image,$image_thumb,$size)){
   		array_push($errors,"Error resizing image");
   		return False;
	} else {
   		return true;
	}
}

/**
 * Check whether a string looks like a valid email address
 *
 * @param string $email
 * @return boolean
 */
function validEmail($email){
    if(eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$", $email)) {
        return true;
    } else {
        return false;
    }
}


/**
 * Sends an email of the specified template
 *
 * @param string $email
 * @return boolean
 */
function sendMail($template,$subject,$to,$params){
    global $CFG;
    //get emailhead and foot
    $headtemp = loadFileToString($CFG->dirAddress."mailtemplates/emailhead.txt");
    $head = vsprintf($headtemp,array($CFG->homeAddress."images/cohere_logo2.png"));
    $foottemp = loadFileToString($CFG->dirAddress."mailtemplates/emailfoot.txt");
    $foot = vsprintf($foottemp,array ($CFG->homeAddress."contact.php"));

    // load the template
    $template = loadFileToString($CFG->dirAddress."mailtemplates/".$template.".txt");

    $message = $head . vsprintf($template,$params) .$foot;

    $headers = "Content-type: text/html; charset=utf-8\r\n";
    ini_set("sendmail_from", $CFG->EMAIL_FROM_ADDRESS );
    $headers .= "From: ".$CFG->EMAIL_FROM_NAME ." <".$CFG->EMAIL_FROM_ADDRESS .">\r\n";
    $headers .= "Reply-To: ".$CFG->EMAIL_REPLY_TO."\r\n";
    if($CFG->send_mail){
        mail($to,$subject,$message,$headers);
    }
}

/**
 * Sends an email of the specified template
 *
 * @param string $email
 * @return boolean
 */
function sendMailMessage($subject,$to,$message){
    global $CFG;
    //get emailhead and foot
    $headtemp = loadFileToString($CFG->dirAddress."mailtemplates/emailhead.txt");
    $head = vsprintf($headtemp,array($CFG->homeAddress."images/cohere_logo2.png"));
    $foottemp = loadFileToString($CFG->dirAddress."mailtemplates/emailfoot.txt");
    $foot = vsprintf($foottemp,array ($CFG->homeAddress));

    $message = $head.$message.$foot;

    $headers = "Content-type: text/html; charset=utf-8\r\n";
    ini_set("sendmail_from", $CFG->EMAIL_FROM_ADDRESS );
    $headers .= "From: ".$CFG->EMAIL_FROM_NAME ." <".$CFG->EMAIL_FROM_ADDRESS .">\r\n";
    $headers .= "Reply-To: ".$CFG->EMAIL_REPLY_TO."\r\n";
    if($CFG->send_mail){
        mail($to,$subject,$message,$headers);
    }
}


/**
 * Method load File into an String.
 *
 * @return string | false
 */
function loadFileToString($file) {
    // If file exists load file into String.
    if(file_exists($file)) {
        return implode('',file($file));
    } else {
        return false;
    }
}

/**
 * Display the help icon
 *
 *
 */
function helpIcon($subject) {
    global $CFG;
    echo "<a href=\"javascript: loadDialog('help','".$CFG->homeAddress."help/help.php?subject=".$subject."')\" class=\"help\"><img border=\"0\" src=\"".$CFG->homeAddress."images/info.png\"/></a>";
}


/**
 * Returns a list of country names
 *
 * @uses $CFG
 * @return array
 */
function getCountryList() {
    global $CFG;

    include($CFG->dirAddress .'includes/countries.php');

    if (!empty($string)) {
        uasort($string, 'strcoll');
    }

    return $string;
}

/**
 * Geocode a location
 *
 * @uses $CFG
 * @param string $loc
 * @param string $cc country code for location
 * @return array
 */
function geoCode($loc,$cc) {
    global $CFG;
    $geo = array("lat"=>"", "lng"=>"");
    $geocodeURL  = "http://ws.geonames.org/search?maxRows=1&q=".urlencode($loc)."&country=".urlencode($cc);
    $http = array('method'  => 'GET',
                    'request_fulluri' => true,
                    'timeout' => '2');
    if($CFG->PROXY_HOST != ""){
        $http['proxy'] = $CFG->PROXY_HOST . ":".$CFG->PROXY_PORT;
    }
    $opts = array();
    $opts['http'] = $http;
    $context  = stream_context_create($opts);
    $response = file_get_contents($geocodeURL, 0, $context);
    if($geoxml = simplexml_load_string($response)){
        $geo["lat"] = sprintf($geoxml->geoname->lat);
        $geo["lng"] = sprintf($geoxml->geoname->lng);

    }
    return $geo;
}

/**
 * Ends With
 *
 * @param string $FullStr
 * @param string $EndStr
 * @return boolean
 */
function endsWith($FullStr, $EndStr){
    // Get the length of the end string
    $StrLen = strlen($EndStr);
    // Look at the end of FullStr for the substring the size of EndStr
    $FullStrEnd = substr($FullStr, strlen($FullStr) - $StrLen);
    // If it matches, it does end with EndStr
    return $FullStrEnd == $EndStr;
}

/**
 * Walk the network matching connection based on the passed criteria.
 * Starting from the given list of node labels/ids. (which always starts with 1, the focal node);
 */
function searchNetworkConnections($checkConnections, $matches, $nextNodes, $linklabels='', $linkgroup='', $labelmatch='false', $depth=7, $currentdepth=0, $direction='both', $scope='all') {
    global $DB,$USER,$CFG;

	$message="";
	$message .= "currentdepth=".$currentdepth;

   	$currentdepth++;
	if ($currentdepth > $depth) {
		return $matches;
	}

    $tempNodes = null;
	$allConnections = null;
	$searchNodes = "";
	$loopCount = 0;

	foreach ($nextNodes as $next) {
		if ($loopCount == 0) {
		    $searchNodes .= "'".mysql_escape_string($next)."'";
		} else {
		    $searchNodes .= ",'".mysql_escape_string($next)."'";
		}
		$loopCount++;
	}

	$message .= ":searchNodes=".$searchNodes;
	$message .= ":linkgroup=".$linkgroup;
	$message .= ":linklabels=".$linklabels;

	if ($searchNodes != "") {
		$qry = "SELECT t.* FROM Triple t INNER JOIN LinkType lt ON lt.LinkTypeID = t.LinkTypeID
						INNER JOIN LinkTypeGrouping ltgg ON ltgg.LinkTypeID = lt.LinkTypeID
            			INNER JOIN LinkTypeGroup ltg ON ltgg.LinkTypeGroupID = ltg.LinkTypeGroupID";

		$qry .= " WHERE ";

		// Add the node matching
		if ($labelmatch == 'true') {
			if ($direction == "outgoing") {
				$qry .= "t.FromLabel IN (".$searchNodes.")";
			} else if ($direction == "incoming") {
				$qry .= "t.ToLabel IN (".$searchNodes.")";
			} else if ($direction == "both") {
				$qry .= "(t.FromLabel IN (".$searchNodes.") OR t.ToLabel IN (".$searchNodes."))";
			}
		} else {
			if ($direction == "outgoing") {
				$qry .= "t.FromID IN (".$searchNodes.")";
			} else if ($direction == "incoming") {
				$qry .= "t.ToID IN (".$searchNodes.")";
			} else if ($direction == "both") {
				$qry .= "(t.FromID IN (".$searchNodes.") OR t.ToID IN (".$searchNodes."))";
			}
		}

		/** Add the link matching **/
		if ($linkgroup != "" && $linkgroup != "All") {
			$qry .= " AND ltg.Label='".$linkgroup."'";
		} else if ($linklabels != "") {
			$qry .= " AND lt.Label IN (".$linklabels.")";
		}

		/** Add the privacy / user permissions **/
		if ($scope == "my") {
			$qry .= " AND UserID='".$USER->userid."'";
		} else {
			$qry .= " AND ((t.Private = 'N')
				   OR
				   (t.UserID = '".$USER->userid."')
				   OR
				   (t.TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
								 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
								  WHERE ug.UserID = '".$USER->userid."')))
					AND FromID IN (SELECT t.NodeID FROM Node t
									WHERE ((t.Private = 'N')
									   OR
									   (t.UserID = '".$USER->userid."')
									   OR
									   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
												   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
													WHERE ug.UserID = '".$USER->userid."')))
									)
					AND ToID IN (SELECT t.NodeID FROM Node t
									WHERE ((t.Private = 'N')
									   OR
									   (t.UserID = '".$USER->userid."')
									   OR
									   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
												   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
													WHERE ug.UserID = '".$USER->userid."')))
			)";
		}

		$qry .= " order by t.CreationDate DESC";

		//$message .= ":".$qry;
		//return $message;

		$res = mysql_query( $qry, $DB->conn);
		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
				$allConnections[count($allConnections)] = $array;
			}
		} else {
			return database_error();
		}
	}

    $count = count($allConnections);
    $innercount = count($nextNodes);
	$found = false;

    for ($i=0; $i < $count; $i++) {
        $nextarray = $allConnections[$i];

		$message .= ":".$nextarray['TripleID'];

		if (!isset($checkConnections[(string)$nextarray['TripleID']]) || $checkConnections[(string)$nextarray['TripleID']] == "") {
			$checkConnections[(string)$nextarray['TripleID']] = $nextarray;

			$found = false;

			if ($labelmatch == 'true') {
				for($j=0; $j< $innercount; $j++) {
					$label = $nextNodes[$j];
					if ($direction == "outgoing") {
						if ($label == $nextarray['FromLabel']) {
							$found = true;
							$tempNodes[count($tempNodes)] = $nextarray['ToLabel'];
							break;
						}
					} else if ($direction == "incoming") {
						if ($label == $nextarray['ToLabel']) {
							$found = true;
							$tempNodes[count($tempNodes)] = $nextarray['FromLabel'];
							break;
						}
					} else if ($direction == "both") {
						if ($label == $nextarray['FromLabel'] || $label == $nextarray['ToLabel']) {
							$found = true;
							if ($label == $nextarray['FromLabel']) {
								$tempNodes[count($tempNodes)] = $nextarray['ToLabel'];
							}
							if ($label == $nextarray['ToLabel']) {
								$tempNodes[count($tempNodes)] = $nextarray['FromLabel'];
							}
							break;
						}
					}
				}
			}
			else {
				for($j=0; $j < $innercount; $j++) {
					$next = $nextNodes[$j];
					if ($direction == "outgoing") {
						if ($next == $nextarray['FromID']) {
							$found = true;
							$tempNodes[count($tempNodes)] = $nextarray['ToID'];
							break;
						}
					} else if ($direction == "incoming") {
						if ($next == $nextarray['ToID']) {
							$found = true;
							$tempNodes[count($tempNodes)] = $nextarray['FromID'];
							break;
						}
					} else if ($direction == "both") {
						if ($next == $nextarray['FromID'] || $next == $nextarray['ToID']) {
							$found = true;
							if ($next == $nextarray['FromID']) {
								$tempNodes[count($tempNodes)] = $nextarray['ToID'];
							}
							if ($next == $nextarray['ToID']) {
								$tempNodes[count($tempNodes)] = $nextarray['FromID'];
							}
							break;
						}
					}
				}
			}

			if ($found == true) {
				$message .= ":found".$nextarray['TripleID'];
				$matches[count($matches)] = $nextarray;
			}
		}
	}

    if (count($tempNodes) > 0) {
		$message .= ":".count($tempNodes);
        $matches = searchNetworkConnections($checkConnections, $matches, $tempNodes, $linklabels, $linkgroup, $labelmatch, $depth, $currentdepth, $direction, $scope);
    }


	//return $message;

    return $matches;
}

/**
 * Walk the network matching connection based on the passed criteria.
 * Starting from the given list of node labels/ids. (which always starts with 1, the focal node);
 */
function searchNetworkConnectionsByDepth($checkConnections, $matches, $nextNodes, $labelmatch='false', $depth, $currentdepth=0, $linklabels, $linkgroups, $directions, $nodetypes, $scope, &$message) {
    global $DB,$USER,$CFG;

	$message .= "currentdepth=".$currentdepth;

	$links = $linklabels[$currentdepth];
	$direction = $directions[$currentdepth];
	$linkgroup = $linkgroups[$currentdepth];
	$roles = $nodetypes[$currentdepth];

   	$currentdepth++;
	if ($currentdepth > $depth) {
		return $matches;
	}

	$searchLinkLabels = "";
	if ($links != "" && $linkgroup == "") {
		$pieces = explode(",", $links);
		$loopCount = 0;
		foreach ($pieces as $value) {
			if ($loopCount == 0) {
				$searchLinkLabels .= "'".mysql_escape_string($value)."'";
			} else {
				$searchLinkLabels .= ",'".mysql_escape_string($value)."'";
			}
			$loopCount++;
		}
	}

    $tempNodes = null;
	$allConnections = null;
	$searchNodes = "";
	$loopCount = 0;

	foreach ($nextNodes as $next) {
		if ($loopCount == 0) {
		    $searchNodes .= "'".mysql_escape_string($next)."'";
		} else {
		    $searchNodes .= ",'".mysql_escape_string($next)."'";
		}
		$loopCount++;
	}

	$message .= ":searchNodes=".$searchNodes;
	$message .= ":linkgroup=".$linkgroup;
	$message .= ":linklabels=".$links;
	$message .= ":roles=".$roles;

	if ($searchNodes != "") {
		$qry = "SELECT t.* FROM Triple t INNER JOIN LinkType lt ON lt.LinkTypeID = t.LinkTypeID
						INNER JOIN LinkTypeGrouping ltgg ON ltgg.LinkTypeID = lt.LinkTypeID
            			INNER JOIN LinkTypeGroup ltg ON ltgg.LinkTypeGroupID = ltg.LinkTypeGroupID";

		$qry .= " WHERE ";

		// Add Node Type Matching
		if ($roles != "") {
			$nodetypeids = getNodeTypeIDsForLabels($roles);
			$nodetypes[$currentdepth-1] = $nodetypeids;
			if ($nodetypeids != "") {
				if ($direction == "outgoing") {
					$qry .= "t.ToContextTypeID IN (".$nodetypeids.") AND ";
				} else if ($direction == "incoming") {
					$qry .= "t.FromContextTypeID IN (".$nodetypeids.") AND ";
				} else if ($direction == "both") {
					if ($currentdepth == 1) {
						if ($labelmatch == 'true') {
							$focalnodelabel = $nextNodes[0];
							$nodes =  getNodesByName($focalnodelabel,0,-1);
							$roleids = "";
							$loopCount == 0;
							foreach ($nodes as $node) {
								if ($loopCount == 0) {
									$roleids .= "'".mysql_escape_string($node->role->roleid)."'";
								} else {
									$roleids .= ",'".mysql_escape_string($node->role->roleid)."'";
								}
								$loopCount++;
							}

							$message .= ":previousroles=".$roleids;

							$qry .= "( ( (t.FromContextTypeID IN (".$nodetypeids.")) AND (t.ToContextTypeID IN (".$roleids.")) ) OR ( (t.ToContextTypeID IN (".$nodetypeids.")) AND (t.FromContextTypeID IN (".$roleids.")) ) ) AND ";
						} else {
							$focalnodeid = $nextNodes[0];
							$node = getNode($focalnodeid);
							$roleid = $node->role->roleid;
							$message .= ":previousrole=".$roleid;
							$qry .= "( ( (t.FromContextTypeID IN (".$nodetypeids.")) AND (t.ToContextTypeID IN ('".$roleid."')) ) OR ( (t.ToContextTypeID IN (".$nodetypeids.")) AND (t.FromContextTypeID IN ('".$roleid."')) ) ) AND ";
						}
					} else if ($currentdepth > 1) {
						$previousnodetypeids = $nodetypes[$currentdepth-2];
						$message .= ":previousnodetypeids=".$previousnodetypeids;
						if ($previousnodetypeids != "") {
							$qry .= "( ( (t.FromContextTypeID IN (".$nodetypeids.")) AND (t.ToContextTypeID IN (".$previousnodetypeids.")) ) OR ( (t.ToContextTypeID IN (".$nodetypeids.")) AND (t.FromContextTypeID IN (".$previousnodetypeids.")) ) ) AND ";
						}
					}
				}
			}
		}

		// Add the node matching
		if ($labelmatch == 'true') {
			if ($direction == "outgoing") {
				$qry .= "t.FromLabel IN (".$searchNodes.")";
			} else if ($direction == "incoming") {
				$qry .= "t.ToLabel IN (".$searchNodes.")";
			} else if ($direction == "both") {
				$qry .= "(t.FromLabel IN (".$searchNodes.") OR t.ToLabel IN (".$searchNodes."))";
			}
		} else {
			if ($direction == "outgoing") {
				$qry .= "t.FromID IN (".$searchNodes.")";
			} else if ($direction == "incoming") {
				$qry .= "t.ToID IN (".$searchNodes.")";
			} else if ($direction == "both") {
				$qry .= "(t.FromID IN (".$searchNodes.") OR t.ToID IN (".$searchNodes."))";
			}
		}

		/** Add the link matching **/
		if ($linkgroup != "" && $linkgroup != "All") {
			$qry .= " AND ltg.Label='".$linkgroup."'";
		} else if ($searchLinkLabels != "") {
			$qry .= " AND lt.Label IN (".$searchLinkLabels.")";
		}

		/** Add the privacy / user permissions **/
		if ($scope == "my") {
			$qry .= " AND UserID='".$USER->userid."'";
		} else {
			$qry .= " AND ((t.Private = 'N')
				   OR
				   (t.UserID = '".$USER->userid."')
				   OR
				   (t.TripleID IN (SELECT tg.TripleID FROM TripleGroup tg
								 INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
								  WHERE ug.UserID = '".$USER->userid."')))
					AND FromID IN (SELECT t.NodeID FROM Node t
									WHERE ((t.Private = 'N')
									   OR
									   (t.UserID = '".$USER->userid."')
									   OR
									   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
												   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
													WHERE ug.UserID = '".$USER->userid."')))
									)
					AND ToID IN (SELECT t.NodeID FROM Node t
									WHERE ((t.Private = 'N')
									   OR
									   (t.UserID = '".$USER->userid."')
									   OR
									   (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
												   INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
													WHERE ug.UserID = '".$USER->userid."')))
			)";
		}

		$qry .= " order by t.CreationDate DESC";

		$message .= ":".$qry;
		//return $message;

		$res = mysql_query( $qry, $DB->conn);
		if ($res) {
			while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
				$allConnections[count($allConnections)] = $array;
			}
		} else {
			return database_error();
		}
	}

    $count = count($allConnections);
    $innercount = count($nextNodes);
	$found = false;

	$message .= ":".$count;

    for ($i=0; $i < $count; $i++) {
        $nextarray = $allConnections[$i];

		$message .= ":".$nextarray['TripleID'];

		if (!$checkConnections[(string)$nextarray['TripleID']] || $checkConnections[(string)$nextarray['TripleID']] == "") {
			$checkConnections[(string)$nextarray['TripleID']] = $nextarray;

			$found = false;

			if ($labelmatch == 'true') {
				for($j=0; $j < $innercount; $j++) {
					$label = $nextNodes[$j];
					if ($direction == "outgoing") {
						if ($label == $nextarray['FromLabel']) {
							$found = true;
							$tempNodes[count($tempNodes)] = $nextarray['ToLabel'];
							break;
						}
					} else if ($direction == "incoming") {
						if ($label == $nextarray['ToLabel']) {
							$found = true;
							$tempNodes[count($tempNodes)] = $nextarray['FromLabel'];
							break;
						}
					} else if ($direction == "both") {
						if ($label == $nextarray['FromLabel'] || $label == $nextarray['ToLabel']) {
							$found = true;
							if ($label == $nextarray['FromLabel']) {
								$tempNodes[count($tempNodes)] = $nextarray['ToLabel'];
							}
							if ($label == $nextarray['ToLabel']) {
								$tempNodes[count($tempNodes)] = $nextarray['FromLabel'];
							}
							break;
						}
					}
				}
			}
			else {
				for($j=0; $j < $innercount; $j++) {
					$next = $nextNodes[$j];
					if ($direction == "outgoing") {
						if ($next == $nextarray['FromID']) {
							$found = true;
							$tempNodes[count($tempNodes)] = $nextarray['ToID'];
							break;
						}
					} else if ($direction == "incoming") {
						if ($next == $nextarray['ToID']) {
							$found = true;
							$tempNodes[count($tempNodes)] = $nextarray['FromID'];
							break;
						}
					} else if ($direction == "both") {
						if ($next == $nextarray['FromID'] || $next == $nextarray['ToID']) {
							$found = true;
							if ($next == $nextarray['FromID']) {
								$tempNodes[count($tempNodes)] = $nextarray['ToID'];
							}
							if ($next == $nextarray['ToID']) {
								$tempNodes[count($tempNodes)] = $nextarray['FromID'];
							}
							break;
						}
					}
				}
			}

			if ($found == true) {
				$message .= ":found".$nextarray['TripleID'];
				$matches[count($matches)] = $nextarray;
			}
		}
	}

	$message .= ":".count($tempNodes);

    if (count($tempNodes) > 0) {
		$matches = searchNetworkConnectionsByDepth($checkConnections, $matches, $tempNodes, $labelmatch, $depth, $currentdepth, $linklabels, $linkgroups, $directions, $nodetypes, $scope, $message);
    }

    return $matches;
}

/**
 * Get the nodeid for nodes with the same node label of the given nodeid
 *
 * @param string $nodeid
 * @return comma separated string of node ids or an empty string.
 */
function getAggregatedNodeIDs($nodeid){
    global $DB, $USER,$CFG;

    $sql = "SELECT t.NodeID from Node t WHERE t.Name IN (SELECT t2.Name from Node t2 WHERE t2.NodeID='".$nodeid."') ";
    $sql .=  " AND (
                (t.Private = 'N')
                 OR
                (t.UserID = '".$USER->userid."') ". // the current user
                " OR
                (t.NodeID IN (SELECT tg.NodeID FROM NodeGroup tg
                             INNER JOIN UserGroup ug ON ug.GroupID=tg.GroupID
                             WHERE ug.UserID = '".$USER->userid."')". // the current user
                "))";

    $list = "";
    $nodes = array();
    $res = mysql_query( $sql, $DB->conn);
    if ($res) {
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $nodeid = $array['NodeID'];
            if ($nodes[$nodeid] == null) {
                $list .= ",'".$nodeid."'";
                $nodes[$nodeid] = $nodeid;
            }
        }
        // remove first comma.
        $list = substr($list, 1);
    }

    return $list;
}

/**
 * Get all the LinkTypeIDs for the given link type group label
 *
 * @param string $grouplabel
 * @return comma separated string of link type ids or an empty string.
 */
function getLinkTypeIDsForGroup($grouplabel){
    global $DB, $USER,$CFG;

    $sql = "SELECT t.LinkTypeID from LinkTypeGrouping t WHERE t.LinkTypeGroupID IN (SELECT t2.LinkTypeGroupID from LinkTypeGroup t2 WHERE t2.Label='".$grouplabel."') ";

    $list = "";
    $ids = array();
    $res = mysql_query( $sql, $DB->conn);
    if ($res) {
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $id = $array['LinkTypeID'];
            if ($ids[$id] == null) {
                $list .= ",'".$id."'";
                $ids[$id] = $id;
            }
        }
        // remove first comma.
        $list = substr($list, 1);
    }

    return $list;
}

/**
 * Get all the LinkTypeIDs for the given link type label list (comma separated)
 *
 * @param string $linklabels
 * @return comma separated string of link type ids or an empty string.
 */
function getLinkTypeIDsForLabels($linklabels) {
    global $DB, $USER,$CFG;

    $searchLabel = "";
    $pieces = explode(",", $linklabels);
    $loopCount = 0;
    foreach ($pieces as $value) {
        if ($loopCount == 0) {
            $searchLabel .= "'".mysql_escape_string($value)."'";
        } else {
            $searchLabel .= ",'".mysql_escape_string($value)."'";
        }
        $loopCount++;
    }

    $sql = "SELECT t.LinkTypeID from LinkType t WHERE t.Label IN (".$searchLabel.") ";
    $list = "";
    $ids = array();
    $res = mysql_query( $sql, $DB->conn);
    if ($res) {
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $id = $array['LinkTypeID'];
            if ($ids[$id] == null) {
                $list .= ",'".$id."'";
                $ids[$id] = $id;
            }
        }
        // remove first comma.
        $list = substr($list, 1);
    }

    return $list;
}

/**
 * Get all the NodeTypeIDs for the given node type names list (comma separated)
 *
 * @param string $nodetypenames
 * @return comma separated string of node type ids or an empty string.
 */
function getNodeTypeIDsForLabels($nodetypenames) {
    global $DB, $USER,$CFG;

    $searchNames = "";
    $pieces = explode(",", $nodetypenames);
    $loopCount = 0;
    foreach ($pieces as $value) {
        if ($loopCount == 0) {
        	$searchNames .= "'".mysql_escape_string($value)."'";
        } else {
        	$searchNames .= ",'".mysql_escape_string($value)."'";
        }
        $loopCount++;
    }

    $sql = "SELECT t.NodeTypeID from NodeType t WHERE t.Name IN (".$searchNames.") ";
    $list = "";
    $res = mysql_query( $sql, $DB->conn);
    if ($res) {
        while ($array = mysql_fetch_array($res, MYSQL_ASSOC)) {
            $id = $array['NodeTypeID'];
            if ($list == "") {
                $list .= "'".$id."'";
            } else {
                $list .= ",'".$id."'";
            }
        }
    }

    return $list;
}

/**
 * Send a tweet to the Cohere tweet account for the given message and the given Cohere url.
 * @param $message the message to sent to twitter
 * @param $username the name of the person to append to tweet as 'by XX'. Can by "" if not required
 * @param $url the Cohere url to add to the message (will be shortened with Bit.ly)
 * @param $twitterkey the twitter account key of the account to sent the tweet to.
 * @param $twittersecret the twitter secret for that account.
 * @param $hashtag any hashtag to append to the message (optional parameter);
 * @return Result or Error
 */
function tweet($message, $username, $url, $twitterkey, $twittersecret, $hashtag) {
	global  $CFG;

	require_once("jmathai-twitter-async-12fa620/EpiCurl.php");
	require_once("jmathai-twitter-async-12fa620/EpiOAuth.php");
	require_once("jmathai-twitter-async-12fa620/EpiTwitter.php");

	try{
		$twitterObj = new EpiTwitter($CGF->TWITTER_CONSUMER_KEY, $CFG->TWITTER_CONSUMER_SECRET, $twitterkey, $twittersecret);

		$shortURL = getBitlyUrl($url);

		if (!$shortURL) {
			$shortURL = $url;
		}

		$tweet = $message;

		$len = 126; // 140 minus known required text and spaces
		if ($hashtag) {
			$len = 125-strlen($hashtag); // 125 = 1 space before hastag;
		}

		$byname = ": by ".$username;
		$labelen = $len-strlen($shortURL)-strlen($username);
		if ($username == "") {
			$labelen = $len-strlen($shortURL)+5;
			$byname = "";
		}

		if (strlen($tweet) > $labelen) {
			$tweet = substr($tweet, 0, $labelen)."...";
		}

		$tweetMessage = $tweet.$byname." more:".$shortURL;
		if ($hashtag) {
			$tweetMessage = $tweetMessage." ".$hashtag;
		}

		// does not work
		//$response = $twitterObj->post_statusesUpdate(array('status' => $tweetMessage));

		$response = $twitterObj->post('/statuses/update.xml', array('status' => $tweetMessage));

		$xml = simplexml_load_string($response->data);

		if ($xml->error != null) {
			return tweet_error((string)$xml->error);
		} else {
			return new Result("tweet sent", true);
		}

	} catch(Exception $e){
		return tweet_error($e->getMessage());
	}
}

/**
 * Return a short Bit.ly url for the given url
 * @param $url the url to shorten.
 * @return shortened url or false;
 */
function  getBitlyUrl($url) {
	global $CFG;

	if ($CFG->BITLY_LOGIN != "" && $CFG->BITLY_KEY != "") {

		$bitly = 'http://api.bit.ly/shorten?version=2.0.1&longUrl='.urlencode($url).'&login='.$CFG->BITLY_LOGIN.'&apiKey='.$CFG->BITLY_KEY.'&format=xml';
		$http = array('method'  => 'GET',
				'request_fulluri' => true,
				'timeout' => '2');
		if($CFG->PROXY_HOST != ""){
			$http['proxy'] = $CFG->PROXY_HOST . ":".$CFG->PROXY_PORT;
		}
		$opts = array();
		$opts['http'] = $http;
		$context  = stream_context_create($opts);

		$response = file_get_contents($bitly, false, $context);
		$xml = simplexml_load_string($response);

		if ($xml->results->errorCode == 0) {
			return 'http://bit.ly/'.$xml->results->nodeKeyVal->hash;
		} else {
			false;
		}
	} else {
		return false;
	}
}


/**
* Get the tag names and their use counts for tag cloud.
* @param limit the number of results to return (ordered by use count DESC)
*
* @return array of arrays of 'Name' and 'UseCount' fields.
*/
function getTagsForCloud($limit){
	global $DB;

	$sql = "(SELECT alltags.Name, count(alltags.Name) as UseCount FROM (
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagNode tn ON t.TagID = tn.TagID right join Node on tn.NodeID = Node.NodeID where Node.Private = 'N')
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagTriple tt ON t.TagID = tt.TagID right join Triple on tt.TripleID = Triple.TripleID where Triple.Private = 'N' )
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagUsers tu ON t.TagID = tu.TagID)
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagURL tl ON t.TagID = tl.TagID right join URL on tl.URLID = URL.URLID where URL.Private = 'N')) as alltags
	group by alltags.Name order by UseCount DESC";

	if ($limit > 0) {
		$sql .= " LIMIT ".$limit;
	}

    $sql .=  ") order by Name";

    $res = mysql_query( $sql, $DB->conn);
	$array = array();
    if ($res) {
    	while($next = mysql_fetch_array($res, MYSQL_ASSOC)) {
    		array_push($array, $next);
    	}
    }
	return $array;
}


/**
* Get the tag names and their use counts for the user tag cloud.
* @param limit the number of results to return (ordered by use count DESC)
*
* @return array of arrays of 'Name' and 'UseCount' fields.
*/
function getUserTagsForCloud($limit){
	global $DB, $USER;

	$sql = "(SELECT alltags.Name, count(alltags.Name) as UseCount FROM (
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagNode tn ON t.TagID = tn.TagID Where tn.UserID = '".$USER->userid."')
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagTriple tt ON t.TagID = tt.TagID Where tt.UserID = '".$USER->userid."')
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagUsers tu ON t.TagID = tu.TagID Where tu.UserID = '".$USER->userid."')
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagURL tl ON t.TagID = tl.TagID Where tl.UserID = '".$USER->userid."')) as alltags
	group by alltags.Name order by UseCount DESC";

	if ($limit > 0) {
		$sql .= " LIMIT ".$limit;
	}

    $sql .=  ") order by Name";

    $res = mysql_query( $sql, $DB->conn);
	$array = array();
    if ($res) {
    	while($next = mysql_fetch_array($res, MYSQL_ASSOC)) {
    		array_push($array, $next);
    	}
    }
	return $array;
}

/**
* Get the tag names and their use counts for the given group's tag cloud.
* @param GroupID the id of the group to get the tag cloud for.
* @param limit the number of results to return (ordered by use count DESC)
*
* @return array of arrays of 'Name' and 'UseCount' fields.
*/
function getGroupTagsForCloud($GroupID, $limit, $orderby="Name", $dir="ASC"){
	global $DB, $USER;

	$sql = "(SELECT alltags.Name, count(alltags.Name) as UseCount FROM (
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagNode tn ON t.TagID = tn.TagID RIGHT JOIN Node ON tn.NodeID = Node.NodeID
	WHERE tn.UserID IN (Select UserID from UserGroup where GroupID='".$GroupID."') AND Node.NodeID IN (Select NodeID FROM NodeGroup WHERE GroupID='".$GroupID."'))
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagTriple tt ON t.TagID = tt.TagID  RIGHT JOIN Triple ON tt.TripleID = Triple.TripleID
	WHERE tt.UserID IN (Select UserID from UserGroup where GroupID='".$GroupID."') AND Triple.TripleID IN (Select TripleID FROM TripleGroup WHERE GroupID='".$GroupID."'))
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagUsers tu ON t.TagID = tu.TagID
	WHERE tu.UserID IN (Select UserID from UserGroup where GroupID='".$GroupID."'))
	UNION ALL
	(SELECT t.Name as Name From Tag t RIGHT JOIN TagURL tl ON t.TagID = tl.TagID RIGHT JOIN URL ON tl.URLID = URL.URLID
	WHERE tl.UserID IN (Select UserID from UserGroup where GroupID='".$GroupID."') AND URL.URLID IN (Select URLID FROM URLGroup WHERE GroupID='".$GroupID."'))) as alltags
	group by alltags.Name order by UseCount DESC";

	if ($limit > 0) {
		$sql .= " LIMIT ".$limit;
	}

    $sql .=  ") order by  ".$orderby." ".$dir;

    $res = mysql_query( $sql, $DB->conn);
	$array = array();
    if ($res) {
    	while($next = mysql_fetch_array($res, MYSQL_ASSOC)) {
    		array_push($array, $next);
    	}
    }
	return $array;
}

/**
 * Get all the saved HGR forms for the current user
 *
 * @return SearchSet or Error
 */
function getUserHGRForms($orderby="CreationDate", $dir="ASC") {
    global $CFG,$USER;

    $sql = "SELECT FormID FROM HGRForm WHERE UserID = '".$USER->userid."' ORDER BY ".$orderby." ".$dir;
    $ss = new HGRFormSet();
    return $ss->load($sql);
}


/**
 * Get all the saved HGR forms
 *
 * @return SearchSet or Error
 */
function getAllHGRForms($orderby="UserID", $dir="ASC") {
    global $CFG,$USER;

    $sql = "SELECT FormID FROM HGRForm ORDER BY ".$orderby." ".$dir;
    $ss = new HGRFormSet();
    return $ss->load($sql);
}

/**
 * On versions of PHP older than PHP 5 we need to define this function
 * that returns the JSON representation of a value
 */
if (!function_exists('json_encode')) {
  function json_encode($a=false) {
	if (is_null($a)) return 'null';
	if ($a === false) return 'false';
	if ($a === true) return 'true';
	if (is_scalar($a))
	{
	  if (is_float($a))
	  {
		// Always use "." for floats.
		return floatval(str_replace(",", ".", strval($a)));
	  }

	  if (is_string($a))
	  {
		static $jsonReplaces = array(array("\\", "/", "\n", "\t", "\r", "\b", "\f", '"'), array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'));
		return '"' . str_replace($jsonReplaces[0], $jsonReplaces[1], $a) . '"';
	  }
	  else
		return $a;
	}
	$isList = true;
	for ($i = 0, reset($a); $i < count($a); $i++, next($a))
	{
	  if (key($a) !== $i)
	  {
		$isList = false;
		break;
	  }
	}
	$result = array();
	if ($isList)
	{
	  foreach ($a as $v) $result[] = json_encode($v);
	  return '[' . join(',', $result) . ']';
	}
	else
	{
	  foreach ($a as $k => $v) $result[] = json_encode($k).':'.json_encode($v);
	  return '{' . join(',', $result) . '}';
	}
  }
}

/**
 * Validate urls stating with http, https, ftp.
 */
//function isValidURL($url) {
//	return preg_match("/^(http(s?):\\/\\/|ftp:\\/\\/{1})((\w+\.)+)\w{2,}(\/?)$/i", $url);

/*	$regexp = "^((http://)|(https://)){0}(([a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]{2})|[;&
=+$,])+(:([a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]{2})|[;:&=+$,])+){0}@){0}(
(((((2(([0-4][0-9])|(5[0-5])))|([01]?[0-9]?[0-9]))\.){3}((2(([0-4][0-9
])|(5[0-5])))|([01]?[0-9]?[0-9]))))|(([a-zA-Z0-9](([a-zA-Z0-9-]{0,62})
[a-zA-Z0-9])?\.)*([a-zA-Z0-9](([a-zA-Z0-9-]{0,62})[a-zA-Z0-9])?\.)(aer
o|biz|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|post
|pro|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|az|ax|ba|b
b|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch
|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|
er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|g
r|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm
|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|
ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|n
c|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt
|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|
sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|u
m|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw))){0}(:(([0-5]
?[0-9]{1,4})|(6[0-4][0-9]{3})|(65[0-4][0-9]{2})|(655[0-2][0-9])|(6553[
0-5]))){0}(/((;)?([a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]{2})|[:@&=+$,])+(/
)?)*)(\?([;/?:@&=+$,]|[a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]{2}))*)?(#([;/
?:@&=+$,]|[a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]{2}))*)?$";

//url.php version
$regexp2 = ^((http://)|(https://)|(mailto:)|(ftp://))?(([a-zA-Z0-9_.!~*'()-]|(%[0
-9a-fA-F]{2})|[;&=+$,])+(:([a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]{2})|[;:&
=+$,])+){0}@){0}((((((2(([0-4][0-9])|(5[0-5])))|([01]?[0-9]?[0-9]))\.)
{3}((2(([0-4][0-9])|(5[0-5])))|([01]?[0-9]?[0-9]))))|(([a-zA-Z0-9](([a
-zA-Z0-9-]{0,62})[a-zA-Z0-9])?\.)*([a-zA-Z0-9](([a-zA-Z0-9-]{0,62})[a-
zA-Z0-9])?\.)(aero|biz|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|
name|net|org|post|pro|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at
|au|aw|az|ax|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|
ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|d
o|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi
|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|
iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|l
k|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv
|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|
pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|s
l|sm|sn|so|sr|st|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv
|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|
zw)))?(:(([0-5]?[0-9]{1,4})|(6[0-4][0-9]{3})|(65[0-4][0-9]{2})|(655[0-
2][0-9])|(6553[0-5])))?(/((;)?([a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]{2})|
[:@&=+$,])+(/)?)*)?(\?([;/?:@&=+$,]|[a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]
{2}))*)?(#([;/?:@&=+$,]|[a-zA-Z0-9_.!~*'()-]|(%[0-9a-fA-F]{2}))*)?$;


    if (eregi( $regexp, $url )) {
        return true;
    } else {
        return false;
    }
*/
//}


?>