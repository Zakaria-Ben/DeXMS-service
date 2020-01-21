package org.zefxis.dexms.singleton;

import java.net.UnknownHostException;

import org.zefxis.dexms.utils.DexmsConstant;

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
				
				mongoClient = new MongoClient(DexmsConstant.MongoDbHost,DexmsConstant.MongoDbPort);
				mongoDB = mongoClient.getDB(DexmsConstant.MongoDbName);
				boolean auth = mongoDB.authenticate(DexmsConstant.MongoDbUser, DexmsConstant.MongoDbPWD.toCharArray());
				if(auth) {
					
					mongoCollection = mongoDB.getCollection(collection);
				}
			} catch(UnknownHostException e){
				
				e.printStackTrace();
			}
			
		}
		return mongoCollection;

	}

}
