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
 * File:         UserInfo.java
 * Project:      IMPACT
 * Created:      10.01.2012
 * Last Change:  12.12.2012
 * --------------------------------------------------------------------------------
 * Created by User Interface Design GmbH (UID) 2012
 * Author: Pascal Welsch (pascal.welsch@uid.com)
 * --------------------------------------------------------------------------------
 */

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class UserInfo implements Serializable{
		
	
	private static final long serialVersionUID = 1L;
			String name;
			String pic_url;
			String error = "";
			
			public UserInfo(){
				
			}
			
			public String getName() {
				return name;
			}

			public void setName(String name) {
				this.name = name;
			}

			public String getPic_url() {
				return pic_url;
			}

			public void setPic_url(String pic_url) {
				this.pic_url = pic_url;
			}

			public String getError() {
				return error;
			}

			public void setError(String error) {
				this.error = error;
			}

			public UserInfo(String name, String pic_url, String error) {
				this.name = name;
				this.pic_url = pic_url;
				this.error = error;
			}
		}