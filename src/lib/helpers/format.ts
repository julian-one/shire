// Moria timestamps are RFC3339 UTC; render them fixed-format so server and
// client markup match regardless of viewer locale.
export function format_timestamp(value: string) {
	return value.replace('T', ' ').slice(0, 19);
}
