// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import sequelize from '../sequelize/sequelize';
import SequelizeContext from '../sequelize/sequelizeContext';
import type { Store } from '../reducers/types';
import Routes from '../Routes';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';
import '!style-loader!css-loader!react-confirm-alert/src/react-confirm-alert.css';

type Props = {
  store: Store,
  history: {},
  persistor: {}
};

export default class Root extends Component<Props> {
  render() {
    const { store, history, persistor } = this.props;

    return (
      <SequelizeContext.Provider value={sequelize}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ConnectedRouter history={history}>
              <Routes />
            </ConnectedRouter>
            <ToastContainer />
          </PersistGate>
        </Provider>
      </SequelizeContext.Provider>
    );
  }
}
