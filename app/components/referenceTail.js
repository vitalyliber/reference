// @flow
import React from 'react';
import moize from 'moize';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import routes from '../constants/routes';

const getLastPeriod = (userId, references) => {
  const userReferences = references.filter(el => el.userId === userId);
  const userReferencesLength = userReferences.length;
  if (userReferencesLength > 0) {
    const sortedReferences = _.sortBy(userReferences, ['year']);
    return [sortedReferences[userReferencesLength - 1]['year'], true];
  }
  return ['-', false];
};

const referenceTail = ({ el, references }: {el: object, references: array}) => {
  const [lastPeriod, hasPeriod] = getLastPeriod(el.id, references);
  return (
    <tr key={el.id}>
      <td className="text-capitalize">{el.region}</td>
      <td className="text-capitalize">{el.lastName}</td>
      <td className="text-capitalize">{el.name}</td>
      <td className="text-capitalize">{el.patronymic}</td>
      <td>{el.position}</td>
      <td>{lastPeriod}</td>
      <td>{hasPeriod ? 'Да' : 'Нет'}</td>
      <td>
        <Link to={{ pathname: routes.EDIT, state: { ...el } }}>
          <FontAwesomeIcon icon="edit" />
        </Link>
      </td>
    </tr>
  );
};

export default moize.react(referenceTail);
