// numero do id da proxima linha
var NLinhas = 0;
// id da linha que esta em movimento
var lineInMove = undefined;

var Circle = function ( element ) {

    this.el = element;
    this.input_lines = [];
    this.output_lines = [];

    this.setOutPutLines = function(val)
    { this.output_lines.push(val); };

    this.getOutPutLines = function()
    { return this.output_lines; };

    this.setInPutLines = function(val)
    { this.input_lines.push(val); };

    this.getInPutLines = function()
    { return this.input_lines; };

    this.removeValInputLines = function removeValInputLines (val){
        this.input_lines.splice( this.input_lines.indexOf(val), 1 );
    }

}

var circles = {};

circles["circle1"] = new Circle( document.getElementById("circle1") );
circles["circle2"] = new Circle( document.getElementById("circle2") );
circles["circle3"] = new Circle( document.getElementById("circle3") );

circles["circle1"].el.addEventListener("click", function(e) { eventCircle(e, circles["circle1"]); }, false);
circles["circle2"].el.addEventListener("click", function(e) { eventCircle(e, circles["circle2"]); }, false);
circles["circle3"].el.addEventListener("click", function(e) { eventCircle(e, circles["circle3"]); }, false);

function eventLine (e) {

    var linha = document.getElementById(lineInMove);
    linha.setAttribute("x2", e.clientX);
    linha.setAttribute("y2", e.clientY);

}

function eventLineDrop (e) {

    var linha = e.target;
    lineInMove = linha.id;

    var circle = undefined;

    Object.values(circles).forEach( function(element) {
        if ( element.getInPutLines().includes(linha.id) ) { circle = element; }
    });

    circle.removeValInputLines(linha.id);

    document.getElementsByTagName("svg")[0].addEventListener(
        "mousemove", eventLine, false );

}

var eventCircle = function (e, circle) {

    if ( lineInMove != undefined ){

        circle.setInPutLines(lineInMove);
        var linha = document.getElementById(lineInMove);

        var x = calcXYLine(linha, circle).x;
        var y = calcXYLine(linha, circle).y;

        linha.setAttribute("x2", e.target.getAttribute("cx"));
        linha.setAttribute("y2", e.target.getAttribute("cy"));

        document.getElementsByTagName("svg")[0].removeEventListener(
            "mousemove", eventLine);
        lineInMove = undefined;

    }else{

        id_conexao = "linha"+NLinhas;
        NLinhas++;

        lineInMove = id_conexao;

        circle.setOutPutLines(id_conexao);

        var linha = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        var svg = document.getElementsByTagName("svg")[0];
        svg.insertBefore(linha, document.getElementById("startLines"));
        linha.setAttribute("id", id_conexao);
        linha.setAttribute("marker-end", "url(#dot)");
        linha.setAttribute("x1", e.target.getAttribute("cx"));
        linha.setAttribute("y1", e.target.getAttribute("cy"));
        linha.setAttribute("x2", e.target.getAttribute("cx"));
        linha.setAttribute("y2", e.target.getAttribute("cy"));
        linha.setAttribute("stroke", "#000");
        linha.setAttribute("stroke-width", "5");


        document.getElementsByTagName("svg")[0].addEventListener(
            "mousemove", eventLine, false);
        linha.addEventListener("click", eventLineDrop, false);

    }

}

function calcXYLine(line, element){

    // hipotenusa linha hipt
    // raio r
    // hipt^2 = (x2-x1)^2 + (y2-y1)^2
    // hipt = sqrt(hipt^2)
    // r / hipt = x / | x2 - x1 |
    // r / hipt = y / | y2 - y1 |

    var r = element.el.getAttribute("r");
    var x1 = line.getAttribute("x1");
    var x2 = line.getAttribute("x2");
    var y1 = line.getAttribute("y1");
    var y2 = line.getAttribute("y2");

    var hipt = Math.sqrt(
        Math.pow(x2-x1,2) + Math.pow(y2-y1, 2) );

    var x = ( ( r * ( x1 - x2 ) ) / hipt );
    var y = ( ( r * ( y1 - y2 ) ) / hipt );

    return { x : Math.round(x), y : Math.round(y) }

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