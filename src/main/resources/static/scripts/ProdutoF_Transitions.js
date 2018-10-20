var eventTransitions = function (e, obj_state_element) {

  var element = obj_state_element.el;

  /* 
    Se drag_transition do elemento informar 
    que ele está no modo de drag (valor 1), 
    então o evento é interrompido 
  */

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

      O evento followLine é removido 

      info_manager.transitionInMove é limpo

    */

    if ( e.target.parentElement == info_manager.initial_state ){ return false; }

    info_manager.transitions_elements[info_manager.transitionInMove].dstState = 
      element.parentElement.id;

    var info_element = element.getBoundingClientRect();

    obj_state_element.setInPutTransitions(info_manager.transitionInMove);

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

      console.log(y1);
      console.log(y);
      console.log((y1 + y)/2 - 8)

      var marker = document.getElementById("marker_" + info_manager.transitionInMove);
      marker.setAttribute("fill", "black");
      marker.setAttribute("transform", "translate(" + (x-5) + " " + ((y1 + y)/2 - 8) +") rotate (" + ang + ")");

      info_manager.svg.removeEventListener(
        "mousemove", followLine);

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
        "mousemove", followLine);

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

      A função followLine é chamada em um evento de 
      movimento do mouse

      Um Evento de click é adicionado a transição, para 
      que ela solte o elemento de entrada ao acionamento 
      do evento 
    */

    if ( info_manager.final_states[e.target.parentElement.id] != undefined ){ return false; }

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

    obj_state_element.setOutPutTransitions(id_conexao);

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

    addTextTransition(id_conexao, element);

    info_manager.svg.addEventListener("mousemove", followLine, false);
    path.addEventListener("click", eventLineDrop, false);

  }

}

function eventLineDrop(e){

  /*

    info_manager.transitionInMove é definido com o Id da 
    linha que foi solta 

    elBase -> armanzena o elemento que tem está transição 
    com um transição de entrada 

    remove a transição do conjunto de transições de entrada  
    do elemento base (elBase)

    Inicia o evento de "followLine"

  */

  info_manager.transitionInMove = e.target.id;

  var elBase = undefined;

  for (var key in info_manager.state_elements){
    if ( info_manager.state_elements[key].getInPutTransitions().includes(
      info_manager.transitionInMove) ) { elBase = info_manager.state_elements[key]; break; }
  }

  if ( elBase != undefined ){

    // console.log("elBase");

    elBase.removeValInputTransitions(info_manager.transitionInMove);
    info_manager.svg.addEventListener("mousemove", followLine, false);

  }else{

    // console.log("FOI");

    // console.log(info_manager.transitionInMove);

    remove_Transition(info_manager.transitionInMove);

    info_manager.svg.removeEventListener("mousemove", followLine);

    info_manager.transitionInMove = undefined;

  }

}

function followLine (e) {

  console.log("followLine");

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

  d = "M" + x1 + "," + y1 + " Q" + x + "," + y + " " + x2 + "," + y2;
  transition.setAttribute("d", d);

  var ang = calcAngMarker(teta, x1, x2, y1, y2);

  var marker = document.getElementById("marker_" + info_manager.transitionInMove);
  marker.setAttribute("transform", "translate(" + x_Marker + " " + y_Marker +") rotate (" + ang + ")");
  marker.setAttribute("fill", "black");

  follow_textTransition(ang, marker);

}

function calcAngMarker(teta, x1, x2, y1, y2){

  // Calcula a orientação do marcador
  /* A orientação de teta é relacionada
    ao ângulo entre a reta que que sai
    do ponto médio dos pontos de extremidade
    em relação ao eixo x, sendo assim,
    necessário um ajuste de 90 ou 270 graus.*/

  x1 = Number(x1);
  y1 = Number(y1);
  x2 = Number(x2);
  y2 = Number(y2);

  if (y1 < y2 && x1 != x2) {
    return 90-(teta*180)/Math.PI; 
  }else if(y1 > y2 && x1 != x2){
    return 270-(teta*180)/Math.PI;
  }

  if (y1 === y2 && x1 < x2){
    return 0;
  }else if(y1 === y2 && x1 > x2){
    return 180;
  }

  if (x1 === x2 && y1 < y2) {
    return 90;
  }else if(x1 === x2 && y1 > y2){
    return 270;
  }

}

function calcPolarCoord(x1, y1, x2, y2){

  x1 = Number(x1);
  y1 = Number(y1);
  x2 = Number(x2);
  y2 = Number(y2);

  // Distância entre os pontos no eixo X 
  var Dx = x2 - x1;
  // Distância entre os pontos no eixo Y
  var Dy = y2 - y1;

  //console.log('Dx:' + Dx);
  //console.log('Dy:' + Dy);

  // teta é o ângulo em radianos 

  if ( x1 === x2 ){
    var teta = 0;
  }else if ( y1 === y2 ) {
    var teta = Math.PI/2;
  }else{
    var teta = Math.atan(Dx/Dy);
  }

  //console.log('Teta (ângulo):' + teta);

  // console.log((x2 + x1));
  // console.log(y1);

  // Coordenadas do ponto (x,y) entre os outros pontos
  var Xm = (x2 + x1) / 2;
  var Ym = (y2 + y1) / 2;

  // console.log('Xm ( Ponto Médio ):' + Xm);
  // console.log('Ym ( Ponto Médio ):' + Ym);

  /* r é a altura da curva que será a metade
    de 25% da distancias entres os pontos
    (12.5% da distância) */
  var r = Math.sqrt( Math.pow(Dx, 2) + Math.pow(Dy, 2) ) * 0.25;   
  //console.log('Raio (altura):' + r);

  // console.log(r*Math.cos(teta));

  /* Calculo do ponto de elevação da transição
    usando coordenadas polares*/
  // x = r*cos(a)
  // y = r*sin(a)
  /* Como em geral, o ponto medio dos pontos das
    extremidades da transição não vai estar no
    (x,y) = (0,0), então suas coordenadas são
    somadas as obtidas anteriormente */
  // x = Xm +/- r*cos(a)
  // y = Ym +/- r*sin(a)
  /* +/- depende da localização dos pontos de extremidade */

  var marker_size = 16;

  if (x1 < x2 && y1 > y2){
    var x = Math.round(Xm - r*Math.cos(teta));
    var y = Math.round(Ym + r*Math.sin(teta));
    var x_Marker = Math.round(Xm - ((r+marker_size)/2)*Math.cos(teta));
    var y_Marker = Math.round(Ym + ((r+marker_size)/2)*Math.sin(teta));
  }
  else if (x1 < x2 && y1 <= y2){
    var x = Math.round(Xm + r*Math.cos(teta));
    var y = Math.round(Ym - r*Math.sin(teta));
    var x_Marker = Math.round(Xm + ((r+marker_size)/2)*Math.cos(teta));
    var y_Marker = Math.round(Ym - ((r+marker_size)/2)*Math.sin(teta));
  }
  else if (x1 > x2 && y1 < y2){
    var x = Math.round(Xm - (-r)*Math.cos(teta));
    var y = Math.round(Ym + (-r)*Math.sin(teta));
    var x_Marker = Math.round(Xm - (((-r)-marker_size)/2)*Math.cos(teta));
    var y_Marker = Math.round(Ym + (((-r)-marker_size)/2)*Math.sin(teta));
  }
  else if (x1 > x2 && y1 >= y2){
    var x = Math.round(Xm + (-r)*Math.cos(teta));
    var y = Math.round(Ym - (-r)*Math.sin(teta));
    var x_Marker = Math.round(Xm + (((-r)-marker_size)/2)*Math.cos(teta));
    var y_Marker = Math.round(Ym - (((-r)-marker_size)/2)*Math.sin(teta));
  }else{  
    if (y1 < y2){
      var x = Math.round(Xm + r*Math.cos(teta));
      var y = Math.round(Ym - r*Math.sin(teta));
      var x_Marker = Math.round(Xm + ((r+marker_size)/2)*Math.cos(teta));
      var y_Marker = Math.round(Ym - ((r+marker_size)/2)*Math.sin(teta));
    }else{
      var x = Math.round(Xm + (-r)*Math.cos(teta));
      var y = Math.round(Ym - (-r)*Math.sin(teta));
      var x_Marker = Math.round(Xm + (((-r)-marker_size)/2)*Math.cos(teta));
      var y_Marker = Math.round(Ym - (((-r)-marker_size)/2)*Math.sin(teta));
    }
  }

  // retorna um dicionário(objeto) com os valores obtidos
  return { "x" : x , "y" : y , "Xm" : Xm, "Ym" : Ym, "teta" : teta, "x_Marker" : x_Marker, "y_Marker" : y_Marker };

}

function get_xy_marker(marker){

  /*

    Obtem as coordenadas no svg, do marcador

    transform_marker -> atributo "transform" do 
    marcador

    retorna o dicionário com estas informações

  */

  var transform_marker = marker.getAttribute("transform");

  var xy_marker = transform_marker.slice(
    transform_marker.indexOf("(") + 1, transform_marker.indexOf(")") );

  var marker_info = { "x" : (xy_marker.slice( 0, xy_marker.indexOf(" ") ) ),
                      "y" : (xy_marker.slice( xy_marker.indexOf(" ") + 1 ) ),
                      "transform" : transform_marker };

  return marker_info;
  
}

function get_xy_transition(){

  /*

    Obtem as coordenadas no svg, da transição

    d_transition -> atributo "d" da transição

    retorna o dicionário com estas informações

  */

  var d_transition = document.getElementById(info_manager.transitionInMove).getAttribute("d");

  var xy_transition = d_transition.slice( 
    d_transition.indexOf("Q") + 1 , d_transition.lastIndexOf(" ") );

  var transition_info = { "x" : Number( xy_transition.slice( 0, xy_transition.indexOf(",") ) ),
                          "y" : Number( xy_transition.slice( xy_transition.indexOf(",") + 1 ) ),
                          "d" : d_transition};

  return transition_info;

}

function make_transform_marker(transform, x, y){

  /*

    result -> monta o atributo "transform" usando 
    o x e o y que recebe, junto ao antigo "transform"

    Retorna result

  */

  var result = transform.slice( 0 , transform.indexOf("(") + 1 ) + 
                x + " " + y +
                transform.slice( transform.indexOf(")") );

  return result;

}

function make_d_transition (d_transition, x, y, x_marker, y_marker, x_mouse, y_mouse) {

  /*

    x e y -> coordenadas do ponto de dominio 
    da curva da transição

    x_mouse e y_mouse -> coordenadas do ponteiro 
    do mouse

    x_marker e y_marker -> coordenadas do 
    marcador da transição

    result -> monta o atributo "d" usando 
    o x, y, x_mouse, y_mouse, x_marker e y_marker 
    que recebe, junto ao antigo "d"

    O result é baseado no fato de que movimento 
    do ponto de dominio é duas vezes maior que 
    o movimento do marcador

    Retorna result

  */

  x = x + (x_mouse - x_marker) * 2;
  y = y + (y_mouse - y_marker) * 2;
  
  var result = d_transition.slice( 0 , d_transition.indexOf("Q") + 1 ) + 
                x + "," + y + 
                d_transition.slice( d_transition.lastIndexOf(" ") )

  return result;

}

function f_marker_follow_mouse_move (e) {

  /*

    transition -> Armazena o elemento HTML 
    da transição

    marker -> Armazena o elemento HTML 
    do marcador 

    marker_info ->  Armazena informações do 
    elemento HTML da transição

    transition_info -> Armazena informações 
    do elemento HTML do marcador

    Altera o atributo "transform" do marcador
    para a posição atual do mouse 

    Altera o atributo "d" da transition para 
    a posição atual do mouse

  */

  e.preventDefault();

  var transition = document.getElementById(info_manager.transitionInMove)

  var marker = document.getElementById("marker_" + info_manager.transitionInMove);

  var marker_info = get_xy_marker(marker);

  var transition_info = get_xy_transition();

  var x_mouse = e.clientX - getPosition(info_manager.svg).x;
  var y_mouse = e.clientY - getPosition(info_manager.svg).y;

  console.log(x_mouse);
  console.log(y_mouse);

  marker.setAttribute("transform", 
    make_transform_marker(marker_info.transform, x_mouse, y_mouse));

  transition.setAttribute("d", make_d_transition( 
    transition_info.d, transition_info.x, transition_info.y, 
    marker_info.x, marker_info.y, x_mouse, y_mouse) );

}

function f_marker_follow (element) {

  /*

    Defini "lineInMove" como o Id da 
    transição sendo movimentada

    Inicia o evento de Drag do marcador 
    e da transição

  */

  function drop(e){

    /*

      Defini "lineInMove" como indefinido

      Finaliza o evento de Drag do marcador 
      e da transição

    */

    e.preventDefault();
    info_manager.transitionInMove = undefined;

    info_manager.svg.removeEventListener("mousemove", f_marker_follow_mouse_move);
    info_manager.svg.removeEventListener("mouseup", drop);

  }

  // info_manager.transitionInMove = element.id.slice(element.id.indexOf("l"));
  info_manager.transitionInMove = element.parentNode.parentNode.id.slice(element.parentNode.parentNode.id.indexOf("l"));
  console.log(info_manager.transitionInMove);

  info_manager.svg.addEventListener("mousemove", f_marker_follow_mouse_move, false);
  
  info_manager.svg.addEventListener("mouseup", drop, false);

}

function followElement (ev, element_id) {

  /*

    transition -> elemento HTML das transições do 
    elemento em arrasto 
    
    d -> usado para montar o atributo "d" do path da 
    transição, que irá montar a curva quadrática de 
    Bézier 

    element -> elemento HTML do elemento eme arrasto 

    info_el -> elementos HTML que possuem as transições 
    do elemento em arrasto como entrada e como saída 

    info_el_Base -> armazena informações de coordenadas e 
    dimensionalidade do elemento Base (elBase) 

    x1, y1, x2, y2 -> coordenadas do elemento de onde a transição 
    sai/entra 

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

    ang -> definfição do angulo do marcador, usando o 
    teta obtido da semelhança de triângulos 

  */

  var transition = undefined;
  var d = undefined;
  var element = info_manager.state_elements[element_id].el;

  for (var i = 0; i < info_manager.state_elements[element_id].getOutPutTransitions().length; i++){

    transition = document.getElementById(info_manager.state_elements[element_id].getOutPutTransitions()[i]);
    d = transition.getAttribute("d");

    var elBase = undefined;

    for (var key in info_manager.state_elements){
      if ( info_manager.state_elements[key].getInPutTransitions().includes(
        transition.id) ) { elBase = info_manager.state_elements[key]; break; }
    }

    var info_el = element.getBoundingClientRect();
    var info_el_Base = elBase.el.getBoundingClientRect();

    var x1 = getPosition(element).x - getPosition(info_manager.svg).x + (info_el.width / 2);
    var y1 = getPosition(element).y - getPosition(info_manager.svg).y + (info_el.height / 2);
    var x2 = getPosition(elBase.el).x - getPosition(info_manager.svg).x + (info_el_Base.width / 2);
    var y2 = getPosition(elBase.el).y - getPosition(info_manager.svg).y + (info_el_Base.height / 2);
    
    var coord = calcPolarCoord(x1,y1,x2,y2);

    var x = coord.x;
    var y = coord.y;
    var x_Marker = coord.x_Marker;
    var y_Marker = coord.y_Marker;
    var teta = coord.teta;

    d = "M" + x1 + "," + y1 + " Q" + x + "," + y + d.slice( d.lastIndexOf(" ") );

    transition.setAttribute("d", d);

    var ang = calcAngMarker(teta, x1, x2, y1, y2);

    var marker = document.getElementById("marker_" + transition.id);
    marker.setAttribute("transform", "translate(" + x_Marker + " " + y_Marker +") rotate (" + ang + ")");
    marker.setAttribute("fill", "black");

    follow_textTransition(ang, marker);

  }

  for (var i = 0; i < info_manager.state_elements[element_id].getInPutTransitions().length; i++){

    transition = document.getElementById(info_manager.state_elements[element_id].getInPutTransitions()[i]);
    d = transition.getAttribute("d");

    var elBase = undefined;

    for (var key in info_manager.state_elements){
      if ( info_manager.state_elements[key].getOutPutTransitions().includes(
        transition.id) ) { elBase = info_manager.state_elements[key]; break; }
    }

    var info_el = element.getBoundingClientRect();
    var info_el_Base = elBase.el.getBoundingClientRect();

    var x1 = getPosition(elBase.el).x - getPosition(info_manager.svg).x + (info_el_Base.width / 2);
    var y1 = getPosition(elBase.el).y - getPosition(info_manager.svg).y + (info_el_Base.height / 2);
    var x2 = getPosition(element).x - getPosition(info_manager.svg).x + (info_el.width / 2);
    var y2 = getPosition(element).y - getPosition(info_manager.svg).y + (info_el.height / 2);
    
    var coord = calcPolarCoord(x1,y1,x2,y2);

    var x = coord.x;
    var y = coord.y;
    var x_Marker = coord.x_Marker;
    var y_Marker = coord.y_Marker;
    var teta = coord.teta;

    d = d.slice(0,d.lastIndexOf("Q")+1) + x + "," + y + " " + x2 + "," + y2;

    transition.setAttribute("d", d);

    var ang = calcAngMarker(teta, x1, x2, y1, y2);

    var marker = document.getElementById("marker_" + transition.id);
    marker.setAttribute("transform", "translate(" + x_Marker + " " + y_Marker +") rotate (" + ang + ")");
    marker.setAttribute("fill", "black");

    follow_textTransition(ang, marker);

  }

}

function remove_Transition (id_transition) {

  var state_out = undefined;
  var state_in = undefined;

  for( var key in info_manager.state_elements ){

    if( info_manager.state_elements[key].includeOutPutTransition(id_transition) ){
      
      state_out = info_manager.state_elements[key];

      if( state_in != undefined ){ break; }

    }

    if( info_manager.state_elements[key].includeInPutTransition(id_transition) ){
     
      state_in = info_manager.state_elements[key];

      if( state_out != undefined ){ break; }

    }

  }

  console.log(state_out);
  console.log(state_in);

  (state_out != undefined) ? state_out.removeValOutputTransitions(id_transition) : null;
  (state_in != undefined) ? state_in.removeValInputTransitions(id_transition) : null;
  delete info_manager.transitions_elements[id_transition];

  info_manager.svg.removeChild(document.getElementById(id_transition));
  info_manager.svg.removeChild(document.getElementById("marker_" + id_transition));

}