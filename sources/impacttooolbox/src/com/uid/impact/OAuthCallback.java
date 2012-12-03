package com.uid.impact;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;



public class OAuthCallback extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6166671184049530252L;
	private String toke_request_code = "";
	
	/**
	 * logs the user in and redirect the browser back
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String code = req.getParameter("code");
		System.out.println(code);
		String uuid = UUID.randomUUID().toString();
		//login with the code send by the callback
		try {
			ImpactUser user = GoogleLogin.login(code);
			
			Users.add(uuid, user);
		} catch (JSONException e) {
			// could not connect with oauth2
			e.printStackTrace();
		}
		
		//redirect to Main Page
		resp.setContentType( "text/html" );
		PrintWriter out = resp.getWriter();
		//out.println("<html><body onLoad='window.opener.location.reload(); window.close();'>If you see this text, close this window and refresh the IMPACT page</body></html>");
		out.println("<html><body onLoad='window.opener.setToken(\""+uuid+"\"); window.opener.location.reload(); window.close();'>If you see this text, close this window and refresh the IMPACT page</body></html>");

	}
}
