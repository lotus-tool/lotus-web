var CreateTransition = function (e, obj_state) {
	
	var element = obj_state.el;
  console.log(element);

	if ( info_manager.transitionInMove != undefined ){

    /*

      Verfica se o estado em que está sendo adicionada é um estado inicial, se 
      for, não ocorre a adição.

      Verifica se alguma estado está seguindo o mouse, se estiver, ele é 
      deletado do HTML.

      element -> <g> do objeto estado recebido como parâmetro para ser o estado 
      ao qual a transição será de entrada.

      O estado é adicionado como o estado destino da transição no objeto de 
      transições.

      info_element -> informações das coordenadas e dimensões do <g> do estado.

      A transição é adicionada ao array de transições de entrada do estado.

      path -> <g> da transição.

      elBase -> objeto do estado que possui esta transição com uma de suas de 
      saída.

      info_el_Base -> informações das coordenadas e dimensões do <g> do estado
      que possui esta transição com uma de suas de saída.

      coord -> Usa coordenadas polares com semelhança de triângulos para 
      calcular informações como a coordenada do ponto de dominio da curva 
      quadrática de Bézier que representa a transição, as coordenadas do 
      marcador (seta) da transição e o ângulo do ponto de dominio da curva em 
      relação ao eixo x.

      x1, y1 -> coordenadas do estado de onde a transição sai.

      x2, y2 -> coordenadas do estado onde a transição entra.

      x, y são as coordenadas do ponto de dominio da curva quadrática de Bézier.

      x_Marker e y_Marker representão as coordendas do marcador.

      teta -> representa o ângulo do ponto de dominio em relação ao eixo x. 

      d -> usado para montar o atributo "d" do path da transição, que irá montar 
      a curva quadrática de Bézier.

      ang -> definfição do angulo do marcador, usando o teta obtido da 
      semelhança de triângulos.

      marker -> <g> do marcador da transição.

      O evento FollowerTransition é removido.

      info_manager.transitionInMove é limpo.

    */

    if ( e.target.parentElement == info_manager.initial_state ){ return false; }

    if ( document.getElementById("followerEl") != undefined ){
    	info_manager.svg.removeChild(document.getElementById("followerEl"));
    }

    info_manager.element_copy = undefined;

    info_manager.transitions_elements[info_manager.transitionInMove].dstState = 
      element.parentElement.id;

    var info_element = element.getBoundingClientRect();

    obj_state.setInPutTransitions(info_manager.transitionInMove);

    var path = document.getElementById(info_manager.transitionInMove);

    var elBase = undefined;

    for (var key in info_manager.state_elements){
      if ( info_manager.state_elements[key].getOutPutTransitions().includes(
        info_manager.transitionInMove) ) { elBase = info_manager.state_elements[key]; break; }
    }

    var info_el_Base = elBase.el.getBoundingClientRect();

    var x1 = getPosition(elBase.el).x - getPosition(info_manager.svg).x + (info_el_Base.width / 2);
    var y1 = getPosition(elBase.el).y - getPosition(info_manager.svg).y + (info_el_Base.height / 2);
    var x2 = getPosition(element).x - getPosition(info_manager.svg).x + (info_element.width / 2);
    var y2 = getPosition(element).y - getPosition(info_manager.svg).y + (info_element.height / 2);

    if (x1 === x2 && y1 === y2){

      /* Mesmo elemento estado */

      x1 = x1 - (info_el_Base.width / 2) + Number( path.getAttribute("stroke-width") );
      x2 = x2 + (info_el_Base.width / 2) - Number( path.getAttribute("stroke-width") );

      x = (x1 + x2) / 2;
      y = (y1 - info_el_Base.height*2)

      var d = "M" + x1 + "," + y1 + " Q" + x + "," + y + " " + x2 + "," + y2;

      path.setAttribute("d", d);

      var ang = 0;

      var marker = document.getElementById("marker_" + info_manager.transitionInMove);
      marker.setAttribute("fill", "black");
      marker.setAttribute("transform", "translate(" + (x-5) + " " + ((y1 + y)/2 - 5) +") rotate (" + ang + ")");

      info_manager.svg.removeEventListener(
        "mousemove", FollowerTransition);

      info_manager.transitionInMove = undefined;

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

      var ang = calcAngMarker(teta, x1, x2, y1, y2);

      var marker = document.getElementById("marker_" + info_manager.transitionInMove);
      marker.setAttribute("transform", "translate(" + x_Marker + " " + y_Marker +") rotate (" + ang + ")");
      
      info_manager.svg.removeEventListener(
        "mousemove", FollowerTransition);

      info_manager.transitionInMove = undefined;

    }

    follow_textTransition(ang, marker);

  }else{

    /*

      Verfica se o estado em que está sendo adicionada é um estado final, se 
      for, não ocorre a adição.

      Cria um clone do estado que originou o evento, este que vai seguir o 
      mouse.

      element -> <g> do objeto estado recebido como parâmetro para ser o estado 
      ao qual a transição será de entrada.

      info_element -> informações das coordenadas e dimensões do <g> do estado.

      coord -> Usa coordenadas polares com semelhança de triângulos para 
      calcular informações como a coordenada do ponto de dominio da curva 
      quadrática de Bézier que representa a transição, as coordenadas do 
      marcador (seta) da transição e o ângulo do ponto de dominio da curva em 
      relação ao eixo x.

      x1, y1 -> coordenadas do estado de onde a transição sai.

      x2, y2 -> coordenadas do estado onde a transição entra, que ao ser 
      inicializado é mesmo de onde sai.

      x, y são as coordenadas do ponto de dominio da curva quadrática de Bézier.

      x_Marker e y_Marker representão as coordendas do marcador.

      teta -> representa o ângulo do ponto de dominio em relação ao eixo x. 

      id_conexao -> monta o id da nova transição.

      n_transition é atualizado.

      transitionInMove -> é definido como a transição recém criada.

      path -> <g> da transição recém criada.

      A transição é adicionada ao array de transições de saída do estado.

      d -> usado para montar o atributo "d" do path da transição, que irá montar 
      a curva quadrática de Bézier.

      ang -> definfição do angulo do marcador, usando o teta obtido da 
      semelhança de triângulos.

      marker -> <g> do marcador da transição.

      A transição é adicionada a lista de transições do projeto.

      O estado é definido como o estado de origem da transição.

      O texto informativo da transição é adicionado.

      O evento para que a transição siga o mouse é ativado.

      O evento de remoção da transição é ativado.

    */

    if ( info_manager.final_states[e.target.parentElement.id] != undefined ){ return false; }

    MountCloneEl(element);

    var info_element = element.getBoundingClientRect();

    var x1 = getPosition(element).x - getPosition(info_manager.svg).x + (info_element.width / 2);
    var y1 = getPosition(element).y - getPosition(info_manager.svg).y + (info_element.height / 2);
    var x2 = x1;
    var y2 = y1;

    var coord = calcPolarCoord(x1,y1,x2,y2);

    var x = coord.x;
    var y = coord.y;
    var x_Marker = coord.x_Marker;
    var y_Marker = coord.y_Marker;
    var teta = coord.teta;

    var id_conexao = "linha" + info_manager.n_transition;
    info_manager.n_transition++;

    info_manager.transitionInMove = id_conexao;

    obj_state.setOutPutTransitions(id_conexao);

    console.log(info_manager.svg);

    var path = document.createElementNS(
      'http://www.w3.org/2000/svg', 'path');
    info_manager.svg.insertBefore(path, document.getElementById("startLines"));
    path.setAttribute("id", id_conexao);
    
    var d = "M" + x1 + "," + y1 + " Q" + x + "," + y + " " + x2 + "," + y2;
    
    path.setAttribute("d", d);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "transparent");
    path.addEventListener("click", Properties, false);

    var ang = calcAngMarker(teta,x1,x2,y1,y2);

    var marker = document.getElementById("arrow").cloneNode(true);
    marker.setAttribute("id", "marker_" + id_conexao);
    marker.setAttribute("transform", "translate(" + x_Marker + " " + y_Marker +") rotate (" + ang + ")");
    marker.setAttribute("draggable", "true");
    info_manager.svg.insertBefore(marker, document.getElementById("startLines"));

    info_manager.transitions_elements[id_conexao] = 
        new TransitionElement( document.getElementById(id_conexao) );

    info_manager.transitions_elements[id_conexao].orgState = 
        element.parentElement.id;

    addTextTransition(id_conexao, element);

    info_manager.svg.addEventListener("mousemove", FollowerTransition, false);

  }

}

function FollowerTransition (e) {

  /*

    cloneState -> <circle, path, ...> da copia do estado que originou a 
    transição

    elBase -> Objeto do estado que possui a transição seguindo o mouse na sua 
    lista de transições de saída.

    info_el_Base -> Informações das coordenadas e dimensões do <g> do estado de 
    elBase.

    x1, y1 -> coordenadas do estado de onde a transição sai.

    x2, y2 -> coordenadas do mouse.

    coord -> Usa coordenadas polares com semelhança de triângulos para calcular 
    informações como a coordenada do ponto de dominio da curva quadrática de 
    Bézier que representa a transição, as coordenadas do marcador (seta) da 
    transição e o ângulo do ponto de dominio da curva em relação ao eixo x.

    x, y são as coordenadas do ponto de dominio da curva quadrática de Bézier.

    x_Marker e y_Marker representão as coordendas do marcador.

    teta -> representa o ângulo do ponto de dominio em relação ao eixo x.

    transition -> <g> da transição seguindo o mouse.

    d -> usado para montar o atributo "d" do path da transição, que irá montar 
    a curva quadrática de Bézier.

    ang -> definifição do angulo do marcador, usando o teta obtido da 
    semelhança de triângulos. 

    marker -> <g> do marcador.

    Texto da transição vai seguir o marcador da transição.

    infoCopyState -> Informações das coordenadas e dimensões do 
    <circle, path, ...> da copia do estado originador.

    xcs, ycs -> Coordenadas da cópia.

    O clone do estado originador da transição é transladado para as coordenadas 
    do mouse.

  */

  var elBase = undefined;

  var cloneState = document.getElementById("followerEl");
  cloneState.style.opacity = 1;

  for (var key in info_manager.state_elements){
    if ( info_manager.state_elements[key].getOutPutTransitions().includes(
      info_manager.transitionInMove) ) { elBase = info_manager.state_elements[key]; break; }
  }

  var info_el_Base = elBase.el.getBoundingClientRect();

  var x1 = getPosition(elBase.el).x - getPosition(info_manager.svg).x + (info_el_Base.width / 2);
  var y1 = getPosition(elBase.el).y - getPosition(info_manager.svg).y + (info_el_Base.height / 2);
  var x2 = e.clientX - getPosition(info_manager.svg).x;
  var y2 = e.clientY - getPosition(info_manager.svg).y;

  var coord = calcPolarCoord(x1,y1,x2,y2);

  var x = coord.x;
  var y = coord.y;
  var x_Marker = coord.x_Marker;
  var y_Marker = coord.y_Marker;
  var teta = coord.teta;

  var transition = document.getElementById(info_manager.transitionInMove);
  var d = transition.getAttribute("d");

  transition.style.pointerEvents = "none";

  d = "M" + x1 + "," + y1 + " Q" + x + "," + y + " " + x2 + "," + y2;
  transition.setAttribute("d", d);

  var ang = calcAngMarker(teta, x1, x2, y1, y2);

  var marker = document.getElementById("marker_" + info_manager.transitionInMove);
  marker.setAttribute("transform", "translate(" + x_Marker + " " + y_Marker +") rotate (" + ang + ")");
  marker.setAttribute("fill", "black");

  follow_textTransition(ang, marker);

  var infoCopyState = cloneState.getBoundingClientRect();

  var xcs = e.clientX - getPosition(info_manager.svg).x - (infoCopyState.width / 2);
  var ycs = e.clientY - getPosition(info_manager.svg).y - (infoCopyState.height / 2);

  cloneState.setAttribute("transform", "translate(" + xcs + " " + ycs + ")");

}

function MountCloneEl(element){

  /* Cria uma cópia do estado originador da transição. */

	var cloneState = element.cloneNode(false);
  cloneState.setAttribute("id", "followerEl");
  cloneState.setAttribute("stroke", "black");
  cloneState.setAttribute("style", "pointer-events: none; opacity: 0;");
  info_manager.element_copy = cloneState;
  info_manager.svg.appendChild(cloneState);

}

function releasePointerEventTransition(){
  /* Retorna os eventos da transição. */
  var transition = document.getElementById(info_manager.transitionInMove);
  transition.style.pointerEvents = "auto";
}

function UpdateLabelsSates () {
  
  var states = info_manager.state_elements;
  var label = 0;

  console.log(states);

  for ( var i in states ){

    if ( info_manager.final_states[i] == undefined ){
      states[i].el.parentElement.querySelector("text").textContent = label;
      label += 1;
    }

  }

  info_manager.proxLabel = label;

}