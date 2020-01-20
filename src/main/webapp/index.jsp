
<%@page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<%@page import="java.lang.String"%>
<%@page import="org.json.simple.JSONObject"%>
<%@page import="org.json.simple.parser.JSONParser"%>
<%@page import="com.mongodb.DBObject"%>
<%@page import="java.util.List"%>


<html>
<head>
<title>DeXMS Service</title>
<link rel="stylesheet" href="css/jquery-ui.css">
<link rel="stylesheet" href="css/style.css">

<script src="js/jquery-3.2.1.js"></script>
<script src="js/jquery-ui.js"></script>
<script src="js/dashboard.js"></script>

<script>
	$(function() {
		
		$("#result-thing").hide();
		$( "#fieldset-generate-gidl-file" ).hide();
	    $( "#fieldset-load-gidl-file" ).hide();
		$("#tabs").tabs();
		$(".dialog").draggable();
		$("#accordion").accordion();
		$("#dialog").dialog();
		$( "#generate-gidl-file" ).checkboxradio();
		$( "#load-gidl-file" ).checkboxradio();
	});
	
	 
</script>

</head>

<body>
	<div class="wrapper">
		<div class="container">
		   <table id="example" class="display" width="100%" cellspacing="0">
						<tbody>
						
						<tr>
								<td  width="5%">

									 <form method="post" action="Dashboard">
									    
									    <input type="hidden" name="load" id="load" value="DashboardServlet" />
										<input class="ui-button ui-widget ui-corner-all" type="submit"
											value="Home">
																						
									</form>
									
								</td>
								<td width="10%"></td>
								<td width="10%"></td>
								<td width="10%"></td>
								<td width="10%"></td>
								<td width="10%"></td>
								<td width="10%"></td>
								<td width="10%"></td>
							</tr>
							
						</tbody>
			</table>
		  
			<div id="tabs">
				<ul>
					<li><a href="#dashboard">DeX-IDL Files</a></li>
					<li><a href="#things">Create DeX-IDL File (Gidl)</a></li>
				</ul>
				<div id="dashboard">
					<table id="example" class="display" width="100%" cellspacing="0">
						<tbody>

							<tr>
								<td width="50%" cellspacing="0">
									<div id="accordion">

										<%
											
										   List<DBObject> devices = (List<DBObject>) session.getAttribute("devices");
											if (devices != null) {

												for (DBObject device : devices) {

													out.println("<h3> DeX-IDL of device " + device.get("name") + "</h3>");
													out.println("<div><p>Protocol :" + device.get("protocol") + "</p>");
													out.println("<p><a href='Dashboard?gidl=" + device.get("gidlPath")+"'><img src='css/images/download.ico' width='25' alt='Download DeX-IDL file'></a></p>");
													out.println("<p><form method='post' action='Dashboard'> <input type='hidden' name='delete' id='device-"+device.get("_id")+"' value='device-"+device.get("_id")+"' /><input class='ui-button ui-widget ui-corner-all'  class='delete-thing' value='Delete' type='submit'/></form></p></div>");

												}

											}else{
												
												
												out.println("<h3>No file created for devices</h3>");
											}

											List<DBObject> services = (List<DBObject>) session.getAttribute("services");
											if (services != null) {

												for (DBObject service : services) {

													out.println("<h3> DeX-IDL of service " + service.get("name") + "</h3>");
													out.println("<div><p>Protocol :" + service.get("protocol") + "</p>");
													out.println("<p><a href='Dashboard?gidl=" + service.get("gidlPath")+"'><img src='css/images/download.ico' width='25' alt='Download DeX-IDL file'/></a></p>");
													out.println("<p><form method='post' action='Dashboard'> <input type='hidden' name='delete' id='service-"+service.get("_id")+"' value='service-"+service.get("_id")+"' /><input class='ui-button ui-widget ui-corner-all'  class='delete-thing' value='Delete' type='submit'/></form></p></div>");
													
												}

											}else{
												
												
												out.println("<h3>No file created for services</h3>");
											}
										%>
	
	
									</div>
								</td>
								<td width="50%" cellspacing="0"></td>
							</tr>
					</table>

				</div>
				<div id="things">
				 <fieldset id="result-thing" style="border:none;">
								
				 </fieldset>
						
					<form method="post"  id="form-add-things" enctype="multipart/form-data">
						<label for="name">Name :</label><br /> <input class="text ui-widget-content ui-corner-all" type="text" name="name" id="name" /><br /> <br /> 
						<label for="thingType">Thing Type :</label><br /> <select class="text ui-widget-content ui-corner-all" name="thingType" id="thingType"><option value="SERVICE">SERVICE</option><option value="DEVICE">DEVICE</option></select><br /> <br /> 
						<label for="protocol">Protocol :</label><br /> <select class="text ui-widget-content ui-corner-all" name="protocol" id="protocol"><option value="REST">REST</option><option value="MQTT">MQTT</option><option value="WEB_SOCKETS">WEB SOCKETS</option><option value="COAP">COAP</option></select><br /> <br /> 
						<label for="host-address">Host Address :</label><br /> <input class="text ui-widget-content ui-corner-all" type="text" name="host-address" id="host-address" /><br /> <br /> 
						<label for="host-port">Port Number :</label><br /> <input class="text ui-widget-content ui-corner-all" type="text" name="host-port" id="host-port" /><br /> <br /> 
						<label for="generate-gidl-file">Generate new DeX-IDL file</label><input type="radio" value="generate-gidl-file" name="gidlfilechoice" id="generate-gidl-file" onclick = "gidlFileChoice(this.id)"> <br /><br />
						<fieldset id="fieldset-generate-gidl-file">
							<div id=operations></div>
							<input class="ui-button ui-widget ui-corner-all" value="Add operation" id="add-operation"/>
							<input class="ui-button ui-widget ui-corner-all" value="Cancel" id="cancel-add-operation"/>
						</fieldset>
						<br /> <br />
						<input type="button" class="ui-button ui-widget ui-corner-all" id="register" value="register"/>
					</form>
				</div>	
			</div>
		</div>
	</div>
</body>
</html>