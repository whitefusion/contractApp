import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    cancelOrders: [],
    allOrders: [],
    fillOrders: [],
  },
  reducers: {
    setCancelOrders(state, action) {
      state.cancelOrders = action.payload;
    },
    setFillOrders(state, action) {
      state.fillOrders = action.payload;
    },
    setAllOrders(state, action) {
      state.allOrders = action.payload;
    },
  }
});

export const loadCancelOrderData = createAsyncThunk(
  "order/fetchCancelOrderData",
  async(data: any, {dispatch}) => {
    const { exchange } = data;
    const result = await exchange.getPastEvents('Cancel', {
      fromBlock: 0,
      toBlock: 'latest'
    });
    const cancelOrders = result.map((item: any) => item.returnValues);
    console.log('cancel orders: ', cancelOrders);
    dispatch(setCancelOrders(cancelOrders));
  }
);

export const loadAllOrderData = createAsyncThunk(
  "order/fetchAllOrderData",
  async(data: any, {dispatch}) => {
    const { exchange } = data;
    const result = await exchange.getPastEvents('Order', {
      fromBlock: 0,
      toBlock: 'latest'
    });
    const allOrders = result.map((item: any) => item.returnValues);
    console.log('allOrders', allOrders);
    dispatch(setAllOrders(allOrders));
  }
);

export const loadFillOrderData = createAsyncThunk(
  "order/fetchFillOrderData",
  async(data: any, {dispatch}) => {
    const { exchange } = data;
    const result = await exchange.getPastEvents('Trade', {
      fromBlock: 0,
      toBlock: 'latest'
    });
    const fillOrders = result.map((item: any) => item.returnValues);
    console.log('fillOrders', fillOrders);
    dispatch(setFillOrders(fillOrders));
  }
);

export const { setAllOrders, setCancelOrders, setFillOrders } = orderSlice.actions;

export default orderSlice.reducer;
