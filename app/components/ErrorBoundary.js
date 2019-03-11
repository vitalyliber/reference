// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.redirect) {
        return <Redirect to="/"/>
      }

      // You can render any custom fallback UI
      return <h1>Неизвестная ошибка.</h1>;
    }
    return this.props.children;
  }
}
