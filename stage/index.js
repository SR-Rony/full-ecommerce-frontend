import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './features/auth/auth.slice';


const rootReducer = combineReducers({
  user: authSlice,
  // Add other reducers here
});

export default rootReducer;