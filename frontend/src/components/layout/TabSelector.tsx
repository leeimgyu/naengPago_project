import React from 'react';
import './TabSelector.css';

type TabType = 'review' | 'comment';

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  reviewCount: number;
  commentCount: number;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
  reviewCount,
  commentCount
}) => {
  return (
    <div className="tab-selector">
      <button
        className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`}
        onClick={() => onTabChange('review')}
      >
        요리 후기 ({reviewCount})
      </button>
      <button
        className={`tab-btn ${activeTab === 'comment' ? 'active' : ''}`}
        onClick={() => onTabChange('comment')}
      >
        댓글 ({commentCount})
      </button>
    </div>
  );
};
