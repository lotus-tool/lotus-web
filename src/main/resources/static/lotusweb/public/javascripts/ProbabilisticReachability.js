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

function reacheableCheck(src, dst, actP, actID, steps, exclude){

    var json = mountForReacheableCheck(src, dst, actP, actID, steps, exclude);

    $.ajax({
        url : "https://lotus-modelcheck-microservice.herokuapp.com/modelcheck/reachable/",
        type : 'post',
        data : JSON.stringify(json),
        dataType : 'json',
        contentType: 'application/json;charset=UTF-8',
        beforeSend : function(){
            console.log("Enviando");
        }
    })
    .done(function(msg){

        var operation = document.querySelector(
            "#OperationModelC").selectedOptions[0].textContent;

        var probability = document.querySelector(
            "#ProbabilityModelC").value;

        var thumb = document.querySelector("[class*=fa-thumbs]");
        thumb.style.display = 'initial';

        console.log(operation);
        console.log(probability);
        console.log(msg);

        switch (operation) {
            case "=":
                if ( msg == probability ){
                    thumb.className = thumb.className.replace("down","up");
                }else{
                    thumb.className = thumb.className.replace("up","down");
                }
                break;
            case ">":
                if ( msg > probability ){
                    thumb.className = thumb.className.replace("down","up");
                }else{
                    thumb.className = thumb.className.replace("up","down");
                }
                break;
            case ">=":
                if ( msg >= probability ){
                    thumb.className = thumb.className.replace("down","up");
                }else{
                    thumb.className = thumb.className.replace("up","down");
                }
                break;
            case "<":
                if ( msg < probability ){
                    thumb.className = thumb.className.replace("down","up");
                }else{
                    thumb.className = thumb.className.replace("up","down");
                }
                break;
            case "<=":
                if ( msg <= probability ){
                    thumb.className = thumb.className.replace("down","up");
                }else{
                    thumb.className = thumb.className.replace("up","down");
                }
                break;
            case "!=":
                if ( msg != probability ){
                    thumb.className = thumb.className.replace("down","up");
                }else{
                    thumb.className = thumb.className.replace("up","down");
                }
                break;
        }

    })
    .fail(function(jqXHR, textStatus, msg){
        alert(msg);
    });

}

function ProbabilisticReacheableCheck() {

	// reacheableCheck

	/*
		reacheableCheck

		src: State Origin
		
		dst: State Destiny
		
		actP: 

		actID:

		steps:

		exclude:

		value -> key(id) do estado

	*/

	var template = document.querySelector("#Template").selectedOptions[0].textContent;
	console.log(template);

	switch (template) {
		case "Default":
			var orgState = document.querySelector(
                "#OriginStateTranstModelC").selectedOptions[0].value;
			var dstState = document.querySelector(
                "#DestStateTranstModelC").selectedOptions[0].value;
			var actionID = dstState;
			var actionP = 1;
			reacheableCheck(orgState,dstState,actionP,actionID, null);
			break;
		case "P(Action)":
            var idTransition = document.querySelector(
                "#OriginStateTranstModelC").selectedOptions[0].value;
			var transition = info_manager.transitions_elements[idTransition];
			var srcState = 0;
			var dstState = transition.dstState;
			var actionP = transition.info_transition.probability;
			var actionID = transition.dstState;
			reacheableCheck(srcState,dstState,actionP,actionID,null,null);
			break;
		case "P(Action1 ^ ~Action2)":
            var idOrigTransition = document.querySelector(
                "#OriginStateTranstModelC").selectedOptions[0].value;
            var idExclude = document.querySelector(
                "#DestStateTranstModelC").selectedOptions[0].value;
            var transition = info_manager.transitions_elements[idOrigTransition];
            var exclude = info_manager.transitions_elements[idExclude].info_transition.label;
            var srcState = 0;
            var dstState = transition.dstState;
            var actionP = transition.info_transition.probability;
            var actionID = transition.dstState;
            reacheableCheck(srcState,dstState,actionP,actionID,null, exclude);
			break;
		case "P(Action1 after Action2)":
            var idOrigTransition = document.querySelector(
                "#OriginStateTranstModelC").selectedOptions[0].value;
            var idDestTransition = document.querySelector(
                "#DestStateTranstModelC").selectedOptions[0].value;
            var transition_source = info_manager.transitions_elements[idOrigTransition];
            var transition_destiny = info_manager.transitions_elements[idDestTransition];
            var srcState = transition_destiny.dstState;
            var dstState = transition_source.dstState;
            var actionP = transition_source.info_transition.probability;
            var actionID = transition_source.dstState;
            reacheableCheck(srcState,dstState,actionP,actionID,null,null);
			break;
		case "P(Action1 in X steps)":
            var idOrigTransition = document.querySelector(
                "#OriginStateTranstModelC").selectedOptions[0].value;
            var transition = info_manager.transitions_elements[idOrigTransition];
            var srcState = 0;
            var dstState = transition.dstState;
            var actionP = transition.info_transition.probability;
            var actionID = transition.dstState;
            var steps = document.querySelector(
                "#StepsModelC").value;
            reacheableCheck(srcState,dstState,actionP,actionID,steps, null);
			break;
	}

}

function ChangeTemplateProbabReach () {
    
    var template = document.querySelector("#Template").selectedOptions[0].textContent;
    console.log(template);

    document.querySelector(
        "[id=StepsModelC]").setAttribute("readonly","");
    document.querySelector(
        "[id=DestStateTranstModelC]").removeAttribute("readonly");

    switch (template) {
        case "Default":
            document.querySelector(
                "[for=OriginStateTranstModelC]").textContent = "Origin State";
            document.querySelector(
                "[for=DestStateTranstModelC]").textContent = "Destiny State";
            verifyStatesProbabReach();
            break;
        case "P(Action)":
            document.querySelector(
                "[for=OriginStateTranstModelC]").textContent = "Transition 1";
            document.querySelector(
                "[for=DestStateTranstModelC]").textContent = "Disabled";
            document.querySelector(
                "[id=DestStateTranstModelC]").setAttribute("readonly","");
            verifyTransitionsProbabReach();
            break;
        case "P(Action1 ^ ~Action2)":
            document.querySelector(
                "[for=OriginStateTranstModelC]").textContent = "Transition 1";
            document.querySelector(
                "[for=DestStateTranstModelC]").textContent = "Transition 2";
            verifyTransitionsProbabReach();
            break;
        case "P(Action1 after Action2)":
            document.querySelector(
                "[for=OriginStateTranstModelC]").textContent = "Transition 1";
            document.querySelector(
                "[for=DestStateTranstModelC]").textContent = "Transition 2";
            verifyTransitionsProbabReach();
            break;
        case "P(Action1 in X steps)":
            document.querySelector(
                "[for=OriginStateTranstModelC]").textContent = "Transition 1";
            document.querySelector(
                "[for=DestStateTranstModelC]").textContent = "Disabled";
            document.querySelector(
                "[id=DestStateTranstModelC]").setAttribute("readonly","");
            document.querySelector(
                "[id=StepsModelC]").removeAttribute("readonly");
            verifyTransitionsProbabReach();
            break;
    }

}

function verifyStatesProbabReach() {
    
    var selectOrigStates = document.getElementById("OriginStateTranstModelC");
    var selectDestStates = document.getElementById("DestStateTranstModelC");

    while ( selectOrigStates.childElementCount != 0 ){
        selectOrigStates.removeChild(selectOrigStates.lastChild);
        selectDestStates.removeChild(selectDestStates.lastChild);
    }

    for ( var key in info_manager.state_elements ){

        var nameState = info_manager.state_elements[key].el.parentElement.
            querySelector("text").textContent;

        var optionOrig = document.createElement("option");
        var optionDest = document.createElement("option");
        optionOrig.textContent = nameState;
        optionDest.textContent = nameState;
        optionOrig.value = key;
        optionDest.value = key;

        selectOrigStates.appendChild(optionOrig);
        selectDestStates.appendChild(optionDest);

    }

}

function verifyTransitionsProbabReach() {
    
    var selectOrigStates = document.getElementById("OriginStateTranstModelC");
    var selectDestStates = document.getElementById("DestStateTranstModelC");

    while ( selectOrigStates.childElementCount != 0 ){
        selectOrigStates.removeChild(selectOrigStates.lastChild);
        selectDestStates.removeChild(selectDestStates.lastChild);
    }

    for ( var key in info_manager.transitions_elements ){

        var nameState = 
            info_manager.transitions_elements[key].info_transition.label;

        var optionOrig = document.createElement("option");
        var optionDest = document.createElement("option");
        optionOrig.textContent = nameState;
        optionDest.textContent = nameState;
        optionOrig.value = key;
        optionDest.value = key;

        selectOrigStates.appendChild(optionOrig);
        selectDestStates.appendChild(optionDest);

    }

}