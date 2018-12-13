function MountJsonInfo () {
	
	var json = {};

	json['state'] = {};
	json['transition'] = {};

	for ( key in info_manager.state_elements ){

		json.state[key] = {};

		json.state[key]['id'] = key;
		json.state[key]['label'] = key;

		json.state[key]['transicoesSaindo'] = 
			info_manager.state_elements[key].output_transitions;

		json.state[key]['transicoesChengado'] = 
			info_manager.state_elements[key].input_transitions;

		json.state[key]['isInitial'] = 
			( info_manager.initial_state == info_manager.state_elements[key].el.parentElement );

		json.state[key]['isFinal'] = 
			( info_manager.final_states[key] != undefined );

		// Quando adicionar estados de erro
		json.state[key]['isError'] = false;

	}

	for ( key in info_manager.transitions_elements ){

		json.transition[key] = {};

		json.transition[key]['srcState'] = 
			info_manager.transitions_elements[key].orgState;

		json.transition[key]['dstState'] = 
			info_manager.transitions_elements[key].dstState;

		json.transition[key]['action'] = 
			info_manager.transitions_elements[key].info_transition['label'];

		json.transition[key]['probability'] = 
			info_manager.transitions_elements[key].info_transition['probability'];

		json.transition[key]['guard'] = 
			info_manager.transitions_elements[key].info_transition['guard'];

		json.transition[key]['visitedTransitionsCount'] = 0;

	}

	return json;

}

function GET () {

	$.get("http://localhost:5000/api/product", function(resultado){
		console.log(resultado.tasks[0]);
	});

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

	return json;

}

function POST () {

	var svg = document.getElementById("container_svg").innerHTML;
	var JS = mountForModelCheck();
	
	$.ajax({
		url : "http://localhost:8080/modelcheck/?prob=true",
		type : 'post',
		data : JSON.stringify(JS),
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











