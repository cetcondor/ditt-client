import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import WorkLogCalendar from '../../components/WorkLogCalendar';
import Layout from '../../components/Layout';
import { localizedMoment } from '../../services/dateTimeService';
import { getWorkMonthByMonth } from '../../services/workLogService';

class IndexComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: localizedMoment(),
    };

    this.addWorkLog = this.addWorkLog.bind(this);
    this.deleteWorkLog = this.deleteWorkLog.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
  }

  componentDidMount() {
    this.props.fetchWorkHoursList(this.props.uid);
    this.props.fetchWorkMonthList(this.props.uid).then(() => {
      this.fetchWorkMonth(this.state.selectedDate);
    });
  }

  addWorkLog(data) {
    return this.props.addWorkLog(data).then((response) => {
      this.fetchWorkMonth(this.state.selectedDate);
      return response;
    });
  }

  deleteWorkLog(id) {
    return this.props.deleteWorkLog(id).then((response) => {
      this.fetchWorkMonth(this.state.selectedDate);
      return response;
    });
  }

  fetchWorkMonth(selectedDate) {
    const workMonth = getWorkMonthByMonth(selectedDate, this.props.workMonthList.toJS());

    if (workMonth) {
      return this.props.fetchWorkMonth(workMonth.id);
    }

    return null;
  }

  changeSelectedDate(selectedDate) {
    this.fetchWorkMonth(selectedDate).then(() => this.setState({ selectedDate }));
  }

  render() {
    return (
      <Layout title="Work logs" loading={this.props.isFetching}>
        <WorkLogCalendar
          addWorkLog={this.addWorkLog}
          deleteWorkLog={this.deleteWorkLog}
          changeSelectedDate={this.changeSelectedDate}
          isPostingWorkLog={this.props.isPosting}
          selectedDate={this.state.selectedDate}
          workHoursList={this.props.workHoursList}
          workMonth={this.props.workMonth}
          workMonthList={this.props.workMonthList}
        />
      </Layout>
    );
  }
}

IndexComponent.defaultProps = {
  uid: null,
  workMonth: null,
};

IndexComponent.propTypes = {
  addWorkLog: PropTypes.func.isRequired,
  deleteWorkLog: PropTypes.func.isRequired,
  fetchWorkHoursList: PropTypes.func.isRequired,
  fetchWorkMonth: PropTypes.func.isRequired,
  fetchWorkMonthList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  uid: PropTypes.number,
  workHoursList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    month: PropTypes.number.isRequired,
    requiredHours: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
  workMonth: ImmutablePropTypes.mapContains({
    id: PropTypes.number.isRequired,
    month: PropTypes.shape.isRequired,
    workLogs: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      endTime: PropTypes.shape.isRequired,
      id: PropTypes.number.isRequired,
      startTime: PropTypes.shape.isRequired,
    })).isRequired,
    year: PropTypes.number,
  }),
  workMonthList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    id: PropTypes.number.isRequired,
    month: PropTypes.shape.isRequired,
    year: PropTypes.number.isRequired,
  })).isRequired,
};

export default IndexComponent;
