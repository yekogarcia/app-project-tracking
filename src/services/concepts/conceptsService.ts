import type { ConceptFormData } from "@/modules/concepts/schemas/schemaConcepts";
import { useFetch } from "../hooks/useFetch";

class ConceptsService {
    async getConcepts() {
        const resp = await useFetch('/concepts', {
            method: 'GET',
        });
        return resp;
    }

    async saveConcept(data: ConceptFormData, id?: number) {
        const url = id ? `/concepts/${id}` : '/concepts';
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

    async deleteConcept(id: number) {
        const resp = await useFetch(`/concepts/${id}`, {
            method: 'DELETE',
        });
        return resp;
    }
}

export const conceptsService = new ConceptsService();