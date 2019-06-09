package com.gesad.uece.br.lotuswebexecution;


import com.gesad.uece.br.lotuswebexecution.model.State;
import com.gesad.uece.br.lotuswebexecution.model.Transition;
import com.gesad.uece.br.lotuswebexecution.model.Variable;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.function.Function;

@RequestMapping(value = "/execution")
@CrossOrigin
@RestController
public class Execution {
    List<State> stateList = new ArrayList<>();
    List<Transition> transitionList = new ArrayList<>();
/*
    jsonReceiver is:
        states = { info_manager.states_elements}
        transitions = [ info_manager.transition_elements ]
        parameters = " info_manager.parameters " ( need Create )

 */

    @PostMapping(value = "/")
    protected @ResponseBody String parseFile(@RequestBody json_Receiver jsonReceiver) throws IOException {



        stateList.clear();
        transitionList.clear();
        State initial = getInitial(jsonReceiver.getStates());

        State initialComposed = new State();
        initialComposed.setID(0);
        stateList.add(initialComposed);

        Map<String, Variable> variablesContext = generateVariables(jsonReceiver.getParameters());

        deepen(initial, variablesContext, jsonReceiver.getStates());

        stateList.forEach(x -> System.out.println(x));


        Gson gson = new Gson();
        json_Sender jsonSender = new json_Sender();
        jsonSender.setStates(stateList);
        jsonSender.setTransitions(transitionList);

        return "{ \"lts_dict\": "+gson.toJson(jsonSender)+"}";
    }

    private State getInitial(HashMap<String, State> stateHashMap){
        State state = stateHashMap.values().stream().filter(st -> st.isInitial()).findFirst().orElse(null);
        return state;
    }

    private void deepen(State current,  Map<String, Variable> variableContext, Map<String, State> stateMap ){

        for(Transition transition : current.getOutput_transitions()){
            boolean passInGuard = attendGuardConditions(transition, variableContext);
            Map<String, Variable> backupVariableContext = new HashMap<>();
            if(!passInGuard){
                continue;
            }else {


                variableContext = processAction(transition, variableContext);
                variableContext.forEach((x,y) -> {
                    Variable v = new Variable(y.getName(), y.getValue());
                    backupVariableContext.put(x,v);
                });
            }

            State dst = new State();
            dst.setID(stateList.size());
            Transition t = null;
            System.out.println("[TRANSITION] "+ transition);
            if(transition.getOrgState().equals(transition.getDstState())){ // Loop Transition
                t = buildTransition(transition, stateList.get(stateList.size() - 1), dst);
            }else {
                t = buildTransition(transition, current, dst);
            }
            transitionList.add(t);
            stateList.add(dst);

            current = stateMap.get(transition.getDstState());

            // Adicionar a Self-Transition nas output transitions ( Front )
            // Adicionar o actions ( Front )
            // Criar um info_manager parameters ( para usar usar na tela de execution )

            deepen(current, variableContext, stateMap);
            variableContext = backupVariableContext;


        }


    }

    private Map<String, Variable> generateVariables(String parameters){
        // todo replace ; to newline and remove all space
        parameters = parameters.replaceAll(";","\n").replaceAll("\\s+","");
        String[] parametersList = parameters.split("\n");
        Map<String, Variable> variableHashMap = new HashMap<>();

        for(String line : parametersList){
            if(line.equals("")){continue;}
            String[] s = line.split("=");
            variableHashMap.put(s[0],new Variable(s[0],Integer.parseInt(s[1]) ) );
        }

        return variableHashMap;
    }

    private boolean attendGuardConditions(Transition currentTransition, Map<String, Variable> variableContext){
        boolean resultBoolean = false;

        if(currentTransition.getGuard() == null || currentTransition.getGuard().equals("")){
            return resultBoolean;
        }

        String guard = currentTransition.getGuard().replaceAll("TRUE", "true").replaceAll("FALSE", "false");
        for(Variable variable : variableContext.values()){
            if (guard.contains(variable.getName())) {
                // Use a regex for tratement A = AB, AB is a variable and have variable A.
                guard = guard.replace(variable.getName(), String.valueOf(variable.getValue()));
            }
        }
        ScriptEngineManager mgr = new ScriptEngineManager();
        ScriptEngine engine = mgr.getEngineByName("JavaScript");
        try {
            resultBoolean = (Boolean) engine.eval(guard);

            System.out.println("[GUARD] "+guard);
            System.out.println("[resultBoolean] "+resultBoolean);
        } catch (ScriptException e) {
            e.printStackTrace();
        }

        return resultBoolean;
    }

    private Map<String, Variable> processAction(Transition currentTransition, Map<String, Variable> variableMap){

        String actions = currentTransition.getAction();
        if(actions == null || actions.equals("")){
            return variableMap;
        }
        actions.replaceAll(";","\n").replaceAll("\\s*","");
        String[] actionList = actions.split("\n");

        for (String action : actionList){
            String [] actionBeferoIgualaction = action.split("=");
            String receiverVariable = actionBeferoIgualaction[0];
            String equation = actionBeferoIgualaction[1];
            Integer result = null;

            if(isConstante(equation)){
                equation = action;
            }else{
                for (Variable variable : variableMap.values()){
                    equation = equation.replace(variable.getName(), String.valueOf(variable.getValue()));
                }
            }
            ScriptEngineManager mgr = new ScriptEngineManager();
            ScriptEngine engine = mgr.getEngineByName("JavaScript");
            try {
                result = (Integer) engine.eval(equation);
                System.out.println("[EQUATION] "+equation);
                System.out.println("[result] "+result);
            } catch (ScriptException e) {
                e.printStackTrace();
            }

            if(result != null){
                variableMap.get(receiverVariable).setValue(result); // Upgrade value of var
            }
        }

        return variableMap;

    }

    private boolean isConstante(String equation) {
        try
        {
            double d = Double.parseDouble(equation);
        }
        catch(NumberFormatException nfe)
        {
            return false;
        }
        return true;


    }

    private Transition buildTransition(Transition transition, State currentState, State dstState){
        String label = transition.getLabel();
        Transition t = new Transition();
        t.setOrgState(""+currentState.getID());
        t.setDstState(""+dstState.getID());
        t.setLabel(label);
        t.setProbability(transition.getProbability());
        t.setGuard("MAKE");

        return t;
    }

}

class json_Receiver{
    HashMap<String,State> states;
    HashMap<String,Transition> transitions = new HashMap<>();
    String parameters;
    public json_Receiver(HashMap<String,State> states, HashMap<String, Transition> trasitions, String parameters){
        this.states = states;
        this.transitions = trasitions;
        this.parameters = parameters;
    }

    public HashMap<String, State> getStates() {
        return states;
    }

    public void setStates(HashMap<String, State> stats) {
        this.states = stats;
    }

    public HashMap<String,Transition> getTransitions() {
        return transitions;
    }

    public void setTransitions(HashMap<String,Transition> trasitions) {
        this.transitions = trasitions;
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }
}

class json_Sender{
    List<Transition> transitions;
    List<State> states;

    public List<Transition> getTransitions() {
        return transitions;
    }

    public void setTransitions(List<Transition> transitions) {
        this.transitions = transitions;
    }

    public List<State> getStates() {
        return states;
    }

    public void setStates(List<State> states) {
        this.states = states;
    }
}
