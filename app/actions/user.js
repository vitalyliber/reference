// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const ADD_USER = 'ADD_USER';

const addUserAction = (user) => ({
  type: ADD_USER,
  login: user.fullName,
  admin: user.admin,
  id: user.id
});

export const addUser = (user) => (dispatch: Dispatch, getState: GetState) => {
  dispatch(addUserAction(user));
};
