package org.zefxis.dexms.persistence;

import java.util.List;

import org.bson.types.ObjectId;
import org.zefxis.dexms.gmdl.utils.enums.ProtocolType;
import org.zefxis.dexms.model.Device;
import org.zefxis.dexms.model.Service;
import org.zefxis.dexms.utils.Thing;
import org.zefxis.dexms.utils.ThingPersistence;
import org.zefxis.dexms.utils.ThingType;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import org.zefxis.dexms.singleton.MongoDB;




public class ServicePersistence implements ThingPersistence {

	@Override
	public int registerThing(Thing thing) {
		// TODO Auto-generated method stub
		int registerStatus;
		Service service = (Service) thing;
		BasicDBObject documentService = new BasicDBObject();
		documentService.put("name", service.getName());
		documentService.put("protocol", String.valueOf(service.getProtocol()));
		documentService.put("hostaddress", String.valueOf(service.getHostaddress()));
		documentService.put("hostport", String.valueOf(service.getHostport()));
		documentService.put("type", String.valueOf(service.getThingType()));
		documentService.put("gidlPath", service.getGidlPath());
		BasicDBObject queryService = new BasicDBObject();
		queryService.put("name", service.getName());
		registerStatus = MongoDB.getCollection("service").insert(documentService).getN();
		List<DBObject> services = MongoDB.getCollection("service").find(queryService).toArray();
		for (DBObject dbObject : services) {

			service.setId(dbObject.get("_id").toString());
		}
		thing = service;
		return registerStatus;

	}

	@Override
	public List<DBObject> getThings() {
		// TODO Auto-generated method stub

		List<DBObject> services = MongoDB.getCollection("service").find().toArray();
		return services;
	}

	public Service getOneThing(String _id){

		Service service = new Service();
		BasicDBObject queryService = new BasicDBObject();
		queryService.put("_id", new ObjectId(_id));
		List<DBObject> services = MongoDB.getCollection("service").find(queryService).toArray();
		for (DBObject dbObject : services){
			
			service.setGidlPath(dbObject.get("gidlPath").toString());
			service.setName(dbObject.get("name").toString());
			service.setHostaddress(dbObject.get("hostaddress").toString());
			service.setHostport(dbObject.get("hostport").toString());
			service.setProtocol(ProtocolType.valueOf(dbObject.get("protocol").toString()));
			service.setThingType(ThingType.valueOf(dbObject.get("type").toString()));
			service.setId(dbObject.get("_id").toString());
			
		}
		return service;
	}
	
	
	public Service getOneThing(String key, String value){

		Service service = new Service();
		BasicDBObject queryService = new BasicDBObject();
		queryService.put(key, value);
		List<DBObject> services = MongoDB.getCollection("service").find(queryService).toArray();
		for (DBObject dbObject : services){
			
			service.setGidlPath(dbObject.get("gidlPath").toString());
			service.setName(dbObject.get("name").toString());
			service.setHostaddress(dbObject.get("hostaddress").toString());
			service.setHostport(dbObject.get("hostport").toString());
			service.setProtocol(ProtocolType.valueOf(dbObject.get("protocol").toString()));
			service.setThingType(ThingType.valueOf(dbObject.get("type").toString()));
			service.setId(dbObject.get("_id").toString());
			
		}
		return service;
	}
	
	public void deleteOneThing(String _id){
		
		Device device = new Device();
		BasicDBObject queryDevice= new BasicDBObject();
		queryDevice.put("_id", new ObjectId(_id));
		List<DBObject> devices = MongoDB.getCollection("service").find(queryDevice).toArray();
		for(DBObject dbObject : devices){
			
			MongoDB.getCollection("service").remove(dbObject);
		}
		
	}


}
