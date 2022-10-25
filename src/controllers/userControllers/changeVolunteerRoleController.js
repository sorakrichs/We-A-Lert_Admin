import client from '../client';

const changeVolunteerRoleController = async (id,role) => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.post("/admin/role/"+id,{role: role}, {
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

export default changeVolunteerRoleController;