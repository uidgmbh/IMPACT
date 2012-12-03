package com.uid.impact;

import java.util.Hashtable;



public class Users {
	
	private static Hashtable<String,ImpactUser> users = new Hashtable<String, ImpactUser>();
	
	public static void add(String token, ImpactUser user){
		users.put(token, user);
	}

	public static ImpactUser get(String token) {
		System.out.println(users.size());
		return users.get(token);
	}

}
