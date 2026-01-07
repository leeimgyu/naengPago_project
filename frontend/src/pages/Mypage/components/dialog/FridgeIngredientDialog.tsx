import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Plus } from "lucide-react";

interface FridgeIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (ingredient: {
    name: string;
    quantity: string;
    category: string;
    expiryDate: string;
  }) => void;
}

export function FridgeIngredientDialog({
  open,
  onOpenChange,
  onAdd,
}: FridgeIngredientDialogProps) {
  const [addMethod, setAddMethod] = useState<"text" | "photo" | null>(null);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
    category: "채소",
    expiryDate: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      onAdd(newIngredient);
      setNewIngredient({
        name: "",
        quantity: "",
        category: "채소",
        expiryDate: "",
      });
      setPhotoPreview(null);
      setAddMethod(null);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setAddMethod(null);
    setPhotoPreview(null);
    setNewIngredient({
      name: "",
      quantity: "",
      category: "채소",
      expiryDate: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] top-[65%] translate-y-[-50%]">
        {/* 내용만 있고 설명이 없음 */}
        <DialogHeader>
          <DialogTitle className="text-[#3b6c55]">재료 추가하기</DialogTitle>
          <DialogDescription>
            사진 촬영 또는 직접 입력으로 재료를 추가할 수 있습니다
          </DialogDescription>
        </DialogHeader>

        {!addMethod ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => setAddMethod("photo")}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#3b6c55] transition-colors flex flex-col items-center gap-3 cursor-pointer"
            >
              <Camera className="w-12 h-12 text-[#3b6c55]" />
              <span className="text-gray-700">사진으로 추가</span>
            </button>
            <button
              onClick={() => setAddMethod("text")}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#3b6c55] transition-colors flex flex-col items-center gap-3 cursor-pointer"
            >
              <Plus className="w-12 h-12 text-[#3b6c55]" />
              <span className="text-gray-700">직접 입력</span>
            </button>
          </div>
        ) : addMethod === "photo" ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#3b6c55] transition-colors overflow-hidden"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">클릭하여 사진 선택</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
            <div className="space-y-3">
              <div>
                <Label htmlFor="name-photo">재료명</Label>
                <Input
                  id="name-photo"
                  placeholder="예: 토마토"
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="quantity-photo">수량</Label>
                <Input
                  id="quantity-photo"
                  placeholder="예: 5개"
                  value={newIngredient.quantity}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setAddMethod(null);
                  setPhotoPreview(null);
                }}
                variant="outline"
                className="flex-1"
              >
                뒤로
              </Button>
              <Button
                onClick={handleAddIngredient}
                className="bg-[#3b6c55] hover:bg-[#2a5240] flex-1"
              >
                추가하기
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">재료명</Label>
              <Input
                id="name"
                placeholder="예: 토마토"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="quantity">수량</Label>
              <Input
                id="quantity"
                placeholder="예: 5개"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="category">카테고리</Label>
              <select
                id="category"
                value={newIngredient.category}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    category: e.target.value,
                  })
                }
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
              <Label htmlFor="expiry">유통기한 (선택)</Label>
              <Input
                id="expiry"
                type="date"
                value={newIngredient.expiryDate}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    expiryDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setAddMethod(null)}
                variant="outline"
                className="flex-1"
              >
                뒤로
              </Button>
              <Button
                onClick={handleAddIngredient}
                className="bg-[#3b6c55] hover:bg-[#2a5240] flex-1"
              >
                추가하기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
