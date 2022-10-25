import client from '../client';

const loginController = async (username='',password='') => {
    
    try {

            
            let res = await client.post("/admin/login",{usernameorphone: username, password: password}, {
                timeout: 5000,
                headers: { 
                    "Content-Type": "application/json"
                }
            

            }).then((r) => r).catch((err) => {throw err;});

            return res.data;
        

    } catch (err) {

        throw err;

    }

}

export default loginController;