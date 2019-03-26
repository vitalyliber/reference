// @flow
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as userActions from '../actions/users';
import * as refActions from '../actions/references';

const mapStateToProps = state => ({
  users: state.users.list,
  references: state.references.list,
  user: state.user
});

export default connect(
  mapStateToProps,
  { ...userActions, ...refActions }
)(Home);
