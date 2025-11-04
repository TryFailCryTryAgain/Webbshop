import { useEffect, useState } from "react";
import { productAPI, type Product, type Category, categoryAPI } from "../../api/api";

const AdminProductsTab = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Product>>({});
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [createWindow, setCreateWindow] = useState(false);
    const [newProductData, setNewProductData] = useState({
        title: "",
        description: "",
        price: 0,
        images: [""],
        category: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productData, categoryData] = await Promise.all([
                    productAPI.getProducts(),
                    categoryAPI.getCategories()
                ]);
                setProducts(productData);
                setCategories(categoryData);
            } catch (err) {
                console.error("Error fetching data: ", err);
                setMessage("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper function to get category name
    const getCategoryName = (categoryId: string): string => {
        if (!categoryId) return "No category";
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.title : "Unknown category";
    };

    // Helper function to get category ID from product
    const getProductCategoryId = (product: Product): string => {
        if (!product.category) return "";
        if (typeof product.category === 'string') return product.category;
        if (typeof product.category === 'object' && product.category._id) return product.category._id;
        return "";
    };

    const formatDate = (date: string | undefined | null): string => {
        if (!date) return "N/A";
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return "Invalid Date";
            return dateObj.toLocaleDateString();
        } catch (error) {
            return "Date Error";
        }
    };

    // Edit product functions
    const handleEditClick = (product: Product) => {
        setEditingProductId(product._id);
        setEditFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            images: product.images,
            category: getProductCategoryId(product)
        });
        setMessage("");
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
        setEditFormData({});
        setMessage("");
    };

    const handleEditFormChange = (field: string, value: string | number | string[]) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveEdit = async (productId: string) => {
        if (!editFormData.title || !editFormData.description || !editFormData.price || !editFormData.category) {
            setMessage("Please provide title, description, price, and category");
            return;
        }

        setActionLoading(productId);
        setMessage("");

        try {
            // Filter out undefined values and assert the type
            const filteredData = Object.fromEntries(
                Object.entries(editFormData).filter(([_, value]) => value !== undefined)
            ) as Omit<Product, '_id' | 'rate'>;

            // Since we don't have updateProduct in API, we'll need to handle this
            // For now, we'll just update locally until API is extended
            const updatedProduct: Product = {
                ...products.find(p => p._id === productId)!,
                ...filteredData,
                updated_at: new Date().toISOString()
            };

            // Update local state
            setProducts(prev => prev.map(product => 
                product._id === productId ? updatedProduct : product
            ));

            setMessage("Product updated successfully! (Local update - API update not implemented)");
            setEditingProductId(null);
            setEditFormData({});
        } catch (error: any) {
            console.error("Failed to update product:", error);
            setMessage(error.response?.data?.message || "Failed to update product");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            return;
        }

        setActionLoading(productId);
        setMessage("");

        try {
            const result = await productAPI.deleteProduct(productId);
            
            // Remove the deleted product from the list
            setProducts(prev => prev.filter(product => product._id !== productId));
            
            setMessage(result.message);
        } catch (error: any) {
            console.error("Failed to delete product:", error);
            setMessage(error.response?.data?.message || "Failed to delete product");
        } finally {
            setActionLoading(null);
        }
    };

    // Create product functions
    const handleCreateClick = () => {
        setCreateWindow(true);
        setNewProductData({
            title: "",
            description: "",
            price: 0,
            images: [""],
            category: ""
        });
    };

    const handleCancelCreate = () => {
        setCreateWindow(false);
        setNewProductData({
            title: "",
            description: "",
            price: 0,
            images: [""],
            category: ""
        });
    };

    const handleCreateFormChange = (field: string, value: string | number | string[]) => {
        setNewProductData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...newProductData.images];
        newImages[index] = value;
        setNewProductData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const addImageField = () => {
        setNewProductData(prev => ({
            ...prev,
            images: [...prev.images, ""]
        }));
    };

    const removeImageField = (index: number) => {
        setNewProductData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleCreateProduct = async () => {
        if (!newProductData.title || !newProductData.description || !newProductData.price || !newProductData.category) {
            setMessage("Please provide title, description, price, and category");
            return;
        }

        setActionLoading("create");
        setMessage("");

        try {
            const createdProduct = await productAPI.createProduct({
                title: newProductData.title,
                description: newProductData.description,
                price: newProductData.price,
                images: newProductData.images.filter(img => img.trim() !== ""),
                category: newProductData.category
            });

            // Add the new product to the list
            setProducts(prev => [createdProduct, ...prev]);
            
            setMessage("Product created successfully!");
            setCreateWindow(false);
            setNewProductData({
                title: "",
                description: "",
                price: 0,
                images: [""],
                category: ""
            });
        } catch (error: any) {
            console.error("Failed to create product:", error);
            setMessage(error.response?.data?.message || "Failed to create product");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <>
            {/* Create Product Window */}
            {createWindow && (
                <div className="edit-window-overlay">
                    <div className="edit-window">
                        <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleCreateProduct(); }}>
                            <h2>Create New Product</h2>

                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={newProductData.title}
                                    onChange={(e) => handleCreateFormChange('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea 
                                    name="description"
                                    value={newProductData.description}
                                    onChange={(e) => handleCreateFormChange('description', e.target.value)}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input 
                                    type="number" 
                                    name="price"
                                    value={newProductData.price}
                                    onChange={(e) => handleCreateFormChange('price', parseFloat(e.target.value))}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select 
                                    name="category"
                                    value={newProductData.category}
                                    onChange={(e) => handleCreateFormChange('category', e.target.value)}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Images</label>
                                {newProductData.images.map((image, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input 
                                            type="text" 
                                            value={image}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                            placeholder={`Image URL ${index + 1}`}
                                            style={{ flex: 1 }}
                                        />
                                        {newProductData.images.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeImageField(index)}
                                                className="btn-delete"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    onClick={addImageField}
                                    className="btn-edit"
                                >
                                    Add Image URL
                                </button>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="btn save" 
                                    disabled={actionLoading === "create"}
                                >
                                    {actionLoading === "create" ? "Creating..." : "Create Product"}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn cancel" 
                                    onClick={handleCancelCreate}
                                    disabled={actionLoading === "create"}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {message && (
                <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            <div className="data-table-header">
                <button 
                    className="btn-edit"
                    onClick={handleCreateClick}
                    disabled={actionLoading !== null}
                >
                    Create New Product
                </button>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Images</th>
                            <th>Rating</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    {editingProductId === product._id ? (
                                        <input
                                            type="text"
                                            value={editFormData.title || ""}
                                            onChange={(e) => handleEditFormChange('title', e.target.value)}
                                            style={{ width: '100%', padding: '0.5rem' }}
                                        />
                                    ) : (
                                        product.title
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product._id ? (
                                        <textarea
                                            value={editFormData.description || ""}
                                            onChange={(e) => handleEditFormChange('description', e.target.value)}
                                            rows={3}
                                            style={{ width: '100%', padding: '0.5rem' }}
                                        />
                                    ) : (
                                        product.description.length > 100 
                                            ? `${product.description.substring(0, 100)}...` 
                                            : product.description
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product._id ? (
                                        <input
                                            type="number"
                                            value={editFormData.price || 0}
                                            onChange={(e) => handleEditFormChange('price', parseFloat(e.target.value))}
                                            step="0.01"
                                            min="0"
                                            style={{ width: '100%', padding: '0.5rem' }}
                                        />
                                    ) : (
                                        `$${product.price}`
                                    )}
                                </td>
                                <td>
                                    {editingProductId === product._id ? (
                                        <select
                                            value={editFormData.category || ""}
                                            onChange={(e) => handleEditFormChange('category', e.target.value)}
                                            style={{ width: '100%', padding: '0.5rem' }}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.title}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        getCategoryName(getProductCategoryId(product))
                                    )}
                                </td>
                                <td>
                                    {product.images.length > 0 ? (
                                        <span>{product.images.length} image(s)</span>
                                    ) : (
                                        "No images"
                                    )}
                                </td>
                                <td>
                                    {product.rate ? product.rate.length > 0 ? `${product.rate.length} ratings` : "No ratings" : "No ratings"}
                                </td>
                                <td>{formatDate(product.created_at)}</td>
                                <td>{formatDate(product.updated_at)}</td>
                                <td className="action-buttons">
                                    {editingProductId === product._id ? (
                                        <>
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleSaveEdit(product._id)}
                                                disabled={actionLoading === product._id}
                                            >
                                                {actionLoading === product._id ? "Saving..." : "Save"}
                                            </button>
                                            <button 
                                                className="btn-cancel"
                                                onClick={handleCancelEdit}
                                                disabled={actionLoading === product._id}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEditClick(product)}
                                                disabled={actionLoading !== null}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDeleteProduct(product._id)}
                                                disabled={actionLoading !== null}
                                            >
                                                {actionLoading === product._id ? "Deleting..." : "Delete"}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && !loading && (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center' }}>
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#F2F2F2' }}>
                        Loading products...
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminProductsTab;