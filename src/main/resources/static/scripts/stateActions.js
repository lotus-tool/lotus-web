var state_id = 0;


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
      /*  onend: function (event) {
            var textEl = event.target.querySelector('p');

            textEl && (textEl.textContent =
                'moved a distance of '
                + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                Math.pow(event.pageY - event.y0, 2) | 0))
                    .toFixed(2) + 'px');
        }
      */
    }).on('tap',function (e) {
    console.log("tap");
        if(mouse_Status == transition_Mode) {
            var x = parseInt(e.currentTarget.getAttribute('x')) + parseInt(e.currentTarget.getAttribute('data-x')) + 12;
            var y = parseInt(e.currentTarget.getAttribute('y')) + parseInt(e.currentTarget.getAttribute('data-y')) + 12;
            var ID = e.currentTarget.getAttribute('data-state-id');
            console.log('X: ' + x + " Y: " + y);
            draw_transition(x, y, ID);
        }else if(mouse_Status == inTransition){
            console.log("remove");
            var x = parseInt(e.currentTarget.getAttribute('x')) + parseInt(e.currentTarget.getAttribute('data-x')) + 12;
            var y = parseInt(e.currentTarget.getAttribute('y')) + parseInt(e.currentTarget.getAttribute('data-y')) + 12;
            var ID = e.currentTarget.getAttribute('data-state-id');
            document.getElementsByTagName("body")[0].removeEventListener("mousemove", follow);
            onStopFollow(x,y, ID);
            repaint();
        }
    });

function dragMoveListener (event) {
    if(mouse_Status == select_Mode || mouse_Status == state_Mode) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';
        // Transitions follow on move State

        var x_original = parseInt(target.getAttribute('x'));
        var y_original = parseInt(target.getAttribute('y'));
        var stateID = target.getAttribute('data-state-id');
        var paths = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", 'path');
        for (var i=0,n= paths.length; i<n; i++){
            var srcID =  paths[i].getAttribute('data-srcID');
            var dstID =  paths[i].getAttribute('data-dstID');
            if( srcID == stateID){
                onCharge(paths[i], x_original + (x) + 12, y_original + (y) + 12, 0);
            }else if(dstID == stateID){
                onCharge(paths[i], x_original + (x) + 12, y_original + (y) + 12, 1);
            }
        }
        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

    }
}

// this is used later in the resizing and gesture demos
//window.dragMoveListener = dragMoveListener;

function printar () {
    // https://stackoverflow.com/questions/8809909/change-cursor-to-finger-pointer
    mouse_Status = state_Mode;
}

//var clickButton = document.querySelector("#div-grad");

// Call event onClick for new state
document.getElementById("paint_panel").addEventListener('click', new_state, false);

function new_state (e) {
    if (mouse_Status == state_Mode) {
//        document.getElementsByTagName("body")[0].style.cursor = 'default';

        var div_espaco = document.getElementById("paint_panel");
        var novo_elemento = document.createElementNS("http://www.w3.org/2000/svg", "image");


        novo_elemento.className = "state draggable resize-drag";
        novo_elemento.setAttribute("class","state draggable resize-drag");
        novo_elemento.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "images/ic_state.png");
        y = e.offsetY;
        x = e.offsetX;
        if(x < 0) x = 0;
        if(y < 0) y = 0;
        novo_elemento.style.cursor = 'grab';
        novo_elemento.setAttribute('x', x);
        novo_elemento.setAttribute('y', y);
        novo_elemento.setAttribute('height',24);
        novo_elemento.setAttribute('width',24);

        novo_elemento.setAttribute('data-state-id',''+ state_id++);
        novo_elemento.setAttribute('data-state-type','initial');
        novo_elemento.setAttribute('data-x', 0);
        novo_elemento.setAttribute('data-y', 0);
        div_espaco.appendChild(novo_elemento);
    }

}

function repaint(){
    // Função usada para repintar os estados sempre q tiver transição, para o estado sobrepor a transição.
        var elementos = document.getElementsByTagName('svg')[0].children;
        var tam = elementos.length;
        for(var i=0; i < tam  ; tam--) {
            var element = elementos[i];
            if (element.tagName == "image") {
                var new_element = element.cloneNode();
                element.remove();
                document.getElementById("paint_panel").appendChild(new_element);
            }
        }
}

