
import jwtDecode from 'jwt-decode';

const checkSessionExpire = (token) => {
    
    try {

        if(!token) return false;
        const decoded = jwtDecode(token);
        let expired_date = new Date(decoded.iat);
        expired_date.setHours(expired_date.getHours() + 1);
        let date_now = new Date();

        if(date_now.getTime() <= expired_date.getTime())
        {
            return true;

        } else {

            sessionStorage.removeItem('@token');
            return false;
        }



        

    } catch (err) {

        throw err;

    }

}

export default checkSessionExpire;