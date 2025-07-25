<script>
	import { Github } from 'svelte-lucide';
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
		rel="stylesheet"
	/>
	<link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
</svelte:head>

<header
	class="filter border-b border-[var(--color-surface1)]/50 p-4 flex justify-between items-center relative z-50"
>
	<div class="flex items-center gap-3">
		<div class="relative">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="text-[var(--color-blue)] transition-all duration-300 hover:scale-110"
			>
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
			</svg>
		</div>
		<h1 class="text-2xl text-[var(--color-text)]" style:font-family="'DotGothic16', monospace">
			being.software
		</h1>

		<!-- Status indicator -->
		<div class="flex items-center gap-2 ml-4">
			<div class="w-2 h-2 bg-[var(--color-green)] rounded-full animate-pulse"></div>
			<span class="text-xs text-[var(--color-subtext1)] tracking-wider">ONLINE</span>
		</div>
	</div>

	<div class="flex items-center gap-4">
		<a
			href="https://github.com/your-username/your-repo"
			target="_blank"
			rel="noopener noreferrer"
			class="text-[var(--color-subtext0)] hover:text-[var(--color-blue)] transition-all duration-300 p-2 rounded-lg bg-[var(--color-surface0)]/50 border border-[var(--color-surface1)] hover:bg-[var(--color-surface1)]/50 group focus-ring"
		>
			<Github class="transition-transform duration-300 group-hover:scale-110" />
		</a>
	</div>
</header>
