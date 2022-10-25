import client from '../client';

const changeReportAddressContoller = async (id,address) => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.post("/report/address/"+id, address,{
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

export default changeReportAddressContoller;