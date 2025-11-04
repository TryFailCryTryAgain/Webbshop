// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { RouterContainer } from '../routes/RouterContainer';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'user';
}

interface Profile {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    adress: string;
    ZIP: number;
    role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requiredRole 
}) => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) as Profile : null;

    // If no user is logged in, redirect to login
    if (!userData) {
        return <Navigate to={RouterContainer.Login} replace />;
    }

    // If specific role is required and user doesn't have it
    if (requiredRole && userData.role !== requiredRole) {
        // Redirect admin users trying to access user routes? Or just to homepage?
        return <Navigate to={RouterContainer.Homepage} replace />;
    }

    // If no specific role required, any authenticated user can access
    return <>{children}</>;
};

export default ProtectedRoute;