<script>
	let { size = 'md', color = 'text-blue' } = $props();

	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-8 h-8',
		xl: 'w-12 h-12'
	};
</script>

<div class="flex justify-center items-center">
	<div
		class="{sizeClasses[
			size
		]} {color} animate-spin rounded-full border-2 border-current border-t-transparent"
	></div>
</div>
