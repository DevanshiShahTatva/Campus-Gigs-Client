'use client'

import { X } from "lucide-react"

interface CustomModalProps {
    title: string
    onClose: () => void
    children: React.ReactNode
}

export function CustomModal({
    title,
    onClose,
    children
}: CustomModalProps) {

    return (
        <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/40 bg-opacity-40 px-8 md:px-0">
            <div className="bg-white w-full max-w-xl rounded-lg shadow-xl relative">
                {/* Title Section Start */}
                <div className="flex justify-between items-center border-b-1 px-6 py-5 border-b-gray-300">
                    <p className="font-bold text-2xl">{title}</p>
                    <X onClick={onClose} className="h-6 w-6 cursor-pointer" />
                </div>
                {/* Title Section End */}

                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>

    )
}
