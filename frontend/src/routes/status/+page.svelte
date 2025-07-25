<script>
	import { fetchBackendStatus } from '$lib/api.js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let backendStatus = $state(null);
	let error = $state(null);
	let isLoading = $state(true);

	$effect(() => {
		async function loadStatus() {
			try {
				isLoading = true;
				backendStatus = await fetchBackendStatus();
			} catch (e) {
				error = e.message;
			} finally {
				isLoading = false;
			}
		}

		loadStatus();
	});
</script>

<div class="filter border-[var(--color-surface1)] rounded-lg p-6 max-w-md mx-auto mt-8">
	<h2 class="text-xl font-bold mb-2 text-[var(--color-text)]">Backend Status</h2>

	{#if isLoading}
		<div class="flex items-center justify-center py-8">
			<LoadingSpinner size="lg" color="text-[var(--color-blue)]" />
		</div>
	{:else if error}
		<div class="text-[var(--color-red)] p-4 bg-[var(--color-red)]/10 rounded-lg">
			<strong>Error:</strong>
			{error}
		</div>
	{:else if backendStatus}
		<div class="flex flex-col gap-3">
			<div
				class="flex justify-between items-center p-3 bg-[var(--color-surface0)]/50 filter rounded-lg"
			>
				<span class="text-xs text-[var(--color-subtext0)]">Server:</span>
				<span class="font-bold text-[var(--color-text)]">{backendStatus.server_status}</span>
			</div>
			<div
				class="flex justify-between items-center p-3 filter bg-[var(--color-surface0)]/50 rounded-lg"
			>
				<span class="text-xs text-[var(--color-subtext0)]">Docker API Version:</span>
				<span class="text-[var(--color-text)]">{backendStatus.docker_api_version}</span>
			</div>
			<div
				class="flex justify-between items-center p-3 filter bg-[var(--color-surface0)]/50 rounded-lg"
			>
				<span class="text-xs text-[var(--color-subtext0)]">Docker OK:</span>
				<span
					class={backendStatus.docker_ok ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'}
				>
					{backendStatus.docker_ok ? 'Yes' : 'No'}
				</span>
			</div>
		</div>
	{/if}
</div>
