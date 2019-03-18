// @flow
import React from 'react';
import moize from 'moize';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import routes from '../constants/routes';

const referenceTail = ({
  el
}: {
  el: object
}) => {
  const pathParams = { pathname: routes.EDIT, state: { ...el } };
  return (
    <Route
      render={({ history }) => (
        <Tr
          onClick={e => {
            e.preventDefault();
            history.push(pathParams);
          }}
          key={el.id}
        >
          <td className="text-capitalize">{el.region}</td>
          <td className="text-capitalize">{el.lastName}</td>
          <td className="text-capitalize">{el.name}</td>
          <td className="text-capitalize">{el.patronymic}</td>
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
