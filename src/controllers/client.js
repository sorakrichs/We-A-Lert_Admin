import axios from 'axios';

const client = axios.create({baseURL:'http://localhost:8080'});
//const client = axios.create({baseURL:'https://we-alert-344910.et.r.appspot.com'});
export default client;