package com.gesad.uece.br.lotuswebmodelcheck.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

public class State {
    private int id;
    private String label;


    private transient List<Transition> transicoesSaindo = new ArrayList<>();

    private transient List<Transition>  transicoesChengado = new ArrayList<>();


    private boolean isInitial;
    private boolean isFinal;
    private boolean isError;

    private int visitedStatesCount;

    public int getID() {
        return id;
    }

    public void setID(int id) {
        this.id = id;
    }

    public List<Transition> getTransicoesSaindo() {
        return transicoesSaindo;
    }

    public void setTransicoesSaindo(List<Transition> transicoesSaindo) {
        this.transicoesSaindo = transicoesSaindo;
    }

    public List<Transition> getTransicoesChengado() {
        return transicoesChengado;
    }

    public void setTransicoesChengado(List<Transition> transicoesChengado) {
        this.transicoesChengado = transicoesChengado;
    }


    public boolean getIsInitial() {
        return isInitial;
    }

    public void setIsInitial(boolean initial) {
        if(initial == true){
            isInitial = true;
            isError = false;
            isFinal = false;
        }else{
            isInitial = false;
        }
    }

    public boolean getIsFinal() {
        return isFinal;
    }

    public void setIsFinal(boolean aFinal) {
        if(aFinal == true){
            isFinal = true;
            isError = false;
            isInitial = false;
        }else{
            isFinal = false;
        }
    }

    public boolean getIsError() {
        return isError;
    }

    public void setIsError(boolean error) {
        if(error == true){
            isError = true;
            isFinal = false;
            isInitial = false;
        }else{
            isError = false;
        }
    }

    public int getVisitedStatesCount() {
        return visitedStatesCount;
    }

    public void setVisitedStatesCount(int visitedStatesCount) {
        this.visitedStatesCount = visitedStatesCount;
    }

    public boolean removeTransitionSaindo(Transition transition){
        return transicoesSaindo.remove(transition);
    }

    public boolean removeTransitionChegando(Transition transition){
        return transicoesChengado.remove(transition);
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    @Override
    public String toString() {
        String retorno =
                " id: "+this.id+"" +
                " Label: "+this.label+"" +
                " isInitial: "+this.isInitial+"" +
                " isFinal: "+this.isFinal+""+
                " isErro: "+this.isError+""+
                " visitedStatesCount: "+this.visitedStatesCount+"";
        for(Transition t : transicoesChengado){
            retorno += t.toString();
        }for(Transition t : transicoesSaindo){
            retorno += t.toString();
        }
        return retorno;
    }
}
