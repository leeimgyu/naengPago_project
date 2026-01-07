import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import FileUpload from '../FileUpload/FileUpload';
import { useNavigate } from 'react-router-dom';
import { createNotice } from '@/api/noticeApi';

interface NoticeFormState {
    category: string;
    title: string;
    content: string;
    isPinned: boolean;
    files: File[];
}

const NoticeRegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<NoticeFormState>({
        category: '',
        title: '',
        content: '',
        isPinned: false,
        files: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handlePinnedChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isPinned: checked }));
    };

    const handleFilesChange = useCallback((files: File[]) => {
        setFormData(prev => ({ ...prev, files }));
    }, []);

    const handleSave = async () => {
        if (!formData.category || !formData.title || !formData.content) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }
        if (formData.content.length < 10) {
            alert('내용은 최소 10자 이상 입력해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            await createNotice({
                category: formData.category,
                title: formData.title,
                content: formData.content,
                isPinned: formData.isPinned,
                attachments: formData.files.length > 0 ? formData.files : undefined,
            });
            alert('공지사항이 등록되었습니다.');
            navigate('/notice');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '공지사항 등록에 실패했습니다.';
            alert(errorMessage);
            console.error('Error creating notice:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
            navigate(-1);
        }
    };

    return (
        <>
            <form className="p-10">
                <div className="mb-8">
                    <Label htmlFor="category" className="font-semibold text-gray-800">
                        구분<span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger id="category" className="mt-2 h-14 focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/50">
                            <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent className="z-[999] bg-gray-50" >
                            <SelectItem value="공지">공지</SelectItem>
                            <SelectItem value="이벤트">이벤트</SelectItem>
                            <SelectItem value="안내">안내</SelectItem>
                            <SelectItem value="업데이트">업데이트</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-8">
                    <Label htmlFor="title" className="font-semibold text-gray-800">
                        제목<span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="title"
                        className="mt-2 h-14 focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/50"
                        placeholder="공지사항 제목을 입력하세요"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-8">
                    <Label htmlFor="content" className="font-semibold text-gray-800">
                        내용<span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="content"
                        className="mt-2 min-h-[400px] text-base focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/50"
                        placeholder="공지사항 내용을 입력하세요"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                    />
                    <div className="mt-2 text-xs text-gray-500">내용은 최소 10자 이상 입력해주세요.</div>
                </div>

                <div className="mb-8">
                    <Label className="font-semibold text-gray-800">첨부파일</Label>
                    <div className="mt-2">
                        <FileUpload onFilesChange={handleFilesChange} />
                    </div>
                </div>

                <div className="mb-8">
                    <Label htmlFor="pin-switch" className="font-semibold text-gray-800">상단 고정</Label>
                    <div className="flex items-center gap-3 mt-2">
                        <Switch
                            id="pin-switch"
                            checked={formData.isPinned}
                            onCheckedChange={handlePinnedChange}
                        />
                        <Label htmlFor="pin-switch" className="text-sm font-normal text-gray-600">
                            {formData.isPinned ? "이 게시글을 상단에 고정합니다" : "이 게시글을 상단에서 해제합니다."}
                        </Label>
                    </div>
                </div>
            </form>

            <div className="flex flex-col-reverse gap-4 px-10 py-6 border-gray-200 bor9der-t mb-9 bg-gray-50 md:flex-row md:justify-end md:items-center">
                <div className="flex flex-col-reverse gap-3 md:flex-row">
                    <Button variant="secondary" onClick={handleCancel} disabled={isLoading} className="w-full md:w-auto">취소</Button>
                    <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
                        {isLoading ? '저장 중...' : '저장'}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default NoticeRegisterForm;
