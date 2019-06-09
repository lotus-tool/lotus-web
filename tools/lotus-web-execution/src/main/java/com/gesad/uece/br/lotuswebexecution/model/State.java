package com.gesad.uece.br.lotuswebexecution.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

public class State {

    private int id;

    private String label;

    private List<Transition> output_transitions = new ArrayList<>();

    private List<Transition>  input_transitions = new ArrayList<>();

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

    public List<Transition> getOutput_transitions() {
        return output_transitions;
    }

    public void setOutput_transitions(List<Transition> output_transitions) {
        if(output_transitions == null){
            this.output_transitions = new ArrayList<>();
        }else {
            this.output_transitions = output_transitions;
        }
    }

    public List<Transition> getInput_transitions() {
        return input_transitions;
    }

    public void setInput_transitions(List<Transition> input_transitions) {
        if (input_transitions == null){
            this.input_transitions = new ArrayList<>();
        }else {
            this.input_transitions = input_transitions;
        }
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

    public void setIsInitial(boolean initial) {
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

    public boolean removeOutput_transitions(Transition transition){
        return output_transitions.remove(transition);
    }

    public boolean removeInput_transitions(Transition transition){
        return input_transitions.remove(transition);
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
        for(Transition t : input_transitions){
            retorno += t.toString();
        }for(Transition t : output_transitions){
            retorno += t.toString();
        }
        return retorno;
    }
}
