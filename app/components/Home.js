// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import XLSX from 'xlsx';
import { toast } from 'react-toastify';
import routes from '../constants/routes';
import ModalUploader from './ModalUploader';
import { tableDateFormat } from '../utils/dateFormat';

type Props = {
  users: []
};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.modal = React.createRef();
  }

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
        const json = XLSX.utils.sheet_to_json(ws, {
          header: [
            'id',
            'family',
            'name',
            'patronymic',
            'birthday',
            'position',
            'registryType',
            'taxpayerNumber'
          ]
        });
        console.log(json.slice(1));
        const jsonWithoutHeaders = json.slice(1);
        if (typeof jsonWithoutHeaders[0]['id'] !== 'number') {
          toast.error(errorMsg, {
            position: toast.POSITION.TOP_CENTER
          });
          this.modal.current.clearFile();
          return;
        }
        mergeUsers(json.slice(1));
      } catch (e) {
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

  render() {
    const { users } = this.props;
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
        <BorderContainer>
          <Table responsive hover striped size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Отчество</th>
                <th>ГР</th>
                <th>Должность</th>
                <th>Тип</th>
                <th>Период</th>
                <th>Справка</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map(el => (
                <tr key={el.id}>
                  <th scope="row">{el.id}</th>
                  <td>{el.family}</td>
                  <td>{el.name}</td>
                  <td>{el.patronymic}</td>
                  <td>{tableDateFormat(el.birthday)}</td>
                  <td>{el.position}</td>
                  <td>{el.registryType}</td>
                  <td>2018</td>
                  <td>Да</td>
                  <td>
                    <Link to={{ pathname: routes.EDIT, state: { ...el } }}>
                      <FontAwesomeIcon icon="edit" />
                    </Link>
                  </td>
                </tr>
              ))}
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
