// reducers.js
import { combineReducers } from '@reduxjs/toolkit';

// Import your reducer slices here
import tourSlice from './tourSlice';

const rootReducer = combineReducers({
  tour: tourSlice,
});
// const rootReducer =  (state, action) => {
//   console.log("Reducing action: ", action);
//   if (action.payload === '') {
//       // reset state
//       state = undefined;
//       // reset local storage
//       localStorage.clear();
//   }
//   return appReducer(state, action)
// }

export default rootReducer;
