import client from '../client';

const changeVolunteerReportController = async (id,volunteerid) => {
    
    try {

            let token = sessionStorage.getItem('@token');
            let res = await client.post("/report/volunteer/"+id,{id: volunteerid}, {
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

export default changeVolunteerReportController;