SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `impact_UoL_UvA_DB_v1_4`
--
-- --------------------------------------------------------
--
-- Tabelstructuur voor tabel `action`
--

CREATE TABLE `action` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_name` text,
  `agent` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`action_id`),
  KEY `agent` (`agent`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Actions that can be executed.' AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `action`
--

INSERT INTO `action` VALUES(1, 'clarify the law.', 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `action` VALUES(2, 'scan material.', 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `agent`
--

CREATE TABLE `agent` (
  `agent_id` int(11) NOT NULL AUTO_INCREMENT,
  `agent_name` varchar(45) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`agent_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Gegevens worden uitgevoerd voor tabel `agent`
--

INSERT INTO `agent` VALUES(1, 'Legislators', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `agent` VALUES(2, 'Libraries', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ART_discussions`
--

CREATE TABLE `ART_discussions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier of the rows of this table',
  `issue_id` varchar(40) DEFAULT NULL,
  `title` varchar(255) NOT NULL COMMENT 'Title of the discussion',
  `intro` varchar(255) NOT NULL COMMENT 'Intoduction / description of this discussion',
  `timestamp_added` int(11) DEFAULT NULL COMMENT 'Timestamp of the time the row was added.',
  `added_by` int(11) DEFAULT NULL COMMENT 'User that added the row.',
  `timestamp_removed` int(11) DEFAULT NULL COMMENT 'Timestamp the row was removed.',
  `removed_by` int(11) DEFAULT NULL COMMENT 'User that removed the row.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=54 ;

--
-- Gegevens worden uitgevoerd voor tabel `ART_discussions`
--

INSERT INTO `ART_discussions` VALUES(28, '86172211160044268001323532628', 'Q1: Should there be encouragement or guidelines for contractual arrangements between right holders and users for the implementation of copyright exceptions?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(29, '86172211160424414001323532704', 'Q2: Should there be encouragement, guidelines or model licenses for contractual arrangements between right holders and users on other aspects not covered by copyright exceptions?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(30, '86172211160571292001323532770', 'Q3: Is an approach based on a list of non-mandatory exceptions adequate in the light of evolving Internet technologies and the prevalent economic and social expectations?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(31, '86172211160004862001323532811', 'Q4: Should certain categories of exceptions be made mandatory to ensure more legal certainty and better protection of beneficiaries of exceptions?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(32, '86172211160274349001323532960', 'Q5: If so, which ones?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(33, '86172211160338255001323533551', 'Q6: Should the exception for libraries and archives remain unchanged because publishers themselves will develop online access to their catalogues?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(34, '86172211160538262001323533595', 'Q7: In order to increase access to works, should publicly accessible libraries, educational establishments, museums and archives enter into licensing schemes with the publishers? Are there examples of successful licensing schemes for online access to libr', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(35, '86172211160684959001323533681', 'Q8: Should the scope of the exception for publicly accessible libraries, educational establishments, museums and archives be clarified with respect to: format shifting; The number of copies that can be made under the exception; The scanning of entire coll', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(36, '86172211160319722001323533736', 'Q9: Should the law be clarified with respect to whether the scanning of works held in libraries for the purpose of making their content searchable on the Internet goes beyond the scope of current exceptions to copyright?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(37, '86172211160975727001323533778', 'Q10: Is a further Community statutory instrument required to deal with the problem of orphan works, which goes beyond the Commission Recommendation 2006/585/EC of 24 August 2006?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(38, '86172211160577778001323533828', 'Q11: If so, should this be done by amending the 2001 Directive on Copyright in the information society or through a stand-alone instrument?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(39, '86172211160716819001323533881', 'Q12: How should the cross-border aspects of the orphan works issue be tackled to ensure EU-wide recognition of the solutions adopted in different Member States?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(40, '86172211160984157001323534441', 'Q13: Should people with a disability enter into licensing schemes with the publishers in order to increase their access to works? If so, what types of licensing would be most suitable? Are there already licensing schemes in place to increase access to wor', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(41, '86172211160042978001323534488', 'Q14: Should there be mandatory provisions that works are made available to people with a disability in a particular format?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(42, '86172211160499399001323534556', 'Q15: Should there be a clarification that the current exception benefiting people with a disability applies to disabilities other than visual and hearing disabilities?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(43, '86172211160900082001323534625', 'Q16: If so, which other disabilities should be included as relevant for online dissemination of knowledge?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(44, '86172211160332931001323534674', 'Q17: Should national laws clarify that beneficiaries of the exception for people with a disability should not be required to pay remuneration for using a work in order to convert it into an accessible format?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(45, '86172211160191863001323534726', 'Q18: Should Directive 96/9/EC on the legal protection of databases have a specific exception in favour of people with a disability that would apply to both original and sui generis databases?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(46, '86172211160427606001323535267', 'Q19: Should the scientific and research community enter into licensing schemes with publishers in order to increase access to works for teaching or research purposes? Are there examples of successful licensing schemes enabling online use of works for teac', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(47, '86172211160173963001323535315', 'Q20: Should the teaching and research exception be clarified so as to accommodate modern forms of distance learning?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(48, '86172211160893172001323535364', 'Q21: Should there be a clarification that the teaching and research exception covers not only material used in classrooms or educational facilities, but also use of works at home for study?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(49, '86172211160891869001323535412', 'Q22: Should there be mandatory minimum rules as to the length of the excerpts from works which can be reproduced or made available for teaching and research purposes?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(50, '86172211160075286001323535460', 'Q23: Should there be a mandatory minimum requirement that the exception covers both teaching and research?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(51, '86172211160628025001323537143', 'Q24: Should there be more precise rules regarding what acts end users can or cannot do when making use of materials protected by copyright?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(52, '86172211160349383001323537186', 'Q25: Should an exception for user-created content be introduced into the Directive?', '', NULL, NULL, NULL, NULL);
INSERT INTO `ART_discussions` VALUES(53, '86172211160967585001323537454', 'Q: Any other comments?', '', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ART_documents`
--

CREATE TABLE `ART_documents` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=33 ;

--
-- Gegevens worden uitgevoerd voor tabel `ART_documents`
--

-- INSERT INTO `ART_documents` VALUES(2, 2, 1, 'Neighbourhood center in Slotervaart', 'The living standards of Moroccan people in the Slotervaart neighbourhood in Amsterdam is low and criminality in this group is high. This is why the muncipality of Amsterdam should open several neighbourhood centers where people can meet each other and hang out and free courses are being given. This will result in a higher living standard of Moroccan people. This way the goal will be reached that criminality in this neighbourhood will drop to average levels. Also, the value of emancipating people will be promoted, which is broadly supported by society.', 'http://www.leibnizcenter.org/', NULL, NULL, NULL, NULL);
-- INSERT INTO `ART_documents` VALUES(3, 3, 1, 'Peroxide paradox', 'The handsome and dashing professor of evolutionary psychology, and arbiter of male taste, Kenny Clump, today stated that gentlemen prefer blondes because it fair hair reminds them of the sunny savannah. It is great to have this preference confirmed because I''m tired of hearing people dispute it. For example, that old fool Joachim Jolster, the editor of What Men Want who wrote that Jane Russell outshone Marilyn, conclusively proving that men prefer brunettes. And I have no time for detractors who say Kenny works for a peroxide company.', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `ART_documents` VALUES(4, 4, 1, 'MediaSet reply to Green Paper on Copyright in the Knowledge Economy', 'Green Paper on Copyright in the Knowledge Economy\n\nQuestionnaire \n\nResponse of Mediaset S.p.A. \n\n\n1 INTRODUCTION \n\n\nMediaset welcomes the opportunity to comment on the Commission\'s Green Paper on Copyright in the Knowledge Economy (hereinafter the "Green Paper"). Mediaset, with its core business in the information and entertainment industries, invests as a content provider on all the available distribution platforms: analogue and digital terrestrial television, mobile and Internet. It is, therefore, naturally interested in any ongoing discussion in relation to Directive 2001/29/EC on the harmonisation of certain aspects of copyright and related rights in the information society ("the Directive"). \n\nMediaset\'s views are set out below in response to the questions put forward by the Green Paper. \n\nAs a preliminary remark, Mediaset would like to refer to the fact that it already acts both as an online content producer and provider. As it will be shown below, this is relevant in so far as the Green Paper seeks views on the possibility to introduce a specific exception for the so-called \n"User-created content" ("UCC"). \n\nThe initial hype of the late nineties has now passed a major reality check: the very novelty introduced by Internet social networking ventures, as far as creative content is concerned, consists of databases aggregating existing copyrighted materials successfully conveyed to \nInternet users through a pervasive platform that allows distribution on a commercial scale. The economies of scale facilitated by these new distribution activities rely entirely on the capacity of \n"traditional" stakeholders in the content industry to bear production investments and correlated risks. Whether access is granted for free or paid for, suffice to say that the kind of exploitation on \na large commercial scale enabled by social networking Internet platforms goes beyond the definition of "fair use" that rightly applies to niche services, catering for the needs of small communities of users sharing a common social or scientific purpose. \n\n\n2 GENERAL ISSUES - QUESTIONS 1 TO 5 \n\n\nIn reply to Questions 1-5, and as a general comment on the envisaged possibility of amending the current legislative framework on copyright, Mediaset\'s position is that any amendment would be premature at this stage. The current legal framework provides a good balance between the interest of the copyright holders and that of individual users. \n\nAs acknowledged by the Directive (Recital 10) the investment required to produce products which are then protected by copyright is considerable. Therefore, any envisaged amendment to the current legal framework should always bear in mind that copyright protection should not be weakened and that copyright holders\' interests should be a priority.1 \n\nThe Directive already provides for a very comprehensive list of exceptions which users can benefit from. Moreover, the Directive was issued at a time in which Internet technologies could be appraised (and were indeed appraised by the relevant stakeholders): since then, there has not been any change, sufficient to warrant an amendment to the list of exceptions. In particular, the so-called "transformative" works are already protected under the current legislative framework, to the extent that they satisfy the criteria for copyright protection (e.g. with regard to their creative element). As will be addressed more in detail further below in reply to the Questions related to UCC, the introduction of new exceptions or the widening of the scope of the existing exceptions might benefit for-profit undertakings rather than users themselves, as pending (and past) judicial proceedings for copyright infringement in relation to the upload of copyrighted materials on Internet platforms demonstrate. Indeed, copyright protection is all the more important in the audiovisual sector, and exceptions to it should therefore be very limited: it is fundamental to protect content owners for their high-risk and capital-intensive activities. In fact, any departure from copyright protection might have a very serious impact on the willingness of content producers/providers to finance, produce and distribute audio-visual works in Europe. In order to foster creativity, the regulatory framework should always aim at ensuring that copyright holders can recoup their investments by having exclusive management of the exploitation of their rights. \n\nFinally, it has to be noted that legal certainty in relation to the exceptions is provided by the implementing national legislation (i.e. mandatory legislation); making the exceptions contained in the Directive mandatory rather than voluntary would not have any impact on legal certainty as far as users\' benefit is concerned. \n\n3 EXCEPTIONS: SPECIFIC ISSUES - USER CREATED CONTENT \n\n\n(a) Question 24: Should there be more precise rules regarding what acts end users can or cannot do when making use of materials protected by copyright? \n\n\nAs the Green Paper correctly points out, "there is a significant difference between user-created content and existing content that is simply uploaded by users and is typically protected by copyright". Also, the OECD study mentioned in the Green Paper defines UCC as "content made publicly available over the Internet, which reflects a certain amount of creative effort, and which is created outside of professional routines and practices" (emphasis added). \n\nMediaset believes that the current legal framework already provides the means to foster UCC: if a specific UCC is original in nature and is made of newly created content, it will be protected by copyright law as it currently stands; if, on the other hand, a specific UCC is a "transformative" work, the user will have to obtain licence/consent from the copyright holder of the original work.\n \nMediaset strongly believes that this latter scenario needs to remain unchanged in order to protect the interests of the rightholders of the original work, who have invested (also from a financial point of view) in the original creative effort and must be protected against any copyright infringement which would hamper the full exploitation of their rights. New technologies have not fostered creativity, they have simply introduced new forms of expression of such creativity. In many cases, new technologies have made reproduction and global diffusion of contents easier, regardless of whether such contents are "creative" or whether they are simply copies of copyrighted materials, the production cost of which has been borne by the right-holders who made the first communication to the public possible. Therefore, real creative efforts, in whatever forms they take, must be protected and the current legal framework already provides the necessary tools for such protection. \n\nAs Mediaset mentioned in the context of the Commission\'s consultation on Creative Content online, the respect of copyright by online users is fundamental to the full development of the distribution of content online: the fight against piracy is a pre-requisite in assuring rightholders that their rights will be protected and is fundamental for the development of online services. \n\nIt is Mediaset\'s opinion that the introduction of a specific exception related to UCC would create a legal framework in which for-profit Internet platforms (such as YouTube) would be relieved from any responsibility for the upload of copyrighted works for which no licence or consent has been given by the original copyright holder. This would run counter to the essential need of adequately protecting the interests of copyright holders. \n\nThe scenario described above is of great concern to Mediaset. In fact, one should bear in mind that in many cases (as is the case with Mediaset), the copyright holder already distributes the same content through its own distribution platforms (including the Internet). Opening the way for the same content to be uploaded on other (competing) platforms would be contrary to the same basic principles of copyright law and detrimental to the financial and creative efforts made by content providers such as Mediaset. \n\nIndeed, for-profit Internet platforms (e.g. YouTube, Facebook, MySpace) might advocate for a UCC-specific exception because their business model hinges entirely on the content which is uploaded by end-users on their platforms. However, most of this content is protected by copyright either totally or partially. A UCC-specific exception would allow YouTube-like platforms to use copyrighted materials without the need to obtain a licence for it, thereby depriving legitimate copyright holders of a source of income. Rights clearance is an administrative pre-requisite that any broadcaster complies with, prior to airing its content, whether produced in-house or acquired from third parties. Moreover, as mentioned, in Mediaset\'s case, the same copyrighted work is distributed on Mediaset-owned Internet platforms: allowing the upload of Mediaset\'s copyrighted materials without Mediaset\'s consent would be contrary to the very essence of Mediaset\'s copyrights. One of the main sources of income of YouTube-like platforms is the sale of advertising "space" on their websites, which they sell according to the "attractiveness" of the uploaded content. Copyright infringements thus enable unfair competition. \nYouTube-like platforms, therefore, should be required to obtain clearance from the copyright holders before the copyrighted material is uploaded and copyright holders should not be forced to constantly monitor the material which is uploaded on such platforms in order to verify whether their copyrights have been infringed. \n\nAs demonstrated by a number of judgements and pending judicial proceedings, the scenario described above is not a fictitious one: it is real and it has already given rise to a significant number of legal disputes in many countries, within and outside the European Union. \n\nReference should also be made to neighbouring rights, as their protection is very important for all creative content producers and distributors; moreover, broadcasters enjoy these rights and ensure that the necessary protection to copyright of artists and content providers is granted. \nMediaset, in its quality of both producer and broadcaster of creative content, has the exclusive right, inter alia, to: (i) authorise the direct or indirect reproduction in any form whatsoever of the original works on which it holds the copyright, and (ii) authorise third parties to make the original works and the copies on which it holds copyrights available to the public. This latter right is not subject to exhaustion. This is what the Italian Copyright Law provides, which is also coherent with the approach taken by Article 14(3) of the TRIPS Agreement. YouTube-like platforms, therefore, should bear clear and full legal responsibility for copyrighted materials uploaded on their websites without the consent of the copyright holders. \n\nFinally, making licensing of copyrighted work easier for users would incentivise the more rudimentary forms of creation to the detriment of the creative effort of those involved in the production process and of the significant investments that enabled the development of original creative works. \n\nIn the light of the foregoing, Mediaset does not believe that it is necessary to introduce any rule with reference to what end users can or cannot do when making use of materials protected by copyright. In this respect, Mediaset believes that the current legislative and regulatory framework is capable of covering all of the relevant issues and circumstances. In particular, Mediaset believes that a strict application of the so-called Berne three-step test along with the existing system of exceptions already provide opportunities to those users whose activities and genuine intentions are to "create" a new original work, while at the same time discouraging mere copies and illegal distribution of copyrighted materials. \n\nHowever, also in the light of the issue discussed above, the Commission might wish to explore the possibility of clarifying the situation as regards "third parties" such as YouTube-like platforms, codifying and making it clear that the uploading of copyrighted materials on their websites, without the express consent of the relevant copyright holders, constitutes a copyright infringement for which these entities must bear responsibility. \n\n(b) Question 25: Should an exception for user-created content be introduced into the \nDirective? \n\n\nIn the light of all the above considerations, Mediaset calls on the Commission not to impose any specific model nor to introduce any exception in relation to UCC. \n\n \n***** \n\n \nIn conclusion, Mediaset hopes that the specific replies to the questions raised in the Green Paper will provide the Commission with useful input for a thorough appraisal of the fundamental issues at stake. \n\nMediaset looks forward to the results of the consultation taking place in this respect and is confident that consistent application of existing national, EU and TRIPs provisions to all new forms of creating, compiling and distributing copyrighted materials will benefit the entire value chain in the creative content industry. A lawful proliferation of new services will indeed curb the phenomenon of free-riders, thus enabling both economic growth and knowledge dissemination in the information society. \n\n\nMediaset S.p.A., 28 November 2008 \n\n\n', 'https://circabc.europa.eu/d/d/workspace/SpacesStore/96fb4b45-5ed9-400d-aa8f-bb618c6fd3d7/mediaset.pdf', NULL, NULL, NULL, NULL);
-- INSERT INTO `ART_documents` VALUES(5, 2, 2, 'Neighbourhood center in Slotervaart', 'The living standards of Asian people in the Slotervaart neighbourhood in Amsterdam is low and criminality in this group is high. This is why the muncipality of Amsterdam should open several neighbourhood centers where people can meet each other and hang out and free courses are being given. This will result in a higher living standard of Moroccan people. This way the goal will be reached that criminality in this neighbourhood will drop to average levels. Also, the value of emancipating people will be promoted, which isdd broadly supported by society.dd', 'http://www.leibnizcenter.org/', NULL, NULL, NULL, NULL);
INSERT INTO `ART_documents` VALUES(7, 7, 1, 'SIIA reply to Green Paper on Copyright in the Knowledge Economy (Q9, 11, 12, 24)', '(9) Should the law be clarified with respect to whether the scanning of works held in libraries for the purpose of making their content searchable on the Internet goes beyond the scope of current exceptions to copyright\n\nScanning of copyright works is a form of copying and as such is generally prohibited under the Berne Convention and copyright laws of countries around the globe unless the copier has first obtained the copyright owner\'s authorization to scan the work(s). The ultimate purpose of the scanning -- e.g., for indexing, cataloguing, searching or some other purpose -- should have no bearing on the ultimate determination that a copy is being made and that such activity requires the authorization of the copyright owner. As a result, any public or private initiative to scan entire collections of works must require that the copyright owner opt-in, rather than putting the onus on the copyright owner to opt-out of the initiative. We do not believe that there needs to be any further clarification in the law in this area. To the best of our knowledge no court has ever held that such large-scale scanning activities are not prohibited under copyright law.\n\n(11) If so, should this be done by amending the 2001 Directive on Copyright in the information society or through a stand-alone instrument\n\nWhile we do not support such an approach, to the extent that an orphan works standard is adopted throughout the EU, we recommend that a Community statutory instrument dealing with the problem of orphan works should be a stand-alone instrument. As noted above, an orphan works defense would not be an exception to copyright infringement. The orphan works defense is a rights clearance mechanism that would merely serve to limit the legal remedies that a user would be subject to if that user was found liable for copyright infringement. Accordingly, a user of an orphan works owner is still deemed to be an infringer. Because the 2001 Copyright Directive relates to rights and exceptions, but not remedies, it would be inappropriate for the Directive to be amended to include a provision relating to orphan works.\n\n(12) How should the cross-border aspects of the orphan works issue be tackled to ensure EU-wide recognition of the solutions adopted in different Member States?\nSee response to question 11.\n\n(24) Should there be more precise rules regarding what acts end users can or cannot do when making use of materials protected by copyright\n\nUser-created content is not a new concept. Use of a copyrighted work implicates the copyright owner\'s right to control the adaptation of his or her work. (This is often referred to as the right to create a derivative work or the modification right). When someone uses a copyrighted work to create a new copyrighted work there are three possible outcomes: (1) they are licensed by the copyright owner or otherwise permitted by some exception in the law to create a derivative work and therefore there is no infringement; (2) they are using such a small amount of the copyrighted work or nonprotectable aspects of the copyrighted work that the use does not implicate the copyright owner\'s reproduction or adaptation rights under copyright law and therefore there is no infringement; or (3) they are not licensed by the copyright owner to create a derivative work and are using sufficient protectable expression from the copyrighted work that the use implicates the copyright owner\'s reproduction and adaptation rights which results in an infringement. This has been the law for many years. Although, with the advent of new digital technologies, it may be easier than ever to create derivative works, there is no reason to change these long-standing, well-established copyright rules.\nThe issue of user-created content is primarily one of education. Until recently, most people did not have the capability to use someone else\'s creation to create a new work. Copying was too difficult or expensive. As a result, your average person did not need to have even a rudimentary understanding of copyright rules. But now, anyone can be a publisher. Itâ€™s easy and inexpensive. While this presents great new possibilities, it also poses great challenges and risks for copyright owners. Governments and educators need to do a better job educating the public on what they can and cannot do with copyrighted works. The public needs to better understand the purpose and goals of the copyright law and the sanctions for violating it. In short, the rules of the road do not need to be changed, the people who drive on the road need to better understand the rules.', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ART_relations_discussions`
--

CREATE TABLE `ART_relations_discussions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `relation_id` int(11) NOT NULL,
  `relation_sort` varchar(25) NOT NULL,
  `discussion` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `discussion` (`discussion`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Gegevens worden uitgevoerd voor tabel `ART_relations_discussions`
--

INSERT INTO `ART_relations_discussions` VALUES(2, 10, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(3, 11, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(4, 12, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(5, 13, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(6, 14, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(7, 15, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(8, 16, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(9, 17, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(10,18, 'credible_source_as', 36);
INSERT INTO `ART_relations_discussions` VALUES(11, 1, 'practical_reasoning_as', 36);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ART_text_sections`
--

CREATE TABLE `ART_text_sections` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Gegevens worden uitgevoerd voor tabel `ART_text_sections`
--

-- INSERT INTO `ART_text_sections` VALUES(1, 5, 'Text section 1 (doc 5)', 300, 400, NULL, NULL, NULL, NULL);
-- INSERT INTO `ART_text_sections` VALUES(2, 3, 'Text section 2 (doc 3)', 0, 153, NULL, NULL, NULL, NULL);
-- INSERT INTO `ART_text_sections` VALUES(3, 2, 'Text section 3 (doc 2)', 0, 0, NULL, NUcredible_source_ur_ibfk_1LL, NULL, NULL);
-- INSERT INTO `ART_text_sections` VALUES(4, NULL, 'TS 4', 0, 0, NULL, NULL, NULL, NULL);
-- INSERT INTO `ART_text_sections` VALUES(5, NULL, 'TS 5', 0, 0, NULL, NULL, NULL, NULL);
-- INSERT INTO `ART_text_sections` VALUES(6, 32, 'TS 6', 155, 200, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `ART_text_section_combinations`
--

CREATE TABLE `ART_text_section_combinations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text_section_id` int(11) NOT NULL,
  `combination_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Gegevens worden uitgevoerd voor tabel `ART_text_section_combinations`
--

-- INSERT INTO `ART_text_section_combinations` VALUES(1, 1, 1);
-- INSERT INTO `ART_text_section_combinations` VALUES(2, 2, 1);
-- INSERT INTO `ART_text_section_combinations` VALUES(3, 3, 3);
-- INSERT INTO `ART_text_section_combinations` VALUES(4, 4, 4);
-- INSERT INTO `ART_text_section_combinations` VALUES(5, 5, 5);
-- INSERT INTO `ART_text_section_combinations` VALUES(6, 6, 6);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `conjunction`
--

CREATE TABLE `conjunction` (
  `conjunction_id` int(11) NOT NULL AUTO_INCREMENT,
  `conjunction_name` varchar(45) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`conjunction_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5;

--
-- Gegevens worden uitgevoerd voor tabel `conjunction`
--

INSERT INTO `conjunction` VALUES(1, 'circmstance', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `conjunction` VALUES(2, 'consequence', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `conjunction` VALUES(3, 'value', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `conjunction` VALUES(4, 'credible_source', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `conjunction` VALUES(5, 'credible_source', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `conjunction` VALUES(6, 'value_recognition', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `conjunction` VALUES(7, 'value_credible_source', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `consultation`
--

CREATE TABLE `consultation` (
  `consultation_id` int(11) NOT NULL AUTO_INCREMENT,
  `practical_reasoning_as` int(11) DEFAULT NULL,
  `credible_source_as` int(11) DEFAULT NULL,  
  `value_credible_source_as` int(11) DEFAULT NULL,
  `value_recognition_as` int(11) DEFAULT NULL,
  `consultation_info` text,
  PRIMARY KEY (`consultation_id`),
  KEY `practical_reasoning_as` (`practical_reasoning_as`),
  KEY `credible_source_as` (`credible_source_as`),
  KEY `value_credible_source_as` (`value_credible_source_as`),
  KEY `value_recognition_as` (`value_recognition_as`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4;

--
-- Gegevens worden uitgevoerd voor tabel `consultation`
--

-- INSERT INTO `consultation` VALUES(1, 1, 4, 7, 6,'Library interests');
-- INSERT INTO `consultation` VALUES(2, 1, 4, 7, 6,'Industry interests');
-- INSERT INTO `consultation` VALUES(3, 1, 4, 7, 6,'Government interests');
INSERT INTO `consultation` VALUES(4, 1, 5, 7, 6,'Consultation LIBER');
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `consultation_inst`
--

CREATE TABLE `consultation_inst` (
  `consultation_inst_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultation` int(11) DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  PRIMARY KEY (`consultation_inst_id`),
  KEY `consultation` (`consultation`),
  KEY `user` (`user`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `consult_proposition`
--

/*CREATE TABLE `consult_proposition` (
  `consult_proposition_id` int(11) NOT NULL AUTO_INCREMENT,
  `credible_source_as` int(11) DEFAULT NULL,
  `proposition` int(11) DEFAULT NULL,
  PRIMARY KEY (`consult_proposition_id`),
  KEY `credible_source_as` (`credible_source_as`),
  KEY `proposition` (`proposition`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Gegevens worden uitgevoerd voor tabel `consult_proposition`
--

INSERT INTO `consult_proposition` VALUES(1, 1, 1);
INSERT INTO `consult_proposition` VALUES(2, 2, 2);
INSERT INTO `consult_proposition` VALUES(3, 3, 3);
INSERT INTO `consult_proposition` VALUES(4, 4, 4);
INSERT INTO `consult_proposition` VALUES(5, 5, 5);
INSERT INTO `consult_proposition` VALUES(6, 6, 6);*/

-- --------------------------------------------------------

/*--
-- Tabelstructuur voor tabel `consult_value`
--

CREATE TABLE `consult_value` (
  `consult_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `credible_source_as` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  PRIMARY KEY (`consult_value_id`),
  KEY `credible_source_as` (`credible_source_as`),
  KEY `value` (`value`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `consult_value`
--

INSERT INTO `consult_value` VALUES(1, 16, 1);
INSERT INTO `consult_value` VALUES(2, 17, 2);
INSERT INTO `consult_value` VALUES(3, 18, 3);*/

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `credible_source_as`
--

CREATE TABLE `credible_source_as` (
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
  KEY `domain_proposition` (`domain_proposition`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Gegevens worden uitgevoerd voor tabel `credible_source_as`
--

-- INSERT INTO `credible_source_as` VALUES(1, 1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `credible_source_as` VALUES(2, 2, 2, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `credible_source_as` VALUES(3, 3, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `credible_source_as` VALUES(4, 4, 4, 4, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `credible_source_as` VALUES(5, 5, 5, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `credible_source_as` VALUES(6, 6, 6, 6, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `credible_source_as` VALUES(7, 7, 7, 7, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `credible_source_as` VALUES(8, 8, 8, 8, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `credible_source_as` VALUES(9, 9, 9, 9, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

INSERT INTO `credible_source_as` VALUES(10, 10, 10, 10, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `credible_source_as` VALUES(11, 11, 11, 11, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `credible_source_as` VALUES(12, 12, 12, 12, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `credible_source_as` VALUES(13, 13, 13, 13, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `credible_source_as` VALUES(14, 14, 14, 14, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `credible_source_as` VALUES(15, 15, 15, 15, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `credible_source_as` VALUES(16, 16, 16, 16, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `credible_source_as` VALUES(17, 17, 17, 17, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `credible_source_as` VALUES(18, 18, 18, 18, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);


-- ----------------------------------------------------------------------------------------------------------------

--
-- Tabelstructuur voor tabel `credible_source_occurrence`
--

CREATE TABLE `credible_source_occurrence` (
  `credible_source_occurrence_id` int(11) NOT NULL AUTO_INCREMENT,
  `conjunction` int(11) DEFAULT NULL,
  `credible_source_as` int(11) DEFAULT NULL,
  PRIMARY KEY (`credible_source_occurrence_id`),
  KEY `credible_source_as` (`credible_source_as`),
  KEY `conjunction` (`conjunction`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Gegevens worden uitgevoerd voor tabel `credible_source_occurrence`
--

-- INSERT INTO `credible_source_occurrence` VALUES(1, 4, 1);
-- INSERT INTO `credible_source_occurrence` VALUES(2, 4, 2);
-- INSERT INTO `credible_source_occurrence` VALUES(3, 4, 3);
-- INSERT INTO `credible_source_occurrence` VALUES(4, 4, 4);
-- INSERT INTO `credible_source_occurrence` VALUES(5, 4, 5);
-- INSERT INTO `credible_source_occurrence` VALUES(6, 4, 6);
-- INSERT INTO `credible_source_occurrence` VALUES(7, 4, 7);
-- INSERT INTO `credible_source_occurrence` VALUES(8, 4, 8);
-- INSERT INTO `credible_source_occurrence` VALUES(9, 4, 9);

INSERT INTO `credible_source_occurrence` VALUES(10, 5, 10);
INSERT INTO `credible_source_occurrence` VALUES(11, 5, 11);
INSERT INTO `credible_source_occurrence` VALUES(12, 5, 12);
INSERT INTO `credible_source_occurrence` VALUES(13, 5, 13);
INSERT INTO `credible_source_occurrence` VALUES(14, 5, 14);
INSERT INTO `credible_source_occurrence` VALUES(15, 5, 15);
-- ------------------------------------------------------------------------------------------------

-- --------------------------------------------------------
--
-- Tabelstructuur voor tabel `value_credible_source_as`
--

CREATE TABLE `value_credible_source_as` (
  `value_credible_source_as_id` int(11) NOT NULL AUTO_INCREMENT,
  `domain_source` int(11) DEFAULT NULL,
  `action` int(11) DEFAULT NULL,
  `value_occurrence_default_choice` int(11) DEFAULT NULL,
   `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`value_credible_source_as_id`),
  KEY `domain_source` (`domain_source`),
  KEY `action` (`action`),
  KEY `value_occurrence_default_choice` (`value_occurrence_default_choice`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;


INSERT INTO `value_credible_source_as` VALUES(1, 10, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `value_credible_source_as` VALUES(2, 10, 1, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `value_credible_source_as` VALUES(3, 10, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `credible_source_occurrence`
--

CREATE TABLE `value_credible_source_occurrence` (
  `value_credible_source_occurrence_id` int(11) NOT NULL AUTO_INCREMENT,
  `conjunction` int(11) DEFAULT NULL,
  `value_credible_source_as` int(11) DEFAULT NULL,
  PRIMARY KEY (`value_credible_source_occurrence_id`),
  KEY `value_credible_source_as` (`value_credible_source_as`),
  KEY `conjunction` (`conjunction`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;


INSERT INTO `value_credible_source_occurrence` VALUES(1, 7, 1);
INSERT INTO `value_credible_source_occurrence` VALUES(2, 7, 2);
INSERT INTO `value_credible_source_occurrence` VALUES(3, 7, 3);

-- --------------------------------------------------------
--
-- Tabelstructuur voor tabel `credible_source_ur`
--

CREATE TABLE `credible_source_ur` (
  `credible_source_ur_id` int(11) NOT NULL AUTO_INCREMENT,
  `credible_source_as` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  `domain_source_resp` varchar(45) DEFAULT NULL,
  `domain_prop_resp` varchar(45) DEFAULT NULL,
  `source_prop_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`credible_source_ur_id`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `credible_source_as` (`credible_source_as`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=93 ;

-- --------------------------------------------------------
--
-- Tabelstructuur voor tabel `credible_source_ur`
--

CREATE TABLE `value_credible_source_ur` (
  `value_credible_source_ur_id` int(11) NOT NULL AUTO_INCREMENT,
  `value_credible_source_as` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  `domain_source_resp` varchar(45) DEFAULT NULL,
  `domain_action_value_resp` varchar(45) DEFAULT NULL,
  `source_action_value_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`value_credible_source_ur_id`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `value_credible_source_as` (`value_credible_source_as`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=93 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `domain`
--

CREATE TABLE `domain`(
  `domain_id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  `domain_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`domain_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `domain`
--

INSERT INTO `domain` VALUES(1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL, 'online research');
INSERT INTO `domain` VALUES(2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL, 'government information');
INSERT INTO `domain` VALUES(3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL, 'publishers information');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `domain_proposition`
--

CREATE TABLE `domain_proposition` (
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
  KEY `proposition` (`proposition`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Gegevens worden uitgevoerd voor tabel `domain_proposition`
--

INSERT INTO `domain_proposition` VALUES(1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(2, 1, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(3, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(4, 2, 4, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(5, 2, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(6, 2, 6, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(7, 3, 7, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(8, 3, 8, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(9, 3, 9, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

INSERT INTO `domain_proposition` VALUES(10, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(11, 1, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(12, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(13, 1, 4, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(14, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(15, 1, 6, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(16, 1, 7, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(17, 1, 8, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_proposition` VALUES(18, 1, 9, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `domain_source`
--

CREATE TABLE `domain_source` (
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
  KEY `source` (`source`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Gegevens worden uitgevoerd voor tabel `domain_source`
--

-- INSERT INTO `domain_source` VALUES(1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `domain_source` VALUES(2, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `domain_source` VALUES(3, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `domain_source` VALUES(4, 2, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `domain_source` VALUES(5, 2, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `domain_source` VALUES(6, 2, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `domain_source` VALUES(7, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `domain_source` VALUES(8, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `domain_source` VALUES(9, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

INSERT INTO `domain_source` VALUES(10, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_source` VALUES(11, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_source` VALUES(12, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_source` VALUES(13, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_source` VALUES(14, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_source` VALUES(15, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_source` VALUES(16, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_source` VALUES(17, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `domain_source` VALUES(18, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `external_info`
--

CREATE TABLE `external_info` (
  `external_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `external_info_string` text,
  `external_info_property` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  PRIMARY KEY (`external_info_id`),
  KEY `consultation_inst` (`consultation_inst`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `practical_reasoning_as`
--

CREATE TABLE `practical_reasoning_as` (
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
  KEY `values` (`values`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Gegevens worden uitgevoerd voor tabel `practical_reasoning_as`
--

INSERT INTO `practical_reasoning_as` VALUES(1, 1, 1, 2, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `proposition`
--

CREATE TABLE `proposition` (
  `proposition_id` int(11) NOT NULL AUTO_INCREMENT,
  `proposition_string` text,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`proposition_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Gegevens worden uitgevoerd voor tabel `proposition`
--

INSERT INTO `proposition` VALUES(1, 'Some material held by publishers is not scanned, so it cannot be searched for', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `proposition` VALUES(2, 'Some material held by publishers is not scanned, so it cannot be used for marketing', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `proposition` VALUES(3, 'There is no exception to allow libraries to scan materials without seeking permission from the copyright holders', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `proposition` VALUES(4, 'All material held by publishers is scanned, so it can be searched for', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `proposition` VALUES(5, 'All material held by publishers is scanned, so it can be used for marketing', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `proposition` VALUES(6, 'There is an exception to allow libraries to scan materials without seeking permission from the copyright holders', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `proposition` VALUES(7, 'Clarifying the law demotes legal clarity', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `proposition` VALUES(8, 'Clarifying the law is neutral to publisher profits', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `proposition` VALUES(9, 'Clarifying the law promotes research, learning, and teaching', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `proposition_prur`
--

CREATE TABLE `proposition_prur` (
  `proposition_prur_id` int(11) NOT NULL AUTO_INCREMENT,
  `consultation_inst` int(11) DEFAULT NULL,
  `practical_reasoning_as` int(11) DEFAULT NULL,
  `proposition` int(11) DEFAULT NULL,
  `prop_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`proposition_prur_id`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `practical_reasoning_as` (`practical_reasoning_as`),
  KEY `proposition` (`proposition`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=25 ;
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `prop_occurrence`
--

CREATE TABLE `prop_occurrence` (
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
  KEY `conjunction` (`conjunction`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Gegevens worden uitgevoerd voor tabel `prop_occurrence`
--

INSERT INTO `prop_occurrence` VALUES(1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `prop_occurrence` VALUES(2, 2, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `prop_occurrence` VALUES(3, 3, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `prop_occurrence` VALUES(4, 4, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `prop_occurrence` VALUES(5, 5, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `prop_occurrence` VALUES(6, 6, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `source`
--

CREATE TABLE `source` (
  `source_id` int(11) NOT NULL AUTO_INCREMENT,
  `source_name` varchar(45) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`source_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Gegevens worden uitgevoerd voor tabel `source`
--

-- INSERT INTO `source` VALUES(1, 'Jim Jones', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source` VALUES(2, 'May Hayes', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source` VALUES(3, 'Tom Smith', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source` VALUES(4, 'Hugh Grant', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source` VALUES(5, 'LIBER', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `source_proposition`
--

CREATE TABLE `source_proposition` (
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
  KEY `source` (`source`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Gegevens worden uitgevoerd voor tabel `source_proposition`
--

-- INSERT INTO `source_proposition` VALUES(1, 1, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source_proposition` VALUES(2, 2, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source_proposition` VALUES(3, 3, 1, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source_proposition` VALUES(4, 4, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source_proposition` VALUES(5, 5, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source_proposition` VALUES(6, 6, 2, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source_proposition` VALUES(7, 7, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source_proposition` VALUES(8, 8, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `source_proposition` VALUES(9, 9, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

INSERT INTO `source_proposition` VALUES(10, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source_proposition` VALUES(11, 2, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source_proposition` VALUES(12, 3, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source_proposition` VALUES(13, 4, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source_proposition` VALUES(14, 5, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source_proposition` VALUES(15, 6, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source_proposition` VALUES(16, 7, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source_proposition` VALUES(17, 8, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `source_proposition` VALUES(18, 9, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `value`
--

CREATE TABLE `value` (
  `value_id` int(11) NOT NULL AUTO_INCREMENT,
  `value_name` text,  
  `datetime` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `relation_id` bigint(20) DEFAULT NULL,
  `mutation_sort` enum('create','update','delete','undelete') NOT NULL,
  `tsc_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`value_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `value`
--

INSERT INTO `value` VALUES(1, 'Legal clarity', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `value` VALUES(2, 'Publisher profits', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `value` VALUES(3, 'Research, learning, and teaching', '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `value_occurrence`
--

CREATE TABLE `value_occurrence` (
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
  KEY `conjunction` (`conjunction`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `value_occurrence`
--

INSERT INTO `value_occurrence` VALUES(1, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `value_occurrence` VALUES(2, 2, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `value_occurrence` VALUES(3, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);


--
-- Tabelstructuur voor tabel `value_occurrence`
--

CREATE TABLE `value_occurrence_default_choice` (
  `value_occurrence_default_choice_id` int(11) NOT NULL AUTO_INCREMENT,
  `value_occurrence` int(11) NOT NULL,
  `default_choice` varchar(45) default null,
   PRIMARY KEY (`value_occurrence_default_choice_id`),
  KEY `value_occurrence` (`value_occurrence`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;


INSERT INTO `value_occurrence_default_choice` VALUES(1, 1, 'demote');
INSERT INTO `value_occurrence_default_choice` VALUES(2, 2, 'neutral');
INSERT INTO `value_occurrence_default_choice` VALUES(3, 3, 'promote');
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `value_prur`
--

CREATE TABLE `value_prur` (
  `value_prur_id` int(11) NOT NULL AUTO_INCREMENT,
  `practical_reasoning_as` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `value_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`value_prur_id`),
  KEY `practical_reasoning_as` (`practical_reasoning_as`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `value` (`value`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `value_recognition_as`
--

CREATE TABLE `value_recognition_as` (
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
  KEY `source` (`source`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `value_recognition_as`
--

-- INSERT INTO `value_recognition_as` VALUES(1, 3, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `value_recognition_as` VALUES(2, 2, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
-- INSERT INTO `value_recognition_as` VALUES(3, 1, 3, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

INSERT INTO `value_recognition_as` VALUES(4, 1, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `value_recognition_as` VALUES(5, 2, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);
INSERT INTO `value_recognition_as` VALUES(6, 3, 5, '0000-00-00 00:00:00', NULL, 0, 'create', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `value_recognition_occurrence`
--

CREATE TABLE `value_recognition_occurrence` (
  `value_recognition_occurrence_id` int(11) NOT NULL AUTO_INCREMENT,
  `conjunction` int(11) DEFAULT NULL,
  `value_recognition_as` int(11) DEFAULT NULL,
  PRIMARY KEY (`value_recognition_occurrence_id`),
  KEY `value_recognition_as` (`value_recognition_as`),
  KEY `conjunction` (`conjunction`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

INSERT INTO `value_recognition_occurrence` VALUES(10, 6, 4);
INSERT INTO `value_recognition_occurrence` VALUES(11, 6, 5);
INSERT INTO `value_recognition_occurrence` VALUES(12, 6, 6);
-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `value_vrur`
--

CREATE TABLE `value_vrur` (
  `value_vrur_id` int(11) NOT NULL AUTO_INCREMENT,
  `value_recognition_as` int(11) DEFAULT NULL,
  `consultation_inst` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `value_recog_resp` varchar(45) DEFAULT NULL,
  `source_endow_resp` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`value_vrur_id`),
  KEY `value_recognition_as` (`value_recognition_as`),
  KEY `consultation_inst` (`consultation_inst`),
  KEY `value` (`value`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=61 ;

-- -----------------------------------------------------------------------------------------------------------------------

-- Beperkingen voor tabel `action`
--
ALTER TABLE `action`
  ADD CONSTRAINT `action_ibfk_1` FOREIGN KEY (`agent`) REFERENCES `agent` (`agent_id`)ON DELETE CASCADE;

--
-- Beperkingen voor tabel `consultation`
--
ALTER TABLE `consultation`
  ADD CONSTRAINT `consultation_ibfk_1` FOREIGN KEY (`practical_reasoning_as`) REFERENCES `practical_reasoning_as` (`practical_reasoning_as_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `consultation_ibfk_2` FOREIGN KEY (`credible_source_as`) REFERENCES `conjunction` (`conjunction_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `consultation_ibfk_3` FOREIGN KEY (`value_credible_source_as`) REFERENCES `conjunction` (`conjunction_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `consultation_ibfk_4` FOREIGN KEY (`value_recognition_as`) REFERENCES `conjunction` (`conjunction_id`)ON DELETE CASCADE;

--
-- Beperkingen voor tabel `consultation_inst`
--
ALTER TABLE `consultation_inst`
  ADD CONSTRAINT `consultation_inst_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`user_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `consultation_inst_ibfk_2` FOREIGN KEY (`consultation`) REFERENCES `consultation` (`consultation_id`)ON DELETE CASCADE;

/*--
-- Beperkingen voor tabel `consult_proposition`
--
ALTER TABLE `consult_proposition`
  ADD CONSTRAINT `consult_proposition_ibfk_1` FOREIGN KEY (`credible_source_as`) REFERENCES `credible_source_as` (`credible_source_as_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `consult_proposition_ibfk_2` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`)ON DELETE CASCADE;
  */

--
-- Beperkingen voor tabel `consult_value`
--
/*ALTER TABLE `consult_value`
  ADD CONSTRAINT `consult_value_ibfk_1` FOREIGN KEY (`credible_source_as`) REFERENCES `credible_source_as` (`credible_source_as_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `consult_value_ibfk_2` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`)ON DELETE CASCADE;*/

--
-- Beperkingen voor tabel `credible_source_as`
--
ALTER TABLE `credible_source_as`
  ADD CONSTRAINT `credible_source_as_ibfk_1` FOREIGN KEY (`domain_proposition`) REFERENCES `domain_proposition` (`domain_proposition_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `credible_source_as_ibfk_2` FOREIGN KEY (`source_proposition`) REFERENCES `source_proposition` (`source_proposition_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `credible_source_as_ibfk_3` FOREIGN KEY (`domain_source`) REFERENCES `domain_source` (`domain_source_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `credible_source_occurrence`
--
ALTER TABLE `credible_source_occurrence`
  ADD CONSTRAINT `credible_source_occurrence_ibfk_1` FOREIGN KEY (`credible_source_as`) REFERENCES `credible_source_as` (`credible_source_as_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `credible_source_occurrence_ibfk_2` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE;

-- Beperkingen voor tabel `value_credible_source_as`
--
ALTER TABLE `value_credible_source_as`
  ADD CONSTRAINT `value_credible_source_as_ibfk_1` FOREIGN KEY (`domain_source`) REFERENCES `domain_source` (`domain_source_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_credible_source_as_ibfk_2` FOREIGN KEY (`action`) REFERENCES `action` (`action_id`)ON DELETE CASCADE,
  ADD CONSTRAINT `value_credible_source_as_ibfk_3` FOREIGN KEY (`value_occurrence_default_choice`) REFERENCES `value_occurrence_default_choice` (`value_occurrence_default_choice_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `value_credible_source_occurrence`
--
ALTER TABLE `value_credible_source_occurrence`
  ADD CONSTRAINT `value_credible_source_occurrence_ibfk_1` FOREIGN KEY (`value_credible_source_as`) REFERENCES `value_credible_source_as` (`value_credible_source_as_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_credible_source_occurrenceibfk_2` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE;


--
-- Beperkingen voor tabel `credible_source_ur`
--
ALTER TABLE `credible_source_ur`
  ADD CONSTRAINT `credible_source_ur_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `credible_source_ur_ibfk_2` FOREIGN KEY (`credible_source_as`) REFERENCES `credible_source_as` (`credible_source_as_id`) ON DELETE CASCADE;


--
-- Beperkingen voor tabel `value_credible_source_ur`
--
ALTER TABLE `value_credible_source_ur`
  ADD CONSTRAINT `value_credible_source_ur_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_credible_source_ur_ibfk_2` FOREIGN KEY (`value_credible_source_as`) REFERENCES `value_credible_source_as` (`value_credible_source_as_id`) ON DELETE CASCADE;


--
-- Beperkingen voor tabel `domain_proposition`
--
ALTER TABLE `domain_proposition`
  ADD CONSTRAINT `domain_proposition_ibfk_1` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `domain_proposition_ibfk_2` FOREIGN KEY (`domain`) REFERENCES `domain` (`domain_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `domain_source`
--
ALTER TABLE `domain_source`
  ADD CONSTRAINT `domain_source_ibfk_1` FOREIGN KEY (`source`) REFERENCES `source` (`source_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `domain_source_ibfk_2` FOREIGN KEY (`domain`) REFERENCES `domain` (`domain_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `external_info`
--
ALTER TABLE `external_info`
  ADD CONSTRAINT `external_info_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `practical_reasoning_as`
--
ALTER TABLE `practical_reasoning_as`
  ADD CONSTRAINT `practical_reasoning_as_ibfk_1` FOREIGN KEY (`values`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practical_reasoning_as_ibfk_2` FOREIGN KEY (`circumstances`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practical_reasoning_as_ibfk_3` FOREIGN KEY (`action`) REFERENCES `action` (`action_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `practical_reasoning_as_ibfk_4` FOREIGN KEY (`consequences`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `proposition_prur`
--
ALTER TABLE `proposition_prur`
  ADD CONSTRAINT `proposition_prur_ibfk_1` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proposition_prur_ibfk_2` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `proposition_prur_ibfk_3` FOREIGN KEY (`practical_reasoning_as`) REFERENCES `practical_reasoning_as` (`practical_reasoning_as_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `prop_occurrence`
--
ALTER TABLE `prop_occurrence`
  ADD CONSTRAINT `prop_occurrence_ibfk_1` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prop_occurrence_ibfk_2` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `source_proposition`
--
ALTER TABLE `source_proposition`
  ADD CONSTRAINT `source_proposition_ibfk_1` FOREIGN KEY (`proposition`) REFERENCES `proposition` (`proposition_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `source_proposition_ibfk_2` FOREIGN KEY (`source`) REFERENCES `source` (`source_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `value_occurrence`
--
ALTER TABLE `value_occurrence`
  ADD CONSTRAINT `value_occurrence_ibfk_1` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_occurrence_ibfk_2` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE;


--
-- Beperkingen voor tabel `value_occurrence`
--
ALTER TABLE `value_occurrence_default_choice`
  ADD CONSTRAINT `value_occurrence_default_choice_ibfk_1` FOREIGN KEY (`value_occurrence`) REFERENCES `value_occurrence` (`value_occurrence_id`) ON DELETE CASCADE;


--
-- Beperkingen voor tabel `value_prur`
--
ALTER TABLE `value_prur`
  ADD CONSTRAINT `value_prur_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_prur_ibfk_2` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_prur_ibfk_3` FOREIGN KEY (`practical_reasoning_as`) REFERENCES `practical_reasoning_as` (`practical_reasoning_as_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `value_recognition_as`
--
ALTER TABLE `value_recognition_as`
  ADD CONSTRAINT `value_recognition_as_ibfk_1` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_recognition_as_ibfk_2` FOREIGN KEY (`source`) REFERENCES `source` (`source_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `value_recognition_occurrence`
--
ALTER TABLE `value_recognition_occurrence`
  ADD CONSTRAINT `value_recognition_occurrence_ibfk_1` FOREIGN KEY (`value_recognition_as`) REFERENCES `value_recognition_as` (`value_recognition_as_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_recognition_occurrence_ibfk_2` FOREIGN KEY (`conjunction`) REFERENCES `conjunction` (`conjunction_id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `value_vrur`
--
ALTER TABLE `value_vrur`
  ADD CONSTRAINT `value_vrur_ibfk_1` FOREIGN KEY (`consultation_inst`) REFERENCES `consultation_inst` (`consultation_inst_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_vrur_ibfk_2` FOREIGN KEY (`value`) REFERENCES `value` (`value_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_vrur_ibfk_3` FOREIGN KEY (`value_recognition_as`) REFERENCES `value_recognition_as` (`value_recognition_as_id`) ON DELETE CASCADE;
