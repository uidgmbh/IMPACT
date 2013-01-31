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
/**
 * The help class contains help strings
 * @constructor
 **/

var HelpText = {

  
/**
 * Give the help text associated with the given string identifier. Returns 
 * string "help text not found" if the text does not exist
 * @param string id
 * @since 7 August 2012
 **/
  giveText: function(id){
    var helpTexts = {
      "documentManagement": "Documents are (natural langugage) texts that contain arguments. This tool allows one to reconstruct arguments from these documents. Choose a (version of a) document in the left column to display it on the right side of the tool. It will remain there until another document is selected, also when one clicks on the tab 'Annotate'. This way the document can be annotated.",
      "discussionManagement": "An issue consists of a number of (unordered) arguments. Each issue has a title and an introduction text ('intro' in short). In the case of argument reconstruction of green paper reactions, the title is likely to be a green paper question. The issue then contains arguments that are taken from stakeholder reactions to this question.",
      "Arguments" : "This is the list of arguments that belong to this issue. Elements are displayed with their type (that is: an argument scheme) and a number that is solely meant to keep them apart. For more information on specific argumentation schemes, click on an argument or make a new one.",
      "EditRelationcredible_source_as":"The argument from credible source scheme is build up of three elements: a domain, a proposition and a source. The scheme works as follows: there is a source (e.g.: Isaac Newton) that states that a proposition holds (e.g. 'Gravity pulls things downwards'). We say that when the source is an expert in the domain (e.g. 'physics') and the proposition falls within that domain, we can conclude that the statement must be true.\n\nArguments with this argument scheme can be processed by Structured Consultation tool, not by the Argument Visualisation tool.",

      "EditRelationpractical_reasoning_as":"The practical reasoning argument scheme has the following elements:\nAction: a future action that might be performed\nAgent: the agent (person, organization, etc.) that performs the action.\nCircumstances: the circumstances that are the case at this moment (before the action is being performed)\nConsequences: The consequences of the action (i.e. the things that will change when the action is performed)\nValues: The values that are being supported when the action is performed.\n\nThe conclusion of this argument scheme is that the action should actually be performed by the agent.\n\nArguments with this argument scheme can be processed by both the Argument Visualisation and the Structured Consultation tool.",

      "EditRelationvalue_recognition_as":"This is the value recognition argument scheme, consisting of a source and a value.\n\nArguments with this argument scheme can be processed by Structured Consultation tool, not by the Argument Visualisation tool.\n\nThe Value Recognition Scheme is a digression about values from the main Practical Reasoning Scheme. It is triggered in the Structured Consultation Tool when the user choses the radio button that the value is not worthwhile. She must indicate what she finds faulty in the justification that the value is worthwhile given an authority that endorses the value.  The user of the SCT must indicate that either she does not accept the authority or that she does not accept that the authority endorsed the value.",

      "EditRelationvalue_credible_source_as":"This is the value credible source argument scheme, consisting of a source and a value.\n\nArguments with this argument scheme can be processed by Structured Consultation tool, not by the Argument Visualisation tool.\n\nThe Value Credible Source Scheme is a digression about values from the main Practical Reasoning Scheme.  It is similar to the Credible Source Scheme, but relates to values rather than a circumstance or consequence.  The digression is triggered in the Structured Consultation Tool when the user picks among selected radio buttons (e.g. 'promotes', 'demotes', 'is neutral about') different from the given default answer (again selected from amongst 'promotes', 'demotes', 'is neutral about').  The scheme asks the user of the SCT to indicate what she finds faulty in the justification for the default.",

      "EditRelationgeneral_as":"This argument scheme is the most basic one. It consists simply of a number of premises, and one conclusion that is true when the premises are true. Note that this argument scheme is not supported by the SCT, nor can it (in this prototype) be converted into another argument scheme. \n\nThis scheme is not supported in any other scheme of the toolbox.",

      "Annotation" : "Note: when you click the 'save' button at the bottom, the screen will flash, and a message in red letters will appear at the top of the screen, indicating that the argument is saved.\n\nAn annotation can be made in three ways:\n\n1. free text input without a link to a source document. This can be done by simply typing text, or\n\n2. by selecting a piece of text from the document displayed on the right, and clicking the 'paste' button right below the text field you want to annotate, or finally\n\n3. By choosing an element that is already part of another argument. Click 'choose existing', then choose an element from the drop-down menu. When you click OK, the element is displayed as any other, and clicking 'Save' actually links the element to the argument.\n\nThe text behind the word 'Quote' indicates that the text is quoted from a document. This text can not be altered. You can either quote another piece of text by doing so as described above, or when you want to break the link between the annotation and the text, click the 'unlink' button. This will erase these fields. The quote will be saved (until being unlinked), even when you change the text in the text field. This way you have the flexibility to write whatever is practical for further use in for example one of the other tools, without losing the connection to the original, literal source.",
        "ChooseExisting" : "With this interface, you can add an existing item, that is already being used by another argument scheme. Choose an item from the drop down-menu and click OK. Beware: If you don't click OK, the chosen argument scheme (if any) will NOT be added, and the old version of the element will be saved when clicking the 'Save' button at the bottom, exactly as if the 'Cancel' button would have been pressed."
    }

    if(helpTexts[id]){
      return helpTexts[id];
    } else {
      return "Something went wrong, the help text could not be found...";
    }
  }
}

