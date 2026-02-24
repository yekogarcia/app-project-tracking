import { useFetch } from "../hooks/useFetch";

class ProfileService {

    async validatePassword(email: string, password: string) {
        const apiUrl = import.meta.env.VITE_URL_API;
        const resp = await fetch(`${apiUrl}/auth/validate-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await resp.json();
        return data;
    }

    async updateProfile(data: any) {
        const resp = useFetch('/company/profile', {
            method: 'PATCH',
            body: JSON.stringify(data)
        });

        return resp;
    }
}

export const profileService = new ProfileService();