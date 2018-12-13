package com.gesad.uece.br.lotuswebmodelcheck;

import com.gesad.uece.br.lotuswebmodelcheck.model.State;
import com.gesad.uece.br.lotuswebmodelcheck.model.Transition;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

import java.io.*;

@RequestMapping(value = "/modelcheck")
@CrossOrigin
@RestController
public class ModelCheck {

    @PostMapping(value = "/")
    public @ResponseBody String check(
            @RequestBody State[] inputStream,
            @RequestParam(value = "prob") boolean probabilistic
    ) throws IOException {
        Gson gson = new Gson();
        State[] stateList = inputStream;
        String erros = "";
        for(State state : stateList){
            //System.out.println("ESTADO: "+state);
            // DeadLock
            if(state.getTransicoesSaindo().size() == 0 && !state.getIsFinal()){
                erros += "Deadlock in state: " + state.getLabel()+"\n";
            }
            // Unreachable
            System.out.println("AQUI");
            state.getTransicoesChengado().forEach(x->{
                System.out.println(x);
            });
            if(state.getTransicoesChengado().size() == 0 && !state.getIsInitial()){
                erros += "State "+state.getLabel() + " is a Unreachable state.\n";
            }


            if(probabilistic) {
                double sum = 0.0;
                for (Transition transition : state.getTransicoesSaindo()) {
                    //System.out.println("TRANSIÇÃO: "+transition);
                    if (transition.getProbability() == 0.0) { // Mesmo que nulo
                        System.out.println("AQUI");
                        erros += "State "+state.getLabel()+" have a transition without probability\n";
                        break;
                    }
                    sum += transition.getProbability();
                }
                if(sum != 1 && state.getTransicoesSaindo().size()>0){
                    erros += "State "+state.getLabel()+" is inconsistent, sum probabilities != 1\n";
                }
            }

        }




        String s = "Your model that is ok!";
        return (erros.equals("")? gson.toJson(s) : gson.toJson(erros));

    }


}

class json{
    State[] state;
    Transition[] transition;

    public State[] getState() {
        return state;
    }

    public void setState(State[] state) {
        this.state = state;
    }

    public Transition[] getTransition() {
        return transition;
    }

    public void setTransition(Transition[] transition) {
        this.transition = transition;
    }
}
