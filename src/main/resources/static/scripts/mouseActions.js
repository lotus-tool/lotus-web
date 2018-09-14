/*
    Projeto Lotus WEB
    Ações do mouse em relação aos elementos da modelagem.
 */
var select_Mode = "Select_Mouse_Mode";
var state_Mode  = "State_Mouse_Mode";
var transition_Mode = "Transition_Mouse_Mode";
var inTransition = "inTransition";

var mouse_Status = select_Mode;

function mouseStyle() {
    console.log("Full");
    switch (mouse_Status){
        case select_Mode:
            document.body.style.cursor = "default";
            break;
        case state_Mode:
            document.body.style.cursor = "url('images/ic_state.png'),auto";
            break;
        case transition_Mode || inTransition:
            document.body.style.cursor = "e-resize";

    }
}
