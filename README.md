# MicroBlog: Minimalist Social Network

## 1. Project Title & Overview
MicroBlog is a minimalist microblogging platform designed to support a global feed structure. A core value proposition of the platform is the ability for users to construct visually unique posts by safely injecting basic structural HTML (`<div>`, `<span>`, `<b>`, `<i>`) and inline CSS styles (`style="..."`). This enables high customizability per post while mitigating security risks.

## 2. Tech Stack
**Backend**:
- Java 21
- Spring Boot (Spring Web, Spring Data JPA)
- Spring Security
- JSON Web Tokens (jjwt)
- H2 Database (In-Memory)
- Jsoup (HTML Sanitization)

**Frontend**:
- Vue.js 3 (Composition API)
- Vite
- Vue Router
- Axios

## 3. Key Features
- **Stateless Authentication**: End-to-end JWT-based registration and login system with secure route guards.
- **Global Public Feed**: A unified chronological timeline displaying all user activity across the platform.
- **Rich Custom Styling**: Users formulate posts using raw HTML and CSS. The backend strictly sanitizes input using Jsoup relaxed safelists, neutralizing `<script>` injection and cross-site scripting (XSS) attacks.
- **Author-Restricted CRUD**: Users maintain full control over their content with real-time UI updates. PUT and DELETE operations are protected via strict Spring Security authorization, verifying JWT claims against the persistent database to guarantee that only the original author can edit or remove a post.

## 4. Prerequisites
- **Java**: JDK 21 or higher.
- **Node.js**: v18.0.0 or higher.
- **Package Manager**: npm or yarn.

## 5. Local Setup & Execution

### Backend Initialization
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application (defaults to port 8080):
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Initialization
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server (defaults to port 5173):
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:5173`.

## 6. Future Enhancements
- **Relational Database Migration**: Transition from H2 to PostgreSQL for durable, production-grade data persistence.
- **Social Graph Implementation**: Introduce "Follow" relationships algorithms to transition from a global feed to personalized timelines.
- **Media Support**: Integrate AWS S3 or a similar blob storage solution for image and video attachments.
- **Real-Time Delivery**: Implement WebSockets (e.g., Spring WebSocket/STOMP) to push new posts and edits to connected clients instantaneously.
