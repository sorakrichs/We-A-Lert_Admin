import client from '../client';

const getMemberListController = async () => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.get("/member/list", {
                timeout: 10000,
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

export default getMemberListController;