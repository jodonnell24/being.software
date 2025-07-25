<script>
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import Alert from './Alert.svelte';

	export let appId = '';
	export let configuration = {};
	export let disabled = false;

	const dispatch = createEventDispatcher();

	let validating = false;
	let validationResults = null;
	let lastValidation = null;

	async function validateConfiguration() {
		if (!appId || Object.keys(configuration).length === 0) {
			return;
		}

		validating = true;
		validationResults = null;

		try {
			const response = await fetch('http://localhost:8081/api/validate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					app_id: appId,
					configuration: configuration
				})
			});

			if (!response.ok) {
				throw new Error(`Validation failed: ${response.statusText}`);
			}

			const _result = await response.json();
			validationResults = result;
			lastValidation = new Date();

			dispatch('validated', {
				valid: result.valid,
				results: result.results,
				summary: result.summary
			});
		} catch (error) {
			dispatch('error', { error: error.message });
		} finally {
			validating = false;
		}
	}

	function getResultIcon(result) {
		if (result.type === 'error' && !result.valid) return '❌';
		if (result.type === 'warning' && !result.valid) return '⚠️';
		if (result.valid) return '✅';
		return 'ℹ️';
	}

	function getResultClass(result) {
		if (result.type === 'error' && !result.valid) return 'text-red-600 bg-red-50';
		if (result.type === 'warning' && !result.valid) return 'text-yellow-600 bg-yellow-50';
		if (result.valid) return 'text-green-600 bg-green-50';
		return 'text-blue-600 bg-blue-50';
	}

	// Auto-validate when configuration changes
	let validationTimeout;
	$: if (appId && configuration && Object.keys(configuration).length > 0) {
		// Clear previous timeout
		if (validationTimeout) {
			clearTimeout(validationTimeout);
		}

		// Debounce validation
		validationTimeout = setTimeout(() => {
			validateConfiguration();
		}, 1000);
	}
</script>

<div class="config-validator">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold text-gray-900">Configuration Validation</h3>
		<Button
			on:click={validateConfiguration}
			{disabled}
			variant="secondary"
			class="flex items-center gap-2"
		>
			{#if validating}
				<LoadingSpinner size="sm" />
				Validating...
			{:else}
				🔍 Validate Config
			{/if}
		</Button>
	</div>

	{#if validationResults}
		<div class="validation-results space-y-3">
			<!-- Summary -->
			<Alert type={validationResults.valid ? 'success' : 'error'} class="mb-4">
				<strong>{validationResults.summary}</strong>
				{#if lastValidation}
					<div class="text-sm mt-1 opacity-75">
						Last validated: {lastValidation.toLocaleTimeString()}
					</div>
				{/if}
			</Alert>

			<!-- Detailed Results -->
			{#if validationResults.results && validationResults.results.length > 0}
				<div class="space-y-2">
					<h4 class="text-sm font-medium text-gray-700 mb-2">Field Validation Results:</h4>
					{#each validationResults.results as result}
						<div class="p-3 rounded-lg border {getResultClass(result)}">
							<div class="flex items-start gap-2">
								<span class="text-lg leading-none">{getResultIcon(result)}</span>
								<div class="flex-1 min-w-0">
									<div class="font-medium text-sm">
										{result.field}
									</div>
									<div class="text-sm mt-1">
										{result.message}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Validation Tips -->
			{#if !validationResults.valid}
				<div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
					<h4 class="text-sm font-medium text-blue-800 mb-2">💡 Tips for fixing issues:</h4>
					<ul class="text-sm text-blue-700 space-y-1">
						<li>• Ensure all file paths are absolute and the directories exist</li>
						<li>• Check that your user has write permissions to the specified directories</li>
						<li>• Verify domain names are correctly configured in your DNS</li>
						<li>• Use strong passwords with a mix of characters</li>
						<li>• Make sure port numbers are not already in use</li>
					</ul>
				</div>
			{/if}
		</div>
	{:else if !validating}
		<div class="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
			<div class="text-gray-500 mb-2">🔧</div>
			<p class="text-sm text-gray-600">Fill out the configuration form to validate your settings</p>
		</div>
	{/if}
</div>

<style>
	.config-validator {
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1rem;
		background: white;
	}

	.validation-results {
		max-height: 400px;
		overflow-y: auto;
	}
</style>
