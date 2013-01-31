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
 * File:         UserInfoRequest.java
 * Project:      IMPACT
 * Created:      10.01.2012
 * Last Change:  12.12.2012
 * --------------------------------------------------------------------------------
 * Created by User Interface Design GmbH (UID) 2012
 * Author: Pascal Welsch (pascal.welsch@uid.com)
 * --------------------------------------------------------------------------------
 */

import java.rmi.NoSuchObjectException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONException;

@Path("/userinfo")
public class UserInfoRequest {

	@GET
	@Produces("text/plain")
	public String getUserInfos() {
		return "Use POST with your token";
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes("text/plain")
	public UserInfo getUserInfos(String token) throws JSONException {
		System.out.println("User Data requested by User");
		// System.out.println(token);
		String userid = TokenManager.getId(token);

		ImpactUser user;
		UserInfo userInfo;
		try {
			user = UserManager.get(userid);
			userInfo = new UserInfo(user.getName(), user.getPictureUrl(), "");
		} catch (NoSuchObjectException e) {
			userInfo = new UserInfo("", "", "Sending Error to User.");
		}

		return userInfo;
		// return json.toString();
	}
}
