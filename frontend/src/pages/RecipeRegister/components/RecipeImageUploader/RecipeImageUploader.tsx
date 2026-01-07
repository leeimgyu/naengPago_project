import React, { useRef } from 'react';
import styles from './RecipeImageUploader.module.css';
import { uploadFile } from '../../../../api/fileApi'; // fileApi 임포트

interface RecipeImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
}

const BACKEND_URL = 'http://localhost:8080';

const RecipeImageUploader: React.FC<RecipeImageUploaderProps> = ({ image, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log("=== 이미지 업로드 시작 ===");
        console.log("파일명:", file.name);
        console.log("파일 크기:", file.size, "bytes");
        console.log("파일 타입:", file.type);

        // 파일을 서버에 업로드하고 URL을 받습니다.
        const response = await uploadFile(file, "recipes"); // 'recipes' 하위 경로 지정

        console.log("업로드 성공! fileUrl:", response.fileUrl);
        onImageChange(response.fileUrl); // 서버에서 받은 URL을 부모 컴포넌트에 전달
      } catch (error) {
        console.error("=== 이미지 업로드 실패 ===");
        console.error("에러 상세:", error);
        console.error("에러 메시지:", error instanceof Error ? error.message : String(error));
        alert(`이미지 업로드에 실패했습니다.\n에러: ${error instanceof Error ? error.message : String(error)}\n\n다시 시도해주세요.`);
        onImageChange(null); // 에러 발생 시 이미지 초기화
      }
    } else {
      onImageChange(null); // 파일 선택 취소 시 이미지 초기화
    }
  };

  const handleUploaderClick = () => {
    fileInputRef.current?.click();
  };

  const imageUrl = image ? `${BACKEND_URL}${image}` : '';

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
                backgroundImage: `url('${imageUrl}')`,
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