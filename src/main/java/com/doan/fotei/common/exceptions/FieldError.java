package com.doan.fotei.common.exceptions;

import java.util.Collections;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldError {

    private String code;
    private String param;
    private List<String> messageParams;

    public FieldError(String code, String param) {
        this.code = code;
        this.param = param;
        this.messageParams = Collections.singletonList(param);
    }
}
