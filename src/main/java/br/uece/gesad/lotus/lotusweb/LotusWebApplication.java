package br.uece.gesad.lotus.lotusweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
public class LotusWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(LotusWebApplication.class, args);
    }
    @GetMapping("/")
    public String print(){

        return "OlÁ MUNDO";
    }
}
