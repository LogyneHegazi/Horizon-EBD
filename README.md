# Study Bridge



**Course:** Electronic Business Development (BINF 503) · Winter 2026
**Instructor:** Dr. Nourhan Hamdi
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team



| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Nour Elgazzar | 16008393 | T5 | gazzar807 |
| Ziad Riad | 16005560 | T5 | ziad2244 |
| Yuanna Boules | 16001627 | T5 |yuanna-boules |
| Mira Mahmoud | 16008795 | T5 | miraafandy |
| Sama Ashraf | 16003695 | T5 | sama2325 |
| Logyne Hegazi | 17005452 | T8 | Logynehegazi |

## 2. The idea


StudyBridge is a peer-to-peer student tutoring platform built for university students who need academic assistance to connect with peers who can provide tutoring services. Students knowledgeable in specific subjects can create tutoring listings, specify their availability and session mode (Online or On-Campus), and offer sessions to classmates. Students seeking academic help can browse tutors by subject, request sessions, manage or reschedule their bookings, and leave ratings and reviews after completing a session.

## 3. Features

### 3.1 The full product

- Student registration and JWT authentication system.
- Tutor profiles with academic background and subject specialties.
- Tutoring listing creation, editing, deactivation, and deletion.
- Subject-based search and filtering across available tutoring listings.
- Time-slot availability viewing and conflict-checked session requests.
- Tutor dashboard to accept, reject, or mark incoming requests as completed.
- Student booking management to reschedule or cancel upcoming sessions.
- Verified post-session star ratings and written reviews (with edit/delete support).
- Real-time in-app messaging between tutors and students.
- Automated notifications for booking status updates and reminders.
- External calendar synchronization for scheduled tutoring sessions.
- Built-in video conferencing for online tutoring sessions.
- Optional online payment integration for paid tutoring sessions.

### 3.2 The use cases we will build

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with full name, email, and password; logs in with email and password | Their home page with their name in the header and access to protected routes | A `User` document with the password hashed via bcrypt |
| 2 | Create and manage tutoring listings | Tutor creates a listing with title, subject, description, mode (`Online`/`OnCampus`), and available time slots; can edit, deactivate, or delete unused listings | Tutor dashboard with their active/inactive listings and live updates in the public catalog | A `TutoringListing` document linked to the tutor's User ID |
| 3 | Request a tutoring session | Student browses listings, filters by subject, selects an available time slot, adds an optional message, and submits a request | Confirmation feedback and the new request listed under "My Sessions" with status `Pending` | A `SessionRequest` document linked to the listing ID, student ID, and slot ID |
| 4 | Accept or reject tutoring requests | Tutor views incoming requests on their dashboard, accepts or rejects `Pending` requests (preventing slot conflicts), and marks `Accepted` sessions as `Completed` | Updated request status badge (`Accepted`, `Rejected`, or `Completed`) reflected for both tutor and student | Updates the `status` field on the target `SessionRequest` document |
| 5 | Reschedule or cancel tutoring sessions | Student opens "My Sessions" and selects a new available slot to reschedule (resetting status to `Pending`) or cancels an upcoming session | Updated schedule time and status (`Pending` or `Cancelled`) without creating duplicate bookings | Updates `slotId`, `scheduledAt`, and `status` on the existing `SessionRequest` document |
| 6 | Submit and manage tutor reviews | After a session is `Completed`, student submits a 1–5 star rating and written comment; author can later edit or delete their review | Review card displayed on the tutor's listing/profile with edit and delete controls for the author | A `Review` document linked to the `SessionRequest` ID, student ID, and tutor ID |

## 4. Who owns what

| Member | Use case |
|---|---|
| Logyne Hegazi | 1. Registration and login |
| Sama Ashraf | 2. Create and manage tutoring listings |
| Yuanna Boules | 3. Request a tutoring session |
| Ziad Riad | 4. Accept or reject tutoring requests |
| Nour Elgazzar | 5. Reschedule or cancel tutoring sessions |
| Mira Mahmoud | 6. Submit and manage tutor reviews |

## 5. Data model

### User

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false } // stored hashed, never as plain text
}, { timestamps: true });
```

### Review

```js
const reviewSchema = new mongoose.Schema({
  sessionRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SessionRequest', required: true, unique: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });
```

### TutoringListing

```js
const tutoringListingSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  mode: { type: String, enum: ['Online', 'OnCampus'], required: true },
  availableSlots: [{
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

### SessionRequest

```js
const sessionRequestSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'TutoringListing', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, required: true },
  scheduledAt: { type: Date, required: true },
  message: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });
```

## 6. Run it locally

> Leave this section as it is until Submission 2 (Thursday 10 December 2026,
> 23:59). Then fill it in: we follow these steps to run your project.

### Back end

```bash
cd backend
npm install
# create backend/.env from backend/.env.example (see the table below)
npm start
```

The API runs on http://localhost:3000.

| Variable in `.env` | What it is |
|---|---|
| `MONGODB_URI` | The connection string of your MongoDB Atlas database |
| `JWT_SECRET` | Any long random text, used to sign login tokens |
| [Any other variable] | [What it is] |

### Front end

```bash
cd frontend
npm install
npm run dev
```

The app runs on [the address `npm run dev` prints, e.g. http://localhost:5173].
