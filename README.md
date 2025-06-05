# ClubConnect
Creators: Kya Broderick, Jerry Mukalel, Quin Lane
Campus Club Event Management System

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

ClubConnect is a full-stack web application designed to streamline the management of campus clubs and events. It allows club executives and SUAdmins to create, manage, and approve events and funding requests, and enables students to browse and RSVP to events.

## Features

- User authentication and role-based access (Students, Club Executives, SUAdmins)
- CRUD operations for clubs, events, announcements, and funding forms
- Real-time messaging between students and SUAdmins
- RSVP management for campus events
- Responsive UI built with React

## Technologies

- **Frontend:** React, JavaScript, CSS
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** MySQL (hosted on Railway)
- **Authentication:** JWT
- **State Management:** React Context / Hooks
- **Deployment:** Vercel (frontend), Railway (backend & database)

## Prerequisites

- Node.js (>=14.x)
- npm or yarn
- MySQL database (Railway or local)

## Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/yourusername/clubconnect.git
   cd clubconnect
   ```

2. Install dependencies:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Setup environment variables:

   - In `backend/.env`:
     ```env
     DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<database>"
     JWT_SECRET="your_jwt_secret"
     ```
   - In `frontend/.env`:
     ```env
     REACT_APP_API_URL=http://localhost:5050
     ```

4. Run database migrations and seed (if applicable):

   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

## Usage

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```
3. Open your browser at `http://localhost:3000`.

## Folder Structure

```text
clubconnect/
├── backend/
│   ├── src/
│   ├── prisma/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
└── README.md
```

## Database Schema

Brief overview of key models in Prisma schema:

- **User** - stores user credentials and roles.
- **Club** - information about student clubs.
- **Event** - records of club events.
- **FundingRequest** - form submissions for funding.
- **Announcement** - messages broadcast to members.
- **RSVP** - student responses to event invites.
- **SUMessage** - messages between students and SUAdmins.

## API Endpoints

- `POST /api/users/login` - authenticate user.
- `GET /api/clubs` - list clubs.
- `GET /api/events` - list events.
- `POST /api/events` - create event.
- ...

Refer to the `/api/docs` for full endpoint documentation.

## Contributing

Contributions are welcome! Please open issues and submit pull requests for enhancements or bug fixes. Ensure code follows existing style and include tests for new features.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
