import { Link } from 'react-router-dom';
import React from 'react';
import Layout from '../../components/Layout';
import SpecialApprovalList from '../../components/SpecialApprovalList';
import routes from '../../routes';
import styles from './specialApproval.scss';

const ListComponent = props => (
  <Layout title="Special approvals">
    <p className={styles.infoText}>
      Special approvals page shows you a list of work logs that are requested to be approved or
      rejected by a supervisor. If you want to see a list of all work logs for current and previous
      month, go to the&nbsp;
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link to={routes.recentSpecialApprovalList}>
        recent special approvals
      </Link>
      &nbsp;page.
    </p>
    <SpecialApprovalList {...props} />
  </Layout>
);

ListComponent.defaultProps = SpecialApprovalList.defaultProps;
ListComponent.propTypes = SpecialApprovalList.propTypes;

export default ListComponent;
