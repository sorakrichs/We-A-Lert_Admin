import client from '../client';

const changeUserStatusController = async (id,status) => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.post("/member/status/"+id,{status: status}, {
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

export default changeUserStatusController;