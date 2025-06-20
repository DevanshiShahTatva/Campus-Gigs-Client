
export interface IQuillEditorProps {
    label: string;
    name : string
    value: string;
    onChange: (value : string) => void;
    errorKey : boolean;
    placeholder?: string;
    errorMsg?: string;
    required?: boolean;
    handleGenerateDescription?: () => void;
    isDescriptionGenerating?: boolean;
    iSGenerateButtonDisabled?: boolean;
  };
  