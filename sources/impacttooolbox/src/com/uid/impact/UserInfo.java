package com.uid.impact;

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