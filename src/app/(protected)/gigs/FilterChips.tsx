"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
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
} from '@/redux/slices/filterSlice';

const FilterChips: React.FC = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.filter);

    const handleRemoveFilter = (filterType: string, value?: string) => {

        switch (filterType) {
            case 'tier':
                if (value) {
                    dispatch(removeTier(value));
                }
                break;
            case 'categoryCombined':
                filters.category.forEach(cat => {
                    dispatch(removeCategory(cat));
                });
                break;
            case 'paymentTypeCombined':
                filters.paymentType.forEach(type => {
                    dispatch(removePaymentType(type));
                });
                break;
            case 'educationLevel':
                if (value) {
                    dispatch(removeEducationLevel(value));
                }
                break;
            case 'priceRange':
                dispatch(removePriceRange());
                break;
            case 'dateRange':
                dispatch(removeStartDate());
                dispatch(removeEndDate());
                break;
            case 'rating':
                dispatch(removeRating());
                break;
            case 'minReviews':
                dispatch(removeMinReviews());
                break;
            case 'duration':
                dispatch(removeDuration());
                break;
            case 'location':
                dispatch(removeLocation());
                break;
        }
    };

    const renderChip = (label: string, filterType: string, value?: string, variant: string = 'default') => (
        <Badge
            key={`${filterType}-${value || 'single'}`}
            variant="secondary"
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium cursor-pointer hover:bg-gray-200 transition-colors ${getChipStyle(variant)}`}
        >
            <span>{label}</span>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFilter(filterType, value);
                }}
            >
                <X
                    size={14}
                    className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                />
            </div>
        </Badge>
    );

    const getChipStyle = (variant: string) => {
        switch (variant) {
            case 'tier':
                return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
            case 'rating':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
            case 'education':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200';
            case 'category':
                return 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200';
            case 'reviews':
                return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
            case 'price':
                return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
            case 'payment':
                return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
            case 'date':
                return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
            case 'duration':
                return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
            case 'location':
                return 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
        }
    };

    const getFilterChips = () => {
        const chips: React.JSX.Element[] = [];

        // Tier filters
        filters.tier.forEach(tier => {
            chips.push(renderChip(`Tier: ${tier}`, 'tier', tier, 'tier'));
        });

        // Rating filter
        if (filters.rating > 0) {
            chips.push(renderChip(`Rating: ${filters.rating}+ stars`, 'rating', undefined, 'rating'));
        }

        // Education level filters
        filters.educationLevel.forEach(level => {
            chips.push(renderChip(`Education: ${level}`, 'educationLevel', level, 'education'));
        });

        // Category filters
        if (filters.category.length > 0) {
            const label = `Category: ${filters.categoriesWithLabel.map(item => item.label).join(', ')}`;
            chips.push(renderChip(label, 'categoryCombined', undefined, 'category'));
        }
        // Min reviews filter
        if (filters.minReviews) {
            chips.push(renderChip(`Min Reviews: ${filters.minReviews}`, 'minReviews', undefined, 'reviews'));
        }

        // Price range filter
        if (filters.priceRange.length > 0 && (filters.priceRange[0] > 0 || filters.priceRange[1] > 0)) {
            const [min, max] = filters.priceRange;
            const displayMin = min || max;
            const displayMax = max || min;
            chips.push(renderChip(`Price: ₹${displayMin}-₹${displayMax}`, 'priceRange', undefined, 'price'));
        }

        // Payment type filters
        if (filters.paymentType.length > 0) {
            const label = `Payment: ${filters.paymentType.join(', ')}`;
            chips.push(renderChip(label, 'paymentTypeCombined', undefined, 'payment'));
        }

        // Date filters
        if (filters.startDate || filters.endDate) {
            let label = 'Date: ';
            if (filters.startDate && filters.endDate) {
                label += `${filters.startDate} → ${filters.endDate}`;
            } else if (filters.startDate) {
                label += `From ${filters.startDate}`;
            } else if (filters.endDate) {
                label += `Until ${filters.endDate}`;
            }
            chips.push(renderChip(label, 'dateRange', undefined, 'date'));
        }

        // Duration filter
        if (filters.duration) {
            chips.push(renderChip(`Duration: ${filters.duration}`, 'duration', undefined, 'duration'));
        }

        // Location filter
        if (filters.location) {
            chips.push(renderChip(`Location: ${filters.location}`, 'location', undefined, 'location'));
        }

        return chips;
    };

    const activeChips = getFilterChips();

    if (activeChips.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                <span className="text-xs text-gray-500">({activeChips.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {activeChips}
            </div>
        </div>
    );
};

export default FilterChips;
