# 🐳 Royal Bricks - Docker Deployment Guide

## Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Start All Services

```bash
# Development mode
docker-compose up -d

# Production mode
docker-compose -f docker-compose.prod.yml up -d
```

Access the application:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Architecture

The application runs in 3 containers:

1. **MongoDB** (Port 27017) - Database
2. **Backend** (Port 5000) - Node.js API
3. **Frontend** (Port 80) - React SPA served by Nginx

## Commands

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build without cache
docker-compose build --no-cache
```

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v

# Restart a service
docker-compose restart backend
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Check Status

```bash
# Service status
docker-compose ps

# Health checks
docker-compose ps --format json | jq '.[].Health'

# Resource usage
docker stats
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# MongoDB shell
docker-compose exec mongodb mongosh royal-bricks

# View backend environment
docker-compose exec backend env
```

## Environment Variables

### Development
Edit `docker-compose.yml` directly or create `.env` file:

```env
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
VITE_API_URL=http://localhost:5000/api
```

### Production
Copy and edit the example file:

```bash
cp docker/.env.example docker/.env
# Edit docker/.env with your production values
```

Then use:
```bash
docker-compose -f docker-compose.prod.yml --env-file docker/.env up -d
```

## Database Management

### Backup Database

```bash
# Create backup
docker-compose exec mongodb mongodump --db=royal-bricks --out=/data/backup

# Copy backup to host
docker cp royal-bricks-mongodb:/data/backup ./backup
```

### Restore Database

```bash
# Copy backup to container
docker cp ./backup royal-bricks-mongodb:/data/backup

# Restore
docker-compose exec mongodb mongorestore --db=royal-bricks /data/backup/royal-bricks
```

### Seed Database

```bash
# Seed admin user
docker-compose exec backend node scripts/seedAdmin.js

# Seed products
docker-compose exec backend node scripts/seedProducts.js
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check if port is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Database Connection Issues

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec backend node -e "require('./config/database.js')"
```

### Frontend Not Loading

```bash
# Check nginx logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Clear Everything and Start Fresh

```bash
# Stop all containers
docker-compose down -v

# Remove all images
docker rmi $(docker images 'royal-bricks*' -q)

# Rebuild and start
docker-compose build
docker-compose up -d
```

## Production Deployment

### On VPS/Server

1. **Install Docker & Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd royal-bricks
   ```

3. **Configure Environment**
   ```bash
   cp docker/.env.example docker/.env
   nano docker/.env  # Edit with production values
   ```

4. **Start Services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Check Status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### With Nginx Reverse Proxy

If you want to use a domain with SSL:

```nginx
# /etc/nginx/sites-available/royalbricks.com
server {
    listen 80;
    server_name royalbricks.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then use Certbot for SSL:
```bash
sudo certbot --nginx -d royalbricks.com
```

## Performance Optimization

### Image Sizes
- Backend: ~150MB (Node Alpine + dependencies)
- Frontend: ~25MB (Nginx Alpine + built files)
- MongoDB: ~700MB (Official image)

### Resource Limits (Production)
- Backend: 512MB RAM, 1 CPU
- Frontend: 256MB RAM, 0.5 CPU
- MongoDB: 1GB RAM, 1 CPU

### Scaling

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Use load balancer (nginx/traefik) to distribute traffic
```

## Security Best Practices

1. **Change Default Credentials** - Update admin password
2. **Use Secrets** - Don't commit `.env` files
3. **Update Regularly** - Keep images updated
4. **Network Isolation** - Use custom networks
5. **Resource Limits** - Prevent resource exhaustion
6. **Read-only Filesystem** - Where possible
7. **Non-root User** - Backend runs as `nodejs` user

## Monitoring

### Health Checks

All services have health checks:
```bash
docker inspect royal-bricks-backend | jq '.[].State.Health'
```

### Logs

```bash
# Stream all logs
docker-compose logs -f

# Export logs
docker-compose logs > logs.txt
```

### Metrics

Use Docker stats:
```bash
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose build
      
      - name: Push to registry
        run: |
          docker tag royal-bricks-backend username/royal-bricks-backend
          docker push username/royal-bricks-backend
```

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Restart services: `docker-compose restart`
- See main README.md for application documentation

---

**Happy Dockerizing! 🐳**
