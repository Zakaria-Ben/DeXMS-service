package org.zefxis.dexms.service;

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

public class DexmsMediatorResource extends ServerResource {

	public DexmsMediatorResource() {

	}

	@Post
	public Representation generateMediator(Representation entity) throws ResourceException {
		String receivedText = null;
		try {

			receivedText = entity.getText();

		} catch (IOException e1) {
			e1.printStackTrace();
		}

		System.out.println("received : " + receivedText);
		JSONParser parser = new JSONParser();
		JSONObject jsonObject = null;
		
		String service_endpoint_address = null; 
		String service_endpoint_port = null;
		String bus_endpoint_address = null;
		String bus_endpoint_port = null;
		String protocol = null;
		String interfaceService = null;
		String mediator_name = null;
		
		

		try {

			jsonObject = (JSONObject) parser.parse(receivedText);
			
			service_endpoint_address = (String) jsonObject.get("service_endpoint_address");
			service_endpoint_port = (String) jsonObject.get("service_endpoint_port");
			bus_endpoint_address = (String) jsonObject.get("bus_endpoint_address");
			bus_endpoint_port = (String) jsonObject.get("bus_endpoint_port");
			protocol = (String) jsonObject.get("protocol");
			interfaceService = (String) jsonObject.get("gidl");
			mediator_name = (String) jsonObject.get("mediator_name");
			

		} catch (ParseException e) {
			e.printStackTrace();
		}

		byte[] byteArray = stringToByteArray(interfaceService);

		ProtocolType busProtocol = null;
		switch (protocol.toUpperCase()) {
		case "REST":
			busProtocol = ProtocolType.REST;
			break;
		case "SOAP":
			busProtocol = ProtocolType.SOAP;
			break;
		case "MQTT":
			busProtocol = ProtocolType.MQTT;
			break;
		case "WEBSOCKETS":
			busProtocol = ProtocolType.WEB_SOCKETS;
			break;
		case "SEMI_SPACE":
			busProtocol = ProtocolType.SEMI_SPACE;
			break;
		case "JMS":
			busProtocol = ProtocolType.JMS;
			break;
		case "PUBNUB":
			busProtocol = ProtocolType.PUB_NUB;
			break;
		case "COAP":
			busProtocol = ProtocolType.COAP;
			break;
		case "ZERO_MQ":
			busProtocol = ProtocolType.ZERO_MQ;
			break;
		case "DPWS":

			busProtocol = ProtocolType.DPWS;
			break;
		
		
		default:

			busProtocol = null;
			break;
		}

		if(busProtocol == null) {

			byte[] mediatorOutput = null;
			return new ObjectRepresentation<byte[]>(mediatorOutput);
		}
		
		MediatorGenerator mediator = new MediatorGenerator();
		mediator.setServiceEndpoint(service_endpoint_address, service_endpoint_port);
		mediator.setBusEndpoint(bus_endpoint_address, bus_endpoint_port);
		MediatorOutput mediatorOutput = mediator.generateWar(byteArray, busProtocol, mediator_name);
		return new ObjectRepresentation<byte[]>(mediatorOutput.jar);
	}

	private byte[] stringToByteArray(String string) {

		byte[] array = new byte[string.length()];
		for (int i = 0; i < string.length(); i++) {
			array[i] = (byte) string.charAt(i);
		}
		return array;
	}
}
