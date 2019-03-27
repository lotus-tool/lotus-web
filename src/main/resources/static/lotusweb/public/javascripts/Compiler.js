function editorConfig () {

	/* /\b[A-Z]*[A-Z]+[A-Z]*\b/ */
	/* /\W[\-+%=<>*]\W|\*\*|[~:,\.&$]|->*?|=>/ */
	/* /\((?!.*\))|\-(?!\>)/ */

	/* https://macromates.com/manual/en/language_grammars */

	/*var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/javascript");*/

	define("DynHighlightRules", [], function(require, exports, module) {
	"use strict";

	var oop = require("ace/lib/oop");
	var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

	var DynHighlightRules = function() {
	   this.setKeywords = function(kwMap) {     
	       this.keywordRule.onMatch = this.createKeywordMapper(kwMap, "identifier")
	   }
	   this.keywordRule = {
	       regex : "\\w+",
	       onMatch : function() {return "text"}
	   }
	     
	   this.$rules = {
	        "start" : [ 
	            {
	                token: "string",
	                start: '"', 
	                end: '"',
	                next: [{ token : "constant.language.escape.lsl", regex : /\\[tn"\\]/}]
	            },
	            {
	            	token: "string",
	            	start: "'",
	            	end: "'"
	            },
	            {
	            	token: "invalid",
	            	regex: /\((?!.*\))|\-(?!\>)/
	            },
	            {
	            	token: "keyword.operator",
	            	regex: /[\-+%=<>*~:,.&$]/
	            },
	            {
	            	token: "variable",
	            	regex: /\b[A-Z]+[A-Za-z-0-9_]*/
	            },
	            this.keywordRule
	        ]
	   };

	   this.normalizeRules()
	};

	oop.inherits(DynHighlightRules, TextHighlightRules);

	exports.DynHighlightRules = DynHighlightRules;

	});

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	var TextMode = require("ace/mode/text").Mode;
	var dynamicMode = new TextMode();
	dynamicMode.HighlightRules = require("DynHighlightRules").DynHighlightRules;

	editor.session.setMode(dynamicMode);
	dynamicMode.$highlightRules.setKeywords({"keyword": "const|property|range|if|then|else|forall|when"});
	editor.session.bgTokenizer.start(0);

	/*var Range = require("ace/range").Range;
	editor.session.addMarker(new Range(2, 0, 2, 1), 'ace_highlight-marker', 'fullLine');*/


}

function ClearCompiler (ev) {
	
	var editor = ace.edit("editor");
	editor.setValue("");
	ev.preventDefault();
    ev.stopPropagation();

}

function StartCompiler (ev) {
	
	var editor = ace.edit("editor");
	var data = editor.getValue();

	var reserved_labels = ["const", "property", "range", "if", "then", "else", "forall", "when"];
	var local_identifiers = ["STOP", "ERROR"];

	data = data.replace(/,/g," , ")
				.replace(/\(/g," ( ")
				.replace(/\)/g," ) ")
				.replace(/\[/g," [ ")
				.replace(/\]/g," ] ")
				.replace(/\{/g," { ")
				.replace(/\}/g," } ")
				.replace(/\</g," < ")
				.replace(/>/g," > ")
				.replace(/\|/g," | ")
				.replace(/-/g," - ")
				.replace(/\./g," . ")
				.replace(/\@/g," @ ")
				.replace(/=/g," = ")
				.replace(/\*/g," * ")
				.replace(/:/g," : ");

	words = data.split(/\s/).filter(function (w) { return w.length > 0 });

	$.ajax({
	      url : "http://localhost:5000/api",
	      type : 'post',
	      data : JSON.stringify({'data' : words}),
	      dataType : 'json',
	      contentType: 'application/json;charset=UTF-8',
	      beforeSend : function(){
	           console.log("Enviando");
	      }
	 })
	 .done(function(msg){
	      mountLTSFSP(msg);
	 })
	 .fail(function(jqXHR, textStatus, msg){
	      alert(msg);
	 });

}

function mountLTSFSP (lts_dict) {
	
	var states = lts_dict['lts_dict']['states'];
	var transitions = lts_dict['lts_dict']['transitions'];

	var x_state = 100;
	var y_state = 1000;

	var created_States = {}

	for (key_state in states) {

		var id_state = createStateCompiler(x_state,y_state);
		created_States[key_state] = id_state;
		x_state += 100;

	}

	for (key_transition in transitions) {
		
		var id_orgState = created_States[transitions[key_transition]['orgState']];
		var id_dstState = created_States[transitions[key_transition]['dstState']];

		console.log(id_orgState);
		console.log(id_dstState);
		console.log(created_States);

		var orgState = info_manager.state_elements[id_orgState];
		var dstState = info_manager.state_elements[id_dstState];

		console.log(orgState);
		console.log(dstState);

		var id_conexao = createTransitionCompiler(orgState,dstState);

		info_manager.transitions_elements[id_conexao]['info_transition']['guard'] = 
			transitions[key_transition]['guard'];

		info_manager.transitions_elements[id_conexao]['info_transition']['probability'] = 
			transitions[key_transition]['probability'];

		info_manager.transitions_elements[id_conexao]['info_transition']['label'] = 
			transitions[key_transition]['label'];

	}

	updateInfoTransitions();
}

function createStateCompiler (x_state,y_state) {

	var element = info_manager.svg;
	info_manager.element_copy = document.getElementById("original_state");

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
		(x_state - (info_manager.element_copy.getBoundingClientRect().width / 2) ) + 
		" " + (y_state - (info_manager.element_copy.getBoundingClientRect().height / 2) ) + ")");

	info_manager.n_new_element++;

	text_new_element.textContent = info_manager.proxLabel;

	info_manager.proxLabel++;

	g_new_element.style.cursor = "default";
	info_manager.element_copy = undefined;

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

	new_element.addEventListener("mousedown", clickEventEl, false);

	return g_new_element.id

}

function createTransitionCompiler (orgState, dstState) {
	
	//

	/*info_manager.transitionInMove = "linha" + Object.keys(info_manager.transitions_elements).length;*/

	var info_element = orgState.el.getBoundingClientRect();
	var info_element_dst = dstState.el.getBoundingClientRect();

    var x1 = getPosition(orgState.el).x - getPosition(info_manager.svg).x + (info_element.width / 2);
    var y1 = getPosition(orgState.el).y - getPosition(info_manager.svg).y + (info_element.height / 2);
    var x2 = getPosition(dstState.el).x - getPosition(info_manager.svg).x + (info_element_dst.width / 2);
    var y2 = getPosition(dstState.el).y - getPosition(info_manager.svg).y + (info_element_dst.height / 2);

    var id_conexao = "linha" + info_manager.n_transition;
	info_manager.n_transition++;

	orgState.setOutPutTransitions(id_conexao);
    dstState.setInPutTransitions(id_conexao);

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    info_manager.svg.insertBefore(path, document.getElementById("startLines"));

    path.setAttribute("id", id_conexao);
    path.setAttribute("stroke", "black");
	path.setAttribute("stroke-width", "2");
	path.setAttribute("fill", "transparent");
	path.addEventListener("click", Properties, false);

    if (x1 === x2 && y1 === y2){

		/* Mesmo elemento estado */

		x1 = x1 - (info_element.width / 2) + Number( path.getAttribute("stroke-width") );
		x2 = x2 + (info_element.width / 2) - Number( path.getAttribute("stroke-width") );

		x = (x1 + x2) / 2;
		y = (y1 - info_element.height*2)

		var d = "M" + x1 + "," + y1 + " Q" + x + "," + y + " " + x2 + "," + y2;

		path.setAttribute("d", d);

		var ang = 0;

		var marker = document.getElementById("arrow").cloneNode(true);
		marker.setAttribute("id", "marker_" + id_conexao);
		marker.setAttribute("fill", "black");
		marker.setAttribute("transform", "translate(" + (x-6) + " " + ((y1 + y)/2 - 5) +") rotate (" + ang + ")");
		marker.setAttribute("draggable", "true");
		info_manager.svg.insertBefore(marker, document.getElementById("startLines"));

    }else{

      /* Elementos estado distintos */

		var coord = calcPolarCoord(x1,y1,x2,y2);

		var x = coord.x;
		var y = coord.y;
		var x_Marker = coord.x_Marker;
		var y_Marker = coord.y_Marker;
		var teta = coord.teta;

		var d = "M" + x1 + "," + y1 + " Q" + x + "," + y + " " + x2 + "," + y2;

		path.setAttribute("d", d);

		var ang = calcAngMarker(teta,x1,x2,y1,y2);

		var marker = document.getElementById("arrow").cloneNode(true);
		marker.setAttribute("id", "marker_" + id_conexao);
		marker.setAttribute("fill", "black");
		marker.setAttribute("transform", "translate(" + x_Marker + " " + y_Marker +") rotate (" + ang + ")");
		marker.setAttribute("draggable", "true");
		info_manager.svg.insertBefore(marker, document.getElementById("startLines"));

    }

	info_manager.transitions_elements[id_conexao] = 
	new TransitionElement( document.getElementById(id_conexao) );

	info_manager.transitions_elements[id_conexao].orgState = 
	orgState.el.parentElement.id;

	info_manager.transitions_elements[id_conexao].dstState = 
	dstState.el.parentElement.id;

	addTextTransition(id_conexao, orgState.el);

	follow_textTransition(ang, marker);

	return id_conexao;

}

function updateInfoTransitions () {

	for (key in info_manager.transitions_elements){

		var marker = document.getElementById("marker_" + key);
		var text_marker = marker.getElementsByClassName('text_marker');

		if (info_manager.transitions_elements[key]['info_transition']['probability'] != null){
			text_marker[0].children[0].getElementsByClassName(
				"probability_marker probability_marker_display")[0].textContent = 
				info_manager.transitions_elements[key]['info_transition']['probability'];
		}

		if (info_manager.transitions_elements[key]['info_transition']['guard'] != null){
			text_marker[0].children[0].getElementsByClassName(
				"guard_marker guard_marker_display")[0].textContent = 
				info_manager.transitions_elements[key]['info_transition']['guard'];
		}

		if (info_manager.transitions_elements[key]['info_transition']['label'] != null){
			text_marker[0].children[0].getElementsByClassName(
				"label_marker label_marker_display")[0].textContent = 
				info_manager.transitions_elements[key]['info_transition']['label'];
		}

	}

}