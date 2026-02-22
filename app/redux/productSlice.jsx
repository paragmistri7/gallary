import { createAsyncThunk ,createSlice } from "@reduxjs/toolkit"

export const fetchProducts = createAsyncThunk("fetchdata", async () => {
    const fetchData = await fetch("https://dummyjson.com/products")
    let data = await fetchData?.json()
    return data?.products
})


let initialState = {
    item: [],
    status : undefined,
    error : null
}
const productsSlice = createSlice({
    name: 'products'
    , initialState, 
    extraReducers: (builder) => {
        builder.addCase(fetchProducts?.fulfilled, (state, action) => {
            state.status = "succeeded"
            state.item = action?.payload
        } )
    }
})

export default productsSlice?.reducer