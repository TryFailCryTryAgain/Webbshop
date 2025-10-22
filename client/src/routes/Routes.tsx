import { Routes, Route } from 'react-router';
import { RouterContainer } from './RouterContainer';
import Homepage from '../views/homepage';
import { Product } from '../views/product';
import LoginPage from '../views/login';
import RegisterPage from '../views/register';
import AdminDashboard from '../views/admin-dashboard';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.Homepage} element={<Homepage />}></Route>
            <Route path={RouterContainer.Product} element={<Product />}></Route>
            <Route path={RouterContainer.Login} element={<LoginPage />}></Route>
            <Route path={RouterContainer.Register} element={<RegisterPage />}></Route>
            <Route path={RouterContainer.AdminDashboard} element={<AdminDashboard />}></Route>
        </Routes>
    )
}

export default AppRoutes;