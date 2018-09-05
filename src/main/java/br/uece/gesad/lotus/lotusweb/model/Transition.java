package br.uece.gesad.lotus.lotusweb.model;

public class Transition {

    private String action;
    private State srcState;
    private State dstState;

    private Double probability;
    private String guard;

    private int visitedTransitionsCount;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public State getSrcState() {
        return srcState;
    }

    public void setSrcState(State srcState) {
        this.srcState = srcState;
    }

    public State getDstState() {
        return dstState;
    }

    public void setDstState(State dstState) {
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
}
