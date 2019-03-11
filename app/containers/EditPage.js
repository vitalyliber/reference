// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Edit from '../components/Edit';
import ErrorBoundary from '../components/ErrorBoundary';
import * as actions from '../actions/references';

type Props = {};

class EditPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <ErrorBoundary redirect>
        <Edit {...this.props} />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = state => ({
  references: state.references.list,
});

export default connect(
  mapStateToProps,
  actions
)(EditPage);
