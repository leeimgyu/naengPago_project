import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, FileText, Loader2 } from "lucide-react";
import { processReceiptOcr, type OcrResult, type OcrIngredient, addFridgeItem,  type AddFridgeItemRequest, } from "@/lib/api";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptDialog({ open, onOpenChange }: ReceiptDialogProps) {
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const receiptFileInputRef = useRef<HTMLInputElement>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [isAdding, setIsAdding] = useState(false); // 식재료 추가 로딩 상태 추가

  const handleClose = () => {
    setReceiptPreview(null);
    setOcrResult(null); // OCR 결과 초기화
    setIsLoading(false); // 로딩 상태 초기화
    setIsAdding(false); // 식재료 추가 로딩 상태 초기화
    onOpenChange(false);
  };

  const handleAdd = async () => {
    if (
      !ocrResult ||
      !ocrResult.ingredients ||
      ocrResult.ingredients.length === 0
    ) {
      alert("추가할 식재료가 없습니다.");
      return;
    }

    setIsAdding(true); // 식재료 추가 로딩 시작
    try {
      // 모든 식재료를 냉장고에 추가
      for (const ingredient of ocrResult.ingredients) {
        const fridgeItem: AddFridgeItemRequest = {
          name: ingredient.name,
          quantity: ingredient.amount.toString(),
          category: "기타", // OCR 결과에 카테고리가 없으므로 기본값 설정
          // expiryDate는 OCR 결과에 없으므로 생략
        };
        await addFridgeItem(fridgeItem);
      }
      alert("식재료가 성공적으로 추가되었습니다!");
      handleClose(); // 성공 시 다이얼로그 닫기
    } catch (error) {
      console.error("식재료 추가 실패:", error);
      alert("식재료 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsAdding(false); // 식재료 추가 로딩 종료
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto"
        style={{ top: "calc(50% + 300px)", left: "calc(50% + 450px)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-[#3b6c55] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            영수증 촬영
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* 왼쪽: 사진 촬영 */}
          <div>
            <h3 className="mb-3 text-gray-700">사진 촬영</h3>
            <div
              onClick={() => receiptFileInputRef.current?.click()}
              className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#3b6c55] transition-colors overflow-hidden bg-gray-50"
            >
              {receiptPreview ? (
                <img
                  src={receiptPreview}
                  alt="영수증"
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                  <p className="mb-1 text-gray-500">
                    영수증을 촬영하거나 업로드해주세요
                  </p>
                  <Button
                    className="mt-3 bg-[#3b6c55] hover:bg-[#2a5240]"
                    disabled={isLoading}
                  >
                    사진 촬영/업로드
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={receiptFileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={async (e) => {
                // 비동기 함수로 변경
                const file = e.target.files?.[0];
                if (file) {
                  setOcrResult(null); // 새로운 파일 업로드 시 이전 결과 초기화
                  setIsLoading(true); // 로딩 시작

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setReceiptPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);

                  try {
                    const result = await processReceiptOcr(file); // OCR API 호출
                    setOcrResult(result); // OCR 결과 저장
                  } catch (error) {
                    console.error("OCR API 호출 실패:", error);
                    // 사용자에게 오류 메시지를 표시하는 로직을 여기에 추가할 수 있습니다.
                    setOcrResult(null); // 에러 발생 시 결과 초기화
                  } finally {
                    setIsLoading(false); // 로딩 종료
                  }
                }
              }}
              className="hidden"
            />
          </div>

          {/* 오른쪽: 인식된 식재료 */}
          <div>
            <h3 className="mb-3 text-gray-700">인식된 식재료</h3>
            <div className="p-4 overflow-y-auto bg-white border border-gray-200 rounded-lg h-80">
              {isLoading ? ( // OCR 진행 중일 때 로딩 애니메이션 표시 (가장 상단으로 이동)
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <Loader2 className="w-12 h-12 mb-2 text-gray-400 animate-spin" />
                  <p className="text-lg">영수증을 분석하고 있습니다...</p>
                </div>
              ) : receiptPreview ? ( // 영수증 미리보기가 있을 때
                ocrResult &&
                ocrResult.ingredients &&
                ocrResult.ingredients.length > 0 ? ( // OCR 결과가 있고 식재료가 있을 때
                  <div className="space-y-2">
                    <p className="mb-3 text-sm text-gray-600">
                      영수증을 촬영하면 여기에 식재료 목록이 표시됩니다
                    </p>
                    <div className="grid items-center grid-cols-2 p-2 " style={{backgroundColor:'#fff', borderBottom:'3px double #3B6C55'}}>
                      <div className="flex items-center gap-2 font-medium justify-self-center" style={{color:'#3B6C55'}}>
                        <span>재료명</span>
                      </div>
                      <span className="pr-6 font-medium text-right text-gray-600" style={{color:'#3B6C55'}}>개수</span>
                    </div>
                    {ocrResult.ingredients.map(
                      (item: OcrIngredient, index: number) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 px-8 rounded bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <span>
                              {item.name}&nbsp;{item.unit}
                            </span>
                          </div>
                          <span className="pr-2 text-gray-600">{item.amount}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  // OCR 결과는 없지만 영수증 미리보기는 있을 때 (즉, 인식된 식재료가 없을 때)
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">인식된 식재료가 없습니다.</p>
                    </div>
                  </div>
                )
              ) : (
                // 영수증 미리보기가 없을 때 (초기 상태)
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      영수증을 촬영하면
                      <br />
                      여기에 식재료 목록이 표시됩니다
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isAdding} // 식재료 추가 중에는 취소 버튼 비활성화
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-[#3b6c55] hover:bg-[#2a5240]"
                disabled={
                  !ocrResult?.ingredients?.length || isLoading || isAdding
                } // OCR 결과가 없거나, 로딩 중이거나, 추가 중일 때 비활성화
                onClick={handleAdd}
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                추가하기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
