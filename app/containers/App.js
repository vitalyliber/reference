// @flow
import * as React from 'react';
// https://fontawesome.com/how-to-use/on-the-web/using-with/react
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash, faFile } from '@fortawesome/free-solid-svg-icons';

library.add(faEdit, faTrash, faFile);

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}
