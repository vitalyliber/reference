// @flow
import React, { Component } from 'react';
import Edit from '../components/Edit';
import ErrorBoundary from '../components/ErrorBoundary';

type Props = {};

export default class EditPage extends Component<Props> {
  props: Props;

  render() {
    const { location } = this.props;

    return (
      <ErrorBoundary redirect>
        <Edit location={location} />
      </ErrorBoundary>
    );
  }
}
