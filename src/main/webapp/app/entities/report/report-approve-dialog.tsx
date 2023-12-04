import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity, approveEntity } from './report.reducer';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';

export interface IReportDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReportApproveDialog = (props: IReportDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/report' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmApprove = () => {
    props.approveEntity(props.reportEntity.id);
  };

  const { reportEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm approve operation</ModalHeader>
      <ModalBody>
        <p>This post will be deleted. Are you sure you want to approve this report?</p>
        <table>
          <tr>
            <td>Reason:</td>
            <td>{reportEntity.reason}</td>
          </tr>
          <tr>
            <td>Caption:</td>
            <td>{reportEntity.post ? reportEntity.post.caption : null}</td>
          </tr>
          <tr>
            <td>Post:</td>
            <td>
              <img src={reportEntity.post ? reportEntity.post.source : null} width="100" />
            </td>
          </tr>
        </table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon={faBan} /> <span className="d-none d-md-inline">Back</span>
        </Button>
        <Button id="jhi-confirm-delete-report" data-cy="entityConfirmDeleteButton" color="warning" onClick={confirmApprove}>
          <FontAwesomeIcon icon={faCheck} /> <span className="d-none d-md-inline">Approve</span>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ report }: IRootState) => ({
  reportEntity: report.entity,
  updateSuccess: report.updateSuccess,
});

const mapDispatchToProps = { getEntity, approveEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReportApproveDialog);
