function UpdateLabelsSates () {
	
	var states = info_manager.state_elements;
	var label = 0;

	console.log(states);

	for ( var i in states ){

		if ( info_manager.final_states[i] == undefined ){
			states[i].el.parentElement.querySelector("text").textContent = label;
			label += 1;
		}

	}

	info_manager.proxLabel = label;

}