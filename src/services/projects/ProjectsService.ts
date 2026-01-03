import type { ProjectsFormData } from "@/modules/projects/schemas/schemaProject";
import { useFetch } from "../hooks/useFetch";

class ProjectsService {
    saveProject(data: ProjectsFormData) {
        const resp = useFetch('/projects', {
            method: 'POST',
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


}

export const projectsService = new ProjectsService();