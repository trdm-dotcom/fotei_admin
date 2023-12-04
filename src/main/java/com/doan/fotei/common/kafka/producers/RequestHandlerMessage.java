package com.doan.fotei.common.kafka.producers;

import com.doan.fotei.common.model.Message;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.ToString;

@JsonDeserialize(using = RequestHandlerMessageDeserializer.class)
@Data
@ToString(callSuper = true)
public class RequestHandlerMessage<T> extends Message<T> {}
