import { configureStore, combineReducers } from "@reduxjs/toolkit";
import globalSlice from "./globalSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
const rootPersistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({
  global: globalSlice,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});
// export const persistor = persistStore(store);