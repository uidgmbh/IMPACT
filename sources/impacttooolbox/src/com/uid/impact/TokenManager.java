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
 * File:         TokenManager.java
 * Project:      IMPACT
 * Created:      10.01.2012
 * Last Change:  12.12.2012
 * --------------------------------------------------------------------------------
 * Created by User Interface Design GmbH (UID) 2012
 * Author: Pascal Welsch (pascal.welsch@uid.com)
 * --------------------------------------------------------------------------------
 */

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


/**
 * Holds the session tokens userIds mapping 
 * @author Pascal.Welsch
 *
 */
public class TokenManager {
	
	/**
	 * key = token
	 * value = id
	 */
	private static Map<String,String> tokenUserMapping = new HashMap<String,String>(); 

	/**
	 * creates a mapping token-->userId
	 * @param userId
	 * @return token for user data Access
	 */
	public static String mapUser(String userId) {
		String token = UUID.randomUUID().toString();
		tokenUserMapping.put(token, userId);
		return token;
	}
	
	/**
	 * exchanges the client token for the user ID
	 * @param token
	 * @return id of the user who uses the token
	 */
	public static String getId(String token) {
		return tokenUserMapping.get(token);
		
	}
	
	/**
	 * 
	 * @param token token from the client
	 * @return true if the operation works
	 */
	public static boolean removeMapping(String token) {
		try{
			tokenUserMapping.remove(token);
			return true;
		}catch(Exception e){
			return false;
		}
		
	}
	
}
