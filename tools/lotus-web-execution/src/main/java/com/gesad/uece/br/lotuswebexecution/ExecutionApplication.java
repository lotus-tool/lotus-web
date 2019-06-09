package com.gesad.uece.br.lotuswebexecution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.function.Function;

@SpringBootApplication
public class ExecutionApplication {


	public static void main(String[] args) {
		SpringApplication.run(ExecutionApplication.class, args);
	}
}
