import type { Location } from '$lib/types/geo';

export class GeoController {
	async Fetch(ip?: string): Promise<Location> {
		let location = {} as Location;

		const url = ip ? `https://get.geojs.io/v1/ip/geo/${ip}.json` : 'https://get.geojs.io/v1/ip/geo.json';
		const response = await fetch(url);
		const data = await response.json();

		if (data && data.latitude && data.longitude) {
			location = {
				city: data.city || 'Unknown',
				region: data.region || '',
				country: data.country || 'Unknown',
				latitude: parseFloat(data.latitude),
				longitude: parseFloat(data.longitude),
				timezone: data.timezone || 'UTC'
			};
		}
		return location;
	}
}
