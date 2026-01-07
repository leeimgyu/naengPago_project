import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileInfoFormProps {
  profileData: {
    name: string;
    email: string;
    phone: string;
  };
  onProfileDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileInfoForm({ profileData, onProfileDataChange }: ProfileInfoFormProps) {
  return (
    <>
      {/* 이름 (수정 불가) */}
      <div>
        <Label htmlFor="name" className="mb-2 inline-block">이름</Label>
        <Input
          id="name"
          value={profileData.name}
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
        <p className="text-xs text-[#F88379] mt-1">이름은 변경할 수 없습니다</p>
      </div>

      {/* 이메일 (수정 불가) */}
      <div>
        <Label htmlFor="email" className="mb-2 inline-block">이메일</Label>
        <Input
          id="email"
          type="email"
          value={profileData.email}
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
        <p className="text-xs text-[#F88379] mt-1">이메일은 변경할 수 없습니다</p>
      </div>

      {/* 전화번호 */}
      <div>
        <Label htmlFor="phone" className="mb-2 inline-block">전화번호</Label>
        <Input
          id="phone"
          type="tel"
          value={profileData.phone}
          onChange={onProfileDataChange}
          placeholder="전화번호를 입력하세요"
          name="phone"
        />
      </div>
    </>
  );
}
