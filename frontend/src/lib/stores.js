import { writable } from 'svelte/store';
import {
	GitBranch,
	ShieldCheck,
	Cloud,
	Image,
	Film,
	Music,
	Notebook,
	Rss,
	ChartLine,
	Zap
} from 'svelte-lucide';

// This store will hold the state of your applications.
// In the future, this could be populated by an API call to your Go backend.
export const applications = writable([
	{
		id: 'nextcloud',
		name: 'Nextcloud Hub',
		description: 'Replaces Google Drive, Calendar, and Contacts. Your complete data backend.',
		icon: Cloud,
		color: 'text-app-indigo',
		status: 'Not Deployed'
	},
	{
		id: 'immich',
		name: 'Immich',
		description: 'Replaces Google Photos. High-performance photo and video backup from your phone.',
		icon: Image,
		color: 'text-app-orange',
		status: 'Not Deployed'
	},
	{
		id: 'vaultwarden',
		name: 'Vaultwarden',
		description: 'Replaces 1Password or LastPass. Secure, private password management.',
		icon: ShieldCheck,
		color: 'text-app-blue',
		status: 'Not Deployed'
	},
	{
		id: 'jellyfin',
		name: 'Jellyfin',
		description: 'Replaces Plex or your Netflix subscription. Stream your own media anywhere.',
		icon: Film,
		color: 'text-app-lavender',
		status: 'Not Deployed'
	},
	{
		id: 'navidrome',
		name: 'Navidrome',
		description: 'Replaces Spotify or Apple Music. Your personal music streaming server.',
		icon: Music,
		color: 'text-app-pink',
		status: 'Not Deployed'
	},
	{
		id: 'joplin-server',
		name: 'Joplin Server',
		description: 'Replaces Evernote or OneNote. Syncs your notes across all devices securely.',
		icon: Notebook,
		color: 'text-app-gray',
		status: 'Not Deployed'
	},
	{
		id: 'freshrss',
		name: 'FreshRSS',
		description: 'Replaces Feedly. A modern, self-hosted RSS aggregator to curate your own news.',
		icon: Rss,
		color: 'text-app-yellow',
		status: 'Not Deployed'
	},
	{
		id: 'umami',
		name: 'Umami',
		description: 'Replaces Google Analytics. Simple, fast, privacy-focused website analytics.',
		icon: ChartLine,
		color: 'text-app-teal',
		status: 'Not Deployed'
	},
	{
		id: 'gitea',
		name: 'Gitea',
		description: '(Pro Tier) Replaces GitHub. For developers who want to own their code.',
		icon: GitBranch,
		color: 'text-app-green',
		status: 'Not Deployed'
	},
	{
		id: 'n8n',
		name: 'n8n',
		description: '(Pro Tier) Replaces Zapier. Automate workflows between your different apps.',
		icon: Zap,
		color: 'text-app-red',
		status: 'Not Deployed'
	}
]);
