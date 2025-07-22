"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Star, GraduationCap, Award, Sliders, CalendarIcon } from 'lucide-react';
import { MultiSelectDropdown } from '@/components/common/ui/MultiSelectDropdown';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { categories, educationLevels, IFilter, ratingList, tierOptions, paymentTypeOptions } from './helper';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const GigFilterModal = ({ isOpen, onClose, onApplyFilters, onClearFilter }: { isOpen: boolean; onClose: () => void; onApplyFilters: (filters: IFilter) => void; onClearFilter: ()=> void; }) => {
  const [filters, setFilters] = useState<IFilter>({
    tier: [],
    rating: 0,
    minReviews: '',
    priceRange: [],
    educationLevel: [],
    category: [],
    duration: '',
    location: '',
    paymentType:[],
    startDate: '',
    endDate: '',
  });
  const [priceError, setPriceError] = useState<string>("");


  const handleTierToggle = (tierId: string) => {
    setFilters(prev => ({
      ...prev,
      tier: prev.tier.includes(tierId)
        ? prev.tier.filter(t => t !== tierId)
        : [...prev.tier, tierId]
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const handlePriceRangeChange = (index: number, value: string) => {
    // setFilters(prev => ({
    //   ...prev,
    //   priceRange: prev.priceRange.map((price, i) => i === index ? parseInt(value) : price)
    // }));

    let newValue = Math.max(0, parseInt(value) || 0);
    setFilters(prev => {
      let newRange = [...prev.priceRange];
      newRange[index] = newValue;
      if ((newRange[0] > 0 && newRange[1] === 0)) {
        setPriceError("Please fill both min and max price.");
      } else if (newRange[0] > newRange[1]) {
        setPriceError("Min price cannot be greater than max price.");
      } else {
        setPriceError("");
      }
      return { ...prev, priceRange: newRange };
    });
  };

  const handlePaymentTypeToggle = (type: string) => {
    setFilters((prev:any) => ({
      ...prev,
      paymentType: prev?.paymentType.includes(type)
        ? prev.paymentType.filter((t:any) => t !== type)
        : [...prev.paymentType, type]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      tier: [],
      rating: 0,
      minReviews: '',
      priceRange: [ ],
      educationLevel: [],
      category: [],
      duration: '',
      location: '',
      paymentType:[],
      startDate: '',
      endDate: '',
    });
    onClearFilter();
    onClose();
  };

  const applyFilters = () => {
    // let newFilters = { ...filters };
    // if ((filters.priceRange[0] > 0 && filters.priceRange[1] === 0)) {
    //   newFilters.priceRange[1] = filters.priceRange[0];
    // } else if ((filters.priceRange[1] > 0 && filters.priceRange[0] === 0)) {
    //   newFilters.priceRange[0] = filters.priceRange[1];
    // }
    // onApplyFilters(newFilters);
    // // onApplyFilters(filters);
    // onClose();

    let newFilters = { ...filters };
    // Ensure priceRange is always [min, max]
    let priceRange = Array.isArray(newFilters.priceRange) ? [...newFilters.priceRange] : [0, 0];
    priceRange[0] = priceRange[0] || 0;
    priceRange[1] = priceRange[1] || 0;
    if ((priceRange[0] > 0 && priceRange[1] === 0)) {
      priceRange[1] = priceRange[0];
    } else if ((priceRange[1] > 0 && priceRange[0] === 0)) {
      priceRange[0] = priceRange[1];
    }
    // newFilters.priceRange = priceRange;
     if (priceRange[0] === 0 && priceRange[1] === 0) {
       newFilters.priceRange=[];
    } else {
      newFilters.priceRange = priceRange;
    }
    
    onApplyFilters(newFilters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.tier.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.minReviews) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] > 0) count++;
    if (filters.educationLevel.length > 0) count++;
    if (filters.category.length > 0) count++;
    if (filters.duration) count++;
    if (filters.location) count++;
    if (filters.paymentType.length > 0) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{
          minHeight: "auto",
          maxHeight: "90vh",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: "0.75rem",
          margin: "auto",
        }}
        className="gap-0 p-0 sm:w-[90vw] md:w-[80vw] lg:w-[60vw]"
      >
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b bg-background rounded-t-[0.75rem] flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Filter</DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="bg-white">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  Seller Tier
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tierOptions.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => handleTierToggle(tier.id)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left ${filters.tier.includes(tier.id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">{tier.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{tier.label}</div>
                          <Badge className={`mt-1 ${tier.color} border text-xs`}>
                            Premium Seller
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  Minimum Rating
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      className={`flex items-center gap-1 px-3 py-2 sm:px-4 rounded-lg border-2 transition-all ${filters.rating >= rating
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                    >
                      <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${filters.rating >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                        }`} />
                      <span className="text-xs sm:text-sm font-medium">{rating}+</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Price Range
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600 mb-2 block">Min Price (₹)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                      className="h-9 sm:h-10"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600 mb-2 block">Max Price (₹)</label>
                    <Input
                      type="number"
                      min={filters.priceRange[0]}
                      placeholder="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                      className="h-9 sm:h-10"
                    />
                  </div>
                </div>
                {/* Price Range Error Message */}
                {priceError && (
                  <div className="text-red-500 text-xs mt-1">{priceError}</div>
                )}
              </div>
              {/* <div className="space-y-3 sm:space-y-4">
                <label className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  Education Level
                </label>
                <MultiSelectDropdown
                  error={false}
                  disabled={false}
                  placeholder="Select Education Level"
                  value={filters.educationLevel || []}
                  options={(educationLevels || []).map((opt) => ({ id: opt.id, label: opt.label }))}
                  onValueChange={(val) => setFilters((prev) => ({ ...prev, educationLevel: val }))}
                />
              </div> */}
              <div className="space-y-3 sm:space-y-4">
                <label className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                  Category
                </label>
                <MultiSelectDropdown
                  error={false}
                  disabled={false}
                  placeholder="Select Category"
                  value={filters.category || []}
                  options={(categories || []).map((opt) => ({ id: opt, label: opt }))}
                  onValueChange={(val) => setFilters((prev) => ({ ...prev, category: val }))}
                />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  Minimum Reviews
                </div>
                <Select
                  value={filters.minReviews}
                  onValueChange={(val) => setFilters(prev => ({ ...prev, minReviews: val }))}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Select Minimum Reviews" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingList.map((option) => (
                      <SelectItem key={option.id} value={option.label} className="text-sm sm:text-base">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Payment Type Filter */}
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  Payment Type
                </div>
                <div className="flex gap-3">
                  {paymentTypeOptions.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handlePaymentTypeToggle(option.id)}
                      className={`px-4 py-2 w-full rounded-lg border-2 transition-all font-medium text-sm sm:text-base ${filters.paymentType.includes(option.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  Date Range
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <DatePicker
                      selected={filters.startDate ? new Date(filters.startDate) : null}
                      onChange={date => setFilters(prev => ({ ...prev, startDate: date ? date.toISOString().split('T')[0] : '' }))}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Start Date"
                      className={`w-full pr-10 px-4 border text-black disabled:bg-gray-100 disabled:text-gray-500 border-gray-300 rounded-lg h-11 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)]`}
                      showTimeSelect={false}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <DatePicker
                      selected={filters.endDate ? new Date(filters.endDate) : null}
                      onChange={date => setFilters(prev => ({ ...prev, endDate: date ? date.toISOString().split('T')[0] : '' }))}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="End Date"
                      className={`w-full pr-10 px-4 border text-black disabled:bg-gray-100 disabled:text-gray-500 border-gray-300 rounded-lg h-11 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)]`}
                      showTimeSelect={false}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {getActiveFiltersCount() > 0 && (
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Active Filters ({getActiveFiltersCount()})
                    </h4>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.tier.length > 0 && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                        Tier: {filters.tier.join(', ')}
                      </Badge>
                    )}
                    {filters.rating > 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                        Rating: {filters.rating}+ stars
                      </Badge>
                    )}
                    {filters.educationLevel.length > 0 && (
                      <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs">
                        Education: {filters.educationLevel.length} selected
                      </Badge>
                    )}
                    {filters.category.length > 0 && (
                      <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 text-xs">
                        Category: {filters.category.length} selected
                      </Badge>
                    )}
                    {filters.minReviews && (
                      <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                        Reviews: {filters.minReviews}
                      </Badge>
                    )}
                    {/* {
                      (filters.priceRange[0] > 0 || filters.priceRange[1] > 0) && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          Price: ₹{filters.priceRange[0] == null ? filters.priceRange[1] : filters.priceRange[0]}-₹{filters.priceRange[1] == null ? filters.priceRange[0] : filters.priceRange[1]}
                        </Badge>
                      )} */}
                      {
  (() => {
    const [min, max] = filters.priceRange;
    if (min > 0 || max > 0) {
      // If one is null/undefined, use the other value
      const displayMin = min ?? max;
      const displayMax = max ?? min;
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
          Price: ₹{displayMin}-₹{displayMax}
        </Badge>
      );
    }
    return null;
  })()
}
                    {filters.paymentType.length > 0 && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                        Payment Type: {filters.paymentType.join(', ')}
                      </Badge>
                    )}
                    {filters.startDate && (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                        Start: {filters.startDate}
                      </Badge>
                    )}
                    {filters.endDate && (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                        End: {filters.endDate}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 border-t bg-background rounded-b-[0.75rem] flex-shrink-0">
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={clearAllFilters}
                className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!!priceError}
              onClick={applyFilters}
              className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
            >
              Apply Filters ({getActiveFiltersCount()})
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GigFilterModal;