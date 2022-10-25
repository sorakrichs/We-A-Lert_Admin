import client from '../client';

const getUserAddressController = async (id='') => {
    
    try {

            
            let res = await client.get("/member/address/"+id, {
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

export default getUserAddressController;