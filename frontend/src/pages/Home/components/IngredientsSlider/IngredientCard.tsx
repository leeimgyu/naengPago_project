import { forwardRef } from 'react';
import type { IngredientCard as IngredientCardProps } from '@/types';
import styles from './IngredientsSlider.module.css';

const IngredientCard = forwardRef<HTMLDivElement, IngredientCardProps>(
  ({ image, title, subtitle }, ref) => {
    return (
      <div className={styles.ingredientsBox} ref={ref}>
        <img className={styles.ingredientsBoxImg} src={image} alt={title} />
        <div className={styles.ingredientTitle}>{title}</div>
        <div className={styles.ingredientSubtitle}>{subtitle}</div>
      </div>
    );
  }
);

IngredientCard.displayName = 'IngredientCard';

export default IngredientCard;
