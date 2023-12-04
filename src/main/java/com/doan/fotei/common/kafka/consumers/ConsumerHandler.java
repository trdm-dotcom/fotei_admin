package com.doan.fotei.common.kafka.consumers;

import org.apache.kafka.clients.consumer.ConsumerRecord;

public interface ConsumerHandler<K, V> {
    public void handle(ConsumerRecord<K, V> record);
}
