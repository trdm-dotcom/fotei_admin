import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { addReport, getEntities } from './report.reducer';
import { IReport } from 'app/shared/model/report.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { faCheck, faEye, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { getSocket } from 'app/socket';

export interface IReportProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Report = (props: IReportProps) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const { reportList, match, loading, totalItems } = props;

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );

  useEffect(() => {
    socket.on('post.report', (data: IReport) => {
      dispatch(props.addReport(data));
    });
  }, []);

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  return (
    <div>
      <h2 id="report-heading" data-cy="ReportHeading">
        <Translate contentKey="foteiAdminApp.report.home.title">Reports</Translate>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
          </Button>
        </div>
      </h2>
      <div className="table-responsive">
        {reportList && reportList.length > 0 ? (
          <Table hover responsive>
            <thead>
              <tr>
                <th className="hand">Post</th>
                <th className="hand">Caption</th>
                <th className="hand">Reason</th>
                <th className="hand" onClick={sort('updatedAt')}>
                  Created At <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reportList.map((report, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <img src={report.post.source} width="100" />
                  </td>
                  <td>
                    <img src={report.post.caption} />
                  </td>
                  <td>{report.reason}</td>
                  <td>{report.createdAt ? <TextFormat type="date" value={report.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${report.id}`} color="info">
                        <FontAwesomeIcon icon={faEye} /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${report.id}/approve?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="warning"
                      >
                        <FontAwesomeIcon icon={faCheck} /> <span className="d-none d-md-inline">Approve</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${report.id}/reject?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                      >
                        <FontAwesomeIcon icon={faWindowClose} /> <span className="d-none d-md-inline">Reject</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="foteiAdminApp.report.home.notFound">No Reports found</Translate>
            </div>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={reportList && reportList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = ({ report }: IRootState) => ({
  reportList: report.entities,
  loading: report.loading,
  totalItems: report.totalItems,
});

const mapDispatchToProps = {
  getEntities,
  addReport,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Report);
