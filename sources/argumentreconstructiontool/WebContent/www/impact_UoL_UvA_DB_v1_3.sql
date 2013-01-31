-- --------------------------------------------------------
-- Host:                         impact.uid.com
-- Server version:               5.1.63-log - SUSE MySQL RPM
-- Server OS:                    suse-linux-gnu
-- HeidiSQL version:             7.0.0.4170
-- Date/time:                    2012-09-03 14:52:26
-- --------------------------------------------------------
/* ----------------------------------------------------------------------------
 * Copyright (c) 2012 University of Liverpool, UK and Leibniz Center for Law, 
 * University of Amsterdam, the Netherlands
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
 * Created by:  University of Liverpool, UK and the Leibniz Center for Law,
 * University of Amsterdam, The Netherlands, 2012.
 * Authors: Adam Wyner, Katie Atkinson, Trevor Bench-Capon, Maya Wardeh,
 * Chenxi Li, Jochem Douw, and Giovanni Sileno.
 * ----------------------------------------------------------------------------
 */

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for impact_UoL_UvA_DB_v1_3
CREATE DATABASE IF NOT EXISTS `impact_UoL_UvA_DB_v1_3` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `impact_UoL_UvA_DB_v1_3`;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.action
CREATE TABLE IF NOT EXISTS `action` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_name` text,
  `agent` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`action_id`),
  KEY `agent` (`agent`),
  CONSTRAINT `action_ibfk_1` FOREIGN KEY (`agent`) REFERENCES `agent` (`agent_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='Actions that can be executed.';

-- Dumping data for table impact_UoL_UvA_DB_v1_3.action: ~5 rows (approximately)
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
INSERT INTO `action` (`action_id`, `action_name`, `agent`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 'clarify the law and exceptions to allow libraries to scan material', 1, '0000-00-00 00:00:00', NULL, 0, 'create', 107),
	(2, 'scan material.', 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 'No clarification should be made.', 3, '2012-08-23 16:46:23', NULL, NULL, 'create', 113),
	(5, 'copyright laws of countries around the globe unless the copier has first obtained the', 4, '2012-08-24 06:41:31', NULL, NULL, 'create', 119),
	(6, 'd the scope of current exceptions to copyright', 5, '2012-08-24 06:42:30', NULL, NULL, 'create', 125);
/*!40000 ALTER TABLE `action` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.agent
CREATE TABLE IF NOT EXISTS `agent` (
  `agent_id` int(11) NOT NULL AUTO_INCREMENT,
  `agent_name` varchar(45) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`agent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.agent: ~5 rows (approximately)
/*!40000 ALTER TABLE `agent` DISABLE KEYS */;
INSERT INTO `agent` (`agent_id`, `agent_name`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 'Legislators', '0000-00-00 00:00:00', NULL, 0, 'create', 106),
	(2, 'Libraries', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 'Legislator', '2012-08-23 16:46:23', NULL, NULL, 'create', 112),
	(4, 'test', '2012-08-24 06:41:31', NULL, NULL, 'create', 118),
	(5, 'test1', '2012-08-24 06:42:30', NULL, NULL, 'create', 124);
/*!40000 ALTER TABLE `agent` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.ART_discussions
CREATE TABLE IF NOT EXISTS `ART_discussions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier of the rows of this table',
  `issue_id` varchar(40) DEFAULT NULL,
  `title` varchar(255) NOT NULL COMMENT 'Title of the discussion',
  `intro` varchar(255) NOT NULL COMMENT 'Intoduction / description of this discussion',
  `timestamp_added` int(11) DEFAULT NULL COMMENT 'Timestamp of the time the row was added.',
  `added_by` int(11) DEFAULT NULL COMMENT 'User that added the row.',
  `timestamp_removed` int(11) DEFAULT NULL COMMENT 'Timestamp the row was removed.',
  `removed_by` int(11) DEFAULT NULL COMMENT 'User that removed the row.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.ART_discussions: ~26 rows (approximately)
/*!40000 ALTER TABLE `ART_discussions` DISABLE KEYS */;
INSERT INTO `ART_discussions` (`id`, `issue_id`, `title`, `intro`, `timestamp_added`, `added_by`, `timestamp_removed`, `removed_by`) VALUES
	(28, '86172211160044268001323532628', 'Q1: Should there be encouragement or guidelines for contractual arrangements between right holders and users for the implementation of copyright exceptions?', '', NULL, NULL, NULL, NULL),
	(29, '86172211160424414001323532704', 'Q2: Should there be encouragement, guidelines or model licenses for contractual arrangements between right holders and users on other aspects not covered by copyright exceptions?', '', NULL, NULL, NULL, NULL),
	(30, '86172211160571292001323532770', 'Q3: Is an approach based on a list of non-mandatory exceptions adequate in the light of evolving Internet technologies and the prevalent economic and social expectations?', '', NULL, NULL, NULL, NULL),
	(31, '86172211160004862001323532811', 'Q4: Should certain categories of exceptions be made mandatory to ensure more legal certainty and better protection of beneficiaries of exceptions?', '', NULL, NULL, NULL, NULL),
	(32, '86172211160274349001323532960', 'Q5: If so, which ones?', '', NULL, NULL, NULL, NULL),
	(33, '86172211160338255001323533551', 'Q6: Should the exception for libraries and archives remain unchanged because publishers themselves will develop online access to their catalogues?', '', NULL, NULL, NULL, NULL),
	(34, '86172211160538262001323533595', 'Q7: In order to increase access to works, should publicly accessible libraries, educational establishments, museums and archives enter into licensing schemes with the publishers? Are there examples of successful licensing schemes for online access to libr', '', NULL, NULL, NULL, NULL),
	(35, '86172211160684959001323533681', 'Q8: Should the scope of the exception for publicly accessible libraries, educational establishments, museums and archives be clarified with respect to: format shifting; The number of copies that can be made under the exception; The scanning of entire coll', '', NULL, NULL, NULL, NULL),
	(36, '86172211160319722001323533736', 'Q9: Should the law be clarified with respect to whether the scanning of works held in libraries for the purpose of making their content searchable on the Internet goes beyond the scope of current exceptions to copyright?', '', NULL, NULL, NULL, NULL),
	(37, '86172211160975727001323533778', 'Q10: Is a further Community statutory instrument required to deal with the problem of orphan works, which goes beyond the Commission Recommendation 2006/585/EC of 24 August 2006?', '', NULL, NULL, NULL, NULL),
	(38, '86172211160577778001323533828', 'Q11: If so, should this be done by amending the 2001 Directive on Copyright in the information society or through a stand-alone instrument?', '', NULL, NULL, NULL, NULL),
	(39, '86172211160716819001323533881', 'Q12: How should the cross-border aspects of the orphan works issue be tackled to ensure EU-wide recognition of the solutions adopted in different Member States?', '', NULL, NULL, NULL, NULL),
	(40, '86172211160984157001323534441', 'Q13: Should people with a disability enter into licensing schemes with the publishers in order to increase their access to works? If so, what types of licensing would be most suitable? Are there already licensing schemes in place to increase access to wor', '', NULL, NULL, NULL, NULL),
	(41, '86172211160042978001323534488', 'Q14: Should there be mandatory provisions that works are made available to people with a disability in a particular format?', '', NULL, NULL, NULL, NULL),
	(42, '86172211160499399001323534556', 'Q15: Should there be a clarification that the current exception benefiting people with a disability applies to disabilities other than visual and hearing disabilities?', '', NULL, NULL, NULL, NULL),
	(43, '86172211160900082001323534625', 'Q16: If so, which other disabilities should be included as relevant for online dissemination of knowledge?', '', NULL, NULL, NULL, NULL),
	(44, '86172211160332931001323534674', 'Q17: Should national laws clarify that beneficiaries of the exception for people with a disability should not be required to pay remuneration for using a work in order to convert it into an accessible format?', '', NULL, NULL, NULL, NULL),
	(45, '86172211160191863001323534726', 'Q18: Should Directive 96/9/EC on the legal protection of databases have a specific exception in favour of people with a disability that would apply to both original and sui generis databases?', '', NULL, NULL, NULL, NULL),
	(46, '86172211160427606001323535267', 'Q19: Should the scientific and research community enter into licensing schemes with publishers in order to increase access to works for teaching or research purposes? Are there examples of successful licensing schemes enabling online use of works for teac', '', NULL, NULL, NULL, NULL),
	(47, '86172211160173963001323535315', 'Q20: Should the teaching and research exception be clarified so as to accommodate modern forms of distance learning?', '', NULL, NULL, NULL, NULL),
	(48, '86172211160893172001323535364', 'Q21: Should there be a clarification that the teaching and research exception covers not only material used in classrooms or educational facilities, but also use of works at home for study?', '', NULL, NULL, NULL, NULL),
	(49, '86172211160891869001323535412', 'Q22: Should there be mandatory minimum rules as to the length of the excerpts from works which can be reproduced or made available for teaching and research purposes?', '', NULL, NULL, NULL, NULL),
	(50, '86172211160075286001323535460', 'Q23: Should there be a mandatory minimum requirement that the exception covers both teaching and research?', '', NULL, NULL, NULL, NULL),
	(51, '86172211160628025001323537143', 'Q24: Should there be more precise rules regarding what acts end users can or cannot do when making use of materials protected by copyright?', '', NULL, NULL, NULL, NULL),
	(52, '86172211160349383001323537186', 'Q25: Should an exception for user-created content be introduced into the Directive?', '', NULL, NULL, NULL, NULL),
	(53, '86172211160967585001323537454', 'Q: Any other comments?', '', NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `ART_discussions` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.ART_documents
CREATE TABLE IF NOT EXISTS `ART_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_id` int(11) DEFAULT NULL COMMENT 'Identifier of the first version of this document. This means that if a document is the first version, first_id is the same as id. It has a foreign key to the id field of this table.',
  `version` smallint(6) NOT NULL COMMENT 'Version number of this document, starting at 1 and incrementing by 1 for every new version.',
  `title` varchar(255) DEFAULT NULL COMMENT 'Title of the document.',
  `text` mediumtext NOT NULL COMMENT 'Text field containing the entire document in plain text format.',
  `url` varchar(255) DEFAULT NULL COMMENT 'The URL from which this document is downloaded.',
  `timestamp_added` int(11) DEFAULT NULL COMMENT 'Timestamp of the time the row was added.',
  `added_by` int(11) DEFAULT NULL COMMENT 'User that added the row.',
  `timestamp_removed` int(11) DEFAULT NULL COMMENT 'Timestamp the row was removed.',
  `removed_by` int(11) DEFAULT NULL COMMENT 'User that removed the row.',
  PRIMARY KEY (`id`),
  KEY `first_id` (`first_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.ART_documents: ~2 rows (approximately)
/*!40000 ALTER TABLE `ART_documents` DISABLE KEYS */;
INSERT INTO `ART_documents` (`id`, `first_id`, `version`, `title`, `text`, `url`, `timestamp_added`, `added_by`, `timestamp_removed`, `removed_by`) VALUES
	(4, 4, 1, 'MediaSet reply to Green Paper on Copyright in the Knowledge Economy', 'Green Paper on Copyright in the Knowledge Economy\n\nQuestionnaire \n\nResponse of Mediaset S.p.A. \n\n\n1 INTRODUCTION \n\n\nMediaset welcomes the opportunity to comment on the Commissionâ€™s Green Paper on Copyright in the Knowledge Economy (hereinafter the â€œGreen Paperâ€). Mediaset, with its core business in the information and entertainment industries, invests as a content provider on all the available distribution platforms: analogue and digital terrestrial television, mobile and Internet. It is, therefore, naturally interested in any ongoing discussion in relation to Directive 2001/29/EC on the harmonisation of certain aspects of copyright and related rights in the information society (â€œthe Directiveâ€). \n\nMediasetâ€™s views are set out below in response to the questions put forward by the Green Paper. \n\nAs a preliminary remark, Mediaset would like to refer to the fact that it already acts both as an online content producer and provider. As it will be shown below, this is relevant in so far as the Green Paper seeks views on the possibility to introduce a specific exception for the so-called \nâ€œUser-created contentâ€ (â€œUCCâ€). \n\nThe initial hype of the late nineties has now passed a major reality check: the very novelty introduced by Internet social networking ventures, as far as creative content is concerned, consists of databases aggregating existing copyrighted materials successfully conveyed to \nInternet users through a pervasive platform that allows distribution on a commercial scale. The economies of scale facilitated by these new distribution activities rely entirely on the capacity of \nâ€œtraditionalâ€ stakeholders in the content industry to bear production investments and correlated risks. Whether access is granted for free or paid for, suffice to say that the kind of exploitation on \na large commercial scale enabled by social networking Internet platforms goes beyond the definition of â€œfair useâ€ that rightly applies to niche services, catering for the needs of small communities of users sharing a common social or scientific purpose. \n\n\n2 GENERAL ISSUES â€“ QUESTIONS 1 TO 5 \n\n\nIn reply to Questions 1-5, and as a general comment on the envisaged possibility of amending the current legislative framework on copyright, Mediasetâ€™s position is that any amendment would be premature at this stage. The current legal framework provides a good balance between the interest of the copyright holders and that of individual users. \n\nAs acknowledged by the Directive (Recital 10) the investment required to produce products which are then protected by copyright is considerable. Therefore, any envisaged amendment to the current legal framework should always bear in mind that copyright protection should not be weakened and that copyright holdersâ€™ interests should be a priority.1 \n\nThe Directive already provides for a very comprehensive list of exceptions which users can benefit from. Moreover, the Directive was issued at a time in which Internet technologies could be appraised (and were indeed appraised by the relevant stakeholders): since then, there has not been any change, sufficient to warrant an amendment to the list of exceptions. In particular, the so-called â€œtransformativeâ€ works are already protected under the current legislative framework, to the extent that they satisfy the criteria for copyright protection (e.g. with regard to their creative element). As will be addressed more in detail further below in reply to the Questions related to UCC, the introduction of new exceptions or the widening of the scope of the existing exceptions might benefit for-profit undertakings rather than users themselves, as pending (and past) judicial proceedings for copyright infringement in relation to the upload of copyrighted materials on Internet platforms demonstrate. Indeed, copyright protection is all the more important in the audiovisual sector, and exceptions to it should therefore be very limited: it is fundamental to protect content owners for their high-risk and capital-intensive activities. In fact, any departure from copyright protection might have a very serious impact on the willingness of content producers/providers to finance, produce and distribute audio-visual works in Europe. In order to foster creativity, the regulatory framework should always aim at ensuring that copyright holders can recoup their investments by having exclusive management of the exploitation of their rights. \n\nFinally, it has to be noted that legal certainty in relation to the exceptions is provided by the implementing national legislation (i.e. mandatory legislation); making the exceptions contained in the Directive mandatory rather than voluntary would not have any impact on legal certainty as far as usersâ€™ benefit is concerned. \n\n3 EXCEPTIONS: SPECIFIC ISSUES â€“ USER CREATED CONTENT \n\n\n(a) Question 24: Should there be more precise rules regarding what acts end users can or cannot do when making use of materials protected by copyright? \n\n\nAs the Green Paper correctly points out, â€œthere is a significant difference between user-created content and existing content that is simply uploaded by users and is typically protected by copyrightâ€. Also, the OECD study mentioned in the Green Paper defines UCC as â€œcontent made publicly available over the Internet, which reflects a certain amount of creative effort, and which is created outside of professional routines and practicesâ€ (emphasis added). \n\nMediaset believes that the current legal framework already provides the means to foster UCC: if a specific UCC is original in nature and is made of newly created content, it will be protected by copyright law as it currently stands; if, on the other hand, a specific UCC is a â€œtransformativeâ€ work, the user will have to obtain licence/consent from the copyright holder of the original work.\n \nMediaset strongly believes that this latter scenario needs to remain unchanged in order to protect the interests of the rightholders of the original work, who have invested (also from a financial point of view) in the original creative effort and must be protected against any copyright infringement which would hamper the full exploitation of their rights. New technologies have not fostered creativity, they have simply introduced new forms of expression of such creativity. In many cases, new technologies have made reproduction and global diffusion of contents easier, regardless of whether such contents are â€œcreativeâ€ or whether they are simply copies of copyrighted materials, the production cost of which has been borne by the right-holders who made the first communication to the public possible. Therefore, real creative efforts, in whatever forms they take, must be protected and the current legal framework already provides the necessary tools for such protection. \n\nAs Mediaset mentioned in the context of the Commissionâ€™s consultation on Creative Content online, the respect of copyright by online users is fundamental to the full development of the distribution of content online: the fight against piracy is a pre-requisite in assuring rightholders that their rights will be protected and is fundamental for the development of online services. \n\nIt is Mediasetâ€™s opinion that the introduction of a specific exception related to UCC would create a legal framework in which for-profit Internet platforms (such as YouTube) would be relieved from any responsibility for the upload of copyrighted works for which no licence or consent has been given by the original copyright holder. This would run counter to the essential need of adequately protecting the interests of copyright holders. \n\nThe scenario described above is of great concern to Mediaset. In fact, one should bear in mind that in many cases (as is the case with Mediaset), the copyright holder already distributes the same content through its own distribution platforms (including the Internet). Opening the way for the same content to be uploaded on other (competing) platforms would be contrary to the same basic principles of copyright law and detrimental to the financial and creative efforts made by content providers such as Mediaset. \n\nIndeed, for-profit Internet platforms (e.g. YouTube, Facebook, MySpace) might advocate for a UCC-specific exception because their business model hinges entirely on the content which is uploaded by end-users on their platforms. However, most of this content is protected by copyright either totally or partially. A UCC-specific exception would allow YouTube-like platforms to use copyrighted materials without the need to obtain a licence for it, thereby depriving legitimate copyright holders of a source of income. Rights clearance is an administrative pre-requisite that any broadcaster complies with, prior to airing its content, whether produced in-house or acquired from third parties. Moreover, as mentioned, in Mediasetâ€™s case, the same copyrighted work is distributed on Mediaset-owned Internet platforms: allowing the upload of Mediasetâ€™s copyrighted materials without Mediasetâ€™s consent would be contrary to the very essence of Mediasetâ€™s copyrights. One of the main sources of income of YouTube-like platforms is the sale of advertising â€œspaceâ€ on their websites, which they sell according to the â€œattractivenessâ€ of the uploaded content. Copyright infringements thus enable unfair competition. \nYouTube-like platforms, therefore, should be required to obtain clearance from the copyright holders before the copyrighted material is uploaded and copyright holders should not be forced to constantly monitor the material which is uploaded on such platforms in order to verify whether their copyrights have been infringed. \n\nAs demonstrated by a number of judgements and pending judicial proceedings, the scenario described above is not a fictitious one: it is real and it has already given rise to a significant number of legal disputes in many countries, within and outside the European Union. \n\nReference should also be made to neighbouring rights, as their protection is very important for all creative content producers and distributors; moreover, broadcasters enjoy these rights and ensure that the necessary protection to copyright of artists and content providers is granted. \nMediaset, in its quality of both producer and broadcaster of creative content, has the exclusive right, inter alia, to: (i) authorise the direct or indirect reproduction in any form whatsoever of the original works on which it holds the copyright, and (ii) authorise third parties to make the original works and the copies on which it holds copyrights available to the public. This latter right is not subject to exhaustion. This is what the Italian Copyright Law provides, which is also coherent with the approach taken by Article 14(3) of the TRIPS Agreement. YouTube-like platforms, therefore, should bear clear and full legal responsibility for copyrighted materials uploaded on their websites without the consent of the copyright holders. \n\nFinally, making licensing of copyrighted work easier for users would incentivise the more rudimentary forms of creation to the detriment of the creative effort of those involved in the production process and of the significant investments that enabled the development of original creative works. \n\nIn the light of the foregoing, Mediaset does not believe that it is necessary to introduce any rule with reference to what end users can or cannot do when making use of materials protected by copyright. In this respect, Mediaset believes that the current legislative and regulatory framework is capable of covering all of the relevant issues and circumstances. In particular, Mediaset believes that a strict application of the so-called Berne three-step test along with the existing system of exceptions already provide opportunities to those users whose activities and genuine intentions are to â€œcreateâ€ a new original work, while at the same time discouraging mere copies and illegal distribution of copyrighted materials. \n\nHowever, also in the light of the issue discussed above, the Commission might wish to explore the possibility of clarifying the situation as regards â€œthird partiesâ€ such as YouTube-like platforms, codifying and making it clear that the uploading of copyrighted materials on their websites, without the express consent of the relevant copyright holders, constitutes a copyright infringement for which these entities must bear responsibility. \n\n(b) Question 25: Should an exception for user-created content be introduced into the \nDirective? \n\n\nIn the light of all the above considerations, Mediaset calls on the Commission not to impose any specific model nor to introduce any exception in relation to UCC. \n\n \n***** \n\n \nIn conclusion, Mediaset hopes that the specific replies to the questions raised in the Green Paper will provide the Commission with useful input for a thorough appraisal of the fundamental issues at stake. \n\nMediaset looks forward to the results of the consultation taking place in this respect and is confident that consistent application of existing national, EU and TRIPs provisions to all new forms of creating, compiling and distributing copyrighted materials will benefit the entire value chain in the creative content industry. A lawful proliferation of new services will indeed curb the phenomenon of free-riders, thus enabling both economic growth and knowledge dissemination in the information society. \n\n\nMediaset S.p.A., 28 November 2008 \n\n\nMapping of a position into the practical reasoning argument scheme:\n\nWhere\n\nThe intenet facilitates distribution, not production and so relies on the content industry for products\nDistribution on sites such as you tube goes beyond fair use\nThe current framework provides a good balance between copyright holders and users\nTransformative works are already protected\nLegal certainty satisfied by national legislation\nProducing content is a high risk and capital intensive activity \n\nDo\n\nnot weaken protection \n\nWhich would result in \n\nReduced investment in content production\n\nRealising\n\nLess creative content produced\n\nDemoting\n\nCreative innovation\nReward for investment\nReward for risk\n', 'https://circabc.europa.eu/d/d/workspace/SpacesStore/96fb4b45-5ed9-400d-aa8f-bb618c6fd3d7/mediaset.pdf', NULL, NULL, NULL, NULL),
	(7, 7, 1, 'SIIA reply to Green Paper on Copyright in the Knowledge Economy (Q9, 11, 12, 24)', '(9) Should the law be clarified with respect to whether the scanning of works held in libraries for the purpose of making their content searchable on the Internet goes beyond the scope of current exceptions to copyright\n\nScanning of copyright works is a form of copying and as such is generally prohibited under the Berne Convention and copyright laws of countries around the globe unless the copier has first obtained the copyright ownerâ€™s authorization to scan the work(s). The ultimate purpose of the scanning -- e.g., for indexing, cataloguing, searching or some other purpose -- should have no bearing on the ultimate determination that a copy is being made and that such activity requires the authorization of the copyright owner. As a result, any public or private initiative to scan entire collections of works must require that the copyright owner opt-in, rather than putting the onus on the copyright owner to opt-out of the initiative. We do not believe that there needs to be any further clarification in the law in this area. To the best of our knowledge no court has ever held that such large-scale scanning activities are not prohibited under copyright law.\n\n(11) If so, should this be done by amending the 2001 Directive on Copyright in the information society or through a stand-alone instrument\n\nWhile we do not support such an approach, to the extent that an orphan works standard is adopted throughout the EU, we recommend that a Community statutory instrument dealing with the problem of orphan works should be a stand-alone instrument. As noted above, an orphan works defense would not be an exception to copyright infringement. The orphan works defense is a rights clearance mechanism that would merely serve to limit the legal remedies that a user would be subject to if that user was found liable for copyright infringement. Accordingly, a user of an orphan works owner is still deemed to be an infringer. Because the 2001 Copyright Directive relates to rights and exceptions, but not remedies, it would be inappropriate for the Directive to be amended to include a provision relating to orphan works.\n\n(12) How should the cross-border aspects of the orphan works issue be tackled to ensure EU-wide recognition of the solutions adopted in different Member States?\nSee response to question 11.\n\n(24) Should there be more precise rules regarding what acts end users can or cannot do when making use of materials protected by copyright\n\nUser-created content is not a new concept. Use of a copyrighted work implicates the copyright ownerâ€™s right to control the adaptation of his or her work. (This is often referred to as the right to create a derivative work or the modification right). When someone uses a copyrighted work to create a new copyrighted work there are three possible outcomes: (1) they are licensed by the copyright owner or otherwise permitted by some exception in the law to create a derivative work and therefore there is no infringement; (2) they are using such a small amount of the copyrighted work or nonprotectable aspects of the copyrighted work that the use does not implicate the copyright ownerâ€™s reproduction or adaptation rights under copyright law and therefore there is no infringement; or (3) they are not licensed by the copyright owner to create a derivative work and are using sufficient protectable expression from the copyrighted work that the use implicates the copyright ownerâ€™s reproduction and adaptation rights which results in an infringement. This has been the law for many years. Although, with the advent of new digital technologies, it may be easier than ever to create derivative works, there is no reason to change these long-standing, well-established copyright rules.\nThe issue of user-created content is primarily one of education. Until recently, most people did not have the capability to use someone elseâ€™s creation to create a new work. Copying was too difficult or expensive. As a result, your average person did not need to have even a rudimentary understanding of copyright rules. But now, anyone can be a publisher. Itâ€™s easy and inexpensive. While this presents great new possibilities, it also poses great challenges and risks for copyright owners. Governments and educators need to do a better job educating the public on what they can and cannot do with copyrighted works. The public needs to better understand the purpose and goals of the copyright law and the sanctions for violating it. In short, the rules of the road do not need to be changed, the people who drive on the road need to better understand the rules.', NULL, NULL, NULL, NULL, NULL),
	(36, 36, 1, 'EU Green Paper', '', 'http://ec.europa.eu/internal_market/copyright/docs/copyright-infso/greenpaper_de.pdf', NULL, NULL, NULL, NULL),
	(37, 37, 1, 'LIBER reply', 'Question 3. Is an approach based on a list of non-mandatory exceptions\nadequate in the light of evolving Internet technologies and the prevalent\neconomic and social expectations?\nNo.\nIt is bizarre that in the Information Society Directive only 1 of the 21 exceptions is\nobligatory. This is the exception in article 5(1) which legalises cache copies. The\nInformation Society Directive harmonises the rights of authors and other rights\nholders. It does not harmonise the exceptions and limitations to these rights. As a\nresult, the non-mandatory exceptions are not all implemented in Member States; or if\nthey are implemented they are implemented differently. As the EBLIDA response\nmakes clear, the result is that trans-national licensing within the EU is difficult or\nimpossible, leaving research and educational institutions with very different operating\nconditions. As LIBER knows full well, this is nonsensical in an educational\nenvironment when research, and also teaching, are often conducted across national\nboundaries.\nLIBER regrets that the list of non-mandatory exceptions is exclusive. As a result, no\nnew exceptions may be added by Member States in national legislation. LIBER does\nnot see how an exclusive list of exceptions is adequate in the era of fast-evolving\nInternet technologies.', NULL, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `ART_documents` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.ART_relations_discussions
CREATE TABLE IF NOT EXISTS `ART_relations_discussions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `relation_id` int(11) NOT NULL,
  `relation_sort` varchar(25) NOT NULL,
  `discussion` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `discussion` (`discussion`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.ART_relations_discussions: ~19 rows (approximately)
/*!40000 ALTER TABLE `ART_relations_discussions` DISABLE KEYS */;
INSERT INTO `ART_relations_discussions` (`id`, `relation_id`, `relation_sort`, `discussion`) VALUES
	(2, 1, 'credible_source_as', 36),
	(3, 2, 'credible_source_as', 36),
	(4, 3, 'credible_source_as', 36),
	(5, 4, 'credible_source_as', 36),
	(6, 5, 'credible_source_as', 36),
	(7, 6, 'credible_source_as', 36),
	(8, 7, 'credible_source_as', 36),
	(9, 8, 'credible_source_as', 36),
	(10, 9, 'credible_source_as', 36),
	(11, 1, 'practical_reasoning_as', 36),
	(12, 19, 'credible_source_as', 53),
	(13, 20, 'credible_source_as', 53),
	(14, 21, 'credible_source_as', 53),
	(15, 22, 'credible_source_as', 53),
	(16, 23, 'credible_source_as', 53),
	(17, 2, 'practical_reasoning_as', 36),
	(18, 3, 'practical_reasoning_as', 28),
	(19, 4, 'practical_reasoning_as', 28),
	(20, 136, 'credible_source_as', 36);
/*!40000 ALTER TABLE `ART_relations_discussions` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.ART_text_sections
CREATE TABLE IF NOT EXISTS `ART_text_sections` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `document_id` int(11) DEFAULT NULL COMMENT 'Foreign key to the document the fragment was taken from. For free input text sections, this field is null.',
  `text` varchar(255) NOT NULL COMMENT 'The actual text section.',
  `start_offset` smallint(6) DEFAULT NULL COMMENT 'Starting position (token number) of the text as stored in the documents table. Both the to and from fields are null when this is no literal citation',
  `end_offset` smallint(6) DEFAULT NULL COMMENT 'Ending position (token number) of the text as stored in the documents table. Both the to and from fields are null when this is no literal citation',
  `timestamp_added` int(11) DEFAULT NULL COMMENT 'Timestamp of the time the row was added.',
  `added_by` int(11) DEFAULT NULL COMMENT 'User that added the row.',
  `timestamp_removed` int(11) DEFAULT NULL COMMENT 'Timestamp the row was removed.',
  `removed_by` int(11) DEFAULT NULL COMMENT 'User that removed the row.',
  PRIMARY KEY (`id`),
  KEY `document` (`document_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.ART_text_sections: ~66 rows (approximately)
/*!40000 ALTER TABLE `ART_text_sections` DISABLE KEYS */;
INSERT INTO `ART_text_sections` (`id`, `document_id`, `text`, `start_offset`, `end_offset`, `timestamp_added`, `added_by`, `timestamp_removed`, `removed_by`) VALUES
	(7, NULL, ' is a new docum', 0, 0, NULL, NULL, NULL, NULL),
	(8, NULL, 'dsfsdf', 0, 0, NULL, NULL, NULL, NULL),
	(9, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(10, NULL, 'r testing', 0, 0, NULL, NULL, NULL, NULL),
	(11, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(12, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(13, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(14, NULL, ' is a new docum', 0, 0, NULL, NULL, NULL, NULL),
	(15, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(16, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(17, NULL, 'r testing', 0, 0, NULL, NULL, NULL, NULL),
	(18, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(19, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(20, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(21, NULL, 'test', 0, 0, NULL, NULL, NULL, NULL),
	(22, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(23, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(24, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(25, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(26, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(27, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(28, NULL, 'ew document for testing.\n', 0, 0, NULL, NULL, NULL, NULL),
	(29, NULL, ' edit t', 0, 0, NULL, NULL, NULL, NULL),
	(30, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(31, NULL, ' edit t', 0, 0, NULL, NULL, NULL, NULL),
	(32, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(33, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(34, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(35, 33, 'version 1.', 16, 26, NULL, NULL, NULL, NULL),
	(36, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(37, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(38, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(39, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(40, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(41, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(42, NULL, 'Legislators', 0, 0, NULL, NULL, NULL, NULL),
	(43, NULL, 'clarify the law and exceptions to allow libraries to scan material', 0, 0, NULL, NULL, NULL, NULL),
	(44, NULL, 'Some material held by publishers is not scanned, so it cannot be searched for', 0, 0, NULL, NULL, NULL, NULL),
	(45, NULL, 'All material held by publishers is scanned, so it can be searched for', 0, 0, NULL, NULL, NULL, NULL),
	(46, NULL, 'Research, learning, and teaching', 0, 0, NULL, NULL, NULL, NULL),
	(47, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(48, NULL, 'Legislator', 0, 0, NULL, NULL, NULL, NULL),
	(49, 7, 'No clarification should be made.', 947, 1039, NULL, NULL, NULL, NULL),
	(50, 7, 'Scanning of copyright works is a form of copying.', 221, 476, NULL, NULL, NULL, NULL),
	(51, 7, 'As a result, any public or private initiative to scan entire collections of works must require that the copyright owner opt-in, rather than putting the onus on the copyright owner to opt-out of the initiative.', 737, 946, NULL, NULL, NULL, NULL),
	(52, NULL, 'interests of copyright owners will be safed', 0, 0, NULL, NULL, NULL, NULL),
	(53, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(54, NULL, 'test', 0, 0, NULL, NULL, NULL, NULL),
	(55, 7, 'copyright laws of countries around the globe unless the copier has first obtained the', 337, 422, NULL, NULL, NULL, NULL),
	(56, NULL, 'test1', 0, 0, NULL, NULL, NULL, NULL),
	(57, NULL, 'test2', 0, 0, NULL, NULL, NULL, NULL),
	(58, NULL, 'test3', 0, 0, NULL, NULL, NULL, NULL),
	(59, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(60, NULL, 'test1', 0, 0, NULL, NULL, NULL, NULL),
	(61, 7, 'd the scope of current exceptions to copyright', 173, 219, NULL, NULL, NULL, NULL),
	(62, NULL, 'test2', 0, 0, NULL, NULL, NULL, NULL),
	(63, NULL, 'test3', 0, 0, NULL, NULL, NULL, NULL),
	(64, NULL, 'test4', 0, 0, NULL, NULL, NULL, NULL),
	(65, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(66, 7, 'Scanning of copyright works is a form of copying and as such is generally prohibited under the Berne Convention and copyright laws of countries around the globe unless the copier has first obtained the copyright ownerâ€™s ', 221, 441, NULL, NULL, NULL, NULL),
	(67, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(68, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(69, 37, 'It is bizarre that in the Information Society Directive only 1 of the 21 exceptions is\nobligatory. This is the exception in article 5(1) which legalises cache copies.', 183, 349, NULL, NULL, NULL, NULL),
	(70, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(71, NULL, '', 0, 0, NULL, NULL, NULL, NULL),
	(72, NULL, '', 0, 0, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `ART_text_sections` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.ART_text_section_combinations
CREATE TABLE IF NOT EXISTS `ART_text_section_combinations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text_section_id` int(11) NOT NULL,
  `combination_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.ART_text_section_combinations: ~130 rows (approximately)
/*!40000 ALTER TABLE `ART_text_section_combinations` DISABLE KEYS */;
INSERT INTO `ART_text_section_combinations` (`id`, `text_section_id`, `combination_id`) VALUES
	(7, 7, 7),
	(8, 8, 8),
	(9, 9, 9),
	(10, 10, 10),
	(11, 11, 11),
	(12, 12, 12),
	(13, 13, 13),
	(14, 14, 14),
	(15, 15, 15),
	(16, 16, 16),
	(17, 17, 17),
	(18, 18, 18),
	(19, 19, 19),
	(20, 20, 20),
	(21, 7, 21),
	(22, 8, 22),
	(23, 10, 23),
	(24, 13, 24),
	(25, 7, 25),
	(26, 8, 26),
	(27, 10, 27),
	(28, 13, 28),
	(29, 7, 29),
	(30, 8, 30),
	(31, 10, 31),
	(32, 13, 32),
	(33, 7, 33),
	(34, 8, 34),
	(35, 10, 35),
	(36, 13, 36),
	(37, 7, 37),
	(38, 8, 38),
	(39, 10, 39),
	(40, 13, 40),
	(41, 7, 41),
	(42, 8, 42),
	(43, 10, 43),
	(44, 13, 44),
	(45, 7, 45),
	(46, 8, 46),
	(47, 10, 47),
	(48, 13, 48),
	(49, 7, 49),
	(50, 8, 50),
	(51, 10, 51),
	(52, 13, 52),
	(53, 7, 53),
	(54, 8, 54),
	(55, 10, 55),
	(56, 13, 56),
	(57, 7, 57),
	(58, 8, 58),
	(59, 10, 59),
	(60, 13, 60),
	(61, 7, 61),
	(62, 8, 62),
	(63, 10, 63),
	(64, 13, 64),
	(65, 7, 65),
	(66, 8, 66),
	(67, 10, 67),
	(68, 13, 68),
	(69, 7, 69),
	(70, 8, 70),
	(71, 10, 71),
	(72, 13, 72),
	(73, 7, 73),
	(74, 8, 74),
	(75, 10, 75),
	(76, 13, 76),
	(77, 7, 77),
	(78, 8, 78),
	(79, 10, 79),
	(80, 13, 80),
	(81, 14, 81),
	(82, 15, 82),
	(83, 17, 83),
	(84, 20, 84),
	(85, 21, 85),
	(86, 22, 86),
	(87, 23, 87),
	(88, 24, 88),
	(89, 25, 89),
	(90, 26, 90),
	(91, 27, 91),
	(92, 28, 92),
	(93, 29, 93),
	(94, 30, 94),
	(95, 31, 95),
	(96, 32, 96),
	(97, 33, 97),
	(98, 34, 98),
	(99, 35, 99),
	(100, 36, 100),
	(101, 37, 101),
	(102, 38, 102),
	(103, 39, 103),
	(104, 40, 104),
	(105, 41, 105),
	(106, 42, 106),
	(107, 43, 107),
	(108, 44, 108),
	(109, 45, 109),
	(110, 46, 110),
	(111, 47, 111),
	(112, 48, 112),
	(113, 49, 113),
	(114, 50, 114),
	(115, 51, 115),
	(116, 52, 116),
	(117, 53, 117),
	(118, 54, 118),
	(119, 55, 119),
	(120, 56, 120),
	(121, 57, 121),
	(122, 58, 122),
	(123, 59, 123),
	(124, 60, 124),
	(125, 61, 125),
	(126, 62, 126),
	(127, 63, 127),
	(128, 64, 128),
	(129, 65, 129),
	(130, 66, 130),
	(131, 67, 131),
	(132, 68, 132),
	(133, 69, 133),
	(134, 70, 134),
	(135, 71, 135),
	(136, 72, 136);
/*!40000 ALTER TABLE `ART_text_section_combinations` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.conjunction
CREATE TABLE IF NOT EXISTS `conjunction` (
  `conjunction_id` int(11) NOT NULL AUTO_INCREMENT,
  `conjunction_name` varchar(45) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`conjunction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.conjunction: ~15 rows (approximately)
/*!40000 ALTER TABLE `conjunction` DISABLE KEYS */;
INSERT INTO `conjunction` (`conjunction_id`, `conjunction_name`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 'circmstance', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 'consequence', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 'value', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 'credible_source', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(5, NULL, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, NULL, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(7, 'added by ART', NULL, NULL, NULL, 'create', NULL),
	(8, 'added by ART', NULL, NULL, NULL, 'create', NULL),
	(9, 'added by ART', NULL, NULL, NULL, 'create', NULL),
	(10, 'added by ART', NULL, NULL, NULL, 'create', NULL),
	(11, 'added by ART', NULL, NULL, NULL, 'create', NULL),
	(12, 'added by ART', NULL, NULL, NULL, 'create', NULL),
	(13, 'added by ART', NULL, NULL, NULL, 'create', NULL),
	(14, 'added by ART', NULL, NULL, NULL, 'create', NULL),
	(15, 'added by ART', NULL, NULL, NULL, 'create', NULL);
/*!40000 ALTER TABLE `conjunction` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.consultation
CREATE TABLE IF NOT EXISTS `consultation` (
  `consultation_id` int(11) NOT NULL AUTO_INCREMENT,
  `practical_reasoning_as` int(11) DEFAULT NULL,
  `credible_source_as` int(11) DEFAULT NULL,
  `value_recognition_as` int(11) DEFAULT NULL,
  `consultation_info` text,
  PRIMARY KEY (`consultation_id`),
  KEY `practical_reasoning_as` (`practical_reasoning_as`),
  KEY `credible_source_as` (`credible_source_as`),
  KEY `value_recognition_as` (`value_recognition_as`),
  CONSTRAINT `consultation_ibfk_1` FOREIGN KEY (`practical_reasoning_as`) REFERENCES `practical_reasoning_as` (`practical_reasoning_as_id`) ON DELETE CASCADE,
  CONSTRAINT `consultation_ibfk_2` FOREIGN KEY (`credible_source_as`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  CONSTRAINT `consultation_ibfk_3` FOREIGN KEY (`value_recognition_as`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.consultation: ~4 rows (approximately)
/*!40000 ALTER TABLE `consultation` DISABLE KEYS */;
INSERT INTO `consultation` (`consultation_id`, `practical_reasoning_as`, `credible_source_as`, `value_recognition_as`, `consultation_info`) VALUES
	(1, 1, 4, 1, 'Library interests'),
	(2, 1, 4, 1, 'Industry interests'),
	(3, 1, 4, 1, 'Government interests'),
	(4, 1, 5, 6, 'Consultation LIBER');
/*!40000 ALTER TABLE `consultation` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.consultation_inst
CREATE TABLE IF NOT EXISTS `consultation_inst` (
  `consultation_inst_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultation` int(11) DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  PRIMARY KEY (`consultation_inst_id`),
  KEY `consultation` (`consultation`),
  KEY `user` (`user`),
  CONSTRAINT `consultation_inst_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `consultation_inst_ibfk_2` FOREIGN KEY (`consultation`) REFERENCES `consultation` (`consultation_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.consultation_inst: ~4 rows (approximately)
/*!40000 ALTER TABLE `consultation_inst` DISABLE KEYS */;
INSERT INTO `consultation_inst` (`consultation_inst_id`, `consultation`, `user`) VALUES
	(1, 4, 1),
	(2, 4, 2),
	(3, 4, 3),
	(4, 4, 4);
/*!40000 ALTER TABLE `consultation_inst` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.consult_proposition
CREATE TABLE IF NOT EXISTS `consult_proposition` (
  `consult_proposition_id` int(11) NOT NULL AUTO_INCREMENT,
  `credible_source_as` int(11) DEFAULT NULL,
  `proposition` int(11) DEFAULT NULL,
  PRIMARY KEY (`consult_proposition_id`),
  KEY `credible_source_as` (`credible_source_as`),
  KEY `proposition` (`proposition`),
  CONSTRAINT `consult_proposition_ibfk_1` FOREIGN KEY (`credible_source_as`) REFERENCES `credible_source_as` (`credible_source_as_id`) ON DELETE CASCADE,
  CONSTRAINT `consult_proposition_ibfk_2` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.consult_proposition: ~6 rows (approximately)
/*!40000 ALTER TABLE `consult_proposition` DISABLE KEYS */;
INSERT INTO `consult_proposition` (`consult_proposition_id`, `credible_source_as`, `proposition`) VALUES
	(1, 1, 1),
	(2, 2, 2),
	(3, 3, 3),
	(4, 4, 4),
	(5, 5, 5),
	(6, 6, 6);
/*!40000 ALTER TABLE `consult_proposition` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.consult_value
CREATE TABLE IF NOT EXISTS `consult_value` (
  `consult_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `credible_source_as` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  PRIMARY KEY (`consult_value_id`),
  KEY `credible_source_as` (`credible_source_as`),
  KEY `value` (`value`),
  CONSTRAINT `consult_value_ibfk_1` FOREIGN KEY (`credible_source_as`) REFERENCES `credible_source_as` (`credible_source_as_id`) ON DELETE CASCADE,
  CONSTRAINT `consult_value_ibfk_2` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.consult_value: ~3 rows (approximately)
/*!40000 ALTER TABLE `consult_value` DISABLE KEYS */;
INSERT INTO `consult_value` (`consult_value_id`, `credible_source_as`, `value`) VALUES
	(1, 16, 1),
	(2, 17, 2),
	(3, 18, 3);
/*!40000 ALTER TABLE `consult_value` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.credible_source_as
CREATE TABLE IF NOT EXISTS `credible_source_as` (
  `credible_source_as_id` int(11) NOT NULL AUTO_INCREMENT,
  `domain_source` int(11) DEFAULT NULL,
  `source_proposition` int(11) DEFAULT NULL,
  `domain_proposition` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`credible_source_as_id`),
  KEY `domain_source` (`domain_source`),
  KEY `source_proposition` (`source_proposition`),
  KEY `domain_proposition` (`domain_proposition`),
  CONSTRAINT `credible_source_as_ibfk_1` FOREIGN KEY (`domain_proposition`) REFERENCES `domain_proposition` (`domain_proposition_id`) ON DELETE CASCADE,
  CONSTRAINT `credible_source_as_ibfk_2` FOREIGN KEY (`source_proposition`) REFERENCES `source_proposition` (`source_proposition_id`) ON DELETE CASCADE,
  CONSTRAINT `credible_source_as_ibfk_3` FOREIGN KEY (`domain_source`) REFERENCES `domain_source` (`domain_source_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.credible_source_as: ~23 rows (approximately)
/*!40000 ALTER TABLE `credible_source_as` DISABLE KEYS */;
INSERT INTO `credible_source_as` (`credible_source_as_id`, `domain_source`, `source_proposition`, `domain_proposition`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 2, 2, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 3, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 4, 4, 4, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(5, 5, 5, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, 6, 6, 6, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(7, 7, 7, 7, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(8, 8, 8, 8, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(9, 9, 9, 9, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(10, 10, 10, 10, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(11, 11, 11, 11, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(12, 12, 12, 12, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(13, 13, 13, 13, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(14, 14, 14, 14, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(15, 15, 15, 15, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(16, 16, 16, 16, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(17, 17, 17, 17, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(18, 18, 18, 18, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(19, 19, 19, 19, '2012-08-21 15:17:50', NULL, NULL, 'create', 80),
	(20, 20, 20, 20, '2012-08-21 15:18:06', NULL, NULL, 'create', 84),
	(21, 21, 21, 21, '2012-08-21 15:33:24', NULL, NULL, 'create', 91),
	(22, 22, 22, 22, '2012-08-21 16:04:25', NULL, NULL, 'create', 98),
	(23, 23, 23, 23, '2012-08-21 16:07:11', NULL, NULL, 'create', 105);
/*!40000 ALTER TABLE `credible_source_as` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.credible_source_occurrence
CREATE TABLE IF NOT EXISTS `credible_source_occurrence` (
  `credible_source_occurrence_id` int(11) NOT NULL AUTO_INCREMENT,
  `conjunction` int(11) DEFAULT NULL,
  `credible_source_as` int(11) DEFAULT NULL,
  PRIMARY KEY (`credible_source_occurrence_id`),
  KEY `credible_source_as` (`credible_source_as`),
  KEY `conjunction` (`conjunction`),
  CONSTRAINT `credible_source_occurrence_ibfk_1` FOREIGN KEY (`credible_source_as`) REFERENCES `credible_source_as` (`credible_source_as_id`) ON DELETE CASCADE,
  CONSTRAINT `credible_source_occurrence_ibfk_2` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.credible_source_occurrence: ~15 rows (approximately)
/*!40000 ALTER TABLE `credible_source_occurrence` DISABLE KEYS */;
INSERT INTO `credible_source_occurrence` (`credible_source_occurrence_id`, `conjunction`, `credible_source_as`) VALUES
	(1, 4, 1),
	(2, 4, 2),
	(3, 4, 3),
	(4, 4, 4),
	(5, 4, 5),
	(6, 4, 6),
	(7, 4, 7),
	(8, 4, 8),
	(9, 4, 9),
	(10, 5, 10),
	(11, 5, 11),
	(12, 5, 12),
	(13, 5, 13),
	(14, 5, 14),
	(15, 5, 15);
/*!40000 ALTER TABLE `credible_source_occurrence` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.credible_source_ur
CREATE TABLE IF NOT EXISTS `credible_source_ur` (
  `credible_source_ur_id` int(11) NOT NULL AUTO_INCREMENT,
  `credible_source_as` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  `domain_source_resp` varchar(45) DEFAULT NULL,
  `domain_prop_resp` varchar(45) DEFAULT NULL,
  `source_prop_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`credible_source_ur_id`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `credible_source_as` (`credible_source_as`),
  CONSTRAINT `credible_source_ur_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  CONSTRAINT `credible_source_ur_ibfk_2` FOREIGN KEY (`credible_source_as`) REFERENCES `credible_source_as` (`credible_source_as_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.credible_source_ur: ~36 rows (approximately)
/*!40000 ALTER TABLE `credible_source_ur` DISABLE KEYS */;
INSERT INTO `credible_source_ur` (`credible_source_ur_id`, `credible_source_as`, `consultation_inst`, `domain_source_resp`, `domain_prop_resp`, `source_prop_resp`) VALUES
	(93, 10, 1, 'agree', 'agree', 'agree'),
	(94, 11, 1, 'agree', 'agree', 'agree'),
	(95, 12, 1, 'agree', 'agree', 'agree'),
	(96, 13, 1, 'agree', 'agree', 'agree'),
	(97, 14, 1, 'agree', 'agree', 'agree'),
	(98, 15, 1, 'agree', 'agree', 'agree'),
	(99, 18, 1, 'agree', 'agree', 'agree'),
	(100, 17, 1, 'agree', 'agree', 'agree'),
	(101, 16, 1, 'agree', 'agree', 'agree'),
	(102, 10, 2, 'agree', 'agree', 'agree'),
	(103, 11, 2, 'disagree', 'agree', 'agree'),
	(104, 12, 2, 'agree', 'agree', 'agree'),
	(105, 13, 2, 'agree', 'agree', 'agree'),
	(106, 14, 2, 'agree', 'agree', 'agree'),
	(107, 15, 2, 'agree', 'agree', 'agree'),
	(108, 18, 2, 'agree', 'agree', 'agree'),
	(109, 17, 2, 'agree', 'disagree', 'agree'),
	(110, 16, 2, 'agree', 'agree', 'agree'),
	(111, 10, 3, 'agree', 'agree', 'agree'),
	(112, 11, 3, 'agree', 'agree', 'agree'),
	(113, 12, 3, 'agree', 'agree', 'agree'),
	(114, 13, 3, 'agree', 'agree', 'agree'),
	(115, 14, 3, 'agree', 'agree', 'agree'),
	(116, 15, 3, 'agree', 'agree', 'agree'),
	(117, 18, 3, 'agree', 'agree', 'agree'),
	(118, 17, 3, 'agree', 'agree', 'agree'),
	(119, 16, 3, 'agree', 'agree', 'agree'),
	(120, 10, 4, 'agree', 'agree', 'agree'),
	(121, 11, 4, 'disagree', 'agree', 'agree'),
	(122, 12, 4, 'agree', 'agree', 'agree'),
	(123, 13, 4, 'agree', 'agree', 'agree'),
	(124, 14, 4, 'agree', 'agree', 'agree'),
	(125, 15, 4, 'agree', 'agree', 'agree'),
	(126, 18, 4, 'agree', 'agree', 'agree'),
	(127, 17, 4, 'agree', 'agree', 'agree'),
	(128, 16, 4, 'agree', 'agree', 'agree');
/*!40000 ALTER TABLE `credible_source_ur` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.domain
CREATE TABLE IF NOT EXISTS `domain` (
  `domain_id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  `domain_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`domain_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.domain: ~8 rows (approximately)
/*!40000 ALTER TABLE `domain` DISABLE KEYS */;
INSERT INTO `domain` (`domain_id`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`, `domain_name`) VALUES
	(1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL, 'online research'),
	(2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL, 'government information'),
	(3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL, 'publishers information'),
	(4, '2012-08-21 15:17:49', NULL, NULL, 'create', 7, ' is a new docum'),
	(5, '2012-08-21 15:18:05', NULL, NULL, 'create', 14, ' is a new docum'),
	(6, '2012-08-21 15:33:23', NULL, NULL, 'create', 85, 'test'),
	(7, '2012-08-21 16:04:24', NULL, NULL, 'create', 92, 'ew document for testing.\n'),
	(8, '2012-08-21 16:07:09', NULL, NULL, 'create', 99, 'version 1.');
/*!40000 ALTER TABLE `domain` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.domain_proposition
CREATE TABLE IF NOT EXISTS `domain_proposition` (
  `domain_proposition_id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` int(11) DEFAULT NULL,
  `proposition` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`domain_proposition_id`),
  KEY `domain` (`domain`),
  KEY `proposition` (`proposition`),
  CONSTRAINT `domain_proposition_ibfk_1` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE,
  CONSTRAINT `domain_proposition_ibfk_2` FOREIGN KEY (`domain`) REFERENCES `domain` (`domain_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.domain_proposition: ~23 rows (approximately)
/*!40000 ALTER TABLE `domain_proposition` DISABLE KEYS */;
INSERT INTO `domain_proposition` (`domain_proposition_id`, `domain`, `proposition`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 1, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 2, 4, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(5, 2, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, 2, 6, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(7, 3, 7, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(8, 3, 8, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(9, 3, 9, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(10, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(11, 1, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(12, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(13, 1, 4, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(14, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(15, 1, 6, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(16, 1, 7, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(17, 1, 8, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(18, 1, 9, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(19, 4, 10, '2012-08-21 15:17:50', NULL, NULL, 'create', 11),
	(20, 5, 11, '2012-08-21 15:18:05', NULL, NULL, 'create', 18),
	(21, 6, 12, '2012-08-21 15:33:24', NULL, NULL, 'create', 89),
	(22, 7, 13, '2012-08-21 16:04:25', NULL, NULL, 'create', 96),
	(23, 8, 14, '2012-08-21 16:07:10', NULL, NULL, 'create', 103);
/*!40000 ALTER TABLE `domain_proposition` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.domain_source
CREATE TABLE IF NOT EXISTS `domain_source` (
  `domain_source_id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` int(11) DEFAULT NULL,
  `source` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`domain_source_id`),
  KEY `domain` (`domain`),
  KEY `source` (`source`),
  CONSTRAINT `domain_source_ibfk_1` FOREIGN KEY (`source`) REFERENCES `source` (`source_id`) ON DELETE CASCADE,
  CONSTRAINT `domain_source_ibfk_2` FOREIGN KEY (`domain`) REFERENCES `domain` (`domain_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.domain_source: ~23 rows (approximately)
/*!40000 ALTER TABLE `domain_source` DISABLE KEYS */;
INSERT INTO `domain_source` (`domain_source_id`, `domain`, `source`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 2, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(5, 2, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, 2, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(7, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(8, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(9, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(10, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(11, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(12, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(13, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(14, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(15, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(16, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(17, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(18, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(19, 4, 6, '2012-08-21 15:17:49', NULL, NULL, 'create', 9),
	(20, 5, 7, '2012-08-21 15:18:05', NULL, NULL, 'create', 16),
	(21, 6, 8, '2012-08-21 15:33:23', NULL, NULL, 'create', 87),
	(22, 7, 9, '2012-08-21 16:04:24', NULL, NULL, 'create', 94),
	(23, 8, 10, '2012-08-21 16:07:10', NULL, NULL, 'create', 101);
/*!40000 ALTER TABLE `domain_source` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.external_info
CREATE TABLE IF NOT EXISTS `external_info` (
  `external_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `external_info_string` text,
  `external_info_property` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  PRIMARY KEY (`external_info_id`),
  KEY `consultation_inst` (`consultation_inst`),
  CONSTRAINT `external_info_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.external_info: ~0 rows (approximately)
/*!40000 ALTER TABLE `external_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `external_info` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.practical_reasoning_as
CREATE TABLE IF NOT EXISTS `practical_reasoning_as` (
  `practical_reasoning_as_id` int(11) NOT NULL AUTO_INCREMENT,
  `circumstances` int(11) DEFAULT NULL,
  `action` int(11) DEFAULT NULL,
  `consequences` int(11) DEFAULT NULL,
  `values` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`practical_reasoning_as_id`),
  KEY `circumstances` (`circumstances`),
  KEY `action` (`action`),
  KEY `consequences` (`consequences`),
  KEY `values` (`values`),
  CONSTRAINT `practical_reasoning_as_ibfk_1` FOREIGN KEY (`values`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  CONSTRAINT `practical_reasoning_as_ibfk_2` FOREIGN KEY (`circumstances`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  CONSTRAINT `practical_reasoning_as_ibfk_3` FOREIGN KEY (`action`) REFERENCES `action` (`action_id`) ON DELETE CASCADE,
  CONSTRAINT `practical_reasoning_as_ibfk_4` FOREIGN KEY (`consequences`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.practical_reasoning_as: ~4 rows (approximately)
/*!40000 ALTER TABLE `practical_reasoning_as` DISABLE KEYS */;
INSERT INTO `practical_reasoning_as` (`practical_reasoning_as_id`, `circumstances`, `action`, `consequences`, `values`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 1, 1, 2, 3, '0000-00-00 00:00:00', NULL, 0, 'create', 111),
	(2, 7, 4, 8, 9, '2012-08-23 16:46:24', NULL, NULL, 'create', 117),
	(3, 10, 5, 11, 12, '2012-08-24 06:41:32', NULL, NULL, 'create', 123),
	(4, 13, 6, 14, 15, '2012-08-24 06:42:31', NULL, NULL, 'create', 129);
/*!40000 ALTER TABLE `practical_reasoning_as` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.proposition
CREATE TABLE IF NOT EXISTS `proposition` (
  `proposition_id` int(11) NOT NULL AUTO_INCREMENT,
  `proposition_string` text,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`proposition_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.proposition: ~21 rows (approximately)
/*!40000 ALTER TABLE `proposition` DISABLE KEYS */;
INSERT INTO `proposition` (`proposition_id`, `proposition_string`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 'Some material held by publishers is not scanned, so it cannot be searched for', '0000-00-00 00:00:00', NULL, 0, 'create', 108),
	(2, 'Some material held by publishers is not scanned, so it cannot be used for marketing', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 'There is no exception to allow libraries to scan materials without seeking permission from the copyright holders', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 'All material held by publishers is scanned, so it can be searched for', '0000-00-00 00:00:00', NULL, 0, 'create', 109),
	(5, 'All material held by publishers is scanned, so it can be used for marketing', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, 'There is an exception to allow libraries to scan materials without seeking permission from the copyright holders', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(7, 'Clarifying the law demotes legal clarity', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(8, 'Clarifying the law is neutral to publisher profits', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(9, 'Clarifying the law promotes research, learning, and teaching', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(10, 'r testing', '2012-08-21 15:17:49', NULL, NULL, 'create', 10),
	(11, 'r testing', '2012-08-21 15:18:05', NULL, NULL, 'create', 17),
	(12, '', '2012-08-21 15:33:24', NULL, NULL, 'create', 88),
	(13, ' edit t', '2012-08-21 16:04:25', NULL, NULL, 'create', 95),
	(14, '', '2012-08-21 16:07:10', NULL, NULL, 'create', 102),
	(15, 'Scanning of copyright works is a form of copying.', '2012-08-23 16:46:23', NULL, NULL, 'create', 114),
	(16, 'As a result, any public or private initiative to scan entire collections of works must require that the copyright owner opt-in, rather than putting the onus on the copyright owner to opt-out of the initiative.', '2012-08-23 16:46:24', NULL, NULL, 'create', 115),
	(17, 'test1', '2012-08-24 06:41:31', NULL, NULL, 'create', 120),
	(18, 'test2', '2012-08-24 06:41:31', NULL, NULL, 'create', 121),
	(19, 'test2', '2012-08-24 06:42:30', NULL, NULL, 'create', 126),
	(20, 'test3', '2012-08-24 06:42:30', NULL, NULL, 'create', 127),
	(21, 'It is bizarre that in the Information Society Directive only 1 of the 21 exceptions is\nobligatory. This is the exception in article 5(1) which legalises cache copies.', '2012-08-27 15:11:45', NULL, NULL, 'create', 133);
/*!40000 ALTER TABLE `proposition` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.proposition_prur
CREATE TABLE IF NOT EXISTS `proposition_prur` (
  `proposition_prur_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultation_inst` int(11) DEFAULT NULL,
  `practical_reasoning_as` int(11) DEFAULT NULL,
  `proposition` int(11) DEFAULT NULL,
  `prop_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`proposition_prur_id`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `practical_reasoning_as` (`practical_reasoning_as`),
  KEY `proposition` (`proposition`),
  CONSTRAINT `proposition_prur_ibfk_1` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE,
  CONSTRAINT `proposition_prur_ibfk_2` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  CONSTRAINT `proposition_prur_ibfk_3` FOREIGN KEY (`practical_reasoning_as`) REFERENCES `practical_reasoning_as` (`practical_reasoning_as_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.proposition_prur: ~24 rows (approximately)
/*!40000 ALTER TABLE `proposition_prur` DISABLE KEYS */;
INSERT INTO `proposition_prur` (`proposition_prur_id`, `consultation_inst`, `practical_reasoning_as`, `proposition`, `prop_resp`) VALUES
	(25, 1, 1, 1, 'agree'),
	(26, 1, 1, 2, 'agree'),
	(27, 1, 1, 3, 'n/a'),
	(28, 1, 1, 4, 'disagree'),
	(29, 1, 1, 5, 'agree'),
	(30, 1, 1, 6, 'agree'),
	(31, 2, 1, 1, 'agree'),
	(32, 2, 1, 2, 'disagree'),
	(33, 2, 1, 3, 'agree'),
	(34, 2, 1, 4, 'agree'),
	(35, 2, 1, 5, 'agree'),
	(36, 2, 1, 6, 'agree'),
	(37, 3, 1, 1, 'agree'),
	(38, 3, 1, 2, 'disagree'),
	(39, 3, 1, 3, 'agree'),
	(40, 3, 1, 4, 'agree'),
	(41, 3, 1, 5, 'agree'),
	(42, 3, 1, 6, 'agree'),
	(43, 4, 1, 1, 'agree'),
	(44, 4, 1, 2, 'disagree'),
	(45, 4, 1, 3, 'agree'),
	(46, 4, 1, 4, 'agree'),
	(47, 4, 1, 5, 'agree'),
	(48, 4, 1, 6, 'agree');
/*!40000 ALTER TABLE `proposition_prur` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.prop_occurrence
CREATE TABLE IF NOT EXISTS `prop_occurrence` (
  `prop_occurrence_id` int(11) NOT NULL AUTO_INCREMENT,
  `proposition` int(11) DEFAULT NULL,
  `conjunction` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`prop_occurrence_id`),
  KEY `proposition` (`proposition`),
  KEY `conjunction` (`conjunction`),
  CONSTRAINT `prop_occurrence_ibfk_1` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  CONSTRAINT `prop_occurrence_ibfk_2` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.prop_occurrence: ~12 rows (approximately)
/*!40000 ALTER TABLE `prop_occurrence` DISABLE KEYS */;
INSERT INTO `prop_occurrence` (`prop_occurrence_id`, `proposition`, `conjunction`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 2, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 3, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 4, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(5, 5, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, 6, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(7, 15, 7, NULL, NULL, NULL, 'create', NULL),
	(8, 16, 8, NULL, NULL, NULL, 'create', NULL),
	(9, 17, 10, NULL, NULL, NULL, 'create', NULL),
	(10, 18, 11, NULL, NULL, NULL, 'create', NULL),
	(11, 19, 13, NULL, NULL, NULL, 'create', NULL),
	(12, 20, 14, NULL, NULL, NULL, 'create', NULL);
/*!40000 ALTER TABLE `prop_occurrence` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.source
CREATE TABLE IF NOT EXISTS `source` (
  `source_id` int(11) NOT NULL AUTO_INCREMENT,
  `source_name` varchar(45) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`source_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.source: ~11 rows (approximately)
/*!40000 ALTER TABLE `source` DISABLE KEYS */;
INSERT INTO `source` (`source_id`, `source_name`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 'Jim Jones', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 'May Hayes', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 'Tom Smith', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 'Hugh Grant', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(5, 'LIBER', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, '', '2012-08-21 15:17:49', NULL, NULL, 'create', 8),
	(7, '', '2012-08-21 15:18:05', NULL, NULL, 'create', 15),
	(8, '', '2012-08-21 15:33:23', NULL, NULL, 'create', 86),
	(9, ' edit t', '2012-08-21 16:04:24', NULL, NULL, 'create', 93),
	(10, '', '2012-08-21 16:07:10', NULL, NULL, 'create', 100),
	(11, '', '2012-08-27 15:11:45', NULL, NULL, 'create', 131);
/*!40000 ALTER TABLE `source` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.source_proposition
CREATE TABLE IF NOT EXISTS `source_proposition` (
  `source_proposition_id` int(11) NOT NULL AUTO_INCREMENT,
  `proposition` int(11) DEFAULT NULL,
  `source` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`source_proposition_id`),
  KEY `proposition` (`proposition`),
  KEY `source` (`source`),
  CONSTRAINT `source_proposition_ibfk_1` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE,
  CONSTRAINT `source_proposition_ibfk_2` FOREIGN KEY (`source`) REFERENCES `source` (`source_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.source_proposition: ~24 rows (approximately)
/*!40000 ALTER TABLE `source_proposition` DISABLE KEYS */;
INSERT INTO `source_proposition` (`source_proposition_id`, `proposition`, `source`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 2, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 3, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 4, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(5, 5, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, 6, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(7, 7, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(8, 8, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(9, 9, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(10, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(11, 2, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(12, 3, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(13, 4, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(14, 5, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(15, 6, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(16, 7, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(17, 8, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(18, 9, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(19, 10, 6, '2012-08-21 15:17:50', NULL, NULL, 'create', 12),
	(20, 11, 7, '2012-08-21 15:18:06', NULL, NULL, 'create', 19),
	(21, 12, 8, '2012-08-21 15:33:24', NULL, NULL, 'create', 90),
	(22, 13, 9, '2012-08-21 16:04:25', NULL, NULL, 'create', 97),
	(23, 14, 10, '2012-08-21 16:07:10', NULL, NULL, 'create', 104),
	(24, 21, 11, '2012-08-27 15:11:45', NULL, NULL, 'create', 135);
/*!40000 ALTER TABLE `source_proposition` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.user
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.user: ~4 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `user_name`) VALUES
	(1, 'George'),
	(2, 'test'),
	(3, 'steffen'),
	(4, 'steffen');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.value
CREATE TABLE IF NOT EXISTS `value` (
  `value_id` int(11) NOT NULL AUTO_INCREMENT,
  `value_name` text,
  `default_choice` varchar(45) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`value_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.value: ~6 rows (approximately)
/*!40000 ALTER TABLE `value` DISABLE KEYS */;
INSERT INTO `value` (`value_id`, `value_name`, `default_choice`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 'Legal clarity', 'demote', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 'Publisher profits', 'neutral', '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 'Research, learning, and teaching', 'promote', '0000-00-00 00:00:00', NULL, 0, 'create', 110),
	(4, 'interests of copyright owners will be safed', NULL, '2012-08-23 16:46:24', NULL, NULL, 'create', 116),
	(5, 'test3', NULL, '2012-08-24 06:41:32', NULL, NULL, 'create', 122),
	(6, 'test4', NULL, '2012-08-24 06:42:31', NULL, NULL, 'create', 128);
/*!40000 ALTER TABLE `value` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.value_occurrence
CREATE TABLE IF NOT EXISTS `value_occurrence` (
  `value_occurrence_id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) DEFAULT NULL,
  `conjunction` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`value_occurrence_id`),
  KEY `value` (`value`),
  KEY `conjunction` (`conjunction`),
  CONSTRAINT `value_occurrence_ibfk_1` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  CONSTRAINT `value_occurrence_ibfk_2` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.value_occurrence: ~6 rows (approximately)
/*!40000 ALTER TABLE `value_occurrence` DISABLE KEYS */;
INSERT INTO `value_occurrence` (`value_occurrence_id`, `value`, `conjunction`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 2, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 4, 9, NULL, NULL, NULL, 'create', NULL),
	(5, 5, 12, NULL, NULL, NULL, 'create', NULL),
	(6, 6, 15, NULL, NULL, NULL, 'create', NULL);
/*!40000 ALTER TABLE `value_occurrence` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.value_prur
CREATE TABLE IF NOT EXISTS `value_prur` (
  `value_prur_id` int(11) NOT NULL AUTO_INCREMENT,
  `practical_reasoning_as` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `value_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`value_prur_id`),
  KEY `practical_reasoning_as` (`practical_reasoning_as`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `value` (`value`),
  CONSTRAINT `value_prur_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  CONSTRAINT `value_prur_ibfk_2` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE,
  CONSTRAINT `value_prur_ibfk_3` FOREIGN KEY (`practical_reasoning_as`) REFERENCES `practical_reasoning_as` (`practical_reasoning_as_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.value_prur: ~12 rows (approximately)
/*!40000 ALTER TABLE `value_prur` DISABLE KEYS */;
INSERT INTO `value_prur` (`value_prur_id`, `practical_reasoning_as`, `consultation_inst`, `value`, `value_resp`) VALUES
	(13, 1, 1, 3, 'promote'),
	(14, 1, 1, 2, 'neutral'),
	(15, 1, 1, 1, 'promote'),
	(16, 1, 2, 3, 'promote'),
	(17, 1, 2, 2, 'demote'),
	(18, 1, 2, 1, 'promote'),
	(19, 1, 3, 3, 'promote'),
	(20, 1, 3, 2, 'neutral'),
	(21, 1, 3, 1, 'demote'),
	(22, 1, 4, 3, 'promote'),
	(23, 1, 4, 2, 'neutral'),
	(24, 1, 4, 1, 'demote');
/*!40000 ALTER TABLE `value_prur` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.value_recognition_as
CREATE TABLE IF NOT EXISTS `value_recognition_as` (
  `value_recognition_as_id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) DEFAULT NULL,
  `source` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`value_recognition_as_id`),
  KEY `value` (`value`),
  KEY `source` (`source`),
  CONSTRAINT `value_recognition_as_ibfk_1` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE,
  CONSTRAINT `value_recognition_as_ibfk_2` FOREIGN KEY (`source`) REFERENCES `source` (`source_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.value_recognition_as: ~6 rows (approximately)
/*!40000 ALTER TABLE `value_recognition_as` DISABLE KEYS */;
INSERT INTO `value_recognition_as` (`value_recognition_as_id`, `value`, `source`, `datetime`, `user`, `relation_id`, `mutation_sort`, `tsc_id`) VALUES
	(1, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(2, 2, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(3, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(4, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(5, 2, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL),
	(6, 3, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
/*!40000 ALTER TABLE `value_recognition_as` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.value_recognition_occurrence
CREATE TABLE IF NOT EXISTS `value_recognition_occurrence` (
  `value_recognition_occurrence_id` int(11) NOT NULL AUTO_INCREMENT,
  `conjunction` int(11) DEFAULT NULL,
  `value_recognition_as` int(11) DEFAULT NULL,
  PRIMARY KEY (`value_recognition_occurrence_id`),
  KEY `value_recognition_as` (`value_recognition_as`),
  KEY `conjunction` (`conjunction`),
  CONSTRAINT `value_recognition_occurrence_ibfk_1` FOREIGN KEY (`value_recognition_as`) REFERENCES `value_recognition_as` (`value_recognition_as_id`) ON DELETE CASCADE,
  CONSTRAINT `value_recognition_occurrence_ibfk_2` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.value_recognition_occurrence: ~3 rows (approximately)
/*!40000 ALTER TABLE `value_recognition_occurrence` DISABLE KEYS */;
INSERT INTO `value_recognition_occurrence` (`value_recognition_occurrence_id`, `conjunction`, `value_recognition_as`) VALUES
	(10, 6, 4),
	(11, 6, 5),
	(12, 6, 6);
/*!40000 ALTER TABLE `value_recognition_occurrence` ENABLE KEYS */;


-- Dumping structure for table impact_UoL_UvA_DB_v1_3.value_vrur
CREATE TABLE IF NOT EXISTS `value_vrur` (
  `value_vrur_id` int(11) NOT NULL AUTO_INCREMENT,
  `value_recognition_as` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `value_recog_resp` varchar(45) DEFAULT NULL,
  `source_endow_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`value_vrur_id`),
  KEY `value_recognition_as` (`value_recognition_as`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `value` (`value`),
  CONSTRAINT `value_vrur_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  CONSTRAINT `value_vrur_ibfk_2` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE,
  CONSTRAINT `value_vrur_ibfk_3` FOREIGN KEY (`value_recognition_as`) REFERENCES `value_recognition_as` (`value_recognition_as_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;

-- Dumping data for table impact_UoL_UvA_DB_v1_3.value_vrur: ~12 rows (approximately)
/*!40000 ALTER TABLE `value_vrur` DISABLE KEYS */;
INSERT INTO `value_vrur` (`value_vrur_id`, `value_recognition_as`, `consultation_inst`, `value`, `value_recog_resp`, `source_endow_resp`) VALUES
	(61, 6, 1, 3, 'agree', 'agree'),
	(62, 5, 1, 2, 'agree', 'agree'),
	(63, 4, 1, 1, 'agree', 'agree'),
	(64, 6, 2, 3, 'agree', 'agree'),
	(65, 5, 2, 2, 'agree', 'agree'),
	(66, 4, 2, 1, 'agree', 'agree'),
	(67, 6, 3, 3, 'agree', 'agree'),
	(68, 5, 3, 2, 'agree', 'agree'),
	(69, 4, 3, 1, 'agree', 'agree'),
	(70, 6, 4, 3, 'agree', 'agree'),
	(71, 5, 4, 2, 'agree', 'agree'),
	(72, 4, 4, 1, 'agree', 'agree');
/*!40000 ALTER TABLE `value_vrur` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
