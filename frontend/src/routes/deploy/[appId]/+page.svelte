<script>
	import SecureInput from '$lib/components/SecureInput.svelte';
	import { deploymentForms } from '$lib/deploymentForms.js';
	import { deployApplication } from '$lib/api.js';
	import { createSecureFormStore } from '$lib/secureForm.js';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let { app } = data;

	// Get form configuration for this app
	const formConfig = deploymentForms[app.id] || {
		title: `Configure ${app.name}`,
		description: `Set up ${app.name} for deployment.`,
		securityNote: 'Your configuration data is handled securely.',
		fields: [
			{
				id: 'domain',
				label: 'Domain Name',
				type: 'text',
				placeholder: `${app.id}.yourdomain.com`,
				required: true,
				description: `The domain where ${app.name} will be accessible`,
				sensitive: false
			}
		]
	};

	// Create secure form store
	const {
		formData,
		getSanitizedData,
		prepareForSubmission,
		clearSensitiveData,
		validateForm: _validateForm,
		isSensitiveField: _isSensitiveField
	} = createSecureFormStore(formConfig.fields);

	let currentFormData = $state({});
	let sanitizedPreview = $state({});
	let isSubmitting = $state(false);
	let submitError = $state(null);
	let validationErrors = $state({});
	let fieldTouched = $state({}); // Track which fields have been interacted with

	// Subscribe to form data changes
	formData.subscribe((data) => {
		currentFormData = data;
		sanitizedPreview = getSanitizedData(data);
	});

	// Validation state tracking removed for production

	// Automatically clear submit error when all validation errors are resolved
	$effect(() => {
		// Only clear submit error if it's a validation-related error
		if (
			submitError &&
			submitError.includes('Please fix the validation errors') &&
			Object.keys(validationErrors).length === 0
		) {
			submitError = null;
		}
	});

	// Domain validation test removed for production

	// Debug functions removed for production

	async function handleSubmit(event) {
		event.preventDefault();

		// Mark all fields as touched for validation display
		const allTouched = {};
		formConfig.fields.forEach((field) => {
			allTouched[field.id] = true;
		});
		fieldTouched = allTouched;

		// Validate all fields with our custom validation
		if (!validateAllFields()) {
			submitError = 'Please fix the validation errors';
			return;
		}

		isSubmitting = true;
		submitError = null;

		try {
			// Prepare data for secure transmission with encryption
			const secureData = await prepareForSubmission(currentFormData, true);

			// Deploy the application with the configuration
			const _result = await deployApplication(app.id, secureData);

			// Clear sensitive data from memory
			clearSensitiveData();

			// Navigate back to deploy page or show success
			goto('/deploy');
		} catch (error) {
			// Set user-friendly error message
			let errorMessage = 'An unexpected error occurred during deployment.';

			if (error.message) {
				if (
					error.message.includes('Unable to connect to server') ||
					error.message.includes('Failed to fetch') ||
					error.message.includes('NetworkError') ||
					error.message.includes('fetch')
				) {
					errorMessage =
						'Unable to connect to the deployment server. Please check your internet connection and try again.';
				} else if (error.message.includes('timeout')) {
					errorMessage = 'Request timed out. Please try again.';
				} else {
					errorMessage = error.message;
				}
			} else if (error.name === 'TypeError') {
				errorMessage = 'Network connection error. Please check your internet connection.';
			}

			submitError = errorMessage;
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		// Clear sensitive data before leaving
		clearSensitiveData();
		goto('/deploy');
	}

	function updateFormValue(fieldId, value) {
		formData.update((data) => ({
			...data,
			[fieldId]: value
		}));

		// Immediately validate this field
		const field = formConfig.fields.find((f) => f.id === fieldId);
		if (field) {
			const fieldErrors = validateField(field, value);

			if (fieldErrors.length > 0) {
				validationErrors = { ...validationErrors, [fieldId]: fieldErrors[0] };
			} else {
				// Clear any existing validation error for this field
				const newErrors = { ...validationErrors };
				delete newErrors[fieldId];
				validationErrors = newErrors;

				// Clear submit error if no validation errors remain
				if (submitError && Object.keys(newErrors).length === 0) {
					submitError = null;
				}
			}
		}
	}

	function validateField(field, value) {
		const errors = [];

		// Required field validation
		if (field.required) {
			if (field.type === 'checkbox') {
				if (!value) {
					errors.push(`${field.label} is required`);
				}
			} else if (!value || (typeof value === 'string' && value.trim() === '')) {
				errors.push(`${field.label} is required`);
			}
		}

		// Type-specific validation
		if (value && typeof value === 'string' && value.trim() !== '') {
			switch (field.type) {
				case 'email': {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(value)) {
						errors.push(`${field.label} must be a valid email address`);
					}
					break;
				}
				case 'url':
					try {
						new URL(value);
					} catch {
						errors.push(`${field.label} must be a valid URL`);
					}
					break;
				case 'text':
					// Domain validation for domain fields
					if (field.id === 'domain' || field.id.includes('domain')) {
						// Very permissive domain regex - allows most common domain formats
						const domainRegex =
							/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
						if (!domainRegex.test(value.trim())) {
							errors.push(`${field.label} must be a valid domain name`);
						}
					}
					break;
			}
		}

		return errors;
	}

	function handleFieldBlur(field) {
		fieldTouched = { ...fieldTouched, [field.id]: true };
		const value = currentFormData[field.id];
		const errors = validateField(field, value);

		if (errors.length > 0) {
			validationErrors = { ...validationErrors, [field.id]: errors[0] };
		} else {
			// Clear any existing error for this field
			if (validationErrors[field.id]) {
				const newErrors = { ...validationErrors };
				delete newErrors[field.id];
				validationErrors = newErrors;
			}

			// Clear submit error if no validation errors remain
			if (submitError && Object.keys(validationErrors).length === 0) {
				submitError = null;
			}
		}
	}

	function validateAllFields() {
		const errors = {};
		let hasErrors = false;

		for (const field of formConfig.fields) {
			const value = currentFormData[field.id];
			const fieldErrors = validateField(field, value);

			if (fieldErrors.length > 0) {
				errors[field.id] = fieldErrors[0];
				hasErrors = true;
			}
		}

		validationErrors = errors;

		// Clear submit error if there are no validation errors
		if (!hasErrors) {
			submitError = null;
		}

		return !hasErrors;
	}
</script>

<svelte:head>
	<title>Deploy {app.name} | FOSS Platform</title>
	<meta name="description" content="Configure and deploy {app.name}" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen filter text-[var(--color-text)] rounded-lg">
	<div class="container mx-auto px-6 py-8">
		<!-- Header -->
		<div class="flex items-center gap-4 mb-8">
			<button
				onclick={handleCancel}
				class="p-2 hover:bg-[var(--color-surface0)] rounded-lg transition-colors"
				aria-label="Go back to applications list"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
			</button>
			<div class="flex items-center gap-3">
				{#if app.icon}
					<app.icon size={32} class={app.color} />
				{/if}
				<h1 class="text-2xl font-bold">{formConfig.title}</h1>
			</div>
		</div>

		<div class="max-w-5xl mx-auto">
			<!-- Description -->
			<div
				class="bg-[var(--color-surface0)] border border-[var(--color-surface1)] rounded-xl p-6 mb-6"
			>
				<p class="text-[var(--color-subtext0)] leading-relaxed mb-4">{formConfig.description}</p>
				{#if formConfig.securityNote}
					<div
						class="flex items-start gap-3 p-3 bg-[var(--color-green)]/10 border border-[var(--color-green)]/20 rounded-lg"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="text-[var(--color-green)] mt-0.5 flex-shrink-0"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<circle cx="12" cy="16" r="1" />
							<path d="m7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						<p class="text-sm text-[var(--color-green)]">{formConfig.securityNote}</p>
					</div>
				{/if}
			</div>

			<!-- Form -->
			<form
				onsubmit={handleSubmit}
				novalidate
				class="bg-[var(--color-surface0)] border border-[var(--color-surface1)] rounded-xl p-8"
			>
				<div class="grid grid-cols-1 gap-6">
					{#each formConfig.fields as field}
						<div class="col-span-1 {field.type === 'textarea' ? 'lg:col-span-2' : ''}">
							{#if field.type === 'password' || field.sensitive}
								<SecureInput
									{field}
									value={currentFormData[field.id] || ''}
									oninput={(e) => updateFormValue(field.id, e.target.value)}
									onblur={() => handleFieldBlur(field)}
								/>
							{:else if field.type === 'checkbox'}
								<div class="space-y-2">
									<label for={field.id} class="block text-sm font-medium text-[var(--color-text)]">
										{field.label}
										{#if field.required}
											<span class="text-[var(--color-red)]">*</span>
										{/if}
									</label>
									<div class="flex items-center gap-3">
										<div class="relative">
											<input
												type="checkbox"
												id={field.id}
												checked={currentFormData[field.id] || false}
												onchange={(e) => updateFormValue(field.id, e.target.checked)}
												onblur={() => handleFieldBlur(field)}
												class="peer w-5 h-5 appearance-none bg-[var(--color-surface1)] border-2 rounded-md cursor-pointer transition-all duration-200
												   checked:bg-[var(--color-lavender)] checked:border-[var(--color-lavender)]
												   hover:border-[var(--color-lavender)]/50 focus:ring-2 focus:ring-[var(--color-lavender)]/20
												   focus:outline-none
												   {validationErrors[field.id] && fieldTouched[field.id]
													? 'border-[var(--color-red)]'
													: 'border-[var(--color-surface2)]'}"
											/>
											<svg
												class="absolute top-0.5 left-0.5 w-4 h-4 text-[var(--color-base)] opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
										<label
											for={field.id}
											class="text-sm text-[var(--color-subtext0)] cursor-pointer hover:text-[var(--color-text)] transition-colors"
										>
											{field.description}
										</label>
									</div>
									{#if validationErrors[field.id] && fieldTouched[field.id]}
										<p class="text-xs text-[var(--color-red)] flex items-center gap-1">
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
											{validationErrors[field.id]}
										</p>
									{/if}
								</div>
							{:else}
								<div class="space-y-2">
									<label for={field.id} class="block text-sm font-medium text-[var(--color-text)]">
										{field.label}
										{#if field.required}
											<span class="text-[var(--color-red)]">*</span>
										{/if}
									</label>
									<input
										type={field.type}
										id={field.id}
										value={currentFormData[field.id] || ''}
										oninput={(e) => updateFormValue(field.id, e.target.value)}
										onblur={() => handleFieldBlur(field)}
										placeholder={field.placeholder}
										class="w-full px-4 py-3 bg-[var(--color-surface1)] border rounded-lg
										   text-[var(--color-text)] placeholder-[var(--color-subtext1)]
										   focus:outline-none transition-all duration-200
										   {validationErrors[field.id] && fieldTouched[field.id]
											? 'border-[var(--color-red)] focus:border-[var(--color-red)] focus:ring-2 focus:ring-[var(--color-red)]/20'
											: 'border-[var(--color-surface2)] focus:border-[var(--color-lavender)] focus:ring-2 focus:ring-[var(--color-lavender)]/20 hover:border-[var(--color-lavender)]/30'}"
									/>
									{#if validationErrors[field.id] && fieldTouched[field.id]}
										<p class="text-xs text-[var(--color-red)] mt-1 flex items-center gap-1">
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
											{validationErrors[field.id]}
										</p>
									{:else if field.description}
										<p class="text-xs text-[var(--color-subtext1)] mt-1">{field.description}</p>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>

				{#if submitError}
					<div
						class="mt-6 p-4 bg-[var(--color-red)]/10 border border-[var(--color-red)]/20 rounded-lg"
					>
						<div class="flex items-center gap-2 text-[var(--color-red)]">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<circle cx="12" cy="12" r="10" />
								<line x1="15" y1="9" x2="9" y2="15" />
								<line x1="9" y1="9" x2="15" y2="15" />
							</svg>
							<span class="text-sm font-medium">{submitError}</span>
						</div>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex gap-4 mt-8">
					<button
						type="button"
						onclick={handleCancel}
						class="flex-1 py-3 px-6 border border-[var(--color-surface2)] text-[var(--color-subtext0)]
							   rounded-lg hover:bg-[var(--color-surface1)] hover:border-[var(--color-lavender)]/30
							   transition-all duration-200"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="flex-1 py-3 px-6 bg-[var(--color-lavender)] text-[var(--color-base)] font-medium
							   rounded-lg hover:bg-[var(--color-mauve)] transition-all duration-200
							   disabled:opacity-50 disabled:cursor-not-allowed
							   focus:ring-2 focus:ring-[var(--color-lavender)]/20 focus:outline-none
							   shadow-lg shadow-[var(--color-lavender)]/20 shine-button relative overflow-hidden"
					>
						{isSubmitting ? 'Deploying...' : 'Deploy Application'}
					</button>
				</div>
			</form>

			<!-- Configuration Preview -->
			<div
				class="mt-8 bg-[var(--color-surface0)] border border-[var(--color-surface1)] rounded-xl p-6"
			>
				<h3 class="text-lg font-semibold mb-4 text-[var(--color-text)]">Configuration Preview</h3>
				<div class="bg-[var(--color-surface1)] p-4 rounded-lg">
					{#if Object.keys(sanitizedPreview).length === 0}
						<p class="text-sm text-[var(--color-subtext1)] italic">
							No configuration data entered yet
						</p>
					{:else}
						<pre
							class="text-sm text-[var(--color-subtext0)] overflow-x-auto whitespace-pre-wrap">{JSON.stringify(
								sanitizedPreview,
								null,
								2
							)}</pre>
						<div
							class="mt-3 p-2 bg-[var(--color-yellow)]/10 border border-[var(--color-yellow)]/20 rounded text-xs text-[var(--color-yellow)]"
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="inline mr-1"
							>
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
							Sensitive values are hidden for security. They will be transmitted securely to your server.
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom focus styles for better accessibility */
	input:focus {
		outline: none;
	}

	/* Custom checkbox styling */
	input[type='checkbox']:checked {
		background-image: none;
	}

	/* A subtle shine effect on hover for the deploy button */
	.shine-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: all 0.6s;
	}

	.shine-button:hover::before {
		left: 100%;
	}
</style>
