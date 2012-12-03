package com.uid.impact;

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
