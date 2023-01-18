import { createContext, useContext, useReducer } from "react";

const createStore = (name = "Store", reducer) => {
  const StateContext = createContext();

  const DispatchContext = createContext();

  StateContext.displayName = `${name}State`;

  DispatchContext.displayName = `${name}Dispatch`;

  const Store = ({ defaultState, children }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  };

  const useStoreState = () => {
    const context = useContext(StateContext);

    if (!context) {
      throw new Error(`useStoreState must be used within ${StateContext.displayName}.Provider`);
    }

    return context;
  };

  const useStoreDispatch = () => {
    const context = useContext(DispatchContext);

    if (!context) {
      throw new Error(`useStoreDispatch must be used within ${DispatchContext.displayName}.Provider`);
    }

    return context;
  };

  return [Store, useStoreState, useStoreDispatch];
};

export default createStore;
