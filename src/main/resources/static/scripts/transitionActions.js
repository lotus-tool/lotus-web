var transition_id = -1;
function draw_transition(x1, y1, srcID){
    console.log("Entrou")
    if(mouse_Status == transition_Mode) {

        var svg = document.getElementsByTagName("svg")[0];
        var pat = document.createElementNS(
            'http://www.w3.org/2000/svg', 'path');
        svg.appendChild(pat);
        pat.setAttribute("id", "data-line-id-"+ (++transition_id) );

        var d = "M" + (x1 + "," + y1 + " Q" + x + "," + y + " " + x1 + "," + y1);

        pat.setAttribute("d", d);
        pat.setAttribute("stroke", "black");
        pat.setAttribute("stroke-width", "2");
        pat.setAttribute("fill", "transparent");
        pat.setAttribute("data-srcID", ""+srcID);
/*
        var ang = calcAngMarker(teta, x1, x1, y1, y1);

        var marker = document.getElementById("arrow").cloneNode(true);
        marker.setAttribute("id", "marker");
        marker.setAttribute("transform", "translate(" + x_Marker + " " + y_Marker + ") rotate (" + ang + ")");
        svg.appendChild(marker);
*/
        followLine(x1, y1);
    }

}

var follow;
function followLine (x1,y1) {
     follow = function (e) {
        mouse_Status = inTransition;
        var line = document.getElementById("data-line-id-"+ transition_id);
        var d = line.getAttribute("d");

         // offset para o mouse não ficar em cima da linha;
         var offsetX = -1;
         var offsetY = -1;

        if (e.offsetX > x1) { // Mouse a Direita do ponto de src
            var diferençax = (e.offsetX - x1);
            offsetX = -5;
        }else{ // Mouse a esquerda
            var diferençax =(x1 - e.offsetX );
            offsetX = +5;
        }
        if(e.offsetY > y1){ // Mouse em cima do ponto de src
            var diferençay = e.offsetY-y1;
            offsetY = -5;
        }else{ // Mouse em baixo do ponto de src
            var diferençay = y1 - e.offsetY;
            offsetY = +5;
        }

         var qpoints = setQPoint(x1,y1,e.offsetX,e.offsetY);

         var hipotenusa = module((x1-e.offsetX), (y1-e.offsetY));
         var angulo_de_elevação = ( Math.asin((y1-e.offsetY)/hipotenusa) ) * 180 / Math.PI; // transforma em graus


         d = d.slice(0,d.lastIndexOf("Q")+1) + qpoints.xPoint + "," + qpoints.yPoint + " " + (e.offsetX + (offsetX) ) + "," + (e.offsetY+ (offsetY));
         line.setAttribute("d", d);

         var arrow;

    };
    document.getElementsByTagName("body")[0].addEventListener("mousemove", follow,false);
}

function onStopFollow(x2, y2, ID){
    var line = document.getElementById("data-line-id-"+ transition_id);
    //console.log(line);
    line.setAttribute('data-dstID', ""+ID);
    var d = line.getAttribute("d");
    d = d.slice(0, (d.lastIndexOf(" ")+1)) + x2 +","+y2;
    line.setAttribute("d", d);
}

function onCharge(path, x_charged, y_charged, flag) {
    var d = path.getAttribute('d');
    d = d.split(" ");
    // d[0] = M
    // d[1] = Qpoints
    // d[2] = x,y of destiny
    if(flag == 0){ // Move Source
        var q = d[2].slice(0,d[1].length).split(",");
        var qpoints = setQPoint(x_charged, y_charged, parseFloat(q[0]), parseFloat(q[1]));
        var newd = "M"+ x_charged +","+ y_charged +" Q"+qpoints.xPoint+","+qpoints.yPoint+" "+d[2];
        path.setAttribute('d',newd);
    }else{ // Move Destiny
        var q = d[0].slice(1,d[0].length).split(",");
        var qpoints = setQPoint(parseFloat(q[0]), parseFloat(q[1]), x_charged, y_charged);
        var newd = d[0] +" Q"+qpoints.xPoint+","+qpoints.yPoint+" "+x_charged +","+ y_charged ;
        path.setAttribute('d',newd);
    }


}

function setQPoint(x1,y1, x2, y2){
    var vectorv = [x2-x1, y2-y1];
    var vectoru = [-(vectorv[1]), vectorv[0]];
    var vectoru_v = unitary(vectoru);
    var l = module(vectorv[0], vectorv[1]);
    var h = ( (l/2)* Math.sqrt(3) ) /3;

    var midpoint = [(x1 +x2)/2 , (y1+y2)/2];
    var p3 = [vectoru_v[0]* (-h) + midpoint[0], vectoru_v[1]* (-h) + midpoint[1]];

    return {'xPoint':p3[0], 'yPoint':p3[1]};

}

function unitary(vector){
    var m = module(vector[0], vector[1]);
    return [vector[0]/m, vector[1]/m];
}
function module(a,b) {
    return Math.sqrt(a*a + b*b);
}