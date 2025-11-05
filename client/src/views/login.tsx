import { useState } from "react";
import axios from "axios";

// Define TypeScript interfaces
interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface LoginResponse {
    message: string;
    user: User;
    token: string;
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (!email || !password) {
                setError("Please fill in all fields");
                setIsLoading(false);
                return;
            }

            // Make API call with Axios
            const response = await axios.post<LoginResponse>(
                `${API_BASE_URL}/user/login`, 
                {
                    email: email,
                    password: password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // Handle successful login
            console.log("Login successful:", response.data);
            
            // Store token and user data
            if (response.data.token && response.data.user) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                
                // Optional: Set Axios default header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }

            // Redirect to dashboard or home page
            window.location.href = "/user-dashboard";

        } catch (err: unknown) {
            console.error("Login error:", err);
            
            setIsLoading(false);
            
            if (err instanceof Error) {
                // For standard Error objects
                setError(err.message);
            } else if (typeof err === 'string') {
                // For string errors
                setError(err);
            } else {
                // Fallback for other types
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <main className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login Here</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="Enter your password"
                        minLength={6}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={isLoading ? "loading" : ""}
                >
                    {isLoading ? "Logging in..." : "Log in"}
                </button>

                <div className="form-footer">
                    <p>Don't have an account? <a href="/register">Register here</a></p>
                </div>
            </form>
        </main>
    );
};

export default LoginPage;