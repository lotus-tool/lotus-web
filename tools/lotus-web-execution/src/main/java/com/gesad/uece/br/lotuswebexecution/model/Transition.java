package com.gesad.uece.br.lotuswebexecution.model;

public class Transition {

    private String label;
    private String orgState;
    private String dstState;

    private Double probability;
    private String guard;
    private String action;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    private int visitedTransitionsCount;


    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getOrgState() {
        return orgState;
    }

    public void setOrgState(String orgState) {
        this.orgState = orgState;
    }

    public String getDstState() {
        return dstState;
    }

    public void setDstState(String dstState) {
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
                "\n\tLabel: "+label+
                " SRC: "+orgState+
                " DST: "+dstState+
                " Probaility: "+probability+
                " Guard: "+guard+
                " Action: "+action+
                " Visitedcount: "+visitedTransitionsCount;
        return retorno;
    }
}
