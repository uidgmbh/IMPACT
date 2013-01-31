package com.uid.impact;
/* --------------------------------------------------------------------------------
 * Copyright (c) 2012 User Interface Design GmbH, Germany
 *
 * This program and the accompanying materials are licensed and made available 
 * under the terms and conditions of the European Union Public Licence (EUPL v.1.1).
 *
 * You should have received a copy of the  European Union Public Licence (EUPL v.1.1)
 * along with this program as the file LICENSE.txt; if not, please see
 * http://joinup.ec.europa.eu/software/page/eupl/licence-eupl.
 * 
 * This software is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. 
 * --------------------------------------------------------------------------------
 * File:         Logout.java
 * Project:      IMPACT
 * Created:      10.01.2012
 * Last Change:  12.12.2012
 * --------------------------------------------------------------------------------
 * Created by User Interface Design GmbH (UID) 2012
 * Author: Pascal Welsch (pascal.welsch@uid.com)
 * --------------------------------------------------------------------------------
 */

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.json.JSONException;


@Path("logout")
public class Logout {

		@POST
		@Produces("text/plain")
		public String getUserInfos(String token) throws JSONException {
			System.out.println("Logout User");
			return TokenManager.removeMapping(token)?"true":"false";
		}
}
