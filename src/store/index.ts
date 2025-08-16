import {
  combineReducers,
  configureStore,
  Middleware,
  Tuple,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { apiStore } from "./storeApi";
import common from "./common/commonSlice";

const rootReducer = combineReducers({
  [apiStore.reducerPath]: apiStore.reducer,
  common,
});

const middlewareHandler = (getDefaultMiddleware: () => Tuple<Middleware[]>) => {
  const middlewareList = getDefaultMiddleware();
  return middlewareList;
};

export const rootStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    middlewareHandler(getDefaultMiddleware).concat(apiStore.middleware),
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;

// Setup listener cho RTK Query
setupListeners(rootStore.dispatch);
