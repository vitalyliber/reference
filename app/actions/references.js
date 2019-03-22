// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const ADD_REF = 'ADD_REF';

const addRefAction = references => ({
  type: ADD_REF,
  references
});

export const addRef = ref => (dispatch: Dispatch, getState: GetState) => {
  const {
    references: { list }
  } = getState();
  const newList =[...list, ref];

  dispatch(addRefAction(newList));
};

export const REMOVE_REF = 'REMOVE_REF';

const removeRefAction = references => ({
  type: REMOVE_REF,
  references
});

export const removeRef = ref => (dispatch: Dispatch, getState: GetState) => {
  const {
    references: { list }
  } = getState();
  const newList = list.filter(({ id }) => id !== ref.id);

  dispatch(removeRefAction(newList));
};

export const CLEAR_REFS = 'CLEAR_REFS';

const clearRefsAction = () => ({
  type: CLEAR_REFS
});

export const clearRefs = () => (dispatch: Dispatch, getState: GetState) => {
  dispatch(clearRefsAction());
};
