import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts, getProductById } from "../../services/product.api.js";
import { INITIAL_PRODUCTS } from "../../utils/sampleProducts.js";

export const fetchProducts = createAsyncThunk("products/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await getAllProducts(params);
    const backendProducts = res.data?.products || [];
    if (backendProducts.length > 0) {
      return { products: backendProducts };
    }
  } catch (err) {
    // If backend is not running or empty, fallback to rich catalog items
  }

  // Filter fallback catalog by category if requested
  let filtered = [...INITIAL_PRODUCTS];
  if (params?.category) {
    const cat = params.category.toLowerCase().replace(/-/g, " ");
    filtered = filtered.filter((p) => p.category.toLowerCase().includes(cat.split(" ")[0]));
  }
  return { products: filtered };
});

export const fetchProductDetail = createAsyncThunk("products/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const res = await getProductById(id);
    if (res.data?.product) {
      return { product: res.data.product };
    }
  } catch (err) {
    // Fallback lookup
  }
  const found = INITIAL_PRODUCTS.find((p) => p._id === id) || INITIAL_PRODUCTS[0];
  return { product: found };
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: INITIAL_PRODUCTS,
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
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.list = INITIAL_PRODUCTS;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.currentProduct = action.payload.product;
      });
  },
});

export default productSlice.reducer;
