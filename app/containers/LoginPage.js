// @flow
import { connect } from 'react-redux';
import SequelizeContext from '../sequelize/sequelizeContext';
import Login from '../components/Login';
import * as userActions from '../actions/user';
import * as refActions from '../actions/references';

const mapStateToProps = state => ({
  users: state.users.list,
  references: state.references.list,
  user: state.user
});

Login.contextType = SequelizeContext;

export default connect(
  mapStateToProps,
  { ...userActions, ...refActions }
)(Login);
