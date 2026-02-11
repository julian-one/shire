import type { Location } from '$lib/types/geo';

export class GeoController {
	async Fetch(): Promise<Location> {
		let location = {} as Location;

		const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
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
