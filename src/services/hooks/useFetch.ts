

export const useFetch = async (path: string, options: RequestInit = {}) => {
    const token = import.meta.env.VITE_URL_TOKEN || '';
    const apiUrl = import.meta.env.VITE_URL_API;
    try {
        const response = await fetch(`${apiUrl}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...(options.headers || {})
            },
             credentials: 'include',
        });

        const data = await response.json();
        if (response.status === 401) {
            window.dispatchEvent(new Event("unauthorized"));
        }
        return data;

    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};