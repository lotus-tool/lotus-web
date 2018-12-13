package com.gesad.uece.br.lotuswebtraceToModel;


import com.gesad.uece.br.lotuswebtraceToModel.model.State;
import com.gesad.uece.br.lotuswebtraceToModel.model.Transition;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@RequestMapping(value = "/tracetomodel")
@RestController
public class TraceToModel {
    /* String Pattern:
    *   Line 0 -> Name Project
    *
    */

    /*
    * Json usado para teste:
    * {
    *   "h":12,"f":2
    * }
    *
    * Corrigir as Actions, de acordo com o modelo do trace! Atualmente ela está vindo da seguinte forma:
    *  "action": "\"h\":12",
    * */
    private final Map<String, State> mStates = new HashMap<>();
    private ArrayList<Transition> transitions = new ArrayList<>();
    State mCurrentState;
    private String namesDestinysState;
    private boolean haveInitial = false;



    @PostMapping(value = "/")
    protected String parseFile(InputStream input) throws IOException {
        if (input != null) {
            State StateInicial = getOrCreateState("0");
            try {
                BufferedReader reader = new BufferedReader(new InputStreamReader(input));
                String linha = null;
                while ((linha = reader.readLine()) != null) {
                    String[] transDoTrace = linha.split(",");

                    // Inicio e fim do json
                    if(transDoTrace[0].equals("{") || transDoTrace[0].equals("}")){
                        continue;
                    }
                    mCurrentState = StateInicial;
                    System.out.println("[0]"+mCurrentState);

                    for (int i = 0; i < transDoTrace.length; i++) {
                        if (transDoTrace[i] != null) {
                            Transition mProximaTransicao = null;
                            Transition nextTransition = null;


                            Transition atualTransicao = verificaExisteTransicao(transDoTrace,i, mCurrentState);
                            if (atualTransicao != null) {
                                mCurrentState = percorre(atualTransicao);
                                continue;
                            } else {
                             mProximaTransicao = verificaExisteTransicao(transDoTrace,i+1, mCurrentState);
                                if (mProximaTransicao == null) {
                                    mProximaTransicao = verificaExisteTransicao(transDoTrace,i+1);
                                }
                                //  }
                                if (mProximaTransicao != null) {
                                    namesDestinysState = mProximaTransicao.getSrcState().getLabel();
                                    adicionarTransicao(mCurrentState.getLabel(), transDoTrace[i].trim(), namesDestinysState);
                                    continue;
                                } else {
                                    //  if (i + 1 < transDoTrace.length) {
//                                        nextTransition = verificaExisteTransicao(transDoTrace[i + 1].trim());
                                    nextTransition = verificaExisteTransicao(transDoTrace,i+1);
                                    //  }
                                    if (nextTransition != null) {
                                        if (verificationCaseComma(nextTransition, i, transDoTrace)) {
//                                        System.out.println("caso virgula");
                                            addCommar(mCurrentState, transDoTrace[i].trim(), nextTransition.getSrcState());
                                            continue;
                                        } else {
                                            /////quebra em nova aŕvore
//                                            System.out.println("quebra em nova aŕvore");
                                            namesDestinysState = String.valueOf(mStates.size());
                                            continue;


                                        }
                                    }

                                }
                                namesDestinysState = String.valueOf(mStates.size());
                                adicionarTransicao(mCurrentState.getLabel(), transDoTrace[i].trim(), namesDestinysState);
                            }

                        }

                        //}


                    }
                }

            } catch (IOException e) {
                e.printStackTrace();
            }


        }
        // Escrever Json e retornar o mesmo.
        Gson gson = new Gson();
        System.out.println("\n\n\n");
        String json = gson.toJson(mStates);
        String json2 = gson.toJson(transitions);
        System.out.println(json + json2);
       // System.out.println(json2);

        return json + json2;
    }

    /*
    private State criacaoDoStateInicial(Component mComponent) {
        State initialState = new State();
        initialState.setID(0);
        mComponent.addState(initialState);
        mStates.put(initialState.getLabel(), initialState);
        return initialState;
    }
    */
    public Transition verificaExisteTransicao(String[] trace, int j, State currentState) {

        if (!(j  < trace.length)) {
            return null;
        }
        String nameTrans = trace[j].trim();
        for (Transition t : currentState.getTransicoesSaindo()) {
            if (brokenLabel(t.getAction(), nameTrans)) {
                return t;
            }
        }
        return null;
    }


    // O que isso serve?
    private boolean brokenLabel(String label, String name) {
        String[] names = label.split(",");
        for (String s : names) {
            if (s.equals(name)) {
                return true;
            }
        }
        return false;
    }



    //    private Transition verificaExisteTransicao(String nameTransistion) {
    private Transition verificaExisteTransicao(String [] trace , int j) {
        if (!(j  < trace.length)) {
            return null;

        }
        for (Transition t : transitions) {
            if ((brokenLabel(t.getAction(), trace[j].trim()))) {
                return t;
            }
        }
        return null;
    }

    private State percorre(Transition trans) {
        return trans.getDstState();
    }

    private void addCommar(State estadoOrigem, String acao, State estadoDestino) {
        Transition tras = pegandoTransicaoPorStadoOrigEStadoDest(estadoOrigem, estadoDestino);//possivel problema, outra transiçao para o mesmo estado de ori e estado de dest
        if (tras == null) {
            return;
        }
        mCurrentState = estadoDestino;
        System.out.println("[2]"+mCurrentState);
        transitions.add(makeTransition(estadoOrigem,estadoDestino,acao));
        tras.setAction(tras.getAction() + "," + acao);


    }

    private boolean verificationCaseComma(Transition transition, int posicaoDoTrace, String[] linhaDoTrace) {
        boolean aux = false;

        State current = transition.getDstState();
        if (current.getTransicoesSaindo().size() == 0 && posicaoDoTrace + 2 >= linhaDoTrace.length) {
            return true;
        }

        for (int x = posicaoDoTrace + 2; x < linhaDoTrace.length; x++) {
            for (Transition t : current.getTransicoesSaindo()) {

                if (brokenLabel(t.getAction(), linhaDoTrace[x].trim())) {
                    aux = true;
                    current = t.getSrcState();
                    break;
                }
            }
        }
        return aux;

    }


    private Transition pegandoTransicaoPorStadoOrigEStadoDest(State orig, State dest) {
        for (Transition t : transitions) {
            if (t.getSrcState().getLabel().equals(orig.getLabel()) && t.getDstState().getLabel().equals(dest.getLabel())) {
                return t;
            }
        }
        return null;
    }

    private void adicionarTransicao(String estadoOrigem, String acao, String estadoDestino) {
        State src = getOrCreateState(estadoOrigem);
        State dst = getOrCreateState(estadoDestino);
        mCurrentState = dst;
        transitions.add(makeTransition(src,dst,acao));
    }
    private State getOrCreateState(String estadoOrigem) {
        State s = mStates.get(estadoOrigem);
        if (s == null) {
            if (haveInitial == false) {
                s = new State();
                s.setInitial(true);
                s.setID(0);
                s.setLabel("0");
                haveInitial = true;
            }else{
                s = new State();
                s.setLabel(estadoOrigem);
                s.setID(1);
            }
            mStates.put(estadoOrigem, s);
        }
        return s;
    }

    private Transition makeTransition(State srcState, State dstState, String action){
        Transition t = new Transition();
        t.setAction(action);
        t.setSrcState(srcState);
        t.setDstState(dstState);
        srcState.getTransicoesSaindo().add(t);
        dstState.getTransicoesChengado().add(t);
        return t;
    }

}
