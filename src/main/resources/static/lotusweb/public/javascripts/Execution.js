function mountJsonComplete(){
    var json = {};
if(info_manager.initial_state == null){alert("ERROR"); return;}
    for(key in info_manager.state_elements){
        var state =  JSON.parse(JSON.stringify(info_manager.state_elements[key]));
        state.id = key;
	if(key == info_manager.initial_state.id){
		state.isInitial = true;
	}
	
        delete state.el;
        for( key2 in state.input_transitions){
            var transition_name = state.input_transitions[key2];
            var transition = Object.assign({},info_manager.transitions_elements[transition_name]);
            transition.label = transition.info_transition["label"];
            transition.guard = transition.info_transition["guard"];
            transition.probability = transition.info_transition["probability"];
            delete transition.el;

            state.input_transitions[key2] = transition;
        }
        for( key2 in state.output_transitions){
            var transition_name = state.output_transitions[key2];
            var transition = Object.assign({},info_manager.transitions_elements[transition_name]);
            transition.label = transition.info_transition["label"];
            //transition.guard = transition.info_transition["guard"];
            transition.guard = "t<= 3";
            transition.probability = transition.info_transition["probability"];
	        transition.action = "t=t+1";
	        delete transition.el;

            state.output_transitions[key2] = transition;
        }
        json[key] = state;
    }
    return json;
}

function teste(){
    console.log("Veio");
    var json = {};


    var transitions = info_manager.transitions_elements;
    var parameters = "t=1;";

    json["states"] = mountJsonComplete();
    json["transitions"] = transitions;
    json["parameters"] = parameters;

    console.log(JSON.stringify(json));

    $.ajax({
        url : "http://localhost:8080/execution/",
        type : 'post',
        data : JSON.stringify(json),
        dataType : 'json',
        contentType: 'application/json;charset=UTF-8',
        beforeSend : function(){
            console.log("Enviando");
        }
    })
        .done(function(msg){
            $(".addComponent").click();
		    mountLTSFSP(msg);

        })
        .fail(function(jqXHR, textStatus, msg){
            alert(msg);
        });


}
