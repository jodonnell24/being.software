/**
 * Centralized theme configuration for consistent styling across the application
 * Based on Catppuccin Mocha
 */

export const theme = {
	// Base colors
	colors: {
		overlay: 'var(--color-overlay)',
		base: 'var(--color-base)',
		mantle: 'var(--color-mantle)',
		crust: 'var(--color-crust)',
		text: 'var(--color-text)',
		subtext0: 'var(--color-subtext0)',
		subtext1: 'var(--color-subtext1)',
		surface0: 'var(--color-surface0)',
		surface1: 'var(--color-surface1)',
		surface2: 'var(--color-surface2)',

		// Accent colors
		blue: 'var(--color-blue)',
		lavender: 'var(--color-lavender)',
		pink: 'var(--color-pink)',
		mauve: 'var(--color-mauve)',
		red: 'var(--color-red)',
		maroon: 'var(--color-maroon)',
		peach: 'var(--color-peach)',
		yellow: 'var(--color-yellow)',
		green: 'var(--color-green)',
		teal: 'var(--color-teal)',
		sky: 'var(--color-sky)',
		sapphire: 'var(--color-sapphire)',

		// Cyberpunk neon colors
		cyan: 'var(--color-cyan)',
		neonPink: 'var(--color-neon-pink)',
		neonGreen: 'var(--color-neon-green)',
		electricBlue: 'var(--color-electric-blue)'
	},

	// Component style patterns
	components: {
		// Form elements
		input: {
			base: `w-full px-4 py-3 bg-[var(--color-surface1)] border border-[var(--color-surface2)] rounded-lg 
             text-[var(--color-text)] placeholder-[var(--color-subtext1)]
             focus:border-[var(--color-lavender)] focus:ring-2 focus:ring-[var(--color-lavender)]/20 
             focus:outline-none hover:border-[var(--color-lavender)]/30
             transition-all duration-200`,
			error: `border-[var(--color-red)] focus:border-[var(--color-red)] focus:ring-[var(--color-red)]/20`,
			success: `border-[var(--color-green)] focus:border-[var(--color-green)] focus:ring-[var(--color-green)]/20`
		},

		// Buttons
		button: {
			primary: `py-3 px-6 bg-[var(--color-lavender)] text-[var(--color-base)] font-medium
                rounded-lg hover:bg-[var(--color-mauve)] transition-all duration-200
                focus:ring-2 focus:ring-[var(--color-lavender)]/20 focus:outline-none
                shadow-lg shadow-[var(--color-lavender)]/20
                disabled:opacity-50 disabled:cursor-not-allowed`,
			secondary: `py-3 px-6 border border-[var(--color-surface2)] text-[var(--color-subtext0)] 
                  rounded-lg hover:bg-[var(--color-surface1)] hover:border-[var(--color-lavender)]/30
                  transition-all duration-200 focus:ring-2 focus:ring-[var(--color-lavender)]/20 focus:outline-none`,
			danger: `py-3 px-6 bg-[var(--color-red)] text-[var(--color-base)] font-medium
               rounded-lg hover:bg-[var(--color-red)]/80 transition-all duration-200
               focus:ring-2 focus:ring-[var(--color-red)]/20 focus:outline-none
               shadow-lg shadow-[var(--color-red)]/20`,
			ghost: `py-2 px-4 text-[var(--color-subtext0)] hover:text-[var(--color-text)]
              hover:bg-[var(--color-surface0)] rounded-lg transition-all duration-200`
		},

		// Cards and containers
		card: {
			base: `bg-[var(--color-surface0)] border border-[var(--color-surface1)] rounded-xl shadow-lg`,
			glass: `glass-card`,
			elevated: `bg-[var(--color-surface0)] border border-[var(--color-surface1)] rounded-xl 
                 shadow-xl shadow-[var(--color-base)]/50`
		},

		// Alert/notification styles
		alert: {
			info: `p-4 bg-[var(--color-blue)]/10 border border-[var(--color-blue)]/20 rounded-lg`,
			success: `p-4 bg-[var(--color-green)]/10 border border-[var(--color-green)]/20 rounded-lg`,
			warning: `p-4 bg-[var(--color-yellow)]/10 border border-[var(--color-yellow)]/20 rounded-lg`,
			error: `p-4 bg-[var(--color-red)]/10 border border-[var(--color-red)]/20 rounded-lg`,
			security: `p-3 bg-[var(--color-green)]/10 border border-[var(--color-green)]/20 rounded-lg`
		},

		// Text variants
		text: {
			title: `text-2xl font-bold text-[var(--color-text)]`,
			subtitle: `text-lg font-semibold text-[var(--color-text)]`,
			body: `text-[var(--color-text)]`,
			muted: `text-[var(--color-subtext0)]`,
			caption: `text-sm text-[var(--color-subtext1)]`,
			error: `text-[var(--color-red)]`,
			success: `text-[var(--color-green)]`,
			warning: `text-[var(--color-yellow)]`
		},

		// Icons and visual elements
		icon: {
			primary: `text-[var(--color-lavender)]`,
			secondary: `text-[var(--color-subtext0)]`,
			error: `text-[var(--color-red)]`,
			success: `text-[var(--color-green)]`,
			warning: `text-[var(--color-yellow)]`,
			info: `text-[var(--color-blue)]`
		}
	},

	// Animation and transition patterns
	animations: {
		transition: 'transition-all duration-200',
		transitionSlow: 'transition-all duration-300',
		bounce: 'animate-bounce',
		pulse: 'animate-pulse',
		spin: 'animate-spin'
	},

	// Spacing and sizing patterns
	spacing: {
		xs: 'p-2',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8',
		xl: 'p-12'
	},

	// Border radius patterns
	radius: {
		sm: 'rounded-md',
		md: 'rounded-lg',
		lg: 'rounded-xl',
		full: 'rounded-full'
	}
};

// Utility functions for dynamic theming
export function getColorClasses(color, variant = 'primary') {
	const colorMap = {
		blue: 'var(--color-blue)',
		lavender: 'var(--color-lavender)',
		pink: 'var(--color-pink)',
		mauve: 'var(--color-mauve)',
		red: 'var(--color-red)',
		green: 'var(--color-green)',
		yellow: 'var(--color-yellow)',
		teal: 'var(--color-teal)',
		sky: 'var(--color-sky)',
		sapphire: 'var(--color-sapphire)'
	};

	const baseColor = colorMap[color] || colorMap.lavender;

	if (variant === 'background') {
		return `bg-[${baseColor}]/10 border border-[${baseColor}]/20`;
	} else if (variant === 'text') {
		return `text-[${baseColor}]`;
	} else if (variant === 'button') {
		return `bg-[${baseColor}] text-[var(--color-base)] hover:bg-[${baseColor}]/80`;
	}

	return `text-[${baseColor}]`;
}

export function buildClassName(...classes) {
	return classes.filter(Boolean).join(' ');
}
