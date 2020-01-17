/**
 * 
 */
	var operation_number = 0;
	var input_element_nbr = 0;
	var ouput_element_nbr = 0;
    var $gidl_file_choice;
    
    $(document).on("click", "#register", function() {
		
    	
    	var $form = $("#form-add-things")[0];
    	var $data = new FormData($form);
        switch($gidl_file_choice){
       			
       		case 'generate-gidl-file' :
       			
       			var $name = $("#name").val();
       	    	var $thing_type = $("#thingType option:selected").val();
       	    	var $protocol =   $( "#protocol option:selected" ).val();
       	    	var $host_address = $("#host-address").val();
       	    	var $host_port = $("#host-port").val();
       			var $op_number = 1;
       			var $role_1 = $("#role"+$op_number+" option:selected").val();
       			var $operation_name1 = $("#operation-name"+$op_number).val();
       			var $qos_1 = $("#qos"+$op_number+" option:selected").val();
       			var $type_1 = $("#type"+$op_number+" option:selected").val();
       			var $scope_name1 = $("#scope-name-"+$op_number).val();
       			var $scope_verb1 = $("#scope-verb-"+$op_number).val();
       			var $scope_uri1 = $("#scope-uri-"+$op_number).val();
       			var $service = $role_1+":"+$operation_name1+":"+$qos_1+":"+$type_1+":"+$scope_name1+":"+$scope_verb1+":"+$scope_uri1+"|";
       			
       			/* Get input data */
       			var $input_context_body_1 = $("#input-data-context-body-"+$op_number+"-context option:selected").val();
       			var $input_context_mediatype_1 = $("#input-data-context-body-"+$op_number+"-mediatype option:selected").val();
       			$service +=  $input_context_body_1+":"+$input_context_mediatype_1+"|";
       			// alert(" GIDL "+$role_1+" - "+$operation_name1+" - "+$qos_1+" - "+$type_1+" - "+$scope_name1+" - "+$scope_verb1+" - "+$scope_uri1);
       			
       			
       			var $input_number = $("#div-input-data-"+$op_number+" > .field-input").length;
       			
       			for (var $i = 1; $i <= $input_number; $i++) {
       				
       				var $hidden = $("#hidden-"+$op_number+"-"+$i).val();
           			var $input_data_name_1_1 = $("#input-data-name-"+$op_number+"-"+$i).val();
           			var $input_data_minoccurence_1_1 = $("#input-data-minoccurence-"+$op_number+"-"+$i+" option:selected").val();
           			var $input_data_maxoccurence_1_1 = $("#input-data-maxoccurence-"+$op_number+"-"+$i+" option:selected").val();
           			$service += $hidden+"_"+$input_data_name_1_1+"_"+$input_data_minoccurence_1_1+"_"+$input_data_maxoccurence_1_1;
           			if($hidden == "simple"){
           				
           				var $input_data_type_1_1 = $("#input-data-type-"+$op_number+"-"+$i+" option:selected").val();
           				$service += "_"+$input_data_type_1_1;
           			}
           			if($i < $input_number){
           				
           				$service += ":";
           			}
           			
       			}
       			
       			if($type_1 != "one_way"){
       				
       				/* Get output data */
           			var $output_context_body_1 = $("#output-data-context-body-"+$op_number+"-context option:selected").val();
           			var $output_context_mediatype_1 = $("#output-data-context-body-"+$op_number+"-mediatype option:selected").val();
           			$service += "|"+$output_context_body_1+":"+$output_context_mediatype_1+"|";
           			var $output_number = $("#div-output-data-"+$op_number+" >  .field-output").length;
           			for (var $i = 1; $i <= $output_number; $i++) {
           			  
           				
           				$hidden = $("#hidden-"+$op_number+"-"+$i).val();
               			var $output_data_name_1_1 = $("#output-data-name-"+$op_number+"-"+$i).val();
               			var $output_data_minoccurence_1_1 = $("#output-data-minoccurence-"+$op_number+"-"+$i+" option:selected").val();
               			var $output_data_maxoccurence_1_1 = $("#output-data-maxoccurence-"+$op_number+"-"+$i+" option:selected").val();
               			$service += $hidden+"_"+$output_data_name_1_1+"_"+$output_data_minoccurence_1_1+"_"+$output_data_maxoccurence_1_1;
               			if($hidden == "simple"){
               				
               				var $output_data_type_1_1 = $("#output-data-type-"+$op_number+"-"+$i+" option:selected").val();
               				$service += "_"+$output_data_type_1_1;
               			}
               			if($i < $output_number){
               				
               				$service += ":";
               			}
               			
           			}
       				
       			}
       			
       			$.ajax({
       				
       				async: true,
       				url: 'DeXIDLGenerator',
       	            dataType: 'json',
       	            data: {gidl:$service, name:$name,thingType:$thing_type,protocol:$protocol,host_address:$host_address,host_port:$host_port},
       	            type: 'post',
       	            cache: false,
                    success: function (response){
                   	 	
                   	 var json = JSON.parse(JSON.stringify(response));
                   	 if(json.status){
                   		 
                   		 addThingsucces(json.message,"result-thing");
                   	 }
                   	 else{
                   		 
                   		 addThingerror(json.message,"result-thing");
                   	 }
                        $("#register").prop("disabled", false);
                       

                    },
                    error: function (e) {
                   	 
                   	 addThingerror(e.responseText,"result-thing");
                        $("#register").prop("disabled", false);

                    }
                });
       			
       			break;
    	}
    	
	});
    
    
    
   $(document).on("click", "#cancel-add-operation", function() {
		
	   $("#operations").html("");
		
	});
   

    $(document).on("click", "#add-operation", function() {
		
    	operation_number = $("#operations > .operation").length;
    	operation_number++;
		var element_nbr = operation_number;
    	var html = '<div class="operation" id="operation-'+element_nbr+'">';
    	html += '<fieldset><legend>Operation '+element_nbr+'</legend>';
    	html += '<label for="role'+element_nbr+'">Role :</label><br /> <select class="text ui-widget-content ui-corner-all" name="role'+element_nbr+'" id="role'+element_nbr+'"><option value="provider">PROVIDER</option><option value="consumer">CONSUMER</option></select><br /> <br />';
    	html += '<label for="operation-name'+element_nbr+'">Operation name :</label><br /> <input class="text ui-widget-content ui-corner-all" type="text" name="operation-name'+element_nbr+'" id="operation-name'+element_nbr+'" /><br /><br />';
    	html += '<label for="qos'+element_nbr+'">Quality of service :</label><br/><select class="text ui-widget-content ui-corner-all" name="qos'+element_nbr+'" id="qos'+element_nbr+'"><option value="unreliable">UNRELIABLE</option><option value="reliable">RELIABLE</option></select><br/><br/>';
    	html += '<label for="type'+element_nbr+'"> Type :</label><br /> <select onchange="getvalType(this.id,'+element_nbr+')" class="text ui-widget-content ui-corner-all" name="type'+element_nbr+'" id="type'+element_nbr+'"><option value="">----</option><option value="one_way">ONE WAY</option><option value="two_way_sync">TWO WAYS SYNCHRONOUS</option><option value="two_way_async">TWO WAYS ASYNCHRONOUS</option><option value="strean">STREAM</option></select><br /> <br />';
    	html += '<fieldset id="scope-'+element_nbr+'" accesskey=""><legend>Operation Scope</legend>';
    	html += '<label for="scope-name-'+element_nbr+'" accesskey="">Name :</label><br accesskey=""/> <input class="text ui-widget-content ui-corner-all" type="text" name="scope-name-'+element_nbr+'" id="scope-name-'+element_nbr+'"/><br/><br/>';
        html += '<label for="scope-verb-'+element_nbr+'">Verb :</label><br /> <input class="text ui-widget-content ui-corner-all" type="text" name="scope-verb-'+element_nbr+'" id="scope-verb-'+element_nbr+'" /><br /><br />';
        html += '<label for="scope-uri-'+element_nbr+'">Uri :</label><br /> <input class="text ui-widget-content ui-corner-all" type="text" name="scope-uri-'+element_nbr+'" id="scope-uri-'+element_nbr+'" /><br /><br />';
        html += '</fieldset>';
        html += '<fieldset id="fieldset-input-data-'+element_nbr+'"><legend>Input Data</legend>';
        html += '<div id="input-data-context-body-'+element_nbr+'">';
        html += '<label for="input-data-context-body-'+element_nbr+'-context"> Context :</label><br /> <select class="text ui-widget-content ui-corner-all" name="input-data-context-body-'+element_nbr+'-context" id="input-data-context-body-'+element_nbr+'-context"><option value="body">BODY</option><option value="path">PATH</option><option value="query">QUERY</option><option value="form">FORM</option><option value="header">HEADER</option></select><br /> <br />';
        html += '<label for="input-data-type-'+element_nbr+'"> Media type :</label><br /> <select class="text ui-widget-content ui-corner-all" name="input-data-context-body-'+element_nbr+'-mediatype" id="input-data-context-body-'+element_nbr+'-mediatype"><option value="json">JSON</option><option value="xml">XML</option></select><br /><br />';
        html += '</div>';
        html += '<div id="div-input-data-'+element_nbr+'"></div>';
        html += '<div id="div-input-data-button">';
        html += '<input class="ui-button ui-widget ui-corner-all" value="Add Simple data" id="add-simple-inputdata-'+element_nbr+'" onclick="addSimpleInputdata('+element_nbr+')">';
        html += '<input class="ui-button ui-widget ui-corner-all" value="Add Complex data" id="add-complex-inputdata-'+element_nbr+'" onclick="addComplexInputdata('+element_nbr+')">';		
        html += '</div>';
        html += '</fieldset>';
        html += '<fieldset id="fieldset-output-data-'+element_nbr+'"><legend>Output Data</legend>';
        html += '<div id="output-data-context-body-'+element_nbr+'">';	
        html += '<label for="output-data-context-body-'+element_nbr+'-context"> Context :</label><br /> <select class="text ui-widget-content ui-corner-all" name="output-data-context-body-'+element_nbr+'-context" id="output-data-context-body-'+element_nbr+'-context"><option value="body">BODY</option><option value="path">PATH</option><option value="query">QUERY</option><option value="form">FORM</option><option value="header">HEADER</option></select><br /> <br />';
        html += '<label for="output-data-context-body-'+element_nbr+'-mediatype"> Media type :</label><br /> <select class="text ui-widget-content ui-corner-all" name="output-data-context-body-'+element_nbr+'-mediatype" id="output-data-context-body-'+element_nbr+'-mediatype"><option value="json">JSON</option><option value="xml">XML</option></select><br /> <br />';
        html += '</div>';
        html += '<div id="div-output-data-'+element_nbr+'"></div>';
        html += '<div id="div-output-data-button">';
        html += '<input type="button" class="ui-button ui-widget ui-corner-all" value="Add Simple data" id="add-simple-outputdata-'+element_nbr+'" onclick="addSimpleOutputdata('+element_nbr+')">';
        html += '<input type="button" class="ui-button ui-widget ui-corner-all" value="Add Complex data" id="add-complex-outputdata-'+element_nbr+'" onclick="addComplexOutputdata('+element_nbr+')">';	
        html += '</div>';
        html += '</fieldset>';
        html += '</fieldset>';
        html += '</div>';
        $("#operations").append(html);
	});
    
	
	function addSimpleOutputdata($idnumber){
		
		ouput_element_nbr = $("#div-output-data-"+$idnumber+" > fieldset").length;
		ouput_element_nbr++;
		addSimpleType("output","div-output-data-"+$idnumber,$idnumber,ouput_element_nbr);
	}
	
    function addComplexOutputdata($idnumber){
		
    	ouput_element_nbr = $("#div-output-data-"+$idnumber+" > fieldset").length;
    	ouput_element_nbr++;
		addComplexType("output","div-output-data-"+$idnumber,$idnumber,ouput_element_nbr);
	}
    
    
    function addSimpleInputdata($idnumber){
		
    	input_element_nbr = $("#div-input-data-"+$idnumber+" > fieldset").length;
    	input_element_nbr++;
		addSimpleType("input","div-input-data-"+$idnumber,$idnumber,input_element_nbr);
	}
	
    function addComplexInputdata($idnumber){
		
    	input_element_nbr = $("#div-input-data-"+$idnumber+" > fieldset").length;
    	input_element_nbr++;
		addComplexType("input","div-input-data-"+$idnumber,$idnumber,input_element_nbr);
	}
    
    
    function addComplexType($part_interaction,$idname,$operation_number, $idnumber){
    	
			 var html = '<fieldset class="field-'+$part_interaction+'" id="field-'+$part_interaction+'-data-'+$operation_number+'-'+$idnumber+'"><legend>Complex '+$part_interaction+' Data '+$idnumber+'</legend>'
			    html += '<label for="'+$part_interaction+'-data-name-'+$operation_number+'-'+$idnumber+'">Name :</label><br />' 
			    html += '<input class="text ui-widget-content ui-corner-all" type="text" name="'+$part_interaction+'-data-name-'+$operation_number+'-'+$idnumber+'" id="'+$part_interaction+'-data-name-'+$operation_number+'-'+$idnumber+'" /><br/><br/>';
				html += '<label for="'+$part_interaction+'-data-minoccurence-'+$operation_number+'-'+$idnumber+'">Minimum occurence :</label><br /> <select class="text ui-widget-content ui-corner-all" name="'+$part_interaction+'-data-minoccurence-'+$operation_number+'-'+$idnumber+'" id="'+$part_interaction+'-data-minoccurence-'+$operation_number+'-'+$idnumber+'"><option value="one">ONE</option><option value="unbound">UNBOUND</option></select><br /> <br />';
				html += '<label for="'+$part_interaction+'-data-maxoccurence-'+$operation_number+'-'+$idnumber+'">Maximum occurence :</label><br /> <select class="text ui-widget-content ui-corner-all" name="'+$part_interaction+'-data-maxoccurence-'+$operation_number+'-'+$idnumber+'" id="'+$part_interaction+'-data-maxoccurence-'+$operation_number+'-'+$idnumber+'"><option value="one">ONE</option><option value="unbound">UNBOUND</option></select><br /> <br />';
				html += '<input type="hidden" id="hidden-'+$operation_number+'-'+$idnumber+'" value="complex"/>';
				html += '</fieldset>';
				$("#"+$idname).append(html);
   }
    
   function addSimpleType($part_interaction, $idname,$operation_number, $idnumber){
	   
	        var html = '<fieldset class="field-'+$part_interaction+'" id="field-'+$part_interaction+'-data-'+$operation_number+'-'+$idnumber+'"><legend>Simple '+$part_interaction+' Data '+$idnumber+'</legend>'
		    html += '<label for="'+$part_interaction+'-data-name-'+$operation_number+'-'+$idnumber+'">Name :</label><br />' 
		    html += '<input class="text ui-widget-content ui-corner-all" type="text" name="'+$part_interaction+'-data-name-'+$operation_number+'-'+$idnumber+'" id="'+$part_interaction+'-data-name-'+$operation_number+'-'+$idnumber+'" /><br/><br/>';
	        html += '<label for="'+$part_interaction+'-data-minoccurence-'+$operation_number+'-'+$idnumber+'">Minimum occurence :</label><br /> <select class="text ui-widget-content ui-corner-all" name="'+$part_interaction+'-data-minoccurence-'+$operation_number+'-'+$idnumber+'" id="'+$part_interaction+'-data-minoccurence-'+$operation_number+'-'+$idnumber+'"><option value="one">ONE</option><option value="unbound">UNBOUND</option></select><br /> <br />';
			html += '<label for="'+$part_interaction+'-data-maxoccurence-'+$operation_number+'-'+$idnumber+'">Maximum occurence :</label><br /> <select class="text ui-widget-content ui-corner-all" name="'+$part_interaction+'-data-maxoccurence-'+$operation_number+'-'+$idnumber+'" id="'+$part_interaction+'-data-maxoccurence-'+$operation_number+'-'+$idnumber+'"><option value="one">ONE</option><option value="unbound">UNBOUND</option></select><br /> <br />';
			html += '<label for="'+$part_interaction+'-data-type-'+$operation_number+'-'+$idnumber+'">Type :</label><br /> <select class="text ui-widget-content ui-corner-all" name="'+$part_interaction+'-data-type-'+$operation_number+'-'+$idnumber+'" id="'+$part_interaction+'-data-type-'+$operation_number+'-'+$idnumber+'"><option value="string">STRING</option><option value="boolean">BOOLEAN</option><option value="integer">INTEGER</option><option value="decimal">DECIMAL</option><option value="double">DOUBLE</option><option value="float">FLOAT</option><option value="time">TIME</option><option value="date">DATE</option></select><br /><br />';
			html += '<input type="hidden" id="hidden-'+$operation_number+'-'+$idnumber+'" value="simple"/>';
			html += '</fieldset>';
			$("#"+$idname).append(html);
    } 
   
   function gidlFileChoice($id){
	   
	   switch($("#"+$id).val()){
       	case 'load-gidl-file' :
       		
       		$gidl_file_choice = "load-gidl-file";
       		$( "#fieldset-load-gidl-file" ).show();
       		$( "#fieldset-generate-gidl-file" ).hide();
           break;
        case 'generate-gidl-file' :
        	
        	$gidl_file_choice = "generate-gidl-file";
        	$( "#fieldset-generate-gidl-file" ).show();
        	$( "#fieldset-load-gidl-file" ).hide();
           break;
	   } 
   }
   
   
   function addThingerror($message, $container){
	   
	   var html = '<div class="ui-widget">';
	   html += '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">';
	   html += '<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span> <strong>Alert:</strong>';
	   html += $message+'</p></div></div>';
	   $("#"+$container).html(html);
	   $( "#"+$container).show();
   }
   
   
  function addThingsucces($message, $container){
	   
	   var html = '<div class="ui-widget">';
	   html += '<div class="ui-state-highlight ui-corner-all" style="padding: 0 .7em;">';
	   html += '<p><span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span> <strong>Info:</strong>';
	   html += $message+'</p></div></div>';
	   $("#"+$container).html(html);
	   $( "#"+$container).show();
   }
   
  function getvalType($id, $op_number){
	  
	  var $interaction_type = $("#"+$id+" option:selected").val();
	  var split = $interaction_type.split("-");
	  if($interaction_type == "one_way"){
		  
		  $("#fieldset-output-data-"+$op_number).hide();
		  
	  }else{
		  
		  $( "#fieldset-output-data-"+$op_number).show(500);
	  }
	  
  }
  
/*  function deleteThing($id){
	  
	  
	  fnOpenNormalDialog($id);
  }
  
  
  function fnOpenNormalDialog($id) {
	  
	    $("#dialog-confirm-delete").html("Are yiou sure that you want to delete this thing ?");
	    // Define the Dialog and its properties.
	    $("#dialog-confirm").dialog({
	        resizable: false,
	        modal: true,
	        title: "Confirm action",
	        height: 250,
	        width: 400,
	        buttons: {
	            "Yes": function () {
	                $(this).dialog('close');
	                callback(true);
	            },
	                "No": function () {
	                $(this).dialog('close');
	                callback(false);
	            }
	        }
	    });
	}

	$('#btnOpenDialog').click(fnOpenNormalDialog);

	function callback(value, $id) {
	    if (value) {
	        
	    	$.ajax({
				
	  		  async: true,
	  		  url: 'DashboardController',
	            dataType: 'json',
	            data: {id: $id},
	            type: 'post',
	            cache: false,
	            success: function(response)
	            {
	            	
	            	
	            }
	            
	  		});
	    } else {
	        alert("Rejected");
	        
	    }
	}*/
	
   
   
    
     
	