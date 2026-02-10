import { AsyncLocalStorage } from 'node:async_hooks';

export const CitadelContext = new AsyncLocalStorage<string | undefined>();
