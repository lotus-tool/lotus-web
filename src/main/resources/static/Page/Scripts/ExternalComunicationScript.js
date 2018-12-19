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

function mountForReacheableCheck(src, dst, actP, actID, steps, exclude){
	var json = {};
	json['transition'] = [];
	for( key in info_manager.transitions_elements){

		var transition = {};

		transition['srcState'] = parseInt(info_manager.transitions_elements[key].orgState);
		transition['dstState'] = parseInt(info_manager.transitions_elements[key].dstState);
		transition['action'] = info_manager.transitions_elements[key].info_transition['label'];
        if(info_manager.transitions_elements[key].info_transition.label == exclude ){
            transition['probability'] = 0;
        }else {
            transition['probability'] = info_manager.transitions_elements[key].info_transition["probability"];
        }
		transition['guard'] = info_manager.transitions_elements[key].info_transition['guard'];
		transition['visitedTransitionsCount'] = 0;
		json['transition'].push(transition);


	}
	json['srcState'] = src;// Pegar o Estado do Panel
	json['dstState'] = dst;// Pegar o Estado do Panel


	json['actionTargetID'] = actID; // Pegar o Estado do Panel, É o destino da transição
	var state_count = 0;
	for(key in info_manager.state_elements){
		state_count++;
	}
	json['state_count'] = state_count;// Pegar o Estado do Panel
    if(steps == null){
        json['steps'] = state_count;
    }else {
        json['steps'] = steps;// Pegar o Estado do Panel
    }

    return json;
}



function mountForModelCheck(){
	var json = [];

    if(info_manager.initial_state == undefined){alert("Initial State not defined");}
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


function GET () {

	$.get("http://localhost:5000/api/product", function(resultado){
		console.log(resultado.tasks[0]);
	});

}

function POST (URL, json) {

	return $.ajax({
		url : URL,
		type : 'post',
		data : JSON.stringify(json),
		dataType : 'json',
		contentType: 'application/json;charset=UTF-8',
		beforeSend : function(){
			console.log("Enviando");
		}
	})
	.done(function(msg){
		return msg;
	})
	.fail(function(jqXHR, textStatus, msg){
		alert(msg);
	});

}

function modelCheck(){
	var url = "http://localhost:8080/modelcheck/?prob=true";
	var json = mountForModelCheck();
	var msg = POST(url,json);
	msg.done(function (data) {
       alert(data);
    });
}

function reacheableCheck(src, dst, actP, actID,steps, exclude){
	var url = "http://localhost:8080/modelcheck/reachable/";
	var json = mountForReacheableCheck(src, dst, actP, actID, steps, exclude);
	var msg = POST(url,json);
	msg.done(function (data) {
        var operation = $('#probReach_Operations option:selected').val();
        var probability = ( parseInt($('#probReach_probability').val()) )/100;

        switch (operation){
            case "=":
                if(data == probability){
                    $('#probReach_result').addClass('fa-check btn-success');
                    $('#probReach_result').removeClass('fa-times btn-danger');
                }else{
                    $('#probReach_result').addClass('fa-times btn-danger');
                    $('#probReach_result').removeClass('fa-check btn-success');
                }
                break;
            case ">":
                if(data > probability){
                    $('#probReach_result').addClass('fa-check btn-success');
                    $('#probReach_result').removeClass('fa-times btn-danger');
                }else{
                    $('#probReach_result').addClass('fa-times btn-danger');
                    $('#probReach_result').removeClass('fa-check btn-success');
                }
                break;
            case ">=":
                if(data >= probability){
                    $('#probReach_result').addClass('fa-check btn-success');
                    $('#probReach_result').removeClass('fa-times btn-danger');
                }else{
                    $('#probReach_result').addClass('fa-times btn-danger');
                    $('#probReach_result').removeClass('fa-check btn-success');
                }
                break;
            case "<":
                if(data < probability){
                    $('#probReach_result').addClass('fa-check btn-success');
                    $('#probReach_result').removeClass('fa-times btn-danger');
                }else{
                    $('#probReach_result').addClass('fa-times btn-danger');
                    $('#probReach_result').removeClass('fa-check btn-success');
                }
                break;
            case "<=":
                if(data <= probability){
                    $('#probReach_result').addClass('fa-check btn-success');
                    $('#probReach_result').removeClass('fa-times btn-danger');
                }else{
                    $('#probReach_result').addClass('fa-times btn-danger');
                    $('#probReach_result').removeClass('fa-check btn-success');
                }
                break;
            case "!=":
                if(data != probability){
                    $('#probReach_result').addClass('fa-check btn-success');
                    $('#probReach_result').removeClass('fa-times btn-danger');
                }else{
                    $('#probReach_result').addClass('fa-times btn-danger');
                    $('#probReach_result').removeClass('fa-check btn-success');
                }
                break;
        }

    });
}







