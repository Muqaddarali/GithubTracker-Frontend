
import axios from 'axios';
import { User, StatsOverview, Contribution } from './types';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor to log API responses for easier debugging
api.interceptors.response.use(
    response => {
        console.log(`API response from ${response.config.url}:`, response.data);
        return response;
    },
    error => {
        console.error('API error:', error);
        return Promise.reject(error);
    }
);

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

// Define interface for contributions response
interface ContributionsResponse {
    contributions: Contribution[];
}

export const getContributions = async (owner: string, repo: string): Promise<ContributionsResponse> => {
    try {
        const response = await api.get(`/github/contributions/${owner}/${repo}`);
        
        // Type guard to properly handle the response
        if (response.data && typeof response.data === 'object') {
            const responseData = response.data as Record<string, unknown>;
            
            // Check if contributions exists and is an array
            if ('contributions' in responseData && Array.isArray(responseData.contributions)) {
                return {
                    contributions: responseData.contributions as Contribution[]
                };
            }
            
            // If contributions exists but is not an array
            if ('contributions' in responseData && responseData.contributions) {
                console.warn('API returned non-array contributions:', responseData.contributions);
            }
        }
        
        // Default empty response
        return { 
            contributions: [] 
        };
    } catch (error) {
        console.error('Error fetching contributions:', error);
        return { contributions: [] }; // Return empty contributions on error
    }
};

export const getRepositoryStats = async (owner: string, repo: string): Promise<StatsOverview> => {
    try {
        const response = await api.get(`/github/stats/${owner}/${repo}`);
        
        // Ensure we're returning a properly structured object with all required fields
        if (response.data && typeof response.data === 'object') {
            // Create a StatsOverview object with default values for missing properties
            const responseData = response.data as Record<string, unknown>;
            
            const stats: StatsOverview = {
                totalContributions: typeof responseData.totalContributions === 'number' ? responseData.totalContributions : 0,
                totalCommits: typeof responseData.totalCommits === 'number' ? responseData.totalCommits : 0,
                totalPullRequests: typeof responseData.totalPullRequests === 'number' ? responseData.totalPullRequests : 0,
                totalReviews: typeof responseData.totalReviews === 'number' ? responseData.totalReviews : 0,
                totalLinesAdded: typeof responseData.totalLinesAdded === 'number' ? responseData.totalLinesAdded : 0,
                totalLinesRemoved: typeof responseData.totalLinesRemoved === 'number' ? responseData.totalLinesRemoved : 0,
                activeUsers: typeof responseData.activeUsers === 'number' ? responseData.activeUsers : 0
            };
            return stats;
        }
        
        // Return default stats object if the API returns unexpected format
        return {
            totalContributions: 0,
            totalCommits: 0,
            totalPullRequests: 0,
            totalReviews: 0,
            totalLinesAdded: 0,
            totalLinesRemoved: 0,
            activeUsers: 0
        };
    } catch (error) {
        console.error('Error fetching repository stats:', error);
        // Return default stats object on error
        return {
            totalContributions: 0,
            totalCommits: 0,
            totalPullRequests: 0,
            totalReviews: 0,
            totalLinesAdded: 0,
            totalLinesRemoved: 0,
            activeUsers: 0
        };
    }
};