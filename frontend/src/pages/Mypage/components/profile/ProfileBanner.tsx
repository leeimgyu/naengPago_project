import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, FileText, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileBannerProps {
  onNavigateToEditProfile?: () => void;
  onOpenReceiptDialog: () => void;
  onOpenIngredientDialog: () => void;
  viewedRecipesCount: number;
  cookedDishesCount: number;
  ingredientsCount: number;
  onTabChange: (tab: string) => void;
  isLoading?: boolean;
}

export function ProfileBanner({
  onNavigateToEditProfile,
  onOpenReceiptDialog,
  onOpenIngredientDialog,
  viewedRecipesCount,
  cookedDishesCount,
  ingredientsCount,
  onTabChange,
}: ProfileBannerProps) {
  const { user } = useAuth();
  return (
    <section className="bg-[#3b6c55] border-b border-[#2a5240] min-h-[350px] h-[40vh]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-full flex items-center">
        <div className="w-full">
          {/* 모바일 레이아웃 (md 미만) */}
          <div className="flex items-center justify-around h-full md:hidden">
            {/* 왼쪽: 아바타 */}
            <Avatar className="border-4 w-36 h-36 border-white/20 shrink-0">
              {user?.profileImage && (
                <AvatarImage src={user.profileImage} alt="프로필" />
              )}
              <AvatarFallback className="bg-white text-[#3b6c55] text-lg">
                {user?.username?.[0] || "사"}
              </AvatarFallback>
            </Avatar>

            {/* 오른쪽: 프로필 정보 + 통계 */}
            <div className="flex flex-col items-start gap-4">
              {/* 프로필 정보 */}
              <div className="text-left">
                <div className="flex items-center justify-end gap-6 mb-1">
                  <h1 className="text-xl text-white">
                    {user?.username || "사용자"}
                  </h1>
                  <button
                    onClick={onNavigateToEditProfile}
                    className="flex items-center gap-1 text-sm transition-colors text-white/80 hover:text-white"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    프로필 수정
                  </button>
                </div>
                <p className="text-xs text-white/70">
                  건강한 한 끼를 만드는 즐거움
                </p>
              </div>

              {/* 통계 */}
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => onTabChange("viewed")}
                  className="p-2 text-center transition-colors rounded-lg hover:bg-white/10"
                >
                  <div className="mb-1 text-xl text-white">
                    {viewedRecipesCount}
                  </div>
                  <div className="text-xs text-white/70 whitespace-nowrap">
                    본 레시피
                  </div>
                </button>
                <button
                  onClick={() => onTabChange("cooked")}
                  className="p-2 text-center transition-colors rounded-lg hover:bg-white/10"
                >
                  <div className="mb-1 text-xl text-white">
                    {cookedDishesCount}
                  </div>
                  <div className="text-xs text-white/70 whitespace-nowrap">
                    나의 기록
                  </div>
                </button>
                <button
                  onClick={() => onTabChange("fridge")}
                  className="p-2 text-center transition-colors rounded-lg hover:bg-white/10"
                >
                  <div className="mb-1 text-xl text-white">
                    {ingredientsCount}
                  </div>
                  <div className="text-xs text-white/70 whitespace-nowrap">
                    보유 재료
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 데스크탑 레이아웃 (md 이상) */}
          <div className="items-center justify-between hidden w-full lg:gap-12 md:flex md:gap-4">
            {/* 왼쪽: 아바타 */}
            <Avatar className="w-40 h-40 border-4 border-white/20 shrink-0">
              {user?.profileImage && (
                <AvatarImage src={user.profileImage} alt="프로필" />
              )}
              <AvatarFallback className="bg-white text-[#3b6c55] text-xl">
                {user?.username?.[0] || "사"}
              </AvatarFallback>
            </Avatar>

            {/* 중앙: 프로필 정보 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 md:flex-col md:items-start md:gap-1 lg:flex-row lg:items-center lg:gap-3">
                <h1 className="text-2xl text-white md:text-3xl">
                  {user?.username || "사용자"}
                </h1>
                <button
                  onClick={onNavigateToEditProfile}
                  className="flex items-center gap-1 text-sm transition-colors text-white/80 hover:text-white md:mb-[10px]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  프로필 수정
                </button>
              </div>
              <p className="mb-4 text-sm text-white/70 md:hidden lg:block">
                건강한 한 끼를 만드는 즐거움
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onOpenReceiptDialog}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white transition-colors border rounded-lg border-white/30 hover:bg-white/10"
                >
                  <FileText className="w-3.5 h-3.5" />
                  영수증 등록
                </button>
                <button
                  onClick={onOpenIngredientDialog}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white transition-colors border rounded-lg border-white/30 hover:bg-white/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  재료 추가
                </button>
              </div>
            </div>

            {/* 오른쪽: 통계 */}
            <div className="flex gap-12 pr-2 md:gap-2 xl:gap-12">
              <button
                onClick={() => onTabChange("viewed")}
                className="p-2 text-center transition-colors rounded-lg hover:bg-white/10"
              >
                <div className="mb-2 text-xl text-white md:text-2xl">
                  {viewedRecipesCount}
                </div>
                <div className="text-white/70 whitespace-nowrap">본 레시피</div>
              </button>
              <button
                onClick={() => onTabChange("cooked")}
                className="p-2 text-center transition-colors rounded-lg hover:bg-white/10"
              >
                <div className="mb-2 text-xl text-white md:text-2xl">
                  {cookedDishesCount}
                </div>
                <div className="text-white/70 whitespace-nowrap">나의 기록</div>
              </button>
              <button
                onClick={() => onTabChange("fridge")}
                className="p-2 text-center transition-colors rounded-lg hover:bg-white/10"
              >
                <div className="mb-2 text-xl text-white md:text-2xl">
                  {ingredientsCount}
                </div>
                <div className="text-white/70 whitespace-nowrap">보유 재료</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
