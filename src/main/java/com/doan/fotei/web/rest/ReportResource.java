package com.doan.fotei.web.rest;

import com.doan.fotei.common.model.Message;
import com.doan.fotei.common.model.Response;
import com.doan.fotei.config.AppConf;
import com.doan.fotei.domain.Report;
import com.doan.fotei.models.IUserReportStatistic;
import com.doan.fotei.models.response.UserReportStatisticResponse;
import com.doan.fotei.repository.ReportRepository;
import com.doan.fotei.service.KafkaProducerService;
import com.doan.fotei.web.rest.errors.BadRequestAlertException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.doan.fotei.domain.Report}.
 */
@RestController
@RequestMapping("/api")
public class ReportResource {

    private final Logger log = LoggerFactory.getLogger(ReportResource.class);

    private static final String ENTITY_NAME = "report";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReportRepository reportRepository;
    private final KafkaProducerService kafkaProducerService;
    private final AppConf appConf;
    private final ObjectMapper objectMapper;

    public ReportResource(
        ReportRepository reportRepository,
        KafkaProducerService kafkaProducerService,
        AppConf appConf,
        ObjectMapper objectMapper
    ) {
        this.reportRepository = reportRepository;
        this.kafkaProducerService = kafkaProducerService;
        this.appConf = appConf;
        this.objectMapper = objectMapper;
    }

    /**
     * {@code POST  /reports} : Create a new report.
     *
     * @param report the report to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new report, or with status {@code 400 (Bad Request)} if the report has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reports")
    public ResponseEntity<Report> createReport(@RequestBody Report report) throws URISyntaxException {
        log.debug("REST request to save Report : {}", report);
        if (report.getId() != null) {
            throw new BadRequestAlertException("A new report cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Report result = reportRepository.save(report);
        return ResponseEntity
            .created(new URI("/api/reports/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /reports/:id} : Updates an existing report.
     *
     * @param id the id of the report to save.
     * @param report the report to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated report,
     * or with status {@code 400 (Bad Request)} if the report is not valid,
     * or with status {@code 500 (Internal Server Error)} if the report couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/reports/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable(value = "id", required = false) final String id, @RequestBody Report report)
        throws URISyntaxException {
        log.debug("REST request to update Report : {}, {}", id, report);
        if (report.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, report.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Report result = reportRepository.save(report);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, report.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /reports/:id} : Partial updates given fields of an existing report, field will ignore if it is null
     *
     * @param id the id of the report to save.
     * @param report the report to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated report,
     * or with status {@code 400 (Bad Request)} if the report is not valid,
     * or with status {@code 404 (Not Found)} if the report is not found,
     * or with status {@code 500 (Internal Server Error)} if the report couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/reports/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Report> partialUpdateReport(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Report report
    ) throws URISyntaxException {
        log.debug("REST request to partial update Report partially : {}, {}", id, report);
        if (report.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, report.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Report> result = reportRepository
            .findById(report.getId())
            .map(
                existingReport -> {
                    if (report.getReason() != null) {
                        existingReport.setReason(report.getReason());
                    }
                    if (report.getCreatedAt() != null) {
                        existingReport.setCreatedAt(report.getCreatedAt());
                    }
                    if (report.getUpdatedAt() != null) {
                        existingReport.setUpdatedAt(report.getUpdatedAt());
                    }
                    if (report.getStatus() != null) {
                        existingReport.setStatus(report.getStatus());
                    }

                    return existingReport;
                }
            )
            .map(reportRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, report.getId()));
    }

    /**
     * {@code GET  /reports} : get all the reports.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reports in body.
     */
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports(Pageable pageable) {
        log.debug("REST request to get a page of Reports");
        Page<Report> page = reportRepository.findByStatus("pending", pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reports/:id} : get the "id" report.
     *
     * @param id the id of the report to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the report, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/reports/{id}")
    public ResponseEntity<Report> getReport(@PathVariable String id) {
        log.debug("REST request to get Report : {}", id);
        Optional<Report> report = reportRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(report);
    }

    /**
     * {@code DELETE  /reports/:id} : delete the "id" report.
     *
     * @param id the id of the report to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/reports/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable String id) {
        log.debug("REST request to delete Report : {}", id);
        reportRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }

    @DeleteMapping("/reports/{id}/reject")
    public ResponseEntity<Void> rejectReport(@PathVariable String id) {
        log.debug("REST request to reject Report : {}", id);
        Optional<Report> opt = reportRepository.findById(id);
        if (opt.isEmpty()) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Report report = opt.get();
        report.setStatus("rejected");
        this.reportRepository.save(report);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createAlert(applicationName, applicationName + "." + ENTITY_NAME + ".rejected", id))
            .build();
    }

    @PutMapping("/reports/{id}/approve")
    @Transactional
    public ResponseEntity<Void> approveReport(@PathVariable String id) {
        log.debug("REST request to approve Report : {}", id);
        Optional<Report> opt = reportRepository.findById(id);
        if (opt.isEmpty()) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Report report = opt.get();
        try {
            Map<String, String> data = new HashMap<>() {
                {
                    put("post", report.getPost().getId());
                }
            };
            CompletableFuture<Message> future =
                this.kafkaProducerService.sendAsyncRequest(
                        this.appConf.getTopics().getCore(),
                        "internal:/api/v1/social/post/delete",
                        appConf.getNodeId(),
                        data,
                        20000
                    );
            Message message = future.get();
            Response response = Message.getData(objectMapper, message, Response.class);
            if (response.getStatus() != null) {
                throw new RuntimeException(response.getStatus().getCode());
            }
        } catch (Exception e) {
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, null);
        }
        List<Report> reports =
            this.reportRepository.findByPostIdAndIdNot(new ObjectId(report.getPost().getId()), new ObjectId(report.getId()));
        reports.forEach(
            rp -> {
                rp.setStatus("rejected");
            }
        );
        report.setStatus("approved");
        reports.add(report);
        System.out.println(reports);
        this.reportRepository.saveAll(reports);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createAlert(applicationName, applicationName + "." + ENTITY_NAME + ".approved", id))
            .build();
    }
}
