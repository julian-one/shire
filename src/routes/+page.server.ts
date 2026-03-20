import type { PageServerLoad } from './$types';
import { GeoController } from '$lib/controllers/geo';
import { MeteoController } from '$lib/controllers/meteo';

export const load: PageServerLoad = async (event) => {
	const geo_controller = new GeoController();
	const meteo_controller = new MeteoController();

	const client_ip = event.getClientAddress();
	const location_promise = geo_controller.fetch_location(client_ip).catch(() => null);

	const weather_promise = location_promise.then(async (location) => {
		if (location) {
			return await meteo_controller.fetch_weather(location.latitude, location.longitude).catch(() => null);
		}
		return null;
	});

	return {
		location: location_promise,
		weather: weather_promise
	};
};
