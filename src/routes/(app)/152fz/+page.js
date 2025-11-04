import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load() {
	// Редирект со старого URL на новый
	throw redirect(301, '/privacy-policy');
}
