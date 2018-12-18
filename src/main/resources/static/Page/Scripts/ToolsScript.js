//------ Probabilistic Reacheable Check ---------

$('#modalProbabilisticReachability').on('show.bs.modal',function() {
    for(var key in info_manager.state_elements){
        $('#probReach_sourceStates').append($("<option></option>")
            .attr("value",key)
            .text(key));
        $('#probReach_destinyStates').append($("<option></option>")
            .attr("value",key)
            .text(key));
        $('#probReach_excluidState').append($("<option></option>")
            .attr("value",key)
            .text(key));

    }
    for(var key in info_manager.transitions_elements){
        $('#probReach_sourceTransition').append($("<option></option>")
            .attr("value",key)
            .text(info_manager.transitions_elements[key].info_transition['label']));
        $('#probReach_destinyTransition').append($("<option></option>")
            .attr("value",key)
            .text(info_manager.transitions_elements[key].info_transition['label']));
        $('#probReach_excluidTransition').append($("<option></option>")
            .attr("value",key)
            .text(info_manager.transitions_elements[key].info_transition['label']));

    }
});
$('#modalProbabilisticReachability').on('hide.bs.modal',function() {
        $('#probReach_sourceStates').empty();
        $('#probReach_destinyStates').empty();
        $('#probReach_excluidState').empty();
        $('#probReach_sourceTransition').empty();
        $('#probReach_destinyTransition').empty();
        $('#probReach_excluidTransition').empty();

});


$('#probReach_template').change(function () { // Change Interface of Probability Reacheable
   var selected = $(this).find('option:selected').val();


   switch (selected){
       case "action":
           $('#probReach_States').addClass("d-none");
           $('#probReach_t2').addClass("d-none");
           $('#probReach_steps').addClass("d-none");
           $('#probReach_Transitions').removeClass("d-none");
          // msgProbabilisticReacheableCheck(1);
           break;
       case "action_~":
           $('#probReach_States').addClass("d-none");
           $('#probReach_t2').removeClass("d-none");
           $('#probReach_steps').addClass("d-none");
           $('#probReach_Transitions').removeClass("d-none");
         //  msgProbabilisticReacheableCheck(2);
           break;
       case "action_after":
           $('#probReach_States').addClass("d-none");
           $('#probReach_t2').removeClass("d-none");
           $('#probReach_steps').addClass("d-none");
           $('#probReach_Transitions').removeClass("d-none");
         //  msgProbabilisticReacheableCheck(3);
           break;
       case "action_steps":
           $('#probReach_States').addClass("d-none");
           $('#probReach_t2').addClass("d-none");
           $('#probReach_steps').removeClass("d-none");
           $('#probReach_Transitions').removeClass("d-none");
       //    msgProbabilisticReacheableCheck(4);
           break;
       case "default":
           $('#probReach_States').removeClass("d-none");
           $('#probReach_Transitions').addClass("d-none");
           $('#probReach_t2').addClass("d-none");
           $('#probReach_steps').addClass("d-none");
       //     msgProbabilisticReacheableCheck(0);
           break;

   }
});


function msgProbabilisticReacheableCheck(){ // Mount jSON to send for api.
    var selected = $('#probReach_template').find('option:selected').val();
    switch (selected){
        case "default":
            var srcState = $('#probReach_sourceStates option:selected').val();
            var dstState = $('#probReach_destinyStates option:selected').val();
            var actionID = dstState;
            var actionP = 1;
            reacheableCheck(srcState,dstState,actionP,actionID, null);
            break;
        case "action": // action
            var transition = info_manager.transitions_elements[$('#probReach_sourceTransition option:selected').val()];
            var srcState = 0;
            var dstState = transition.dstState;
            var actionP = transition.info_transition.probability;
            var actionID = transition.dstState;
            reacheableCheck(srcState,dstState,actionP,actionID,null,null);
            break;
        case "action_~": // ^~
            var transition = info_manager.transitions_elements[$('#probReach_sourceTransition option:selected').val()];
            var exclude = info_manager.transitions_elements[$('#probReach_destinyTransition option:selected').val()].info_transition.label;
            var srcState = 0;
            var dstState = transition.dstState;
            var actionP = transition.info_transition.probability;
            var actionID = transition.dstState;
            reacheableCheck(srcState,dstState,actionP,actionID,null, exclude);
            break;
        case "action_after": // After
            var transition_source = info_manager.transitions_elements[$('#probReach_sourceTransition option:selected').val()]; // action 1
            var transition_destiny = info_manager.transitions_elements[$('#probReach_destinyTransition option:selected').val()]; // action 2
            var srcState = transition_destiny.dstState;
            var dstState = transition_source.dstState;
            var actionP = transition_source.info_transition.probability;
            var actionID = transition_source.dstState;
            reacheableCheck(srcState,dstState,actionP,actionID,null,null);
            break;
        case "action_steps": // in X Steps
            var transition = info_manager.transitions_elements[$('#probReach_sourceTransition option:selected').val()];
            var srcState = 0;
            var dstState = transition.dstState;
            var actionP = transition.info_transition.probability;
            var actionID = transition.dstState;
            var steps = $('#probReach_steps_N').val();
            reacheableCheck(srcState,dstState,actionP,actionID,steps, null);
            break;
    }
}


// -------- End of Probabilistic Reacheable Check ---------
