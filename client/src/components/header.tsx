import { Link, useNavigate } from "react-router-dom";
import { RouterContainer } from "../routes/RouterContainer";
import axios from "axios";
import { useEffect, useState } from "react";
import { categoryAPI, type Category } from "../api/api";

export const Header = () => {

    const [dropdown, setDropDown] = useState(true);

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



    // Fetching categories for the dropdown menu

    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);


    async function fetchCategories() {

        if (dropdown === true) {
            setDropDown(false);
            return;
        }

        try {
            const data = await categoryAPI.getCategories();
            setCategories(data)
            console.log(data);
        } catch (err) {
            setError('Failed to load categories');
            console.error('Error fetching categories', err);
        } finally {
            setDropDown(true);
        }     




    }






    return (
        <>
            <nav className="user-header">
                <div className="logo">Webbshop</div>
                <div className="search-bar">
                    <input type="text" placeholder="Search..."/>
                </div>
                <ul className="nav-links">
                    <li><Link to="/">Products</Link></li>
                    <li 
                        id="category_dropdown_menu_container" 
                        className="category_dropdown_menu_container"
                        onClick={() => fetchCategories()}
                    >
                        <Link to="#">Categories</Link>
                        
                        {dropdown && (
                            <ul className="categories_dropdown_menu">
                                {categories.map((category) => (
                                    <li className="categories_dropdown_menu_links" id={category._id}>{category.title}</li>
                                ))}
                            </ul>
                        )}

                        
                    </li>
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