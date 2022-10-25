import client from '../client';

const getLogController = async (username='',password='') => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.get("/admin/log", {
                timeout: 5000,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            

            }).then((r) => r).catch((err) => {throw err;});

            return res.data;
        

    } catch (err) {

        throw err;

    }

}

export default getLogController;