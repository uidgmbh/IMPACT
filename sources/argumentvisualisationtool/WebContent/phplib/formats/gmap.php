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

 class format_gmap extends format_base {

     //default to plain text
     function get_header(){
         return "Content-Type: text/plain";
     }

     function allowed_methods(){
        return array('getnodesbydate',
                     'getnodesbyfirstcharacters',
                     'getnodesbygroup',
                     'getnodesbyname',
                     'getnodesbynode',
                     'getnodesbysearch',
                     'getnodesbytagsearch',
                     'getnodesbyurl',
                     'getnodesbyuser',
                     'getrecentnodes',
                     'getpopularnodes',
                     'getconnectednodes',
                     'getunconnectednodes',
                     'getusersbyuser',
                     'getusersbynode',
                     'getusersbysearch',
                     'getusersbytagsearch',
                     'getusersbygroup',
                     'getusersbyurl',
                    );
     }

     /**
      * Format the nodeset / userset output as locations
      * This is just for Google Maps view
      *
      * @param Object $object - the data to format
      * @return string
      */
     function format($object){
         global $CFG;

         if(!($object instanceof NodeSet) && !($object instanceof UserSet)){
             $doc = '{"error":[{"message":"'.$object->message.'","code":"'.$object->code.'"}]}';
             return $doc;
         }

         $locs = array();

         $doc = '{"locations":[';

         if ($object instanceof NodeSet) {
 	        $nodes = $object->nodes;
 	        foreach ($nodes as $node){
 	            // can only display if the node if it has a long and lat
 	            if ($node->locationlat && $node->locationlng){
 	                $tmp = '{"desc":"'.parseToJSON($node->description).'", "city":"'.$node->location.'","lat":"'. $node->locationlat.'","lng":"'.$node->locationlng.'","title":"'.parseToJSON($node->name).'","id":"'.$node->nodeid.'"}';
 	                array_push($locs,$tmp);
 	            }
 	        }
         } else if ($object instanceof UserSet) {
 	        $users = $object->users;
 			$i=0;
 	        foreach ($users as $user){
 	            // can only display if the user has if it has a long and lat
 	            if ($user->locationlat && $user->locationlng){
 	                $tmp = '{"city":"'.$user->location.'","lat":"'. $user->locationlat.'","lng":"'.$user->locationlng.'","title":"'.parseToJSON($user->name).'","id":"'.$user->userid.'","thumb":"'.parseToJSON($user->thumb).'", "desc":"'.parseToJSON($user->description).'"}';
 	                array_push($locs,$tmp);
 	            }

 	            $i++;
 	        }
         }

         $doc .= implode(",",$locs);
         $doc .= "]}";

         return $doc;
     }
 }
 ?>
