"use client";

import React, { useState, useEffect } from 'react';
import ModalLayout from './CommonModalLayout';
import TagsInput from '../TagsInput';

export interface TagsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (keywords: string[]) => void;
    loading?: boolean;
    maxTags?: number;
    placeholder?: string;
    validationRegex?: RegExp;
    modalTitle?: string;
}

const TagsModal: React.FC<TagsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    maxTags = 10,
    placeholder = 'Add a tag',
    validationRegex = /^[a-zA-Z0-9\-_\s]+$/,
    loading,
    modalTitle = "Generate with AI"
}) => {
    const [tags, setTags] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setTags([]);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (newTags: string[]) => {
        if (maxTags && newTags.length > maxTags) {
            setError(`Maximum ${maxTags} tags allowed`);
            return;
        }

        const invalidTags = newTags.filter(tag => !validationRegex.test(tag));
        if (invalidTags.length > 0) {
            setError(`Invalid tags: ${invalidTags.join(', ')}`);
            return;
        }

        setError(null);
        setTags(newTags);
    };

    const handleSave = () => {
        if (!error) {
            onSave(tags);
        }
    };

    return (
        <ModalLayout
            onClose={onClose}
            modalTitle={modalTitle}
            footerActions={[
                {
                    label: "Cancel",
                    onClick: onClose,
                    variant: "outlined",
                },
                {
                    label: loading ? "Generating..." : "Generate",
                    onClick: handleSave,
                    variant: "primary",
                    disabled: !!error || !!loading || !tags.length,
                },
            ]}
        >
            <div className="w-full space-y-5 my-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Keywords/Tags
                        </label>
                        <TagsInput
                            value={tags}
                            onChange={handleChange}
                            placeholder={placeholder}
                            maxTags={maxTags}
                        />
                    </div>
                    
                    {error && (
                        <span className="text-red-500 text-sm">{error}</span>
                    )}
                    
                    <div className="text-sm text-gray-500">
                        <ul className="list-disc list-inside">
                            <li>Press Enter or comma to add a tag.</li>
                            {maxTags && <li>Maximum {maxTags} tags allowed.</li>}
                            <li>Allowed characters: alphanumeric, dash (-), and underscore (_).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ModalLayout>
    );
};

export default TagsModal; 