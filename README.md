# Secure Management System with NestJS & Prisma

A comprehensive waste management system built with NestJS, Prisma ORM, and PostgreSQL, featuring role-based access control (RBAC) and attribute-based access control (ABAC) security policies.

## 🏗️ Architecture Overview

This system implements a secure multi-role architecture with the following components:

- **NestJS** - Progressive Node.js framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **JWT Authentication** - Secure token-based auth
- **RBAC + ABAC** - Multi-layered security system

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mishaelx6/Authentication-with-Nest-js.git
   cd Authentication-with-Nest-js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start PostgreSQL database**
   ```bash
   docker compose up -d
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Seed the database**
   ```bash
   npm run seed
   ```

7. **Start the application**
   ```bash
   npm run start:dev
   ```

The server will be running on `http://localhost:3000`

## 📊 Database Schema

### Models

- **User**: Authentication and role management
- **Estate**: Property/estate information
- **WasteLog**: Waste collection tracking

### User Roles

- **ADMIN**: Full system access
- **RESIDENT**: Estate-specific access
- **RIDER**: Waste collection operations

## 🔐 Security Architecture

### Authentication

- JWT-based authentication with secure token generation
- Password hashing with bcryptjs
- Token expiration management

### Authorization

#### RBAC (Role-Based Access Control)

```typescript
@Roles(Role.ADMIN, Role.RIDER)
@UseGuards(RolesGuard)
```

#### ABAC (Attribute-Based Access Control)

```typescript
@Policy(PolicyAction.QUERY_WASTE_LOGS)
@UseGuards(PolicyGuard)
```

### Security Policies

1. **Residents**: Can only query WasteLogs from their estate
2. **Riders**: Can only update their own WasteLogs
3. **Admins**: Full access to all operations

## 🛠️ API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| GET | `/auth/profile` | Get user profile |

### Waste Management

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/waste-logs` | All | Query waste logs (filtered by role) |
| POST | `/waste-logs` | ADMIN, RIDER | Create waste log |
| GET | `/waste-logs/:id` | All | Get specific waste log |
| PATCH | `/waste-logs/:id` | ADMIN, RIDER | Update waste log |
| DELETE | `/waste-logs/:id` | ADMIN | Delete waste log |
| GET | `/waste-logs/stats` | All | Get waste statistics |

## 📱 Example Usage

### Login as Admin

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@abujaestate.com", "password": "admin123"}'
```

### Create Waste Log (Rider)

```bash
curl -X POST http://localhost:3000/waste-logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "PENDING"}'
```

### Query Waste Logs (Resident)

```bash
curl -X GET "http://localhost:3000/waste-logs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Test Data

The seed script creates the following test users:

| Role | Email | Password |
|-------|-------|----------|
| Admin | admin@abujaestate.com | admin123 |
| Resident | resident@abujaestate.com | resident123 |
| Rider | rider@abujaestate.com | rider123 |

## 🔧 Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_nestjs"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 🏛️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   ├── roles.guard.ts
│   ├── policy.guard.ts
│   └── ...
├── waste-log/           # Waste management module
│   ├── waste-log.service.ts
│   ├── waste-log.controller.ts
│   └── waste-log.module.ts
├── prisma/              # Database module
│   ├── prisma.service.ts
│   └── prisma.module.ts
└── app.module.ts        # Root module
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker Deployment

```bash
docker build -t auth-nestjs .
docker run -p 3000:3000 auth-nestjs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions and support:

- Create an issue on GitHub
- Check the [NestJS Documentation](https://docs.nestjs.com)
- Visit the [Prisma Documentation](https://www.prisma.io/docs)





