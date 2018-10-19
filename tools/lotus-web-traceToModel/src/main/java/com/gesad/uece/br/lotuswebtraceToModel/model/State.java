package com.gesad.uece.br.lotuswebtraceToModel.model;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

public class State {
    private int id;
    private String label;

    private transient List<Transition> transicoesSaindo = new ArrayList<>();

    private transient List<Transition>  transicoesChengado = new ArrayList<>();

    private double coordX;
    private double coordY;

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

    public double getCoordX() {
        return coordX;
    }

    public void setCoordX(double coordX) {
        this.coordX = coordX;
    }

    public double getCoordY() {
        return coordY;
    }

    public void setCoordY(double coordY) {
        this.coordY = coordY;
    }

    public boolean isInitial() {
        return isInitial;
    }

    public void setInitial(boolean initial) {
        if(isError || isFinal){
            isError = false;
            isFinal = false;
        }
        isInitial = initial;
    }

    public boolean isFinal() {
        return isFinal;
    }

    public void setFinal(boolean aFinal) {
        if(isError || isInitial){
            isError = false;
            isFinal = false;
        }
        isFinal = aFinal;
    }

    public boolean isError() {
        return isError;
    }

    public void setError(boolean error) {
        if(isFinal || isInitial){
            isFinal = false;
            isInitial = false;
        }
        isError = error;
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
                "id: "+this.id+"" +
                " Label: "+this.label+"" +
                " coordX: "+this.coordX+"" +
                " coordY: "+this.coordY+"" +
                " isInitial: "+this.isInitial+"" +
                " visitedStatesCount: "+this.visitedStatesCount+"";
        for(Transition t : transicoesChengado){
            retorno += t.toString();
        }for(Transition t : transicoesSaindo){
            retorno += t.toString();
        }
        return retorno;
    }
}
