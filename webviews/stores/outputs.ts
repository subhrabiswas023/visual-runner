import { writable, type Writable } from 'svelte/store';
import type { OutputLine } from '../../common/types';

export const outputs = writable<OutputLine[]>([]);
