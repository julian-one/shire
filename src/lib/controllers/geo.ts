import type { Location } from '$lib/types/geo';

export class GeoController {
	private isPublicIp(ip: string): boolean {
		return !(
			ip === '127.0.0.1' ||
			ip === '::1' ||
			ip.startsWith('10.') ||
			ip.startsWith('192.168.') ||
			/^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
			ip.startsWith('fe80:') ||
			ip.startsWith('fc') ||
			ip.startsWith('fd')
		);
	}

	async Fetch(ip?: string): Promise<Location | null> {
		const useIp = ip && this.isPublicIp(ip);
		const url = useIp ? `https://get.geojs.io/v1/ip/geo/${ip}.json` : 'https://get.geojs.io/v1/ip/geo.json';
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
