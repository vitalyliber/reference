// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Table, Breadcrumb, BreadcrumbItem, Input } from 'reactstrap';
import XLSX from 'xlsx';
import _ from 'lodash';
import { toast } from 'react-toastify';
import ModalUploader from './ModalUploader';
import referenceTail from './referenceTail';

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
  }

  state = {
    searchInput: ''
  };

  generateTableId = ({ lastName, name, patronymic }) =>
    `${lastName}_${name}_${patronymic}`;

  generateLine = (lineParams) => {
    const splitName = text => (text.replace(/\s{2,}/g, ' ').toLowerCase());

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

  processLine = (lineParams) => {
    const { line } = lineParams;

    const fullNames = line.split('\n');
    if (fullNames.length > 1) {
      fullNames.forEach(fullName => {
        this.generateLine({ ...lineParams, fullName })
      });
    }
    if (fullNames.length === 1) {
      this.generateLine({ ...lineParams, fullName: fullNames[0] })
    }
  };

  processTable = list => {
    const users = [];
    list.forEach(({ __EMPTY, __EMPTY_1, __EMPTY_2, __EMPTY_4, __EMPTY_6, __EMPTY_8 }) => {
      if (!_.isEmpty(__EMPTY_2)) {
        this.processLine({ line: __EMPTY_2, position: 'Глава', region: __EMPTY_1, regionId: __EMPTY, users });
      }
      if (!_.isEmpty(__EMPTY_4)) {
        this.processLine({ line: __EMPTY_4, position: 'Совет депутатов', region: __EMPTY_1, regionId: __EMPTY, users });
      }
      if (!_.isEmpty(__EMPTY_6)) {
        this.processLine({ line: __EMPTY_6, position: 'Контрольно-счетный орган', region: __EMPTY_1, regionId: __EMPTY, users });
      }
      if (!_.isEmpty(__EMPTY_8)) {
        this.processLine({ line: __EMPTY_8, position: 'Избирательная комиссия', region: __EMPTY_1, regionId: __EMPTY, users });
      }
    });
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

  render() {
    let visibleUsers;
    const { users, references } = this.props;
    const { searchInput } = this.state;

    if (!_.isEmpty(searchInput)) {
      const loverCaseSearchInput = searchInput.toLowerCase();
      visibleUsers = users.filter(
        ({ name, lastName, patronymic, taxpayerNumber }) =>
          `${lastName} ${name} ${patronymic} ${taxpayerNumber}`
            .toLowerCase()
            .search(loverCaseSearchInput) !== -1
      );
    } else {
      visibleUsers = users;
    }

    return (
      <Container data-tid="container">
        <Breadcrumb tag="nav" listTag="div">
          <BreadcrumbItem tag="span" active>
            Реестр
          </BreadcrumbItem>
        </Breadcrumb>
        <ModalUploader
          acceptedFiles=".xlsx"
          title="Выберите файл"
          buttonLabel="Импорт списка"
          action={this.parseData}
          ref={this.modal}
        />
        <WrappedInput
          type="search"
          name="search"
          placeholder="Поиск по ФИО"
          onChange={this.toggleSearchInput}
        />
        <BorderContainer>
          <Table responsive hover striped size="sm">
            <thead>
              <tr>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Отчество</th>
                <th>ГР</th>
                <th>Должность</th>
                <th>Период</th>
                <th>Справка</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((el) => referenceTail({ el, references }))}
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

const WrappedInput = styled(Input)`
  margin-bottom: 15px;
`;
