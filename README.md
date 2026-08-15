# 🎥 ConvoX

> A full-stack real-time video conferencing platform built with React, Node.js, Express, Socket.IO, WebRTC, and MongoDB.

ConvoX is a web-based video conferencing application that enables users to register, authenticate, create or join meeting rooms, communicate through real-time video and audio, and exchange messages through live chat.

The project was built from scratch to understand and implement the fundamentals of **full-stack development, authentication, real-time communication, WebRTC signaling, peer-to-peer media streaming, database integration, and production deployment**.

---

## 🌐 Live Demo

**Frontend:**  
https://convo-x-ten.vercel.app

**Backend:**  
https://convox-backend-1ch6.onrender.com

> The backend root endpoint can be used to verify that the server is running.

---

# 📸 Screenshots



## 🏠 Home Page

![ConvoX Home](./screenshots/home.png)

The landing page provides a simple entry point to the application with dedicated **Login** and **Register** options.

---

## 🔐 Login

![ConvoX Login](./screenshots/login.png)

Users can securely authenticate using their registered username and password.

---

## 📝 Registration

![ConvoX Register](./screenshots/register.png)

New users can create an account with:

- Name
- Username
- Password

Passwords are hashed before being stored in MongoDB.

---

## 📊 Dashboard

![ConvoX Dashboard](./screenshots/dashboard.png)

After authentication, users are redirected to the dashboard where they can start or join a meeting.

---

## 🎥 Video Meeting

![ConvoX Meeting](./screenshots/meeting.png)

The meeting interface provides:

- Real-time video
- Real-time audio
- Multiple participants
- Camera controls
- Microphone controls
- Live chat
- Leave meeting functionality

---

## 💬 Live Chat

![ConvoX Chat](./screenshots/chat.png)

Participants can exchange messages in real time using Socket.IO.

---

# ✨ Features

## Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected application flow

## Meeting

- Create/join meeting rooms
- Room-based communication
- Real-time participant management
- Peer-to-peer video communication
- Peer-to-peer audio communication
- Leave meeting functionality

## Media Controls

- Enable/disable microphone
- Enable/disable camera
- Local video preview
- Remote participant video streams

## Real-Time Chat

- Real-time messaging using Socket.IO
- Sender information
- Message timestamps
- Messages synchronized between participants

## UI

- Dark-themed meeting interface
- Responsive video grid
- Meeting room information
- Participant count
- Dedicated chat panel
- Bottom meeting controls

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on MongoDB Atlas
- Production CORS configuration
- Environment-based configuration
- Vercel SPA routing configuration

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI development |
| Vite | Frontend build tool |
| React Router | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS | Styling |
| Socket.IO Client | Real-time communication |
| WebRTC | Peer-to-peer media communication |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API |
| Socket.IO | Real-time signaling and communication |
| Mongoose | MongoDB object modeling |
| MongoDB Atlas | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| CORS | Cross-origin communication |
| dotenv | Environment configuration |

## Deployment

| Platform | Usage |
|---|---|
| Vercel | Frontend |
| Render | Backend |
| MongoDB Atlas | Database |

---

# 🏗️ Application Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │                      │
                         │   React + Vite       │
                         │   Tailwind CSS       │
                         │   React Router       │
                         └──────────┬───────────┘
                                    │
                    HTTP / Axios    │
                                    ▼
                         ┌──────────────────────┐
                         │       Express        │
                         │       Backend        │
                         │                      │
                         │  REST API            │
                         │  JWT Authentication  │
                         │  CORS                │
                         └───────┬───────┬──────┘
                                 │       │
                         MongoDB │       │ Socket.IO
                                 │       │
                                 ▼       ▼
                    ┌──────────────┐   ┌────────────────┐
                    │ MongoDB Atlas│   │ Socket.IO      │
                    │              │   │ Signaling      │
                    │ Users        │   │ Chat           │
                    └──────────────┘   └───────┬────────┘
                                                │
                                                │ WebRTC
                                                ▼
                                    ┌─────────────────────┐
                                    │    Peer-to-Peer     │
                                    │                     │
                                    │ Video + Audio       │
                                    │                     │
                                    │ User A ◄──────► B   │
                                    └─────────────────────┘
```

---

# 🔄 Application Flow

## 1. Authentication Flow

```text
User
 │
 ▼
Register
 │
 ▼
Express API
 │
 ▼
Check existing username
 │
 ▼
Hash password using bcrypt
 │
 ▼
Save user
 │
 ▼
MongoDB Atlas
```

Login:

```text
User
 │
 ▼
Login
 │
 ▼
Express API
 │
 ▼
Find user
 │
 ▼
Compare password using bcrypt
 │
 ▼
Generate JWT
 │
 ▼
Return token + user information
 │
 ▼
Frontend
```

---

# 🎥 WebRTC Meeting Flow

ConvoX uses WebRTC for peer-to-peer media communication.

The backend does **not** directly stream the video or audio.

Instead, Socket.IO is used for signaling.

```text
User A                         Server                         User B
  │                              │                              │
  │──── join-room ──────────────►│                              │
  │                              │◄──────── join-room ──────────│
  │                              │                              │
  │◄──── room-users ─────────────│                              │
  │                              │                              │
  │──── offer ──────────────────►│────── offer ────────────────►│
  │                              │                              │
  │◄─────────────────────────────│────── answer ────────────────│
  │                              │                              │
  │──── ICE candidate ──────────►│────── ICE candidate ────────►│
  │                              │                              │
  │◄════════════════════════════ WebRTC ═══════════════════════►│
  │                     Video + Audio                           │
```

### Important distinction

Socket.IO is primarily responsible for:

- Room management
- Signaling
- Offers
- Answers
- ICE candidates
- Chat messages
- Participant events

WebRTC is responsible for:

- Audio streaming
- Video streaming
- Peer-to-peer communication

---

# 🔌 Socket Events

The application uses Socket.IO events for real-time communication.

| Event | Purpose |
|---|---|
| `join-room` | User joins a meeting room |
| `room-users` | Sends existing room participants |
| `user-joined` | Notifies users about a new participant |
| `user-left` | Notifies users when someone leaves |
| `offer` | Sends WebRTC offer |
| `answer` | Sends WebRTC answer |
| `ice-candidate` | Exchanges ICE candidates |
| `chat-message` | Sends real-time chat messages |

---

# 🔐 Authentication

ConvoX uses JWT-based authentication.

### Registration

The frontend sends:

```json
{
  "name": "Amit",
  "userName": "amit123",
  "password": "password"
}
```

The backend:

1. Checks whether the username already exists.
2. Hashes the password using bcrypt.
3. Creates the user.
4. Stores the user in MongoDB.

The plain-text password is never stored.

### Login

The backend:

1. Finds the user by username.
2. Compares the supplied password with the bcrypt hash.
3. Generates a JWT.
4. Returns the token and basic user information.

Example response:

```json
{
  "message": "Logged in successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Amit",
    "userName": "amit123"
  }
}
```

---

# 💬 Chat Architecture

Chat messages are handled using Socket.IO.

```text
User A
  │
  │ chat-message
  ▼
Socket.IO Server
  │
  │ broadcast
  ▼
User A + User B + Other Participants
```

Messages contain:

- Sender
- Message content
- Timestamp

---

# 📁 Project Structure

```text
ConvoX/
│
├── backend/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── socketManager.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── models/
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   └── user.routes.js
│   │   │
│   │   └── app.js
│   │
│   ├── package.json
│   └── ...
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   └── meeting/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Meeting.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── socket.js
│   │   │   └── webrtc.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── vercel.json
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# ⚙️ Local Development

## Prerequisites

Make sure you have:

- Node.js
- npm
- MongoDB Atlas account
- Git

---

# 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/AmitNishad314/ConvoX.git
```

Navigate into the project:

```bash
cd ConvoX
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

Backend:

```text
http://localhost:3000
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start Vite:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend

| Variable | Description |
|---|---|
| `PORT` | Port used by Express |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `CLIENT_URL` | Frontend URL |

Example:

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/test
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

## Frontend

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |

Example:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Production

The production frontend uses the deployed backend:

```env
VITE_API_BASE_URL=https://convox-backend-1ch6.onrender.com
```

---

# 🌐 Production Deployment

## Frontend

The frontend is deployed using **Vercel**.

Production URL:

```text
https://convo-x-ten.vercel.app
```

Important Vercel configuration:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

The project uses a Vercel rewrite configuration to support React Router routes such as:

```text
/login
/register
/dashboard
/meeting/:roomId
```

`frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Backend

The backend is deployed using **Render**.

Production URL:

```text
https://convox-backend-1ch6.onrender.com
```

Configuration:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Environment variables are configured directly in Render.

---

## Database

MongoDB Atlas is used as the production database.

The application connects using:

```js
mongoose.connect(process.env.MONGO_URI);
```

The MongoDB credentials are never committed to GitHub.

---

# 🔒 Security Considerations

The project follows several basic security practices:

### Password hashing

Passwords are hashed using bcrypt before storage.

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

### JWT

Authentication tokens are signed using a secret stored in an environment variable.

```js
jwt.sign(payload, process.env.JWT_SECRET);
```

### Environment variables

Sensitive information such as:

- MongoDB credentials
- JWT secret
- Production configuration

is stored in environment variables.

`.env` files are excluded from Git using `.gitignore`.

---

# 🐞 Development Challenges & Solutions

Building ConvoX involved solving several real-world development problems.

## 1. MongoDB Username Field Mismatch

### Problem

The Mongoose schema initially used:

```js
username
```

while the application was using:

```js
userName
```

MongoDB generated a unique index for the wrong field.

This caused:

```text
E11000 duplicate key error
username_1 dup key: { username: null }
```

### Solution

The schema was corrected to consistently use:

```js
userName
```

The outdated MongoDB index was also addressed.

---

## 2. Local MongoDB vs MongoDB Atlas

Initially, the local `mongosh` instance was inspected, while the application was actually connected to MongoDB Atlas.

This caused confusion when checking users.

### Lesson

Always verify the database connection being used by the application before debugging database data.

The backend eventually logged:

```text
Database: test
Host: ac-...mongodb.net
MongoDB Connected
```

which confirmed the application was using MongoDB Atlas.

---

## 3. Nodemon Restart Loop

At one point, the backend repeatedly showed:

```text
[nodemon] restarting due to changes...
[nodemon] starting `node src/app.js`
```

This was investigated using:

```bash
npx nodemon --verbose src/app.js
```

The issue was related to the development environment/file watching rather than the Express application itself.

---

## 4. `simple-peer` Browser Compatibility

An attempt was made to use `simple-peer` for WebRTC.

This produced browser compatibility errors involving Node modules such as:

```text
global
events.EventEmitter
randombytes
```

and Vite externalization warnings.

### Decision

Instead of spending more time fighting the dependency compatibility layer, the project moved to the browser's native:

```text
RTCPeerConnection
```

API.

### Why

This kept the project:

- Simpler
- More educational
- Closer to the underlying WebRTC API
- Easier to explain in interviews

This was an important architectural decision for the project.

---

# 🧠 WebRTC Learning

One of the main goals of ConvoX was understanding how browser-based video conferencing actually works.

The implementation helped explore:

- `getUserMedia()`
- `MediaStream`
- `MediaStreamTrack`
- `RTCPeerConnection`
- SDP offers
- SDP answers
- ICE candidates
- WebRTC signaling
- Peer-to-peer media transmission

The application uses Socket.IO as the signaling layer while WebRTC handles the actual media connection.

---

# 🔧 Production Deployment Problems

## 1. Render Dependency Error

Initial deployment produced:

```text
Cannot find package 'express'
```

### Cause

The Render build configuration was incorrect.

### Solution

The backend service was configured with:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

---

## 2. MongoDB Authentication Error

Render initially reported:

```text
bad auth : authentication failed
```

### Solution

The MongoDB Atlas database user's credentials were verified and updated.

The correct connection string was then stored in Render as:

```text
MONGO_URI
```

---

## 3. Frontend API URL

Initially, the production frontend attempted to send requests to its own Vercel domain:

```text
https://convo-x-ten.vercel.app/users/register
```

instead of the backend.

### Solution

The Vercel environment variable was configured:

```env
VITE_API_BASE_URL=https://convox-backend-1ch6.onrender.com
```

---

## 4. CORS Error

Production requests initially failed with:

```text
Access-Control-Allow-Origin
```

errors.

The backend was configured to correctly handle production browser origins.

The final configuration allows requests from the deployed frontend while maintaining credentials support.

---

## 5. React Router 404 on Vercel

Opening:

```text
/register
```

directly initially resulted in:

```text
404 Not Found
```

### Cause

Vercel was treating the React route as a server-side path.

### Solution

A `vercel.json` rewrite was added:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This allows React Router to handle client-side routes.

---

## 6. Filename Case Sensitivity

The local project contained:

```text
Videoplayer.jsx
```

while the code imported:

```js
import VideoPlayer from "../components/VideoPlayer";
```

This worked locally because macOS commonly uses a case-insensitive filesystem.

Vercel's Linux build environment is case-sensitive.

### Error

```text
Could not resolve "../components/VideoPlayer"
```

### Solution

The filename was changed to:

```text
VideoPlayer.jsx
```

This highlighted an important difference between local development and Linux production environments.

---

# 📈 Development Journey

The project was developed incrementally rather than being built as a single implementation.

## Stage 1 — Project Initialization

- Created frontend using React + Vite.
- Created Node.js + Express backend.
- Configured project structure.
- Added Tailwind CSS.
- Connected frontend and backend.

---

## Stage 2 — Database Integration

- Added Mongoose.
- Connected MongoDB Atlas.
- Created User schema.
- Implemented user persistence.

---

## Stage 3 — Authentication

Implemented:

- Registration
- Login
- bcrypt password hashing
- JWT authentication
- Authentication context

---

## Stage 4 — Dashboard

Created a dashboard for authenticated users.

Implemented:

- Meeting creation
- Meeting joining
- Room IDs
- Navigation between application pages

---

## Stage 5 — Socket.IO

Added Socket.IO to the backend.

Implemented:

- Socket connections
- Room management
- Participant tracking
- Join/leave events

---

## Stage 6 — WebRTC

Implemented browser-native WebRTC.

Added:

- `RTCPeerConnection`
- Media capture
- SDP offer/answer exchange
- ICE candidate exchange
- Remote stream handling

---

## Stage 7 — Audio + Video

The application was extended from basic video functionality to full audio/video communication.

Users can:

- See remote participants
- Hear remote participants
- Share their microphone
- Share their camera

---

## Stage 8 — Live Chat

Socket.IO was extended to support real-time messaging.

Features:

- Sender information
- Message content
- Timestamp
- Real-time delivery

---

## Stage 9 — Media Controls

Added:

- Microphone mute/unmute
- Camera on/off
- Leave meeting

These controls operate directly on the local `MediaStreamTrack`.

---

## Stage 10 — UI Redesign

The basic meeting interface was redesigned into a more professional conferencing UI.

The redesign introduced:

- Video grid
- Participant count
- Chat sidebar
- Bottom control bar
- Dark theme
- Better spacing
- Responsive layout

---

## Stage 11 — Landing Page

A dedicated landing page was added with:

- ConvoX branding
- Application description
- Register button
- Login button

---

## Stage 12 — Production Deployment

The application was deployed using:

```text
Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
```

Production issues involving:

- Dependencies
- MongoDB authentication
- Environment variables
- CORS
- SPA routing
- Filename case sensitivity

were identified and resolved.

---

# 🧪 Testing Checklist

## Authentication

- [x] Register new user
- [x] Prevent duplicate usernames
- [x] Login with valid credentials
- [x] Reject invalid credentials

## Meeting

- [x] Create meeting
- [x] Join meeting
- [x] Multiple participants
- [x] Video streaming
- [x] Audio streaming
- [x] Leave meeting

## Controls

- [x] Mute microphone
- [x] Unmute microphone
- [x] Turn camera off
- [x] Turn camera on

## Chat

- [x] Send message
- [x] Receive message
- [x] Display sender
- [x] Display timestamp

## Production

- [x] Frontend deployment
- [x] Backend deployment
- [x] MongoDB Atlas connection
- [x] Production API communication
- [x] Production CORS
- [x] React Router refresh handling

---

# 🚧 Current Limitations

The current version intentionally focuses on the core conferencing experience.

The following features are not currently implemented:

- Screen sharing
- Meeting recording
- File sharing
- Virtual backgrounds
- Meeting scheduling
- Persistent meeting history
- Waiting room
- Host/admin controls
- Reactions/emojis
- Push notifications
- TURN server configuration for difficult network environments

These can be considered for future versions.

---

# 🗺️ Future Roadmap

## Version 1.1

- [ ] Improve dashboard UI
- [ ] Improve authentication pages
- [ ] Add user avatars
- [ ] Add participant names
- [ ] Improve chat auto-scroll
- [ ] Add copy meeting link
- [ ] Add toast notifications
- [ ] Improve loading states

## Version 1.2

- [ ] Screen sharing
- [ ] Meeting history
- [ ] Persistent chat history
- [ ] Host controls
- [ ] Participant removal
- [ ] Join/leave notifications

## Version 2.0

- [ ] Meeting recording
- [ ] File sharing
- [ ] Virtual backgrounds
- [ ] Meeting scheduling
- [ ] Calendar integration
- [ ] Advanced WebRTC infrastructure
- [ ] TURN server support

---

# 💡 What I Learned

Building ConvoX helped develop practical understanding of several concepts beyond simply writing CRUD APIs.

### Frontend

- React component architecture
- React Router
- State management
- Context API
- Asynchronous requests
- Environment variables
- Vite production builds
- Responsive UI development

### Backend

- Express API design
- Middleware
- Authentication
- JWT
- Password hashing
- MongoDB/Mongoose
- CORS
- Environment configuration

### Real-Time Systems

- Socket.IO
- WebSocket-style communication
- Room management
- Event-driven architecture

### WebRTC

- Media devices
- Media streams
- Peer connections
- SDP
- Signaling
- ICE candidates
- Peer-to-peer communication

### Deployment

- Git/GitHub workflows
- Vercel
- Render
- MongoDB Atlas
- Production environment variables
- CORS configuration
- Linux case sensitivity
- SPA deployment

---

# 📚 API Endpoints

## Authentication

### Register

```http
POST /users/register
```

Request:

```json
{
  "name": "Amit",
  "userName": "amit123",
  "password": "password"
}
```

---

### Login

```http
POST /users/login
```

Request:

```json
{
  "userName": "amit123",
  "password": "password"
}
```

---

## Health Check

```http
GET /
```

Response:

```json
{
  "success": true,
  "message": "ConvoX Backend Running"
}
```

---

# 📦 Important Dependencies

## Frontend

```text
react
react-dom
react-router-dom
axios
socket.io-client
tailwindcss
vite
```

## Backend

```text
express
mongoose
socket.io
jsonwebtoken
bcrypt
cors
dotenv
http-status
```

---

# 🔀 Git Workflow

The project was developed using Git for version control.

Typical workflow:

```bash
git status

git add .

git commit -m "Your commit message"

git push origin main
```

The production deployments are connected to the GitHub repository, allowing changes pushed to `main` to trigger new deployments.

---

# 🔒 Environment Files

Environment files should **never** be committed to GitHub.

The repository `.gitignore` excludes:

```text
.env
.env.*
**/.env
**/.env.*
node_modules/
dist/
build/
```

This prevents secrets and generated files from being accidentally uploaded.

---

# 🚀 Running the Project Locally

Start backend:

```bash
cd backend
npm install
npm run dev
```

Start frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🎯 Project Goals

The main goal of ConvoX was not simply to create another video conferencing UI.

The project was designed to gain practical experience with:

```text
React
   ↓
REST APIs
   ↓
Authentication
   ↓
MongoDB
   ↓
Socket.IO
   ↓
WebRTC
   ↓
Real-Time Communication
   ↓
Production Deployment
```

The project therefore combines several important full-stack concepts into one application.

---

# 🏆 Project Status

**Current Version: `v1.0.0`**

### Status

🟢 **Production Deployed**

The current release provides a functional real-time conferencing experience with authentication, video, audio, chat, and meeting controls.

---

# 🤝 Contributing

Contributions and suggestions are welcome.

To contribute:

```bash
git clone https://github.com/AmitNishad314/ConvoX.git
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, commit them, and open a pull request.

---

# 📄 License

This project is currently available for educational and portfolio purposes.

---

# 👨‍💻 Author

## Amit Nishad

B.Tech Student — Biotechnology & Bioinformatics

Interested in:

- Software Development
- Data Structures & Algorithms
- Full-Stack Development
- Machine Learning
- Artificial Intelligence

### GitHub

https://github.com/AmitNishad314

### Project

https://github.com/AmitNishad314/ConvoX

### Live Demo

https://convo-x-ten.vercel.app

---

# ⭐ Acknowledgements

This project was built as a hands-on learning project to understand modern full-stack and real-time web technologies.

Special focus was placed on understanding the underlying concepts rather than relying entirely on high-level abstractions.

---

# 📌 Final Note

ConvoX started as a basic full-stack application and gradually evolved into a production-deployed real-time communication platform.

The development process covered the complete journey:

```text
Idea
 ↓
Project Setup
 ↓
Authentication
 ↓
Database
 ↓
Dashboard
 ↓
Socket.IO
 ↓
WebRTC
 ↓
Video + Audio
 ↓
Live Chat
 ↓
Meeting Controls
 ↓
UI Redesign
 ↓
Production Deployment
 ↓
Real-World Debugging
 ↓
v1.0.0
```

The project is intentionally kept focused on the core conferencing experience, providing a strong foundation for future improvements while maintaining a codebase that is understandable and explainable from an engineering perspective.