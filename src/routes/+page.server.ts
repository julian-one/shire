import type { PageServerLoad } from './$types';
import { GeoController } from '$lib/controllers/geo';
import { MeteoController } from '$lib/controllers/meteo';

function isPrivateIp(ip: string): boolean {
	return (
		ip === '127.0.0.1' ||
		ip === '::1' ||
		ip.startsWith('10.') ||
		ip.startsWith('192.168.') ||
		/^172\.(1[6-9]|2\d|3[01])\./.test(ip)
	);
}

export const load: PageServerLoad = async (event) => {
	const geo_controller = new GeoController();
	const meteo_controller = new MeteoController();

	const clientIp = event.getClientAddress();
	const locationPromise = geo_controller.Fetch(isPrivateIp(clientIp) ? undefined : clientIp).catch(() => null);

	const weatherPromise = locationPromise.then(async (location) => {
		if (location) {
			return await meteo_controller.Fetch(location.latitude, location.longitude).catch(() => null);
		}
		return null;
	});

	return {
		location: locationPromise,
		weather: weatherPromise
	};
};
