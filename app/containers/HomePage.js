// @flow
import React from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as userActions from '../actions/users';

const mapStateToProps = state => ({
  users: state.users.list,
});

export default connect(
  mapStateToProps,
  userActions
)(Home);
