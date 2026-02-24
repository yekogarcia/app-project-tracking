import { useFetch } from "../hooks/useFetch";

class RegisterUserService {

    constructor() { }

    async registerCompanyAndUser(data: any) {
        console.log("registerCompanyAndUser", data);
        
        delete data.confirmPassword;
        const resp = await useFetch('/company/preregister', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        return resp;
    }
}

export const registerUserService = new RegisterUserService();
