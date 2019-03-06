// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import XLSX from 'xlsx';
import routes from '../constants/routes';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import ModalUploader from './ModalUploader';

type Props = {
  users: []
};

export default class Home extends Component<Props> {
  props: Props;

  parseData = file => {
    const rABS = true;
    const { mergeUsers } = this.props;
    const reader = new FileReader();
    reader.onload = f => {
      try {
        let data = f.target.result;
        if (!rABS) data = new Uint8Array(data);
        const workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
        const ws = workbook.Sheets['Лист1'];
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
          return alert('Попробуйте другой файл')
        }
        mergeUsers(json.slice(1));
      } catch (e) {
        alert('Попробуйте другой файл')
      }
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  render() {
    const { users } = this.props;
    return (
      <Container data-tid="container">
        {/*<Link to={routes.COUNTER}>Counter</Link>*/}
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
                  <td>{el.birthday}</td>
                  <td>{el.position}</td>
                  <td>{el.registryType}</td>
                  <td>2018</td>
                  <td>Да</td>
                  <td>
                    <Link to={`${routes.EDIT}`}>
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
