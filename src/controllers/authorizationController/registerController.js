import client from '../client';

const registerController = async (data) => {
    
    try {

            
            let res = await client.post("/admin/register",data, {
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

export default registerController;