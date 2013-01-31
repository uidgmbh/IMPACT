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
 * File:         OAuthCallbackGoogle.java
 * Project:      IMPACT
 * Created:      10.01.2012
 * Last Change:  12.12.2012
 * --------------------------------------------------------------------------------
 * Created by User Interface Design GmbH (UID) 2012
 * Author: Pascal Welsch (pascal.welsch@uid.com)
 * --------------------------------------------------------------------------------
 */

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
