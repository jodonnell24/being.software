<script>
	import { theme, buildClassName } from '$lib/theme.js';

	let {
		variant = 'info', // 'info', 'success', 'warning', 'error', 'security'
		title = '',
		message = '',
		icon = true,
		dismissible = false,
		onDismiss = null,
		class: customClass = '',
		children
	} = $props();

	const icons = {
		info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <circle cx="12" cy="12" r="10"/>
             <line x1="12" y1="8" x2="12" y2="12"/>
             <line x1="12" y1="16" x2="12.01" y2="16"/>
           </svg>`,
		success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <path d="m9 11 3 3L22 4"/>
              </svg>`,
		warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>`,
		error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>`,
		security: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                 <circle cx="12" cy="16" r="1"/>
                 <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
               </svg>`
	};

	const iconColors = {
		info: theme.components.icon.info,
		success: theme.components.icon.success,
		warning: theme.components.icon.warning,
		error: theme.components.icon.error,
		security: theme.components.icon.success
	};

	const alertClass = $derived(
		buildClassName(theme.components.alert[variant], theme.animations.transition, customClass)
	);

	const iconColor = $derived(iconColors[variant]);
</script>

<div class={alertClass}>
	<div class="flex items-start gap-3">
		{#if icon}
			<div class="mt-0.5 flex-shrink-0 {iconColor}">
				{@html icons[variant]}
			</div>
		{/if}

		<div class="flex-1">
			{#if title}
				<h4 class="font-medium {iconColor} mb-1">{title}</h4>
			{/if}

			{#if message}
				<p class="text-sm {iconColor}">{message}</p>
			{:else if children}
				<div class="text-sm {iconColor}">
					{@render children()}
				</div>
			{/if}
		</div>

		{#if dismissible && onDismiss}
			<button
				onclick={onDismiss}
				class="flex-shrink-0 {iconColor} hover:opacity-70 {theme.animations.transition}"
				aria-label="Dismiss"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		{/if}
	</div>
</div>
