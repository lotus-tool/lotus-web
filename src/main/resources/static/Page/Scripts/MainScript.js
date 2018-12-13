/* objeto contendo informações sobre os elementos HTML 
	sendo animados */
var info_manager = new Info_Manager("container_svg");

/* Evento de finalizar a criação de um elemento */
document.addEventListener("click", copy_End, false);

function copy_Start (ev) {

	/*

		info_manager.element_copy -> armazena o elemento HTML <circle,path,...> 
		que representa o tipo do novo estado.

		info_manager.svg.style.cursor -> Altera o cursor para o formato de uma 
		cruz 

	*/

	/* Modificado */
	info_manager.element_copy = document.getElementById("original_state");

	info_manager.svg.style.cursor = 'crosshair';

}

function copy_End(ev) {

	/*

		element -> elemento HTML qualquer do documento html.

		Verifica-se se "element" representa o elemento HTML <svg> do espaço de 
		trabalho.

		Verifica se há algum elemento sendo copiado e se o modo de simulação 
		não esta ativado.

		g_new_element -> elemento HTML <g> que acopla o estado, seu label e seu 
		ponto de acesso ao menu DropDown.

		new_element -> elemento HTML <circle, path, ...> que representa o novo 
		estado sendo criado.

		text_new_element -> elemento HTML <text> que representa o label do novo 
		estado.

		options_circle -> elemento HTML <circle> que serve de ponto de acesso 
		ao menu DropDown.

		Evento "click" de "options_circle" -> Acessa o menu DropDown.

		Evento "mouseenter" de "g_new_element" -> faz com que o ponto de acesso 
		do menu DropDown fique visivel.

		Evento "mouseleave" de "g_new_element" -> faz com que o ponto de acesso 
		do menu DropDown fique transparent.

		Remoção do Atributo "onmousedown" de "new_element" -> não haver 
		conflito com seu evento de click.

		info_manager.n_new_element é incrementado.

		info_manager.proxLabel é incrementado.

		O cursor volta para o formato padrão.

		"new_element", "text_new_element" e "options_circle" são adicionados a 
		"g_new_element".

		"g_new_element" é adicionado a "element".

		Um objeto StateElement é criado para o novo estado.

		Verifica-se se o estado copiado possui permissão para ter eventos 
		acionados pelo mouse:

			Caso em que o novo elemento está sendo criado com uma transição, 
			sendo proveniente de um elemento já criado.

			O estado criado de um estado já existente não possui permissão para 
			acessar eventos de mouse inicialmente.

			info_manager.element_copy é limpo, recebendo "undefined".

			Remoção do atributi "ID" de "new_element" -> garantir unicidade 
			entre estado, além de que <g> possui o ID do estado.

			"new_element" recebe permissão de acesso a eventos de click.

			A transição recebe permissão de acesso a eventos de click.

			CreateTransition é chamado diretamente para forçar a ligação da 
			transição do estado original com o novo estado criado a partir dele.

		Evento "mousedown" de "new_element" -> acessa a função que define a 
		ação do click sobre o estado.

	*/

	var element = ev.target;

	if ( element.id == info_manager.svg.id ){

		/* Verificar ModeAnimation */
		if ( info_manager.element_copy != undefined && info_manager.ModeAnimation != true ){

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
			options_circle.addEventListener("click", UpdateCurrentEl, false);

			g_new_element.id = info_manager.n_new_element;
			g_new_element.setAttribute("class", "copy_el");
			g_new_element.addEventListener("mouseenter", mouseEnterState, false);
			g_new_element.addEventListener("mouseleave", mouseLeaveState, false);
			new_element.removeAttribute("id");
			new_element.removeAttribute("onmousedown");
			new_element.setAttribute("transform", "translate(0 5)");
			g_new_element.setAttribute("transform", "translate(" + 
				(ev.clientX - getPosition(element).x - (info_manager.element_copy.getBoundingClientRect().width / 2) ) + 
				" " + (ev.clientY - getPosition(element).y - (info_manager.element_copy.getBoundingClientRect().height / 2) ) + ")");

			info_manager.n_new_element++;

			text_new_element.textContent = info_manager.proxLabel;

			info_manager.proxLabel++;

			g_new_element.style.cursor = "default";

			g_new_element.appendChild(new_element);
			g_new_element.appendChild(text_new_element);
			g_new_element.appendChild(options_circle);
			element.appendChild(g_new_element);

			info_manager.state_elements[g_new_element.id] = 
				new StateElement( new_element );

			if (new_element.style.pointerEvents == "none"){

				info_manager.element_copy = undefined;
				new_element.removeAttribute("id");
				new_element.style.pointerEvents = "auto";
				releasePointerEventTransition();

				CreateTransition(ev, info_manager.state_elements[g_new_element.id]);

			}

			new_element.addEventListener("mousedown", function(e) { 
				clickEventEl(e, info_manager.state_elements[g_new_element.id]); }, false);

		}

	}

}

function clickEventEl (ev, obj_state_element) {
	
	/*
		Verifica se está em modo de Simulação:

			Executação a ação deste modo.

		Verifica se deve criar uma nova transição ou se deve inicia a ação de 
		arrasto (DRAG).

	*/

	if ( info_manager.ModeAnimation == true ){

		Simulation(ev, obj_state_element);

	}else if ( ( obj_state_element.drag_transition == 0 ) && 
				( info_manager.create_initial_state == false ) && 
				( info_manager.create_final_state == false ) ){

		CreateTransition(ev, obj_state_element);

	}else if ( obj_state_element.drag_transition == 1 ){

		dragStart(ev);

	}

}

function dragStart (ev) {

	/*

		element -> elemento HTML <g> que acopla o estado que irá ser arrastado.

		info_manager.element_moved recebe "element".

		Evento "mousemove" de <svg> do espaço de trabalho: Realiza o arrasto.

		Evento "mouseleave" de <svg> do espaço de trabalho: Encerra o arrasto.

		Evento "mouseup" de <svg> do espaço de trabalho: Encerra o arrasto.

	*/

	var element = ev.target.parentElement;

	info_manager.element_moved = ev.target.parentElement;

	info_manager.svg.addEventListener("mousemove", drag, false);
	info_manager.svg.addEventListener("mouseleave", dragEnd, false);
	info_manager.svg.addEventListener("mouseup", dragEnd, false);

}

function drag (ev) {

	/*

		preventDefault -> cancela o evento se for cancelável, sem parar a 
		propagação do mesmo 

		Os novos x e y são calculados.

		state -> recebe do <g> do estado, o próprio estado <circle,path,...>, 
		usando da class "copy_el" que identifica os estados.

		O estado é movido para suas novas coordenadas.

		As transições do estado tem seus valores recalculados para porder 
		segui-lo.

	*/

	ev.preventDefault();

	/* Verificar se são necessários */
	
	/*var x = ev.clientX - getPosition(info_manager.svg).x - (info_manager.element_moved.getBoundingClientRect().width / 2);
	var y = ev.clientY - getPosition(info_manager.svg).y - (info_manager.element_moved.getBoundingClientRect().height / 2);*/

	var state = info_manager.element_moved.querySelector(".copy_el");

	var new_x = ev.clientX - getPosition(info_manager.svg).x - ( (getPosition(state).x - getPosition(info_manager.element_moved).x) + state.getBoundingClientRect().width/2 );
	var new_y = ev.clientY - getPosition(info_manager.svg).y - ( (getPosition(state).y - getPosition(info_manager.element_moved).y) + state.getBoundingClientRect().height/2 );

	info_manager.element_moved.setAttribute("transform", "translate(" + new_x + " " + new_y + ")");

	followElement(ev, info_manager.element_moved.id);

}

function dragEnd (ev) {

	/*

		preventDefault -> cancela o evento se for cancelável, sem parar a 
		propagação do mesmo

		Os novos x e y são calculados.

		state -> recebe do <g> do estado, o próprio estado <circle,path,...>, 
		usando da class "copy_el" que identifica os estados.

		O estado é movido para suas novas coordenadas.

		As transições do estado tem seus valores recalculados para porder 
		segui-lo.

		info_manager.element_moved é limpo, recebendo undefined.

		Evento "mousemove" de <svg> do espaço de trabalho: Removido.

		Evento "mouseleave" de <svg> do espaço de trabalho: Removido.

		Evento "mouseup" de <svg> do espaço de trabalho: Removido.

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

function mouseEnterState (ev) {
	ev.target.querySelector(".circle_text").setAttribute("fill", "#aaa");
	ev.target.querySelector(".text_circle").setAttribute("fill", "transparent");
}

function mouseLeaveState (ev) {
	ev.target.querySelector(".circle_text").setAttribute("fill", "transparent");
	ev.target.querySelector(".text_circle").setAttribute("fill", "white");
}

function mouseEnterMarker (ev) {
	ev.target.setAttribute("fill", "#aaa");
}

function mouseLeaveMarker (ev) {
	ev.target.setAttribute("fill", "transparent");
}

function defaultMouse (ev) {	
	info_manager.element_copy = undefined;
	info_manager.svg.style.cursor = 'default';
}