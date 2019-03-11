// @flow
import { ADD_REF, REMOVE_REF } from '../actions/references';

const initialState = {
  list: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REF:
      return {
        ...state,
        list: action.references
      };
    case REMOVE_REF:
      return {
        ...state,
        list: action.references
      };
    default:
      return state;
  }
};

export default reducer;
