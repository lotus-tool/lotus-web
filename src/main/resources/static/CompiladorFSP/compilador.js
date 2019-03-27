function Compilar (ev) {
	
	var editor = document.getElementById("editor");
	var data = editor.innerText;

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

	console.log(words);

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
	      console.log(msg)
	 })
	 .fail(function(jqXHR, textStatus, msg){
	      alert(msg);
	 });

}