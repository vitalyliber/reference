// @flow
import React from 'react';
import moize from 'moize';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import routes from '../constants/routes';

export const getLastPeriod = (userId, references) => {
  const userReferences = references.filter(el => el.userId === userId);
  const userReferencesLength = userReferences.length;
  if (userReferencesLength > 0) {
    const sortedReferences = _.sortBy(userReferences, ['year']);
    return [sortedReferences[userReferencesLength - 1]['year'], true];
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
  const [lastPeriod, hasPeriod] = getLastPeriod(el.id, references);
  const pathParams = { pathname: routes.EDIT, state: { ...el } };
  console.log('ffff');
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
          <td>{hasPeriod ? 'Да' : 'Нет'}</td>
          <td>
            <a href="#">
              <FontAwesomeIcon icon="edit" />
            </a>
          </td>
        </Tr>
      )}
    />
  );
};

export default moize.react(referenceTail);

const Tr = styled.tr`
  cursor: pointer;
`;
