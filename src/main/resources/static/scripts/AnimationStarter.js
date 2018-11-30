document.getElementById("animStarter").addEventListener("mouseenter", animBtnAnimStart, false);
document.getElementById("animStarter").addEventListener("mouseleave", animBtnAnimStop, false);

function animBtnAnimStart(ev, stop) {

	/* stopAnimSimulation serve para definir que a animação
		deve ser desativada quando o mouse deixar o espaço
		do botão.

		simbolStart.style.transform == "" evita que a animação
		se sobreponha. */

	info_manager.stopAnimSimulation = false;
	
	var simbolStart = document.querySelector("#animStarter i");

	var originStyle = simbolStart.style;

	if ( simbolStart.style.transform == "" ){
		
		var scaleQtd = 1;
		var x = 0;
		var y = 0;
		var xShadow = 5;
		var yShadow = 2;
		
		var up_down = 0;

		function FuncAnim () {

			simbolStart.style.transform = "translate("+(x)+"px, "+(y)+"px) scale("+scaleQtd+")";
			simbolStart.style.textShadow = xShadow+"px "+yShadow+"px black";

			if(up_down == 0){
				scaleQtd += 0.05;
				x -= 0.5;
				y -= 0.5;
				xShadow += 0.5;
				yShadow += 0.5;
				if ( scaleQtd >= 1.5 ){
					up_down = 1;
				}
			}

			if(up_down == 1){
				scaleQtd -= 0.05;
				x += 0.5;
				y += 0.5;
				xShadow -= 0.5;
				yShadow -= 0.5;
				if ( scaleQtd <= 1 ){
					up_down = 0;
					if (info_manager.stopAnimSimulation){
						simbolStart.style = originStyle;
						clearInterval(anim);
					}
				}
			}

		}

		var anim = setInterval(FuncAnim, 60);

	}

}

function animBtnAnimStop (ev) {
	info_manager.stopAnimSimulation = true;
}

function TextAnimStartStop (start) {
	
	var textAnim =  document.getElementById("textModeAnimation");

	if (start){

		var opacity = 0;

		var anim = setInterval(function(){

			opacity += 0.1;

			textAnim.style.opacity = opacity;

			if ( opacity >= 1 ){
				clearInterval(anim);
			}

		}, 100);

	}else{

		var opacity = 1;

		var anim = setInterval(function(){

			opacity -= 0.1;

			textAnim.style.opacity = opacity;

			if ( opacity <= 0 ){
				clearInterval(anim);
			}

		}, 100);

	}

}

/* Parte Importante */

function ModeAnimation () {

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

	if ( info_manager.ModeAnimation != true ){

		info_manager.traceSimulation = [];

		TextAnimStartStop(true);
		info_manager.ModeAnimation = true;

		var desableElTransition = document.querySelectorAll("#container [id*='linha']");
		for ( var i = 0; i < desableElTransition.length; i++  ){
			desableElTransition[i].style.pointerEvents = "none";
		}

		StartSimulation();

	}else{

		TextAnimStartStop(false);
		info_manager.ModeAnimation = false;

		var desableElTransition = document.querySelectorAll("#container [id*='linha']");
		for ( var i = 0; i < desableElTransition.length; i++ ){
			desableElTransition[i].style.pointerEvents = "auto";
			desableElTransition[i].removeAttribute("stroke-dasharray");
			desableElTransition[i].style.animation = 'none';
		}

	}

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
			console.log(info_manager.traceSimulation[i][2]);
			transitionsTrace.push(info_manager.traceSimulation[i][2].id);
		}

		console.log(transitionsTrace);

		transitions = info_manager.state_elements[oldState.id].getOutPutTransitions();

		for ( var i = 0; i < transitions.length; i++ ){
			if ( !transitionsTrace.includes(transitions[i]) ){
				document.getElementById(transitions[i]).removeAttribute("stroke-dasharray");
			}
		}

		interTransition.setAttribute("stroke-dasharray", "7 3");
		interTransition.style.animation = "strokeMovimentSimulation 5s linear infinite";
		/*interTransition.setAttribute(
			"style", "animation: strokeMovimentSimulation 5s linear infinite;");*/

	}

}

function StartSimulation() {
	
	var intState = info_manager.initial_state;

	updateSimulation(undefined,intState,undefined);

	info_manager.currentStateSimulation = intState;

}

function Simulation (ev, obj_state) {
	
	var state = ev.target.parentElement;

	if ( state.id != info_manager.currentStateSimulation.id ){
		
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

}