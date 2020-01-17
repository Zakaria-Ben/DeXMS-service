package org.zefxis.dexms.utils;

import org.zefxis.dexms.gmdl.utils.enums.ProtocolType;

public abstract class Thing {
	
	private String name;
	private ProtocolType protocol;
	private ThingType thingType;
	private String GidlPath; 
	private String id;
	private String hostaddress;
	private String hostport;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * @return the protocol
	 */
	public ProtocolType getProtocol() {
		return protocol;
	}
	/**
	 * @param protocol the protocol to set
	 */
	public void setProtocol(ProtocolType protocol) {
		this.protocol = protocol;
	}
	/**
	 * @return the thingType
	 */
	public ThingType getThingType() {
		return thingType;
	}
	/**
	 * @param thingType the thingType to set
	 */
	public void setThingType(ThingType thingType) {
		this.thingType = thingType;
	}
	/**
	 * @return the gidlPath
	 */
	public String getGidlPath() {
		return GidlPath;
	}
	/**
	 * @param gidlPath the gidlPath to set
	 */
	public void setGidlPath(String gidlPath) {
		GidlPath = gidlPath;
	}
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the hostaddress
	 */
	public String getHostaddress() {
		return hostaddress;
	}
	/**
	 * @param hostaddress the hostaddress to set
	 */
	public void setHostaddress(String hostaddress) {
		this.hostaddress = hostaddress;
	}
	/**
	 * @return the hostport
	 */
	public String getHostport() {
		return hostport;
	}
	/**
	 * @param hostport the hostport to set
	 */
	public void setHostport(String hostport) {
		this.hostport = hostport;
	}
	
	
}