#!/bin/bash

# Development Environment Setup Script
set -e

echo "Setting up My Platform UI Development Environment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check Go
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed. Please install Go 1.21+ first."
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Setup environment files
setup_env_files() {
    print_status "Setting up environment files..."
    
    # Create .env for development
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
    else
        print_warning ".env file already exists, skipping..."
    fi
    
    # Create frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
VITE_API_URL=http://localhost:8081
NODE_ENV=development
EOF
        print_success "Created frontend/.env file"
    else
        print_warning "frontend/.env file already exists, skipping..."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    
    # Download Go dependencies
    cd backend
    go mod download
    cd ..
    
    print_success "Dependencies installed!"
}

# Setup local K3d cluster
setup_k3d_cluster() {
    print_status "Setting up local K3d cluster for testing..."
    
    if ! command -v k3d &> /dev/null; then
        print_warning "k3d is not installed. Installing k3d..."
        curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
    fi
    
    # Create cluster if it doesn't exist
    if ! k3d cluster list | grep -q "my-platform-dev"; then
        print_status "Creating K3d cluster 'my-platform-dev'..."
        k3d cluster create my-platform-dev \
            --port "8080:30080@loadbalancer" \
            --port "8443:30443@loadbalancer" \
            --agents 1
        print_success "K3d cluster created!"
    else
        print_warning "K3d cluster 'my-platform-dev' already exists"
    fi
    
    # Set kubectl context
    k3d kubeconfig merge my-platform-dev --kubeconfig-switch-context
    print_success "Kubectl context set to my-platform-dev"
}

# Main setup function
main() {
    echo "=========================================="
    echo "  My Platform UI Development Setup"
    echo "=========================================="
    echo
    
    check_prerequisites
    echo
    
    setup_env_files
    echo
    
    install_dependencies
    echo
    
    # Ask if user wants to setup K3d
    read -p "Do you want to set up a local K3d cluster for testing? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_k3d_cluster
        echo
    fi
    
    print_success "Development environment setup complete!"
    echo
    echo "🎉 Next steps:"
    echo "   1. Run 'npm run dev' to start both frontend and backend"
    echo "   2. Or run 'docker-compose -f docker-compose.dev.yml up' for containerized development"
    echo "   3. Visit http://localhost:5173 for the frontend"
    echo "   4. API will be available at http://localhost:8081"
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   5. Your K3d cluster is ready: kubectl get nodes"
    fi
    echo
}

main "$@"
