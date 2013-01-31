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
 * File:         GoogleLogin.java
 * Project:      IMPACT
 * Created:      10.01.2012
 * Last Change:  12.12.2012
 * --------------------------------------------------------------------------------
 * Created by User Interface Design GmbH (UID) 2012
 * Author: Pascal Welsch (pascal.welsch@uid.com)
 * --------------------------------------------------------------------------------
 */

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.api.client.auth.oauth2.draft10.AccessTokenResponse;
import com.google.api.client.googleapis.auth.oauth2.draft10.GoogleAccessProtectedResource;
import com.google.api.client.googleapis.auth.oauth2.draft10.GoogleAccessTokenRequest.GoogleAuthorizationCodeGrant;
import com.google.api.client.googleapis.auth.oauth2.draft10.GoogleAuthorizationRequestUrl;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.uid.impact.ImpactUser.Provider;

@Path("/google")
public class GoogleLogin {

	private static final String SCOPE = "https://www.googleapis.com/auth/userinfo.profile";
	//TODO selber rausfinden
	private static final String CALLBACK_URL = "http://impact.uid.com:8080/impact/oauth2callbackgoogle";

	private static final HttpTransport TRANSPORT = new NetHttpTransport();
	private static final JsonFactory JSON_FACTORY = new JacksonFactory();

	// TODO FILL THESE IN WITH YOUR VALUES FROM THE API CONSOLE
	private static final String CLIENT_ID = "683166602083-gh3dcq82ljrffmnfpjlht0gnmo4jsuh5.apps.googleusercontent.com";
	private static final String CLIENT_SECRET = "MdcW6poZrxe9-H4KiBvIQYG7";

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final String APIKEY = "AIzaSyD4FIq3cwvpIeyHjydNc28I2QvdpNV0hJM";

	private String getOAuthURL() {
		return new GoogleAuthorizationRequestUrl(CLIENT_ID, CALLBACK_URL, SCOPE)
				.build();

	}

	/**
	 * sends the URL for the OAuth 2.0 request and the unique token for the user
	 * as JSON
	 */
	@GET
	@Produces("text/plain")
	public String sendAuthURL() {
		System.out.println("Sending Authorization URL to the User");
		String authorizeUrl = getOAuthURL();

		System.out
				.println("Waiting for response from Google if the access is granted");
		return authorizeUrl;

	}

	/**
	 * connects with the server and retrieves the user informations
	 * 
	 * @param code
	 *            Code from the Google Callback
	 * @return the User
	 * @throws JSONException
	 */
	public static ImpactUser login(String code) throws JSONException {
		System.out.println("Got Accescode from Google");
		AccessTokenResponse authResponse = GoogleLogin.getToken(code);
		JSONObject validateJson = GoogleLogin.validateToken(authResponse);

		ImpactUser user = new ImpactUser();
		user.setProvider(Provider.Google);

		user.setId(validateJson.get("user_id").toString());
		
//		//TODO: EMail here?
//		user.setEmail(validateJson.get("user_email").toString());

		
		System.out.println("Request user infos");
		JSONObject plusInfos = getUserInfos(user.getId());

		
		user.setName(plusInfos.getString("displayName"));
		user.setPictureUrl(plusInfos.getJSONObject("image").getString("url"));

		return user;
	}

	public static AccessTokenResponse getToken(String code) {
		System.out.println("Exchange access code to access token.");
		GoogleAuthorizationCodeGrant authRequest = new GoogleAuthorizationCodeGrant(
				TRANSPORT, JSON_FACTORY, CLIENT_ID, CLIENT_SECRET, code,
				CALLBACK_URL);
		authRequest.useBasicAuthorization = false;
		AccessTokenResponse authResponse;
		try {
			authResponse = authRequest.execute();

			String accessToken = authResponse.accessToken;
			GoogleAccessProtectedResource access = new GoogleAccessProtectedResource(
					accessToken, TRANSPORT, JSON_FACTORY, CLIENT_ID,
					CLIENT_SECRET, authResponse.refreshToken);
			// System.out.println("Access token: " + authResponse.accessToken);
			System.out.println("Got access token from Google");
			return authResponse;
		} catch (IOException e) {
			return null;
		}

	}

	public static JSONObject validateToken(AccessTokenResponse authResponse) {
		System.out.println("Validate token with Google and access user ID.");
		String token = authResponse.accessToken;
		String refreshtoken = authResponse.refreshToken;

		String BASE_AUTHORIZATION_URL = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="
				+ token;
		/*
		 * URL url = new
		 * URL("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="
		 * +TOKEN); HttpURLConnection conn = (HttpURLConnection)
		 * url.openConnection(); conn.setRequestMethod("GET");
		 * 
		 * conn.setDoInput(true); conn.connect();
		 * 
		 * if (conn.getResponseCode() != 200) { throw new
		 * IOException(conn.getResponseMessage()); }
		 * 
		 * // Buffer the result into a string BufferedReader rd = new
		 * BufferedReader(new InputStreamReader( conn.getInputStream()));
		 * StringBuilder sb = new StringBuilder(); String line; while ((line =
		 * rd.readLine()) != null) { sb.append(line); System.out.println(line);
		 * } rd.close();
		 * 
		 * conn.disconnect();
		 * 
		 * String answer = sb.toString(); System.out.println(answer);
		 * 
		 * JSONObject json = new JSONObject(answer); String id = (String)
		 * json.get("user_id"); System.out.println(id);
		 */

		GoogleAccessProtectedResource access = new GoogleAccessProtectedResource(
				token, TRANSPORT, JSON_FACTORY, CLIENT_ID, CLIENT_SECRET,
				refreshtoken);
		HttpRequestFactory rf = TRANSPORT.createRequestFactory(access);

		GenericUrl shortenEndpoint = new GenericUrl(BASE_AUTHORIZATION_URL);
		HttpRequest request;
		try {
			request = rf.buildGetRequest(shortenEndpoint);

			request.getHeaders().setContentType("application/json");
			HttpResponse shortUrl = request.execute();
			BufferedReader output = new BufferedReader(new InputStreamReader(
					shortUrl.getContent()));
			// System.out.println("validateToken Response: ");
			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = output.readLine()) != null) {
				sb.append(line);
				// System.out.println(line);
			}
			output.close();
			JSONObject json = new JSONObject(sb.toString());
			// String id = (String) json.get("user_id");
			// System.out.println("ID: "+ id);
			// getUserInfos(id);
			return json;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	public static JSONObject getUserInfos(String id) {
		URI uri = UriBuilder.fromUri(
				"https://www.googleapis.com/plus/v1/people/" + id
						+ "?pp=1&key=" + APIKEY).build();
		WebResource service = Client.create().resource(uri);
		String person = service.accept(MediaType.APPLICATION_JSON).get(
				String.class);
		// System.out.println(person);
		JSONObject json;
		try {
			json = new JSONObject(person);
			System.out.println("Got user infos");
			return json;
		} catch (JSONException e) {
			e.printStackTrace();
			return null;
		}

	}

}
