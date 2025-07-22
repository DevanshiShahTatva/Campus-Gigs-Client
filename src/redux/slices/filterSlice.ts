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

const initialState: IFilter = {
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
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<IFilter>>) => {
      return { ...state, ...action.payload };
    },
    clearFilters: () => initialState,
  },
});

export const { setFilters, clearFilters } = filterSlice.actions;
export default filterSlice.reducer; 