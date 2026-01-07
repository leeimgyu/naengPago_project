import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Ingredient } from '@/pages/Mypage/components/fridge-tab/IngredientItem';

interface IngredientEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | null;
  onUpdate: (ingredient: Ingredient) => void;
  onIngredientChange: (ingredient: Ingredient) => void;
}

export function IngredientEditDialog({ 
  open, 
  onOpenChange, 
  ingredient,
  onUpdate,
  onIngredientChange 
}: IngredientEditDialogProps) {
  if (!ingredient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#3b6c55]">재료 수정하기</DialogTitle>
          <DialogDescription>
            재료 정보를 수정할 수 있습니다
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">재료명</Label>
            <Input
              id="edit-name"
              placeholder="예: 토마토"
              value={ingredient.name}
              onChange={(e) => onIngredientChange({ ...ingredient, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-quantity">수량</Label>
            <Input
              id="edit-quantity"
              placeholder="예: 5개"
              value={ingredient.quantity}
              onChange={(e) => onIngredientChange({ ...ingredient, quantity: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-category">카테고리</Label>
            <select
              id="edit-category"
              value={ingredient.category}
              onChange={(e) => onIngredientChange({ ...ingredient, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3b6c55]"
            >
              <option value="채소">채소</option>
              <option value="과일/곡류">과일/곡류</option>
              <option value="정육/계란">정육/계란</option>
              <option value="수산/해산물">수산/해산물</option>
              <option value="유제품/가공식품">유제품/가공식품</option>
              <option value="양념/소스/오일">양념/소스/오일</option>
              <option value="김치/반찬/기타">김치/반찬/기타</option>
            </select>
          </div>
          <div>
            <Label htmlFor="edit-expiry">유통기한 (선택)</Label>
            <Input
              id="edit-expiry"
              type="date"
              value={ingredient.expiryDate || ''}
              onChange={(e) => onIngredientChange({ ...ingredient, expiryDate: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onOpenChange(false)} 
              variant="outline" 
              className="flex-1"
            >
              취소
            </Button>
            <Button onClick={() => onUpdate(ingredient)} className="bg-[#3b6c55] hover:bg-[#2a5240] flex-1">
              수정하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
