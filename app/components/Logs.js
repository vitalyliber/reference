import React, { Component } from 'react';
import styled from 'styled-components';
import { Breadcrumb, BreadcrumbItem, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

export default class Logs extends Component {
  state = {
    actions: []
  };

  async componentDidMount() {
    await this.getLogs();
  }

  getLogs = async () => {
    const { Action, Admin } = this.context;
    const actions = await Action.findAll({
      include: [
        {
          model: Admin
        }
      ],
      order: [
        ['createdAt', 'DESC']
      ]
    });
    console.log(actions);
    this.setState({ actions });
  };

  render() {
    const { actions } = this.state;
    return (
      <Container>
        <Breadcrumb tag="nav" listTag="div">
          <BreadcrumbItem>
            <Link to={routes.HOME}>Реестр лиц, подающих справку БК</Link>
          </BreadcrumbItem>
          <BreadcrumbItem tag="span" active>
            Действия
          </BreadcrumbItem>
        </Breadcrumb>
        <BorderContainer>
          <Table>
            <thead>
              <tr>
                <th>Логин</th>
                <th>Действие</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {actions.map(el => (
                <tr key={el.id}>
                  <td>{el.admin.fullName}</td>
                  <td>{el.action}</td>
                  <td>{el.action ? 'Да' : 'Нет'}</td>
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
