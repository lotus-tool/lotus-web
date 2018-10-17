// D/T -> DRAG/TRANSITION


/* objeto contendo informações sobre os elementos HTML 
	sendo animados */
var info_manager = new Info_Manager("container_svg");

/* Evento de finalizar a criação de um elemento */
document.addEventListener("click", copy_End, false);

function copy_Start (ev) {

	/*

		info_manager.element_copy -> Elemento 
		HTML sendo copiado  

		info_manager.svg.style.cursor -> Altera 
		o cursor para o formato de uma cruz 

	*/

	info_manager.element_copy = ev.target;

	info_manager.svg.style.cursor = 'crosshair';

}

function copy_End(ev) {

	/*

		element -> elemento HTML que realizou a 
		chamada do evento 

		Verifica se o elemento que chamou o evento 
		é o espaço de construção do diagrama 

		Verifica se há algum elemento sendo copiado 

		g_new_element -> cria um elemento HTML SVG 
		de tag <g> para agupar o elemento estado, 
		seu label e seu ponto D/T

		new_element -> Novo elemento HTML criado 
		como uma copia de um outro elemento 
		( modelo de estado ) 

		text_new_element -> cria um elemento HTML SVG 
		de tag <text> para ser o Label do estado 

		options_circle -> cria um elemento HTML SVG 
		de tag <circle> para ser o ponto D/T

		options_circle recebe um evento de click para 
		alterar as configuraçãoes de drag para transition 
		e vice-versa 

		g_new_element recebe um evento para quando o mouse 
		sai e uma para quando ele entra no elemento, para 
		ver visivel ou não o ponto D/T 

		new_element tem seu evento "mousedown" removido 
		para que não entre em conflito com o seu novo 
		evento "mousedown" para drag e transition 

		new_element recebe o evento de DRAG

		g_new_element recebe o elemento estado, o seu 
		label e seu ponto D/T, e depois é adicionado 
		ao SVG 

		Um novo objeto estado elemento (StateElement) é 
		criado para acoplar o elemento estado criado 

		 new_element recebe o evento de criação de 
		 transição 

	*/

	var element = ev.target;

	if ( element.id == info_manager.svg.id ){

		if ( info_manager.element_copy != undefined ){

			var g_new_element = document.createElementNS("http://www.w3.org/2000/svg", "g");
			var new_element = info_manager.element_copy.cloneNode(false);
			var text_new_element = document.createElementNS("http://www.w3.org/2000/svg", "text");
			var options_circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

			text_new_element.setAttribute("x", info_manager.element_copy.getBoundingClientRect().width / 2);
			text_new_element.setAttribute("y", info_manager.element_copy.getBoundingClientRect().height / 2 + 5);
			text_new_element.setAttribute("text-anchor", "middle");
			text_new_element.setAttribute("fill", "white");
			text_new_element.setAttribute("font-size", "10px");
			text_new_element.setAttribute("font-family", "Arial");
			text_new_element.setAttribute("dy", ".3em");
			text_new_element.setAttribute("class", "text_circle");

			options_circle.setAttribute("cx", info_manager.element_copy.getBoundingClientRect().width + 10);
			options_circle.setAttribute("cy", 5);
			options_circle.setAttribute("r", "5");
			options_circle.setAttribute("fill", "transparent");
			options_circle.setAttribute("class", "circle_text");
			options_circle.addEventListener("click", change_type_click, false);

			g_new_element.id = info_manager.n_new_element;
			g_new_element.setAttribute("class", "copy_el");
			g_new_element.addEventListener("mouseenter", mouseEnterState, false);
			g_new_element.addEventListener("mouseleave", mouseLeaveState, false);
			new_element.removeAttribute("onmousedown");
			new_element.setAttribute("transform", "translate(0 5)");
			g_new_element.setAttribute("transform", "translate(" + 
				(ev.clientX - getPosition(element).x - (info_manager.element_copy.getBoundingClientRect().width / 2) ) + 
				" " + (ev.clientY - getPosition(element).y - (info_manager.element_copy.getBoundingClientRect().height / 2) ) + ")");

			info_manager.n_new_element++;

			text_new_element.textContent = "State " + g_new_element.id;

			g_new_element.style.cursor = "default";

			g_new_element.appendChild(new_element);
			g_new_element.appendChild(text_new_element);
			g_new_element.appendChild(options_circle);
			element.appendChild(g_new_element);

			info_manager.state_elements[g_new_element.id] = 
				new StateElement( new_element );

			new_element.addEventListener("mousedown", function(e) { 
				clickEventEl(e, info_manager.state_elements[g_new_element.id]); }, false);

		}

	}

}

function clickEventEl (ev, obj_state_element) {
	
	/*
		1 - Remove Element

		2 - Transitions Events

		3 - Drag Start

		4 - Init State

	*/

	if ( info_manager.element_remove ){

		console.log(" Remove Element ");
	
		remove_Element(ev);
	
	}else if ( ( obj_state_element.drag_transition == 0 ) && 
				( info_manager.create_initial_state == false ) && 
				( info_manager.create_final_state == false ) ){

		console.log(" Transitions Events ");

		eventTransitions(ev, obj_state_element);

	}else if ( ( obj_state_element.drag_transition == 1 ) && 
      ( info_manager.create_initial_state == false ) && 
      ( info_manager.create_final_state == false ) ){

      	console.log(" Drag Start ");

		dragStart(ev);

	}else if( info_manager.create_initial_state ){

		console.log(" Init State ");

		isInitialState(ev);

	}else if ( info_manager.create_final_state ) {

		console.log(" Final State ")

		isFinalState(ev);
		
	}

}

function dragStart (ev) {

	/*

		element -> elemento HTML <g> que acopla o 
		elemento estado que irá ser arrastado

		info_manager.element_moved é alterado para 
		o elemento <g> que contem o elemento estado 
		sendo arrastado 

		Se no objeto StateElement referente ao elemento 
		sendo arrastado estiver informando que ele está 
		no modo de transição (valor 0), então ele não 
		continua com o evento, senão ele mantém o evento 
		de arrasto 

		Eventos de movimento do mouse, saída do espaço 
		do elemento e liberação do botão do mouse são 
		adicionados ao espaço de construção do diagrama 

		Eventos para o arrasto e seu fim são adicionados 
		ao elemento SVG, sendo esses eventos sempres 
		relacionados apenas ao elemento estado que iniciou 
		o DRAG 

	*/

	var element = ev.target.parentElement;

	info_manager.element_moved = ev.target.parentElement;

	info_manager.svg.addEventListener("mousemove", drag, false);
	info_manager.svg.addEventListener("mouseleave", dragEnd, false);
	info_manager.svg.addEventListener("mouseup", dragEnd, false);

}

function drag (ev) {

	/*

		preventDefault -> cancela o evento se for cancelável, 
		sem parar a propagação do mesmo 

		Altera as coordenadas do elemento para as do mouse 
		enquanto o botão estiver sendo segurado 

		followElement é responsavel por fazer com que as 
		transições ligadas aquele determinado elemento 
		sigam-no 

	*/

	ev.preventDefault();

	var x = ev.clientX - getPosition(info_manager.svg).x - (info_manager.element_moved.getBoundingClientRect().width / 2);
	var y = ev.clientY - getPosition(info_manager.svg).y - (info_manager.element_moved.getBoundingClientRect().height / 2);

	var state = info_manager.element_moved.querySelector(".copy_el");

	var new_x = ev.clientX - getPosition(info_manager.svg).x - ( (getPosition(state).x - getPosition(info_manager.element_moved).x) + state.getBoundingClientRect().width/2 );
	var new_y = ev.clientY - getPosition(info_manager.svg).y - ( (getPosition(state).y - getPosition(info_manager.element_moved).y) + state.getBoundingClientRect().height/2 );

	info_manager.element_moved.setAttribute("transform", "translate(" + new_x + " " + new_y + ")");

	followElement(ev, info_manager.element_moved.id);

}

function dragEnd (ev) {

	/*

		preventDefault -> cancela o evento se for cancelável, 
		sem parar a propagação do mesmo

		Altera as coordenadas do elemento para as do mouse 

		followElement é responsavel por fazer com que as 
		transições ligadas aquele determinado elemento 
		sigam-no 

		info_manager.element_moved é limpo 

		Eventos de arrasto e seu fim são removidos 

	*/

	ev.preventDefault();
	
	var state = info_manager.element_moved.querySelector(".copy_el");

	var new_x = ev.clientX - getPosition(info_manager.svg).x - ( (getPosition(state).x - getPosition(info_manager.element_moved).x) + state.getBoundingClientRect().width/2 );
	var new_y = ev.clientY - getPosition(info_manager.svg).y - ( (getPosition(state).y - getPosition(info_manager.element_moved).y) + state.getBoundingClientRect().height/2 );

	info_manager.element_moved.setAttribute("transform", "translate(" + new_x + " " + new_y + ")");

	followElement(ev, info_manager.element_moved.id);

	info_manager.element_moved = undefined;

	info_manager.svg.removeEventListener("mousemove",drag);
	info_manager.svg.removeEventListener("mouseleave",dragEnd);
	info_manager.svg.removeEventListener("mouseup",dragEnd);

}

function change_type_click (ev) {

	/*

		Se "drag_transition" do elemento principal estiver 
		marcado como Drag, ele ficará como Transition 
		e vice-versa 

		Como método informativo, a variavel drag_transition do 
		elemento principal é modificada, para então ser testada 
		durante os clicks, além de que o texto do elemento é 
		modificado 

	*/

	// elemento pai do circulo de drag_transition ( elemento "g" )
	var element = ev.target.parentElement;

	if (info_manager.state_elements[element.id].drag_transition === 0){
		info_manager.state_elements[element.id].drag_transition = 1;
		element.querySelector(".text_circle").textContent = 
			element.querySelector(".text_circle").textContent.replace("State","Drag");
	}else{
		info_manager.state_elements[element.id].drag_transition = 0;
		element.querySelector(".text_circle").textContent = 
			element.querySelector(".text_circle").textContent.replace("Drag","State");
	}
}

function mouseEnterState (ev) {
	ev.target.querySelector(".circle_text").setAttribute("fill", "white");
	ev.target.querySelector(".text_circle").setAttribute("fill", "transparent");
}

function mouseLeaveState (ev) {
	ev.target.querySelector(".circle_text").setAttribute("fill", "transparent");
	ev.target.querySelector(".text_circle").setAttribute("fill", "white");
}

function mouseEnterMarker (ev) {
	ev.target.setAttribute("fill", "white");
}

function mouseLeaveMarker (ev) {
	ev.target.setAttribute("fill", "transparent");
}

function remove_Element_Bool(ev){

	info_manager.element_remove = true;

}

function remove_Element (ev) {
	
	var element_id = ev.target.parentNode.id;

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

	info_manager.svg.removeChild(ev.target.parentNode);

	info_manager.element_remove = false;

}

function new_Initial_State (ev) {
	
	if ( info_manager.create_initial_state ){
		info_manager.create_initial_state = false;
	}else{
		info_manager.create_initial_state = true;
	}

}

function new_Final_State (ev) {
	
	if ( info_manager.create_final_state ){
		info_manager.create_final_state = false;
	}else{
		info_manager.create_final_state = true;
	}

}

function isInitialState (ev) {

	var state = ev.target;
	var g_parent = ev.target.parentElement;

	// já existe um estado inicial
	if ( ( info_manager.initial_state != undefined ) || 
		( info_manager.state_elements[g_parent.id].getInPutTransitions().length > 0 ) ){

		info_manager.create_initial_state = false;
		return false;
	
	}

	var transform = null;
	var x_transform = 0;
	var y_transform = 0;
	var transform = undefined;
	var index_x_transform = 0;
	var index_y_transform = 0;
	var transform_after_x = "";

	if ( info_manager.final_states[g_parent.id] == undefined ){

		// console.log("não estado final");

		var y = getPosition(g_parent).y - getPosition(state).y + ( state.getBoundingClientRect().height/2 );

	}else{

		// console.log("estado final");

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

function isFinalState (ev) {

	var state = ev.target;
	var g_parent = ev.target.parentElement;
	var copy_state = state.cloneNode(true);
	var info_state = state.getBoundingClientRect();

	var x = ( getPosition(state).x - getPosition(g_parent).x ) + ( ( info_state.width * 0.1 ) / 2 );
	var y = ( getPosition(state).y - getPosition(g_parent).y ) + ( ( info_state.height * 0.1 ) / 2 );

	// para identificar o elemento atras do estado quando ele é o final 
	copy_state.setAttribute("class", "el_final_state");
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

}

function defaultMouse (ev) {
	
	info_manager.element_copy = undefined;

	info_manager.svg.style.cursor = 'default';

}