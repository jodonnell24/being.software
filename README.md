# My Platform UI

A Platform-as-a-Service (PaaS) for deploying and managing self-hosted applications on Kubernetes. Built with SvelteKit frontend and Go backend.

![Platform UI](https://img.shields.io/badge/SvelteKit-5.0-orange)
![Go](https://img.shields.io/badge/Go-1.21+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ What is My Platform?

My Platform is a web-based PaaS that allows users to:
- **🚀 Deploy applications** to their Kubernetes clusters with one click
- **🔒 Manage secrets** securely with client-side encryption
- **📊 Monitor deployments** with real-time status updates
- **⚙️ Configure services** through an intuitive web interface

**Users access the platform at: [https://your-platform-url.com](https://your-platform-url.com)**

## 🎯 For Different Audiences

### 🌐 **Platform Users**
Visit the live platform at [your-platform-url.com](https://your-platform-url.com) to:
- Connect your Kubernetes cluster
- Deploy applications from our catalog
- Manage your deployments

### 🏠 **Self-Hosters**
Want to run your own instance? See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Docker deployment
- Kubernetes deployment
- Configuration options

### 🤝 **Contributors**
Want to help develop the platform? See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Architecture overview
- Contribution guidelines

## 🏗️ Platform Architecture

```
Internet Users → Web Platform → Kubernetes Clusters
     ↓              ↓              ↓
   Browser    →  SvelteKit UI  →  User's K8s
     ↓              ↓              ↓
 Platform UI   →   Go API     →  Deployments
```

**Components:**
- **Frontend**: SvelteKit 5 web application
- **Backend**: Go REST API server
- **Target**: User's Kubernetes clusters (connected via kubeconfig)

## �️ Technology Stack

### Frontend
- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack web framework
- **[Svelte 5](https://svelte.dev/)** - Component framework with runes
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Vite](https://vitejs.dev/)** - Build tool and dev server

### Backend  
- **[Go](https://golang.org/)** - High-performance server language
- **[Chi Router](https://github.com/go-chi/chi)** - HTTP router and middleware
- **[Kubernetes Client](https://github.com/kubernetes/client-go)** - K8s API integration
- **RESTful API** - Clean API design

### Security & Operations
- **Client-side Encryption** - AES-256-GCM for sensitive data
- **Kubernetes RBAC** - Secure cluster access
- **Docker** - Containerized deployment
- **CI/CD Ready** - GitHub Actions workflows

---

## 🔨 Development & Deployment

This repository is for **developers and self-hosters**. Regular users should visit the live platform.

## �️ Tech Stack

### Frontend
- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack web framework
- **[Svelte 5](https://svelte.dev/)** - Component framework with runes
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - Build tool and dev server

### Backend  
- **[Go](https://golang.org/)** - High-performance server language
- **[Gorilla Mux](https://github.com/gorilla/mux)** - HTTP router
- **RESTful API** - Clean API design

### Security
- **Client-side Encryption** - AES-256-GCM encryption
- **Password Validation** - Strength checking and breach detection
- **CSRF Protection** - Request validation
- **Secure Headers** - Security-first HTTP headers

## � Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint all code |
| `npm run format` | Format code with Prettier |

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env`)
```bash
VITE_API_URL=http://localhost:8081  # Backend API URL
```

**Backend** (`.env`)
```bash
PORT=8081                          # Server port
DATABASE_URL=...                   # Database connection
```

## � Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build production image
docker build -t my-platform .
docker run -p 8080:8080 my-platform
```

### Manual Deployment

```bash
# Build frontend
cd frontend && npm run build

# Build backend  
cd backend && go build -o app

# Deploy both build artifacts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [Catppuccin](https://github.com/catppuccin/catppuccin) for the beautiful color scheme
- [Lucide](https://lucide.dev/) for the clean icons

---

**⭐ Star this repo if you find it helpful!**
