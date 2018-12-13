/* Evento de ativação de drag do RealWorkStation */
document.getElementById("RealWorkStation").addEventListener("mousedown", StartMove, false);

/* Variaveis de acesso entre os eventos */
var origin_x;
var origin_y;
var moved_x;
var moved_y;

function StartMove (ev) {

  if (ev.target.id === info_manager.svg.id){

    console.log("StartMove");
    console.log(ev.target);

  	var parentEl = document.getElementById("WorkStation");
  	var childEl = document.getElementById("RealWorkStation");

    /* Coordenadas originais da "DIV RealWorkStation" */
  	origin_x = ev.clientX - getPosition(childEl.parentElement).x;
  	origin_y = ev.clientY - getPosition(childEl.parentElement).y;

  	var infoParent = parentEl.getBoundingClientRect();
  	var infoChild = childEl.getBoundingClientRect();

  	moved_x = (infoChild.width - infoParent.width)/2 - (infoParent.x - infoChild.x);
  	moved_y = (infoChild.height - infoParent.height)/2 - (infoParent.y - infoChild.y);

  	childEl.parentElement.addEventListener("mousemove", ActionMove, false);
  	childEl.parentElement.addEventListener("mouseup", StopMove, false);
    childEl.parentElement.addEventListener("mouseleave", StopMove, false);

  }

}

function ActionMove (ev) {

	/*console.log("MOVE");*/

	ev.preventDefault();

	var parentEl = document.getElementById("WorkStation");
	var childEl = document.getElementById("RealWorkStation");

	var x = (ev.clientX - getPosition(parentEl).x) - origin_x;
	var y = (ev.clientY - getPosition(parentEl).y) - origin_y;

	/*console.log("x: ", x);
	console.log("y: ", y);*/

	var movement_x = moved_x + x;
	var movement_y = moved_y + y;

  var infoParent = parentEl.getBoundingClientRect();
  var infoChild = childEl.getBoundingClientRect();

	childEl.style.transform = "translate("+movement_x+"px,"+movement_y+"px)";

}

function StopMove (ev) {

  RealWorkStationLocal(ev);

	var parentEl = document.getElementById("WorkStation");
	
	parentEl.removeEventListener("mousemove", ActionMove);
	parentEl.removeEventListener("mouseup", StopMove);
  parentEl.removeEventListener("mouseleave", StopMove);

}

function RealWorkStationLocal (ev) {

  ev.preventDefault();
  
  var parentEl = document.getElementById("WorkStation");
  var childEl = document.getElementById("RealWorkStation");
  var infoParent = parentEl.getBoundingClientRect();
  var infoChild = childEl.getBoundingClientRect();

  var x = (ev.clientX - getPosition(parentEl).x) - origin_x;
  var y = (ev.clientY - getPosition(parentEl).y) - origin_y;

  var movement_x = moved_x + x;
  var movement_y = moved_y + y;

  var top = infoChild.top - infoParent.top;
  var bottom = infoChild.bottom - infoParent.bottom;
  var right = infoChild.right - infoParent.right;
  var left = infoChild.left - infoParent.left;

  if (top > 0){
    ReturnRealWorkStationLocal(parentEl, childEl, movement_x, movement_y, 0);
    movement_y = ((infoChild.height - infoParent.height)/2);
  }if (bottom < 0){
    ReturnRealWorkStationLocal(parentEl, childEl, movement_x, movement_y, 1);
    movement_y = (-(infoChild.height - infoParent.height)/2);
  }if (right < 0){
    ReturnRealWorkStationLocal(parentEl, childEl, movement_x, movement_y, 2);
    movement_x = (-(infoChild.width - infoParent.width)/2);
  }if (left > 0){
    ReturnRealWorkStationLocal(parentEl, childEl, movement_x, movement_y, 3);
    movement_x = ((infoChild.width - infoParent.width)/2);
  }

}

function ReturnRealWorkStationLocal (parentEl, childEl, movement_x, movement_y, direction) {

  var infoParent = parentEl.getBoundingClientRect();
  var infoChild = childEl.getBoundingClientRect();

  // 0 - top
  // 1 - bottom
  // 2 - right
  // 3 - left

  if (direction === 0){
    childEl.style.transform = "translate("+
      movement_x+"px,"+((infoChild.height - infoParent.height)/2)+"px)";
  }else if (direction === 1){
    childEl.style.transform = "translate("+
      movement_x+"px,"+(-(infoChild.height - infoParent.height)/2)+"px)";
  }else if (direction === 2){
    childEl.style.transform = "translate("+
      (-(infoChild.width - infoParent.width)/2)+"px,"+movement_y+"px)";
  }else if (direction === 3){
    childEl.style.transform = "translate("+
      ((infoChild.width - infoParent.width)/2)+"px,"+movement_y+"px)";
  }

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