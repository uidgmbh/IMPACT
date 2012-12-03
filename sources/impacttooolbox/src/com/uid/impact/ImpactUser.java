package com.uid.impact;


public class ImpactUser {

	public static enum Provider {Google,Facebook,OpenID};
	private Provider provider;
	private String name;
	private String pictureUrl;
	private String token;
	private String providerId;
	public Provider getProvider() {
		return provider;
	}
	public void setProvider(Provider provider) {
		this.provider = provider;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPictureUrl() {
		return pictureUrl;
	}
	public void setPictureUrl(String pictureUrl) {
		this.pictureUrl = pictureUrl;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getId() {
		return providerId;
	}
	public void setId(String id) {
		this.providerId = id;
		
	}
	
}
