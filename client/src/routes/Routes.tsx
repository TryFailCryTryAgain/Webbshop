import { Routes, Route } from 'react-router';
import { RouterContainer } from './RouterContainer';
import Homepage from '../views/homepage';
import { Product } from '../views/product';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={RouterContainer.Homepage} element={<Homepage />}></Route>
            <Route path={RouterContainer.Product} element={<Product />}></Route>
        </Routes>
    )
}

export default AppRoutes;