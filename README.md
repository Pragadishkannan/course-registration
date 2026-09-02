# Course Registration Engine

A full-stack course enrollment system where students can browse available courses, enroll when seats exist, or be automatically waitlisted when a course is full. The backend enforces capacity rules, schedule conflict prevention, and duplicate registration checks using PostgreSQL transactions.

---

## Technical Stack

- **Frontend**: React, Vite, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express.js, JavaScript
- **Database**: PostgreSQL (managed separately via pgAdmin / psql)
- **API**: REST API (Fetch API)

---

## Project Structure

```text
course-registration-engine/
│
├── frontend/             # React + Vite + Tailwind CSS app
│   ├── src/
│   │   ├── components/   # Header, CourseCatalog, CourseCard, StudentSchedule, Toast
│   │   ├── services/     # api.js (REST API fetch layer)
│   │   ├── App.jsx       # Main application layout
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Tailwind directives & typography
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/              # Node.js + Express REST API
│   ├── controllers/      # Business logic (courseController, scheduleController, enrollmentController)
│   ├── db/               # pool.js (PostgreSQL pool connection)
│   ├── routes/           # Express routes (courses.js, schedule.js, enrollments.js)
│   ├── server.js         # Entry point for backend server
│   ├── package.json
│   ├── .env              # Environment configuration (ignored in git)
│   └── .env.example      # Sample environment configuration template
│
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

> **Note on Database**: PostgreSQL runs as an external database service on your system and is managed independently using pgAdmin or `psql`. There is intentionally **no project-level `database/` folder**.

---

## PostgreSQL Database Setup

Follow these steps in **pgAdmin 4** or **psql** to set up the database and sample data.

### 1. Create the Database

Run this command in psql or pgAdmin Query Tool:

```sql
CREATE DATABASE course_registration;
```

---

### 2. Create Database Tables

Connect to `course_registration` and run the following SQL commands to create the 3 required tables:

```sql
-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  course_name VARCHAR(150) NOT NULL,
  schedule_time VARCHAR(20) NOT NULL,
  max_capacity INTEGER NOT NULL,
  current_enrolled INTEGER NOT NULL DEFAULT 0
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Enrolled', 'Waitlisted')),
  UNIQUE(student_id, course_id)
);
```

---

### 3. Insert Sample Seed Data

Execute the following SQL commands in pgAdmin to populate initial sample courses and demo students:

```sql
-- Insert Demo Student
INSERT INTO students (name) VALUES
  ('John');

-- Insert Sample Courses
INSERT INTO courses (course_name, schedule_time, max_capacity, current_enrolled) VALUES
  ('Web Development',        'Morning',   30, 24),
  ('Database Management',    'Afternoon', 25, 25),  -- Full course (triggers Waitlist)
  ('Artificial Intelligence','Morning',  20, 18),
  ('Cloud Computing',        'Evening',   15, 11),
  ('Data Structures',        'Morning',    2,  1),
  ('Machine Learning',       'Afternoon', 20, 15),
  ('Cyber Security',         'Evening',   10, 10),  -- Full course (triggers Waitlist)
  ('Operating Systems',      'Afternoon', 18, 12);
```

---

## Backend Setup

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your local PostgreSQL password:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=course_registration
   PORT=5000
   ```
4. Install backend dependencies:
   ```bash
   npm install
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

## Frontend Setup

1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## REST API Endpoints

### 1. GET `/api/courses`
Returns a list of all available courses along with calculated `seats_remaining`.
- **Seats Remaining Calculation**: `max_capacity - current_enrolled` (calculated on query, not stored as a DB column).

### 2. GET `/api/schedule`
Returns the current demo student's schedule (enrolled and waitlisted courses).

### 3. POST `/api/enrollments`
Attempts to register the current student into a course.
- **Request Body**:
  ```json
  {
    "course_id": 1
  }
  ```
- **Response**:
  Returns registration message and enrollment details (`Enrolled` or `Waitlisted`).

---

## Core Enrollment Logic Flow

```text
Student clicks [Enroll] / [Join Waitlist]
                 ↓
      POST /api/enrollments
                 ↓
Backend starts PostgreSQL Transaction (BEGIN)
                 ↓
Lock Course Row (SELECT ... FOR UPDATE)
                 ↓
Verify Course & Student exist
                 ↓
Check Duplicate Enrollment (Is student already enrolled or waitlisted for this course?)
    ↳ If YES → Reject ("You are already enrolled or waitlisted for this course.")
                 ↓
Check Schedule Conflict (Does student have ANY course—Enrolled OR Waitlisted—at the exact same schedule_time?)
    ↳ If YES → Reject ("You already have a course scheduled at Morning.")
                 ↓
Check Seat Capacity (current_enrolled < max_capacity?)
   ├── YES → Create enrollment status = 'Enrolled', Increment current_enrolled = current_enrolled + 1
   └── NO  → Create enrollment status = 'Waitlisted', DO NOT increment current_enrolled
                 ↓
         COMMIT Transaction
```

---

## Testing Scenarios

1. **Normal Enrollment**: Click **Enroll** on *Cloud Computing* (Evening, has available seats).
   - **Result**: Successfully enrolled. App displays success message and updates *My Schedule*.
2. **Full Course Waitlist**: Click **Join Waitlist** on *Database Management* (Afternoon, 25/25 seats occupied).
   - **Result**: Successfully added to waitlist. Status displays **Waitlisted**, and `current_enrolled` does not increase.
3. **Schedule Conflict Check**: If enrolled in a Morning course (e.g. *Web Development*), try enrolling in *Artificial Intelligence* (Morning).
   - **Result**: Rejection with message: `"You already have a course scheduled at Morning."`
4. **Waitlist Schedule Conflict**: If waitlisted for an Afternoon course (e.g. *Database Management*), try enrolling in *Machine Learning* (Afternoon).
   - **Result**: Rejection with message: `"You already have a course scheduled at Afternoon."` (Waitlisted courses also block schedule slots).
5. **Duplicate Enrollment**: Try enrolling in a course you are already enrolled or waitlisted for.
   - **Result**: Rejection with message: `"You are already enrolled or waitlisted for this course."`
