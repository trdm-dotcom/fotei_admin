package com.doan.fotei.models.response;

import lombok.Data;

@Data
public class UserReportStatisticResponse {

    private Long userId;
    private Long totalReport;
    private Long totalReportApproved;
}
