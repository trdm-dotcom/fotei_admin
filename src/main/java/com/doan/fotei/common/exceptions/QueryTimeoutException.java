package com.doan.fotei.common.exceptions;

public class QueryTimeoutException extends GeneralException {

    public QueryTimeoutException() {
        super("QUERY_TIMEOUT");
    }
}
