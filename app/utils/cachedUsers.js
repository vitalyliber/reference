import moize from 'moize';
import _ from "lodash";
import cachedLastPeriod from './cachedLastPeriod';

const usersList = (users, references) => {
  console.log('cachedUsers');
  const newUsers = users.map(el => {
    const [lastPeriod, isEmpty] = cachedLastPeriod(el.id, references);
    return {
      ...el,
      fullName: `${el.lastName} ${el.name} ${el.patronymic}`,
      year: isEmpty ? lastPeriod : ''
    };
  });
  return _.orderBy(newUsers, ['region'], ['asc']);
};

export default moize.react(usersList);
