# eBook Creator - Project Documentation

## Table of Contents

---

## 1. Project Overview

### 1.1 Project Introduction
**eBook Creator** is an AI-powered web application that enables users to create, manage, and export professional eBooks. The platform leverages artificial intelligence to automate book outline generation, chapter content creation, and cover design.

### 1.2 Problem Statement
Traditional eBook creation is a time-consuming process that requires:
- Significant writing skills and time investment
- Knowledge of formatting standards for different export formats
- Design expertise for creating professional book covers
- Technical knowledge to export books into multiple formats

This project aims to solve these problems by providing an AI-powered platform that automates the content generation process while giving users full control over their books.

### 1.3 Technology Stack
- **Frontend:** React 19, Vite, Tailwind CSS, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **AI Integration:** Google Gemini AI, Stability AI
- **File Export:** PDFKit (PDF), docx library (Word)

---

## 2. Feasibility Study

### 2.1 Technical Feasibility
- **AI Integration:** Google Gemini and Stability AI APIs are readily available and well-documented
- **Export Libraries:** PDFKit and docx libraries provide robust export capabilities
- **Database:** MongoDB offers flexible schema for storing books with dynamic chapters

### 2.2 Operational Feasibility
- User-friendly interface with step-by-step book creation
- Automated AI content generation reduces user effort
- Real-time preview and editing capabilities

### 2.3 Economic Feasibility
- Open-source technologies minimize licensing costs
- Cloud-based AI services with pay-per-use pricing
- MongoDB Atlas offers free tier for development

---

## 3. Research Methodology

### 3.1 Research Approach
- **Literature Review:** Studied existing eBook creation tools and AI writing assistants
- **Requirement Analysis:** Identified key features needed for an effective eBook creation platform
- **Technology Selection:** Evaluated various tech stacks for optimal performance

### 3.2 Development Methodology
- **Agile Methodology:** Iterative development with regular feedback cycles
- **MERN Stack:** MongoDB, Express.js, React, Node.js for full-stack development
- **API-First Design:** RESTful API architecture for frontend-backend communication

### 3.3 Testing Strategy
- Unit testing for individual components
- Integration testing for API endpoints
- User acceptance testing for complete workflows

---

## 4. Software Requirement Specifications

### 4.1 Functional Requirements

#### 4.1.1 User Authentication
- [ ] User registration with name, email, password
- [ ] User login with JWT token generation
- [ ] Profile management (view and update)
- [ ] Protected routes for authenticated users

#### 4.1.2 Book Management
- [ ] Create new books with title and author
- [ ] Add, edit, and delete chapters
- [ ] Reorder chapters using drag-and-drop
- [ ] Upload and update book cover images
- [ ] Delete books

#### 4.1.3 AI Features
- [ ] Generate book outline based on topic and writing style
- [ ] Generate chapter content using AI
- [ ] Generate book covers using AI image generation

#### 4.1.4 Editor Features
- [ ] Markdown editor for chapter content
- [ ] Chapter title and description editing
- [ ] Book details management (title, subtitle, author)
- [ ] Auto-save functionality

#### 4.1.5 Export Features
- [ ] Export book as PDF document
- [ ] Export book as DOCX document
- [ ] Professional formatting with cover page

### 4.2 Non-Functional Requirements
- **Performance:** Fast page load and response times
- **Security:** JWT authentication and password hashing
- **Usability:** Intuitive user interface
- **Compatibility:** Modern web browsers (Chrome, Firefox, Safari, Edge)

### 4.3 Data Models

#### User Model
```
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- avatar: String (optional)
- isPro: Boolean (default: false)
- timestamps: createdAt, updatedAt
```

#### Book Model
```
- userId: ObjectId (ref: User)
- title: String (required)
- subtitle: String (optional)
- author: String (required)
- coverImage: String (optional)
- chapters: Array of Chapter objects
  - title: String (required)
  - description: String (optional)
  - content: String (optional)
- status: enum ['draft', 'published']
- timestamps: createdAt, updatedAt
```

---

## 5. System Design

### 5.1 Architecture Design

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (React + Vite + Tailwind CSS)                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Landing  │ │ Dashboard│ │ Editor   │ │ Profile  │      │
│  │  Page    │ │  Page    │ │  Page    │ │  Page    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────────┐
│                        BACKEND                               │
│  (Node.js + Express)                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   Auth   │ │   Book   │ │    AI    │ │  Export  │      │
│  │ Routes   │ │ Routes   │ │ Routes   │ │ Routes   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     DATABASE                                │
│                   (MongoDB)                                 │
│  ┌──────────┐ ┌──────────┐                                │
│  │  Users   │ │  Books   │                                │
│  └──────────┘ └──────────┘                                │
└─────────────────────────────────────────────────────────────┘

                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Gemini AI  │ │  Stability   │ │   File       │
│   (Google)   │ │     AI       │ │   Storage    │
└──────────────┘ └──────────────┘ └──────────────┘
```

### 5.2 Module Design

#### Authentication Module
- JWT token generation and validation
- Password hashing with bcrypt
- Protected route middleware

#### Book Management Module
- CRUD operations for books
- Chapter management with array operations
- Cover image upload with Multer

#### AI Integration Module
- Gemini API integration for text generation
- Stability AI integration for image generation
- Prompt engineering for quality output

#### Export Module
- PDF generation with PDFKit
- DOCX generation with docx library
- Markdown parsing and formatting

### 5.3 Database Schema Design
- User collection with unique email index
- Book collection with userId reference
- Chapter subdocuments embedded in book documents

### 5.4 UI/UX Design Principles
- Clean, modern interface with Tailwind CSS
- Responsive design for all screen sizes
- Intuitive multi-step book creation wizard
- Drag-and-drop for chapter reordering

---

## 6. Project Structure

```
EBOOKCREATOR/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── exportController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Book.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── exportRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── ebookcreator_frontend/
    └── ebookCreator_frontend/
        ├── public/
        ├── src/
        │   ├── assets/
        │   ├── components/
        │   │   ├── auth/
        │   │   ├── cards/
        │   │   ├── editor/
        │   │   ├── landing/
        │   │   ├── layout/
        │   │   ├── modals/
        │   │   ├── ui/
        │   │   └── view/
        │   ├── context/
        │   ├── pages/
        │   ├── Utils/
        │   ├── App.jsx
        │   ├── index.css
        │   └── main.jsx
        ├── index.html
        ├── package.json
        └── vite.config.js
```

---

## 7. Implementation Details

### 7.1 Backend Implementation

#### [`backend/server.js`](backend/server.js)
Main entry point for the Express server. Configures:
- CORS middleware
- MongoDB connection
- Static file serving for uploads
- API route mounting

#### [`backend/config/db.js`](backend/config/db.js)
MongoDB connection configuration using Mongoose.

#### [`backend/models/User.js`](backend/models/User.js)
User schema with password hashing middleware and password comparison method.

#### [`backend/models/Book.js`](backend/models/Book.js)
Book schema with embedded chapter subdocuments.

#### [`backend/controllers/authController.js`](backend/controllers/authController.js)
Authentication functionality:
- `registerUser` - Create new user account
- `loginUser` - Authenticate user and generate JWT
- `getProfile` - Retrieve current user profile
- `updateUserProfile` - Update user information

#### [`backend/controllers/bookController.js`](backend/controllers/bookController.js)
Book management operations:
- `createBook` - Create new book
- `getBooks` - Retrieve all books for user
- `getBookById` - Get single book by ID
- `updateBook` - Update book details
- `deleteBook` - Delete a book
- `updateBookCover` - Upload/update book cover image

#### [`backend/controllers/aiController.js`](backend/controllers/aiController.js)
AI-powered features:
- `generateOutline` - Generate book chapter outline using Gemini AI
- `generateChapterContent` - Generate chapter content using Gemini AI
- `generatebookcover` - Generate book cover using Stability AI

#### [`backend/controllers/exportController.js`](backend/controllers/exportController.js)
Export functionality:
- `exportAsPDF` - Export book as PDF document
- `exportAsDocument` - Export book as DOCX document

### 7.2 Frontend Implementation

#### [`ebookcreator_frontend/ebookCreator_frontend/src/App.jsx`](ebookcreator_frontend/ebookCreator_frontend/src/App.jsx)
Main application component with routing configuration.

**Routes:**
- `/` - Landing Page (public)
- `/login` - Login Page (public)
- `/signup` - Signup Page (public)
- `/dashboard` - Dashboard (protected)
- `/editor/:bookId` - Book Editor (protected)
- `/view-book/:bookId` - View Book (protected)
- `/profile` - User Profile (protected)

#### Pages
- [`LandingPage`](ebookcreator_frontend/ebookCreator_frontend/src/pages/LandingPage.jsx) - Public landing page
- [`LoginPage`](ebookcreator_frontend/ebookCreator_frontend/src/pages/LoginPage.jsx) - User login
- [`SignupPage`](ebookcreator_frontend/ebookCreator_frontend/src/pages/SignupPage.jsx) - User registration
- [`DashboardPage`](ebookcreator_frontend/ebookCreator_frontend/src/pages/DashboardPage.jsx) - Book management
- [`EditorPage`](ebookcreator_frontend/ebookCreator_frontend/src/pages/EditorPage.jsx) - Book editing
- [`ViewBookPage`](ebookcreator_frontend/ebookCreator_frontend/src/pages/ViewBookPage.jsx) - Book viewer
- [`ProfilePage`](ebookcreator_frontend/ebookCreator_frontend/src/pages/ProfilePage.jsx) - User profile

---

## 8. API Endpoints Summary

### Authentication API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update profile | Private |

### Book API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/books` | Create new book | Private |
| GET | `/api/books` | Get all books | Private |
| GET | `/api/books/:id` | Get book by ID | Private |
| PUT | `/api/books/:id` | Update book | Private |
| DELETE | `/api/books/:id` | Delete book | Private |
| PUT | `/api/books/cover/:id` | Update cover | Private |

### AI API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/generate-outline` | Generate outline | Private |
| POST | `/api/ai/generate-chapter-content` | Generate content | Private |
| POST | `/api/ai/generate-book-cover` | Generate cover | Private |

### Export API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/export/:id/pdf` | Export as PDF | Private |
| GET | `/api/export/:id/doc` | Export as DOCX | Private |

---

## 9. Key Features

### 9.1 User Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes
- User profile management

### 9.2 Book Management
- Create, read, update, delete books
- Chapter management (add, edit, delete, reorder)
- Cover image upload
- Draft/Published status

### 9.3 AI-Powered Features
- **Outline Generation:** AI generates chapter outlines based on topic and writing style
- **Content Generation:** AI writes chapter content with descriptions
- **Cover Generation:** AI creates book covers using Stability AI

### 9.4 Export Functionality
- **PDF Export:** Professional PDF with cover page, chapters, and formatting
- **DOCX Export:** Word document with styled paragraphs, headings, and lists

### 9.5 Editor Features
- Markdown editor with live preview
- Drag-and-drop chapter reordering
- Auto-save capability
- Book details management

---

## 10. Results and Conclusion

### 10.1 Project Outcomes
The eBook Creator application has been successfully developed with the following achievements:

1. **Complete User System**
   - Secure registration and login functionality
   - JWT-based authentication
   - Protected routes for authorized access

2. **AI-Powered Content Generation**
   - Automated book outline generation
   - AI-written chapter content
   - AI-generated book covers

3. **Full-Featured Editor**
   - Drag-and-drop chapter management
   - Markdown content editing
   - Cover image upload capability

4. **Export Functionality**
   - Professional PDF export with formatting
   - DOCX export for Word compatibility

5. **User-Friendly Interface**
   - Responsive design
   - Intuitive navigation
   - Multi-step book creation wizard

### 10.2 Conclusion
The eBook Creator project demonstrates the effective integration of AI technologies with web development to solve real-world problems. By automating the content creation process, the platform significantly reduces the time and effort required to produce professional eBooks. The implementation showcases modern web development practices including RESTful API design, component-based architecture, and secure authentication.

---

## 11. Limitations

### 11.1 Technical Limitations
- **API Rate Limits:** AI services have usage limits that may restrict heavy usage
- **File Storage:** Local file storage may not scale for large applications
- **Offline Capability:** Requires internet connection for AI features

### 11.2 Feature Limitations
- No collaboration features for multiple authors
- Limited template options for book designs
- No built-in publishing/distribution features
- No analytics for book performance

### 11.3 AI Limitations
- Generated content may require human editing
- AI image generation quality varies
- Language support limited to English

---

## 12. Future Scope

### 12.1 Enhanced AI Features
- Multi-language content generation
- Style transfer for different writing genres
- Improved content editing suggestions

### 12.2 Collaboration Features
- Multi-author book creation
- Real-time collaborative editing
- Version control for books

### 12.3 Publishing Integration
- Direct publishing to Amazon Kindle
- EPUB format export
- ISBN generation

### 12.4 Advanced Features
- Book analytics dashboard
- Reader feedback and reviews
- Pricing and royalty calculations
- Template marketplace

### 12.5 Technical Improvements
- Cloud storage integration (AWS S3, Cloudinary)
- Offline-first Progressive Web App (PWA)
- Mobile application development
- Enhanced security measures

---

## 13. Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
STABILITY_API_KEY=your_stability_api_key
```

---

## 14. Dependencies

### Backend Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `multer` - File uploads
- `@google/genai` - Gemini AI
- `@google/generative-ai` - Gemini AI
- `pdfkit` - PDF generation
- `docx` - Word document generation
- `markdown-it` - Markdown parsing

### Frontend Dependencies
- `react` - UI library
- `react-dom` - React DOM
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - Styling
- `@uiw/react-md-editor` - Markdown editor
- `@dnd-kit/core` - Drag and drop
- `@dnd-kit/sortable` - Sortable lists
- `lucide-react` - Icons
- `react-hot-toast` - Toast notifications

---

*Document generated for eBook Creator Project*
*MCA Final Year Project*
