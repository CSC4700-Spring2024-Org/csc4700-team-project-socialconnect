package com.example.socialconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SocialconnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(SocialconnectApplication.class, args);
	}

}
