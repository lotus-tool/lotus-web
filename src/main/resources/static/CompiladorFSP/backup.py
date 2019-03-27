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

            self.process_labels: dicionario para mapear label do processo no FSP para
                label do processo no LTS

            self.lts_dict = dicionário com as informações dos estados e das transições

        """

        self.words = words
        self.index_w = -1
        self.word = None
        self.trace = []
        self.states = []
        self.parameters = []
        self.transitions = []
        self.probabilities = []
        self.guards = []
        self.integers = []
        self.operators = []
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
            print("OK")
            self.trace.append("upper_identifier")
            print(len(self.process_labels))
            if self.word not in self.process_labels:
                self.process_labels[self.word] = len(self.process_labels)
            self.states.append(self.word)
            return True
        else:
            self.rowBackWord(1)
            return False

    def lower_identifier(self):
        self.updateWord()
        print("lower_identifier")
        if bool(re.compile("[a-z]\w*").match(self.word)):
            print("OK")
            self.trace.append("lower_identifier")
            self.transitions.append(self.word)
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
        return False
        # if self.integer_value():
        #     if self.point():
        #         return self.point() and self.integer_value()
        #     elif self.rightBrackets():
        #         self.rowBackWord()
        #         return True
        #     else:
        #         return False
        # elif self.lower_identifier():
        #     if self.asterisk():
        #         return self.integer_value()
        #     elif self.v_double_points():
        #         return self.integer_value() and self.point() \
        #             and self.point() and self.integer_value()
        #     else:
        #         return False
        # else:
        #     return False

    def index(self):
        return self.leftBrackets() and self.index_expression() and self.rightBrackets()

    def range(self):
        return self.upper_identifier() or \
            (self.integer_value() and self.point() and self.point() and self.integer_value())

    def index_range(self):
        return self.leftBrackets() and self.lower_identifier() and \
            self.v_double_points() and self.range() and self.rightBrackets()

    def index_label(self):
        return self.index() or self.index_range()

    def index_labels(self):
        result = False
        while self.index_label():
            result = True

        return result

    # ===================================== Action Label =====================================

    def simple_action_label(self):
        return self.lower_identifier() or self.index_labels()

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
        return self.action_label() or self.action_label_set()

    def local_process_name(self):
        if self.STOP() or self.ERROR():
            return True
        elif self.upper_identifier():
            bool_index = self.index()
            return True
        else:
            return False


    def process_body(self):
        return (self.leftParentheses() and self.choices() and \
            self.rightParentheses())

    def local_process_defn(self):
        return False
        # Falta implementar funcionamento no LTS
        # if self.upper_identifier():
        #     result = self.arroba() or (self.index() or self.index_range())
        #     if self.equal_operator() and self.process_body():
        #         return True
        #     else:
        #         return False
        # else:
        #     return False

    def choice(self):

        # self.process_labels armazena o numero do estado que ele
        # representará no LTS/PLTS

        result = self.guard_when() and self.probability() and \
            self.action_label_part() and self.action_prefix()

        # Se é um choice com processo como resulta da ação ou não
        bool_local_process_name = self.local_process_name()
        guard = None
        probability = None

        # Se o resultado da ação não for um processo, mas o corpo de 
        # um processo inteiro, ele cria um estado não determinado pelo usuário
        # para receber este e o proximo prefixo de ação.
        # EX: CLOCK ( M =1, B=6 ) = ( action1 -> ( action2 -> Process2 ) ).
        if bool_local_process_name == False:
            new_state = str(len(list(self.lts_dict['states'].keys())))
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

        bool_process_body = self.process_body()

        result = result and (bool_local_process_name or bool_process_body)

        if result == True:

            currentStateLabel = self.states[-2]
            currentState = str(self.process_labels[currentStateLabel])
            proxStateLabel = self.states[-1]
            proxState = str(self.process_labels[proxStateLabel])
            del self.states[-1]

            transition = self.transitions[-1]
            del self.transitions[-1]

            if len(self.guards) > 0 and guard == None:
                guard = self.guards[-1]
                del self.guards[-1]

            if len(self.probabilities) > 0 and probability == None:
                probability = self.probabilities[-1]
                del self.probabilities[-1]

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
            else:
                self.lts_dict['transitions'][transition] = \
                    self.dict_transitions(len(self.lts_dict['transitions']), \
                        currentState, proxState, transition, probability, guard)

            return True

        else:
            return False

    def choices(self):

        startOrPipe = True
        result = True

        while startOrPipe and result:
            result = result and self.choice()
            startOrPipe = self.PipeOr()

        return result

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
        result = self.upper_identifier() and self.leftParentheses() and \
            self.parameter_list() and self.rightParentheses() and \
            self.equal_operator() and self.primitive_process_body()
        return result

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=['POST'])
def get_value():
    json_info = request.get_json()
    print(json_info['data'])
    interpretador = Interpretador(json_info['data'])
    result = interpretador.primitive_process()
    # print(interpretador.trace)
    pprint(interpretador.lts_dict, width=10)
    print()
    pprint(interpretador.parameters, width=10)
    return jsonify(
                    {
                        'result': result,
                        'lts_dict': interpretador.lts_dict,
                        'parameters': interpretador.parameters
                    }
                )

if __name__ == '__main__':
    app.run(debug=True)