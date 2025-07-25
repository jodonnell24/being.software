<script>
	import { theme, buildClassName } from '$lib/theme.js';

	let {
		variant = 'primary', // 'primary', 'secondary', 'danger', 'ghost'
		size = 'md', // 'sm', 'md', 'lg'
		disabled = false,
		loading = false,
		onclick = null,
		type = 'button',
		class: customClass = '',
		children
	} = $props();

	const sizeClasses = {
		sm: 'py-2 px-4 text-sm',
		md: 'py-3 px-6',
		lg: 'py-4 px-8 text-lg'
	};

	const loadingSpinner = `
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  `;

	const buttonClass = $derived(
		buildClassName(
			theme.components.button[variant],
			sizeClasses[size],
			disabled || loading ? 'cursor-not-allowed opacity-50' : '',
			'inline-flex items-center justify-center',
			customClass
		)
	);
</script>

<button {type} {disabled} {onclick} class={buttonClass} aria-disabled={disabled || loading}>
	{#if loading}
		{@html loadingSpinner}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</button>
