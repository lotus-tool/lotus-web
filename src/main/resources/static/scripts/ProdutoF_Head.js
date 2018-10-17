// objeto Elemento(Estado)
var StateElement = function ( element ) {

  /*

    this.el -> 

    this.input_transitions -> Vetor de Ids das transições de que estão entrando

    this.output_transitions -> Vetor de Ids das transições de que estão saindo

    this.drag_transition -> Identifica se deve ocorrer um arrasto ou uma transição
                            0: transição
                            1: arrasto

    this.setOutPutTransitions -> Adiciona o Id de uma transição ao array de 
    transições de saída

    this.getOutPutTransitions -> Retorna o array de transições de saída

    this.setInPutTransitions -> Adiciona o Id de uma transição ao array de 
    transições de entrada

    this.getInPutTransitions -> Retorna o array de transições de entrada

    this.removeValInputTransitions -> Remove o Id da transição especificada 
    do array de transições de entrada

    this.removeValOutputTransitions -> Remove o Id da transição especificada 
    do array de transições de saída

  */
  
  this.el = element;
  this.input_transitions = [];
  this.output_transitions = [];

  this.drag_transition = 0;

  // funções para encapsulamento

  this.setOutPutTransitions = function(id) 
    { this.output_transitions.push(id); };

  this.getOutPutTransitions = function() 
    { return this.output_transitions; };

  this.setInPutTransitions = function(id) 
    { this.input_transitions.push(id); };

  this.getInPutTransitions = function() 
    { return this.input_transitions; };

  this.removeValInputTransitions = function (transition){
    this.input_transitions.splice( this.input_transitions.indexOf(transition), 1 );
  }

  this.removeValOutputTransitions = function (transition){
    this.output_transitions.splice( this.output_transitions.indexOf(transition), 1 );
  }

  this.includeOutPutTransition = function (id_transition){
    return this.output_transitions.includes(id_transition);
  }

  this.includeInPutTransition = function (id_transition){
    return this.input_transitions.includes(id_transition);
  }

}

var TransitionElement = function( element ){

  this.el = element;

  this.info_transition = { "label" : "Label", "probability" : 1.0, "guard" : true };

}

var Info_Manager = function(svg_id) {

  /*

    element_copy -> elemento HTML sendo copiado 
    para o espaço de construção do diagrama 

    element_moved -> elemento HTML sendo arrastado 
    no espaço de construção do diagrama 

    n_new_element -> Id dos elemento HTML que 
    representão os estados que estão sendo criados 

    svg -> svg dos espaço de criação dos 
    diagramas 

    n_transition -> numero do id da proxima 
    transição

    transitionInMove -> id da transição que 
    esta em movimento

    state_elements -> dicionário(objeto) que 
    armazena os Elementos(Estados)

  */

  this.element_copy = undefined;
  this.element_moved = undefined;
  this.element_remove = false;
  this.n_new_element = 0;

  this.svg = document.getElementById(svg_id);

  // NLinhas
  this.n_transition = 0;
  // lineInMove
  this.transitionInMove = undefined;
  // circles
  this.state_elements = {};

  // info das transições
  this.transitions_elements = {};

  this.el_marker_text = undefined;

  this.create_initial_state = false;
  this.create_final_state = false;
  this.initial_state = undefined;
  this.final_states = {};

}

function getPosition(el) {

  // valor do X do elemento na borda superior esquerda
  var xPos = 0;

  // valor do y do elemento na borda superior esquerda
  var yPos = 0;
 
 /* 
    el.offsetTop retorna a  medida, em pixels,
    da distancia do topo do elemento atual em
    relação ao seu elemento pai
  */

  /*
    el.offsetLeft retorna a  medida, em pixels,
    da distancia do canto superior esquerdo do
    elemento atual em relação ao seu elemento pai
  */

  /*
    el.offsetParent retorna o elemento pai do
    elemento atual
  */

  /*
    el.scrollLeft retorna o quão a direita o
    elemento está em relação ao seu scroll,
    o scroll da direita para a esquerda
  */

  /*
    el.scrollTop retorna o quão para baixo o
    elemento está em relação ao seu scroll,
    o scroll de cima para baixo 
  */

  /*
    el.clientLeft retorna a largura da borda
    esquerda de um elemento em pixels
  */

  /*
    el.clientTop retorna a largura da borda
    superior de um elemento
  */

  /*
    document.documentElement  retorna o
    Elemento que é o elemento raiz do documento
    (por exemplo, o elemento <html> para documentos HTML).
  */

  while (el) {

    var info_el_svg = el.getBoundingClientRect()

    if (el.tagName == "BODY") {
      
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      
      xPos += ((el.offsetLeft ||  info_el_svg.left) - el.scrollLeft + el.clientLeft);
      yPos += ((el.offsetTop || info_el_svg.top ) - el.scrollTop + el.clientTop);
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}