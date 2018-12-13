function ModeAnimation (ev) {

	/* Verifica se esta em modo Simulação,
		chama a função TextAnimStartStop(),
		que se recebe true, ativa o texto
		animado, caso contrário, ele é desativado.

		A flag ModeAnimation é marcada com true, se
		antes estava com false, e vice-versa,
		alternando a funcionalidade do botão.

		O eventos das transições e de seus marcadadores
		são desativados se o modo simulaçao for ativado,
		e se o modo for desativado, os eventos são
		novamente ativados. */

	AlternateSimExec(ev);

	if ( info_manager.ModeAnimation != true ){

		info_manager.ModeAnimation = true;

		var desableElTransition = document.querySelectorAll("#container_svg [id*='linha']");
		for ( var i = 0; i < desableElTransition.length; i++  ){
			desableElTransition[i].style.pointerEvents = "none";
		}

		StartSimulation();

	}else{

		info_manager.ModeAnimation = false;

		var desableElTransition = document.querySelectorAll("#container_svg [id*='linha']");
		for ( var i = 0; i < desableElTransition.length; i++ ){
			desableElTransition[i].style.pointerEvents = "auto";
			desableElTransition[i].removeAttribute("stroke-dasharray");
			desableElTransition[i].style.animation = 'none';
		}

		info_manager.traceSimulation = [];

	}

}

function StartSimulation() {
	
	var intState = info_manager.initial_state;

	updateSimulation(undefined,intState,undefined);

	info_manager.currentStateSimulation = intState;

}

function updateSimulation (oldState, newState, interTransition) {

	var transitions = info_manager.state_elements[newState.id].getOutPutTransitions();
	var transitionsTrace = [];

	for ( var i = 0; i < transitions.length; i++ ){
		document.getElementById(transitions[i]).setAttribute(
			"stroke-dasharray", "7 3");
	}

	if ( oldState != undefined ){

		info_manager.traceSimulation.push([oldState,newState,interTransition]);

		for ( var i in info_manager.traceSimulation ){
			transitionsTrace.push(info_manager.traceSimulation[i][2].id);
		}

		if ( oldState != newState ){

			transitions = info_manager.state_elements[oldState.id].getOutPutTransitions();

			for ( var i = 0; i < transitions.length; i++ ){
				if ( !transitionsTrace.includes(transitions[i]) ){
					document.getElementById(transitions[i]).removeAttribute("stroke-dasharray");
				}
			}

		}

		interTransition.setAttribute("stroke-dasharray", "7 3");
		interTransition.style.animation = "strokeMovimentSimulation 5s linear infinite";

	}

	ShowTrace(info_manager.traceSimulation);

}

function Simulation (ev, obj_state) {
	
	var state = ev.target.parentElement;

	var currentStateSimulation = info_manager.currentStateSimulation;
	var currentTransitions = 
		info_manager.state_elements[currentStateSimulation.id].getOutPutTransitions();
	var transition = undefined;

	for ( var i = 0; i < currentTransitions.length; i++ ){

		transition = info_manager.transitions_elements[currentTransitions[i]];

		if ( transition.dstState == state.id ){
			updateSimulation(currentStateSimulation, state, transition.el);
			info_manager.currentStateSimulation = state;
		}

	}

}

function AlternateSimExec (ev) {
	
	if (ev.target.id == "btnSimulation"){

		if ( document.getElementById("Simulation").style.display == 'none' ){
			document.getElementById("Execution").style.display = 'none';
			document.getElementById("Simulation").style.display = 'initial';
			document.getElementById("InfoTransition").style.display = 'none';
		}else{
			document.getElementById("Execution").style.display = 'none';
			document.getElementById("Simulation").style.display = 'none';
			document.getElementById("InfoTransition").style.display = 'initial';
		}

	}else{
		
		if ( document.getElementById("Execution").style.display == 'none' ){
			document.getElementById("Execution").style.display = 'initial';
			document.getElementById("Simulation").style.display = 'none';
			document.getElementById("InfoTransition").style.display = 'none';
		}else{
			document.getElementById("Execution").style.display = 'none';
			document.getElementById("Simulation").style.display = 'none';
			document.getElementById("InfoTransition").style.display = 'initial';
		}


	}

}

function ShowTrace (trace) {

	CleanTable(undefined);

	var table = document.getElementById("Simulation").querySelector("table");
	
	var tbody = document.createElement("tbody");
	var tr;
	var th;
	var td;

	for (i in trace) {

		tr = document.createElement("tr");
		th = document.createElement("th");
		td = document.createElement("td");

		th.setAttribute("scope", "row");

		console.log(trace);

		th.textContent = i;
		td.textContent = 
			info_manager.transitions_elements[
				info_manager.traceSimulation[i][2].id].info_transition["label"];

		tr.appendChild(th);
		tr.appendChild(td);
		tbody.appendChild(tr);

	}

	table.appendChild(tbody);

}

function CleanTable (Simulation_Execution) {
	
	var table = document.getElementById("Simulation").querySelector("table");

	if ( table.querySelector("tbody") != undefined ){
		table.querySelector("tbody").remove();
	}

}