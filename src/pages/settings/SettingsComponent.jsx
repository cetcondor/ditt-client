import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  List,
  ListItem,
  Modal,
  TextArea,
  TextField,
} from '@react-ui-org/react-ui';
import { withTranslation } from 'react-i18next';
import {
  Icon,
  LoadingIcon,
} from '../../components/Icon';
import Layout from '../../components/Layout';
import {
  createDate,
  toDayMonthYearFormat,
  toMomentDateTimeFromDayMonth,
} from '../../services/dateTimeService';
import { validateSupportedYear } from '../../services/validatorService';
import styles from './Settings.scss';

class SettingsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        holidays: '',
        year: null,
      },
      formValidity: {
        elements: {
          holidays: null,
          year: null,
        },
        isValid: false,
      },
      openedYears: [],
      showAddYearDialog: false,
      showEditYearDialog: false,
    };

    this.closeAddYearDialog = this.closeAddYearDialog.bind(this);
    this.closeEditYearDialog = this.closeEditYearDialog.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.openAddYearDialog = this.openAddYearDialog.bind(this);
    this.renderYearsAndHolidaysBox = this.renderYearsAndHolidaysBox.bind(this);
  }

  componentDidMount() {
    this.props.fetchConfig();
  }

  onChange(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const formData = { ...prevState.formData };
      formData[eventTarget.id] = eventTarget.value;

      return { formData };
    });
  }

  onChangeOpenedYear(supportedYear) {
    const { openedYears } = this.state;
    const changedOpenedYears = [...openedYears];

    const foundIndex = openedYears.indexOf(supportedYear);

    if (foundIndex === -1) {
      changedOpenedYears.push(supportedYear);
    } else {
      changedOpenedYears.splice(foundIndex, 1);
    }

    this.setState({ openedYears: changedOpenedYears });
  }

  onAdd() {
    const {
      config,
      saveConfig,
      t,
    } = this.props;
    const { formData } = this.state;
    const supportedYears = config.get('supportedYears').toJS();
    const supportedHolidays = config.get('supportedHolidays').toJS();

    const formValidity = validateSupportedYear(t, formData, supportedYears, true);

    this.setState({ formValidity });

    if (formValidity.isValid) {
      supportedYears.push(formData.year);

      if (formData.holidays !== null) {
        formData.holidays.split('\n').forEach((line) => {
          if (line.trim() === '') {
            return;
          }

          const holiday = toMomentDateTimeFromDayMonth(line);
          supportedHolidays.push(
            createDate(formData.year, holiday.get('month'), holiday.get('date')),
          );
        });
      }

      saveConfig({
        supportedHolidays,
        supportedYears,
      }).then(this.closeAddYearDialog);
    }
  }

  onEdit() {
    const {
      config,
      saveConfig,
      t,
    } = this.props;
    const { formData } = this.state;
    const supportedYears = config.get('supportedYears').toJS();
    const supportedHolidays = config.get('supportedHolidays').toJS()
      .filter((holiday) => holiday.year() !== formData.year);

    const formValidity = validateSupportedYear(t, formData, supportedYears, false);

    this.setState({ formValidity });

    if (formValidity.isValid) {
      if (formData.holidays !== null) {
        formData.holidays.split('\n').forEach((line) => {
          if (line.trim() === '') {
            return;
          }

          const holiday = toMomentDateTimeFromDayMonth(line);
          supportedHolidays.push(
            createDate(formData.year, holiday.get('month'), holiday.get('date')),
          );
        });
      }

      saveConfig({
        supportedHolidays,
        supportedYears,
      }).then(this.closeEditYearDialog);
    }
  }

  openAddYearDialog() {
    this.setState({
      showAddYearDialog: true,
    });
  }

  closeAddYearDialog() {
    this.setState({ showAddYearDialog: false });
    this.resetForm();
  }

  openEditYearDialog(year) {
    const { config } = this.props;
    const holidays = config.get('supportedHolidays')
      .filter((holiday) => holiday.year() === year)
      .map((holiday) => holiday.format('DD.MM.'))
      .reduce((acc, holiday) => `${acc}\n${holiday}`);

    this.setState({
      formData: {
        holidays,
        year,
      },
      showEditYearDialog: true,
    });
  }

  closeEditYearDialog() {
    this.setState({ showEditYearDialog: false });
    this.resetForm();
  }

  resetForm() {
    this.setState({
      formData: {
        holidays: '',
        year: null,
      },
      formValidity: {
        elements: {
          holidays: null,
          year: null,
        },
        isValid: false,
      },
    });
  }

  renderYearsAndHolidaysBox(supportedYear) {
    const {
      config,
      t,
    } = this.props;
    const { openedYears } = this.state;
    const isOpened = openedYears.includes(supportedYear);

    const holidays = config.get('supportedHolidays').toJS()
      .filter((holiday) => holiday.year() === supportedYear)
      .map((holiday) => toDayMonthYearFormat(holiday));

    return (
      <div
        className={styles.yearsAndHolidaysHeader}
        key={supportedYear}
      >
        <div className={styles.yearsAndHolidaysHeaderBox}>
          <h3 className={styles.yearTitle}>
            {supportedYear}
          </h3>
          <div className={styles.yearButtonsWrapper}>
            <div className={styles.yearEditButtonWrapper}>
              <Button
                beforeLabel={<Icon icon="edit" />}
                label={t('settings:action.editYear')}
                labelVisibility="none"
                onClick={() => this.openEditYearDialog(supportedYear)}
                priority="outline"
              />
            </div>
            <Button
              beforeLabel={isOpened ? <Icon icon="expand_less" /> : <Icon icon="expand_more" />}
              label=""
              labelVisibility="none"
              onClick={() => this.onChangeOpenedYear(supportedYear)}
              priority="outline"
            />
          </div>
        </div>
        {isOpened && (
          <div className={styles.yearsAndHolidaysContentBox}>
            <p className={styles.holidaysTitle}>
              {t('config:element.holidays')}
              :
            </p>
            <p>
              {holidays.map((holiday) => (
                <span key={holiday}>
                  {holiday}
                  <br />
                </span>
              ))}
              {holidays.length === 0 && (
                <span>-</span>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  renderAddYearModal() {
    const {
      isPosting,
      t,
    } = this.props;

    return (
      <Modal
        actions={[
          {
            feedbackIcon: isPosting ? <LoadingIcon /> : null,
            label: t('general:action.save'),
            onClick: this.onAdd,
          },
        ]}
        onClose={this.closeAddYearDialog}
        title={t('settings:title.addYear')}
      >
        <form className={styles.centeredLayout}>
          <List>
            <ListItem>
              <TextField
                id="year"
                label={t('config:element.year')}
                onChange={this.onChange}
                required
                type="number"
                validationState={this.state.formValidity.elements.year ? 'invalid' : null}
                validationText={this.state.formValidity.elements.year}
                value={this.state.formData.year || ''}
              />
            </ListItem>
            <ListItem>
              <TextArea
                id="holidays"
                label={t('config:element.holidays')}
                onChange={this.onChange}
                required
                validationState={this.state.formValidity.elements.holidays ? 'invalid' : null}
                validationText={this.state.formValidity.elements.holidays}
                value={this.state.formData.holidays || ''}
              />
            </ListItem>
            <ListItem>
              <span className={styles.holidaysInfoText}>
                {t('settings:text.holidayInfoText')}
              </span>
            </ListItem>
          </List>
        </form>
      </Modal>
    );
  }

  renderEditYearModal() {
    const {
      isPosting,
      t,
    } = this.props;

    return (
      <Modal
        actions={[
          {
            feedbackIcon: isPosting ? <LoadingIcon /> : null,
            label: t('general:action.save'),
            onClick: this.onEdit,
          },
        ]}
        onClose={this.closeEditYearDialog}
        title={t('settings:title.editYear')}
      >
        <form className={styles.centeredLayout}>
          <List>
            <ListItem>
              <TextField
                disabled
                id="year"
                label={t('config:element.year')}
                onChange={this.onChange}
                required
                type="number"
                validationState={this.state.formValidity.elements.year ? 'invalid' : null}
                validationText={this.state.formValidity.elements.year}
                value={this.state.formData.year || ''}
              />
            </ListItem>
            <ListItem>
              <TextArea
                id="holidays"
                label={t('config:element.holidays')}
                onChange={this.onChange}
                required
                validationState={this.state.formValidity.elements.holidays ? 'invalid' : null}
                validationText={this.state.formValidity.elements.holidays}
                value={this.state.formData.holidays || ''}
              />
            </ListItem>
            <ListItem>
              <span className={styles.holidaysInfoText}>
                {t('settings:text.holidayInfoText')}
              </span>
            </ListItem>
          </List>
        </form>
      </Modal>
    );
  }

  render() {
    const {
      config,
      isFetching,
      t,
    } = this.props;
    const {
      showAddYearDialog,
      showEditYearDialog,
    } = this.state;

    return (
      <Layout
        loading={isFetching}
        title={t('settings:title.settings')}
      >
        <div className={styles.yearsAndHolidaysHeaderBox}>
          <h2 className={styles.yearsAndHolidaysTitle}>
            {t('settings:title.yearsAndHolidays')}
          </h2>
          <div className={styles.yearButtonsWrapper}>
            <Button
              beforeLabel={<Icon icon="add" />}
              label={t('settings:action.addYear')}
              onClick={this.openAddYearDialog}
            />
          </div>
        </div>
        {config && config.get('supportedYears').map(this.renderYearsAndHolidaysBox)}
        {showAddYearDialog && this.renderAddYearModal()}
        {showEditYearDialog && this.renderEditYearModal()}
      </Layout>
    );
  }
}

SettingsComponent.defaultProps = {
  config: null,
};

SettingsComponent.propTypes = {
  config: ImmutablePropTypes.mapContains({}),
  fetchConfig: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  saveConfig: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(SettingsComponent);
