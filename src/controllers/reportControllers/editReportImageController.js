import client from '../client';

const editReportImageController = async (id,images) => {
    
    try {

            let token = sessionStorage.getItem('@token');
            const data = new FormData();

            await Promise.all(
                images.map((image) => {

                    if(image?.id)
                        data.append('oldfiles',image.id)
                    else
                        data.append('files',image)


                    return null;
                })

            )

            let res = await client.post("/report/images/"+id,data,{
                timeout: 5000,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            

            }).then((r) => r).catch((err) => {throw err;});

            return res.data;
        

    } catch (err) {

        throw err;

    }

}

export default editReportImageController;