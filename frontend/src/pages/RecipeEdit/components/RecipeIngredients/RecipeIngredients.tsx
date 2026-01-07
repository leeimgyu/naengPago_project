import React from 'react';
import styles from './RecipeIngredients.module.css';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ ingredients, onIngredientsChange }) => {
  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now(),
      name: '',
      quantity: '',
      unit: '',
    };
    onIngredientsChange([...ingredients, newIngredient]);
  };

  const handleRemoveIngredient = (id: number) => {
    if (ingredients.length > 1) {
      onIngredientsChange(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const handleIngredientChange = (
    id: number,
    field: keyof Omit<Ingredient, 'id'>,
    value: string
  ) => {
    onIngredientsChange(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>재료</h3>
        <button className={styles.addButton} onClick={handleAddIngredient}>
          <span className="material-symbols-outlined">add_circle</span>
          <span>재료 추가</span>
        </button>
      </div>
      <div className={styles.ingredientsList}>
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className={styles.ingredientItem}>
            <input
              className={styles.inputName}
              placeholder="재료명 (예: 스파게티면)"
              type="text"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(ingredient.id, 'name', e.target.value)
              }
            />
            <input
              className={styles.inputQuantity}
              placeholder="수량 (예: 200)"
              type="text"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(ingredient.id, 'quantity', e.target.value)
              }
            />
            <input
              className={styles.inputUnit}
              placeholder="단위 (예: g)"
              type="text"
              value={ingredient.unit}
              onChange={(e) =>
                handleIngredientChange(ingredient.id, 'unit', e.target.value)
              }
            />
            <button
              className={styles.deleteButton}
              onClick={() => handleRemoveIngredient(ingredient.id)}
              disabled={ingredients.length <= 1}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecipeIngredients;