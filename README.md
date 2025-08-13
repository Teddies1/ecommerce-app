# E-Commerce Full-Stack Application

## Tech Stack Used

### Frontend
- React with TypeScript

### Backend
- Node.js with Express
- PostgreSQL for data storage

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-app
```

2. Start all services:
```bash
docker-compose up -d
```

3. Seed the database with sample data:
```bash
docker-compose --profile seed run seed
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Local Development

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file inside the /backend directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=5000
FRONTEND_URL=http://localhost:3000
```
Note: Since this repository is using dummy data the .env file will be pasted here in plaintext. Normally .env files in production settings are secretive and should be stored in a secure environment like a password management website.

4. Start PostgreSQL and Redis (using Docker):
```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15-alpine
docker run -d -p 6379:6379 redis:7-alpine
```

5. Run database seed:
```bash
npm run seed
```

6. Start the backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
npm start
```

## API Endpoints

### Products
- `GET /api/products` - Get paginated products with filtering
  - Query params: `page`, `limit`, `category`, `minPrice`, `maxPrice`, `search`
- `GET /api/products/:id` - Get product by ID

### Orders
- `POST /api/orders` - Create new order
  - Body: `{ productId, quantity, customerName, customerEmail }`
- `GET /api/orders/:id` - Get order by ID

## Docker Commands

### Start all services:
```bash
docker-compose up -d
```

### Stop all services:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f [service-name]
```

### Rebuild services:
```bash
docker-compose build
```

### Run database seed:
```bash
docker-compose --profile seed run seed
```

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL is running and accessible
- Check database credentials in environment variables
- Stop any running processes that use PostgreSQL or uses the port number 5432.

### Redis connection issues
- Ensure Redis is running
- Check Redis host and port configuration
- Stop any running processes that use Redis or uses the port number 6379.

### Docker permission issues
- Ensure Docker has the appropriate permissions on your machine.
