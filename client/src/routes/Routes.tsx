import { Routes, Route } from 'react-router';
import { RouterContainer } from './RouterContainer';
import Homepage from '../views/homepage';
import { ProductPage } from '../views/product';
import LoginPage from '../views/login';
import RegisterPage from '../views/register';
import AdminDashboard from '../views/admin-dashboard';
import UserDashboard from '../views/user-dashboard';
import Specific_Category from '../views/specific_category';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path={RouterContainer.Homepage} element={<Homepage />} />
            <Route path={RouterContainer.Product} element={<ProductPage />} />
            <Route path={RouterContainer.Login} element={<LoginPage />} />
            <Route path={RouterContainer.Register} element={<RegisterPage />} />
            <Route path={RouterContainer.Category} element={<Specific_Category />} />
            
            {/* Protected Routes, check if the user is logged in and has the role admin */}
            <Route 
                path={RouterContainer.AdminDashboard} 
                element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } 
            />
            
            {/* Protected Routes, check if the user is logged in */}
            <Route 
                path={RouterContainer.UserDashboard} 
                element={
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    )
}

export default AppRoutes;