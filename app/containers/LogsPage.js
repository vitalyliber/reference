// @flow
import { connect } from 'react-redux';
import SequelizeContext from '../sequelize/sequelizeContext';
import Logs from '../components/Logs';

const mapStateToProps = state => ({
  user: state.user
});

Logs.contextType = SequelizeContext;

export default connect(
  mapStateToProps,
  {}
)(Logs);
