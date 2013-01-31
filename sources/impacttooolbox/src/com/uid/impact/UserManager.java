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
 * File:         UserManager.java
 * Project:      IMPACT
 * Created:      10.01.2012
 * Last Change:  12.12.2012
 * --------------------------------------------------------------------------------
 * Created by User Interface Design GmbH (UID) 2012
 * Author: Pascal Welsch (pascal.welsch@uid.com)
 * --------------------------------------------------------------------------------
 */

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
