// reducers.js
import { combineReducers } from '@reduxjs/toolkit';

// Import your reducer slices here
import tourSlice from './tourSlice';

const rootReducer = combineReducers({
  tour: tourSlice,
});

export default rootReducer;
