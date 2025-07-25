<script>
	import { SecurityUtils } from '$lib/secureForm.js';
	import { theme } from '$lib/theme.js';

	let {
		field,
		value = $bindable(''),
		error = '',
		oninput = null,
		onblur = null
	} = $props();

	let showPassword = $state(false);
	let passwordStrength = $state({ strength: 'empty', score: 0, feedback: '', meetsMinLength: false });
	let showGenerator = $state(false);
	let pwnedStatus = $state({ isPwned: false, breachCount: 0, checking: false });
	let strengthCheckTimeout;

	// Update password strength when value changes
	$effect(() => {
		if (field.type === 'password' && value) {
			passwordStrength = SecurityUtils.checkPasswordStrength(value);

			// Debounced pwned password check (avoid too many API calls)
			clearTimeout(strengthCheckTimeout);
			strengthCheckTimeout = setTimeout(async () => {
				if (value && value.length >= 8) {
					pwnedStatus.checking = true;
					pwnedStatus = await SecurityUtils.checkPasswordPwned(value);
					pwnedStatus.checking = false;
				}
			}, 1000);
		} else {
			passwordStrength = { strength: 'empty', score: 0, feedback: '', meetsMinLength: false };
			pwnedStatus = { isPwned: false, breachCount: 0, checking: false };
		}
	});

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function generateSecurePassword() {
		if (field.id.toLowerCase().includes('token')) {
			value = SecurityUtils.generateSecureToken(32);
		} else {
			value = SecurityUtils.generateSecurePassword(16);
		}
		showGenerator = false;
		// Automatically show the generated password so user can copy it
		showPassword = true;

		// Trigger the parent's oninput handler if provided
		if (oninput) {
			oninput({ target: { value } });
		}
	}

	function getStrengthColor(strength) {
		switch (strength) {
			case 'very-weak':
				return 'text-[var(--color-red)]';
			case 'weak':
				return 'text-[var(--color-red)]';
			case 'fair':
				return 'text-[var(--color-yellow)]';
			case 'good':
				return 'text-[var(--color-blue)]';
			case 'strong':
				return 'text-[var(--color-green)]';
			default:
				return 'text-[var(--color-subtext1)]';
		}
	}

	function getStrengthBgColor(strength) {
		switch (strength) {
			case 'very-weak':
				return 'bg-[var(--color-red)]';
			case 'weak':
				return 'bg-[var(--color-red)]';
			case 'fair':
				return 'bg-[var(--color-yellow)]';
			case 'good':
				return 'bg-[var(--color-blue)]';
			case 'strong':
				return 'bg-[var(--color-green)]';
			default:
				return 'bg-[var(--color-surface2)]';
		}
	}

	function getStrengthWidth(score) {
		// zxcvbn score is 0-4, convert to percentage
		return (score / 4) * 100;
	}
</script>

<div class="space-y-2">
	<label for={field.id} class="block text-sm font-medium text-[var(--color-text)]">
		{field.label}
		{#if field.required}
			<span class="text-[var(--color-red)]">*</span>
		{/if}
		{#if field.sensitive}
			<span
				class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-yellow)]/20 text-[var(--color-yellow)]"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="mr-1"
				>
					<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
					<circle cx="12" cy="16" r="1" />
					<path d="m7 11V7a5 5 0 0 1 10 0v4" />
				</svg>
				Secure
			</span>
		{/if}
	</label>

	<div class="relative">
		<input
			type={showPassword ? 'text' : field.type}
			id={field.id}
			bind:value
			{oninput}
			{onblur}
			placeholder={field.placeholder}
			required={field.required}
			autocomplete={field.type === 'password' ? 'new-password' : 'off'}
			class="w-full px-4 py-3 pr-12 bg-[var(--color-surface1)] border border-[var(--color-surface2)] rounded-lg
				   text-[var(--color-text)] placeholder-[var(--color-subtext1)]
				   focus:border-[var(--color-lavender)] focus:ring-2 focus:ring-[var(--color-lavender)]/20
				   transition-all duration-200
				   {error ? 'border-[var(--color-red)] focus:border-[var(--color-red)]' : ''}"
		/>

		{#if field.type === 'password'}
			<div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
				{#if field.generateOption}
					<button
						type="button"
						onclick={() => (showGenerator = !showGenerator)}
						class="p-1.5 text-[var(--color-subtext0)] hover:text-[var(--color-lavender)] hover:bg-[var(--color-surface0)] rounded transition-colors"
						title="Generate secure password"
						aria-label="Generate secure password"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
							<path d="m21 2-3 3" />
							<path d="M5 13 9 9" />
							<path d="m9 93 3" />
							<path d="m10 12 3 3" />
							<path d="m13 15 3 3" />
							<path d="M15 21v-3a3 3 0 0 0-3-3H9l-1 1" />
						</svg>
					</button>
				{/if}
				<button
					type="button"
					onclick={togglePasswordVisibility}
					class="p-1.5 text-[var(--color-subtext0)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface0)] rounded transition-colors"
					title={showPassword ? 'Hide password' : 'Show password'}
				>
					{#if showPassword}
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="m15 18-.722-3.25" />
							<path d="m2 2 20 20" />
							<path d="m9 9-.722 3.25" />
							<circle cx="12" cy="12" r="3" />
							<path d="M12 5c-8 0-10 7-10 7s2 7 10 7 10-7 10-7-2-7-10-7" />
						</svg>
					{:else}
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
					{/if}
				</button>
			</div>
		{/if}
	</div>

	{#if showGenerator && field.generateOption}
		<div class="bg-[var(--color-surface0)] border border-[var(--color-surface1)] rounded-lg p-3">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-[var(--color-text)]"
					>Generate Secure {field.id.toLowerCase().includes('token') ? 'Token' : 'Password'}</span
				>
				<button
					type="button"
					onclick={() => (showGenerator = false)}
					class="text-[var(--color-subtext0)] hover:text-[var(--color-text)]"
					aria-label="Close password generator"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>
			<button
				type="button"
				onclick={generateSecurePassword}
				class="w-full py-2 px-4 bg-[var(--color-green)] text-[var(--color-base)] rounded-lg hover:bg-[var(--color-green)]/80 transition-colors text-sm font-medium"
			>
				Generate {field.id.toLowerCase().includes('token') ? 'Secure Token' : 'Strong Password'}
			</button>
		</div>
	{/if}

	{#if field.type === 'password' && value && passwordStrength.strength !== 'empty'}
		<div class="space-y-3">
			<!-- Password Strength Meter -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-medium text-[var(--color-text)]">Password Strength</span>
					<span
						class="text-xs font-medium {getStrengthColor(passwordStrength.strength)} capitalize"
					>
						{passwordStrength.strength.replace('-', ' ')}
					</span>
				</div>
				<div class="flex-1 bg-[var(--color-surface2)] rounded-full h-2">
					<div
						class="h-full rounded-full transition-all duration-300 {getStrengthBgColor(
							passwordStrength.strength
						)}"
						style="width: {getStrengthWidth(passwordStrength.zxcvbnScore)}%"
					></div>
				</div>
				{#if passwordStrength.crackTime}
					<p class="text-xs text-[var(--color-subtext1)]">
						Time to crack: {passwordStrength.crackTime}
					</p>
				{/if}
			</div>

			<!-- Length Requirement -->
			<div class="flex items-center gap-2">
				<div
					class="w-4 h-4 rounded-full flex items-center justify-center {passwordStrength.meetsMinLength
						? 'bg-[var(--color-green)]'
						: 'bg-[var(--color-surface2)]'}"
				>
					{#if passwordStrength.meetsMinLength}
						<svg
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-base)"
							stroke-width="3"
						>
							<polyline points="20,6 9,17 4,12" />
						</svg>
					{/if}
				</div>
				<span
					class="text-xs {passwordStrength.meetsMinLength
						? 'text-[var(--color-green)]'
						: 'text-[var(--color-subtext1)]'}"
				>
					{#if value.length < 12}
						{value.length}/12 minimum characters
					{:else if value.length < 15}
						{value.length} characters (good length)
					{:else}
						{value.length} characters (excellent length!)
					{/if}
				</span>
			</div>

			<!-- Pwned Password Check -->
			{#if pwnedStatus.checking}
				<div class="flex items-center gap-2">
					<div class="w-4 h-4">
						<svg
							class="animate-spin h-4 w-4 text-[var(--color-subtext1)]"
							viewBox="0 0 24 24"
							fill="none"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								class="opacity-25"
							></circle>
							<path
								fill="currentColor"
								class="opacity-75"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
					<span class="text-xs text-[var(--color-subtext1)]"
						>Checking against known breaches...</span
					>
				</div>
			{:else if pwnedStatus.isPwned}
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 rounded-full bg-[var(--color-red)] flex items-center justify-center">
						<svg
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-base)"
							stroke-width="3"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</div>
					<span class="text-xs text-[var(--color-red)]">
						This password was found in {pwnedStatus.breachCount.toLocaleString()} data breaches
					</span>
				</div>
			{:else if !pwnedStatus.error && value.length >= 8}
				<div class="flex items-center gap-2">
					<div
						class="w-4 h-4 rounded-full bg-[var(--color-green)] flex items-center justify-center"
					>
						<svg
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-base)"
							stroke-width="3"
						>
							<polyline points="20,6 9,17 4,12" />
						</svg>
					</div>
					<span class="text-xs text-[var(--color-green)]">Not found in known breaches</span>
				</div>
			{/if}

			<!-- Feedback -->
			{#if passwordStrength.feedback}
				<div
					class="bg-[var(--color-surface0)] border border-[var(--color-surface1)] rounded-lg p-3"
				>
					<p class="text-xs {getStrengthColor(passwordStrength.strength)}">
						{passwordStrength.feedback}
					</p>
				</div>
			{/if}
		</div>
	{/if}

	{#if field.description}
		<p class="text-xs text-[var(--color-subtext1)]">{field.description}</p>
	{/if}

	{#if error}
		<p class="text-xs text-[var(--color-red)]">{error}</p>
	{/if}
</div>
