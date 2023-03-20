import { configureStore } from '@reduxjs/toolkit';
import balanceSlice from './slices/balanceSlice';

const store = configureStore({
  reducer: {
    balance: balanceSlice
  }
});

export default store;
