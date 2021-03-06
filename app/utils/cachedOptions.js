import moize from 'moize';
import _ from 'lodash';

const optionsList = (list, key) => {
  console.log('optionsList');
  const filteredList = list.filter(el => {
    // lodash can't detect numbers
    const element = typeof el[key] === 'number' ? el[key].toString() : el[key];
    return !_.isEmpty(element);
  });
  const uniqList = _.uniqBy(filteredList, key);
  return uniqList.map(el => ({
    value: el[key],
    label: el[key]
  }));
};

export default moize.react(optionsList);
