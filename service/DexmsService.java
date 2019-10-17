package org.zefxis.dexms.service;

import org.restlet.Application;
import org.restlet.Restlet;
import org.restlet.routing.Router;

public class DexmsService extends Application {

	public DexmsService() {
	}

	@Override
	public synchronized Restlet createInboundRoot() {

		// Create a router Restlet that routes each call to a

		Router router = new Router(getContext());
		// Defines only one route with a new instance of MediatorGeneratorResource.
		router.attach("/mediator", DexmsMediatorResource.class);
		router.attach("/status", DexmsStatusResource.class);
		return router;
	}

}