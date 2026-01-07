import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileImageEditorProps {
  profileImage: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileImageEditor({ profileImage, onImageChange }: ProfileImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-6">
      <Avatar className="w-24 h-24 border-4 border-gray-200">
        <AvatarImage src={profileImage} alt="프로필" />
        <AvatarFallback className="bg-[#3b6c55] text-white">김</AvatarFallback>
      </Avatar>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="border-[#3b6c55] text-[#3b6c55]"
        >
          <Camera className="w-4 h-4 mr-2" />
          사진 변경
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          JPG, PNG 파일 (최대 5MB)
        </p>
      </div>
    </div>
  );
}
