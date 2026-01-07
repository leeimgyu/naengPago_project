import React from 'react';
import { Link, useParams } from 'react-router-dom';
import NoticeEditForm from './components/NoticeEditForm/NoticeEditForm';

const NoticeEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // In a real application, you would fetch the notice data using the id
    console.log('Editing notice with id:', id);

    return (
        <div className="max-w-5xl px-4 mx-auto my-10 mt-8 md:my-16 md:px-10">
            <div className="flex items-center gap-2 mt-8 mb-8 text-sm text-gray-500">
                <Link to="/" className="hover:text-[#4a7c59] transition-colors">Home</Link>
                <span>›</span>
                <Link to="/notice" className="hover:text-[#4a7c59] transition-colors">공지사항</Link>
                <span>›</span>
                <span className="font-medium text-[#4a7c59]">수정</span>
            </div>
            <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
                <div className="px-10 py-8 border-b-2 border-[#4a7c59]">
                    <h1 className="text-2xl font-bold text-gray-800">공지사항 수정</h1>
                </div>
                <NoticeEditForm />
            </div>
        </div>
    );
};

export default NoticeEditPage;
