<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';

	let { children } = $props();
</script>

<div class="flex flex-col h-screen">
	<Header />
	<div class="flex flex-grow overflow-hidden">
		<Sidebar />
		<main class="flex-grow p-8 overflow-y-auto relative">
			<div class="container mx-auto relative z-10">
				<ErrorBoundary>
					{@render children()}
				</ErrorBoundary>
			</div>
		</main>
	</div>
</div>
