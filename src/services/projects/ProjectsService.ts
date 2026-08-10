import type { ProjectsFormData } from "@/modules/projects/schemas/schemaProject";
import { useFetch } from "../hooks/useFetch";

class ProjectsService {
    saveProject(data: ProjectsFormData, id?: number | undefined) {
        const resp = useFetch(id ? `/projects/${id}` : '/projects', {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(data),
        });
        return resp;
    }

    async getProjects(type: string) {
        const resp = await useFetch(`/projects/type/${type}`, {
            method: 'GET',
        });
        return resp;
    }

    async getTotalProjects() {
        const resp = await useFetch(`/projects/totals`, {
            method: 'GET',
        });
        return resp;
    }

    async getAllProjects() {
        const resp = await useFetch(`/projects`, {
            method: 'GET',
        });
        return resp;
    }

    async getAllTotals(query: string) {
        console.log("getAllTotals query", query);
        
        const resp = await useFetch(`/projects/totals-expenses-incomes?${query}`, {
            method: 'GET',
        });
        return resp;
    }

    async deleteProject(id: number) {
        const resp = await useFetch(`/projects/${id}`, {
            method: 'DELETE',
        });
        return resp;
    }


}

export const projectsService = new ProjectsService();