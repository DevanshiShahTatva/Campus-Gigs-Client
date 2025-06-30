"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Star, GraduationCap, Award, Sliders } from 'lucide-react';
import { MultiSelectDropdown } from '@/components/common/ui/MultiSelectDropdown';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { categories, educationLevels, IFilter, tierOptions } from './helper';

const GigFilterModal = ({ isOpen, onClose, onApplyFilters }: any) => {
  const [filters, setFilters] = useState<IFilter>({
    tier: [],
    rating: 0,
    minReviews: 0,
    priceRange: [0, 1000],
    educationLevel: [],
    category: '',
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
      minReviews: 0,
      priceRange: [0, 10000],
      educationLevel: [],
      category: '',
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
    if (filters.minReviews > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.educationLevel.length > 0) count++;
    if (filters.category) count++;
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
          maxWidth: "90vw",
          minHeight: 360,
          maxHeight: "90vh",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: "0.75rem",
        }}
        className="p-0"
      >
        <div className="px-6 py-5 border-b bg-background rounded-t-[0.75rem]">
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          <div className="bg-white overflow-hidden">
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Seller Tier
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {tierOptions.map((tier) => (
                        <button
                          key={tier.id}
                          onClick={() => handleTierToggle(tier.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${filters.tier.includes(tier.id)
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{tier.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900">{tier.label}</div>
                              <Badge className={`mt-1 ${tier.color} border text-xs`}>
                                Premium Seller
                              </Badge>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Minimum Rating
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingClick(rating)}
                          className={`flex items-center gap-1 px-4 py-2 rounded-lg border-2 transition-all ${filters.rating >= rating
                            ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                        >
                          <Star className={`w-4 h-4 ${filters.rating >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          <span className="text-sm font-medium">{rating}+</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Price Range
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-2 block">Min Price (₹)</div>
                        <Input
                          type="number"
                          placeholder="0"
                          value={filters.priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                          className="h-10 border-2 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2 block">Max Price (₹)</div>
                        <Input
                          type="number"
                          placeholder="10000"
                          value={filters.priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                          className="h-10 border-2 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Selected Range:</span> ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="space-y-2">
                        <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-indigo-600" />
                          Education Level
                        </div>
                        <MultiSelectDropdown
                          options={(educationLevels || []).map((opt) => ({
                            id: opt.id,
                            label: opt.label,
                          }))}
                          value={filters.educationLevel || []}
                          onValueChange={(val) => setFilters((prev) => ({ ...prev, educationLevel: val }))}
                          placeholder="Select Education Level"
                          disabled={false}
                          error={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-red-600" />
                      Minimum Reviews
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 10, 50, 100, 500, 1000].map((count) => (
                        <button
                          key={count}
                          onClick={() => setFilters(prev => ({ ...prev, minReviews: count }))}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${filters.minReviews === count
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                        >
                          <div className="font-semibold">{count}+</div>
                          <div className="text-xs text-gray-500">reviews</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-cyan-600" />
                      Category
                    </div>
                    <Select
                      value={filters.category}
                      onValueChange={(val) => setFilters(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-gray-900">Quick Filters</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        onClick={() => setFilters(prev => ({ ...prev, rating: 4, tier: ['gold', 'platinum'] }))}
                      >
                        ⭐ Top Rated
                      </Badge>
                      <Badge
                        className="cursor-pointer px-4 py-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 1000] }))}
                      >
                        💰 Budget Friendly
                      </Badge>
                      <Badge
                        className="cursor-pointer px-4 py-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                        onClick={() => setFilters(prev => ({ ...prev, tier: ['platinum'] }))}
                      >
                        💎 Premium Only
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              {getActiveFiltersCount() > 0 && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Active Filters ({getActiveFiltersCount()})</h4>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.tier.length > 0 && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        Tier: {filters.tier.join(', ')}
                      </Badge>
                    )}
                    {filters.rating > 0 && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Rating: {filters.rating}+ stars
                      </Badge>
                    )}
                    {filters.educationLevel.length > 0 && (
                      <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                        Education: {filters.educationLevel.length} selected
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-background rounded-b-[0.75rem]">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={clearAllFilters}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="form-modal" onClick={applyFilters}>
              Apply Filters ({getActiveFiltersCount()})
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GigFilterModal;