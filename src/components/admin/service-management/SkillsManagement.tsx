'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Database, Edit, Trash } from 'lucide-react'
import { CustomModal } from '@/components/common/CustomModal'
import DynamicForm, { FormFieldConfig } from '@/components/common/form/DynamicForm'
import { CustomTable } from '@/components/common/CustomTable'
import { apiCall } from '@/utils/apiCall'
import { toast } from 'react-toastify'
import TableSkeleton from '@/components/skeleton/TableSkeleton'
import ModalLayout from '@/components/common/Modals/CommonModalLayout'

interface ISkill {
    id: number
    name: string
    categoryId: any | null
    created_at: string
    updated_at: string
    is_deleted: boolean
}
type Column<T> = {
    key: keyof T
    label: string
    sortable?: boolean
    textAlign?: 'left' | 'center' | 'right'
    render?: (value: any, row: T, index: number) => React.ReactNode
}

const initialFormState = {
    name: '',
}

const formConfig: FormFieldConfig[] = [
    {
        title: '',
        description: '',
        groupSize: 1,
        section: false,
        subfields: [
            {
                id: 'name',
                name: 'name',
                label: 'Skill Name',
                type: 'text',
                required: true,
                placeholder: 'Enter Skill',
            },
        ],
    },
]

const SkillsManagement = () => {
    const [skillsData, setSkillsData] = useState<ISkill[]>([])
    const [skillsDataLoading, setSkillsDataLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null)
    const [deleteSkill, setDeleteSkill] = useState<ISkill | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchSkills = useCallback(async () => {
        setSkillsDataLoading(true)
        try {
            const res = await apiCall({ endPoint: '/skills', method: 'GET' })
            setSkillsData(res.data || [])
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch skills'
            toast.error(errorMessage)
        } finally {
            setSkillsDataLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSkills()
    }, [fetchSkills])

    const handleAdd = useCallback(() => {
        setSelectedSkill(null)
        setIsModalOpen(true)
    }, [])

    const handleEdit = useCallback((skill: ISkill) => {
        setSelectedSkill(skill)
        setIsModalOpen(true)
    }, [])

    const handleDelete = useCallback((skill: ISkill) => {
        setDeleteSkill(skill)
        setIsDeleteModalOpen(true)
    }, [])

    const handleCancelDelete = () => {
        setDeleteSkill(null)
        setIsDeleteModalOpen(false)
    }

    const handleSubmit = useCallback(
        async (values: any) => {
            const isEdit = !!selectedSkill
            try {
                const res = await apiCall({
                    endPoint: isEdit ? `/skills/${selectedSkill?.id}` : '/skills',
                    method: isEdit ? 'PUT' : 'POST',
                    body: values,
                })
                if (res.success) {
                    toast.success(`Skill ${isEdit ? 'updated' : 'created'} successfully.`)
                    setIsModalOpen(false)
                    fetchSkills()
                } else {
                    toast.error(res.message ?? "Something went wrong");
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to save skill'
                toast.error(errorMessage)
            }
        },
        [selectedSkill, fetchSkills]
    )

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteSkill) return
        try {
            setDeleteLoading(true)
            const res = await apiCall({
                endPoint: `/skills/${deleteSkill.id}`,
                method: 'DELETE',
            })

            if (res.success) {
                toast.success('Skill deleted successfully.')
                setIsDeleteModalOpen(false)
                fetchSkills()
            } else {
                toast.error(res.message ?? "Something went wrong");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete skill'
            toast.error(errorMessage)
        } finally {
            setDeleteLoading(false)
        }
    }, [deleteSkill, fetchSkills])

    const tableHeaders = [
        { label: 'Skill Name', key: 'name', sortable: true },
    ] satisfies Column<ISkill>[]

    const renderTable = () => {
        if (skillsDataLoading) {
            return <TableSkeleton showSearch rowCount={10} columnCount={1} actionButtonCount={2} />
        }

        // if (skillsData.length === 0) {
        //     return (
        //         <div className="text-center py-8 text-gray-500">
        //             <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
        //             <p>No skills created yet. Add your first skill to get started.</p>
        //         </div>
        //     )
        // }

        return (
            <CustomTable<ISkill>
                searchPlaceholder='Search by Skill Name'
                data={skillsData}
                columns={tableHeaders}
                actions={(row) => (
                    <div className="flex gap-2 justify-center">
                        <button title="edit" className="text-[var(--base)] hover:text-[var(--base-hover)]" onClick={() => handleEdit(row)}>
                            <Edit size={16} />
                        </button>
                        <button title="delete" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row)}>
                            <Trash size={16} />
                        </button>
                    </div>
                )}
                onClickCreateButton={handleAdd}
            />
        )
    }

    return (
        <div className="p-0">
            <div className="grid gap-4 ">{renderTable()}</div>

            {isModalOpen && (
                <CustomModal
                    onClose={() => setIsModalOpen(false)}
                    title={selectedSkill ? 'Edit Skill' : 'Add Skill'}
                >
                    <DynamicForm
                        formConfig={formConfig}
                        onSubmit={handleSubmit}
                        initialValues={selectedSkill || initialFormState}
                    />
                </CustomModal>
            )}

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
                        Are you sure you want to delete this skill?
                    </div>
                </ModalLayout>
            )}
        </div>
    )
}

export default SkillsManagement
