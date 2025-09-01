import { createClient } from '@supabase/supabase-js';

export class AuthManager {
    constructor() {
        this.supabase = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
        );
        this.currentUser = null;
    }

    async init() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const user = this.parseJWT(token);
                if (user && user.exp * 1000 > Date.now()) {
                    this.currentUser = user;
                }
            } catch (error) {
                localStorage.removeItem('auth_token');
            }
        }
    }

    async login(employeeId, password, role) {
        try {
            const response = await fetch(`/api/auth/${role.toLowerCase()}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeId, password }),
            });

            const data = await response.json();

            if (data.success) {
                const token = data.data.token;
                localStorage.setItem('auth_token', token);
                this.currentUser = this.parseJWT(token);
                
                document.dispatchEvent(new CustomEvent('auth-changed', {
                    detail: { user: this.currentUser }
                }));

                return { success: true, user: this.currentUser };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.currentUser = null;
        document.dispatchEvent(new CustomEvent('auth-changed', {
            detail: { user: null }
        }));
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    parseJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    }
}