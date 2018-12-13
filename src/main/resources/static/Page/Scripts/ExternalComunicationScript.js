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