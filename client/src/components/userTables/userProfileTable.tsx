import { useEffect, useState } from "react";
import { userAPI } from "../../api/api";

interface Profile {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    adress: string,
    ZIP: number,
    role: string
}

interface UserData {
    user: Profile | null;
    token: string | null;
}

const useUser = (): UserData => {
    const [user, setUser] = useState<Profile | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                setUser(JSON.parse(userString) as Profile);
            } catch (err) {
                console.error("Error parsing user data", err);
            }
        }

        const tokenString = localStorage.getItem("token");
        if (tokenString) {
            try {
                setToken(tokenString);
            } catch (err) {
                console.error("Error fetching the token", err);
            }
        }
    }, []);

    return { user, token };
}

const UserProfileTable = () => {
    const { user, token } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        adress: "",
        ZIP: 0
    });

    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                adress: user.adress,
                ZIP: user.ZIP
            });
        }
    }, [user]);

    // --- Debug function ---
    // function CheckStatus() {
    //     console.log("User:", user);
    //     console.log("Token:", token);
    // }

    const handleEdit = () => {
        setIsEditing(true);
        setMessage("");
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form data to original user data
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                adress: user.adress,
                ZIP: user.ZIP
            });
        }
        setMessage("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'ZIP' ? parseInt(value) || 0 : value
        }));
    };

    const handleSave = async () => {
        if (!user || !token) {
            setMessage("User data or token missing");
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            const updatedUser = await userAPI.updateUser(user._id, token, formData);
            
            // Update local storage and state with new user data
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            setMessage("Profile updated successfully!");
            setIsEditing(false);
            
            // Force refresh of user data
            window.location.reload(); // Or use a more sophisticated state update
        } catch (error: any) {
            console.error("Failed to update user:", error);
            setMessage(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user || !token) {
            setMessage("User data or token missing");
            return;
        }

        if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            const result = await userAPI.deleteUser(user._id, token);
            
            setMessage(result.message);
            
            // Clear local storage and redirect to home or login page
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            
            setTimeout(() => {
                window.location.href = "/"; // Redirect to home page
            }, 2000);
            
        } catch (error: any) {
            console.error("Failed to delete user:", error);
            setMessage(error.response?.data?.message || "Failed to delete profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <>
            
            {message && (
                <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            <div className="user-profile-grid">
                {isEditing ? (
                    // Edit Form
                    <>
                        <div>
                            First Name 
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            Last Name 
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            Email 
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            Address 
                            <input
                                type="text"
                                name="adress"
                                value={formData.adress}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            ZIP Code 
                            <input
                                type="number"
                                name="ZIP"
                                value={formData.ZIP}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                        </div>
                    </>
                ) : (
                    // Display Mode
                    <>
                        <div>Username <span>{user.first_name} {user.last_name}</span></div>
                        <div>Email <span>{user.email}</span></div>
                        <div>Address <span>{user.adress} {user.ZIP}</span></div>
                        <div>Role <span>{user.role}</span></div>
                    </>
                )}
            </div>

            <div className="action-buttons-profile">
                {isEditing ? (
                    <>
                        <button 
                            className="btn save" 
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button 
                            className="btn cancel" 
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            className="btn edit" 
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </button>
                        <button 
                            className="btn delete" 
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete Profile"}
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default UserProfileTable;