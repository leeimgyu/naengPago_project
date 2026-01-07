import React, { useState, useCallback, useRef } from 'react';
import styles from './FileUpload.module.css';

interface FileUploadProps {
    onFilesChange: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
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
        // Reset file input to allow uploading the same file again
        if(e.target) {
            e.target.value = '';
        }
    };

    return (
        <div>
            <div
                className={`${styles.fileUploadArea} ${isDragOver ? styles.dragover : ''}`}
                onClick={handleAreaClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className={styles.fileUploadIcon}>📎</div>
                <div className={styles.fileUploadText}>파일을 드래그하거나 클릭하여 업로드</div>
                <div className={styles.fileUploadHint}>최대 10MB, jpg, png, pdf 파일만 가능</div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className={styles.fileInput}
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
            />
            <div className={styles.fileList}>
                {uploadedFiles.map((file, index) => (
                    <div className={styles.fileItem} key={`${file.name}-${index}`}>
                        <span className={styles.fileName}>{file.name} ({formatFileSize(file.size)})</span>
                        <button type="button" className={styles.fileRemove} onClick={() => removeFile(index)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUpload;
