<script>
	import {
		LayoutDashboard,
		Settings,
		LifeBuoy,
		Bird,
		Book,
		ArrowRightFromLine,
		ArrowLeftFromLine,
		House
	} from 'svelte-lucide';
	import { fade } from 'svelte/transition';

	// Use $state() for local component state instead of writable stores
	let sidebarExpanded = $state(true);
	let showVersion = $state(true);
	let versionTimeout;

	// Function to toggle sidebar
	function toggleSidebar() {
		if (!sidebarExpanded) {
			// About to expand: delay showing version
			versionTimeout = setTimeout(() => {
				showVersion = true;
			}, 200);
		} else {
			// About to collapse: hide version immediately
			showVersion = false;
			if (versionTimeout) clearTimeout(versionTimeout);
		}
		sidebarExpanded = !sidebarExpanded;
	}

	const menuItems = [
		{ name: 'Home', icon: House, href: '/', color: 'blue', hoverColor: 'var(--color-blue)' },
		{
			name: 'Deploy',
			icon: LayoutDashboard,
			href: '/deploy',
			color: 'mauve',
			hoverColor: 'var(--color-mauve)'
		},
		{ name: 'Status', icon: Bird, href: '/status', color: 'pink', hoverColor: 'var(--color-pink)' },
		{
			name: 'Settings',
			icon: Settings,
			href: '/settings',
			color: 'yellow',
			hoverColor: 'var(--color-yellow)'
		},
		{ name: 'Docs', icon: Book, href: '/docs', color: 'green', hoverColor: 'var(--color-green)' }
	];
</script>

<aside
	class="{sidebarExpanded
		? 'w-44'
		: 'w-16'} border-r border-[var(--color-surface1)]/30 p-4 flex flex-col duration-300 transition-all relative filter"
>
	<div class="flex justify-end mb-6">
		<button
			onclick={toggleSidebar}
			class="p-2 rounded-lg border-2 border-[var(--color-surface1)] hover:bg-[var(--color-surface1)]/5 transition-all duration-300 focus-ring group"
			style="background: rgba(49, 50, 68, 0.02);"
			aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
		>
			{#if sidebarExpanded}
				<ArrowLeftFromLine
					size={18}
					class="text-[var(--color-subtext0)] group-hover:text-[var(--color-blue)] transition-colors"
				/>
			{:else}
				<ArrowRightFromLine
					size={18}
					class="text-[var(--color-subtext0)] group-hover:text-[var(--color-blue)] transition-colors"
				/>
			{/if}
		</button>
	</div>

	<nav class="flex-grow">
		<ul class="space-y-2">
			{#each menuItems as item}
				<li>
					<a
						href={item.href}
						class="flex items-center gap-3 p-3 rounded-lg text-[var(--color-subtext0)]
                               hover:bg-[var(--color-surface1)]/5 hover:text-[var(--color-text)]
                               transition-all duration-300 group relative
                               {sidebarExpanded ? '' : 'justify-center'}"
						style="--hover-color: {item.hoverColor};"
					>
						<div
							class="w-5 h-5 flex items-center justify-center flex-shrink-0 relative z-10 group-hover:scale-105 transition-transform duration-300"
						>
							{@render item.icon({
								size: 18,
								class: 'transition-colors duration-300 group-hover:text-[color:var(--hover-color)]'
							})}
						</div>
						{#if sidebarExpanded}
							<span class="relative z-10 font-medium text-sm">{item.name}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	{#if sidebarExpanded && showVersion}
		<div
			class="text-center text-xs text-[var(--color-subtext0)] filter border-2 border-[var(--color-surface1)] p-3 rounded-lg"
			style="filter"
			transition:fade={{ duration: 300 }}
		>
			<div class="flex items-center justify-center gap-2 mb-1">
				<div class="w-1.5 h-1.5 bg-[var(--color-green)] rounded-full animate-pulse"></div>
				<span class="text-xs">SYSTEM</span>
			</div>
			<p class="text-xs">v1.0.0</p>
		</div>
	{/if}
</aside>
