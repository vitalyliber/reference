// @flow
import { connect } from 'react-redux';
import SequelizeContext from '../sequelize/sequelizeContext';
import Users from '../components/Users';
import * as userActions from '../actions/users';
import * as refActions from '../actions/references';

const mapStateToProps = state => ({
  users: state.users.list,
  references: state.references.list
});

Users.contextType = SequelizeContext;

export default connect(
  mapStateToProps,
  { ...userActions, ...refActions }
)(Users);
