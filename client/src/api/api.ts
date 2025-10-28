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