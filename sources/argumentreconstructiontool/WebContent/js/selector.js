/* ----------------------------------------------------------------------------
 * Copyright (c) 2012 Leibniz Center for Law, University of Amsterdam, the 
 * Netherlands
 *
 * This program and the accompanying materials are licensed and made available
 * under the terms and conditions of the European Union Public Licence (EUPL 
 * v.1.1).
 *
 * You should have received a copy of the  European Union Public Licence (EUPL 
 * v.1.1) along with this program as the file license.txt; if not, please see
 * http://joinup.ec.europa.eu/software/page/eupl/licence-eupl.
 *
 * This software is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 * ----------------------------------------------------------------------------
 * Project:      IMPACT
 * Created:      2011-2012
 * Last Change:  14.12.2012 (final release date)
 * ----------------------------------------------------------------------------
 * Created by the Leibniz Center for Law, University of Amsterdam, The 
 * Netherlands, 2012
 * Authors: Jochem Douw (http://jochemdouw.nl), Sander Latour
 * ----------------------------------------------------------------------------
 */
if(typeof(ART) == "undefined"){
	ART = {};
}
/** Function that extracts information about the selection, whenever the mouse is lifted. This is an adapted version of the original found on <a href='http://mark.koli.ch/2009/09/use-javascript-and-jquery-to-get-user-selected-text.html'>mark.koli.ch</a>, where it was released under the MIT license.
*/
ART.initSelector = function(){
	$(function(){
		Selector = {};
		Selector.getSelected = function(){
			var t = '';
			if(window.getSelection){
				t = window.getSelection();
			}else if(document.getSelection){
				t = document.getSelection();
			}else if(document.selection){
				t = document.selection.createRange().text;
			}
			return t;
		}
		
		/** 
			Returns an array containing:
			[0] The starting node of the selection
			[1] The starting position of the selection
			[2] The ending node of the selection
			[3] The ending position of the selection
			Inspired by:
			<a href='http://www.quirksmode.org/dom/range_intro.html'>http://www.quirksmode.org/dom/range_intro.html</a>
			@since 12 March 2012
		*/
		Selector.getRange = function(){
			selectionObject = this.getSelected();
			var result = new Array();
			result[result.length] = selectionObject.anchorNode;
			result[result.length] = selectionObject.anchorOffset;
			result[result.length] = selectionObject.focusNode;
			result[result.length] = selectionObject.focusOffset;
			return result;
		}
		
/*	//This function is for testing purposes.
		Selector.mouseup = function(){
			var st = Selector.getSelected();
	//		if(st!=''){
				$("#selected").text("You selected:\n"+st+" which starts at "+st.anchorOffset+" and ends at "+st.focusOffset+". These are "+st.isCollapsed+".");
	//		}
		}
		$(document).bind("mouseup", Selector.mouseup);*/
	});
};

