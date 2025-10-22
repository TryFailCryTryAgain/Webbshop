
export interface Tab {
    id: string;
    label: string;
}

interface AdminDashboardTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const AdminDashboardTabs = ({ tabs, activeTab, onTabChange }: AdminDashboardTabsProps) => {
    return (
        <div className="dashboard-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default AdminDashboardTabs;