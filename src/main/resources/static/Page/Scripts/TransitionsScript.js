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

  var marker_size = 12;

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

    transform_marker -> atributo "transform" do marcador.

    xy_marker -> obtem o quanto foi a descolamento do marcador em para x e y.

    marker_info -> dicionario com as coordenadas e o "transform" do marcador.

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

    d_transition -> Captura o "d" da transição.

    xy_transition -> Obtem o x e o y de "d" da transição.

    transition_info -> Dicionário com x, y e "d" da transição.

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

    result -> Novo "transform" do marcador, gerado de forma a mantê-lo nas 
    coordenadas do mouse.

  */

  var result = transform.slice( 0 , transform.indexOf("(") + 1 ) + 
                x + " " + y +
                transform.slice( transform.indexOf(")") );

  return result;

}

function make_d_transition (d_transition, x, y, x_marker, y_marker, x_mouse, y_mouse) {

  /*

    x e y -> coordenadas do ponto de dominio da curva da transição

    x e y são calculados a partir das coordenadas originais do ponto de dominio 
    da transição adicionado do deslocamentos que o marcador realizou até as 
    coordenadas do mouse, sendo que o deslocamento do ponto de dominio deve ser 
    2 vezes maior.

    x_mouse e y_mouse -> coordenadas do ponteiro do mouse.

    x_marker e y_marker -> coordenadas do marcador da transição.

    result -> novo valor do "d" da transição.

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

    transition -> Captura o <g> da transição pertencente ao marcador 
    selecionado.

    marker -> Captura o <g> do marcador selecionado.

    marker_info ->  x, y e "transform" do marcador.

    transition_info -> x, y e "d" da transição.

    x_mouse, y_mouse -> coordenadas do mouse no espaço do SVG.

    É gerado o novo "transform" do marcador.

    É gerado o novo "d" da transição.

  */

  e.preventDefault();

  var transition = document.getElementById(info_manager.transitionInMove)

  var marker = document.getElementById("marker_" + info_manager.transitionInMove);

  var marker_info = get_xy_marker(marker);

  var transition_info = get_xy_transition();

  var x_mouse = e.clientX - getPosition(info_manager.svg).x;
  var y_mouse = e.clientY - getPosition(info_manager.svg).y;

  marker.setAttribute("transform", 
    make_transform_marker(marker_info.transform, x_mouse, y_mouse));

  transition.setAttribute("d", make_d_transition( 
    transition_info.d, transition_info.x, transition_info.y, 
    marker_info.x, marker_info.y, x_mouse, y_mouse) );

}

function f_marker_follow (element) {

  /*

    Função ativada ao evento de "mousedown" no marcador de uma transição.

    transitionInMove -> id do elemento <g> em que o marcador está.

    Adicionado o evento "mousemove" para que o marcador siga o mouse.

    Adicionado o evento "mouseup" para que o o marcado pare de seguir o mouse 
    quando o botão do mesmo (esquerdo ou direito) for liberado.

  */

  function drop(e){

    /*

      Evento de finalição de drag do marcador.

    */

    e.preventDefault();
    info_manager.transitionInMove = undefined;

    info_manager.svg.removeEventListener("mousemove", 
      f_marker_follow_mouse_move);
    info_manager.svg.removeEventListener("mouseup", drop);

  }

  info_manager.transitionInMove = element.parentNode.parentNode.id.slice(
    element.parentNode.parentNode.id.indexOf("l"));

  info_manager.svg.addEventListener("mousemove", 
    f_marker_follow_mouse_move, false);
  info_manager.svg.addEventListener("mouseup", drop, false);

}

function followElement (ev, element_id) {

  /*

    element -> Obtem o <g> do estado a ser movimentado.

    Todas as transições de saída e de entrada do estado são visitadas.

    transition -> transição atualmente sendo visitada.

    d -> "d" da transição corrente.

    elBase -> objeto do estado que encontra-se na outra ponta da transição 
    corrente.

    info_el -> informações sobre tamanho e coordenada do <g> de estado 
    movimentado.

    info_el_Base -> informações sobre tamanho e coordenada do <g> de estado 
    na outra ponta da transição corrente.

    x1 -> centro do estado movimento no eixo x.

    y1 -> centro do estado movimento no eixo y.

    x2 -> centro do estado da outra ponta da transição no eixo x.

    y2 -> centro do estado da outra ponta da transição no eixo y.

    coord -> retornas informações sobre o ponto de dominio da transição 
    ( curva quadrática de Bezier ).

    x, y -> coordenadas do ponto de dominio da transição.

    x_Marker, y_Marker -> coordenadas do marcador.

    teta -> angulo da transição.

    ang -> angulo do marcador.

    marker -> marcador da transição.

    "d" da transição é redefino para os novos valores do pós movimento do 
    estado.

    O texto da transição tem suas coordenadas atualizadas de acordo com

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

  /*

    state_out -> Objeto do estado que possui esta transição como uma de suas 
    transições de saída.

    state_in -> Objeto do estado que possui esta transição como uma de suas 
    transições de entrada.

    Todos os estados elementos são visitados até que encontre os estados da 
    transição a ser removida, ou até acabarem os estados.

    Os estados ligados a esta transição tem ela removida de suas listas de 
    transições.

    A transição é removida da lista de todas as transições do projeto.

    O <g> da transição e o do seu marcador são removidos do HTML.

  */

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

  (state_out != undefined) ? state_out.removeValOutputTransitions(id_transition) : null;
  (state_in != undefined) ? state_in.removeValInputTransitions(id_transition) : null;
  delete info_manager.transitions_elements[id_transition];

  info_manager.svg.removeChild(document.getElementById(id_transition));
  info_manager.svg.removeChild(document.getElementById("marker_" + id_transition));

}

function Properties (ev) {
  
  var transition = ev.target;
  var objTransition = info_manager.transitions_elements[transition.id];

  var label = objTransition.info_transition["label"];
  var prob = objTransition.info_transition["probability"];
  var guard = objTransition.info_transition["guard"];

  ChangeShowInfoTransition(prob, guard, label);

}