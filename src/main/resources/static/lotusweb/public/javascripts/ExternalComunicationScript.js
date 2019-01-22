function MountJsonInfo () {
	
	var json = {};

	json['states'] = {};
	json['transitions'] = {};

	for ( key in info_manager.state_elements ){

		json.states[key] = {};

		json.states[key]['id'] = key;

		json.states[key]['outPutTransitions'] = 
			info_manager.state_elements[key].output_transitions;

		json.states[key]['inPutTransitions'] = 
			info_manager.state_elements[key].input_transitions;

		json.states[key]['isInitial'] = 
			( info_manager.initial_state == info_manager.state_elements[key].el.parentElement );

		json.states[key]['isFinal'] = 
			( info_manager.final_states[key] != undefined );

		// Quando adicionar estados de erro
		json.states[key]['isError'] = false;

	}

	for ( key in info_manager.transitions_elements ){

		json.transitions[key] = {};

		json.transitions[key]['id'] = key;

		json.transitions[key]['orgState'] = 
			info_manager.transitions_elements[key].orgState;

		json.transitions[key]['dstState'] = 
			info_manager.transitions_elements[key].dstState;

		json.transitions[key]['label'] = 
			info_manager.transitions_elements[key].info_transition['label'];

		json.transitions[key]['probability'] = 
			info_manager.transitions_elements[key].info_transition['probability'];

		json.transitions[key]['guard'] = 
			info_manager.transitions_elements[key].info_transition['guard'];

	}

	return json;

}

function GET () {

	$.get("http://localhost:5000/api/product", function(resultado){
		console.log(resultado.tasks[0]);
	});

}

function POST () {

	var svg = document.getElementById("container_svg").innerHTML;

	$.ajax({
		url : "http://localhost:5000/api/product/10",
		type : 'post',
		data : JSON.stringify({
			Name : "Data",
			Data : svg
		}),
		dataType : 'json',
		contentType: 'application/json;charset=UTF-8',
		beforeSend : function(){
			console.log("Enviando");
		}
	})
	.done(function(msg){
		console.log(msg);
	})
	.fail(function(jqXHR, textStatus, msg){
		alert(msg);
	});

}

function DownloadProjectDrive () {

	DownloadFilePicker();

	function FuncAnim () {

		if ( info_manager.FileId != undefined ){

			console.log(info_manager.FileId);

			$.ajax({
				url : "http://localhost:8000/driveApiDownload",
				type : 'post',
				data : JSON.stringify({
					FileId : info_manager.FileId
				}),
				dataType : 'json',
				contentType: 'application/json;charset=UTF-8',
				beforeSend : function(){
					console.log("Enviando");
				}
			})
			.done(function(msg){
				console.log(msg);
				NewProject(msg);
				console.log("Finish");
				delIframesGooglePicke();
				clearInterval(anim);
			})
			.fail(function(jqXHR, textStatus, msg){
				alert(msg);
				clearInterval(anim);
			});

			info_manager.FileId = undefined;
		
		}

	}

	var anim = setInterval(FuncAnim, 1000);

}

function UploadProjectDrive (ev) {

	var idProject = ev.target.classList[ev.target.classList.length-1]

	UploadFilePicker();

	console.log("JQUERY");

	var copyProject = new Info_Manager(info_manager.svg.id);

	for ( var key in info_manager ){
		copyProject[key] = info_manager[key];
	}

	copyProject = copyProject.projects[idProject];

	for ( key in copyProject.Data ){

		copyProject.Data[key].infoManager.components = {};
		copyProject.Data[key].infoManager.projects = {};

	}

	console.log(info_manager.projects[idProject]);

	function FuncAnim () {

		if ( info_manager.FolderId != undefined ){

			console.log(info_manager.FolderId);

			$.ajax({
			url : "http://localhost:8000/uploadDriveProject",
			type : 'post',
			data : JSON.stringify({
				FolderId: info_manager.FolderId,
				Data: copyProject
			}),
			dataType : 'json',
			contentType: 'application/json;charset=UTF-8',
			beforeSend : function(){
				console.log("Enviando");
			}
			})
			.done(function(msg){
				console.log(msg);
				console.log("Finish");
				delIframesGooglePicke();
				clearInterval(anim);
			})
			.fail(function(jqXHR, textStatus, msg){
				alert(msg);
				clearInterval(anim);
			});

			info_manager.FolderId = undefined;
		
		}

	}

	var anim = setInterval(FuncAnim, 1000);

}


function mountForModelCheck(){

	var json = [];

	for ( key in info_manager.state_elements ){
		var state = {};

		state['id'] = key;
		state['label'] = key;
		
		var initil = info_manager.state_elements[key].el.parentElement.id == info_manager.initial_state.id? true : false;
		state['isInitial'] = initil;
		
		var finil = info_manager.final_states[key] != undefined ? true : false;
		state['isFinal'] = finil;

		// Quando adicionar estados de erro
		state['isError'] = false;

		state['transicoesSaindo'] = [];
		for(var i =0; i < info_manager.state_elements[key].output_transitions.length; i++){
			var transition_name = info_manager.state_elements[key].output_transitions[i];
			var transition = {};
			transition['srcState'] = null;
			transition['dstState'] = null;
			transition['action'] = 
				info_manager.transitions_elements[transition_name].info_transition['label'];
			transition['probability'] = 
				info_manager.transitions_elements[transition_name].info_transition["probability"];
			transition['guard'] = 
				info_manager.transitions_elements[transition_name].info_transition['guard'];
			transition['visitedTransitionsCount'] = 0;
			state['transicoesSaindo'].push(transition);
		}
		

		state['transicoesChengado'] = [];
		
		for(var i =0; i < info_manager.state_elements[key].input_transitions.length; i++){
			var transition_name = info_manager.state_elements[key].input_transitions[i];
			var transition = {};
			transition['srcState'] = null;
			transition['dstState'] = null;
			transition['action'] = 
				info_manager.transitions_elements[transition_name].info_transition['label'];
			transition['probability'] = 
				info_manager.transitions_elements[transition_name].info_transition["probability"];
			transition['guard'] = 
				info_manager.transitions_elements[transition_name].info_transition['guard'];
			transition['visitedTransitionsCount'] = 0;
			state['transicoesChengado'].push(transition);
		}
		
		
		json.push(state);

	}

	$.ajax({
		url : "https://lotus-modelcheck-microservice.herokuapp.com/modelcheck/?prob=true",
		type : 'post',
		data : JSON.stringify(json),
		dataType : 'json',
		contentType: 'application/json;charset=UTF-8',
		beforeSend : function(){
			console.log("Enviando");
		}
	})
	.done(function(msg){
		alert(msg);
	})
	.fail(function(jqXHR, textStatus, msg){
		alert(msg);
	});

}

function delIframesGooglePicke () {
	
	while ( document.body.lastElementChild != document.getElementById("ssIFrame_google") ){
		document.body.removeChild(document.body.lastElementChild);
	}

}