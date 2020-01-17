package org.zefxis.dexms.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Utils {
	
	
	public static String createTempDir() {

		String pathFolderToString = "";
		Path pathFolder = FileSystems.getDefault().getPath(System.getProperty("java.io.tmpdir"));
		Path tempFolder = null;
		try {
			
			
			Path tempFolderPath = Paths.get(pathFolder.toString()+File.separator+"dexms_service");
			if(!Files.exists(tempFolderPath)) {
				
				tempFolder = Files.createDirectories(tempFolderPath);
				pathFolderToString = tempFolder.toString();
			}else {
				
				
				pathFolderToString = tempFolderPath.toString();
			}
			

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	        
		return pathFolderToString;

	}
	
	
	public static String getUPLOAD_DIRECTORY() {
		
		
		String UPLOAD_DIRECTORY = createTempDir()+File.separator+"UPLOAD";
		return UPLOAD_DIRECTORY;
	}
	
	public static String getUPLOAD_BC_DIRECTORY() {
		
		
		String UPLOAD_BC_DIRECTORY = createTempDir()+File.separator+"UPLOAD"+File.separator+"BindingComponent";
		return UPLOAD_BC_DIRECTORY;
	}
	
	
}
