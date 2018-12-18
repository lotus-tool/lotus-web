package com.gesad.uece.br.lotuswebmodelcheck.model;

public class Transition {

    private String action;


    private int srcState; // ID Source State
    private int dstState; // ID Destiny State

    private Double probability;
    private String guard;

    private int visitedTransitionsCount;


    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
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

    public Double getProbability() {
        return probability;
    }

    public void setProbability(Double probability) {
        this.probability = probability;
    }

    public String getGuard() {
        return guard;
    }

    public void setGuard(String guard) {
        this.guard = guard;
    }


    public int getVisitedTransitionsCount() {
        return visitedTransitionsCount;
    }

    public void setVisitedTransitionsCount(int visitedTransitionsCount) {
        this.visitedTransitionsCount = visitedTransitionsCount;
    }

    @Override
    public String toString() {

        String retorno =
                " Action: "+action+
//                " SRC: "+srcState.getLabel()+
//                " DST: "+dstState.getLabel()+
                " Probability: "+probability+
                " Guard: "+guard+
                " Visitedcount: "+visitedTransitionsCount;
        return retorno;
    }
}
