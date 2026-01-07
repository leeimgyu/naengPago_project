// src/components/fridge/FridgePanel.tsx
import React, { useState } from 'react';
import styles from './FridgePanel.module.css';
import FridgePanelHeader from './components/FridgePanelHeader';
import { FridgeTabs, type FridgeTab } from './components/FridgeTabs';
import FridgePanelContent from './components/FridgePanelContent';

interface FridgePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FridgePanel: React.FC<FridgePanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<FridgeTab>('recipes');

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.arrowBorder} />
        <div className={styles.arrow} />
        <FridgePanelHeader onClose={onClose} />
        <FridgeTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <FridgePanelContent activeTab={activeTab} onClose={onClose} />
      </div>
    </>
  );
};

export default FridgePanel;