import { useReducer } from 'react';

const useUndoReducer = (reducer, initialState) => {
  const undoState = {
    past: [],
    present: initialState,
    future: []
  };

  const undoReducer = (state, action) => {
    const newPresent = reducer(state.present, action);

    if (action.type === useUndoReducer.types.undo) {
      const [newPresent, ...past] = state.past;
      return {
        past,
        present: newPresent,
        future: [state.present, ...state.future]
      };
    }
    if (action.type === useUndoReducer.types.redo) {
      const [newPresent, ...future] = state.future;
      return {
        past: [state.present, ...state.past],
        present: newPresent,
        future
      };
    }
    return {
      past: [state.present, ...state.past],
      present: newPresent,
      future: []
    };
  };

  return useReducer(undoReducer, undoState);
};

useUndoReducer.types = {
  undo: 'UNDO',
  redo: 'REDO'
};

export default useUndoReducer;
