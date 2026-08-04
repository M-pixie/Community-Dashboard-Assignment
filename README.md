# CommuniDash - Community Engagement Dashboard

A modern, production-ready SaaS dashboard for community managers to monitor member engagement, identify inactive users, and analyze activity. Built as a technical assessment exceeding typical assignment requirements with premium UI and architecture.

## Features
- **Premium Dashboard**: Animated metrics cards, trend indicators, and beautiful charts.
- **Member Management**: Search, sort, paginate, and filter members seamlessly.
- **Detailed Profiles**: Deep dive into individual member activities, event participation, and engagement score distribution.
- **Data Export**: Export filtered member data to CSV instantly.
- **Zero-Config Local Dev**: Powered by `mongodb-memory-server`, no local database setup required to test the application!
- **Dark Mode**: Native dark mode support using `next-themes`.
- **Responsive Design**: Polished experience across Desktop, Tablet, and Mobile.

## Tech Stack
### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui & Radix UI
- Framer Motion
- Recharts
- React Query & Axios
- Lucide Icons
- Sonner Toasts

### Backend
- Node.js & Express
- TypeScript
- MongoDB & Mongoose
- mongodb-memory-server (Local dev fallback)
- @faker-js/faker (Data Seeding)

## Installation & Setup

### Prerequisites
- Node.js v18+ 
- npm

### 1. Clone the repository
```bash
# Clone your repository
cd "Community Dashboard"
```

### 2. Backend Setup
```bash
cd backend
npm install
# Start the backend server on http://localhost:5000
npm run dev
```
*Note: The backend will automatically provision an in-memory MongoDB instance and seed 100 realistic members with activities on first startup if no `MONGO_URI` is provided in `.env`.*

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
# Start the frontend Next.js app on http://localhost:3000
npm run dev
```

## Environment Variables
The application runs out of the box without any `.env` files thanks to the in-memory fallback. For production or persistent data, you can create these files:

**`backend/.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/community
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get aggregate community stats and charts data. |
| GET | `/api/members` | Get paginated members list. Supports `page`, `limit`, `search`, `status`, `sortBy`, `sortOrder`. |
| GET | `/api/members/:id` | Get details for a specific member, including recent activities. |

## Project Structure
```text
Community Dashboard/
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middlewares/      # Error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Seeder scripts
│   │   └── index.ts          # Application entry point
├── frontend/                 # Next.js App
│   ├── src/
│   │   ├── app/              # Next.js App router (pages, layouts)
│   │   ├── components/       # UI Components (shadcn, layout)
│   │   ├── hooks/            # Custom React Query & debounce hooks
│   │   ├── lib/              # Utils, Axios config
│   │   └── providers/        # React Query & Theme providers
└── README.md
```

## Future Improvements
- Implement JWT Authentication and user roles.
- Add WebSocket support for real-time activity feeds.
- Create automated End-to-End tests using Playwright.
- Connect to MongoDB Atlas for persistent cloud data storage.
