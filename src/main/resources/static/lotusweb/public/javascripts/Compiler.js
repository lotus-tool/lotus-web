function editorConfig () {

	console.log('teste');

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
	            	token: "keyword.operator",
	            	regex: /\W[\-+%=<>*]\W|\*\*|[~:,\.&$]|->*?|=>/
	            },
	            {
	            	token: "variable",
	            	regex: /[A-Z].(?![a-z])/
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
	dynamicMode.$highlightRules.setKeywords({"keyword": "first|items|editor|foot"});
	editor.session.bgTokenizer.start(0);

}