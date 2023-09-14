// import { configureStore } from "@reduxjs/toolkit"
// import tourSlice from "./tourSlice";

// const store = configureStore({
//     reducer:{
//         tour: tourSlice
//     }
// })

// export default store;

// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage is local storage
import rootReducer from './reducers'; // Import your combined reducers

const persistConfig = {
  key: 'main', 
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export default store;
