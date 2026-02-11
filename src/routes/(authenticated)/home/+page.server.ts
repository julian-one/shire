import type { PageServerLoad } from './$types';
import { AlertStore } from '$root/lib/stores/alert.svelte';
import { GeoController } from '$lib/controllers/geo';
import { MeteoController } from '$lib/controllers/meteo';
import type { Location } from '$lib/types/geo';
import type { Weather } from '$lib/types/meteo';

export const load: PageServerLoad = async () => {
	let location: Location | null = null;
	let weather: Weather | null = null;

	const geo_controller = new GeoController();
	try {
		location = await geo_controller.Fetch();
	} catch {
		AlertStore.add('Failed to fetch location', 'error');
	}

	const meteo_controller = new MeteoController();
	try {
		if (location) {
			weather = await meteo_controller.Fetch(location.latitude, location.longitude);
		}
	} catch {
		AlertStore.add('Failed to fetch weather', 'error');
	}

	return {
		location,
		weather
	};
};
