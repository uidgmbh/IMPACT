package com.uid.impact;

import java.rmi.NoSuchObjectException;
import java.util.Hashtable;



public class UserManager {
	
	private static Hashtable<String,ImpactUser> users = new Hashtable<String, ImpactUser>();
	
	public static void add(String id, ImpactUser user){
		sendInfo(id, "Add User");
		users.put(user.getId(), user);
		sendInfo(user.getId(), "Done. User added");
	}

	public static ImpactUser get(String id) throws NoSuchObjectException {
		try {
			ImpactUser user = users.get(id);
			sendInfo(id, "get informations about User");
			return user;
		} catch (Exception e) {
			sendInfo(id, "No informations about this User");
			throw new NoSuchObjectException("User not found");
		}
		
	}
	
	public static void delete(String id){
		sendInfo(id,"Remove User");
		users.remove(id);
		sendInfo(id,"Done. User removed");
	}
	
	private static void sendInfo(String	id, String message){
		try {
			ImpactUser user = users.get(id);
			System.out.println(message+" <"+ user.getName()+"> ("+user.getId()+")");
		} catch (Exception e) {
			System.out.println(message+" <UserNotFoudn> ("+id+")");
		}
		
	}

}
