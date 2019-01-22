function addTextTransition (id_conexao, state_element) {

	/*

		g_text_marker -> Clone <g> do texto do marcador.

		<g> do marcador recebe o <g> do texto do marcador.

		A função de apresentação das informações do texto é chamada.

	*/

	info_manager.transitions_elements[id_conexao].label = undefined;
	
	var g_text_marker = document.getElementsByClassName("text_marker")[0].cloneNode(true);
	g_text_marker.setAttribute("transform", "translate(0 -10)");
	g_text_marker.setAttribute("height", "30px");
    g_text_marker.style.display = 'none';

    g_text_marker.querySelector(".probability_marker").textContent = "1.00";
    g_text_marker.querySelector(".guard_marker").textContent = "true";

    document.getElementById("marker_" + id_conexao).appendChild(g_text_marker);

    alterTextMarkers();

}

function follow_textTransition (ang, marker) {

	/*
		text_marker -> Obtem do <g> do texto do marcador.

		info_text -> Informações sobre as coordenadas e dimensões do <g> do 
		texto do marcador.

		d -> define a distancia que o texto deve estar do marcador.
	*/

	var text_marker = marker.querySelector("g.text_marker");

	var info_text = text_marker.getBoundingClientRect();

    var d = calc_ellipse( info_text.height/2, info_text.width/2, ang);

	text_marker.setAttribute("transform", "translate(0 -" + (d + 5) + ") rotate(-" + ang + ")");

}

function calc_ellipse(b,c,ang){

	ang = ang + 90;

	var rad = ( ang * Math.PI ) / 180;

	var a = Math.sqrt( Math.pow(b, 2) + Math.pow(c, 2) );

	var A = b * Math.sin(rad);

	var y = A;

	var x = Math.sqrt( ( Math.pow(a, 2) * Math.pow(b, 2) - Math.pow(a, 2) * Math.pow(y, 2) ) / Math.pow(b, 2) );

	var d = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) );

	return d;

}

function changeText (ev) {

	/*
		text_marker_el -> <text> do texto do marcador.

		g_parent_el -> <g> do texto do marcador.

		el_marker_text é definido como o <tspan> do texto.

		text_editable -> Clone do <foreignObject> do input do texto.

		A altura do input é ajustada.

		Verifica qual valor do texto deve ser alterado.

		Evento de finalização da alteração da informação do texto é ativado.
	*/
	
	var text_marker_el = ev.target.parentElement;
	var g_parent_el = text_marker_el.parentElement;
	var id_transition = 
		g_parent_el.parentElement.id.slice( g_parent_el.parentElement.id.indexOf("l") );

	info_manager.el_marker_text = ev.target;

	var text_editable = document.getElementsByClassName("text_editable_input")[0].cloneNode(true);
	text_editable.setAttribute("y", Number(text_marker_el.getAttribute("y")) - 10);

	if ( info_manager.el_marker_text.getAttribute("class").includes("label_marker") ){
		
		text_editable.querySelector("input").value = 
			info_manager.transitions_elements[id_transition].info_transition.label;
	
	}else if ( info_manager.el_marker_text.getAttribute("class").includes("probability_marker") ) {
		
		text_editable.querySelector("input").value = 
			info_manager.transitions_elements[id_transition].info_transition.probability;
	
	}else if ( info_manager.el_marker_text.getAttribute("class").includes("guard_marker") ) {

		text_editable.querySelector("input").value = 
			info_manager.transitions_elements[id_transition].info_transition.guard;

	}

	g_parent_el.appendChild(text_editable);
	text_marker_el.style.display = 'none';

	text_editable.querySelector("input").focus();

	info_manager.svg.addEventListener("click", endChangeText, false);

}

function endChangeText (ev) {

	/*
		Verifica quem chamou a finalização foi o elemento correto.

		text_marker_el -> <text> do texto do marcador.

		g_parent_el -> <g> do texto do marcador.

		Verifica qual valor do texto deve ser alterado e então altera este 
		valor.

		O clone do input é removido.

		O evento de finalização é ativado.
	*/

	if ( (ev.target.tagName != "INPUT") && (ev.target.tagName != "tspan") ){

		var text_marker_el = info_manager.el_marker_text.parentElement;
		var g_parent_el = text_marker_el.parentElement;

		var id_transition = 
			g_parent_el.parentElement.id.slice( g_parent_el.parentElement.id.indexOf("l") );

		if ( info_manager.el_marker_text.getAttribute("class").includes("label_marker") ){

			info_manager.transitions_elements[id_transition].info_transition.label = 
				g_parent_el.querySelector("input").value;
			info_manager.el_marker_text.textContent = g_parent_el.querySelector("input").value;
		
		}else if ( info_manager.el_marker_text.getAttribute("class").includes("probability_marker") ) {

			info_manager.transitions_elements[id_transition].info_transition.probability = 
				g_parent_el.querySelector("input").value;
			info_manager.el_marker_text.textContent = Number(g_parent_el.querySelector("input").value).toFixed(2);
		
		}else if ( info_manager.el_marker_text.getAttribute("class").includes("guard_marker") ) {

			info_manager.transitions_elements[id_transition].info_transition.guard = 
				g_parent_el.querySelector("input").value;
			info_manager.el_marker_text.textContent = g_parent_el.querySelector("input").value;
		}


		g_parent_el.removeChild(g_parent_el.querySelector("input").parentNode.parentNode);
		text_marker_el.style.display = '';

		info_manager.el_marker_text = undefined;

		info_manager.svg.removeEventListener("click", endChangeText);

	}

}

function showTextMarker (ev) {

	/*
		Define se texto do marcador deve ser apresentado.
	*/
	
	var g_marker = ev.target.parentElement.parentElement;

	var g_text_marker = 
		g_marker.querySelector("g.text_marker");

	if (g_text_marker.style.display == "none"){
		g_text_marker.style.display = 'flex';
	}else{
		g_text_marker.style.display = 'none';
	}

}

function alterTextMarkers () {

	/*
		Atualiza todos os textos das transições de acordo com os checkmarker de 
		probabilidade e guarda.
	*/
	
	/* Modificado */
	var probability = true;
	var guard = true;

	for ( var key in info_manager.transitions_elements ){

		var id_marker_text = "marker_" + info_manager.transitions_elements[key].el.id;
		var g_marker = document.getElementById(id_marker_text);

		if ( ( probability == false ) && ( guard == false ) ){
			
			for ( var i = 0; i < g_marker.getElementsByClassName("probability_marker_display").length; i++ ){
				g_marker.getElementsByClassName("probability_marker_display")[i].style.display = 'none';
			}

			for ( var i = 0; i < g_marker.getElementsByClassName("guard_marker_display").length; i++ ){
				g_marker.getElementsByClassName("guard_marker_display")[i].style.display = 'none';
			}

		}else if ( ( probability == true ) && ( guard == false ) ) {
			
			for ( var i = 0; i < g_marker.getElementsByClassName("probability_marker_display").length; i++ ){
				g_marker.getElementsByClassName("probability_marker_display")[i].style.display = '';
			}

			for ( var i = 0; i < g_marker.getElementsByClassName("guard_marker_display").length; i++ ){
				g_marker.getElementsByClassName("guard_marker_display")[i].style.display = 'none';
			}

		}else if ( ( probability == false ) && ( guard == true ) ) {
			
			for ( var i = 0; i < g_marker.getElementsByClassName("probability_marker_display").length; i++ ){
				g_marker.getElementsByClassName("probability_marker_display")[i].style.display = 'none';
			}

			for ( var i = 0; i < g_marker.getElementsByClassName("guard_marker_display").length; i++ ){
				g_marker.getElementsByClassName("guard_marker_display")[i].style.display = '';
			}

		}else if ( ( probability == true ) && ( guard == true ) ){

			for ( var i = 0; i < g_marker.getElementsByClassName("probability_marker_display").length; i++ ){
				g_marker.getElementsByClassName("probability_marker_display")[i].style.display = '';
			}

			for ( var i = 0; i < g_marker.getElementsByClassName("guard_marker_display").length; i++ ){
				g_marker.getElementsByClassName("guard_marker_display")[i].style.display = '';
			}

		}

	}

}

function ChangeShowInfoTransition (prob, guard, label) {
	
	var divInfo = document.getElementById("InfoTransition");

	divInfo.querySelector("#inputLabelTransition").value = label;
	divInfo.querySelector("#inputProbabilityTransition").value = prob;
	divInfo.querySelector("#inputGuardTransition").value = guard;

}