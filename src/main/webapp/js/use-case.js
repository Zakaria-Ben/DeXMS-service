/**
 * 
 */

var things_connected = [];
var $things_to_monitore = [];
var endpoint1 = "";
var endpoint2 = "";
var $use_case_name = "";
var $generate_val = "";
var $length = 0;
var $monitor = false;
var $MonitorController = [];

$(function() {

	$("#editor").css("height", $("#example-editor").height());
	$("#droppable").css("height",
			parseInt($("#editor").height()) + parseInt(20));
	$("#fieldset-droppable").css("height", $("#droppable").height());

	setInterval(function(){

		if ($monitor){

			monitoringProcess();

		}

	}, 5000);

});

$("body")
		.on(
				"click",
				"#start-monitoring",
				function() {

					var $data = "";
					var $valid = true;
					for (i in $things_to_monitore) {

						var $thing = $things_to_monitore[i];
						var ckbox = $('#' + $thing);
						var $isChecked = $('#' + $thing).attr('checked');
						if (ckbox.is(':checked')){

							var $port_number = $('#port-' + $thing).val();
							if ($.isNumeric($port_number)) {

								if ($MonitorController.indexOf($thing) == -1) {

									$MonitorController.push($thing);
								}

								$data += $thing + '-' + $port_number;
								if (i < parseInt($length - 1)) {

									$data += ':';
								}

							} else {

								$valid = false;
							}
						}
					}

					if ($data == "" || $valid == false){

						return;

					} else {

						$
								.ajax({

									async : true,
									url : 'MonitorController',
									dataType : 'json',
									data : {
										req : $data,
										action : 'start'
									},
									type : 'post',
									cache : false,
									success : function(response) {

										var json = JSON.parse(JSON
												.stringify(response));
										if (json.status) {

											var html = "";
											$("#start-monitoring").hide();
											$("#stop-monitoring").show();
											for (i in $MonitorController) {

												var $thing = $MonitorController[i];
												html += '<fieldset width="100%" id="monitoring-'
														+ $thing.split("-")[2]
														+ '"><legend class="ui-corner-all ui-button ui-widget">'
														+ $thing.split("-")[0]
														+ ' '
														+ $thing.split("-")[2]
														+ '</legend>';

												html += '<table class="display" width="100%" cellspacing="0" style="vertical-align: baseline;"><thead><tr class="ui-state-default"><th>Message</th><th>Time</th><th>Total messages</th></tr></thead>';
												html += '<tbody id="monitoring_tbody">';

												html += '<td id="msg-'
														+ $thing.split("-")[2]
														+ '"></td>';
												html += '<td id="time-'
														+ $thing.split("-")[2]
														+ '"></td>';
												html += '<td id="number-'
														+ $thing.split("-")[2]
														+ '"></td>';
												html += '</tr>';
												html += '</tbody></table></fieldset>';
											}

											$("#monitoring-process").html(html);
											$("#monitoring-process").show();
											$monitor = true;
										}

									},
									error : function(e) {

										alert(e.responseText);
									}
								});

					}

				});

$("body").on("click", "#stop-monitoring", function() {

	var $thingToStop = "Stop";
	for (i in $MonitorController) {

		var $thing = $MonitorController[i];
		$thingToStop += ":" + $thing.split("-")[2];
	}
	$.ajax({

		async : true,
		url : 'MonitorController',
		dataType : 'json',
		data : {

			action : 'stop',
			thingToStop : $thingToStop
		},
		type : 'post',
		cache : false,
		success : function(response) {

			var json = JSON.parse(JSON.stringify(response));
			if (json.status) {

				$("#start-monitoring").show();
				$("#stop-monitoring").hide();
				$("#monitoring-process").hide();
				$monitor = false;
				while ($MonitorController.length) {

					$MonitorController.pop();
				}

			}

		},
		error : function(e) {

			alert(e.responseText);
		}
	});

});

$("body")
		.on(
				"click",
				"#apply-use-case",
				function() {

					$("#tabs-usecase-monitor").show(500);
					$("#usecase-monitor-name").html($use_case_name);

					if (things_connected.indexOf(endpoint1 + endpoint2) > -1) {

						return;

					}
					things_connected.push(endpoint1 + endpoint2);
					$
							.ajax({

								async : true,
								url : 'UseCaseController',
								dataType : 'json',
								data : {
									req : 'get_use_case',
									use_case : $use_case_name
								},
								type : 'post',
								cache : false,
								success : function(response) {

									var json = JSON.parse(JSON
											.stringify(response));
									if (json.status) {

										var html = "";
										var data = JSON.parse(json.data);
										var $bc_service_name = "not_used";
										for (i in data.end_to_end) {

											var end_to_end = JSON
													.parse(JSON
															.stringify(data.end_to_end[i]));
											if (end_to_end.endpoint1 == endpoint1
													&& end_to_end.endpoint2 == endpoint2) {

												html += "<tr>";
												html += "<td id='"
														+ end_to_end.endpoint1
														+ "'>"
														+ $(
																"#"
																		+ end_to_end.endpoint1
																		+ " .text")
																.text()
														+ "<span class='up ui-icon ui-icon-arrowthick-1-n'></span> <span class='down ui-icon ui-icon-arrowthick-1-s'></span></td>";
												html += "<td id='"
														+ end_to_end.endpoint2
														+ "'>"
														+ $(
																"#"
																		+ end_to_end.endpoint2
																		+ " .text")
																.text()
														+ "<span class='up ui-icon ui-icon-arrowthick-1-n'></span> <span class='down ui-icon ui-icon-arrowthick-1-s'></span></td>";
												if (typeof end_to_end.bc_service_name == 'undefined') {

													html += "<td></td>";
												} else {

													$bc_service_name = end_to_end.bc_service_name;
													html += "<td id='"
															+ end_to_end.endpoint1
															+ end_to_end.endpoint2
															+ "'>"
															+ end_to_end.bc_service_name
															+ "<span class='up ui-icon ui-icon-arrowthick-1-n'></span> <span class='down ui-icon ui-icon-arrowthick-1-s'></span></td>";
												}
												html += "<td id='"
														+ end_to_end.endpoint1
														+ end_to_end.endpoint2
														+ "status'></td>";
												html += "</tr>";
												$("#use_case_tbody").append(
														html);
												checkcomponents(
														$bc_service_name,
														$use_case_name,
														end_to_end.endpoint1,
														end_to_end.endpoint2);
												showThingToMonitor(end_to_end.endpoint1);
												showThingToMonitor(end_to_end.endpoint2);
												// startWebSocket();
											}

										}

									}

								},
								error : function(e) {

									console.log(e.responseText);

								}
							});

				});
$("body")
		.on(
				"click",
				"#Connect",
				function() {

					endpoint1 = $("#starting-endpoint option:selected").val();
					endpoint2 = $("#ending-endpoint option:selected").val();

					var endpoint_protocol1 = $("#" + endpoint1 + " .protocol")
							.text();
					var endpoint_protocol2 = $("#" + endpoint2 + " .protocol")
							.text();

					var endpoint_name1 = $("#" + endpoint1 + " .text").text();
					var endpoint_name2 = $("#" + endpoint2 + " .text").text();

					if (endpoint1 != endpoint2) {

						if (endpoint_protocol1 != endpoint_protocol2) {

							$('<div id="binding-component"></div>')
									.dialog(
											{
												modal : true,
												title : "Binding Component Generation",
												open : function() {
													var html = '<p>'
															+ endpoint_name1
															+ ' and '
															+ endpoint_name2
															+ ' can not communicate!</p>';
													html = html
															+ '<input id="binding-component-gen" class="ui-button ui-widget ui-corner-all" value="Generate Binding Component" type="button"/>';
													html = html
															+ '<span id="progressbar" style="margin:5px 0px 5px 0px"></span>';
													$(this).html(html);
												},
												buttons : {
													Cancel : function() {

														$(this).dialog("close");
														$(this).empty();
														$(this).remove();
													}
												},
												width : "50%",

											});

						} else {

							var $endtoendObject = '{"endpoint1" : "'
									+ endpoint1 + '", "endpoint2" : "'
									+ endpoint2 + '"}';
							drawLink(endpoint1, endpoint2, $endtoendObject,
									$use_case_name);
						}

					}

				});

$("#create-use-case")
		.click(
				function() {

					if ($use_case_name != "") {

						return;
					}

					$
							.confirm({
								title : 'Prompt!',
								content : ''
										+ '<form action="" class="formName">'
										+ '<div class="form-group">'
										+ '<label>Enter use case name</label>'
										+ '<input type="text" placeholder="Use case name" class="name form-control" required />'
										+ '</div>' + '</form>',
								buttons : {
									formSubmit : {
										text : 'Start',
										btnClass : 'btn-blue',
										action : function() {
											$use_case_name = this.$content
													.find('.name').val();
											if (!$use_case_name) {
												$.console
														.log('provide a valid name');
												return false;
											}
											if (useCaseExist($use_case_name)) {
												$.console
														.log('A use case with this name already exist');
												return false;
											}
											
											
											
											/*while (things_connected.length) {

												things_connected.pop();
											}
											
											while ($things_to_monitore.length) {

												$things_to_monitore.pop();
											}
											
											while ($MonitorController.length) {

												$MonitorController.pop();
											}
											
											
											endpoint1 = "";
											endpoint2 = "";
											$use_case_name = "";
											$generate_val = "";
											$length = 0;
											$monitor = false;*/
											
											
											
											$("#editor").css(
													"height",
													$("#table-dashboard")
															.height());
											$("#droppable").css(
													"height",
													parseInt($("#editor")
															.height())
															+ parseInt(20));
											$("#fieldset-droppable").css(
													"height",
													$("#droppable").height());

											$("#editor").hide().show(500);

											$("#editor").css(
													"height",
													$("#table-dashboard")
															.height());
											$("#droppable").css("height",
													$("#editor").height());
											$("#fieldset-droppable").css(
													"height",
													$("#droppable").height());
										}
									},
									cancel : function() {
										// close
									},
								},
								onContentReady : function() {
									// bind to events
									var jc = this;
									this.$content.find('form').on(
											'submit',
											function(e) {
												// if the user submits the form
												// by pressing enter in the
												// field.
												e.preventDefault();
												jc.$$formSubmit
														.trigger('click'); // reference
												// the
												// button
												// and
												// click
												// it
											});
								}
							});

				});

$(document)
		.on(
				"click",
				"#binding-component-gen",
				function() {

					var response_status = 1;
					var $endpoint1 = $("#starting-endpoint option:selected")
							.val();
					var $endpoint2 = $("#ending-endpoint option:selected")
							.val();
					
					$("#progressbar").html('<iframe src="https://giphy.com/embed/wsjHcZmxoSHM4" width="10%" height="40%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
						
					

					$
							.ajax({

								async : true,
								url : 'BindingComponentController',
								dataType : 'json',
								data : {
									endpoint1 : $endpoint1,
									endpoint2 : $endpoint2
								},
								type : 'post',
								cache : false,
								success : function(response) {

									var json = JSON.parse(JSON
											.stringify(response));
									if (json.status){

										$(
												"#" + $endpoint1
														+ " .binding-component")
												.html(
														'BC['
																+ json.service_name
																+ ']');
										$(
												"#" + $endpoint2
														+ " .binding-component")
												.html(
														'BC['
																+ json.service_name
																+ ']');
										$(
												"#" + $endpoint1
														+ " .binding-component")
												.show(500);
										$(
												"#" + $endpoint2
														+ " .binding-component")
												.show(500);
										var $endtoendObject = '{"endpoint1" : "'
												+ $endpoint1
												+ '", "endpoint2" : "'
												+ $endpoint2
												+ '","bc_service_name":"'
												+ json.service_name
												+ '", "bc_location":"'
												+ json.bc_location + '"}';
										drawLink($endpoint1, $endpoint2,
												$endtoendObject, $use_case_name);

										$("#binding-component").dialog("close");
										$("#binding-component").empty();
										$("#binding-component").remove();

									} else {

										var error = '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">';
										error += '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span> <strong>Alert:</strong>';
										error += '<p>' + response.message
												+ '</p></div>';
										$("#progressbar").html(error);

									}

								},
								error : function(e) {

									console.log(e.responseText);
									var error = '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">';
									error += '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span> <strong>Alert:</strong>';
									error += '<p>Error while generating binding component</p></div>';
									$("#progressbar").html(error);

								}
							});

				});

function drawLink($endpoint1, $endpoint2, $entoend_object, $use_case_name) {

	var endpointOptions = {
		isSource : true,
		isTarget : true
	};
	var div1Endpoint = jsPlumb.addEndpoint($endpoint1, {
		anchor : "TopCenter"
	}, endpointOptions);
	var div2Endpoint = jsPlumb.addEndpoint($endpoint2, {
		anchor : "TopCenter"
	}, endpointOptions);
	jsPlumb.connect({
		source : div1Endpoint,
		target : div2Endpoint,
	});

	$.ajax({

		async : true,
		url : 'UseCaseController',
		dataType : 'json',
		data : {
			req : 'save_use_case',
			use_case : $use_case_name,
			data : $entoend_object
		},
		type : 'post',
		cache : false,
		success : function(response) {

			var json = JSON.parse(JSON.stringify(response));

		},
		error : function(e) {

			console.log(e.responseText);

		}
	});

}

var status = 0;
function myprogressbar() {

	status++;
	if (status >= 100) {

		status = parseInt(status) - parseInt(5);

	}

	if (response_status == 1) {

		$("#progressbar").progressbar({
			value : status
		});

	} else {

		$("#progressbar").progressbar({

			value : response_status
		});
	}

}

function useCaseExist($use_case_name) {
	var use_case_exist = false;
	$.ajax({

		async : true,
		url : 'UseCaseController',
		dataType : 'json',
		data : {
			req : 'use_case_exist',
			use_case : $use_case_name
		},
		type : 'post',
		cache : false,
		success : function(response) {

			var json = JSON.parse(JSON.stringify(response));
			if (json.status) {

				use_case_exist = true;
			}

		},
		error : function(e) {
		}
	});
	return use_case_exist;
}

function checkcomponents($bc_service_name, $use_case_name, $endpoint1,
		$endpoint2) {

	$
			.ajax({

				async : true,
				url : 'UseCaseController',
				dataType : 'json',
				data : {
					req : 'check_components',
					use_case : $use_case_name,
					bc_id : $bc_service_name,
					endpoint1 : $endpoint1,
					endpoint2 : $endpoint2,
					current_action : 'start'
				},
				type : 'post',
				cache : false,
				success : function(response) {

					var json = JSON.parse(JSON.stringify(response));

					$("#" + json.endpoint1 + " .down").show(500);
					$("#" + json.endpoint2 + " .down").show(500);
					$generate_val = json.endpoint1 + json.endpoint2;

					if (json.status_endpoint1) {

						$("#" + json.endpoint1 + " .down").hide(500);
						$("#" + json.endpoint1 + " .up").show(500);

					}

					if (json.status_endpoint2) {

						$("#" + json.endpoint2 + " .down").hide(500);
						$("#" + json.endpoint2 + " .up").show(500);
					}

					if (typeof json.status_bc == 'undefined') {

						$("#" + $generate_val + " .down").hide();
						$("#" + $generate_val + " .up").hide();

					} else {

						if (json.status_bc == "running") {

							var html = '<a href="#" class="ui-button ui-widget ui-corner-all" id="'
									+ $generate_val
									+ '-'
									+ json.bc_id
									+ '-'
									+ json.status_bc
									+ '" onclick="startStopBC(this.id)">Stop BC</a>';
							$("#" + $generate_val + "status").html(html);
							$("#" + $generate_val + " .up").show(500);
							$("#" + $generate_val + " .down").hide();

						} else {

							var html = '<a href="#" class="ui-button ui-widget ui-corner-all" id="'
									+ $generate_val
									+ '-'
									+ json.bc_id
									+ '-'
									+ json.status_bc
									+ '" onclick="startStopBC(this.id)">Start BC</a>';
							$("#" + $generate_val + "status").html(html);
							$("#" + $generate_val + " .down").show(500);
							$("#" + $generate_val + " .up").hide();
						}

					}

				},
				error : function(e) {

					console.log(e.responseText);
				}
			});

}

function startStopBC($id) {

	var $btn_id = $id;
	var $bc_id = $id.split("-")[3];
	var $current_status = $id.split("-")[4];
	$generate_val = $id.split("-")[0] + '-' + $id.split("-")[1] + '-'
			+ $id.split("-")[2];

	var $action = "";
	var $btn_new_val = "";

	$btn_val = $("#" + $btn_id).text();
	if ($btn_val == "Stop BC") {

		$btn_new_val = "Start BC";
		$action = "stop";

	} else if ($btn_val == "Start BC") {

		$btn_new_val = "Stop BC";
		$action = "start";

	}

	$.ajax({

		async : true,
		url : 'UseCaseController',
		dataType : 'json',
		data : {
			req : 'change_bc_status',
			use_case : $use_case_name,
			bc_id : $bc_id,
			current_action : $action
		},
		type : 'post',
		cache : false,
		success : function(response) {

			var json = JSON.parse(JSON.stringify(response));
			if (json.status_bc == "stopped") {

				$("#" + $id).html($btn_new_val);
				$("#" + $generate_val + " .up").hide();
				$("#" + $generate_val + " .down").show(500);

			} else if (json.status_bc == "running") {

				$("#" + $id).html($btn_new_val);
				$("#" + $generate_val + " .up").show(500);
				$("#" + $generate_val + " .down").hide();

			}

		},
		error : function(e) {

			console.log(e.responseText);
		}
	});

}

function showThingToMonitor($endpoint) {

	var service_name = $("#" + $endpoint + " .text").text()

	if ($things_to_monitore.indexOf($endpoint + '-' + service_name) == -1) {

		$("#monitoring-selection").show(500);
		$("#start-monitoring").show(500);
		var html = '<p><input type="checkbox" id="' + $endpoint + '-'
				+ service_name + '" value="' + $endpoint + '-' + service_name
				+ '" />';
		html += '<label for="starting-endpoint">' + service_name
				+ ':</label><br/>';
		html += '<input id="port-' + $endpoint + '-' + service_name
				+ '" type="text" name="port-' + $endpoint + '-' + service_name
				+ '" placeholder="Monitoring port"/></p>';
		$("#monitoring-selection fieldset div").append(html);
		$length = $things_to_monitore.push($endpoint + '-' + service_name);
	}

}

function monitoringProcess() {

	for (i in $MonitorController) {

		$thing = $MonitorController[i];
		$thingName = $thing.split("-")[2];
		$.ajax({

			async : true,
			url : 'MonitorController',
			dataType : 'json',
			data : {
				action : 'monitor',
				req : $thingName
			},
			type : 'post',
			cache : false,
			success : function(response) {

				var json = JSON.parse(JSON.stringify(response));
				if (json.status) {

					var jsondata = JSON.parse(json.json_data);
					$("#msg-" + json.thingName).html(jsondata.message);
					$("#time-" + json.thingName).html(jsondata.timestamps);
					$("#number-" + json.thingName).html(json.nbrMessage);
				}

			},
			error : function(e) {

				console.log(e.responseText);
			}
		});

	}

}

function startWebSocket() {

	if ('WebSocket' in window) {

		var connection = new WebSocket('ws://192.168.0.101:9082');
		connection.onmessage = function(e) {

			var server_message = e.data;

			var imageWidth = 640, imageHeight = 360; // hardcoded width &
														// height.
			var byteArray = new Uint8Array(data);

			var canvas = document.createElement('canvas');
			canvas.height = imageWidth;
			canvas.width = imageHeight;
			var ctx = canvas.getContext('2d');

			var imageData = ctx.getImageData(0, 0, imageWidth, imageHeight); // total
																				// size:
																				// imageWidth
																				// *
																				// imageHeight
																				// * 4;
																				// color
																				// format
																				// BGRA
			var dataLen = imageData.data.length;
			for (var i = 0; i < dataLen; i++) {
				imageData.data[i] = byteArray[i];
			}
			ctx.putImageData(imageData, 0, 0);

			// create a new element and add it to div
			var image = document.createElement('img');
			image.width = imageWidth;
			image.height = imageHeight;
			image.src = canvas.toDataURL();

			var div = document.getElementById('img-from-drone');
			div.appendChild(image);

		}

	} else {

		alert('/*WebSockets are not supported. Try a fallback method like long-polling etc*/');
	}

}
