import { XIcon } from 'lucide-react';
import React, { useState } from 'react';

interface TagsInputProps {
  tags: string[];
  handleSkillsChange: (tags: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, handleSkillsChange }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      handleSkillsChange(tags.slice(0, -1));
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError('Tag cannot be empty');
      return;
    }

    if (tags.length >= 10) {
      setError('Maximum 10 tags allowed');
      return;
    }

    if (!/^[a-zA-Z0-9 _-]+$/.test(trimmedValue)) {
      setError('Only letters, numbers, space, dash (-), and underscore (_) allowed');
      return;
    }

    if (tags.includes(trimmedValue)) {
      setError('Tag already exists');
      return;
    }

    handleSkillsChange([...tags, trimmedValue]);
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    handleSkillsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2 items-center border border-gray-300 rounded-lg p-2 min-h-12 outline-none">
        {tags.map((tag, index) => (
          <div
            key={`${index + 1}`}
            className="flex items-center text-black bg-gray-200 rounded-full px-3 py-1 text-sm"
          >
            {tag}
            <div
              onClick={() => removeTag(index)}
              className="ml-1.5 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
            >
              <XIcon size={12} />
            </div>
          </div>
        ))}
        {tags.length < 10 && (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? 'Add tags...' : ''}
            className="flex-1 min-w-[100px] px-2 py-1 text-black border-none focus:outline-none"
          />
        )}
      </div>
      <div>
        {error && (
          <span className="text-sm text-red-500">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default TagsInput;