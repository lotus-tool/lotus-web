function eventLineDrop(e){

  /*

    info_manager.transitionInMove -> é definido com o ID da transição que foi 
    solta.

    elBase -> recebe, se existir, o objeto do estado que tem essa transição que 
    chamou a função, como sendo umas de suas transições de entrada.

    Se existir um estado com esta transição com sendo uma transição de entrada, 
    o objeto deste estado remove a transição da sua lista de transições de 
    entrada e adiciona o evento "mousemove" ao <svg> do espaço de trabalho para 
    que a transição siga o mouse.

    Caso contrário, a transição é removida do espaço de trabalho, o evento de 
    seguir o mouse é encerrado e info_manager.transitionInMove é limpo.

  */

  info_manager.transitionInMove = e.target.id;

  var elBase = undefined;

  for (var key in info_manager.state_elements){
    if ( info_manager.state_elements[key].getInPutTransitions().includes(
      info_manager.transitionInMove) ) { elBase = info_manager.state_elements[key]; break; }
  }

  if ( elBase != undefined ){

    elBase.removeValInputTransitions(info_manager.transitionInMove);
    info_manager.svg.addEventListener("mousemove", FollowerTransition, false);

  }else{

    remove_Transition(info_manager.transitionInMove);

    info_manager.svg.removeEventListener("mousemove", FollowerTransition);

    info_manager.transitionInMove = undefined;

  }

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