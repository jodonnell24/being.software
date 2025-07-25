<script>
	import { theme as _theme, buildClassName } from '$lib/theme.js';

	let {
		type = 'text',
		value = $bindable(),
		placeholder = '',
		label = '',
		description = '',
		required = false,
		disabled = false,
		error = '',
		success = '',
		class: customClass = '',
		...props
	} = $props();

	const inputClass = $derived(
		buildClassName(
			theme.components.input.base,
			error ? theme.components.input.error : '',
			success ? theme.components.input.success : '',
			disabled ? 'opacity-50 cursor-not-allowed' : '',
			customClass
		)
	);

	const id = `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="space-y-2">
	{#if label}
		<label for={id} class="block text-sm font-medium {theme.components.text.body}">
			{label}
			{#if required}
				<span class={theme.components.text.error}>*</span>
			{/if}
		</label>
	{/if}

	<input {id} {type} {placeholder} {required} {disabled} bind:value class={inputClass} {...props} />

	{#if description && !error && !success}
		<p class="text-xs {theme.components.text.caption}">{description}</p>
	{/if}

	{#if error}
		<p class="text-xs {theme.components.text.error} flex items-center gap-1">
			<svg
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="15" y1="9" x2="9" y2="15" />
				<line x1="9" y1="9" x2="15" y2="15" />
			</svg>
			{error}
		</p>
	{/if}

	{#if success}
		<p class="text-xs {theme.components.text.success} flex items-center gap-1">
			<svg
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
				<path d="m9 11 3 3L22 4" />
			</svg>
			{success}
		</p>
	{/if}
</div>
