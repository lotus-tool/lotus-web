if ( words[i][0].toUpperCase() == words[i][0] ){

		// primitive_process :: = upper_identifier [ "(" parameter_list ")" ] "=" primitive_process_body

		i += 1;
		
		switch (words[i]) {

			case "(":

				// parameter list

				// parameter_list ::= parameter {"," parameter }

				// parameter ::= upper_identifier "=" integer_value

				i += 1;

				while ( true ){

					if ( words[i][0].toUpperCase() == words[i][0] ){

						i += 1;

						if ( words[i] == "=" ){

							i += 1;

							if ( parseInt(words[i]) == words[i] ){

								// verificar se já não existe o parametro

								parameter_list.push({ "name" : words[i-2], "value" : words[i] });

							}

						}

					}

					i += 1

					if ( words[i] == "," ) { i += 1 };
					if ( words[i] == ")" ) { i += 1 ; break };

				}

				console.log(parameter_list);

			case "=":

				// process_body ::= "(" choices ")" | local_process_name | conditional
				
				i += 1;

				while (true){

					switch ( words[i] ) {
						case "(":
							
							// choices ::= choice { "|" choice }
							// choice ::= [when boolean_expression ] action_label_part "->" process_body

							i += 1;

							if ( words[i] == "when" ){

							}else if ( words[i][0].toLowerCase() == words[i][0] ) {
								
								// action

								actions.push(words[i]);

								console.log(actions);

								i += 1;

								if ( words[i] == "->" ){

									// process_body

									i += 1;

								}

							}

							break;

						case "if":

							// conditional ::= if boolean_expression then process_body [ else process_body ]

							break;

						default:

							if ( words[i][0].toUpperCase() == words[i][0] ){

								// local_process_name ::= upper_identifier [ index ] | STOP | ERROR

								processes.push(words[i]);

								console.log(processes);

								i += 1;

							}else{
							
								words[i] = ")";

							}

							break;

					}

					if ( words[i] == ")" ){
						break;
					}

				}

				break;

			default:
				// statements_def
				break;
		}

	}