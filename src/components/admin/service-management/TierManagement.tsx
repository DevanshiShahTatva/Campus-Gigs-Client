'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Award, Edit, Trash } from 'lucide-react';
import { CustomModal } from '@/components/common/CustomModal';
import DynamicForm, { FormFieldConfig } from '@/components/common/form/DynamicForm';
import { apiCall } from '@/utils/apiCall';
import { toast } from 'react-toastify';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import { CustomTable } from '@/components/common/CustomTable';
import ModalLayout from '@/components/common/Modals/CommonModalLayout';

interface ITier {
    id: number
    name: string
    description: string
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
    description: ''
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
                label: 'Tier Name',
                type: 'text',
                required: true,
                placeholder: 'Enter Tier',
            },
            {
                id: 'description',
                name: 'description',
                label: 'Description',
                type: 'textarea',
                required: true,
                placeholder: 'Enter description',
            }
        ],
    },
]

function TierManagement() {
    const [tiersData, setTiersData] = useState<ITier[]>([])
    const [tiersDataLoading, setTiersDataLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [editTier, setEditTier] = useState<ITier | null>(null)
    const [deleteTier, setDeleteTier] = useState<ITier | null>(null)

    const handleToggleModal = (value: boolean) => {
        setIsModalOpen(value)
    }

    const fetchTiers = useCallback(async () => {
        setTiersDataLoading(true)
        try {
            const res = await apiCall({ endPoint: '/tire', method: 'GET' })
            setTiersData(res.data || [])
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch skills'
            toast.error(errorMessage)
        } finally {
            setTiersDataLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTiers()
    }, [fetchTiers])

    const handleSubmit = useCallback(
        async (values: any) => {
            const isEdit = !!editTier
            try {
                const res = await apiCall({
                    endPoint: isEdit ? `/tire/${editTier?.id}` : '/tire',
                    method: isEdit ? 'PUT' : 'POST',
                    body: values,
                })
                if (res.success) {
                    toast.success(`Tier ${isEdit ? 'updated' : 'created'} successfully.`)
                    setIsModalOpen(false)
                    fetchTiers()
                } else {
                    toast.error(res.message ?? "Something went wrong");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to save skill'
                toast.error(errorMessage)
            }
        },
        [editTier, fetchTiers]
    )

    const tableHeaders = [
        { label: 'Tier Name', key: 'name', sortable: true },
        { label: 'Description', key: 'description', sortable: true },
    ] satisfies Column<ITier>[]

    const handleOpen = useCallback(() => {
        handleToggleModal(true)
        setEditTier(null)
    }, [])

    const handleClose = useCallback(() => {
        handleToggleModal(false)
        setEditTier(null)
    }, [])

    const handleEdit = useCallback((tier: ITier) => {
        setEditTier(tier)
        setIsModalOpen(true)
    }, [])

    const handleDelete = useCallback((tier: ITier) => {
        setDeleteTier(tier)
        setIsDeleteModalOpen(true)
    }, [])

    const handleCancelDelete = () => {
        setDeleteTier(null)
        setIsDeleteModalOpen(false)
    }

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteTier) return
        try {
            setDeleteLoading(true)
            const res = await apiCall({
                endPoint: `/tire/${deleteTier.id}`,
                method: 'DELETE',
            })

            if (res.success) {
                toast.success('Tier deleted successfully.')
                setIsDeleteModalOpen(false)
                fetchTiers()
            } else {
                toast.error(res.message ?? "Something went wrong");
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete skill'
            toast.error(errorMessage)
        } finally {
            setDeleteLoading(false)
        }
    }, [deleteTier, fetchTiers])

    const renderTable = () => {
        if (tiersDataLoading) {
            return <TableSkeleton showSearch rowCount={10} columnCount={1} actionButtonCount={2} />
        }

        // if (tiersData.length === 0) {
        //     return (
        //         <div className="text-center py-8 text-gray-500">
        //             <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
        //             <p>No tiers created yet. Add your first tier to get started.</p>
        //         </div>
        //     )
        // }

        return (
            <CustomTable<ITier>
                searchPlaceholder='Search by Tier Name or Description'
                data={tiersData}
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
                onClickCreateButton={handleOpen}
            />
        )
    }

    return (
        <div className='p-0'>
            <div className="grid gap-4">
                {renderTable()}
            </div>
            {isModalOpen && (
                <CustomModal
                    onClose={handleClose}
                    title={editTier ? 'Edit Tier' : 'Add Tier'}
                >
                    <DynamicForm
                        formConfig={formConfig}
                        onSubmit={handleSubmit}
                        initialValues={editTier || initialFormState}
                    />
                </CustomModal>
            )}

            {isDeleteModalOpen && (
                <ModalLayout
                    onClose={handleCancelDelete}
                    modalTitle="Delete Tier"
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
                        Are you sure you want to delete this Tier?
                    </div>
                </ModalLayout>
            )}
        </div>
    )
}

export default TierManagement