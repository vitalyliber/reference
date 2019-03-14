// @flow
import React from 'react';
import moize from 'moize';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';
import routes from '../constants/routes';

export const getLastPeriod = (userId, references) => {
  const userReferences = references.filter(el => el.userId === userId);
  const userReferencesLength = userReferences.length;
  if (userReferencesLength > 0) {
    const sortedReferences = _.orderBy(userReferences, ['year'], ['desc']);
    return [sortedReferences[0]['year'], true];
  }
  return ['-', false];
};

const referenceTail = ({
  el,
  references
}: {
  el: object,
  references: array
}) => {
  const [lastPeriod] = getLastPeriod(el.id, references);
  const pathParams = { pathname: routes.EDIT, state: { ...el } };
  console.log('cached');
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
          <td>{lastPeriod}</td>
        </Tr>
      )}
    />
  );
};

export default moize.react(referenceTail);

const Tr = styled.tr`
  cursor: pointer;
`;
