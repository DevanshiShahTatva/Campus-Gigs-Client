'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Component, Edit, Trash } from 'lucide-react';
import { CustomModal } from '@/components/common/CustomModal';
import DynamicForm, { FormFieldConfig } from '@/components/common/form/DynamicForm';
import { toast } from "react-toastify";
import { apiCall } from '@/utils/apiCall';
import { IDropdownOption } from '@/utils/interface';
import ModalLayout from '@/components/common/Modals/CommonModalLayout';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import { CustomTable } from '@/components/common/CustomTable';
import { Badge } from '@/components/ui/badge';

interface ICategory {
    id: number
    name: string
    description: string
    tire_id: number
    created_at: string
    updated_at: string
    is_deleted: boolean
    tire: ITier
    skills: ISkill[]
}

interface ITier {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
    is_deleted: boolean
}

interface ISkill {
    id: number
    name: string
    categoryId: number
    created_at: string
    updated_at: string
    is_deleted: boolean
}

interface IForm {
    name: string;
    description: string;
    tire_id: string;
    skillIds: string[];
}

type Column<T> = {
    key: keyof T
    label: string
    sortable?: boolean
    textAlign?: 'left' | 'center' | 'right'
    render?: (value: any, row: T, index: number) => React.ReactNode
}

const initialValues: IForm = {
    name: '',
    description: '',
    tire_id: '',
    skillIds: [],
};

function NoDataMsg() {
    return (
        <div className="text-center py-8 text-gray-500">
            <Component className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No categories created yet. Create tiers and skills first to organize categories.</p>
        </div>
    );
}
function CategoryManagement() {
    const [categoriesData, setCategoriesData] = useState<ICategory[]>([]);
    const [categoriesDataLoading, setCategoriesDataLoading] = useState(true);
    const [isModalOpen, SetIsModalOpen] = useState<boolean>(false);
    const [tierDropdown, setTierDropdown] = useState<IDropdownOption[]>([]);
    const [skillsDropdown, setSkillsDropdown] = useState<IDropdownOption[]>([]);
    const [editCategory, setEditCategory] = useState<ICategory | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Number | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleToggleModal = (value: boolean) => {
        if (!value) setEditCategory(null);
        SetIsModalOpen(value);
    };

    const getInitialValues = (): IForm => {
        if (editCategory) {
            const editValue = {
                name: editCategory.name || '',
                description: editCategory.description || '',
                tire_id: String(editCategory.tire_id) || '',
                skillIds: editCategory.skills?.map((s: any) => String(s.id)) || [],
            }
            return editValue
        }
        return initialValues;
    };

    const getFormConfig = (): FormFieldConfig[] => [
        {
            title: '',
            description: '',
            groupSize: 1,
            section: false,
            subfields: [
                {
                    id: 'name',
                    name: 'name',
                    label: 'Category Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter Category Name',
                },
                {
                    id: 'description',
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Enter Description here...',
                },
                {
                    id: 'tire_id',
                    name: 'tire_id',
                    label: 'Tier',
                    type: 'select',
                    required: true,
                    placeholder: 'Select Tier',
                    options: tierDropdown,
                },
                {
                    id: 'skillIds',
                    name: 'skillIds',
                    label: 'Skills',
                    type: 'multiselect',
                    required: true,
                    placeholder: 'Select multiple skills',
                    options: skillsDropdown,
                },
            ],
        },
    ];

    const handleSubmit = async (values: IForm) => {
        try {
            const endpoint = editCategory ? `/gig-category/${editCategory.id}` : `/gig-category`;
            const method = editCategory ? 'PUT' : 'POST';

            const payload = {
                ...values,
                tire_id: Number(values.tire_id),
                skillIds: values.skillIds.map(Number),
            };

            const res = await apiCall({ endPoint: endpoint, method, body: payload });

            if (res.success) {
                toast.success(res.message || (editCategory ? 'Category updated successfully.' : 'Category added successfully.'));
                fetchCategories();
                SetIsModalOpen(false);
                setEditCategory(null);
            } else {
                toast.error(res.message);
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save category';
            toast.error(errorMessage);
        }
    };

    const AddModal = () => {
        return (
            isModalOpen && (
                <CustomModal
                    onClose={() => handleToggleModal(false)}
                    title={editCategory ? 'Edit Category' : 'Add Category'}
                >
                    <DynamicForm
                        formConfig={getFormConfig()}
                        onSubmit={handleSubmit}
                        initialValues={getInitialValues()}
                    />
                </CustomModal>
            )
        );
    };

    const fetchTierDropdown = useCallback(async () => {
        try {
            const res = await apiCall({ endPoint: '/tire/dropdown', method: 'GET' });
            if (res?.data?.length) {
                setTierDropdown(res.data || []);
            }
        } catch (error) {
            console.log('Failed to fetch tier list');
        }
    }, []);

    const fetchSkillsDropdown = useCallback(async () => {
        try {
            const res = await apiCall({ endPoint: '/skills/dropdown', method: 'GET' });
            if (res?.data?.length) {
                setSkillsDropdown(res.data || []);
            }
        } catch (error) {
            console.log('Failed to fetch skills list');
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        setCategoriesDataLoading(true);
        try {
            const res = await apiCall({ endPoint: '/gig-category', method: 'GET' });
            if (res?.data?.length) {
                setCategoriesData(res.data || []);
            }
        } catch (error) {
            console.log('Failed to fetch categories');
        } finally {
            setCategoriesDataLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchTierDropdown();
        fetchSkillsDropdown();
    }, [fetchCategories]);

    const handleEdit = useCallback((category: ICategory) => {
        setEditCategory(category);
        handleToggleModal(true);
    }, [])

    const handleDelete = useCallback((categoryId: Number) => {
        setDeleteCategory(categoryId)
        setIsDeleteModalOpen(true)
    }, [])

    const handleCancelDelete = () => {
        setDeleteCategory(null)
        setIsDeleteModalOpen(false)
    }

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteCategory) return
        try {
            setDeleteLoading(true)
            const res = await apiCall({
                endPoint: `/gig-category/${deleteCategory}`,
                method: 'DELETE',
            })

            if (res.success) {
                toast.success('Category deleted successfully.')
                setIsDeleteModalOpen(false)
                fetchCategories()
            } else {
                toast.error(res.message ?? "Something went wrong");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete skill'
            toast.error(errorMessage)
        } finally {
            setDeleteLoading(false)
        }
    }, [deleteCategory, fetchCategories])

    const tableHeaders = [
        {
            label: 'Tier',
            key: 'tire',
            sortable: false,
            render: (_, row) => (
                <div>{row?.tire?.name}</div>
            )
        },
        {
            label: 'Category Name',
            key: 'name',
            sortable: true
        },
        {
            label: "Skills",
            key: 'skills',
            sortable: true,
            render: (_, row) => (
                <div className="text-sm">
                    <div className="space-y-1">
                        {row.skills.map((skill, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-center gap-1 whitespace-nowrap">
                                <Badge>{skill.name}</Badge>

                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            label: 'Description',
            key: 'description',
            sortable: true
        },

    ] satisfies Column<ICategory>[]

    const renderTable = () => {
        if (categoriesDataLoading) {
            return <TableSkeleton showSearch rowCount={10} columnCount={1} actionButtonCount={2} />
        }

        // if (categoriesData.length === 0) {
        //     return NoDataMsg()
        // }

        return (
            <CustomTable<ICategory>
                data={categoriesData}
                columns={tableHeaders}
                searchPlaceholder='Search by Category Name or Description'
                actions={(row) => (
                    <div className="flex gap-2 justify-center">
                        <button title="edit" className="text-[var(--base)] hover:text-[var(--base-hover)]" onClick={() => handleEdit(row)}>
                            <Edit size={16} />
                        </button>
                        <button title="delete" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row as any)}>
                            <Trash size={16} />
                        </button>
                    </div>
                )}
                onClickCreateButton={() => handleToggleModal(true)}
            />
        )
    }

    return (
        <div className="p-0">
            <div className="grid gap-4">
                {renderTable()}
            </div>

            {isDeleteModalOpen && (
                <ModalLayout
                    onClose={handleCancelDelete}
                    modalTitle="Delete Skill"
                    footerActions={[
                        {
                            label: 'Cancel',
                            variant: 'secondary',
                            onClick: handleCancelDelete,
                        },
                        {
                            label: 'Delete',
                            variant: 'delete',
                            onClick: handleConfirmDelete,
                            disabled: deleteLoading
                        },
                    ]}
                >
                    <div className="py-6 text-center text-[var(--text-dark)] text-lg">
                        Are you sure you want to delete this category?
                    </div>
                </ModalLayout>
            )}

            {AddModal()}
        </div>
    );
}

export default CategoryManagement;
