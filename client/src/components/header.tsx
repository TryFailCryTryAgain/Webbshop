import { Link, useNavigate } from "react-router-dom";
import { RouterContainer } from "../routes/RouterContainer";
import axios from "axios";

export const Header = () => {
    const navigate = useNavigate();
    
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Clear axios default headers
        delete axios.defaults.headers.common['Authorization'];
        
        // Redirect to login page
        navigate(RouterContainer.Login);
        
        // Optional: Force reload to update all components
        window.location.reload();
    };

    return (
        <>
            <nav className="user-header">
                <div className="logo">Webbshop</div>
                <div className="search-bar">
                    <input type="text" placeholder="Search..."/>
                </div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
                
                {token && userData ? (
                    <div className="user-menu">
                        <span className="welcome-text">
                            Welcome, {userData.first_name}!
                        </span>
                        <Link to={RouterContainer.UserDashboard}>
                            <button className="dashboard-btn">Dashboard</button>
                        </Link>
                        <button 
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to={RouterContainer.Login}>
                            <button className="sign-in">Sign in</button>
                        </Link>
                        <Link to={RouterContainer.Register}>
                            <button className="sign-up">Sign up</button>
                        </Link>
                    </div>
                )}
            </nav>
        </>
    );
};