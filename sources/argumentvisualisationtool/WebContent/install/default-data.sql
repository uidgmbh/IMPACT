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
-- default user - 
-- NOTE: you will want to create your own password for this system user and change the email address.
INSERT INTO Users 
(UserID, CreationDate, ModificationDate, Email, Name, Description, Password, LastLogin, IsAdministrator, CurrentStatus, Website, Photo, Private, AuthType, OpenIDURL) 
VALUES 
('defaultuser', 0, 0, 'kmi-systems@open.ac.uk', 'Default', NULL, '4stmrH6AKE27g', 0, 'N', 0, NULL, NULL, 'N', 'cohere', NULL);

-- defaultuser nodetypegroup
INSERT INTO NodeTypeGroup 
(NodeTypeGroupID, UserID, Name, CreationDate) 
VALUES 
('defaultrolegroup', 'defaultuser', 'Default Roles', 0);


-- defaultuser nodetype
INSERT INTO NodeType 
(NodeTypeID, UserID, Name, CreationDate) 
VALUES 
('presetrole01', 'defaultuser', 'Idea', 0),
('presetrole02', 'defaultuser', 'Assumption', 0),
('presetrole03', 'defaultuser', 'Data', 0),
('presetrole04', 'defaultuser', 'Framework', 0),
('presetrole05', 'defaultuser', 'Ideology', 0),
('presetrole06', 'defaultuser', 'Method', 0),
('presetrole07', 'defaultuser', 'Natural Phenomenon', 0),
('presetrole08', 'defaultuser', 'Opinion', 0),
('presetrole09', 'defaultuser', 'Prediction', 0),
('presetrole10', 'defaultuser', 'Problem', 0),
('presetrole11', 'defaultuser', 'Software', 0),
('presetrole12', 'defaultuser', 'Solution', 0),
('presetrole13', 'defaultuser', 'Theory', 0),
('presetrole14', 'defaultuser', 'Scenario', 0),
('presetrole15', 'defaultuser', 'Question', 0),
('presetrole16', 'defaultuser', 'Answer', 0),
('presetrole17', 'defaultuser', 'Pro', 0),
('presetrole18', 'defaultuser', 'Con', 0);


-- defaultuser nodetypegrouping

INSERT INTO NodeTypeGrouping 
(NodeTypeGroupID, NodeTypeID, UserID, CreationDate) 
VALUES 
('defaultrolegroup', 'presetrole01', 'defaultuser', 0),
('defaultrolegroup', 'presetrole02', 'defaultuser', 0),
('defaultrolegroup', 'presetrole03', 'defaultuser', 0),
('defaultrolegroup', 'presetrole04', 'defaultuser', 0),
('defaultrolegroup', 'presetrole05', 'defaultuser', 0),
('defaultrolegroup', 'presetrole06', 'defaultuser', 0),
('defaultrolegroup', 'presetrole07', 'defaultuser', 0),
('defaultrolegroup', 'presetrole08', 'defaultuser', 0),
('defaultrolegroup', 'presetrole09', 'defaultuser', 0),
('defaultrolegroup', 'presetrole10', 'defaultuser', 0),
('defaultrolegroup', 'presetrole11', 'defaultuser', 0),
('defaultrolegroup', 'presetrole12', 'defaultuser', 0),
('defaultrolegroup', 'presetrole13', 'defaultuser', 0),
('defaultrolegroup', 'presetrole14', 'defaultuser', 0),
('defaultrolegroup', 'presetrole15', 'defaultuser', 0),
('defaultrolegroup', 'presetrole16', 'defaultuser', 0),
('defaultrolegroup', 'presetrole17', 'defaultuser', 0),
('defaultrolegroup', 'presetrole18', 'defaultuser', 0);


-- defaultuser linktype
INSERT INTO LinkType 
(LinkTypeID, UserID, Color, ToContextTypeID, FromContextTypeID, Label, CreationDate) 
VALUES 
('presetlinktype01', 'defaultuser', '#000000', NULL, NULL, 'solves the problem', 0),
('presetlinktype02', 'defaultuser', '#000000', NULL, NULL, 'is analogous to', 0),
('presetlinktype03', 'defaultuser', '#000000', NULL, NULL, 'predicts', 0),
('presetlinktype04', 'defaultuser', '#000000', NULL, NULL, 'is inconsistent with', 0),
('presetlinktype05', 'defaultuser', '#000000', NULL, NULL, 'has counterexample', 0),
('presetlinktype06', 'defaultuser', '#000000', NULL, NULL, 'refutes', 0),
('presetlinktype07', 'defaultuser', '#000000', NULL, NULL, 'supports', 0),
('presetlinktype08', 'defaultuser', '#000000', NULL, NULL, 'has sub-problem', 0),
('presetlinktype09', 'defaultuser', '#000000', NULL, NULL, 'uses/applies', 0),
('presetlinktype10', 'defaultuser', '#000000', NULL, NULL, 'causes', 0),
('presetlinktype11', 'defaultuser', '#000000', NULL, NULL, 'is a metaphor for', 0),
('presetlinktype12', 'defaultuser', '#000000', NULL, NULL, 'reminds me of', 0),
('presetlinktype13', 'defaultuser', '#000000', NULL, NULL, 'is similar in spirit to', 0),
('presetlinktype19', 'defaultuser', '#000000', NULL, NULL, 'responds to', 0),
('presetlinktype18', 'defaultuser', '#000000', NULL, NULL, 'challenges', 0),
('presetlinktype17', 'defaultuser', '#000000', NULL, NULL, 'is part of', 0),
('presetlinktype16', 'defaultuser', '#000000', NULL, NULL, '+', 0),
('presetlinktype15', 'defaultuser', '#000000', NULL, NULL, '-', 0),
('presetlinktype20', 'defaultuser', '#000000', NULL, NULL, 'is consistent with', 0),
('presetlinktype21', 'defaultuser', '#000000', NULL, NULL, 'is an example of', 0),
('presetlinktype22', 'defaultuser', '#000000', NULL, NULL, 'proves', 0),
('presetlinktype23', 'defaultuser', '#000000', NULL, NULL, 'improves on', 0),
('presetlinktype24', 'defaultuser', '#000000', NULL, NULL, 'addresses the problem', 0);


-- defaultuser linktypegroup
INSERT INTO LinkTypeGroup 
(LinkTypeGroupID, UserID, Label, CreationDate) 
VALUES 
('presetlinktypegroup01', 'defaultuser', 'Positive', 0),
('presetlinktypegroup02', 'defaultuser', 'Negative', 0),
('presetlinktypegroup03', 'defaultuser', 'Neutral', 0);


-- defaultuser LinkTypeGrouping
INSERT INTO LinkTypeGrouping 
(LinkTypeGroupID, LinkTypeID, UserID, CreationDate) 
VALUES 
('presetlinktypegroup01', 'presetlinktype01', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype02', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype03', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype07', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype09', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype10', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype11', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype12', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype13', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype16', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype20', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype21', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype22', 'defaultuser', 0),
('presetlinktypegroup01', 'presetlinktype23', 'defaultuser', 0),
('presetlinktypegroup02', 'presetlinktype04', 'defaultuser', 0),
('presetlinktypegroup02', 'presetlinktype05', 'defaultuser', 0),
('presetlinktypegroup02', 'presetlinktype06', 'defaultuser', 0),
('presetlinktypegroup02', 'presetlinktype08', 'defaultuser', 0),
('presetlinktypegroup02', 'presetlinktype18', 'defaultuser', 0),
('presetlinktypegroup02', 'presetlinktype15', 'defaultuser', 0),
('presetlinktypegroup03', 'presetlinktype19', 'defaultuser', 0),
('presetlinktypegroup03', 'presetlinktype17', 'defaultuser', 0),
('presetlinktypegroup03', 'presetlinktype24', 'defaultuser', 0);

