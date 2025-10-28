

import { Header } from "../components/header";
import { useState } from "react";
import UserOrderTab from "../components/userTabs/UserOrderTab";
import UserProfileTab from "../components/userTabs/UserProfileTab";
import AdminDashboardTabs from "../components/adminDashboardTabs";
import UserReviewTab from "../components/userTabs/UserReviewTab";

const UserDashboard = () => {

    const [activeTab, setActiveTab] = useState('orders');

    const tabs = [
        { id: 'orders', label: 'My Orders' },
        { id: 'reviews', label: 'My Reviews' },
        { id: 'profile', label: 'Profile' },
    ];

    const renderTabContent = () => {
        switch(activeTab) {
            case 'orders': 
                return <UserOrderTab />;
            case 'reviews':
                return  <UserReviewTab />;
            case 'profile':
                return <UserProfileTab />;
        }
    };

    return (
        <>
            <Header />
            <div className="dashboard-container">

                <AdminDashboardTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <div className="tab-content">
                    <div className="tab-content-title">{activeTab}</div>
                    {renderTabContent()}
                </div>
            </div>
        </>
    );
};

export default UserDashboard;