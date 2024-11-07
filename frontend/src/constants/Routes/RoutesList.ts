/**
 * Application route definitions
 * Centralized routing configuration for the entire application
 */
const RoutesList = {
    /** Home page route */
    home: '/',
    
    /** Authentication related routes */
    auth: {
        /** Login page route */
        login: '/login',
        /** Signup page route */
        signup: '/signup',
        /** Logout action route */
        logout: '/logout'
    },
    
    /** Settings related routes */
    settings: {
        /** Base settings page */
        base: '/settings',
        /** Security settings page */
        security: '/settings/security',
        /** Profile settings page */
        profile: '/settings/profile',
        /** Notification settings page */
        notifications: '/settings/notifications'
    },
    
    /** Profile related routes */
    profile: {
        /** Base profile page */
        base: '/profile',
        /** Get profile page URL for specific user
         * @param id - User ID
         * @returns Profile page URL
         */
        view: (id: string) => `/profile/${id}`,
        /** Get profile edit page URL for specific user
         * @param id - User ID
         * @returns Profile edit page URL
         */
        edit: (id: string) => `/profile/${id}/edit`
    },
    
    /** Chat related routes */
    chat: {
        /** Base chat page */
        base: '/chat',
        /** Get specific conversation URL
         * @param id - Conversation ID
         * @returns Conversation page URL
         */
        conversation: (id: string) => `/chat/${id}`,
        /** New conversation page */
        new: '/chat/new'
    },
    
    /** Explore page route */
    explore: '/explore'
} as const;

export default RoutesList;