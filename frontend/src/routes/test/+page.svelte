<script>
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import ConfigValidator from '$lib/components/ConfigValidator.svelte';
	import Button from '$lib/components/Button.svelte';
	import { deploymentForms } from '$lib/deploymentForms.js';
	import { deployApplication } from '$lib/api.js';
	import { Book, Zap, Shield, Globe, Terminal, FileText } from 'svelte-lucide';

	// Redirect to home if not in development mode
	if (!dev) {
		goto('/');
	}

	let selectedApp = $state('wordpress');
	let testConfiguration = $state({});
	let debugOutput = $state('');
	let isTestingDeployment = $state(false);
	let testError = $state(null);

	// Available apps for testing
	const apps = Object.keys(deploymentForms);

	// Get form configuration for selected app
	$effect(() => {
		const formConfig = deploymentForms[selectedApp];
		if (formConfig) {
			// Create sample test data based on form fields
			const sampleData = {};
			formConfig.fields.forEach((field) => {
				switch (field.id) {
					case 'domain':
						sampleData[field.id] = 'example.com';
						break;
					case 'database_password':
					case 'admin_password':
					case 'root_password':
						sampleData[field.id] = 'SecurePassword123!';
						break;
					case 'database_name':
						sampleData[field.id] = 'app_database';
						break;
					case 'database_user':
					case 'admin_username':
						sampleData[field.id] = 'admin';
						break;
					case 'database_host':
						sampleData[field.id] = 'localhost';
						break;
					case 'database_port':
						sampleData[field.id] = '3306';
						break;
					case 'smtp_host':
						sampleData[field.id] = 'smtp.gmail.com';
						break;
					case 'smtp_port':
						sampleData[field.id] = '587';
						break;
					case 'smtp_username':
						sampleData[field.id] = 'user@gmail.com';
						break;
					case 'smtp_password':
						sampleData[field.id] = 'app_password_here';
						break;
					case 'ssl_cert_path':
						sampleData[field.id] = '/etc/ssl/certs/cert.pem';
						break;
					case 'ssl_key_path':
						sampleData[field.id] = '/etc/ssl/private/key.pem';
						break;
					case 'upload_path':
					case 'data_path':
						sampleData[field.id] = '/var/www/uploads';
						break;
					case 'port':
						sampleData[field.id] = '80';
						break;
					default:
						sampleData[field.id] = `sample_${field.id}`;
				}
			});
			testConfiguration = sampleData;
		}
	});

	// DEBUGGING FUNCTIONS - Only for testing environment
	function logToDebug(message, data = null) {
		const timestamp = new Date().toLocaleTimeString();
		const logEntry = `[${timestamp}] ${message}`;
		console.log(logEntry, data || '');
		debugOutput =
			debugOutput + '\n' + logEntry + (data ? '\n' + JSON.stringify(data, null, 2) : '');
	}

	function clearDebugOutput() {
		debugOutput = '';
		console.clear();
	}

	function fillTestData() {
		const formConfig = deploymentForms[selectedApp];
		if (formConfig) {
			const testData = {};
			formConfig.fields.forEach((field) => {
				switch (field.id) {
					case 'domain':
						testData[field.id] = 'test.example.com';
						break;
					case 'adminToken':
						testData[field.id] = 'test-admin-token-123456789';
						break;
					case 'signupAllowed':
						testData[field.id] = true;
						break;
					case 'inviteOnly':
						testData[field.id] = false;
						break;
					case 'smtpHost':
						testData[field.id] = 'smtp.gmail.com';
						break;
					case 'smtpPort':
						testData[field.id] = '587';
						break;
					default:
						testData[field.id] = `test_${field.id}`;
				}
			});
			testConfiguration = testData;
			logToDebug('Test data filled', testData);
		}
	}

	async function testConnectivity() {
		try {
			logToDebug('Testing backend connectivity...');
			const result = await deployApplication('test', { test: 'connectivity_check' });
			logToDebug('Connectivity test result', result);
		} catch (error) {
			logToDebug('Connectivity test failed', {
				type: typeof error,
				name: error.name,
				message: error.message,
				stack: error.stack
			});
		}
	}

	async function testDeployment() {
		if (Object.keys(testConfiguration).length === 0) {
			testError = 'No test configuration data. Please select an app first.';
			return;
		}

		isTestingDeployment = true;
		testError = null;

		try {
			logToDebug('=== STARTING TEST DEPLOYMENT ===');
			logToDebug('Selected app', selectedApp);
			logToDebug('Test configuration', testConfiguration);

			logToDebug('Calling deployApplication...');
			const result = await deployApplication(selectedApp, testConfiguration);

			logToDebug('Test deployment successful', result);
		} catch (error) {
			logToDebug('=== TEST DEPLOYMENT ERROR ===');
			logToDebug('Full error object', {
				message: error.message,
				name: error.name,
				stack: error.stack,
				constructor: error.constructor.name
			});

			testError = error.message || 'Unknown error occurred during test deployment';
		} finally {
			isTestingDeployment = false;
			logToDebug('=== TEST DEPLOYMENT COMPLETE ===');
		}
	}

	function testValidation() {
		const formConfig = deploymentForms[selectedApp];
		if (!formConfig) {
			logToDebug('No form config found for app', selectedApp);
			return;
		}

		logToDebug('=== VALIDATION TEST ===');
		logToDebug('Current test data', testConfiguration);
		logToDebug('Form config fields', formConfig.fields);

		formConfig.fields.forEach((field) => {
			const value = testConfiguration[field.id];
			logToDebug(`Field ${field.id}`, {
				value: value,
				hasValue: !!value,
				isEmpty: !value || (typeof value === 'string' && value.trim() === ''),
				required: field.required,
				type: field.type
			});
		});
	}

	// Expose functions to global scope for browser console debugging
	if (typeof window !== 'undefined') {
		window.testFunctions = {
			fillTestData,
			testConnectivity,
			testDeployment,
			testValidation,
			clearDebugOutput,
			logToDebug
		};
		logToDebug('Test functions exposed to window.testFunctions');
	}
</script>

<div class="container">
	<div class="header">
		<div class="flex items-center justify-center gap-3 mb-4">
			<div
				class="w-12 h-12 bg-gradient-to-br from-[var(--color-mauve)] to-[var(--color-lavender)] rounded-xl flex items-center justify-center"
			>
				<Terminal size={24} class="text-[var(--color-base)]" />
			</div>
			<h1>Testing & Debug Environment</h1>
		</div>
		<p class="subtitle">
			Test deployment configurations, debug validation, and test API connectivity safely
		</p>
		<div class="warning-banner">
			<div class="flex items-center gap-2">
				<Shield size={16} class="text-[var(--color-peach)] flex-shrink-0" />
				<span
					><strong>Testing Environment:</strong> This page contains debugging tools and test functions.
					Not for production use.</span
				>
			</div>
		</div>
	</div>

	<div class="test-card">
		<div class="app-selector">
			<label for="app-select">Select Application to Test:</label>
			<select id="app-select" bind:value={selectedApp}>
				{#each apps as appId}
					<option value={appId}>{deploymentForms[appId]?.title || appId}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="test-card">
		<h2>Test Configuration Data</h2>
		<div class="config-preview">
			<pre>{JSON.stringify(testConfiguration, null, 2)}</pre>
		</div>
		<details>
			<summary>Edit Test Data</summary>
			<div class="config-editor">
				{#each Object.entries(testConfiguration) as [key, value]}
					<div class="field">
						<label for={key}>{key}:</label>
						<input id={key} type="text" bind:value={testConfiguration[key]} />
					</div>
				{/each}
			</div>
		</details>
	</div>

	<ConfigValidator appId={selectedApp} configuration={testConfiguration} />

	<!-- Debugging Tools Section -->
	<div class="test-card">
		<div class="flex items-center gap-3 mb-4">
			<div
				class="w-8 h-8 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-teal)] rounded-lg flex items-center justify-center"
			>
				<Zap size={16} class="text-[var(--color-base)]" />
			</div>
			<h2>Debug Tools</h2>
		</div>
		<div class="debug-tools">
			<div class="button-group">
				<Button onclick={fillTestData}>Fill Test Data</Button>
				<Button onclick={testConnectivity}>Test Connectivity</Button>
				<Button onclick={testValidation}>Test Validation</Button>
				<Button onclick={testDeployment} disabled={isTestingDeployment} variant="primary">
					{isTestingDeployment ? 'Testing Deployment...' : 'Test Deployment'}
				</Button>
				<Button onclick={clearDebugOutput} variant="secondary">Clear Debug Output</Button>
			</div>

			{#if testError}
				<div class="error-display">
					<div class="flex items-center gap-2 mb-2">
						<div
							class="w-5 h-5 bg-[var(--color-red)] rounded-full flex items-center justify-center"
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--color-base)"
								stroke-width="3"
							>
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</div>
						<h3>Test Error</h3>
					</div>
					<pre>{testError}</pre>
				</div>
			{/if}
		</div>
	</div>

	<!-- Debug Output -->
	<div class="test-card">
		<div class="flex items-center gap-3 mb-4">
			<div
				class="w-8 h-8 bg-gradient-to-br from-[var(--color-green)] to-[var(--color-teal)] rounded-lg flex items-center justify-center"
			>
				<FileText size={16} class="text-[var(--color-base)]" />
			</div>
			<h2>Debug Output</h2>
		</div>
		<div class="debug-output">
			{#if debugOutput.trim()}
				<pre>{debugOutput}</pre>
			{:else}
				<p class="no-output">No debug output yet. Run some tests to see logs here.</p>
			{/if}
		</div>
	</div>

	<!-- Global Functions Info -->
	<div class="test-card">
		<div class="flex items-center gap-3 mb-4">
			<div
				class="w-8 h-8 bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-mauve)] rounded-lg flex items-center justify-center"
			>
				<Globe size={16} class="text-[var(--color-base)]" />
			</div>
			<h2>Browser Console Functions</h2>
		</div>
		<p>The following functions are available in your browser console for advanced testing:</p>
		<div class="console-functions">
			<code>window.testFunctions.fillTestData()</code> - Fill form with test data<br />
			<code>window.testFunctions.testConnectivity()</code> - Test backend connectivity<br />
			<code>window.testFunctions.testDeployment()</code> - Test full deployment flow<br />
			<code>window.testFunctions.testValidation()</code> - Test form validation<br />
			<code>window.testFunctions.clearDebugOutput()</code> - Clear debug output<br />
			<code>window.testFunctions.logToDebug(message, data)</code> - Add custom debug log
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1.125rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.warning-banner {
		background: rgba(250, 179, 135, 0.1);
		border: 1px solid rgba(250, 179, 135, 0.3);
		border-radius: 0.75rem;
		padding: 1rem;
		color: var(--color-peach);
		font-size: 0.875rem;
		margin-top: 1rem;
	}

	.app-selector {
		margin-bottom: 1rem;
	}

	.app-selector label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--text-primary);
	}

	.app-selector select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background: var(--bg-secondary);
		color: var(--text-primary);
		font-size: 1rem;
	}

	.config-preview {
		background: var(--bg-secondary);
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
		margin-bottom: 1rem;
	}

	.config-preview pre {
		margin: 0;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		white-space: pre-wrap;
		word-break: break-word;
	}

	details {
		margin-top: 1rem;
	}

	summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--text-primary);
		padding: 0.5rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
	}

	.config-editor {
		margin-top: 1rem;
		padding: 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		display: grid;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field label {
		font-weight: 600;
		color: var(--text-primary);
	}

	.field input {
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background: var(--bg-primary);
		color: var(--text-primary);
	}

	:global(.container > *) {
		margin-bottom: 2rem;
	}

	/* Test Card Styling */
	.test-card {
		background: rgba(49, 50, 68, 0.2);
		border: 1px solid var(--color-surface1);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		backdrop-filter: blur(2.5px);
		transition: all 0.3s ease-in-out;
	}

	.test-card:hover {
		border-color: rgba(137, 180, 250, 0.5);
		box-shadow: 0 8px 32px rgba(137, 180, 250, 0.15);
	}

	.test-card h2 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
	}

	/* Debug Tools Styling */
	.debug-tools {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.button-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.error-display {
		background: rgba(243, 139, 168, 0.1);
		border: 1px solid rgba(243, 139, 168, 0.3);
		border-radius: 0.75rem;
		padding: 1rem;
		margin-top: 1rem;
	}

	.error-display h3 {
		margin: 0;
		color: var(--color-red);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.error-display pre {
		margin: 0.5rem 0 0 0;
		color: var(--color-red);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.debug-output {
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		padding: 1rem;
		max-height: 400px;
		overflow-y: auto;
	}

	.debug-output pre {
		margin: 0;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.no-output {
		color: var(--text-secondary);
		font-style: italic;
		margin: 0;
	}

	.console-functions {
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		padding: 1rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.console-functions code {
		background: rgba(0, 0, 0, 0.1);
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
		font-weight: 600;
	}
</style>
