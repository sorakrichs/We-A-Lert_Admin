import client from '../client';

const getUserListController = async (id='') => {
    
    try {

        if(id) {
            let res = await client.get("/member/image/"+id, {
                timeout: 5000,
                headers: { 
                    "Content-Type": "application/json"
                }
            

            }).then((r) => r).catch((err) => {throw err;});

            return res.data;
        } else {
            return null;
        }
        

    } catch (err) {

        throw err;

    }

}

export default getUserListController;