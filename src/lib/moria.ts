import axios from 'axios';
import { MORIA_URL } from '$app/env/public';

const Moria = axios.create({
	baseURL: MORIA_URL,
	withCredentials: true
});

export default Moria;
