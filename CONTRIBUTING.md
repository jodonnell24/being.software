# Contributing to My Platform UI

Thank you for your interest in contributing to My Platform! This is a Platform-as-a-Service (PaaS) for Kubernetes deployments.

## 🎯 About This Project

My Platform is a web-based PaaS that helps users deploy and manage applications on their Kubernetes clusters. Users interact with the hosted platform, not this repository directly.

**This repository is for:**
- 🛠️ **Contributors** - Developers who want to improve the platform
- 🏠 **Self-hosters** - Users who want to run their own instance

## 🚀 Development Setup

### Prerequisites
- **Node.js** 18+
- **Go** 1.21+
- **Docker** (recommended)
- **Kubernetes cluster** (for testing - can use k3d)

### Quick Start
```bash
git clone https://github.com/yourusername/my-platform-ui.git
cd my-platform-ui
npm run install:all
npm start
```

### Full Development Environment
```bash
# One-time setup (installs tools, creates env files, optionally sets up K3d)
npm run setup

# Then start development
npm start

# Or use Docker for full environment
npm run dev:docker
```

## 📋 Available Scripts

### Basic Development
| Command | Description |
|---------|-------------|
| `npm start` | Start both frontend and backend |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only |
| `npm run build` | Build for production |
| `npm test` | Run all tests |
| `npm run lint` | Check code quality |

### Docker Development
| Command | Description |
|---------|-------------|
| `npm run dev:docker` | Start with Docker Compose |
| `npm run dev:docker:bg` | Start in background |
| `npm run dev:stop` | Stop Docker containers |
| `npm run dev:logs` | View container logs |
| `npm run dev:clean` | Clean Docker containers and volumes |

### Kubernetes Testing
| Command | Description |
|---------|-------------|
| `npm run k3d:create` | Create local K3d cluster |
| `npm run k3d:delete` | Delete K3d cluster |
| `npm run k3d:status` | Check cluster status |

### Maintenance
| Command | Description |
|---------|-------------|
| `npm run setup` | Full development environment setup |
| `npm run install:all` | Install all dependencies |
| `npm run clean` | Clean build artifacts |
| `npm run lint:fix` | Auto-fix linting issues |

## 📁 Project Structure

```
my-platform-ui/
├── frontend/          # SvelteKit frontend
├── backend/           # Go backend
├── scripts/           # Development utilities
├── docker-compose.dev.yml  # Development containers
└── Dockerfile         # Production build
```

## 🔄 Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Install dependencies**: `npm run install:all`
4. **Start development**: `npm start`
5. **Make your changes**
6. **Test your changes**: `npm test && npm run lint`
7. **Commit**: `git commit -m 'Add amazing feature'`
8. **Push**: `git push origin feature/amazing-feature`
9. **Create a Pull Request**

## 🧪 Testing

### Local Testing
```bash
npm test                # Run all tests
npm run test:frontend   # Frontend tests only
npm run test:backend    # Backend tests only
```

### Docker Testing
```bash
npm run dev:docker
# Test in containerized environment
```

### Kubernetes Testing
```bash
npm run k3d:create
# Deploy and test against local cluster
```

## 📝 Code Style

- **Frontend**: ESLint + Prettier (configured)
- **Backend**: golangci-lint
- **Auto-fix**: `npm run lint:fix`

## 🐛 Reporting Issues

1. Check existing issues first
2. Use issue templates
3. Include reproduction steps
4. Provide environment details

## 💡 Feature Requests

1. Check discussions first
2. Describe the use case
3. Consider implementation approach
4. Be open to feedback

## 📖 Documentation

- Update README.md for user-facing changes
- Update DEVELOPMENT.md for development process changes
- Add inline comments for complex logic
- Update API documentation

## 🚀 Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release PR
4. Tag release after merge
5. GitHub Actions handles deployment

---

## 🤝 Getting Help

- **General questions**: GitHub Discussions
- **Bug reports**: GitHub Issues
- **Development help**: See DEVELOPMENT.md
- **Setup issues**: Run `npm run setup` for guided setup

Thank you for contributing! 🎉
