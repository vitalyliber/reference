import moize from 'moize';
import cachedLastPeriod from './cachedLastPeriod';

const usersList = (users, references) => {
  console.log('cachedUsers');
  return users.map(el => {
    const [lastPeriod, isEmpty] = cachedLastPeriod(el.id, references);
    return {
      ...el,
      fullName: `${el.lastName} ${el.name} ${el.patronymic}`,
      year: isEmpty ? lastPeriod : ''
    };
  });
};

export default moize.react(usersList);
