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
            const resp = await response.json();
            console.log(resp);


            if (resp.statusCode === 200) {
                return {
                    isAuthenticated: true,
                    message: 'Login successful',
                    user: resp.data.user
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
            const resp = await response.json();

            if (resp.statusCode === 200) {
                return {
                    isAuthenticated: true,
                    message: 'Login successful',
                    user: resp.data.user
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

    async logout() {
        try {
            const response = await fetch(`${this.apiUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const resp = await response.json();
            return resp;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Unknown error during logout');
        }
    }
}

export const authService = new AuthService();