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
 * Authors: Jochem Douw (http://jochemdouw.nl), Sander Latour, Giovanni Sileno
 * ----------------------------------------------------------------------------
 */
-- Queries for the 1_3 version of the DB
-- DROP TABLE `ART_discussions`, `ART_documents`, `ART_relations_discussions`, `ART_text_sections`, `ART_text_section_combinations`, `consult_proposition`, `consult_value`, `credible_source_occurrence`, `credible_source_ur`, `external_info`, `proposition_prur`, `prop_occurrence`, `value_occurrence`, `value_prur`, `value_vrur`;

-- DROP TABLE `consultation_inst`, `credible_source_as`, `domain_proposition`, `domain_source`, `source_proposition`, `user`, `value_recognition_as`;

-- DROP TABLE `consultation`, `domain`, `practical_reasoning_as`, `proposition`, `source`, `value`;

-- DROP TABLE `action`, `agent`, `conjunction`;


-- DROP DATABASE impact_UoL_UvA_DB_v1_5;
-- CREATE DATABASE impact_UoL_UvA_DB_v1_5

-- 
SET FOREIGN_KEY_CHECKS=0;

-- Drop tables for 1_4 and 1_5
DROP TABLE `ART_discussions`,`ART_documents`,`ART_relations_discussions`,`ART_text_section_combinations`,`ART_text_sections`,`action`,`agent`,`conjunction`,`consultation`,`consultation_inst`,`credible_source_as`,`credible_source_occurrence`,`credible_source_ur`,`domain`,`domain_proposition`,`domain_source`,`external_info`,`practical_reasoning_as`,`prop_occurrence`,`proposition`,`proposition_prur`,`source`,`source_proposition`,`user`,`value`,`value_credible_source_as`,`value_credible_source_occurrence`,`value_credible_source_ur`,`value_occurrence`,`value_occurrence_default_choice`,`value_prur`,`value_recognition_as`,`value_recognition_occurrence`,`value_vrur`;
-- Drop tables for 1_5 and higher only
DROP TABLE `concl`,`general_as`,`premise`,`premise_occurrence`;

SET FOREIGN_KEY_CHECKS=1;
