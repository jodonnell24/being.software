<script>
	import { onMount } from 'svelte';
	import { applications } from '$lib/stores.js';
	import Card from '$lib/components/Card.svelte';

	// Ensure applications are loaded
	let appsLoaded = $state(false);

	onMount(() => {
		// Wait for next tick to ensure store is properly initialized
		setTimeout(() => {
			appsLoaded = true;
		}, 0);
	});
</script>

<svelte:head>
	<title>Dashboard | FOSS Platform</title>
	<meta
		name="description"
		content="Your applications dashboard for deploying and managing your FOSS projects."
	/>
	<link rel="stylesheet" href="/src/app.css" />
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#if appsLoaded}
		{#each $applications as app (app.id)}
			<Card {app} />
		{/each}
	{/if}
</div>
