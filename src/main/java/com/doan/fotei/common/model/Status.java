package com.doan.fotei.common.model;

import com.doan.fotei.common.exceptions.FieldError;
import com.doan.fotei.common.exceptions.GeneralException;
import com.doan.fotei.common.exceptions.SubErrorsException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.CollectionUtils;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Status implements DefaultPartitionBody {

    private String code;
    private List<String> messageParams;
    private List<Error> params = new ArrayList<>();

    public Status(String code, List<String> messageParams) {
        this.code = code;
        this.messageParams = messageParams;
    }

    public Status add(Error error) {
        this.params.add(error);
        return this;
    }

    public GeneralException create() {
        if (CollectionUtils.isEmpty(this.params)) {
            return new GeneralException(this.code, messageParams);
        }
        SubErrorsException err = new SubErrorsException(this.code, this.messageParams);
        err
            .getErrors()
            .addAll(
                this.params.stream()
                    .map(error -> new FieldError(error.getCode(), error.getParam(), error.getMessageParams()))
                    .collect(Collectors.toList())
            );
        return err;
    }
}
