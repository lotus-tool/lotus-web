function addTextTransition (id_conexao) {

	var probability = document.getElementById("probability").checked;
	var guard = document.getElementById("guard").checked;

	info_manager.transitions_elements[id_conexao] = 
		new TransitionElement( document.getElementById(id_conexao) );

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

	var id_transition = marker.id;
	id_transition = id_transition.slice( id_transition.indexOf("l") );

	var text_marker = marker.querySelector("g.text_marker");

	var info_text = text_marker.getBoundingClientRect();

    var d = calc_ellipse( info_text.height/2, info_text.width/2, ang);

	text_marker.setAttribute("transform", "translate(0 -" + (d + 5) + ") rotate(-" + ang + ")");

}

function calc_ellipse(b,c,ang){

	/*console.log("b: " + b);
	console.log("c: " + c);
	console.log("ang: " + ang);*/

	ang = ang + 90;

	var rad = ( ang * Math.PI ) / 180;

	//console.log("rad: " + rad);

	var a = Math.sqrt( Math.pow(b, 2) + Math.pow(c, 2) );

	//console.log("a: " + a);

	var A = b * Math.sin(rad);

	//console.log("A: " + A);

	var y = A;

	var x = Math.sqrt( ( Math.pow(a, 2) * Math.pow(b, 2) - Math.pow(a, 2) * Math.pow(y, 2) ) / Math.pow(b, 2) );

	//console.log("x: " + x);

	var d = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) );

	return d;

}

function changeText (ev) {

	console.log("mudar");
	
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

	console.log("fim");

	g_parent_el.appendChild(text_editable);
	text_marker_el.style.display = 'none';

	text_editable.querySelector("input").focus();

	info_manager.svg.addEventListener("click", endChangeText, false);

}

function endChangeText (ev) {

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
	
	var probability = document.getElementById("probability").checked;
	var guard = document.getElementById("guard").checked;

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