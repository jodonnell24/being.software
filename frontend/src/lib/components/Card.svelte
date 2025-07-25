<script>
	import { goto } from '$app/navigation';

	let { app } = $props();

	// Ensure color is always available on initial render
	const iconColor = $derived(app.color || 'text-[var(--color-text)]');

	function handleDeploy() {
		// Navigate to the deployment configuration page
		goto(`/deploy/${app.id}`);
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
		rel="stylesheet"
	/>
	<link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet" />
</svelte:head>

<div
	class="filter border-2 border-[var(--color-surface1)] rounded-xl p-6 flex flex-col justify-between hover:bg-[var(--color-surface1)]/5 hover:border-[var(--color-blue)] hover:shadow-xl hover:shadow-[var(--color-blue)]/30 transition-all duration-300 group relative"
	style="background: rgba(49, 50, 68, 0.2);"
>
	<div>
		<div class="flex items-center gap-4 mb-4">
			<div class="relative">
				<app.icon size={28} class="{iconColor} transition-all duration-300 group-hover:scale-105" />
			</div>

			<h3 class="text-xl font-bold text-[var(--color-text)]">{app.name}</h3>
		</div>

		<p class="text-[var(--color-subtext0)] mb-6 leading-relaxed text-sm">{app.description}</p>
	</div>

	<div class="flex justify-between items-center">
		<span
			class="text-xs font-mono px-3 py-1.5 rounded-full backdrop-blur-sm border border-[var(--color-surface2)]/50 text-[var(--color-subtext1)]
			{app.status === 'Deployed'
				? 'border-[var(--color-green)]/40 text-[var(--color-green)] bg-[var(--color-green)]/5'
				: app.status === 'Deploying'
					? 'border-[var(--color-yellow)]/40 text-[var(--color-yellow)] bg-[var(--color-yellow)]/5'
					: 'border-[var(--color-overlay2)]/20'}"
			style="background: rgba(49, 50, 68, 0.02);"
		>
			{app.status}
		</span>
		<button
			onclick={handleDeploy}
			class="bg-[var(--color-lavender)] text-[var(--color-base)] font-medium py-2 px-5 rounded-lg
			hover:bg-[var(--color-mauve)] transition-all duration-300
			focus-ring shine-button relative overflow-hidden"
		>
			Deploy
		</button>
	</div>
</div>

<style>
	:global(.filter) {
		backdrop-filter: blur(2.5px);
		backdrop-filter: brightness(0.82);
		transition: backdrop-filter 0.3s ease-in-out;
	}

	/* A subtle shine effect on hover for the CTA button */
	.shine-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: all 0.6s;
	}

	.shine-button:hover::before {
		left: 100%;
	}
</style>
