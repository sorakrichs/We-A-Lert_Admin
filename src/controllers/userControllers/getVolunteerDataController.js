import client from '../client';

const getVolunteerDataController = async (id) => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.get(`/volunteer/data/${id}`, {
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

export default getVolunteerDataController;