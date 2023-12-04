import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './report.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { faArrowLeft, faBan, faCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons';

export interface IReportDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReportDetail = (props: IReportDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { reportEntity } = props;
  return (
    <Row>
      <Col md="12">
        <h2 data-cy="reportDetailsHeading">
          <Translate contentKey="foteiAdminApp.report.detail.title">Report</Translate>
        </h2>
      </Col>
      <Col md="8">
        <dl className="jh-entity-details">
          <dt>
            <span id="reason">
              <Translate contentKey="foteiAdminApp.report.reason">Reason</Translate>
            </span>
          </dt>
          <dd>{reportEntity.reason}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="foteiAdminApp.report.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{reportEntity.createdAt ? <TextFormat value={reportEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="foteiAdminApp.report.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{reportEntity.updatedAt ? <TextFormat value={reportEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
        </dl>
      </Col>
      <Col md="4">
        <dl className="jh-entity-details">
          <dt>
            <span id="caption">Caption</span>
          </dt>
          <dd>{reportEntity.post ? reportEntity.post.caption : null}</dd>
          <dt>
            <span id="post">Post</span>
          </dt>
          <dd>
            <img src={reportEntity.post ? reportEntity.post.source : null} width="50%" />
          </dd>
        </dl>
      </Col>
      <Col md="12">
        <div className="btn-group flex-btn-group-container">
          <Button tag={Link} to="/report" replace color="info">
            <FontAwesomeIcon icon={faArrowLeft} /> <span className="d-none d-md-inline">Back</span>
          </Button>
          <Button tag={Link} to={`/report/${reportEntity.id}/approve`} color="warning">
            <FontAwesomeIcon icon={faCheck} /> <span className="d-none d-md-inline">Approve</span>
          </Button>
          <Button tag={Link} to={`/report/${reportEntity.id}/reject`} color="danger">
            <FontAwesomeIcon icon={faWindowClose} /> <span className="d-none d-md-inline">Reject</span>
          </Button>
        </div>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ report }: IRootState) => ({
  reportEntity: report.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReportDetail);
