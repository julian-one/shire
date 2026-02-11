export function toShortTimezone(timezone: string): string {
	return (
		new Intl.DateTimeFormat('en-US', {
			timeZone: timezone,
			timeZoneName: 'short'
		})
			.formatToParts(new Date())
			.find((part) => part.type === 'timeZoneName')?.value || ''
	);
}
