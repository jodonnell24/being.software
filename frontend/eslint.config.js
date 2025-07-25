import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.{js,svelte}'],
		rules: {
			// Warnings instead of errors for easier development
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			],
			'no-undef': 'warn',
			'svelte/no-at-html-tags': 'warn',
			'svelte/require-each-key': 'warn',
			'svelte/infinite-reactive-loop': 'warn',
			'no-case-declarations': 'error'
		}
	},
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'.output/',
			'node_modules/',
			'package-lock.json',
			'yarn.lock',
			'pnpm-lock.yaml',
			'.prettierrc',
			'.eslintignore',
			'.prettierignore'
		]
	}
];
