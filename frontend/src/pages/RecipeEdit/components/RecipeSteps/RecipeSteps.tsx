import React, { useRef } from 'react';
import styles from './RecipeSteps.module.css';

interface Step {
  id: number;
  description: string;
  imageUrl: string | null;
}

interface RecipeStepsProps {
  steps: Step[];
  onStepsChange: (steps: Step[]) => void;
}

const RecipeSteps: React.FC<RecipeStepsProps> = ({ steps, onStepsChange }) => {
  const fileInputRefs = useRef(new Map<number, HTMLInputElement>());

  const handleAddStep = () => {
    const newStep: Step = {
      id: Date.now(),
      description: '',
      imageUrl: null,
    };
    onStepsChange([...steps, newStep]);
  };

  const handleRemoveStep = (id: number) => {
    if (steps.length > 1) {
      onStepsChange(steps.filter((step) => step.id !== id));
    }
  };

  const handleStepChange = (id: number, value: string) => {
    onStepsChange(
      steps.map((step) =>
        step.id === id ? { ...step, description: value } : step
      )
    );
  };

  const handleImageUpload = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onStepsChange(
        steps.map((step) =>
          step.id === id ? { ...step, imageUrl: reader.result as string } : step
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (id: number) => {
    fileInputRefs.current.get(id)?.click();
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>조리 과정</h3>
        <button className={styles.addButton} onClick={handleAddStep}>
          <span className="material-symbols-outlined">add_circle</span>
          <span>조리 과정 추가</span>
        </button>
      </div>
      <div className={styles.stepsList}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.stepItem}>
            <span className={styles.stepNumber}>Step {index + 1}</span>
            <div className={styles.stepContent}>
              <textarea
                className={styles.textarea}
                placeholder="조리 과정을 입력하세요. (예: 끓는 물에 소금을 넣고 스파게티면을 삶아줍니다.)"
                rows={4}
                value={step.description}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
              ></textarea>
              <div className={styles.imageUploadContainer} onClick={() => handleImageClick(step.id)}>
                <input
                  type="file"
                  ref={el => {
                    if (el) {
                      fileInputRefs.current.set(step.id, el);
                    } else {
                      fileInputRefs.current.delete(step.id);
                    }
                  }}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(step.id, e.target.files[0]);
                    }
                  }}
                />
                {step.imageUrl ? (
                  <>
                    <div
                      className={styles.imagePreview}
                      style={{ backgroundImage: `url(${step.imageUrl})` }}
                    ></div>
                    <div className={styles.imageOverlay}>
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                      <span>이미지 변경</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadButton}>
                      <span className="material-symbols-outlined">
                        add_photo_alternate
                      </span>
                      <span>이미지 업로드</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              className={styles.deleteButton}
              onClick={() => handleRemoveStep(step.id)}
              disabled={steps.length <= 1}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecipeSteps;