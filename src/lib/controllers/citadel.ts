import { env } from '$env/dynamic/public';
import axios from 'axios';

export const Citadel = axios.create({
	baseURL: env.PUBLIC_CITADEL_API_URL ?? 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json',
		'Cache-Control': 'no-cache',
		Accept: '*/*'
	},
	withCredentials: true,
	paramsSerializer: {
		indexes: null
	}
});
