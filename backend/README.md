# Contacts Manager - CRUD Web Application

A modern, full-stack contacts management application built with **Next.js**, **Express**, **Prisma**, and **PostgreSQL**. Features include complete CRUD operations, JWT authentication, search, filtering, pagination, and a clean UI powered by Tailwind CSS and shadcn/ui.

## 🚀 Features

### Core Features (Must Have)
- ✅ **Create**: Add new contacts with name, email, and phone
- ✅ **Read**: Display list of contacts and view individual contact details
- ✅ **Update**: Edit existing contact information
- ✅ **Delete**: Remove contacts with confirmation dialog
- ✅ **Validation**: Email format, phone length, and required fields validation
- ✅ **UI/UX**: Clean, modern interface with responsive design
- ✅ **Error Handling**: Clear, user-friendly error messages
- ✅ **Persistence**: Data stored in PostgreSQL database via Prisma ORM
- ✅ **Documentation**: Comprehensive README with setup instructions

### Bonus Features
- ✅ **Search/Filter**: Search contacts by name or email
- ✅ **Pagination**: Server-side pagination for large contact lists
- ✅ **Sorting**: Sort by name, email, or creation date (asc/desc)
- ✅ **Authentication**: JWT-based user authentication
- ✅ **Swagger Documentation**: Interactive API documentation at `/api-docs`
- ✅ **TypeScript**: Full TypeScript support on frontend

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken + bcrypt)
- **Documentation**: Swagger (swagger-ui-express)
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios
- **Notifications**: Sonner

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create new user account
- `POST /api/v1/auth/login` - Login and receive JWT token
- `GET /api/v1/auth/me` - Get current user (requires auth)

### Contacts (All require authentication)
- `POST /api/v1/contacts` - Create a new contact
- `GET /api/v1/contacts` - List contacts (supports pagination, search, sort)
- `GET /api/v1/contacts/:id` - Get single contact details
- `PUT /api/v1/contacts/:id` - Update a contact
- `DELETE /api/v1/contacts/:id` - Delete a contact

### API Documentation
- `GET /api-docs` - Swagger UI documentation

## 🔧 Prerequisites

- **Node.js**: >= 18.x
- **PostgreSQL**: >= 14.x
- **npm** or **pnpm**

## 📦 Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and configure your database:
# DATABASE_URL="postgresql://username:password@localhost:5432/contacts_manager"
# JWT_SECRET="your-secure-secret-key"

# Generate Prisma Client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start the backend server
npm run dev
```

Backend runs on: **http://localhost:4000**

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local

# Start the development server
npm run dev
```

Frontend runs on: **http://localhost:3000**

## 🚦 Running the Application

**Terminal 1 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **Swagger Docs**: http://localhost:4000/api-docs

## 📖 Usage Guide

1. **Create Account**: Navigate to http://localhost:3000 and register
2. **Login**: Sign in with your credentials
3. **Add Contacts**: Click "Add Contact" button
4. **Search**: Use search bar to filter by name/email
5. **Sort**: Use dropdown to sort by name, email, or date
6. **Edit**: Click pencil icon on any contact
7. **Delete**: Click trash icon and confirm

## 🗂️ Project Structure

```
kryoss/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   └── contacts/
│   │   ├── middleware/
│   │   └── routes/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── contexts/
    │   └── lib/
    └── package.json
```

## 🔐 Environment Variables

**Backend (.env):**
```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/contacts_manager"
JWT_SECRET="your-secret-key"
JWT_ACCESS_TOKEN_EXPIRY="7d"
FRONTEND_URL="http://localhost:3000"
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## 👨‍💻 Author

Built as a CRUD Web Developer Assignment