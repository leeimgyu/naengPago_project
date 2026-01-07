import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/components/ui/utils';

interface FileUploadProps {
    onFilesChange: (files: File[]) => void;
    className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, className }) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name}은(는) 10MB를 초과합니다.`);
                return false;
            }
            return true;
        });

        setUploadedFiles(prev => {
            const updatedFiles = [...prev, ...newFiles];
            onFilesChange(updatedFiles);
            return updatedFiles;
        });
    }, [onFilesChange]);

    const removeFile = (index: number) => {
        setUploadedFiles(prev => {
            const updatedFiles = prev.filter((_, i) => i !== index);
            onFilesChange(updatedFiles);
            return updatedFiles;
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleAreaClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        if(e.target) {
            e.target.value = '';
        }
    };

    return (
        <div className={className}>
            <div
                className={cn(
                    'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all',
                    'hover:border-[#4a7c59] hover:bg-[#f9fff9]',
                    { 'border-[#4a7c59] bg-[#f9fff9]': isDragOver }
                )}
                onClick={handleAreaClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="text-5xl mb-4 opacity-50">📎</div>
                <div className="text-sm text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드</div>
                <div className="text-xs text-gray-500">최대 10MB, jpg, png, pdf 파일만 가능</div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
            />
            <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex justify-between items-center py-3 px-4 bg-gray-100 rounded-lg">
                        <span className="text-sm text-gray-800 truncate">{file.name} ({formatFileSize(file.size)})</span>
                        <button type="button" className="ml-4 text-red-500 text-lg transition-opacity hover:opacity-70" onClick={() => removeFile(index)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUpload;
