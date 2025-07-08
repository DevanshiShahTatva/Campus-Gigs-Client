'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardTitle } from '@/components/ui/card'
import { Database, Edit, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
                    toast.success(`Skill ${isEdit ? 'updated' : 'created'} Successfully`)
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
                toast.success('Skill deleted successfully')
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

        if (skillsData.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No skills created yet. Create categories first to organize skills.</p>
                </div>
            )
        }

        return (
            <CustomTable<ISkill>
                data={skillsData}
                columns={tableHeaders}
                actions={(row) => (
                    <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(row)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            />
        )
    }

    return (
        <Card className="p-0">
            <div className="bg-gradient-to-r from-green-800 to-green-300 text-white rounded-t-lg p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Database className="w-6 h-6" />
                        <CardTitle className="text-xl">Skills Management</CardTitle>
                    </div>
                    <Button
                        variant="secondary"
                        className="bg-white text-green-600 hover:bg-gray-100"
                        onClick={handleAdd}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 px-6 pb-6">{renderTable()}</div>

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
        </Card>
    )
}

export default SkillsManagement
