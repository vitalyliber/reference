// @flow
import { MERGE_USERS } from '../actions/users';

const initialState = {
  list: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MERGE_USERS:
      return { ...state, list: action.users };
    default:
      return state;
  }
};

export default reducer;
