import type { PageServerLoad } from './$types';
import { GeoController } from '$lib/controllers/geo';
import { MeteoController } from '$lib/controllers/meteo';

export const load: PageServerLoad = async (event) => {
	const geo_controller = new GeoController();
	const meteo_controller = new MeteoController();

	const clientIp = event.getClientAddress();
	const locationPromise = geo_controller.Fetch(clientIp).catch(() => null);

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
