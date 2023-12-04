package com.doan.fotei.common.model;

public interface DefaultPartitionBody extends Body {
    default String getPartitionKey() {
        return null;
    }

    default String getMessageKey() {
        return this.getClass().getSimpleName();
    }
}
