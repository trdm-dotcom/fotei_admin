import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Report from './report';
import ReportDetail from './report-detail';
import ReportDeleteDialog from './report-reject-dialog';
import ReportApproveDialog from './report-approve-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReportDetail} />
      <ErrorBoundaryRoute path={match.url} component={Report} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/reject`} component={ReportDeleteDialog} />
    <ErrorBoundaryRoute exact path={`${match.url}/:id/approve`} component={ReportApproveDialog} />
  </>
);

export default Routes;
