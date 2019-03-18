import moize from 'moize';
import _ from 'lodash';

const getLastPeriod = (userId, references) => {
  console.log('cachedLastPeriod');
  const userReferences = references.filter(el => el.userId === userId);
  const userReferencesLength = userReferences.length;
  if (userReferencesLength > 0) {
    const sortedReferences = _.orderBy(userReferences, ['year'], ['desc']);
    return [sortedReferences[0]['year'], true];
  }
  return ['-', false];
};

export default moize.react(getLastPeriod);
