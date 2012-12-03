package com.uid.impact;

import java.net.URI;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.json.JSONException;
import org.json.JSONObject;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.uid.impact.ImpactUser.Provider;

@Path("/facebook")
public class FacebookLogin {

	private static final String SCOPE = "https://www.googleapis.com/auth/userinfo.profile";
	private static final String CALLBACK_URL = "http://impact.uid.com:8080/impact/oauth2callbackfacebook";

	private static final HttpTransport TRANSPORT = new NetHttpTransport();
	private static final JsonFactory JSON_FACTORY = new JacksonFactory();

	// FILL THESE IN WITH YOUR VALUES FROM THE API CONSOLE
	private static final String APP_ID = "365018340184765";
	private static final String CLIENT_SECRET = "5b9077f1e28beeaa2ffc9d0b2d2474e6";

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final String APIKEY = "AIzaSyD4FIq3cwvpIeyHjydNc28I2QvdpNV0hJM";

	
	private String getOAuthURL() {
		return "https://www.facebook.com/dialog/oauth?client_id="+APP_ID+"&redirect_uri="+CALLBACK_URL;

	}
	
	
	/**
	 * sends the URL for the OAuth 2.0 request and the unique token for the user as JSON 
	 */
	@GET
	@Produces("text/plain")
	public String sendAuthURL(){
		System.out.println("Sending Authorization URL to the User");
		String authorizeUrl = getOAuthURL();
		
		
		System.out.println("Waiting for response from Facebook if the access is granted");
		return authorizeUrl;
		
		
	}
	
	/**
	 * connects with the server and retrieves the user informations
	 * @param code Code from the Google Callback
	 * @return the User
	 * @throws JSONException 
	 */
	public static ImpactUser login(String code) throws JSONException{
		System.out.println("Got Accescode from Facebook");
		String authResponse = FacebookLogin.getToken(code);
		System.out.println("Request user infos");
		JSONObject userInfos = FacebookLogin.validateToken(authResponse);
		
		ImpactUser user = new ImpactUser();
		user.setProvider(Provider.Facebook);
		user.setId(userInfos.get("id").toString());
		
		user.setName(userInfos.getString("name"));
		user.setPictureUrl("http://graph.facebook.com/"+user.getId()+"/picture");
		
		
		return user;
	}
	
	public static String getToken(String code){
		//System.out.println("gettoken");
		System.out.println("Exchange access code to access token.");
		String url = "https://graph.facebook.com/oauth/access_token?client_id="+APP_ID+"&redirect_uri="+CALLBACK_URL+"&client_secret="+CLIENT_SECRET+"&code="+code;
		
		URI uri =  UriBuilder.fromUri(url).build();
		WebResource service = Client.create().resource(uri);
		String authResponse = service.accept(MediaType.APPLICATION_JSON).get(String.class);
		authResponse = authResponse.split("=")[1].split("&")[0];
		return authResponse;
		/*GoogleAuthorizationCodeGrant authRequest = new GoogleAuthorizationCodeGrant(TRANSPORT, JSON_FACTORY, APP_ID, CLIENT_SECRET,
				code, CALLBACK_URL);
		authRequest.useBasicAuthorization = false;
		AccessTokenResponse authResponse;
		try {
			authResponse = authRequest.execute();
		
		String accessToken = authResponse.accessToken;
		GoogleAccessProtectedResource access = new GoogleAccessProtectedResource(accessToken, TRANSPORT, JSON_FACTORY, APP_ID,
				CLIENT_SECRET, authResponse.refreshToken);
		HttpRequestFactory rf = TRANSPORT.createRequestFactory(access);
		System.out.println("Access token: " + authResponse.accessToken);
		System.out.println("Got access token from Facebook");
		return authResponse;
		} catch (IOException e) {
			System.out.println("Token is null");
			return null;
			
		}*/
		
	}
	
	public static JSONObject validateToken(String token){
		System.out.println("Validate token with Facebook and access user ID.");		
		
		String url = "https://graph.facebook.com/me?access_token="+token;
		
		URI uri =  UriBuilder.fromUri(url).build();
		WebResource service = Client.create().resource(uri);
		String response = service.accept(MediaType.APPLICATION_JSON).get(String.class);
		
		try {
			JSONObject json = new JSONObject(response);
			System.out.println(json);
			return json;
		} catch (JSONException e) {
			
			e.printStackTrace();
			return null;
		}
		
		/*URL url = new URL("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+TOKEN);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");
		
		conn.setDoInput(true); 
		conn.connect();
		
		if (conn.getResponseCode() != 200) {
			throw new IOException(conn.getResponseMessage());
		}
		
		// Buffer the result into a string
		BufferedReader rd = new BufferedReader(new InputStreamReader(
				conn.getInputStream()));
		StringBuilder sb = new StringBuilder();
		String line;
		while ((line = rd.readLine()) != null) {
			sb.append(line);
			System.out.println(line);
		}
		rd.close();

		conn.disconnect();

		String answer = sb.toString();
		System.out.println(answer);
		
		JSONObject json = new JSONObject(answer);
		String id = (String) json.get("user_id");
		System.out.println(id);
		*/
		
		/*GoogleAccessProtectedResource access = new GoogleAccessProtectedResource(token, TRANSPORT, JSON_FACTORY, APP_ID,
				CLIENT_SECRET, refreshtoken);
		HttpRequestFactory rf = TRANSPORT.createRequestFactory(access);
		
		GenericUrl shortenEndpoint = new GenericUrl(BASE_AUTHORIZATION_URL);
	    HttpRequest request;
		try {
			request = rf.buildGetRequest(shortenEndpoint);
		
	    request.getHeaders().setContentType("application/json");
	    HttpResponse shortUrl = request.execute();
	    BufferedReader output = new BufferedReader(new InputStreamReader(shortUrl.getContent()));
	    //System.out.println("validateToken Response: ");
	    StringBuilder sb = new StringBuilder();
		String line;
		while ((line = output.readLine()) != null) {
			sb.append(line);
			//System.out.println(line);
		}
		output.close();
		JSONObject json = new JSONObject(sb.toString());
		//String id = (String) json.get("user_id");
		//System.out.println("ID: "+ id);
		//getUserInfos(id);
		return json;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		*/
	}
	
	public static JSONObject getUserInfos(String id){
		URI uri =  UriBuilder.fromUri("https://www.googleapis.com/plus/v1/people/"+id+"?pp=1&key="+APIKEY ).build();
		WebResource service = Client.create().resource(uri);
		String person =  service.accept(MediaType.APPLICATION_JSON).get(String.class);
		//System.out.println(person);
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
