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
 * File:         Users.java
 * Project:      IMPACT
 * Created:      10.01.2012
 * Last Change:  12.12.2012
 * --------------------------------------------------------------------------------
 * Created by User Interface Design GmbH (UID) 2012
 * Author: Pascal Welsch (pascal.welsch@uid.com)
 * --------------------------------------------------------------------------------
 */

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
