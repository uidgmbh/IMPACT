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

class format_xml extends format_base {
    
    //default to XML
    function get_header(){
        return "Content-Type: text/xml";   
    }
   
    
    /**
     * Format the output to XML
     * 
     * @param Object $object - the data to format
     * @return string
     */
   function format($object){
        global $ERROR,$CFG;
        $doc = "<?xml version=\"1.0\"?>";
        
        if(!$object){
            $ERROR = new error;
            $ERROR->message = "Error in service.";
            $ERROR->code = "9999";
            include($CFG->dirAddress."api/apierror.php");
            die; 
        }
        
        $doc .= "<".strtolower(get_class($object)).">";
        
        $attr = get_object_vars($object);
        if(is_array($attr)){
            $keys = array_keys($attr);
            for($i=0;$i< sizeof($keys); $i++){
                $attr2 = get_object_vars($attr[$keys[$i]]);
                if(is_array($attr2) || is_array($attr[$keys[$i]])){                
                    $doc .= $this->formatInnerXML($keys[$i],$attr[$keys[$i]]);
                } else {
                    $doc .= "<".$keys[$i].">".parseToXML($attr[$keys[$i]])."</".$keys[$i].">";
                }
            }
        } 
        $doc .= "</".strtolower(get_class($object)).">";
        return $doc;
    }
    
    /**
     * Helper function for formatting the output to XML
     * 
     * @param string $node name of the node
     * @param Object $object data to format
     * @return string
     */
    function formatInnerXML($node,$objects){
        $doc = "<".strtolower($node).">";
        if (is_array($objects)){
            foreach($objects as $object){
                $attr = get_object_vars($object);
                if(is_array($attr)){
                    $doc .= "<".strtolower(get_class($object)).">";
                    $keys = array_keys($attr);
                    for($i=0;$i< sizeof($keys); $i++){
                        $attr2 = get_object_vars($attr[$keys[$i]]);
                        if(is_array($attr2) || is_array($attr[$keys[$i]])){
                            $doc .= $this->formatInnerXML($keys[$i],$attr[$keys[$i]]);
                        } else {
                            $doc .= "<".$keys[$i].">".parseToXML($attr[$keys[$i]])."</".$keys[$i].">";
                        }
                    }
                    $doc .= "</".strtolower(get_class($object)).">";
                }
            }
        } else {
            $attr = get_object_vars($objects);
            if(is_array($attr)){
                $doc .= "<".strtolower(get_class($objects)).">";
                $keys = array_keys($attr);
                for($i=0;$i< sizeof($keys); $i++){
                    $attr2 = get_object_vars($attr[$keys[$i]]);
                    if(is_array($attr2) || is_array($attr[$keys[$i]])){
                        $doc .= $this->formatInnerXML($keys[$i],$attr[$keys[$i]]);
                    } else {
                        $doc .= "<".$keys[$i].">".parseToXML($attr[$keys[$i]])."</".$keys[$i].">";
                    }
                }
                $doc .= "</".strtolower(get_class($objects)).">";
            }
            
        }
        $doc .= "</".strtolower($node).">";
        return $doc;
    }
   
}
?>