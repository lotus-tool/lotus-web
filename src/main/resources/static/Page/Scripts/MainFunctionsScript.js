function UpdateCurrentEl (ev) {

	/*
		Evento do ponto de controle de estado (ponto cinza), para defini-lo 
		como o estado corrente.
	*/

	if ( info_manager.svg.id === ev.target.id ){

		console.log("UpdateCurrentEl");
		console.log(ev.target);
	
		info_manager.currentEl.querySelector(".copy_el").setAttribute("stroke", "black");
		info_manager.currentEl = undefined;
		info_manager.svg.removeEventListener("click", UpdateCurrentEl);

	}else{

		info_manager.currentEl = ev.target.parentElement;
		ev.target.parentElement.querySelector(".copy_el").setAttribute("stroke", "red");
		info_manager.svg.addEventListener("click", UpdateCurrentEl, false);

	}

}

function DragMoveEl () {

	/*

		Se "drag_transition" do estado corrente estiver marcado como Drag, ele 
		ficará como Transition e vice-versa.

		Como método informativo, a variavel drag_transition do estado corrente 
		é modificada, para então ser testada durante os clicks, além de que o 
		texto do estado é modificado.

	*/

	var element = info_manager.currentEl;

	if (info_manager.state_elements[element.id].drag_transition === 0){
		info_manager.state_elements[element.id].drag_transition = 1;
	}else{
		info_manager.state_elements[element.id].drag_transition = 0;
	}

}

function RemoveState () {

	if ( info_manager.currentEl != undefined ){

		var element = info_manager.currentEl;
		
		var element_id = element.id;

		var outPutTransitions = 
			info_manager.state_elements[element_id].getOutPutTransitions();

		var inPutTransitions = 
			info_manager.state_elements[element_id].getInPutTransitions();

		while ( outPutTransitions.length > 0 ){
			remove_Transition(outPutTransitions[0]);
		}

		while ( inPutTransitions.length > 0 ){
			remove_Transition(inPutTransitions[0]);
		}

		delete info_manager.state_elements[element_id];

		info_manager.svg.removeChild(element);

		info_manager.element_remove = false;

		UpdateLabelsSates();

		UpdateCurrentEl(undefined);

	}

}

function IsInitialState () {

	var g_parent = info_manager.currentEl;
	var state = g_parent.querySelector(".copy_el");

	if ( ( info_manager.initial_state != undefined ) || 
		( info_manager.state_elements[g_parent.id].getInPutTransitions().length > 0 ) ){

		info_manager.create_initial_state = false;
		return false;
	
	}

	state.style.fill = "#ffd700";

	var transform = null;
	var x_transform = 0;
	var y_transform = 0;
	var transform = undefined;
	var index_x_transform = 0;
	var index_y_transform = 0;
	var transform_after_x = "";

	if ( info_manager.final_states[g_parent.id] == undefined ){

		var y = getPosition(g_parent).y - getPosition(state).y + ( state.getBoundingClientRect().height/2 );

	}else{

		var y = getPosition(g_parent).y - getPosition(g_parent.querySelector(".el_final_state")).y + ( g_parent.querySelector(".el_final_state").getBoundingClientRect().height/2 );

	}

	var indicator = document.createElementNS("http://www.w3.org/2000/svg", "path");
	indicator.setAttribute("d", "M0,0 v20 L15,10 z");
	indicator.setAttribute("fill", "transparent");
	indicator.setAttribute("stroke", "#666");
	indicator.setAttribute("stroke-width", "2px");
	indicator.setAttribute("transform", "translate(0 " + y + ")");

	for( var i = 0; i < g_parent.children.length; i++ ){

		transform = g_parent.children[i].getAttribute("transform");

		if( transform != null ){

			transform = g_parent.children[i].getAttribute("transform");

			index_x_transform = transform.indexOf("translate") + "translate".length + 1;
			index_y_transform = transform.indexOf("translate") + "translate".length + 3;
			transform_after_x = transform.slice( index_x_transform );

			transform = transform.slice(0, index_x_transform) + 
						( Number(transform.slice(index_x_transform, transform.indexOf(" "))) + 15 ) + 
						transform_after_x.slice( transform_after_x.indexOf(" ") );

			g_parent.children[i].setAttribute(
				"transform", transform );

		}else{
			g_parent.children[i].setAttribute("transform", "translate(15 0)");
		}

	}

	g_parent.insertBefore(indicator, g_parent.childNodes[0]);
	
	transform = g_parent.getAttribute("transform");
	index_x_transform = transform.indexOf("translate") + "translate".length + 1;
	transform_after_x = transform.slice( index_x_transform );

	transform = transform.slice(0, index_x_transform) + 
		( Number(transform.slice(index_x_transform, transform.indexOf(" "))) - 15 ) + 
		transform_after_x.slice( transform_after_x.indexOf(" ") );

	g_parent.setAttribute("transform", transform);

	info_manager.create_initial_state = false;
	info_manager.initial_state = g_parent;

}

function IsFinalState () {

	var g_parent = info_manager.currentEl;
	var state = g_parent.querySelector(".copy_el");
	state.style.fill = "#777"
	g_parent.querySelector("text").textContent = "E";
	
	var copy_state = state.cloneNode(true);
	var info_state = state.getBoundingClientRect();

	var x = ( getPosition(state).x - getPosition(g_parent).x ) + ( ( info_state.width * 0.1 ) / 2 );
	var y = ( getPosition(state).y - getPosition(g_parent).y ) + ( ( info_state.height * 0.1 ) / 2 );

	// para identificar o elemento atras do estado quando ele é o final 
	copy_state.setAttribute("class", "el_final_state");
	copy_state.setAttribute("stroke", "black");
	state.setAttribute("transform", "translate("+ x +" "+ y +") scale(0.9)");

	if ( info_manager.initial_state == g_parent ){

		g_parent.insertBefore(copy_state, g_parent.childNodes[1]);
		info_manager.create_final_state = false;
		info_manager.final_states[g_parent.id] = g_parent;

	}else{

		g_parent.insertBefore(copy_state, g_parent.childNodes[0]);
		info_manager.create_final_state = false;
		info_manager.final_states[g_parent.id] = g_parent;

	}

	UpdateLabelsSates();

}