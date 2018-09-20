import { connect } from 'react-redux';
import { selectJwtToken } from '../../resources/auth';
import {
  fetchBusinessTripWorkLog,
  markBusinessTripWorkLogApproved,
  markBusinessTripWorkLogRejected,
  selectBusinessTripWorkLog,
  selectBusinessTripWorkLogMeta,
} from '../../resources/businessTripWorkLog';
import {
  fetchHomeOfficeWorkLog,
  markHomeOfficeWorkLogApproved,
  markHomeOfficeWorkLogRejected,
  selectHomeOfficeWorkLog,
  selectHomeOfficeWorkLogMeta,
} from '../../resources/homeOfficeWorkLog';
import {
  fetchOvertimeWorkLog,
  markOvertimeWorkLogApproved,
  markOvertimeWorkLogRejected,
  selectOvertimeWorkLog,
  selectOvertimeWorkLogMeta,
} from '../../resources/overtimeWorkLog';
import {
  fetchTimeOffWorkLog,
  markTimeOffWorkLogApproved,
  markTimeOffWorkLogRejected,
  selectTimeOffWorkLog,
  selectTimeOffWorkLogMeta,
} from '../../resources/timeOffWorkLog';
import {
  fetchVacationWorkLog,
  markVacationWorkLogApproved,
  markVacationWorkLogRejected,
  selectVacationWorkLog,
  selectVacationWorkLogMeta,
} from '../../resources/vacationWorkLog';
import {
  fetchRecentSpecialApprovalList,
  selectRecentSpecialApprovalList,
  selectRecentSpecialApprovalListMeta,
} from '../../resources/workMonth';
import RecentListComponent from './RecentListComponent';

const mapStateToProps = (state) => {
  const businessTripWorkLogMeta = selectBusinessTripWorkLogMeta(state);
  const homeOfficeWorkLogMeta = selectHomeOfficeWorkLogMeta(state);
  const overtimeWorkLogMeta = selectOvertimeWorkLogMeta(state);
  const timeOffWorkLogMeta = selectTimeOffWorkLogMeta(state);
  const vacationWorkLogMeta = selectVacationWorkLogMeta(state);
  const specialApprovalListMeta = selectRecentSpecialApprovalListMeta(state);

  return ({
    businessTripWorkLog: selectBusinessTripWorkLog(state),
    homeOfficeWorkLog: selectHomeOfficeWorkLog(state),
    isFetching: specialApprovalListMeta.isFetching,
    isPosting: businessTripWorkLogMeta.isPosting
      || homeOfficeWorkLogMeta.isPosting
      || overtimeWorkLogMeta.isPosting
      || timeOffWorkLogMeta.isPosting
      || vacationWorkLogMeta.isPosting,
    overtimeWorkLog: selectOvertimeWorkLog(state),
    specialApprovalList: selectRecentSpecialApprovalList(state),
    timeOffWorkLog: selectTimeOffWorkLog(state),
    token: selectJwtToken(state),
    vacationWorkLog: selectVacationWorkLog(state),
  });
};

const mapDispatchToProps = dispatch => ({
  fetchBusinessTripWorkLog: id => dispatch(fetchBusinessTripWorkLog(id)),
  fetchHomeOfficeWorkLog: id => dispatch(fetchHomeOfficeWorkLog(id)),
  fetchOvertimeWorkLog: id => dispatch(fetchOvertimeWorkLog(id)),
  fetchSpecialApprovalList: uid => dispatch(fetchRecentSpecialApprovalList(uid)),
  fetchTimeOffWorkLog: id => dispatch(fetchTimeOffWorkLog(id)),
  fetchVacationWorkLog: id => dispatch(fetchVacationWorkLog(id)),
  markBusinessTripWorkLogApproved: id => dispatch(markBusinessTripWorkLogApproved(id)),
  markBusinessTripWorkLogRejected: (id, data) =>
    dispatch(markBusinessTripWorkLogRejected(id, data)),
  markHomeOfficeWorkLogApproved: id => dispatch(markHomeOfficeWorkLogApproved(id)),
  markHomeOfficeWorkLogRejected: (id, data) => dispatch(markHomeOfficeWorkLogRejected(id, data)),
  markOvertimeWorkLogApproved: id => dispatch(markOvertimeWorkLogApproved(id)),
  markOvertimeWorkLogRejected: (id, data) => dispatch(markOvertimeWorkLogRejected(id, data)),
  markTimeOffWorkLogApproved: id => dispatch(markTimeOffWorkLogApproved(id)),
  markTimeOffWorkLogRejected: (id, data) => dispatch(markTimeOffWorkLogRejected(id, data)),
  markVacationWorkLogApproved: id => dispatch(markVacationWorkLogApproved(id)),
  markVacationWorkLogRejected: (id, data) => dispatch(markVacationWorkLogRejected(id, data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentListComponent);