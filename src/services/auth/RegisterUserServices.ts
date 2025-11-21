import { useFetch } from "../hooks/useFetch";

class RegisterUserService {

    constructor() { }

    async registerCompanyAndUser(data: any) {

        const dataCompany = {
            type: data.type,
            name: data.name,
            address: data.address,
            phone: data.phone,
            email: data.email,
        };

        console.log("dataCompany", dataCompany);
        

        const dataUser = {
            type: data.type,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            password: data.password,
            confirmPassword: data.confirmPassword,
        };

        const response = await useFetch('/company', {
            method: 'POST',
            body: JSON.stringify(dataCompany)
        });

        console.log(response);
        
        return response;
    }
}

export const registerUserService = new RegisterUserService();
