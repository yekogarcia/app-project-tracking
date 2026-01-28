import { useFetch } from "../hooks/useFetch";

class IncomesServices {

    async getIncomes() {
        const resp = await useFetch('/incomes', {
            method: 'GET',
        });
        return resp;
    }
    async saveIncome(data: any, id?: any) {
        const url = id ? `/incomes/${id}` : '/incomes';
        const method = id ? 'PUT' : 'POST';

        const resp = await useFetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        return resp;
    }

    async deleteIncome(id: any) {
        const resp = await useFetch(`/incomes/${id}`, {
            method: 'DELETE',
        });
        return resp;
    }
}

export const incomesService = new IncomesServices();