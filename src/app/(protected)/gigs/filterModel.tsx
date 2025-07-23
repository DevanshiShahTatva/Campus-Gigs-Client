"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux';
import { setFilters, clearFilters, setCategoriesWithLabel } from '@/redux/slices/filterSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Star, GraduationCap, Award, Sliders, CalendarIcon } from 'lucide-react';
import { MultiSelectDropdown } from '@/components/common/ui/MultiSelectDropdown';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {  IFilter, ratingList, tierOptions, paymentTypeOptions } from './helper';
import { API_ROUTES } from '@/utils/constant';
import { toast } from 'react-toastify';
import { apiCall } from '@/utils/apiCall';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const GigFilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilter,
  onActiveFilterCountChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: IFilter) => void;
  onClearFilter: () => void;
  onActiveFilterCountChange?: (count: number) => void;
}) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter);
  const [localFilters, setLocalFilters] = useState<IFilter>(filters);
  const [priceError, setPriceError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [gigCategoryDropdown, setGigCategoryDropdown] = useState<{id: string, label: string}[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

 const handleTierToggle = (tierId: string) => {
    const newTier = localFilters.tier.includes(tierId)
      ? localFilters.tier.filter(t => t !== tierId)
      : [...localFilters.tier, tierId];
    setLocalFilters({ ...localFilters, tier: newTier });
  };

  const handleRatingClick = (rating: number) => {
    setLocalFilters({ ...localFilters, rating: localFilters.rating === rating ? 0 : rating });
  };
  const handlePriceRangeChange = (index: number, value: string) => {
    let newValue = Math.max(0, parseInt(value) || 0);
    let newRange = [...localFilters.priceRange];
    newRange[index] = newValue;

    if ((newRange[0] > 0 && newRange[1] === 0)) {
      setPriceError("Please fill both min and max price.");
    } else if (newRange[0] > newRange[1]) {
      setPriceError("Min price cannot be greater than max price.");
    } else {
      setPriceError("");
    }

    setLocalFilters({ ...localFilters, priceRange: newRange });
  };

  const handlePaymentTypeToggle = (type: string) => {
    const newPaymentType = localFilters.paymentType.includes(type)
      ? localFilters.paymentType.filter((t: any) => t !== type)
      : [...localFilters.paymentType, type];
    setLocalFilters({ ...localFilters, paymentType: newPaymentType });
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({ ...filters, tier: [], rating: 0, minReviews: "", priceRange: [0, 0], educationLevel: [], category: [], duration: "", location: "", paymentType: [], startDate: "", endDate: "" });
    onClearFilter();
    onClose();
  };

 
  const applyFilters = () => {
    // Save local filters to Redux
    dispatch(setFilters(localFilters));
    const matchedCategories = gigCategoryDropdown.filter(cat =>
      localFilters.category.includes(cat.id)
    );
    dispatch(setCategoriesWithLabel(matchedCategories));
    
    onApplyFilters(localFilters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.tier.length > 0) count++;
    if (localFilters.rating > 0) count++;
    if (localFilters.minReviews) count++;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] > 0) count++;
    if (localFilters.educationLevel.length > 0) count++;
    if (localFilters.category.length > 0) count++;
    if (localFilters.duration) count++;
    if (localFilters.location) count++;
    if (localFilters.paymentType.length > 0) count++;
    if (localFilters.startDate) count++;
    if (localFilters.endDate) count++;
    return count;
  };

  

  // Notify parent of active filter count
  React.useEffect(() => {
    if (onActiveFilterCountChange) {
      onActiveFilterCountChange(getActiveFiltersCount());
    }
  }, [localFilters]);

  React.useEffect(() => {
    if (localFilters.startDate && localFilters.endDate) {
      if (new Date(localFilters.endDate) < new Date(localFilters.startDate)) {
        setDateError("End date cannot be before start date.");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [localFilters.startDate, localFilters.endDate]);

  React.useEffect(() => {
    const fetchGigCategories = async () => {
      try {
        const resp = await apiCall({
          endPoint: API_ROUTES.GIG_CATEGORY,
          method: "GET",
        });
        if (resp?.success) {
          const options = resp.data.map((opt: { id: number; name: string }) => ({
            id: String(opt.id),
            label: opt.name,
          }));
          setGigCategoryDropdown(options);
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchGigCategories();
  }, []);

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
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left ${localFilters.tier.includes(tier.id)
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
                      className={`flex items-center gap-1 px-3 py-2 sm:px-4 rounded-lg border-2 transition-all ${localFilters.rating >= rating
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                    >
                      <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${localFilters.rating >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
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
                      value={localFilters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                      className="h-9 sm:h-10"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-600 mb-2 block">Max Price (₹)</label>
                    <Input
                      type="number"
                      min={localFilters.priceRange[0]}
                      placeholder="10000"
                      value={localFilters.priceRange[1]}
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
              <div className="space-y-3 sm:space-y-4">
                <label className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                  Category
                </label>
                <MultiSelectDropdown
                  error={false}
                  disabled={false}
                  placeholder="Select Category"
                  value={localFilters.category || []}
                  options={gigCategoryDropdown.map((opt) => ({ id: opt.id as string, label: opt.label as string }))}
                  onValueChange={(val) => setLocalFilters({ ...localFilters, category: val })}
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  Minimum Reviews
                </div>
                <Select
                  value={localFilters.minReviews}
                  onValueChange={(val) => setLocalFilters({...localFilters, minReviews: val})}
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
                      className={`px-4 py-2 w-full rounded-lg border-2 transition-all font-medium text-sm sm:text-base ${localFilters.paymentType.includes(option.id)
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
                      selected={localFilters.startDate ? new Date(localFilters.startDate) : null}
                      onChange={date => setLocalFilters({ ...localFilters, startDate: date ? date.toISOString().split('T')[0] : '' })}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Start Date"
                      className={`w-full pr-10 px-4 border text-black disabled:bg-gray-100 disabled:text-gray-500 border-gray-300 rounded-lg h-11 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)]`}
                      showTimeSelect={false}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <DatePicker
                      selected={localFilters.endDate ? new Date(localFilters.endDate) : null}
                      onChange={date => setLocalFilters({ ...localFilters, endDate: date ? date.toISOString().split('T')[0] : '' })}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="End Date"
                      className={`w-full pr-10 px-4 border text-black disabled:bg-gray-100 disabled:text-gray-500 border-gray-300 rounded-lg h-11 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--base)] focus:border-[var(--base)]`}
                      showTimeSelect={false}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                  </div>
                </div>
                {dateError && (
                  <div className="text-red-500 text-xs mt-1">{dateError}</div>
                )}
              </div>

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
              disabled={!!priceError || !!dateError}
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