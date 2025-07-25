import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { applications } from '$lib/stores.js';

export async function load({ params }) {
	const { appId } = params;

	// Get the application data from the store
	const apps = get(applications);
	const app = apps.find((a) => a.id === appId);

	if (!app) {
		throw error(404, 'Application not found');
	}

	return {
		app
	};
}
