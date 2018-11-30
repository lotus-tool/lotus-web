var CreateTransition = function (e, obj_state) {
	
	var element = obj_state.el;

	if ( info_manager.transitionInMove != undefined ){

    /*
      element -> elemento(estado) do evento de
      criação da transição

      info_element -> possui informações como coordenadas 
      e dimensões do elemento(estado) que chamou o evento

      A transição é adicionada ao array de transições de 
      entrada do elemento

      path -> armazena o elemento HTML da transição 

      elBase -> armazena o elemento que tem está transição 
      com um transição de saída 

      info_el_Base -> armazena informações de coordenadas e 
      dimensionalidade do elemento Base (elBase)

      coord -> Usa coordenadas polares com semelhança de 
      triângulos para calcular informações como a 
      coordenada do ponto de dominio da curva quadrática 
      de Bézier que representa a transição, as coordenadas 
      do marcador (seta) da transição e o ângulo do ponto 
      de dominio da curva em relação ao eixo x 

      x1, y1 -> coordenadas do elemento de onde a transição 
      sai

      x2, y2 -> coordenadas do elemento onde a transição 
      entra

      x, y são as coordenadas do ponto de dominio da curva 
      quadrática de Bézier 

      x_Marker e y_Marker representão as coordendas do 
      marcador 

      teta -> representa o ângulo do ponto de dominio em 
      relação ao eixo x 

      d -> usado para montar o atributo "d" do path da 
      transição, que irá montar a curva quadrática de 
      Bézier 

      ang -> definfição do angulo do marcador, usando o 
      teta obtido da semelhança de triângulos 

      marker -> armazena o elemento HTML que é o 
      marcador da transição

      O evento FollowerTransition é removido 

      info_manager.transitionInMove é limpo

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
      path.addEventListener("click", eventLineDrop, false);

      var ang = 0;

      /*console.log(y1);
      console.log(y);
      console.log((y1 + y)/2 - 8)*/

      var marker = document.getElementById("marker_" + info_manager.transitionInMove);
      marker.setAttribute("fill", "black");
      marker.setAttribute("transform", "translate(" + (x-5) + " " + ((y1 + y)/2 - 8) +") rotate (" + ang + ")");

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
      element -> elemento(estado) do evento de
      criação da transição 

      info_element -> possui informação como coordenadas 
      e dimensões do elemento(estado).

      x1, x2, y1, y2 são valores de inicialização da 
      transição, representando as coordenadas do elemento 
      de entrada e saída da transição 

      coord -> Usa coordenadas polares com semelhança de 
      triângulos para calcular informações como a 
      coordenada do ponto de dominio da curva quadrática 
      de Bézier que representa a transição, as coordenadas 
      do marcador (seta) da transição e o ângulo do ponto 
      de dominio da curva em relação ao eixo x 

      x, y são as coordenadas do ponto de dominio da curva 
      quadrática de Bézier 

      x_Marker e y_Marker representão as coordendas do 
      marcador 

      teta -> representa o ângulo do ponto de dominio em 
      relação ao eixo x 

      id_conexao -> cria um novo Id para cada nova linha 
      usando info_manager.n_transition 

      info_manager.transitionInMove -> armazena o Id da 
      transição em movimento 

      O elemento estado adiciona o Id da nova transição 
      a seu array de transições de saída 

      path -> armazena o elemento HTML que é criado para 
      ser a transição 

      Todas a linhas são criadas após o elemento HTML com 
      o Id "startLines", com a finalidade de garantir que 
      estarão atrás de todos o elementos 

      d -> usado para montar o atributo "d" do path da 
      transição, que irá montar a curva quadrática de 
      Bézier 

      ang -> definfição do angulo do marcador, usando o 
      teta obtido da semelhança de triângulos 

      marker -> armazena o elemento clonado que será o 
      marcador da transição recém criada 

      A função FollowerTransition é chamada em um evento de 
      movimento do mouse

      Um Evento de click é adicionado a transição, para 
      que ela solte o elemento de entrada ao acionamento 
      do evento 
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

    var path = document.createElementNS(
      'http://www.w3.org/2000/svg', 'path');
    info_manager.svg.insertBefore(path, document.getElementById("startLines"));
    path.setAttribute("id", id_conexao);
    
    var d = "M" + x1 + "," + y1 + " Q" + x + "," + y + " " + x2 + "," + y2;
    
    path.setAttribute("d", d);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "transparent");

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
    path.addEventListener("click", eventLineDrop, false);

  }

}

function FollowerTransition (e) {

  /*console.log("FOLLOWING MOUSE");*/

  /*

    elBase -> armanzena o elemento que tem está transição 
    com um transição de saída

    info_el_Base -> armazena informações de coordenadas e 
    dimensionalidade do elemento Base (elBase) 

    x1, y1 -> coordenadas do elemento de onde a transição 
    sai 

    x2, y2 -> coordenadas do mouse 

    coord -> Usa coordenadas polares com semelhança de 
    triângulos para calcular informações como a 
    coordenada do ponto de dominio da curva quadrática 
    de Bézier que representa a transição, as coordenadas 
    do marcador (seta) da transição e o ângulo do ponto 
    de dominio da curva em relação ao eixo x 

    x, y são as coordenadas do ponto de dominio da curva 
    quadrática de Bézier 

    x_Marker e y_Marker representão as coordendas do 
    marcador 

    teta -> representa o ângulo do ponto de dominio em 
    relação ao eixo x 

    transition -> armazena o elemento HTML que representa a 
    transição 

    d -> usado para montar o atributo "d" do path da 
    transição, que irá montar a curva quadrática de 
    Bézier 

    ang -> definfição do angulo do marcador, usando o 
    teta obtido da semelhança de triângulos 

    marker -> armazena o elemento HTML do marcador 

    O fim da transição segue o mouse, assim como seu 
    marcador tem suas coordenadas e angulação alteradas 

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
  /*console.log(transition);*/

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

	var cloneState = element.cloneNode(false);
    cloneState.setAttribute("id", "followerEl");
    cloneState.setAttribute("style", "pointer-events: none; opacity: 0;");
    info_manager.element_copy = cloneState;
    info_manager.svg.appendChild(cloneState);

}

function releasePointerEventTransition(){
  var transition = document.getElementById(info_manager.transitionInMove);
  transition.style.pointerEvents = "auto";
}