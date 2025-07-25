<script>
	let email = $state('');
	let isSubmitting = $state(false);
	let emailError = $state('');
	let emailTouched = $state(false);

	function validateEmail(value) {
		if (!value || value.trim() === '') {
			return 'Email is required';
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return 'Please enter a valid email address';
		}

		return '';
	}

	function handleEmailInput(event) {
		email = event.target.value;

		// Clear error when user starts fixing it
		if (emailError && emailTouched) {
			emailError = '';
		}
	}

	function handleEmailBlur() {
		emailTouched = true;
		emailError = validateEmail(email);
	}

	async function handleSubmit(event) {
		event.preventDefault();

		// Mark as touched and validate
		emailTouched = true;
		emailError = validateEmail(email);

		if (emailError) {
			return;
		}

		isSubmitting = true;

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Reset form
		email = '';
		emailError = '';
		emailTouched = false;
		isSubmitting = false;
		alert("Thank you for your interest! We'll be in touch soon.");
	}
</script>

<svelte:head>
	<title>being.software - Own Your Digital Self</title>
	<meta
		name="description"
		content="The convenience of the cloud, with the privacy and control of local ownership. Stop trading your data for features."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
		rel="stylesheet"
	/>
	<link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
</svelte:head>

<div class="main-container bg-[var(--color-mantle)] text-[var(--color-text)] font-sans">
	<!-- Animated gradient background -->
	<div class="background-gradient"></div>

	<main class="relative z-10">
		<!-- Hero Section -->
		<section class="min-h-screen flex items-center justify-center text-center pt-20">
			<div class="container mx-auto px-6">
				<div class="max-w-4xl mx-auto">
					<div
						class="inline-block bg-[var(--color-mantle)]/50 border border-[var(--color-surface0)] backdrop-blur-sm rounded-full px-4 py-1 text-sm text-[var(--color-text)] mb-4"
					>
						The Third Option is Here
					</div>

					<h2
						class="text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-text)] to-[var(--color-subtext0)] leading-tight tracking-wider mb-6 h2"
					>
						being.software
					</h2>

					<p class="text-lg md:text-xl text-[var(--color-text)] max-w-2xl mx-auto mb-10">
						You're trapped between the surveillance of Big Tech and the inconvenience of going
						offline. We offer the convenience of the cloud with the privacy of self-hosting, made
						radically simple.
					</p>

					<!-- Signup Form -->
					<div id="signup" class="max-w-lg mx-auto">
						<form
							onsubmit={handleSubmit}
							novalidate
							class="flex flex-col sm:flex-row gap-3 p-2 bg-[var(--color-surface0)]/50 border border-[var(--color-surface1)] rounded-xl backdrop-blur-sm shadow-2xl shadow-black/20"
						>
							<div class="flex-1 relative">
								<input
									type="email"
									placeholder="you@example.com"
									bind:value={email}
									oninput={handleEmailInput}
									onblur={handleEmailBlur}
									disabled={isSubmitting}
									class="w-full bg-transparent text-[var(--color-text)] placeholder-[var(--color-subtext0)] px-4 py-3 rounded-lg focus:outline-none transition-all
										   {emailError && emailTouched
										? 'focus:ring-2 focus:ring-[var(--color-red)]/20 ring-1 ring-[var(--color-red)]/50'
										: 'focus:ring-2 focus:ring-[var(--color-lavender)]'}"
								/>
								{#if emailError && emailTouched}
									<div class="absolute top-full left-0 right-0 mt-1 px-2">
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
											{emailError}
										</p>
									</div>
								{/if}
							</div>
							<button
								type="submit"
								disabled={isSubmitting}
								class="w-full sm:w-auto min-w-max flex-shrink-0 bg-[var(--color-lavender)] text-[var(--color-base)] font-bold px-8 py-3 rounded-lg hover:bg-[var(--color-mauve)] transition-colors whitespace-nowrap shine-button relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? 'Submitting...' : 'Sign Up'}
							</button>
						</form>
						<p class="text-xs text-[var(--color-subtext0)] mt-3">
							Join the waitlist. No spam, ever.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Features / Problem Section -->
		<section class="py-20">
			<div class="container mx-auto px-6">
				<div class="text-center mb-12">
					<h3 class="text-4xl font-bold tracking-tight text-[var(--color-text)] h3">
						The Golden Handcuffs
					</h3>
					<p class="text-[var(--color-subtext0)] mt-2">
						Modern cloud services are incredible. And that's the problem.
					</p>
				</div>

				<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					<!-- Feature 1 -->
					<div
						class="p-8 filter border border-[var(--color-surface1)] rounded-2xl backdrop-blur-sm"
					>
						<div
							class="w-12 h-12 bg-[var(--color-surface1)] rounded-lg flex items-center justify-center mb-4 border border-[var(--color-surface2)]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="text-[var(--color-subtext0)]"
							>
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
								<circle cx="12" cy="12" r="3"></circle>
							</svg>
						</div>
						<h4 class="text-xl font-bold text-[var(--color-text)] mb-2">
							Your Data is the Product
						</h4>
						<p class="text-[var(--color-subtext0)]">
							Your photos, notes, and contacts are scanned and monetized. You are not the customer;
							you are the dataset.
						</p>
					</div>

					<!-- Feature 2 -->
					<div
						class="p-8 filter border border-[var(--color-surface1)] rounded-2xl backdrop-blur-sm"
					>
						<div
							class="w-12 h-12 bg-[var(--color-surface1)] rounded-lg flex items-center justify-center mb-4 border border-[var(--color-surface2)]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="text-[var(--color-subtext0)]"
							>
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
								<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
							</svg>
						</div>
						<h4 class="text-xl font-bold text-[var(--color-text)] mb-2">The Illusion of Control</h4>
						<p class="text-[var(--color-subtext0)]">
							Exporting your data is intentionally difficult. Switching services is a nightmare.
							This lock-in is by design.
						</p>
					</div>

					<!-- Feature 3 -->
					<div
						class="p-8 filter border border-[var(--color-surface1)] rounded-2xl backdrop-blur-sm"
					>
						<div
							class="w-12 h-12 bg-[var(--color-surface1)] rounded-lg flex items-center justify-center mb-4 border border-[var(--color-surface2)]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="text-[var(--color-subtext0)]"
							>
								<polyline points="16 18 22 12 16 6"></polyline>
								<polyline points="8 6 2 12 8 18"></polyline>
							</svg>
						</div>
						<h4 class="text-xl font-bold text-[var(--color-text)] mb-2">The Complexity Barrier</h4>
						<p class="text-[var(--color-subtext0)]">
							Self-hosting is powerful, but requires deep technical knowledge of servers,
							networking, and security. Until now.
						</p>
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-[var(--color-surface1)]/50">
		<div class="container mx-auto px-6 py-8 text-center text-[var(--color-subtext0)]">
			<p>&copy; {new Date().getFullYear()} being.software &nbsp;</p>
		</div>
	</footer>
</div>

<style>
	/* Ensure the font is applied globally */
	:global(body) {
		font-family: 'Inter', sans-serif;
		/* Add a subtle scanline effect for more retro feel */
		background-image: linear-gradient(var(--color-base) 50%, transparent 50%);
		background-size: 100% 4px;
		background-color: var(--color-base); /* Fallback for older browsers */
		color: var(--color-text); /* Default text color */
	}

	.main-container {
		position: relative;
		overflow: hidden; /* This is crucial for the pseudo-element background */
	}

	/* This is the core of the "Vercel" background effect.
    It's a large pseudo-element with a radial gradient.
    We animate its position to create a slow, shifting aurora effect.
  */
	.background-gradient {
		position: absolute;
		top: 0;
		left: 0;
		width: 200%;
		height: 200%;
		z-index: 0;
		/* subtle scanline effect */
		background-color: var(--color-base);
		/* This is the gradient that gives the theme hue */
		/* Adjust the colors to match your theme */
		background-image: linear-gradient(var(--color-surface0) 0%, transparent 50%);
		/* This ensures the gradient is stretched across the entire background */
		/* This creates the gradient effect */
		background-size: 100% 4px;
		/* This is the animation that moves the gradient */

		animation: moveGradient 15s infinite linear;
		transform: translate(-25%, -25%) rotate(0deg);
		/* This ensures the gradient rotates around the center */
		transform-origin: center center;
	}

	@keyframes moveGradient {
		0% {
			transform: translate(-25%, -25%) rotate(0deg);
		}
		100% {
			transform: translate(-25%, -25%) rotate(360deg);
		}
	}

	/* A subtle shine effect on hover for the CTA button */
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
	.h2 {
		font-family: 'DotGothic16', sans-serif;
		font-weight: 900;
		color: var(--color-text);
		text-shadow: 0 0 2px var(--color-lavender);
	}

	.h3 {
		font-family: 'DotGothic16', sans-serif;
		font-weight: 900;
		color: var(--color-text);
		text-shadow: 0 0 1px var(--color-lavender);
	}
</style>
