<script>
	import { onMount, onDestroy } from 'svelte';
	import { errorHandler } from '$lib/errorHandler.js';
	import Alert from './Alert.svelte';
	import { theme } from '$lib/theme.js';

	let {
		position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center'
		maxErrors = 5,
		className = ''
	} = $props();

	let errors = $state([]);
	let unsubscribe;

	const positionClasses = {
		'top-right': 'fixed top-4 right-4 z-50',
		'top-left': 'fixed top-4 left-4 z-50',
		'bottom-right': 'fixed bottom-4 right-4 z-50',
		'bottom-left': 'fixed bottom-4 left-4 z-50',
		'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50'
	};

	onMount(() => {
		unsubscribe = errorHandler.subscribe((newErrors) => {
			errors = newErrors.slice(0, maxErrors);
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	function dismissError(errorId) {
		errorHandler.dismissError(errorId);
	}
</script>

<div class="{positionClasses[position]} {className}">
	<div class="space-y-3 max-w-sm">
		{#each errors as error (error.id)}
			<div
				class="{theme.animations.transition} transform transition-all duration-300 ease-in-out"
				role="alert"
				aria-live="polite"
			>
				<Alert
					variant={error.variant}
					title={error.title}
					dismissible={true}
					onDismiss={() => dismissError(error.id)}
					class="shadow-lg"
				>
					<div class="space-y-2">
						<p class="text-sm">{error.message}</p>

						{#if error.details}
							<details class="text-xs">
								<summary
									class="cursor-pointer {theme.components.text.muted} hover:{theme.components.text
										.body}"
								>
									Show details
								</summary>
								<div
									class="mt-2 p-2 bg-[var(--color-surface1)] rounded text-xs {theme.components.text
										.muted}"
								>
									<pre class="whitespace-pre-wrap">{error.details}</pre>
								</div>
							</details>
						{/if}

						<!-- Show timestamp for debugging -->
						{#if error.timestamp}
							<div class="text-xs {theme.components.text.caption}">
								{new Date(error.timestamp).toLocaleTimeString()}
							</div>
						{/if}
					</div>
				</Alert>
			</div>
		{/each}
	</div>
</div>
