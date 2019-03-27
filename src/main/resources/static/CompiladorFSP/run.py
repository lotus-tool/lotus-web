#!flask/bin/python
from flask import Flask, jsonify, request
from flask_cors import CORS
import re
from pprint import pprint

# CLOCK ( M = 1, B=2 ) = ( when a<3 <1.1> action -> Process | action1 -> Process2  ).

class Interpretador(object):
    """docstring for ClassName"""
    def __init__(self, words):

        """

            self.words: FSP dividido nos valores de interesse.

            self.index_w: indice da palavra atual

            self.word: palavra atual

            self.trace: sequência de passos seguido pela arvore de derivação

            self.states: lista de estados do FSP

            self.parameters: lista de parametros do FSP

            self.transitions: lista da transições do FSP

            self.probabilities: lista de probabilidades

            self.guards: lista de guardas

            self.integers: lista de valores inteiros

            self.operators: lista de operadores

            self.indexs: dict { lower_indentifier: index }

            self.process_labels: dicionario para mapear label do processo no FSP para
                label do processo no LTS

            self.lts_dict = dicionário com as informações dos estados e das transições

        """

        self.words = words
        self.index_w = -1
        self.word = None
        self.in_action = False
        self.trace = []
        self.states = []
        self.parameters = []
        self.transitions = []
        self.probabilities = []
        self.guards = []
        self.integers = []
        self.operators = []
        self.indexs = {}
        self.process_labels = {}
        self.lts_dict = { 'states': {}, 'transitions': {} }

    def updateWord(self):
        """
            atualiza para a proxima palavra se a palavra 
            atual no for a última

        """
        if self.index_w == (len(self.words) - 1):
            print("====================")
            self.word = " "
        else:
            self.index_w += 1
            self.word = self.words[self.index_w]

    def rowBackWord(self,n_back):
        """ retorna para a palavra anterior se não houver erros. """
        if self.word == " ":
            print("====================")
            self.word = " "
        else:
            self.index_w -= n_back
            self.word = self.words[self.index_w]
    
    def leftParentheses(self):
        self.updateWord()
        print("leftParentheses")
        if self.word == "(":
            print("OK")
            self.trace.append("leftParentheses")
            return True
        else:
            self.rowBackWord(1)
            return False
        
    def rightParentheses(self):
        self.updateWord()
        print("rightParentheses")
        if self.word == ")":
            print("OK")
            self.trace.append("rightParentheses")
            return True
        else:
            self.rowBackWord(1)
            return False

    def leftBrackets(self):
        self.updateWord()
        print("leftBrackets")
        if self.word == "[":
            print("OK")
            self.trace.append("leftBrackets")
            return True
        else:
            self.rowBackWord(1)
            return False

    def rightBrackets(self):
        self.updateWord()
        print("rightBrackets")
        if self.word == "]":
            print("OK")
            self.trace.append("rightBrackets")
            return True
        else:
            self.rowBackWord(1)
            return False

    def leftKey(self):
        self.updateWord()
        print("leftKey")
        if self.word == "{":
            print("OK")
            self.trace.append("leftKey")
            return True
        else:
            self.rowBackWord(1)
            return False

    def rightKey(self):
        self.updateWord()
        print("rightKey")
        if self.word == "}":
            print("OK")
            self.trace.append("rightKey")
            return True
        else:
            self.rowBackWord(1)
            return False

    def equal_operator(self):
        self.updateWord()
        print("equal_operator")
        if self.word == "=":
            print("OK")
            self.trace.append("equal_operator")
            self.operators.append(self.word)
            return True
        else:
            self.rowBackWord(1)
            return False

    def comma(self):
        self.updateWord()
        print("comma")
        if self.word == ",":
            print("OK")
            self.trace.append("comma")
            return True
        else:
            self.rowBackWord(1)
            return False

    def PipeOr(self):
        self.updateWord()
        print("PipeOr")
        if self.word == "|":
            print("OK")
            self.trace.append("PipeOr")
            return True
        else:
            self.rowBackWord(1)
            return False

    def action_prefix(self):
        print("action_prefix")
        if self.less_operator() and self.bigger_then():
            print("OK")
            return True
        else:
            self.rowBackWord(1)
            return False

    def asterisk(self):
        self.updateWord()
        print("asterisk")
        if self.word == "*":
            print("OK")
            self.trace.append("asterisk")
            return True
        else:
            self.rowBackWord(1)
            return False

    def v_double_points(self):
        self.updateWord()
        print("v_double_points")
        if self.word == ":":
            print("OK")
            self.trace.append("v_double_points")
            return True
        else:
            self.rowBackWord(1)
            return False

    def point(self):
        self.updateWord()
        print("point")
        if self.word == ".":
            print("OK")
            self.trace.append("point")
            return True
        else:
            self.rowBackWord(1)
            return False

    def less_operator(self):
        self.updateWord()
        print("less_operator")
        if self.word == "-":
            print("OK")
            self.trace.append("less_operator")
            return True
        else:
            self.rowBackWord(1)
            return False

    def less_than(self):
        self.updateWord()
        print("less_than")
        if self.word == "<":
            print("OK")
            self.trace.append("less_than")
            self.operators.append(self.word)
            return True
        else:
            self.rowBackWord(1)
            return False

    def bigger_then(self):
        self.updateWord()
        print("bigger_then")
        if self.word == ">":
            self.trace.append("bigger_then")
            self.operators.append(self.word)
            print("OK")
            return True
        else:
            self.rowBackWord(1)
            return False

    def arroba(self):
        self.updateWord()
        print("arroba")
        if self.word == "@":
            print("OK")
            self.trace.append("arroba")
            return True
        else:
            self.rowBackWord(1)
            return False

    def STOP(self):
        self.updateWord()
        print("STOP")
        if self.word == "STOP":
            print("OK")
            self.trace.append("STOP")
            return True
        else:
            self.rowBackWord(1)
            return False

    def ERROR(self):
        self.updateWord()
        print("ERROR")
        if self.word == "ERROR":
            print("OK")
            self.trace.append("ERROR")
            return True
        else:
            self.rowBackWord(1)
            return False

    def constRW(self):
        self.updateWord()
        print("constRW")
        if self.word == "const":
            print("OK")
            self.trace.append("constRW")
            return True
        else:
            self.rowBackWord(1)
            return False

    def rangeRW(self):
        self.updateWord()
        print("rangeRW")
        if self.word == "range":
            print("OK")
            self.trace.append("rangeRW")
            return True
        else:
            self.rowBackWord(1)
            return False

    def whenRW(self):
        self.updateWord()
        print("whenRW")
        if self.word == "when":
            print("OK")
            self.trace.append("whenRW")
            return True
        else:
            self.rowBackWord(1)
            return False

    def ifRW(self):
        self.updateWord()
        print("ifRW")
        if self.word == "if":
            print("OK")
            self.trace.append("ifRW")
            return True
        else:
            self.rowBackWord(1)
            return False

    def thenRW(self):
        self.updateWord()
        print("thenRW")
        if self.word == "then":
            print("OK")
            self.trace.append("thenRW")
            return True
        else:
            self.rowBackWord(1)
            return False

    def elseRW(self):
        self.updateWord()
        print("elseRW")
        if self.word == "else":
            print("OK")
            self.trace.append("elseRW")
            return True
        else:
            self.rowBackWord(1)
            return False

    def integer_value(self):
        self.updateWord()
        print("integer_value")
        if bool(re.compile("\d+$").match(self.word)):
            print("OK")
            self.trace.append("integer_value")
            self.integers.append(self.word)
            return True
        else:
            self.rowBackWord(1)
            return False

    def bool_value(self):
        self.updateWord()
        print("bool_value")
        if bool(re.compile("true|false").match(self.word)):
            print("OK")
            self.trace.append("bool_value")
            return True
        else:
            self.rowBackWord(1)
            return False

    # ====================================== Identifiers ======================================

    def upper_identifier(self):
        self.updateWord()
        print("upper_identifier")
        if bool(re.compile("[A-Z]\w*").match(self.word)):
            self.trace.append("upper_identifier")
            print(len(self.process_labels))
            if self.word not in self.process_labels:
                self.process_labels[self.word] = len(self.process_labels)
            self.states.append(self.word)
            print("OK")
            return True
        else:
            self.rowBackWord(1)
            return False

    def lower_identifier(self):
        self.updateWord()
        print("lower_identifier")
        if bool(re.compile("[a-z]\w*").match(self.word)):
            self.trace.append("lower_identifier")
            self.transitions.append(self.word)
            print("OK")
            return True
        else:
            self.rowBackWord(1)
            return False

    # =============================== State / Transition Dicts ===============================

    def dict_states(self, id_, outPutTransitions, inPutTransitions, isInitial, isFinal, isError, label):
        return {
                    'id': id_,
                    'outPutTransitions': outPutTransitions,
                    'inPutTransitions': inPutTransitions,
                    'isInitial': isInitial,
                    'isFinal': isFinal,
                    'isError': isError,
                    'label': label
                }

    def dict_transitions(self, id_, orgState, dstState, label, probability, guard):
        return  {
                    'id': id_,
                    'orgState': orgState,
                    'dstState': dstState,
                    'label': label,
                    'probability': probability,
                    'guard': guard
                }

    # ================================= Constant Declaration =================================

    def constant_declaration(self):
        return self.constRW() and self.upper_identifier() and self.equal_operator() and \
            self.integer_value()

    # =================================== Range Declaration ===================================

    def range_declaration(self):
        return self.rangeRW() and self.upper_identifier() and self.equal_operator() and \
            self.integer_value() and self.point() and self.point() and self.integer_value()

    # ================================== Index & Index range ==================================

    def index_expression(self):
        action_process = None
        action_process = self.words[self.index_w-1]
        index = ""
        if self.integer_value():
            index += self.integers[-1]
            del self.integers[-1]
            if self.point():
                index += "."
                if self.point() and self.integer_value():
                    index += "." + self.integers[-1]
                    self.indexs[action_process] = index
                    del self.integers[-1]
                    return True
                else:
                    return False
            elif self.rightBrackets():
                self.rowBackWord(1)
                self.indexs[action_process] = index
                return True
            else:
                return False
        elif self.lower_identifier():
            index += self.transitions[-1]
            del self.transitions[-1]
            if self.asterisk():
                index += "*"
                if self.integer_value():
                    index += self.integers[-1]
                    del self.integers[-1]
                    self.indexs[action_process] = index
                    return True
                else:
                    return False
            elif self.v_double_points():
                index += ":"
                if self.integer_value() and self.point() \
                    and self.point() and self.integer_value():
                    index += self.integers[-2] + ".." + self.integers[-1]
                    del self.integers[-2]
                    del self.integers[-1]
                    self.indexs[action_process] = index
                    return True
                else:
                    return False
            elif self.rightBrackets():
                self.rowBackWord(1)
                self.indexs[action_process] = index
                return True
            else:
                return False
        else:
            return False

    def index(self):
        return self.leftBrackets() and self.index_expression() and self.rightBrackets()

    def range(self):
        return self.upper_identifier() or \
            (self.integer_value() and self.point() and self.point() and self.integer_value())

    def index_range(self):
        return self.leftBrackets() and self.lower_identifier() and \
            self.v_double_points() and self.range() and self.rightBrackets()

    def index_label(self):
        # return self.index() or self.index_range()
        return self.index()

    def index_labels(self):
        result = False
        while self.index_label():
            result = True

        return result

    # ===================================== Action Label =====================================

    def simple_action_label(self):
        if self.lower_identifier():
            bool_index = self.index_labels()
            return True
        else:
            return False

    def action_label(self):
        startOrPoint = True
        result = True

        while startOrPoint and result:
            result = result and self.simple_action_label()
            startOrPoint = self.point()

        return result

    def action_label_set(self):
        startOrComma = True
        result = True
        result = result and self.leftKey()

        while startOrComma and result:
            result = result and self.action_label()
            startOrComma = self.comma()

        result = result and self.rightKey()

        return result

    # =================================== Primitive Process ===================================

    def bool_expression(self):
        return self.lower_identifier() and \
                ( self.less_than() or self.bigger_then() or self.equal_operator()) and \
                ( self.bool_value() or self.integer_value() )

    def conditional(self):
        return False
        # Falta implementar funcionamento no LTS
        # if self.ifRW() and self.bool_expression():
        #     self.guards.append(self.transitions[-1]+" "+self.operators[-1]+" "+self.integers[-1])
        #     del self.transitions[-1]
        #     del self.operators[-1]
        #     del self.integers[-1]

        #     if self.thenRW() and self.process_body():
        #         bool_else = self.elseRW() and self.process_body()
        #         return True
        # else:
        #     return  False

    def guard_when(self):
        if self.whenRW():
            if self.bool_expression():
                self.guards.append(self.transitions[-1]+" "+self.operators[-1]+" "+self.integers[-1])
                del self.transitions[-1]
                del self.operators[-1]
                del self.integers[-1]
                return True
            else:
                return False
        else:
            return True

    def probability(self):
        if self.less_than():
            if self.integer_value() and self.point() and \
                self.integer_value() and self.bigger_then():
                self.probabilities.append(self.integers[-2]+"."+self.integers[-1])
                del self.integers[-2]
                del self.integers[-1]
                return True
            else:
                return False
        else:
            return True

    def parameter(self):
        if self.upper_identifier() and self.equal_operator() and self.integer_value():
            self.parameters.append(self.states[-1]+" "+self.operators[-1]+" "+self.integers[-1])
            del self.process_labels[self.states[-1]]
            del self.states[-1]
            del self.operators[-1]
            del self.integers[-1]
            return True
        else:
            return False

    def parameter_list(self):
        startOrComma = True
        result = True

        while startOrComma and result:
            result = result and self.parameter()
            startOrComma = self.comma()

        return result

    def action_label_part(self):
        if self.action_label() or self.action_label_set():
            return True
        else:
            return False

    def local_process_name(self):
        if self.STOP() or self.ERROR():
            return True
        elif self.upper_identifier():
            bool_index = self.index()
            return True
        else:
            return False

    def local_process_defn(self):
        if self.upper_identifier():
            result = self.arroba() or (self.index() or self.index_range())
            if self.equal_operator() and self.process_body():
                return True
            else:
                return False
        else:
            return False

    def process_body(self):
        if (self.leftParentheses()):
            guard = None
            probability = None
            updateDict = False
            if self.trace[-2] == "bigger_then":
                # corpo de processo no lugar de um processo
                new_state = str(len(self.process_labels))
                self.process_labels[new_state] = len(self.states)
                self.states.append(new_state)
                # guarda e probabilidade devem ser definidas antes, já que são
                # alocadas pela sequência dos estados.

                if len(self.guards) > 0:
                    guard = self.guards[-1]
                    del self.guards[-1]

                if len(self.probabilities) > 0:
                    probability = self.probabilities[-1]
                    del self.probabilities[-1]

                updateDict = True

            if self.choices() and self.rightParentheses():
                if updateDict:  self.updateDictLTS(guard, probability)
                return True
            else:
                return False
        else:
            guard = None
            probability = None
            if not self.in_action and self.local_process_name():
                self.updateDictLTS(guard, probability)
                return True

            else:

                return False

    def choice(self):
        if self.guard_when():
            self.in_action = True
            if self.probability():
                self.in_action = True
                if self.action_label_part():
                    self.in_action = False
                    if self.action_prefix() and self.process_body():
                        return True
                    else:
                        return False
                else:
                    return False
            else:
                return False
        else:
            return False
            

    def choices(self):
        startOrPipe = True
        result = True

        while startOrPipe and result:
            result = result and self.choice()
            startOrPipe = self.PipeOr()

        return result

    def updateDictLTS(self, guard, probability):
        print("updateDictLTS")

        # obter estado de origem e destino
        currentStateLabel = self.states[-2]
        currentState = str(self.process_labels[currentStateLabel])
        proxStateLabel = self.states[-1]
        proxState = str(self.process_labels[proxStateLabel])
        del self.states[-1]

        # ação da transição de choice
        transition = self.transitions[-1]
        del self.transitions[-1]

        # verifica se a transição tem guarda e se sim, carrega-a
        if len(self.guards) > 0 and guard == None:
            guard = self.guards[-1]
            del self.guards[-1]

        # verifica se a transição tem probabilidade e se sim, carrega-a
        if len(self.probabilities) > 0 and probability == None:
            probability = self.probabilities[-1]
            del self.probabilities[-1]

        # if currentStateLabel in self.indexs:
        #     variables_lts[currentStateLabel] = {}
        #     if ":" in self.indexs[currentStateLabel]:
        #         variables_lts[currentStateLabel]["var"] = self.indexs[currentStateLabel][0]
        #         variables_lts[currentStateLabel]["start"] = self.indexs[currentStateLabel][2]
        #         variables_lts[currentStateLabel]["end"] = self.indexs[currentStateLabel][5]
        #     elif ".." in self.indexs[currentStateLabel]:
        #         variables_lts[currentStateLabel]["start"] = self.indexs[currentStateLabel][0]
        #         variables_lts[currentStateLabel]["end"] = self.indexs[currentStateLabel][3]

        #     print("==========================")
        #     print(variables_lts)
        #     print("==========================")

        #     for x in range(int(variables_lts[currentStateLabel]["start"]),int(variables_lts[currentStateLabel]["end"])+1):
        #         if transition in self.indexs:
        #             variables_lts[transition] = {}
        #             if ".." not in self.indexs[transition]:
        #                 new_transition = transition + "." + str(x)
        #                 new_process_label = proxStateLabel + "." + str(x)
        #                 new_process = None
        #                 if new_process_label not in self.process_labels:
        #                     new_process = len(self.process_labels)
        #                     self.process_labels[new_process_label] = new_process
        #                 else:
        #                     new_process = self.process_labels[new_process_label]
        #                 new_process = str(new_process)
        #                 self.writeDictLTS( guard, probability, currentState, new_transition, currentStateLabel, \
        #                     new_process, new_process_label)

        #             elif ":" in self.indexs[transition]:
        #                 variables_lts[transition]["var"] = self.indexs[transition][0]
        #                 variables_lts[transition]["start"] = self.indexs[transition][2]
        #                 variables_lts[transition]["end"] = self.indexs[transition][5]
        #             elif ".." in self.indexs[transition]:
        #                 variables_lts[transition]["start"] = self.indexs[transition][0]
        #                 variables_lts[transition]["end"] = self.indexs[transition][3]

        #             print("==========================")
        #             print(variables_lts)
        #             print("==========================")

        #             for x in range(int(variables_lts[transition]["start"]),int(variables_lts[transition]["end"])+1):
        #                 if proxStateLabel in self.indexs:
        #                     variables_lts[proxStateLabel] = {}
        #                     if ":" in self.indexs[proxStateLabel]:
        #                         variables_lts[proxStateLabel]["var"] = self.indexs[proxStateLabel][0]
        #                         variables_lts[proxStateLabel]["start"] = self.indexs[proxStateLabel][2]
        #                         variables_lts[proxStateLabel]["end"] = self.indexs[proxStateLabel][5]
        #                     elif ".." in self.indexs[proxStateLabel]:
        #                         variables_lts[proxStateLabel]["start"] = self.indexs[proxStateLabel][0]
        #                         variables_lts[proxStateLabel]["end"] = self.indexs[proxStateLabel][3]
        #                     else:
        #                         new_transition = transition + "." + str(x)
        #                         new_process_label = proxStateLabel + "." + str(x)
        #                         new_process = None
        #                         if new_process_label not in self.process_labels:
        #                             new_process = len(self.process_labels)
        #                             self.process_labels[new_process_label] = new_process
        #                         else:
        #                             new_process = self.process_labels[new_process_label]
        #                         new_process = str(new_process)
        #                         self.writeDictLTS( guard, probability, currentState, new_transition, currentStateLabel, \
        #                             new_process, new_process_label)

        if currentStateLabel in self.indexs:
            self.currentStateRange(currentState, transition, currentStateLabel, \
                            proxState, proxStateLabel)
        elif transition in self.indexs:
            self.transitionRange(currentState, transition, currentStateLabel, \
                            proxState, proxStateLabel)
        else:
            self.writeDictLTS( guard, probability, currentState, transition, currentStateLabel, \
                            proxState, proxStateLabel)

    def currentStateRange(self, currentState, transition, currentStateLabel, \
                            proxState, proxStateLabel):
        variables_lts = {}
        variables_lts[currentStateLabel] = {}
        if ":" in self.indexs[currentStateLabel]:
            variables_lts[currentStateLabel]["var"] = self.indexs[currentStateLabel][0]
            variables_lts[currentStateLabel]["start"] = self.indexs[currentStateLabel][2]
            variables_lts[currentStateLabel]["end"] = self.indexs[currentStateLabel][5]
        elif ".." in self.indexs[currentStateLabel]:
            variables_lts[currentStateLabel]["start"] = self.indexs[currentStateLabel][0]
            variables_lts[currentStateLabel]["end"] = self.indexs[currentStateLabel][3]

        print("==========================")
        print(variables_lts)
        print("==========================")

        for x in range(int(variables_lts[currentStateLabel]["start"]),int(variables_lts[currentStateLabel]["end"])+1):
            new_transition = transition + "." + str(x)
            new_process_label = currentStateLabel + "." + str(x)
            new_process = None
            if new_process_label not in self.process_labels:
                new_process = len(self.process_labels)
                self.process_labels[new_process_label] = new_process
            else:
                new_process = self.process_labels[new_process_label]
            new_process = str(new_process)
            # self.transitionRange(new_process, new_transition, new_process_label, \
            #                 proxState, proxStateLabel)
            self.writeDictLTS( None, None, new_process, new_transition, new_process_label, \
                        proxState, proxStateLabel)

    def transitionRange(self, currentState, transition, currentStateLabel, \
                            proxState, proxStateLabel):
        variables_lts = {}
        variables_lts[transition] = {}
        if ":" in self.indexs[transition]:
            variables_lts[transition]["var"] = self.indexs[transition][0]
            variables_lts[transition]["start"] = self.indexs[transition][2]
            variables_lts[transition]["end"] = self.indexs[transition][5]
        elif ".." in self.indexs[transition]:
            variables_lts[transition]["start"] = self.indexs[transition][0]
            variables_lts[transition]["end"] = self.indexs[transition][3]
        else:
            self.writeDictLTS( None, None, currentState, new_transition, currentStateLabel, \
                        new_process, new_process_label)
            return True

        print("==========================")
        print(variables_lts)
        print("==========================")

        for x in range(int(variables_lts[transition]["start"]),int(variables_lts[transition]["end"])+1):
            if proxStateLabel in self.indexs:
                variables_lts[proxStateLabel] = {}
                if ":" in self.indexs[proxStateLabel]:
                    variables_lts[proxStateLabel]["var"] = self.indexs[proxStateLabel][0]
                    variables_lts[proxStateLabel]["start"] = self.indexs[proxStateLabel][2]
                    variables_lts[proxStateLabel]["end"] = self.indexs[proxStateLabel][5]
                elif ".." in self.indexs[proxStateLabel]:
                    variables_lts[proxStateLabel]["start"] = self.indexs[proxStateLabel][0]
                    variables_lts[proxStateLabel]["end"] = self.indexs[proxStateLabel][3]
                else:
                    new_transition = transition + "." + str(x)
                    new_process_label = proxStateLabel + "." + str(x)
                    new_process = None
                    if new_process_label not in self.process_labels:
                        new_process = len(self.process_labels)
                        self.process_labels[new_process_label] = new_process
                    else:
                        new_process = self.process_labels[new_process_label]
                    new_process = str(new_process)
                    self.writeDictLTS( None, None, currentState, new_transition, currentStateLabel, \
                        new_process, new_process_label)

    def writeDictLTS(self, guard, probability, currentState, transition, currentStateLabel, \
                        proxState, proxStateLabel):
        """ Verifica se o estado de origem já exite no dict.
            Se não for o caso, ele cria um dict dentro do dict
            do LTS/PLTS para armazenar sua informações.
            Se já existe, adiciona mais uma transição de saída. """
        if not currentState in self.lts_dict['states']:
            self.lts_dict['states'][currentState] = \
                self.dict_states(len(self.lts_dict['states']), [transition], \
                    [], None, None, None, currentStateLabel)
        else:
            self.lts_dict['states'][currentState]['outPutTransitions'].append(transition)

        if not proxState in self.lts_dict['states']:
            self.lts_dict['states'][proxState] = \
                self.dict_states(len(self.lts_dict['states']), [], \
                    [transition], None, None, None, proxStateLabel)
        else:
            self.lts_dict['states'][proxState]['inPutTransitions'].append(transition)

        if transition in self.lts_dict['transitions']:
            self.lts_dict['transitions'][transition]['guard'] = guard
            self.lts_dict['transitions'][transition]['probability'] = probability
        else:
            self.lts_dict['transitions'][transition] = \
                self.dict_transitions(len(self.lts_dict['transitions']), \
                    currentState, proxState, transition, probability, guard)

    def primitive_process_body(self):

        result = self.process_body()
        result_lpd = True # result for local_process_defn

        startOrComma = self.comma()

        while startOrComma:
            result_lpd = result_lpd and self.local_process_defn()
            startOrComma = self.comma()
            

        result = result and result_lpd and self.point()

        return result


    def primitive_process(self):
        if self.upper_identifier():
            self.leftParentheses() and self.parameter_list() and self.rightParentheses()
            result = self.equal_operator() and self.primitive_process_body()
            return result
        else:
            return False

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=['POST'])
def get_value():
    json_info = request.get_json()
    print(json_info['data'])
    interpretador = Interpretador(json_info['data'])
    result = interpretador.primitive_process()
    pprint(interpretador.lts_dict, width=10)
    print()
    pprint(interpretador.parameters, width=10)
    pprint(interpretador.indexs, width=10)
    return jsonify(
                    {
                        'result': result,
                        'lts_dict': interpretador.lts_dict,
                        'parameters': interpretador.parameters
                    }
                )

if __name__ == '__main__':
    app.run(debug=True)