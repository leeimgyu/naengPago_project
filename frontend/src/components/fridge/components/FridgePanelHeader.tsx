// src/components/fridge/components/FridgePanelHeader.tsx
import React from 'react';
import styles from '../FridgePanel.module.css';
import { X } from 'lucide-react'; // X 아이콘 import

interface FridgePanelHeaderProps {
  onClose: () => void;
}

const FridgePanelHeader: React.FC<FridgePanelHeaderProps> = ({ onClose }) => {
  return (
    <div className={styles.header}>
      <h3>내 냉장고</h3>
      <button onClick={onClose} className={styles.closeButton}>
        <X />
      </button>
    </div>
  );
};

export default FridgePanelHeader;
