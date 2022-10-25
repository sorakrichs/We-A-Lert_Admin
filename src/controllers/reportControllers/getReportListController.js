import client from '../client';

const getReportListController = async () => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.get("/report/list", {
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

export default getReportListController;