import type { Location } from '$lib/types/geo';

export class GeoController {
	async Fetch(ip?: string): Promise<Location | null> {
		const url = ip ? `https://get.geojs.io/v1/ip/geo/${ip}.json` : 'https://get.geojs.io/v1/ip/geo.json';
		const response = await fetch(url);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		const latitude = parseFloat(data?.latitude);
		const longitude = parseFloat(data?.longitude);

		if (isNaN(latitude) || isNaN(longitude)) {
			return null;
		}

		return {
			city: data.city || 'Unknown',
			region: data.region || '',
			country: data.country || 'Unknown',
			latitude,
			longitude,
			timezone: data.timezone || 'UTC'
		};
	}
}
