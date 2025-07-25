<script>
	let { children } = $props();
	let hasError = $state(false);
	let error = $state(null);

	function _handleError(event) {
		hasError = true;
		error = event.error;
	}

	function handleRefresh() {
		window.location.reload();
	}

	function handleGoBack() {
		history.back();
	}
</script>

{#if hasError}
	<div class="text-center space-y-6 max-w-2xl mx-auto">
		<!-- Main Error Alert -->
		<div class="bg-[var(--color-red)]/10 border border-[var(--color-red)]/20 rounded-lg p-6">
			<div class="text-[var(--color-red)] mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mx-auto"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="15" y1="9" x2="9" y2="15"></line>
					<line x1="9" y1="9" x2="15" y2="15"></line>
				</svg>
			</div>
			<h3 class="text-lg font-bold text-[var(--color-red)] mb-2">Something went wrong</h3>
			<p class="text-[var(--color-subtext0)] mb-4">
				We encountered an unexpected error. Please try refreshing the page or contact support if the
				problem persists.
			</p>
		</div>

		<!-- Error Details (Collapsible) -->
		{#if error}
			<details
				class="text-left bg-[var(--color-surface0)] border border-[var(--color-surface1)] rounded-lg p-4"
			>
				<summary
					class="cursor-pointer text-[var(--color-subtext0)] hover:text-[var(--color-text)] transition-colors"
				>
					Show technical details
				</summary>
				<div class="mt-4 bg-[var(--color-surface1)] p-4 rounded-lg">
					<h4 class="text-[var(--color-red)] font-medium mb-2">Error Details:</h4>
					<pre
						class="text-xs bg-[var(--color-surface2)] p-3 rounded overflow-auto text-[var(--color-subtext0)]">
{error.message}
{#if error.stack}
							Stack trace:
{error.stack}
						{/if}
					</pre>
				</div>
			</details>
		{/if}

		<!-- Action Buttons -->
		<div class="flex gap-4 justify-center">
			<button
				onclick={handleGoBack}
				class="py-2 px-6 border border-[var(--color-surface2)] text-[var(--color-subtext0)]
					   rounded-lg hover:bg-[var(--color-surface1)] hover:border-[var(--color-lavender)]/30
					   transition-all duration-200"
			>
				Go Back
			</button>
			<button
				onclick={handleRefresh}
				class="py-2 px-6 bg-[var(--color-lavender)] text-[var(--color-base)] font-medium
					   rounded-lg hover:bg-[var(--color-mauve)] transition-all duration-200
					   focus:ring-2 focus:ring-[var(--color-lavender)]/20 focus:outline-none"
			>
				Refresh Page
			</button>
		</div>

		<!-- Additional Help -->
		<div class="text-center">
			<p class="text-xs text-[var(--color-subtext1)]">
				If this error persists, please
				<a
					href="/support"
					class="text-[var(--color-text)] hover:text-[var(--color-lavender)] underline transition-colors"
				>
					contact support
				</a>
				with the error details above.
			</p>
		</div>
	</div>
{:else}
	{@render children()}
{/if}
