import { writable } from 'svelte/store';

// Define form configurations for each application
export const deploymentForms = {
	nextcloud: {
		title: 'Configure Nextcloud Hub',
		description: 'Set up your personal cloud storage and productivity suite.',
		securityNote:
			'Passwords and sensitive data are handled securely and never stored in browser memory.',
		fields: [
			{
				id: 'domain',
				label: 'Domain Name',
				type: 'text',
				placeholder: 'nextcloud.yourdomain.com',
				required: true,
				description: 'The domain where Nextcloud will be accessible',
				sensitive: false
			},
			{
				id: 'adminUser',
				label: 'Admin Username',
				type: 'text',
				placeholder: 'admin',
				required: true,
				description: 'Username for the Nextcloud administrator account',
				sensitive: false
			},
			{
				id: 'adminPassword',
				label: 'Admin Password',
				type: 'password',
				placeholder: '',
				required: true,
				description: 'Strong password for the admin account',
				sensitive: true,
				generateOption: true
			},
			{
				id: 'storage',
				label: 'Storage Location',
				type: 'text',
				placeholder: '/var/nextcloud/data',
				required: true,
				description: 'Path where files will be stored on your server',
				sensitive: false
			},
			{
				id: 'email',
				label: 'Admin Email',
				type: 'email',
				placeholder: 'admin@yourdomain.com',
				required: true,
				description: 'Email for admin notifications and password recovery',
				sensitive: false
			}
		]
	},
	immich: {
		title: 'Configure Immich Photo Server',
		description: 'Set up your private photo and video backup solution.',
		securityNote: 'Database passwords are encrypted and securely transmitted to your server.',
		fields: [
			{
				id: 'domain',
				label: 'Domain Name',
				type: 'text',
				placeholder: 'photos.yourdomain.com',
				required: true,
				description: 'The domain where Immich will be accessible',
				sensitive: false
			},
			{
				id: 'uploadPath',
				label: 'Upload Storage Path',
				type: 'text',
				placeholder: '/var/immich/uploads',
				required: true,
				description: 'Directory where uploaded photos/videos will be stored',
				sensitive: false
			},
			{
				id: 'dbPassword',
				label: 'Database Password',
				type: 'password',
				placeholder: '',
				required: true,
				description: 'Password for the PostgreSQL database (min. 8 characters)',
				sensitive: true,
				generateOption: true
			},
			{
				id: 'machinelearning',
				label: 'Enable Machine Learning Features',
				type: 'checkbox',
				description: 'Enable facial recognition and object detection (requires more resources)',
				sensitive: false
			}
		]
	},
	vaultwarden: {
		title: 'Configure Vaultwarden Password Manager',
		description: 'Set up your secure password vault.',
		securityNote: 'Admin tokens are cryptographically secure and never logged or cached.',
		fields: [
			{
				id: 'domain',
				label: 'Domain Name',
				type: 'text',
				placeholder: 'vault.yourdomain.com',
				required: true,
				description: 'The domain where Vaultwarden will be accessible',
				sensitive: false
			},
			{
				id: 'adminToken',
				label: 'Admin Token',
				type: 'password',
				placeholder: '',
				required: true,
				description: 'Secure token for accessing admin panel (will be generated if empty)',
				sensitive: true,
				generateOption: true
			},
			{
				id: 'signupAllowed',
				label: 'Allow New Signups',
				type: 'checkbox',
				description: 'Allow new users to create accounts',
				sensitive: false
			},
			{
				id: 'inviteOnly',
				label: 'Invite Only Mode',
				type: 'checkbox',
				description: 'Require invitations for new user registration',
				sensitive: false
			},
			{
				id: 'smtpHost',
				label: 'SMTP Server (Optional)',
				type: 'text',
				placeholder: 'smtp.gmail.com',
				description: 'SMTP server for sending emails',
				sensitive: false
			},
			{
				id: 'smtpPort',
				label: 'SMTP Port',
				type: 'number',
				placeholder: '587',
				description: 'SMTP server port',
				sensitive: false
			}
		]
	},
	jellyfin: {
		title: 'Configure Jellyfin Media Server',
		description: 'Set up your personal media streaming server.',
		securityNote: 'All configuration data is transmitted securely over HTTPS.',
		fields: [
			{
				id: 'domain',
				label: 'Domain Name',
				type: 'text',
				placeholder: 'media.yourdomain.com',
				required: true,
				description: 'The domain where Jellyfin will be accessible',
				sensitive: false
			},
			{
				id: 'mediaPath',
				label: 'Media Library Path',
				type: 'text',
				placeholder: '/var/media',
				required: true,
				description: 'Directory containing your movies, TV shows, etc.',
				sensitive: false
			},
			{
				id: 'cacheSize',
				label: 'Cache Size (GB)',
				type: 'number',
				placeholder: '10',
				description: 'Amount of disk space for transcoding cache',
				sensitive: false
			},
			{
				id: 'enableHardwareAccel',
				label: 'Enable Hardware Acceleration',
				type: 'checkbox',
				description: 'Use GPU for video transcoding (if available)',
				sensitive: false
			}
		]
	},
	navidrome: {
		title: 'Configure Navidrome Music Server',
		description: 'Set up your personal music streaming service.',
		securityNote: 'Your music library configuration is kept private and secure.',
		fields: [
			{
				id: 'domain',
				label: 'Domain Name',
				type: 'text',
				placeholder: 'music.yourdomain.com',
				required: true,
				description: 'The domain where Navidrome will be accessible',
				sensitive: false
			},
			{
				id: 'musicPath',
				label: 'Music Library Path',
				type: 'text',
				placeholder: '/var/music',
				required: true,
				description: 'Directory containing your music collection',
				sensitive: false
			},
			{
				id: 'scanInterval',
				label: 'Library Scan Interval (minutes)',
				type: 'number',
				placeholder: '60',
				description: 'How often to scan for new music files',
				sensitive: false
			}
		]
	},
	'joplin-server': {
		title: 'Configure Joplin Sync Server',
		description: 'Set up note synchronization for Joplin clients.',
		securityNote: 'Database passwords are encrypted and your notes remain private.',
		fields: [
			{
				id: 'domain',
				label: 'Domain Name',
				type: 'text',
				placeholder: 'notes.yourdomain.com',
				required: true,
				description: 'The domain where Joplin Server will be accessible',
				sensitive: false
			},
			{
				id: 'dbPassword',
				label: 'Database Password',
				type: 'password',
				placeholder: '',
				required: true,
				description: 'Password for the PostgreSQL database (min. 8 characters)',
				sensitive: true,
				generateOption: true
			},
			{
				id: 'maxItemSize',
				label: 'Max Item Size (MB)',
				type: 'number',
				placeholder: '10',
				description: 'Maximum size for individual notes/attachments',
				sensitive: false
			}
		]
	}
};

export const deploymentFormStore = writable({});
