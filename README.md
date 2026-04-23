# Chatti

A full-stack real-time social networking platform with private direct messaging, role-based access control, and a responsive mobile-first interface.

## Description

Chatti is a secure microblogging and messaging platform where users can register, create richly styled posts using custom HTML/CSS, comment on content, and engage in real-time private conversations via WebSockets. The platform features a three-tier role system (User, Manager, Admin) with a dedicated Admin Dashboard for analytics and user management. All user-generated HTML is sanitized server-side using Jsoup to prevent XSS attacks. The frontend is fully responsive, adapting from a bottom-navigation mobile layout to a sidebar-driven desktop experience.

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21, Spring Boot 4 |
| **Security** | Spring Security, JSON Web Tokens (jjwt) |
| **Database** | PostgreSQL, Spring Data JPA |
| **Real-Time** | Spring WebSocket, STOMP Protocol |
| **Frontend** | React 19, Vite 8 |
| **Routing** | React Router v7 |
| **HTTP Client** | Axios |
| **WebSocket Client** | @stomp/stompjs, sockjs-client |
| **Data Visualization** | Recharts |
| **Icons** | Lucide React |
| **Sanitization** | Jsoup |

## Key Features

- **Authentication & Authorization**: Stateless JWT-based registration and login with role claims embedded in the token.
- **Role-Based Access Control (RBAC)**: Three roles — `USER`, `MANAGER`, `ADMIN` — with endpoint-level security enforcement.
- **Global Feed**: Chronological public timeline with search filtering and sorting controls.
- **Rich Post Styling**: Users write posts with custom HTML and inline CSS, sanitized on the backend.
- **Comments System**: Nested comment threads on every post with author-restricted deletion.
- **Real-Time Direct Messaging**: Private peer-to-peer WebSocket chat using STOMP over SockJS with JWT-secured handshakes.
- **Conversation Sidebar**: Persistent chat history with real-time sidebar updates sorted by latest message.
- **User Discovery**: Live search-as-you-type dropdown querying registered users by partial username.
- **Admin Dashboard**: Platform analytics (user/post/comment counts), 7-day post activity chart, and user role management table.
- **Responsive Design**: Mobile-first layout with a fixed bottom navigation bar on small screens and a sidebar on desktop.

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | None |
| POST | `/api/auth/login` | Login and receive JWT | None |

### Posts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/posts` | Get all posts | None |
| POST | `/api/posts` | Create a new post | Bearer |
| PUT | `/api/posts/{id}` | Update a post (author only) | Bearer |
| DELETE | `/api/posts/{id}` | Delete a post (author/manager/admin) | Bearer |

### Comments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/posts/{postId}/comments` | Get comments for a post | None |
| POST | `/api/posts/{postId}/comments` | Add a comment to a post | Bearer |
| DELETE | `/api/posts/{postId}/comments/{commentId}` | Delete a comment (author/manager/admin) | Bearer |

### Chat

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/chat/conversations` | List all conversations for current user | Bearer |
| GET | `/api/chat/history/{username}` | Get message history with a user | Bearer |
| WS | `/app/chat.private` | Send a private message (STOMP) | JWT Header |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/search?query={q}` | Search users by partial username | Bearer |
| GET | `/api/users` | List all users | Admin |
| PUT | `/api/users/{id}/role` | Update a user's role | Admin |

### Admin

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/metrics` | Get platform metrics (counts) | Admin |
| GET | `/api/admin/activity` | Get 7-day post activity data | Admin |

## Team Members & Roles

| Member | Role | Responsibilities |
|---|---|---|
| Ali Nur | Full-Stack Developer | Backend API, Frontend UI, WebSocket integration, Database design, Deployment |

## Prerequisites

- **Java**: JDK 21 or higher
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14 or higher
- **Package Manager**: npm

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```
DB_URL=jdbc:postgresql://localhost:5432/chatti_db
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
JWT_SECRET_KEY=your-256-bit-secret-key
JWT_EXPIRATION_TIME=36000000
VITE_API_BASE_URL=http://localhost:8080/api
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
```

### 3. Create the Database

```bash
psql -U postgres -c "CREATE DATABASE chatti_db;"
```

### 4. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on `http://localhost:8080`.

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

### 6. Access the Application

Open `http://localhost:5173` in your browser. Register a new account or login with the seeded admin credentials defined in your `.env` file.

## Project Structure

```
project/
├── backend/
│   └── src/main/java/com/chatti/backend/
│       ├── config/          (SecurityConfig, WebSocketConfig, DatabaseSeeder)
│       ├── controller/      (Auth, Post, Chat, User, Admin controllers)
│       ├── dto/             (Request/Response data transfer objects)
│       ├── model/           (User, Post, Comment, ChatMessage, Role entities)
│       ├── repository/      (JPA repositories)
│       ├── security/        (JwtUtil, JwtFilter, JwtChannelInterceptor)
│       ├── service/         (AuthService, PostService)
│       └── util/            (HtmlSanitizer)
├── frontend/
│   └── src/
│       ├── components/      (Navbar, ProtectedRoute, AdminRoute)
│       ├── context/         (AuthContext provider)
│       ├── pages/           (Home, Auth, Feed, Profile, Chat, AdminDashboard, etc.)
│       └── api.js           (Axios instance with JWT interceptor)
├── .env.example
├── Chatti.postman_collection.json
└── README.md
```

## Postman Collection

A pre-built Postman collection (`Chatti.postman_collection.json`) is included in the project root. Import it into Postman to test all 16 API endpoints with sample request bodies and collection-level Bearer token authentication.
