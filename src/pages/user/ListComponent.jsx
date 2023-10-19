import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Trans,
  withTranslation,
} from 'react-i18next';
import {
  Button,
} from '@react-ui-org/react-ui';
import { Link } from 'react-router-dom';
import routes from '../../routes';
import Layout from '../../components/Layout';
import { Users } from './_components/Users';
import styles from './user.scss';

class ListComponent extends React.Component {
  componentDidMount() {
    this.props.fetchUserList(false);
    this.props.fetchUserListPartial(false);
  }

  render() {
    const {
      history,
      isFetching,
      isFetchingPartial,
      token,
      userList,
      userListPartial,
      t,
    } = this.props;

    return (
      <Layout
        loading={isFetchingPartial}
        title={t('user:title.users')}
      >
        <div className={styles.actions}>
          <Button
            label={t('user:action.addUser')}
            onClick={() => history.push(routes.addUser)}
          />
        </div>
        <div className="mb-5">
          <Trans
            components={[
              <Link to={routes.userArchiveList} />,
            ]}
            i18nKey="user:text.usersDescription"
            t={t}
          />
        </div>
        <Users
          history={history}
          isFetching={isFetching}
          token={token}
          userList={userList}
          userListPartial={userListPartial}
        />
      </Layout>
    );
  }
}

ListComponent.propTypes = {
  fetchUserList: PropTypes.func.isRequired,
  fetchUserListPartial: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  isFetchingPartial: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  userList: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastApprovedWorkMonth: PropTypes.shape({
      month: PropTypes.number.isRequired,
      requiredTime: PropTypes.number.isRequired,
      workedTime: PropTypes.number.isRequired,
      year: PropTypes.shape({
        year: PropTypes.number.isRequired,
      }).isRequired,
    }),
    lastName: PropTypes.string.isRequired,
    supervisor: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
  })).isRequired,
  userListPartial: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    lastName: PropTypes.string.isRequired,
    supervisor: ImmutablePropTypes.mapContains({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
  })).isRequired,
};

export default withTranslation()(ListComponent);
