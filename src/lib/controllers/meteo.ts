import type { Weather } from '$lib/types/meteo';

export class MeteoController {
	private get_icon(code: number): string {
		const icon_map: Record<number, string> = {
			0: '☀️', // Clear sky
			1: '🌤️', // Mainly clear
			2: '⛅', // Partly cloudy
			3: '☁️', // Overcast
			45: '🌫️', // Fog
			48: '🌫️', // Depositing rhyme fog
			51: '🌦️', // Light drizzle
			53: '🌦️', // Moderate drizzle
			55: '🌧️', // Dense drizzle
			61: '🌧️', // Slight rain
			63: '🌧️', // Moderate rain
			65: '🌧️', // Heavy rain
			71: '🌨️', // Slight snow
			73: '🌨️', // Moderate snow
			75: '🌨️', // Heavy snow
			77: '🌨️', // Snow grains
			80: '🌦️', // Slight rain showers
			81: '🌧️', // Moderate rain showers
			82: '🌧️', // Violent rain showers
			85: '🌨️', // Slight snow showers
			86: '🌨️', // Heavy snow showers
			95: '⛈️', // Thunderstorm
			96: '⛈️', // Thunderstorm with slight hail
			99: '⛈️' // Thunderstorm with heavy hail
		};
		return icon_map[code] || '🌡️';
	}
	private get_condition(code: number): string {
		const desc_map: Record<number, string> = {
			0: 'Clear',
			1: 'Mostly Clear',
			2: 'Partly Cloudy',
			3: 'Cloudy',
			45: 'Foggy',
			48: 'Foggy',
			51: 'Light Drizzle',
			53: 'Drizzle',
			55: 'Heavy Drizzle',
			61: 'Light Rain',
			63: 'Rain',
			65: 'Heavy Rain',
			71: 'Light Snow',
			73: 'Snow',
			75: 'Heavy Snow',
			77: 'Snow',
			80: 'Light Showers',
			81: 'Showers',
			82: 'Heavy Showers',
			85: 'Snow Showers',
			86: 'Heavy Snow',
			95: 'Thunderstorm',
			96: 'Thunderstorm',
			99: 'Severe Storm'
		};
		return desc_map[code] || 'Unknown';
	}
	async fetch_weather(latitude: number, longitude: number): Promise<Weather | null> {
		const response = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();

		if (!data.current) {
			return null;
		}

		return {
			temperature: Math.round(data.current.temperature_2m),
			condition: this.get_condition(data.current.weather_code),
			icon: this.get_icon(data.current.weather_code)
		};
	}
}
