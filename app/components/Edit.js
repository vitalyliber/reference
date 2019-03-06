// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Badge
} from 'reactstrap';
import routes from '../constants/routes';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import ModalUploader from './ModalUploader';

type Props = {};

export default class Edit extends Component<Props> {
  props: Props;

  render() {
    return (
      <Container data-tid="container">
        <Breadcrumb tag="nav" listTag="div">
          <BreadcrumbItem>
            <Link to={routes.HOME}>Реестр</Link>
          </BreadcrumbItem>
          <BreadcrumbItem tag="span" active>
            Редактирование
          </BreadcrumbItem>
        </Breadcrumb>
        <Card className="mb-3">
          <CardBody>
            <CardTitle>
              Иванов Иван Иванович
              <Badge className="ml-1" color="primary">
                01.01.1970
              </Badge>
            </CardTitle>
            <CardSubtitle>ИНН: 333344442222</CardSubtitle>
            <CardSubtitle>Тип реестра: РГГС</CardSubtitle>
            <CardText>Помощник</CardText>
          </CardBody>
        </Card>
        <ModalUploader
          acceptedFiles=".xsb"
          title="Выберите файл"
          buttonLabel="Загрузить справку"
        />
        <BorderContainer>
          <Table responsive hover striped size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Период отчетности</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>2018</td>
                <td>
                  <Link to={`${routes.EDIT}`}>
                    <FontAwesomeIcon icon="file" />
                  </Link>
                </td>
                <td>
                  <Link to={`${routes.EDIT}`}>
                    <FontAwesomeIcon icon="trash" />
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
