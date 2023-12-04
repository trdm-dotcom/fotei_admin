import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity, rejectEntity } from './report.reducer';
import { faBan, faWindowClose } from '@fortawesome/free-solid-svg-icons';

export interface IReportDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReportDeleteDialog = (props: IReportDeleteDialogProps) => {
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

  const confirmReject = () => {
    props.rejectEntity(props.reportEntity.id);
  };

  const { reportEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm reject operation</ModalHeader>
      <ModalBody>
        <p>Are you sure you want to reject this report?</p>
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
        <Button id="jhi-confirm-delete-report" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmReject}>
          <FontAwesomeIcon icon={faWindowClose} /> <span className="d-none d-md-inline">Reject</span>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ report }: IRootState) => ({
  reportEntity: report.entity,
  updateSuccess: report.updateSuccess,
});

const mapDispatchToProps = { getEntity, rejectEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReportDeleteDialog);
