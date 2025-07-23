import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IFilter {
  tier: string[];
  rating: number;
  minReviews: string;
  priceRange: number[];
  educationLevel: string[];
  category: string[];
  duration: string;
  location: string;
  paymentType: string[];
  startDate: string;
  endDate: string;
}

const initialState: IFilter & { categoriesWithLabel: { id: string, label: string }[] } = {
  tier: [],
  rating: 0,
  minReviews: '',
  priceRange: [],
  educationLevel: [],
  category: [],
  duration: '',
  location: '',
  paymentType: [],
  startDate: '',
  endDate: '',
  categoriesWithLabel: [], // extend without modifying IFilter
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<IFilter>>) => {
      return { ...state, ...action.payload };
    },
    clearFilters: () => initialState,
    setCategoriesWithLabel: (state, action: PayloadAction<{id:string, label:string}[]>) => {      
      state.categoriesWithLabel = action.payload;
    },
    removeTier: (state, action: PayloadAction<string>) => {
      state.tier = state.tier.filter(t => t !== action.payload);
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.category = state.category.filter(c => c !== action.payload);
    },
    removePaymentType: (state, action: PayloadAction<string>) => {
        console.log("CALLED");
        
      state.paymentType = state.paymentType.filter(p => p !== action.payload);
    },
    removeEducationLevel: (state, action: PayloadAction<string>) => {
      state.educationLevel = state.educationLevel.filter(e => e !== action.payload);
    },
    removePriceRange: (state) => {
      state.priceRange = [];
    },
    removeStartDate: (state) => {
      state.startDate = '';
    },
    removeEndDate: (state) => {
      state.endDate = '';
    },
    removeRating: (state) => {
      state.rating = 0;
    },
    removeMinReviews: (state) => {
      state.minReviews = '';
    },
    removeDuration: (state) => {
      state.duration = '';
    },
    removeLocation: (state) => {
      state.location = '';
    },
  },
});

export const { 
  setFilters, 
  setCategoriesWithLabel,
  clearFilters, 
  removeTier, 
  removeCategory, 
  removePaymentType, 
  removeEducationLevel, 
  removePriceRange, 
  removeStartDate, 
  removeEndDate, 
  removeRating, 
  removeMinReviews, 
  removeDuration, 
  removeLocation 
} = filterSlice.actions;
export default filterSlice.reducer; 