package org.zefxis.dexms.model;

import java.util.ArrayList;

import org.zefxis.dexms.gmdl.utils.enums.ProtocolType;
import org.zefxis.dexms.utils.Thing;
import org.zefxis.dexms.utils.ThingType;



public class Service extends Thing {
	
	public Service(){}
	
	public Service(String name, String gidlPath, String hostaddress, ProtocolType protocol, String hostport, ThingType thingType){
		
		setGidlPath(gidlPath);
		setThingType(thingType);
		setProtocol(protocol);
		setName(name);
		setHostaddress(hostaddress);
		setHostport(hostport);
	}
	
}
