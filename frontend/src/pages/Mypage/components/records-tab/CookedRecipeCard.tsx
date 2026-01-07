
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface CookedRecipeCardProps {
  id: number;
  title: string;
  image: string;
  cookedAt: string;
  rating: number;
  isLiked?: boolean;
  onToggleLike: (id: number) => void;
}

export function CookedRecipeCard({
  id,
  title,
  image,
  cookedAt,
  isLiked = false,
  onToggleLike,
}: CookedRecipeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-[#3b6c55] mb-1">{title}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-3 h-3" />
              {cookedAt}
            </div>
          </div>
          <button
            onClick={() => onToggleLike(id)}
            className="p-2 hover:scale-110 transition-transform"
            aria-label="좋아요"
          >
            <Heart
              className={`w-6 h-6 ${
                isLiked
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-300 hover:text-red-300'
              }`}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
