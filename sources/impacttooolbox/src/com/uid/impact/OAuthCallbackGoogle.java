package com.uid.impact;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;



public class OAuthCallbackGoogle extends HttpServlet {

	/**
	 * logs the user in and redirect the browser back
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String code = req.getParameter("code");
		//System.out.println(code);
		try {
			ImpactUser user = GoogleLogin.login(code);
			String userid = user.getId();
			String token = TokenManager.mapUser(userid);
			UserManager.add(userid, user);
		
		
		//redirect to Main Page
		resp.setContentType( "text/html" );
		PrintWriter out = resp.getWriter();
		//out.println("<html><body onLoad='window.opener.location.reload(); window.close();'>If you see this text, close this window and refresh the IMPACT page</body></html>");
		System.out.println("send IMPACT Token to User and refresh the Browser");
		
		out.println("<html><body onLoad='window.opener.ImpactToolbox.setToken(\""+token+"\"); window.opener.location.reload(); window.close();'>If you see this text, close this window and refresh the IMPACT page</body></html>");
		} catch (JSONException e) {
			PrintWriter out = resp.getWriter();
			//out.println("<html><body onLoad='window.opener.location.reload(); window.close();'>If you see this text, close this window and refresh the IMPACT page</body></html>");
			System.out.println("Something went wrong. You will be redirected");
			
			out.println("<html><body onLoad='window.opener.location.reload(); window.close();'>If you see this text, close this window and refresh the IMPACT page</body></html>");
			
			e.printStackTrace();
		}
	}
}
