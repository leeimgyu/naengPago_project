import styles from "./FridgeTabs.module.css";

export type FridgeTab = "recipes" | "ingredients";

interface FridgeTabsProps {
  activeTab: FridgeTab;
  onTabChange: (tab: FridgeTab) => void;
}

export function FridgeTabs({
  activeTab,
  onTabChange,
}: FridgeTabsProps) {
  const tabs: { id: FridgeTab; label: string }[] = [
    { id: "recipes", label: "추천 레시피" },
    { id: "ingredients", label: "보유 재료" },
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${styles.tab} ${
            activeTab === tab.id ? styles.active : ""
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
