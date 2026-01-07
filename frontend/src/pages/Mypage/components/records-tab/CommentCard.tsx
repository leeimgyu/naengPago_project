
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface CommentCardProps {
  id: number;
  recipeTitle: string;
  comment: string;
  commentedAt: string;
  recipeThumbnail: string;
}

export function CommentCard({
  recipeTitle,
  comment,
  commentedAt,
  recipeThumbnail,
}: CommentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={recipeThumbnail}
              alt={recipeTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[#3b6c55]">{recipeTitle}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                {commentedAt}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
              <p className="text-gray-700">{comment}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
