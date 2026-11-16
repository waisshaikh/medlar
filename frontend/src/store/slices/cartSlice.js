import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart as clearCartApi } from "../../services/cart.api.js";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await getCart();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const addItem = createAsyncThunk("cart/add", async ({ productId, variantId, quantity }, { dispatch, rejectWithValue }) => {
  try {
    await addToCart(productId, variantId, quantity);
    dispatch(fetchCart());
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateItem = createAsyncThunk("cart/update", async ({ itemId, quantity }, { dispatch, rejectWithValue }) => {
  try {
    await updateCartItem(itemId, quantity);
    dispatch(fetchCart());
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeItem = createAsyncThunk("cart/remove", async (itemId, { dispatch, rejectWithValue }) => {
  try {
    await removeCartItem(itemId);
    dispatch(fetchCart());
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCart = createAsyncThunk("cart/clear", async (_, { dispatch, rejectWithValue }) => {
  try {
    await clearCartApi();
    dispatch(fetchCart());
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    currency: "INR",
    loading: false,
    isOpen: false,
  },
  reducers: {
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    closeCart: (state) => { state.isOpen = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.currency = action.payload.currency || "INR";
      })
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalPrice = 0;
      });
  },
});

export const { toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
