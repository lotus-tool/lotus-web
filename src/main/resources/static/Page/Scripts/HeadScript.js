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

    this.includeOutPutTransition -> Retorna se o id passado como parâmetro
    pertence a alguma transição de saída do estado.

    this.includeInPutTransition -> Retorna se o id passado como parâmetro
    pertence a alguma transição de entrada do estado.

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

  /*
    this.el -> elemento HTML <path> da transição.

    this.orgState -> ID do estado de origem.

    this.dstState -> ID do estado de destino.

    this.info_transition -> Objeto com as informações sobre a label, 
    probabilidade e guarda do objeto.
  
  */

  this.el = element;

  this.orgState = undefined;

  this.dstState = undefined;

  this.info_transition = { "label" : "Label", "probability" : 1.0, "guard" : true };

}

var Info_Manager = function(svg_id) {

  /*

    this.element_copy -> armazena o elemento HTML sendo copiado 
    para o espaço de construção do diagrama.

    this.element_moved -> armazena o elemento HTML sendo arrastado 
    no espaço de construção do diagrama.

    this.n_new_element -> variavel que incrementa a cada novo 
    estado criado, usada para gerar os seus Ids.

    this.proxLabel -> define o nome do proximo estado a ser
    criado.

    this.dropDownMenuEl -> armazena o elemento HTML <g> do
    estado que está com o DropDownMenu aberto.

    this.svg -> armazena o elemento HTML do svg do espaço de 
    contrução do diagrama.

    this.n_transition -> numero do id da proxima transição.

    this.transitionInMove -> id da transição que esta em movimento.

    this.state_elements -> dicionário(objeto) que armazena os 
    Elementos(Estados).

    this.transitions_elements -> objeto que armazena as 
    informações de cada transição.

    this.el_marker_text -> armazena o elemento HTML <tspan>
    que está sendo alterado, sabendo que pode ser o valor
    da probabilidade, guarda ou label de uma transição.

    this.create_initial_state -> informa se um estado inicial 
    está sendo criado. (Deve ser removido)

    this.create_final_state -> informa se um estado final 
    está sendo criado. (Deve ser removido)

    this.initial_state -> armazena o elemento HTML <g> do estado 
    definido como o estado inicial.

    this.final_states -> objeto que armazena os elementos HTML <g> 
    do estados definidos como finais.

    this.timeAnimDropDown -> define o tempo em milissegundos de 
    cada iteração da animação do DropDownMenu.

    this.ModeAnimation -> define se está ou não no modo de 
    simulação.

    this.stopAnimSimulation -> define se deve ser interrompida a 
    animação do botão de Inicio/Fim da Simulação.

    this.currentStateSimulation -> armazena o elemento HTML <g> 
    do estado ultimo estado selecionado na simulação.

    this.traceSimulation -> armazena um array de arrays, em que 
    cada array possui O estado antigo e o estado atualmente usados 
    na simulação, assim como a transição entre eles.

    this.projects -> armazena os projetos abertos durante a 
    sessão.

  */

  this.element_copy = undefined;
  this.element_moved = undefined;
  this.n_new_element = 0;
  this.proxLabel = 0;

  /*this.dropDownMenuEl = undefined;*/
  this.currentEl = undefined;

  this.svg = document.getElementById(svg_id);

  this.n_transition = 0;
  this.transitionInMove = undefined;
  this.state_elements = {};

  this.transitions_elements = {};

  this.el_marker_text = undefined;

  /* (Deve ser removido) */
  this.create_initial_state = false;
  /* (Deve ser removido) */
  this.create_final_state = false;
  this.initial_state = undefined;
  this.final_states = {};

  this.timeAnimDropDown = 500;

  this.ModeAnimation = false;
  this.stopAnimSimulation = false;
  this.currentStateSimulation = undefined;
  this.traceSimulation = [];

  this.projects = [];

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