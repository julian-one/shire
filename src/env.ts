import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	MORIA_URL: {
		public: true,
		description: 'Base URL of the moria backend, called from the browser.'
	}
});
