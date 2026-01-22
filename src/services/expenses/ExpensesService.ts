import type { ExpenseFormData } from "@/modules/expenses/schemas/schemaExpenses";
import { useFetch } from "../hooks/useFetch";


class ExpensesService {

    async getConcepts() {
        const resp = await useFetch('/concepts/', { method: 'GET' });
        return resp;
    }

    async getConceptsSelect(projectId: string) {
        const resp = await useFetch(`/concepts/project/${projectId}?select=true`, { method: 'GET' });
        return resp;
    }

    async saveExpense(data: ExpenseFormData, id?: number | undefined) {
        const resp = await useFetch(id ? `expenese/${id}` : '/expenses', {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(data)
        })
        return resp;
    }

    async getExpenses() {
        // Implementation for fetching expenses
    }

}

export const expensesService = new ExpensesService();