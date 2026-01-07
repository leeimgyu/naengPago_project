import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordChangeFormProps {
  passwordData: {
    password: string;
    confirmPassword: string;
  };
  onPasswordDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordChangeForm({ passwordData, onPasswordDataChange }: PasswordChangeFormProps) {
  return (
    <>
      {/* 비밀번호 */}
      <div>
        <Label htmlFor="password" className="mb-2 inline-block">비밀번호</Label>
        <Input
          id="password"
          type="password"
          value={passwordData.password}
          onChange={onPasswordDataChange}
          placeholder="새 비밀번호를 입력하세요 (변경 시에만)"
          name="password"
        />
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <Label htmlFor="confirmPassword" className="mb-2 inline-block">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={passwordData.confirmPassword}
          onChange={onPasswordDataChange}
          placeholder="비밀번호를 다시 입력하세요"
          name="confirmPassword"
        />
        {passwordData.password && passwordData.confirmPassword &&
          passwordData.password !== passwordData.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">비밀번호가 일치하지 않습니다</p>
          )}
        {passwordData.password && passwordData.confirmPassword &&
          passwordData.password === passwordData.confirmPassword && (
            <p className="text-sm text-green-600 mt-1">비밀번호가 일치합니다</p>
          )}
      </div>
    </>
  );
}
