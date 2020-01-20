package org.zefxis.dexms.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
import org.zefxis.dexms.model.Device;
import org.zefxis.dexms.model.Service;
import org.zefxis.dexms.persistence.DevicePersistence;
import org.zefxis.dexms.persistence.ServicePersistence;
import org.zefxis.dexms.utils.Utils;
import com.mongodb.DBObject;

public class DashboardServlet extends HttpServlet{

	/**
	 * 
	 */

	private static final String UPLOAD_DIRECTORY =  Utils.getUPLOAD_DIRECTORY();
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		DevicePersistence devices = new DevicePersistence();
		ServicePersistence services = new ServicePersistence();
		String load = request.getParameter("load");
		String delete = request.getParameter("delete");
		String gidlFilename = request.getParameter("gidl");

		if (delete != null) {

			if (delete.split("\\-").length > 1) {
				String thing_type = delete.split("\\-")[0];
				String thing_id = delete.split("\\-")[1];
				switch (thing_type) {
				case "device":

					devices.deleteOneThing(thing_id);
					deleteFile(thing_id);
					break;

				case "service":
					services.deleteOneThing(thing_id);
					deleteFile(thing_id);

					break;

				default:
					break;
				}
			}
			HttpSession session = request.getSession();
			List<DBObject> allDevices = devices.getThings();
			session.setAttribute("devices", allDevices);
			List<DBObject> allServices = services.getThings();
			session.setAttribute("services", allServices);
			session.setAttribute("errors", null);
			RequestDispatcher rd = request.getRequestDispatcher("index.jsp");
			rd.forward(request, response);

		} else if (load != null) {

			HttpSession session = request.getSession();
			List<DBObject> allDevices = devices.getThings();
			session.setAttribute("devices", allDevices);
			List<DBObject> allServices = services.getThings();
			session.setAttribute("services", allServices);
			session.setAttribute("errors", null);
			RequestDispatcher rd = request.getRequestDispatcher("index.jsp");
			rd.forward(request, response);

		} else if (gidlFilename != null) {

			// TODO Auto-generated method stub
			response.setContentType("text/html");
			PrintWriter out = response.getWriter();
			String thing_id = null;
			Device device = devices.getOneThing("gidlPath", gidlFilename);
			thing_id = device.getId();
			if(thing_id == null) {
				
				Service service = services.getOneThing("gidlPath", gidlFilename);
				thing_id = service.getId();
			}
			String filepath = UPLOAD_DIRECTORY+File.separator+thing_id+File.separator;
			response.setContentType("APPLICATION/OCTET-STREAM");
			response.setHeader("Content-Disposition", "attachment; filename=\"" + gidlFilename + "\"");
			response.setHeader("Content-Disposition", "inline; filename=\"" + gidlFilename + "\"");
			FileInputStream fileInputStream = new FileInputStream(filepath + gidlFilename);

			int i;
			while ((i = fileInputStream.read()) != -1) {
				out.write(i);
			}
			fileInputStream.close();
			out.close();

		} else {

			HttpSession session = request.getSession();
			List<DBObject> allDevices = devices.getThings();
			session.setAttribute("devices", allDevices);
			List<DBObject> allServices = services.getThings();
			session.setAttribute("services", allServices);
			session.setAttribute("errors", null);
			RequestDispatcher rd = request.getRequestDispatcher("index.jsp");
			rd.forward(request, response);
		}

	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doPost(request, response);
	}

	public void deleteFile(String thingId) {

		try {

			FileUtils.forceDelete(new File(UPLOAD_DIRECTORY + File.separator + thingId));

		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
