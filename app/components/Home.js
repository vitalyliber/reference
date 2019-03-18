// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Input,
  Button,
  FormGroup,
  Label
} from 'reactstrap';
import XLSX from 'xlsx';
import _ from 'lodash';
import { toast } from 'react-toastify';
import Select from 'react-select';
import '!style-loader!css-loader!react-table-filter/lib/styles.css';
import DataFilter from 'datafilter';
import ModalUploader from './ModalUploader';
import referenceTail from './referenceTail';
import { createTable } from '../utils/table';
import cachedOptions from '../utils/cachedOptions';
import cachedUsers from '../utils/cachedUsers';

type Props = {
  users: [],
  references: [],
  mergeUsers: void
};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.modal = React.createRef();
    const { users, references } = props;
    const newUsers = cachedUsers(users, references);
    this.state = {
      searchInput: '',
      users: newUsers,
      filteredUsers: newUsers,
      selectedRegionOption: null,
      selectedReferenceOption: false
    };
    this.tableFilter = React.createRef();
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
    const { mergeUsers } = this.props;
    const reader = new FileReader();
    reader.onload = f => {
      try {
        let data = f.target.result;
        if (!rABS) data = new Uint8Array(data);
        const workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
        const ws = workbook.Sheets['Лист1'];
        console.log('WorkSheet', ws);
        const json = XLSX.utils.sheet_to_json(ws);
        console.log('JSON', json);
        const jsonWithoutHeaders = json.slice(2);
        console.log('jsonWithoutHeaders', jsonWithoutHeaders);
        if (typeof jsonWithoutHeaders[0]['__EMPTY'] !== 'number') {
          toast.error(errorMsg, {
            position: toast.POSITION.TOP_CENTER
          });
          this.modal.current.clearFile();
          return;
        }
        const users = this.processTable(jsonWithoutHeaders);
        console.log('USERS', users);
        mergeUsers(users);
        this.setState({ users, filteredUsers: users });
        this.tableFilter.current.reset(users);
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
      reader.readAsBinaryString(file);
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

  render() {
    let visibleUsers;
    const { references } = this.props;
    let {
      searchInput,
      users,
      filteredUsers,
      selectedRegionOption,
      selectedPositionOption,
      selectedYearOption,
      selectedReferenceOption
    } = this.state;

    const filter = new DataFilter();

    if (!_.isEmpty(searchInput)) {
      const loverCaseSearchInput = searchInput.toLowerCase();
      visibleUsers = filteredUsers.filter(
        ({ name, lastName, patronymic }) =>
          `${lastName} ${name} ${patronymic}`
            .toLowerCase()
            .search(loverCaseSearchInput) !== -1
      );
    } else {
      visibleUsers = filteredUsers;
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
        </RowContainer>
        <WrappedInput
          type="search"
          name="search"
          placeholder="Поиск по ФИО"
          onChange={this.toggleSearchInput}
        />

        <WrappedSelect
          value={selectedRegionOption}
          onChange={this.handleRegionChange}
          options={cachedOptions(users, 'region')}
          isMulti
          isSearchable
          placeholder="Сортировка по региону"
        />
        <WrappedSelect
          value={selectedPositionOption}
          onChange={this.handlePositionChange}
          options={cachedOptions(users, 'position')}
          isMulti
          isSearchable
          placeholder="Сортировка по должности"
        />
        <WrappedSelect
          value={selectedYearOption}
          onChange={this.handleYearChange}
          options={cachedOptions(users, 'year')}
          isMulti
          isSearchable
          placeholder="Сортировка по году справки"
        />
        <WrappedFormGroup check>
          <Label check>
            <Input
              value={selectedReferenceOption}
              onChange={this.handleReferenceChange}
              type="checkbox"
            />{' '}
            Сортировка по наличию справки
          </Label>
        </WrappedFormGroup>
        <BorderContainer>
          <Table hover striped size="sm">
            <thead>
              <th>ОМСУ</th>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Отчество</th>
              <th>Должность</th>
              <th>Период</th>
            </thead>
            <tbody>
              {visibleUsers.map(el => referenceTail({ el, references }))}
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

const WrappedInput = styled(Input)`
  margin-bottom: 15px;
`;

const WrappedSelect = styled(Select)`
  margin-bottom: 15px;
`;

const WrappedFormGroup = styled(FormGroup)`
  margin-bottom: 15px;
`;
