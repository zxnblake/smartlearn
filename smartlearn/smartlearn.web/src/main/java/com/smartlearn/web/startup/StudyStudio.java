package com.smartlearn.web.startup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource(locations={"classpath:spring.xml"})
public class StudyStudio {
    private static Logger logger = LoggerFactory.getLogger(StudyStudio.class);

    public static void main(String[] args) {
        try {
            SpringApplication.run(StudyStudio.class, args);
        } catch (Exception e) {
            logger.error("Failed to init the graph server: " + e.getMessage(), e);
        }

    }

}
