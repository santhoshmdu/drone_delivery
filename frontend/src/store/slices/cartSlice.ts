import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: {
    name: string;
    options: string[];
    additionalPrice: number;
  }[];
  specialInstructions?: string;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  totalItems: number;
  totalPrice: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  grandTotal: number;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  restaurantId: localStorage.getItem('cartRestaurantId'),
  restaurantName: localStorage.getItem('cartRestaurantName'),
  totalItems: 0,
  totalPrice: 0,
  deliveryFee: 2.99,
  serviceFee: 1.50,
  tax: 0,
  grandTotal: 0,
};

// Helper function to calculate totals
const calculateTotals = (state: CartState) => {
  state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalPrice = state.items.reduce((total, item) => total + item.totalPrice, 0);
  state.tax = Math.round(state.totalPrice * 0.08 * 100) / 100; // 8% tax
  state.grandTotal = state.totalPrice + state.deliveryFee + state.serviceFee + state.tax;
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(state.items));
  localStorage.setItem('cartRestaurantId', state.restaurantId || '');
  localStorage.setItem('cartRestaurantName', state.restaurantName || '');
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'totalPrice'>>) => {
      const newItem = action.payload;
      
      // Check if adding from different restaurant
      if (state.restaurantId && state.restaurantId !== newItem.restaurantId) {
        // Clear cart and show warning
        state.items = [];
        state.restaurantId = newItem.restaurantId;
        state.restaurantName = newItem.restaurantName;
        toast.error('Cart cleared! Items from different restaurants cannot be ordered together.');
      }
      
      // Set restaurant if cart is empty
      if (!state.restaurantId) {
        state.restaurantId = newItem.restaurantId;
        state.restaurantName = newItem.restaurantName;
      }
      
      // Calculate total price for the item
      const basePrice = newItem.price * newItem.quantity;
      const customizationPrice = newItem.customizations?.reduce(
        (total, customization) => total + (customization.additionalPrice * newItem.quantity),
        0
      ) || 0;
      const totalPrice = basePrice + customizationPrice;
      
      // Check if item with same customizations already exists
      const existingItemIndex = state.items.findIndex(item => 
        item.menuItemId === newItem.menuItemId &&
        JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations) &&
        item.specialInstructions === newItem.specialInstructions
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const existingItem = state.items[existingItemIndex];
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice = (existingItem.price * existingItem.quantity) + 
          (existingItem.customizations?.reduce(
            (total, customization) => total + (customization.additionalPrice * existingItem.quantity),
            0
          ) || 0);
        toast.success(`Updated ${newItem.name} in cart`);
      } else {
        // Add new item
        const cartItem: CartItem = {
          ...newItem,
          id: `${newItem.menuItemId}_${Date.now()}`,
          totalPrice
        };
        state.items.push(cartItem);
        toast.success(`Added ${newItem.name} to cart`);
      }
      
      calculateTotals(state);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        state.items = state.items.filter(item => item.id !== itemId);
        toast.success(`Removed ${item.name} from cart`);
        
        // Clear restaurant info if cart is empty
        if (state.items.length === 0) {
          state.restaurantId = null;
          state.restaurantName = null;
        }
        
        calculateTotals(state);
      }
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        item.totalPrice = (item.price * quantity) + 
          (item.customizations?.reduce(
            (total, customization) => total + (customization.additionalPrice * quantity),
            0
          ) || 0);
        calculateTotals(state);
      }
    },
    
    updateSpecialInstructions: (state, action: PayloadAction<{ id: string; instructions: string }>) => {
      const { id, instructions } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.specialInstructions = instructions;
        calculateTotals(state);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      state.totalItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
      
      localStorage.removeItem('cart');
      localStorage.removeItem('cartRestaurantId');
      localStorage.removeItem('cartRestaurantName');
      
      toast.success('Cart cleared');
    },
    
    // Initialize cart from localStorage on app start
    initializeCart: (state) => {
      calculateTotals(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateSpecialInstructions,
  clearCart,
  initializeCart,
} = cartSlice.actions;

export default cartSlice.reducer;