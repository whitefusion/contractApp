import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    tokenWallet: '0',
    tokenExchange: '0',
    etherWallet: '0',
    etherExchange: '0'
  },
  reducers: {
    setTokenWallet(state, action) {
      state.tokenWallet = action.payload;
    },
    setTokenExchange(state, action) {
      state.tokenExchange = action.payload;
    },
    setEtherWallet(state, action) {
      state.etherWallet = action.payload;
    },
    setEtherExchange(state, action) {
      state.etherExchange = action.payload;
    }
  }
});

export const loadBalanceData = createAsyncThunk(
  "balance/fetchBalanceData",
  async(data, {dispatch}) => {
    const { web3, account, token, exchange } = (data as any) || {};
    const tokenWallet = await token.methods.balanceOf(account).call();
    dispatch(setTokenWallet(tokenWallet));

    const tokenExchange = await exchange.methods.balanceOf(token.options.address, account).call();
    dispatch(setTokenExchange(tokenExchange));

    const etherWallet = await web3.eth.getBalance(account);
    dispatch(setEtherWallet(etherWallet));

    const etherExchange = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
    dispatch(setEtherExchange(etherExchange));
  }
);

export const { setTokenExchange, setTokenWallet, setEtherExchange, setEtherWallet } = balanceSlice.actions;

export default balanceSlice.reducer;
