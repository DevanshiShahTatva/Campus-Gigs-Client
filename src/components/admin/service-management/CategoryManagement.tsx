'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardTitle } from '@/components/ui/card';
import { Component, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/common/CustomModal';
import DynamicForm, { FormFieldConfig } from '@/components/common/form/DynamicForm';
import { toast } from "react-toastify";
import { apiCall } from '@/utils/apiCall';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function NoDataMsg() {
    return (
        <div className="text-center py-8 text-gray-500">
            <Component className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No categories created yet. Create tiers first to organize categories.</p>
        </div>
    )
}


function CategoryManagement() {
    const [categoriesData, setCategoriesData] = useState<any[]>([])
    const [categoriesDataLoading, setCategoriesDataLoading] = useState(false)

    const [isModalOpen, SetIsModalOpen] = useState<boolean>(false)
    const [isTableLoading, setIsTableLoading] = useState<boolean>(false)

    const handleToggleModal = (value: boolean) => {
        SetIsModalOpen(value)
    }

    const formConfig: FormFieldConfig[] = [
        {
            title: "",
            description: "",
            groupSize: 1,
            section: false,
            subfields: [{
                id: "name",
                name: "name",
                label: "Category Name",
                type: "text",
                required: true,
                placeholder: "Enter Category Name",
            },
            {
                id: "description",
                name: "description",
                label: "Description",
                type: "textarea",
                required: false,
                placeholder: "Enter Description here...",
            },
            {
                id: "tire_id",
                name: "tire_id",
                label: "Tier",
                type: "select",
                required: true,
                placeholder: "Select Tier",
            },
            {
                id: "skillIds",
                name: "skillIds",
                label: "Skills",
                type: "multiselect",
                required: true,
                placeholder: "Select multiple skills",
            },
            ],
        }
    ]

    const initialValues = {
        name: "",
        description: "",
        tire_id: "",
        skillIds: []
    }

    const handleSubmit = (values: any) => {
        console.log("VALUESSs", values)
    }

    const AddModal = () => {
        return isModalOpen &&
            <CustomModal
                onClose={() => handleToggleModal(false)}
                title='Modal'
            >
                <DynamicForm
                    formConfig={formConfig}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                />
            </CustomModal>
    }



    const fetchCategories = useCallback(async () => {
        setCategoriesDataLoading(true)
        try {
            const res = await apiCall({ endPoint: '/gig-category', method: 'GET' })
            if (res?.data?.length) {
                setCategoriesData(res.data || [])
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch skills'
            toast.error(errorMessage)
        } finally {
            setCategoriesDataLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const groupByTier = () => {
        const tierMap: { [tierId: number]: { tier: any; categories: any[] } } = {}
        categoriesData.forEach((category) => {
            const tierId = category.tire_id
            if (!tierMap[tierId]) {
                tierMap[tierId] = { tier: category.tire, categories: [] }
            }
            tierMap[tierId].categories.push(category)
        })
        return Object.values(tierMap)
    }

    const grouped = groupByTier()
    return (
        <Card className='p-0'>
            <div className="bg-gradient-to-r from-blue-400 to-blue-800 text-white rounded-t-lg p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Component className="w-6 h-6" />
                        <CardTitle className="text-xl">Category Management</CardTitle>
                    </div>

                    <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100"
                        onClick={() => handleToggleModal(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>
            </div>


            <div className="grid gap-4 px-6 pb-6">
                {categoriesDataLoading ? (
                    [...Array(3)].map((_, i) => (
                        <Card key={i} className="p-6">
                            <Skeleton className="h-6 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex flex-wrap gap-2">
                                {[...Array(3)].map((_, j) => (
                                    <Skeleton key={j} className="h-6 w-20 rounded-full" />
                                ))}
                            </div>
                        </Card>
                    ))
                ) : categoriesData.length === 0 ? (
                    <NoDataMsg />
                ) : (
                    grouped.map((group, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="mb-4">
                                <Badge>{group.tier?.name}</Badge>
                            </div>
                            {group.categories.map((category) => (
                                <div key={category.id} className="mb-4 border p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-medium">{category.name}</p>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                                        <span className="font-medium">Skills:</span>
                                        {category.skills?.map((skill: any) => (
                                            <Badge key={skill.id} variant="secondary">
                                                {skill.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
            {AddModal()}
        </Card>
    )
}

export default CategoryManagement