import React, { Component } from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import routes from '../constants/routes';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.inputFullName = React.createRef();
    this.inputPassword = React.createRef();
  }

  onSubmit = async e => {
    e.preventDefault();
    const { history } = this.props;
    const fullName = this.inputFullName.current.value;
    const password = this.inputPassword.current.value;
    console.log(fullName, password);
    if (!fullName || !password) {
      toast.error('Заполните поля авторизации', {
        position: toast.POSITION.TOP_CENTER
      });
      return;
    }
    const { Admin } = this.context;
    const admin = await Admin.findOne({
      where: {
        fullName,
        password
      }
    });
    if (!admin) {
      toast.error('Вы ввели неверный логин или пароль', {
        position: toast.POSITION.TOP_CENTER
      });
      return;
    }
    history.push(routes.HOME);
  };

  render() {
    return (
      <Container>
        <StyledForm onSubmit={this.onSubmit}>
          <h2 className="text-center mb-4">Справка БК</h2>
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
          <Button className="mt-4" color="primary" block>
            Войти
          </Button>
        </StyledForm>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;

const StyledForm = styled(Form)`
  width: 300px;
  margin-bottom: 100px;
`;
