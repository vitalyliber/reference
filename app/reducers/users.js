// @flow
import { MERGE_USERS, CLEAR_USERS } from '../actions/users';

const initialState = {
  list: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MERGE_USERS:
      return { ...state, list: action.users };
    case CLEAR_USERS:
      return { ...state, list: [] };
    default:
      return state;
  }
};

export default reducer;
