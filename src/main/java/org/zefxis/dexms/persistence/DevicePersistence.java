package org.zefxis.dexms.persistence;

import java.util.List;

import org.bson.types.ObjectId;
import org.zefxis.dexms.gmdl.utils.enums.ProtocolType;
import org.zefxis.dexms.model.Device;
import org.zefxis.dexms.singleton.MongoDB;
import org.zefxis.dexms.utils.Thing;
import org.zefxis.dexms.utils.ThingPersistence;
import org.zefxis.dexms.utils.ThingType;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;


public class DevicePersistence implements ThingPersistence {
	
	@Override
	public int registerThing(Thing thing) {
		// TODO Auto-generated method stub
		Device device = (Device)thing;
		BasicDBObject documentDevice = new BasicDBObject();
		documentDevice.put("name", device.getName());
		documentDevice.put("gidlPath", device.getGidlPath());
		documentDevice.put("hostaddress", String.valueOf(device.getHostaddress()));
		documentDevice.put("hostport", String.valueOf(device.getHostport()));
		documentDevice.put("protocol", String.valueOf(device.getProtocol()));
		documentDevice.put("type", String.valueOf(device.getThingType()));
		
		BasicDBObject queryDevice= new BasicDBObject();
		queryDevice.put("name", device.getName());
		int registerStatus =  MongoDB.getCollection("device").insert(documentDevice).getN();
		List<DBObject> devices = MongoDB.getCollection("device").find(queryDevice).toArray();
		for(DBObject dbObject : devices){
			
			device.setId(dbObject.get("_id").toString());
		}
		thing = device;
		return registerStatus;
		
	}

	@Override
	public List<DBObject> getThings() {
		// TODO Auto-generated method stub
		List<DBObject> devices = MongoDB.getCollection("device").find().toArray();	
		return devices;
	}
	
	
	public Device getOneThing(String _id){
		
		Device device = new Device();
		BasicDBObject queryDevice= new BasicDBObject();
		queryDevice.put("_id", new ObjectId(_id));
		List<DBObject> devices = MongoDB.getCollection("device").find(queryDevice).toArray();
		for(DBObject dbObject : devices){
			
			device.setGidlPath(dbObject.get("gidlPath").toString());
			device.setName(dbObject.get("name").toString());
			device.setHostaddress(dbObject.get("hostaddress").toString());
			device.setHostport(dbObject.get("hostport").toString());
			if(String.valueOf(dbObject.get("protocol").toString()).equals("CoAP")){
				
				device.setProtocol(ProtocolType.valueOf("COAP"));
			}else{
				
				device.setProtocol(ProtocolType.valueOf(dbObject.get("protocol").toString()));
			}
			device.setThingType(ThingType.valueOf(dbObject.get("type").toString()));
			device.setId(dbObject.get("_id").toString());
		}
		return device;
	}
	
	
	
 public Device getOneThing(String key, String value){
		
		Device device = new Device();
		BasicDBObject queryDevice= new BasicDBObject();
		queryDevice.put(key, value);
		List<DBObject> devices = MongoDB.getCollection("device").find(queryDevice).toArray();
		for(DBObject dbObject : devices){
			
			device.setGidlPath(dbObject.get("gidlPath").toString());
			device.setName(dbObject.get("name").toString());
			device.setHostaddress(dbObject.get("hostaddress").toString());
			device.setHostport(dbObject.get("hostport").toString());
			if(String.valueOf(dbObject.get("protocol").toString()).equals("CoAP")){
				
				device.setProtocol(ProtocolType.valueOf("COAP"));
			}else{
				
				device.setProtocol(ProtocolType.valueOf(dbObject.get("protocol").toString()));
			}
			device.setThingType(ThingType.valueOf(dbObject.get("type").toString()));
			device.setId(dbObject.get("_id").toString());
		}
		return device;
	}

	
	public void deleteOneThing(String _id){
		
		Device device = new Device();
		BasicDBObject queryDevice= new BasicDBObject();
		queryDevice.put("_id", new ObjectId(_id));
		List<DBObject> devices = MongoDB.getCollection("device").find(queryDevice).toArray();
		for(DBObject dbObject : devices){
			
			MongoDB.getCollection("device").remove(dbObject);
		}
		
	}

}
