import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartState {
    itemCount: number;
    subtotal: number;
    isCartOpen: boolean;
}

const initialState: CartState = {
    itemCount: 0,
    subtotal: 0,
    isCartOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartSummary: (state, action: PayloadAction<{ itemCount: number; subtotal: number }>) => {
            state.itemCount = action.payload.itemCount;
            state.subtotal = action.payload.subtotal;
        },
        toggleCartDrawer: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        openCartDrawer: (state) => {
            state.isCartOpen = true;
        },
        closeCartDrawer: (state) => {
            state.isCartOpen = false;
        },
        resetCart: (state) => {
            state.itemCount = 0;
            state.subtotal = 0;
            state.isCartOpen = false;
        },
    },
});

export const { 
    setCartSummary, 
    toggleCartDrawer, 
    openCartDrawer, 
    closeCartDrawer,
    resetCart 
} = cartSlice.actions;

export default cartSlice.reducer;