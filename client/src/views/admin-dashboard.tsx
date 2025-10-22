import AdminDashboardTabs from "../components/adminDashboardTabs";
import { Header } from "../components/header";
import { useState } from "react";
import AdminOverviewTab from "../components/tabs/AdminOverviewTab";
import AdminOrdersTab from "../components/tabs/AdminOrdersTab";
import AdminUsersTab from "../components/tabs/AdminUsersTab";
import AdminProductsTab from "../components/tabs/AdminProductsTab";
import AdminReviewsTab from "../components/tabs/AdminReviewsTab";


const AdminDashboard = () => {

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'orders', label: 'Orders' },
        { id: 'users', label: 'Users' },
        { id: 'products', label: 'Products' },
        { id: 'reviews', label: 'Reviews' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <AdminOverviewTab />;
            case 'orders':
                return <AdminOrdersTab />;
            case 'users':
                return <AdminUsersTab />;
            case 'products':
                return <AdminProductsTab />;
            case 'reviews':
                return <AdminReviewsTab />;
            default:
                return <AdminOverviewTab />;
        }
    };


    return (
        <>

            <Header />

            <main className="dashboard-container">
                
                <AdminDashboardTabs 
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                <div className="tab-content">
                    {renderTabContent()}
                </div>

            </main>
        
        </>
    );
};

export default AdminDashboard;