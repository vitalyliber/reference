// @flow
import { ADD_USER } from '../actions/user';

const initialState = {
  login: '',
  admin: false,
  id: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER:
      return {
        ...state,
        login: action.login,
        admin: action.admin,
        id: action.id
      };
    default:
      return state;
  }
};

export default reducer;
