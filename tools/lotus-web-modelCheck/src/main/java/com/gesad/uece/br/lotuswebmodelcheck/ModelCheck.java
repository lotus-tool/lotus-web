package com.gesad.uece.br.lotuswebmodelcheck;

import com.gesad.uece.br.lotuswebmodelcheck.model.State;
import com.gesad.uece.br.lotuswebmodelcheck.model.Transition;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

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
            System.out.println("ESTADO: "+state);
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

    @PostMapping(value = "/reachable")
    public @ResponseBody double unreachable(
            @RequestBody unreachable_json json
    ){



        return json.probabilityBetween();
    }
}

class unreachable_json{

    int srcState;
    int dstState;
    int steps;
    int actionTargetID;
    int state_count;
    Transition[] transition;

    public Transition[] getTransition() {
        return transition;
    }

    public void setTransition(Transition[] transition) {
        this.transition = transition;
    }

    public int getSrcState() {
        return srcState;
    }

    public void setSrcState(int srcState) {
        this.srcState = srcState;
    }

    public int getDstState() {
        return dstState;
    }

    public void setDstState(int dstState) {
        this.dstState = dstState;
    }

    public int getSteps() {
        return steps;
    }

    public void setSteps(int steps) {
        this.steps = steps;
    }

    public int getActionTargetID() {
        return actionTargetID;
    }

    public void setActionTargetID(int actionTargetID) {
        this.actionTargetID = actionTargetID;
    }


    public int getState_count() {
        return state_count;
    }

    public void setState_count(int state_count) {
        this.state_count = state_count;
    }

    public double probabilityBetween () {
        //adicionar mais um parametro k para saber qual estado de destino da ação, além do source.
        //no final dos steps, caso a posição (i,k) da matriz estiver nula, return 0. caso contrario return valor normal.

        //fazer com que a posição (0,0) da matriz seja sempre 1.

        if(steps == 0) return 0.0;

        int tam = state_count;
        double[][] probabilities = new double[tam][tam];
        probabilities = zerar(probabilities, tam);
        int i;
        int j;
        for(Transition t : transition){
            i = (t.getSrcState());
            j = (t.getDstState());
            probabilities[i][j] = t.getProbability();
        }
        zerarDiagonal(probabilities, tam);
        probabilities[0][0] = 1;
        probabilities[srcState][srcState] = 1;
        i = srcState;
        j = dstState;
        // montar a matriz de probabilidades já é um step.
        steps--;

        //multiplica as matrizes um monte de vez
        double[][] mult = probabilities;
        double total = 0.0;
        int count = 0;

        if(steps == 0) return probabilities[srcState][dstState];

        if(steps > 0){

            count = steps;

        }else{

            //Acha a primeira potencia de 2 maior que o tamanho do LTS.

            count = closestPowerOf2(tam);

        }

        while(count > 0){
            probabilities = multiply(probabilities, mult, tam);
            mult = probabilities;
            count--;
        }

        total = probabilities[i][j];

        if(total > 1){
            total = 1;
        }
        total = truncar(total, 2);
        if(probabilities[i][actionTargetID] == 0) return 0;
        return total;
    }

    public int closestPowerOf2 (int tam){

        int potResult = 2;
        int pot;

        for(pot = 1; potResult < tam; pot++){
            potResult *= potResult;
        }

        return pot;
    }

    public double[][] multiply(double[][] matrixA, double[][] matrixB, int tam){
        double sum = 0;
        double[][] multiply = new double[tam][tam];
        for (int i = 0 ; i < tam ; i++ )
        {
            for (int j = 0 ; j < tam ; j++ )
            {
                for (int k = 0 ; k < tam ; k++ )
                {
                    sum += matrixA[i][k]*matrixB[k][j];
                }

                multiply[i][j] = sum;
                sum = 0;
            }
        }
        return multiply;
    }

    public double[][] zerar (double[][] probabilities, int tam){
        for(int i = 0; i < tam; i++){
            for(int j = 0; j < tam; j++){
                probabilities[i][j] = 0;
            }
        }
        return probabilities;
    }

    public double[][] zerarDiagonal (double[][] probabilities, int tam){
        for(int i = 0; i < tam; i++){
            probabilities[i][i] = 0;
        }
        return probabilities;
    }

    public static double truncar(double d, int casas_decimais){

        int var1 = (int) d;   // Remove a parte decimal do número... 2.3777 fica 2
        double var2 = var1*Math.pow(10,casas_decimais); // adiciona zeros..2.0 fica 200.0
        double var3 = (d - var1)*Math.pow(10,casas_decimais); /** Primeiro retira a parte decimal fazendo 2.3777 - 2 ..fica 0.3777, depois multiplica por 10^(casas decimais)
         por exemplo se o número de casas decimais que queres considerar for 2, então fica 0.3777*10^2 = 37.77 **/
        int var4 = (int) var3; // Remove a parte decimal da var3, ficando 37
        int var5 = (int) var2; // Só para não haver erros de precisão: 200.0 passa a 200
        int resultado = var5+var4; // O resultado será 200+37 = 237
        double resultado_final = resultado/Math.pow(10,casas_decimais); // Finalmente divide-se o resultado pelo número de casas decimais, 237/100 = 2.37
        return resultado_final; // Retorna o resultado_final :P
    }

}
