// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import routes from '../constants/routes';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import ModalUploader from './ModalUploader';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
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
              <tr>
                <th scope="row">1</th>
                <td>Иванов</td>
                <td>Иван</td>
                <td>Иванович</td>
                <td>01.01.1970</td>
                <td>Помощник</td>
                <td>РГГС</td>
                <td>2018</td>
                <td>Да</td>
                <td>
                  <Link to={`${routes.EDIT}`}>
                    <FontAwesomeIcon icon="edit" />
                  </Link>
                </td>
              </tr>
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
