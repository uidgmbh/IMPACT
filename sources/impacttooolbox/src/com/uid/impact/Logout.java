package com.uid.impact;

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
