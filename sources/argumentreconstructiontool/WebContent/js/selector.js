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

