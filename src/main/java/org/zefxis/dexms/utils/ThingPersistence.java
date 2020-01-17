package org.zefxis.dexms.utils;

import java.util.List;

import com.mongodb.DBObject;

public interface ThingPersistence {
	
	public int registerThing(Thing thing); 
	public List<DBObject> getThings();
}
