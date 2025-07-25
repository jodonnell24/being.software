# Development Environment Setup 

```bash
# Run the setup script
./scripts/setup-dev.sh

# Start development servers
npm run dev
```

```bash
# Build and start with Docker Compose
docker-compose -f docker-compose.dev.yml up --build

# Or start in background
docker-compose -f docker-compose.dev.yml up -d --build
```


```bash
k3d cluster create my-platform-dev \
  --port "8080:30080@loadbalancer" \
  --port "8443:30443@loadbalancer" \
  --agents 1

kubectl get nodes
kubectl create namespace test-apps
```

```bash
# Install K3s on your test machine
curl -sfL https://get.k3s.io | sh -

# Get kubeconfig for remote access
sudo cat /etc/rancher/k3s/k3s.yaml

# On your dev machine, add the cluster to kubeconfig
# Replace SERVER_IP with your test machine IP
kubectl config set-cluster k3s-test \
  --server=https://SERVER_IP:6443 \
  --certificate-authority-data=CERT_DATA

kubectl config set-context k3s-test \
  --cluster=k3s-test \
  --user=k3s-test

kubectl config use-context k3s-test
```

#### 1. Ansible Cloud Setup
Create this structure for cloud deployment:
```
ansible/
├── inventory/
│   ├── development.yml
│   └── production.yml
├── playbooks/
│   ├── k3s-cluster.yml
│   └── platform-deploy.yml
└── roles/
    ├── k3s/
    └── platform/
```


- Backend & Frontend: Native
- Database & Redis: Docker containers
```bash
# Start only infrastructure
docker-compose -f docker-compose.dev.yml up postgres redis -d

# Run apps natively
npm run dev
```

## **Environment Configuration**

### **Local Development**
```bash
# .env
VITE_API_URL=http://localhost:8081

# backend environment
PORT=8081
DB_HOST=localhost
DB_PORT=5432
```

### **Docker Development**
```bash
# .env
VITE_API_URL=http://localhost:8081

# backend connects to docker postgres
DB_HOST=postgres
DB_PORT=5432
```


### **1. Local K3d Testing**
```bash
# Build your platform
docker build -t my-platform:dev .

# Import to K3d
k3d image import my-platform:dev -c my-platform-dev

# Deploy test apps
kubectl apply -f examples/test-deployments/
```

### **2. On-Prem K3s Testing**
```bash
# Build and push to registry or copy image
docker save my-platform:dev | gzip > platform.tar.gz
scp platform.tar.gz user@test-machine:~
ssh user@test-machine "gunzip -c platform.tar.gz | sudo k3s ctr images import -"
```


## **Security Considerations**

### **Development**
- Use development certificates
- Local-only database access
- Debug logging enabled

### **Testing Clusters**
- Separate namespaces for isolation
- Resource quotas
- Network policies testing

### **Production**
- Proper TLS certificates
- Encrypted secrets
- RBAC configuration
- Network security

---