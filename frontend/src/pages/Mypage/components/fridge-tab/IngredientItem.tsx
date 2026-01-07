
import { Calendar, Pencil, Trash2 } from 'lucide-react';

export type Ingredient = {
  id: number;
  name: string;
  quantity: string;
  category: string;
  expiryDate?: string;
  addedAt: string;
};

interface IngredientItemProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: number) => void;
}

export function IngredientItem({ ingredient, onEdit, onDelete }: IngredientItemProps) {
  // 유통기한 임박 여부 확인 (3일 이내)
  const isExpiringNear = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-900">{ingredient.name}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{ingredient.quantity}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {ingredient.expiryDate && (
            <span 
              className={`flex items-center gap-1 ${
                isExpired(ingredient.expiryDate)
                  ? 'text-red-600 font-medium'
                  : isExpiringNear(ingredient.expiryDate)
                  ? 'text-orange-600 font-medium'
                  : ''
              }`}
            >
              <Calendar className="w-3 h-3" />
              {ingredient.expiryDate}
              {isExpired(ingredient.expiryDate) && ' (만료됨)'}
              {isExpiringNear(ingredient.expiryDate) && !isExpired(ingredient.expiryDate) && ' (임박)'}
            </span>
          )}
          <span>등록: {ingredient.addedAt}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(ingredient)}
          className="text-gray-400 hover:text-[#3b6c55] transition-colors p-2"
          title="수정"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(ingredient.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
          title="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
