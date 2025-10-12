// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    ENDPOINTS: {
        VEHICLES: {
            SEARCH: '/vehicles/search',
            BY_ID: '/vehicles',
            CREATE: '/vehicles/create',
            UPDATE: '/vehicles',
            DELETE: '/vehicles'
        },
        USERS: {
            BASE: '/users'
        },
        BOOKINGS: {
            BASE: '/bookings',
            CHECK_AVAILABILITY: '/bookings/check-availability',
            BY_ID: '/bookings'
        }
    }
} as const;

// Helper function to build complete API URLs with optional query parameters
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number | undefined>): string => {
    const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    if (!params) {
        return baseUrl;
    }
    
    // Filter out undefined/empty values and build query string
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
        }
    });
    
    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Export the base URL for backwards compatibility
export const API_BASE_URL = API_CONFIG.BASE_URL;