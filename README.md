# My Platform UI

A modern, secure web application for deploying and managing self-hosted applications. Built with SvelteKit frontend and Go backend.

![Platform UI](https://img.shields.io/badge/SvelteKit-5.0-orange)
![Go](https://img.shields.io/badge/Go-1.21+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🚀 Easy Deployment**: One-click deployment of popular self-hosted applications
- **🔒 Security First**: Client-side encryption for sensitive data
- **🎨 Modern UI**: Beautiful, responsive interface built with SvelteKit 5
- **⚡ Fast**: Optimized for performance with Vite and modern JavaScript
- **🛡️ Secure Forms**: Advanced password validation and breach detection
- **📱 Mobile Friendly**: Responsive design that works on all devices

## 🏗️ Architecture

```
my-platform/
├── frontend/          # SvelteKit 5 application
│   ├── src/
│   │   ├── lib/       # Reusable components and utilities
│   │   ├── routes/    # Application pages and API endpoints
│   │   └── app.html   # App shell
├── backend/           # Go REST API server
│   ├── api/           # HTTP handlers and routing
│   ├── store/         # Database layer
│   └── main.go        # Application entry point
└── docker/            # Container configurations
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Go** 1.21+
- **Docker** (optional)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/my-platform-ui.git
   cd my-platform-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Start development servers:**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually:
   npm run dev:frontend  # http://localhost:5173
   npm run dev:backend   # http://localhost:8080
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

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
