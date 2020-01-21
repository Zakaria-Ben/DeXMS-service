package org.zefxis.dexms.singleton;


import java.util.Arrays;

import org.zefxis.dexms.utils.DexmsConstant;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;




public class MongoDB{

	private static DB mongoDB = null;
	
	
	public static DBCollection getCollection(String collection) {
		
		DBCollection mongoCollection = null;
		if (mongoDB != null){
			
				mongoCollection = mongoDB.getCollection(collection);
			
		} else {

			MongoClient mongoClient;
			MongoCredential credential = MongoCredential.createCredential(DexmsConstant.MongoDbUser, DexmsConstant.MongoDbName, DexmsConstant.MongoDbPWD.toCharArray());
			ServerAddress serverAddress = new ServerAddress(DexmsConstant.MongoDbHost,DexmsConstant.MongoDbPort);
			mongoClient = new MongoClient(Arrays.asList(serverAddress),Arrays.asList(credential));
			mongoDB = 	mongoClient.getDB(DexmsConstant.MongoDbName);
			mongoCollection = mongoDB.getCollection(collection);
			
		}
		return mongoCollection;

	}
 

}
