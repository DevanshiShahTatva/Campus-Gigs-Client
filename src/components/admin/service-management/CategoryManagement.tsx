'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardTitle } from '@/components/ui/card';
import { Component, Plus, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/common/CustomModal';
import DynamicForm, { FormFieldConfig } from '@/components/common/form/DynamicForm';
import { toast } from "react-toastify";
import { apiCall } from '@/utils/apiCall';
import { Badge } from '@/components/ui/badge';

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
                id: "tier",
                name: "tier",
                label: "Tier",
                type: "select",
                required: true,
                placeholder: "Select Tier",
            },
            {
                id: "skills",
                name: "skills",
                label: "Skills",
                type: "multiselect",
                required: true,
                placeholder: "Select multiple skills",
            },
            ],
        }
    ]

    const initialValues = {
        title: "",
        description: ""
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

    return (
        <Card className='p-0'>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg p-6">
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
                {NoDataMsg()}

                {[1].map((tier, index) => {
                    const tierCategories: any[] = [];
                    return (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Badge>
                                            tier.name
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 mb-3">tier.description</p>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span>{tierCategories.length} categories</span>
                                        {tierCategories.length > 0 && (
                                            <>
                                                <ChevronRight className="w-4 h-4" />
                                                <div className="flex flex-wrap gap-1">
                                                    {tierCategories.slice(0, 3).map(category => (
                                                        <Badge key={category.id} variant="outline" className="text-xs">
                                                            {category.name}
                                                        </Badge>
                                                    ))}
                                                    {tierCategories.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{tierCategories.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {AddModal()}
        </Card>
    )
}

export default CategoryManagement