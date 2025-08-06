# E-Commerce Full-Stack Application

A full-stack e-commerce application built with React (TypeScript) frontend and Node.js/Express backend, featuring real-time order notifications, infinite scroll product listing, and asynchronous order processing.

## Features

- **Product Browsing**: Infinite scroll product listing with server-side filtering
- **Filtering**: Filter by category, price range, and search term
- **Product Details**: Detailed view for each product
- **Order Placement**: Simple order form with quantity selection
- **Async Processing**: Orders processed asynchronously with 5-10 second delay
- **Real-time Notifications**: Instant notifications when orders complete
- **Data Persistence**: PostgreSQL database for products and orders
- **Dockerized**: Full Docker support for easy deployment

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Socket.io-client for real-time updates
- React Toastify for notifications
- Axios for API calls
- Infinite Scroll Component

### Backend
- Node.js with Express
- TypeScript
- TypeORM for database management
- PostgreSQL for data storage
- Redis for queue management
- Bull for job processing
- Socket.io for real-time communication

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

3. Seed the database with sample products:
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

3. Create a `.env` file:
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

## Architecture

The application follows a microservices architecture with the following components:

1. **Frontend**: React SPA serving the user interface
2. **Backend API**: Express server handling REST API requests
3. **Worker**: Background job processor for order fulfillment
4. **Database**: PostgreSQL for persistent data storage
5. **Cache/Queue**: Redis for job queue management
6. **WebSocket**: Real-time communication for order notifications

## Order Processing Flow

1. User places an order through the frontend
2. Backend creates order record with "pending" status
3. Order is added to Redis queue for processing
4. Worker picks up the job and simulates processing (5-10s delay)
5. Order status is updated to "completed"
6. Real-time notification sent to frontend via WebSocket
7. User sees toast notification of order completion

## Environment Variables

### Backend
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `PORT`: Backend server port
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_SOCKET_URL`: WebSocket server URL

## Testing

The application can be tested by:

1. Browsing products with infinite scroll
2. Using filters (category, price range, search)
3. Clicking on a product to view details
4. Placing an order
5. Waiting for the real-time notification

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL is running and accessible
- Check database credentials in environment variables

### Redis connection issues
- Ensure Redis is running
- Check Redis host and port configuration

### Frontend not connecting to backend
- Check CORS settings
- Verify API URL in frontend environment variables

### Orders not processing
- Check Redis connection
- Verify worker is running
- Check logs for error messages

## Future Enhancements

- User authentication and "My Orders" page
- Shopping cart functionality
- Payment integration
- Order retry logic
- Dead letter queue for failed orders
- Product reviews and ratings
- Admin dashboard for product management