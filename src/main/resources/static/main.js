// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px');
    }
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

function printar () {
  document.getElementsByTagName("body")[0].style.cursor = "crosshair";
}

var clickButton = document.querySelector("#div-grad");

clickButton.addEventListener('click', coord_area_trabalho, false);

function coord_area_trabalho (e) {
  if (document.getElementsByTagName("body")[0].style.cursor == 'crosshair') {
    document.getElementsByTagName("body")[0].style.cursor = 'default';
    console.log(e.currentTarget.tagName);
    
    var div_espaco = document.getElementById("div-grad");
    var novo_elemento = document.createElement("i");

    div_espaco.appendChild(novo_elemento);
    novo_elemento.style.position = "absolute";
    novo_elemento.className = "far fa-square text-danger draggable resize-drag";
    novo_elemento.style.fontSize = "30px";

    novo_elemento.style.top = (e.clientY - getPosition(div_espaco).y - (novo_elemento.clientHeight / 2) ) + "px";
    novo_elemento.style.left = (e.clientX - getPosition(div_espaco).x - (novo_elemento.clientWidth / 2) ) + "px";
    var images_Drag = document.querySelectorAll(".draggable");
    for (var i = 0; i < images_Drag.length; i++){
      console.log(images_Drag[i])
      images_Drag[i].style.cursor = 'all-scroll';
    }
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

    if (el.tagName == "BODY") {
      
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}
