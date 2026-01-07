import { Link } from 'react-router-dom';
import { ShoppingCart, LeafyGreen, CircleCheck, CircleX } from "lucide-react";
import styles from "./IngredientsSection.module.css";

export interface Ingredient {
  name: string;
  amount: string;
}

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  fridgeIngredientNames: Set<string>;
}

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  ingredients,
  fridgeIngredientNames,
}) => {
  return (
    <div className={styles.ingredientsSection}>
      <h2 className={styles.ingredientsTitle}>필요한 재료</h2>
      <p className={styles.ingredientNotice}>
        <LeafyGreen size={15} color="#3B6C55" style={{ marginRight: '5px', verticalAlign: 'middle' }} />
        <span className={styles.noticeText}>냉장고 속 <span className={styles.highlightText}>재료</span>를 확인하세요.</span>
      </p>
      <div className={styles.ingredientsList}>
        {ingredients.map((ingredient, index) => {
          const isInFridge = fridgeIngredientNames.has(ingredient.name);
          return (
            <div key={index} className={styles.ingredientItem}>
              <span 
                className={styles.ingredientName}
                style={{ 
                  color: isInFridge ? '#228B22' : '#CD5C5C',
                  fontWeight: isInFridge ? 'bold' : 'bold',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isInFridge ? (
                  <CircleCheck size={16} className={styles.fridgeIcon} style={{ color: '#228B22' }} />
                ) : (
                  <CircleX size={16} className={styles.fridgeIcon} style={{ color: '#CD5C5C' }} />
                )}
                {ingredient.name}
              </span>
              <span className={styles.ingredientAmount}>{ingredient.amount}</span>
            </div>
          );
        })}
      </div>
      <Link to="/grocery" className={styles.saveIngredientsBtn}>
        <ShoppingCart size={16} />
        재료 구매
      </Link>
    </div>
  );
};
