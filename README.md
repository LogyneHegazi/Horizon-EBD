# Campus Swap



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


Campus Swap is a peer-to-peer campus marketplace built exclusively for university students to buy, sell, and exchange course textbooks, lab equipment, study tools, and electronics. It solves the problem of unsafe off-campus meetups, generic commercial seller spam, and overpriced academic materials by restricting platform access to verified university members and organizing listed items directly by course codes and academic majors.

## 3. Features

### 3.1 The full product


- User registration and JWT authentication system.
- Product listing creation with textbook condition, course code, and image links.
- Buyer purchase offer submission and status tracking.
- Seller offer acceptance/rejection dashboard with automatic product status updates.
- Star rating and written feedback review system for sellers.
- Admin moderation portal for flagging and deleting listings.
- Real-time in-app chat messaging between buyers and sellers.
- Interactive campus map with designated safe pickup location pins.
- AI-powered price recommendation engine based on textbook condition.
- Push notifications for price drop alerts and incoming buy requests.

### 3.2 The use cases we will build


| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with name, email and password; logs in with email and password | Their home page, with their name in the header | A User, with the password hashed |
| 2 | Create product listing | Fills out listing form with title, description, price, condition, course code, and image URL | Success notification and their new item card live in the catalog | A Product document linked to the seller's User ID |
| 3 | Submit purchase offer | Views product page, enters an offered price and an optional note, and submits request | Offer submission modal and status set to "Pending Approval" on buyer dashboard | An Offer document linked to the buyer ID and product ID |
| 4 | Accept or reject purchase offer | Seller views incoming offers on their dashboard and clicks Accept or Reject | Offer badge updates to "Accepted"/"Rejected" and product updates to "Sold" if accepted | Updates the target Offer status field, and updates Product status to "sold" |
| 5 | Submit seller review | Buyer selects a 1–5 star rating and types written feedback for a seller | Confirmation toast and the new review card displayed on the seller's profile | A Review document linked to the buyer ID and seller ID |
| 6 | Delete listing (Admin moderation) | Admin accesses moderation panel and clicks Delete Listing on a reported item | Listing card removed completely from both admin panel and public catalog | Deletes the target Product document from MongoDB (findByIdAndDelete) |

## 4. Who owns what


| Member | Use case |
|---|---|
| Logyne Hegazi | 1. Registration and login |
| Sama Ashraf | 2. Create product listing |
| Yuanna Boules | 3. Submit purchase offer |
| Ziad Riad | 4. Accept or reject purchase offer |
| Mira Mahmoud | 5. Submit seller review |
| Nour Elgazzar | 6. Delete listing (Admin moderation) |

## 5. Data model


### User

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  major: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });
```

### Product

```js
const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { type: String, enum: ['New', 'Like New', 'Used'], required: true },
  category: { type: String, required: true },
  courseCode: { type: String },
  imageUrl: { type: String },
  status: { type: String, enum: ['available', 'sold'], default: 'available' }
}, { timestamps: true });
```

### Offer

```js
const offerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredPrice: { type: Number, required: true },
  note: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });
```

### Review

```js
const reviewSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
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
