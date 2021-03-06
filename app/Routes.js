import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import UsersPage from './containers/UsersPage';
import LogsPage from './containers/LogsPage';
import EditPage from './containers/EditPage';
import CounterPage from './containers/CounterPage';

export default () => (
  <App>
    <Switch>
      <Route path={`${routes.EDIT}`} component={EditPage} />
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.HOME} component={HomePage} />
      <Route path={routes.USERS} component={UsersPage} />
      <Route path={routes.LOGS} component={LogsPage} />
      <Route path={routes.LOGIN} component={LoginPage} />
    </Switch>
  </App>
);
