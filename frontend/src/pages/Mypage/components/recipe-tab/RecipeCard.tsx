
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Clock, Calendar, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  id: number;
  title: string;
  image: string;
  cookTime?: string;
  viewedAt?: string;
  cookedAt?: string;
  rating?: number;
  isLiked?: boolean;
  onToggleLike?: (id: number) => void;
  showLikeButton?: boolean;
  views?: number;
  likes?: number;
  source?: 'db' | 'api'; // 레시피 출처 (db 또는 api)
}

export function RecipeCard({
  id,
  title,
  image,
  cookTime,
  viewedAt,
  cookedAt,
  isLiked = false,
  onToggleLike,
  showLikeButton = true,
  views,
  likes,
  source = 'db', // 기본값은 'db'
}: RecipeCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // source 파라미터는 더 이상 사용하지 않음 (DB ID로 통합)
    navigate(`/recipe/${id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {cookTime && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-[#3b6c55] hover:bg-white">
              <Clock className="w-3 h-3 mr-1" />
              {cookTime}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-[#3b6c55] mb-2">{title}</h3>

        {/* 좋아요한 레시피 카드: cookTime, views, likes 표시 */}
        {(views !== undefined || likes !== undefined) && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {cookTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {cookTime}
              </span>
            )}
            {views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {views}
              </span>
            )}
            {likes !== undefined && (
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                {likes}
              </span>
            )}
          </div>
        )}

        {/* 일반 레시피 카드: viewedAt/cookedAt과 like button 표시 */}
        {(views === undefined && likes === undefined) && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {viewedAt || cookedAt}
            </span>
            {showLikeButton && onToggleLike && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(id);
                }}
                className="hover:scale-110 transition-transform"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-300'}`} />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
