import React, { useRef } from 'react';
import styles from './RecipeImageUploader.module.css';

interface RecipeImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
}

const RecipeImageUploader: React.FC<RecipeImageUploaderProps> = ({ image, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange(null); // 파일 선택 취소 시 이미지 초기화
    }
  };

  const handleUploaderClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>대표 이미지</h3>
      <div className={styles.imageUploader} onClick={handleUploaderClick}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageChange}
        />
        {image ? (
          <>
            <div
              className={styles.imagePreview}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            ></div>
            <div className={styles.uploadButton}>
              <span className="material-symbols-outlined">upload_file</span>
              <span>이미지 변경</span>
            </div>
          </>
        ) : (
          <div className={styles.uploadPlaceholder}>
            <span className="material-symbols-outlined">add_photo_alternate</span>
            <span>대표 이미지를 등록해주세요.</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecipeImageUploader;