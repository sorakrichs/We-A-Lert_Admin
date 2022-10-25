import client from '../client';

const changeUserStatusController = async (id,data) => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.post("/member/edit/"+id,data, {
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