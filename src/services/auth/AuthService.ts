class AuthService {
    private token: string;
    private apiUrl: string;
    
    constructor() {
        this.token = import.meta.env.VITE_URL_TOKEN || '';
        this.apiUrl = import.meta.env.VITE_URL_API || 'https://default-api.example.com';
    }
    
    async login(email: string, password: string) {
        const response = await fetch(`${this.apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return data;
    }
}

export const authService = new AuthService();