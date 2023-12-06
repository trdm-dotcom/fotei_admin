package com.doan.fotei.common.exceptions;

import java.util.Arrays;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneralException extends RuntimeException {

    protected String code = "INTERNAL_SERVER_ERROR";
    protected List<String> messageParams;
    protected Throwable source;

    public GeneralException(String code, String... params) {
        this.code = code;
        this.messageParams = params == null ? null : Arrays.asList(params);
    }

    public GeneralException(String code, List<String> messageParams) {
        this.code = code;
        this.messageParams = messageParams;
    }

    @Override
    public String getMessage() {
        return this.code;
    }

    public GeneralException source(Throwable source) {
        this.source = source;
        return this;
    }

    @Override
    public synchronized Throwable getCause() {
        return this.source;
    }
}
