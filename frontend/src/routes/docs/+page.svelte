<script>
	import {
		Book,
		Zap,
		Shield,
		Globe,
		Terminal,
		Code,
		FileText,
		ExternalLink,
		LifeBuoy
	} from 'svelte-lucide';

	let sections = $state([
		{
			id: 'getting-started',
			title: 'Getting Started',
			icon: Zap,
			color: 'blue',
			items: [
				{ title: 'Quick Start Guide', description: 'Get up and running in minutes' },
				{ title: 'Installation', description: 'Step-by-step installation process' },
				{ title: 'Configuration', description: 'Configure your environment' }
			]
		},
		{
			id: 'deployment',
			title: 'Deployment',
			icon: Globe,
			color: 'mauve',
			items: [
				{ title: 'Deploy Your First App', description: 'Launch your application to the platform' },
				{ title: 'Environment Variables', description: 'Manage configuration and secrets' },
				{ title: 'Custom Domains', description: 'Set up your own domain names' }
			]
		},
		{
			id: 'security',
			title: 'Security',
			icon: Shield,
			color: 'green',
			items: [
				{ title: 'Encryption Guide', description: 'End-to-end encryption implementation' },
				{ title: 'Authentication', description: 'User authentication and authorization' },
				{ title: 'Best Practices', description: 'Security recommendations and guidelines' }
			]
		},
		{
			id: 'api',
			title: 'API Reference',
			icon: Terminal,
			color: 'pink',
			items: [
				{ title: 'REST API', description: 'REST API documentation' },
				{ title: 'Dashboards', description: 'Monitor and manage your applications' },
				{ title: 'Webhooks', description: 'Real-time event notifications' }
			]
		}
	]);

	let quickLinks = $state([
		{ title: 'GitHub Repository', icon: Code, href: 'https://github.com', external: true },
		{ title: 'Changelog', icon: FileText, href: '/changelog', external: false },
		{ title: 'Community', icon: Globe, href: '/community', external: false }
	]);
</script>

<svelte:head>
	<title>Documentation - being.software</title>
	<meta name="description" content="Complete documentation for the being.software platform" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
		rel="stylesheet"
	/>
	<link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet" />
</svelte:head>

<!-- Main Content Grid -->
<div class="grid lg:grid-cols-3 gap-8">
	<!-- Documentation Sections -->
	<div class="lg:col-span-2 space-y-8">
		<!-- Hero Section for Main Content -->
		<div class="px-6 mb-8">
			<div class="flex items-center gap-4 mb-6">
				<div
					class="w-12 h-12 bg-gradient-to-br from-[var(--color-green)] to-[var(--color-teal)] rounded-xl flex items-center justify-center"
				>
					<Book size={24} class="text-[var(--color-base)]" />
				</div>
				<div>
					<h1 class="text-4xl h1 font-bold text-[var(--color-text)] tracking-wider">Documentation</h1>
					<p class="text-[var(--color-subtext0)] text-lg">
						Everything you need to build, deploy, and scale
					</p>
				</div>
			</div>

			<!-- Search Bar -->
			<div class="relative">
				<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
					<svg
						class="h-5 w-5 text-[var(--color-subtext0)]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
				</div>
				<input
					type="text"
					placeholder="Search documentation..."
					class="w-full bg-[var(--color-surface0)]/50 border border-[var(--color-surface1)] rounded-xl pl-12 pr-4 py-3 text-[var(--color-text)] placeholder-[var(--color-subtext0)] focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/50 focus:border-[var(--color-green)] transition-all"
				/>
			</div>
		</div>

		{#each sections as section}
			<div
				class="border border-[var(--color-surface1)] rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300 group relative overflow-hidden section-card"
				style="background: rgba(49, 50, 68, 0.2); --section-color: var(--color-{section.color});"
				data-color={section.color}
			>
				<!-- Background gradient effect -->
				<div
					class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 section-gradient"
				></div>

				<div class="relative z-10">
					<div class="flex items-center gap-3 mb-4">
						<div
							class="w-10 h-10 rounded-lg flex items-center justify-center border section-icon-bg"
						>
							{@render section.icon({ size: 20, class: "section-icon" })}
						</div>
						<h2 class="text-2xl font-bold text-[var(--color-text)] transition-colors section-title">
							{section.title}
						</h2>
					</div>

					<div class="grid gap-3">
						{#each section.items as item}
							<a
								href="/docs/{section.id}/{item.title.toLowerCase().replace(/\s+/g, '-')}"
								class="flex items-center justify-between p-4 rounded-lg border border-[var(--color-surface2)]/30 hover:border-opacity-50 transition-all duration-300 group/item section-item"
								data-color={section.color}
							>
								<div>
									<h3
										class="font-semibold text-[var(--color-text)] transition-colors section-item-title"
									>
										{item.title}
									</h3>
									<p class="text-sm text-[var(--color-subtext0)] mt-1">{item.description}</p>
								</div>
								<svg
									class="w-5 h-5 text-[var(--color-subtext0)] transition-all duration-300 section-arrow"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							</a>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Sidebar -->
	<div class="space-y-6">
		<!-- Quick Links -->
		<div
			class="border border-[var(--color-surface1)] rounded-2xl p-6"
			style="background: rgba(49, 50, 68, 0.2);"
		>
			<h3 class="text-lg font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
				<Zap size={18} class="text-[var(--color-yellow)]" />
				Quick Links
			</h3>
			<div class="space-y-2">
				{#each quickLinks as link}
					<a
						href={link.href}
						class="flex items-center gap-3 p-3 rounded-lg text-[var(--color-subtext0)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface1)]/20 transition-all duration-300 group"
						target={link.external ? '_blank' : '_self'}
						rel={link.external ? 'noopener noreferrer' : ''}
					>
						{@render link.icon({
							size: 16,
							class: "text-[var(--color-subtext1)] group-hover:text-[var(--color-blue)] transition-colors"
						})}
						<span class="font-medium">{link.title}</span>
						{#if link.external}
							<ExternalLink
								size={14}
								class="text-[var(--color-subtext0)] group-hover:text-[var(--color-blue)] transition-colors ml-auto"
							/>
						{/if}
					</a>
				{/each}
			</div>
		</div>

		<!-- Recent Updates -->
		<div
			class="border border-[var(--color-surface1)] rounded-2xl p-6"
			style="background: rgba(49, 50, 68, 0.2);"
		>
			<h3 class="text-lg font-bold text-[var(--color-text)] mb-4">Recent Updates</h3>
			<div class="space-y-4">
				<div class="pb-4 border-b border-[var(--color-surface2)]/30 last:border-b-0 last:pb-0">
					<div class="flex items-center justify-between">
						<div>
							<h4 class="font-medium text-[var(--color-text)] text-sm">being.software</h4>
							<p class="text-xs text-[var(--color-subtext0)] mt-1">
								New online portal launched
							</p>
						</div>
						<span
							class="text-xs text-[var(--color-subtext1)] bg-[var(--color-surface0)] px-2 py-1 rounded-full flex-shrink-0"
							>New</span
						>
					</div>
				</div>

				<div class="pb-4 border-b border-[var(--color-surface2)]/30 last:border-b-0 last:pb-0">
					<div class="flex items-center justify-between">
						<div>
							<h4 class="font-medium text-[var(--color-text)] text-sm">Security Updated</h4>
							<p class="text-xs text-[var(--color-subtext0)] mt-1">
								Enhanced encryption of passwords and sensitive data
							</p>
						</div>
						<span
							class="text-xs text-[var(--color-green)] bg-[var(--color-green)]/10 px-2 py-1 rounded-full flex-shrink-0"
							>Updated</span
						>
					</div>
				</div>

				<div class="pb-4 border-b border-[var(--color-surface2)]/30 last:border-b-0 last:pb-0">
					<div class="flex items-center justify-between">
						<div>
							<h4 class="font-medium text-[var(--color-text)] text-sm">Deploy Forms</h4>
							<p class="text-xs text-[var(--color-subtext0)] mt-1">
								Added new deployment <br />
								forms for easier app setup
							</p>
						</div>
						<span
							class="text-xs text-[var(--color-blue)] bg-[var(--color-blue)]/10 px-2 py-1 rounded-full flex-shrink-0"
							>Enhanced</span
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Support -->
		<div
			class="border border-[var(--color-surface1)] rounded-2xl p-6"
			style="background: rgba(49, 50, 68, 0.2);"
		>
			<h3 class="text-lg font-bold text-[var(--color-text)] mb-4">Need Help?</h3>
			<p class="text-sm text-[var(--color-subtext0)] mb-4">
				Can't find what you're looking for?
			</p>
			<div class="space-y-2">
				<a
					href="/support"
					class="flex items-center gap-2 text-sm text-[var(--color-blue)] hover:text-[var(--color-lavender)] transition-colors"
				>
					<LifeBuoy size={16} />
					Reach out on Discord/Slack
				</a>
				<a
					href="/community"
					class="flex items-center gap-2 text-sm text-[var(--color-blue)] hover:text-[var(--color-lavender)] transition-colors"
				>
					<Globe size={16} />
					Join Community
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Footer CTA -->
<div class="mt-16 text-center">
	<div
		class="border border-[var(--color-surface1)] rounded-2xl p-8"
		style="background: rgba(49, 50, 68, 0.2);"
	>
		<h3 class="text-2xl font-bold text-[var(--color-text)] mb-4">Ready to get started?</h3>
		<p class="text-[var(--color-subtext0)] mb-6 max-w-2xl mx-auto">
			Follow our quick start guide to deploy your first application in minutes, or explore our
			comprehensive documentation to unlock the full potential of the platform.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="/docs/getting-started/quick-start"
				class="inline-flex items-center gap-2 bg-[var(--color-green)] text-[var(--color-base)] font-semibold px-6 py-3 rounded-lg hover:bg-[var(--color-teal)] transition-all duration-300 shine-button relative overflow-hidden"
			>
				<Zap size={18} />
				Quick Start Guide
			</a>
			<a
				href="/deploy"
				class="inline-flex items-center gap-2 bg-[var(--color-mauve)] text-[var(--color-base)] font-semibold px-6 py-3 rounded-lg hover:bg-[var(--color-lavender)] transition-all duration-300 shine-button relative overflow-hidden"
			>
				<Globe size={18} />
				Deploy Now
			</a>
		</div>
	</div>
</div>

<style>
	.h1 {
		font-family: 'DotGothic16', sans-serif;
		font-weight: 900;
	}


	.shine-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s;
	}

	.shine-button:hover::before {
		left: 100%;
	}

	/* Section hover effects */
	:global(.section-card[data-color='blue']:hover) {
		border-color: rgba(137, 180, 250, 0.5);
	}
	:global(.section-card[data-color='blue'] .section-gradient) {
		background: linear-gradient(to bottom right, rgba(137, 180, 250, 0.05), transparent);
	}
	:global(.section-card[data-color='blue']:hover .section-title) {
		color: var(--color-blue);
	}
	:global(.section-card[data-color='blue'] .section-icon-bg) {
		background-color: rgba(137, 180, 250, 0.2);
		border-color: rgba(137, 180, 250, 0.3);
	}
	:global(.section-card[data-color='blue'] .section-icon) {
		color: var(--color-blue);
	}

	:global(.section-card[data-color='mauve']:hover) {
		border-color: rgba(203, 166, 247, 0.5);
	}
	:global(.section-card[data-color='mauve'] .section-gradient) {
		background: linear-gradient(to bottom right, rgba(203, 166, 247, 0.05), transparent);
	}
	:global(.section-card[data-color='mauve']:hover .section-title) {
		color: var(--color-mauve);
	}
	:global(.section-card[data-color='mauve'] .section-icon-bg) {
		background-color: rgba(203, 166, 247, 0.2);
		border-color: rgba(203, 166, 247, 0.3);
	}
	:global(.section-card[data-color='mauve'] .section-icon) {
		color: var(--color-mauve);
	}

	:global(.section-card[data-color='green']:hover) {
		border-color: rgba(166, 227, 161, 0.5);
	}
	:global(.section-card[data-color='green'] .section-gradient) {
		background: linear-gradient(to bottom right, rgba(166, 227, 161, 0.05), transparent);
	}
	:global(.section-card[data-color='green']:hover .section-title) {
		color: var(--color-green);
	}
	:global(.section-card[data-color='green'] .section-icon-bg) {
		background-color: rgba(166, 227, 161, 0.2);
		border-color: rgba(166, 227, 161, 0.3);
	}
	:global(.section-card[data-color='green'] .section-icon) {
		color: var(--color-green);
	}

	:global(.section-card[data-color='pink']:hover) {
		border-color: rgba(245, 194, 231, 0.5);
	}
	:global(.section-card[data-color='pink'] .section-gradient) {
		background: linear-gradient(to bottom right, rgba(245, 194, 231, 0.05), transparent);
	}
	:global(.section-card[data-color='pink']:hover .section-title) {
		color: var(--color-pink);
	}
	:global(.section-card[data-color='pink'] .section-icon-bg) {
		background-color: rgba(245, 194, 231, 0.2);
		border-color: rgba(245, 194, 231, 0.3);
	}
	:global(.section-card[data-color='pink'] .section-icon) {
		color: var(--color-pink);
	}

	/* Section item hover effects */
	:global(.section-item[data-color='blue']:hover) {
		border-color: rgba(137, 180, 250, 0.5);
		background-color: rgba(137, 180, 250, 0.05);
	}
	:global(.section-item[data-color='blue']:hover .section-item-title) {
		color: var(--color-blue);
	}
	:global(.section-item[data-color='blue']:hover .section-arrow) {
		color: var(--color-blue);
		transform: translateX(8px);
	}

	:global(.section-item[data-color='mauve']:hover) {
		border-color: rgba(203, 166, 247, 0.5);
		background-color: rgba(203, 166, 247, 0.05);
	}
	:global(.section-item[data-color='mauve']:hover .section-item-title) {
		color: var(--color-mauve);
	}
	:global(.section-item[data-color='mauve']:hover .section-arrow) {
		color: var(--color-mauve);
		transform: translateX(8px);
	}

	:global(.section-item[data-color='green']:hover) {
		border-color: rgba(166, 227, 161, 0.5);
		background-color: rgba(166, 227, 161, 0.05);
	}
	:global(.section-item[data-color='green']:hover .section-item-title) {
		color: var(--color-green);
	}
	:global(.section-item[data-color='green']:hover .section-arrow) {
		color: var(--color-green);
		transform: translateX(8px);
	}

	:global(.section-item[data-color='pink']:hover) {
		border-color: rgba(245, 194, 231, 0.5);
		background-color: rgba(245, 194, 231, 0.05);
	}
	:global(.section-item[data-color='pink']:hover .section-item-title) {
		color: var(--color-pink);
	}
	:global(.section-item[data-color='pink']:hover .section-arrow) {
		color: var(--color-pink);
		transform: translateX(8px);
	}
</style>
