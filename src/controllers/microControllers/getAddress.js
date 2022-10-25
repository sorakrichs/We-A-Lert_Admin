import client from '../client';

const getAddress = async (location) => {
    
    try {

        const res = await client.get(`https://api.longdo.com/map/services/address?`, {
            params: {
                key: "0ba75287512b12f50f558308fb6c720c",
                lon: location.lon,
                lat: location.lat
            },
        });
       
          
          return res.data;
        

    } catch (err) {

        throw err;

    }

}

export default getAddress;