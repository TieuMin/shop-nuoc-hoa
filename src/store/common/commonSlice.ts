import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "comment",
  initialState: {
    isCloseSidebar: false,
    languageInput: "en",
    totalCart: 0,
    voucher: "",
    categories: null,
    trademarks: null,
    vouchers: null,
    carts: null,
  },
  reducers: {
    collapseSidebar(state) {
      state.isCloseSidebar = !state.isCloseSidebar;
    },
    changeLanguageInput(state, action) {
      state.languageInput = action.payload;
    },
    changeTotalCart(state, action) {
      state.totalCart = action.payload;
    },
    changeVoucher(state, action) {
      state.voucher = action.payload;
    },
    changeCategories(state, action) {
      state.categories = action.payload;
    },
    changeTrademarks(state, action) {
      state.trademarks = action.payload;
    },
    changeCarts(state, action) {
      state.carts = action.payload;
    },
    changeVouchers(state, action) {
      state.vouchers = action.payload;
    },
  },
});

export const {
  collapseSidebar,
  changeLanguageInput,
  changeTotalCart,
  changeVoucher,
  changeCarts,
  changeCategories,
  changeTrademarks,
  changeVouchers,
} = commonSlice.actions;

export default commonSlice.reducer;
