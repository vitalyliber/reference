// @flow
import _ from 'lodash';
import type { GetState, Dispatch } from '../reducers/types';

export const MERGE_USERS = 'MERGE_USERS';

const mergeUsersAction = users => ({
  type: MERGE_USERS,
  users
});

export const mergeUsers = users => (dispatch: Dispatch, getState: GetState) => {
  const {
    users: { list }
  } = getState();
  const newUsers = _.uniqBy([...list, ...users], 'id');

  dispatch(mergeUsersAction(newUsers));
};
