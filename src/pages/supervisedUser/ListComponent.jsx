import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import jwt from 'jsonwebtoken';
import { Link } from 'react-router-dom';
import { Table } from 'react-ui';
import Layout from '../../components/Layout';
import routes from '../../routes';
import {
  STATUS_APPROVED,
  STATUS_OPENED,
  STATUS_WAITING_FOR_APPROVAL,
} from '../../resources/workMonth';
import {
  createDate,
  toMonthYearFormat,
} from '../../services/dateTimeService';
import styles from './supervisedUser.scss';

class ListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tableSortColumn: 'lastName',
      tableSortDirection: 'asc',
    };
  }

  componentDidMount() {
    if (this.props.token) {
      const decodedToken = jwt.decode(this.props.token);

      if (decodedToken) {
        this.props.fetchSupervisedUserList(
          decodedToken.uid,
          {
            order: {
              column: this.state.tableSortColumn,
              direction: this.state.tableSortDirection,
            },
          }
        );
      }
    }
  }

  render() {
    return (
      <Layout title="Supervised users" loading={this.props.isFetching}>
        {this.props.supervisedUserList.count() > 0 ? (
          <Table
            columns={[
              {
                format: row => `${row.firstName} ${row.lastName}`,
                isSortable: true,
                label: 'Name',
                name: 'lastName',
              },
              {
                format: (row) => {
                  const waitingForApproval = row.workMonths.filter(workMonth => (
                    workMonth.status === STATUS_WAITING_FOR_APPROVAL
                  ));

                  if (!waitingForApproval.length) {
                    return 'No';
                  }

                  const waitingForApprovalLinks = waitingForApproval.map(workMonth => (
                    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                    <Link
                      className={styles.waitingForApprovalLink}
                      key={workMonth.id}
                      to={
                        routes.supervisedUserWorkLogWithDate
                          .replace(':id', row.id)
                          .replace(':year', workMonth.year)
                          .replace(':month', workMonth.month)
                      }
                    >
                      {toMonthYearFormat(createDate(workMonth.year, workMonth.month - 1, 1))}
                    </Link>
                  ));

                  return (
                    <div>
                      Yes | {waitingForApprovalLinks}
                    </div>
                  );
                },
                label: 'Need approval',
                name: 'needApproval',
              },
              {
                format: row => (
                  /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                  <Link to={routes.supervisedUserWorkLog.replace(':id', row.id)}>
                    Show work log
                  </Link>
                ),
                label: 'Show work log',
                name: 'showWorkLog',
              },
            ]}
            rows={this.props.supervisedUserList.toJS()}
            sort={{
              changeHandler: (column, direction) => {
                if (this.props.token) {
                  const decodedToken = jwt.decode(this.props.token);

                  if (decodedToken) {
                    const orderDirection = direction === 'asc' ? 'desc' : 'asc';

                    this.props.fetchSupervisedUserList(
                      decodedToken.uid,
                      {
                        order: {
                          column,
                          direction: orderDirection,
                        },
                      }
                    ).then(() => {
                      this.setState({
                        tableSortColumn: column,
                        tableSortDirection: orderDirection,
                      });
                    });
                  }
                }
              },
              column: this.state.tableSortColumn,
              direction: this.state.tableSortDirection,
            }}
          />
        ) : (
          <div>
            You do not seem to be supervising anyone.
            Please contact HR in case you think this is a mistake.
          </div>
        )}
      </Layout>
    );
  }
}

ListComponent.propTypes = {
  fetchSupervisedUserList: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  supervisedUserList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
    supervisor: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
    workMonths: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      status: PropTypes.oneOf([
        STATUS_APPROVED,
        STATUS_OPENED,
        STATUS_WAITING_FOR_APPROVAL,
      ]).isRequired,
    })).isRequired,
  })).isRequired,
  token: PropTypes.string.isRequired,
};

export default ListComponent;
