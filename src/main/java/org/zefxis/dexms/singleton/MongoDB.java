package org.zefxis.dexms.singleton;

import java.net.UnknownHostException;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;


public class MongoDB{

	private static DB mongoDB = null;

	public static DBCollection getCollection(String collection) {
		
		
		DBCollection mongoCollection = null;
		if (mongoDB != null) {
			
				
				mongoCollection = mongoDB.getCollection(collection);
			
			
		} else {

			MongoClient mongoClient;
			try {
				
				mongoClient = new MongoClient("dexms-db",27017);
				mongoDB = mongoClient.getDB("dexms");
				mongoCollection = mongoDB.getCollection(collection);
				
			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return mongoCollection;

	}

}
