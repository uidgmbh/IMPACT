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
-- 
-- Database: `cohere`
-- 

create database if not exists `cohere`;

use `cohere`;

SET FOREIGN_KEY_CHECKS=0;

/*
Table structure for AuditNode
*/

drop table if exists `AuditNode`;
CREATE TABLE `AuditNode` (
  `NodeID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL default '0',
  `Name` text,
  `Description` text,
  `ModificationDate` double NOT NULL default '0',
  `ChangeType` varchar(255) NOT NULL default '',
  `NodeXML` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for AuditTriple
*/

drop table if exists `AuditTriple`;
CREATE TABLE `AuditTriple` (
  `TripleID` varchar(50) NOT NULL default '',
  `LinkTypeID` varchar(50) default NULL,
  `FromID` varchar(50) default NULL,
  `ToID` varchar(50) default NULL,
  `Label` text,
  `FromContextTypeID` varchar(50) default NULL,
  `ToContextTypeID` varchar(50) default NULL,
  `UserID` varchar(50) NOT NULL default '',
  `ModificationDate` double NOT NULL default '0',
  `ChangeType` varchar(255) NOT NULL default '',
  `TripleXML` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for AuditURL
*/

drop table if exists `AuditURL`;
CREATE TABLE `AuditURL` (
  `URLID` varchar(50) NOT NULL default '',
  `TagID` varchar(50) default NULL,
  `UserID` varchar(50) NOT NULL default '',
  `URL` text,
  `Title` text,
  `Description` text,
  `Comments` text,
  `ModificationDate` double NOT NULL default '0',
  `ChangeType` varchar(255) NOT NULL default '',
  `URLXML` text,
  `Clip` text,
  `ClipPath` text,
  `ClipHTML` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for AuditView
*/

drop table if exists `AuditView`;
CREATE TABLE `AuditView` (
  `ViewID` varchar(50) NOT NULL,
  `Name` varchar(255) default NULL,
  `ViewType` varchar(255) default NULL,
  `UserID` varchar(50) NOT NULL default '',
  `ModificationDate` double NOT NULL default '0',
  `ChangeType` varchar(255) NOT NULL default '',
  `XML` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for AuditViewAssignment
*/

drop table if exists `AuditViewAssignment`;
CREATE TABLE `AuditViewAssignment` (
  `ViewID` varchar(50) NOT NULL,
  `ItemID` varchar(50) NOT NULL default '',
  `Type` int(10) NOT NULL default '0',
  `UserID` varchar(50) NOT NULL default '',
  `ModificationDate` double NOT NULL default '0',
  `ChangeType` varchar(255) NOT NULL default '',
  `XML` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for Feeds
*/

drop table if exists `Feeds`;
CREATE TABLE `Feeds` (
  `FeedID` varchar(50) NOT NULL default '',
  `UserID` varchar(50) NOT NULL default '0',
  `URL` text NOT NULL,
  `Name` text NOT NULL,
  `FeedType` varchar(255) default NULL,
  `CreationDate` double NOT NULL default '0',
  `LastUpdated` double NOT NULL default '0',
  `Regular` enum('Y','N') NOT NULL default 'N',
  PRIMARY KEY  (`FeedID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Feeds_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for LinkType
*/

drop table if exists `LinkType`;
CREATE TABLE `LinkType` (
  `LinkTypeID` varchar(60) NOT NULL default '',
  `UserID` varchar(50) NOT NULL default '0',
  `Color` varchar(255) default '#000000',
  `ToContextTypeID` varchar(50) default NULL,
  `FromContextTypeID` varchar(50) default NULL,
  `Label` text NOT NULL,
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`LinkTypeID`),
  KEY `UserID` (`UserID`),
  KEY `FromContextTypeID` (`FromContextTypeID`),
  KEY `ToContextTypeID` (`ToContextTypeID`),
  CONSTRAINT `LinkType_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `LinkType_ibfk_3` FOREIGN KEY (`ToContextTypeID`) REFERENCES `NodeType` (`NodeTypeID`) ON DELETE SET NULL,
  CONSTRAINT `LinkType_ibfk_4` FOREIGN KEY (`FromContextTypeID`) REFERENCES `NodeType` (`NodeTypeID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for LinkTypeGroup
*/

drop table if exists `LinkTypeGroup`;
CREATE TABLE `LinkTypeGroup` (
  `LinkTypeGroupID` varchar(50) NOT NULL default '',
  `UserID` varchar(50) NOT NULL default '0',
  `Label` text NOT NULL,
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`LinkTypeGroupID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `LinkTypeGroup_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for LinkTypeGrouping
*/

drop table if exists `LinkTypeGrouping`;
CREATE TABLE `LinkTypeGrouping` (
  `LinkTypeGroupID` varchar(50) NOT NULL default '0',
  `LinkTypeID` varchar(60) NOT NULL default '0',
  `UserID` varchar(50) NOT NULL default '0',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`LinkTypeGroupID`,`LinkTypeID`,`UserID`),
  KEY `UserID` (`UserID`),
  KEY `LinkTypeID` (`LinkTypeID`),
  CONSTRAINT `LinkTypeGrouping_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `LinkTypeGrouping_ibfk_2` FOREIGN KEY (`LinkTypeID`) REFERENCES `LinkType` (`LinkTypeID`) ON DELETE CASCADE,
  CONSTRAINT `LinkTypeGrouping_ibfk_3` FOREIGN KEY (`LinkTypeGroupID`) REFERENCES `LinkTypeGroup` (`LinkTypeGroupID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for LinkTypeProperty
*/

drop table if exists `LinkTypeProperty`;
CREATE TABLE `LinkTypeProperty` (
  `LinkTypePropertyID` varchar(50) NOT NULL default '',
  `UserID` varchar(50) NOT NULL default '0',
  `Property` varchar(255) NOT NULL default '',
  `value` varchar(255) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`LinkTypePropertyID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `LinkTypeProperty_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for LinkTypePropertyAssignment
*/

drop table if exists `LinkTypePropertyAssignment`;
CREATE TABLE `LinkTypePropertyAssignment` (
  `LinkTypeID` char(50) NOT NULL default '0',
  `LinkTypePropertyID` char(50) NOT NULL default '0',
  `UserID` char(50) NOT NULL default '0',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`LinkTypeID`,`LinkTypePropertyID`,`UserID`),
  KEY `UserID` (`UserID`),
  KEY `LinkTypePropertyID` (`LinkTypePropertyID`),
  CONSTRAINT `LinkTypePropertyAssignment_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `LinkTypePropertyAssignment_ibfk_2` FOREIGN KEY (`LinkTypePropertyID`) REFERENCES `LinkTypeProperty` (`LinkTypePropertyID`) ON DELETE CASCADE,
  CONSTRAINT `LinkTypePropertyAssignment_ibfk_3` FOREIGN KEY (`LinkTypeID`) REFERENCES `LinkType` (`LinkTypeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=FIXED;

/*
Table structure for Log
*/

drop table if exists `Log`;
CREATE TABLE `Log` (
  `LogID` bigint(20) unsigned NOT NULL auto_increment,
  `LogDateTime` double NOT NULL default '0',
  `LogIP` varchar(45) default NULL,
  `LogReferer` text,
  `LogAction` varchar(255) default NULL,
  `LogObjectType` varchar(45) default NULL,
  `LogObjectID` varchar(45) default NULL,
  `UserID` varchar(45) default NULL,
  PRIMARY KEY  (`LogID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Log_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16905 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for Node
*/

drop table if exists `Node`;
CREATE TABLE `Node` (
  `NodeID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL default '0',
  `Name` text NOT NULL,
  `CreationDate` double NOT NULL default '0',
  `Description` text,
  `CurrentStatus` int(11) NOT NULL default '0',
  `Image` varchar(255) default NULL,
  `ImageThumbnail` varchar(255) default NULL,
  `ModificationDate` double NOT NULL default '0',
  `CreatedFrom` varchar(50) NOT NULL default 'cohere',
  `Private` enum('N','Y') default 'Y',
  `StartDate` double default NULL,
  `EndDate` double default NULL,
  `LocationText` varchar(255) default NULL,
  `LocationCountry` char(2) default NULL,
  `LocationLat` decimal(18,15) default NULL,
  `LocationLng` decimal(18,15) default NULL,
  `NodeTypeID` varchar(50) default NULL,
  PRIMARY KEY  (`NodeID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Node_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for NodeGroup
*/

drop table if exists `NodeGroup`;
CREATE TABLE `NodeGroup` (
  `NodeID` varchar(50) NOT NULL,
  `GroupID` varchar(50) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`NodeID`,`GroupID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `NodeGroup_ibfk_1` FOREIGN KEY (`NodeID`) REFERENCES `Node` (`NodeID`) ON DELETE CASCADE,
  CONSTRAINT `NodeGroup_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for NodeType
*/

drop table if exists `NodeType`;
CREATE TABLE `NodeType` (
  `NodeTypeID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL default '0',
  `Name` varchar(255) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  `Image` text,
  PRIMARY KEY  (`NodeTypeID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `NodeType_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for NodeTypeGroup
*/

drop table if exists `NodeTypeGroup`;
CREATE TABLE `NodeTypeGroup` (
  `NodeTypeGroupID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL default '0',
  `Name` varchar(255) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`NodeTypeGroupID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `NodeTypeGroup_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for NodeTypeGrouping
*/

drop table if exists `NodeTypeGrouping`;
CREATE TABLE `NodeTypeGrouping` (
  `NodeTypeGroupID` varchar(50) NOT NULL default '0',
  `NodeTypeID` varchar(50) NOT NULL default '0',
  `UserID` varchar(50) NOT NULL default '0',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`NodeTypeGroupID`,`NodeTypeID`,`UserID`),
  KEY `UserID` (`UserID`),
  KEY `ContextualNodeTypeID` (`NodeTypeID`),
  CONSTRAINT `NodeTypeGrouping_ibfk_1` FOREIGN KEY (`NodeTypeGroupID`) REFERENCES `NodeTypeGroup` (`NodeTypeGroupID`) ON DELETE CASCADE,
  CONSTRAINT `NodeTypeGrouping_ibfk_2` FOREIGN KEY (`NodeTypeID`) REFERENCES `NodeType` (`NodeTypeID`) ON DELETE CASCADE,
  CONSTRAINT `NodeTypeGrouping_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for Search
*/

drop table if exists `Search`;
CREATE TABLE `Search` (
  `SearchID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  `Name` varchar(254) NOT NULL,
  `CreationDate` double NOT NULL,
  `ModificationDate` double NOT NULL,
  `Scope` varchar(3) NOT NULL default 'my',
  `Depth` int(11) default '1',
  `FocalNode` varchar(50) default NULL,
  `LinkTypes` text,
  `LinkGroup` varchar(50) default NULL,
  `LinkSet` varchar(50) default NULL,
  `Direction` int(1) default '2',
  `LabelMatch` int(1) default '0',
  PRIMARY KEY  (`SearchID`),
  KEY `Search_ibfk_1` (`UserID`),
  KEY `Search_ibfk_2` (`FocalNode`),
  CONSTRAINT `Search_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `Search_ibfk_2` FOREIGN KEY (`FocalNode`) REFERENCES `Node` (`NodeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for SearchAgent
*/

drop table if exists `SearchAgent`;
CREATE TABLE `SearchAgent` (
  `AgentID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  `SearchID` varchar(50) NOT NULL,
  `CreationDate` double NOT NULL,
  `ModificationDate` double NOT NULL,
  `LastRun` double default '0',
  `Email` int(1) NOT NULL default '0',
  `RunInterval` varchar(50) NOT NULL default 'monthly',
  PRIMARY KEY  (`AgentID`),
  KEY `SearchAgent_ibfk_1` (`UserID`),
  KEY `SearchAgent_ibfk_2` (`SearchID`),
  CONSTRAINT `SearchAgent_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `SearchAgent_ibfk_2` FOREIGN KEY (`SearchID`) REFERENCES `Search` (`SearchID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for SearchAgentRun
*/

drop table if exists `SearchAgentRun`;
CREATE TABLE `SearchAgentRun` (
  `RunID` varchar(50) NOT NULL,
  `AgentID` varchar(50) default NULL,
  `UserID` varchar(50) default NULL,
  `FromDate` double default NULL,
  `ToDate` double default NULL,
  `RunType` varchar(255) default NULL,
  PRIMARY KEY  (`RunID`),
  KEY `AgentID` (`AgentID`),
  CONSTRAINT `SearchAgentRun_ibfk_1` FOREIGN KEY (`AgentID`) REFERENCES `SearchAgent` (`AgentID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for SearchAgentRunResults
*/

drop table if exists `SearchAgentRunResults`;
CREATE TABLE `SearchAgentRunResults` (
  `RunID` varchar(50) NOT NULL,
  `TripleID` varchar(50) NOT NULL,
  PRIMARY KEY  (`RunID`,`TripleID`),
  CONSTRAINT `SearchAgentRunResults_ibfk_1` FOREIGN KEY (`RunID`) REFERENCES `SearchAgentRun` (`RunID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for Tag
*/

drop table if exists `Tag`;
CREATE TABLE `Tag` (
  `TagID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  `CreationDate` double NOT NULL,
  `ModificationDate` double NOT NULL,
  `Name` varchar(100) NOT NULL,
  PRIMARY KEY  (`TagID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Tag_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for TagGroup
*/

drop table if exists `TagGroup`;
CREATE TABLE `TagGroup` (
  `TagGroupID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` varchar(255) default NULL,
  `CreationDate` double NOT NULL,
  `ModificationDate` double NOT NULL,
  PRIMARY KEY  (`TagGroupID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `TagGroup_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for TagGrouping
*/

drop table if exists `TagGrouping`;
CREATE TABLE `TagGrouping` (
  `TagID` varchar(50) NOT NULL,
  `TagGroupID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  `CreationDate` double NOT NULL,
  `ModificationDate` double NOT NULL,
  PRIMARY KEY  (`TagID`,`TagGroupID`),
  KEY `GroupTag_TagGroupID_Ind` (`TagGroupID`),
  CONSTRAINT `FK_GroupTag_1` FOREIGN KEY (`TagID`) REFERENCES `Tag` (`TagID`) ON DELETE CASCADE,
  CONSTRAINT `FK_GroupTag_2` FOREIGN KEY (`TagGroupID`) REFERENCES `TagGroup` (`TagGroupID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for TagNode
*/

drop table if exists `TagNode`;
CREATE TABLE `TagNode` (
  `NodeID` varchar(50) NOT NULL,
  `TagID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  PRIMARY KEY  (`NodeID`,`TagID`,`UserID`),
  KEY `TagNode_TagID_Ind` (`TagID`),
  CONSTRAINT `FK_TagNode_1` FOREIGN KEY (`NodeID`) REFERENCES `Node` (`NodeID`) ON DELETE CASCADE,
  CONSTRAINT `FK_TagNode_2` FOREIGN KEY (`TagID`) REFERENCES `Tag` (`TagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for TagTriple
*/

drop table if exists `TagTriple`;
CREATE TABLE `TagTriple` (
  `TripleID` varchar(50) NOT NULL,
  `TagID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  PRIMARY KEY  (`TripleID`,`TagID`,`UserID`),
  KEY `TagTriple_TagID_Ind` (`TagID`),
  CONSTRAINT `FK_TagTriple_1` FOREIGN KEY (`TripleID`) REFERENCES `Triple` (`TripleID`) ON DELETE CASCADE,
  CONSTRAINT `FK_TagTriple_2` FOREIGN KEY (`TagID`) REFERENCES `Tag` (`TagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for TagURL
*/

drop table if exists `TagURL`;
CREATE TABLE `TagURL` (
  `URLID` varchar(50) NOT NULL,
  `TagID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  PRIMARY KEY  (`URLID`,`TagID`,`UserID`),
  KEY `TagURL_TagID_Ind` (`TagID`),
  CONSTRAINT `FK_TagURL_1` FOREIGN KEY (`URLID`) REFERENCES `URL` (`URLID`) ON DELETE CASCADE,
  CONSTRAINT `FK_TagURL_2` FOREIGN KEY (`TagID`) REFERENCES `Tag` (`TagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for TagUsers
*/

drop table if exists `TagUsers`;
CREATE TABLE `TagUsers` (
  `UserID` varchar(50) NOT NULL,
  `TagID` varchar(50) NOT NULL,
  PRIMARY KEY  (`TagID`,`UserID`),
  KEY `TagUsers_TagID_Ind` (`TagID`),
  KEY `FK_TagUsers_1` (`UserID`),
  CONSTRAINT `FK_TagUsers_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `FK_TagUsers_2` FOREIGN KEY (`TagID`) REFERENCES `Tag` (`TagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for Triple
*/

drop table if exists `Triple`;
CREATE TABLE `Triple` (
  `TripleID` varchar(50) NOT NULL default '',
  `LinkTypeID` varchar(60) NOT NULL default '',
  `FromID` varchar(50) NOT NULL default '',
  `ToID` varchar(50) NOT NULL default '',
  `Label` text,
  `FromContextTypeID` varchar(50) default NULL,
  `ToContextTypeID` varchar(50) default NULL,
  `CurrentStatus` int(11) NOT NULL default '0',
  `UserID` varchar(50) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  `FromLabel` text NOT NULL,
  `ToLabel` text NOT NULL,
  `ModificationDate` double NOT NULL default '0',
  `CreatedFrom` varchar(50) NOT NULL default 'cohere',
  `Private` enum('Y','N') default 'Y',
  `Description` text,
  PRIMARY KEY  (`TripleID`),
  KEY `UserID` (`UserID`),
  KEY `FromContextTypeID` (`FromContextTypeID`),
  KEY `ToContextTypeID` (`ToContextTypeID`),
  KEY `FromID` (`FromID`),
  KEY `ToID` (`ToID`),
  CONSTRAINT `Triple_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for TripleGroup
*/

drop table if exists `TripleGroup`;
CREATE TABLE `TripleGroup` (
  `TripleID` varchar(50) NOT NULL default '',
  `GroupID` varchar(50) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`TripleID`,`GroupID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `TripleGroup_ibfk_1` FOREIGN KEY (`TripleID`) REFERENCES `Triple` (`TripleID`) ON DELETE CASCADE,
  CONSTRAINT `TripleGroup_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for URL
*/

drop table if exists `URL`;
CREATE TABLE `URL` (
  `URLID` varchar(50) NOT NULL default '',
  `UserID` varchar(50) NOT NULL default '0',
  `CreationDate` double NOT NULL default '0',
  `URL` text NOT NULL,
  `Title` text,
  `Private` enum('Y','N') NOT NULL default 'Y',
  `CurrentStatus` int(11) NOT NULL default '0',
  `Description` text,
  `ModificationDate` double NOT NULL default '0',
  `CreatedFrom` varchar(50) NOT NULL default '',
  `Clip` text,
  `ClipPath` text,
  `ClipHTML` text,
  PRIMARY KEY  (`URLID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `URL_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for URLGroup
*/

drop table if exists `URLGroup`;
CREATE TABLE `URLGroup` (
  `URLID` varchar(50) NOT NULL default '',
  `GroupID` varchar(50) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`URLID`,`GroupID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `urlgroup_ibfk_1` FOREIGN KEY (`URLID`) REFERENCES `URL` (`URLID`) ON DELETE CASCADE,
  CONSTRAINT `urlgroup_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for URLNode
*/

drop table if exists `URLNode`;
CREATE TABLE `URLNode` (
  `UserID` varchar(50) NOT NULL default '0',
  `URLID` varchar(50) NOT NULL default '0',
  `NodeID` varchar(50) NOT NULL default '0',
  `CreationDate` double NOT NULL default '0',
  `Comments` text,
  `CurrentStatus` int(11) default '0',
  `ModificationDate` double default NULL,
  PRIMARY KEY  (`UserID`,`URLID`,`NodeID`),
  KEY `URLID` (`URLID`),
  KEY `TagID` (`NodeID`),
  CONSTRAINT `URLNode_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `URLNode_ibfk_2` FOREIGN KEY (`NodeID`) REFERENCES `Node` (`NodeID`) ON DELETE CASCADE,
  CONSTRAINT `URLNode_ibfk_3` FOREIGN KEY (`URLID`) REFERENCES `URL` (`URLID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=FIXED;

/*
Table structure for UserGroup
*/

drop table if exists `UserGroup`;
CREATE TABLE `UserGroup` (
  `GroupID` varchar(50) NOT NULL default '',
  `UserID` varchar(50) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  `IsAdmin` enum('Y','N') NOT NULL default 'N',
  PRIMARY KEY  (`GroupID`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `UserGroup_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `UserGroup_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for Users
*/

drop table if exists `Users`;
CREATE TABLE `Users` (
  `UserID` varchar(50) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  `ModificationDate` double NOT NULL default '0',
  `Email` varchar(255) NOT NULL default '',
  `Name` varchar(255) NOT NULL default '',
  `Description` text,
  `Password` varchar(255) default NULL,
  `LastLogin` double NOT NULL default '0',
  `LastActive` double NOT NULL default '0',
  `IsAdministrator` enum('N','Y') NOT NULL default 'N',
  `IsGroup` enum('N','Y') NOT NULL default 'N',
  `CurrentStatus` int(11) NOT NULL default '0',
  `Website` varchar(255) default NULL,
  `Photo` varchar(255) default NULL,
  `Private` enum('N','Y') NOT NULL default 'N',
  `AuthType` varchar(10) NOT NULL default 'cohere',
  `OpenIDURL` text,
  `InvitationCode` varchar(50) default NULL,
  `SocialLearnID` varchar(45) NOT NULL default '',
  `SocialLearnPassword` blob,
  `TwitterID` varchar(255) NOT NULL default '',
  `TwitterPassword` varchar(255) NOT NULL default '',
  `LocationText` varchar(255) default NULL,
  `LocationCountry` char(2) default NULL,
  `LocationLat` decimal(18,15) default NULL,
  `LocationLng` decimal(18,15) default NULL,
  PRIMARY KEY  (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
Table structure for UsersCache
*/

drop table if exists `UsersCache`;
CREATE TABLE `UsersCache` (
  `UsersCacheID` int(10) unsigned NOT NULL auto_increment,
  `UserID` varchar(50) NOT NULL default '',
  `NodeID` varchar(50) NOT NULL,
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`UsersCacheID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `UsersCache_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=546 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for View
*/

drop table if exists `View`;
CREATE TABLE `View` (
  `ViewID` varchar(50) NOT NULL default '',
  `Name` varchar(255) NOT NULL default '',
  `ViewType` varchar(255) default NULL,
  `UserID` varchar(50) NOT NULL default '',
  `CreationDate` double NOT NULL default '0',
  `CurrentStatus` int(11) NOT NULL default '0',
  `ModificationDate` double NOT NULL default '0',
  PRIMARY KEY  (`ViewID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `View_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for ViewAssignment
*/

drop table if exists `ViewAssignment`;
CREATE TABLE `ViewAssignment` (
  `ViewID` varchar(50) NOT NULL,
  `ItemID` varchar(50) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  `ItemType` varchar(50) NOT NULL default '0',
  `CreationDate` double NOT NULL default '0',
  PRIMARY KEY  (`ViewID`,`ItemID`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `ViewAssignment_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `ViewAssignment_ibfk_2` FOREIGN KEY (`ViewID`) REFERENCES `View` (`ViewID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

/*
Table structure for Voting
*/

drop table if exists `Voting`;
CREATE TABLE `Voting` (
  `VoteID` int(10) unsigned NOT NULL auto_increment,
  `UserID` varchar(50) NOT NULL default '',
  `ItemID` varchar(50) NOT NULL,
  `VoteType` enum('N','Y') NOT NULL default 'Y',
  `CreationDate` double NOT NULL default '0',
  `ModificationDate` double NOT NULL default '0',
  PRIMARY KEY  (`VoteID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Voting_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS=1;