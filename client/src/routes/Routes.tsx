import { Routes, Route } from 'react-router';
import { RouterContainer } from './RouterContainer';
import Homepage from '../views/homepage';
import { ProductPage } from '../views/product';
import LoginPage from '../views/login';
import RegisterPage from '../views/register';
import AdminDashboard from '../views/admin-dashboard';
import UserDashboard from '../views/user-dashboard';
import Specific_Category from '../views/specific_category';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.Homepage} element={<Homepage />}></Route>
            <Route path={RouterContainer.Product} element={<ProductPage />}></Route>
            <Route path={RouterContainer.Login} element={<LoginPage />}></Route>
            <Route path={RouterContainer.Register} element={<RegisterPage />}></Route>
            <Route path={RouterContainer.AdminDashboard} element={<AdminDashboard />}></Route>
            <Route path={RouterContainer.UserDashboard} element={<UserDashboard />}></Route>
            <Route path={RouterContainer.Category} element={<Specific_Category />}></Route>
        </Routes>
    )
}

export default AppRoutes;