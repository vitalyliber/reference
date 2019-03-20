// @flow
import React from 'react';
import moize from 'moize';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import reactStringReplace from 'react-string-replace';
import _ from 'lodash';
import routes from '../constants/routes';

const highlightSearchInput = (text, searchInput) =>
  reactStringReplace(text, searchInput, (match, i) => (
    <span className="text-warning" key={match + i}>{match}</span>
  ));

const referenceTail = ({
  el,
  searchInput
}: {
  el: object,
  searchInput: string
}) => {
  const pathParams = { pathname: routes.EDIT, state: { ...el } };
  return (
    <Route
      key={el.id}
      render={({ history }) => (
        <Tr
          onClick={e => {
            e.preventDefault();
            history.push(pathParams);
          }}
        >
          <td className="text-capitalize">{el.region}</td>
          <td>
            {highlightSearchInput(_.startCase(el.fullName), searchInput)}
          </td>
          <td>{el.position}</td>
          <td>{el.year}</td>
        </Tr>
      )}
    />
  );
};

export default moize.react(referenceTail);

const Tr = styled.tr`
  cursor: pointer;
`;
