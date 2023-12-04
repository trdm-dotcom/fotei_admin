import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IPost } from 'app/shared/model/post.model';
import { getEntities as getPosts } from 'app/entities/post/post.reducer';
import { getEntity, updateEntity, createEntity, reset } from './report.reducer';
import { IReport } from 'app/shared/model/report.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IReportUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReportUpdate = (props: IReportUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { reportEntity, posts, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/report' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getPosts();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    if (errors.length === 0) {
      const entity = {
        ...reportEntity,
        ...values,
        post: posts.find(it => it.id.toString() === values.postId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="foteiAdminApp.report.home.createOrEditLabel" data-cy="ReportCreateUpdateHeading">
            <Translate contentKey="foteiAdminApp.report.home.createOrEditLabel">Create or edit a Report</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : reportEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="report-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="report-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="reasonLabel" for="report-reason">
                  <Translate contentKey="foteiAdminApp.report.reason">Reason</Translate>
                </Label>
                <AvField id="report-reason" data-cy="reason" type="text" name="reason" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="report-createdAt">
                  <Translate contentKey="foteiAdminApp.report.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="report-createdAt"
                  data-cy="createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.reportEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="report-updatedAt">
                  <Translate contentKey="foteiAdminApp.report.updatedAt">Updated At</Translate>
                </Label>
                <AvInput
                  id="report-updatedAt"
                  data-cy="updatedAt"
                  type="datetime-local"
                  className="form-control"
                  name="updatedAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.reportEntity.updatedAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="report-status">
                  <Translate contentKey="foteiAdminApp.report.status">Status</Translate>
                </Label>
                <AvField id="report-status" data-cy="status" type="text" name="status" />
              </AvGroup>
              <AvGroup>
                <Label for="report-post">
                  <Translate contentKey="foteiAdminApp.report.post">Post</Translate>
                </Label>
                <AvInput id="report-post" data-cy="post" type="select" className="form-control" name="postId">
                  <option value="" key="0" />
                  {posts
                    ? posts.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/report" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  posts: storeState.post.entities,
  reportEntity: storeState.report.entity,
  loading: storeState.report.loading,
  updating: storeState.report.updating,
  updateSuccess: storeState.report.updateSuccess,
});

const mapDispatchToProps = {
  getPosts,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReportUpdate);
