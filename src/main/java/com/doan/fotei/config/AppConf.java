package com.doan.fotei.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
@Data
public class AppConf {

    private String nodeId;
    private String clusterId;
    private String kafkaUrl;
    private Integer maxThread;
    private Topic topics;

    @Data
    public static class Topic {

        private String user;
        private String core;
    }

    public String getKafkaBootstraps() {
        return this.kafkaUrl.replace(";", ",");
    }
}
