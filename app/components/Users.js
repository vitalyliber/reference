import React, { Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormGroup,
  Input,
  Table,
  ModalFooter,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: []
    };
    this.inputFullName = React.createRef();
    this.inputPassword = React.createRef();
  }

  async componentDidMount() {
    await this.getAdmins();
  }

  getAdmins = async () => {
    const { Admin } = this.context;
    const admins = await Admin.findAll();
    this.setState({ admins });
  };

  delete = async id => {
    const { Admin } = this.context;
    await Admin.destroy({
      where: {
        id
      }
    });
    await this.getAdmins();
  };

  create = async () => {
    const fullName = this.inputFullName.current.value;
    const password = this.inputPassword.current.value;
    if (!fullName || !password) {
      toast.error('Заполните поля логин и пароль', {
        position: toast.POSITION.TOP_CENTER
      });
      return;
    }
    const { Admin } = this.context;
    try {
      await Admin.findOrCreate({
        where: {
          fullName,
          password,
          admin: false
        }
      });
    } catch (e) {
      toast.error(e.message.replace('Validation error:', ''), {
        position: toast.POSITION.TOP_CENTER
      });
      return;
    }

    await this.getAdmins();
    this.toggle();
  };

  toggle = () => this.setState(({ modal }) => ({ modal: !modal }));

  render() {
    const { admins, modal } = this.state;

    return (
      <Container>
        <Breadcrumb tag="nav" listTag="div">
          <BreadcrumbItem>
            <Link to={routes.HOME}>Реестр лиц, подающих справку БК</Link>
          </BreadcrumbItem>
          <BreadcrumbItem tag="span" active>
            Пользователи
          </BreadcrumbItem>
        </Breadcrumb>
        <Button
          size="sm"
          className="mb-3"
          color="primary"
          onClick={this.toggle}
        >
          Создать
        </Button>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Создание пользователя</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Input
                  innerRef={this.inputFullName}
                  type="text"
                  name="fullName"
                  placeholder="Логин"
                />
              </FormGroup>
              <FormGroup>
                <Input
                  innerRef={this.inputPassword}
                  type="password"
                  name="password"
                  placeholder="Пароль"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.create}>
              Создать
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              Отмена
            </Button>
          </ModalFooter>
        </Modal>
        <BorderContainer>
          <Table>
            <thead>
              <tr>
                <th>Логин</th>
                <th>Admin</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {admins.map(el => (
                <tr key={el.id}>
                  <td>{el.fullName}</td>
                  <td>{el.admin ? 'Да' : 'Нет'}</td>
                  <td>
                    {!el.admin && (
                      <IconDelete
                        icon="trash"
                        onClick={() => {
                          this.delete(el.id);
                        }}
                      />
                    )}
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

const IconDelete = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: red;
`;
