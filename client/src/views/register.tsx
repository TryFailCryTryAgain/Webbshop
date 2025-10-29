import axios from "axios";
import { useState } from "react";

// Define TypeScript interfaces
interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface RegisterResponse {
    message: string;
    user: User;
    token: string;
}

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        tel: "",
        email: "",
        address: "",
        ZIP: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Validate required fields
            const { first_name, last_name, tel, email, address, ZIP, password, confirmPassword } = formData;
            
            if (!first_name || !last_name || !tel || !email || !address || !ZIP || !password || !confirmPassword) {
                setError("Please fill in all fields");
                setIsLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setIsLoading(false);
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters long");
                setIsLoading(false);
                return;
            }

            // Make API call with Axios
            const response = await axios.post<RegisterResponse>(
                "http://localhost:8080/user/register", 
                {
                    first_name: first_name,
                    last_name: last_name,
                    tel: tel,
                    email: email,
                    address: address,
                    ZIP: ZIP,
                    password: password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // Handle successful registration
            console.log("Registration successful:", response.data);
            
            // Store token and user data
            if (response.data.token && response.data.user) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                
                // Set Axios default header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }

            // Redirect to dashboard or home page
            window.location.href = "/user-dashboard";

        } catch (err: any) {
            // Handle errors
            console.error("Registration error:", err);
            
            if (err.response) {
                // Server responded with error status
                setError(err.response.data.message || "Registration failed");
            } else if (err.request) {
                // Request was made but no response received
                setError("Network error. Please check your connection.");
            } else {
                // Something else happened
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Register Here</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input 
                            type="text" 
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            placeholder="Enter your first name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input 
                            type="text" 
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            placeholder="Enter your last name"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="tel">Phone Number</label>
                    <input 
                        type="tel" 
                        id="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input 
                        type="text" 
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="Enter your address"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="ZIP">ZIP Code</label>
                        <input 
                            type="text" 
                            id="ZIP"
                            name="ZIP"
                            value={formData.ZIP}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            placeholder="Enter your ZIP code"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="Enter your password"
                        minLength={6}
                    />
                    <div className="password-strength">
                        <div className="strength-bar"></div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="Confirm your password"
                        minLength={6}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={isLoading ? "loading" : ""}
                >
                    {isLoading ? "Registering..." : "Register"}
                </button>

                <div className="form-footer">
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </form>
        </main>
    );
};

export default RegisterPage;