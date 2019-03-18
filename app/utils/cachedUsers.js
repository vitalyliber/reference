import moize from 'moize';
import cachedLastPeriod from './cachedLastPeriod';

const usersList = (users, references) => {
  console.log('cachedUsers');
  return users.map(el => {
    const [lastPeriod, isEmpty] = cachedLastPeriod(el.id, references);
    return { ...el, year: isEmpty ? lastPeriod : '' };
  });
};

export default moize.react(usersList);
