import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Update with a .env location so it can be used with the deployed url later

export interface Category {
    _id: string;
    title: string;
    slug: string;
    created_at: string;
    updated_at: string;
}


export interface Product {
    _id: string;
    title: string;
    description: string;
    category: Category;
    price: number;
    images: string[];
    created_at: string;
    updated_at: string;
    rate: string[];
}

export interface Order {
    _id: string;
    userId: string;
    productId: string[];
    created_at: string;
    updated_at: string;
    price: number;
    delivery_date: Date;
}

export interface Review {
    _id: string;
    rating: number;
    description: string;
    userId: string;
    productId: string;
    created_at: Date;
    updated_at: Date;
}

export interface Profile {
    _id: string,
    email: string,
    password: string,
    adress: string;
    ZIP: string;
    city: string;
    first_name: string;
    last_name: string;
    role: string;
    tel: number;
    updated_at: Date;
    created_at: Date;
}

export const userAPI = {
    getUserById: async (id: string): Promise<Profile> => {
        const response = await axios.get(`${API_BASE_URL}/user/id/${id}`);
        return response.data;
    },

    updateUser: async (id: string, token: string, userData: Partial<Omit<Profile, '_id' | 'updated_at' | 'created_at'>>): Promise<Profile> => {
        const response = await axios.put(`${API_BASE_URL}/user/${id}`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    deleteUser: async (id: string, token: string): Promise<{ message: string; user: Profile}> => {
        const response = await axios.delete(`${API_BASE_URL}/user/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    getAllUsers: async (): Promise<Profile[]> => {
        const response = await axios.get(`${API_BASE_URL}/user`);
        return response.data;
    }
}

export const reviewAPI = {
    getReviewsByUserId: async (id: string): Promise<Review[]> => {
        const response = await axios.get(`${API_BASE_URL}/review/user/${id}`);
        return response.data;
    },

    getReviewsByProductId: async (id: string): Promise<Review[]> => {
        const response = await axios.get(`${API_BASE_URL}/review/product/${id}`);
        return response.data;
    },

    getReviews: async (): Promise<Review[]> => {
        const response = await axios.get(`${API_BASE_URL}/review`);
        return response.data;
    },

    createReview: async (reviewData: Omit<Review, '_id' | 'created_at' | 'updated_at'>): Promise<Review> => {
        const response = await axios.post(`${API_BASE_URL}/review`, reviewData);
        return response.data;
    },

    updateReview: async (id: string, reviewData: Omit<Review, '_id' | 'created_at' | 'updated_at'>): Promise<Review> => {
        const response = await axios.put(`${API_BASE_URL}/review/${id}`, reviewData);
        return response.data;
    },

    deleteReview: async (id: string): Promise<{message: string, review: Review}> => {
        const response = await axios.delete(`${API_BASE_URL}/review/${id}`);
        return response.data;
    }
}

export const orderAPI = {
    getOrdersByUserId: async (id: string): Promise<Order[]> => {
        const response = await axios.get(`${API_BASE_URL}/order/user/${id}`);
        return response.data;
    },

    getOrders: async (): Promise<Order[]> => {
        const response = await axios.get(`${API_BASE_URL}/order`);
        return response.data;
    }
}

export const productAPI = {
    // Fetch all products
    getProducts: async (): Promise<Product[]> => {
        const response = await axios.get(`${API_BASE_URL}/product`);
        return response.data;
    },

    // Fetch single product by ID
    getProductById: async (id: string): Promise<Product> => {
        const response = await axios.get(`${API_BASE_URL}/product/${id}`);
        return response.data;
    },

    getProductByCategory: async (id: string): Promise<Product[]> => {
        const response = await axios.get(`${API_BASE_URL}/product/category/${id}`);
        return response.data.products;
    }
};

export const categoryAPI = {
    // Fetch all categories
    getCategories: async (): Promise<Category[]> => {
        const response = await axios.get(`${API_BASE_URL}/category`);
        return response.data;
    }
}