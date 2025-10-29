import axios from 'axios';
import { User } from '../../../server/model/UserModel';

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
}

export const userAPI = {
    getUserById: async (id: string): Promise<Profile> => {
        const response = await axios.get(`${API_BASE_URL}/user/id/${id}`);
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
    }
}

export const orderAPI = {
    getOrdersByUserId: async (id: string): Promise<Order[]> => {
        const response = await axios.get(`${API_BASE_URL}/order/user/${id}`);
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