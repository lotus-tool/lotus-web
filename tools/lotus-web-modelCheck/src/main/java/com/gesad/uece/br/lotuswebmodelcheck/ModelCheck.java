package com.gesad.uece.br.lotuswebmodelcheck;

import com.gesad.uece.br.lotuswebmodelcheck.model.State;
import com.gesad.uece.br.lotuswebmodelcheck.model.Transition;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;

@RequestMapping(value = "/modelckeck")
@RestController
public class ModelCheck {

    @PostMapping(value = "/")
    public String check(InputStream inputStream, boolean probabilistic) throws IOException {
        Gson gson = new Gson();
        State[] stateList = gson.fromJson(inputStream.toString(), State[].class);

        String erros = "";
        for(State state : stateList){
            // DeadLock
            if(state.getTransicoesSaindo().size() == 0 && !state.isFinal()){
                erros += "Deadlock in state: " + state.getLabel()+"\n";
            }
            // Unreachable
            if(state.getTransicoesChengado().size() == 0 && !state.isInitial()){
                erros += "State "+state.getLabel() + " is a Unreachable state.\n";
            }

            // Probabilitic
            if(probabilistic) {
                double sum = 0.0;
                for (Transition transition : state.getTransicoesSaindo()) {
                    if (transition.getProbability() == 0.0) { // Mesmo que nulo
                        erros += "State "+state.getLabel()+" have a transition without probability\n";
                        break;
                    }
                    sum += transition.getProbability();
                }
                if(sum != 1){
                    erros += "State "+state.getLabel()+" is inconsistent, sum probabilities != 1\n";
                }
            }
        }





        return (erros == ""? erros : "Your model that is ok!" );

    }


}
