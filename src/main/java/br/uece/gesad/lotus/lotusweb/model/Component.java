package br.uece.gesad.lotus.lotusweb.model;

import java.util.ArrayList;
import java.util.List;

public class Component {

    private String name;
    private State initialState;
    private State finalState;
    private State errorState;

    private List<State> stateList = new ArrayList<>();
    private List<Transition> transitionList = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public State getInitialState() {
        return initialState;
    }

    public void setInitialState(State initialState) {
        this.initialState = initialState;
    }

    public State getFinalState() {
        return finalState;
    }

    public void setFinalState(State finalState) {
        this.finalState = finalState;
    }

    public State getErrorState() {
        return errorState;
    }

    public void setErrorState(State errorState) {
        this.errorState = errorState;
    }

    public List<State> getStateList() {
        return stateList;
    }

    public void setStateList(List<State> stateList) {
        this.stateList = stateList;
    }

    public List<Transition> getTransitionList() {
        return transitionList;
    }

    public void setTransitionList(List<Transition> transitionList) {
        this.transitionList = transitionList;
    }

    public State getStateByID(int id){
        for(State s : stateList){
            if(s.getId() == id){
                return s;
            }
        }
        return null;
    }

    public Transition getTransitionByAction(String action){
        for(Transition t : transitionList){
            if(t.getAction().equals(action)){
                return t;
            }
        }
        return null;
    }

    public void addState(State state){
        stateList.add(state);
    }

    public void addTransition(Transition transition){
        transitionList.add(transition);
    }

    public void removeState(State state){
        for(Transition transition : state.getTransicoesChengado()){
            removeTransition(transition);
        }
        for(Transition transition : state.getTransicoesSaindo()){
            removeTransition(transition);
        }
        stateList.remove(state);
        if(state == initialState){
            if(!stateList.isEmpty()) {
                setInitialState(stateList.get(0));
            }
        }
    }

    public void removeTransition(Transition transition){
        transition.getSrcState().removeTransitionSaindo(transition);
        transition.getDstState().removeTransitionChegando(transition);
        transitionList.remove(transition);
    }
}
