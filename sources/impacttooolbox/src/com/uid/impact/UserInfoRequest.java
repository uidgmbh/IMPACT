package com.uid.impact;

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
