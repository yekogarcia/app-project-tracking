import type { ExpenseFormData } from "@/modules/expenses/schemas/schemaExpenses";
import { useFetch } from "../hooks/useFetch";


class ExpensesService {

    async getConcepts() {
        const resp = await useFetch('/concepts/', { method: 'GET' });
        return resp;
    }

    async getConceptsSelect(projectId: number) {
        const resp = await useFetch(`/concepts/project/${projectId}?select=true`, { method: 'GET' });
        return resp;
    }

    async getExpenses() {
        const resp = await useFetch('/expenses', { method: 'GET' })
        return resp;
    }

    async saveExpense(data: ExpenseFormData, id?: number | undefined) {
        const resp = await useFetch(id ? `/expenses/${id}` : '/expenses', {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(data)
        })
        return resp;
    }

    async deleteExpense(id: number) {
        return await useFetch(`/expenses/${id}`, {
            method: 'DELETE'
        }); 
    } 


}

export const expensesService = new ExpensesService();