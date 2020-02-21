import React, { useReducer, createContext, useCallback } from 'react';

import id from 'uuid/v4';

import initialState from './initialState';

import useUndoReducer from './useUndoReducer';

const GrudgeContext = createContext();

const GRUDGE_ADD = 'GRUDGE_ADD';
const GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';

const reducer = (state = initialState, action) => {
  if (action.type === GRUDGE_ADD) {
    return [{ id: id(), ...action.payload }, ...state];
  }
  if (action.type === GRUDGE_FORGIVE) {
    return state.map(grudge => {
      if (grudge.id !== action.payload.id) return grudge;
      return { ...grudge, forgiven: !grudge.forgiven };
    });
  }
  return state;
};

const GrudgeProvider = ({ children }) => {
  const [state, dispatch] = useUndoReducer(reducer, initialState);

  const grudges = state.present;
  const isPast = !!state.past.length;
  const isFuture = !!state.future.length;

  const addGrudge = useCallback(
    ({ person, reason }) => {
      dispatch({
        type: GRUDGE_ADD,
        payload: {
          person,
          reason,
          forgiven: false,
          id: id()
        }
      });
    },
    [dispatch]
  );

  const toggleForgiveness = useCallback(
    id => {
      dispatch({
        type: GRUDGE_FORGIVE,
        payload: { id }
      });
    },
    [dispatch]
  );

  const undo = useCallback(() => {
    dispatch({ type: useUndoReducer.types.undo });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: useUndoReducer.types.redo });
  }, [dispatch]);

  const value = {
    grudges,
    addGrudge,
    toggleForgiveness,
    undo,
    isPast,
    redo,
    isFuture
  };

  return (
    <GrudgeContext.Provider value={value}>{children}</GrudgeContext.Provider>
  );
};

export { GrudgeContext, GrudgeProvider };
