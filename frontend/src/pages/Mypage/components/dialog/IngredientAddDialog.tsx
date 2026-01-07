import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Refrigerator } from 'lucide-react';
import type { Ingredient } from '@/pages/Mypage/components/fridge-tab/IngredientItem';

interface IngredientAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredients: Ingredient[];
  onDeleteIngredient: (id: number) => void;
}

export function IngredientAddDialog({ 
  open, 
  onOpenChange, 
  ingredients,
  onDeleteIngredient 
}: IngredientAddDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto"
        style={{ top: 'calc(50% + 350px)', left:'calc(50% + 450px)'}}>
        <DialogHeader>
          <DialogTitle className="text-[#3b6c55] flex items-center gap-2">
            <Refrigerator className="w-5 h-5" />
            식재료 추가
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          {/* 왼쪽: 전체 식재료 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-700">전체 식재료</h3>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="식재료 검색 (예: 당근, 양파...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto bg-white">
                {['양배추', '당근', '감자', '토마토', '양파', '마늘', '브로콜리', '파프리카', '오이', '호박'].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="text-gray-700">{item}</span>
                    <button
                      onClick={() => alert(`${item}이(가) 추가되었습니다!`)}
                      className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-red-500">
                식재료 목록을 불러오는데 실패했습니다
              </p>
              <p className="text-xs text-gray-500 mt-1">
                백엔드 서버가 설정 중입니다
              </p>
            </div>
          </div>

          {/* 오른쪽: 나의 현재 냉장고 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-700">나의 현재 냉장고</h3>
              <span className="text-sm text-white bg-[#3b6c55] px-3 py-1 rounded-full">
                {ingredients.length}개
              </span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto bg-white">
                {ingredients.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.quantity}</span>
                      {item.expiryDate && (
                        <span className="text-xs text-gray-400">
                          {item.expiryDate}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteIngredient(item.id)}
                      className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
