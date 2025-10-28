import { Link, useNavigate } from "react-router-dom";
import { RouterContainer } from "../routes/RouterContainer";
import axios from "axios";
import { useEffect, useState } from "react";
import { categoryAPI, type Category } from "../api/api";

export const Header = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common['Authorization'];
        navigate(RouterContainer.Login);
        window.location.reload();
    };

    // Fetch categories when dropdown is about to be shown
    async function fetchCategories() {
        // If dropdown is not visible and we don't have categories yet, fetch them
        if (!dropdownVisible && categories.length === 0) {
            try {
                const data = await categoryAPI.getCategories();
                setCategories(data);
                console.log(data);
            } catch (err) {
                setError('Failed to load categories');
                console.error('Error fetching categories', err);
            }
        }
        
        // Toggle dropdown visibility
        setDropdownVisible(!dropdownVisible);
    }

    function navigateToCategoryPage(id: string) {
        const categoryId = id;
        const ShortenCategoryId = id.slice(0, 6);

        navigate(RouterContainer.Category.replace(':id', ShortenCategoryId), {
            state: {
                categoryId: categoryId
            }
        });
        
        // Close dropdown after navigation
        setDropdownVisible(false);
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdownContainer = document.getElementById("category_dropdown_menu_container");
            if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                    >
                        {/* Only handle click on the link to toggle dropdown */}
                        <a 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                fetchCategories();
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            Categories
                        </a>
                        
                        {dropdownVisible && (
                            <ul className="categories_dropdown_menu">
                                {categories.map((category) => (
                                    <li 
                                        className="categories_dropdown_menu_links" 
                                        key={category._id}
                                        onClick={() => navigateToCategoryPage(category._id)}
                                    >
                                        {category.title}
                                    </li>
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