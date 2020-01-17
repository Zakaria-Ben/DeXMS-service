package org.zefxis.dexms.service.resources;

import java.io.IOException;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.restlet.data.MediaType;
import org.restlet.representation.ObjectRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.resource.Get;
import org.restlet.resource.Post;
import org.restlet.resource.ResourceException;
import org.restlet.resource.ServerResource;
import org.zefxis.dexms.gmdl.utils.enums.ProtocolType;
import org.zefxis.dexms.mediator.generator.MediatorGenerator;
import org.zefxis.dexms.mediator.manager.MediatorOutput;

public class DexmsStatusResource extends ServerResource {

	public DexmsStatusResource(){
		
		
	}
	
	@Override
	protected Representation get() throws ResourceException {
		
		return new StringRepresentation("started", MediaType.TEXT_PLAIN);
	
	}
	
	
	
	
}
