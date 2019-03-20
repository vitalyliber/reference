// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Table, Breadcrumb, BreadcrumbItem, Input, Button } from 'reactstrap';
import XLSX from 'xlsx';
import _ from 'lodash';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DataFilter from 'datafilter';
import fsExtra from 'fs-extra';
import { confirmAlert } from 'react-confirm-alert';
import ModalUploader from './ModalUploader';
import referenceTail from './referenceTail';
import { createTable } from '../utils/table';
import cachedOptions from '../utils/cachedOptions';
import cachedUsers from '../utils/cachedUsers';
import getUserDataPath from '../utils/userDataPath';

type Props = {
  users: [],
  references: [],
  mergeUsers: void,
  clearRefs: void,
  clearUsers: void
};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.state = {
      searchInput: '',
      users: [],
      filteredUsers: [],
      selectedRegionOption: null,
      selectedReferenceOption: false
    };
  }

  componentDidMount() {
    const { users, references } = this.props;
    const newUsers = cachedUsers(users, references);
    this.setState({
      users: newUsers,
      filteredUsers: newUsers
    });
  }

  generateTableId = ({ lastName, name, patronymic }) =>
    `${lastName}_${name}_${patronymic}`;

  generateLine = lineParams => {
    const splitName = text => text.replace(/\s{2,}/g, ' ').toLowerCase();

    const { position, region, regionId, users, fullName } = lineParams;
    const [lastName, name, patronymic] = splitName(fullName).split(' ');
    if (_.isEmpty(name) || _.isEmpty(patronymic)) return;
    const id = this.generateTableId({
      lastName,
      name,
      patronymic
    });
    users.push({
      id,
      region,
      regionId,
      lastName,
      name,
      patronymic,
      birthday: null,
      position,
      registryType: '',
      taxpayerNumber: ''
    });
  };

  processLine = lineParams => {
    const { line } = lineParams;

    const fullNames = line.split('\n');
    if (fullNames.length > 1) {
      fullNames.forEach(fullName => {
        this.generateLine({ ...lineParams, fullName });
      });
    }
    if (fullNames.length === 1) {
      this.generateLine({ ...lineParams, fullName: fullNames[0] });
    }
  };

  processTable = list => {
    const users = [];
    list.forEach(
      ({ __EMPTY, __EMPTY_1, __EMPTY_2, __EMPTY_4, __EMPTY_6, __EMPTY_8 }) => {
        if (!_.isEmpty(__EMPTY_2)) {
          this.processLine({
            line: __EMPTY_2,
            position: 'Глава',
            region: __EMPTY_1,
            regionId: __EMPTY,
            users
          });
        }
        if (!_.isEmpty(__EMPTY_4)) {
          this.processLine({
            line: __EMPTY_4,
            position: 'Совет депутатов',
            region: __EMPTY_1,
            regionId: __EMPTY,
            users
          });
        }
        if (!_.isEmpty(__EMPTY_6)) {
          this.processLine({
            line: __EMPTY_6,
            position: 'Контрольно-счетный орган',
            region: __EMPTY_1,
            regionId: __EMPTY,
            users
          });
        }
        if (!_.isEmpty(__EMPTY_8)) {
          this.processLine({
            line: __EMPTY_8,
            position: 'Избирательная комиссия',
            region: __EMPTY_1,
            regionId: __EMPTY,
            users
          });
        }
      }
    );
    return users;
  };

  parseData = file => {
    const errorMsg = 'Попробуйте другой файл';
    const rABS = true;
    const { mergeUsers, references } = this.props;
    const reader = new FileReader();
    reader.onload = f => {
      try {
        let data = f.target.result;
        if (!rABS) data = new Uint8Array(data);
        const workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
        const ws = workbook.Sheets['Лист1'];
        const json = XLSX.utils.sheet_to_json(ws);
        const jsonWithoutHeaders = json.slice(2);
        if (typeof jsonWithoutHeaders[0]['__EMPTY'] !== 'number') {
          toast.error(errorMsg, {
            position: toast.POSITION.TOP_CENTER
          });
          this.modal.current.clearFile();
          return;
        }
        const users = this.processTable(jsonWithoutHeaders);
        mergeUsers(users);
        const newUsers = cachedUsers(users, references);
        this.setState({ users: newUsers, filteredUsers: newUsers });
      } catch (e) {
        console.log(e);
        toast.error(errorMsg, {
          position: toast.POSITION.TOP_CENTER
        });
        this.modal.current.clearFile();
        return;
      }
      toast.success('Данные успешно синхронизированы', {
        position: toast.POSITION.TOP_CENTER
      });
      this.modal.current.decline();
    };
    if (rABS) {
      return reader.readAsBinaryString(file);
    }
    reader.readAsArrayBuffer(file);
  };

  lastPeriod = userId => {
    const { references } = this.props;
    const userReferences = references.filter(el => el.userId === userId);
    const userReferencesLength = userReferences.length;
    if (userReferencesLength > 0) {
      const sortedReferences = _.sortBy(userReferences, ['year']);
      return [sortedReferences[userReferencesLength - 1]['year'], true];
    }
    return ['-', false];
  };

  toggleSearchInput = event => {
    this.setState({ searchInput: event.target.value });
  };

  handleRegionChange = selectedRegionOption => {
    this.setState({ selectedRegionOption });
  };

  handleYearChange = selectedYearOption => {
    this.setState({ selectedYearOption });
  };

  handlePositionChange = selectedPositionOption => {
    this.setState({ selectedPositionOption });
  };

  handleReferenceChange = event => {
    this.setState({ selectedReferenceOption: event.target.checked });
  };

  clearFilters = () => {
    this.handleRegionChange(null);
    this.handleYearChange(null);
    this.handlePositionChange(null);
    this.handleReferenceChange({ target: { checked: false } });
    this.toggleSearchInput({ target: { value: '' } });
  };

  purgeDatabase = () => {
    confirmAlert({
      title: 'Подтвердите удаление',
      message:
        'Вы уверены, что хотите удалить данные реестра и все файлы справок?',
      buttons: [
        {
          label: 'Да',
          onClick: () => {
            try {
              const { clearRefs, clearUsers } = this.props;
              const userDataPath = getUserDataPath();
              fsExtra.emptyDirSync(`${userDataPath}/refs`);
              clearRefs();
              clearUsers();
              this.setState({
                users: [],
                filteredUsers: []
              });
            } catch (e) {
              console.log(e);
            }
          }
        },
        {
          label: 'Нет',
          onClick: () => {}
        }
      ]
    });
  };

  render() {
    let visibleUsers;
    const { references } = this.props;
    const {
      searchInput,
      users,
      filteredUsers,
      selectedRegionOption,
      selectedPositionOption,
      selectedYearOption,
      selectedReferenceOption
    } = this.state;

    const filter = new DataFilter();

    visibleUsers = filteredUsers;

    if (!_.isEmpty(searchInput)) {
      filter.add('fullName', 'contains', searchInput.toLowerCase());
    }

    if (!_.isEmpty(selectedRegionOption)) {
      const values = selectedRegionOption.map(({ value }) => value);
      filter.add('region', 'equal', values);
    }

    if (!_.isEmpty(selectedPositionOption)) {
      const values = selectedPositionOption.map(({ value }) => value);
      filter.add('position', 'equal', values);
    }

    if (!_.isEmpty(selectedYearOption)) {
      const values = selectedYearOption.map(({ value }) => value);
      filter.add('year', 'equal', values);
    }

    if (selectedReferenceOption) {
      const values = cachedOptions(users, 'year').map(({ value }) => value);
      filter.add('year', 'equal', values);
    }

    visibleUsers = filter.match(visibleUsers);

    return (
      <Container data-tid="container">
        <Breadcrumb tag="nav" listTag="div">
          <BreadcrumbItem tag="span" active>
            Реестр лиц, подающих справку БК
          </BreadcrumbItem>
        </Breadcrumb>
        <RowContainerSpaceBetween>
          <RowContainer>
            <ModalUploader
              acceptedFiles={['xlsx']}
              title="Выберите файл"
              buttonLabel="Импорт"
              action={this.parseData}
              ref={this.modal}
            />
            <Button
              size="sm"
              color="info"
              onClick={() => createTable(users, references)}
              className="mb-3 ml-2 text-uppercase"
            >
              ЭКСПОРТ
            </Button>
            <Button
              size="sm"
              color="danger"
              onClick={this.purgeDatabase}
              className="mb-3 ml-2 text-uppercase"
            >
              УДАЛИТЬ
            </Button>
          </RowContainer>
          <Button
            size="sm"
            disabled={
              _.isEmpty(selectedRegionOption) &&
              _.isEmpty(selectedPositionOption) &&
              _.isEmpty(selectedYearOption) &&
              _.isEmpty(searchInput) &&
              !selectedReferenceOption
            }
            color="link"
            onClick={this.clearFilters}
            className="mb-3 ml-2 text-uppercase"
          >
            СБРОСИТЬ ФИЛЬТРЫ
          </Button>
        </RowContainerSpaceBetween>

        <WrappedInput
          type="search"
          name="search"
          placeholder="Поиск по ФИО"
          value={searchInput}
          onChange={this.toggleSearchInput}
        />

        <WrappedSelect
          value={selectedRegionOption}
          onChange={this.handleRegionChange}
          options={cachedOptions(users, 'region')}
          isMulti
          isSearchable
          placeholder="Фильтр по ОМСУ"
        />
        <WrappedSelect
          value={selectedPositionOption}
          onChange={this.handlePositionChange}
          options={cachedOptions(users, 'position')}
          isMulti
          isSearchable
          placeholder="Фильтр по должности"
        />
        <WrappedSelect
          value={selectedYearOption}
          onChange={this.handleYearChange}
          options={cachedOptions(users, 'year')}
          isMulti
          isSearchable
          placeholder="Фильтр по году справки"
        />
        <WrappedFormGroup check>
          <CheckBox
            checked={selectedReferenceOption}
            onChange={this.handleReferenceChange}
            type="checkbox"
          />{' '}
          Фильтр по наличию справки
        </WrappedFormGroup>
        <BorderContainer>
          <Table hover striped size="sm">
            <thead>
              <tr>
                <th>ОМСУ</th>
                <th>ФИО</th>
                <th>Должность</th>
                <th>Период</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map(el => referenceTail({ el, searchInput }))}
              {visibleUsers.length === 0 && (
                <tr className="table-light">
                  <td colSpan="9" className="text-center mt-4">
                    {_.isEmpty(searchInput)
                      ? 'Список пуст'
                      : 'Ничего не найдено'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </BorderContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 15px;
`;

const BorderContainer = styled.div`
  border: solid #f7f7f9;
  border-width: 0.2rem;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const RowContainerSpaceBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const WrappedInput = styled(Input)`
  margin-bottom: 15px;
`;

const WrappedSelect = styled(Select)`
  margin-bottom: 15px;
`;

const WrappedFormGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  align-items: center;
`;

const CheckBox = styled.input`
  margin-right: 10px;
`;
