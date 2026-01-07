import React from 'react';
import { Maximize2, Minimize2, List } from 'lucide-react';
import styles from './ViewControls.module.css';

type ViewMode = 'large' | 'small' | 'list';

interface ViewControlsProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({ currentView, onViewChange }) => {
  return (
    <div className={styles.viewControls}>
      <button
        className={`${styles.viewControlBtn} ${currentView === 'large' ? styles.active : ''}`}
        onClick={() => onViewChange('large')}
        title="크게 보기"
      >
        <Maximize2 size={18} />
      </button>
      <button
        className={`${styles.viewControlBtn} ${currentView === 'small' ? styles.active : ''}`}
        onClick={() => onViewChange('small')}
        title="작게 보기"
      >
        <Minimize2 size={18} />
      </button>
      <button
        className={`${styles.viewControlBtn} ${currentView === 'list' ? styles.active : ''}`}
        onClick={() => onViewChange('list')}
        title="목록 보기"
      >
        <List size={18} />
      </button>
    </div>
  );
};
