import { userAPI, type Profile } from "../../api/api";
import { useState, useEffect } from "react";

const AdminUsersTab = () => {
    const [users, setUsers] = useState<Profile[]>([]);    
    const [editWindow, setEditWindow] = useState(false);
    const [editData, setEditData] = useState<Profile | null>(null);
    const [formData, setFormData] = useState<Partial<Profile>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async() => {
            try {
                const data = await userAPI.getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };

        fetchUsers();
    }, []);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    }

    const handleEdit = (user: Profile) => {
        setEditData(user);
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            adress: user.adress,
            ZIP: user.ZIP,
            city: user.city,
            role: user.role,
            tel: user.tel
        });
        setEditWindow(true);
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token') || '';
            await userAPI.deleteUser(id, token);
            
            setUsers(users.filter(user => user._id !== id));
            alert("User deleted successfully");
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Failed to delete user");
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editData) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token') || '';
            
            // Filter out undefined values and assert the type
            const filteredData = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value !== undefined)
            ) as Partial<Omit<Profile, '_id' | 'updated_at' | 'created_at'>>;

            const updatedUser = await userAPI.updateUser(editData._id, token, filteredData);
            
            setUsers(users.map(user => 
                user._id === editData._id ? updatedUser : user
            ));
            
            setEditWindow(false);
            setEditData(null);
            setFormData({});
            alert("User updated successfully");
        } catch (err) {
            console.error("Failed to update user", err);
            alert("Failed to update user");
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        setEditWindow(false);
        setEditData(null);
        setFormData({});
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <>
            {editWindow && editData && (
                <div className="edit-window-overlay">
                    <div className="edit-window">
                        <form className="edit-form" onSubmit={handleSave}>
                            <h2>Edit User</h2>

                            <div className="form-group">
                                <label htmlFor="first_name">First name</label>
                                <input 
                                    type="text" 
                                    name="first_name"
                                    value={formData.first_name || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="last_name">Last name</label>
                                <input 
                                    type="text" 
                                    name="last_name"
                                    value={formData.last_name || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="adress">Address</label>
                                <input 
                                    type="text" 
                                    name="adress"
                                    value={formData.adress || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleInputChange}
                                />
                            </div> */}

                            <div className="form-group">
                                <label htmlFor="ZIP">ZIP</label>
                                <input 
                                    type="text" 
                                    name="ZIP"
                                    value={formData.ZIP || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="tel">Phone</label>
                                <input 
                                    type="tel" 
                                    name="tel"
                                    value={formData.tel || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select 
                                    name="role"
                                    value={formData.role || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-action">
                                <button 
                                    type="submit" 
                                    className="btn save" 
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn cancel" 
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>ZIP</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.first_name} {user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.adress}, {user.city}</td>
                                <td>{user.ZIP}</td>
                                <td>{user.role}</td>
                                <td>{formatDate(user.created_at)}</td>
                                <td>{formatDate(user.updated_at)}</td>
                                <td>
                                    <button 
                                        className="btn-edit" 
                                        onClick={() => handleEdit(user)}
                                        disabled={loading}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => handleDelete(user._id)}
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminUsersTab;