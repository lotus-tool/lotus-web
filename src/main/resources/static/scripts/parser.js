function parser(){
    var elementos = document.getElementsByTagName('svg')[0].children;
    var tam = elementos.length;
    var states = [];
    var transitions = [];
    for(var i=0; i < tam  ; i++){
        var element = elementos[i];
        if(element.tagName == "image"){
            var ID = element.getAttribute("data-state-id");
            var status = element.getAttribute("data-state-type");
            var state = {ID : ID, type : status};
            states.push(JSON.stringify(state));

        }else if(element.tagName == "path"){
            var ID = element.id.split("-")[3];
            var srcID = element.getAttribute("data-srcID");
            var dstID = element.getAttribute("data-dstID");
            var transition = {ID : ID, srcID : srcID, dstID : dstID};
            transitions.push(JSON.stringify(transition));
        }
    }
    console.log(states);
    console.log(transitions);
}
