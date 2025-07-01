"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Star, GraduationCap, Award, Sliders } from 'lucide-react';
import { MultiSelectDropdown } from '@/components/common/ui/MultiSelectDropdown';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { categories, educationLevels, IFilter, ratingList, tierOptions } from './helper';

const GigFilterModal = ({ isOpen, onClose, onApplyFilters }: { isOpen: boolean; onClose: () => void; onApplyFilters: (filters: IFilter) => void }) => {
  const [filters, setFilters] = useState<IFilter>({
    tier: [],
    rating: 0,
    minReviews: '',
    priceRange: [0, 1000],
    educationLevel: [],
    category: [],
    duration: '',
    location: ''
  });

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
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange.map((price, i) => i === index ? parseInt(value) : price)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      tier: [],
      rating: 0,
      minReviews: '',
      priceRange: [0, 10000],
      educationLevel: [],
      category: [],
      duration: '',
      location: ''
    });
    onClose();
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.tier.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.minReviews) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.educationLevel.length > 0) count++;
    if (filters.category.length > 0) count++;
    if (filters.duration) count++;
    if (filters.location) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{
          width: "60vw",
          maxWidth: "800px",
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
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600 mb-2 block">Max Price (₹)</label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                      className="h-9 sm:h-10"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
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
              </div>
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
                    {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        Price: ₹{filters.priceRange[0]}-₹{filters.priceRange[1]}
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