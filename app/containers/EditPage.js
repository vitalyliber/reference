// @flow
import React, { Component } from 'react';
import Edit from '../components/Edit';

type Props = {};

export default class EditPage extends Component<Props> {
  props: Props;

  render() {
    const { location } = this.props;

    return <Edit location={location} />;
  }
}
