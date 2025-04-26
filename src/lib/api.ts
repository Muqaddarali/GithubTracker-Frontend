
import axios from 'axios';
import { User } from './types';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/users');
        // Ensure we're returning an array, even if the API returns an empty object
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.error('API returned non-array data:', response.data);
            return []; // Return empty array as fallback
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // Return empty array on error
    }
};

export const getUserById = async (id: string): Promise<User> => {
    try {
        const response = await api.get(`/users/${id}`);
        // Explicitly check if response.data has the required User properties
        if (response.data && typeof response.data === 'object' && 'id' in response.data) {
            return response.data as User;
        } else {
            console.error('API returned invalid user data:', response.data);
            // Return a default User object as fallback
            return {
                id: id,
                username: 'Unknown',
                avatarUrl: '',
                email: '',
                role: 'USER' as 'ADMIN' | 'USER' // Explicitly cast to the allowed enum values
            };
        }
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        // Return a default User object on error
        return {
            id: id,
            username: 'Unknown',
            avatarUrl: '',
            email: '',
            role: 'USER' as 'ADMIN' | 'USER' // Explicitly cast to the allowed enum values
        };
    }
};