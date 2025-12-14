import type { LoginCredentials } from "@/app/store/appStore";

class AuthService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_URL_API || 'https://default-api.example.com';
    }

    async login(credentials: LoginCredentials) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });
            const data = await response.json();

            if (data.statusCode === 200) {
                return {
                    isAuthenticated: true,
                    message: 'Login successful',
                    token: data.accessToken,
                    user: data.user
                };
            }

            return {
                isAuthenticated: false,
                message: 'Login failed, verify your credentials'
            };

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Unknown error during login');
        }
    }

    async validateSession() {
        try {
            const response = await fetch(`${this.apiUrl}/auth/validate-session`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            console.log(data);
            
            if (data.statusCode === 200) {
                return {
                    isAuthenticated: true,
                    message: 'Login successful',
                    token: data.accessToken,
                    user: data.user
                };
            }
            return {
                isAuthenticated: false,
                message: 'Login failed, verify your credentials'
            };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Unknown error during session validation');
        }
    }
}

export const authService = new AuthService();