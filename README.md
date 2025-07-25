# My Platform

A full-stack web application with SvelteKit frontend and Go backend.

## 🏗️ Architecture

```
my-platform/
├── frontend/          # SvelteKit application
├── backend/           # Go REST API server
├── .github/workflows/ # CI/CD pipelines
├── docker-compose.yml # Development environment
└── package.json       # Workspace management
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Go 1.21+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd my-platform
   npm install
   cd frontend && npm install
   ```

2. **Start development servers:**
   ```bash
   # Option 1: Run both frontend and backend
   npm run dev
   
   # Option 2: Run individually
   npm run dev:frontend  # Frontend on http://localhost:5173
   npm run dev:backend   # Backend on http://localhost:8080
   
   # Option 3: Use Docker
   docker-compose up
   ```

## 📁 Project Structure

### Frontend (`/frontend`)
- **Framework:** SvelteKit
- **Styling:** CSS with custom theming
- **Build Tool:** Vite
- **Key Features:**
  - Responsive UI components
  - Secure form handling
  - Error boundaries
  - Theme system

### Backend (`/backend`)
- **Language:** Go
- **Architecture:** REST API
- **Key Features:**
  - HTTP routing
  - Database integration
  - Security middleware

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run build` | Build both applications |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all code |
| `npm run docker:up` | Start with Docker Compose |

## 🚀 Deployment

### CI/CD Pipeline
The project includes GitHub Actions workflows for:
- **Testing:** Automated tests for both frontend and backend
- **Linting:** Code quality checks
- **Building:** Production builds
- **Docker:** Container builds and registry push
- **Deployment:** Automated deployment to production

### Manual Deployment
```bash
# Build for production
npm run build

# Backend binary will be in: backend/app
# Frontend build will be in: frontend/build/
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in respective directories:

**Frontend (`.env`):**
```
VITE_API_URL=http://localhost:8080
```

**Backend (`.env`):**
```
PORT=8080
DATABASE_URL=...
```

## 📝 Development Workflow

1. **Feature Development:**
   - Create feature branch: `git checkout -b feature/your-feature`
   - Develop and test locally
   - Run tests: `npm test`
   - Commit changes

2. **Code Quality:**
   - Lint code: `npm run lint`
   - Fix any issues before committing

3. **Pull Request:**
   - Push to GitHub
   - Create PR to `main` branch
   - CI/CD will run automatically

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary.
