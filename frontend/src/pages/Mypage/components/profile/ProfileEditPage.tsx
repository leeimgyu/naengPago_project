import React, { useState, useRef, useEffect } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddressSearch from "@/components/forms/AddressSearch/AddressSearch";
import type { Address } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export function ProfileEditPage({ onBack }: { onBack: () => void }) {
  const { updateUserData } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    nickname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: undefined as Address | undefined,
  });
  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameCheckResult, setNicknameCheckResult] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 사용자 정보 불러오기
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("sessionToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          onBack();
          return;
        }

        const response = await fetch("/api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("프로필 정보를 불러올 수 없습니다.");
        }

        const result = await response.json();
        const userData = result.data;

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        setProfileData({
          name: userData.fullName || "",
          nickname: userData.nickname || userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          password: "",
          confirmPassword: "",
          address:
            userData.zipcode || userData.address1
              ? {
                  postalCode: userData.zipcode || "",
                  main: userData.address1 || "",
                  detail: userData.address2 || "",
                }
              : undefined,
        });

        // 프로필 이미지 설정
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("프로필 로드 오류:", error);
        alert("프로필 정보를 불러오는 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [onBack]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressSelect = (address: Address) => {
    setProfileData({ ...profileData, address });
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!profileData.nickname || profileData.nickname.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setIsCheckingNickname(true);
    setNicknameCheckResult(null);

    try {
      // 토큰 가져오기
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("sessionToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        setIsCheckingNickname(false);
        return;
      }

      const response = await fetch(
        `/api/users/check-nickname?nickname=${encodeURIComponent(
          profileData.nickname
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("닉네임 확인 중 오류가 발생했습니다.");
      }

      const result = await response.json();
      const isAvailable = result.data;
      const message = result.message;

      setNicknameCheckResult({
        checked: true,
        available: isAvailable,
        message: message,
      });

      // 토스트 메시지 표시 (간단하게 alert로 대체)
      if (isAvailable) {
        alert("✅ " + message);
      } else {
        alert("❌ " + message);
      }
    } catch (error) {
      console.error("닉네임 확인 오류:", error);
      alert("닉네임 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 닉네임 변경 시 중복 확인 결과 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, nickname: e.target.value });
    setNicknameCheckResult(null);
  };

  const handleSave = async () => {
    // 비밀번호 확인
    if (
      profileData.password &&
      profileData.password !== profileData.confirmPassword
    ) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      // 토큰 가져오기
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("sessionToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // API 요청 데이터 준비
      const requestData: any = {
        nickname: profileData.nickname,
        phone: profileData.phone,
      };

      // 주소 데이터 변환 (프론트엔드 형식 → 백엔드 형식)
      if (profileData.address) {
        requestData.zipcode = profileData.address.postalCode;
        requestData.address1 = profileData.address.main;
        requestData.address2 = profileData.address.detail || "";
      }

      // 비밀번호 변경 시에만 포함
      if (profileData.password) {
        requestData.password = profileData.password;
      }

      // API 호출
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("프로필 업데이트 실패");
      }

      // 응답에서 업데이트된 사용자 정보 및 새 토큰 받기
      const result = await response.json();

      // 새로운 토큰 저장 (닉네임 변경 시 토큰이 갱신됨)
      if (result.data.accessToken) {
        if (localStorage.getItem("accessToken")) {
          localStorage.setItem("accessToken", result.data.accessToken);
          if (result.data.refreshToken) {
            localStorage.setItem("refreshToken", result.data.refreshToken);
          }
        } else if (sessionStorage.getItem("sessionToken")) {
          sessionStorage.setItem("sessionToken", result.data.accessToken);
        }
        console.log("✅ 새로운 토큰이 저장되었습니다.");
      }

      // 사용자 정보 업데이트 (result.data.user에 사용자 정보 포함)
      updateUserData(result.data.user);

      alert("프로필이 저장되었습니다!");
      onBack();
    } catch (error) {
      console.error("프로필 저장 오류:", error);
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b6c55]"></div>
          <p className="mt-4 text-gray-600">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <main className="pt-[70px] pb-20">
        {/* 헤더 */}
        <section className="bg-white border-b">
          <div className="max-w-[800px] mx-auto px-8 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-[#3b6c55]">프로필 수정</h1>
            </div>
          </div>
        </section>

        {/* 프로필 수정 폼 */}
        <section className="py-12">
          <div className="max-w-[800px] mx-auto px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#3b6c55]">기본 정보</CardTitle>
                <CardDescription>
                  회원님의 프로필 정보를 수정할 수 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 프로필 이미지 */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-gray-200">
                    <AvatarImage src={profileImage} alt="프로필" />
                    <AvatarFallback className="bg-[#3b6c55] text-white">
                      {profileData.name
                        ? profileData.name.charAt(0)
                        : profileData.nickname
                        ? profileData.nickname.charAt(0)
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
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
                    <p className="mt-2 text-sm text-gray-500">
                      JPG, PNG 파일 (최대 5MB)
                    </p>
                  </div>
                </div>

                {/* 이름 (수정 불가) */}
                <div>
                  <Label htmlFor="name" className="block mb-2">
                    이름
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    disabled
                    className="h-10 bg-gray-100 cursor-not-allowed"
                  />
                  <p
                    className="mt-1 text-xs text-gray-500"
                    style={{ color: "#F44637" }}
                  >
                    이름은 변경할 수 없습니다.
                  </p>
                </div>

                {/* 닉네임 */}
                <div>
                  <Label htmlFor="nickname" className="block mb-2">
                    닉네임
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="nickname"
                      type="text"
                      value={profileData.nickname}
                      onChange={handleNicknameChange}
                      placeholder="닉네임을 입력하세요"
                      className="flex-1 h-10"
                    />
                    <button
                      type="button"
                      onClick={handleCheckNickname}
                      disabled={isCheckingNickname}
                      style={{
                        padding: "10px 10px",
                        background: "#3b6c55",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: isCheckingNickname ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                        opacity: isCheckingNickname ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isCheckingNickname) {
                          e.currentTarget.style.background = "#2a5240";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#3b6c55";
                      }}
                    >
                      {isCheckingNickname ? "확인 중..." : "중복확인"}
                    </button>
                  </div>
                  {nicknameCheckResult && (
                    <p
                      className={`text-sm mt-1 ${
                        nicknameCheckResult.available
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {nicknameCheckResult.message}
                    </p>
                  )}
                </div>

                {/* 이메일 (수정 불가) */}
                <div>
                  <Label htmlFor="email" className="block mb-2">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="h-10 bg-gray-100 cursor-not-allowed"
                  />
                  <p
                    className="mt-1 text-xs text-gray-500"
                    style={{ color: "#F44637" }}
                  >
                    이메일은 변경할 수 없습니다
                  </p>
                </div>

                {/* 전화번호 */}
                <div>
                  <Label htmlFor="phone" className="block mb-2">
                    전화번호
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    placeholder="전화번호를 입력하세요"
                    className="h-10"
                  />
                </div>

                {/* 비밀번호 */}
                <div>
                  <Label htmlFor="password" className="block mb-2">
                    비밀번호
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={profileData.password}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        password: e.target.value,
                      })
                    }
                    placeholder="새 비밀번호를 입력하세요 (변경 시에만)"
                    className="h-10"
                  />
                </div>

                {/* 비밀번호 확인 */}
                <div>
                  <Label htmlFor="confirmPassword" className="block mb-2">
                    비밀번호 확인
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="비밀번호를 다시 입력하세요"
                    className="h-10"
                  />
                  {profileData.password &&
                    profileData.confirmPassword &&
                    profileData.password !== profileData.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        비밀번호가 일치하지 않습니다
                      </p>
                    )}
                  {profileData.password &&
                    profileData.confirmPassword &&
                    profileData.password === profileData.confirmPassword && (
                      <p className="mt-1 text-sm text-green-600">
                        비밀번호가 일치합니다
                      </p>
                    )}
                </div>

                {/* 주소 */}
                <div>
                  <AddressSearch
                    onAddressSelect={handleAddressSelect}
                    initialAddress={profileData.address}
                  />
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    취소
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-[#3b6c55] hover:bg-[#2a5240]"
                  >
                    저장하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
