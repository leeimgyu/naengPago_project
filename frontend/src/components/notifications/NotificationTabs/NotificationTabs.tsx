import styles from "./NotificationTabs.module.css";

export type NotificationTab = "all" | "expiration" | "recipe";

interface NotificationTabsProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
}

export function NotificationTabs({
  activeTab,
  onTabChange,
}: NotificationTabsProps) {
  const tabs: { id: NotificationTab; label: string }[] = [
    { id: "all", label: "전체" },
    { id: "expiration", label: "유통기한" },
    { id: "recipe", label: "공지사항" },
  ];

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${styles.tab} ${
            activeTab === tab.id ? styles.active : ""
          } ${tab.id === "recipe" ? styles.recipeTab : ""} ${tab.id === "recipe" && activeTab === tab.id ? styles.recipeActive : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
