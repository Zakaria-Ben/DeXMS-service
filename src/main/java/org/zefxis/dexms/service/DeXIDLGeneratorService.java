package org.zefxis.dexms.service;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.json.simple.JSONObject;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.zefxis.dexms.gmdl.utils.enums.ProtocolType;
import org.zefxis.dexms.model.Device;
import org.zefxis.dexms.model.Service;
import org.zefxis.dexms.persistence.DevicePersistence;
import org.zefxis.dexms.persistence.ServicePersistence;
import org.zefxis.dexms.utils.ThingType;
import org.zefxis.dexms.utils.Utils;


public class DeXIDLGeneratorService extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final String UPLOAD_DIRECTORY =  Utils.getUPLOAD_DIRECTORY();
	private String dexidlPath = null;
	private HttpSession session = null;
	private JSONObject json = new JSONObject();
	private boolean status = true;
	private String name = null;
	private ProtocolType protocol = null;
	private ThingType thingType = null;
	private String dexidl = null;
	private String host_address = null;
	private String host_port = null;
	private Document gidl_model = null;
	private Attr attr = null;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		session = request.getSession();
		response.setContentType("application/json");
		
		name = request.getParameter("name").toString();
		json.put("name", name);		
		protocol = ProtocolType.valueOf(request.getParameter("protocol").toString());
		thingType = ThingType.valueOf(request.getParameter("thingType").toString());
		dexidl = request.getParameter("gidl").toString();
		host_address = request.getParameter("host_address").toString();
		host_port = request.getParameter("host_port").toString();
		
		dexidlPath = String.valueOf(System.currentTimeMillis()) + ".gidl";
		
		 
		if (host_address == "" || dexidl == "" || dexidlPath == "" || name == "" || dexidlPath == "" || host_address == null || dexidl == null || dexidlPath == null || name == null  || thingType == null || protocol == null) {

			status = false;
			json.put("message", "Invalid informations for new thing. Please try again.");

		}else {

			switch (thingType) {

			case SERVICE:

				Service service = new Service(name, dexidlPath,host_address, protocol,host_port, thingType);
				ServicePersistence servicePersistence = new ServicePersistence();
				servicePersistence.registerThing(service);
				generateGidlFile(dexidl, service.getId());
				
				break;

			case DEVICE:

				Device device = new Device(name, dexidlPath, host_address, protocol,host_port, thingType);
				DevicePersistence devicePersistence = new DevicePersistence();
				devicePersistence.registerThing(device);
				generateGidlFile(dexidl, device.getId());

				break;

			default:

				status = false;
				json.put("message", "Thing type not specified");

				break;
			}

		}

		if (status) {

			json.put("status", true);
			json.put("message", "Thing " + String.valueOf(json.get("name")) + " has been succesfully added");
		}
		response.getWriter().write(json.toJSONString());

	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doPost(request, response);

	}

	private void generateGidlFile(String gidl_description, String thingId) {
		
		boolean isOneWay = false;
		String service[] = gidl_description.split("\\|");
		String operation_scope[] = service[0].split("\\:");
		if (operation_scope[3].equals("one_way")) {

			isOneWay = true;
		}

		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = null;
		try {
			dBuilder = dbFactory.newDocumentBuilder();

		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}
		gidl_model = dBuilder.newDocument();

		// GIDLModel element
		Element GIDLModel = gidl_model.createElement("gidl:GIDLModel");
		gidl_model.appendChild(GIDLModel);

		// setting attribute to element
		attr = gidl_model.createAttribute("xmi:version");
		attr.setValue("2.0");
		GIDLModel.setAttributeNode(attr);
		
		attr = gidl_model.createAttribute("xmlns:xmi");
		attr.setValue("http://www.omg.org/XMI");
		GIDLModel.setAttributeNode(attr);
		
		attr = gidl_model.createAttribute("xmlns:xsi");
		attr.setValue("http://www.w3.org/2001/XMLSchema-instance");
		GIDLModel.setAttributeNode(attr);
		
		attr = gidl_model.createAttribute("xmlns:gidl");
		attr.setValue("http://eu.chorevolution/modelingnotations/gidl");
		GIDLModel.setAttributeNode(attr);
		
		attr = gidl_model.createAttribute("hostAddress");
		attr.setValue(host_address);
		GIDLModel.setAttributeNode(attr);

		attr = gidl_model.createAttribute("protocol");
		if(String.valueOf(protocol).equals("COAP")){
			
			attr.setValue("CoAP");
			
		}else{
			
			attr.setValue(String.valueOf(protocol));
		}
		
		GIDLModel.setAttributeNode(attr);

		// hasInterfaces element
		Element hasInterfaces = gidl_model.createElement("hasInterfaces");
		GIDLModel.appendChild(hasInterfaces);

		// setting attribute to element
		attr = gidl_model.createAttribute("role");
		attr.setValue(String.valueOf(operation_scope[0]));
		hasInterfaces.setAttributeNode(attr);

		// hasOperations element
		Element hasOperations = gidl_model.createElement("hasOperations");
		hasInterfaces.appendChild(hasOperations);

		// setting attribute to element
		attr = gidl_model.createAttribute("name");
		attr.setValue(String.valueOf(operation_scope[1]));
		hasOperations.setAttributeNode(attr);
		attr = gidl_model.createAttribute("qos");
		attr.setValue(String.valueOf(operation_scope[2]));
		hasOperations.setAttributeNode(attr);
		attr = gidl_model.createAttribute("type");
		attr.setValue(String.valueOf(operation_scope[3]));
		hasOperations.setAttributeNode(attr);

		// hasScope element
		Element hasScope = gidl_model.createElement("hasScope");
		hasOperations.appendChild(hasScope);

		// setting attribute to element
		attr = gidl_model.createAttribute("name");
		attr.setValue(String.valueOf(operation_scope[4]));
		hasScope.setAttributeNode(attr);
		attr = gidl_model.createAttribute("verb");
		attr.setValue(String.valueOf(operation_scope[5]));
		hasScope.setAttributeNode(attr);
		attr = gidl_model.createAttribute("uri");
		attr.setValue(String.valueOf(operation_scope[6]));
		hasScope.setAttributeNode(attr);

		createInputData(service, hasOperations);

		if (!isOneWay) {

			createOutputData(service, hasOperations);
		}

		// write the content into gidl file
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer;
		try {

			if(new File(UPLOAD_DIRECTORY + File.separator + thingId).mkdirs()) {

				transformer = transformerFactory.newTransformer();
				DOMSource source = new DOMSource(gidl_model);
				StreamResult result = new StreamResult(
						new File(UPLOAD_DIRECTORY + File.separator + thingId + File.separator + dexidlPath));
				transformer.transform(source, result);
			} else {

				status = false;
				json.put("message", "Can not save file on disk");

			}

		} catch (TransformerException e) {
			status = false;
			json.put("message", e);

		}

	}

	private void createInputData(String service[], Element hasOperations) {

		String operation_input_context[] = service[1].split("\\:");
		String operation_input_data[] = service[2].split("\\:");

		// inputData element
		Element inputData = gidl_model.createElement("inputData");
		hasOperations.appendChild(inputData);

		// setting attribute to element
		attr = gidl_model.createAttribute("name");
		attr.setValue(String.valueOf("request"));
		inputData.setAttributeNode(attr);
		attr = gidl_model.createAttribute("context");
		attr.setValue(String.valueOf(operation_input_context[0]));
		inputData.setAttributeNode(attr);
		attr = gidl_model.createAttribute("media");
		attr.setValue(String.valueOf(operation_input_context[1]));
		inputData.setAttributeNode(attr);
		for (String input_data : operation_input_data) {

			String inputdata[] = input_data.split("_");

			// hasDataType element
			Element hasDataType = gidl_model.createElement("hasDataType");
			inputData.appendChild(hasDataType);

			// setting attribute to element
			attr = gidl_model.createAttribute("name");
			attr.setValue(String.valueOf(inputdata[1]));
			hasDataType.setAttributeNode(attr);

			attr = gidl_model.createAttribute("minOccurs");
			attr.setValue(String.valueOf(inputdata[2]));
			hasDataType.setAttributeNode(attr);

			attr = gidl_model.createAttribute("maxOccurs");
			attr.setValue(String.valueOf(inputdata[3]));
			hasDataType.setAttributeNode(attr);
			if (inputdata[0].equals("simple")) {

				attr = gidl_model.createAttribute("xsi:type");
				attr.setValue(String.valueOf("gidl:SimpleType"));
				hasDataType.setAttributeNode(attr);
				attr = gidl_model.createAttribute("type");
				attr.setValue(String.valueOf(inputdata[4]));
				hasDataType.setAttributeNode(attr);

			} else {

				attr = gidl_model.createAttribute("xsi:type");
				attr.setValue(String.valueOf("gidl:ComplexType"));
				hasDataType.setAttributeNode(attr);
			}

		}
	}

	private void createOutputData(String service[], Element hasOperations) {

		String operation_output_context[] = service[3].split(":");
		String operation_output_data[] = service[4].split(":");

		// inputData element
		Element outputData = gidl_model.createElement("outputData");
		hasOperations.appendChild(outputData);

		// setting attribute to element
		attr = gidl_model.createAttribute("name");
		attr.setValue(String.valueOf("request"));
		outputData.setAttributeNode(attr);
		attr = gidl_model.createAttribute("context");
		attr.setValue(String.valueOf(operation_output_context[0]));
		outputData.setAttributeNode(attr);
		attr = gidl_model.createAttribute("media");
		attr.setValue(String.valueOf(operation_output_context[1]));
		outputData.setAttributeNode(attr);
		for (String output_data : operation_output_data) {

			String outputdata[] = output_data.split("_");

			// hasDataType element
			Element hasDataType = gidl_model.createElement("hasDataType");
			outputData.appendChild(hasDataType);

			// setting attribute to element
			attr = gidl_model.createAttribute("name");
			attr.setValue(String.valueOf(outputdata[1]));
			hasDataType.setAttributeNode(attr);

			attr = gidl_model.createAttribute("minOccurs");
			attr.setValue(String.valueOf(outputdata[2]));
			hasDataType.setAttributeNode(attr);

			attr = gidl_model.createAttribute("maxOccurs");
			attr.setValue(String.valueOf(outputdata[3]));
			hasDataType.setAttributeNode(attr);
			if(outputdata[0].equals("simple")){

				attr = gidl_model.createAttribute("xsi:type");
				attr.setValue(String.valueOf("gidl:SimpleType"));
				hasDataType.setAttributeNode(attr);
				attr = gidl_model.createAttribute("type");
				attr.setValue(String.valueOf(outputdata[4]));
				hasDataType.setAttributeNode(attr);

			} else {

				attr = gidl_model.createAttribute("xsi:type");
				attr.setValue(String.valueOf("gidl:ComplexType"));
				hasDataType.setAttributeNode(attr);
			}

		}
	}

}
