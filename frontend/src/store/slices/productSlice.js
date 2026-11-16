import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts, getProductById } from "../../services/product.api.js";

export const fetchProducts = createAsyncThunk("products/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await getAllProducts(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchProductDetail = createAsyncThunk("products/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const res = await getProductById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.currentProduct = action.payload.product;
      });
  },
});

export default productSlice.reducer;
